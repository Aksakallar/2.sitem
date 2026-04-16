using Microsoft.EntityFrameworkCore;
using MehmetAsker.Application.Interfaces;
using MehmetAsker.Domain.Entities;

namespace MehmetAsker.DataAccess.Context;

public class AppDbContext : DbContext
{
    private readonly Guid _siteId;

    public AppDbContext(DbContextOptions<AppDbContext> options, ISiteContext siteContext)
        : base(options)
    {
        _siteId = siteContext.SiteId;
    }

    public DbSet<Site> Sites => Set<Site>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<AboutInfo> AboutInfos => Set<AboutInfo>();
    public DbSet<Skill> Skills => Set<Skill>();
    public DbSet<SocialLink> SocialLinks => Set<SocialLink>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<Subscriber> Subscribers => Set<Subscriber>();
    public DbSet<Track> Tracks => Set<Track>();
    public DbSet<Comment> Comments => Set<Comment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Global query filter: SiteID izolasyonu — sadece çözümlenmişse filtrele
        if (_siteId != Guid.Empty)
        {
            modelBuilder.Entity<AdminUser>()
                .HasQueryFilter(x => x.SiteId == _siteId);
            modelBuilder.Entity<Category>()
                .HasQueryFilter(x => x.SiteId == _siteId);
            modelBuilder.Entity<Post>()
                .HasQueryFilter(x => x.SiteId == _siteId);
            modelBuilder.Entity<Project>()
                .HasQueryFilter(x => x.SiteId == _siteId);
            modelBuilder.Entity<AboutInfo>()
                .HasQueryFilter(x => x.SiteId == _siteId);
            modelBuilder.Entity<Skill>()
                .HasQueryFilter(x => x.SiteId == _siteId);
            modelBuilder.Entity<SocialLink>()
                .HasQueryFilter(x => x.SiteId == _siteId);
        }

        // Tüm foreign key'ler Restrict (cascade silme yok)
        foreach (var relationship in modelBuilder.Model.GetEntityTypes()
            .SelectMany(e => e.GetForeignKeys()))
        {
            relationship.DeleteBehavior = DeleteBehavior.Restrict;
        }

        // AdminUser → Site
        modelBuilder.Entity<AdminUser>()
            .HasOne(a => a.Site)
            .WithMany(s => s.AdminUsers)
            .HasForeignKey(a => a.SiteId);

        // RefreshToken → AdminUser
        modelBuilder.Entity<RefreshToken>()
            .HasOne(r => r.AdminUser)
            .WithMany(a => a.RefreshTokens)
            .HasForeignKey(r => r.AdminUserId);

        // Email + SiteId unique
        modelBuilder.Entity<AdminUser>()
            .HasIndex(a => new { a.Email, a.SiteId })
            .IsUnique();

        // Domain unique
        modelBuilder.Entity<Site>()
            .HasIndex(s => s.Domain)
            .IsUnique();

        // Category → Site
        modelBuilder.Entity<Category>()
            .HasOne(c => c.Site)
            .WithMany()
            .HasForeignKey(c => c.SiteId);

        // Category Slug + SiteId unique
        modelBuilder.Entity<Category>()
            .HasIndex(c => new { c.Slug, c.SiteId })
            .IsUnique();

        // Post → Site
        modelBuilder.Entity<Post>()
            .HasOne(p => p.Site)
            .WithMany()
            .HasForeignKey(p => p.SiteId);

        // Post → Category (nullable)
        modelBuilder.Entity<Post>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Posts)
            .HasForeignKey(p => p.CategoryId);

        // Post Slug + SiteId unique
        modelBuilder.Entity<Post>()
            .HasIndex(p => new { p.Slug, p.SiteId })
            .IsUnique();

        // Project → Site
        modelBuilder.Entity<Project>()
            .HasOne(p => p.Site)
            .WithMany()
            .HasForeignKey(p => p.SiteId);

        // Project Slug + SiteId unique
        modelBuilder.Entity<Project>()
            .HasIndex(p => new { p.Slug, p.SiteId })
            .IsUnique();

        // AboutInfo → Site
        modelBuilder.Entity<AboutInfo>()
            .HasOne(a => a.Site).WithMany().HasForeignKey(a => a.SiteId);

        // Skill → Site
        modelBuilder.Entity<Skill>()
            .HasOne(s => s.Site).WithMany().HasForeignKey(s => s.SiteId);

        // SocialLink → Site
        modelBuilder.Entity<SocialLink>()
            .HasOne(s => s.Site).WithMany().HasForeignKey(s => s.SiteId);

        // Service → Site
        modelBuilder.Entity<Service>()
            .HasOne(s => s.Site).WithMany().HasForeignKey(s => s.SiteId);
        modelBuilder.Entity<Service>()
            .HasQueryFilter(x => x.SiteId == _siteId || _siteId == Guid.Empty);
        modelBuilder.Entity<Service>()
            .Property(s => s.PackagePriceEur).HasPrecision(10, 2);

        // Appointment → Site
        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Site).WithMany().HasForeignKey(a => a.SiteId);
        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Service).WithMany(s => s.Appointments).HasForeignKey(a => a.ServiceId);
        modelBuilder.Entity<Appointment>()
            .HasQueryFilter(x => x.SiteId == _siteId || _siteId == Guid.Empty);

        // ContactMessage → Site
        modelBuilder.Entity<ContactMessage>()
            .HasOne(m => m.Site).WithMany().HasForeignKey(m => m.SiteId);
        modelBuilder.Entity<ContactMessage>()
            .HasQueryFilter(x => x.SiteId == _siteId || _siteId == Guid.Empty);

        // Subscriber → Site (email unique per site)
        modelBuilder.Entity<Subscriber>()
            .HasOne(s => s.Site).WithMany().HasForeignKey(s => s.SiteId);
        modelBuilder.Entity<Subscriber>()
            .HasQueryFilter(x => x.SiteId == _siteId || _siteId == Guid.Empty);
        modelBuilder.Entity<Subscriber>()
            .HasIndex(s => new { s.Email, s.SiteId }).IsUnique();

        // Track → Site
        modelBuilder.Entity<Track>()
            .HasOne(t => t.Site).WithMany().HasForeignKey(t => t.SiteId);
        modelBuilder.Entity<Track>()
            .HasQueryFilter(x => x.SiteId == _siteId || _siteId == Guid.Empty);

        // Comment → Site + Post
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Site).WithMany().HasForeignKey(c => c.SiteId);
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Post).WithMany().HasForeignKey(c => c.PostId);
        modelBuilder.Entity<Comment>()
            .HasQueryFilter(x => x.SiteId == _siteId || _siteId == Guid.Empty);
    }
}