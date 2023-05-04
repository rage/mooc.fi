import { Knex } from "knex"

export async function up(knex: Knex): Promise<any> {
  await knex.raw(`CREATE TYPE course_status AS ENUM (
    'Active',
    'Ended',
    'Upcoming'
  );`)
  await knex.raw(`CREATE TYPE organization_role AS ENUM (
    'Teacher',
    'Student',
    'OrganizationAdmin'
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS "UserAppDatumConfig" (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    name text,
    "timestamp" timestamp(3) without time zone
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS "UserCourseSettings" (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    language text,
    country text,
    research boolean,
    marketing boolean,
    course_variant text,
    other text,
    "user" uuid,
    course uuid
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS "_CourseToService" (
    "A" uuid NOT NULL,
    "B" uuid NOT NULL
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS "_StudyModuleToCourse" (
    "A" uuid NOT NULL,
    "B" uuid NOT NULL
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS completion (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    user_upstream_id integer,
    email text NOT NULL,
    student_number text,
    completion_language text,
    grade text,
    certificate_id text,
    course uuid,
    "user" uuid,
    eligible_for_ects boolean DEFAULT true
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS completion_registered (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    real_student_number text NOT NULL,
    "user" uuid,
    completion uuid,
    course uuid,
    organization uuid
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS course (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    teacher_in_charge_name text NOT NULL,
    teacher_in_charge_email text NOT NULL,
    support_email text,
    start_date text NOT NULL,
    end_date text,
    name text NOT NULL,
    slug text NOT NULL,
    ects text,
    promote boolean,
    status course_status DEFAULT 'Upcoming'::course_status,
    start_point boolean,
    hidden boolean,
    study_module_start_point boolean,
    "order" integer,
    study_module_order integer,
    automatic_completions boolean DEFAULT false,
    points_needed integer,
    exercise_completions_needed integer,
    has_certificate boolean DEFAULT false,
    owner_organization uuid,
    completion_email uuid,
    inherit_settings_from uuid,
    completions_handled_by uuid,
    photo uuid,
    automatic_completions_eligible_for_ects boolean DEFAULT true
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS course_alias (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    course_code text NOT NULL,
    course uuid
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS course_organization (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    creator boolean,
    course uuid,
    organization uuid
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS course_translation (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    name text NOT NULL,
    language text NOT NULL,
    description text NOT NULL,
    link text,
    course uuid
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS course_variant (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    slug text NOT NULL,
    description text,
    course uuid
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS email_delivery (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    sent boolean DEFAULT false NOT NULL,
    error boolean DEFAULT false NOT NULL,
    error_message text,
    "user" uuid,
    email_template uuid
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS email_template (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    name text,
    txt_body text,
    html_body text,
    title text
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS exercise (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    custom_id text NOT NULL,
    name text,
    part integer,
    section integer,
    max_points integer,
    "timestamp" timestamp(3) without time zone,
    deleted boolean DEFAULT false,
    service uuid,
    course uuid
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS exercise_completion (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    n_points numeric(65,30),
    "timestamp" timestamp(3) without time zone NOT NULL,
    completed boolean DEFAULT false,
    "user" uuid,
    exercise uuid
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS exercise_completion_required_actions (
    id uuid NOT NULL,
    value text NOT NULL,
    exercise_completion uuid
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS image (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    name text,
    original text NOT NULL,
    original_mimetype text NOT NULL,
    uncompressed text NOT NULL,
    uncompressed_mimetype text NOT NULL,
    compressed text,
    compressed_mimetype text,
    encoding text,
    "default" boolean
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS open_university_registration_link (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    course_code text NOT NULL,
    language text NOT NULL,
    link text,
    start_date timestamp(3) without time zone,
    stop_date timestamp(3) without time zone,
    course uuid
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS organization (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    slug text NOT NULL,
    verified_at timestamp(3) without time zone,
    verified boolean,
    disabled boolean,
    hidden boolean,
    tmc_created_at timestamp(3) without time zone,
    tmc_updated_at timestamp(3) without time zone,
    logo_file_name text,
    logo_content_type text,
    logo_file_size integer,
    logo_updated_at timestamp(3) without time zone,
    phone text,
    contact_information text,
    email text,
    website text,
    pinned boolean,
    secret_key text NOT NULL,
    creator uuid
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS organization_translation (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    language text NOT NULL,
    name text NOT NULL,
    disabled_reason text,
    information text,
    organization uuid
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS service (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    url text NOT NULL,
    name text NOT NULL
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS study_module (
    id uuid NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    image text,
    "order" integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS study_module_translation (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    name text NOT NULL,
    language text NOT NULL,
    description text NOT NULL,
    study_module uuid
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS "user" (
    id uuid NOT NULL,
    upstream_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    first_name text,
    last_name text,
    username text NOT NULL,
    email text NOT NULL,
    administrator boolean NOT NULL,
    student_number text,
    real_student_number text,
    research_consent boolean
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS user_course_progress (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    progress json NOT NULL,
    max_points numeric(65,30),
    n_points numeric(65,30),
    "user" uuid,
    course uuid
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS user_course_service_progress (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    progress json NOT NULL,
    "timestamp" timestamp(3) without time zone,
    service uuid,
    "user" uuid,
    course uuid,
    user_course_progress uuid
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS user_course_settings_visibility (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    language text NOT NULL,
    course uuid
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS user_organization (
    id uuid NOT NULL,
    role organization_role DEFAULT 'Student'::organization_role,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    organization uuid,
    "user" uuid
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS verified_user (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone,
    display_name text,
    personal_unique_code text NOT NULL,
    organization uuid,
    "user" uuid
  );`)

  try {
    await knex.transaction(async (trx) => {
      await trx.raw(`ALTER TABLE ONLY "UserAppDatumConfig" 
        ADD CONSTRAINT "UserAppDatumConfig_pkey" PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY "UserCourseSettings"
        ADD CONSTRAINT "UserCourseSettings_pkey" PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY completion
        ADD CONSTRAINT completion_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY completion_registered
        ADD CONSTRAINT completion_registered_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY course_alias
        ADD CONSTRAINT course_alias_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY course_organization
        ADD CONSTRAINT course_organization_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY course
        ADD CONSTRAINT course_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY course_translation
        ADD CONSTRAINT course_translation_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY course_variant
        ADD CONSTRAINT course_variant_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY email_template
        ADD CONSTRAINT email_template_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY exercise_completion
        ADD CONSTRAINT exercise_completion_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY exercise_completion_required_actions
        ADD CONSTRAINT exercise_completion_required_actions_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY exercise
        ADD CONSTRAINT exercise_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY image
        ADD CONSTRAINT image_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY open_university_registration_link
        ADD CONSTRAINT open_university_registration_link_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY organization
        ADD CONSTRAINT organization_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY organization_translation
        ADD CONSTRAINT organization_translation_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY service
        ADD CONSTRAINT service_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY study_module
        ADD CONSTRAINT study_module_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY study_module_translation
        ADD CONSTRAINT study_module_translation_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY user_course_progress
        ADD CONSTRAINT user_course_progress_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY user_course_service_progress
        ADD CONSTRAINT user_course_service_progress_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY user_course_settings_visibility
        ADD CONSTRAINT user_course_settings_visibility_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY user_organization
        ADD CONSTRAINT user_organization_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY "user"
        ADD CONSTRAINT user_pkey PRIMARY KEY (id);`)
      await trx.raw(`ALTER TABLE ONLY verified_user
        ADD CONSTRAINT verified_user_pkey PRIMARY KEY (id);`)
    })
  } catch {
    console.log(
      "Error adding primary key constraints. Probably because they already existed.",
    )
  }

  await knex.raw(
    `CREATE UNIQUE INDEX IF NOT EXISTS "_CourseToService_AB_unique" ON "_CourseToService" USING btree ("A", "B");`,
  )
  await knex.raw(
    `CREATE INDEX IF NOT EXISTS "_CourseToService_B" ON "_CourseToService" USING btree ("B");`,
  )
  await knex.raw(
    `CREATE UNIQUE INDEX IF NOT EXISTS "_StudyModuleToCourse_AB_unique" ON "_StudyModuleToCourse" USING btree ("A", "B");`,
  )
  await knex.raw(
    `CREATE INDEX IF NOT EXISTS "_StudyModuleToCourse_B" ON "_StudyModuleToCourse" USING btree ("B");`,
  )
  await knex.raw(
    `CREATE UNIQUE INDEX IF NOT EXISTS "UserAppDatumConfig.name._UNIQUE" ON "UserAppDatumConfig" USING btree (name);`,
  )
  await knex.raw(
    `CREATE UNIQUE INDEX IF NOT EXISTS "course.slug._UNIQUE" ON course USING btree (slug);`,
  )
  await knex.raw(
    `CREATE UNIQUE INDEX IF NOT EXISTS "course_alias.course_code._UNIQUE" ON course_alias USING btree (course_code);`,
  )
  await knex.raw(
    `CREATE UNIQUE INDEX IF NOT EXISTS "organization.secret_key._UNIQUE" ON organization USING btree (secret_key);`,
  )
  await knex.raw(
    `CREATE UNIQUE INDEX IF NOT EXISTS "organization.slug._UNIQUE" ON organization USING btree (slug);`,
  )
  await knex.raw(
    `CREATE UNIQUE INDEX IF NOT EXISTS "study_module.slug._UNIQUE" ON study_module USING btree (slug);`,
  )
  await knex.raw(
    `CREATE UNIQUE INDEX IF NOT EXISTS "user.upstream_id._UNIQUE" ON "user" USING btree (upstream_id);`,
  )
  await knex.raw(
    `CREATE UNIQUE INDEX IF NOT EXISTS "user.username._UNIQUE" ON "user" USING btree (username);`,
  )

  try {
    await knex.transaction(async (trx) => {
      await trx.raw(`ALTER TABLE ONLY "UserCourseSettings"
        ADD CONSTRAINT "UserCourseSettings_course_fkey" FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY "UserCourseSettings"
        ADD CONSTRAINT "UserCourseSettings_user_fkey" FOREIGN KEY ("user") REFERENCES "user"(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY "_CourseToService"
        ADD CONSTRAINT "_CourseToService_A_fkey" FOREIGN KEY ("A") REFERENCES course(id) ON DELETE CASCADE;`)
      await trx.raw(`ALTER TABLE ONLY "_CourseToService"
        ADD CONSTRAINT "_CourseToService_B_fkey" FOREIGN KEY ("B") REFERENCES service(id) ON DELETE CASCADE;`)
      await trx.raw(`ALTER TABLE ONLY "_StudyModuleToCourse"
        ADD CONSTRAINT "_StudyModuleToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES course(id) ON DELETE CASCADE;`)
      await trx.raw(`ALTER TABLE ONLY "_StudyModuleToCourse"
        ADD CONSTRAINT "_StudyModuleToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES study_module(id) ON DELETE CASCADE;`)
      await trx.raw(`ALTER TABLE ONLY completion
        ADD CONSTRAINT completion_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY completion_registered
        ADD CONSTRAINT completion_registered_completion_fkey FOREIGN KEY (completion) REFERENCES completion(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY completion_registered
        ADD CONSTRAINT completion_registered_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY completion_registered
        ADD CONSTRAINT completion_registered_organization_fkey FOREIGN KEY (organization) REFERENCES organization(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY completion_registered
        ADD CONSTRAINT completion_registered_user_fkey FOREIGN KEY ("user") REFERENCES "user"(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY completion
        ADD CONSTRAINT completion_user_fkey FOREIGN KEY ("user") REFERENCES "user"(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY course_alias
        ADD CONSTRAINT course_alias_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY course
        ADD CONSTRAINT course_completion_email_fkey FOREIGN KEY (completion_email) REFERENCES email_template(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY course
        ADD CONSTRAINT course_completions_handled_by_fkey FOREIGN KEY (completions_handled_by) REFERENCES course(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY course
        ADD CONSTRAINT course_inherit_settings_from_fkey FOREIGN KEY (inherit_settings_from) REFERENCES course(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY course_organization
        ADD CONSTRAINT course_organization_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY course_organization
        ADD CONSTRAINT course_organization_organization_fkey FOREIGN KEY (organization) REFERENCES organization(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY course
        ADD CONSTRAINT course_owner_organization_fkey FOREIGN KEY (owner_organization) REFERENCES organization(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY course
        ADD CONSTRAINT course_photo_fkey FOREIGN KEY (photo) REFERENCES image(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY course_translation
        ADD CONSTRAINT course_translation_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY course_variant
        ADD CONSTRAINT course_variant_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY email_delivery
        ADD CONSTRAINT email_delivery_email_template_fkey FOREIGN KEY (email_template) REFERENCES email_template(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY email_delivery
        ADD CONSTRAINT email_delivery_user_fkey FOREIGN KEY ("user") REFERENCES "user"(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY exercise_completion
        ADD CONSTRAINT exercise_completion_exercise_fkey FOREIGN KEY (exercise) REFERENCES exercise(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY exercise_completion_required_actions
        ADD CONSTRAINT exercise_completion_required_actions_exercise_completion_fkey FOREIGN KEY (exercise_completion) REFERENCES exercise_completion(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY exercise_completion
        ADD CONSTRAINT exercise_completion_user_fkey FOREIGN KEY ("user") REFERENCES "user"(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY exercise
        ADD CONSTRAINT exercise_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY exercise
        ADD CONSTRAINT exercise_service_fkey FOREIGN KEY (service) REFERENCES service(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY open_university_registration_link
        ADD CONSTRAINT open_university_registration_link_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY organization
        ADD CONSTRAINT organization_creator_fkey FOREIGN KEY (creator) REFERENCES "user"(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY organization_translation
        ADD CONSTRAINT organization_translation_organization_fkey FOREIGN KEY (organization) REFERENCES organization(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY study_module_translation
        ADD CONSTRAINT study_module_translation_study_module_fkey FOREIGN KEY (study_module) REFERENCES study_module(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY user_course_progress
        ADD CONSTRAINT user_course_progress_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY user_course_progress
        ADD CONSTRAINT user_course_progress_user_fkey FOREIGN KEY ("user") REFERENCES "user"(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY user_course_service_progress
        ADD CONSTRAINT user_course_service_progress_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY user_course_service_progress
        ADD CONSTRAINT user_course_service_progress_service_fkey FOREIGN KEY (service) REFERENCES service(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY user_course_service_progress
        ADD CONSTRAINT user_course_service_progress_user_course_progress_fkey FOREIGN KEY (user_course_progress) REFERENCES user_course_progress(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY user_course_service_progress
        ADD CONSTRAINT user_course_service_progress_user_fkey FOREIGN KEY ("user") REFERENCES "user"(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY user_course_settings_visibility
        ADD CONSTRAINT user_course_settings_visibility_course_fkey FOREIGN KEY (course) REFERENCES course(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY user_organization
        ADD CONSTRAINT user_organization_organization_fkey FOREIGN KEY (organization) REFERENCES organization(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY user_organization
        ADD CONSTRAINT user_organization_user_fkey FOREIGN KEY ("user") REFERENCES "user"(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY verified_user
        ADD CONSTRAINT verified_user_organization_fkey FOREIGN KEY (organization) REFERENCES organization(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY verified_user
        ADD CONSTRAINT verified_user_user_fkey FOREIGN KEY ("user") REFERENCES "user"(id) ON DELETE SET NULL;`)
    })
  } catch {
    console.log(
      "Error adding foreign key constraints. Probably because they existed already.",
    )
  }
}

export async function down(_knex: Knex): Promise<any> {
  return
}
