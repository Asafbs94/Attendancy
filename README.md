# Attendancy-Track App 📅
A web application for tracking attendance and absenteeism in organizations.
## Built with 🔨
- [Dotnet 7](https://dotnet.microsoft.com/) 
- [Angular 14](https://angular.io/)

## Features 🎉

- Real-time updates using [SignalR](https://dotnet.microsoft.com/aspnet/signalr)
- Email notifications via an [SMTP server](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)
- Data storage using [SQL Server](https://www.microsoft.com/sql-server/)
- JWT token authentication for secure access [JWT.IO](https://jwt.io/)
- Google Maps API [📍](https://developers.google.com/maps)
- Docker support [Docker](https://www.docker.com/)

## Description 📝

Attendancy-track is a powerful app that simplifies attendance tracking and absenteeism management for organizations. It utilizes QR codes for easy and accurate attendance recording, eliminating manual data entry. The app provides real-time updates, email notifications, and secure authentication using JWT tokens. With its built-in Google Maps API integration, the app ensures that the QR code scanner is within the event area, enhancing security. Organizers can monitor attendance progress and make informed decisions, while also sending invitations and alerts to attendees for better communication and organization.

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
