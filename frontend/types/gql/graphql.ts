/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `JSON` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  Json: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type AbEnrollment = {
  __typename?: 'AbEnrollment';
  ab_study: AbStudy;
  ab_study_id: Scalars['String'];
  created_at: Maybe<Scalars['DateTime']>;
  group: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  updated_at: Maybe<Scalars['DateTime']>;
  user: Maybe<User>;
  user_id: Maybe<Scalars['String']>;
};

export type AbEnrollmentCreateOrUpsertInput = {
  ab_study_id: Scalars['ID'];
  group: Scalars['Int'];
  user_id: Scalars['ID'];
};

export type AbEnrollmentUser_idAb_study_idCompoundUniqueInput = {
  ab_study_id: Scalars['String'];
  user_id: Scalars['String'];
};

export type AbEnrollmentWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
  user_id_ab_study_id?: InputMaybe<AbEnrollmentUser_idAb_study_idCompoundUniqueInput>;
};

export type AbStudy = {
  __typename?: 'AbStudy';
  ab_enrollments: Array<AbEnrollment>;
  created_at: Maybe<Scalars['DateTime']>;
  group_count: Scalars['Int'];
  id: Scalars['String'];
  name: Scalars['String'];
  updated_at: Maybe<Scalars['DateTime']>;
};


export type AbStudyab_enrollmentsArgs = {
  cursor?: InputMaybe<AbEnrollmentWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};

export type AbStudyCreateInput = {
  group_count: Scalars['Int'];
  name: Scalars['String'];
};

