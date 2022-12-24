using Microsoft.AspNetCore.Mvc;

namespace AttendancyApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class QrCodeController : ControllerBase
    {
        /*
         * Were waiting to see how student scheme looks from the tel hai server
         * in order to apply this.
         */
        [HttpPost]
        public IActionResult Post([FromBody] Location location)
        {
            // 33.23688382774173, 35.5782518970342 - telhai lat and lng we need to make delta ~= 1
            double lat = location.lat;
            double lng = location.lng;
            
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

    public class Location{
        public double lat { get; set; }
        public double lng { get; set; }

    }
}
