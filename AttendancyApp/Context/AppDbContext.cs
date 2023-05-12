using AttendancyApp.Models;
using Microsoft.EntityFrameworkCore;

namespace AttendancyApp.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
             
        }

        public DbSet<UserModel> Users { get; set; }
        public DbSet<EventModel> Events { get; set; }

        /// <summary>
        /// Send the entity to the the "users" table in the DataBase.
        /// </summary>
        /// <param name="modelBuilder"></param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserModel>().ToTable("users");
            modelBuilder.Entity<EventModel>().ToTable("Events");
        }
    }
}