export type AbStudyUpsertInput = {
  group_count: Scalars['Int'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Completion = {
  __typename?: 'Completion';
  certificate_id: Maybe<Scalars['String']>;
  completion_date: Maybe<Scalars['DateTime']>;
  completion_language: Maybe<Scalars['String']>;
  completion_link: Maybe<Scalars['String']>;
  completion_registration_attempt_date: Maybe<Scalars['DateTime']>;
  completions_registered: Array<CompletionRegistered>;
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['DateTime']>;
  eligible_for_ects: Maybe<Scalars['Boolean']>;
  email: Scalars['String'];
  grade: Maybe<Scalars['String']>;
  id: Scalars['String'];
  project_completion: Maybe<Scalars['Boolean']>;
  registered: Maybe<Scalars['Boolean']>;
  student_number: Maybe<Scalars['String']>;
  tier: Maybe<Scalars['Int']>;
  updated_at: Maybe<Scalars['DateTime']>;
  user: Maybe<User>;
  user_upstream_id: Maybe<Scalars['Int']>;
};


export type Completioncompletions_registeredArgs = {
  cursor?: InputMaybe<CompletionRegisteredWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};

export type CompletionArg = {
  completion_id: Scalars['String'];
  eligible_for_ects?: InputMaybe<Scalars['Boolean']>;
  student_number: Scalars['String'];
  tier?: InputMaybe<Scalars['Int']>;
};

export type CompletionEdge = {
  __typename?: 'CompletionEdge';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor */
  cursor: Scalars['String'];
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Node */
  node: Maybe<Completion>;
};

export type CompletionRegistered = {
  __typename?: 'CompletionRegistered';
  completion: Maybe<Completion>;
  completion_id: Maybe<Scalars['String']>;
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  organization: Maybe<Organization>;
  organization_id: Maybe<Scalars['String']>;
  real_student_number: Scalars['String'];
  registration_date: Maybe<Scalars['DateTime']>;
  updated_at: Maybe<Scalars['DateTime']>;
  user: Maybe<User>;
  user_id: Maybe<Scalars['String']>;
};

export type CompletionRegisteredWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
};

export type Course = {
  __typename?: 'Course';
  automatic_completions: Maybe<Scalars['Boolean']>;
  automatic_completions_eligible_for_ects: Maybe<Scalars['Boolean']>;
  completion_email: Maybe<EmailTemplate>;
  completion_email_id: Maybe<Scalars['String']>;
  completions: Maybe<Array<Maybe<Completion>>>;
  completions_handled_by: Maybe<Course>;
  completions_handled_by_id: Maybe<Scalars['String']>;
  course_aliases: Array<CourseAlias>;
  course_organizations: Array<CourseOrganization>;
  course_stats_email: Maybe<EmailTemplate>;
  course_stats_email_id: Maybe<Scalars['String']>;
  course_translations: Array<CourseTranslation>;
  course_variants: Array<CourseVariant>;
  created_at: Maybe<Scalars['DateTime']>;
  description: Maybe<Scalars['String']>;
  ects: Maybe<Scalars['String']>;
  end_date: Maybe<Scalars['String']>;
  exercise_completions_needed: Maybe<Scalars['Int']>;
  exercises: Maybe<Array<Maybe<Exercise>>>;
  handles_completions_for: Array<Course>;
  has_certificate: Maybe<Scalars['Boolean']>;
  hidden: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  inherit_settings_from: Maybe<Course>;
  inherit_settings_from_id: Maybe<Scalars['String']>;
  instructions: Maybe<Scalars['String']>;
  link: Maybe<Scalars['String']>;
  name: Scalars['String'];
  open_university_registration_links: Array<OpenUniversityRegistrationLink>;
  order: Maybe<Scalars['Int']>;
  owner_organization: Maybe<Organization>;
  owner_organization_id: Maybe<Scalars['String']>;
  photo: Maybe<Image>;
  photo_id: Maybe<Scalars['String']>;
  points_needed: Maybe<Scalars['Int']>;
  promote: Maybe<Scalars['Boolean']>;
  services: Array<Service>;
  slug: Scalars['String'];
  start_date: Scalars['String'];
  start_point: Maybe<Scalars['Boolean']>;
  status: Maybe<CourseStatus>;
  study_module_order: Maybe<Scalars['Int']>;
  study_module_start_point: Maybe<Scalars['Boolean']>;
  study_modules: Array<StudyModule>;
  support_email: Maybe<Scalars['String']>;
  teacher_in_charge_email: Scalars['String'];
  teacher_in_charge_name: Scalars['String'];
  tier: Maybe<Scalars['Int']>;
  upcoming_active_link: Maybe<Scalars['Boolean']>;
  updated_at: Maybe<Scalars['DateTime']>;
  user_course_settings_visibilities: Array<UserCourseSettingsVisibility>;
};


export type CoursecompletionsArgs = {
  user_id?: InputMaybe<Scalars['String']>;
  user_upstream_id?: InputMaybe<Scalars['Int']>;
};


export type Coursecourse_aliasesArgs = {
  cursor?: InputMaybe<CourseAliasWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type Coursecourse_organizationsArgs = {
  cursor?: InputMaybe<CourseOrganizationWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type Coursecourse_translationsArgs = {
  cursor?: InputMaybe<CourseTranslationWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type Coursecourse_variantsArgs = {
  cursor?: InputMaybe<CourseVariantWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type CourseexercisesArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']>;
};


export type Coursehandles_completions_forArgs = {
  cursor?: InputMaybe<CourseWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type Courseopen_university_registration_linksArgs = {
  cursor?: InputMaybe<OpenUniversityRegistrationLinkWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type CourseservicesArgs = {
  cursor?: InputMaybe<ServiceWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type Coursestudy_modulesArgs = {
  cursor?: InputMaybe<StudyModuleWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type Courseuser_course_settings_visibilitiesArgs = {
  cursor?: InputMaybe<UserCourseSettingsVisibilityWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};

export type CourseAlias = {
  __typename?: 'CourseAlias';
  course: Maybe<Course>;
  course_code: Scalars['String'];
  course_id: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  updated_at: Maybe<Scalars['DateTime']>;
};

export type CourseAliasCreateInput = {
  course?: InputMaybe<Scalars['ID']>;
  course_code: Scalars['String'];
};

export type CourseAliasUpsertInput = {
  course?: InputMaybe<Scalars['ID']>;
  course_code: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
};

export type CourseAliasWhereUniqueInput = {
  course_code?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
};

export type CourseCreateArg = {
  automatic_completions?: InputMaybe<Scalars['Boolean']>;
  automatic_completions_eligible_for_ects?: InputMaybe<Scalars['Boolean']>;
  base64?: InputMaybe<Scalars['Boolean']>;
  completion_email_id?: InputMaybe<Scalars['ID']>;
  completions_handled_by?: InputMaybe<Scalars['ID']>;
  course_aliases?: InputMaybe<Array<InputMaybe<CourseAliasCreateInput>>>;
  course_stats_email_id?: InputMaybe<Scalars['ID']>;
  course_translations?: InputMaybe<Array<InputMaybe<CourseTranslationCreateInput>>>;
  course_variants?: InputMaybe<Array<InputMaybe<CourseVariantCreateInput>>>;
  ects?: InputMaybe<Scalars['String']>;
  end_date?: InputMaybe<Scalars['String']>;
  exercise_completions_needed?: InputMaybe<Scalars['Int']>;
  has_certificate?: InputMaybe<Scalars['Boolean']>;
  hidden?: InputMaybe<Scalars['Boolean']>;
  inherit_settings_from?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  new_photo?: InputMaybe<Scalars['Upload']>;
  open_university_registration_links?: InputMaybe<Array<InputMaybe<OpenUniversityRegistrationLinkCreateInput>>>;
  order?: InputMaybe<Scalars['Int']>;
  photo?: InputMaybe<Scalars['ID']>;
  points_needed?: InputMaybe<Scalars['Int']>;
  promote?: InputMaybe<Scalars['Boolean']>;
  slug: Scalars['String'];
  start_date: Scalars['String'];
  start_point?: InputMaybe<Scalars['Boolean']>;
  status?: InputMaybe<CourseStatus>;
  study_module_order?: InputMaybe<Scalars['Int']>;
  study_module_start_point?: InputMaybe<Scalars['Boolean']>;
  study_modules?: InputMaybe<Array<InputMaybe<StudyModuleWhereUniqueInput>>>;
  support_email?: InputMaybe<Scalars['String']>;
  teacher_in_charge_email: Scalars['String'];
  teacher_in_charge_name: Scalars['String'];
  tier?: InputMaybe<Scalars['Int']>;
  upcoming_active_link?: InputMaybe<Scalars['Boolean']>;
  user_course_settings_visibilities?: InputMaybe<Array<InputMaybe<UserCourseSettingsVisibilityCreateInput>>>;
};

export type CourseOrderByInput = {
  automatic_completions?: InputMaybe<SortOrder>;
  automatic_completions_eligible_for_ects?: InputMaybe<SortOrder>;
  completion_email_id?: InputMaybe<SortOrder>;
  completions_handled_by_id?: InputMaybe<SortOrder>;
  course_stats_email_id?: InputMaybe<SortOrder>;
  created_at?: InputMaybe<SortOrder>;
  ects?: InputMaybe<SortOrder>;
  end_date?: InputMaybe<SortOrder>;
  exercise_completions_needed?: InputMaybe<SortOrder>;
  has_certificate?: InputMaybe<SortOrder>;
  hidden?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  inherit_settings_from_id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  order?: InputMaybe<SortOrder>;
  owner_organization_id?: InputMaybe<SortOrder>;
  photo_id?: InputMaybe<SortOrder>;
  points_needed?: InputMaybe<SortOrder>;
  promote?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SortOrder>;
  start_date?: InputMaybe<SortOrder>;
  start_point?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  study_module_order?: InputMaybe<SortOrder>;
  study_module_start_point?: InputMaybe<SortOrder>;
  support_email?: InputMaybe<SortOrder>;
  teacher_in_charge_email?: InputMaybe<SortOrder>;
  teacher_in_charge_name?: InputMaybe<SortOrder>;
  tier?: InputMaybe<SortOrder>;
  upcoming_active_link?: InputMaybe<SortOrder>;
  updated_at?: InputMaybe<SortOrder>;
};

export type CourseOrganization = {
  __typename?: 'CourseOrganization';
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['DateTime']>;
  creator: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  organization: Maybe<Organization>;
  organization_id: Maybe<Scalars['String']>;
  updated_at: Maybe<Scalars['DateTime']>;
};

export type CourseOrganizationWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
};

export type CourseOwnership = {
  __typename?: 'CourseOwnership';
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  updated_at: Maybe<Scalars['DateTime']>;
  user: Maybe<User>;
  user_id: Maybe<Scalars['String']>;
};

export type CourseOwnershipUser_idCourse_idCompoundUniqueInput = {
  course_id: Scalars['String'];
  user_id: Scalars['String'];
};

export type CourseOwnershipWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
  user_id_course_id?: InputMaybe<CourseOwnershipUser_idCourse_idCompoundUniqueInput>;
};

export type CourseStatsSubscription = {
  __typename?: 'CourseStatsSubscription';
  created_at: Maybe<Scalars['DateTime']>;
  email_template: Maybe<EmailTemplate>;
  email_template_id: Maybe<Scalars['String']>;
  id: Scalars['String'];
  updated_at: Maybe<Scalars['DateTime']>;
  user: Maybe<User>;
  user_id: Maybe<Scalars['String']>;
};

export type CourseStatsSubscriptionUser_idEmail_template_idCompoundUniqueInput = {
  email_template_id: Scalars['String'];
  user_id: Scalars['String'];
};

export type CourseStatsSubscriptionWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
  user_id_email_template_id?: InputMaybe<CourseStatsSubscriptionUser_idEmail_template_idCompoundUniqueInput>;
};

export enum CourseStatus {
  Active = 'Active',
  Ended = 'Ended',
  Upcoming = 'Upcoming'
}

export type CourseTranslation = {
  __typename?: 'CourseTranslation';
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['DateTime']>;
  description: Scalars['String'];
  id: Scalars['String'];
  instructions: Maybe<Scalars['String']>;
  language: Scalars['String'];
  link: Maybe<Scalars['String']>;
  name: Scalars['String'];
  updated_at: Maybe<Scalars['DateTime']>;
};

export type CourseTranslationCreateInput = {
  course?: InputMaybe<Scalars['ID']>;
  description: Scalars['String'];
  instructions?: InputMaybe<Scalars['String']>;
  language: Scalars['String'];
  link?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type CourseTranslationUpsertInput = {
  course?: InputMaybe<Scalars['ID']>;
  description: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
  instructions?: InputMaybe<Scalars['String']>;
  language: Scalars['String'];
  link?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type CourseTranslationWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
};

export type CourseUpsertArg = {
  automatic_completions?: InputMaybe<Scalars['Boolean']>;
  automatic_completions_eligible_for_ects?: InputMaybe<Scalars['Boolean']>;
  base64?: InputMaybe<Scalars['Boolean']>;
  completion_email_id?: InputMaybe<Scalars['ID']>;
  completions_handled_by?: InputMaybe<Scalars['ID']>;
  course_aliases?: InputMaybe<Array<InputMaybe<CourseAliasUpsertInput>>>;
  course_stats_email_id?: InputMaybe<Scalars['ID']>;
  course_translations?: InputMaybe<Array<InputMaybe<CourseTranslationUpsertInput>>>;
  course_variants?: InputMaybe<Array<InputMaybe<CourseVariantUpsertInput>>>;
  delete_photo?: InputMaybe<Scalars['Boolean']>;
  ects?: InputMaybe<Scalars['String']>;
  end_date?: InputMaybe<Scalars['String']>;
  exercise_completions_needed?: InputMaybe<Scalars['Int']>;
  has_certificate?: InputMaybe<Scalars['Boolean']>;
  hidden?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
  inherit_settings_from?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  new_photo?: InputMaybe<Scalars['Upload']>;
  new_slug?: InputMaybe<Scalars['String']>;
  open_university_registration_links?: InputMaybe<Array<InputMaybe<OpenUniversityRegistrationLinkUpsertInput>>>;
  order?: InputMaybe<Scalars['Int']>;
  photo?: InputMaybe<Scalars['ID']>;
  points_needed?: InputMaybe<Scalars['Int']>;
  promote?: InputMaybe<Scalars['Boolean']>;
  slug: Scalars['String'];
  start_date: Scalars['String'];
  start_point?: InputMaybe<Scalars['Boolean']>;
  status?: InputMaybe<CourseStatus>;
  study_module_order?: InputMaybe<Scalars['Int']>;
  study_module_start_point?: InputMaybe<Scalars['Boolean']>;
  study_modules?: InputMaybe<Array<InputMaybe<StudyModuleWhereUniqueInput>>>;
  support_email?: InputMaybe<Scalars['String']>;
  teacher_in_charge_email: Scalars['String'];
  teacher_in_charge_name: Scalars['String'];
  tier?: InputMaybe<Scalars['Int']>;
  upcoming_active_link?: InputMaybe<Scalars['Boolean']>;
  user_course_settings_visibilities?: InputMaybe<Array<InputMaybe<UserCourseSettingsVisibilityUpsertInput>>>;
};

export type CourseVariant = {
  __typename?: 'CourseVariant';
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['DateTime']>;
  description: Maybe<Scalars['String']>;
  id: Scalars['String'];
  slug: Scalars['String'];
  updated_at: Maybe<Scalars['DateTime']>;
};

export type CourseVariantCreateInput = {
  course?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  instructions?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
};

export type CourseVariantUpsertInput = {
  course?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  instructions?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
};

export type CourseVariantWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
};

export type CourseWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};

export type EmailDelivery = {
  __typename?: 'EmailDelivery';
  created_at: Maybe<Scalars['DateTime']>;
  email_template: Maybe<EmailTemplate>;
  email_template_id: Maybe<Scalars['String']>;
  error: Scalars['Boolean'];
  error_message: Maybe<Scalars['String']>;
  id: Scalars['String'];
  sent: Scalars['Boolean'];
  updated_at: Maybe<Scalars['DateTime']>;
  user: Maybe<User>;
  user_id: Maybe<Scalars['String']>;
};

export type EmailDeliveryWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
};

export type EmailTemplate = {
  __typename?: 'EmailTemplate';
  course_stats_subscriptions: Array<CourseStatsSubscription>;
  courses: Array<Course>;
  created_at: Maybe<Scalars['DateTime']>;
  email_deliveries: Array<EmailDelivery>;
  exercise_completions_threshold: Maybe<Scalars['Int']>;
  html_body: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name: Maybe<Scalars['String']>;
  points_threshold: Maybe<Scalars['Int']>;
  template_type: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  triggered_automatically_by_course_id: Maybe<Scalars['String']>;
  txt_body: Maybe<Scalars['String']>;
  updated_at: Maybe<Scalars['DateTime']>;
};


export type EmailTemplatecourse_stats_subscriptionsArgs = {
  cursor?: InputMaybe<CourseStatsSubscriptionWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type EmailTemplatecoursesArgs = {
  cursor?: InputMaybe<CourseWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type EmailTemplateemail_deliveriesArgs = {
  cursor?: InputMaybe<EmailDeliveryWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};

export type Exercise = {
  __typename?: 'Exercise';
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['DateTime']>;
  custom_id: Scalars['String'];
  deleted: Maybe<Scalars['Boolean']>;
  exercise_completions: Maybe<Array<Maybe<ExerciseCompletion>>>;
  id: Scalars['String'];
  max_points: Maybe<Scalars['Int']>;
  name: Maybe<Scalars['String']>;
  part: Maybe<Scalars['Int']>;
  section: Maybe<Scalars['Int']>;
  service: Maybe<Service>;
  service_id: Maybe<Scalars['String']>;
  timestamp: Maybe<Scalars['DateTime']>;
  updated_at: Maybe<Scalars['DateTime']>;
};


export type Exerciseexercise_completionsArgs = {
  orderBy?: InputMaybe<ExerciseCompletionOrderByInput>;
  user_id?: InputMaybe<Scalars['ID']>;
};

export type ExerciseCompletion = {
  __typename?: 'ExerciseCompletion';
  attempted: Maybe<Scalars['Boolean']>;
  completed: Maybe<Scalars['Boolean']>;
  created_at: Maybe<Scalars['DateTime']>;
  exercise: Maybe<Exercise>;
  exercise_completion_required_actions: Array<ExerciseCompletionRequiredAction>;
  exercise_id: Maybe<Scalars['String']>;
  id: Scalars['String'];
  n_points: Maybe<Scalars['Float']>;
  timestamp: Scalars['DateTime'];
  updated_at: Maybe<Scalars['DateTime']>;
  user: Maybe<User>;
  user_id: Maybe<Scalars['String']>;
};


export type ExerciseCompletionexercise_completion_required_actionsArgs = {
  cursor?: InputMaybe<ExerciseCompletionRequiredActionWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};

export type ExerciseCompletionOrderByInput = {
  attempted?: InputMaybe<SortOrder>;
  completed?: InputMaybe<SortOrder>;
  created_at?: InputMaybe<SortOrder>;
  exercise_id?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  n_points?: InputMaybe<SortOrder>;
  original_submission_date?: InputMaybe<SortOrder>;
  timestamp?: InputMaybe<SortOrder>;
  updated_at?: InputMaybe<SortOrder>;
  user_id?: InputMaybe<SortOrder>;
};

export type ExerciseCompletionRequiredAction = {
  __typename?: 'ExerciseCompletionRequiredAction';
  exercise_completion: Maybe<ExerciseCompletion>;
  exercise_completion_id: Maybe<Scalars['String']>;
  id: Scalars['String'];
  value: Scalars['String'];
};

export type ExerciseCompletionRequiredActionWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
};

export type ExerciseCompletionWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
};

export type ExerciseProgress = {
  __typename?: 'ExerciseProgress';
  exercises: Maybe<Scalars['Float']>;
  total: Maybe<Scalars['Float']>;
};

export type ExerciseWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
};

export type Image = {
  __typename?: 'Image';
  compressed: Maybe<Scalars['String']>;
  compressed_mimetype: Maybe<Scalars['String']>;
  courses: Array<Course>;
  created_at: Maybe<Scalars['DateTime']>;
  default: Maybe<Scalars['Boolean']>;
  encoding: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name: Maybe<Scalars['String']>;
  original: Scalars['String'];
  original_mimetype: Scalars['String'];
  uncompressed: Scalars['String'];
  uncompressed_mimetype: Scalars['String'];
  updated_at: Maybe<Scalars['DateTime']>;
};


export type ImagecoursesArgs = {
  cursor?: InputMaybe<CourseWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};

export type ManualCompletionArg = {
  completion_date?: InputMaybe<Scalars['DateTime']>;
  grade?: InputMaybe<Scalars['String']>;
  tier?: InputMaybe<Scalars['Int']>;
  user_id: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addAbEnrollment: Maybe<AbEnrollment>;
  addAbStudy: Maybe<AbStudy>;
  addCompletion: Maybe<Completion>;
  addCourse: Maybe<Course>;
  addCourseAlias: Maybe<CourseAlias>;
  addCourseOrganization: Maybe<CourseOrganization>;
  addCourseTranslation: Maybe<CourseTranslation>;
  addCourseVariant: Maybe<CourseVariant>;
  addEmailTemplate: Maybe<EmailTemplate>;
  addExercise: Maybe<Exercise>;
  addExerciseCompletion: Maybe<ExerciseCompletion>;
  addImage: Maybe<Image>;
  addManualCompletion: Maybe<Array<Maybe<Completion>>>;
  addOpenUniversityRegistrationLink: Maybe<OpenUniversityRegistrationLink>;
  addOrganization: Maybe<Organization>;
  addService: Maybe<Service>;
  addStudyModule: Maybe<StudyModule>;
  addStudyModuleTranslation: Maybe<StudyModuleTranslation>;
  addUser: Maybe<User>;
  addUserCourseProgress: Maybe<UserCourseProgress>;
  addUserCourseServiceProgress: Maybe<UserCourseServiceProgress>;
  addUserOrganization: Maybe<UserOrganization>;
  addVerifiedUser: Maybe<VerifiedUser>;
  createCourseStatsSubscription: Maybe<CourseStatsSubscription>;
  createRegistrationAttemptDate: Maybe<Completion>;
  deleteCourse: Maybe<Course>;
  deleteCourseOrganization: Maybe<CourseOrganization>;
  deleteCourseStatsSubscription: Maybe<CourseStatsSubscription>;
  deleteCourseTranslation: Maybe<CourseTranslation>;
  deleteCourseVariant: Maybe<CourseVariant>;
  deleteEmailTemplate: Maybe<EmailTemplate>;
  deleteImage: Maybe<Scalars['Boolean']>;
  deleteStudyModule: Maybe<StudyModule>;
  deleteStudyModuleTranslation: Maybe<StudyModuleTranslation>;
  deleteUserOrganization: Maybe<UserOrganization>;
  recheckCompletions: Maybe<Scalars['String']>;
  registerCompletion: Maybe<Scalars['String']>;
  updateAbEnrollment: Maybe<AbEnrollment>;
  updateAbStudy: Maybe<AbStudy>;
  updateCourse: Maybe<Course>;
  updateCourseTranslation: Maybe<CourseTranslation>;
  updateCourseVariant: Maybe<CourseVariant>;
  updateEmailTemplate: Maybe<EmailTemplate>;
  updateOpenUniversityRegistrationLink: Maybe<OpenUniversityRegistrationLink>;
  updateResearchConsent: Maybe<User>;
  updateService: Maybe<Service>;
  updateStudyModule: Maybe<StudyModule>;
  updateStudyModuletranslation: Maybe<StudyModuleTranslation>;
  updateUserName: Maybe<User>;
  updateUserOrganization: Maybe<UserOrganization>;
};


export type MutationaddAbEnrollmentArgs = {
  abEnrollment: AbEnrollmentCreateOrUpsertInput;
};


export type MutationaddAbStudyArgs = {
  abStudy: AbStudyCreateInput;
};


export type MutationaddCompletionArgs = {
  completion_language?: InputMaybe<Scalars['String']>;
  course: Scalars['ID'];
  email?: InputMaybe<Scalars['String']>;
  student_number?: InputMaybe<Scalars['String']>;
  tier?: InputMaybe<Scalars['Int']>;
  user: Scalars['ID'];
  user_upstream_id?: InputMaybe<Scalars['Int']>;
};


export type MutationaddCourseArgs = {
  course: CourseCreateArg;
};


export type MutationaddCourseAliasArgs = {
  course: Scalars['ID'];
  course_code: Scalars['String'];
};


export type MutationaddCourseOrganizationArgs = {
  course_id: Scalars['ID'];
  creator?: InputMaybe<Scalars['Boolean']>;
  organization_id: Scalars['ID'];
};


export type MutationaddCourseTranslationArgs = {
  course?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  instructions?: InputMaybe<Scalars['String']>;
  language: Scalars['String'];
  link?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};


export type MutationaddCourseVariantArgs = {
  course_id: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
};


export type MutationaddEmailTemplateArgs = {
  exercise_completions_threshold?: InputMaybe<Scalars['Int']>;
  html_body?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  points_threshold?: InputMaybe<Scalars['Int']>;
  template_type?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  triggered_automatically_by_course_id?: InputMaybe<Scalars['String']>;
  txt_body?: InputMaybe<Scalars['String']>;
};


export type MutationaddExerciseArgs = {
  course?: InputMaybe<Scalars['ID']>;
  custom_id?: InputMaybe<Scalars['String']>;
  max_points?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  part?: InputMaybe<Scalars['Int']>;
  section?: InputMaybe<Scalars['Int']>;
  service?: InputMaybe<Scalars['ID']>;
};


export type MutationaddExerciseCompletionArgs = {
  exercise?: InputMaybe<Scalars['ID']>;
  n_points?: InputMaybe<Scalars['Int']>;
  original_submission_date?: InputMaybe<Scalars['DateTime']>;
  timestamp?: InputMaybe<Scalars['DateTime']>;
  user?: InputMaybe<Scalars['ID']>;
};


export type MutationaddImageArgs = {
  base64?: InputMaybe<Scalars['Boolean']>;
  file: Scalars['Upload'];
};


export type MutationaddManualCompletionArgs = {
  completions?: InputMaybe<Array<InputMaybe<ManualCompletionArg>>>;
  course_id: Scalars['String'];
};


export type MutationaddOpenUniversityRegistrationLinkArgs = {
  course: Scalars['ID'];
  course_code: Scalars['String'];
  language?: InputMaybe<Scalars['String']>;
  link?: InputMaybe<Scalars['String']>;
};


export type MutationaddOrganizationArgs = {
  name?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
};


export type MutationaddServiceArgs = {
  name: Scalars['String'];
  url: Scalars['String'];
};


export type MutationaddStudyModuleArgs = {
  study_module: StudyModuleCreateArg;
};


export type MutationaddStudyModuleTranslationArgs = {
  description?: InputMaybe<Scalars['String']>;
  language: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  study_module: Scalars['ID'];
};


export type MutationaddUserArgs = {
  user: UserArg;
};


export type MutationaddUserCourseProgressArgs = {
  course_id: Scalars['ID'];
  extra?: InputMaybe<Scalars['Json']>;
  max_points?: InputMaybe<Scalars['Float']>;
  n_points?: InputMaybe<Scalars['Float']>;
  progress?: InputMaybe<Array<PointsByGroup>>;
  user_id: Scalars['ID'];
};


export type MutationaddUserCourseServiceProgressArgs = {
  progress: PointsByGroup;
  service_id: Scalars['ID'];
  user_course_progress_id: Scalars['ID'];
};


export type MutationaddUserOrganizationArgs = {
  organization_id: Scalars['ID'];
  user_id: Scalars['ID'];
};


export type MutationaddVerifiedUserArgs = {
  verified_user: VerifiedUserArg;
};


export type MutationcreateCourseStatsSubscriptionArgs = {
  id: Scalars['ID'];
};


export type MutationcreateRegistrationAttemptDateArgs = {
  completion_registration_attempt_date: Scalars['DateTime'];
  id: Scalars['ID'];
};


export type MutationdeleteCourseArgs = {
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type MutationdeleteCourseOrganizationArgs = {
  id: Scalars['ID'];
};


export type MutationdeleteCourseStatsSubscriptionArgs = {
  id: Scalars['ID'];
};


export type MutationdeleteCourseTranslationArgs = {
  id: Scalars['ID'];
};


export type MutationdeleteCourseVariantArgs = {
  id: Scalars['ID'];
};


export type MutationdeleteEmailTemplateArgs = {
  id: Scalars['ID'];
};


export type MutationdeleteImageArgs = {
  id: Scalars['ID'];
};


export type MutationdeleteStudyModuleArgs = {
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type MutationdeleteStudyModuleTranslationArgs = {
  id: Scalars['ID'];
};


export type MutationdeleteUserOrganizationArgs = {
  id: Scalars['ID'];
};


export type MutationrecheckCompletionsArgs = {
  course_id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type MutationregisterCompletionArgs = {
  completions?: InputMaybe<Array<InputMaybe<CompletionArg>>>;
};


export type MutationupdateAbEnrollmentArgs = {
  abEnrollment: AbEnrollmentCreateOrUpsertInput;
};


export type MutationupdateAbStudyArgs = {
  abStudy: AbStudyUpsertInput;
};


export type MutationupdateCourseArgs = {
  course: CourseUpsertArg;
};


export type MutationupdateCourseTranslationArgs = {
  course?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  instructions?: InputMaybe<Scalars['String']>;
  language: Scalars['String'];
  link?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};


export type MutationupdateCourseVariantArgs = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  slug?: InputMaybe<Scalars['String']>;
};


export type MutationupdateEmailTemplateArgs = {
  exercise_completions_threshold?: InputMaybe<Scalars['Int']>;
  html_body?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  points_threshold?: InputMaybe<Scalars['Int']>;
  template_type?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  triggered_automatically_by_course_id?: InputMaybe<Scalars['String']>;
  txt_body?: InputMaybe<Scalars['String']>;
};


export type MutationupdateOpenUniversityRegistrationLinkArgs = {
  course: Scalars['ID'];
  course_code?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  language?: InputMaybe<Scalars['String']>;
  link?: InputMaybe<Scalars['String']>;
};


export type MutationupdateResearchConsentArgs = {
  value: Scalars['Boolean'];
};


export type MutationupdateServiceArgs = {
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};


export type MutationupdateStudyModuleArgs = {
  study_module: StudyModuleUpsertArg;
};


export type MutationupdateStudyModuletranslationArgs = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  language?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  study_module: Scalars['ID'];
};


export type MutationupdateUserNameArgs = {
  first_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
};


export type MutationupdateUserOrganizationArgs = {
  id: Scalars['ID'];
  role?: InputMaybe<OrganizationRole>;
};

export type NestedStringNullableFilter = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  gte?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  lt?: InputMaybe<Scalars['String']>;
  lte?: InputMaybe<Scalars['String']>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type OpenUniversityRegistrationLink = {
  __typename?: 'OpenUniversityRegistrationLink';
  course: Maybe<Course>;
  course_code: Scalars['String'];
  course_id: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  language: Scalars['String'];
  link: Maybe<Scalars['String']>;
  start_date: Maybe<Scalars['DateTime']>;
  stop_date: Maybe<Scalars['DateTime']>;
  tiers: Maybe<Scalars['Json']>;
  updated_at: Maybe<Scalars['DateTime']>;
};

export type OpenUniversityRegistrationLinkCreateInput = {
  course_code: Scalars['String'];
  language: Scalars['String'];
  link?: InputMaybe<Scalars['String']>;
  start_date?: InputMaybe<Scalars['DateTime']>;
  stop_date?: InputMaybe<Scalars['DateTime']>;
  tiers?: InputMaybe<Scalars['Json']>;
};

export type OpenUniversityRegistrationLinkUpsertInput = {
  course_code: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
  language: Scalars['String'];
  link?: InputMaybe<Scalars['String']>;
  start_date?: InputMaybe<Scalars['DateTime']>;
  stop_date?: InputMaybe<Scalars['DateTime']>;
  tiers?: InputMaybe<Scalars['Json']>;
};

export type OpenUniversityRegistrationLinkWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
};

export type Organization = {
  __typename?: 'Organization';
  completions_registered: Array<CompletionRegistered>;
  contact_information: Maybe<Scalars['String']>;
  course_organizations: Array<CourseOrganization>;
  courses: Array<Course>;
  created_at: Maybe<Scalars['DateTime']>;
  creator: Maybe<User>;
  creator_id: Maybe<Scalars['String']>;
  disabled: Maybe<Scalars['Boolean']>;
  email: Maybe<Scalars['String']>;
  hidden: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  logo_content_type: Maybe<Scalars['String']>;
  logo_file_name: Maybe<Scalars['String']>;
  logo_file_size: Maybe<Scalars['Int']>;
  logo_updated_at: Maybe<Scalars['DateTime']>;
  organization_translations: Array<OrganizationTranslation>;
  phone: Maybe<Scalars['String']>;
  pinned: Maybe<Scalars['Boolean']>;
  slug: Scalars['String'];
  tmc_created_at: Maybe<Scalars['DateTime']>;
  tmc_updated_at: Maybe<Scalars['DateTime']>;
  updated_at: Maybe<Scalars['DateTime']>;
  user_organizations: Array<UserOrganization>;
  verified: Maybe<Scalars['Boolean']>;
  verified_at: Maybe<Scalars['DateTime']>;
  verified_users: Array<VerifiedUser>;
  website: Maybe<Scalars['String']>;
};


export type Organizationcompletions_registeredArgs = {
  cursor?: InputMaybe<CompletionRegisteredWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type Organizationcourse_organizationsArgs = {
  cursor?: InputMaybe<CourseOrganizationWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type OrganizationcoursesArgs = {
  cursor?: InputMaybe<CourseWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type Organizationorganization_translationsArgs = {
  cursor?: InputMaybe<OrganizationTranslationWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type Organizationuser_organizationsArgs = {
  cursor?: InputMaybe<UserOrganizationWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type Organizationverified_usersArgs = {
  cursor?: InputMaybe<VerifiedUserWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};

export type OrganizationOrderByInput = {
  contact_information?: InputMaybe<SortOrder>;
  created_at?: InputMaybe<SortOrder>;
  creator_id?: InputMaybe<SortOrder>;
  disabled?: InputMaybe<SortOrder>;
  email?: InputMaybe<SortOrder>;
  hidden?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  join_organization_email_template_id?: InputMaybe<SortOrder>;
  logo_content_type?: InputMaybe<SortOrder>;
  logo_file_name?: InputMaybe<SortOrder>;
  logo_file_size?: InputMaybe<SortOrder>;
  logo_updated_at?: InputMaybe<SortOrder>;
  phone?: InputMaybe<SortOrder>;
  pinned?: InputMaybe<SortOrder>;
  required_confirmation?: InputMaybe<SortOrder>;
  required_organization_email?: InputMaybe<SortOrder>;
  secret_key?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SortOrder>;
  tmc_created_at?: InputMaybe<SortOrder>;
  tmc_updated_at?: InputMaybe<SortOrder>;
  updated_at?: InputMaybe<SortOrder>;
  verified?: InputMaybe<SortOrder>;
  verified_at?: InputMaybe<SortOrder>;
  website?: InputMaybe<SortOrder>;
};

export enum OrganizationRole {
  OrganizationAdmin = 'OrganizationAdmin',
  Student = 'Student',
  Teacher = 'Teacher'
}

export type OrganizationTranslation = {
  __typename?: 'OrganizationTranslation';
  created_at: Maybe<Scalars['DateTime']>;
  disabled_reason: Maybe<Scalars['String']>;
  id: Scalars['String'];
  information: Maybe<Scalars['String']>;
  language: Scalars['String'];
  name: Scalars['String'];
  organization: Maybe<Organization>;
  organization_id: Maybe<Scalars['String']>;
  updated_at: Maybe<Scalars['DateTime']>;
};

export type OrganizationTranslationWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
};

export type OrganizationWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
  secret_key?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};

/** PageInfo cursor, as defined in https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** The cursor corresponding to the last nodes in edges. Null if the connection is empty. */
  endCursor: Maybe<Scalars['String']>;
  /** Used to indicate whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean'];
  /** Used to indicate whether more edges exist prior to the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean'];
  /** The cursor corresponding to the first nodes in edges. Null if the connection is empty. */
  startCursor: Maybe<Scalars['String']>;
};

export type PointsByGroup = {
  group: Scalars['String'];
  max_points: Scalars['Int'];
  n_points: Scalars['Int'];
  progress: Scalars['Float'];
};

export type Progress = {
  __typename?: 'Progress';
  course: Maybe<Course>;
  user: Maybe<User>;
  user_course_progress: Maybe<UserCourseProgress>;
  user_course_service_progresses: Maybe<Array<Maybe<UserCourseServiceProgress>>>;
};

export type Query = {
  __typename?: 'Query';
  completions: Maybe<Array<Maybe<Completion>>>;
  completionsPaginated: Maybe<QueryCompletionsPaginated_type_Connection>;
  completionsPaginated_type: Maybe<QueryCompletionsPaginated_type_Connection>;
  course: Maybe<Course>;
  courseAliases: Array<CourseAlias>;
  courseOrganizations: Maybe<Array<Maybe<CourseOrganization>>>;
  courseTranslations: Maybe<Array<Maybe<CourseTranslation>>>;
  courseVariant: Maybe<CourseVariant>;
  courseVariants: Maybe<Array<Maybe<CourseVariant>>>;
  course_exists: Maybe<Scalars['Boolean']>;
  courses: Maybe<Array<Maybe<Course>>>;
  currentUser: Maybe<User>;
  email_template: Maybe<EmailTemplate>;
  email_templates: Maybe<Array<Maybe<EmailTemplate>>>;
  exercise: Maybe<Exercise>;
  exerciseCompletion: Maybe<ExerciseCompletion>;
  exerciseCompletions: Array<ExerciseCompletion>;
  exercises: Array<Exercise>;
  handlerCourses: Maybe<Array<Maybe<Course>>>;
  openUniversityRegistrationLink: Maybe<OpenUniversityRegistrationLink>;
  openUniversityRegistrationLinks: Array<OpenUniversityRegistrationLink>;
  organization: Maybe<Organization>;
  organizations: Maybe<Array<Maybe<Organization>>>;
  registeredCompletions: Maybe<Array<Maybe<CompletionRegistered>>>;
  service: Maybe<Service>;
  services: Array<Service>;
  studyModuleTranslations: Array<StudyModuleTranslation>;
  study_module: Maybe<StudyModule>;
  study_module_exists: Maybe<Scalars['Boolean']>;
  study_modules: Maybe<Array<Maybe<StudyModule>>>;
  user: Maybe<User>;
  userCourseProgress: Maybe<UserCourseProgress>;
  userCourseProgresses: Maybe<Array<Maybe<UserCourseProgress>>>;
  userCourseServiceProgress: Maybe<UserCourseServiceProgress>;
  userCourseServiceProgresses: Array<UserCourseServiceProgress>;
  userCourseSetting: Maybe<UserCourseSetting>;
  userCourseSettingCount: Maybe<Scalars['Int']>;
  userCourseSettings: Maybe<QueryUserCourseSettings_Connection>;
  userDetailsContains: Maybe<QueryUserDetailsContains_Connection>;
  userOrganizations: Maybe<Array<Maybe<UserOrganization>>>;
  users: Array<User>;
};


export type QuerycompletionsArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  completion_language?: InputMaybe<Scalars['String']>;
  course: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QuerycompletionsPaginatedArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  completion_language?: InputMaybe<Scalars['String']>;
  course: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QuerycompletionsPaginated_typeArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  completion_language?: InputMaybe<Scalars['String']>;
  course: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QuerycourseArgs = {
  id?: InputMaybe<Scalars['ID']>;
  language?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  translationFallback?: InputMaybe<Scalars['Boolean']>;
};


export type QuerycourseAliasesArgs = {
  cursor?: InputMaybe<CourseAliasWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type QuerycourseOrganizationsArgs = {
  course_id?: InputMaybe<Scalars['ID']>;
  organization_id?: InputMaybe<Scalars['ID']>;
};


export type QuerycourseTranslationsArgs = {
  language?: InputMaybe<Scalars['String']>;
};


export type QuerycourseVariantArgs = {
  id: Scalars['ID'];
};


export type QuerycourseVariantsArgs = {
  course_id?: InputMaybe<Scalars['ID']>;
};


export type Querycourse_existsArgs = {
  slug: Scalars['String'];
};


export type QuerycoursesArgs = {
  handledBy?: InputMaybe<Scalars['String']>;
  hidden?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  orderBy?: InputMaybe<CourseOrderByInput>;
  search?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Array<CourseStatus>>;
};


export type QuerycurrentUserArgs = {
  search?: InputMaybe<Scalars['String']>;
};


export type Queryemail_templateArgs = {
  id: Scalars['ID'];
};


export type QueryexerciseArgs = {
  id: Scalars['ID'];
};


export type QueryexerciseCompletionArgs = {
  id: Scalars['ID'];
};


export type QueryexerciseCompletionsArgs = {
  cursor?: InputMaybe<ExerciseCompletionWhereUniqueInput>;
  orderBy?: InputMaybe<Array<ExerciseCompletionOrderByInput>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type QueryexercisesArgs = {
  cursor?: InputMaybe<ExerciseWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type QueryopenUniversityRegistrationLinkArgs = {
  id: Scalars['ID'];
};


export type QueryopenUniversityRegistrationLinksArgs = {
  cursor?: InputMaybe<OpenUniversityRegistrationLinkWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type QueryorganizationArgs = {
  hidden?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryorganizationsArgs = {
  cursor?: InputMaybe<OrganizationWhereUniqueInput>;
  hidden?: InputMaybe<Scalars['Boolean']>;
  orderBy?: InputMaybe<OrganizationOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type QueryregisteredCompletionsArgs = {
  course?: InputMaybe<Scalars['String']>;
  cursor?: InputMaybe<CompletionRegisteredWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type QueryserviceArgs = {
  service_id: Scalars['ID'];
};


export type Querystudy_moduleArgs = {
  id?: InputMaybe<Scalars['ID']>;
  language?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  translationFallback?: InputMaybe<Scalars['Boolean']>;
};


export type Querystudy_module_existsArgs = {
  slug: Scalars['String'];
};


export type Querystudy_modulesArgs = {
  language?: InputMaybe<Scalars['String']>;
  orderBy?: InputMaybe<StudyModuleOrderByInput>;
};


export type QueryuserArgs = {
  id?: InputMaybe<Scalars['ID']>;
  search?: InputMaybe<Scalars['String']>;
  upstream_id?: InputMaybe<Scalars['Int']>;
};


export type QueryuserCourseProgressArgs = {
  course_id: Scalars['ID'];
  user_id: Scalars['ID'];
};


export type QueryuserCourseProgressesArgs = {
  course_id?: InputMaybe<Scalars['ID']>;
  course_slug?: InputMaybe<Scalars['String']>;
  cursor?: InputMaybe<UserCourseProgressWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  user_id?: InputMaybe<Scalars['ID']>;
};


export type QueryuserCourseServiceProgressArgs = {
  course_id?: InputMaybe<Scalars['ID']>;
  service_id?: InputMaybe<Scalars['ID']>;
  user_id?: InputMaybe<Scalars['ID']>;
};


export type QueryuserCourseServiceProgressesArgs = {
  cursor?: InputMaybe<UserCourseServiceProgressWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<QueryUserCourseServiceProgressesWhereInput>;
};


export type QueryuserCourseSettingArgs = {
  course_id: Scalars['ID'];
  user_id: Scalars['ID'];
};


export type QueryuserCourseSettingCountArgs = {
  course_id?: InputMaybe<Scalars['ID']>;
  user_id?: InputMaybe<Scalars['ID']>;
};


export type QueryuserCourseSettingsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  course_id?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  user_id?: InputMaybe<Scalars['ID']>;
  user_upstream_id?: InputMaybe<Scalars['Int']>;
};


export type QueryuserDetailsContainsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryuserOrganizationsArgs = {
  organization_id?: InputMaybe<Scalars['ID']>;
  user_id?: InputMaybe<Scalars['ID']>;
};


export type QueryusersArgs = {
  cursor?: InputMaybe<UserWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};

export type QueryCompletionsPaginated_type_Connection = {
  __typename?: 'QueryCompletionsPaginated_type_Connection';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges: Maybe<Array<Maybe<CompletionEdge>>>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']>;
};

export enum QueryMode {
  default = 'default',
  insensitive = 'insensitive'
}

export type QueryUserCourseServiceProgressesWhereInput = {
  course_id?: InputMaybe<StringNullableFilter>;
  service_id?: InputMaybe<StringNullableFilter>;
  user_id?: InputMaybe<StringNullableFilter>;
};

export type QueryUserCourseSettings_Connection = {
  __typename?: 'QueryUserCourseSettings_Connection';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges: Maybe<Array<Maybe<UserCourseSettingEdge>>>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']>;
};

export type QueryUserDetailsContains_Connection = {
  __typename?: 'QueryUserDetailsContains_Connection';
  count: Maybe<Scalars['Int']>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges: Maybe<Array<Maybe<UserEdge>>>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo;
};


export type QueryUserDetailsContains_ConnectioncountArgs = {
  search?: InputMaybe<Scalars['String']>;
};

export type Service = {
  __typename?: 'Service';
  courses: Array<Course>;
  created_at: Maybe<Scalars['DateTime']>;
  exercises: Array<Exercise>;
  id: Scalars['String'];
  name: Scalars['String'];
  updated_at: Maybe<Scalars['DateTime']>;
  url: Scalars['String'];
  user_course_service_progresses: Array<UserCourseServiceProgress>;
};


export type ServicecoursesArgs = {
  cursor?: InputMaybe<CourseWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type ServiceexercisesArgs = {
  cursor?: InputMaybe<ExerciseWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type Serviceuser_course_service_progressesArgs = {
  cursor?: InputMaybe<UserCourseServiceProgressWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};

export type ServiceWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
};

export enum SortOrder {
  asc = 'asc',
  desc = 'desc'
}

export type StoredData = {
  __typename?: 'StoredData';
  course: Maybe<Course>;
  course_id: Scalars['String'];
  created_at: Maybe<Scalars['DateTime']>;
  data: Scalars['String'];
  updated_at: Maybe<Scalars['DateTime']>;
  user: Maybe<User>;
  user_id: Scalars['String'];
};

export type StringNullableFilter = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  gte?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  lt?: InputMaybe<Scalars['String']>;
  lte?: InputMaybe<Scalars['String']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type StudyModule = {
  __typename?: 'StudyModule';
  courses: Maybe<Array<Maybe<Course>>>;
  created_at: Maybe<Scalars['DateTime']>;
  description: Maybe<Scalars['String']>;
  id: Scalars['String'];
  image: Maybe<Scalars['String']>;
  name: Scalars['String'];
  order: Maybe<Scalars['Int']>;
  slug: Scalars['String'];
  study_module_translations: Array<StudyModuleTranslation>;
  updated_at: Maybe<Scalars['DateTime']>;
};


export type StudyModulecoursesArgs = {
  language?: InputMaybe<Scalars['String']>;
  orderBy?: InputMaybe<CourseOrderByInput>;
};


export type StudyModulestudy_module_translationsArgs = {
  cursor?: InputMaybe<StudyModuleTranslationWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};

export type StudyModuleCreateArg = {
  image?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Scalars['Int']>;
  slug: Scalars['String'];
  study_module_translations?: InputMaybe<Array<InputMaybe<StudyModuleTranslationUpsertInput>>>;
};

export type StudyModuleOrderByInput = {
  created_at?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  image?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  order?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SortOrder>;
  updated_at?: InputMaybe<SortOrder>;
};

export type StudyModuleTranslation = {
  __typename?: 'StudyModuleTranslation';
  created_at: Maybe<Scalars['DateTime']>;
  description: Scalars['String'];
  id: Scalars['String'];
  language: Scalars['String'];
  name: Scalars['String'];
  study_module: Maybe<StudyModule>;
  study_module_id: Maybe<Scalars['String']>;
  updated_at: Maybe<Scalars['DateTime']>;
};

export type StudyModuleTranslationCreateInput = {
  description: Scalars['String'];
  language: Scalars['String'];
  name: Scalars['String'];
  study_module?: InputMaybe<Scalars['ID']>;
};

export type StudyModuleTranslationUpsertInput = {
  description: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
  language: Scalars['String'];
  name: Scalars['String'];
  study_module?: InputMaybe<Scalars['ID']>;
};

export type StudyModuleTranslationWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
};

export type StudyModuleUpsertArg = {
  id?: InputMaybe<Scalars['ID']>;
  image?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  new_slug?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Scalars['Int']>;
  slug: Scalars['String'];
  study_module_translations?: InputMaybe<Array<InputMaybe<StudyModuleTranslationUpsertInput>>>;
};

export type StudyModuleWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  ab_enrollments: Array<AbEnrollment>;
  administrator: Scalars['Boolean'];
  completions: Maybe<Array<Completion>>;
  completions_registered: Maybe<Array<CompletionRegistered>>;
  course_ownerships: Array<CourseOwnership>;
  course_stats_subscriptions: Array<CourseStatsSubscription>;
  created_at: Maybe<Scalars['DateTime']>;
  email: Scalars['String'];
  email_deliveries: Array<EmailDelivery>;
  exercise_completions: Maybe<Array<Maybe<ExerciseCompletion>>>;
  first_name: Maybe<Scalars['String']>;
  id: Scalars['String'];
  last_name: Maybe<Scalars['String']>;
  organizations: Array<Organization>;
  progress: Progress;
  progresses: Maybe<Array<Progress>>;
  project_completion: Maybe<Scalars['Boolean']>;
  real_student_number: Maybe<Scalars['String']>;
  research_consent: Maybe<Scalars['Boolean']>;
  student_number: Maybe<Scalars['String']>;
  updated_at: Maybe<Scalars['DateTime']>;
  upstream_id: Scalars['Int'];
  user_course_progresses: Maybe<Array<UserCourseProgress>>;
  user_course_progressess: Maybe<UserCourseProgress>;
  user_course_service_progresses: Maybe<Array<UserCourseServiceProgress>>;
  user_course_settings: Array<UserCourseSetting>;
  user_course_summary: Maybe<Array<Maybe<UserCourseSummary>>>;
  user_organizations: Array<UserOrganization>;
  username: Scalars['String'];
  verified_users: Array<VerifiedUser>;
};


export type Userab_enrollmentsArgs = {
  cursor?: InputMaybe<AbEnrollmentWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type UsercompletionsArgs = {
  course_id?: InputMaybe<Scalars['String']>;
  course_slug?: InputMaybe<Scalars['String']>;
};


export type Usercompletions_registeredArgs = {
  course_id?: InputMaybe<Scalars['String']>;
  course_slug?: InputMaybe<Scalars['String']>;
  organization_id?: InputMaybe<Scalars['String']>;
};


export type Usercourse_ownershipsArgs = {
  cursor?: InputMaybe<CourseOwnershipWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type Usercourse_stats_subscriptionsArgs = {
  cursor?: InputMaybe<CourseStatsSubscriptionWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type Useremail_deliveriesArgs = {
  cursor?: InputMaybe<EmailDeliveryWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type Userexercise_completionsArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']>;
};


export type UserorganizationsArgs = {
  cursor?: InputMaybe<OrganizationWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type UserprogressArgs = {
  course_id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type Userproject_completionArgs = {
  course_id?: InputMaybe<Scalars['ID']>;
  course_slug?: InputMaybe<Scalars['String']>;
};


export type Useruser_course_progressessArgs = {
  course_id?: InputMaybe<Scalars['ID']>;
};


export type Useruser_course_settingsArgs = {
  cursor?: InputMaybe<UserCourseSettingWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type Useruser_organizationsArgs = {
  cursor?: InputMaybe<UserOrganizationWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type Userverified_usersArgs = {
  cursor?: InputMaybe<VerifiedUserWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};

export type UserAppDatumConfig = {
  __typename?: 'UserAppDatumConfig';
  created_at: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  name: Maybe<Scalars['String']>;
  timestamp: Maybe<Scalars['DateTime']>;
  updated_at: Maybe<Scalars['DateTime']>;
};

export type UserArg = {
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  research_consent: Scalars['Boolean'];
  upstream_id: Scalars['Int'];
  username: Scalars['String'];
};

export type UserCourseProgress = {
  __typename?: 'UserCourseProgress';
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['DateTime']>;
  exercise_progress: Maybe<ExerciseProgress>;
  extra: Maybe<Scalars['Json']>;
  id: Scalars['String'];
  max_points: Maybe<Scalars['Float']>;
  n_points: Maybe<Scalars['Float']>;
  progress: Maybe<Array<Maybe<Scalars['Json']>>>;
  updated_at: Maybe<Scalars['DateTime']>;
  user: Maybe<User>;
  user_course_service_progresses: Array<UserCourseServiceProgress>;
  user_course_settings: Maybe<UserCourseSetting>;
  user_id: Maybe<Scalars['String']>;
};


export type UserCourseProgressuser_course_service_progressesArgs = {
  cursor?: InputMaybe<UserCourseServiceProgressWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};

export type UserCourseProgressWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
};

export type UserCourseServiceProgress = {
  __typename?: 'UserCourseServiceProgress';
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  progress: Maybe<Array<Maybe<Scalars['Json']>>>;
  service: Maybe<Service>;
  service_id: Maybe<Scalars['String']>;
  timestamp: Maybe<Scalars['DateTime']>;
  updated_at: Maybe<Scalars['DateTime']>;
  user: Maybe<User>;
  user_course_progress: Maybe<UserCourseProgress>;
  user_course_progress_id: Maybe<Scalars['String']>;
  user_id: Maybe<Scalars['String']>;
};

export type UserCourseServiceProgressWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
};

export type UserCourseSetting = {
  __typename?: 'UserCourseSetting';
  country: Maybe<Scalars['String']>;
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']>;
  course_variant: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  language: Maybe<Scalars['String']>;
  marketing: Maybe<Scalars['Boolean']>;
  other: Maybe<Scalars['Json']>;
  research: Maybe<Scalars['Boolean']>;
  updated_at: Maybe<Scalars['DateTime']>;
  user: Maybe<User>;
  user_id: Maybe<Scalars['String']>;
};

export type UserCourseSettingEdge = {
  __typename?: 'UserCourseSettingEdge';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor */
  cursor: Scalars['String'];
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Node */
  node: Maybe<UserCourseSetting>;
};

export type UserCourseSettingWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
};

export type UserCourseSettingsVisibility = {
  __typename?: 'UserCourseSettingsVisibility';
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  language: Scalars['String'];
  updated_at: Maybe<Scalars['DateTime']>;
};

export type UserCourseSettingsVisibilityCreateInput = {
  course?: InputMaybe<Scalars['ID']>;
  language: Scalars['String'];
};

export type UserCourseSettingsVisibilityUpsertInput = {
  course?: InputMaybe<Scalars['ID']>;
  id?: InputMaybe<Scalars['ID']>;
  language: Scalars['String'];
};

export type UserCourseSettingsVisibilityWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
};

export type UserCourseSummary = {
  __typename?: 'UserCourseSummary';
  completion: Maybe<Completion>;
  completions_handled_by_id: Maybe<Scalars['ID']>;
  course: Maybe<Course>;
  course_id: Maybe<Scalars['ID']>;
  exercise_completions: Maybe<Array<Maybe<ExerciseCompletion>>>;
  inherit_settings_from_id: Maybe<Scalars['ID']>;
  user_course_progress: Maybe<UserCourseProgress>;
  user_course_service_progresses: Maybe<Array<Maybe<UserCourseServiceProgress>>>;
  user_id: Maybe<Scalars['ID']>;
};


export type UserCourseSummaryexercise_completionsArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']>;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor */
  cursor: Scalars['String'];
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Node */
  node: Maybe<User>;
};

export type UserOrganization = {
  __typename?: 'UserOrganization';
  created_at: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  organization: Maybe<Organization>;
  organization_id: Maybe<Scalars['String']>;
  role: Maybe<OrganizationRole>;
  updated_at: Maybe<Scalars['DateTime']>;
  user: Maybe<User>;
  user_id: Maybe<Scalars['String']>;
};

export type UserOrganizationWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
};

export type UserWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
  upstream_id?: InputMaybe<Scalars['Int']>;
  username?: InputMaybe<Scalars['String']>;
};

export type VerifiedUser = {
  __typename?: 'VerifiedUser';
  created_at: Maybe<Scalars['DateTime']>;
  display_name: Maybe<Scalars['String']>;
  id: Scalars['String'];
  organization: Maybe<Organization>;
  organization_id: Maybe<Scalars['String']>;
  personal_unique_code: Scalars['String'];
  updated_at: Maybe<Scalars['DateTime']>;
  user: Maybe<User>;
  user_id: Maybe<Scalars['String']>;
};

export type VerifiedUserArg = {
  display_name?: InputMaybe<Scalars['String']>;
  organization_id: Scalars['ID'];
  organization_secret: Scalars['String'];
  personal_unique_code: Scalars['String'];
};

export type VerifiedUserWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']>;
};

export type updateUserNameMutationVariables = Exact<{
  first_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
}>;


export type updateUserNameMutation = { updateUserName: { __typename?: 'User', id: string, first_name: string | null, last_name: string | null } | null };

export type AllCoursesDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllCoursesDetailsQuery = { courses: Array<{ __typename?: 'Course', id: string, slug: string, name: string, teacher_in_charge_name: string, teacher_in_charge_email: string, start_date: string, completion_email: { __typename?: 'EmailTemplate', name: string | null, id: string } | null, course_stats_email: { __typename?: 'EmailTemplate', id: string } | null } | null> | null };

export type AllCompletionsQueryVariables = Exact<{
  course: Scalars['String'];
  cursor?: InputMaybe<Scalars['String']>;
  completionLanguage?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
}>;


export type AllCompletionsQuery = { completionsPaginated: { __typename?: 'QueryCompletionsPaginated_type_Connection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null, endCursor: string | null }, edges: Array<{ __typename?: 'CompletionEdge', node: { __typename?: 'Completion', id: string, email: string, completion_language: string | null, created_at: any | null, user: { __typename?: 'User', id: string, first_name: string | null, last_name: string | null, student_number: string | null } | null, course: { __typename?: 'Course', id: string, name: string } | null, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, organization: { __typename?: 'Organization', id: string, slug: string } | null }> } | null } | null> | null } | null };

export type AllCompletionsPreviousQueryVariables = Exact<{
  course: Scalars['String'];
  cursor?: InputMaybe<Scalars['String']>;
  completionLanguage?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
}>;


export type AllCompletionsPreviousQuery = { completionsPaginated: { __typename?: 'QueryCompletionsPaginated_type_Connection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null, endCursor: string | null }, edges: Array<{ __typename?: 'CompletionEdge', node: { __typename?: 'Completion', id: string, email: string, completion_language: string | null, created_at: any | null, user: { __typename?: 'User', id: string, first_name: string | null, last_name: string | null, student_number: string | null } | null, course: { __typename?: 'Course', id: string, name: string } | null, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, organization: { __typename?: 'Organization', id: string, slug: string } | null }> } | null } | null> | null } | null };

export type UserCourseSettingsQueryVariables = Exact<{
  course_id: Scalars['ID'];
  skip?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
}>;


export type UserCourseSettingsQuery = { userCourseSettings: { __typename?: 'QueryUserCourseSettings_Connection', totalCount: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor: string | null }, edges: Array<{ __typename?: 'UserCourseSettingEdge', node: { __typename?: 'UserCourseSetting', id: string, user: { __typename?: 'User', id: string, first_name: string | null, last_name: string | null, email: string, student_number: string | null, real_student_number: string | null, progress: { __typename?: 'Progress', course: { __typename?: 'Course', name: string, id: string } | null, user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, max_points: number | null, n_points: number | null, progress: Array<any | null> | null, extra: any | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null } | null } | null, user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', progress: Array<any | null> | null, service: { __typename?: 'Service', name: string, id: string } | null } | null> | null } } | null } | null } | null> | null } | null };

export type ExportUserCourseProgessesQueryVariables = Exact<{
  course_slug: Scalars['String'];
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
}>;


export type ExportUserCourseProgessesQuery = { userCourseProgresses: Array<{ __typename?: 'UserCourseProgress', id: string, progress: Array<any | null> | null, user: { __typename?: 'User', id: string, email: string, student_number: string | null, real_student_number: string | null, upstream_id: number, first_name: string | null, last_name: string | null } | null, user_course_settings: { __typename?: 'UserCourseSetting', course_variant: string | null, country: string | null, language: string | null } | null } | null> | null };

export type updateUpdateAccountResearchConsentMutationVariables = Exact<{
  value: Scalars['Boolean'];
}>;


export type updateUpdateAccountResearchConsentMutation = { updateResearchConsent: { __typename?: 'User', id: string } | null };

export type UserPointsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserPointsQuery = { currentUser: { __typename?: 'User', id: string, first_name: string | null, last_name: string | null, email: string, student_number: string | null, progresses: Array<{ __typename?: 'Progress', course: { __typename?: 'Course', name: string, id: string } | null, user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, max_points: number | null, n_points: number | null, progress: Array<any | null> | null, extra: any | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null } | null } | null, user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', progress: Array<any | null> | null, service: { __typename?: 'Service', name: string, id: string } | null } | null> | null }> | null } | null };

export type CompletionCourseFragment = { __typename?: 'Completion', course: { __typename?: 'Course', id: string, slug: string, name: string, has_certificate: boolean | null, photo: { __typename?: 'Image', id: string, uncompressed: string } | null } | null };

export type UserCompletionsFragment = { __typename?: 'User', completions: Array<{ __typename?: 'Completion', id: string, completion_language: string | null, student_number: string | null, created_at: any | null, tier: number | null, eligible_for_ects: boolean | null, completion_date: any | null, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, created_at: any | null, organization: { __typename?: 'Organization', slug: string } | null }>, course: { __typename?: 'Course', id: string, slug: string, name: string, has_certificate: boolean | null, photo: { __typename?: 'Image', id: string, uncompressed: string } | null } | null }> | null };

export type CompletionsRegisteredFragment = { __typename?: 'Completion', completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, created_at: any | null, organization: { __typename?: 'Organization', slug: string } | null }> };

export type CoursePhotoFragment = { __typename?: 'Course', photo: { __typename?: 'Image', id: string, compressed: string | null, uncompressed: string } | null };

export type UserPointsFragmentFragment = { __typename?: 'User', id: string, first_name: string | null, last_name: string | null, email: string, student_number: string | null, progresses: Array<{ __typename?: 'Progress', course: { __typename?: 'Course', name: string, id: string } | null, user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, max_points: number | null, n_points: number | null, progress: Array<any | null> | null, extra: any | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null } | null } | null, user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', progress: Array<any | null> | null, service: { __typename?: 'Service', name: string, id: string } | null } | null> | null }> | null };

export type UserCourseProgressFragment = { __typename?: 'UserCourseProgress', id: string, course_id: string | null, max_points: number | null, n_points: number | null, progress: Array<any | null> | null, extra: any | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null } | null };

export type ProgressUserCourseProgressFragment = { __typename?: 'Progress', user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, max_points: number | null, n_points: number | null, progress: Array<any | null> | null, extra: any | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null } | null } | null };

export type UserCourseSummaryUserCourseProgressFragment = { __typename?: 'UserCourseSummary', user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, max_points: number | null, n_points: number | null, progress: Array<any | null> | null, extra: any | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null } | null } | null };

export type UserCourseServiceProgressFragment = { __typename?: 'UserCourseServiceProgress', progress: Array<any | null> | null, service: { __typename?: 'Service', name: string, id: string } | null };

export type ProgressUserCourseServiceProgressFragment = { __typename?: 'Progress', user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', progress: Array<any | null> | null, service: { __typename?: 'Service', name: string, id: string } | null } | null> | null };

export type UserCourseSummaryUserCourseServiceProgressFragment = { __typename?: 'UserCourseSummary', user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', progress: Array<any | null> | null, service: { __typename?: 'Service', name: string, id: string } | null } | null> | null };

export type UserOrganizationDataFragment = { __typename?: 'UserOrganization', id: string, organization: { __typename?: 'Organization', id: string, slug: string, hidden: boolean | null, organization_translations: Array<{ __typename?: 'OrganizationTranslation', language: string, name: string, information: string | null }> } | null };

export type CreateRegistrationAttemptDateMutationVariables = Exact<{
  id: Scalars['ID'];
  completion_registration_attempt_date: Scalars['DateTime'];
}>;


export type CreateRegistrationAttemptDateMutation = { createRegistrationAttemptDate: { __typename?: 'Completion', id: string, completion_registration_attempt_date: any | null } | null };

export type addCourseMutationVariables = Exact<{
  course: CourseCreateArg;
}>;


export type addCourseMutation = { addCourse: { __typename?: 'Course', id: string, slug: string, ects: string | null, name: string, order: number | null, study_module_order: number | null, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string } | null, course_translations: Array<{ __typename?: 'CourseTranslation', id: string, language: string, name: string, description: string, link: string | null }>, open_university_registration_links: Array<{ __typename?: 'OpenUniversityRegistrationLink', id: string, course_code: string, language: string, link: string | null }>, study_modules: Array<{ __typename?: 'StudyModule', id: string }>, course_variants: Array<{ __typename?: 'CourseVariant', id: string, slug: string, description: string | null }>, course_aliases: Array<{ __typename?: 'CourseAlias', id: string, course_code: string }>, user_course_settings_visibilities: Array<{ __typename?: 'UserCourseSettingsVisibility', id: string, language: string }> } | null };

export type updateCourseMutationVariables = Exact<{
  course: CourseUpsertArg;
}>;


export type updateCourseMutation = { updateCourse: { __typename?: 'Course', id: string, slug: string, ects: string | null, name: string, order: number | null, study_module_order: number | null, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string } | null, course_translations: Array<{ __typename?: 'CourseTranslation', id: string, language: string, name: string, description: string, link: string | null }>, open_university_registration_links: Array<{ __typename?: 'OpenUniversityRegistrationLink', id: string, course_code: string, language: string, link: string | null }>, study_modules: Array<{ __typename?: 'StudyModule', id: string }>, course_variants: Array<{ __typename?: 'CourseVariant', id: string, slug: string, description: string | null }>, course_aliases: Array<{ __typename?: 'CourseAlias', id: string, course_code: string }>, completion_email: { __typename?: 'EmailTemplate', id: string, name: string | null, title: string | null, txt_body: string | null, html_body: string | null } | null, user_course_settings_visibilities: Array<{ __typename?: 'UserCourseSettingsVisibility', id: string, language: string }>, course_stats_email: { __typename?: 'EmailTemplate', id: string, name: string | null, title: string | null, txt_body: string | null, html_body: string | null } | null } | null };

export type deleteCourseMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type deleteCourseMutation = { deleteCourse: { __typename?: 'Course', id: string, slug: string } | null };

export type UpdateEmailTemplateMutationVariables = Exact<{
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  html_body?: InputMaybe<Scalars['String']>;
  txt_body?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  template_type?: InputMaybe<Scalars['String']>;
  triggered_automatically_by_course_id?: InputMaybe<Scalars['String']>;
  exercise_completions_threshold?: InputMaybe<Scalars['Int']>;
  points_threshold?: InputMaybe<Scalars['Int']>;
}>;


export type UpdateEmailTemplateMutation = { updateEmailTemplate: { __typename?: 'EmailTemplate', id: string, name: string | null, html_body: string | null, txt_body: string | null, title: string | null, template_type: string | null, triggered_automatically_by_course_id: string | null, exercise_completions_threshold: number | null, points_threshold: number | null } | null };

export type AddEmailTemplateMutationVariables = Exact<{
  name: Scalars['String'];
  html_body?: InputMaybe<Scalars['String']>;
  txt_body?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  template_type?: InputMaybe<Scalars['String']>;
  triggered_automatically_by_course_id?: InputMaybe<Scalars['String']>;
  exercise_completions_threshold?: InputMaybe<Scalars['Int']>;
  points_threshold?: InputMaybe<Scalars['Int']>;
}>;


export type AddEmailTemplateMutation = { addEmailTemplate: { __typename?: 'EmailTemplate', id: string, name: string | null, html_body: string | null, txt_body: string | null, title: string | null, template_type: string | null, triggered_automatically_by_course_id: string | null, exercise_completions_threshold: number | null, points_threshold: number | null } | null };

export type DeleteEmailTemplateMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteEmailTemplateMutation = { deleteEmailTemplate: { __typename?: 'EmailTemplate', id: string, name: string | null, html_body: string | null, txt_body: string | null, title: string | null } | null };

export type addStudyModuleMutationVariables = Exact<{
  study_module: StudyModuleCreateArg;
}>;


export type addStudyModuleMutation = { addStudyModule: { __typename?: 'StudyModule', id: string, slug: string, name: string, image: string | null, order: number | null, study_module_translations: Array<{ __typename?: 'StudyModuleTranslation', id: string, language: string, name: string, description: string }> } | null };

export type updateStudyModuleMutationVariables = Exact<{
  study_module: StudyModuleUpsertArg;
}>;


export type updateStudyModuleMutation = { updateStudyModule: { __typename?: 'StudyModule', id: string, slug: string, name: string, image: string | null, order: number | null, study_module_translations: Array<{ __typename?: 'StudyModuleTranslation', id: string, language: string, name: string, description: string }> } | null };

export type deleteStudyModuleMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type deleteStudyModuleMutation = { deleteStudyModule: { __typename?: 'StudyModule', id: string, slug: string } | null };

export type AllCoursesQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']>;
}>;


export type AllCoursesQuery = { courses: Array<{ __typename?: 'Course', id: string, slug: string, name: string, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, description: string | null, link: string | null, upcoming_active_link: boolean | null, study_modules: Array<{ __typename?: 'StudyModule', id: string, slug: string }>, course_translations: Array<{ __typename?: 'CourseTranslation', id: string, language: string, name: string }>, user_course_settings_visibilities: Array<{ __typename?: 'UserCourseSettingsVisibility', id: string, language: string }>, photo: { __typename?: 'Image', id: string, compressed: string | null, uncompressed: string } | null } | null> | null };

export type AllEditorCoursesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']>;
  hidden?: InputMaybe<Scalars['Boolean']>;
  handledBy?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Array<CourseStatus> | CourseStatus>;
}>;


export type AllEditorCoursesQuery = { courses: Array<{ __typename?: 'Course', id: string, name: string, slug: string, order: number | null, status: CourseStatus | null, hidden: boolean | null, tier: number | null, instructions: string | null, start_date: string, end_date: string | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, upcoming_active_link: boolean | null, completions_handled_by: { __typename?: 'Course', id: string } | null, course_translations: Array<{ __typename?: 'CourseTranslation', id: string, language: string, name: string }>, course_variants: Array<{ __typename?: 'CourseVariant', id: string, slug: string, description: string | null }>, course_aliases: Array<{ __typename?: 'CourseAlias', id: string, course_code: string }>, user_course_settings_visibilities: Array<{ __typename?: 'UserCourseSettingsVisibility', id: string, language: string }>, photo: { __typename?: 'Image', id: string, compressed: string | null, uncompressed: string } | null } | null> | null, currentUser: { __typename?: 'User', id: string, administrator: boolean } | null };

export type CheckSlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type CheckSlugQuery = { course: { __typename?: 'Course', id: string, slug: string, name: string, description: string | null, instructions: string | null } | null };

export type CourseEditorStudyModulesQueryVariables = Exact<{ [key: string]: never; }>;


export type CourseEditorStudyModulesQuery = { study_modules: Array<{ __typename?: 'StudyModule', id: string, name: string, slug: string } | null> | null };

export type CourseEditorCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type CourseEditorCoursesQuery = { courses: Array<{ __typename?: 'Course', id: string, slug: string, name: string, course_translations: Array<{ __typename?: 'CourseTranslation', id: string, name: string, language: string }>, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string } | null } | null> | null };

export type HandlerCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type HandlerCoursesQuery = { handlerCourses: Array<{ __typename?: 'Course', id: string, slug: string, name: string } | null> | null };

export type CourseDetailsQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
}>;


export type CourseDetailsQuery = { course: { __typename?: 'Course', id: string, name: string, slug: string, ects: string | null, order: number | null, study_module_order: number | null, teacher_in_charge_name: string, teacher_in_charge_email: string, support_email: string | null, start_date: string, end_date: string | null, tier: number | null, promote: boolean | null, start_point: boolean | null, hidden: boolean | null, study_module_start_point: boolean | null, status: CourseStatus | null, has_certificate: boolean | null, upcoming_active_link: boolean | null, automatic_completions: boolean | null, automatic_completions_eligible_for_ects: boolean | null, exercise_completions_needed: number | null, points_needed: number | null, photo: { __typename?: 'Image', id: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string } | null, course_translations: Array<{ __typename?: 'CourseTranslation', id: string, name: string, language: string, description: string, instructions: string | null, link: string | null }>, open_university_registration_links: Array<{ __typename?: 'OpenUniversityRegistrationLink', id: string, course_code: string, language: string, link: string | null }>, study_modules: Array<{ __typename?: 'StudyModule', id: string }>, course_variants: Array<{ __typename?: 'CourseVariant', id: string, slug: string, description: string | null }>, course_aliases: Array<{ __typename?: 'CourseAlias', id: string, course_code: string }>, inherit_settings_from: { __typename?: 'Course', id: string } | null, completions_handled_by: { __typename?: 'Course', id: string } | null, user_course_settings_visibilities: Array<{ __typename?: 'UserCourseSettingsVisibility', id: string, language: string }> } | null };

export type AllEmailTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllEmailTemplatesQuery = { email_templates: Array<{ __typename?: 'EmailTemplate', id: string, name: string | null, txt_body: string | null, html_body: string | null, title: string | null, template_type: string | null, triggered_automatically_by_course_id: string | null, exercise_completions_threshold: number | null, points_threshold: number | null } | null> | null };

export type EmailTemplateQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type EmailTemplateQuery = { email_template: { __typename?: 'EmailTemplate', id: string, created_at: any | null, updated_at: any | null, name: string | null, txt_body: string | null, html_body: string | null, title: string | null, template_type: string | null, triggered_automatically_by_course_id: string | null, exercise_completions_threshold: number | null, points_threshold: number | null } | null };

export type OrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationsQuery = { organizations: Array<{ __typename?: 'Organization', id: string, slug: string, hidden: boolean | null, organization_translations: Array<{ __typename?: 'OrganizationTranslation', language: string, name: string, information: string | null }> } | null> | null };

export type CurrentUserOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserOrganizationsQuery = { currentUser: { __typename?: 'User', user_organizations: Array<{ __typename?: 'UserOrganization', id: string, organization: { __typename?: 'Organization', id: string, slug: string, hidden: boolean | null, organization_translations: Array<{ __typename?: 'OrganizationTranslation', language: string, name: string, information: string | null }> } | null }> } | null };

export type OrganizationByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrganizationByIdQuery = { organization: { __typename?: 'Organization', hidden: boolean | null, organization_translations: Array<{ __typename?: 'OrganizationTranslation', name: string }> } | null };

export type AllModulesQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']>;
}>;


export type AllModulesQuery = { study_modules: Array<{ __typename?: 'StudyModule', id: string, slug: string, name: string, description: string | null, image: string | null, order: number | null } | null> | null };

export type AllEditorModulesWithTranslationsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllEditorModulesWithTranslationsQuery = { study_modules: Array<{ __typename?: 'StudyModule', id: string, slug: string, name: string, image: string | null, order: number | null, study_module_translations: Array<{ __typename?: 'StudyModuleTranslation', id: string, language: string, name: string, description: string }> } | null> | null };

export type checkModuleSlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type checkModuleSlugQuery = { study_module_exists: boolean | null };

export type UserSummaryQueryVariables = Exact<{
  upstream_id?: InputMaybe<Scalars['Int']>;
}>;


export type UserSummaryQuery = { user: { __typename?: 'User', id: string, username: string, user_course_summary: Array<{ __typename?: 'UserCourseSummary', course: { __typename?: 'Course', id: string, name: string, slug: string, has_certificate: boolean | null, photo: { __typename?: 'Image', id: string, uncompressed: string } | null, exercises: Array<{ __typename?: 'Exercise', id: string, name: string | null, custom_id: string, course_id: string | null, part: number | null, section: number | null, max_points: number | null, deleted: boolean | null } | null> | null } | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', id: string, exercise_id: string | null, created_at: any | null, updated_at: any | null, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, value: string }> } | null> | null, completion: { __typename?: 'Completion', id: string, course_id: string | null, created_at: any | null, updated_at: any | null, tier: number | null, grade: string | null, project_completion: boolean | null, completion_language: string | null, completion_date: any | null, registered: boolean | null, eligible_for_ects: boolean | null, student_number: string | null, email: string, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, created_at: any | null, organization: { __typename?: 'Organization', slug: string } | null }> } | null, user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, max_points: number | null, n_points: number | null, progress: Array<any | null> | null, extra: any | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null } | null } | null, user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', progress: Array<any | null> | null, service: { __typename?: 'Service', name: string, id: string } | null } | null> | null } | null> | null } | null };

export type CurrentUserUserOverViewQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserUserOverViewQuery = { currentUser: { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, email: string, research_consent: boolean | null, completions: Array<{ __typename?: 'Completion', id: string, completion_language: string | null, student_number: string | null, created_at: any | null, tier: number | null, eligible_for_ects: boolean | null, completion_date: any | null, registered: boolean | null, course: { __typename?: 'Course', id: string, slug: string, name: string, has_certificate: boolean | null, photo: { __typename?: 'Image', id: string, uncompressed: string } | null } | null, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, created_at: any | null, organization: { __typename?: 'Organization', slug: string } | null }> }> | null } | null };

export type UserOverViewQueryVariables = Exact<{ [key: string]: never; }>;


export type UserOverViewQuery = { currentUser: { __typename?: 'User', id: string, first_name: string | null, last_name: string | null, email: string } | null };

export type ConnectedUserQueryVariables = Exact<{ [key: string]: never; }>;


export type ConnectedUserQuery = { currentUser: { __typename?: 'User', id: string, upstream_id: number, verified_users: Array<{ __typename?: 'VerifiedUser', id: string, created_at: any | null, updated_at: any | null, display_name: string | null, organization: { __typename?: 'Organization', id: string, organization_translations: Array<{ __typename?: 'OrganizationTranslation', language: string, name: string }> } | null }> } | null };

export type ConnectionTestQueryVariables = Exact<{ [key: string]: never; }>;


export type ConnectionTestQuery = { currentUser: { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, student_number: string | null, email: string, verified_users: Array<{ __typename?: 'VerifiedUser', id: string, created_at: any | null, personal_unique_code: string, display_name: string | null, organization: { __typename?: 'Organization', slug: string, organization_translations: Array<{ __typename?: 'OrganizationTranslation', language: string, name: string }> } | null }> } | null };

export type CompletionCourseDetailsQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
}>;


export type CompletionCourseDetailsQuery = { course: { __typename?: 'Course', id: string, name: string } | null };

export type CourseDetailsFromSlugQueryQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
}>;


