using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AttendancyApp.Context;
using AttendancyApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.SqlServer.Server;

namespace AttendancyApp.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public EventController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] EventDTO eventModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var eventTime = DateTime.ParseExact(eventModel.EventTime, "HH:mm", CultureInfo.InvariantCulture);
            var newEvent = new EventModel
            {
                EventName = eventModel.EventName,
                EventDate = eventModel.EventDate,
                EventTime = eventTime.TimeOfDay,
                EventDescription = eventModel.EventDescription,
                EventLocation = eventModel.EventLocation
            };

            _dbContext.Events.Add(newEvent);
            await _dbContext.SaveChangesAsync();

            return Ok(newEvent.Id);
        }


        [HttpGet]
        public async Task<IActionResult> getEvent()
        {

            return Ok(3);
        }
    }
    public class EventDTO
    {
        public string EventName { get; set; }
        public DateTime EventDate { get; set; }
        public string EventTime { get; set; }
        public string EventDescription { get; set; }
        public string EventLocation { get; set; }
    }
}

