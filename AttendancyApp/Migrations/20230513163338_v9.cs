using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AttendancyApp.Migrations
{
    /// <inheritdoc />
    public partial class v9 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ParticipantModel_Events_EventModelId",
                table: "ParticipantModel");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ParticipantModel",
                table: "ParticipantModel");

            migrationBuilder.RenameTable(
                name: "ParticipantModel",
                newName: "Participants");

            migrationBuilder.RenameIndex(
                name: "IX_ParticipantModel_EventModelId",
                table: "Participants",
                newName: "IX_Participants_EventModelId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Participants",
                table: "Participants",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Participants_Events_EventModelId",
                table: "Participants",
                column: "EventModelId",
                principalTable: "Events",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Participants_Events_EventModelId",
                table: "Participants");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Participants",
                table: "Participants");

            migrationBuilder.RenameTable(
                name: "Participants",
                newName: "ParticipantModel");

            migrationBuilder.RenameIndex(
                name: "IX_Participants_EventModelId",
                table: "ParticipantModel",
                newName: "IX_ParticipantModel_EventModelId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ParticipantModel",
                table: "ParticipantModel",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ParticipantModel_Events_EventModelId",
                table: "ParticipantModel",
                column: "EventModelId",
                principalTable: "Events",
                principalColumn: "Id");
        }
    }
}
