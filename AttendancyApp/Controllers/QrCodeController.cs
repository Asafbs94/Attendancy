using AttendancyApp.Context;
using AttendancyApp.HubConfig;
using AttendancyApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
namespace AttendancyApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class QrCodeController : ControllerBase
    {
        private readonly IHubContext<myHub> hubContext;
        private readonly AppDbContext _authContext;


        public QrCodeController(AppDbContext appDbContext, IHubContext<myHub> hubContext)
        {
            this.hubContext = hubContext;
            _authContext = appDbContext;
        }

        [HttpPost]
        public IActionResult Post([FromBody] LocationDataDto location)
        {
            using (_authContext)
            {
                var newParticipant = new ParticipantModel
                {
                    Email = !string.IsNullOrEmpty(location.Email) ? location.Email : string.Empty,
                    ParticipantId = location.Id != 0 ? location.Id : 0,
                };
                try
                {
                    var currentEvent = _authContext.Events
                        .Include("Participants")
                        .Include("Creator")
                        .Where(e => e.Guid.ToString().ToLower() == location.guid.ToLower()).FirstOrDefault();

                    currentEvent.Participants.Add(newParticipant);

                    _authContext.SaveChanges();

                    hubContext.Clients.All.SendAsync("studentReceived", newParticipant.Email.IsNullOrEmpty() ? newParticipant.Id : newParticipant.Email);

                    return Ok(200);
                }
                catch (Exception)
                {
                    throw;
                }
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
}
