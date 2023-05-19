using System.ComponentModel.DataAnnotations;

namespace AttendancyApp.Models
{
    public class ParticipantModel
    {
        [Key]
        public int Id { get; set; }
        public string? Email { get; set; }
        public int? ParticipantId { get; set; }

        public bool? IsArrived { get; set; }
    }
}
