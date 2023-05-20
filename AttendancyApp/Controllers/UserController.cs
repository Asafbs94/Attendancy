using AttendancyApp.Context;
using AttendancyApp.Helpers;
using AttendancyApp.Models;
using AttendancyApp.Models.Dto;
using AttendancyApp.UtilityService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace AttendancyApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;


        public UserController(AppDbContext appDbContext, IConfiguration configuration, IEmailService emailService)
        {
            _authContext = appDbContext;
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> AuthenticateAsync([FromBody] UserModel userObj)
        {
            // All usernames saving in database as lowercase - to avoid duplication usernames with uppercase.
            var userName = userObj.UserName.ToLower(); 
            var password = userObj.Password;

            if (userObj == null || string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(password))
                return BadRequest();

            // Get the user from database according to its username.
            var user = await _authContext
                            .Users
                            .FirstOrDefaultAsync(u => u.UserName == userObj.UserName)
                            .ConfigureAwait(false);

            if (user == null)
                // Not exposing to the user that the username is incorrect, In order not to reveal that there is a user with this username.
                return BadRequest(new { Message = "The username or password is invalid." });

            // Checking if the password we got from the user is the correct one.
            var hashPassword = user.Password; // User hash password from the database.
            if (!PasswordHasher.VerifyPassword(password, hashPassword))
                // Not exposing to the user that the password is incorrect, In order not to reveal that there is a user with this username.
                return BadRequest(new { Message = "The username or password is invalid." });

            user.Token = CreateJwt(user);

            return Ok(new 
            { 
                Token = user.Token, 
                Message = "Login Success!" 
            });
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
                return BadRequest(new { Message  = "Username already taken, try another name"});

            // Check password strength
            var passError = CheckPasswordStrength(password);
            if (!string.IsNullOrEmpty(passError))
                return BadRequest(new { Message = passError });

            // All usernames saving in database as lowercase - to avoid duplication usernames with uppercase.
            userObj.UserName = userObj.UserName.ToLower(); 
            userObj.Password = PasswordHasher.HashPassword(password);
            userObj.Role = "User";
            userObj.Token = "";

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
                sb.Append("*Password should be at least 8 length." + Environment.NewLine);
            if(!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password, "[A-Z]")
                && Regex.IsMatch(password, "[0-9]")))
                sb.Append("*Password should be Alphanumeric." + Environment.NewLine);
            if (!Regex.IsMatch(password, "[<,>,!,@,#,$,%,^,&,*,(,),_,+,\\-,=,\\[,\\],{,},;,',:,\",\\,|,.,/,?,`,~]"))
                sb.Append("*Password should contain special characters: <>!@#$%^&*()_+\\-=[]{};':\"|./?`~" + Environment.NewLine);

            return sb.ToString();
        }

        private string CreateJwt(UserModel user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("veryverysecret.....");
            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.GivenName, user.UserName)
            });

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddDays(365),
                SigningCredentials = credentials
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }

        [HttpPost("send-reset-email/{email}")]
        public async Task<IActionResult> SendEmailAsync([FromRoute]string email)
        {
            var user = await _authContext.Users.FirstOrDefaultAsync(u => u.Email == email);

            if(user is null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "Email doesn't exists!"
                });
            }
            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var emailToken = Convert.ToBase64String(tokenBytes);
            user.ResetPasswordToken = emailToken;
            user.ResetPasswordExpiry = DateTime.Now.AddMinutes(15);
            string from = _configuration["EmailSettings:From"];

            var emailModel = new EmailModel(email, "Reset password", EmailBodyTemplates.ResetPasswordEmailStringBody(email, emailToken));

            _emailService.SendEmail(emailModel);
            _authContext.Entry(user).State = EntityState.Modified;
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Email sent"
            });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPasswordAsync([FromBody]ResetPasswordDto resetPasswordDto)
        {
            var newToken = resetPasswordDto.EmailToken.Replace(" ", "+");
            var user = await _authContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == resetPasswordDto.Email);

            if (user is null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "User doesn't exist!"
                });
            }

            var tokenCode = user.ResetPasswordToken;
            DateTime emailTokenExpiry = user.ResetPasswordExpiry;
            if(tokenCode != resetPasswordDto.EmailToken || emailTokenExpiry < DateTime.Now)
            {
                return BadRequest(new
                {
                    StatusCode = 400,
                    Message = "Invalid Reset link!"
                });
            }

            // Check password strength.
            var newPassword = resetPasswordDto.NewPassword;
            var passError = CheckPasswordStrength(newPassword);
            if (!string.IsNullOrEmpty(passError))
                return BadRequest(new { Message = passError });

            user.Password = PasswordHasher.HashPassword(newPassword);
            _authContext.Entry(user).State = EntityState.Modified;
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Password rest successfully"
            });
        }

        [HttpPost("send-email/invitation")]
        public IActionResult SendInvitationEmail([FromBody] EmailModel model)
        {
            var emails = model.To.Split(',');
            if (emails.Length == 0)
                return BadRequest(new
                {
                    StatusCode = 400,
                    Message = "Email not provided"
                });

            foreach (var email in emails)
            {
                if (string.IsNullOrEmpty(email))
                    continue; // Skip empty email addresses

                var emailModel = new EmailModel(email, model.Subject, EmailBodyTemplates.EmailInvitationStringBody(email, model.Subject, model.Content));
                _emailService.SendEmail(emailModel);
                //_emailService.SendEmail(new EmailModel(email, model.Subject + " dontReply", model.Content));
            }

            return Ok(new
            {
                StatusCode = 200,
                Message = "Email sent."
            });
        }


        [HttpPost("send-email/absent")]
        public IActionResult SendAbsentEmail([FromBody] EmailModel model)
        {
            var emails = model.To.Split(',');
            if (emails.Length == 0)
                return BadRequest(new
                {
                    StatusCode = 400,
                    Message = "Email not provided"
                });

            foreach (var email in emails)
            {
                if (string.IsNullOrEmpty(email))
                    continue; // Skip empty email addresses

                var emailModel = new EmailModel(email, model.Subject, EmailBodyTemplates.EmailAbsentStringBody(email, model.Subject, model.Content));
                _emailService.SendEmail(emailModel);
                //_emailService.SendEmail(new EmailModel(email, model.Subject + " dontReply", model.Content));
            }

            return Ok(new
            {
                StatusCode = 200,
                Message = "Email sent."
            });
        }

    }
}
