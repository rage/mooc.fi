import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core"

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any
  /** The `JSON` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  Json: any
  /** The `Upload` scalar type represents a file upload. */
  Upload: any
}

export type AbEnrollment = {
  __typename?: "AbEnrollment"
  ab_study: AbStudy
  ab_study_id: Scalars["String"]
  created_at: Maybe<Scalars["DateTime"]>
  group: Maybe<Scalars["Int"]>
  id: Scalars["String"]
  updated_at: Maybe<Scalars["DateTime"]>
  user: Maybe<User>
  user_id: Maybe<Scalars["String"]>
}

export type AbEnrollmentCreateOrUpsertInput = {
  ab_study_id: Scalars["ID"]
  group: Scalars["Int"]
  user_id: Scalars["ID"]
}

export type AbEnrollmentUser_idAb_study_idCompoundUniqueInput = {
  ab_study_id: Scalars["String"]
  user_id: Scalars["String"]
}

export type AbEnrollmentWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
  user_id_ab_study_id?: InputMaybe<AbEnrollmentUser_idAb_study_idCompoundUniqueInput>
}

export type AbStudy = {
  __typename?: "AbStudy"
  ab_enrollments: Array<AbEnrollment>
  created_at: Maybe<Scalars["DateTime"]>
  group_count: Scalars["Int"]
  id: Scalars["String"]
  name: Scalars["String"]
  updated_at: Maybe<Scalars["DateTime"]>
}