export type CourseDetailsFromSlugQueryQuery = { course: { __typename?: 'Course', id: string, slug: string, name: string, teacher_in_charge_name: string, teacher_in_charge_email: string, start_date: string, completion_email: { __typename?: 'EmailTemplate', name: string | null, id: string } | null, course_stats_email: { __typename?: 'EmailTemplate', id: string, name: string | null } | null } | null };

export type UserCourseStatsSubscriptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserCourseStatsSubscriptionsQuery = { currentUser: { __typename?: 'User', id: string, course_stats_subscriptions: Array<{ __typename?: 'CourseStatsSubscription', id: string, email_template: { __typename?: 'EmailTemplate', id: string } | null }> } | null };

export type UserCourseStatsSubscribeMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserCourseStatsSubscribeMutation = { createCourseStatsSubscription: { __typename?: 'CourseStatsSubscription', id: string } | null };

export type UserCourseStatsUnsubscribeMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserCourseStatsUnsubscribeMutation = { deleteCourseStatsSubscription: { __typename?: 'CourseStatsSubscription', id: string } | null };

export type RecheckCompletionMutationMutationVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
}>;


export type RecheckCompletionMutationMutation = { recheckCompletions: string | null };

export type AddManualCompletionMutationVariables = Exact<{
  course_id: Scalars['String'];
  completions?: InputMaybe<Array<ManualCompletionArg> | ManualCompletionArg>;
}>;


