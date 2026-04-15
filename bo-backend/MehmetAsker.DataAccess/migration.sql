CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260409235418_InitialCreate') THEN
    CREATE TABLE "Sites" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "Domain" text NOT NULL,
        "ApiKey" text NOT NULL,
        "IsActive" boolean NOT NULL,
        "CreatedAt" timestamp without time zone NOT NULL,
        "UpdatedAt" timestamp without time zone,
        CONSTRAINT "PK_Sites" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260409235418_InitialCreate') THEN
    CREATE TABLE "AdminUsers" (
        "Id" uuid NOT NULL,
        "Email" text NOT NULL,
        "PasswordHash" text NOT NULL,
        "Role" text NOT NULL,
        "LastLogin" timestamp without time zone,
        "FailedLoginAttempts" integer NOT NULL,
        "LockedUntil" timestamp without time zone,
        "CreatedAt" timestamp without time zone NOT NULL,
        "UpdatedAt" timestamp without time zone,
        "SiteId" uuid NOT NULL,
        CONSTRAINT "PK_AdminUsers" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_AdminUsers_Sites_SiteId" FOREIGN KEY ("SiteId") REFERENCES "Sites" ("Id") ON DELETE RESTRICT
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260409235418_InitialCreate') THEN
    CREATE TABLE "RefreshTokens" (
        "Id" uuid NOT NULL,
        "AdminUserId" uuid NOT NULL,
        "Token" text NOT NULL,
        "ExpiresAt" timestamp without time zone NOT NULL,
        "IsRevoked" boolean NOT NULL,
        "CreatedAt" timestamp without time zone NOT NULL,
        "UpdatedAt" timestamp without time zone,
        CONSTRAINT "PK_RefreshTokens" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_RefreshTokens_AdminUsers_AdminUserId" FOREIGN KEY ("AdminUserId") REFERENCES "AdminUsers" ("Id") ON DELETE RESTRICT
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260409235418_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_AdminUsers_Email_SiteId" ON "AdminUsers" ("Email", "SiteId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260409235418_InitialCreate') THEN
    CREATE INDEX "IX_AdminUsers_SiteId" ON "AdminUsers" ("SiteId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260409235418_InitialCreate') THEN
    CREATE INDEX "IX_RefreshTokens_AdminUserId" ON "RefreshTokens" ("AdminUserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260409235418_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_Sites_Domain" ON "Sites" ("Domain");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260409235418_InitialCreate') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260409235418_InitialCreate', '9.0.4');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410001859_AddSiteContext') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260410001859_AddSiteContext', '9.0.4');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410071104_AddBlogEntities') THEN
    CREATE TABLE "Categories" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "Slug" text NOT NULL,
        "CreatedAt" timestamp without time zone NOT NULL,
        "UpdatedAt" timestamp without time zone,
        "SiteId" uuid NOT NULL,
        CONSTRAINT "PK_Categories" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Categories_Sites_SiteId" FOREIGN KEY ("SiteId") REFERENCES "Sites" ("Id") ON DELETE RESTRICT
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410071104_AddBlogEntities') THEN
    CREATE TABLE "Posts" (
        "Id" uuid NOT NULL,
        "Title" text NOT NULL,
        "Slug" text NOT NULL,
        "Content" text NOT NULL,
        "Summary" text,
        "CoverImage" text,
        "IsPublished" boolean NOT NULL,
        "PublishedAt" timestamp without time zone,
        "CategoryId" uuid,
        "CreatedAt" timestamp without time zone NOT NULL,
        "UpdatedAt" timestamp without time zone,
        "SiteId" uuid NOT NULL,
        CONSTRAINT "PK_Posts" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Posts_Categories_CategoryId" FOREIGN KEY ("CategoryId") REFERENCES "Categories" ("Id") ON DELETE RESTRICT,
        CONSTRAINT "FK_Posts_Sites_SiteId" FOREIGN KEY ("SiteId") REFERENCES "Sites" ("Id") ON DELETE RESTRICT
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410071104_AddBlogEntities') THEN
    CREATE INDEX "IX_Categories_SiteId" ON "Categories" ("SiteId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410071104_AddBlogEntities') THEN
    CREATE UNIQUE INDEX "IX_Categories_Slug_SiteId" ON "Categories" ("Slug", "SiteId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410071104_AddBlogEntities') THEN
    CREATE INDEX "IX_Posts_CategoryId" ON "Posts" ("CategoryId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410071104_AddBlogEntities') THEN
    CREATE INDEX "IX_Posts_SiteId" ON "Posts" ("SiteId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410071104_AddBlogEntities') THEN
    CREATE UNIQUE INDEX "IX_Posts_Slug_SiteId" ON "Posts" ("Slug", "SiteId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410071104_AddBlogEntities') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260410071104_AddBlogEntities', '9.0.4');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410083732_AddProjectEntity') THEN
    CREATE TABLE "Projects" (
        "Id" uuid NOT NULL,
        "Title" text NOT NULL,
        "Slug" text NOT NULL,
        "Description" text,
        "CoverImage" text,
        "LiveUrl" text,
        "GitHubUrl" text,
        "Tags" text,
        "IsFeatured" boolean NOT NULL,
        "IsPublished" boolean NOT NULL,
        "SortOrder" integer NOT NULL,
        "CreatedAt" timestamp without time zone NOT NULL,
        "UpdatedAt" timestamp without time zone,
        "SiteId" uuid NOT NULL,
        CONSTRAINT "PK_Projects" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Projects_Sites_SiteId" FOREIGN KEY ("SiteId") REFERENCES "Sites" ("Id") ON DELETE RESTRICT
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410083732_AddProjectEntity') THEN
    CREATE INDEX "IX_Projects_SiteId" ON "Projects" ("SiteId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410083732_AddProjectEntity') THEN
    CREATE UNIQUE INDEX "IX_Projects_Slug_SiteId" ON "Projects" ("Slug", "SiteId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410083732_AddProjectEntity') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260410083732_AddProjectEntity', '9.0.4');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410145828_AddSettingsEntities') THEN
    CREATE TABLE "AboutInfos" (
        "Id" uuid NOT NULL,
        "FullName" text NOT NULL,
        "Title" text NOT NULL,
        "Bio" text,
        "ShortBio" text,
        "AvatarUrl" text,
        "ResumeUrl" text,
        "Location" text,
        "Email" text,
        "CreatedAt" timestamp without time zone NOT NULL,
        "UpdatedAt" timestamp without time zone,
        "SiteId" uuid NOT NULL,
        CONSTRAINT "PK_AboutInfos" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_AboutInfos_Sites_SiteId" FOREIGN KEY ("SiteId") REFERENCES "Sites" ("Id") ON DELETE RESTRICT
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410145828_AddSettingsEntities') THEN
    CREATE TABLE "Skills" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "IconUrl" text,
        "Category" text NOT NULL,
        "SortOrder" integer NOT NULL,
        "CreatedAt" timestamp without time zone NOT NULL,
        "UpdatedAt" timestamp without time zone,
        "SiteId" uuid NOT NULL,
        CONSTRAINT "PK_Skills" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Skills_Sites_SiteId" FOREIGN KEY ("SiteId") REFERENCES "Sites" ("Id") ON DELETE RESTRICT
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410145828_AddSettingsEntities') THEN
    CREATE TABLE "SocialLinks" (
        "Id" uuid NOT NULL,
        "Platform" text NOT NULL,
        "Url" text NOT NULL,
        "IconName" text,
        "SortOrder" integer NOT NULL,
        "IsVisible" boolean NOT NULL,
        "CreatedAt" timestamp without time zone NOT NULL,
        "UpdatedAt" timestamp without time zone,
        "SiteId" uuid NOT NULL,
        CONSTRAINT "PK_SocialLinks" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_SocialLinks_Sites_SiteId" FOREIGN KEY ("SiteId") REFERENCES "Sites" ("Id") ON DELETE RESTRICT
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410145828_AddSettingsEntities') THEN
    CREATE INDEX "IX_AboutInfos_SiteId" ON "AboutInfos" ("SiteId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410145828_AddSettingsEntities') THEN
    CREATE INDEX "IX_Skills_SiteId" ON "Skills" ("SiteId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410145828_AddSettingsEntities') THEN
    CREATE INDEX "IX_SocialLinks_SiteId" ON "SocialLinks" ("SiteId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260410145828_AddSettingsEntities') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260410145828_AddSettingsEntities', '9.0.4');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260411022923_AddPostTags') THEN
    ALTER TABLE "Posts" ADD "Tags" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260411022923_AddPostTags') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260411022923_AddPostTags', '9.0.4');
    END IF;
END $EF$;
COMMIT;

