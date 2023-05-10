using AttendancyApp.Context;
using AttendancyApp.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AttendancyApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _authContext;

        public UserController(AppDbContext appDbContext)
        {
            _authContext = appDbContext;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> AuthenticateAsync([FromBody] UserModel userObj)
        {
            if (userObj == null)
                return BadRequest();

            var user = await _authContext
                            .Users
                            .FirstOrDefaultAsync(u => u.UserName == userObj.UserName && u.Password == userObj.Password)
                            .ConfigureAwait(false);

            if (user == null)
                return NotFound(new { Message = "User not found!" });

            return Ok(new { Message = "Login Success!" });
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUserAsync([FromBody] UserModel userObj)
        {
            if (userObj == null)
                return BadRequest();

            await _authContext.Users.AddAsync(userObj).ConfigureAwait(false);
            await _authContext.SaveChangesAsync().ConfigureAwait(false);


            return Ok(new { Message = "User Registered!" });
        }


    }
}
