"use strict"
exports.__esModule = true
exports.down = exports.up = void 0
var tslib_1 = require("tslib")
function up(knex) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    var _a, _b
    var _this = this
    return tslib_1.__generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          return [
            4 /*yield*/,
            knex.raw(
              "CREATE TYPE course_status AS ENUM (\n    'Active',\n    'Ended',\n    'Upcoming'\n  );",
            ),
          ]
        case 1:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              "CREATE TYPE organization_role AS ENUM (\n    'Teacher',\n    'Student',\n    'OrganizationAdmin'\n  );",
            ),
          ]
        case 2:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE TABLE IF NOT EXISTS "UserAppDatumConfig" (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    name text,\n    "timestamp" timestamp(3) without time zone\n  );',
            ),
          ]
        case 3:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE TABLE IF NOT EXISTS "UserCourseSettings" (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    language text,\n    country text,\n    research boolean,\n    marketing boolean,\n    course_variant text,\n    other text,\n    "user" uuid,\n    course uuid\n  );',
            ),
          ]
        case 4:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE TABLE IF NOT EXISTS "_CourseToService" (\n    "A" uuid NOT NULL,\n    "B" uuid NOT NULL\n  );',
            ),
          ]
        case 5:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE TABLE IF NOT EXISTS "_StudyModuleToCourse" (\n    "A" uuid NOT NULL,\n    "B" uuid NOT NULL\n  );',
            ),
          ]
        case 6:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE TABLE IF NOT EXISTS completion (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    user_upstream_id integer,\n    email text NOT NULL,\n    student_number text,\n    completion_language text,\n    grade text,\n    certificate_id text,\n    course uuid,\n    "user" uuid,\n    eligible_for_ects boolean DEFAULT true\n  );',
            ),
          ]
        case 7:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE TABLE IF NOT EXISTS completion_registered (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    real_student_number text NOT NULL,\n    "user" uuid,\n    completion uuid,\n    course uuid,\n    organization uuid\n  );',
            ),
          ]
        case 8:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              "CREATE TABLE IF NOT EXISTS course (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    teacher_in_charge_name text NOT NULL,\n    teacher_in_charge_email text NOT NULL,\n    support_email text,\n    start_date text NOT NULL,\n    end_date text,\n    name text NOT NULL,\n    slug text NOT NULL,\n    ects text,\n    promote boolean,\n    status course_status DEFAULT 'Upcoming'::course_status,\n    start_point boolean,\n    hidden boolean,\n    study_module_start_point boolean,\n    \"order\" integer,\n    study_module_order integer,\n    automatic_completions boolean DEFAULT false,\n    points_needed integer,\n    exercise_completions_needed integer,\n    has_certificate boolean DEFAULT false,\n    owner_organization uuid,\n    completion_email uuid,\n    inherit_settings_from uuid,\n    completions_handled_by uuid,\n    photo uuid,\n    automatic_completions_eligible_for_ects boolean DEFAULT true\n  );",
            ),
          ]
        case 9:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              "CREATE TABLE IF NOT EXISTS course_alias (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    course_code text NOT NULL,\n    course uuid\n  );",
            ),
          ]
        case 10:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              "CREATE TABLE IF NOT EXISTS course_organization (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    creator boolean,\n    course uuid,\n    organization uuid\n  );",
            ),
          ]
        case 11:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              "CREATE TABLE IF NOT EXISTS course_translation (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    name text NOT NULL,\n    language text NOT NULL,\n    description text NOT NULL,\n    link text,\n    course uuid\n  );",
            ),
          ]
        case 12:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              "CREATE TABLE IF NOT EXISTS course_variant (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    slug text NOT NULL,\n    description text,\n    course uuid\n  );",
            ),
          ]
        case 13:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE TABLE IF NOT EXISTS email_delivery (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    sent boolean DEFAULT false NOT NULL,\n    error boolean DEFAULT false NOT NULL,\n    error_message text,\n    "user" uuid,\n    email_template uuid\n  );',
            ),
          ]
        case 14:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              "CREATE TABLE IF NOT EXISTS email_template (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    name text,\n    txt_body text,\n    html_body text,\n    title text\n  );",
            ),
          ]
        case 15:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE TABLE IF NOT EXISTS exercise (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    custom_id text NOT NULL,\n    name text,\n    part integer,\n    section integer,\n    max_points integer,\n    "timestamp" timestamp(3) without time zone,\n    deleted boolean DEFAULT false,\n    service uuid,\n    course uuid\n  );',
            ),
          ]
        case 16:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE TABLE IF NOT EXISTS exercise_completion (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    n_points numeric(65,30),\n    "timestamp" timestamp(3) without time zone NOT NULL,\n    completed boolean DEFAULT false,\n    "user" uuid,\n    exercise uuid\n  );',
            ),
          ]
        case 17:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              "CREATE TABLE IF NOT EXISTS exercise_completion_required_actions (\n    id uuid NOT NULL,\n    value text NOT NULL,\n    exercise_completion uuid\n  );",
            ),
          ]
        case 18:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE TABLE IF NOT EXISTS image (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    name text,\n    original text NOT NULL,\n    original_mimetype text NOT NULL,\n    uncompressed text NOT NULL,\n    uncompressed_mimetype text NOT NULL,\n    compressed text,\n    compressed_mimetype text,\n    encoding text,\n    "default" boolean\n  );',
            ),
          ]
        case 19:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              "CREATE TABLE IF NOT EXISTS open_university_registration_link (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    course_code text NOT NULL,\n    language text NOT NULL,\n    link text,\n    start_date timestamp(3) without time zone,\n    stop_date timestamp(3) without time zone,\n    course uuid\n  );",
            ),
          ]
        case 20:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              "CREATE TABLE IF NOT EXISTS organization (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    slug text NOT NULL,\n    verified_at timestamp(3) without time zone,\n    verified boolean,\n    disabled boolean,\n    hidden boolean,\n    tmc_created_at timestamp(3) without time zone,\n    tmc_updated_at timestamp(3) without time zone,\n    logo_file_name text,\n    logo_content_type text,\n    logo_file_size integer,\n    logo_updated_at timestamp(3) without time zone,\n    phone text,\n    contact_information text,\n    email text,\n    website text,\n    pinned boolean,\n    secret_key text NOT NULL,\n    creator uuid\n  );",
            ),
          ]
        case 21:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              "CREATE TABLE IF NOT EXISTS organization_translation (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    language text NOT NULL,\n    name text NOT NULL,\n    disabled_reason text,\n    information text,\n    organization uuid\n  );",
            ),
          ]
        case 22:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              "CREATE TABLE IF NOT EXISTS service (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    url text NOT NULL,\n    name text NOT NULL\n  );",
            ),
          ]
        case 23:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE TABLE IF NOT EXISTS study_module (\n    id uuid NOT NULL,\n    slug text NOT NULL,\n    name text NOT NULL,\n    image text,\n    "order" integer,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone\n  );',
            ),
          ]
        case 24:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              "CREATE TABLE IF NOT EXISTS study_module_translation (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    name text NOT NULL,\n    language text NOT NULL,\n    description text NOT NULL,\n    study_module uuid\n  );",
            ),
          ]
        case 25:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE TABLE IF NOT EXISTS "user" (\n    id uuid NOT NULL,\n    upstream_id integer NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    first_name text,\n    last_name text,\n    username text NOT NULL,\n    email text NOT NULL,\n    administrator boolean NOT NULL,\n    student_number text,\n    real_student_number text,\n    research_consent boolean\n  );',
            ),
          ]
        case 26:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE TABLE IF NOT EXISTS user_course_progress (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    progress json NOT NULL,\n    max_points numeric(65,30),\n    n_points numeric(65,30),\n    "user" uuid,\n    course uuid\n  );',
            ),
          ]
        case 27:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE TABLE IF NOT EXISTS user_course_service_progress (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    progress json NOT NULL,\n    "timestamp" timestamp(3) without time zone,\n    service uuid,\n    "user" uuid,\n    course uuid,\n    user_course_progress uuid\n  );',
            ),
          ]
        case 28:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              "CREATE TABLE IF NOT EXISTS user_course_settings_visibility (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    language text NOT NULL,\n    course uuid\n  );",
            ),
            // TODO: check organization_role vs OrganizationRole
          ]
        case 29:
          _c.sent()
          // TODO: check organization_role vs OrganizationRole
          return [
            4 /*yield*/,
            knex.raw(
              "CREATE TABLE IF NOT EXISTS user_organization (\n    id uuid NOT NULL,\n    role organization_role DEFAULT 'Student'::organization_role,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    organization uuid,\n    \"user\" uuid\n  );",
            ),
          ]
        case 30:
          // TODO: check organization_role vs OrganizationRole
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE TABLE IF NOT EXISTS verified_user (\n    id uuid NOT NULL,\n    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp(3) without time zone,\n    display_name text,\n    personal_unique_code text NOT NULL,\n    organization uuid,\n    "user" uuid\n  );',
            ),
          ]
        case 31:
          _c.sent()
          _c.label = 32
        case 32:
          _c.trys.push([32, 34, , 35])
          return [
            4 /*yield*/,
            knex.transaction(function (trx) {
              return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [
                        4 /*yield*/,
                        trx.raw(
                          'ALTER TABLE ONLY "UserAppDatumConfig" \n        ADD CONSTRAINT "UserAppDatumConfig_pkey" PRIMARY KEY (id);',
                        ),
                      ]
                    case 1:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          'ALTER TABLE ONLY "UserCourseSettings"\n        ADD CONSTRAINT "UserCourseSettings_pkey" PRIMARY KEY (id);',
                        ),
                      ]
                    case 2:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY completion\n        ADD CONSTRAINT completion_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 3:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY completion_registered\n        ADD CONSTRAINT completion_registered_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 4:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY course_alias\n        ADD CONSTRAINT course_alias_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 5:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY course_organization\n        ADD CONSTRAINT course_organization_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 6:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY course\n        ADD CONSTRAINT course_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 7:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY course_translation\n        ADD CONSTRAINT course_translation_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 8:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY course_variant\n        ADD CONSTRAINT course_variant_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 9:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY email_template\n        ADD CONSTRAINT email_template_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 10:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY exercise_completion\n        ADD CONSTRAINT exercise_completion_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 11:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY exercise_completion_required_actions\n        ADD CONSTRAINT exercise_completion_required_actions_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 12:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY exercise\n        ADD CONSTRAINT exercise_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 13:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY image\n        ADD CONSTRAINT image_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 14:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY open_university_registration_link\n        ADD CONSTRAINT open_university_registration_link_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 15:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY organization\n        ADD CONSTRAINT organization_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 16:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY organization_translation\n        ADD CONSTRAINT organization_translation_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 17:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY service\n        ADD CONSTRAINT service_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 18:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY study_module\n        ADD CONSTRAINT study_module_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 19:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY study_module_translation\n        ADD CONSTRAINT study_module_translation_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 20:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY user_course_progress\n        ADD CONSTRAINT user_course_progress_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 21:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY user_course_service_progress\n        ADD CONSTRAINT user_course_service_progress_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 22:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY user_course_settings_visibility\n        ADD CONSTRAINT user_course_settings_visibility_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 23:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY user_organization\n        ADD CONSTRAINT user_organization_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 24:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          'ALTER TABLE ONLY "user"\n        ADD CONSTRAINT user_pkey PRIMARY KEY (id);',
                        ),
                      ]
                    case 25:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY verified_user\n        ADD CONSTRAINT verified_user_pkey PRIMARY KEY (id);",
                        ),
                      ]
                    case 26:
                      _a.sent()
                      return [2 /*return*/]
                  }
                })
              })
            }),
          ]
        case 33:
          _c.sent()
          return [3 /*break*/, 35]
        case 34:
          _a = _c.sent()
          console.log(
            "Error adding primary key constraints. Probably because they already existed.",
          )
          return [3 /*break*/, 35]
        case 35:
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE UNIQUE INDEX IF NOT EXISTS "_CourseToService_AB_unique" ON "_CourseToService" USING btree ("A", "B");',
            ),
          ]
        case 36:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE INDEX IF NOT EXISTS "_CourseToService_B" ON "_CourseToService" USING btree ("B");',
            ),
          ]
        case 37:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE UNIQUE INDEX IF NOT EXISTS "_StudyModuleToCourse_AB_unique" ON "_StudyModuleToCourse" USING btree ("A", "B");',
            ),
          ]
        case 38:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE INDEX IF NOT EXISTS "_StudyModuleToCourse_B" ON "_StudyModuleToCourse" USING btree ("B");',
            ),
          ]
        case 39:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE UNIQUE INDEX IF NOT EXISTS "UserAppDatumConfig.name._UNIQUE" ON "UserAppDatumConfig" USING btree (name);',
            ),
          ]
        case 40:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE UNIQUE INDEX IF NOT EXISTS "course.slug._UNIQUE" ON course USING btree (slug);',
            ),
          ]
        case 41:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE UNIQUE INDEX IF NOT EXISTS "course_alias.course_code._UNIQUE" ON course_alias USING btree (course_code);',
            ),
          ]
        case 42:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE UNIQUE INDEX IF NOT EXISTS "organization.secret_key._UNIQUE" ON organization USING btree (secret_key);',
            ),
          ]
        case 43:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE UNIQUE INDEX IF NOT EXISTS "organization.slug._UNIQUE" ON organization USING btree (slug);',
            ),
          ]
        case 44:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE UNIQUE INDEX IF NOT EXISTS "study_module.slug._UNIQUE" ON study_module USING btree (slug);',
            ),
          ]
        case 45:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE UNIQUE INDEX IF NOT EXISTS "user.upstream_id._UNIQUE" ON "user" USING btree (upstream_id);',
            ),
          ]
        case 46:
          _c.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE UNIQUE INDEX IF NOT EXISTS "user.username._UNIQUE" ON "user" USING btree (username);',
            ),
          ]
        case 47:
          _c.sent()
          _c.label = 48
        case 48:
          _c.trys.push([48, 50, , 51])
          return [
            4 /*yield*/,
            knex.transaction(function (trx) {
              return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [
                        4 /*yield*/,
                        trx.raw(
                          'ALTER TABLE ONLY "UserCourseSettings"\n        ADD CONSTRAINT "UserCourseSettings_course_fkey" FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;',
                        ),
                      ]
                    case 1:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          'ALTER TABLE ONLY "UserCourseSettings"\n        ADD CONSTRAINT "UserCourseSettings_user_fkey" FOREIGN KEY ("user") REFERENCES "user"(id) ON DELETE SET NULL;',
                        ),
                      ]
                    case 2:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          'ALTER TABLE ONLY "_CourseToService"\n        ADD CONSTRAINT "_CourseToService_A_fkey" FOREIGN KEY ("A") REFERENCES course(id) ON DELETE CASCADE;',
                        ),
                      ]
                    case 3:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          'ALTER TABLE ONLY "_CourseToService"\n        ADD CONSTRAINT "_CourseToService_B_fkey" FOREIGN KEY ("B") REFERENCES service(id) ON DELETE CASCADE;',
                        ),
                      ]
                    case 4:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          'ALTER TABLE ONLY "_StudyModuleToCourse"\n        ADD CONSTRAINT "_StudyModuleToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES course(id) ON DELETE CASCADE;',
                        ),
                      ]
                    case 5:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          'ALTER TABLE ONLY "_StudyModuleToCourse"\n        ADD CONSTRAINT "_StudyModuleToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES study_module(id) ON DELETE CASCADE;',
                        ),
                      ]
                    case 6:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY completion\n        ADD CONSTRAINT completion_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 7:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY completion_registered\n        ADD CONSTRAINT completion_registered_completion_fkey FOREIGN KEY (completion) REFERENCES completion(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 8:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY completion_registered\n        ADD CONSTRAINT completion_registered_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 9:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY completion_registered\n        ADD CONSTRAINT completion_registered_organization_fkey FOREIGN KEY (organization) REFERENCES organization(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 10:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          'ALTER TABLE ONLY completion_registered\n        ADD CONSTRAINT completion_registered_user_fkey FOREIGN KEY ("user") REFERENCES "user"(id) ON DELETE SET NULL;',
                        ),
                      ]
                    case 11:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          'ALTER TABLE ONLY completion\n        ADD CONSTRAINT completion_user_fkey FOREIGN KEY ("user") REFERENCES "user"(id) ON DELETE SET NULL;',
                        ),
                      ]
                    case 12:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY course_alias\n        ADD CONSTRAINT course_alias_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 13:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY course\n        ADD CONSTRAINT course_completion_email_fkey FOREIGN KEY (completion_email) REFERENCES email_template(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 14:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY course\n        ADD CONSTRAINT course_completions_handled_by_fkey FOREIGN KEY (completions_handled_by) REFERENCES course(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 15:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY course\n        ADD CONSTRAINT course_inherit_settings_from_fkey FOREIGN KEY (inherit_settings_from) REFERENCES course(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 16:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY course_organization\n        ADD CONSTRAINT course_organization_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 17:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY course_organization\n        ADD CONSTRAINT course_organization_organization_fkey FOREIGN KEY (organization) REFERENCES organization(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 18:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY course\n        ADD CONSTRAINT course_owner_organization_fkey FOREIGN KEY (owner_organization) REFERENCES organization(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 19:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY course\n        ADD CONSTRAINT course_photo_fkey FOREIGN KEY (photo) REFERENCES image(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 20:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY course_translation\n        ADD CONSTRAINT course_translation_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 21:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY course_variant\n        ADD CONSTRAINT course_variant_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 22:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY email_delivery\n        ADD CONSTRAINT email_delivery_email_template_fkey FOREIGN KEY (email_template) REFERENCES email_template(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 23:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          'ALTER TABLE ONLY email_delivery\n        ADD CONSTRAINT email_delivery_user_fkey FOREIGN KEY ("user") REFERENCES "user"(id) ON DELETE SET NULL;',
                        ),
                      ]
                    case 24:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY exercise_completion\n        ADD CONSTRAINT exercise_completion_exercise_fkey FOREIGN KEY (exercise) REFERENCES exercise(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 25:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY exercise_completion_required_actions\n        ADD CONSTRAINT exercise_completion_required_actions_exercise_completion_fkey FOREIGN KEY (exercise_completion) REFERENCES exercise_completion(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 26:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          'ALTER TABLE ONLY exercise_completion\n        ADD CONSTRAINT exercise_completion_user_fkey FOREIGN KEY ("user") REFERENCES "user"(id) ON DELETE SET NULL;',
                        ),
                      ]
                    case 27:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY exercise\n        ADD CONSTRAINT exercise_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 28:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY exercise\n        ADD CONSTRAINT exercise_service_fkey FOREIGN KEY (service) REFERENCES service(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 29:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY open_university_registration_link\n        ADD CONSTRAINT open_university_registration_link_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 30:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          'ALTER TABLE ONLY organization\n        ADD CONSTRAINT organization_creator_fkey FOREIGN KEY (creator) REFERENCES "user"(id) ON DELETE SET NULL;',
                        ),
                      ]
                    case 31:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY organization_translation\n        ADD CONSTRAINT organization_translation_organization_fkey FOREIGN KEY (organization) REFERENCES organization(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 32:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY study_module_translation\n        ADD CONSTRAINT study_module_translation_study_module_fkey FOREIGN KEY (study_module) REFERENCES study_module(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 33:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY user_course_progress\n        ADD CONSTRAINT user_course_progress_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 34:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          'ALTER TABLE ONLY user_course_progress\n        ADD CONSTRAINT user_course_progress_user_fkey FOREIGN KEY ("user") REFERENCES "user"(id) ON DELETE SET NULL;',
                        ),
                      ]
                    case 35:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY user_course_service_progress\n        ADD CONSTRAINT user_course_service_progress_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 36:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY user_course_service_progress\n        ADD CONSTRAINT user_course_service_progress_service_fkey FOREIGN KEY (service) REFERENCES service(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 37:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY user_course_service_progress\n        ADD CONSTRAINT user_course_service_progress_user_course_progress_fkey FOREIGN KEY (user_course_progress) REFERENCES user_course_progress(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 38:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          'ALTER TABLE ONLY user_course_service_progress\n        ADD CONSTRAINT user_course_service_progress_user_fkey FOREIGN KEY ("user") REFERENCES "user"(id) ON DELETE SET NULL;',
                        ),
                      ]
                    case 39:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY user_course_settings_visibility\n        ADD CONSTRAINT user_course_settings_visibility_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 40:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY user_organization\n        ADD CONSTRAINT user_organization_organization_fkey FOREIGN KEY (organization) REFERENCES organization(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 41:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          'ALTER TABLE ONLY user_organization\n        ADD CONSTRAINT user_organization_user_fkey FOREIGN KEY ("user") REFERENCES "user"(id) ON DELETE SET NULL;',
                        ),
                      ]
                    case 42:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          "ALTER TABLE ONLY verified_user\n        ADD CONSTRAINT verified_user_organization_fkey FOREIGN KEY (organization) REFERENCES organization(id) ON DELETE SET NULL;",
                        ),
                      ]
                    case 43:
                      _a.sent()
                      return [
                        4 /*yield*/,
                        trx.raw(
                          'ALTER TABLE ONLY verified_user\n        ADD CONSTRAINT verified_user_user_fkey FOREIGN KEY ("user") REFERENCES "user"(id) ON DELETE SET NULL;',
                        ),
                      ]
                    case 44:
                      _a.sent()
                      return [2 /*return*/]
                  }
                })
              })
            }),
          ]
        case 49:
          _c.sent()
          return [3 /*break*/, 51]
        case 50:
          _b = _c.sent()
          console.log(
            "Error adding foreign key constraints. Probably because they existed already.",
          )
          return [3 /*break*/, 51]
        case 51:
          return [2 /*return*/]
      }
    })
  })
}
exports.up = up
function down(_knex) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      return [2 /*return*/]
    })
  })
}
exports.down = down
//# sourceMappingURL=19000101114728_create-table-schema.js.map
