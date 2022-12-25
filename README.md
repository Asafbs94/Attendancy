# Attendancy-track app 📅

A web application for tracking attendancy and absenteeism in organizations. Built with [DotNet7](https://dotnet.microsoft.com/) and [Angular](https://angular.io/).

## Features 🎉

- Real-time updates using [SignalR](https://dotnet.microsoft.com/aspnet/signalr)
- Email notifications via an [SMTP server](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)
- Data storage using [SQL Server](https://www.microsoft.com/sql-server/)

## Development 🛠

The project can be built and run using [Docker](https://www.docker.com/). To set up the development environment:

1. Install [Docker](https://www.docker.com/get-started)
2. Clone this repository: `git clone https://github.com/BlackChesire/attendancy-track-app.git`
3. Navigate to the root directory of the repository: `cd attendancy-track-app`
4. Build the Docker image: `docker build -t attendancy-track-app .`
5. Run the Docker container: `docker run -p 8080:80 attendancy-track-app`

The app should now be running at [http://localhost:8080](http://localhost:8080).

## Contributions 🤝

We welcome contributions to this project! If you have an idea for a feature or a bug fix, please open an issue or a pull request.

## License 📄

This project is licensed under the [MIT License](LICENSE).
