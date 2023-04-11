import {
  FieldPolicy,
  FieldReadFunction,
  TypePolicies,
  TypePolicy,
} from "@apollo/client/cache"

export type AbEnrollmentKeySpecifier = (
  | "ab_study"
  | "ab_study_id"
  | "created_at"
  | "group"
  | "id"
  | "updated_at"
  | "user"
  | "user_id"
  | AbEnrollmentKeySpecifier
)[]
export type AbEnrollmentFieldPolicy = {
  ab_study?: FieldPolicy<any> | FieldReadFunction<any>
  ab_study_id?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  group?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
  user?: FieldPolicy<any> | FieldReadFunction<any>
  user_id?: FieldPolicy<any> | FieldReadFunction<any>
}
export type AbStudyKeySpecifier = (
  | "ab_enrollments"
  | "created_at"
  | "group_count"
  | "id"
  | "name"
  | "updated_at"
  | AbStudyKeySpecifier
)[]
export type AbStudyFieldPolicy = {
  ab_enrollments?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  group_count?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  name?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
}
export type CertificateAvailabilityKeySpecifier = (
  | "completed_course"
  | "existing_certificate"
  | "honors"
  | CertificateAvailabilityKeySpecifier
)[]
export type CertificateAvailabilityFieldPolicy = {
  completed_course?: FieldPolicy<any> | FieldReadFunction<any>
  existing_certificate?: FieldPolicy<any> | FieldReadFunction<any>
  honors?: FieldPolicy<any> | FieldReadFunction<any>
}
export type CompletionKeySpecifier = (
  | "certificate_availability"
  | "certificate_id"
  | "completion_date"
  | "completion_language"
  | "completion_link"
  | "completion_registration_attempt_date"
  | "completions_registered"
  | "course"
  | "course_id"
  | "created_at"
  | "eligible_for_ects"
  | "email"
  | "grade"
  | "id"
  | "project_completion"
  | "registered"
  | "student_number"
  | "tier"
  | "updated_at"
  | "user"
  | "user_id"
  | "user_upstream_id"
  | CompletionKeySpecifier
)[]
export type CompletionFieldPolicy = {
  certificate_availability?: FieldPolicy<any> | FieldReadFunction<any>
  certificate_id?: FieldPolicy<any> | FieldReadFunction<any>
  completion_date?: FieldPolicy<any> | FieldReadFunction<any>
  completion_language?: FieldPolicy<any> | FieldReadFunction<any>
  completion_link?: FieldPolicy<any> | FieldReadFunction<any>
  completion_registration_attempt_date?:
    | FieldPolicy<any>
    | FieldReadFunction<any>
  completions_registered?: FieldPolicy<any> | FieldReadFunction<any>
  course?: FieldPolicy<any> | FieldReadFunction<any>
  course_id?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  eligible_for_ects?: FieldPolicy<any> | FieldReadFunction<any>
  email?: FieldPolicy<any> | FieldReadFunction<any>
  grade?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  project_completion?: FieldPolicy<any> | FieldReadFunction<any>
  registered?: FieldPolicy<any> | FieldReadFunction<any>
  student_number?: FieldPolicy<any> | FieldReadFunction<any>
  tier?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
  user?: FieldPolicy<any> | FieldReadFunction<any>
  user_id?: FieldPolicy<any> | FieldReadFunction<any>
  user_upstream_id?: FieldPolicy<any> | FieldReadFunction<any>
}
export type CompletionEdgeKeySpecifier = (
  | "cursor"
  | "node"
  | CompletionEdgeKeySpecifier
)[]
export type CompletionEdgeFieldPolicy = {
  cursor?: FieldPolicy<any> | FieldReadFunction<any>
  node?: FieldPolicy<any> | FieldReadFunction<any>
}
export type CompletionRegisteredKeySpecifier = (
  | "completion"
  | "completion_id"
  | "course"
  | "course_id"
  | "created_at"
  | "id"
  | "organization"
  | "organization_id"
  | "real_student_number"
  | "registration_date"
  | "updated_at"
  | "user"
  | "user_id"
  | CompletionRegisteredKeySpecifier
)[]
export type CompletionRegisteredFieldPolicy = {
  completion?: FieldPolicy<any> | FieldReadFunction<any>
  completion_id?: FieldPolicy<any> | FieldReadFunction<any>
  course?: FieldPolicy<any> | FieldReadFunction<any>
  course_id?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  organization?: FieldPolicy<any> | FieldReadFunction<any>
  organization_id?: FieldPolicy<any> | FieldReadFunction<any>
  real_student_number?: FieldPolicy<any> | FieldReadFunction<any>
  registration_date?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
  user?: FieldPolicy<any> | FieldReadFunction<any>
  user_id?: FieldPolicy<any> | FieldReadFunction<any>
}
export type CourseKeySpecifier = (
  | "automatic_completions"
  | "automatic_completions_eligible_for_ects"
  | "completion_email"
  | "completion_email_id"
  | "completions"
  | "completions_handled_by"
  | "completions_handled_by_id"
  | "course_aliases"
  | "course_organizations"
  | "course_stats_email"
  | "course_stats_email_id"
  | "course_translations"
  | "course_variants"
  | "created_at"
  | "description"
  | "ects"
  | "end_date"
  | "exercise_completions_needed"
  | "exercises"
  | "handles_completions_for"
  | "has_certificate"
  | "hidden"
  | "id"
  | "inherit_settings_from"
  | "inherit_settings_from_id"
  | "instructions"
  | "language"
  | "link"
  | "name"
  | "open_university_registration_links"
  | "order"
  | "owner_organization"
  | "owner_organization_id"
  | "photo"
  | "photo_id"
  | "points_needed"
  | "promote"
  | "services"
  | "slug"
  | "start_date"
  | "start_point"
  | "status"
  | "study_module_order"
  | "study_module_start_point"
  | "study_modules"
  | "support_email"
  | "tags"
  | "teacher_in_charge_email"
  | "teacher_in_charge_name"
  | "tier"
  | "upcoming_active_link"
  | "updated_at"
  | "user_course_settings_visibilities"
  | CourseKeySpecifier
)[]
export type CourseFieldPolicy = {
  automatic_completions?: FieldPolicy<any> | FieldReadFunction<any>
  automatic_completions_eligible_for_ects?:
    | FieldPolicy<any>
    | FieldReadFunction<any>
  completion_email?: FieldPolicy<any> | FieldReadFunction<any>
  completion_email_id?: FieldPolicy<any> | FieldReadFunction<any>
  completions?: FieldPolicy<any> | FieldReadFunction<any>
  completions_handled_by?: FieldPolicy<any> | FieldReadFunction<any>
  completions_handled_by_id?: FieldPolicy<any> | FieldReadFunction<any>
  course_aliases?: FieldPolicy<any> | FieldReadFunction<any>
  course_organizations?: FieldPolicy<any> | FieldReadFunction<any>
  course_stats_email?: FieldPolicy<any> | FieldReadFunction<any>
  course_stats_email_id?: FieldPolicy<any> | FieldReadFunction<any>
  course_translations?: FieldPolicy<any> | FieldReadFunction<any>
  course_variants?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  description?: FieldPolicy<any> | FieldReadFunction<any>
  ects?: FieldPolicy<any> | FieldReadFunction<any>
  end_date?: FieldPolicy<any> | FieldReadFunction<any>
  exercise_completions_needed?: FieldPolicy<any> | FieldReadFunction<any>
  exercises?: FieldPolicy<any> | FieldReadFunction<any>
  handles_completions_for?: FieldPolicy<any> | FieldReadFunction<any>
  has_certificate?: FieldPolicy<any> | FieldReadFunction<any>
  hidden?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  inherit_settings_from?: FieldPolicy<any> | FieldReadFunction<any>
  inherit_settings_from_id?: FieldPolicy<any> | FieldReadFunction<any>
  instructions?: FieldPolicy<any> | FieldReadFunction<any>
  language?: FieldPolicy<any> | FieldReadFunction<any>
  link?: FieldPolicy<any> | FieldReadFunction<any>
  name?: FieldPolicy<any> | FieldReadFunction<any>
  open_university_registration_links?: FieldPolicy<any> | FieldReadFunction<any>
  order?: FieldPolicy<any> | FieldReadFunction<any>
  owner_organization?: FieldPolicy<any> | FieldReadFunction<any>
  owner_organization_id?: FieldPolicy<any> | FieldReadFunction<any>
  photo?: FieldPolicy<any> | FieldReadFunction<any>
  photo_id?: FieldPolicy<any> | FieldReadFunction<any>
  points_needed?: FieldPolicy<any> | FieldReadFunction<any>
  promote?: FieldPolicy<any> | FieldReadFunction<any>
  services?: FieldPolicy<any> | FieldReadFunction<any>
  slug?: FieldPolicy<any> | FieldReadFunction<any>
  start_date?: FieldPolicy<any> | FieldReadFunction<any>
  start_point?: FieldPolicy<any> | FieldReadFunction<any>
  status?: FieldPolicy<any> | FieldReadFunction<any>
  study_module_order?: FieldPolicy<any> | FieldReadFunction<any>
  study_module_start_point?: FieldPolicy<any> | FieldReadFunction<any>
  study_modules?: FieldPolicy<any> | FieldReadFunction<any>
  support_email?: FieldPolicy<any> | FieldReadFunction<any>
  tags?: FieldPolicy<any> | FieldReadFunction<any>
  teacher_in_charge_email?: FieldPolicy<any> | FieldReadFunction<any>
  teacher_in_charge_name?: FieldPolicy<any> | FieldReadFunction<any>
  tier?: FieldPolicy<any> | FieldReadFunction<any>
  upcoming_active_link?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
  user_course_settings_visibilities?: FieldPolicy<any> | FieldReadFunction<any>
}
export type CourseAliasKeySpecifier = (
  | "course"
  | "course_code"
  | "course_id"
  | "created_at"
  | "id"
  | "updated_at"
  | CourseAliasKeySpecifier
)[]
export type CourseAliasFieldPolicy = {
  course?: FieldPolicy<any> | FieldReadFunction<any>
  course_code?: FieldPolicy<any> | FieldReadFunction<any>
  course_id?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
}
export type CourseOrganizationKeySpecifier = (
  | "course"
  | "course_id"
  | "created_at"
  | "creator"
  | "id"
  | "organization"
  | "organization_id"
  | "updated_at"
  | CourseOrganizationKeySpecifier
)[]
export type CourseOrganizationFieldPolicy = {
  course?: FieldPolicy<any> | FieldReadFunction<any>
  course_id?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  creator?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  organization?: FieldPolicy<any> | FieldReadFunction<any>
  organization_id?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
}
export type CourseOwnershipKeySpecifier = (
  | "course"
  | "course_id"
  | "created_at"
  | "id"
  | "updated_at"
  | "user"
  | "user_id"
  | CourseOwnershipKeySpecifier
)[]
export type CourseOwnershipFieldPolicy = {
  course?: FieldPolicy<any> | FieldReadFunction<any>
  course_id?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
  user?: FieldPolicy<any> | FieldReadFunction<any>
  user_id?: FieldPolicy<any> | FieldReadFunction<any>
}
export type CourseStatsSubscriptionKeySpecifier = (
  | "created_at"
  | "email_template"
  | "email_template_id"
  | "id"
  | "updated_at"
  | "user"
  | "user_id"
  | CourseStatsSubscriptionKeySpecifier
)[]
export type CourseStatsSubscriptionFieldPolicy = {
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  email_template?: FieldPolicy<any> | FieldReadFunction<any>
  email_template_id?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
  user?: FieldPolicy<any> | FieldReadFunction<any>
  user_id?: FieldPolicy<any> | FieldReadFunction<any>
}
export type CourseTranslationKeySpecifier = (
  | "course"
  | "course_id"
  | "created_at"
  | "description"
  | "id"
  | "instructions"
  | "language"
  | "link"
  | "name"
  | "updated_at"
  | CourseTranslationKeySpecifier
)[]
export type CourseTranslationFieldPolicy = {
  course?: FieldPolicy<any> | FieldReadFunction<any>
  course_id?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  description?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  instructions?: FieldPolicy<any> | FieldReadFunction<any>
  language?: FieldPolicy<any> | FieldReadFunction<any>
  link?: FieldPolicy<any> | FieldReadFunction<any>
  name?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
}
export type CourseVariantKeySpecifier = (
  | "course"
  | "course_id"
  | "created_at"
  | "description"
  | "id"
  | "slug"
  | "updated_at"
  | CourseVariantKeySpecifier
)[]
export type CourseVariantFieldPolicy = {
  course?: FieldPolicy<any> | FieldReadFunction<any>
  course_id?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  description?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  slug?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
}
export type EmailDeliveryKeySpecifier = (
  | "created_at"
  | "email_template"
  | "email_template_id"
  | "error"
  | "error_message"
  | "id"
  | "sent"
  | "updated_at"
  | "user"
  | "user_id"
  | EmailDeliveryKeySpecifier
)[]
export type EmailDeliveryFieldPolicy = {
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  email_template?: FieldPolicy<any> | FieldReadFunction<any>
  email_template_id?: FieldPolicy<any> | FieldReadFunction<any>
  error?: FieldPolicy<any> | FieldReadFunction<any>
  error_message?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  sent?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
  user?: FieldPolicy<any> | FieldReadFunction<any>
  user_id?: FieldPolicy<any> | FieldReadFunction<any>
}
export type EmailTemplateKeySpecifier = (
  | "course_instance_language"
  | "course_stats_subscriptions"
  | "courses"
  | "created_at"
  | "email_deliveries"
  | "exercise_completions_threshold"
  | "html_body"
  | "id"
  | "name"
  | "points_threshold"
  | "template_type"
  | "title"
  | "triggered_automatically_by_course_id"
  | "txt_body"
  | "updated_at"
  | EmailTemplateKeySpecifier
)[]
export type EmailTemplateFieldPolicy = {
  course_instance_language?: FieldPolicy<any> | FieldReadFunction<any>
  course_stats_subscriptions?: FieldPolicy<any> | FieldReadFunction<any>
  courses?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  email_deliveries?: FieldPolicy<any> | FieldReadFunction<any>
  exercise_completions_threshold?: FieldPolicy<any> | FieldReadFunction<any>
  html_body?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  name?: FieldPolicy<any> | FieldReadFunction<any>
  points_threshold?: FieldPolicy<any> | FieldReadFunction<any>
  template_type?: FieldPolicy<any> | FieldReadFunction<any>
  title?: FieldPolicy<any> | FieldReadFunction<any>
  triggered_automatically_by_course_id?:
    | FieldPolicy<any>
    | FieldReadFunction<any>
  txt_body?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
}
export type ExerciseKeySpecifier = (
  | "course"
  | "course_id"
  | "created_at"
  | "custom_id"
  | "deleted"
  | "exercise_completions"
  | "id"
  | "max_points"
  | "name"
  | "part"
  | "section"
  | "service"
  | "service_id"
  | "timestamp"
  | "updated_at"
  | ExerciseKeySpecifier
)[]
export type ExerciseFieldPolicy = {
  course?: FieldPolicy<any> | FieldReadFunction<any>
  course_id?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  custom_id?: FieldPolicy<any> | FieldReadFunction<any>
  deleted?: FieldPolicy<any> | FieldReadFunction<any>
  exercise_completions?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  max_points?: FieldPolicy<any> | FieldReadFunction<any>
  name?: FieldPolicy<any> | FieldReadFunction<any>
  part?: FieldPolicy<any> | FieldReadFunction<any>
  section?: FieldPolicy<any> | FieldReadFunction<any>
  service?: FieldPolicy<any> | FieldReadFunction<any>
  service_id?: FieldPolicy<any> | FieldReadFunction<any>
  timestamp?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
}
export type ExerciseCompletionKeySpecifier = (
  | "attempted"
  | "completed"
  | "created_at"
  | "exercise"
  | "exercise_completion_required_actions"
  | "exercise_id"
  | "id"
  | "n_points"
  | "timestamp"
  | "updated_at"
  | "user"
  | "user_id"
  | ExerciseCompletionKeySpecifier
)[]
export type ExerciseCompletionFieldPolicy = {
  attempted?: FieldPolicy<any> | FieldReadFunction<any>
  completed?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  exercise?: FieldPolicy<any> | FieldReadFunction<any>
  exercise_completion_required_actions?:
    | FieldPolicy<any>
    | FieldReadFunction<any>
  exercise_id?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  n_points?: FieldPolicy<any> | FieldReadFunction<any>
  timestamp?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
  user?: FieldPolicy<any> | FieldReadFunction<any>
  user_id?: FieldPolicy<any> | FieldReadFunction<any>
}
export type ExerciseCompletionRequiredActionKeySpecifier = (
  | "exercise_completion"
  | "exercise_completion_id"
  | "id"
  | "value"
  | ExerciseCompletionRequiredActionKeySpecifier
)[]
export type ExerciseCompletionRequiredActionFieldPolicy = {
  exercise_completion?: FieldPolicy<any> | FieldReadFunction<any>
  exercise_completion_id?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  value?: FieldPolicy<any> | FieldReadFunction<any>
}
export type ExerciseProgressKeySpecifier = (
  | "exercise_count"
  | "exercises"
  | "exercises_completed_count"
  | "total"
  | ExerciseProgressKeySpecifier
)[]
export type ExerciseProgressFieldPolicy = {
  exercise_count?: FieldPolicy<any> | FieldReadFunction<any>
  exercises?: FieldPolicy<any> | FieldReadFunction<any>
  exercises_completed_count?: FieldPolicy<any> | FieldReadFunction<any>
  total?: FieldPolicy<any> | FieldReadFunction<any>
}
export type ImageKeySpecifier = (
  | "compressed"
  | "compressed_mimetype"
  | "created_at"
  | "default"
  | "encoding"
  | "id"
  | "name"
  | "original"
  | "original_mimetype"
  | "uncompressed"
  | "uncompressed_mimetype"
  | "updated_at"
  | ImageKeySpecifier
)[]
export type ImageFieldPolicy = {
  compressed?: FieldPolicy<any> | FieldReadFunction<any>
  compressed_mimetype?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  default?: FieldPolicy<any> | FieldReadFunction<any>
  encoding?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  name?: FieldPolicy<any> | FieldReadFunction<any>
  original?: FieldPolicy<any> | FieldReadFunction<any>
  original_mimetype?: FieldPolicy<any> | FieldReadFunction<any>
  uncompressed?: FieldPolicy<any> | FieldReadFunction<any>
  uncompressed_mimetype?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
}
export type MutationKeySpecifier = (
  | "addAbEnrollment"
  | "addAbStudy"
  | "addCompletion"
  | "addCourse"
  | "addCourseAlias"
  | "addCourseOrganization"
  | "addCourseTranslation"
  | "addCourseVariant"
  | "addEmailTemplate"
  | "addExercise"
  | "addExerciseCompletion"
  | "addImage"
  | "addManualCompletion"
  | "addOpenUniversityRegistrationLink"
  | "addOrganization"
  | "addService"
  | "addStudyModule"
  | "addStudyModuleTranslation"
  | "addUser"
  | "addUserCourseProgress"
  | "addUserCourseServiceProgress"
  | "addUserOrganization"
  | "addVerifiedUser"
  | "createCourseStatsSubscription"
  | "createRegistrationAttemptDate"
  | "createTag"
  | "createTagTranslation"
  | "createTagType"
  | "deleteCourse"
  | "deleteCourseOrganization"
  | "deleteCourseStatsSubscription"
  | "deleteCourseTranslation"
  | "deleteCourseVariant"
  | "deleteEmailTemplate"
  | "deleteImage"
  | "deleteStudyModule"
  | "deleteStudyModuleTranslation"
  | "deleteTag"
  | "deleteTagTranslation"
  | "deleteTagType"
  | "deleteUserOrganization"
  | "recheckCompletions"
  | "registerCompletion"
  | "updateAbEnrollment"
  | "updateAbStudy"
  | "updateCourse"
  | "updateCourseTranslation"
  | "updateCourseVariant"
  | "updateEmailTemplate"
  | "updateOpenUniversityRegistrationLink"
  | "updateResearchConsent"
  | "updateService"
  | "updateStudyModule"
  | "updateStudyModuletranslation"
  | "updateTag"
  | "updateTagTranslation"
  | "updateTagType"
  | "updateUserName"
  | "updateUserOrganization"
  | MutationKeySpecifier
)[]
export type MutationFieldPolicy = {
  addAbEnrollment?: FieldPolicy<any> | FieldReadFunction<any>
  addAbStudy?: FieldPolicy<any> | FieldReadFunction<any>
  addCompletion?: FieldPolicy<any> | FieldReadFunction<any>
  addCourse?: FieldPolicy<any> | FieldReadFunction<any>
  addCourseAlias?: FieldPolicy<any> | FieldReadFunction<any>
  addCourseOrganization?: FieldPolicy<any> | FieldReadFunction<any>
  addCourseTranslation?: FieldPolicy<any> | FieldReadFunction<any>
  addCourseVariant?: FieldPolicy<any> | FieldReadFunction<any>
  addEmailTemplate?: FieldPolicy<any> | FieldReadFunction<any>
  addExercise?: FieldPolicy<any> | FieldReadFunction<any>
  addExerciseCompletion?: FieldPolicy<any> | FieldReadFunction<any>
  addImage?: FieldPolicy<any> | FieldReadFunction<any>
  addManualCompletion?: FieldPolicy<any> | FieldReadFunction<any>
  addOpenUniversityRegistrationLink?: FieldPolicy<any> | FieldReadFunction<any>
  addOrganization?: FieldPolicy<any> | FieldReadFunction<any>
  addService?: FieldPolicy<any> | FieldReadFunction<any>
  addStudyModule?: FieldPolicy<any> | FieldReadFunction<any>
  addStudyModuleTranslation?: FieldPolicy<any> | FieldReadFunction<any>
  addUser?: FieldPolicy<any> | FieldReadFunction<any>
  addUserCourseProgress?: FieldPolicy<any> | FieldReadFunction<any>
  addUserCourseServiceProgress?: FieldPolicy<any> | FieldReadFunction<any>
  addUserOrganization?: FieldPolicy<any> | FieldReadFunction<any>
  addVerifiedUser?: FieldPolicy<any> | FieldReadFunction<any>
  createCourseStatsSubscription?: FieldPolicy<any> | FieldReadFunction<any>
  createRegistrationAttemptDate?: FieldPolicy<any> | FieldReadFunction<any>
  createTag?: FieldPolicy<any> | FieldReadFunction<any>
  createTagTranslation?: FieldPolicy<any> | FieldReadFunction<any>
  createTagType?: FieldPolicy<any> | FieldReadFunction<any>
  deleteCourse?: FieldPolicy<any> | FieldReadFunction<any>
  deleteCourseOrganization?: FieldPolicy<any> | FieldReadFunction<any>
  deleteCourseStatsSubscription?: FieldPolicy<any> | FieldReadFunction<any>
  deleteCourseTranslation?: FieldPolicy<any> | FieldReadFunction<any>
  deleteCourseVariant?: FieldPolicy<any> | FieldReadFunction<any>
  deleteEmailTemplate?: FieldPolicy<any> | FieldReadFunction<any>
  deleteImage?: FieldPolicy<any> | FieldReadFunction<any>
  deleteStudyModule?: FieldPolicy<any> | FieldReadFunction<any>
  deleteStudyModuleTranslation?: FieldPolicy<any> | FieldReadFunction<any>
  deleteTag?: FieldPolicy<any> | FieldReadFunction<any>
  deleteTagTranslation?: FieldPolicy<any> | FieldReadFunction<any>
  deleteTagType?: FieldPolicy<any> | FieldReadFunction<any>
  deleteUserOrganization?: FieldPolicy<any> | FieldReadFunction<any>
  recheckCompletions?: FieldPolicy<any> | FieldReadFunction<any>
  registerCompletion?: FieldPolicy<any> | FieldReadFunction<any>
  updateAbEnrollment?: FieldPolicy<any> | FieldReadFunction<any>
  updateAbStudy?: FieldPolicy<any> | FieldReadFunction<any>
  updateCourse?: FieldPolicy<any> | FieldReadFunction<any>
  updateCourseTranslation?: FieldPolicy<any> | FieldReadFunction<any>
  updateCourseVariant?: FieldPolicy<any> | FieldReadFunction<any>
  updateEmailTemplate?: FieldPolicy<any> | FieldReadFunction<any>
  updateOpenUniversityRegistrationLink?:
    | FieldPolicy<any>
    | FieldReadFunction<any>
  updateResearchConsent?: FieldPolicy<any> | FieldReadFunction<any>
  updateService?: FieldPolicy<any> | FieldReadFunction<any>
  updateStudyModule?: FieldPolicy<any> | FieldReadFunction<any>
  updateStudyModuletranslation?: FieldPolicy<any> | FieldReadFunction<any>
  updateTag?: FieldPolicy<any> | FieldReadFunction<any>
  updateTagTranslation?: FieldPolicy<any> | FieldReadFunction<any>
  updateTagType?: FieldPolicy<any> | FieldReadFunction<any>
  updateUserName?: FieldPolicy<any> | FieldReadFunction<any>
  updateUserOrganization?: FieldPolicy<any> | FieldReadFunction<any>
}
export type OpenUniversityRegistrationLinkKeySpecifier = (
  | "course"
  | "course_code"
  | "course_id"
  | "created_at"
  | "id"
  | "language"
  | "link"
  | "start_date"
  | "stop_date"
  | "tiers"
  | "updated_at"
  | OpenUniversityRegistrationLinkKeySpecifier
)[]
export type OpenUniversityRegistrationLinkFieldPolicy = {
  course?: FieldPolicy<any> | FieldReadFunction<any>
  course_code?: FieldPolicy<any> | FieldReadFunction<any>
  course_id?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  language?: FieldPolicy<any> | FieldReadFunction<any>
  link?: FieldPolicy<any> | FieldReadFunction<any>
  start_date?: FieldPolicy<any> | FieldReadFunction<any>
  stop_date?: FieldPolicy<any> | FieldReadFunction<any>
  tiers?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
}
export type OrganizationKeySpecifier = (
  | "completions_registered"
  | "contact_information"
  | "course_organizations"
  | "courses"
  | "created_at"
  | "creator"
  | "creator_id"
  | "disabled"
  | "email"
  | "hidden"
  | "id"
  | "logo_content_type"
  | "logo_file_name"
  | "logo_file_size"
  | "logo_updated_at"
  | "organization_translations"
  | "phone"
  | "pinned"
  | "slug"
  | "tmc_created_at"
  | "tmc_updated_at"
  | "updated_at"
  | "user_organizations"
  | "verified"
  | "verified_at"
  | "verified_users"
  | "website"
  | OrganizationKeySpecifier
)[]
export type OrganizationFieldPolicy = {
  completions_registered?: FieldPolicy<any> | FieldReadFunction<any>
  contact_information?: FieldPolicy<any> | FieldReadFunction<any>
  course_organizations?: FieldPolicy<any> | FieldReadFunction<any>
  courses?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  creator?: FieldPolicy<any> | FieldReadFunction<any>
  creator_id?: FieldPolicy<any> | FieldReadFunction<any>
  disabled?: FieldPolicy<any> | FieldReadFunction<any>
  email?: FieldPolicy<any> | FieldReadFunction<any>
  hidden?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  logo_content_type?: FieldPolicy<any> | FieldReadFunction<any>
  logo_file_name?: FieldPolicy<any> | FieldReadFunction<any>
  logo_file_size?: FieldPolicy<any> | FieldReadFunction<any>
  logo_updated_at?: FieldPolicy<any> | FieldReadFunction<any>
  organization_translations?: FieldPolicy<any> | FieldReadFunction<any>
  phone?: FieldPolicy<any> | FieldReadFunction<any>
  pinned?: FieldPolicy<any> | FieldReadFunction<any>
  slug?: FieldPolicy<any> | FieldReadFunction<any>
  tmc_created_at?: FieldPolicy<any> | FieldReadFunction<any>
  tmc_updated_at?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
  user_organizations?: FieldPolicy<any> | FieldReadFunction<any>
  verified?: FieldPolicy<any> | FieldReadFunction<any>
  verified_at?: FieldPolicy<any> | FieldReadFunction<any>
  verified_users?: FieldPolicy<any> | FieldReadFunction<any>
  website?: FieldPolicy<any> | FieldReadFunction<any>
}
export type OrganizationTranslationKeySpecifier = (
  | "created_at"
  | "disabled_reason"
  | "id"
  | "information"
  | "language"
  | "name"
  | "organization"
  | "organization_id"
  | "updated_at"
  | OrganizationTranslationKeySpecifier
)[]
export type OrganizationTranslationFieldPolicy = {
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  disabled_reason?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  information?: FieldPolicy<any> | FieldReadFunction<any>
  language?: FieldPolicy<any> | FieldReadFunction<any>
  name?: FieldPolicy<any> | FieldReadFunction<any>
  organization?: FieldPolicy<any> | FieldReadFunction<any>
  organization_id?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
}
export type PageInfoKeySpecifier = (
  | "endCursor"
  | "hasNextPage"
  | "hasPreviousPage"
  | "startCursor"
  | PageInfoKeySpecifier
)[]
export type PageInfoFieldPolicy = {
  endCursor?: FieldPolicy<any> | FieldReadFunction<any>
  hasNextPage?: FieldPolicy<any> | FieldReadFunction<any>
  hasPreviousPage?: FieldPolicy<any> | FieldReadFunction<any>
  startCursor?: FieldPolicy<any> | FieldReadFunction<any>
}
export type ProgressKeySpecifier = (
  | "course"
  | "course_id"
  | "user"
  | "user_course_progress"
  | "user_course_service_progresses"
  | "user_id"
  | ProgressKeySpecifier
)[]
export type ProgressFieldPolicy = {
  course?: FieldPolicy<any> | FieldReadFunction<any>
  course_id?: FieldPolicy<any> | FieldReadFunction<any>
  user?: FieldPolicy<any> | FieldReadFunction<any>
  user_course_progress?: FieldPolicy<any> | FieldReadFunction<any>
  user_course_service_progresses?: FieldPolicy<any> | FieldReadFunction<any>
  user_id?: FieldPolicy<any> | FieldReadFunction<any>
}
export type QueryKeySpecifier = (
  | "completions"
  | "completionsPaginated"
  | "completionsPaginated_type"
  | "course"
  | "courseAliases"
  | "courseOrganizations"
  | "courseTranslations"
  | "courseVariant"
  | "courseVariants"
  | "course_exists"
  | "courses"
  | "currentUser"
  | "email_template"
  | "email_templates"
  | "exercise"
  | "exerciseCompletion"
  | "exerciseCompletions"
  | "exercises"
  | "handlerCourses"
  | "openUniversityRegistrationLink"
  | "openUniversityRegistrationLinks"
  | "organization"
  | "organizations"
  | "registeredCompletions"
  | "service"
  | "services"
  | "studyModuleTranslations"
  | "study_module"
  | "study_module_exists"
  | "study_modules"
  | "tagTypes"
  | "tags"
  | "user"
  | "userCourseProgress"
  | "userCourseProgresses"
  | "userCourseServiceProgress"
  | "userCourseServiceProgresses"
  | "userCourseSetting"
  | "userCourseSettingCount"
  | "userCourseSettings"
  | "userDetailsContains"
  | "userOrganizations"
  | "users"
  | QueryKeySpecifier
)[]
export type QueryFieldPolicy = {
  completions?: FieldPolicy<any> | FieldReadFunction<any>
  completionsPaginated?: FieldPolicy<any> | FieldReadFunction<any>
  completionsPaginated_type?: FieldPolicy<any> | FieldReadFunction<any>
  course?: FieldPolicy<any> | FieldReadFunction<any>
  courseAliases?: FieldPolicy<any> | FieldReadFunction<any>
  courseOrganizations?: FieldPolicy<any> | FieldReadFunction<any>
  courseTranslations?: FieldPolicy<any> | FieldReadFunction<any>
  courseVariant?: FieldPolicy<any> | FieldReadFunction<any>
  courseVariants?: FieldPolicy<any> | FieldReadFunction<any>
  course_exists?: FieldPolicy<any> | FieldReadFunction<any>
  courses?: FieldPolicy<any> | FieldReadFunction<any>
  currentUser?: FieldPolicy<any> | FieldReadFunction<any>
  email_template?: FieldPolicy<any> | FieldReadFunction<any>
  email_templates?: FieldPolicy<any> | FieldReadFunction<any>
  exercise?: FieldPolicy<any> | FieldReadFunction<any>
  exerciseCompletion?: FieldPolicy<any> | FieldReadFunction<any>
  exerciseCompletions?: FieldPolicy<any> | FieldReadFunction<any>
  exercises?: FieldPolicy<any> | FieldReadFunction<any>
  handlerCourses?: FieldPolicy<any> | FieldReadFunction<any>
  openUniversityRegistrationLink?: FieldPolicy<any> | FieldReadFunction<any>
  openUniversityRegistrationLinks?: FieldPolicy<any> | FieldReadFunction<any>
  organization?: FieldPolicy<any> | FieldReadFunction<any>
  organizations?: FieldPolicy<any> | FieldReadFunction<any>
  registeredCompletions?: FieldPolicy<any> | FieldReadFunction<any>
  service?: FieldPolicy<any> | FieldReadFunction<any>
  services?: FieldPolicy<any> | FieldReadFunction<any>
  studyModuleTranslations?: FieldPolicy<any> | FieldReadFunction<any>
  study_module?: FieldPolicy<any> | FieldReadFunction<any>
  study_module_exists?: FieldPolicy<any> | FieldReadFunction<any>
  study_modules?: FieldPolicy<any> | FieldReadFunction<any>
  tagTypes?: FieldPolicy<any> | FieldReadFunction<any>
  tags?: FieldPolicy<any> | FieldReadFunction<any>
  user?: FieldPolicy<any> | FieldReadFunction<any>
  userCourseProgress?: FieldPolicy<any> | FieldReadFunction<any>
  userCourseProgresses?: FieldPolicy<any> | FieldReadFunction<any>
  userCourseServiceProgress?: FieldPolicy<any> | FieldReadFunction<any>
  userCourseServiceProgresses?: FieldPolicy<any> | FieldReadFunction<any>
  userCourseSetting?: FieldPolicy<any> | FieldReadFunction<any>
  userCourseSettingCount?: FieldPolicy<any> | FieldReadFunction<any>
  userCourseSettings?: FieldPolicy<any> | FieldReadFunction<any>
  userDetailsContains?: FieldPolicy<any> | FieldReadFunction<any>
  userOrganizations?: FieldPolicy<any> | FieldReadFunction<any>
  users?: FieldPolicy<any> | FieldReadFunction<any>
}
export type QueryCompletionsPaginated_type_ConnectionKeySpecifier = (
  | "edges"
  | "pageInfo"
  | "totalCount"
  | QueryCompletionsPaginated_type_ConnectionKeySpecifier
)[]
export type QueryCompletionsPaginated_type_ConnectionFieldPolicy = {
  edges?: FieldPolicy<any> | FieldReadFunction<any>
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>
}
export type QueryUserCourseSettings_ConnectionKeySpecifier = (
  | "edges"
  | "pageInfo"
  | "totalCount"
  | QueryUserCourseSettings_ConnectionKeySpecifier
)[]
export type QueryUserCourseSettings_ConnectionFieldPolicy = {
  edges?: FieldPolicy<any> | FieldReadFunction<any>
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>
}
export type QueryUserDetailsContains_ConnectionKeySpecifier = (
  | "count"
  | "edges"
  | "pageInfo"
  | QueryUserDetailsContains_ConnectionKeySpecifier
)[]
export type QueryUserDetailsContains_ConnectionFieldPolicy = {
  count?: FieldPolicy<any> | FieldReadFunction<any>
  edges?: FieldPolicy<any> | FieldReadFunction<any>
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>
}
export type ServiceKeySpecifier = (
  | "courses"
  | "created_at"
  | "exercises"
  | "id"
  | "name"
  | "updated_at"
  | "url"
  | "user_course_service_progresses"
  | ServiceKeySpecifier
)[]
export type ServiceFieldPolicy = {
  courses?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  exercises?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  name?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
  url?: FieldPolicy<any> | FieldReadFunction<any>
  user_course_service_progresses?: FieldPolicy<any> | FieldReadFunction<any>
}
export type StoredDataKeySpecifier = (
  | "course"
  | "course_id"
  | "created_at"
  | "data"
  | "updated_at"
  | "user"
  | "user_id"
  | StoredDataKeySpecifier
)[]
export type StoredDataFieldPolicy = {
  course?: FieldPolicy<any> | FieldReadFunction<any>
  course_id?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  data?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
  user?: FieldPolicy<any> | FieldReadFunction<any>
  user_id?: FieldPolicy<any> | FieldReadFunction<any>
}
export type StudyModuleKeySpecifier = (
  | "courses"
  | "created_at"
  | "description"
  | "id"
  | "image"
  | "name"
  | "order"
  | "slug"
  | "study_module_translations"
  | "updated_at"
  | StudyModuleKeySpecifier
)[]
export type StudyModuleFieldPolicy = {
  courses?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  description?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  image?: FieldPolicy<any> | FieldReadFunction<any>
  name?: FieldPolicy<any> | FieldReadFunction<any>
  order?: FieldPolicy<any> | FieldReadFunction<any>
  slug?: FieldPolicy<any> | FieldReadFunction<any>
  study_module_translations?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
}
export type StudyModuleTranslationKeySpecifier = (
  | "created_at"
  | "description"
  | "id"
  | "language"
  | "name"
  | "study_module"
  | "study_module_id"
  | "updated_at"
  | StudyModuleTranslationKeySpecifier
)[]
export type StudyModuleTranslationFieldPolicy = {
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  description?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  language?: FieldPolicy<any> | FieldReadFunction<any>
  name?: FieldPolicy<any> | FieldReadFunction<any>
  study_module?: FieldPolicy<any> | FieldReadFunction<any>
  study_module_id?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
}
export type SubscriptionKeySpecifier = (
  | "userSearch"
  | SubscriptionKeySpecifier
)[]
export type SubscriptionFieldPolicy = {
  userSearch?: FieldPolicy<any> | FieldReadFunction<any>
}
export type TagKeySpecifier = (
  | "courses"
  | "created_at"
  | "description"
  | "hidden"
  | "id"
  | "language"
  | "name"
  | "tag_translations"
  | "tag_types"
  | "types"
  | "updated_at"
  | TagKeySpecifier
)[]
export type TagFieldPolicy = {
  courses?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  description?: FieldPolicy<any> | FieldReadFunction<any>
  hidden?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  language?: FieldPolicy<any> | FieldReadFunction<any>
  name?: FieldPolicy<any> | FieldReadFunction<any>
  tag_translations?: FieldPolicy<any> | FieldReadFunction<any>
  tag_types?: FieldPolicy<any> | FieldReadFunction<any>
  types?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
}
export type TagTranslationKeySpecifier = (
  | "created_at"
  | "description"
  | "language"
  | "name"
  | "tag"
  | "tag_id"
  | "updated_at"
  | TagTranslationKeySpecifier
)[]
export type TagTranslationFieldPolicy = {
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  description?: FieldPolicy<any> | FieldReadFunction<any>
  language?: FieldPolicy<any> | FieldReadFunction<any>
  name?: FieldPolicy<any> | FieldReadFunction<any>
  tag?: FieldPolicy<any> | FieldReadFunction<any>
  tag_id?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
}
export type TagTypeKeySpecifier = (
  | "created_at"
  | "name"
  | "tags"
  | "updated_at"
  | TagTypeKeySpecifier
)[]
export type TagTypeFieldPolicy = {
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  name?: FieldPolicy<any> | FieldReadFunction<any>
  tags?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserKeySpecifier = (
  | "ab_enrollments"
  | "administrator"
  | "completions"
  | "completions_registered"
  | "course_ownerships"
  | "course_stats_subscriptions"
  | "created_at"
  | "email"
  | "email_deliveries"
  | "exercise_completions"
  | "first_name"
  | "full_name"
  | "id"
  | "last_name"
  | "organizations"
  | "progress"
  | "progresses"
  | "project_completion"
  | "real_student_number"
  | "research_consent"
  | "student_number"
  | "updated_at"
  | "upstream_id"
  | "user_course_progresses"
  | "user_course_progressess"
  | "user_course_service_progresses"
  | "user_course_settings"
  | "user_course_summary"
  | "user_organizations"
  | "username"
  | "verified_users"
  | UserKeySpecifier
)[]
export type UserFieldPolicy = {
  ab_enrollments?: FieldPolicy<any> | FieldReadFunction<any>
  administrator?: FieldPolicy<any> | FieldReadFunction<any>
  completions?: FieldPolicy<any> | FieldReadFunction<any>
  completions_registered?: FieldPolicy<any> | FieldReadFunction<any>
  course_ownerships?: FieldPolicy<any> | FieldReadFunction<any>
  course_stats_subscriptions?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  email?: FieldPolicy<any> | FieldReadFunction<any>
  email_deliveries?: FieldPolicy<any> | FieldReadFunction<any>
  exercise_completions?: FieldPolicy<any> | FieldReadFunction<any>
  first_name?: FieldPolicy<any> | FieldReadFunction<any>
  full_name?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  last_name?: FieldPolicy<any> | FieldReadFunction<any>
  organizations?: FieldPolicy<any> | FieldReadFunction<any>
  progress?: FieldPolicy<any> | FieldReadFunction<any>
  progresses?: FieldPolicy<any> | FieldReadFunction<any>
  project_completion?: FieldPolicy<any> | FieldReadFunction<any>
  real_student_number?: FieldPolicy<any> | FieldReadFunction<any>
  research_consent?: FieldPolicy<any> | FieldReadFunction<any>
  student_number?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
  upstream_id?: FieldPolicy<any> | FieldReadFunction<any>
  user_course_progresses?: FieldPolicy<any> | FieldReadFunction<any>
  user_course_progressess?: FieldPolicy<any> | FieldReadFunction<any>
  user_course_service_progresses?: FieldPolicy<any> | FieldReadFunction<any>
  user_course_settings?: FieldPolicy<any> | FieldReadFunction<any>
  user_course_summary?: FieldPolicy<any> | FieldReadFunction<any>
  user_organizations?: FieldPolicy<any> | FieldReadFunction<any>
  username?: FieldPolicy<any> | FieldReadFunction<any>
  verified_users?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserAppDatumConfigKeySpecifier = (
  | "created_at"
  | "id"
  | "name"
  | "timestamp"
  | "updated_at"
  | UserAppDatumConfigKeySpecifier
)[]
export type UserAppDatumConfigFieldPolicy = {
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  name?: FieldPolicy<any> | FieldReadFunction<any>
  timestamp?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserCourseProgressKeySpecifier = (
  | "course"
  | "course_id"
  | "created_at"
  | "exercise_progress"
  | "extra"
  | "id"
  | "max_points"
  | "n_points"
  | "progress"
  | "updated_at"
  | "user"
  | "user_course_service_progresses"
  | "user_course_settings"
  | "user_id"
  | UserCourseProgressKeySpecifier
)[]
export type UserCourseProgressFieldPolicy = {
  course?: FieldPolicy<any> | FieldReadFunction<any>
  course_id?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  exercise_progress?: FieldPolicy<any> | FieldReadFunction<any>
  extra?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  max_points?: FieldPolicy<any> | FieldReadFunction<any>
  n_points?: FieldPolicy<any> | FieldReadFunction<any>
  progress?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
  user?: FieldPolicy<any> | FieldReadFunction<any>
  user_course_service_progresses?: FieldPolicy<any> | FieldReadFunction<any>
  user_course_settings?: FieldPolicy<any> | FieldReadFunction<any>
  user_id?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserCourseServiceProgressKeySpecifier = (
  | "course"
  | "course_id"
  | "created_at"
  | "id"
  | "progress"
  | "service"
  | "service_id"
  | "timestamp"
  | "updated_at"
  | "user"
  | "user_course_progress"
  | "user_course_progress_id"
  | "user_id"
  | UserCourseServiceProgressKeySpecifier
)[]
export type UserCourseServiceProgressFieldPolicy = {
  course?: FieldPolicy<any> | FieldReadFunction<any>
  course_id?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  progress?: FieldPolicy<any> | FieldReadFunction<any>
  service?: FieldPolicy<any> | FieldReadFunction<any>
  service_id?: FieldPolicy<any> | FieldReadFunction<any>
  timestamp?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
  user?: FieldPolicy<any> | FieldReadFunction<any>
  user_course_progress?: FieldPolicy<any> | FieldReadFunction<any>
  user_course_progress_id?: FieldPolicy<any> | FieldReadFunction<any>
  user_id?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserCourseSettingKeySpecifier = (
  | "country"
  | "course"
  | "course_id"
  | "course_variant"
  | "created_at"
  | "id"
  | "language"
  | "marketing"
  | "other"
  | "research"
  | "updated_at"
  | "user"
  | "user_id"
  | UserCourseSettingKeySpecifier
)[]
export type UserCourseSettingFieldPolicy = {
  country?: FieldPolicy<any> | FieldReadFunction<any>
  course?: FieldPolicy<any> | FieldReadFunction<any>
  course_id?: FieldPolicy<any> | FieldReadFunction<any>
  course_variant?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  language?: FieldPolicy<any> | FieldReadFunction<any>
  marketing?: FieldPolicy<any> | FieldReadFunction<any>
  other?: FieldPolicy<any> | FieldReadFunction<any>
  research?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
  user?: FieldPolicy<any> | FieldReadFunction<any>
  user_id?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserCourseSettingEdgeKeySpecifier = (
  | "cursor"
  | "node"
  | UserCourseSettingEdgeKeySpecifier
)[]
export type UserCourseSettingEdgeFieldPolicy = {
  cursor?: FieldPolicy<any> | FieldReadFunction<any>
  node?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserCourseSettingsVisibilityKeySpecifier = (
  | "course"
  | "course_id"
  | "created_at"
  | "id"
  | "language"
  | "updated_at"
  | UserCourseSettingsVisibilityKeySpecifier
)[]
export type UserCourseSettingsVisibilityFieldPolicy = {
  course?: FieldPolicy<any> | FieldReadFunction<any>
  course_id?: FieldPolicy<any> | FieldReadFunction<any>
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  language?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserCourseSummaryKeySpecifier = (
  | "completion"
  | "completions_handled_by_id"
  | "course"
  | "course_id"
  | "exercise_completions"
  | "exercises"
  | "include_deleted_exercises"
  | "include_no_points_awarded_exercises"
  | "inherit_settings_from_id"
  | "start_date"
  | "user_course_progress"
  | "user_course_service_progresses"
  | "user_id"
  | UserCourseSummaryKeySpecifier
)[]
export type UserCourseSummaryFieldPolicy = {
  completion?: FieldPolicy<any> | FieldReadFunction<any>
  completions_handled_by_id?: FieldPolicy<any> | FieldReadFunction<any>
  course?: FieldPolicy<any> | FieldReadFunction<any>
  course_id?: FieldPolicy<any> | FieldReadFunction<any>
  exercise_completions?: FieldPolicy<any> | FieldReadFunction<any>
  exercises?: FieldPolicy<any> | FieldReadFunction<any>
  include_deleted_exercises?: FieldPolicy<any> | FieldReadFunction<any>
  include_no_points_awarded_exercises?:
    | FieldPolicy<any>
    | FieldReadFunction<any>
  inherit_settings_from_id?: FieldPolicy<any> | FieldReadFunction<any>
  start_date?: FieldPolicy<any> | FieldReadFunction<any>
  user_course_progress?: FieldPolicy<any> | FieldReadFunction<any>
  user_course_service_progresses?: FieldPolicy<any> | FieldReadFunction<any>
  user_id?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserEdgeKeySpecifier = ("cursor" | "node" | UserEdgeKeySpecifier)[]
export type UserEdgeFieldPolicy = {
  cursor?: FieldPolicy<any> | FieldReadFunction<any>
  node?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserOrganizationKeySpecifier = (
  | "created_at"
  | "id"
  | "organization"
  | "organization_id"
  | "role"
  | "updated_at"
  | "user"
  | "user_id"
  | UserOrganizationKeySpecifier
)[]
export type UserOrganizationFieldPolicy = {
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  organization?: FieldPolicy<any> | FieldReadFunction<any>
  organization_id?: FieldPolicy<any> | FieldReadFunction<any>
  role?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
  user?: FieldPolicy<any> | FieldReadFunction<any>
  user_id?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserSearchKeySpecifier = (
  | "count"
  | "field"
  | "fieldCount"
  | "fieldIndex"
  | "matches"
  | "search"
  | UserSearchKeySpecifier
)[]
export type UserSearchFieldPolicy = {
  count?: FieldPolicy<any> | FieldReadFunction<any>
  field?: FieldPolicy<any> | FieldReadFunction<any>
  fieldCount?: FieldPolicy<any> | FieldReadFunction<any>
  fieldIndex?: FieldPolicy<any> | FieldReadFunction<any>
  matches?: FieldPolicy<any> | FieldReadFunction<any>
  search?: FieldPolicy<any> | FieldReadFunction<any>
}
export type VerifiedUserKeySpecifier = (
  | "created_at"
  | "display_name"
  | "id"
  | "organization"
  | "organization_id"
  | "personal_unique_code"
  | "updated_at"
  | "user"
  | "user_id"
  | VerifiedUserKeySpecifier
)[]
export type VerifiedUserFieldPolicy = {
  created_at?: FieldPolicy<any> | FieldReadFunction<any>
  display_name?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  organization?: FieldPolicy<any> | FieldReadFunction<any>
  organization_id?: FieldPolicy<any> | FieldReadFunction<any>
  personal_unique_code?: FieldPolicy<any> | FieldReadFunction<any>
  updated_at?: FieldPolicy<any> | FieldReadFunction<any>
  user?: FieldPolicy<any> | FieldReadFunction<any>
  user_id?: FieldPolicy<any> | FieldReadFunction<any>
}
export type StrictTypedTypePolicies = {
  AbEnrollment?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AbEnrollmentKeySpecifier
      | (() => undefined | AbEnrollmentKeySpecifier)
    fields?: AbEnrollmentFieldPolicy
  }
  AbStudy?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AbStudyKeySpecifier
      | (() => undefined | AbStudyKeySpecifier)
    fields?: AbStudyFieldPolicy
  }
  CertificateAvailability?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CertificateAvailabilityKeySpecifier
      | (() => undefined | CertificateAvailabilityKeySpecifier)
    fields?: CertificateAvailabilityFieldPolicy
  }
  Completion?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CompletionKeySpecifier
      | (() => undefined | CompletionKeySpecifier)
    fields?: CompletionFieldPolicy
  }
  CompletionEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CompletionEdgeKeySpecifier
      | (() => undefined | CompletionEdgeKeySpecifier)
    fields?: CompletionEdgeFieldPolicy
  }
  CompletionRegistered?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CompletionRegisteredKeySpecifier
      | (() => undefined | CompletionRegisteredKeySpecifier)
    fields?: CompletionRegisteredFieldPolicy
  }
  Course?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CourseKeySpecifier
      | (() => undefined | CourseKeySpecifier)
    fields?: CourseFieldPolicy
  }
  CourseAlias?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CourseAliasKeySpecifier
      | (() => undefined | CourseAliasKeySpecifier)
    fields?: CourseAliasFieldPolicy
  }
  CourseOrganization?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CourseOrganizationKeySpecifier
      | (() => undefined | CourseOrganizationKeySpecifier)
    fields?: CourseOrganizationFieldPolicy
  }
  CourseOwnership?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CourseOwnershipKeySpecifier
      | (() => undefined | CourseOwnershipKeySpecifier)
    fields?: CourseOwnershipFieldPolicy
  }
  CourseStatsSubscription?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CourseStatsSubscriptionKeySpecifier
      | (() => undefined | CourseStatsSubscriptionKeySpecifier)
    fields?: CourseStatsSubscriptionFieldPolicy
  }
  CourseTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CourseTranslationKeySpecifier
      | (() => undefined | CourseTranslationKeySpecifier)
    fields?: CourseTranslationFieldPolicy
  }
  CourseVariant?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CourseVariantKeySpecifier
      | (() => undefined | CourseVariantKeySpecifier)
    fields?: CourseVariantFieldPolicy
  }
  EmailDelivery?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | EmailDeliveryKeySpecifier
      | (() => undefined | EmailDeliveryKeySpecifier)
    fields?: EmailDeliveryFieldPolicy
  }
  EmailTemplate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | EmailTemplateKeySpecifier
      | (() => undefined | EmailTemplateKeySpecifier)
    fields?: EmailTemplateFieldPolicy
  }
  Exercise?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ExerciseKeySpecifier
      | (() => undefined | ExerciseKeySpecifier)
    fields?: ExerciseFieldPolicy
  }
  ExerciseCompletion?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ExerciseCompletionKeySpecifier
      | (() => undefined | ExerciseCompletionKeySpecifier)
    fields?: ExerciseCompletionFieldPolicy
  }
  ExerciseCompletionRequiredAction?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | ExerciseCompletionRequiredActionKeySpecifier
      | (() => undefined | ExerciseCompletionRequiredActionKeySpecifier)
    fields?: ExerciseCompletionRequiredActionFieldPolicy
  }
  ExerciseProgress?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ExerciseProgressKeySpecifier
      | (() => undefined | ExerciseProgressKeySpecifier)
    fields?: ExerciseProgressFieldPolicy
  }
  Image?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ImageKeySpecifier
      | (() => undefined | ImageKeySpecifier)
    fields?: ImageFieldPolicy
  }
  Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MutationKeySpecifier
      | (() => undefined | MutationKeySpecifier)
    fields?: MutationFieldPolicy
  }
  OpenUniversityRegistrationLink?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OpenUniversityRegistrationLinkKeySpecifier
      | (() => undefined | OpenUniversityRegistrationLinkKeySpecifier)
    fields?: OpenUniversityRegistrationLinkFieldPolicy
  }
  Organization?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrganizationKeySpecifier
      | (() => undefined | OrganizationKeySpecifier)
    fields?: OrganizationFieldPolicy
  }
  OrganizationTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrganizationTranslationKeySpecifier
      | (() => undefined | OrganizationTranslationKeySpecifier)
    fields?: OrganizationTranslationFieldPolicy
  }
  PageInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageInfoKeySpecifier
      | (() => undefined | PageInfoKeySpecifier)
    fields?: PageInfoFieldPolicy
  }
  Progress?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProgressKeySpecifier
      | (() => undefined | ProgressKeySpecifier)
    fields?: ProgressFieldPolicy
  }
  Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | QueryKeySpecifier
      | (() => undefined | QueryKeySpecifier)
    fields?: QueryFieldPolicy
  }
  QueryCompletionsPaginated_type_Connection?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | QueryCompletionsPaginated_type_ConnectionKeySpecifier
      | (() =>
          | undefined
          | QueryCompletionsPaginated_type_ConnectionKeySpecifier)
    fields?: QueryCompletionsPaginated_type_ConnectionFieldPolicy
  }
  QueryUserCourseSettings_Connection?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | QueryUserCourseSettings_ConnectionKeySpecifier
      | (() => undefined | QueryUserCourseSettings_ConnectionKeySpecifier)
    fields?: QueryUserCourseSettings_ConnectionFieldPolicy
  }
  QueryUserDetailsContains_Connection?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | QueryUserDetailsContains_ConnectionKeySpecifier
      | (() => undefined | QueryUserDetailsContains_ConnectionKeySpecifier)
    fields?: QueryUserDetailsContains_ConnectionFieldPolicy
  }
  Service?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ServiceKeySpecifier
      | (() => undefined | ServiceKeySpecifier)
    fields?: ServiceFieldPolicy
  }
  StoredData?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | StoredDataKeySpecifier
      | (() => undefined | StoredDataKeySpecifier)
    fields?: StoredDataFieldPolicy
  }
  StudyModule?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | StudyModuleKeySpecifier
      | (() => undefined | StudyModuleKeySpecifier)
    fields?: StudyModuleFieldPolicy
  }
  StudyModuleTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | StudyModuleTranslationKeySpecifier
      | (() => undefined | StudyModuleTranslationKeySpecifier)
    fields?: StudyModuleTranslationFieldPolicy
  }
  Subscription?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SubscriptionKeySpecifier
      | (() => undefined | SubscriptionKeySpecifier)
    fields?: SubscriptionFieldPolicy
  }
  Tag?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | TagKeySpecifier | (() => undefined | TagKeySpecifier)
    fields?: TagFieldPolicy
  }
  TagTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | TagTranslationKeySpecifier
      | (() => undefined | TagTranslationKeySpecifier)
    fields?: TagTranslationFieldPolicy
  }
  TagType?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | TagTypeKeySpecifier
      | (() => undefined | TagTypeKeySpecifier)
    fields?: TagTypeFieldPolicy
  }
  User?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier)
    fields?: UserFieldPolicy
  }
  UserAppDatumConfig?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserAppDatumConfigKeySpecifier
      | (() => undefined | UserAppDatumConfigKeySpecifier)
    fields?: UserAppDatumConfigFieldPolicy
  }
  UserCourseProgress?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserCourseProgressKeySpecifier
      | (() => undefined | UserCourseProgressKeySpecifier)
    fields?: UserCourseProgressFieldPolicy
  }
  UserCourseServiceProgress?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserCourseServiceProgressKeySpecifier
      | (() => undefined | UserCourseServiceProgressKeySpecifier)
    fields?: UserCourseServiceProgressFieldPolicy
  }
  UserCourseSetting?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserCourseSettingKeySpecifier
      | (() => undefined | UserCourseSettingKeySpecifier)
    fields?: UserCourseSettingFieldPolicy
  }
  UserCourseSettingEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserCourseSettingEdgeKeySpecifier
      | (() => undefined | UserCourseSettingEdgeKeySpecifier)
    fields?: UserCourseSettingEdgeFieldPolicy
  }
  UserCourseSettingsVisibility?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserCourseSettingsVisibilityKeySpecifier
      | (() => undefined | UserCourseSettingsVisibilityKeySpecifier)
    fields?: UserCourseSettingsVisibilityFieldPolicy
  }
  UserCourseSummary?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserCourseSummaryKeySpecifier
      | (() => undefined | UserCourseSummaryKeySpecifier)
    fields?: UserCourseSummaryFieldPolicy
  }
  UserEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserEdgeKeySpecifier
      | (() => undefined | UserEdgeKeySpecifier)
    fields?: UserEdgeFieldPolicy
  }
  UserOrganization?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserOrganizationKeySpecifier
      | (() => undefined | UserOrganizationKeySpecifier)
    fields?: UserOrganizationFieldPolicy
  }
  UserSearch?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserSearchKeySpecifier
      | (() => undefined | UserSearchKeySpecifier)
    fields?: UserSearchFieldPolicy
  }
  VerifiedUser?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | VerifiedUserKeySpecifier
      | (() => undefined | VerifiedUserKeySpecifier)
    fields?: VerifiedUserFieldPolicy
  }
}
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies
