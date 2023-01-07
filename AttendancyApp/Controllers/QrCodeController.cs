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
            StudentCard Avichai = new StudentCard 
            {
                name = "Avichai Aziz",
                profilePictureUrl = @"https://scontent.ftlv1-1.fna.fbcdn.net/v/t39.30808-6/240000839_4964717366877980_2719254003850920022_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=NDHly7LMDtEAX-MKfLL&tn=6nTCq-vOe_Rr6OQ5&_nc_ht=scontent.ftlv1-1.fna&oh=00_AfB4Ueo1Tqp4ACQdMdDMjCSzWNo8KTP051xdpMj-0iUPjA&oe=63BD4024"
            };



            /* data werll be a student id, when getting it were gonna import this student by id
             * and add the student to attendted list of students,
             * we will impmlemt another Get request for attendtend students.
             * need a db!
             */
            // we need to get the student profile picture and name from the database of the moodle and then
            Task.Run(async () =>
            {
                await hubContext.Clients.All.SendAsync("studentReceived", Avichai);
            });


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

    public class StudentCard
    {
        public string? name { get; set; }
        public string? profilePictureUrl { get; set; }

        private bool fadedIn = true;
    }
}