export type AddManualCompletionMutation = { addManualCompletion: Array<{ __typename?: 'Completion', id: string, created_at: any | null, updated_at: any | null, completion_language: string | null, grade: string | null, user: { __typename?: 'User', upstream_id: number, username: string, email: string } | null } | null> | null };

export type CourseIdBySluqQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
}>;


export type CourseIdBySluqQuery = { course: { __typename?: 'Course', id: string } | null };

export type CourseDetailsFromSlugQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
}>;


export type CourseDetailsFromSlugQuery = { course: { __typename?: 'Course', id: string, name: string } | null };

export type RegisterCompletionUserOverViewQueryVariables = Exact<{ [key: string]: never; }>;


export type RegisterCompletionUserOverViewQuery = { currentUser: { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, completions: Array<{ __typename?: 'Completion', id: string, email: string, completion_language: string | null, completion_link: string | null, student_number: string | null, created_at: any | null, eligible_for_ects: boolean | null, course: { __typename?: 'Course', id: string, slug: string, name: string, ects: string | null } | null, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, completion_id: string | null, organization: { __typename?: 'Organization', slug: string } | null }> }> | null } | null };

export type UserOrganizationsQueryVariables = Exact<{
  user_id?: InputMaybe<Scalars['ID']>;
}>;


