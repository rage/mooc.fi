import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV === "test") {
    return
  }

  try {
    await knex.transaction(async (trx) => {
      await trx.raw(`
      INSERT INTO tag_type (name, created_at, updated_at)
        VALUES ('language', now(), now());
      INSERT INTO tag_type (name, created_at, updated_at)
        VALUES ('difficulty', now(), now());
      INSERT INTO tag_type (name, created_at, updated_at)
        VALUES ('module', now(), now());
    `)
    })
  } catch {
    // tag_types already exist
  }

  try {
    await knex.transaction(async (trx) => {
      await trx.raw(`
      INSERT INTO tag (id, created_at, updated_at)
        VALUES ('fi_FI', now(), now());
      INSERT INTO tag (id, created_at, updated_at)
        VALUES ('en_US', now(), now());
      INSERT INTO "_TagToTagType" ("A", "B")
        VALUES ('fi_FI', 'language');
      INSERT INTO "_TagToTagType" ("A", "B")
        VALUES ('en_US', 'language');      
      INSERT INTO tag_translation (tag_id, language, name, created_at, updated_at)
        VALUES ('fi_FI', 'fi_FI', 'suomi', now(), now());
      INSERT INTO tag_translation (tag_id, language, name, created_at, updated_at)
        VALUES ('fi_FI', 'en_US', 'Finnish', now(), now());
      INSERT INTO tag_translation (tag_id, language, name, created_at, updated_at)
        VALUES ('en_US', 'fi_FI', 'englanti', now(), now());
      INSERT INTO tag_translation (tag_id, language, name, created_at, updated_at)
        VALUES ('en_US', 'en_US', 'English', now(), now());
  `)
    })
  } catch {
    // language tags already exist
  }

  try {
    await knex.transaction(async (trx) => {
      await trx.raw(`
        INSERT INTO tag (id, created_at, updated_at)
          VALUES ('beginner', now(), now());
        INSERT INTO tag (id, created_at, updated_at)
          VALUES ('intermediate', now(), now());
        INSERT INTO tag (id, created_at, updated_at)
          VALUES ('advanced', now(), now());
        INSERT INTO "_TagToTagType" ("A", "B")
          VALUES ('beginner', 'difficulty');
        INSERT INTO "_TagToTagType" ("A", "B")
          VALUES ('intermediate', 'difficulty');
        INSERT INTO "_TagToTagType" ("A", "B")
          VALUES ('advanced', 'difficulty');
        INSERT INTO tag_translation (tag_id, language, name, created_at, updated_at)
          VALUES ('beginner', 'fi_FI', 'aloittelija', now(), now());
        INSERT INTO tag_translation (tag_id, language, name, created_at, updated_at)
          VALUES ('beginner', 'en_US', 'beginner', now(), now());
        INSERT INTO tag_translation (tag_id, language, name, created_at, updated_at)
          VALUES ('intermediate', 'fi_FI', 'keskitaso', now(), now());
        INSERT INTO tag_translation (tag_id, language, name, created_at, updated_at)
          VALUES ('intermediate', 'en_US', 'intermediate', now(), now());
        INSERT INTO tag_translation (tag_id, language, name, created_at, updated_at)
          VALUES ('advanced', 'fi_FI', 'edistynyt', now(), now());
        INSERT INTO tag_translation (tag_id, language, name, created_at, updated_at)
          VALUES ('advanced', 'en_US', 'advanced', now(), now());  
      `)
    })
  } catch {
    // difficulty tags already exist
  }

  try {
    await knex.transaction(async (trx) => {
      await trx.raw(`
        INSERT INTO tag (id, created_at, updated_at)
          SELECT slug, now(), now()
            FROM study_module;
        INSERT INTO "_TagToTagType" ("A", "B")
          SELECT slug, 'module'
            FROM study_module;
        INSERT INTO tag_translation (tag_id, language, name, created_at, updated_at)
          SELECT s.slug, st.language, st.name, now(), now()
            FROM study_module_translation st
            JOIN study_module s ON s.id = st.study_module_id;
       `)
    })
  } catch {
    // module tags already exist
  }

  try {
    await knex.transaction(async (trx) => {
      await trx.raw(`
        INSERT INTO course_tag (course_id, tag_id, created_at, updated_at)
        SELECT ct.course_id, 'en_US', now(), now()
          FROM course_translation ct
          WHERE ct.language = 'en_US'
          AND ct.course_id IS NOT NULL;
        `)
      await trx.raw(`
        INSERT INTO course_tag (course_id, tag_id, created_at, updated_at)
        SELECT ct.course_id, 'fi_FI', now(), now()
          FROM course_translation ct
          WHERE ct.language = 'fi_FI'
          AND ct.course_id IS NOT NULL;
      `)
    })
  } catch {
    // course language tags already exist
  }

  try {
    await knex.raw(`
        INSERT INTO course_tag (course_id, tag_id, created_at, updated_at)
        SELECT c.id, s.slug, now(), now()
          FROM "_study_module_to_course" smc
          JOIN course c ON c.id = smc."A"
          JOIN study_module s ON s.id = smc."B";
    `)
  } catch {
    // course module tags already exist
  }
}

// @ts-ignore: commented out
export async function down(knex: Knex): Promise<void> {
  return
  // might be risky for manually added tags
  /*if (process.env.NODE_ENV !== 'production') {
    await knex.raw(`
      DELETE FROM course_tag;
    `)
    await knex.raw(`
      DELETE FROM tag_translation;
    `)
    await knex.raw(`
      DELETE FROM "_TagToTagType";
    `)
    await knex.raw(`
      DELETE FROM tag;
    `)
    await knex.raw(`
      DELETE FROM tag_type;
    `)  
  }*/
}
