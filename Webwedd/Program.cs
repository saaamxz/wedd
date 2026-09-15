
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Webwedd.Data;

var builder = WebApplication.CreateBuilder(args);

// MVC
builder.Services.AddControllersWithViews();

// Entity Framework Core + SQL Server
builder.Services.AddDbContext<WeddingDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("WeddingConnection")
    ));

// Authentication
builder.Services.AddAuthentication(
    CookieAuthenticationDefaults.AuthenticationScheme
)
.AddCookie(options =>
{
    options.LoginPath = "/Admin/Login";
    options.AccessDeniedPath = "/Admin/Login";
    options.ExpireTimeSpan = TimeSpan.FromHours(8);
    options.SlidingExpiration = true;
});

var app = builder.Build();


// Error handling
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}


// HTTPS
app.UseHttpsRedirection();


// Static files
app.UseStaticFiles();


// Routing
app.UseRouting();


// Authentication
app.UseAuthentication();


// Authorization
app.UseAuthorization();


// Default route
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}"
);
app.Run();