export type UserOrganizationsQuery = { userOrganizations: Array<{ __typename?: 'UserOrganization', id: string, organization: { __typename?: 'Organization', id: string } | null } | null> | null };

export type addUserOrganizationMutationVariables = Exact<{
  user_id: Scalars['ID'];
  organization_id: Scalars['ID'];
}>;


export type addUserOrganizationMutation = { addUserOrganization: { __typename?: 'UserOrganization', id: string } | null };

export type updateUserOrganizationMutationVariables = Exact<{
  id: Scalars['ID'];
  role?: InputMaybe<OrganizationRole>;
}>;


export type updateUserOrganizationMutation = { updateUserOrganization: { __typename?: 'UserOrganization', id: string } | null };

export type deleteUserOrganizationMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type deleteUserOrganizationMutation = { deleteUserOrganization: { __typename?: 'UserOrganization', id: string } | null };

export type consentQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type consentQueryQuery = { currentUser: { __typename?: 'User', id: string, research_consent: boolean | null } | null };

export type updateCreateAccountResearchConsentMutationVariables = Exact<{
  value: Scalars['Boolean'];
}>;


export type updateCreateAccountResearchConsentMutation = { updateResearchConsent: { __typename?: 'User', id: string } | null };

export type StudyModuleDetailsQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type StudyModuleDetailsQuery = { study_module: { __typename?: 'StudyModule', id: string, slug: string, name: string, image: string | null, order: number | null, courses: Array<{ __typename?: 'Course', id: string, name: string, slug: string } | null> | null, study_module_translations: Array<{ __typename?: 'StudyModuleTranslation', id: string, name: string, language: string, description: string }> } | null };

