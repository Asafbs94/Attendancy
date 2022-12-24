using Microsoft.AspNetCore.Mvc;

namespace AttendancyApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class QrCodeController : Controller
    {
        [HttpPost]
        public IActionResult Post(string data)
        {
            // Do something with the QR code data here...

            return Ok();
        }
    }
}
