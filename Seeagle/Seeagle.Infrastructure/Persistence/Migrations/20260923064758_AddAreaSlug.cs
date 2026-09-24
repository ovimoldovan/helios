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
                WITH RankedAreas AS (
                    SELECT 
                        "Id",
                        lower(regexp_replace(regexp_replace(trim("Name"), '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g')) AS base_slug,
                        ROW_NUMBER() OVER (
                            PARTITION BY lower(regexp_replace(regexp_replace(trim("Name"), '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
                            ORDER BY "Id"
                        ) AS rn
                    FROM "Areas"
                )
                UPDATE "Areas" a
                SET "Slug" = CASE 
                    WHEN r.rn = 1 THEN r.base_slug
                    ELSE r.base_slug || '-' || (r.rn - 1)
                END
                FROM RankedAreas r
                WHERE a."Id" = r."Id";
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