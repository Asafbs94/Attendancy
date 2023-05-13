using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AttendancyApp.Context;
using AttendancyApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

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

        [HttpGet("{eventName}")]
        public IActionResult GetEvent(string eventName)
        {
            var eventModel = _dbContext.Events.FirstOrDefault(e => e.EventName.Equals(eventName, StringComparison.OrdinalIgnoreCase));

            if (eventModel == null)
            {
                return NotFound();
            }

            return Ok(eventModel);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] EventDto eventModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var eventTime = DateTime.ParseExact(eventModel.EventTime, "HH:mm", CultureInfo.InvariantCulture);
            var newEvent = new EventModel
            {
                EventName = eventModel.EventName,
                Guid = Guid.NewGuid(),
                EventDate = DateTime.Parse(eventModel.EventDate),
                EventTime = eventTime.TimeOfDay,
                EventDescription = eventModel.EventDescription,
                EventLocation = eventModel.EventLocation
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
        public string EventTime { get; set; }
        public string EventDescription { get; set; }
        public string EventLocation { get; set; }
    }
}
