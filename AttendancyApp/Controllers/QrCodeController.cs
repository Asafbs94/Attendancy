using AttendancyApp.HubConfig;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace AttendancyApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class QrCodeController : ControllerBase
    {
        private readonly IHubContext<myHub> hubContext;

        public QrCodeController(IHubContext<myHub> hubContext)
        {
            this.hubContext = hubContext;
        }

        /*
* Were waiting to see how student scheme looks from the tel hai server
* in order to apply this.
*/
        [HttpPost]
        public IActionResult Post([FromBody] LocationAlert location)
        {
            // 33.23688382774173, 35.5782518970342 - telhai lat and lng we need to make delta ~= 1
            double lat = location.lat;
            double lng = location.lng;
            string? studentID = location.StudentID;
            Task.Run(async () =>
            {
                await hubContext.Clients.All.SendAsync("NotifyArrival", studentID);
            });
            /* data werll be a student id, when getting it were gonna import this student by id
             * and add the student to attendted list of students,
             * we will impmlemt another Get request for attendtend students.
             */
            return Ok();
        }
        [HttpGet]
        public IActionResult GetAllAttendtedStudents() {
            /* will return a list of attendted students
             */
            return Ok();

        }
    }

    public class LocationAlert
    {
        public string? StudentID { get; set; }
        public double lat { get; set; }
        public double lng { get; set; }

    }
}
