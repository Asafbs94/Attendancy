using System.ComponentModel.DataAnnotations;

namespace AttendancyApp.Models
{
    public class EventModel
    {
        [Key]
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public string EventName { get; set; }
        public DateTime EventDate { get; set; }
        public TimeSpan EventTime { get; set; }
        public string? EventDescription { get; set; }
        public string? EventLocation { get; set; }

        public virtual ICollection<UserModel>? Participants { get; set; }
        public virtual UserModel? Creator { get; set; }
    }

}
