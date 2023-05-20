using AttendancyApp.Models;
using MailKit.Net.Smtp;
using MimeKit;
using MimeKit.Text;

namespace AttendancyApp.UtilityService
{
    public class EmailService : IEmailService
    {

        private readonly IConfiguration _config;

        public EmailService(IConfiguration configuration)
        {
            _config = configuration;
        }
        public void SendEmail(EmailModel emailModel)
        {
            var emailMessage = new MimeMessage();
            var from = _config["EmailSettings:From"];
            emailMessage.From.Add(new MailboxAddress("AttendancyApp", from));
            emailMessage.To.Add(new MailboxAddress(emailModel.To, emailModel.To));
            emailMessage.Subject = emailModel.Subject;
            try
            {
                emailMessage.Body = new TextPart(TextFormat.Html)
                {
                    Text = string.Format(emailModel.Content)
                };
            }
            catch(Exception e)
            {
                Console.WriteLine(e);
            }

            using(var client = new SmtpClient())
            {
                try
                {
                    client.Connect(_config["EmailSettings:SmtpServer"], int.Parse(_config["EmailSettings:Port"]), true); // the true is that we using ssl.
                    client.Authenticate(_config["EmailSettings:From"], _config["EmailSettings:Password"]);
                    client.Send(emailMessage);
                }
                catch(Exception ex)
                {
                    Console.Error.WriteLine(ex);
                    throw;
                }
                finally
                {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }
        }
    }
}
