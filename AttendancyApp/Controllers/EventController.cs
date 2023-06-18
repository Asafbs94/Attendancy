using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AttendancyApp.Context;
using AttendancyApp.HubConfig;
using AttendancyApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AttendancyApp.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class EventController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IHubContext<myHub> hubContext;


        public EventController(AppDbContext dbContext, IHubContext<myHub> hubContext)
        {
            this.hubContext = hubContext;
            _dbContext = dbContext;
        }

        [HttpGet("{UserName}")]
        public IActionResult GetEvent(string UserName)
        {
            var events = _dbContext.Events.Include("Creator").Where(u => u.Creator.UserName.ToLower() == UserName.ToLower()).ToList();
            return Ok(events);
        }
        [HttpPost("AddParticipant")]
        public IActionResult AddParticipant(ParticipantDTO PDTO)
        {
            try
            {
                var events = _dbContext.Events.Include("Participants").Where(e => e.Guid.ToString().ToLower() == PDTO.EventGuid.ToLower()).FirstOrDefault();
                var newP = new ParticipantModel
                {
                    Email = PDTO.participant.Email,
                    ParticipantId = PDTO.participant.ParticipantId,
                    IsArrived = false
                };
                events.Participants.Add(newP);
                _dbContext.SaveChanges();
                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
         
        }

        [HttpGet]
        public IActionResult Get()
        {
            var eventModel = _dbContext.Events.ToList();

            if (eventModel == null)
            {
                return NotFound();
            }

            return Ok(eventModel);
        }
        [HttpGet("GetParticipants/{guid}")]
        public async Task<IActionResult> GetParticipants(string guid)
        {
            var P = _dbContext.Events.Include("Participants").Where(e => e.Guid.ToString() == guid).FirstOrDefault()?.Participants;
            var e = _dbContext.Events.Include("Participants").Where(e => e.Guid.ToString() == guid).FirstOrDefault();
            var Participants = P.Where(x => x.IsArrived == true).ToList();

            if (Participants == null)
            {
                return NotFound();
            }
            List<Attendand> Alist = new List<Attendand>();
                foreach(ParticipantModel p in Participants) {
                Alist.Add(new Attendand
                {
                    name = p.Email,
                    profilePictureUrl = e.EventName ,
                    fadedIn = true
                });
            
            }

            foreach(Attendand attendand in Alist)
            {
                await hubContext.Clients.All.SendAsync("studentReceived", attendand);
                await Task.Delay(TimeSpan.FromSeconds(1.5));
            }
            var Parti = _dbContext.Events.Include("Participants").Where(e => e.Guid.ToString() == guid).FirstOrDefault().Participants.ToList();

            return Ok(Parti);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] EventDto eventModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var eventTime = DateTime.ParseExact(eventModel.EventTime, "HH:mm", CultureInfo.InvariantCulture);
            var Creator = _dbContext.Users.Where(u => u.UserName.ToLower() == eventModel.Creator).FirstOrDefault();
            var newEvent = new EventModel
            {
                EventName = eventModel.EventName,
                Guid = Guid.NewGuid(),
                EventDate = DateTime.Parse(eventModel.EventDate),
                EventTime = eventTime.TimeOfDay,
                EventDescription = eventModel.EventDescription,
                EventLocation = eventModel.EventLocation,
                Creator = Creator,
            };

            _dbContext.Events.Add(newEvent);
            await _dbContext.SaveChangesAsync();

            return Ok(newEvent);
        }

        [HttpPut("{eventName}")]
        public async Task<IActionResult> UpdateEvent(string eventName, [FromBody] EventDto eventModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingEvent = await _dbContext.Events.FirstOrDefaultAsync(e => e.EventName.Equals(eventName, StringComparison.OrdinalIgnoreCase));

            if (existingEvent == null)
            {
                return NotFound();
            }

            var eventTime = DateTime.ParseExact(eventModel.EventTime, "HH:mm", CultureInfo.InvariantCulture);

            existingEvent.EventName = eventModel.EventName;
            existingEvent.EventDate = DateTime.Parse(eventModel.EventDate);
            existingEvent.EventTime = eventTime.TimeOfDay;
            existingEvent.EventDescription = eventModel.EventDescription;
            existingEvent.EventLocation = eventModel.EventLocation;

            await _dbContext.SaveChangesAsync();

            return Ok(existingEvent);
        }

        [HttpDelete("{eventName}")]
        public async Task<IActionResult> DeleteEvent(string eventName)
        {
            var eventModel = await _dbContext.Events.FirstOrDefaultAsync(e => e.EventName.Equals(eventName, StringComparison.OrdinalIgnoreCase));

            if (eventModel == null)
            {
                return NotFound();
            }

            _dbContext.Events.Remove(eventModel);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }
    }

    public class EventDto
    {
        public string EventName { get; set; }
        public string EventDate { get; set; }

        public string Creator { get; set; }

        public string EventTime { get; set; }
        public string EventDescription { get; set; }
        public string EventLocation { get; set; }
    }
    public class Attendand
    {
        public string? name { get; set; }

        public string? profilePictureUrl { get; set; }

        public bool fadedIn = true;
    }
    public class ParticipantDTO
    {
        public ParticipantModel participant { get; set; }
        public string EventGuid { get; set; }
    }
}
