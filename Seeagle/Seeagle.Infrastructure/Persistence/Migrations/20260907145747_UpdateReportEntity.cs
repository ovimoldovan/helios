using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Seeagle.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateReportEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReportTypeId",
                table: "Reports");

            migrationBuilder.AddColumn<Guid>(
                name: "TypeId",
                table: "Reports",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Reports_TypeId",
                table: "Reports",
                column: "TypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reports_ReportTypes_TypeId",
                table: "Reports",
                column: "TypeId",
                principalTable: "ReportTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reports_ReportTypes_TypeId",
                table: "Reports");

            migrationBuilder.DropIndex(
                name: "IX_Reports_TypeId",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "TypeId",
                table: "Reports");

            migrationBuilder.AddColumn<Guid>(
                name: "ReportTypeId",
                table: "Reports",
                type: "uuid",
                nullable: true);
        }
    }
}
