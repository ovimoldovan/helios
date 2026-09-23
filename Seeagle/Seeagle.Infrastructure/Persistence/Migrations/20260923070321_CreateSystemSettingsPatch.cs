using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Seeagle.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CreateSystemSettingsPatch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SystemSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DuplicateDistanceMeters = table.Column<double>(type: "double precision", nullable: false),
                    DuplicateTimeWindow = table.Column<TimeSpan>(type: "interval", nullable: false),
                    UpdatedUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemSettings", x => x.Id);
                });
            
            migrationBuilder.Sql(
                """
                INSERT INTO "SystemSettings" ("Id", "DuplicateDistanceMeters", "DuplicateTimeWindow", "UpdatedUtc")
                VALUES (gen_random_uuid(), 50, INTERVAL '72 hours', now());
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SystemSettings");
        }
    }
}
