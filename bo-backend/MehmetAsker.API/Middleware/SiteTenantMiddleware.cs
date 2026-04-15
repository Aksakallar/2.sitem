using MehmetAsker.Application.Interfaces;
using MehmetAsker.DataAccess.Context;
using Microsoft.EntityFrameworkCore;

namespace MehmetAsker.API.Middleware;

public class SiteTenantMiddleware
{
    private readonly RequestDelegate _next;

    // Bootstrap ve auth rotaları SiteId gerektirmez
    private static readonly string[] BypassPaths =
    [
        "/api/admin/bootstrap",
        "/api/auth/login",
        "/api/auth/refresh",
        "/api/auth/logout",
        "/api/auth/change-password",
        "/api/sites",
        "/scalar",
        "/openapi",
        "/_health"
    ];

    public SiteTenantMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ISiteContext siteContext, AppDbContext db)
    {
        var path = context.Request.Path.Value ?? "";

        // Bypass rotaları doğrudan geç
        if (BypassPaths.Any(p => path.StartsWith(p, StringComparison.OrdinalIgnoreCase)))
        {
            await _next(context);
            return;
        }

        // X-Site-ID header oku
        if (!context.Request.Headers.TryGetValue("X-Site-ID", out var siteIdHeader)
            || !Guid.TryParse(siteIdHeader, out var siteId))
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsJsonAsync(new
            {
                error = "X-Site-ID header gerekli ve geçerli bir GUID olmalıdır."
            });
            return;
        }

        // Veritabanında doğrula
        var site = await db.Sites
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == siteId && s.IsActive);

        if (site is null)
        {
            context.Response.StatusCode = StatusCodes.Status404NotFound;
            await context.Response.WriteAsJsonAsync(new
            {
                error = "Site bulunamadı veya pasif durumda."
            });
            return;
        }

        // Scoped context'e yaz
        siteContext.SiteId = siteId;

        await _next(context);
    }
}

public static class SiteTenantMiddlewareExtensions
{
    public static IApplicationBuilder UseSiteTenant(this IApplicationBuilder app)
        => app.UseMiddleware<SiteTenantMiddleware>();
}