export type AbStudyab_enrollmentsArgs = {
  cursor?: InputMaybe<AbEnrollmentWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type AbStudyCreateInput = {
  group_count: Scalars["Int"]
  name: Scalars["String"]
}

export type AbStudyUpsertInput = {
  group_count: Scalars["Int"]
  id: Scalars["ID"]
  name: Scalars["String"]
}

export type Completion = {
  __typename?: "Completion"
  certificate_id: Maybe<Scalars["String"]>
  completion_date: Maybe<Scalars["DateTime"]>
  completion_language: Maybe<Scalars["String"]>
  completion_link: Maybe<Scalars["String"]>
  completion_registration_attempt_date: Maybe<Scalars["DateTime"]>
  completions_registered: Array<CompletionRegistered>
  course: Maybe<Course>
  course_id: Maybe<Scalars["String"]>
  created_at: Maybe<Scalars["DateTime"]>
  eligible_for_ects: Maybe<Scalars["Boolean"]>
  email: Scalars["String"]
  grade: Maybe<Scalars["String"]>
  id: Scalars["String"]
  project_completion: Maybe<Scalars["Boolean"]>
  registered: Maybe<Scalars["Boolean"]>
  student_number: Maybe<Scalars["String"]>
  tier: Maybe<Scalars["Int"]>
  updated_at: Maybe<Scalars["DateTime"]>
  user: Maybe<User>
  user_id: Maybe<Scalars["String"]>
  user_upstream_id: Maybe<Scalars["Int"]>
}

export type Completioncompletions_registeredArgs = {
  cursor?: InputMaybe<CompletionRegisteredWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type CompletionArg = {
  completion_id: Scalars["String"]
  eligible_for_ects?: InputMaybe<Scalars["Boolean"]>
  student_number: Scalars["String"]
  tier?: InputMaybe<Scalars["Int"]>
}

export type CompletionEdge = {
  __typename?: "CompletionEdge"
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor */
  cursor: Scalars["String"]
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Node */
  node: Maybe<Completion>
}

export type CompletionRegistered = {
  __typename?: "CompletionRegistered"
  completion: Maybe<Completion>
  completion_id: Maybe<Scalars["String"]>
  course: Maybe<Course>
  course_id: Maybe<Scalars["String"]>
  created_at: Maybe<Scalars["DateTime"]>
  id: Scalars["String"]
  organization: Maybe<Organization>
  organization_id: Maybe<Scalars["String"]>
  real_student_number: Scalars["String"]
  registration_date: Maybe<Scalars["DateTime"]>
  updated_at: Maybe<Scalars["DateTime"]>
  user: Maybe<User>
  user_id: Maybe<Scalars["String"]>
}

export type CompletionRegisteredWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
}

export type Course = {
  __typename?: "Course"
  automatic_completions: Maybe<Scalars["Boolean"]>
  automatic_completions_eligible_for_ects: Maybe<Scalars["Boolean"]>
  completion_email: Maybe<EmailTemplate>
  completion_email_id: Maybe<Scalars["String"]>
  completions: Maybe<Array<Maybe<Completion>>>
  completions_handled_by: Maybe<Course>
  completions_handled_by_id: Maybe<Scalars["String"]>
  course_aliases: Array<CourseAlias>
  course_organizations: Array<CourseOrganization>
  course_stats_email: Maybe<EmailTemplate>
  course_stats_email_id: Maybe<Scalars["String"]>
  course_translations: Array<CourseTranslation>
  course_variants: Array<CourseVariant>
  created_at: Maybe<Scalars["DateTime"]>
  description: Maybe<Scalars["String"]>
  ects: Maybe<Scalars["String"]>
  end_date: Maybe<Scalars["String"]>
  exercise_completions_needed: Maybe<Scalars["Int"]>
  exercises: Maybe<Array<Maybe<Exercise>>>
  handles_completions_for: Array<Course>
  has_certificate: Maybe<Scalars["Boolean"]>
  hidden: Maybe<Scalars["Boolean"]>
  id: Scalars["String"]
  inherit_settings_from: Maybe<Course>
  inherit_settings_from_id: Maybe<Scalars["String"]>
  instructions: Maybe<Scalars["String"]>
  link: Maybe<Scalars["String"]>
  name: Scalars["String"]
  open_university_registration_links: Array<OpenUniversityRegistrationLink>
  order: Maybe<Scalars["Int"]>
  owner_organization: Maybe<Organization>
  owner_organization_id: Maybe<Scalars["String"]>
  photo: Maybe<Image>
  photo_id: Maybe<Scalars["String"]>
  points_needed: Maybe<Scalars["Int"]>
  promote: Maybe<Scalars["Boolean"]>
  services: Array<Service>
  slug: Scalars["String"]
  start_date: Scalars["String"]
  start_point: Maybe<Scalars["Boolean"]>
  status: Maybe<CourseStatus>
  study_module_order: Maybe<Scalars["Int"]>
  study_module_start_point: Maybe<Scalars["Boolean"]>
  study_modules: Array<StudyModule>
  support_email: Maybe<Scalars["String"]>
  teacher_in_charge_email: Scalars["String"]
  teacher_in_charge_name: Scalars["String"]
  tier: Maybe<Scalars["Int"]>
  upcoming_active_link: Maybe<Scalars["Boolean"]>
  updated_at: Maybe<Scalars["DateTime"]>
  user_course_settings_visibilities: Array<UserCourseSettingsVisibility>
}

export type CoursecompletionsArgs = {
  user_id?: InputMaybe<Scalars["String"]>
  user_upstream_id?: InputMaybe<Scalars["Int"]>
}

export type Coursecourse_aliasesArgs = {
  cursor?: InputMaybe<CourseAliasWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type Coursecourse_organizationsArgs = {
  cursor?: InputMaybe<CourseOrganizationWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type Coursecourse_translationsArgs = {
  cursor?: InputMaybe<CourseTranslationWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type Coursecourse_variantsArgs = {
  cursor?: InputMaybe<CourseVariantWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type CourseexercisesArgs = {
  includeDeleted?: InputMaybe<Scalars["Boolean"]>
}

export type Coursehandles_completions_forArgs = {
  cursor?: InputMaybe<CourseWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type Courseopen_university_registration_linksArgs = {
  cursor?: InputMaybe<OpenUniversityRegistrationLinkWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type CourseservicesArgs = {
  cursor?: InputMaybe<ServiceWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type Coursestudy_modulesArgs = {
  cursor?: InputMaybe<StudyModuleWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type Courseuser_course_settings_visibilitiesArgs = {
  cursor?: InputMaybe<UserCourseSettingsVisibilityWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type CourseAlias = {
  __typename?: "CourseAlias"
  course: Maybe<Course>
  course_code: Scalars["String"]
  course_id: Maybe<Scalars["String"]>
  created_at: Maybe<Scalars["DateTime"]>
  id: Scalars["String"]
  updated_at: Maybe<Scalars["DateTime"]>
}

export type CourseAliasCreateInput = {
  course?: InputMaybe<Scalars["ID"]>
  course_code: Scalars["String"]
}

export type CourseAliasUpsertInput = {
  course?: InputMaybe<Scalars["ID"]>
  course_code: Scalars["String"]
  id?: InputMaybe<Scalars["ID"]>
}

export type CourseAliasWhereUniqueInput = {
  course_code?: InputMaybe<Scalars["String"]>
  id?: InputMaybe<Scalars["String"]>
}

export type CourseCreateArg = {
  automatic_completions?: InputMaybe<Scalars["Boolean"]>
  automatic_completions_eligible_for_ects?: InputMaybe<Scalars["Boolean"]>
  base64?: InputMaybe<Scalars["Boolean"]>
  completion_email_id?: InputMaybe<Scalars["ID"]>
  completions_handled_by?: InputMaybe<Scalars["ID"]>
  course_aliases?: InputMaybe<Array<InputMaybe<CourseAliasCreateInput>>>
  course_stats_email_id?: InputMaybe<Scalars["ID"]>
  course_translations?: InputMaybe<
    Array<InputMaybe<CourseTranslationCreateInput>>
  >
  course_variants?: InputMaybe<Array<InputMaybe<CourseVariantCreateInput>>>
  ects?: InputMaybe<Scalars["String"]>
  end_date?: InputMaybe<Scalars["String"]>
  exercise_completions_needed?: InputMaybe<Scalars["Int"]>
  has_certificate?: InputMaybe<Scalars["Boolean"]>
  hidden?: InputMaybe<Scalars["Boolean"]>
  inherit_settings_from?: InputMaybe<Scalars["ID"]>
  name?: InputMaybe<Scalars["String"]>
  new_photo?: InputMaybe<Scalars["Upload"]>
  open_university_registration_links?: InputMaybe<
    Array<InputMaybe<OpenUniversityRegistrationLinkCreateInput>>
  >
  order?: InputMaybe<Scalars["Int"]>
  photo?: InputMaybe<Scalars["ID"]>
  points_needed?: InputMaybe<Scalars["Int"]>
  promote?: InputMaybe<Scalars["Boolean"]>
  slug: Scalars["String"]
  start_date: Scalars["String"]
  start_point?: InputMaybe<Scalars["Boolean"]>
  status?: InputMaybe<CourseStatus>
  study_module_order?: InputMaybe<Scalars["Int"]>
  study_module_start_point?: InputMaybe<Scalars["Boolean"]>
  study_modules?: InputMaybe<Array<InputMaybe<StudyModuleWhereUniqueInput>>>
  support_email?: InputMaybe<Scalars["String"]>
  teacher_in_charge_email: Scalars["String"]
  teacher_in_charge_name: Scalars["String"]
  tier?: InputMaybe<Scalars["Int"]>
  upcoming_active_link?: InputMaybe<Scalars["Boolean"]>
  user_course_settings_visibilities?: InputMaybe<
    Array<InputMaybe<UserCourseSettingsVisibilityCreateInput>>
  >
}

export type CourseOrderByInput = {
  automatic_completions?: InputMaybe<SortOrder>
  automatic_completions_eligible_for_ects?: InputMaybe<SortOrder>
  completion_email_id?: InputMaybe<SortOrder>
  completions_handled_by_id?: InputMaybe<SortOrder>
  course_stats_email_id?: InputMaybe<SortOrder>
  created_at?: InputMaybe<SortOrder>
  ects?: InputMaybe<SortOrder>
  end_date?: InputMaybe<SortOrder>
  exercise_completions_needed?: InputMaybe<SortOrder>
  has_certificate?: InputMaybe<SortOrder>
  hidden?: InputMaybe<SortOrder>
  id?: InputMaybe<SortOrder>
  inherit_settings_from_id?: InputMaybe<SortOrder>
  name?: InputMaybe<SortOrder>
  order?: InputMaybe<SortOrder>
  owner_organization_id?: InputMaybe<SortOrder>
  photo_id?: InputMaybe<SortOrder>
  points_needed?: InputMaybe<SortOrder>
  promote?: InputMaybe<SortOrder>
  slug?: InputMaybe<SortOrder>
  start_date?: InputMaybe<SortOrder>
  start_point?: InputMaybe<SortOrder>
  status?: InputMaybe<SortOrder>
  study_module_order?: InputMaybe<SortOrder>
  study_module_start_point?: InputMaybe<SortOrder>
  support_email?: InputMaybe<SortOrder>
  teacher_in_charge_email?: InputMaybe<SortOrder>
  teacher_in_charge_name?: InputMaybe<SortOrder>
  tier?: InputMaybe<SortOrder>
  upcoming_active_link?: InputMaybe<SortOrder>
  updated_at?: InputMaybe<SortOrder>
}

export type CourseOrganization = {
  __typename?: "CourseOrganization"
  course: Maybe<Course>
  course_id: Maybe<Scalars["String"]>
  created_at: Maybe<Scalars["DateTime"]>
  creator: Maybe<Scalars["Boolean"]>
  id: Scalars["String"]
  organization: Maybe<Organization>
  organization_id: Maybe<Scalars["String"]>
  updated_at: Maybe<Scalars["DateTime"]>
}

export type CourseOrganizationWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
}

export type CourseOwnership = {
  __typename?: "CourseOwnership"
  course: Maybe<Course>
  course_id: Maybe<Scalars["String"]>
  created_at: Maybe<Scalars["DateTime"]>
  id: Scalars["String"]
  updated_at: Maybe<Scalars["DateTime"]>
  user: Maybe<User>
  user_id: Maybe<Scalars["String"]>
}

export type CourseOwnershipUser_idCourse_idCompoundUniqueInput = {
  course_id: Scalars["String"]
  user_id: Scalars["String"]
}

export type CourseOwnershipWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
  user_id_course_id?: InputMaybe<CourseOwnershipUser_idCourse_idCompoundUniqueInput>
}

export type CourseStatsSubscription = {
  __typename?: "CourseStatsSubscription"
  created_at: Maybe<Scalars["DateTime"]>
  email_template: Maybe<EmailTemplate>
  email_template_id: Maybe<Scalars["String"]>
  id: Scalars["String"]
  updated_at: Maybe<Scalars["DateTime"]>
  user: Maybe<User>
  user_id: Maybe<Scalars["String"]>
}

export type CourseStatsSubscriptionUser_idEmail_template_idCompoundUniqueInput =
  {
    email_template_id: Scalars["String"]
    user_id: Scalars["String"]
  }

export type CourseStatsSubscriptionWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
  user_id_email_template_id?: InputMaybe<CourseStatsSubscriptionUser_idEmail_template_idCompoundUniqueInput>
}

export enum CourseStatus {
  Active = "Active",
  Ended = "Ended",
  Upcoming = "Upcoming",
}

export type CourseTranslation = {
  __typename?: "CourseTranslation"
  course: Maybe<Course>
  course_id: Maybe<Scalars["String"]>
  created_at: Maybe<Scalars["DateTime"]>
  description: Scalars["String"]
  id: Scalars["String"]
  instructions: Maybe<Scalars["String"]>
  language: Scalars["String"]
  link: Maybe<Scalars["String"]>
  name: Scalars["String"]
  updated_at: Maybe<Scalars["DateTime"]>
}

export type CourseTranslationCreateInput = {
  course?: InputMaybe<Scalars["ID"]>
  description: Scalars["String"]
  instructions?: InputMaybe<Scalars["String"]>
  language: Scalars["String"]
  link?: InputMaybe<Scalars["String"]>
  name: Scalars["String"]
}

export type CourseTranslationUpsertInput = {
  course?: InputMaybe<Scalars["ID"]>
  description: Scalars["String"]
  id?: InputMaybe<Scalars["ID"]>
  instructions?: InputMaybe<Scalars["String"]>
  language: Scalars["String"]
  link?: InputMaybe<Scalars["String"]>
  name: Scalars["String"]
}

export type CourseTranslationWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
}

export type CourseUpsertArg = {
  automatic_completions?: InputMaybe<Scalars["Boolean"]>
  automatic_completions_eligible_for_ects?: InputMaybe<Scalars["Boolean"]>
  base64?: InputMaybe<Scalars["Boolean"]>
  completion_email_id?: InputMaybe<Scalars["ID"]>
  completions_handled_by?: InputMaybe<Scalars["ID"]>
  course_aliases?: InputMaybe<Array<InputMaybe<CourseAliasUpsertInput>>>
  course_stats_email_id?: InputMaybe<Scalars["ID"]>
  course_translations?: InputMaybe<
    Array<InputMaybe<CourseTranslationUpsertInput>>
  >
  course_variants?: InputMaybe<Array<InputMaybe<CourseVariantUpsertInput>>>
  delete_photo?: InputMaybe<Scalars["Boolean"]>
  ects?: InputMaybe<Scalars["String"]>
  end_date?: InputMaybe<Scalars["String"]>
  exercise_completions_needed?: InputMaybe<Scalars["Int"]>
  has_certificate?: InputMaybe<Scalars["Boolean"]>
  hidden?: InputMaybe<Scalars["Boolean"]>
  id?: InputMaybe<Scalars["ID"]>
  inherit_settings_from?: InputMaybe<Scalars["ID"]>
  name: Scalars["String"]
  new_photo?: InputMaybe<Scalars["Upload"]>
  new_slug?: InputMaybe<Scalars["String"]>
  open_university_registration_links?: InputMaybe<
    Array<InputMaybe<OpenUniversityRegistrationLinkUpsertInput>>
  >
  order?: InputMaybe<Scalars["Int"]>
  photo?: InputMaybe<Scalars["ID"]>
  points_needed?: InputMaybe<Scalars["Int"]>
  promote?: InputMaybe<Scalars["Boolean"]>
  slug: Scalars["String"]
  start_date: Scalars["String"]
  start_point?: InputMaybe<Scalars["Boolean"]>
  status?: InputMaybe<CourseStatus>
  study_module_order?: InputMaybe<Scalars["Int"]>
  study_module_start_point?: InputMaybe<Scalars["Boolean"]>
  study_modules?: InputMaybe<Array<InputMaybe<StudyModuleWhereUniqueInput>>>
  support_email?: InputMaybe<Scalars["String"]>
  teacher_in_charge_email: Scalars["String"]
  teacher_in_charge_name: Scalars["String"]
  tier?: InputMaybe<Scalars["Int"]>
  upcoming_active_link?: InputMaybe<Scalars["Boolean"]>
  user_course_settings_visibilities?: InputMaybe<
    Array<InputMaybe<UserCourseSettingsVisibilityUpsertInput>>
  >
}

export type CourseVariant = {
  __typename?: "CourseVariant"
  course: Maybe<Course>
  course_id: Maybe<Scalars["String"]>
  created_at: Maybe<Scalars["DateTime"]>
  description: Maybe<Scalars["String"]>
  id: Scalars["String"]
  slug: Scalars["String"]
  updated_at: Maybe<Scalars["DateTime"]>
}

export type CourseVariantCreateInput = {
  course?: InputMaybe<Scalars["ID"]>
  description?: InputMaybe<Scalars["String"]>
  instructions?: InputMaybe<Scalars["String"]>
  slug: Scalars["String"]
}

export type CourseVariantUpsertInput = {
  course?: InputMaybe<Scalars["ID"]>
  description?: InputMaybe<Scalars["String"]>
  id?: InputMaybe<Scalars["ID"]>
  instructions?: InputMaybe<Scalars["String"]>
  slug: Scalars["String"]
}

export type CourseVariantWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
}

export type CourseWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
  slug?: InputMaybe<Scalars["String"]>
}

export type EmailDelivery = {
  __typename?: "EmailDelivery"
  created_at: Maybe<Scalars["DateTime"]>
  email_template: Maybe<EmailTemplate>
  email_template_id: Maybe<Scalars["String"]>
  error: Scalars["Boolean"]
  error_message: Maybe<Scalars["String"]>
  id: Scalars["String"]
  sent: Scalars["Boolean"]
  updated_at: Maybe<Scalars["DateTime"]>
  user: Maybe<User>
  user_id: Maybe<Scalars["String"]>
}

export type EmailDeliveryWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
}

export type EmailTemplate = {
  __typename?: "EmailTemplate"
  course_stats_subscriptions: Array<CourseStatsSubscription>
  courses: Array<Course>
  created_at: Maybe<Scalars["DateTime"]>
  email_deliveries: Array<EmailDelivery>
  exercise_completions_threshold: Maybe<Scalars["Int"]>
  html_body: Maybe<Scalars["String"]>
  id: Scalars["String"]
  name: Maybe<Scalars["String"]>
  points_threshold: Maybe<Scalars["Int"]>
  template_type: Maybe<Scalars["String"]>
  title: Maybe<Scalars["String"]>
  triggered_automatically_by_course_id: Maybe<Scalars["String"]>
  txt_body: Maybe<Scalars["String"]>
  updated_at: Maybe<Scalars["DateTime"]>
}

export type EmailTemplatecourse_stats_subscriptionsArgs = {
  cursor?: InputMaybe<CourseStatsSubscriptionWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type EmailTemplatecoursesArgs = {
  cursor?: InputMaybe<CourseWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type EmailTemplateemail_deliveriesArgs = {
  cursor?: InputMaybe<EmailDeliveryWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type Exercise = {
  __typename?: "Exercise"
  course: Maybe<Course>
  course_id: Maybe<Scalars["String"]>
  created_at: Maybe<Scalars["DateTime"]>
  custom_id: Scalars["String"]
  deleted: Maybe<Scalars["Boolean"]>
  exercise_completions: Maybe<Array<Maybe<ExerciseCompletion>>>
  id: Scalars["String"]
  max_points: Maybe<Scalars["Int"]>
  name: Maybe<Scalars["String"]>
  part: Maybe<Scalars["Int"]>
  section: Maybe<Scalars["Int"]>
  service: Maybe<Service>
  service_id: Maybe<Scalars["String"]>
  timestamp: Maybe<Scalars["DateTime"]>
  updated_at: Maybe<Scalars["DateTime"]>
}

export type Exerciseexercise_completionsArgs = {
  orderBy?: InputMaybe<ExerciseCompletionOrderByInput>
  user_id?: InputMaybe<Scalars["ID"]>
}

export type ExerciseCompletion = {
  __typename?: "ExerciseCompletion"
  attempted: Maybe<Scalars["Boolean"]>
  completed: Maybe<Scalars["Boolean"]>
  created_at: Maybe<Scalars["DateTime"]>
  exercise: Maybe<Exercise>
  exercise_completion_required_actions: Array<ExerciseCompletionRequiredAction>
  exercise_id: Maybe<Scalars["String"]>
  id: Scalars["String"]
  n_points: Maybe<Scalars["Float"]>
  timestamp: Scalars["DateTime"]
  updated_at: Maybe<Scalars["DateTime"]>
  user: Maybe<User>
  user_id: Maybe<Scalars["String"]>
}

export type ExerciseCompletionexercise_completion_required_actionsArgs = {
  cursor?: InputMaybe<ExerciseCompletionRequiredActionWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type ExerciseCompletionOrderByInput = {
  attempted?: InputMaybe<SortOrder>
  completed?: InputMaybe<SortOrder>
  created_at?: InputMaybe<SortOrder>
  exercise_id?: InputMaybe<SortOrder>
  id?: InputMaybe<SortOrder>
  n_points?: InputMaybe<SortOrder>
  original_submission_date?: InputMaybe<SortOrder>
  timestamp?: InputMaybe<SortOrder>
  updated_at?: InputMaybe<SortOrder>
  user_id?: InputMaybe<SortOrder>
}

export type ExerciseCompletionRequiredAction = {
  __typename?: "ExerciseCompletionRequiredAction"
  exercise_completion: Maybe<ExerciseCompletion>
  exercise_completion_id: Maybe<Scalars["String"]>
  id: Scalars["String"]
  value: Scalars["String"]
}

export type ExerciseCompletionRequiredActionWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
}

export type ExerciseCompletionWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
}

export type ExerciseProgress = {
  __typename?: "ExerciseProgress"
  exercises: Maybe<Scalars["Float"]>
  total: Maybe<Scalars["Float"]>
}

export type ExerciseWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
}

export type Image = {
  __typename?: "Image"
  compressed: Maybe<Scalars["String"]>
  compressed_mimetype: Maybe<Scalars["String"]>
  created_at: Maybe<Scalars["DateTime"]>
  default: Maybe<Scalars["Boolean"]>
  encoding: Maybe<Scalars["String"]>
  id: Scalars["String"]
  name: Maybe<Scalars["String"]>
  original: Scalars["String"]
  original_mimetype: Scalars["String"]
  uncompressed: Scalars["String"]
  uncompressed_mimetype: Scalars["String"]
  updated_at: Maybe<Scalars["DateTime"]>
}

export type ManualCompletionArg = {
  completion_date?: InputMaybe<Scalars["DateTime"]>
  grade?: InputMaybe<Scalars["String"]>
  tier?: InputMaybe<Scalars["Int"]>
  user_id: Scalars["String"]
}

export type Mutation = {
  __typename?: "Mutation"
  addAbEnrollment: Maybe<AbEnrollment>
  addAbStudy: Maybe<AbStudy>
  addCompletion: Maybe<Completion>
  addCourse: Maybe<Course>
  addCourseAlias: Maybe<CourseAlias>
  addCourseOrganization: Maybe<CourseOrganization>
  addCourseTranslation: Maybe<CourseTranslation>
  addCourseVariant: Maybe<CourseVariant>
  addEmailTemplate: Maybe<EmailTemplate>
  addExercise: Maybe<Exercise>
  addExerciseCompletion: Maybe<ExerciseCompletion>
  addImage: Maybe<Image>
  addManualCompletion: Maybe<Array<Maybe<Completion>>>
  addOpenUniversityRegistrationLink: Maybe<OpenUniversityRegistrationLink>
  addOrganization: Maybe<Organization>
  addService: Maybe<Service>
  addStudyModule: Maybe<StudyModule>
  addStudyModuleTranslation: Maybe<StudyModuleTranslation>
  addUser: Maybe<User>
  addUserCourseProgress: Maybe<UserCourseProgress>
  addUserCourseServiceProgress: Maybe<UserCourseServiceProgress>
  addUserOrganization: Maybe<UserOrganization>
  addVerifiedUser: Maybe<VerifiedUser>
  createCourseStatsSubscription: Maybe<CourseStatsSubscription>
  createRegistrationAttemptDate: Maybe<Completion>
  deleteCourse: Maybe<Course>
  deleteCourseOrganization: Maybe<CourseOrganization>
  deleteCourseStatsSubscription: Maybe<CourseStatsSubscription>
  deleteCourseTranslation: Maybe<CourseTranslation>
  deleteCourseVariant: Maybe<CourseVariant>
  deleteEmailTemplate: Maybe<EmailTemplate>
  deleteImage: Maybe<Scalars["Boolean"]>
  deleteStudyModule: Maybe<StudyModule>
  deleteStudyModuleTranslation: Maybe<StudyModuleTranslation>
  deleteUserOrganization: Maybe<UserOrganization>
  recheckCompletions: Maybe<Scalars["String"]>
  registerCompletion: Maybe<Scalars["String"]>
  updateAbEnrollment: Maybe<AbEnrollment>
  updateAbStudy: Maybe<AbStudy>
  updateCourse: Maybe<Course>
  updateCourseTranslation: Maybe<CourseTranslation>
  updateCourseVariant: Maybe<CourseVariant>
  updateEmailTemplate: Maybe<EmailTemplate>
  updateOpenUniversityRegistrationLink: Maybe<OpenUniversityRegistrationLink>
  updateResearchConsent: Maybe<User>
  updateService: Maybe<Service>
  updateStudyModule: Maybe<StudyModule>
  updateStudyModuletranslation: Maybe<StudyModuleTranslation>
  updateUserName: Maybe<User>
  updateUserOrganization: Maybe<UserOrganization>
}

export type MutationaddAbEnrollmentArgs = {
  abEnrollment: AbEnrollmentCreateOrUpsertInput
}

export type MutationaddAbStudyArgs = {
  abStudy: AbStudyCreateInput
}

export type MutationaddCompletionArgs = {
  completion_language?: InputMaybe<Scalars["String"]>
  course: Scalars["ID"]
  email?: InputMaybe<Scalars["String"]>
  student_number?: InputMaybe<Scalars["String"]>
  tier?: InputMaybe<Scalars["Int"]>
  user: Scalars["ID"]
  user_upstream_id?: InputMaybe<Scalars["Int"]>
}

export type MutationaddCourseArgs = {
  course: CourseCreateArg
}

export type MutationaddCourseAliasArgs = {
  course: Scalars["ID"]
  course_code: Scalars["String"]
}

export type MutationaddCourseOrganizationArgs = {
  course_id: Scalars["ID"]
  creator?: InputMaybe<Scalars["Boolean"]>
  organization_id: Scalars["ID"]
}

export type MutationaddCourseTranslationArgs = {
  course?: InputMaybe<Scalars["ID"]>
  description?: InputMaybe<Scalars["String"]>
  instructions?: InputMaybe<Scalars["String"]>
  language: Scalars["String"]
  link?: InputMaybe<Scalars["String"]>
  name?: InputMaybe<Scalars["String"]>
}

export type MutationaddCourseVariantArgs = {
  course_id: Scalars["ID"]
  description?: InputMaybe<Scalars["String"]>
  slug: Scalars["String"]
}

export type MutationaddEmailTemplateArgs = {
  exercise_completions_threshold?: InputMaybe<Scalars["Int"]>
  html_body?: InputMaybe<Scalars["String"]>
  name: Scalars["String"]
  points_threshold?: InputMaybe<Scalars["Int"]>
  template_type?: InputMaybe<Scalars["String"]>
  title?: InputMaybe<Scalars["String"]>
  triggered_automatically_by_course_id?: InputMaybe<Scalars["String"]>
  txt_body?: InputMaybe<Scalars["String"]>
}

export type MutationaddExerciseArgs = {
  course?: InputMaybe<Scalars["ID"]>
  custom_id?: InputMaybe<Scalars["String"]>
  max_points?: InputMaybe<Scalars["Int"]>
  name?: InputMaybe<Scalars["String"]>
  part?: InputMaybe<Scalars["Int"]>
  section?: InputMaybe<Scalars["Int"]>
  service?: InputMaybe<Scalars["ID"]>
}

export type MutationaddExerciseCompletionArgs = {
  exercise?: InputMaybe<Scalars["ID"]>
  n_points?: InputMaybe<Scalars["Int"]>
  original_submission_date?: InputMaybe<Scalars["DateTime"]>
  timestamp?: InputMaybe<Scalars["DateTime"]>
  user?: InputMaybe<Scalars["ID"]>
}

export type MutationaddImageArgs = {
  base64?: InputMaybe<Scalars["Boolean"]>
  file: Scalars["Upload"]
}

export type MutationaddManualCompletionArgs = {
  completions?: InputMaybe<Array<InputMaybe<ManualCompletionArg>>>
  course_id: Scalars["String"]
}

export type MutationaddOpenUniversityRegistrationLinkArgs = {
  course: Scalars["ID"]
  course_code: Scalars["String"]
  language?: InputMaybe<Scalars["String"]>
  link?: InputMaybe<Scalars["String"]>
}

export type MutationaddOrganizationArgs = {
  name?: InputMaybe<Scalars["String"]>
  slug: Scalars["String"]
}

export type MutationaddServiceArgs = {
  name: Scalars["String"]
  url: Scalars["String"]
}

export type MutationaddStudyModuleArgs = {
  study_module: StudyModuleCreateArg
}

export type MutationaddStudyModuleTranslationArgs = {
  description?: InputMaybe<Scalars["String"]>
  language: Scalars["String"]
  name?: InputMaybe<Scalars["String"]>
  study_module: Scalars["ID"]
}

export type MutationaddUserArgs = {
  user: UserArg
}

export type MutationaddUserCourseProgressArgs = {
  course_id: Scalars["ID"]
  extra?: InputMaybe<Scalars["Json"]>
  max_points?: InputMaybe<Scalars["Float"]>
  n_points?: InputMaybe<Scalars["Float"]>
  progress?: InputMaybe<Array<PointsByGroup>>
  user_id: Scalars["ID"]
}

export type MutationaddUserCourseServiceProgressArgs = {
  progress: PointsByGroup
  service_id: Scalars["ID"]
  user_course_progress_id: Scalars["ID"]
}

export type MutationaddUserOrganizationArgs = {
  organization_id: Scalars["ID"]
  user_id: Scalars["ID"]
}

export type MutationaddVerifiedUserArgs = {
  verified_user: VerifiedUserArg
}

export type MutationcreateCourseStatsSubscriptionArgs = {
  id: Scalars["ID"]
}

export type MutationcreateRegistrationAttemptDateArgs = {
  completion_registration_attempt_date: Scalars["DateTime"]
  id: Scalars["ID"]
}

export type MutationdeleteCourseArgs = {
  id?: InputMaybe<Scalars["ID"]>
  slug?: InputMaybe<Scalars["String"]>
}

export type MutationdeleteCourseOrganizationArgs = {
  id: Scalars["ID"]
}

export type MutationdeleteCourseStatsSubscriptionArgs = {
  id: Scalars["ID"]
}

export type MutationdeleteCourseTranslationArgs = {
  id: Scalars["ID"]
}

export type MutationdeleteCourseVariantArgs = {
  id: Scalars["ID"]
}

export type MutationdeleteEmailTemplateArgs = {
  id: Scalars["ID"]
}

export type MutationdeleteImageArgs = {
  id: Scalars["ID"]
}

export type MutationdeleteStudyModuleArgs = {
  id?: InputMaybe<Scalars["ID"]>
  slug?: InputMaybe<Scalars["String"]>
}

export type MutationdeleteStudyModuleTranslationArgs = {
  id: Scalars["ID"]
}

export type MutationdeleteUserOrganizationArgs = {
  id: Scalars["ID"]
}

export type MutationrecheckCompletionsArgs = {
  course_id?: InputMaybe<Scalars["ID"]>
  slug?: InputMaybe<Scalars["String"]>
}

export type MutationregisterCompletionArgs = {
  completions?: InputMaybe<Array<InputMaybe<CompletionArg>>>
}

export type MutationupdateAbEnrollmentArgs = {
  abEnrollment: AbEnrollmentCreateOrUpsertInput
}

export type MutationupdateAbStudyArgs = {
  abStudy: AbStudyUpsertInput
}

export type MutationupdateCourseArgs = {
  course: CourseUpsertArg
}

export type MutationupdateCourseTranslationArgs = {
  course?: InputMaybe<Scalars["ID"]>
  description?: InputMaybe<Scalars["String"]>
  id: Scalars["ID"]
  instructions?: InputMaybe<Scalars["String"]>
  language: Scalars["String"]
  link?: InputMaybe<Scalars["String"]>
  name?: InputMaybe<Scalars["String"]>
}

export type MutationupdateCourseVariantArgs = {
  description?: InputMaybe<Scalars["String"]>
  id: Scalars["ID"]
  slug?: InputMaybe<Scalars["String"]>
}

export type MutationupdateEmailTemplateArgs = {
  exercise_completions_threshold?: InputMaybe<Scalars["Int"]>
  html_body?: InputMaybe<Scalars["String"]>
  id: Scalars["ID"]
  name?: InputMaybe<Scalars["String"]>
  points_threshold?: InputMaybe<Scalars["Int"]>
  template_type?: InputMaybe<Scalars["String"]>
  title?: InputMaybe<Scalars["String"]>
  triggered_automatically_by_course_id?: InputMaybe<Scalars["String"]>
  txt_body?: InputMaybe<Scalars["String"]>
}

export type MutationupdateOpenUniversityRegistrationLinkArgs = {
  course: Scalars["ID"]
  course_code?: InputMaybe<Scalars["String"]>
  id: Scalars["ID"]
  language?: InputMaybe<Scalars["String"]>
  link?: InputMaybe<Scalars["String"]>
}

export type MutationupdateResearchConsentArgs = {
  value: Scalars["Boolean"]
}

export type MutationupdateServiceArgs = {
  id: Scalars["ID"]
  name?: InputMaybe<Scalars["String"]>
  url?: InputMaybe<Scalars["String"]>
}

export type MutationupdateStudyModuleArgs = {
  study_module: StudyModuleUpsertArg
}

export type MutationupdateStudyModuletranslationArgs = {
  description?: InputMaybe<Scalars["String"]>
  id: Scalars["ID"]
  language?: InputMaybe<Scalars["String"]>
  name?: InputMaybe<Scalars["String"]>
  study_module: Scalars["ID"]
}

export type MutationupdateUserNameArgs = {
  first_name?: InputMaybe<Scalars["String"]>
  last_name?: InputMaybe<Scalars["String"]>
}

export type MutationupdateUserOrganizationArgs = {
  id: Scalars["ID"]
  role?: InputMaybe<OrganizationRole>
}

export type NestedStringNullableFilter = {
  contains?: InputMaybe<Scalars["String"]>
  endsWith?: InputMaybe<Scalars["String"]>
  equals?: InputMaybe<Scalars["String"]>
  gt?: InputMaybe<Scalars["String"]>
  gte?: InputMaybe<Scalars["String"]>
  in?: InputMaybe<Array<Scalars["String"]>>
  lt?: InputMaybe<Scalars["String"]>
  lte?: InputMaybe<Scalars["String"]>
  not?: InputMaybe<NestedStringNullableFilter>
  notIn?: InputMaybe<Array<Scalars["String"]>>
  startsWith?: InputMaybe<Scalars["String"]>
}

export type OpenUniversityRegistrationLink = {
  __typename?: "OpenUniversityRegistrationLink"
  course: Maybe<Course>
  course_code: Scalars["String"]
  course_id: Maybe<Scalars["String"]>
  created_at: Maybe<Scalars["DateTime"]>
  id: Scalars["String"]
  language: Scalars["String"]
  link: Maybe<Scalars["String"]>
  start_date: Maybe<Scalars["DateTime"]>
  stop_date: Maybe<Scalars["DateTime"]>
  tiers: Maybe<Scalars["Json"]>
  updated_at: Maybe<Scalars["DateTime"]>
}

export type OpenUniversityRegistrationLinkCreateInput = {
  course_code: Scalars["String"]
  language: Scalars["String"]
  link?: InputMaybe<Scalars["String"]>
  start_date?: InputMaybe<Scalars["DateTime"]>
  stop_date?: InputMaybe<Scalars["DateTime"]>
  tiers?: InputMaybe<Scalars["Json"]>
}

export type OpenUniversityRegistrationLinkUpsertInput = {
  course_code: Scalars["String"]
  id?: InputMaybe<Scalars["ID"]>
  language: Scalars["String"]
  link?: InputMaybe<Scalars["String"]>
  start_date?: InputMaybe<Scalars["DateTime"]>
  stop_date?: InputMaybe<Scalars["DateTime"]>
  tiers?: InputMaybe<Scalars["Json"]>
}

export type OpenUniversityRegistrationLinkWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
}

export type Organization = {
  __typename?: "Organization"
  completions_registered: Array<CompletionRegistered>
  contact_information: Maybe<Scalars["String"]>
  course_organizations: Array<CourseOrganization>
  courses: Array<Course>
  created_at: Maybe<Scalars["DateTime"]>
  creator: Maybe<User>
  creator_id: Maybe<Scalars["String"]>
  disabled: Maybe<Scalars["Boolean"]>
  email: Maybe<Scalars["String"]>
  hidden: Maybe<Scalars["Boolean"]>
  id: Scalars["String"]
  logo_content_type: Maybe<Scalars["String"]>
  logo_file_name: Maybe<Scalars["String"]>
  logo_file_size: Maybe<Scalars["Int"]>
  logo_updated_at: Maybe<Scalars["DateTime"]>
  organization_translations: Array<OrganizationTranslation>
  phone: Maybe<Scalars["String"]>
  pinned: Maybe<Scalars["Boolean"]>
  slug: Scalars["String"]
  tmc_created_at: Maybe<Scalars["DateTime"]>
  tmc_updated_at: Maybe<Scalars["DateTime"]>
  updated_at: Maybe<Scalars["DateTime"]>
  user_organizations: Array<UserOrganization>
  verified: Maybe<Scalars["Boolean"]>
  verified_at: Maybe<Scalars["DateTime"]>
  verified_users: Array<VerifiedUser>
  website: Maybe<Scalars["String"]>
}

export type Organizationcompletions_registeredArgs = {
  cursor?: InputMaybe<CompletionRegisteredWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type Organizationcourse_organizationsArgs = {
  cursor?: InputMaybe<CourseOrganizationWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type OrganizationcoursesArgs = {
  cursor?: InputMaybe<CourseWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type Organizationorganization_translationsArgs = {
  cursor?: InputMaybe<OrganizationTranslationWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type Organizationuser_organizationsArgs = {
  cursor?: InputMaybe<UserOrganizationWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type Organizationverified_usersArgs = {
  cursor?: InputMaybe<VerifiedUserWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type OrganizationOrderByInput = {
  contact_information?: InputMaybe<SortOrder>
  created_at?: InputMaybe<SortOrder>
  creator_id?: InputMaybe<SortOrder>
  disabled?: InputMaybe<SortOrder>
  email?: InputMaybe<SortOrder>
  hidden?: InputMaybe<SortOrder>
  id?: InputMaybe<SortOrder>
  logo_content_type?: InputMaybe<SortOrder>
  logo_file_name?: InputMaybe<SortOrder>
  logo_file_size?: InputMaybe<SortOrder>
  logo_updated_at?: InputMaybe<SortOrder>
  phone?: InputMaybe<SortOrder>
  pinned?: InputMaybe<SortOrder>
  secret_key?: InputMaybe<SortOrder>
  slug?: InputMaybe<SortOrder>
  tmc_created_at?: InputMaybe<SortOrder>
  tmc_updated_at?: InputMaybe<SortOrder>
  updated_at?: InputMaybe<SortOrder>
  verified?: InputMaybe<SortOrder>
  verified_at?: InputMaybe<SortOrder>
  website?: InputMaybe<SortOrder>
}

export enum OrganizationRole {
  OrganizationAdmin = "OrganizationAdmin",
  Student = "Student",
  Teacher = "Teacher",
}

export type OrganizationTranslation = {
  __typename?: "OrganizationTranslation"
  created_at: Maybe<Scalars["DateTime"]>
  disabled_reason: Maybe<Scalars["String"]>
  id: Scalars["String"]
  information: Maybe<Scalars["String"]>
  language: Scalars["String"]
  name: Scalars["String"]
  organization: Maybe<Organization>
  organization_id: Maybe<Scalars["String"]>
  updated_at: Maybe<Scalars["DateTime"]>
}

export type OrganizationTranslationWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
}

export type OrganizationWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
  secret_key?: InputMaybe<Scalars["String"]>
  slug?: InputMaybe<Scalars["String"]>
}

/** PageInfo cursor, as defined in https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
export type PageInfo = {
  __typename?: "PageInfo"
  /** The cursor corresponding to the last nodes in edges. Null if the connection is empty. */
  endCursor: Maybe<Scalars["String"]>
  /** Used to indicate whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars["Boolean"]
  /** Used to indicate whether more edges exist prior to the set defined by the clients arguments. */
  hasPreviousPage: Scalars["Boolean"]
  /** The cursor corresponding to the first nodes in edges. Null if the connection is empty. */
  startCursor: Maybe<Scalars["String"]>
}

export type PointsByGroup = {
  group: Scalars["String"]
  max_points: Scalars["Int"]
  n_points: Scalars["Int"]
  progress: Scalars["Float"]
}

export type Progress = {
  __typename?: "Progress"
  course: Maybe<Course>
  user: Maybe<User>
  user_course_progress: Maybe<UserCourseProgress>
  user_course_service_progresses: Maybe<Array<Maybe<UserCourseServiceProgress>>>
}

export type Query = {
  __typename?: "Query"
  completions: Maybe<Array<Maybe<Completion>>>
  completionsPaginated: Maybe<QueryCompletionsPaginated_type_Connection>
  completionsPaginated_type: Maybe<QueryCompletionsPaginated_type_Connection>
  course: Maybe<Course>
  courseAliases: Array<CourseAlias>
  courseOrganizations: Maybe<Array<Maybe<CourseOrganization>>>
  courseTranslations: Maybe<Array<Maybe<CourseTranslation>>>
  courseVariant: Maybe<CourseVariant>
  courseVariants: Maybe<Array<Maybe<CourseVariant>>>
  course_exists: Maybe<Scalars["Boolean"]>
  courses: Maybe<Array<Maybe<Course>>>
  currentUser: Maybe<User>
  email_template: Maybe<EmailTemplate>
  email_templates: Maybe<Array<Maybe<EmailTemplate>>>
  exercise: Maybe<Exercise>
  exerciseCompletion: Maybe<ExerciseCompletion>
  exerciseCompletions: Array<ExerciseCompletion>
  exercises: Array<Exercise>
  handlerCourses: Maybe<Array<Maybe<Course>>>
  openUniversityRegistrationLink: Maybe<OpenUniversityRegistrationLink>
  openUniversityRegistrationLinks: Array<OpenUniversityRegistrationLink>
  organization: Maybe<Organization>
  organizations: Maybe<Array<Maybe<Organization>>>
  registeredCompletions: Maybe<Array<Maybe<CompletionRegistered>>>
  service: Maybe<Service>
  services: Array<Service>
  studyModuleTranslations: Array<StudyModuleTranslation>
  study_module: Maybe<StudyModule>
  study_module_exists: Maybe<Scalars["Boolean"]>
  study_modules: Maybe<Array<Maybe<StudyModule>>>
  user: Maybe<User>
  userCourseProgress: Maybe<UserCourseProgress>
  userCourseProgresses: Maybe<Array<Maybe<UserCourseProgress>>>
  userCourseServiceProgress: Maybe<UserCourseServiceProgress>
  userCourseServiceProgresses: Array<UserCourseServiceProgress>
  userCourseSetting: Maybe<UserCourseSetting>
  userCourseSettingCount: Maybe<Scalars["Int"]>
  userCourseSettings: Maybe<QueryUserCourseSettings_Connection>
  userDetailsContains: Maybe<QueryUserDetailsContains_Connection>
  userOrganizations: Maybe<Array<Maybe<UserOrganization>>>
  users: Array<User>
}

export type QuerycompletionsArgs = {
  after?: InputMaybe<Scalars["ID"]>
  before?: InputMaybe<Scalars["ID"]>
  completion_language?: InputMaybe<Scalars["String"]>
  course: Scalars["String"]
  first?: InputMaybe<Scalars["Int"]>
  last?: InputMaybe<Scalars["Int"]>
}

export type QuerycompletionsPaginatedArgs = {
  after?: InputMaybe<Scalars["String"]>
  before?: InputMaybe<Scalars["String"]>
  completion_language?: InputMaybe<Scalars["String"]>
  course: Scalars["String"]
  first?: InputMaybe<Scalars["Int"]>
  last?: InputMaybe<Scalars["Int"]>
  search?: InputMaybe<Scalars["String"]>
  skip?: InputMaybe<Scalars["Int"]>
}

export type QuerycompletionsPaginated_typeArgs = {
  after?: InputMaybe<Scalars["String"]>
  before?: InputMaybe<Scalars["String"]>
  completion_language?: InputMaybe<Scalars["String"]>
  course: Scalars["String"]
  first?: InputMaybe<Scalars["Int"]>
  last?: InputMaybe<Scalars["Int"]>
  search?: InputMaybe<Scalars["String"]>
  skip?: InputMaybe<Scalars["Int"]>
}

export type QuerycourseArgs = {
  id?: InputMaybe<Scalars["ID"]>
  language?: InputMaybe<Scalars["String"]>
  slug?: InputMaybe<Scalars["String"]>
  translationFallback?: InputMaybe<Scalars["Boolean"]>
}

export type QuerycourseAliasesArgs = {
  cursor?: InputMaybe<CourseAliasWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type QuerycourseOrganizationsArgs = {
  course_id?: InputMaybe<Scalars["ID"]>
  organization_id?: InputMaybe<Scalars["ID"]>
}

export type QuerycourseTranslationsArgs = {
  language?: InputMaybe<Scalars["String"]>
}

export type QuerycourseVariantArgs = {
  id: Scalars["ID"]
}

export type QuerycourseVariantsArgs = {
  course_id?: InputMaybe<Scalars["ID"]>
}

export type Querycourse_existsArgs = {
  slug: Scalars["String"]
}

export type QuerycoursesArgs = {
  handledBy?: InputMaybe<Scalars["String"]>
  hidden?: InputMaybe<Scalars["Boolean"]>
  language?: InputMaybe<Scalars["String"]>
  orderBy?: InputMaybe<CourseOrderByInput>
  search?: InputMaybe<Scalars["String"]>
  status?: InputMaybe<Array<CourseStatus>>
}

export type QuerycurrentUserArgs = {
  search?: InputMaybe<Scalars["String"]>
}

export type Queryemail_templateArgs = {
  id: Scalars["ID"]
}

export type QueryexerciseArgs = {
  id: Scalars["ID"]
}

export type QueryexerciseCompletionArgs = {
  id: Scalars["ID"]
}

export type QueryexerciseCompletionsArgs = {
  cursor?: InputMaybe<ExerciseCompletionWhereUniqueInput>
  orderBy?: InputMaybe<Array<ExerciseCompletionOrderByInput>>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type QueryexercisesArgs = {
  cursor?: InputMaybe<ExerciseWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type QueryopenUniversityRegistrationLinkArgs = {
  id: Scalars["ID"]
}

export type QueryopenUniversityRegistrationLinksArgs = {
  cursor?: InputMaybe<OpenUniversityRegistrationLinkWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type QueryorganizationArgs = {
  hidden?: InputMaybe<Scalars["Boolean"]>
  id?: InputMaybe<Scalars["ID"]>
}

export type QueryorganizationsArgs = {
  cursor?: InputMaybe<OrganizationWhereUniqueInput>
  hidden?: InputMaybe<Scalars["Boolean"]>
  orderBy?: InputMaybe<OrganizationOrderByInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type QueryregisteredCompletionsArgs = {
  course?: InputMaybe<Scalars["String"]>
  cursor?: InputMaybe<CompletionRegisteredWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type QueryserviceArgs = {
  service_id: Scalars["ID"]
}

export type Querystudy_moduleArgs = {
  id?: InputMaybe<Scalars["ID"]>
  language?: InputMaybe<Scalars["String"]>
  slug?: InputMaybe<Scalars["String"]>
  translationFallback?: InputMaybe<Scalars["Boolean"]>
}

export type Querystudy_module_existsArgs = {
  slug: Scalars["String"]
}

export type Querystudy_modulesArgs = {
  language?: InputMaybe<Scalars["String"]>
  orderBy?: InputMaybe<StudyModuleOrderByInput>
}

export type QueryuserArgs = {
  id?: InputMaybe<Scalars["ID"]>
  search?: InputMaybe<Scalars["String"]>
  upstream_id?: InputMaybe<Scalars["Int"]>
}

export type QueryuserCourseProgressArgs = {
  course_id: Scalars["ID"]
  user_id: Scalars["ID"]
}

export type QueryuserCourseProgressesArgs = {
  course_id?: InputMaybe<Scalars["ID"]>
  course_slug?: InputMaybe<Scalars["String"]>
  cursor?: InputMaybe<UserCourseProgressWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
  user_id?: InputMaybe<Scalars["ID"]>
}

export type QueryuserCourseServiceProgressArgs = {
  course_id?: InputMaybe<Scalars["ID"]>
  service_id?: InputMaybe<Scalars["ID"]>
  user_id?: InputMaybe<Scalars["ID"]>
}

export type QueryuserCourseServiceProgressesArgs = {
  cursor?: InputMaybe<UserCourseServiceProgressWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
  where?: InputMaybe<QueryUserCourseServiceProgressesWhereInput>
}

export type QueryuserCourseSettingArgs = {
  course_id: Scalars["ID"]
  user_id: Scalars["ID"]
}

export type QueryuserCourseSettingCountArgs = {
  course_id?: InputMaybe<Scalars["ID"]>
  user_id?: InputMaybe<Scalars["ID"]>
}

export type QueryuserCourseSettingsArgs = {
  after?: InputMaybe<Scalars["String"]>
  before?: InputMaybe<Scalars["String"]>
  course_id?: InputMaybe<Scalars["ID"]>
  first?: InputMaybe<Scalars["Int"]>
  last?: InputMaybe<Scalars["Int"]>
  search?: InputMaybe<Scalars["String"]>
  skip?: InputMaybe<Scalars["Int"]>
  user_id?: InputMaybe<Scalars["ID"]>
  user_upstream_id?: InputMaybe<Scalars["Int"]>
}

export type QueryuserDetailsContainsArgs = {
  after?: InputMaybe<Scalars["String"]>
  before?: InputMaybe<Scalars["String"]>
  first?: InputMaybe<Scalars["Int"]>
  last?: InputMaybe<Scalars["Int"]>
  search?: InputMaybe<Scalars["String"]>
  skip?: InputMaybe<Scalars["Int"]>
}

export type QueryuserOrganizationsArgs = {
  organization_id?: InputMaybe<Scalars["ID"]>
  user_id?: InputMaybe<Scalars["ID"]>
}

export type QueryusersArgs = {
  cursor?: InputMaybe<UserWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type QueryCompletionsPaginated_type_Connection = {
  __typename?: "QueryCompletionsPaginated_type_Connection"
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges: Maybe<Array<Maybe<CompletionEdge>>>
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo
  totalCount: Maybe<Scalars["Int"]>
}

export enum QueryMode {
  default = "default",
  insensitive = "insensitive",
}

export type QueryUserCourseServiceProgressesWhereInput = {
  course_id?: InputMaybe<StringNullableFilter>
  service_id?: InputMaybe<StringNullableFilter>
  user_id?: InputMaybe<StringNullableFilter>
}

export type QueryUserCourseSettings_Connection = {
  __typename?: "QueryUserCourseSettings_Connection"
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges: Maybe<Array<Maybe<UserCourseSettingEdge>>>
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo
  totalCount: Maybe<Scalars["Int"]>
}

export type QueryUserDetailsContains_Connection = {
  __typename?: "QueryUserDetailsContains_Connection"
  count: Maybe<Scalars["Int"]>
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges: Maybe<Array<Maybe<UserEdge>>>
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo
}

export type QueryUserDetailsContains_ConnectioncountArgs = {
  search?: InputMaybe<Scalars["String"]>
}

export type Service = {
  __typename?: "Service"
  courses: Array<Course>
  created_at: Maybe<Scalars["DateTime"]>
  exercises: Array<Exercise>
  id: Scalars["String"]
  name: Scalars["String"]
  updated_at: Maybe<Scalars["DateTime"]>
  url: Scalars["String"]
  user_course_service_progresses: Array<UserCourseServiceProgress>
}

export type ServicecoursesArgs = {
  cursor?: InputMaybe<CourseWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type ServiceexercisesArgs = {
  cursor?: InputMaybe<ExerciseWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type Serviceuser_course_service_progressesArgs = {
  cursor?: InputMaybe<UserCourseServiceProgressWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type ServiceWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
}

export enum SortOrder {
  asc = "asc",
  desc = "desc",
}

export type StoredData = {
  __typename?: "StoredData"
  course: Maybe<Course>
  course_id: Scalars["String"]
  created_at: Maybe<Scalars["DateTime"]>
  data: Scalars["String"]
  updated_at: Maybe<Scalars["DateTime"]>
  user: Maybe<User>
  user_id: Scalars["String"]
}

export type StringNullableFilter = {
  contains?: InputMaybe<Scalars["String"]>
  endsWith?: InputMaybe<Scalars["String"]>
  equals?: InputMaybe<Scalars["String"]>
  gt?: InputMaybe<Scalars["String"]>
  gte?: InputMaybe<Scalars["String"]>
  in?: InputMaybe<Array<Scalars["String"]>>
  lt?: InputMaybe<Scalars["String"]>
  lte?: InputMaybe<Scalars["String"]>
  mode?: InputMaybe<QueryMode>
  not?: InputMaybe<NestedStringNullableFilter>
  notIn?: InputMaybe<Array<Scalars["String"]>>
  startsWith?: InputMaybe<Scalars["String"]>
}

export type StudyModule = {
  __typename?: "StudyModule"
  courses: Maybe<Array<Maybe<Course>>>
  created_at: Maybe<Scalars["DateTime"]>
  description: Maybe<Scalars["String"]>
  id: Scalars["String"]
  image: Maybe<Scalars["String"]>
  name: Scalars["String"]
  order: Maybe<Scalars["Int"]>
  slug: Scalars["String"]
  study_module_translations: Array<StudyModuleTranslation>
  updated_at: Maybe<Scalars["DateTime"]>
}

export type StudyModulecoursesArgs = {
  language?: InputMaybe<Scalars["String"]>
  orderBy?: InputMaybe<CourseOrderByInput>
}

export type StudyModulestudy_module_translationsArgs = {
  cursor?: InputMaybe<StudyModuleTranslationWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type StudyModuleCreateArg = {
  image?: InputMaybe<Scalars["String"]>
  name?: InputMaybe<Scalars["String"]>
  order?: InputMaybe<Scalars["Int"]>
  slug: Scalars["String"]
  study_module_translations?: InputMaybe<
    Array<InputMaybe<StudyModuleTranslationUpsertInput>>
  >
}

export type StudyModuleOrderByInput = {
  created_at?: InputMaybe<SortOrder>
  id?: InputMaybe<SortOrder>
  image?: InputMaybe<SortOrder>
  name?: InputMaybe<SortOrder>
  order?: InputMaybe<SortOrder>
  slug?: InputMaybe<SortOrder>
  updated_at?: InputMaybe<SortOrder>
}

export type StudyModuleTranslation = {
  __typename?: "StudyModuleTranslation"
  created_at: Maybe<Scalars["DateTime"]>
  description: Scalars["String"]
  id: Scalars["String"]
  language: Scalars["String"]
  name: Scalars["String"]
  study_module: Maybe<StudyModule>
  study_module_id: Maybe<Scalars["String"]>
  updated_at: Maybe<Scalars["DateTime"]>
}

export type StudyModuleTranslationCreateInput = {
  description: Scalars["String"]
  language: Scalars["String"]
  name: Scalars["String"]
  study_module?: InputMaybe<Scalars["ID"]>
}

export type StudyModuleTranslationUpsertInput = {
  description: Scalars["String"]
  id?: InputMaybe<Scalars["ID"]>
  language: Scalars["String"]
  name: Scalars["String"]
  study_module?: InputMaybe<Scalars["ID"]>
}

export type StudyModuleTranslationWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
}

export type StudyModuleUpsertArg = {
  id?: InputMaybe<Scalars["ID"]>
  image?: InputMaybe<Scalars["String"]>
  name?: InputMaybe<Scalars["String"]>
  new_slug?: InputMaybe<Scalars["String"]>
  order?: InputMaybe<Scalars["Int"]>
  slug: Scalars["String"]
  study_module_translations?: InputMaybe<
    Array<InputMaybe<StudyModuleTranslationUpsertInput>>
  >
}

export type StudyModuleWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
  slug?: InputMaybe<Scalars["String"]>
}

export type User = {
  __typename?: "User"
  ab_enrollments: Array<AbEnrollment>
  administrator: Scalars["Boolean"]
  completions: Maybe<Array<Completion>>
  completions_registered: Maybe<Array<CompletionRegistered>>
  course_ownerships: Array<CourseOwnership>
  course_stats_subscriptions: Array<CourseStatsSubscription>
  created_at: Maybe<Scalars["DateTime"]>
  email: Scalars["String"]
  email_deliveries: Array<EmailDelivery>
  exercise_completions: Maybe<Array<Maybe<ExerciseCompletion>>>
  first_name: Maybe<Scalars["String"]>
  id: Scalars["String"]
  last_name: Maybe<Scalars["String"]>
  organizations: Array<Organization>
  progress: Progress
  progresses: Maybe<Array<Progress>>
  project_completion: Maybe<Scalars["Boolean"]>
  real_student_number: Maybe<Scalars["String"]>
  research_consent: Maybe<Scalars["Boolean"]>
  student_number: Maybe<Scalars["String"]>
  updated_at: Maybe<Scalars["DateTime"]>
  upstream_id: Scalars["Int"]
  user_course_progresses: Maybe<Array<UserCourseProgress>>
  user_course_progressess: Maybe<UserCourseProgress>
  user_course_service_progresses: Maybe<Array<UserCourseServiceProgress>>
  user_course_settings: Array<UserCourseSetting>
  user_course_summary: Maybe<Array<Maybe<UserCourseSummary>>>
  user_organizations: Array<UserOrganization>
  username: Scalars["String"]
  verified_users: Array<VerifiedUser>
}

export type Userab_enrollmentsArgs = {
  cursor?: InputMaybe<AbEnrollmentWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type UsercompletionsArgs = {
  course_id?: InputMaybe<Scalars["String"]>
  course_slug?: InputMaybe<Scalars["String"]>
}

export type Usercompletions_registeredArgs = {
  course_id?: InputMaybe<Scalars["String"]>
  course_slug?: InputMaybe<Scalars["String"]>
  organization_id?: InputMaybe<Scalars["String"]>
}

export type Usercourse_ownershipsArgs = {
  cursor?: InputMaybe<CourseOwnershipWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type Usercourse_stats_subscriptionsArgs = {
  cursor?: InputMaybe<CourseStatsSubscriptionWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type Useremail_deliveriesArgs = {
  cursor?: InputMaybe<EmailDeliveryWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type Userexercise_completionsArgs = {
  includeDeleted?: InputMaybe<Scalars["Boolean"]>
}

export type UserorganizationsArgs = {
  cursor?: InputMaybe<OrganizationWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type UserprogressArgs = {
  course_id?: InputMaybe<Scalars["ID"]>
  slug?: InputMaybe<Scalars["String"]>
}

export type Userproject_completionArgs = {
  course_id?: InputMaybe<Scalars["ID"]>
  course_slug?: InputMaybe<Scalars["String"]>
}

export type Useruser_course_progressessArgs = {
  course_id?: InputMaybe<Scalars["ID"]>
}

export type Useruser_course_settingsArgs = {
  cursor?: InputMaybe<UserCourseSettingWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type Useruser_organizationsArgs = {
  cursor?: InputMaybe<UserOrganizationWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type Userverified_usersArgs = {
  cursor?: InputMaybe<VerifiedUserWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type UserAppDatumConfig = {
  __typename?: "UserAppDatumConfig"
  created_at: Maybe<Scalars["DateTime"]>
  id: Scalars["String"]
  name: Maybe<Scalars["String"]>
  timestamp: Maybe<Scalars["DateTime"]>
  updated_at: Maybe<Scalars["DateTime"]>
}

export type UserArg = {
  email: Scalars["String"]
  first_name: Scalars["String"]
  last_name: Scalars["String"]
  research_consent: Scalars["Boolean"]
  upstream_id: Scalars["Int"]
  username: Scalars["String"]
}

export type UserCourseProgress = {
  __typename?: "UserCourseProgress"
  course: Maybe<Course>
  course_id: Maybe<Scalars["String"]>
  created_at: Maybe<Scalars["DateTime"]>
  exercise_progress: Maybe<ExerciseProgress>
  extra: Maybe<Scalars["Json"]>
  id: Scalars["String"]
  max_points: Maybe<Scalars["Float"]>
  n_points: Maybe<Scalars["Float"]>
  progress: Maybe<Array<Maybe<Scalars["Json"]>>>
  updated_at: Maybe<Scalars["DateTime"]>
  user: Maybe<User>
  user_course_service_progresses: Array<UserCourseServiceProgress>
  user_course_settings: Maybe<UserCourseSetting>
  user_id: Maybe<Scalars["String"]>
}

export type UserCourseProgressuser_course_service_progressesArgs = {
  cursor?: InputMaybe<UserCourseServiceProgressWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type UserCourseProgressWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
}

export type UserCourseServiceProgress = {
  __typename?: "UserCourseServiceProgress"
  course: Maybe<Course>
  course_id: Maybe<Scalars["String"]>
  created_at: Maybe<Scalars["DateTime"]>
  id: Scalars["String"]
  progress: Maybe<Array<Maybe<Scalars["Json"]>>>
  service: Maybe<Service>
  service_id: Maybe<Scalars["String"]>
  timestamp: Maybe<Scalars["DateTime"]>
  updated_at: Maybe<Scalars["DateTime"]>
  user: Maybe<User>
  user_course_progress: Maybe<UserCourseProgress>
  user_course_progress_id: Maybe<Scalars["String"]>
  user_id: Maybe<Scalars["String"]>
}

export type UserCourseServiceProgressWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
}

export type UserCourseSetting = {
  __typename?: "UserCourseSetting"
  country: Maybe<Scalars["String"]>
  course: Maybe<Course>
  course_id: Maybe<Scalars["String"]>
  course_variant: Maybe<Scalars["String"]>
  created_at: Maybe<Scalars["DateTime"]>
  id: Scalars["String"]
  language: Maybe<Scalars["String"]>
  marketing: Maybe<Scalars["Boolean"]>
  other: Maybe<Scalars["Json"]>
  research: Maybe<Scalars["Boolean"]>
  updated_at: Maybe<Scalars["DateTime"]>
  user: Maybe<User>
  user_id: Maybe<Scalars["String"]>
}

export type UserCourseSettingEdge = {
  __typename?: "UserCourseSettingEdge"
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor */
  cursor: Scalars["String"]
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Node */
  node: Maybe<UserCourseSetting>
}

export type UserCourseSettingWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
}

export type UserCourseSettingsVisibility = {
  __typename?: "UserCourseSettingsVisibility"
  course: Maybe<Course>
  course_id: Maybe<Scalars["String"]>
  created_at: Maybe<Scalars["DateTime"]>
  id: Scalars["String"]
  language: Scalars["String"]
  updated_at: Maybe<Scalars["DateTime"]>
}

export type UserCourseSettingsVisibilityCreateInput = {
  course?: InputMaybe<Scalars["ID"]>
  language: Scalars["String"]
}

export type UserCourseSettingsVisibilityUpsertInput = {
  course?: InputMaybe<Scalars["ID"]>
  id?: InputMaybe<Scalars["ID"]>
  language: Scalars["String"]
}

export type UserCourseSettingsVisibilityWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
}

export type UserCourseSummary = {
  __typename?: "UserCourseSummary"
  completion: Maybe<Completion>
  completions_handled_by_id: Maybe<Scalars["ID"]>
  course: Maybe<Course>
  course_id: Maybe<Scalars["ID"]>
  exercise_completions: Maybe<Array<Maybe<ExerciseCompletion>>>
  inherit_settings_from_id: Maybe<Scalars["ID"]>
  user_course_progress: Maybe<UserCourseProgress>
  user_course_service_progresses: Maybe<Array<Maybe<UserCourseServiceProgress>>>
  user_id: Maybe<Scalars["ID"]>
}

export type UserCourseSummaryexercise_completionsArgs = {
  includeDeleted?: InputMaybe<Scalars["Boolean"]>
}

export type UserEdge = {
  __typename?: "UserEdge"
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor */
  cursor: Scalars["String"]
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Node */
  node: Maybe<User>
}

export type UserOrganization = {
  __typename?: "UserOrganization"
  created_at: Maybe<Scalars["DateTime"]>
  id: Scalars["String"]
  organization: Maybe<Organization>
  organization_id: Maybe<Scalars["String"]>
  role: Maybe<OrganizationRole>
  updated_at: Maybe<Scalars["DateTime"]>
  user: Maybe<User>
  user_id: Maybe<Scalars["String"]>
}

export type UserOrganizationWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
}

export type UserWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
  upstream_id?: InputMaybe<Scalars["Int"]>
  username?: InputMaybe<Scalars["String"]>
}

export type VerifiedUser = {
  __typename?: "VerifiedUser"
  created_at: Maybe<Scalars["DateTime"]>
  display_name: Maybe<Scalars["String"]>
  id: Scalars["String"]
  organization: Maybe<Organization>
  organization_id: Maybe<Scalars["String"]>
  personal_unique_code: Scalars["String"]
  updated_at: Maybe<Scalars["DateTime"]>
  user: Maybe<User>
  user_id: Maybe<Scalars["String"]>
}

export type VerifiedUserArg = {
  display_name?: InputMaybe<Scalars["String"]>
  organization_id: Scalars["ID"]
  organization_secret: Scalars["String"]
  personal_unique_code: Scalars["String"]
}

export type VerifiedUserWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>
}

export type CompletionCoreFieldsFragment = {
  __typename?: "Completion"
  id: string
  course_id: string | null
  user_id: string | null
  email: string
  student_number: string | null
  completion_language: string | null
  completion_link: string | null
  completion_date: any | null
  tier: number | null
  grade: string | null
  eligible_for_ects: boolean | null
  project_completion: boolean | null
  registered: boolean | null
  created_at: any | null
  updated_at: any | null
}

export type CompletionCourseFieldsFragment = {
  __typename?: "Course"
  has_certificate: boolean | null
  id: string
  slug: string
  name: string
  ects: string | null
  created_at: any | null
  updated_at: any | null
  photo: {
    __typename?: "Image"
    id: string
    name: string | null
    original: string
    original_mimetype: string
    compressed: string | null
    compressed_mimetype: string | null
    uncompressed: string
    uncompressed_mimetype: string
    created_at: any | null
    updated_at: any | null
  } | null
}

export type CompletionDetailedFieldsFragment = {
  __typename?: "Completion"
  id: string
  course_id: string | null
  user_id: string | null
  email: string
  student_number: string | null
  completion_language: string | null
  completion_link: string | null
  completion_date: any | null
  tier: number | null
  grade: string | null
  eligible_for_ects: boolean | null
  project_completion: boolean | null
  registered: boolean | null
  created_at: any | null
  updated_at: any | null
  completions_registered: Array<{
    __typename?: "CompletionRegistered"
    id: string
    completion_id: string | null
    organization_id: string | null
    created_at: any | null
    updated_at: any | null
    organization: {
      __typename?: "Organization"
      id: string
      slug: string
    } | null
  }>
}

export type CompletionDetailedFieldsWithCourseFragment = {
  __typename?: "Completion"
  id: string
  course_id: string | null
  user_id: string | null
  email: string
  student_number: string | null
  completion_language: string | null
  completion_link: string | null
  completion_date: any | null
  tier: number | null
  grade: string | null
  eligible_for_ects: boolean | null
  project_completion: boolean | null
  registered: boolean | null
  created_at: any | null
  updated_at: any | null
  course: {
    __typename?: "Course"
    has_certificate: boolean | null
    id: string
    slug: string
    name: string
    ects: string | null
    created_at: any | null
    updated_at: any | null
    photo: {
      __typename?: "Image"
      id: string
      name: string | null
      original: string
      original_mimetype: string
      compressed: string | null
      compressed_mimetype: string | null
      uncompressed: string
      uncompressed_mimetype: string
      created_at: any | null
      updated_at: any | null
    } | null
  } | null
  completions_registered: Array<{
    __typename?: "CompletionRegistered"
    id: string
    completion_id: string | null
    organization_id: string | null
    created_at: any | null
    updated_at: any | null
    organization: {
      __typename?: "Organization"
      id: string
      slug: string
    } | null
  }>
}

export type CompletionsQueryNodeFieldsFragment = {
  __typename?: "Completion"
  id: string
  course_id: string | null
  user_id: string | null
  email: string
  student_number: string | null
  completion_language: string | null
  completion_link: string | null
  completion_date: any | null
  tier: number | null
  grade: string | null
  eligible_for_ects: boolean | null
  project_completion: boolean | null
  registered: boolean | null
  created_at: any | null
  updated_at: any | null
  user: {
    __typename?: "User"
    id: string
    upstream_id: number
    first_name: string | null
    last_name: string | null
    username: string
    email: string
    student_number: string | null
    real_student_number: string | null
    created_at: any | null
    updated_at: any | null
  } | null
  course: {
    __typename?: "Course"
    id: string
    name: string
    slug: string
    ects: string | null
    created_at: any | null
    updated_at: any | null
  } | null
  completions_registered: Array<{
    __typename?: "CompletionRegistered"
    id: string
    organization: {
      __typename?: "Organization"
      id: string
      slug: string
    } | null
  }>
}

export type CompletionsQueryConnectionFieldsFragment = {
  __typename?: "QueryCompletionsPaginated_type_Connection"
  pageInfo: {
    __typename?: "PageInfo"
    hasNextPage: boolean
    hasPreviousPage: boolean
    startCursor: string | null
    endCursor: string | null
  }
  edges: Array<{
    __typename?: "CompletionEdge"
    node: {
      __typename?: "Completion"
      id: string
      course_id: string | null
      user_id: string | null
      email: string
      student_number: string | null
      completion_language: string | null
      completion_link: string | null
      completion_date: any | null
      tier: number | null
      grade: string | null
      eligible_for_ects: boolean | null
      project_completion: boolean | null
      registered: boolean | null
      created_at: any | null
      updated_at: any | null
      user: {
        __typename?: "User"
        id: string
        upstream_id: number
        first_name: string | null
        last_name: string | null
        username: string
        email: string
        student_number: string | null
        real_student_number: string | null
        created_at: any | null
        updated_at: any | null
      } | null
      course: {
        __typename?: "Course"
        id: string
        name: string
        slug: string
        ects: string | null
        created_at: any | null
        updated_at: any | null
      } | null
      completions_registered: Array<{
        __typename?: "CompletionRegistered"
        id: string
        organization: {
          __typename?: "Organization"
          id: string
          slug: string
        } | null
      }>
    } | null
  } | null> | null
}

export type CompletionRegisteredCoreFieldsFragment = {
  __typename?: "CompletionRegistered"
  id: string
  completion_id: string | null
  organization_id: string | null
  created_at: any | null
  updated_at: any | null
  organization: { __typename?: "Organization"; id: string; slug: string } | null
}

export type CourseCoreFieldsFragment = {
  __typename?: "Course"
  id: string
  slug: string
  name: string
  ects: string | null
  created_at: any | null
  updated_at: any | null
}

export type CourseWithPhotoCoreFieldsFragment = {
  __typename?: "Course"
  id: string
  slug: string
  name: string
  ects: string | null
  created_at: any | null
  updated_at: any | null
  photo: {
    __typename?: "Image"
    id: string
    name: string | null
    original: string
    original_mimetype: string
    compressed: string | null
    compressed_mimetype: string | null
    uncompressed: string
    uncompressed_mimetype: string
    created_at: any | null
    updated_at: any | null
  } | null
}

export type CourseTranslationCoreFieldsFragment = {
  __typename?: "CourseTranslation"
  id: string
  course_id: string | null
  language: string
  name: string
  description: string
  link: string | null
  created_at: any | null
  updated_at: any | null
}

export type CourseFieldsFragment = {
  __typename?: "Course"
  description: string | null
  link: string | null
  order: number | null
  study_module_order: number | null
  promote: boolean | null
  status: CourseStatus | null
  start_point: boolean | null
  study_module_start_point: boolean | null
  hidden: boolean | null
  upcoming_active_link: boolean | null
  tier: number | null
  support_email: string | null
  teacher_in_charge_email: string
  teacher_in_charge_name: string
  start_date: string
  end_date: string | null
  id: string
  slug: string
  name: string
  ects: string | null
  created_at: any | null
  updated_at: any | null
  course_translations: Array<{
    __typename?: "CourseTranslation"
    id: string
    course_id: string | null
    language: string
    name: string
    description: string
    link: string | null
    created_at: any | null
    updated_at: any | null
  }>
  study_modules: Array<{
    __typename?: "StudyModule"
    id: string
    slug: string
    name: string
    created_at: any | null
    updated_at: any | null
  }>
  photo: {
    __typename?: "Image"
    id: string
    name: string | null
    original: string
    original_mimetype: string
    compressed: string | null
    compressed_mimetype: string | null
    uncompressed: string
    uncompressed_mimetype: string
    created_at: any | null
    updated_at: any | null
  } | null
}

export type EditorCourseFieldsFragment = {
  __typename?: "Course"
  instructions: string | null
  has_certificate: boolean | null
  upcoming_active_link: boolean | null
  description: string | null
  link: string | null
  order: number | null
  study_module_order: number | null
  promote: boolean | null
  status: CourseStatus | null
  start_point: boolean | null
  study_module_start_point: boolean | null
  hidden: boolean | null
  tier: number | null
  support_email: string | null
  teacher_in_charge_email: string
  teacher_in_charge_name: string
  start_date: string
  end_date: string | null
  id: string
  slug: string
  name: string
  ects: string | null
  created_at: any | null
  updated_at: any | null
  completions_handled_by: {
    __typename?: "Course"
    id: string
    slug: string
    name: string
    ects: string | null
    created_at: any | null
    updated_at: any | null
  } | null
  course_variants: Array<{
    __typename?: "CourseVariant"
    id: string
    slug: string
    description: string | null
  }>
  course_aliases: Array<{
    __typename?: "CourseAlias"
    id: string
    course_code: string
  }>
  user_course_settings_visibilities: Array<{
    __typename?: "UserCourseSettingsVisibility"
    id: string
    language: string
  }>
  course_translations: Array<{
    __typename?: "CourseTranslation"
    id: string
    course_id: string | null
    language: string
    name: string
    description: string
    link: string | null
    created_at: any | null
    updated_at: any | null
  }>
  study_modules: Array<{
    __typename?: "StudyModule"
    id: string
    slug: string
    name: string
    created_at: any | null
    updated_at: any | null
  }>
  photo: {
    __typename?: "Image"
    id: string
    name: string | null
    original: string
    original_mimetype: string
    compressed: string | null
    compressed_mimetype: string | null
    uncompressed: string
    uncompressed_mimetype: string
    created_at: any | null
    updated_at: any | null
  } | null
}

export type EditorCourseDetailedFieldsFragment = {
  __typename?: "Course"
  automatic_completions: boolean | null
  automatic_completions_eligible_for_ects: boolean | null
  exercise_completions_needed: number | null
  points_needed: number | null
  instructions: string | null
  has_certificate: boolean | null
  upcoming_active_link: boolean | null
  description: string | null
  link: string | null
  order: number | null
  study_module_order: number | null
  promote: boolean | null
  status: CourseStatus | null
  start_point: boolean | null
  study_module_start_point: boolean | null
  hidden: boolean | null
  tier: number | null
  support_email: string | null
  teacher_in_charge_email: string
  teacher_in_charge_name: string
  start_date: string
  end_date: string | null
  id: string
  slug: string
  name: string
  ects: string | null
  created_at: any | null
  updated_at: any | null
  course_translations: Array<{
    __typename?: "CourseTranslation"
    description: string
    instructions: string | null
    link: string | null
    id: string
    course_id: string | null
    language: string
    name: string
    created_at: any | null
    updated_at: any | null
  }>
  open_university_registration_links: Array<{
    __typename?: "OpenUniversityRegistrationLink"
    id: string
    course_code: string
    language: string
    link: string | null
  }>
  inherit_settings_from: { __typename?: "Course"; id: string } | null
  completions_handled_by: {
    __typename?: "Course"
    id: string
    slug: string
    name: string
    ects: string | null
    created_at: any | null
    updated_at: any | null
  } | null
  course_variants: Array<{
    __typename?: "CourseVariant"
    id: string
    slug: string
    description: string | null
  }>
  course_aliases: Array<{
    __typename?: "CourseAlias"
    id: string
    course_code: string
  }>
  user_course_settings_visibilities: Array<{
    __typename?: "UserCourseSettingsVisibility"
    id: string
    language: string
  }>
  study_modules: Array<{
    __typename?: "StudyModule"
    id: string
    slug: string
    name: string
    created_at: any | null
    updated_at: any | null
  }>
  photo: {
    __typename?: "Image"
    id: string
    name: string | null
    original: string
    original_mimetype: string
    compressed: string | null
    compressed_mimetype: string | null
    uncompressed: string
    uncompressed_mimetype: string
    created_at: any | null
    updated_at: any | null
  } | null
}

export type EditorCourseOtherCoursesFieldsFragment = {
  __typename?: "Course"
  id: string
  slug: string
  name: string
  ects: string | null
  created_at: any | null
  updated_at: any | null
  course_translations: Array<{
    __typename?: "CourseTranslation"
    id: string
    course_id: string | null
    language: string
    name: string
    description: string
    link: string | null
    created_at: any | null
    updated_at: any | null
  }>
  photo: {
    __typename?: "Image"
    id: string
    name: string | null
    original: string
    original_mimetype: string
    compressed: string | null
    compressed_mimetype: string | null
    uncompressed: string
    uncompressed_mimetype: string
    created_at: any | null
    updated_at: any | null
  } | null
}

export type EmailTemplateCoreFieldsFragment = {
  __typename?: "EmailTemplate"
  id: string
  name: string | null
  title: string | null
  txt_body: string | null
  html_body: string | null
  template_type: string | null
  created_at: any | null
  updated_at: any | null
}

export type EmailTemplateFieldsFragment = {
  __typename?: "EmailTemplate"
  triggered_automatically_by_course_id: string | null
  exercise_completions_threshold: number | null
  points_threshold: number | null
  id: string
  name: string | null
  title: string | null
  txt_body: string | null
  html_body: string | null
  template_type: string | null
  created_at: any | null
  updated_at: any | null
}

export type ExerciseCoreFieldsFragment = {
  __typename?: "Exercise"
  id: string
  name: string | null
  custom_id: string
  course_id: string | null
  part: number | null
  section: number | null
  max_points: number | null
  deleted: boolean | null
}

export type ExerciseCompletionCoreFieldsFragment = {
  __typename?: "ExerciseCompletion"
  id: string
  exercise_id: string | null
  user_id: string | null
  created_at: any | null
  updated_at: any | null
  attempted: boolean | null
  completed: boolean | null
  timestamp: any
  n_points: number | null
  exercise_completion_required_actions: Array<{
    __typename?: "ExerciseCompletionRequiredAction"
    id: string
    exercise_completion_id: string | null
    value: string
  }>
}

export type ImageCoreFieldsFragment = {
  __typename?: "Image"
  id: string
  name: string | null
  original: string
  original_mimetype: string
  compressed: string | null
  compressed_mimetype: string | null
  uncompressed: string
  uncompressed_mimetype: string
  created_at: any | null
  updated_at: any | null
}

export type OpenUniversityRegistrationLinkCoreFieldsFragment = {
  __typename?: "OpenUniversityRegistrationLink"
  id: string
  course_code: string
  language: string
  link: string | null
}

export type OrganizationCoreFieldsFragment = {
  __typename?: "Organization"
  id: string
  slug: string
  hidden: boolean | null
  created_at: any | null
  updated_at: any | null
  organization_translations: Array<{
    __typename?: "OrganizationTranslation"
    id: string
    organization_id: string | null
    language: string
    name: string
    information: string | null
  }>
}

export type ProgressCoreFieldsFragment = {
  __typename?: "Progress"
  course: {
    __typename?: "Course"
    id: string
    slug: string
    name: string
    ects: string | null
    created_at: any | null
    updated_at: any | null
  } | null
  user_course_progress: {
    __typename?: "UserCourseProgress"
    id: string
    course_id: string | null
    user_id: string | null
    max_points: number | null
    n_points: number | null
    progress: Array<any | null> | null
    extra: any | null
    created_at: any | null
    updated_at: any | null
    exercise_progress: {
      __typename?: "ExerciseProgress"
      total: number | null
      exercises: number | null
    } | null
  } | null
  user_course_service_progresses: Array<{
    __typename?: "UserCourseServiceProgress"
    id: string
    course_id: string | null
    service_id: string | null
    user_id: string | null
    progress: Array<any | null> | null
    created_at: any | null
    updated_at: any | null
    service: { __typename?: "Service"; name: string; id: string } | null
  } | null> | null
}

export type StudyModuleCoreFieldsFragment = {
  __typename?: "StudyModule"
  id: string
  slug: string
  name: string
  created_at: any | null
  updated_at: any | null
}

export type StudyModuleFieldsFragment = {
  __typename?: "StudyModule"
  description: string | null
  image: string | null
  order: number | null
  id: string
  slug: string
  name: string
  created_at: any | null
  updated_at: any | null
}

export type StudyModuleTranslationFieldsFragment = {
  __typename?: "StudyModuleTranslation"
  id: string
  study_module_id: string | null
  language: string
  name: string
  description: string
  created_at: any | null
  updated_at: any | null
}

export type StudyModuleDetailedFieldsFragment = {
  __typename?: "StudyModule"
  description: string | null
  image: string | null
  order: number | null
  id: string
  slug: string
  name: string
  created_at: any | null
  updated_at: any | null
  study_module_translations: Array<{
    __typename?: "StudyModuleTranslation"
    id: string
    study_module_id: string | null
    language: string
    name: string
    description: string
    created_at: any | null
    updated_at: any | null
  }>
}

export type StudyModuleFieldsWithCoursesFragment = {
  __typename?: "StudyModule"
  description: string | null
  image: string | null
  order: number | null
  id: string
  slug: string
  name: string
  created_at: any | null
  updated_at: any | null
  courses: Array<{
    __typename?: "Course"
    description: string | null
    link: string | null
    order: number | null
    study_module_order: number | null
    promote: boolean | null
    status: CourseStatus | null
    start_point: boolean | null
    study_module_start_point: boolean | null
    hidden: boolean | null
    upcoming_active_link: boolean | null
    tier: number | null
    support_email: string | null
    teacher_in_charge_email: string
    teacher_in_charge_name: string
    start_date: string
    end_date: string | null
    id: string
    slug: string
    name: string
    ects: string | null
    created_at: any | null
    updated_at: any | null
    course_translations: Array<{
      __typename?: "CourseTranslation"
      id: string
      course_id: string | null
      language: string
      name: string
      description: string
      link: string | null
      created_at: any | null
      updated_at: any | null
    }>
    study_modules: Array<{
      __typename?: "StudyModule"
      id: string
      slug: string
      name: string
      created_at: any | null
      updated_at: any | null
    }>
    photo: {
      __typename?: "Image"
      id: string
      name: string | null
      original: string
      original_mimetype: string
      compressed: string | null
      compressed_mimetype: string | null
      uncompressed: string
      uncompressed_mimetype: string
      created_at: any | null
      updated_at: any | null
    } | null
  } | null> | null
}

export type UserCoreFieldsFragment = {
  __typename?: "User"
  id: string
  upstream_id: number
  first_name: string | null
  last_name: string | null
  username: string
  email: string
  student_number: string | null
  real_student_number: string | null
  created_at: any | null
  updated_at: any | null
}

export type UserDetailedFieldsFragment = {
  __typename?: "User"
  administrator: boolean
  research_consent: boolean | null
  id: string
  upstream_id: number
  first_name: string | null
  last_name: string | null
  username: string
  email: string
  student_number: string | null
  real_student_number: string | null
  created_at: any | null
  updated_at: any | null
}

export type UserProgressesFieldsFragment = {
  __typename?: "User"
  id: string
  upstream_id: number
  first_name: string | null
  last_name: string | null
  username: string
  email: string
  student_number: string | null
  real_student_number: string | null
  created_at: any | null
  updated_at: any | null
  progresses: Array<{
    __typename?: "Progress"
    course: {
      __typename?: "Course"
      id: string
      slug: string
      name: string
      ects: string | null
      created_at: any | null
      updated_at: any | null
    } | null
    user_course_progress: {
      __typename?: "UserCourseProgress"
      id: string
      course_id: string | null
      user_id: string | null
      max_points: number | null
      n_points: number | null
      progress: Array<any | null> | null
      extra: any | null
      created_at: any | null
      updated_at: any | null
      exercise_progress: {
        __typename?: "ExerciseProgress"
        total: number | null
        exercises: number | null
      } | null
    } | null
    user_course_service_progresses: Array<{
      __typename?: "UserCourseServiceProgress"
      id: string
      course_id: string | null
      service_id: string | null
      user_id: string | null
      progress: Array<any | null> | null
      created_at: any | null
      updated_at: any | null
      service: { __typename?: "Service"; name: string; id: string } | null
    } | null> | null
  }> | null
}

export type UserOverviewFieldsFragment = {
  __typename?: "User"
  administrator: boolean
  research_consent: boolean | null
  id: string
  upstream_id: number
  first_name: string | null
  last_name: string | null
  username: string
  email: string
  student_number: string | null
  real_student_number: string | null
  created_at: any | null
  updated_at: any | null
  completions: Array<{
    __typename?: "Completion"
    id: string
    course_id: string | null
    user_id: string | null
    email: string
    student_number: string | null
    completion_language: string | null
    completion_link: string | null
    completion_date: any | null
    tier: number | null
    grade: string | null
    eligible_for_ects: boolean | null
    project_completion: boolean | null
    registered: boolean | null
    created_at: any | null
    updated_at: any | null
    course: {
      __typename?: "Course"
      has_certificate: boolean | null
      id: string
      slug: string
      name: string
      ects: string | null
      created_at: any | null
      updated_at: any | null
      photo: {
        __typename?: "Image"
        id: string
        name: string | null
        original: string
        original_mimetype: string
        compressed: string | null
        compressed_mimetype: string | null
        uncompressed: string
        uncompressed_mimetype: string
        created_at: any | null
        updated_at: any | null
      } | null
    } | null
    completions_registered: Array<{
      __typename?: "CompletionRegistered"
      id: string
      completion_id: string | null
      organization_id: string | null
      created_at: any | null
      updated_at: any | null
      organization: {
        __typename?: "Organization"
        id: string
        slug: string
      } | null
    }>
  }> | null
}

export type UserCourseProgressCoreFieldsFragment = {
  __typename?: "UserCourseProgress"
  id: string
  course_id: string | null
  user_id: string | null
  max_points: number | null
  n_points: number | null
  progress: Array<any | null> | null
  extra: any | null
  created_at: any | null
  updated_at: any | null
  exercise_progress: {
    __typename?: "ExerciseProgress"
    total: number | null
    exercises: number | null
  } | null
}

export type UserCourseServiceProgressCoreFieldsFragment = {
  __typename?: "UserCourseServiceProgress"
  id: string
  course_id: string | null
  service_id: string | null
  user_id: string | null
  progress: Array<any | null> | null
  created_at: any | null
  updated_at: any | null
  service: { __typename?: "Service"; name: string; id: string } | null
}

export type UserCourseSettingCoreFieldsFragment = {
  __typename?: "UserCourseSetting"
  id: string
  user_id: string | null
  course_id: string | null
  created_at: any | null
  updated_at: any | null
}

export type UserCourseSettingDetailedFieldsFragment = {
  __typename?: "UserCourseSetting"
  language: string | null
  country: string | null
  research: boolean | null
  marketing: boolean | null
  course_variant: string | null
  other: any | null
  id: string
  user_id: string | null
  course_id: string | null
  created_at: any | null
  updated_at: any | null
}

export type StudentProgressesQueryNodeFieldsFragment = {
  __typename?: "UserCourseSetting"
  id: string
  user_id: string | null
  course_id: string | null
  created_at: any | null
  updated_at: any | null
  user: {
    __typename?: "User"
    id: string
    upstream_id: number
    first_name: string | null
    last_name: string | null
    username: string
    email: string
    student_number: string | null
    real_student_number: string | null
    created_at: any | null
    updated_at: any | null
    progress: {
      __typename?: "Progress"
      course: {
        __typename?: "Course"
        id: string
        slug: string
        name: string
        ects: string | null
        created_at: any | null
        updated_at: any | null
      } | null
      user_course_progress: {
        __typename?: "UserCourseProgress"
        id: string
        course_id: string | null
        user_id: string | null
        max_points: number | null
        n_points: number | null
        progress: Array<any | null> | null
        extra: any | null
        created_at: any | null
        updated_at: any | null
        exercise_progress: {
          __typename?: "ExerciseProgress"
          total: number | null
          exercises: number | null
        } | null
      } | null
      user_course_service_progresses: Array<{
        __typename?: "UserCourseServiceProgress"
        id: string
        course_id: string | null
        service_id: string | null
        user_id: string | null
        progress: Array<any | null> | null
        created_at: any | null
        updated_at: any | null
        service: { __typename?: "Service"; name: string; id: string } | null
      } | null> | null
    }
  } | null
}

export type UserProfileUserCourseSettingsQueryNodeFieldsFragment = {
  __typename?: "UserCourseSetting"
  language: string | null
  country: string | null
  research: boolean | null
  marketing: boolean | null
  course_variant: string | null
  other: any | null
  id: string
  user_id: string | null
  course_id: string | null
  created_at: any | null
  updated_at: any | null
  course: {
    __typename?: "Course"
    id: string
    slug: string
    name: string
    ects: string | null
    created_at: any | null
    updated_at: any | null
  } | null
}

export type UserCourseSummaryCourseFieldsFragment = {
  __typename?: "Course"
  has_certificate: boolean | null
  id: string
  slug: string
  name: string
  ects: string | null
  created_at: any | null
  updated_at: any | null
  exercises: Array<{
    __typename?: "Exercise"
    id: string
    name: string | null
    custom_id: string
    course_id: string | null
    part: number | null
    section: number | null
    max_points: number | null
    deleted: boolean | null
  } | null> | null
  photo: {
    __typename?: "Image"
    id: string
    name: string | null
    original: string
    original_mimetype: string
    compressed: string | null
    compressed_mimetype: string | null
    uncompressed: string
    uncompressed_mimetype: string
    created_at: any | null
    updated_at: any | null
  } | null
}

export type UserCourseSummaryCoreFieldsFragment = {
  __typename?: "UserCourseSummary"
  course: {
    __typename?: "Course"
    has_certificate: boolean | null
    id: string
    slug: string
    name: string
    ects: string | null
    created_at: any | null
    updated_at: any | null
    exercises: Array<{
      __typename?: "Exercise"
      id: string
      name: string | null
      custom_id: string
      course_id: string | null
      part: number | null
      section: number | null
      max_points: number | null
      deleted: boolean | null
    } | null> | null
    photo: {
      __typename?: "Image"
      id: string
      name: string | null
      original: string
      original_mimetype: string
      compressed: string | null
      compressed_mimetype: string | null
      uncompressed: string
      uncompressed_mimetype: string
      created_at: any | null
      updated_at: any | null
    } | null
  } | null
  exercise_completions: Array<{
    __typename?: "ExerciseCompletion"
    id: string
    exercise_id: string | null
    user_id: string | null
    created_at: any | null
    updated_at: any | null
    attempted: boolean | null
    completed: boolean | null
    timestamp: any
    n_points: number | null
    exercise_completion_required_actions: Array<{
      __typename?: "ExerciseCompletionRequiredAction"
      id: string
      exercise_completion_id: string | null
      value: string
    }>
  } | null> | null
  user_course_progress: {
    __typename?: "UserCourseProgress"
    id: string
    course_id: string | null
    user_id: string | null
    max_points: number | null
    n_points: number | null
    progress: Array<any | null> | null
    extra: any | null
    created_at: any | null
    updated_at: any | null
    exercise_progress: {
      __typename?: "ExerciseProgress"
      total: number | null
      exercises: number | null
    } | null
  } | null
  user_course_service_progresses: Array<{
    __typename?: "UserCourseServiceProgress"
    id: string
    course_id: string | null
    service_id: string | null
    user_id: string | null
    progress: Array<any | null> | null
    created_at: any | null
    updated_at: any | null
    service: { __typename?: "Service"; name: string; id: string } | null
  } | null> | null
  completion: {
    __typename?: "Completion"
    id: string
    course_id: string | null
    user_id: string | null
    email: string
    student_number: string | null
    completion_language: string | null
    completion_link: string | null
    completion_date: any | null
    tier: number | null
    grade: string | null
    eligible_for_ects: boolean | null
    project_completion: boolean | null
    registered: boolean | null
    created_at: any | null
    updated_at: any | null
    completions_registered: Array<{
      __typename?: "CompletionRegistered"
      id: string
      completion_id: string | null
      organization_id: string | null
      created_at: any | null
      updated_at: any | null
      organization: {
        __typename?: "Organization"
        id: string
        slug: string
      } | null
    }>
  } | null
}

export type UserOrganizationCoreFieldsFragment = {
  __typename?: "UserOrganization"
  id: string
  user_id: string | null
  organization_id: string | null
  created_at: any | null
  updated_at: any | null
  organization: {
    __typename?: "Organization"
    id: string
    slug: string
    hidden: boolean | null
    created_at: any | null
    updated_at: any | null
    organization_translations: Array<{
      __typename?: "OrganizationTranslation"
      id: string
      organization_id: string | null
      language: string
      name: string
      information: string | null
    }>
  } | null
}

export type CreateRegistrationAttemptDateMutationVariables = Exact<{
  id: Scalars["ID"]
  completion_registration_attempt_date: Scalars["DateTime"]
}>

export type CreateRegistrationAttemptDateMutation = {
  __typename?: "Mutation"
  createRegistrationAttemptDate: {
    __typename?: "Completion"
    id: string
    completion_registration_attempt_date: any | null
  } | null
}

export type RecheckCompletionsMutationVariables = Exact<{
  slug?: InputMaybe<Scalars["String"]>
}>

export type RecheckCompletionsMutation = {
  __typename?: "Mutation"
  recheckCompletions: string | null
}

export type AddManualCompletionMutationVariables = Exact<{
  course_id: Scalars["String"]
  completions?: InputMaybe<Array<ManualCompletionArg> | ManualCompletionArg>
}>

export type AddManualCompletionMutation = {
  __typename?: "Mutation"
  addManualCompletion: Array<{
    __typename?: "Completion"
    id: string
    course_id: string | null
    user_id: string | null
    email: string
    student_number: string | null
    completion_language: string | null
    completion_link: string | null
    completion_date: any | null
    tier: number | null
    grade: string | null
    eligible_for_ects: boolean | null
    project_completion: boolean | null
    registered: boolean | null
    created_at: any | null
    updated_at: any | null
    user: {
      __typename?: "User"
      id: string
      upstream_id: number
      first_name: string | null
      last_name: string | null
      username: string
      email: string
      student_number: string | null
      real_student_number: string | null
      created_at: any | null
      updated_at: any | null
    } | null
  } | null> | null
}

export type AddCourseMutationVariables = Exact<{
  course: CourseCreateArg
}>

export type AddCourseMutation = {
  __typename?: "Mutation"
  addCourse: {
    __typename?: "Course"
    automatic_completions: boolean | null
    automatic_completions_eligible_for_ects: boolean | null
    exercise_completions_needed: number | null
    points_needed: number | null
    instructions: string | null
    has_certificate: boolean | null
    upcoming_active_link: boolean | null
    description: string | null
    link: string | null
    order: number | null
    study_module_order: number | null
    promote: boolean | null
    status: CourseStatus | null
    start_point: boolean | null
    study_module_start_point: boolean | null
    hidden: boolean | null
    tier: number | null
    support_email: string | null
    teacher_in_charge_email: string
    teacher_in_charge_name: string
    start_date: string
    end_date: string | null
    id: string
    slug: string
    name: string
    ects: string | null
    created_at: any | null
    updated_at: any | null
    course_translations: Array<{
      __typename?: "CourseTranslation"
      description: string
      instructions: string | null
      link: string | null
      id: string
      course_id: string | null
      language: string
      name: string
      created_at: any | null
      updated_at: any | null
    }>
    open_university_registration_links: Array<{
      __typename?: "OpenUniversityRegistrationLink"
      id: string
      course_code: string
      language: string
      link: string | null
    }>
    inherit_settings_from: { __typename?: "Course"; id: string } | null
    completions_handled_by: {
      __typename?: "Course"
      id: string
      slug: string
      name: string
      ects: string | null
      created_at: any | null
      updated_at: any | null
    } | null
    course_variants: Array<{
      __typename?: "CourseVariant"
      id: string
      slug: string
      description: string | null
    }>
    course_aliases: Array<{
      __typename?: "CourseAlias"
      id: string
      course_code: string
    }>
    user_course_settings_visibilities: Array<{
      __typename?: "UserCourseSettingsVisibility"
      id: string
      language: string
    }>
    study_modules: Array<{
      __typename?: "StudyModule"
      id: string
      slug: string
      name: string
      created_at: any | null
      updated_at: any | null
    }>
    photo: {
      __typename?: "Image"
      id: string
      name: string | null
      original: string
      original_mimetype: string
      compressed: string | null
      compressed_mimetype: string | null
      uncompressed: string
      uncompressed_mimetype: string
      created_at: any | null
      updated_at: any | null
    } | null
  } | null
}

export type UpdateCourseMutationVariables = Exact<{
  course: CourseUpsertArg
}>

export type UpdateCourseMutation = {
  __typename?: "Mutation"
  updateCourse: {
    __typename?: "Course"
    automatic_completions: boolean | null
    automatic_completions_eligible_for_ects: boolean | null
    exercise_completions_needed: number | null
    points_needed: number | null
    instructions: string | null
    has_certificate: boolean | null
    upcoming_active_link: boolean | null
    description: string | null
    link: string | null
    order: number | null
    study_module_order: number | null
    promote: boolean | null
    status: CourseStatus | null
    start_point: boolean | null
    study_module_start_point: boolean | null
    hidden: boolean | null
    tier: number | null
    support_email: string | null
    teacher_in_charge_email: string
    teacher_in_charge_name: string
    start_date: string
    end_date: string | null
    id: string
    slug: string
    name: string
    ects: string | null
    created_at: any | null
    updated_at: any | null
    completion_email: {
      __typename?: "EmailTemplate"
      id: string
      name: string | null
      title: string | null
      txt_body: string | null
      html_body: string | null
      template_type: string | null
      created_at: any | null
      updated_at: any | null
    } | null
    course_stats_email: {
      __typename?: "EmailTemplate"
      id: string
      name: string | null
      title: string | null
      txt_body: string | null
      html_body: string | null
      template_type: string | null
      created_at: any | null
      updated_at: any | null
    } | null
    course_translations: Array<{
      __typename?: "CourseTranslation"
      description: string
      instructions: string | null
      link: string | null
      id: string
      course_id: string | null
      language: string
      name: string
      created_at: any | null
      updated_at: any | null
    }>
    open_university_registration_links: Array<{
      __typename?: "OpenUniversityRegistrationLink"
      id: string
      course_code: string
      language: string
      link: string | null
    }>
    inherit_settings_from: { __typename?: "Course"; id: string } | null
    completions_handled_by: {
      __typename?: "Course"
      id: string
      slug: string
      name: string
      ects: string | null
      created_at: any | null
      updated_at: any | null
    } | null
    course_variants: Array<{
      __typename?: "CourseVariant"
      id: string
      slug: string
      description: string | null
    }>
    course_aliases: Array<{
      __typename?: "CourseAlias"
      id: string
      course_code: string
    }>
    user_course_settings_visibilities: Array<{
      __typename?: "UserCourseSettingsVisibility"
      id: string
      language: string
    }>
    study_modules: Array<{
      __typename?: "StudyModule"
      id: string
      slug: string
      name: string
      created_at: any | null
      updated_at: any | null
    }>
    photo: {
      __typename?: "Image"
      id: string
      name: string | null
      original: string
      original_mimetype: string
      compressed: string | null
      compressed_mimetype: string | null
      uncompressed: string
      uncompressed_mimetype: string
      created_at: any | null
      updated_at: any | null
    } | null
  } | null
}

export type DeleteCourseMutationVariables = Exact<{
  id: Scalars["ID"]
}>

export type DeleteCourseMutation = {
  __typename?: "Mutation"
  deleteCourse: {
    __typename?: "Course"
    id: string
    slug: string
    name: string
    ects: string | null
    created_at: any | null
    updated_at: any | null
  } | null
}

export type UpdateEmailTemplateMutationVariables = Exact<{
  id: Scalars["ID"]
  name?: InputMaybe<Scalars["String"]>
  html_body?: InputMaybe<Scalars["String"]>
  txt_body?: InputMaybe<Scalars["String"]>
  title?: InputMaybe<Scalars["String"]>
  template_type?: InputMaybe<Scalars["String"]>
  triggered_automatically_by_course_id?: InputMaybe<Scalars["String"]>
  exercise_completions_threshold?: InputMaybe<Scalars["Int"]>
  points_threshold?: InputMaybe<Scalars["Int"]>
}>

export type UpdateEmailTemplateMutation = {
  __typename?: "Mutation"
  updateEmailTemplate: {
    __typename?: "EmailTemplate"
    triggered_automatically_by_course_id: string | null
    exercise_completions_threshold: number | null
    points_threshold: number | null
    id: string
    name: string | null
    title: string | null
    txt_body: string | null
    html_body: string | null
    template_type: string | null
    created_at: any | null
    updated_at: any | null
  } | null
}

export type AddEmailTemplateMutationVariables = Exact<{
  name: Scalars["String"]
  html_body?: InputMaybe<Scalars["String"]>
  txt_body?: InputMaybe<Scalars["String"]>
  title?: InputMaybe<Scalars["String"]>
  template_type?: InputMaybe<Scalars["String"]>
  triggered_automatically_by_course_id?: InputMaybe<Scalars["String"]>
  exercise_completions_threshold?: InputMaybe<Scalars["Int"]>
  points_threshold?: InputMaybe<Scalars["Int"]>
}>

export type AddEmailTemplateMutation = {
  __typename?: "Mutation"
  addEmailTemplate: {
    __typename?: "EmailTemplate"
    triggered_automatically_by_course_id: string | null
    exercise_completions_threshold: number | null
    points_threshold: number | null
    id: string
    name: string | null
    title: string | null
    txt_body: string | null
    html_body: string | null
    template_type: string | null
    created_at: any | null
    updated_at: any | null
  } | null
}

export type DeleteEmailTemplateMutationVariables = Exact<{
  id: Scalars["ID"]
}>

export type DeleteEmailTemplateMutation = {
  __typename?: "Mutation"
  deleteEmailTemplate: {
    __typename?: "EmailTemplate"
    id: string
    name: string | null
    title: string | null
    txt_body: string | null
    html_body: string | null
    template_type: string | null
    created_at: any | null
    updated_at: any | null
  } | null
}

export type AddStudyModuleMutationVariables = Exact<{
  study_module: StudyModuleCreateArg
}>

export type AddStudyModuleMutation = {
  __typename?: "Mutation"
  addStudyModule: {
    __typename?: "StudyModule"
    description: string | null
    image: string | null
    order: number | null
    id: string
    slug: string
    name: string
    created_at: any | null
    updated_at: any | null
    study_module_translations: Array<{
      __typename?: "StudyModuleTranslation"
      id: string
      study_module_id: string | null
      language: string
      name: string
      description: string
      created_at: any | null
      updated_at: any | null
    }>
  } | null
}

export type UpdateStudyModuleMutationVariables = Exact<{
  study_module: StudyModuleUpsertArg
}>

export type UpdateStudyModuleMutation = {
  __typename?: "Mutation"
  updateStudyModule: {
    __typename?: "StudyModule"
    description: string | null
    image: string | null
    order: number | null
    id: string
    slug: string
    name: string
    created_at: any | null
    updated_at: any | null
    study_module_translations: Array<{
      __typename?: "StudyModuleTranslation"
      id: string
      study_module_id: string | null
      language: string
      name: string
      description: string
      created_at: any | null
      updated_at: any | null
    }>
  } | null
}

export type DeleteStudyModuleMutationVariables = Exact<{
  id: Scalars["ID"]
}>

export type DeleteStudyModuleMutation = {
  __typename?: "Mutation"
  deleteStudyModule: {
    __typename?: "StudyModule"
    id: string
    slug: string
    name: string
    created_at: any | null
    updated_at: any | null
  } | null
}

export type UpdateUserNameMutationVariables = Exact<{
  first_name?: InputMaybe<Scalars["String"]>
  last_name?: InputMaybe<Scalars["String"]>
}>

export type UpdateUserNameMutation = {
  __typename?: "Mutation"
  updateUserName: {
    __typename?: "User"
    id: string
    upstream_id: number
    first_name: string | null
    last_name: string | null
    username: string
    email: string
    student_number: string | null
    real_student_number: string | null
    created_at: any | null
    updated_at: any | null
  } | null
}

export type UpdateResearchConsentMutationVariables = Exact<{
  value: Scalars["Boolean"]
}>

export type UpdateResearchConsentMutation = {
  __typename?: "Mutation"
  updateResearchConsent: { __typename?: "User"; id: string } | null
}

export type UserCourseStatsSubscribeMutationVariables = Exact<{
  id: Scalars["ID"]
}>

export type UserCourseStatsSubscribeMutation = {
  __typename?: "Mutation"
  createCourseStatsSubscription: {
    __typename?: "CourseStatsSubscription"
    id: string
  } | null
}

export type UserCourseStatsUnsubscribeMutationVariables = Exact<{
  id: Scalars["ID"]
}>

export type UserCourseStatsUnsubscribeMutation = {
  __typename?: "Mutation"
  deleteCourseStatsSubscription: {
    __typename?: "CourseStatsSubscription"
    id: string
  } | null
}

export type AddUserOrganizationMutationVariables = Exact<{
  user_id: Scalars["ID"]
  organization_id: Scalars["ID"]
}>

export type AddUserOrganizationMutation = {
  __typename?: "Mutation"
  addUserOrganization: { __typename?: "UserOrganization"; id: string } | null
}

export type UpdateUserOrganizationMutationVariables = Exact<{
  id: Scalars["ID"]
  role?: InputMaybe<OrganizationRole>
}>

export type UpdateUserOrganizationMutation = {
  __typename?: "Mutation"
  updateUserOrganization: { __typename?: "UserOrganization"; id: string } | null
}

export type DeleteUserOrganizationMutationVariables = Exact<{
  id: Scalars["ID"]
}>

export type DeleteUserOrganizationMutation = {
  __typename?: "Mutation"
  deleteUserOrganization: { __typename?: "UserOrganization"; id: string } | null
}

export type PaginatedCompletionsQueryVariables = Exact<{
  course: Scalars["String"]
  cursor?: InputMaybe<Scalars["String"]>
  completionLanguage?: InputMaybe<Scalars["String"]>
  search?: InputMaybe<Scalars["String"]>
}>

export type PaginatedCompletionsQuery = {
  __typename?: "Query"
  completionsPaginated: {
    __typename?: "QueryCompletionsPaginated_type_Connection"
    pageInfo: {
      __typename?: "PageInfo"
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor: string | null
      endCursor: string | null
    }
    edges: Array<{
      __typename?: "CompletionEdge"
      node: {
        __typename?: "Completion"
        id: string
        course_id: string | null
        user_id: string | null
        email: string
        student_number: string | null
        completion_language: string | null
        completion_link: string | null
        completion_date: any | null
        tier: number | null
        grade: string | null
        eligible_for_ects: boolean | null
        project_completion: boolean | null
        registered: boolean | null
        created_at: any | null
        updated_at: any | null
        user: {
          __typename?: "User"
          id: string
          upstream_id: number
          first_name: string | null
          last_name: string | null
          username: string
          email: string
          student_number: string | null
          real_student_number: string | null
          created_at: any | null
          updated_at: any | null
        } | null
        course: {
          __typename?: "Course"
          id: string
          name: string
          slug: string
          ects: string | null
          created_at: any | null
          updated_at: any | null
        } | null
        completions_registered: Array<{
          __typename?: "CompletionRegistered"
          id: string
          organization: {
            __typename?: "Organization"
            id: string
            slug: string
          } | null
        }>
      } | null
    } | null> | null
  } | null
}

export type PaginatedCompletionsPreviousPageQueryVariables = Exact<{
  course: Scalars["String"]
  cursor?: InputMaybe<Scalars["String"]>
  completionLanguage?: InputMaybe<Scalars["String"]>
  search?: InputMaybe<Scalars["String"]>
}>

export type PaginatedCompletionsPreviousPageQuery = {
  __typename?: "Query"
  completionsPaginated: {
    __typename?: "QueryCompletionsPaginated_type_Connection"
    pageInfo: {
      __typename?: "PageInfo"
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor: string | null
      endCursor: string | null
    }
    edges: Array<{
      __typename?: "CompletionEdge"
      node: {
        __typename?: "Completion"
        id: string
        course_id: string | null
        user_id: string | null
        email: string
        student_number: string | null
        completion_language: string | null
        completion_link: string | null
        completion_date: any | null
        tier: number | null
        grade: string | null
        eligible_for_ects: boolean | null
        project_completion: boolean | null
        registered: boolean | null
        created_at: any | null
        updated_at: any | null
        user: {
          __typename?: "User"
          id: string
          upstream_id: number
          first_name: string | null
          last_name: string | null
          username: string
          email: string
          student_number: string | null
          real_student_number: string | null
          created_at: any | null
          updated_at: any | null
        } | null
        course: {
          __typename?: "Course"
          id: string
          name: string
          slug: string
          ects: string | null
          created_at: any | null
          updated_at: any | null
        } | null
        completions_registered: Array<{
          __typename?: "CompletionRegistered"
          id: string
          organization: {
            __typename?: "Organization"
            id: string
            slug: string
          } | null
        }>
      } | null
    } | null> | null
  } | null
}

export type CoursesQueryVariables = Exact<{
  language?: InputMaybe<Scalars["String"]>
}>

export type CoursesQuery = {
  __typename?: "Query"
  courses: Array<{
    __typename?: "Course"
    description: string | null
    link: string | null
    order: number | null
    study_module_order: number | null
    promote: boolean | null
    status: CourseStatus | null
    start_point: boolean | null
    study_module_start_point: boolean | null
    hidden: boolean | null
    upcoming_active_link: boolean | null
    tier: number | null
    support_email: string | null
    teacher_in_charge_email: string
    teacher_in_charge_name: string
    start_date: string
    end_date: string | null
    id: string
    slug: string
    name: string
    ects: string | null
    created_at: any | null
    updated_at: any | null
    user_course_settings_visibilities: Array<{
      __typename?: "UserCourseSettingsVisibility"
      id: string
      language: string
    }>
    course_translations: Array<{
      __typename?: "CourseTranslation"
      id: string
      course_id: string | null
      language: string
      name: string
      description: string
      link: string | null
      created_at: any | null
      updated_at: any | null
    }>
    study_modules: Array<{
      __typename?: "StudyModule"
      id: string
      slug: string
      name: string
      created_at: any | null
      updated_at: any | null
    }>
    photo: {
      __typename?: "Image"
      id: string
      name: string | null
      original: string
      original_mimetype: string
      compressed: string | null
      compressed_mimetype: string | null
      uncompressed: string
      uncompressed_mimetype: string
      created_at: any | null
      updated_at: any | null
    } | null
  } | null> | null
}

export type EditorCoursesQueryVariables = Exact<{
  search?: InputMaybe<Scalars["String"]>
  hidden?: InputMaybe<Scalars["Boolean"]>
  handledBy?: InputMaybe<Scalars["String"]>
  status?: InputMaybe<Array<CourseStatus> | CourseStatus>
}>

export type EditorCoursesQuery = {
  __typename?: "Query"
  courses: Array<{
    __typename?: "Course"
    instructions: string | null
    has_certificate: boolean | null
    upcoming_active_link: boolean | null
    description: string | null
    link: string | null
    order: number | null
    study_module_order: number | null
    promote: boolean | null
    status: CourseStatus | null
    start_point: boolean | null
    study_module_start_point: boolean | null
    hidden: boolean | null
    tier: number | null
    support_email: string | null
    teacher_in_charge_email: string
    teacher_in_charge_name: string
    start_date: string
    end_date: string | null
    id: string
    slug: string
    name: string
    ects: string | null
    created_at: any | null
    updated_at: any | null
    completions_handled_by: {
      __typename?: "Course"
      id: string
      slug: string
      name: string
      ects: string | null
      created_at: any | null
      updated_at: any | null
    } | null
    course_variants: Array<{
      __typename?: "CourseVariant"
      id: string
      slug: string
      description: string | null
    }>
    course_aliases: Array<{
      __typename?: "CourseAlias"
      id: string
      course_code: string
    }>
    user_course_settings_visibilities: Array<{
      __typename?: "UserCourseSettingsVisibility"
      id: string
      language: string
    }>
    course_translations: Array<{
      __typename?: "CourseTranslation"
      id: string
      course_id: string | null
      language: string
      name: string
      description: string
      link: string | null
      created_at: any | null
      updated_at: any | null
    }>
    study_modules: Array<{
      __typename?: "StudyModule"
      id: string
      slug: string
      name: string
      created_at: any | null
      updated_at: any | null
    }>
    photo: {
      __typename?: "Image"
      id: string
      name: string | null
      original: string
      original_mimetype: string
      compressed: string | null
      compressed_mimetype: string | null
      uncompressed: string
      uncompressed_mimetype: string
      created_at: any | null
      updated_at: any | null
    } | null
  } | null> | null
  currentUser: {
    __typename?: "User"
    id: string
    administrator: boolean
  } | null
}

export type CourseFromSlugQueryVariables = Exact<{
  slug: Scalars["String"]
}>

export type CourseFromSlugQuery = {
  __typename?: "Query"
  course: {
    __typename?: "Course"
    description: string | null
    instructions: string | null
    id: string
    slug: string
    name: string
    ects: string | null
    created_at: any | null
    updated_at: any | null
  } | null
}

export type CourseEditorOtherCoursesQueryVariables = Exact<{
  [key: string]: never
}>

export type CourseEditorOtherCoursesQuery = {
  __typename?: "Query"
  courses: Array<{
    __typename?: "Course"
    id: string
    slug: string
    name: string
    ects: string | null
    created_at: any | null
    updated_at: any | null
    course_translations: Array<{
      __typename?: "CourseTranslation"
      id: string
      course_id: string | null
      language: string
      name: string
      description: string
      link: string | null
      created_at: any | null
      updated_at: any | null
    }>
    photo: {
      __typename?: "Image"
      id: string
      name: string | null
      original: string
      original_mimetype: string
      compressed: string | null
      compressed_mimetype: string | null
      uncompressed: string
      uncompressed_mimetype: string
      created_at: any | null
      updated_at: any | null
    } | null
  } | null> | null
}

export type HandlerCoursesQueryVariables = Exact<{ [key: string]: never }>

export type HandlerCoursesQuery = {
  __typename?: "Query"
  handlerCourses: Array<{
    __typename?: "Course"
    id: string
    slug: string
    name: string
    ects: string | null
    created_at: any | null
    updated_at: any | null
  } | null> | null
}

export type CourseEditorDetailsQueryVariables = Exact<{
  slug?: InputMaybe<Scalars["String"]>
}>

export type CourseEditorDetailsQuery = {
  __typename?: "Query"
  course: {
    __typename?: "Course"
    automatic_completions: boolean | null
    automatic_completions_eligible_for_ects: boolean | null
    exercise_completions_needed: number | null
    points_needed: number | null
    instructions: string | null
    has_certificate: boolean | null
    upcoming_active_link: boolean | null
    description: string | null
    link: string | null
    order: number | null
    study_module_order: number | null
    promote: boolean | null
    status: CourseStatus | null
    start_point: boolean | null
    study_module_start_point: boolean | null
    hidden: boolean | null
    tier: number | null
    support_email: string | null
    teacher_in_charge_email: string
    teacher_in_charge_name: string
    start_date: string
    end_date: string | null
    id: string
    slug: string
    name: string
    ects: string | null
    created_at: any | null
    updated_at: any | null
    course_translations: Array<{
      __typename?: "CourseTranslation"
      description: string
      instructions: string | null
      link: string | null
      id: string
      course_id: string | null
      language: string
      name: string
      created_at: any | null
      updated_at: any | null
    }>
    open_university_registration_links: Array<{
      __typename?: "OpenUniversityRegistrationLink"
      id: string
      course_code: string
      language: string
      link: string | null
    }>
    inherit_settings_from: { __typename?: "Course"; id: string } | null
    completions_handled_by: {
      __typename?: "Course"
      id: string
      slug: string
      name: string
      ects: string | null
      created_at: any | null
      updated_at: any | null
    } | null
    course_variants: Array<{
      __typename?: "CourseVariant"
      id: string
      slug: string
      description: string | null
    }>
    course_aliases: Array<{
      __typename?: "CourseAlias"
      id: string
      course_code: string
    }>
    user_course_settings_visibilities: Array<{
      __typename?: "UserCourseSettingsVisibility"
      id: string
      language: string
    }>
    study_modules: Array<{
      __typename?: "StudyModule"
      id: string
      slug: string
      name: string
      created_at: any | null
      updated_at: any | null
    }>
    photo: {
      __typename?: "Image"
      id: string
      name: string | null
      original: string
      original_mimetype: string
      compressed: string | null
      compressed_mimetype: string | null
      uncompressed: string
      uncompressed_mimetype: string
      created_at: any | null
      updated_at: any | null
    } | null
  } | null
}

export type EmailTemplateEditorCoursesQueryVariables = Exact<{
  [key: string]: never
}>

export type EmailTemplateEditorCoursesQuery = {
  __typename?: "Query"
  courses: Array<{
    __typename?: "Course"
    teacher_in_charge_name: string
    teacher_in_charge_email: string
    start_date: string
    id: string
    slug: string
    name: string
    ects: string | null
    created_at: any | null
    updated_at: any | null
    completion_email: {
      __typename?: "EmailTemplate"
      id: string
      name: string | null
      title: string | null
      txt_body: string | null
      html_body: string | null
      template_type: string | null
      created_at: any | null
      updated_at: any | null
    } | null
    course_stats_email: {
      __typename?: "EmailTemplate"
      id: string
      name: string | null
      title: string | null
      txt_body: string | null
      html_body: string | null
      template_type: string | null
      created_at: any | null
      updated_at: any | null
    } | null
  } | null> | null
}

export type CourseDashboardQueryVariables = Exact<{
  slug: Scalars["String"]
}>

export type CourseDashboardQuery = {
  __typename?: "Query"
  course: {
    __typename?: "Course"
    teacher_in_charge_name: string
    teacher_in_charge_email: string
    start_date: string
    id: string
    slug: string
    name: string
    ects: string | null
    created_at: any | null
    updated_at: any | null
    completion_email: {
      __typename?: "EmailTemplate"
      id: string
      name: string | null
      title: string | null
      txt_body: string | null
      html_body: string | null
      template_type: string | null
      created_at: any | null
      updated_at: any | null
    } | null
    course_stats_email: {
      __typename?: "EmailTemplate"
      id: string
      name: string | null
      title: string | null
      txt_body: string | null
      html_body: string | null
      template_type: string | null
      created_at: any | null
      updated_at: any | null
    } | null
  } | null
}

export type EmailTemplatesQueryVariables = Exact<{ [key: string]: never }>

export type EmailTemplatesQuery = {
  __typename?: "Query"
  email_templates: Array<{
    __typename?: "EmailTemplate"
    triggered_automatically_by_course_id: string | null
    exercise_completions_threshold: number | null
    points_threshold: number | null
    id: string
    name: string | null
    title: string | null
    txt_body: string | null
    html_body: string | null
    template_type: string | null
    created_at: any | null
    updated_at: any | null
  } | null> | null
}

export type EmailTemplateQueryVariables = Exact<{
  id: Scalars["ID"]
}>

export type EmailTemplateQuery = {
  __typename?: "Query"
  email_template: {
    __typename?: "EmailTemplate"
    triggered_automatically_by_course_id: string | null
    exercise_completions_threshold: number | null
    points_threshold: number | null
    id: string
    name: string | null
    title: string | null
    txt_body: string | null
    html_body: string | null
    template_type: string | null
    created_at: any | null
    updated_at: any | null
  } | null
}

export type OrganizationsQueryVariables = Exact<{ [key: string]: never }>

export type OrganizationsQuery = {
  __typename?: "Query"
  organizations: Array<{
    __typename?: "Organization"
    id: string
    slug: string
    hidden: boolean | null
    organization_translations: Array<{
      __typename?: "OrganizationTranslation"
      language: string
      name: string
      information: string | null
    }>
  } | null> | null
}

export type OrganizationByIdQueryVariables = Exact<{
  id: Scalars["ID"]
}>

export type OrganizationByIdQuery = {
  __typename?: "Query"
  organization: {
    __typename?: "Organization"
    hidden: boolean | null
    organization_translations: Array<{
      __typename?: "OrganizationTranslation"
      name: string
    }>
  } | null
}

export type StudyModulesQueryVariables = Exact<{
  language?: InputMaybe<Scalars["String"]>
}>

export type StudyModulesQuery = {
  __typename?: "Query"
  study_modules: Array<{
    __typename?: "StudyModule"
    description: string | null
    image: string | null
    order: number | null
    id: string
    slug: string
    name: string
    created_at: any | null
    updated_at: any | null
  } | null> | null
}

export type EditorStudyModulesQueryVariables = Exact<{ [key: string]: never }>

export type EditorStudyModulesQuery = {
  __typename?: "Query"
  study_modules: Array<{
    __typename?: "StudyModule"
    description: string | null
    image: string | null
    order: number | null
    id: string
    slug: string
    name: string
    created_at: any | null
    updated_at: any | null
    study_module_translations: Array<{
      __typename?: "StudyModuleTranslation"
      id: string
      study_module_id: string | null
      language: string
      name: string
      description: string
      created_at: any | null
      updated_at: any | null
    }>
  } | null> | null
}

export type EditorStudyModuleDetailsQueryVariables = Exact<{
  slug: Scalars["String"]
}>

export type EditorStudyModuleDetailsQuery = {
  __typename?: "Query"
  study_module: {
    __typename?: "StudyModule"
    description: string | null
    image: string | null
    order: number | null
    id: string
    slug: string
    name: string
    created_at: any | null
    updated_at: any | null
    courses: Array<{
      __typename?: "Course"
      id: string
      slug: string
      name: string
      ects: string | null
      created_at: any | null
      updated_at: any | null
    } | null> | null
    study_module_translations: Array<{
      __typename?: "StudyModuleTranslation"
      id: string
      study_module_id: string | null
      language: string
      name: string
      description: string
      created_at: any | null
      updated_at: any | null
    }>
  } | null
}

export type StudyModuleExistsQueryVariables = Exact<{
  slug: Scalars["String"]
}>

export type StudyModuleExistsQuery = {
  __typename?: "Query"
  study_module_exists: boolean | null
}

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>

export type CurrentUserQuery = {
  __typename?: "Query"
  currentUser: {
    __typename?: "User"
    id: string
    upstream_id: number
    first_name: string | null
    last_name: string | null
    username: string
    email: string
    student_number: string | null
    real_student_number: string | null
    created_at: any | null
    updated_at: any | null
  } | null
}

export type CurrentUserDetailedQueryVariables = Exact<{ [key: string]: never }>

export type CurrentUserDetailedQuery = {
  __typename?: "Query"
  currentUser: {
    __typename?: "User"
    administrator: boolean
    research_consent: boolean | null
    id: string
    upstream_id: number
    first_name: string | null
    last_name: string | null
    username: string
    email: string
    student_number: string | null
    real_student_number: string | null
    created_at: any | null
    updated_at: any | null
  } | null
}

export type CurrentUserStatsSubscriptionsQueryVariables = Exact<{
  [key: string]: never
}>

export type CurrentUserStatsSubscriptionsQuery = {
  __typename?: "Query"
  currentUser: {
    __typename?: "User"
    id: string
    course_stats_subscriptions: Array<{
      __typename?: "CourseStatsSubscription"
      id: string
      email_template: { __typename?: "EmailTemplate"; id: string } | null
    }>
  } | null
}

export type UserSummaryQueryVariables = Exact<{
  upstream_id?: InputMaybe<Scalars["Int"]>
}>

export type UserSummaryQuery = {
  __typename?: "Query"
  user: {
    __typename?: "User"
    id: string
    username: string
    user_course_summary: Array<{
      __typename?: "UserCourseSummary"
      course: {
        __typename?: "Course"
        has_certificate: boolean | null
        id: string
        slug: string
        name: string
        ects: string | null
        created_at: any | null
        updated_at: any | null
        exercises: Array<{
          __typename?: "Exercise"
          id: string
          name: string | null
          custom_id: string
          course_id: string | null
          part: number | null
          section: number | null
          max_points: number | null
          deleted: boolean | null
        } | null> | null
        photo: {
          __typename?: "Image"
          id: string
          name: string | null
          original: string
          original_mimetype: string
          compressed: string | null
          compressed_mimetype: string | null
          uncompressed: string
          uncompressed_mimetype: string
          created_at: any | null
          updated_at: any | null
        } | null
      } | null
      exercise_completions: Array<{
        __typename?: "ExerciseCompletion"
        id: string
        exercise_id: string | null
        user_id: string | null
        created_at: any | null
        updated_at: any | null
        attempted: boolean | null
        completed: boolean | null
        timestamp: any
        n_points: number | null
        exercise_completion_required_actions: Array<{
          __typename?: "ExerciseCompletionRequiredAction"
          id: string
          exercise_completion_id: string | null
          value: string
        }>
      } | null> | null
      user_course_progress: {
        __typename?: "UserCourseProgress"
        id: string
        course_id: string | null
        user_id: string | null
        max_points: number | null
        n_points: number | null
        progress: Array<any | null> | null
        extra: any | null
        created_at: any | null
        updated_at: any | null
        exercise_progress: {
          __typename?: "ExerciseProgress"
          total: number | null
          exercises: number | null
        } | null
      } | null
      user_course_service_progresses: Array<{
        __typename?: "UserCourseServiceProgress"
        id: string
        course_id: string | null
        service_id: string | null
        user_id: string | null
        progress: Array<any | null> | null
        created_at: any | null
        updated_at: any | null
        service: { __typename?: "Service"; name: string; id: string } | null
      } | null> | null
      completion: {
        __typename?: "Completion"
        id: string
        course_id: string | null
        user_id: string | null
        email: string
        student_number: string | null
        completion_language: string | null
        completion_link: string | null
        completion_date: any | null
        tier: number | null
        grade: string | null
        eligible_for_ects: boolean | null
        project_completion: boolean | null
        registered: boolean | null
        created_at: any | null
        updated_at: any | null
        completions_registered: Array<{
          __typename?: "CompletionRegistered"
          id: string
          completion_id: string | null
          organization_id: string | null
          created_at: any | null
          updated_at: any | null
          organization: {
            __typename?: "Organization"
            id: string
            slug: string
          } | null
        }>
      } | null
    } | null> | null
  } | null
}

export type CurrentUserOverviewQueryVariables = Exact<{ [key: string]: never }>

export type CurrentUserOverviewQuery = {
  __typename?: "Query"
  currentUser: {
    __typename?: "User"
    administrator: boolean
    research_consent: boolean | null
    id: string
    upstream_id: number
    first_name: string | null
    last_name: string | null
    username: string
    email: string
    student_number: string | null
    real_student_number: string | null
    created_at: any | null
    updated_at: any | null
    completions: Array<{
      __typename?: "Completion"
      id: string
      course_id: string | null
      user_id: string | null
      email: string
      student_number: string | null
      completion_language: string | null
      completion_link: string | null
      completion_date: any | null
      tier: number | null
      grade: string | null
      eligible_for_ects: boolean | null
      project_completion: boolean | null
      registered: boolean | null
      created_at: any | null
      updated_at: any | null
      course: {
        __typename?: "Course"
        has_certificate: boolean | null
        id: string
        slug: string
        name: string
        ects: string | null
        created_at: any | null
        updated_at: any | null
        photo: {
          __typename?: "Image"
          id: string
          name: string | null
          original: string
          original_mimetype: string
          compressed: string | null
          compressed_mimetype: string | null
          uncompressed: string
          uncompressed_mimetype: string
          created_at: any | null
          updated_at: any | null
        } | null
      } | null
      completions_registered: Array<{
        __typename?: "CompletionRegistered"
        id: string
        completion_id: string | null
        organization_id: string | null
        created_at: any | null
        updated_at: any | null
        organization: {
          __typename?: "Organization"
          id: string
          slug: string
        } | null
      }>
    }> | null
  } | null
}

export type UserOverviewQueryVariables = Exact<{
  upstream_id?: InputMaybe<Scalars["Int"]>
}>

export type UserOverviewQuery = {
  __typename?: "Query"
  user: {
    __typename?: "User"
    administrator: boolean
    research_consent: boolean | null
    id: string
    upstream_id: number
    first_name: string | null
    last_name: string | null
    username: string
    email: string
    student_number: string | null
    real_student_number: string | null
    created_at: any | null
    updated_at: any | null
    completions: Array<{
      __typename?: "Completion"
      id: string
      course_id: string | null
      user_id: string | null
      email: string
      student_number: string | null
      completion_language: string | null
      completion_link: string | null
      completion_date: any | null
      tier: number | null
      grade: string | null
      eligible_for_ects: boolean | null
      project_completion: boolean | null
      registered: boolean | null
      created_at: any | null
      updated_at: any | null
      course: {
        __typename?: "Course"
        has_certificate: boolean | null
        id: string
        slug: string
        name: string
        ects: string | null
        created_at: any | null
        updated_at: any | null
        photo: {
          __typename?: "Image"
          id: string
          name: string | null
          original: string
          original_mimetype: string
          compressed: string | null
          compressed_mimetype: string | null
          uncompressed: string
          uncompressed_mimetype: string
          created_at: any | null
          updated_at: any | null
        } | null
      } | null
      completions_registered: Array<{
        __typename?: "CompletionRegistered"
        id: string
        completion_id: string | null
        organization_id: string | null
        created_at: any | null
        updated_at: any | null
        organization: {
          __typename?: "Organization"
          id: string
          slug: string
        } | null
      }>
    }> | null
  } | null
}

export type CurrentUserProgressesQueryVariables = Exact<{
  [key: string]: never
}>

export type CurrentUserProgressesQuery = {
  __typename?: "Query"
  currentUser: {
    __typename?: "User"
    id: string
    upstream_id: number
    first_name: string | null
    last_name: string | null
    username: string
    email: string
    student_number: string | null
    real_student_number: string | null
    created_at: any | null
    updated_at: any | null
    progresses: Array<{
      __typename?: "Progress"
      course: {
        __typename?: "Course"
        id: string
        slug: string
        name: string
        ects: string | null
        created_at: any | null
        updated_at: any | null
      } | null
      user_course_progress: {
        __typename?: "UserCourseProgress"
        id: string
        course_id: string | null
        user_id: string | null
        max_points: number | null
        n_points: number | null
        progress: Array<any | null> | null
        extra: any | null
        created_at: any | null
        updated_at: any | null
        exercise_progress: {
          __typename?: "ExerciseProgress"
          total: number | null
          exercises: number | null
        } | null
      } | null
      user_course_service_progresses: Array<{
        __typename?: "UserCourseServiceProgress"
        id: string
        course_id: string | null
        service_id: string | null
        user_id: string | null
        progress: Array<any | null> | null
        created_at: any | null
        updated_at: any | null
        service: { __typename?: "Service"; name: string; id: string } | null
      } | null> | null
    }> | null
  } | null
}

export type UserDetailsContainsQueryVariables = Exact<{
  search: Scalars["String"]
  first?: InputMaybe<Scalars["Int"]>
  last?: InputMaybe<Scalars["Int"]>
  before?: InputMaybe<Scalars["String"]>
  after?: InputMaybe<Scalars["String"]>
  skip?: InputMaybe<Scalars["Int"]>
}>

export type UserDetailsContainsQuery = {
  __typename?: "Query"
  userDetailsContains: {
    __typename?: "QueryUserDetailsContains_Connection"
    count: number | null
    pageInfo: {
      __typename?: "PageInfo"
      startCursor: string | null
      endCursor: string | null
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
    edges: Array<{
      __typename?: "UserEdge"
      node: {
        __typename?: "User"
        id: string
        upstream_id: number
        first_name: string | null
        last_name: string | null
        username: string
        email: string
        student_number: string | null
        real_student_number: string | null
        created_at: any | null
        updated_at: any | null
      } | null
    } | null> | null
  } | null
}

export type ConnectedUserQueryVariables = Exact<{ [key: string]: never }>

export type ConnectedUserQuery = {
  __typename?: "Query"
  currentUser: {
    __typename?: "User"
    id: string
    upstream_id: number
    first_name: string | null
    last_name: string | null
    username: string
    email: string
    student_number: string | null
    real_student_number: string | null
    created_at: any | null
    updated_at: any | null
    verified_users: Array<{
      __typename?: "VerifiedUser"
      id: string
      created_at: any | null
      updated_at: any | null
      display_name: string | null
      organization: {
        __typename?: "Organization"
        id: string
        organization_translations: Array<{
          __typename?: "OrganizationTranslation"
          language: string
          name: string
        }>
      } | null
    }>
  } | null
}

export type ConnectionTestQueryVariables = Exact<{ [key: string]: never }>

export type ConnectionTestQuery = {
  __typename?: "Query"
  currentUser: {
    __typename?: "User"
    id: string
    upstream_id: number
    first_name: string | null
    last_name: string | null
    username: string
    email: string
    student_number: string | null
    real_student_number: string | null
    created_at: any | null
    updated_at: any | null
    verified_users: Array<{
      __typename?: "VerifiedUser"
      id: string
      created_at: any | null
      personal_unique_code: string
      display_name: string | null
      organization: {
        __typename?: "Organization"
        slug: string
        organization_translations: Array<{
          __typename?: "OrganizationTranslation"
          language: string
          name: string
        }>
      } | null
    }>
  } | null
}

export type ExportUserCourseProgressesQueryVariables = Exact<{
  course_slug: Scalars["String"]
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
}>

export type ExportUserCourseProgressesQuery = {
  __typename?: "Query"
  userCourseProgresses: Array<{
    __typename?: "UserCourseProgress"
    id: string
    progress: Array<any | null> | null
    user: {
      __typename?: "User"
      id: string
      upstream_id: number
      first_name: string | null
      last_name: string | null
      username: string
      email: string
      student_number: string | null
      real_student_number: string | null
      created_at: any | null
      updated_at: any | null
    } | null
    user_course_settings: {
      __typename?: "UserCourseSetting"
      course_variant: string | null
      country: string | null
      language: string | null
    } | null
  } | null> | null
}

export type StudentProgressesQueryVariables = Exact<{
  course_id: Scalars["ID"]
  skip?: InputMaybe<Scalars["Int"]>
  after?: InputMaybe<Scalars["String"]>
  search?: InputMaybe<Scalars["String"]>
}>

export type StudentProgressesQuery = {
  __typename?: "Query"
  userCourseSettings: {
    __typename?: "QueryUserCourseSettings_Connection"
    totalCount: number | null
    pageInfo: {
      __typename?: "PageInfo"
      hasNextPage: boolean
      endCursor: string | null
    }
    edges: Array<{
      __typename?: "UserCourseSettingEdge"
      node: {
        __typename?: "UserCourseSetting"
        id: string
        user_id: string | null
        course_id: string | null
        created_at: any | null
        updated_at: any | null
        user: {
          __typename?: "User"
          id: string
          upstream_id: number
          first_name: string | null
          last_name: string | null
          username: string
          email: string
          student_number: string | null
          real_student_number: string | null
          created_at: any | null
          updated_at: any | null
          progress: {
            __typename?: "Progress"
            course: {
              __typename?: "Course"
              id: string
              slug: string
              name: string
              ects: string | null
              created_at: any | null
              updated_at: any | null
            } | null
            user_course_progress: {
              __typename?: "UserCourseProgress"
              id: string
              course_id: string | null
              user_id: string | null
              max_points: number | null
              n_points: number | null
              progress: Array<any | null> | null
              extra: any | null
              created_at: any | null
              updated_at: any | null
              exercise_progress: {
                __typename?: "ExerciseProgress"
                total: number | null
                exercises: number | null
              } | null
            } | null
            user_course_service_progresses: Array<{
              __typename?: "UserCourseServiceProgress"
              id: string
              course_id: string | null
              service_id: string | null
              user_id: string | null
              progress: Array<any | null> | null
              created_at: any | null
              updated_at: any | null
              service: {
                __typename?: "Service"
                name: string
                id: string
              } | null
            } | null> | null
          }
        } | null
      } | null
    } | null> | null
  } | null
}

export type UserProfileUserCourseSettingsQueryVariables = Exact<{
  upstream_id?: InputMaybe<Scalars["Int"]>
}>

export type UserProfileUserCourseSettingsQuery = {
  __typename?: "Query"
  userCourseSettings: {
    __typename?: "QueryUserCourseSettings_Connection"
    edges: Array<{
      __typename?: "UserCourseSettingEdge"
      node: {
        __typename?: "UserCourseSetting"
        language: string | null
        country: string | null
        research: boolean | null
        marketing: boolean | null
        course_variant: string | null
        other: any | null
        id: string
        user_id: string | null
        course_id: string | null
        created_at: any | null
        updated_at: any | null
        course: {
          __typename?: "Course"
          id: string
          slug: string
          name: string
          ects: string | null
          created_at: any | null
          updated_at: any | null
        } | null
      } | null
    } | null> | null
    pageInfo: {
      __typename?: "PageInfo"
      endCursor: string | null
      hasNextPage: boolean
    }
  } | null
}

export type CurrentUserOrganizationsQueryVariables = Exact<{
  [key: string]: never
}>

export type CurrentUserOrganizationsQuery = {
  __typename?: "Query"
  currentUser: {
    __typename?: "User"
    user_organizations: Array<{
      __typename?: "UserOrganization"
      id: string
      user_id: string | null
      organization_id: string | null
      created_at: any | null
      updated_at: any | null
      organization: {
        __typename?: "Organization"
        id: string
        slug: string
        hidden: boolean | null
        created_at: any | null
        updated_at: any | null
        organization_translations: Array<{
          __typename?: "OrganizationTranslation"
          id: string
          organization_id: string | null
          language: string
          name: string
          information: string | null
        }>
      } | null
    }>
  } | null
}

export type UserOrganizationsQueryVariables = Exact<{
  user_id?: InputMaybe<Scalars["ID"]>
}>

export type UserOrganizationsQuery = {
  __typename?: "Query"
  userOrganizations: Array<{
    __typename?: "UserOrganization"
    id: string
    organization: { __typename?: "Organization"; id: string } | null
  } | null> | null
}

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[]
  }
}
const result: PossibleTypesResultData = {
  possibleTypes: {},
}
export default result

export const CompletionCoreFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "CompletionCoreFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Completion" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "course_id" } },
          { kind: "Field", name: { kind: "Name", value: "user_id" } },
          { kind: "Field", name: { kind: "Name", value: "email" } },
          { kind: "Field", name: { kind: "Name", value: "student_number" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "completion_language" },
          },
          { kind: "Field", name: { kind: "Name", value: "completion_link" } },
          { kind: "Field", name: { kind: "Name", value: "completion_date" } },
          { kind: "Field", name: { kind: "Name", value: "tier" } },
          { kind: "Field", name: { kind: "Name", value: "grade" } },
          { kind: "Field", name: { kind: "Name", value: "eligible_for_ects" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "project_completion" },
          },
          { kind: "Field", name: { kind: "Name", value: "registered" } },
          { kind: "Field", name: { kind: "Name", value: "created_at" } },
          { kind: "Field", name: { kind: "Name", value: "updated_at" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CompletionCoreFieldsFragment, unknown>
export const CompletionRegisteredCoreFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "CompletionRegisteredCoreFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "CompletionRegistered" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "completion_id" } },
          { kind: "Field", name: { kind: "Name", value: "organization_id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "organization" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "slug" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "created_at" } },
          { kind: "Field", name: { kind: "Name", value: "updated_at" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CompletionRegisteredCoreFieldsFragment, unknown>
export const CompletionDetailedFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "CompletionDetailedFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Completion" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "CompletionCoreFields" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "completions_registered" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: {
                    kind: "Name",
                    value: "CompletionRegisteredCoreFields",
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CompletionDetailedFieldsFragment, unknown>
export const CourseCoreFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "CourseCoreFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Course" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "slug" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "ects" } },
          { kind: "Field", name: { kind: "Name", value: "created_at" } },
          { kind: "Field", name: { kind: "Name", value: "updated_at" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CourseCoreFieldsFragment, unknown>
export const ImageCoreFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ImageCoreFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Image" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "original" } },
          { kind: "Field", name: { kind: "Name", value: "original_mimetype" } },
          { kind: "Field", name: { kind: "Name", value: "compressed" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "compressed_mimetype" },
          },
          { kind: "Field", name: { kind: "Name", value: "uncompressed" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "uncompressed_mimetype" },
          },
          { kind: "Field", name: { kind: "Name", value: "created_at" } },
          { kind: "Field", name: { kind: "Name", value: "updated_at" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ImageCoreFieldsFragment, unknown>
export const CourseWithPhotoCoreFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "CourseWithPhotoCoreFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Course" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "CourseCoreFields" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "photo" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "ImageCoreFields" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CourseWithPhotoCoreFieldsFragment, unknown>
export const CompletionCourseFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "CompletionCourseFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Course" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "CourseWithPhotoCoreFields" },
          },
          { kind: "Field", name: { kind: "Name", value: "has_certificate" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CompletionCourseFieldsFragment, unknown>
export const CompletionDetailedFieldsWithCourseFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "CompletionDetailedFieldsWithCourse" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Completion" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "CompletionDetailedFields" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "course" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CompletionCourseFields" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CompletionDetailedFieldsWithCourseFragment,
  unknown
>
export const UserCoreFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "UserCoreFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "User" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "upstream_id" } },
          { kind: "Field", name: { kind: "Name", value: "first_name" } },
          { kind: "Field", name: { kind: "Name", value: "last_name" } },
          { kind: "Field", name: { kind: "Name", value: "username" } },
          { kind: "Field", name: { kind: "Name", value: "email" } },
          { kind: "Field", name: { kind: "Name", value: "student_number" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "real_student_number" },
          },
          { kind: "Field", name: { kind: "Name", value: "created_at" } },
          { kind: "Field", name: { kind: "Name", value: "updated_at" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserCoreFieldsFragment, unknown>
export const CompletionsQueryNodeFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "CompletionsQueryNodeFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Completion" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "CompletionCoreFields" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "UserCoreFields" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "course" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CourseCoreFields" },
                },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "completions_registered" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "organization" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "slug" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CompletionsQueryNodeFieldsFragment, unknown>
export const CompletionsQueryConnectionFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "CompletionsQueryConnectionFields" },
      typeCondition: {
        kind: "NamedType",
        name: {
          kind: "Name",
          value: "QueryCompletionsPaginated_type_Connection",
        },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "pageInfo" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "hasPreviousPage" },
                },
                { kind: "Field", name: { kind: "Name", value: "startCursor" } },
                { kind: "Field", name: { kind: "Name", value: "endCursor" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "edges" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "node" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: {
                          kind: "Name",
                          value: "CompletionsQueryNodeFields",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CompletionsQueryConnectionFieldsFragment, unknown>
export const CourseTranslationCoreFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "CourseTranslationCoreFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "CourseTranslation" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "course_id" } },
          { kind: "Field", name: { kind: "Name", value: "language" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "description" } },
          { kind: "Field", name: { kind: "Name", value: "link" } },
          { kind: "Field", name: { kind: "Name", value: "created_at" } },
          { kind: "Field", name: { kind: "Name", value: "updated_at" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CourseTranslationCoreFieldsFragment, unknown>
export const StudyModuleCoreFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "StudyModuleCoreFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "StudyModule" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "slug" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "created_at" } },
          { kind: "Field", name: { kind: "Name", value: "updated_at" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<StudyModuleCoreFieldsFragment, unknown>
export const CourseFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "CourseFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Course" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "CourseWithPhotoCoreFields" },
          },
          { kind: "Field", name: { kind: "Name", value: "description" } },
          { kind: "Field", name: { kind: "Name", value: "link" } },
          { kind: "Field", name: { kind: "Name", value: "order" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "study_module_order" },
          },
          { kind: "Field", name: { kind: "Name", value: "promote" } },
          { kind: "Field", name: { kind: "Name", value: "status" } },
          { kind: "Field", name: { kind: "Name", value: "start_point" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "study_module_start_point" },
          },
          { kind: "Field", name: { kind: "Name", value: "hidden" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "upcoming_active_link" },
          },
          { kind: "Field", name: { kind: "Name", value: "tier" } },
          { kind: "Field", name: { kind: "Name", value: "support_email" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "teacher_in_charge_email" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "teacher_in_charge_name" },
          },
          { kind: "Field", name: { kind: "Name", value: "start_date" } },
          { kind: "Field", name: { kind: "Name", value: "end_date" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "course_translations" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CourseTranslationCoreFields" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "study_modules" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "StudyModuleCoreFields" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CourseFieldsFragment, unknown>
export const EditorCourseFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "EditorCourseFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Course" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "CourseFields" },
          },
          { kind: "Field", name: { kind: "Name", value: "instructions" } },
          { kind: "Field", name: { kind: "Name", value: "has_certificate" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "upcoming_active_link" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "completions_handled_by" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CourseCoreFields" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "course_variants" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "slug" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "course_aliases" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "course_code" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "user_course_settings_visibilities" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "language" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EditorCourseFieldsFragment, unknown>
export const OpenUniversityRegistrationLinkCoreFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "OpenUniversityRegistrationLinkCoreFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "OpenUniversityRegistrationLink" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "course_code" } },
          { kind: "Field", name: { kind: "Name", value: "language" } },
          { kind: "Field", name: { kind: "Name", value: "link" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  OpenUniversityRegistrationLinkCoreFieldsFragment,
  unknown
>
export const EditorCourseDetailedFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "EditorCourseDetailedFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Course" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "EditorCourseFields" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "course_translations" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CourseTranslationCoreFields" },
                },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "instructions" },
                },
                { kind: "Field", name: { kind: "Name", value: "link" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "open_university_registration_links" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: {
                    kind: "Name",
                    value: "OpenUniversityRegistrationLinkCoreFields",
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "inherit_settings_from" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "automatic_completions" },
          },
          {
            kind: "Field",
            name: {
              kind: "Name",
              value: "automatic_completions_eligible_for_ects",
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "exercise_completions_needed" },
          },
          { kind: "Field", name: { kind: "Name", value: "points_needed" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EditorCourseDetailedFieldsFragment, unknown>
export const EditorCourseOtherCoursesFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "EditorCourseOtherCoursesFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Course" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "CourseWithPhotoCoreFields" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "course_translations" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CourseTranslationCoreFields" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EditorCourseOtherCoursesFieldsFragment, unknown>
export const EmailTemplateCoreFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "EmailTemplateCoreFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "EmailTemplate" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "txt_body" } },
          { kind: "Field", name: { kind: "Name", value: "html_body" } },
          { kind: "Field", name: { kind: "Name", value: "template_type" } },
          { kind: "Field", name: { kind: "Name", value: "created_at" } },
          { kind: "Field", name: { kind: "Name", value: "updated_at" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EmailTemplateCoreFieldsFragment, unknown>
export const EmailTemplateFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "EmailTemplateFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "EmailTemplate" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "EmailTemplateCoreFields" },
          },
          {
            kind: "Field",
            name: {
              kind: "Name",
              value: "triggered_automatically_by_course_id",
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "exercise_completions_threshold" },
          },
          { kind: "Field", name: { kind: "Name", value: "points_threshold" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EmailTemplateFieldsFragment, unknown>
export const StudyModuleFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "StudyModuleFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "StudyModule" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "StudyModuleCoreFields" },
          },
          { kind: "Field", name: { kind: "Name", value: "description" } },
          { kind: "Field", name: { kind: "Name", value: "image" } },
          { kind: "Field", name: { kind: "Name", value: "order" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<StudyModuleFieldsFragment, unknown>
export const StudyModuleTranslationFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "StudyModuleTranslationFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "StudyModuleTranslation" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "study_module_id" } },
          { kind: "Field", name: { kind: "Name", value: "language" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "description" } },
          { kind: "Field", name: { kind: "Name", value: "created_at" } },
          { kind: "Field", name: { kind: "Name", value: "updated_at" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<StudyModuleTranslationFieldsFragment, unknown>
export const StudyModuleDetailedFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "StudyModuleDetailedFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "StudyModule" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "StudyModuleFields" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "study_module_translations" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "StudyModuleTranslationFields" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<StudyModuleDetailedFieldsFragment, unknown>
export const StudyModuleFieldsWithCoursesFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "StudyModuleFieldsWithCourses" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "StudyModule" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "StudyModuleFields" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "courses" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CourseFields" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<StudyModuleFieldsWithCoursesFragment, unknown>
export const UserCourseProgressCoreFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "UserCourseProgressCoreFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "UserCourseProgress" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "course_id" } },
          { kind: "Field", name: { kind: "Name", value: "user_id" } },
          { kind: "Field", name: { kind: "Name", value: "max_points" } },
          { kind: "Field", name: { kind: "Name", value: "n_points" } },
          { kind: "Field", name: { kind: "Name", value: "progress" } },
          { kind: "Field", name: { kind: "Name", value: "extra" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "exercise_progress" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "total" } },
                { kind: "Field", name: { kind: "Name", value: "exercises" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "created_at" } },
          { kind: "Field", name: { kind: "Name", value: "updated_at" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserCourseProgressCoreFieldsFragment, unknown>
export const UserCourseServiceProgressCoreFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "UserCourseServiceProgressCoreFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "UserCourseServiceProgress" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "course_id" } },
          { kind: "Field", name: { kind: "Name", value: "service_id" } },
          { kind: "Field", name: { kind: "Name", value: "user_id" } },
          { kind: "Field", name: { kind: "Name", value: "progress" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "service" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "created_at" } },
          { kind: "Field", name: { kind: "Name", value: "updated_at" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UserCourseServiceProgressCoreFieldsFragment,
  unknown
>
export const ProgressCoreFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ProgressCoreFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Progress" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "course" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CourseCoreFields" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "user_course_progress" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "UserCourseProgressCoreFields" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "user_course_service_progresses" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: {
                    kind: "Name",
                    value: "UserCourseServiceProgressCoreFields",
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProgressCoreFieldsFragment, unknown>
export const UserProgressesFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "UserProgressesFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "User" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "UserCoreFields" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "progresses" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "ProgressCoreFields" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserProgressesFieldsFragment, unknown>
export const UserDetailedFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "UserDetailedFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "User" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "UserCoreFields" },
          },
          { kind: "Field", name: { kind: "Name", value: "administrator" } },
          { kind: "Field", name: { kind: "Name", value: "research_consent" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserDetailedFieldsFragment, unknown>
export const UserOverviewFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "UserOverviewFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "User" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "UserDetailedFields" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "completions" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CompletionDetailedFields" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "course" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: {
                          kind: "Name",
                          value: "CourseWithPhotoCoreFields",
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "has_certificate" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserOverviewFieldsFragment, unknown>
export const UserCourseSettingCoreFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "UserCourseSettingCoreFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "UserCourseSetting" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "user_id" } },
          { kind: "Field", name: { kind: "Name", value: "course_id" } },
          { kind: "Field", name: { kind: "Name", value: "created_at" } },
          { kind: "Field", name: { kind: "Name", value: "updated_at" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserCourseSettingCoreFieldsFragment, unknown>
export const StudentProgressesQueryNodeFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "StudentProgressesQueryNodeFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "UserCourseSetting" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "UserCourseSettingCoreFields" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "UserCoreFields" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "progress" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "course_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "course_id" },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "ProgressCoreFields" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<StudentProgressesQueryNodeFieldsFragment, unknown>
export const UserCourseSettingDetailedFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "UserCourseSettingDetailedFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "UserCourseSetting" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "UserCourseSettingCoreFields" },
          },
          { kind: "Field", name: { kind: "Name", value: "language" } },
          { kind: "Field", name: { kind: "Name", value: "country" } },
          { kind: "Field", name: { kind: "Name", value: "research" } },
          { kind: "Field", name: { kind: "Name", value: "marketing" } },
          { kind: "Field", name: { kind: "Name", value: "course_variant" } },
          { kind: "Field", name: { kind: "Name", value: "other" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserCourseSettingDetailedFieldsFragment, unknown>
export const UserProfileUserCourseSettingsQueryNodeFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: {
        kind: "Name",
        value: "UserProfileUserCourseSettingsQueryNodeFields",
      },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "UserCourseSetting" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "UserCourseSettingDetailedFields" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "course" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CourseCoreFields" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UserProfileUserCourseSettingsQueryNodeFieldsFragment,
  unknown
>
export const ExerciseCoreFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ExerciseCoreFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Exercise" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "custom_id" } },
          { kind: "Field", name: { kind: "Name", value: "course_id" } },
          { kind: "Field", name: { kind: "Name", value: "part" } },
          { kind: "Field", name: { kind: "Name", value: "section" } },
          { kind: "Field", name: { kind: "Name", value: "max_points" } },
          { kind: "Field", name: { kind: "Name", value: "deleted" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ExerciseCoreFieldsFragment, unknown>
export const UserCourseSummaryCourseFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "UserCourseSummaryCourseFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Course" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "CourseWithPhotoCoreFields" },
          },
          { kind: "Field", name: { kind: "Name", value: "has_certificate" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "exercises" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "ExerciseCoreFields" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserCourseSummaryCourseFieldsFragment, unknown>
export const ExerciseCompletionCoreFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ExerciseCompletionCoreFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ExerciseCompletion" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "exercise_id" } },
          { kind: "Field", name: { kind: "Name", value: "user_id" } },
          { kind: "Field", name: { kind: "Name", value: "created_at" } },
          { kind: "Field", name: { kind: "Name", value: "updated_at" } },
          { kind: "Field", name: { kind: "Name", value: "attempted" } },
          { kind: "Field", name: { kind: "Name", value: "completed" } },
          { kind: "Field", name: { kind: "Name", value: "timestamp" } },
          { kind: "Field", name: { kind: "Name", value: "n_points" } },
          {
            kind: "Field",
            name: {
              kind: "Name",
              value: "exercise_completion_required_actions",
            },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "exercise_completion_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "value" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ExerciseCompletionCoreFieldsFragment, unknown>
export const UserCourseSummaryCoreFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "UserCourseSummaryCoreFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "UserCourseSummary" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "course" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: {
                    kind: "Name",
                    value: "UserCourseSummaryCourseFields",
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "exercise_completions" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "ExerciseCompletionCoreFields" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "user_course_progress" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "UserCourseProgressCoreFields" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "user_course_service_progresses" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: {
                    kind: "Name",
                    value: "UserCourseServiceProgressCoreFields",
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "completion" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CompletionDetailedFields" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserCourseSummaryCoreFieldsFragment, unknown>
export const OrganizationCoreFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "OrganizationCoreFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Organization" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "slug" } },
          { kind: "Field", name: { kind: "Name", value: "hidden" } },
          { kind: "Field", name: { kind: "Name", value: "created_at" } },
          { kind: "Field", name: { kind: "Name", value: "updated_at" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "organization_translations" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "organization_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "language" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "information" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<OrganizationCoreFieldsFragment, unknown>
export const UserOrganizationCoreFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "UserOrganizationCoreFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "UserOrganization" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "user_id" } },
          { kind: "Field", name: { kind: "Name", value: "organization_id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "organization" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "OrganizationCoreFields" },
                },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "created_at" } },
          { kind: "Field", name: { kind: "Name", value: "updated_at" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserOrganizationCoreFieldsFragment, unknown>
export const CreateRegistrationAttemptDateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateRegistrationAttemptDate" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "completion_registration_attempt_date",
            },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "DateTime" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createRegistrationAttemptDate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: {
                  kind: "Name",
                  value: "completion_registration_attempt_date",
                },
                value: {
                  kind: "Variable",
                  name: {
                    kind: "Name",
                    value: "completion_registration_attempt_date",
                  },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: {
                    kind: "Name",
                    value: "completion_registration_attempt_date",
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateRegistrationAttemptDateMutation,
  CreateRegistrationAttemptDateMutationVariables
>
export const RecheckCompletionsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "RecheckCompletions" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "slug" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "recheckCompletions" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "slug" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "slug" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RecheckCompletionsMutation,
  RecheckCompletionsMutationVariables
>
export const AddManualCompletionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddManualCompletion" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "course_id" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "completions" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "ManualCompletionArg" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addManualCompletion" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "course_id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "course_id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "completions" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "completions" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CompletionCoreFields" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "UserCoreFields" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...CompletionCoreFieldsFragmentDoc.definitions,
    ...UserCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  AddManualCompletionMutation,
  AddManualCompletionMutationVariables
>
export const AddCourseDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddCourse" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "course" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CourseCreateArg" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addCourse" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "course" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "course" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "EditorCourseDetailedFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...EditorCourseDetailedFieldsFragmentDoc.definitions,
    ...EditorCourseFieldsFragmentDoc.definitions,
    ...CourseFieldsFragmentDoc.definitions,
    ...CourseWithPhotoCoreFieldsFragmentDoc.definitions,
    ...CourseCoreFieldsFragmentDoc.definitions,
    ...ImageCoreFieldsFragmentDoc.definitions,
    ...CourseTranslationCoreFieldsFragmentDoc.definitions,
    ...StudyModuleCoreFieldsFragmentDoc.definitions,
    ...OpenUniversityRegistrationLinkCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<AddCourseMutation, AddCourseMutationVariables>
export const UpdateCourseDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateCourse" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "course" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CourseUpsertArg" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateCourse" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "course" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "course" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "EditorCourseDetailedFields" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "completion_email" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: {
                          kind: "Name",
                          value: "EmailTemplateCoreFields",
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "course_stats_email" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: {
                          kind: "Name",
                          value: "EmailTemplateCoreFields",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...EditorCourseDetailedFieldsFragmentDoc.definitions,
    ...EditorCourseFieldsFragmentDoc.definitions,
    ...CourseFieldsFragmentDoc.definitions,
    ...CourseWithPhotoCoreFieldsFragmentDoc.definitions,
    ...CourseCoreFieldsFragmentDoc.definitions,
    ...ImageCoreFieldsFragmentDoc.definitions,
    ...CourseTranslationCoreFieldsFragmentDoc.definitions,
    ...StudyModuleCoreFieldsFragmentDoc.definitions,
    ...OpenUniversityRegistrationLinkCoreFieldsFragmentDoc.definitions,
    ...EmailTemplateCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  UpdateCourseMutation,
  UpdateCourseMutationVariables
>
export const DeleteCourseDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteCourse" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteCourse" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CourseCoreFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...CourseCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  DeleteCourseMutation,
  DeleteCourseMutationVariables
>
export const UpdateEmailTemplateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateEmailTemplate" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "html_body" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "txt_body" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "title" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "template_type" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "triggered_automatically_by_course_id",
            },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "exercise_completions_threshold" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "points_threshold" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateEmailTemplate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "name" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "html_body" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "html_body" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "txt_body" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "txt_body" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "title" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "title" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "template_type" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "template_type" },
                },
              },
              {
                kind: "Argument",
                name: {
                  kind: "Name",
                  value: "triggered_automatically_by_course_id",
                },
                value: {
                  kind: "Variable",
                  name: {
                    kind: "Name",
                    value: "triggered_automatically_by_course_id",
                  },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "exercise_completions_threshold" },
                value: {
                  kind: "Variable",
                  name: {
                    kind: "Name",
                    value: "exercise_completions_threshold",
                  },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "points_threshold" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "points_threshold" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "EmailTemplateFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...EmailTemplateFieldsFragmentDoc.definitions,
    ...EmailTemplateCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  UpdateEmailTemplateMutation,
  UpdateEmailTemplateMutationVariables
>
export const AddEmailTemplateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddEmailTemplate" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "html_body" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "txt_body" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "title" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "template_type" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "triggered_automatically_by_course_id",
            },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "exercise_completions_threshold" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "points_threshold" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addEmailTemplate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "name" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "html_body" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "html_body" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "txt_body" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "txt_body" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "title" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "title" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "template_type" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "template_type" },
                },
              },
              {
                kind: "Argument",
                name: {
                  kind: "Name",
                  value: "triggered_automatically_by_course_id",
                },
                value: {
                  kind: "Variable",
                  name: {
                    kind: "Name",
                    value: "triggered_automatically_by_course_id",
                  },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "exercise_completions_threshold" },
                value: {
                  kind: "Variable",
                  name: {
                    kind: "Name",
                    value: "exercise_completions_threshold",
                  },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "points_threshold" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "points_threshold" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "EmailTemplateFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...EmailTemplateFieldsFragmentDoc.definitions,
    ...EmailTemplateCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  AddEmailTemplateMutation,
  AddEmailTemplateMutationVariables
>
export const DeleteEmailTemplateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteEmailTemplate" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteEmailTemplate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "EmailTemplateCoreFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...EmailTemplateCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  DeleteEmailTemplateMutation,
  DeleteEmailTemplateMutationVariables
>
export const AddStudyModuleDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddStudyModule" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "study_module" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "StudyModuleCreateArg" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addStudyModule" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "study_module" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "study_module" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "StudyModuleDetailedFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...StudyModuleDetailedFieldsFragmentDoc.definitions,
    ...StudyModuleFieldsFragmentDoc.definitions,
    ...StudyModuleCoreFieldsFragmentDoc.definitions,
    ...StudyModuleTranslationFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  AddStudyModuleMutation,
  AddStudyModuleMutationVariables
>
export const UpdateStudyModuleDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateStudyModule" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "study_module" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "StudyModuleUpsertArg" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateStudyModule" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "study_module" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "study_module" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "StudyModuleDetailedFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...StudyModuleDetailedFieldsFragmentDoc.definitions,
    ...StudyModuleFieldsFragmentDoc.definitions,
    ...StudyModuleCoreFieldsFragmentDoc.definitions,
    ...StudyModuleTranslationFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  UpdateStudyModuleMutation,
  UpdateStudyModuleMutationVariables
>
export const DeleteStudyModuleDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteStudyModule" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteStudyModule" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "StudyModuleCoreFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...StudyModuleCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  DeleteStudyModuleMutation,
  DeleteStudyModuleMutationVariables
>
export const UpdateUserNameDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateUserName" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "first_name" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "last_name" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateUserName" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "first_name" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "first_name" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "last_name" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "last_name" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "UserCoreFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...UserCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  UpdateUserNameMutation,
  UpdateUserNameMutationVariables
>
export const UpdateResearchConsentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateResearchConsent" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "value" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "Boolean" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateResearchConsent" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "value" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "value" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateResearchConsentMutation,
  UpdateResearchConsentMutationVariables
>
export const UserCourseStatsSubscribeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UserCourseStatsSubscribe" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createCourseStatsSubscription" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UserCourseStatsSubscribeMutation,
  UserCourseStatsSubscribeMutationVariables
>
export const UserCourseStatsUnsubscribeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UserCourseStatsUnsubscribe" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteCourseStatsSubscription" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UserCourseStatsUnsubscribeMutation,
  UserCourseStatsUnsubscribeMutationVariables
>
export const AddUserOrganizationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddUserOrganization" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "user_id" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "organization_id" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addUserOrganization" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "user_id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "user_id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "organization_id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "organization_id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AddUserOrganizationMutation,
  AddUserOrganizationMutationVariables
>
export const UpdateUserOrganizationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateUserOrganization" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "role" } },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "OrganizationRole" },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateUserOrganization" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "role" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "role" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateUserOrganizationMutation,
  UpdateUserOrganizationMutationVariables
>
export const DeleteUserOrganizationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteUserOrganization" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteUserOrganization" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteUserOrganizationMutation,
  DeleteUserOrganizationMutationVariables
>
export const PaginatedCompletionsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "PaginatedCompletions" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "course" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "cursor" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "completionLanguage" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "search" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "completionsPaginated" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "course" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "course" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "completion_language" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "completionLanguage" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "search" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "IntValue", value: "50" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "after" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "cursor" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: {
                    kind: "Name",
                    value: "CompletionsQueryConnectionFields",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...CompletionsQueryConnectionFieldsFragmentDoc.definitions,
    ...CompletionsQueryNodeFieldsFragmentDoc.definitions,
    ...CompletionCoreFieldsFragmentDoc.definitions,
    ...UserCoreFieldsFragmentDoc.definitions,
    ...CourseCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  PaginatedCompletionsQuery,
  PaginatedCompletionsQueryVariables
>
export const PaginatedCompletionsPreviousPageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "PaginatedCompletionsPreviousPage" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "course" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "cursor" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "completionLanguage" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "search" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "completionsPaginated" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "course" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "course" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "completion_language" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "completionLanguage" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "search" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "last" },
                value: { kind: "IntValue", value: "50" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "before" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "cursor" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: {
                    kind: "Name",
                    value: "CompletionsQueryConnectionFields",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...CompletionsQueryConnectionFieldsFragmentDoc.definitions,
    ...CompletionsQueryNodeFieldsFragmentDoc.definitions,
    ...CompletionCoreFieldsFragmentDoc.definitions,
    ...UserCoreFieldsFragmentDoc.definitions,
    ...CourseCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  PaginatedCompletionsPreviousPageQuery,
  PaginatedCompletionsPreviousPageQueryVariables
>
export const CoursesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Courses" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "language" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "courses" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderBy" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "order" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "language" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "language" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CourseFields" },
                },
                {
                  kind: "Field",
                  name: {
                    kind: "Name",
                    value: "user_course_settings_visibilities",
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "language" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...CourseFieldsFragmentDoc.definitions,
    ...CourseWithPhotoCoreFieldsFragmentDoc.definitions,
    ...CourseCoreFieldsFragmentDoc.definitions,
    ...ImageCoreFieldsFragmentDoc.definitions,
    ...CourseTranslationCoreFieldsFragmentDoc.definitions,
    ...StudyModuleCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<CoursesQuery, CoursesQueryVariables>
export const EditorCoursesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "EditorCourses" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "search" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "hidden" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "handledBy" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "status" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "CourseStatus" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "courses" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderBy" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "name" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "search" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "hidden" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "hidden" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "handledBy" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "handledBy" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "status" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "status" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "EditorCourseFields" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "currentUser" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "administrator" },
                },
              ],
            },
          },
        ],
      },
    },
    ...EditorCourseFieldsFragmentDoc.definitions,
    ...CourseFieldsFragmentDoc.definitions,
    ...CourseWithPhotoCoreFieldsFragmentDoc.definitions,
    ...CourseCoreFieldsFragmentDoc.definitions,
    ...ImageCoreFieldsFragmentDoc.definitions,
    ...CourseTranslationCoreFieldsFragmentDoc.definitions,
    ...StudyModuleCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<EditorCoursesQuery, EditorCoursesQueryVariables>
export const CourseFromSlugDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CourseFromSlug" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "slug" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "course" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "slug" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "slug" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CourseCoreFields" },
                },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "instructions" },
                },
              ],
            },
          },
        ],
      },
    },
    ...CourseCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<CourseFromSlugQuery, CourseFromSlugQueryVariables>
export const CourseEditorOtherCoursesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CourseEditorOtherCourses" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "courses" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: {
                    kind: "Name",
                    value: "EditorCourseOtherCoursesFields",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...EditorCourseOtherCoursesFieldsFragmentDoc.definitions,
    ...CourseWithPhotoCoreFieldsFragmentDoc.definitions,
    ...CourseCoreFieldsFragmentDoc.definitions,
    ...ImageCoreFieldsFragmentDoc.definitions,
    ...CourseTranslationCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  CourseEditorOtherCoursesQuery,
  CourseEditorOtherCoursesQueryVariables
>
export const HandlerCoursesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "HandlerCourses" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "handlerCourses" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CourseCoreFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...CourseCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<HandlerCoursesQuery, HandlerCoursesQueryVariables>
export const CourseEditorDetailsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CourseEditorDetails" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "slug" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "course" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "slug" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "slug" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "EditorCourseDetailedFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...EditorCourseDetailedFieldsFragmentDoc.definitions,
    ...EditorCourseFieldsFragmentDoc.definitions,
    ...CourseFieldsFragmentDoc.definitions,
    ...CourseWithPhotoCoreFieldsFragmentDoc.definitions,
    ...CourseCoreFieldsFragmentDoc.definitions,
    ...ImageCoreFieldsFragmentDoc.definitions,
    ...CourseTranslationCoreFieldsFragmentDoc.definitions,
    ...StudyModuleCoreFieldsFragmentDoc.definitions,
    ...OpenUniversityRegistrationLinkCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  CourseEditorDetailsQuery,
  CourseEditorDetailsQueryVariables
>
export const EmailTemplateEditorCoursesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "EmailTemplateEditorCourses" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "courses" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CourseCoreFields" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "teacher_in_charge_name" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "teacher_in_charge_email" },
                },
                { kind: "Field", name: { kind: "Name", value: "start_date" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "completion_email" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: {
                          kind: "Name",
                          value: "EmailTemplateCoreFields",
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "course_stats_email" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: {
                          kind: "Name",
                          value: "EmailTemplateCoreFields",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...CourseCoreFieldsFragmentDoc.definitions,
    ...EmailTemplateCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  EmailTemplateEditorCoursesQuery,
  EmailTemplateEditorCoursesQueryVariables
>
export const CourseDashboardDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CourseDashboard" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "slug" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "course" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "slug" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "slug" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CourseCoreFields" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "teacher_in_charge_name" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "teacher_in_charge_email" },
                },
                { kind: "Field", name: { kind: "Name", value: "start_date" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "completion_email" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: {
                          kind: "Name",
                          value: "EmailTemplateCoreFields",
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "course_stats_email" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: {
                          kind: "Name",
                          value: "EmailTemplateCoreFields",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...CourseCoreFieldsFragmentDoc.definitions,
    ...EmailTemplateCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  CourseDashboardQuery,
  CourseDashboardQueryVariables
>
export const EmailTemplatesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "EmailTemplates" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "email_templates" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "EmailTemplateFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...EmailTemplateFieldsFragmentDoc.definitions,
    ...EmailTemplateCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<EmailTemplatesQuery, EmailTemplatesQueryVariables>
export const EmailTemplateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "EmailTemplate" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "email_template" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "EmailTemplateFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...EmailTemplateFieldsFragmentDoc.definitions,
    ...EmailTemplateCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<EmailTemplateQuery, EmailTemplateQueryVariables>
export const OrganizationsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Organizations" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "organizations" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "slug" } },
                { kind: "Field", name: { kind: "Name", value: "hidden" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "organization_translations" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "language" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "information" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<OrganizationsQuery, OrganizationsQueryVariables>
export const OrganizationByIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "OrganizationById" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "organization" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "hidden" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "organization_translations" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  OrganizationByIdQuery,
  OrganizationByIdQueryVariables
>
export const StudyModulesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "StudyModules" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "language" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "study_modules" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderBy" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "id" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "language" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "language" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "StudyModuleFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...StudyModuleFieldsFragmentDoc.definitions,
    ...StudyModuleCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<StudyModulesQuery, StudyModulesQueryVariables>
export const EditorStudyModulesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "EditorStudyModules" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "study_modules" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderBy" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "id" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "StudyModuleDetailedFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...StudyModuleDetailedFieldsFragmentDoc.definitions,
    ...StudyModuleFieldsFragmentDoc.definitions,
    ...StudyModuleCoreFieldsFragmentDoc.definitions,
    ...StudyModuleTranslationFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  EditorStudyModulesQuery,
  EditorStudyModulesQueryVariables
>
export const EditorStudyModuleDetailsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "EditorStudyModuleDetails" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "slug" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "study_module" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "slug" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "slug" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "StudyModuleFields" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "courses" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "CourseCoreFields" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "study_module_translations" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: {
                          kind: "Name",
                          value: "StudyModuleTranslationFields",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...StudyModuleFieldsFragmentDoc.definitions,
    ...StudyModuleCoreFieldsFragmentDoc.definitions,
    ...CourseCoreFieldsFragmentDoc.definitions,
    ...StudyModuleTranslationFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  EditorStudyModuleDetailsQuery,
  EditorStudyModuleDetailsQueryVariables
>
export const StudyModuleExistsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "StudyModuleExists" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "slug" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "study_module_exists" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "slug" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "slug" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  StudyModuleExistsQuery,
  StudyModuleExistsQueryVariables
>
export const CurrentUserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CurrentUser" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "currentUser" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "UserCoreFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...UserCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>
export const CurrentUserDetailedDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CurrentUserDetailed" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "currentUser" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "UserDetailedFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...UserDetailedFieldsFragmentDoc.definitions,
    ...UserCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  CurrentUserDetailedQuery,
  CurrentUserDetailedQueryVariables
>
export const CurrentUserStatsSubscriptionsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CurrentUserStatsSubscriptions" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "currentUser" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "course_stats_subscriptions" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "email_template" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CurrentUserStatsSubscriptionsQuery,
  CurrentUserStatsSubscriptionsQueryVariables
>
export const UserSummaryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "UserSummary" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "upstream_id" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "upstream_id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "upstream_id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "username" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user_course_summary" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: {
                          kind: "Name",
                          value: "UserCourseSummaryCoreFields",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...UserCourseSummaryCoreFieldsFragmentDoc.definitions,
    ...UserCourseSummaryCourseFieldsFragmentDoc.definitions,
    ...CourseWithPhotoCoreFieldsFragmentDoc.definitions,
    ...CourseCoreFieldsFragmentDoc.definitions,
    ...ImageCoreFieldsFragmentDoc.definitions,
    ...ExerciseCoreFieldsFragmentDoc.definitions,
    ...ExerciseCompletionCoreFieldsFragmentDoc.definitions,
    ...UserCourseProgressCoreFieldsFragmentDoc.definitions,
    ...UserCourseServiceProgressCoreFieldsFragmentDoc.definitions,
    ...CompletionDetailedFieldsFragmentDoc.definitions,
    ...CompletionCoreFieldsFragmentDoc.definitions,
    ...CompletionRegisteredCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<UserSummaryQuery, UserSummaryQueryVariables>
export const CurrentUserOverviewDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CurrentUserOverview" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "currentUser" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "UserOverviewFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...UserOverviewFieldsFragmentDoc.definitions,
    ...UserDetailedFieldsFragmentDoc.definitions,
    ...UserCoreFieldsFragmentDoc.definitions,
    ...CompletionDetailedFieldsFragmentDoc.definitions,
    ...CompletionCoreFieldsFragmentDoc.definitions,
    ...CompletionRegisteredCoreFieldsFragmentDoc.definitions,
    ...CourseWithPhotoCoreFieldsFragmentDoc.definitions,
    ...CourseCoreFieldsFragmentDoc.definitions,
    ...ImageCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  CurrentUserOverviewQuery,
  CurrentUserOverviewQueryVariables
>
export const UserOverviewDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "UserOverview" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "upstream_id" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "upstream_id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "upstream_id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "UserOverviewFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...UserOverviewFieldsFragmentDoc.definitions,
    ...UserDetailedFieldsFragmentDoc.definitions,
    ...UserCoreFieldsFragmentDoc.definitions,
    ...CompletionDetailedFieldsFragmentDoc.definitions,
    ...CompletionCoreFieldsFragmentDoc.definitions,
    ...CompletionRegisteredCoreFieldsFragmentDoc.definitions,
    ...CourseWithPhotoCoreFieldsFragmentDoc.definitions,
    ...CourseCoreFieldsFragmentDoc.definitions,
    ...ImageCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<UserOverviewQuery, UserOverviewQueryVariables>
export const CurrentUserProgressesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CurrentUserProgresses" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "currentUser" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "UserProgressesFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...UserProgressesFieldsFragmentDoc.definitions,
    ...UserCoreFieldsFragmentDoc.definitions,
    ...ProgressCoreFieldsFragmentDoc.definitions,
    ...CourseCoreFieldsFragmentDoc.definitions,
    ...UserCourseProgressCoreFieldsFragmentDoc.definitions,
    ...UserCourseServiceProgressCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  CurrentUserProgressesQuery,
  CurrentUserProgressesQueryVariables
>
export const UserDetailsContainsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "UserDetailsContains" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "search" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "first" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "before" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "after" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "skip" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "userDetailsContains" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "search" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "first" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "last" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "last" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "before" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "before" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "after" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "after" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "skip" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "skip" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "startCursor" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "endCursor" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasNextPage" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasPreviousPage" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "edges" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "FragmentSpread",
                              name: { kind: "Name", value: "UserCoreFields" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "count" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "search" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "search" },
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
    ...UserCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  UserDetailsContainsQuery,
  UserDetailsContainsQueryVariables
>
export const ConnectedUserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ConnectedUser" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "currentUser" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "UserCoreFields" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "verified_users" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "created_at" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "updated_at" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "display_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "organization" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: {
                                kind: "Name",
                                value: "organization_translations",
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "language" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...UserCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<ConnectedUserQuery, ConnectedUserQueryVariables>
export const ConnectionTestDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ConnectionTest" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "currentUser" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "UserCoreFields" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "verified_users" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "organization" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "slug" },
                            },
                            {
                              kind: "Field",
                              name: {
                                kind: "Name",
                                value: "organization_translations",
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "language" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "created_at" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "personal_unique_code" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "display_name" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...UserCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<ConnectionTestQuery, ConnectionTestQueryVariables>
export const ExportUserCourseProgressesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ExportUserCourseProgresses" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "course_slug" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "skip" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "take" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "userCourseProgresses" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "course_slug" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "course_slug" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "skip" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "skip" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "take" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "take" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "UserCoreFields" },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "progress" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user_course_settings" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "course_variant" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "country" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "language" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...UserCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  ExportUserCourseProgressesQuery,
  ExportUserCourseProgressesQueryVariables
>
export const StudentProgressesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "StudentProgresses" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "course_id" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "skip" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "after" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "search" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "userCourseSettings" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "course_id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "course_id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "IntValue", value: "15" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "after" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "after" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "skip" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "skip" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "search" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasNextPage" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "endCursor" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "edges" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "FragmentSpread",
                              name: {
                                kind: "Name",
                                value: "StudentProgressesQueryNodeFields",
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
              ],
            },
          },
        ],
      },
    },
    ...StudentProgressesQueryNodeFieldsFragmentDoc.definitions,
    ...UserCourseSettingCoreFieldsFragmentDoc.definitions,
    ...UserCoreFieldsFragmentDoc.definitions,
    ...ProgressCoreFieldsFragmentDoc.definitions,
    ...CourseCoreFieldsFragmentDoc.definitions,
    ...UserCourseProgressCoreFieldsFragmentDoc.definitions,
    ...UserCourseServiceProgressCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  StudentProgressesQuery,
  StudentProgressesQueryVariables
>
export const UserProfileUserCourseSettingsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "UserProfileUserCourseSettings" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "upstream_id" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "userCourseSettings" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "user_upstream_id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "upstream_id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "IntValue", value: "50" },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "edges" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "FragmentSpread",
                              name: {
                                kind: "Name",
                                value:
                                  "UserProfileUserCourseSettingsQueryNodeFields",
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "endCursor" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasNextPage" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...UserProfileUserCourseSettingsQueryNodeFieldsFragmentDoc.definitions,
    ...UserCourseSettingDetailedFieldsFragmentDoc.definitions,
    ...UserCourseSettingCoreFieldsFragmentDoc.definitions,
    ...CourseCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  UserProfileUserCourseSettingsQuery,
  UserProfileUserCourseSettingsQueryVariables
>
export const CurrentUserOrganizationsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CurrentUserOrganizations" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "currentUser" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user_organizations" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: {
                          kind: "Name",
                          value: "UserOrganizationCoreFields",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...UserOrganizationCoreFieldsFragmentDoc.definitions,
    ...OrganizationCoreFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  CurrentUserOrganizationsQuery,
  CurrentUserOrganizationsQueryVariables
>
export const UserOrganizationsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "UserOrganizations" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "user_id" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "userOrganizations" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "user_id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "user_id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "organization" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UserOrganizationsQuery,
  UserOrganizationsQueryVariables
>
