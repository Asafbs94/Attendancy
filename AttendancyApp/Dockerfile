
FROM node:14.15.1-slim AS npm
WORKDIR /app
COPY **/package.json **/package-lock.json ./
RUN apt-get update && apt-get install -y curl
RUN curl --silent --location https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y \
  nodejs
RUN echo "Node: " && node -v
RUN echo "NPM: " && npm -v
RUN npm update
RUN npm install
EXPOSE 4200
USER node
RUN mkdir /home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
RUN npm install -g @angular/cli

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
RUN apt-get update && apt-get install -y curl
RUN curl --silent --location https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y \
  nodejs
RUN echo "Node: " && node -v
RUN echo "NPM: " && npm -v
RUN npm update

COPY --from=npm /app/node_modules ./node_modules
COPY ["AttendancyApp/AttendancyApp.csproj", "AttendancyApp/"]
RUN dotnet restore "AttendancyApp/AttendancyApp.csproj"
COPY . .
WORKDIR "/src/AttendancyApp"
RUN dotnet build "AttendancyApp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AttendancyApp.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM nginx:alpine
COPY dist/AttendancyApp /usr/share/nginx/html

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AttendancyApp.dll"]
