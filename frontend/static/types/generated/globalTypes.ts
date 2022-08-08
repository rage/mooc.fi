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
  courses: Array<Course>
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

export type ImagecoursesArgs = {
  cursor?: InputMaybe<CourseWhereUniqueInput>
  skip?: InputMaybe<Scalars["Int"]>
  take?: InputMaybe<Scalars["Int"]>
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

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[]
  }
}
const result: PossibleTypesResultData = {
  possibleTypes: {},
}
export default result
