# Attendancy-track app 📅
A web application for tracking attendance and absenteeism in organizations.
## Built with 🔨
- [Dotnet 7](https://dotnet.microsoft.com/) 
- [Angular 14](https://angular.io/)

## Features 🎉

- Real-time updates using [SignalR](https://dotnet.microsoft.com/aspnet/signalr)
- Email notifications via an [SMTP server](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)
- Data storage using [SQL Server](https://www.microsoft.com/sql-server/)
- JWT token authentication for secure access [JWT.IO](https://jwt.io/)
- Docker support [Docker](https://www.docker.com/)

## Description 📝

This project aims to provide organizations with a reliable and efficient solution for tracking attendance and managing absenteeism. With the Attendancy-track app, you can easily monitor the presence of employees, students, or any other attendees within your organization. The app offers a range of features to streamline the process, including real-time updates for instant visibility, email notifications to keep everyone informed, and secure authentication using JWT tokens.

One of the key features of the app is the ability to apply attendance using QR codes. Attendees can simply scan a unique QR code assigned to them, and the app will instantly record their attendance. This eliminates the need for manual data entry and ensures accurate and efficient attendance tracking.

Attendancy-track app provides live updates as attendees scan their QR codes. You can see attendance records being populated in real-time on the screen, providing immediate feedback on the presence of attendees. This feature enables you to monitor attendance progress during events, meetings, or classes and make timely decisions based on the attendance data.

The app also includes a mail sending feature. Event organizers can utilize this feature to send emails to attendees. They can easily invite attendees to events, meetings, or classes by sending email invitations, including all the relevant details such as date, time, and location. The app also allows organizers to send email alerts to attendees in case of absenteeism, reminding them of their commitment and promoting attendance accountability. This email sending feature enhances communication and organization, providing a convenient way for organizers to interact with their attendees.

## Development 🛠

The project can be built and run using [Docker](https://www.docker.com/). To set up the development environment:

1. Install [Docker](https://www.docker.com/get-started)
2. Clone this repository: `git clone https://github.com/BlackChesire/Attendancy.git`
3. Navigate to the root directory of the repository: `cd attendancy-track-app`
4. Build the Docker image: `docker build -t attendancy-track-app .`
5. Run the Docker container: `docker run -p 8080:80 attendancy-track-app`

The app should now be running at [http://localhost:8080](http://localhost:8080).

## Contributions 🤝

We welcome contributions to this project! If you have an idea for a feature or a bug fix, please open an issue or a pull request.

## License 📄

This project is licensed under the [MIT License](LICENSE).
