import { Knex } from "knex"

const tags = [
  {
    id: "en",
    tag_translations: [
      { language: "fi_FI", name: "englanti" },
      { language: "en_US", name: "English" },
    ],
  },
  {
    id: "fi",
    tag_translations: [
      { language: "fi_FI", name: "suomi" },
      { language: "en_US", name: "Finnish" },
    ],
  },
  {
    id: "se",
    tag_translations: [
      { language: "fi_FI", name: "ruotsi" },
      { language: "en_US", name: "Swedish" },
    ],
  },
  /*{
    id: 'sv',
    tag_translations: [
      { language: 'fi_FI', name: '<update me>' },
      { language: 'en_US', name: 'Swedish' }
    ]
  },*/
  {
    id: "ee",
    tag_translations: [
      { language: "fi_FI", name: "viro" },
      { language: "en_US", name: "Estonian" },
    ],
  },
  {
    id: "de",
    tag_translations: [
      { language: "fi_FI", name: "saksa" },
      { language: "en_US", name: "German" },
    ],
  },
  {
    id: "no",
    tag_translations: [
      { language: "fi_FI", name: "norja" },
      { language: "en_US", name: "Norwegian" },
    ],
  },
  {
    id: "lv",
    tag_translations: [
      { language: "fi_FI", name: "latvia" },
      { language: "en_US", name: "Latvian" },
    ],
  },
  {
    id: "lt",
    tag_translations: [
      { language: "fi_FI", name: "liettua" },
      { language: "en_US", name: "Lithuanian" },
    ],
  },
  {
    id: "fr",
    tag_translations: [
      { language: "fi_FI", name: "ranska" },
      { language: "en_US", name: "French" },
    ],
  },
  {
    id: "fr-be",
    tag_translations: [
      { language: "fi_FI", name: "ranska (Belgia)" },
      { language: "en_US", name: "French (Belgium)" },
    ],
  },
  {
    id: "nl-be",
    tag_translations: [
      { language: "fi_FI", name: "hollanti (Belgia)" },
      { language: "en_US", name: "Dutch (Belgium)" },
    ],
  },
  {
    id: "mt",
    tag_translations: [
      { language: "fi_FI", name: "malta" },
      { language: "en_US", name: "Maltan" },
    ],
  },
  {
    id: "en-ie",
    tag_translations: [
      { language: "fi_FI", name: "englanti (Irlanti)" },
      { language: "en_US", name: "English (Ireland)" },
    ],
  },
  {
    id: "pl",
    tag_translations: [
      { language: "fi_FI", name: "puola" },
      { language: "en_US", name: "Polish" },
    ],
  },
  {
    id: "hr",
    tag_translations: [
      { language: "fi_FI", name: "kroatia" },
      { language: "en_US", name: "Croatian" },
    ],
  },
  {
    id: "ro",
    tag_translations: [
      { language: "fi_FI", name: "romania" },
      { language: "en_US", name: "Romanian" },
    ],
  },
  {
    id: "da",
    tag_translations: [
      { language: "fi_FI", name: "tanska" },
      { language: "en_US", name: "Danish" },
    ],
  },
  {
    id: "it",
    tag_translations: [
      { language: "fi_FI", name: "italia" },
      { language: "en_US", name: "Italian" },
    ],
  },
  {
    id: "cs",
    tag_translations: [
      { language: "fi_FI", name: "tšekki" },
      { language: "en_US", name: "Czech" },
    ],
  },
  {
    id: "bg",
    tag_translations: [
      { language: "fi_FI", name: "bulgaria" },
      { language: "en_US", name: "Bulgarian" },
    ],
  },
  {
    id: "en-lu",
    tag_translations: [
      { language: "fi_FI", name: "englanti (Luxemburg)" },
      { language: "en_US", name: "English (Luxembourg)" },
    ],
  },
  {
    id: "sk",
    tag_translations: [
      { language: "fi_FI", name: "slovakki" },
      { language: "en_US", name: "Slovak" },
    ],
  },
  {
    id: "nl",
    tag_translations: [
      { language: "fi_FI", name: "hollanti (Alankomaat)" },
      { language: "en_US", name: "Dutch (Netherlands)" },
    ],
  },
  {
    id: "pt",
    tag_translations: [
      { language: "fi_FI", name: "portugali" },
      { language: "en_US", name: "Portuguese" },
    ],
  },
  {
    id: "de-at",
    tag_translations: [
      { language: "fi_FI", name: "saksa (Itävalta)" },
      { language: "en_US", name: "German (Austria)" },
    ],
  },
  {
    id: "el",
    tag_translations: [
      { language: "fi_FI", name: "kreikka" },
      { language: "en_US", name: "Greek" },
    ],
  },
  {
    id: "es",
    tag_translations: [
      { language: "fi_FI", name: "espanja" },
      { language: "en_US", name: "Spanish" },
    ],
  },
  {
    id: "sl",
    tag_translations: [
      { language: "fi_FI", name: "sloveeni" },
      { language: "en_US", name: "Slovenian" },
    ],
  },
  {
    id: "is",
    tag_translations: [
      { language: "fi_FI", name: "islanti" },
      { language: "en_US", name: "Icelandic" },
    ],
  },
  {
    id: "ga",
    tag_translations: [
      { language: "fi_FI", name: "iiri" },
      { language: "en_US", name: "Irish" },
    ],
  },
  {
    id: "el-cy",
    tag_translations: [
      { language: "fi_FI", name: "kreikka (Kypros)" },
      { language: "en_US", name: "Greek (Cyprus)" },
    ],
  },
]

