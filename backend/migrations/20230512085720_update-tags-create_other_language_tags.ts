import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    insert into tag (id, hidden) values ('other_language', false) on conflict do nothing;
  `)
  await knex.raw(`
    insert into tag_type (name) values ('language') on conflict do nothing;
  `)
  await knex.raw(`
    insert into "_TagToTagType" ("A", "B") values ('other_language', 'language') 
      on conflict do nothing;
  `)
  await knex.raw(`
    insert into "_CourseToTag" ("A", "B")
    select c.id, 'other_language' from course c
        join "_CourseToTag" ctt on c.id = ctt."A"
        join tag on ctt."B" = tag.id
        join "_TagToTagType" ttt on tag.id = ttt."A"
        where ttt."B" = 'language'
        and tag.id not in ('en', 'fi', 'se')
    on conflict do nothing;
  `)
  await knex.raw(`
    insert into tag_translation (tag_id, language, name)
      values ('other_language', 'en_US', 'other language')
      on conflict do nothing;
  `)
  await knex.raw(`
    insert into tag_translation (tag_id, language, name)
      values ('other_language', 'fi_FI', 'muu kieli')
      on conflict do nothing;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    delete from tag_translation where tag_id = 'other_language';
  `)
  await knex.raw(`
    delete from "_CourseToTag" where "B" = 'other_language';
  `)
  await knex.raw(`
    delete from "_TagToTagType" where "A" = 'other_language';
  `)
  await knex.raw(`
    delete from tag where id = 'other_language';
  `)
}
