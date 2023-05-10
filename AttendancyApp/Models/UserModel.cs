using System.ComponentModel.DataAnnotations;

namespace AttendancyApp.Models
{
    public class UserModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FirstName { get; set; }
        
        [Required]
        public string LastName { get; set; }
        
        [Required]
        public string Email { get; set; }
        
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }
        public string Token { get; set; }

        [Required]
        public string Rule { get; set; }

    }
}
