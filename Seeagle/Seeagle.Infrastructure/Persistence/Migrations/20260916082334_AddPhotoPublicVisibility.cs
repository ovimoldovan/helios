using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Seeagle.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddPhotoPublicVisibility : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsVisibleToPublic",
                table: "Photos",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsVisibleToPublic",
                table: "Photos");
        }
    }
}
