namespace AttendancyApp.Helpers
{
    public static class EmailBodyTemplates
    {
        public static string ResetPasswordEmailStringBody(string email, string emailToken)
        {
            return $@"<html>
<head>
</head>
<body style=""margin:0; padding: 0;font-family: Arial, Helvetica, sans-serif;"">
    <div style=""height: auto; background: linear-gradient(to top, #f5f5f7 0%, #b6d8ed 90%) no-repeat;width:400px;padding: 30px;"">
        <div>
            <div>
                <h1 style=""color:black"">Reset your password</h1>
                <br>
                <p style=""color:black"">You're receiving this email because you requested a password reset for your AttendancyApp account.</p>

                <p style=""color:black"">Please click the button below to choose a new password.</p>

                <a href=""http://localhost:4200/reset-password?email={email}&code={emailToken}"" target=""_blank"" style=""background: #0d6efc; padding: 10px; border: none; border-radius: 4px; display: block; margin: 0 auto; width: 50%; text-align: center; text-decoration: none; color: white;"">Reset password</a><br>

                <p style=""color:black"">Regards<br><br>
                    AttendancyApp</p>
            </div>
        </div>
    </div>
</body>
</html>";
        }

        public static string EmailInvitationStringBody(string email, string subject, string content)
        {
            return $@"<html>
<head>
</head>
<body style=""margin:0; padding: 0;font-family: Arial, Helvetica, sans-serif;"">
    <div style=""height: auto; background: linear-gradient(to top, #f5f5f7 0%, #b6d8ed 90%) no-repeat;width:400px;padding: 30px;"">
        <div>
            <div>
                <h3 style=""color:black"">{subject}</h3>
                <br>
                <p style=""color:black"">Hi, {email}.</p>

                <p style=""color:black"">{content}.</p>

                <p style=""color:black"">Don't reply to this email.</p>

                <p style=""color:black"">Regards<br><br>
                    AttendancyApp</p>
            </div>
        </div>
    </div>
</body>
</html>";
        }


        public static string EmailAbsentStringBody(string email, string subject, string content)
        {
            return $@"<html>
<head>
</head>
<body style=""margin:0; padding: 0;font-family: Arial, Helvetica, sans-serif;"">
    <div style=""height: auto; background: linear-gradient(to top, #f5f5f7 0%, #ed7e7e 90%) no-repeat;width:400px;padding: 30px;"">
        <div>
            <div>
                <h3 style=""color:black"">{subject}</h3>
                <br>
                <p style=""color:black"">Hi, {email}.</p>

                <p style=""color:black"">{content}.</p>

                <p style=""color:black"">Don't reply to this email.</p>

                <p style=""color:black"">Regards<br><br>
                    AttendancyApp</p>
            </div>
        </div>
    </div>
</body>
</html>";
        }
    }
}
