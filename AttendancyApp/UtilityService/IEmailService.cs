using AttendancyApp.Models;

namespace AttendancyApp.UtilityService
{
    public interface IEmailService
    {
        void SendEmail(EmailModel emailModel);
    }
}
