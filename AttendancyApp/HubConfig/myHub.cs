using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace AttendancyApp.HubConfig
{
    public class myHub : Hub
    {
     
        public async Task NotifyArrival(string studentId)
        {
            // Send a message to the client with the connection ID equal to the current connection
            await Clients.Client(Context.ConnectionId).SendAsync("NotifyArrival", studentId);
        }
    }
}