export type UserCourseSettingsForUserPageQueryVariables = Exact<{
  upstream_id?: InputMaybe<Scalars['Int']>;
}>;


export type UserCourseSettingsForUserPageQuery = { userCourseSettings: { __typename?: 'QueryUserCourseSettings_Connection', edges: Array<{ __typename?: 'UserCourseSettingEdge', node: { __typename?: 'UserCourseSetting', id: string, language: string | null, country: string | null, research: boolean | null, marketing: boolean | null, course_variant: string | null, other: any | null, course: { __typename?: 'Course', name: string } | null } | null } | null> | null, pageInfo: { __typename?: 'PageInfo', endCursor: string | null, hasNextPage: boolean } } | null };

export type ShowUserUserOverViewQueryVariables = Exact<{
  upstream_id?: InputMaybe<Scalars['Int']>;
}>;


export type ShowUserUserOverViewQuery = { user: { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, email: string, completions: Array<{ __typename?: 'Completion', id: string, completion_language: string | null, student_number: string | null, created_at: any | null, tier: number | null, eligible_for_ects: boolean | null, completion_date: any | null, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, created_at: any | null, organization: { __typename?: 'Organization', slug: string } | null }>, course: { __typename?: 'Course', id: string, slug: string, name: string, has_certificate: boolean | null, photo: { __typename?: 'Image', id: string, uncompressed: string } | null } | null }> | null } | null };

