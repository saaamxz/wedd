using Microsoft.EntityFrameworkCore;
using Webwedd.Models;

namespace Webwedd.Data
{
    public class WeddingDbContext : DbContext
    {
        public WeddingDbContext(DbContextOptions<WeddingDbContext> options)
            : base(options)
        {
        }

        public DbSet<RSVP> RSVPs { get; set; }
    }
}