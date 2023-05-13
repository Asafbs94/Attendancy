using AttendancyApp.Context;
using AttendancyApp.HubConfig;
using AttendancyApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;

namespace AttendancyApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class QrCodeController : ControllerBase
    {
        private readonly IHubContext<myHub> hubContext;
        private readonly AppDbContext _authContext;
   

        public QrCodeController(AppDbContext appDbContext,IHubContext<myHub> hubContext)
        {
            this.hubContext = hubContext;
            _authContext = appDbContext;
        }

        /*
* Were waiting to see how student scheme looks from the tel hai server
* in order to apply this.
*/
        public IActionResult Post([FromBody] LocationDataDto location)
        {
            var currentEvent = _authContext.Events.FirstOrDefault(e => string.Equals(e.Guid.ToString(), location.guid, StringComparison.OrdinalIgnoreCase));
            if (currentEvent == null)
            {
                return BadRequest();
            }

            var newParticipant = new ParticipantModel
            {
                Email = !string.IsNullOrEmpty(location.Email) ? location.Email : string.Empty,
                Id = location.Id ?? 0
            };

            currentEvent.Participants.Add(newParticipant);

            _authContext.SaveChanges();

            hubContext.Clients.All.SendAsync("studentReceived", newParticipant.Email.IsNullOrEmpty() ? newParticipant.Id : newParticipant.Email);

            return Ok();
        }


    }

    public class LocationDataDto
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
        public int? Id { get; set; }
        public string? Email { get; set; }
        public string? guid { get; set; }
    }

}
