using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using Webwedd.Data;
using Webwedd.Models;

namespace Webwedd.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly WeddingDbContext _context;

        public HomeController(
            ILogger<HomeController> logger,
            WeddingDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> SubmitRSVP(RSVP model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Please fill in all required fields."
                });
            }

            try
            {
                model.SubmittedAt = DateTime.Now;

                _context.RSVPs.Add(model);

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = model.Attendance == "Yes"
                        ? $"Thank you, {model.GuestName}. We look forward to celebrating with you!"
                        : $"Thank you, {model.GuestName}. We are sorry you won't be able to join us."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while saving RSVP.");

                return StatusCode(500, new
                {
                    success = false,
                    message = "Something went wrong. Please try again."
                });
            }
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(
            Duration = 0,
            Location = ResponseCacheLocation.None,
            NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel
            {
                RequestId = Activity.Current?.Id
                    ?? HttpContext.TraceIdentifier
            });
        }
    }
}
