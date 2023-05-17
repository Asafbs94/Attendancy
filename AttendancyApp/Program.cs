using AttendancyApp.Context;
using AttendancyApp.HubConfig;
using AttendancyApp.UtilityService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<AppDbContext>(option =>
{
    option.UseSqlServer(builder.Configuration.GetConnectionString("SqlServerConnStr"));
});

builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("veryverysecret.....")),
        ValidateAudience = false,
        ValidateIssuer = false,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllersWithViews();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllHeaders",
        builder =>
        {
            builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        }
        );
});
builder.Services.AddControllers();
var app = builder.Build();
// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.UseCors("AllowAllHeaders");
app.UseAuthentication();
app.UseAuthorization();


app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<myHub>("/toastr");
});
app.UseSwagger(options =>
{
    options.SerializeAsV2 = true;
});

app.UseSwaggerUI(options =>
{
    //options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    //options.RoutePrefix = string.Empty;
    //options.DocumentTitle = "Attendancy swagger";
});
app.Run();