export type UserDetailsContainsQueryVariables = Exact<{
  search: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type UserDetailsContainsQuery = { userDetailsContains: { __typename?: 'QueryUserDetailsContains_Connection', count: number | null, pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean }, edges: Array<{ __typename?: 'UserEdge', node: { __typename?: 'User', id: string, email: string, student_number: string | null, real_student_number: string | null, upstream_id: number, first_name: string | null, last_name: string | null } | null } | null> | null } | null };

export const CompletionCourseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CompletionCourse"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Completion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uncompressed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"has_certificate"}}]}}]}}]} as unknown as DocumentNode<CompletionCourseFragment, unknown>;
export const UserCompletionsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCompletions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"completion_language"}},{"kind":"Field","name":{"kind":"Name","value":"student_number"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"eligible_for_ects"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CompletionCourse"}},{"kind":"Field","name":{"kind":"Name","value":"completions_registered"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}},...CompletionCourseFragmentDoc.definitions]} as unknown as DocumentNode<UserCompletionsFragment, unknown>;
export const CompletionsRegisteredFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CompletionsRegistered"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Completion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completions_registered"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]} as unknown as DocumentNode<CompletionsRegisteredFragment, unknown>;
export const CoursePhotoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoursePhoto"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Course"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"photo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"compressed"}},{"kind":"Field","name":{"kind":"Name","value":"uncompressed"}}]}}]}}]} as unknown as DocumentNode<CoursePhotoFragment, unknown>;
export const UserCourseProgressFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCourseProgress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserCourseProgress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"course_id"}},{"kind":"Field","name":{"kind":"Name","value":"max_points"}},{"kind":"Field","name":{"kind":"Name","value":"n_points"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"extra"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_progress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"exercises"}}]}}]}}]} as unknown as DocumentNode<UserCourseProgressFragment, unknown>;
export const ProgressUserCourseProgressFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgressUserCourseProgress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Progress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_course_progress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCourseProgress"}}]}}]}},...UserCourseProgressFragmentDoc.definitions]} as unknown as DocumentNode<ProgressUserCourseProgressFragment, unknown>;
export const UserCourseServiceProgressFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCourseServiceProgress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserCourseServiceProgress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UserCourseServiceProgressFragment, unknown>;
export const ProgressUserCourseServiceProgressFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgressUserCourseServiceProgress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Progress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_course_service_progresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCourseServiceProgress"}}]}}]}},...UserCourseServiceProgressFragmentDoc.definitions]} as unknown as DocumentNode<ProgressUserCourseServiceProgressFragment, unknown>;
export const UserPointsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPointsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"student_number"}},{"kind":"Field","name":{"kind":"Name","value":"progresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgressUserCourseProgress"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgressUserCourseServiceProgress"}}]}}]}},...ProgressUserCourseProgressFragmentDoc.definitions,...ProgressUserCourseServiceProgressFragmentDoc.definitions]} as unknown as DocumentNode<UserPointsFragmentFragment, unknown>;
export const UserCourseSummaryUserCourseProgressFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCourseSummaryUserCourseProgress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserCourseSummary"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_course_progress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCourseProgress"}}]}}]}},...UserCourseProgressFragmentDoc.definitions]} as unknown as DocumentNode<UserCourseSummaryUserCourseProgressFragment, unknown>;
export const UserCourseSummaryUserCourseServiceProgressFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCourseSummaryUserCourseServiceProgress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserCourseSummary"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_course_service_progresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCourseServiceProgress"}}]}}]}},...UserCourseServiceProgressFragmentDoc.definitions]} as unknown as DocumentNode<UserCourseSummaryUserCourseServiceProgressFragment, unknown>;
export const UserOrganizationDataFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserOrganizationData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserOrganization"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"organization_translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"information"}}]}}]}}]}}]} as unknown as DocumentNode<UserOrganizationDataFragment, unknown>;
export const updateUserNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUserName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first_name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last_name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"last_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last_name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}}]}}]}}]} as unknown as DocumentNode<updateUserNameMutation, updateUserNameMutationVariables>;
export const AllCoursesDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllCoursesDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"teacher_in_charge_name"}},{"kind":"Field","name":{"kind":"Name","value":"teacher_in_charge_email"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"completion_email"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"course_stats_email"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<AllCoursesDetailsQuery, AllCoursesDetailsQueryVariables>;
export const AllCompletionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllCompletions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"completionLanguage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completionsPaginated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"completion_language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"completionLanguage"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"50"}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"completion_language"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"student_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"completions_registered"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllCompletionsQuery, AllCompletionsQueryVariables>;
export const AllCompletionsPreviousDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllCompletionsPrevious"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"completionLanguage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completionsPaginated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"completion_language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"completionLanguage"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"IntValue","value":"50"}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"completion_language"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"student_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"completions_registered"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllCompletionsPreviousQuery, AllCompletionsPreviousQueryVariables>;
export const UserCourseSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserCourseSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userCourseSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"15"}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"student_number"}},{"kind":"Field","name":{"kind":"Name","value":"real_student_number"}},{"kind":"Field","name":{"kind":"Name","value":"progress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgressUserCourseProgress"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgressUserCourseServiceProgress"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},...ProgressUserCourseProgressFragmentDoc.definitions,...ProgressUserCourseServiceProgressFragmentDoc.definitions]} as unknown as DocumentNode<UserCourseSettingsQuery, UserCourseSettingsQueryVariables>;
export const ExportUserCourseProgessesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ExportUserCourseProgesses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course_slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userCourseProgresses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course_slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course_slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"student_number"}},{"kind":"Field","name":{"kind":"Name","value":"real_student_number"}},{"kind":"Field","name":{"kind":"Name","value":"upstream_id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"user_course_settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course_variant"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}}]}}]}}]} as unknown as DocumentNode<ExportUserCourseProgessesQuery, ExportUserCourseProgessesQueryVariables>;
export const updateUpdateAccountResearchConsentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUpdateAccountResearchConsent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateResearchConsent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<updateUpdateAccountResearchConsentMutation, updateUpdateAccountResearchConsentMutationVariables>;
export const UserPointsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserPoints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPointsFragment"}}]}}]}},...UserPointsFragmentFragmentDoc.definitions]} as unknown as DocumentNode<UserPointsQuery, UserPointsQueryVariables>;
export const CreateRegistrationAttemptDateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRegistrationAttemptDate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"completion_registration_attempt_date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRegistrationAttemptDate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"completion_registration_attempt_date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"completion_registration_attempt_date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"completion_registration_attempt_date"}}]}}]}}]} as unknown as DocumentNode<CreateRegistrationAttemptDateMutation, CreateRegistrationAttemptDateMutationVariables>;
export const addCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CourseCreateArg"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"ects"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"study_module_order"}},{"kind":"Field","name":{"kind":"Name","value":"photo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"original_mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"compressed"}},{"kind":"Field","name":{"kind":"Name","value":"compressed_mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"uncompressed"}},{"kind":"Field","name":{"kind":"Name","value":"uncompressed_mimetype"}}]}},{"kind":"Field","name":{"kind":"Name","value":"course_translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}}]}},{"kind":"Field","name":{"kind":"Name","value":"open_university_registration_links"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"course_code"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"link"}}]}},{"kind":"Field","name":{"kind":"Name","value":"study_modules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"course_variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"course_aliases"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"course_code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_course_settings_visibilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}}]}}]}}]} as unknown as DocumentNode<addCourseMutation, addCourseMutationVariables>;
export const updateCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CourseUpsertArg"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"ects"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"study_module_order"}},{"kind":"Field","name":{"kind":"Name","value":"photo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"original_mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"compressed"}},{"kind":"Field","name":{"kind":"Name","value":"compressed_mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"uncompressed"}},{"kind":"Field","name":{"kind":"Name","value":"uncompressed_mimetype"}}]}},{"kind":"Field","name":{"kind":"Name","value":"course_translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}}]}},{"kind":"Field","name":{"kind":"Name","value":"open_university_registration_links"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"course_code"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"link"}}]}},{"kind":"Field","name":{"kind":"Name","value":"study_modules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"course_variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"course_aliases"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"course_code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"completion_email"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"txt_body"}},{"kind":"Field","name":{"kind":"Name","value":"html_body"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_course_settings_visibilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}},{"kind":"Field","name":{"kind":"Name","value":"course_stats_email"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"txt_body"}},{"kind":"Field","name":{"kind":"Name","value":"html_body"}}]}}]}}]}}]} as unknown as DocumentNode<updateCourseMutation, updateCourseMutationVariables>;
export const deleteCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<deleteCourseMutation, deleteCourseMutationVariables>;
export const UpdateEmailTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEmailTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"html_body"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"txt_body"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"template_type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"triggered_automatically_by_course_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"exercise_completions_threshold"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"points_threshold"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEmailTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"html_body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"html_body"}}},{"kind":"Argument","name":{"kind":"Name","value":"txt_body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"txt_body"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"template_type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"template_type"}}},{"kind":"Argument","name":{"kind":"Name","value":"triggered_automatically_by_course_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"triggered_automatically_by_course_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"exercise_completions_threshold"},"value":{"kind":"Variable","name":{"kind":"Name","value":"exercise_completions_threshold"}}},{"kind":"Argument","name":{"kind":"Name","value":"points_threshold"},"value":{"kind":"Variable","name":{"kind":"Name","value":"points_threshold"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"html_body"}},{"kind":"Field","name":{"kind":"Name","value":"txt_body"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"template_type"}},{"kind":"Field","name":{"kind":"Name","value":"triggered_automatically_by_course_id"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_completions_threshold"}},{"kind":"Field","name":{"kind":"Name","value":"points_threshold"}}]}}]}}]} as unknown as DocumentNode<UpdateEmailTemplateMutation, UpdateEmailTemplateMutationVariables>;
export const AddEmailTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddEmailTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"html_body"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"txt_body"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"template_type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"triggered_automatically_by_course_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"exercise_completions_threshold"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"points_threshold"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addEmailTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"html_body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"html_body"}}},{"kind":"Argument","name":{"kind":"Name","value":"txt_body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"txt_body"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"template_type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"template_type"}}},{"kind":"Argument","name":{"kind":"Name","value":"triggered_automatically_by_course_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"triggered_automatically_by_course_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"exercise_completions_threshold"},"value":{"kind":"Variable","name":{"kind":"Name","value":"exercise_completions_threshold"}}},{"kind":"Argument","name":{"kind":"Name","value":"points_threshold"},"value":{"kind":"Variable","name":{"kind":"Name","value":"points_threshold"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"html_body"}},{"kind":"Field","name":{"kind":"Name","value":"txt_body"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"template_type"}},{"kind":"Field","name":{"kind":"Name","value":"triggered_automatically_by_course_id"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_completions_threshold"}},{"kind":"Field","name":{"kind":"Name","value":"points_threshold"}}]}}]}}]} as unknown as DocumentNode<AddEmailTemplateMutation, AddEmailTemplateMutationVariables>;
export const DeleteEmailTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteEmailTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteEmailTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"html_body"}},{"kind":"Field","name":{"kind":"Name","value":"txt_body"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<DeleteEmailTemplateMutation, DeleteEmailTemplateMutationVariables>;
export const addStudyModuleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addStudyModule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"study_module"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudyModuleCreateArg"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addStudyModule"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"study_module"},"value":{"kind":"Variable","name":{"kind":"Name","value":"study_module"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"study_module_translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<addStudyModuleMutation, addStudyModuleMutationVariables>;
export const updateStudyModuleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateStudyModule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"study_module"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudyModuleUpsertArg"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStudyModule"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"study_module"},"value":{"kind":"Variable","name":{"kind":"Name","value":"study_module"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"study_module_translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<updateStudyModuleMutation, updateStudyModuleMutationVariables>;
export const deleteStudyModuleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteStudyModule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteStudyModule"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<deleteStudyModuleMutation, deleteStudyModuleMutationVariables>;
export const AllCoursesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllCourses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"language"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"order"},"value":{"kind":"EnumValue","value":"asc"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"language"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"study_module_order"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoursePhoto"}},{"kind":"Field","name":{"kind":"Name","value":"promote"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"start_point"}},{"kind":"Field","name":{"kind":"Name","value":"study_module_start_point"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"upcoming_active_link"}},{"kind":"Field","name":{"kind":"Name","value":"study_modules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"course_translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_course_settings_visibilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}}]}}]}},...CoursePhotoFragmentDoc.definitions]} as unknown as DocumentNode<AllCoursesQuery, AllCoursesQueryVariables>;
export const AllEditorCoursesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllEditorCourses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hidden"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"handledBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CourseStatus"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"asc"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"hidden"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hidden"}}},{"kind":"Argument","name":{"kind":"Name","value":"handledBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"handledBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"instructions"}},{"kind":"Field","name":{"kind":"Name","value":"completions_handled_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"support_email"}},{"kind":"Field","name":{"kind":"Name","value":"teacher_in_charge_email"}},{"kind":"Field","name":{"kind":"Name","value":"teacher_in_charge_name"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoursePhoto"}},{"kind":"Field","name":{"kind":"Name","value":"course_translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"course_variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"course_aliases"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"course_code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_course_settings_visibilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}},{"kind":"Field","name":{"kind":"Name","value":"upcoming_active_link"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}}]}}]}},...CoursePhotoFragmentDoc.definitions]} as unknown as DocumentNode<AllEditorCoursesQuery, AllEditorCoursesQueryVariables>;
export const CheckSlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckSlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"instructions"}}]}}]}}]} as unknown as DocumentNode<CheckSlugQuery, CheckSlugQueryVariables>;
export const CourseEditorStudyModulesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CourseEditorStudyModules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"study_modules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<CourseEditorStudyModulesQuery, CourseEditorStudyModulesQueryVariables>;
export const CourseEditorCoursesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CourseEditorCourses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"course_translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}},{"kind":"Field","name":{"kind":"Name","value":"photo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"original_mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"compressed"}},{"kind":"Field","name":{"kind":"Name","value":"compressed_mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"uncompressed"}},{"kind":"Field","name":{"kind":"Name","value":"uncompressed_mimetype"}}]}}]}}]}}]} as unknown as DocumentNode<CourseEditorCoursesQuery, CourseEditorCoursesQueryVariables>;
export const HandlerCoursesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HandlerCourses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"handlerCourses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<HandlerCoursesQuery, HandlerCoursesQueryVariables>;
export const CourseDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CourseDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"ects"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"study_module_order"}},{"kind":"Field","name":{"kind":"Name","value":"teacher_in_charge_name"}},{"kind":"Field","name":{"kind":"Name","value":"teacher_in_charge_email"}},{"kind":"Field","name":{"kind":"Name","value":"support_email"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"photo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"compressed"}},{"kind":"Field","name":{"kind":"Name","value":"compressed_mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"uncompressed"}},{"kind":"Field","name":{"kind":"Name","value":"uncompressed_mimetype"}}]}},{"kind":"Field","name":{"kind":"Name","value":"promote"}},{"kind":"Field","name":{"kind":"Name","value":"start_point"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"study_module_start_point"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"course_translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"instructions"}},{"kind":"Field","name":{"kind":"Name","value":"link"}}]}},{"kind":"Field","name":{"kind":"Name","value":"open_university_registration_links"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"course_code"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"link"}}]}},{"kind":"Field","name":{"kind":"Name","value":"study_modules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"course_variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"course_aliases"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"course_code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inherit_settings_from"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"completions_handled_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"has_certificate"}},{"kind":"Field","name":{"kind":"Name","value":"user_course_settings_visibilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}},{"kind":"Field","name":{"kind":"Name","value":"upcoming_active_link"}},{"kind":"Field","name":{"kind":"Name","value":"automatic_completions"}},{"kind":"Field","name":{"kind":"Name","value":"automatic_completions_eligible_for_ects"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_completions_needed"}},{"kind":"Field","name":{"kind":"Name","value":"points_needed"}}]}}]}}]} as unknown as DocumentNode<CourseDetailsQuery, CourseDetailsQueryVariables>;
export const AllEmailTemplatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllEmailTemplates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email_templates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"txt_body"}},{"kind":"Field","name":{"kind":"Name","value":"html_body"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"template_type"}},{"kind":"Field","name":{"kind":"Name","value":"triggered_automatically_by_course_id"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_completions_threshold"}},{"kind":"Field","name":{"kind":"Name","value":"points_threshold"}}]}}]}}]} as unknown as DocumentNode<AllEmailTemplatesQuery, AllEmailTemplatesQueryVariables>;
export const EmailTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EmailTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email_template"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"txt_body"}},{"kind":"Field","name":{"kind":"Name","value":"html_body"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"template_type"}},{"kind":"Field","name":{"kind":"Name","value":"triggered_automatically_by_course_id"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_completions_threshold"}},{"kind":"Field","name":{"kind":"Name","value":"points_threshold"}}]}}]}}]} as unknown as DocumentNode<EmailTemplateQuery, EmailTemplateQueryVariables>;
export const OrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"organization_translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"information"}}]}}]}}]}}]} as unknown as DocumentNode<OrganizationsQuery, OrganizationsQueryVariables>;
export const CurrentUserOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUserOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserOrganizationData"}}]}}]}}]}},...UserOrganizationDataFragmentDoc.definitions]} as unknown as DocumentNode<CurrentUserOrganizationsQuery, CurrentUserOrganizationsQueryVariables>;
export const OrganizationByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"organization_translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<OrganizationByIdQuery, OrganizationByIdQueryVariables>;
export const AllModulesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllModules"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"language"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"study_modules"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"EnumValue","value":"asc"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"language"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}}]}}]} as unknown as DocumentNode<AllModulesQuery, AllModulesQueryVariables>;
export const AllEditorModulesWithTranslationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllEditorModulesWithTranslations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"study_modules"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"study_module_translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<AllEditorModulesWithTranslationsQuery, AllEditorModulesWithTranslationsQueryVariables>;
export const checkModuleSlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"checkModuleSlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"study_module_exists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}]}}]} as unknown as DocumentNode<checkModuleSlugQuery, checkModuleSlugQueryVariables>;
export const UserSummaryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserSummary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"upstream_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"upstream_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"upstream_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"user_course_summary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"has_certificate"}},{"kind":"Field","name":{"kind":"Name","value":"photo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uncompressed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"exercises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"custom_id"}},{"kind":"Field","name":{"kind":"Name","value":"course_id"}},{"kind":"Field","name":{"kind":"Name","value":"part"}},{"kind":"Field","name":{"kind":"Name","value":"section"}},{"kind":"Field","name":{"kind":"Name","value":"max_points"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"exercise_completions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"attempted"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"n_points"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_completion_required_actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCourseSummaryUserCourseProgress"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCourseSummaryUserCourseServiceProgress"}},{"kind":"Field","name":{"kind":"Name","value":"completion"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"course_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"project_completion"}},{"kind":"Field","name":{"kind":"Name","value":"completion_language"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"registered"}},{"kind":"Field","name":{"kind":"Name","value":"eligible_for_ects"}},{"kind":"Field","name":{"kind":"Name","value":"student_number"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CompletionsRegistered"}}]}}]}}]}}]}},...UserCourseSummaryUserCourseProgressFragmentDoc.definitions,...UserCourseSummaryUserCourseServiceProgressFragmentDoc.definitions,...CompletionsRegisteredFragmentDoc.definitions]} as unknown as DocumentNode<UserSummaryQuery, UserSummaryQueryVariables>;
export const CurrentUserUserOverViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUserUserOverView"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"upstream_id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"completions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"completion_language"}},{"kind":"Field","name":{"kind":"Name","value":"student_number"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"eligible_for_ects"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"registered"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CompletionCourse"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CompletionsRegistered"}}]}},{"kind":"Field","name":{"kind":"Name","value":"research_consent"}}]}}]}},...CompletionCourseFragmentDoc.definitions,...CompletionsRegisteredFragmentDoc.definitions]} as unknown as DocumentNode<CurrentUserUserOverViewQuery, CurrentUserUserOverViewQueryVariables>;
export const UserOverViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserOverView"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<UserOverViewQuery, UserOverViewQueryVariables>;
export const ConnectedUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ConnectedUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"upstream_id"}},{"kind":"Field","name":{"kind":"Name","value":"verified_users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organization_translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ConnectedUserQuery, ConnectedUserQueryVariables>;
export const ConnectionTestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ConnectionTest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"upstream_id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"student_number"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"verified_users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"organization_translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"personal_unique_code"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}}]}}]}}]} as unknown as DocumentNode<ConnectionTestQuery, ConnectionTestQueryVariables>;
export const CompletionCourseDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CompletionCourseDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CompletionCourseDetailsQuery, CompletionCourseDetailsQueryVariables>;
export const CourseDetailsFromSlugQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CourseDetailsFromSlugQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"teacher_in_charge_name"}},{"kind":"Field","name":{"kind":"Name","value":"teacher_in_charge_email"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"completion_email"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"course_stats_email"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CourseDetailsFromSlugQueryQuery, CourseDetailsFromSlugQueryQueryVariables>;
export const UserCourseStatsSubscriptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserCourseStatsSubscriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"course_stats_subscriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email_template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UserCourseStatsSubscriptionsQuery, UserCourseStatsSubscriptionsQueryVariables>;
export const UserCourseStatsSubscribeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserCourseStatsSubscribe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCourseStatsSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UserCourseStatsSubscribeMutation, UserCourseStatsSubscribeMutationVariables>;
export const UserCourseStatsUnsubscribeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserCourseStatsUnsubscribe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCourseStatsSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UserCourseStatsUnsubscribeMutation, UserCourseStatsUnsubscribeMutationVariables>;
export const RecheckCompletionMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RecheckCompletionMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recheckCompletions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}]}}]} as unknown as DocumentNode<RecheckCompletionMutationMutation, RecheckCompletionMutationMutationVariables>;
export const AddManualCompletionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddManualCompletion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"completions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ManualCompletionArg"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addManualCompletion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"completions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"completions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"completion_language"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upstream_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<AddManualCompletionMutation, AddManualCompletionMutationVariables>;
export const CourseIdBySluqDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CourseIdBySluq"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CourseIdBySluqQuery, CourseIdBySluqQueryVariables>;
export const CourseDetailsFromSlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CourseDetailsFromSlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CourseDetailsFromSlugQuery, CourseDetailsFromSlugQueryVariables>;
export const RegisterCompletionUserOverViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RegisterCompletionUserOverView"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"upstream_id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"completions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"completion_language"}},{"kind":"Field","name":{"kind":"Name","value":"completion_link"}},{"kind":"Field","name":{"kind":"Name","value":"student_number"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ects"}}]}},{"kind":"Field","name":{"kind":"Name","value":"completions_registered"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"completion_id"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"eligible_for_ects"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterCompletionUserOverViewQuery, RegisterCompletionUserOverViewQueryVariables>;
export const UserOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserOrganizations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userOrganizations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UserOrganizationsQuery, UserOrganizationsQueryVariables>;
export const addUserOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addUserOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organization_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addUserOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"organization_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organization_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<addUserOrganizationMutation, addUserOrganizationMutationVariables>;
export const updateUserOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUserOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationRole"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"role"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<updateUserOrganizationMutation, updateUserOrganizationMutationVariables>;
export const deleteUserOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteUserOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUserOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<deleteUserOrganizationMutation, deleteUserOrganizationMutationVariables>;
export const consentQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"consentQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"research_consent"}}]}}]}}]} as unknown as DocumentNode<consentQueryQuery, consentQueryQueryVariables>;
export const updateCreateAccountResearchConsentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCreateAccountResearchConsent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateResearchConsent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<updateCreateAccountResearchConsentMutation, updateCreateAccountResearchConsentMutationVariables>;
export const StudyModuleDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudyModuleDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"study_module"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"study_module_translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<StudyModuleDetailsQuery, StudyModuleDetailsQueryVariables>;
export const UserCourseSettingsForUserPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserCourseSettingsForUserPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"upstream_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userCourseSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user_upstream_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"upstream_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"research"}},{"kind":"Field","name":{"kind":"Name","value":"marketing"}},{"kind":"Field","name":{"kind":"Name","value":"course_variant"}},{"kind":"Field","name":{"kind":"Name","value":"other"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]}}]} as unknown as DocumentNode<UserCourseSettingsForUserPageQuery, UserCourseSettingsForUserPageQueryVariables>;
export const ShowUserUserOverViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ShowUserUserOverView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"upstream_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"upstream_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"upstream_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"upstream_id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCompletions"}}]}}]}},...UserCompletionsFragmentDoc.definitions]} as unknown as DocumentNode<ShowUserUserOverViewQuery, ShowUserUserOverViewQueryVariables>;
export const UserDetailsContainsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserDetailsContains"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userDetailsContains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"student_number"}},{"kind":"Field","name":{"kind":"Name","value":"real_student_number"}},{"kind":"Field","name":{"kind":"Name","value":"upstream_id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"count"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}]}]}}]}}]} as unknown as DocumentNode<UserDetailsContainsQuery, UserDetailsContainsQueryVariables>;