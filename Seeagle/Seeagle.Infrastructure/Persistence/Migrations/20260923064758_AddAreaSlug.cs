using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Seeagle.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAreaSlug : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "Areas",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql(
                """
                UPDATE "Areas"
                SET "Slug" = lower(regexp_replace(regexp_replace(trim("Name"), '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
                WHERE "Slug" = '';
                """);

            migrationBuilder.CreateIndex(
                name: "IX_Areas_Slug",
                table: "Areas",
                column: "Slug",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(name: "IX_Areas_Slug", table: "Areas");
            migrationBuilder.DropColumn(name: "Slug", table: "Areas");
        }
    }
}
