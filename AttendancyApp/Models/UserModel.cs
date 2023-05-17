using System.ComponentModel.DataAnnotations;

namespace AttendancyApp.Models
{
    public class UserModel
    {
        [Key]
        public int Id { get; set; }

        public string? FirstName { get; set; }
        
        public string? LastName { get; set; }
        
        public string? Email { get; set; }
        
        public string? UserName { get; set; }

        public string? Password { get; set; }
        public string? Token { get; set; }

        public string? Role { get; set; }

        public string? ResetPasswordToken{ get; set; }
        public DateTime ResetPasswordExpiry { get; set; }


    }
}
