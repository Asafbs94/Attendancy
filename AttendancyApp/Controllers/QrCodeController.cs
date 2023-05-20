using AttendancyApp.Context;
using AttendancyApp.HubConfig;
using AttendancyApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json;

namespace AttendancyApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class QrCodeController : ControllerBase
    {
        private readonly IHubContext<myHub> hubContext;
        private readonly AppDbContext _authContext;
        private readonly IConfiguration _configuration;


        public QrCodeController(AppDbContext appDbContext, IHubContext<myHub> hubContext, IConfiguration configuration)
        {
            this.hubContext = hubContext;
            _authContext = appDbContext;
            _configuration = configuration;

        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] LocationDataDto location)
        {
            var currentEvent = _authContext.Events
                        .Include("Participants")
                        .Include("Creator")
                        .Where(e => e.Guid.ToString().ToLower() == location.guid.ToLower()).FirstOrDefault();

            var locationString = await GetLocationByCoordinatesAsync(location.Lat, location.Lng);
            var EventLocation = await GetCoordinatesByLocationAsync(currentEvent.EventLocation);
            bool isLocationOK = IsLocationWithin3Km(location.Lat, location.Lng, EventLocation.Item1, EventLocation.Item2);
            if (isLocationOK)
            {
                {
                    var newParticipant = new ParticipantModel
                    {
                        Email = !string.IsNullOrEmpty(location.Email) ? location.Email : string.Empty,
                        ParticipantId = location.Id != 0 ? location.Id : 0,
                        IsArrived = true
                    };
                    try
                    { 

                        currentEvent.Participants.Add(newParticipant);

                        _authContext.SaveChanges();
                        Attendand a = new Attendand
                        {
                            name = newParticipant.Email.IsNullOrEmpty() ? newParticipant.Id.ToString() : newParticipant.Email,
                            profilePictureUrl = currentEvent.EventName.ToString(),
                        };
                        await hubContext.Clients.All.SendAsync("studentReceived", a);

                        return Ok();
                    }
                    catch (Exception)
                    {
                        throw;
                    }
                }
            }
            else
            {
                return BadRequest("Your NOT int the event area you area is marked as " + locationString + " Event location is " + currentEvent.EventLocation);
            }
        }
        [HttpGet("/GetLocationByCoordinatesAsync")]
        public async Task<string> GetLocationByCoordinatesAsync(double lat, double lng)
        {
            string? apiKey = _configuration.GetSection("AppSettings")["GoogleMapsApiKey"];
            string apiUrl = $"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={apiKey}";

            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync(apiUrl);
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var json = JsonDocument.Parse(content);

                    // Parse the response to get the location information
                    string? location = json.RootElement
         .GetProperty("results")[0]
         .GetProperty("address_components")[1]
         .GetProperty("long_name")
         .GetString();

                    return location;
                }
                else
                {
                    // Handle the error response if needed
                    return null;
                }
            }
        }
        [HttpGet("/GetCoordinatesByLocationAsync")]
        public async Task<(double, double)> GetCoordinatesByLocationAsync(string locationName)
        {
            string apiKey = _configuration.GetSection("AppSettings")["GoogleMapsApiKey"];
            string encodedLocationName = Uri.EscapeDataString(locationName);
            string apiUrl = $"https://maps.googleapis.com/maps/api/geocode/json?address={encodedLocationName}&key={apiKey}";

            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync(apiUrl);
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var json = JsonDocument.Parse(content);

                    var location = json.RootElement
                        .GetProperty("results")[0]
                        .GetProperty("geometry")
                        .GetProperty("location");

                    double latitude = location.GetProperty("lat").GetDouble();
                    double longitude = location.GetProperty("lng").GetDouble();

                    return (latitude, longitude);
                }
                else
                {
                    // Handle the error response if needed
                    return (0, 0);
                }
            }
        }
        private bool IsLocationWithin3Km(double lat1, double lng1, double lat2, double lng2)
        {
            const double EarthRadiusKm = 6371.0; // Earth radius in kilometers

            double dLat = ToRadians(lat2 - lat1);
            double dLng = ToRadians(lng2 - lng1);

            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                       Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                       Math.Sin(dLng / 2) * Math.Sin(dLng / 2);

            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            double distance = EarthRadiusKm * c;

            return distance < 3.0;
        }

        private double ToRadians(double degrees)
        {
            return degrees * Math.PI / 180.0;
        }
        public class LocationDataDto
        {
            public double Lat { get; set; }
            public double Lng { get; set; }
            public int? Id { get; set; }
            public string? Email { get; set; }
            public string? guid { get; set; }
        }
        public class Attendand
        {
            public string? name { get; set; }

            public string? profilePictureUrl { get; set; }

            public bool fadedIn = true;
        }

    }
}
