using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace AttendancyApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class GeocodeController : ControllerBase
    {
        private readonly HttpClient _httpClient = new HttpClient();
        private readonly IConfiguration _configuration;

        public GeocodeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet]
        public async Task<IActionResult> GetGeocode(string location)
        {
            if (string.IsNullOrWhiteSpace(location))
            {
                return Ok(Array.Empty<string>());
            }

            string? apiKey = _configuration.GetSection("AppSettings")["GoogleMapsApiKey"];
            string apiUrl = $"https://maps.googleapis.com/maps/api/geocode/json?address={Uri.EscapeDataString(location)}&key={apiKey}";

            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync(apiUrl);
                response.EnsureSuccessStatusCode();
                string responseContent = await response.Content.ReadAsStringAsync();

                using JsonDocument document = JsonDocument.Parse(responseContent);

                // Check if the JSON response contains the expected structure
                if (document.RootElement.TryGetProperty("results", out JsonElement resultsElement) && resultsElement.ValueKind == JsonValueKind.Array)
                {
                    List<Result> results = new List<Result>();

                    foreach (JsonElement resultElement in resultsElement.EnumerateArray())
                    {
                        Result result = new Result();
                        if (resultElement.TryGetProperty("formatted_address", out JsonElement formattedAddressElement) && formattedAddressElement.ValueKind == JsonValueKind.String)
                        {
                            result.FormattedAddress = formattedAddressElement.GetString();
                        }
                        // Add other properties to populate if needed

                        results.Add(result);
                    }

                    var suggestions = results.Select(result => result.FormattedAddress).ToList();
                    return Ok(suggestions);
                }
                else
                {
                    return Ok(Array.Empty<string>());
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while fetching geocode data: {ex.Message}");
            }
        }
    
    }

    public class Result
    {
        public string FormattedAddress { get; set; }
    }
}
