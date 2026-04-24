using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MehmetAsker.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class SimplifyServicePricing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Yeni kolonları ekle (veri taşıma öncesi)
            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "Services",
                type: "character varying(3)",
                maxLength: 3,
                nullable: false,
                defaultValue: "EUR");

            migrationBuilder.AddColumn<int>(
                name: "DurationMinutes",
                table: "Services",
                type: "integer",
                nullable: true);

            // Mevcut SessionDurationMinutes değerini DurationMinutes'a taşı
            migrationBuilder.Sql(@"UPDATE ""Services"" SET ""DurationMinutes"" = ""SessionDurationMinutes"" WHERE ""SessionDurationMinutes"" > 0;");

            // Eski kolonları kaldır
            migrationBuilder.DropColumn(name: "IsFreeFirstSession", table: "Services");
            migrationBuilder.DropColumn(name: "PackageHours", table: "Services");
            migrationBuilder.DropColumn(name: "SessionDurationMinutes", table: "Services");

            // PackagePriceEur → Price (veri korunur)
            migrationBuilder.RenameColumn(
                name: "PackagePriceEur",
                table: "Services",
                newName: "Price");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Currency",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "DurationMinutes",
                table: "Services");

            migrationBuilder.RenameColumn(
                name: "Price",
                table: "Services",
                newName: "PackagePriceEur");

            migrationBuilder.AddColumn<bool>(
                name: "IsFreeFirstSession",
                table: "Services",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "PackageHours",
                table: "Services",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SessionDurationMinutes",
                table: "Services",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
