
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Webwedd.Data;

namespace Webwedd.Controllers
{
    public class AdminController : Controller
    {
        private readonly WeddingDbContext _context;
        private readonly IConfiguration _configuration;

        public AdminController(
            WeddingDbContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }


        // =====================================================
        // LOGIN PAGE
        // =====================================================

        [HttpGet]
        public IActionResult Login()
        {
            if (User.Identity?.IsAuthenticated == true)
            {
                return RedirectToAction(nameof(Index));
            }

            return View();
        }


        // =====================================================
        // LOGIN
        // =====================================================

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(
            string username,
            string password)
        {
            var adminUsername =
                _configuration["AdminCredentials:Username"];

            var adminPassword =
                _configuration["AdminCredentials:Password"];


            if (username == adminUsername &&
                password == adminPassword)
            {
                var claims = new List<Claim>
                {
                    new Claim(
                        ClaimTypes.Name,
                        username
                    ),

                    new Claim(
                        ClaimTypes.Role,
                        "Admin"
                    )
                };


                var identity =
                    new ClaimsIdentity(
                        claims,
                        CookieAuthenticationDefaults
                            .AuthenticationScheme
                    );


                var principal =
                    new ClaimsPrincipal(identity);


                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults
                        .AuthenticationScheme,
                    principal
                );


                return RedirectToAction(nameof(Index));
            }


            TempData["LoginError"] =
                "Invalid username or password.";

            return View();
        }


        // =====================================================
        // ADMIN DASHBOARD
        // =====================================================

        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Index()
        {
            var rsvps = await _context.RSVPs
                .OrderByDescending(r => r.SubmittedAt)
                .ToListAsync();

            return View(rsvps);
        }


        // =====================================================
        // DELETE RSVP
        // =====================================================

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var rsvp =
                await _context.RSVPs.FindAsync(id);


            if (rsvp != null)
            {
                _context.RSVPs.Remove(rsvp);

                await _context.SaveChangesAsync();
            }


            return RedirectToAction(nameof(Index));
        }


        // =====================================================
        // LOGOUT
        // =====================================================

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(
                CookieAuthenticationDefaults
                    .AuthenticationScheme
            );

            return RedirectToAction(nameof(Login));
        }
    }
}
