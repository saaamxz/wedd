using System.ComponentModel.DataAnnotations;

namespace Webwedd.Models
{
    public class RSVP
    {
        public int Id { get; set; }

        [Required]
        public string GuestName { get; set; } = string.Empty;

        [Required]
        public int GuestCount { get; set; }

        [Required]
        public string Attendance { get; set; } = string.Empty;

        public string? GuestMessage { get; set; }

        public DateTime SubmittedAt { get; set; } = DateTime.Now;
    }
}