export async function up(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV === "test") {
    return
  }

  try {
    for (const tag of tags) {
      await knex("tag")
        .insert({
          id: tag.id,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .onConflict("id")
        .ignore()
      await knex("_TagToTagType")
        .insert({
          A: tag.id,
          B: "language",
        })
        .onConflict()
        .ignore()
      await knex("tag_translation")
        .insert(
          tag.tag_translations.map((tt) => ({
            ...tt,
            tag_id: tag.id,
            created_at: new Date(),
            updated_at: new Date(),
          })),
        )
        .onConflict(["tag_id", "language"])
        .ignore()
        .onConflict(["name", "language"])
        .ignore()
    }
  } catch (err) {
    console.log("Error seeding language tags:", err)
  }

  try {
    await knex.raw(`
      DELETE FROM tag WHERE id IN ('fi_FI', 'en_US');
    `)
  } catch (err) {
    console.log("Error deleting old language tags:", err)
  }
}

export async function down(knex: Knex): Promise<void> {
  try {
    await knex.raw(`
      INSERT INTO tag (id, created_at, updated_at)
        VALUES ('fi_FI', NOW(), NOW()), ('en_US', NOW(), NOW());
    `)
    await knex.raw(`
      UPDATE "tag_translation" SET tag_id = 'fi_FI' WHERE tag_id = 'fi';
      UPDATE "tag_translation" SET tag_id = 'en_US' WHERE tag_id = 'en';
    `)
    await knex.raw(`
      UPDATE "_TagToTagType" SET "A" = 'fi_FI' WHERE "A" = 'fi' AND "B" = 'language';
      UPDATE "_TagToTagType" SET "A" = 'en_US' WHERE "A" = 'en' AND "B" = 'language';
    `)
    await knex.raw(`
      DELETE FROM tag WHERE id IN ('fi', 'en');
    `)
  } catch (err) {
    console.log("Error rolling back language tags:", err)
  }
  // again, might be risky for manually added tags
  /*try {
    for (const tag of tags) {
      await knex("tag")
        .where({ id: tag.id })
        .del()
    }
  } catch (err) {
    console.log("Error rolling back language tags:", err)
  }*/
}
