using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Seeagle.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MakePhotoPublic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HasPhoto",
                table: "Reports",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowPhotoToPublic",
                table: "Reports",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.Sql("""
                                 UPDATE "Reports" r
                                 SET "HasPhoto" = TRUE
                                 WHERE EXISTS (SELECT 1 FROM "Photos" p WHERE p."ReportId" = r."Id");
                                 """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasPhoto",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "ShowPhotoToPublic",
                table: "Reports");
        }
    }
}
