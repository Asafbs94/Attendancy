using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AttendancyApp.Migrations
{
    /// <inheritdoc />
    public partial class v7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_users_Events_EventModelId",
                table: "users");

            migrationBuilder.DropIndex(
                name: "IX_users_EventModelId",
                table: "users");

            migrationBuilder.DropColumn(
                name: "EventModelId",
                table: "users");

            migrationBuilder.CreateTable(
                name: "ParticipantModel",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ParticipantId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EventModelId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParticipantModel", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ParticipantModel_Events_EventModelId",
                        column: x => x.EventModelId,
                        principalTable: "Events",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ParticipantModel_EventModelId",
                table: "ParticipantModel",
                column: "EventModelId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ParticipantModel");

            migrationBuilder.AddColumn<int>(
                name: "EventModelId",
                table: "users",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_EventModelId",
                table: "users",
                column: "EventModelId");

            migrationBuilder.AddForeignKey(
                name: "FK_users_Events_EventModelId",
                table: "users",
                column: "EventModelId",
                principalTable: "Events",
                principalColumn: "Id");
        }
    }
}
