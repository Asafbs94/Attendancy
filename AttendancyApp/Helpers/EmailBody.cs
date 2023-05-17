﻿namespace AttendancyApp.Helpers
{
    public static class EmailBody
    {
        public static string EmailStringBody(string email, string emailToken)
        {
            return $@"<html>
<head>
</head>
<body style=""margin:0; padding: 0;font-family: Arial, Helvetica, sans-serif;"">
    <div style=""height: auto; background: linear-gradient(to top, #f5f5f7 0%, #b6d8ed 90%) no-repeat;width:400px;padding: 30px;"">
        <div>
            <div>
                <h1>Reset your password</h1>
                <br>
                <p>You're receiving this email because you requested a password reset for your AttendancyApp account.</p>

                <p>Please click the button below to choose a new password.</p>

                <a href=""https://localhost:44431/reset-password?email={email}&code={emailToken}"" target=""_blank"" style=""background: #0d6efc; padding: 10px; border: none; border-radius: 4px; display: block; margin: 0 auto; width: 50%; text-align: center; text-decoration: none; color: white;"">Reset password</a><br>

                <p>King Regards<br><br>
                    AttendancyApp</p>
            </div>
        </div>
    </div>
</body>
</html>";
        }
    }
}
