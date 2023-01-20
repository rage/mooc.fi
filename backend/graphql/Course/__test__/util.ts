export const courseInclude = {
  course_tags: {
    include: {
      tag: {
        include: {
          tag_types: true,
          tag_translations: true,
        },
      },
    },
  },
  course_translations: true,
  course_aliases: true,
  course_variants: true,
  exercises: true,
  completions_handled_by: true,
  handles_completions_for: true,
  inherit_settings_from: true,
  photo: true,
  open_university_registration_links: true,
  completion_email: true,
  course_stats_email: true,
  study_modules: {
    include: {
      study_module_translations: true,
    },
  },
  services: true,
}
