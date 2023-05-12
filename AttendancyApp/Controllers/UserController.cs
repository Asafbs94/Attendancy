using AttendancyApp.Context;
using AttendancyApp.Helpers;
using AttendancyApp.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net.Mail;
using System.Text;
using System.Text.RegularExpressions;

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
            var userName = userObj.UserName;
            var email = userObj.Email;
            var password = userObj.Password;

            if (userObj == null || string.IsNullOrEmpty(userName) 
                || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
                return BadRequest();

            // Check email format and existens
            var emailError = CheckEmailFormat(email);
            if (!string.IsNullOrEmpty(emailError))
                return BadRequest(new { Message = emailError });
            if (await CheckEmailExistAsync(email).ConfigureAwait(false))
                return BadRequest(new { Message = "Email already exists!" });

            // Check username
            if (await CheckUserNameExistAsync(userName).ConfigureAwait(false))
                return BadRequest(new { Message  = "Username already exists, try another name"});

            // Check password strength
            var passError = CheckPasswordStrength(password);
            if (!string.IsNullOrEmpty(passError))
                return BadRequest(new { Message = passError });

            userObj.Password = PasswordHasher.HashPassword(password);
            userObj.Rule = "User";
            userObj.Token = Guid.NewGuid().ToString();

            await _authContext.Users.AddAsync(userObj).ConfigureAwait(false);
            await _authContext.SaveChangesAsync().ConfigureAwait(false);


            return Ok(new { Message = "User Registered!" });
        }

        private async Task<bool> CheckUserNameExistAsync(string username)
        {
            return await _authContext.Users.AnyAsync(u => u.UserName == username).ConfigureAwait(false);
        }

        private string CheckEmailFormat(string email)
        {
            try
            {
                var mailAddress = new MailAddress(email);
            }
            catch (FormatException)
            {
                return "Email address is not in a valid format.";
            }
            return "";
        }

        private async Task<bool> CheckEmailExistAsync(string email)
        {
            return await _authContext.Users.AnyAsync(u => u.Email == email).ConfigureAwait(false);
        }

        private string CheckPasswordStrength(string password)
        {
            var sb = new StringBuilder();
            if (password.Length < 8)
                sb.Append("Minimum password length should be 8" + Environment.NewLine);
            if(!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password, "[A-Z]")
                && Regex.IsMatch(password, "[0-9]")))
                sb.Append("Password should be Alphanumeric" + Environment.NewLine);
            if (!Regex.IsMatch(password, "[<,>,!,@,#,$,%,^,&,*,(,),_,+,\\-,=,\\[,\\],{,},;,',:,\",\\,|,.,/,?,`,~]"))
                sb.Append("Password should contain special characters: <>!@#$%^&*()_+\\-=[]{};':\"|./?`~" + Environment.NewLine);

            return sb.ToString();
        }
    }
}
