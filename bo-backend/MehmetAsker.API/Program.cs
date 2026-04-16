using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using MehmetAsker.Application.Interfaces;
using MehmetAsker.Application.Services;
using MehmetAsker.API.Services;
using MehmetAsker.DataAccess.Context;
using MehmetAsker.DataAccess.Repositories;
using MehmetAsker.API.Middleware;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// SiteContext — scoped (per-request)
builder.Services.AddScoped<ISiteContext, SiteContext>();

// JWT Service
builder.Services.AddScoped<IJwtService, JwtService>();

// PostgreSQL + EF Core
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Unit of Work
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"]
    ?? throw new InvalidOperationException("JWT Secret is not configured.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("BOPanel", policy =>
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
            builder.Configuration["AllowedOrigins:BOPanel"] ?? "http://localhost:3000",
            builder.Configuration["AllowedOrigins:ReactSite"] ?? "https://mehmetasker.com"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.Title = "MehmetAsker BO API";
        options.AddPreferredSecuritySchemes("Bearer");
    });
}

app.UseCors("BOPanel");
app.UseAuthentication();
app.UseAuthorization();

// X-Site-ID middleware — auth'dan sonra, controller'dan önce
app.UseSiteTenant();

app.MapControllers();

app.Run();