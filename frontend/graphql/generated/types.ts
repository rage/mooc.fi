/* eslint-disable */
/**
 * This is an automatically generated file.
 * Run `npm run graphql-codegen` to regenerate.
 **/
import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
// Generated on 2023-08-30T10:42:08+03:00

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
  /** An arbitrary-precision Decimal type */
  Decimal: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any; }
  Json: { input: any; output: any; }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any; }
};

export type AbEnrollment = {
  __typename?: 'AbEnrollment';
  ab_study: AbStudy;
  ab_study_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  group: Maybe<Scalars['Int']['output']>;
  id: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  user: Maybe<User>;
  user_id: Maybe<Scalars['String']['output']>;
};

export type AbEnrollmentCreateOrUpsertInput = {
  ab_study_id: Scalars['ID']['input'];
  group: Scalars['Int']['input'];
  user_id: Scalars['ID']['input'];
};

export type AbEnrollmentListRelationFilter = {
  every?: InputMaybe<AbEnrollmentWhereInput>;
  none?: InputMaybe<AbEnrollmentWhereInput>;
  some?: InputMaybe<AbEnrollmentWhereInput>;
};

export type AbEnrollmentOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type AbEnrollmentUser_idAb_study_idCompoundUniqueInput = {
  ab_study_id: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};

export type AbEnrollmentWhereInput = {
  AND?: InputMaybe<Array<AbEnrollmentWhereInput>>;
  NOT?: InputMaybe<Array<AbEnrollmentWhereInput>>;
  OR?: InputMaybe<Array<AbEnrollmentWhereInput>>;
  ab_study?: InputMaybe<AbStudyWhereInput>;
  ab_study_id?: InputMaybe<UuidFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  group?: InputMaybe<IntNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidNullableFilter>;
};

export type AbEnrollmentWhereUniqueInput = {
  AND?: InputMaybe<Array<AbEnrollmentWhereInput>>;
  NOT?: InputMaybe<Array<AbEnrollmentWhereInput>>;
  OR?: InputMaybe<Array<AbEnrollmentWhereInput>>;
  ab_study?: InputMaybe<AbStudyWhereInput>;
  ab_study_id?: InputMaybe<UuidFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  group?: InputMaybe<IntNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidNullableFilter>;
  user_id_ab_study_id?: InputMaybe<AbEnrollmentUser_idAb_study_idCompoundUniqueInput>;
};

export type AbStudy = {
  __typename?: 'AbStudy';
  ab_enrollments: Array<AbEnrollment>;
  created_at: Scalars['DateTime']['output'];
  group_count: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  name: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
};


export type AbStudyab_enrollmentsArgs = {
  cursor?: InputMaybe<AbEnrollmentWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type AbStudyCreateInput = {
  group_count: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type AbStudyUpsertInput = {
  group_count: Scalars['Int']['input'];
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type AbStudyWhereInput = {
  AND?: InputMaybe<Array<AbStudyWhereInput>>;
  NOT?: InputMaybe<Array<AbStudyWhereInput>>;
  OR?: InputMaybe<Array<AbStudyWhereInput>>;
  ab_enrollments?: InputMaybe<AbEnrollmentListRelationFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  group_count?: InputMaybe<IntFilter>;
  id?: InputMaybe<UuidFilter>;
  name?: InputMaybe<StringNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type BoolFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolFilter>;
};

export type BoolNullableFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolNullableFilter>;
};

export type CertificateAvailability = {
  __typename?: 'CertificateAvailability';
  completed_course: Maybe<Scalars['Boolean']['output']>;
  existing_certificate: Maybe<Scalars['String']['output']>;
  honors: Maybe<Scalars['Boolean']['output']>;
};

export type Completion = {
  __typename?: 'Completion';
  certificate_availability: Maybe<CertificateAvailability>;
  certificate_id: Maybe<Scalars['String']['output']>;
  completion_date: Maybe<Scalars['DateTime']['output']>;
  completion_language: Maybe<Scalars['String']['output']>;
  completion_link: Maybe<Scalars['String']['output']>;
  completion_registration_attempt_date: Maybe<Scalars['DateTime']['output']>;
  completions_registered: Array<CompletionRegistered>;
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  eligible_for_ects: Maybe<Scalars['Boolean']['output']>;
  email: Scalars['String']['output'];
  grade: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  project_completion: Scalars['Boolean']['output'];
  registered: Scalars['Boolean']['output'];
  student_number: Maybe<Scalars['String']['output']>;
  tier: Maybe<Scalars['Int']['output']>;
  updated_at: Scalars['DateTime']['output'];
  user: Maybe<User>;
  user_id: Maybe<Scalars['String']['output']>;
  user_upstream_id: Maybe<Scalars['Int']['output']>;
};


export type Completioncompletions_registeredArgs = {
  cursor?: InputMaybe<CompletionRegisteredWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CompletionArg = {
  completion_id: Scalars['String']['input'];
  eligible_for_ects?: InputMaybe<Scalars['Boolean']['input']>;
  student_number: Scalars['String']['input'];
  tier?: InputMaybe<Scalars['Int']['input']>;
};

export type CompletionEdge = {
  __typename?: 'CompletionEdge';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor */
  cursor: Scalars['String']['output'];
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Node */
  node: Completion;
};

export type CompletionListRelationFilter = {
  every?: InputMaybe<CompletionWhereInput>;
  none?: InputMaybe<CompletionWhereInput>;
  some?: InputMaybe<CompletionWhereInput>;
};

export type CompletionOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type CompletionRegistered = {
  __typename?: 'CompletionRegistered';
  completion: Maybe<Completion>;
  completion_id: Maybe<Scalars['String']['output']>;
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  organization: Maybe<Organization>;
  organization_id: Maybe<Scalars['String']['output']>;
  real_student_number: Scalars['String']['output'];
  registration_date: Maybe<Scalars['DateTime']['output']>;
  updated_at: Scalars['DateTime']['output'];
  user: Maybe<User>;
  user_id: Maybe<Scalars['String']['output']>;
};

export type CompletionRegisteredListRelationFilter = {
  every?: InputMaybe<CompletionRegisteredWhereInput>;
  none?: InputMaybe<CompletionRegisteredWhereInput>;
  some?: InputMaybe<CompletionRegisteredWhereInput>;
};

export type CompletionRegisteredOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type CompletionRegisteredWhereInput = {
  AND?: InputMaybe<Array<CompletionRegisteredWhereInput>>;
  NOT?: InputMaybe<Array<CompletionRegisteredWhereInput>>;
  OR?: InputMaybe<Array<CompletionRegisteredWhereInput>>;
  completion?: InputMaybe<CompletionWhereInput>;
  completion_id?: InputMaybe<UuidNullableFilter>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<UuidFilter>;
  organization?: InputMaybe<OrganizationWhereInput>;
  organization_id?: InputMaybe<UuidNullableFilter>;
  real_student_number?: InputMaybe<StringFilter>;
  registration_date?: InputMaybe<DateTimeNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidNullableFilter>;
};

export type CompletionRegisteredWhereUniqueInput = {
  AND?: InputMaybe<Array<CompletionRegisteredWhereInput>>;
  NOT?: InputMaybe<Array<CompletionRegisteredWhereInput>>;
  OR?: InputMaybe<Array<CompletionRegisteredWhereInput>>;
  completion?: InputMaybe<CompletionWhereInput>;
  completion_id?: InputMaybe<UuidNullableFilter>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<OrganizationWhereInput>;
  organization_id?: InputMaybe<UuidNullableFilter>;
  real_student_number?: InputMaybe<StringFilter>;
  registration_date?: InputMaybe<DateTimeNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidNullableFilter>;
};

export type CompletionWhereInput = {
  AND?: InputMaybe<Array<CompletionWhereInput>>;
  NOT?: InputMaybe<Array<CompletionWhereInput>>;
  OR?: InputMaybe<Array<CompletionWhereInput>>;
  certificate_id?: InputMaybe<StringNullableFilter>;
  completion_date?: InputMaybe<DateTimeNullableFilter>;
  completion_language?: InputMaybe<StringNullableFilter>;
  completion_registration_attempt_date?: InputMaybe<DateTimeNullableFilter>;
  completions_registered?: InputMaybe<CompletionRegisteredListRelationFilter>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  eligible_for_ects?: InputMaybe<BoolNullableFilter>;
  email?: InputMaybe<StringFilter>;
  grade?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  student_number?: InputMaybe<StringNullableFilter>;
  tier?: InputMaybe<IntNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidNullableFilter>;
  user_upstream_id?: InputMaybe<IntNullableFilter>;
};

export type Course = {
  __typename?: 'Course';
  automatic_completions: Maybe<Scalars['Boolean']['output']>;
  automatic_completions_eligible_for_ects: Maybe<Scalars['Boolean']['output']>;
  completion_email: Maybe<EmailTemplate>;
  completion_email_id: Maybe<Scalars['String']['output']>;
  completions: Maybe<Array<Completion>>;
  completions_handled_by: Maybe<Course>;
  completions_handled_by_id: Maybe<Scalars['String']['output']>;
  course_aliases: Array<CourseAlias>;
  course_organizations: Array<CourseOrganization>;
  course_stats_email: Maybe<EmailTemplate>;
  course_stats_email_id: Maybe<Scalars['String']['output']>;
  course_translations: Array<CourseTranslation>;
  course_variants: Array<CourseVariant>;
  created_at: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  ects: Maybe<Scalars['String']['output']>;
  end_date: Maybe<Scalars['DateTime']['output']>;
  exercise_completions_needed: Maybe<Scalars['Int']['output']>;
  exercises: Maybe<Array<Exercise>>;
  handles_completions_for: Array<Course>;
  handles_settings_for: Array<Course>;
  has_certificate: Maybe<Scalars['Boolean']['output']>;
  hidden: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['String']['output'];
  inherit_settings_from: Maybe<Course>;
  inherit_settings_from_id: Maybe<Scalars['String']['output']>;
  instructions: Maybe<Scalars['String']['output']>;
  language: Maybe<Scalars['String']['output']>;
  link: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  open_university_registration_links: Array<OpenUniversityRegistrationLink>;
  order: Maybe<Scalars['Int']['output']>;
  owner_organization: Maybe<Organization>;
  owner_organization_id: Maybe<Scalars['String']['output']>;
  photo: Maybe<Image>;
  photo_id: Maybe<Scalars['String']['output']>;
  points_needed: Maybe<Scalars['Int']['output']>;
  promote: Maybe<Scalars['Boolean']['output']>;
  services: Array<Service>;
  slug: Scalars['String']['output'];
  sponsors: Array<Sponsor>;
  start_date: Maybe<Scalars['DateTime']['output']>;
  start_point: Maybe<Scalars['Boolean']['output']>;
  status: Maybe<CourseStatus>;
  study_module_order: Maybe<Scalars['Int']['output']>;
  study_module_start_point: Maybe<Scalars['Boolean']['output']>;
  study_modules: Array<StudyModule>;
  support_email: Maybe<Scalars['String']['output']>;
  tags: Array<Tag>;
  teacher_in_charge_email: Scalars['String']['output'];
  teacher_in_charge_name: Scalars['String']['output'];
  tier: Maybe<Scalars['Int']['output']>;
  upcoming_active_link: Maybe<Scalars['Boolean']['output']>;
  updated_at: Scalars['DateTime']['output'];
  user_course_settings_visibilities: Array<UserCourseSettingsVisibility>;
};


export type CoursecompletionsArgs = {
  user_id?: InputMaybe<Scalars['String']['input']>;
  user_upstream_id?: InputMaybe<Scalars['Int']['input']>;
};


export type Coursecourse_aliasesArgs = {
  cursor?: InputMaybe<CourseAliasWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type Coursecourse_organizationsArgs = {
  cursor?: InputMaybe<CourseOrganizationWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type Coursecourse_translationsArgs = {
  cursor?: InputMaybe<CourseTranslationWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type Coursecourse_variantsArgs = {
  cursor?: InputMaybe<CourseVariantWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type CourseexercisesArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  includeNoPointsAwarded?: InputMaybe<Scalars['Boolean']['input']>;
};


export type Coursehandles_completions_forArgs = {
  cursor?: InputMaybe<CourseWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type Coursehandles_settings_forArgs = {
  cursor?: InputMaybe<CourseWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type Courseopen_university_registration_linksArgs = {
  cursor?: InputMaybe<OpenUniversityRegistrationLinkWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type CourseservicesArgs = {
  cursor?: InputMaybe<ServiceWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type CoursesponsorsArgs = {
  language?: InputMaybe<Scalars['String']['input']>;
};


export type Coursestudy_modulesArgs = {
  cursor?: InputMaybe<StudyModuleWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type CoursetagsArgs = {
  includeHidden?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  types?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type Courseuser_course_settings_visibilitiesArgs = {
  cursor?: InputMaybe<UserCourseSettingsVisibilityWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CourseAlias = {
  __typename?: 'CourseAlias';
  course: Maybe<Course>;
  course_code: Scalars['String']['output'];
  course_id: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type CourseAliasCreateInput = {
  course?: InputMaybe<Scalars['ID']['input']>;
  course_code: Scalars['String']['input'];
};

export type CourseAliasListRelationFilter = {
  every?: InputMaybe<CourseAliasWhereInput>;
  none?: InputMaybe<CourseAliasWhereInput>;
  some?: InputMaybe<CourseAliasWhereInput>;
};

export type CourseAliasOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type CourseAliasUpsertInput = {
  course?: InputMaybe<Scalars['ID']['input']>;
  course_code: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type CourseAliasWhereInput = {
  AND?: InputMaybe<Array<CourseAliasWhereInput>>;
  NOT?: InputMaybe<Array<CourseAliasWhereInput>>;
  OR?: InputMaybe<Array<CourseAliasWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_code?: InputMaybe<StringFilter>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<UuidFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type CourseAliasWhereUniqueInput = {
  AND?: InputMaybe<Array<CourseAliasWhereInput>>;
  NOT?: InputMaybe<Array<CourseAliasWhereInput>>;
  OR?: InputMaybe<Array<CourseAliasWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_code?: InputMaybe<Scalars['String']['input']>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type CourseCreateArg = {
  automatic_completions?: InputMaybe<Scalars['Boolean']['input']>;
  automatic_completions_eligible_for_ects?: InputMaybe<Scalars['Boolean']['input']>;
  base64?: InputMaybe<Scalars['Boolean']['input']>;
  completion_email_id?: InputMaybe<Scalars['ID']['input']>;
  completions_handled_by?: InputMaybe<Scalars['ID']['input']>;
  course_aliases?: InputMaybe<Array<CourseAliasCreateInput>>;
  course_stats_email_id?: InputMaybe<Scalars['ID']['input']>;
  course_translations?: InputMaybe<Array<CourseTranslationCreateInput>>;
  course_variants?: InputMaybe<Array<CourseVariantCreateInput>>;
  ects?: InputMaybe<Scalars['String']['input']>;
  end_date?: InputMaybe<Scalars['DateTime']['input']>;
  exercise_completions_needed?: InputMaybe<Scalars['Int']['input']>;
  has_certificate?: InputMaybe<Scalars['Boolean']['input']>;
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  inherit_settings_from?: InputMaybe<Scalars['ID']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  new_photo?: InputMaybe<Scalars['Upload']['input']>;
  open_university_registration_links?: InputMaybe<Array<OpenUniversityRegistrationLinkCreateInput>>;
  order?: InputMaybe<Scalars['Int']['input']>;
  photo?: InputMaybe<Scalars['ID']['input']>;
  points_needed?: InputMaybe<Scalars['Int']['input']>;
  promote?: InputMaybe<Scalars['Boolean']['input']>;
  slug: Scalars['String']['input'];
  sponsors?: InputMaybe<Array<SponsorUniqueWithOrderInput>>;
  start_date: Scalars['DateTime']['input'];
  start_point?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<CourseStatus>;
  study_module_order?: InputMaybe<Scalars['Int']['input']>;
  study_module_start_point?: InputMaybe<Scalars['Boolean']['input']>;
  study_modules?: InputMaybe<Array<CourseStudyModuleUniqueInput>>;
  support_email?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<TagCreateInput>>;
  teacher_in_charge_email: Scalars['String']['input'];
  teacher_in_charge_name: Scalars['String']['input'];
  tier?: InputMaybe<Scalars['Int']['input']>;
  upcoming_active_link?: InputMaybe<Scalars['Boolean']['input']>;
  user_course_settings_visibilities?: InputMaybe<Array<UserCourseSettingsVisibilityCreateInput>>;
};

export type CourseListRelationFilter = {
  every?: InputMaybe<CourseWhereInput>;
  none?: InputMaybe<CourseWhereInput>;
  some?: InputMaybe<CourseWhereInput>;
};

export type CourseOrderByInput = {
  created_at?: InputMaybe<SortOrder>;
  ects?: InputMaybe<SortOrder>;
  end_date?: InputMaybe<SortOrder>;
  exercise_completions_needed?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  order?: InputMaybe<SortOrder>;
  points_needed?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SortOrder>;
  start_date?: InputMaybe<SortOrder>;
  study_module_order?: InputMaybe<SortOrder>;
  support_email?: InputMaybe<SortOrder>;
  teacher_in_charge_email?: InputMaybe<SortOrder>;
  teacher_in_charge_name?: InputMaybe<SortOrder>;
  tier?: InputMaybe<SortOrder>;
  updated_at?: InputMaybe<SortOrder>;
};

export type CourseOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export enum CourseOrderByRelevanceFieldEnum {
  completion_email_id = 'completion_email_id',
  completions_handled_by_id = 'completions_handled_by_id',
  course_stats_email_id = 'course_stats_email_id',
  ects = 'ects',
  id = 'id',
  inherit_settings_from_id = 'inherit_settings_from_id',
  language = 'language',
  name = 'name',
  owner_organization_id = 'owner_organization_id',
  photo_id = 'photo_id',
  slug = 'slug',
  support_email = 'support_email',
  teacher_in_charge_email = 'teacher_in_charge_email',
  teacher_in_charge_name = 'teacher_in_charge_name'
}

export type CourseOrderByRelevanceInput = {
  fields: CourseOrderByRelevanceFieldEnum;
  search: Scalars['String']['input'];
  sort: SortOrder;
};

export type CourseOrderByWithRelationAndSearchRelevanceInput = {
  _relevance?: InputMaybe<CourseOrderByRelevanceInput>;
  automatic_completions?: InputMaybe<SortOrderInput>;
  automatic_completions_eligible_for_ects?: InputMaybe<SortOrderInput>;
  completion_email?: InputMaybe<EmailTemplateOrderByWithRelationAndSearchRelevanceInput>;
  completion_email_id?: InputMaybe<SortOrderInput>;
  completions?: InputMaybe<CompletionOrderByRelationAggregateInput>;
  completions_handled_by?: InputMaybe<CourseOrderByWithRelationAndSearchRelevanceInput>;
  completions_handled_by_id?: InputMaybe<SortOrderInput>;
  completions_registered?: InputMaybe<CompletionRegisteredOrderByRelationAggregateInput>;
  course_aliases?: InputMaybe<CourseAliasOrderByRelationAggregateInput>;
  course_organizations?: InputMaybe<CourseOrganizationOrderByRelationAggregateInput>;
  course_stats_email?: InputMaybe<EmailTemplateOrderByWithRelationAndSearchRelevanceInput>;
  course_stats_email_id?: InputMaybe<SortOrderInput>;
  course_translations?: InputMaybe<CourseTranslationOrderByRelationAggregateInput>;
  course_variants?: InputMaybe<CourseVariantOrderByRelationAggregateInput>;
  created_at?: InputMaybe<SortOrder>;
  ects?: InputMaybe<SortOrderInput>;
  end_date?: InputMaybe<SortOrderInput>;
  exercise_completions_needed?: InputMaybe<SortOrderInput>;
  exercises?: InputMaybe<ExerciseOrderByRelationAggregateInput>;
  handles_completions_for?: InputMaybe<CourseOrderByRelationAggregateInput>;
  handles_settings_for?: InputMaybe<CourseOrderByRelationAggregateInput>;
  has_certificate?: InputMaybe<SortOrderInput>;
  hidden?: InputMaybe<SortOrderInput>;
  id?: InputMaybe<SortOrder>;
  inherit_settings_from?: InputMaybe<CourseOrderByWithRelationAndSearchRelevanceInput>;
  inherit_settings_from_id?: InputMaybe<SortOrderInput>;
  language?: InputMaybe<SortOrderInput>;
  name?: InputMaybe<SortOrder>;
  open_university_registration_links?: InputMaybe<OpenUniversityRegistrationLinkOrderByRelationAggregateInput>;
  order?: InputMaybe<SortOrderInput>;
  owner_organization?: InputMaybe<OrganizationOrderByWithRelationAndSearchRelevanceInput>;
  owner_organization_id?: InputMaybe<SortOrderInput>;
  ownerships?: InputMaybe<CourseOwnershipOrderByRelationAggregateInput>;
  photo?: InputMaybe<ImageOrderByWithRelationAndSearchRelevanceInput>;
  photo_id?: InputMaybe<SortOrderInput>;
  points_needed?: InputMaybe<SortOrderInput>;
  promote?: InputMaybe<SortOrderInput>;
  services?: InputMaybe<ServiceOrderByRelationAggregateInput>;
  slug?: InputMaybe<SortOrder>;
  sponsors?: InputMaybe<CourseSponsorOrderByRelationAggregateInput>;
  start_date?: InputMaybe<SortOrderInput>;
  start_point?: InputMaybe<SortOrderInput>;
  status?: InputMaybe<SortOrderInput>;
  stored_data?: InputMaybe<StoredDataOrderByRelationAggregateInput>;
  study_module_order?: InputMaybe<SortOrderInput>;
  study_module_start_point?: InputMaybe<SortOrderInput>;
  study_modules?: InputMaybe<StudyModuleOrderByRelationAggregateInput>;
  support_email?: InputMaybe<SortOrderInput>;
  tags?: InputMaybe<TagOrderByRelationAggregateInput>;
  teacher_in_charge_email?: InputMaybe<SortOrder>;
  teacher_in_charge_name?: InputMaybe<SortOrder>;
  tier?: InputMaybe<SortOrderInput>;
  triggered_automatically_email?: InputMaybe<EmailTemplateOrderByRelationAggregateInput>;
  upcoming_active_link?: InputMaybe<SortOrderInput>;
  updated_at?: InputMaybe<SortOrder>;
  user_course_progresses?: InputMaybe<UserCourseProgressOrderByRelationAggregateInput>;
  user_course_service_progresses?: InputMaybe<UserCourseServiceProgressOrderByRelationAggregateInput>;
  user_course_settings?: InputMaybe<UserCourseSettingOrderByRelationAggregateInput>;
  user_course_settings_visibilities?: InputMaybe<UserCourseSettingsVisibilityOrderByRelationAggregateInput>;
};

export type CourseOrganization = {
  __typename?: 'CourseOrganization';
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  creator: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['String']['output'];
  organization: Maybe<Organization>;
  organization_id: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
};

export type CourseOrganizationListRelationFilter = {
  every?: InputMaybe<CourseOrganizationWhereInput>;
  none?: InputMaybe<CourseOrganizationWhereInput>;
  some?: InputMaybe<CourseOrganizationWhereInput>;
};

export type CourseOrganizationOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type CourseOrganizationWhereInput = {
  AND?: InputMaybe<Array<CourseOrganizationWhereInput>>;
  NOT?: InputMaybe<Array<CourseOrganizationWhereInput>>;
  OR?: InputMaybe<Array<CourseOrganizationWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  creator?: InputMaybe<BoolNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  organization?: InputMaybe<OrganizationWhereInput>;
  organization_id?: InputMaybe<UuidNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type CourseOrganizationWhereUniqueInput = {
  AND?: InputMaybe<Array<CourseOrganizationWhereInput>>;
  NOT?: InputMaybe<Array<CourseOrganizationWhereInput>>;
  OR?: InputMaybe<Array<CourseOrganizationWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  creator?: InputMaybe<BoolNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<OrganizationWhereInput>;
  organization_id?: InputMaybe<UuidNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type CourseOwnership = {
  __typename?: 'CourseOwnership';
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  user: Maybe<User>;
  user_id: Maybe<Scalars['String']['output']>;
};

export type CourseOwnershipListRelationFilter = {
  every?: InputMaybe<CourseOwnershipWhereInput>;
  none?: InputMaybe<CourseOwnershipWhereInput>;
  some?: InputMaybe<CourseOwnershipWhereInput>;
};

export type CourseOwnershipOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type CourseOwnershipUser_idCourse_idCompoundUniqueInput = {
  course_id: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};

export type CourseOwnershipWhereInput = {
  AND?: InputMaybe<Array<CourseOwnershipWhereInput>>;
  NOT?: InputMaybe<Array<CourseOwnershipWhereInput>>;
  OR?: InputMaybe<Array<CourseOwnershipWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<UuidFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidNullableFilter>;
};

export type CourseOwnershipWhereUniqueInput = {
  AND?: InputMaybe<Array<CourseOwnershipWhereInput>>;
  NOT?: InputMaybe<Array<CourseOwnershipWhereInput>>;
  OR?: InputMaybe<Array<CourseOwnershipWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidNullableFilter>;
  user_id_course_id?: InputMaybe<CourseOwnershipUser_idCourse_idCompoundUniqueInput>;
};

export type CourseSponsor = {
  __typename?: 'CourseSponsor';
  course: Course;
  course_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  order: Maybe<Scalars['Int']['output']>;
  sponsor: Sponsor;
  sponsor_id: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type CourseSponsorCourse_idSponsor_idCompoundUniqueInput = {
  course_id: Scalars['String']['input'];
  sponsor_id: Scalars['String']['input'];
};

export type CourseSponsorListRelationFilter = {
  every?: InputMaybe<CourseSponsorWhereInput>;
  none?: InputMaybe<CourseSponsorWhereInput>;
  some?: InputMaybe<CourseSponsorWhereInput>;
};

export type CourseSponsorOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type CourseSponsorWhereInput = {
  AND?: InputMaybe<Array<CourseSponsorWhereInput>>;
  NOT?: InputMaybe<Array<CourseSponsorWhereInput>>;
  OR?: InputMaybe<Array<CourseSponsorWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  order?: InputMaybe<IntNullableFilter>;
  sponsor?: InputMaybe<SponsorWhereInput>;
  sponsor_id?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type CourseSponsorWhereUniqueInput = {
  AND?: InputMaybe<Array<CourseSponsorWhereInput>>;
  NOT?: InputMaybe<Array<CourseSponsorWhereInput>>;
  OR?: InputMaybe<Array<CourseSponsorWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidFilter>;
  course_id_sponsor_id?: InputMaybe<CourseSponsorCourse_idSponsor_idCompoundUniqueInput>;
  created_at?: InputMaybe<DateTimeFilter>;
  order?: InputMaybe<IntNullableFilter>;
  sponsor?: InputMaybe<SponsorWhereInput>;
  sponsor_id?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type CourseStatsSubscription = {
  __typename?: 'CourseStatsSubscription';
  created_at: Scalars['DateTime']['output'];
  email_template: Maybe<EmailTemplate>;
  email_template_id: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  user: Maybe<User>;
  user_id: Maybe<Scalars['String']['output']>;
};

export type CourseStatsSubscriptionListRelationFilter = {
  every?: InputMaybe<CourseStatsSubscriptionWhereInput>;
  none?: InputMaybe<CourseStatsSubscriptionWhereInput>;
  some?: InputMaybe<CourseStatsSubscriptionWhereInput>;
};

export type CourseStatsSubscriptionOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type CourseStatsSubscriptionUser_idEmail_template_idCompoundUniqueInput = {
  email_template_id: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};

export type CourseStatsSubscriptionWhereInput = {
  AND?: InputMaybe<Array<CourseStatsSubscriptionWhereInput>>;
  NOT?: InputMaybe<Array<CourseStatsSubscriptionWhereInput>>;
  OR?: InputMaybe<Array<CourseStatsSubscriptionWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  email_template?: InputMaybe<EmailTemplateWhereInput>;
  email_template_id?: InputMaybe<UuidNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidNullableFilter>;
};

export type CourseStatsSubscriptionWhereUniqueInput = {
  AND?: InputMaybe<Array<CourseStatsSubscriptionWhereInput>>;
  NOT?: InputMaybe<Array<CourseStatsSubscriptionWhereInput>>;
  OR?: InputMaybe<Array<CourseStatsSubscriptionWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  email_template?: InputMaybe<EmailTemplateWhereInput>;
  email_template_id?: InputMaybe<UuidNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidNullableFilter>;
  user_id_email_template_id?: InputMaybe<CourseStatsSubscriptionUser_idEmail_template_idCompoundUniqueInput>;
};

export enum CourseStatus {
  Active = 'Active',
  Ended = 'Ended',
  Upcoming = 'Upcoming'
}

export type CourseStudyModuleUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type CourseTranslation = {
  __typename?: 'CourseTranslation';
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  instructions: Maybe<Scalars['String']['output']>;
  language: Scalars['String']['output'];
  link: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type CourseTranslationCreateInput = {
  course?: InputMaybe<Scalars['ID']['input']>;
  description: Scalars['String']['input'];
  instructions?: InputMaybe<Scalars['String']['input']>;
  language: Scalars['String']['input'];
  link?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CourseTranslationListRelationFilter = {
  every?: InputMaybe<CourseTranslationWhereInput>;
  none?: InputMaybe<CourseTranslationWhereInput>;
  some?: InputMaybe<CourseTranslationWhereInput>;
};

export type CourseTranslationOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type CourseTranslationUpsertInput = {
  course?: InputMaybe<Scalars['ID']['input']>;
  description: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  instructions?: InputMaybe<Scalars['String']['input']>;
  language: Scalars['String']['input'];
  link?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CourseTranslationWhereInput = {
  AND?: InputMaybe<Array<CourseTranslationWhereInput>>;
  NOT?: InputMaybe<Array<CourseTranslationWhereInput>>;
  OR?: InputMaybe<Array<CourseTranslationWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<UuidFilter>;
  instructions?: InputMaybe<StringNullableFilter>;
  language?: InputMaybe<StringFilter>;
  link?: InputMaybe<StringNullableFilter>;
  name?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type CourseTranslationWhereUniqueInput = {
  AND?: InputMaybe<Array<CourseTranslationWhereInput>>;
  NOT?: InputMaybe<Array<CourseTranslationWhereInput>>;
  OR?: InputMaybe<Array<CourseTranslationWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  instructions?: InputMaybe<StringNullableFilter>;
  language?: InputMaybe<StringFilter>;
  link?: InputMaybe<StringNullableFilter>;
  name?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type CourseUpsertArg = {
  automatic_completions?: InputMaybe<Scalars['Boolean']['input']>;
  automatic_completions_eligible_for_ects?: InputMaybe<Scalars['Boolean']['input']>;
  base64?: InputMaybe<Scalars['Boolean']['input']>;
  completion_email_id?: InputMaybe<Scalars['ID']['input']>;
  completions_handled_by?: InputMaybe<Scalars['ID']['input']>;
  course_aliases?: InputMaybe<Array<CourseAliasUpsertInput>>;
  course_stats_email_id?: InputMaybe<Scalars['ID']['input']>;
  course_translations?: InputMaybe<Array<CourseTranslationUpsertInput>>;
  course_variants?: InputMaybe<Array<CourseVariantUpsertInput>>;
  delete_photo?: InputMaybe<Scalars['Boolean']['input']>;
  ects?: InputMaybe<Scalars['String']['input']>;
  end_date?: InputMaybe<Scalars['DateTime']['input']>;
  exercise_completions_needed?: InputMaybe<Scalars['Int']['input']>;
  has_certificate?: InputMaybe<Scalars['Boolean']['input']>;
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  inherit_settings_from?: InputMaybe<Scalars['ID']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  new_photo?: InputMaybe<Scalars['Upload']['input']>;
  new_slug?: InputMaybe<Scalars['String']['input']>;
  open_university_registration_links?: InputMaybe<Array<OpenUniversityRegistrationLinkUpsertInput>>;
  order?: InputMaybe<Scalars['Int']['input']>;
  photo?: InputMaybe<Scalars['ID']['input']>;
  points_needed?: InputMaybe<Scalars['Int']['input']>;
  promote?: InputMaybe<Scalars['Boolean']['input']>;
  slug: Scalars['String']['input'];
  sponsors?: InputMaybe<Array<SponsorUniqueWithOrderInput>>;
  start_date: Scalars['DateTime']['input'];
  start_point?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<CourseStatus>;
  study_module_order?: InputMaybe<Scalars['Int']['input']>;
  study_module_start_point?: InputMaybe<Scalars['Boolean']['input']>;
  study_modules?: InputMaybe<Array<CourseStudyModuleUniqueInput>>;
  support_email?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<TagUpsertInput>>;
  teacher_in_charge_email: Scalars['String']['input'];
  teacher_in_charge_name: Scalars['String']['input'];
  tier?: InputMaybe<Scalars['Int']['input']>;
  upcoming_active_link?: InputMaybe<Scalars['Boolean']['input']>;
  user_course_settings_visibilities?: InputMaybe<Array<UserCourseSettingsVisibilityUpsertInput>>;
};

export type CourseVariant = {
  __typename?: 'CourseVariant';
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type CourseVariantCreateInput = {
  course?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  instructions?: InputMaybe<Scalars['String']['input']>;
  slug: Scalars['String']['input'];
};

export type CourseVariantListRelationFilter = {
  every?: InputMaybe<CourseVariantWhereInput>;
  none?: InputMaybe<CourseVariantWhereInput>;
  some?: InputMaybe<CourseVariantWhereInput>;
};

export type CourseVariantOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type CourseVariantUpsertInput = {
  course?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  instructions?: InputMaybe<Scalars['String']['input']>;
  slug: Scalars['String']['input'];
};

export type CourseVariantWhereInput = {
  AND?: InputMaybe<Array<CourseVariantWhereInput>>;
  NOT?: InputMaybe<Array<CourseVariantWhereInput>>;
  OR?: InputMaybe<Array<CourseVariantWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  instructions?: InputMaybe<StringNullableFilter>;
  slug?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type CourseVariantWhereUniqueInput = {
  AND?: InputMaybe<Array<CourseVariantWhereInput>>;
  NOT?: InputMaybe<Array<CourseVariantWhereInput>>;
  OR?: InputMaybe<Array<CourseVariantWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  instructions?: InputMaybe<StringNullableFilter>;
  slug?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type CourseWhereInput = {
  AND?: InputMaybe<Array<CourseWhereInput>>;
  NOT?: InputMaybe<Array<CourseWhereInput>>;
  OR?: InputMaybe<Array<CourseWhereInput>>;
  automatic_completions?: InputMaybe<BoolNullableFilter>;
  automatic_completions_eligible_for_ects?: InputMaybe<BoolNullableFilter>;
  completion_email?: InputMaybe<EmailTemplateWhereInput>;
  completion_email_id?: InputMaybe<UuidNullableFilter>;
  completions?: InputMaybe<CompletionListRelationFilter>;
  completions_handled_by?: InputMaybe<CourseWhereInput>;
  completions_handled_by_id?: InputMaybe<UuidNullableFilter>;
  completions_registered?: InputMaybe<CompletionRegisteredListRelationFilter>;
  course_aliases?: InputMaybe<CourseAliasListRelationFilter>;
  course_organizations?: InputMaybe<CourseOrganizationListRelationFilter>;
  course_stats_email?: InputMaybe<EmailTemplateWhereInput>;
  course_stats_email_id?: InputMaybe<UuidNullableFilter>;
  course_translations?: InputMaybe<CourseTranslationListRelationFilter>;
  course_variants?: InputMaybe<CourseVariantListRelationFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  ects?: InputMaybe<StringNullableFilter>;
  end_date?: InputMaybe<DateTimeNullableFilter>;
  exercise_completions_needed?: InputMaybe<IntNullableFilter>;
  exercises?: InputMaybe<ExerciseListRelationFilter>;
  handles_completions_for?: InputMaybe<CourseListRelationFilter>;
  handles_settings_for?: InputMaybe<CourseListRelationFilter>;
  has_certificate?: InputMaybe<BoolNullableFilter>;
  hidden?: InputMaybe<BoolNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  inherit_settings_from?: InputMaybe<CourseWhereInput>;
  inherit_settings_from_id?: InputMaybe<UuidNullableFilter>;
  language?: InputMaybe<StringNullableFilter>;
  name?: InputMaybe<StringFilter>;
  open_university_registration_links?: InputMaybe<OpenUniversityRegistrationLinkListRelationFilter>;
  order?: InputMaybe<IntNullableFilter>;
  owner_organization?: InputMaybe<OrganizationWhereInput>;
  owner_organization_id?: InputMaybe<UuidNullableFilter>;
  ownerships?: InputMaybe<CourseOwnershipListRelationFilter>;
  photo?: InputMaybe<ImageWhereInput>;
  photo_id?: InputMaybe<UuidNullableFilter>;
  points_needed?: InputMaybe<IntNullableFilter>;
  promote?: InputMaybe<BoolNullableFilter>;
  services?: InputMaybe<ServiceListRelationFilter>;
  slug?: InputMaybe<StringFilter>;
  sponsors?: InputMaybe<CourseSponsorListRelationFilter>;
  start_date?: InputMaybe<DateTimeNullableFilter>;
  start_point?: InputMaybe<BoolNullableFilter>;
  status?: InputMaybe<EnumCourseStatusNullableFilter>;
  stored_data?: InputMaybe<StoredDataListRelationFilter>;
  study_module_order?: InputMaybe<IntNullableFilter>;
  study_module_start_point?: InputMaybe<BoolNullableFilter>;
  study_modules?: InputMaybe<StudyModuleListRelationFilter>;
  support_email?: InputMaybe<StringNullableFilter>;
  tags?: InputMaybe<TagListRelationFilter>;
  teacher_in_charge_email?: InputMaybe<StringFilter>;
  teacher_in_charge_name?: InputMaybe<StringFilter>;
  tier?: InputMaybe<IntNullableFilter>;
  triggered_automatically_email?: InputMaybe<EmailTemplateListRelationFilter>;
  upcoming_active_link?: InputMaybe<BoolNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user_course_progresses?: InputMaybe<UserCourseProgressListRelationFilter>;
  user_course_service_progresses?: InputMaybe<UserCourseServiceProgressListRelationFilter>;
  user_course_settings?: InputMaybe<UserCourseSettingListRelationFilter>;
  user_course_settings_visibilities?: InputMaybe<UserCourseSettingsVisibilityListRelationFilter>;
};

export type CourseWhereUniqueInput = {
  AND?: InputMaybe<Array<CourseWhereInput>>;
  NOT?: InputMaybe<Array<CourseWhereInput>>;
  OR?: InputMaybe<Array<CourseWhereInput>>;
  automatic_completions?: InputMaybe<BoolNullableFilter>;
  automatic_completions_eligible_for_ects?: InputMaybe<BoolNullableFilter>;
  completion_email?: InputMaybe<EmailTemplateWhereInput>;
  completion_email_id?: InputMaybe<UuidNullableFilter>;
  completions?: InputMaybe<CompletionListRelationFilter>;
  completions_handled_by?: InputMaybe<CourseWhereInput>;
  completions_handled_by_id?: InputMaybe<UuidNullableFilter>;
  completions_registered?: InputMaybe<CompletionRegisteredListRelationFilter>;
  course_aliases?: InputMaybe<CourseAliasListRelationFilter>;
  course_organizations?: InputMaybe<CourseOrganizationListRelationFilter>;
  course_stats_email?: InputMaybe<EmailTemplateWhereInput>;
  course_stats_email_id?: InputMaybe<UuidNullableFilter>;
  course_translations?: InputMaybe<CourseTranslationListRelationFilter>;
  course_variants?: InputMaybe<CourseVariantListRelationFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  ects?: InputMaybe<StringNullableFilter>;
  end_date?: InputMaybe<DateTimeNullableFilter>;
  exercise_completions_needed?: InputMaybe<IntNullableFilter>;
  exercises?: InputMaybe<ExerciseListRelationFilter>;
  handles_completions_for?: InputMaybe<CourseListRelationFilter>;
  handles_settings_for?: InputMaybe<CourseListRelationFilter>;
  has_certificate?: InputMaybe<BoolNullableFilter>;
  hidden?: InputMaybe<BoolNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  inherit_settings_from?: InputMaybe<CourseWhereInput>;
  inherit_settings_from_id?: InputMaybe<UuidNullableFilter>;
  language?: InputMaybe<StringNullableFilter>;
  name?: InputMaybe<StringFilter>;
  open_university_registration_links?: InputMaybe<OpenUniversityRegistrationLinkListRelationFilter>;
  order?: InputMaybe<IntNullableFilter>;
  owner_organization?: InputMaybe<OrganizationWhereInput>;
  owner_organization_id?: InputMaybe<UuidNullableFilter>;
  ownerships?: InputMaybe<CourseOwnershipListRelationFilter>;
  photo?: InputMaybe<ImageWhereInput>;
  photo_id?: InputMaybe<UuidNullableFilter>;
  points_needed?: InputMaybe<IntNullableFilter>;
  promote?: InputMaybe<BoolNullableFilter>;
  services?: InputMaybe<ServiceListRelationFilter>;
  slug?: InputMaybe<Scalars['String']['input']>;
  sponsors?: InputMaybe<CourseSponsorListRelationFilter>;
  start_date?: InputMaybe<DateTimeNullableFilter>;
  start_point?: InputMaybe<BoolNullableFilter>;
  status?: InputMaybe<EnumCourseStatusNullableFilter>;
  stored_data?: InputMaybe<StoredDataListRelationFilter>;
  study_module_order?: InputMaybe<IntNullableFilter>;
  study_module_start_point?: InputMaybe<BoolNullableFilter>;
  study_modules?: InputMaybe<StudyModuleListRelationFilter>;
  support_email?: InputMaybe<StringNullableFilter>;
  tags?: InputMaybe<TagListRelationFilter>;
  teacher_in_charge_email?: InputMaybe<StringFilter>;
  teacher_in_charge_name?: InputMaybe<StringFilter>;
  tier?: InputMaybe<IntNullableFilter>;
  triggered_automatically_email?: InputMaybe<EmailTemplateListRelationFilter>;
  upcoming_active_link?: InputMaybe<BoolNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user_course_progresses?: InputMaybe<UserCourseProgressListRelationFilter>;
  user_course_service_progresses?: InputMaybe<UserCourseServiceProgressListRelationFilter>;
  user_course_settings?: InputMaybe<UserCourseSettingListRelationFilter>;
  user_course_settings_visibilities?: InputMaybe<UserCourseSettingsVisibilityListRelationFilter>;
};

export type DateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type DateTimeNullableFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type EmailDelivery = {
  __typename?: 'EmailDelivery';
  created_at: Scalars['DateTime']['output'];
  email: Maybe<Scalars['String']['output']>;
  email_template: Maybe<EmailTemplate>;
  email_template_id: Maybe<Scalars['String']['output']>;
  error: Scalars['Boolean']['output'];
  error_message: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  organization: Maybe<Organization>;
  organization_id: Maybe<Scalars['String']['output']>;
  sent: Scalars['Boolean']['output'];
  updated_at: Scalars['DateTime']['output'];
  user: Maybe<User>;
  user_id: Maybe<Scalars['String']['output']>;
  user_organization_join_confirmation: Maybe<UserOrganizationJoinConfirmation>;
};

export type EmailDeliveryListRelationFilter = {
  every?: InputMaybe<EmailDeliveryWhereInput>;
  none?: InputMaybe<EmailDeliveryWhereInput>;
  some?: InputMaybe<EmailDeliveryWhereInput>;
};

export type EmailDeliveryOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type EmailDeliveryWhereInput = {
  AND?: InputMaybe<Array<EmailDeliveryWhereInput>>;
  NOT?: InputMaybe<Array<EmailDeliveryWhereInput>>;
  OR?: InputMaybe<Array<EmailDeliveryWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  email?: InputMaybe<StringNullableFilter>;
  email_template?: InputMaybe<EmailTemplateWhereInput>;
  email_template_id?: InputMaybe<UuidNullableFilter>;
  error?: InputMaybe<BoolFilter>;
  error_message?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  organization?: InputMaybe<OrganizationWhereInput>;
  organization_id?: InputMaybe<UuidNullableFilter>;
  sent?: InputMaybe<BoolFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidNullableFilter>;
  user_organization_join_confirmation?: InputMaybe<UserOrganizationJoinConfirmationWhereInput>;
};

export type EmailDeliveryWhereUniqueInput = {
  AND?: InputMaybe<Array<EmailDeliveryWhereInput>>;
  NOT?: InputMaybe<Array<EmailDeliveryWhereInput>>;
  OR?: InputMaybe<Array<EmailDeliveryWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  email?: InputMaybe<StringNullableFilter>;
  email_template?: InputMaybe<EmailTemplateWhereInput>;
  email_template_id?: InputMaybe<UuidNullableFilter>;
  error?: InputMaybe<BoolFilter>;
  error_message?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<OrganizationWhereInput>;
  organization_id?: InputMaybe<UuidNullableFilter>;
  sent?: InputMaybe<BoolFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidNullableFilter>;
  user_organization_join_confirmation?: InputMaybe<UserOrganizationJoinConfirmationWhereInput>;
};

export type EmailTemplate = {
  __typename?: 'EmailTemplate';
  course_instance_language: Maybe<Scalars['String']['output']>;
  course_stats_subscriptions: Array<CourseStatsSubscription>;
  courses: Array<Course>;
  created_at: Scalars['DateTime']['output'];
  email_deliveries: Array<EmailDelivery>;
  exercise_completions_threshold: Maybe<Scalars['Int']['output']>;
  html_body: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  joined_organizations: Array<Organization>;
  name: Maybe<Scalars['String']['output']>;
  points_threshold: Maybe<Scalars['Int']['output']>;
  template_type: Maybe<Scalars['String']['output']>;
  title: Maybe<Scalars['String']['output']>;
  triggered_automatically_by_course_id: Maybe<Scalars['String']['output']>;
  txt_body: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
};


export type EmailTemplatecourse_stats_subscriptionsArgs = {
  cursor?: InputMaybe<CourseStatsSubscriptionWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type EmailTemplatecoursesArgs = {
  cursor?: InputMaybe<CourseWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type EmailTemplateemail_deliveriesArgs = {
  cursor?: InputMaybe<EmailDeliveryWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type EmailTemplatejoined_organizationsArgs = {
  cursor?: InputMaybe<OrganizationWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type EmailTemplateListRelationFilter = {
  every?: InputMaybe<EmailTemplateWhereInput>;
  none?: InputMaybe<EmailTemplateWhereInput>;
  some?: InputMaybe<EmailTemplateWhereInput>;
};

export type EmailTemplateOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export enum EmailTemplateOrderByRelevanceFieldEnum {
  course_instance_language = 'course_instance_language',
  html_body = 'html_body',
  id = 'id',
  name = 'name',
  template_type = 'template_type',
  title = 'title',
  triggered_automatically_by_course_id = 'triggered_automatically_by_course_id',
  txt_body = 'txt_body'
}

export type EmailTemplateOrderByRelevanceInput = {
  fields: EmailTemplateOrderByRelevanceFieldEnum;
  search: Scalars['String']['input'];
  sort: SortOrder;
};

export type EmailTemplateOrderByWithRelationAndSearchRelevanceInput = {
  _relevance?: InputMaybe<EmailTemplateOrderByRelevanceInput>;
  course_instance_language?: InputMaybe<SortOrderInput>;
  course_stats_subscriptions?: InputMaybe<CourseStatsSubscriptionOrderByRelationAggregateInput>;
  courses?: InputMaybe<CourseOrderByRelationAggregateInput>;
  created_at?: InputMaybe<SortOrder>;
  email_deliveries?: InputMaybe<EmailDeliveryOrderByRelationAggregateInput>;
  exercise_completions_threshold?: InputMaybe<SortOrderInput>;
  html_body?: InputMaybe<SortOrderInput>;
  id?: InputMaybe<SortOrder>;
  joined_organizations?: InputMaybe<OrganizationOrderByRelationAggregateInput>;
  name?: InputMaybe<SortOrderInput>;
  points_threshold?: InputMaybe<SortOrderInput>;
  stats_courses?: InputMaybe<CourseOrderByRelationAggregateInput>;
  template_type?: InputMaybe<SortOrderInput>;
  title?: InputMaybe<SortOrderInput>;
  triggered_automatically_by_course?: InputMaybe<CourseOrderByWithRelationAndSearchRelevanceInput>;
  triggered_automatically_by_course_id?: InputMaybe<SortOrderInput>;
  txt_body?: InputMaybe<SortOrderInput>;
  updated_at?: InputMaybe<SortOrder>;
};

export type EmailTemplateWhereInput = {
  AND?: InputMaybe<Array<EmailTemplateWhereInput>>;
  NOT?: InputMaybe<Array<EmailTemplateWhereInput>>;
  OR?: InputMaybe<Array<EmailTemplateWhereInput>>;
  course_instance_language?: InputMaybe<StringNullableFilter>;
  course_stats_subscriptions?: InputMaybe<CourseStatsSubscriptionListRelationFilter>;
  courses?: InputMaybe<CourseListRelationFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  email_deliveries?: InputMaybe<EmailDeliveryListRelationFilter>;
  exercise_completions_threshold?: InputMaybe<IntNullableFilter>;
  html_body?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  joined_organizations?: InputMaybe<OrganizationListRelationFilter>;
  name?: InputMaybe<StringNullableFilter>;
  points_threshold?: InputMaybe<IntNullableFilter>;
  stats_courses?: InputMaybe<CourseListRelationFilter>;
  template_type?: InputMaybe<StringNullableFilter>;
  title?: InputMaybe<StringNullableFilter>;
  triggered_automatically_by_course?: InputMaybe<CourseWhereInput>;
  triggered_automatically_by_course_id?: InputMaybe<UuidNullableFilter>;
  txt_body?: InputMaybe<StringNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type EnumCourseStatusNullableFilter = {
  equals?: InputMaybe<CourseStatus>;
  in?: InputMaybe<Array<CourseStatus>>;
  not?: InputMaybe<NestedEnumCourseStatusNullableFilter>;
  notIn?: InputMaybe<Array<CourseStatus>>;
};

export type EnumOrganizationRoleNullableFilter = {
  equals?: InputMaybe<OrganizationRole>;
  in?: InputMaybe<Array<OrganizationRole>>;
  not?: InputMaybe<NestedEnumOrganizationRoleNullableFilter>;
  notIn?: InputMaybe<Array<OrganizationRole>>;
};

export type Exercise = {
  __typename?: 'Exercise';
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  custom_id: Scalars['String']['output'];
  deleted: Maybe<Scalars['Boolean']['output']>;
  exercise_completions: Maybe<Array<ExerciseCompletion>>;
  id: Scalars['String']['output'];
  max_points: Maybe<Scalars['Int']['output']>;
  name: Maybe<Scalars['String']['output']>;
  part: Maybe<Scalars['Int']['output']>;
  section: Maybe<Scalars['Int']['output']>;
  service: Maybe<Service>;
  service_id: Maybe<Scalars['String']['output']>;
  timestamp: Maybe<Scalars['DateTime']['output']>;
  updated_at: Scalars['DateTime']['output'];
};


export type Exerciseexercise_completionsArgs = {
  attempted?: InputMaybe<Scalars['Boolean']['input']>;
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  orderBy?: InputMaybe<Array<ExerciseCompletionOrderByWithRelationAndSearchRelevanceInput>>;
  user_id?: InputMaybe<Scalars['ID']['input']>;
};

export type ExerciseCompletion = {
  __typename?: 'ExerciseCompletion';
  attempted: Maybe<Scalars['Boolean']['output']>;
  completed: Maybe<Scalars['Boolean']['output']>;
  created_at: Scalars['DateTime']['output'];
  exercise: Maybe<Exercise>;
  exercise_completion_required_actions: Array<ExerciseCompletionRequiredAction>;
  exercise_id: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  max_points: Maybe<Scalars['Int']['output']>;
  n_points: Maybe<Scalars['Float']['output']>;
  tier: Maybe<Scalars['Int']['output']>;
  timestamp: Scalars['DateTime']['output'];
  updated_at: Scalars['DateTime']['output'];
  user: Maybe<User>;
  user_id: Maybe<Scalars['String']['output']>;
};


export type ExerciseCompletionexercise_completion_required_actionsArgs = {
  cursor?: InputMaybe<ExerciseCompletionRequiredActionWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type ExerciseCompletionListRelationFilter = {
  every?: InputMaybe<ExerciseCompletionWhereInput>;
  none?: InputMaybe<ExerciseCompletionWhereInput>;
  some?: InputMaybe<ExerciseCompletionWhereInput>;
};

export type ExerciseCompletionOrderByInput = {
  created_at?: InputMaybe<SortOrder>;
  exercise_id?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  n_points?: InputMaybe<SortOrder>;
  timestamp?: InputMaybe<SortOrder>;
  updated_at?: InputMaybe<SortOrder>;
  user_id?: InputMaybe<SortOrder>;
};

export type ExerciseCompletionOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export enum ExerciseCompletionOrderByRelevanceFieldEnum {
  exercise_id = 'exercise_id',
  id = 'id',
  user_id = 'user_id'
}

export type ExerciseCompletionOrderByRelevanceInput = {
  fields: ExerciseCompletionOrderByRelevanceFieldEnum;
  search: Scalars['String']['input'];
  sort: SortOrder;
};

export type ExerciseCompletionOrderByWithRelationAndSearchRelevanceInput = {
  _relevance?: InputMaybe<ExerciseCompletionOrderByRelevanceInput>;
  attempted?: InputMaybe<SortOrderInput>;
  completed?: InputMaybe<SortOrderInput>;
  created_at?: InputMaybe<SortOrder>;
  exercise?: InputMaybe<ExerciseOrderByWithRelationAndSearchRelevanceInput>;
  exercise_completion_required_actions?: InputMaybe<ExerciseCompletionRequiredActionOrderByRelationAggregateInput>;
  exercise_id?: InputMaybe<SortOrderInput>;
  id?: InputMaybe<SortOrder>;
  n_points?: InputMaybe<SortOrderInput>;
  original_submission_date?: InputMaybe<SortOrderInput>;
  timestamp?: InputMaybe<SortOrder>;
  updated_at?: InputMaybe<SortOrder>;
  user?: InputMaybe<UserOrderByWithRelationAndSearchRelevanceInput>;
  user_id?: InputMaybe<SortOrderInput>;
};

export type ExerciseCompletionRequiredAction = {
  __typename?: 'ExerciseCompletionRequiredAction';
  exercise_completion: Maybe<ExerciseCompletion>;
  exercise_completion_id: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ExerciseCompletionRequiredActionListRelationFilter = {
  every?: InputMaybe<ExerciseCompletionRequiredActionWhereInput>;
  none?: InputMaybe<ExerciseCompletionRequiredActionWhereInput>;
  some?: InputMaybe<ExerciseCompletionRequiredActionWhereInput>;
};

export type ExerciseCompletionRequiredActionOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type ExerciseCompletionRequiredActionWhereInput = {
  AND?: InputMaybe<Array<ExerciseCompletionRequiredActionWhereInput>>;
  NOT?: InputMaybe<Array<ExerciseCompletionRequiredActionWhereInput>>;
  OR?: InputMaybe<Array<ExerciseCompletionRequiredActionWhereInput>>;
  exercise_completion?: InputMaybe<ExerciseCompletionWhereInput>;
  exercise_completion_id?: InputMaybe<UuidNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  value?: InputMaybe<StringFilter>;
};

export type ExerciseCompletionRequiredActionWhereUniqueInput = {
  AND?: InputMaybe<Array<ExerciseCompletionRequiredActionWhereInput>>;
  NOT?: InputMaybe<Array<ExerciseCompletionRequiredActionWhereInput>>;
  OR?: InputMaybe<Array<ExerciseCompletionRequiredActionWhereInput>>;
  exercise_completion?: InputMaybe<ExerciseCompletionWhereInput>;
  exercise_completion_id?: InputMaybe<UuidNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<StringFilter>;
};

export type ExerciseCompletionWhereInput = {
  AND?: InputMaybe<Array<ExerciseCompletionWhereInput>>;
  NOT?: InputMaybe<Array<ExerciseCompletionWhereInput>>;
  OR?: InputMaybe<Array<ExerciseCompletionWhereInput>>;
  attempted?: InputMaybe<BoolNullableFilter>;
  completed?: InputMaybe<BoolNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  exercise?: InputMaybe<ExerciseWhereInput>;
  exercise_completion_required_actions?: InputMaybe<ExerciseCompletionRequiredActionListRelationFilter>;
  exercise_id?: InputMaybe<UuidNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  n_points?: InputMaybe<FloatNullableFilter>;
  original_submission_date?: InputMaybe<DateTimeNullableFilter>;
  timestamp?: InputMaybe<DateTimeFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidNullableFilter>;
};

export type ExerciseCompletionWhereUniqueInput = {
  AND?: InputMaybe<Array<ExerciseCompletionWhereInput>>;
  NOT?: InputMaybe<Array<ExerciseCompletionWhereInput>>;
  OR?: InputMaybe<Array<ExerciseCompletionWhereInput>>;
  attempted?: InputMaybe<BoolNullableFilter>;
  completed?: InputMaybe<BoolNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  exercise?: InputMaybe<ExerciseWhereInput>;
  exercise_completion_required_actions?: InputMaybe<ExerciseCompletionRequiredActionListRelationFilter>;
  exercise_id?: InputMaybe<UuidNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  n_points?: InputMaybe<FloatNullableFilter>;
  original_submission_date?: InputMaybe<DateTimeNullableFilter>;
  timestamp?: InputMaybe<DateTimeFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidNullableFilter>;
};

export type ExerciseListRelationFilter = {
  every?: InputMaybe<ExerciseWhereInput>;
  none?: InputMaybe<ExerciseWhereInput>;
  some?: InputMaybe<ExerciseWhereInput>;
};

export type ExerciseOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export enum ExerciseOrderByRelevanceFieldEnum {
  course_id = 'course_id',
  custom_id = 'custom_id',
  id = 'id',
  name = 'name',
  service_id = 'service_id'
}

export type ExerciseOrderByRelevanceInput = {
  fields: ExerciseOrderByRelevanceFieldEnum;
  search: Scalars['String']['input'];
  sort: SortOrder;
};

export type ExerciseOrderByWithRelationAndSearchRelevanceInput = {
  _relevance?: InputMaybe<ExerciseOrderByRelevanceInput>;
  course?: InputMaybe<CourseOrderByWithRelationAndSearchRelevanceInput>;
  course_id?: InputMaybe<SortOrderInput>;
  created_at?: InputMaybe<SortOrder>;
  custom_id?: InputMaybe<SortOrder>;
  deleted?: InputMaybe<SortOrderInput>;
  exercise_completions?: InputMaybe<ExerciseCompletionOrderByRelationAggregateInput>;
  id?: InputMaybe<SortOrder>;
  max_points?: InputMaybe<SortOrderInput>;
  name?: InputMaybe<SortOrderInput>;
  part?: InputMaybe<SortOrderInput>;
  section?: InputMaybe<SortOrderInput>;
  service?: InputMaybe<ServiceOrderByWithRelationAndSearchRelevanceInput>;
  service_id?: InputMaybe<SortOrderInput>;
  timestamp?: InputMaybe<SortOrderInput>;
  updated_at?: InputMaybe<SortOrder>;
};

export type ExerciseProgress = {
  __typename?: 'ExerciseProgress';
  /** Number of exercises on the course */
  exercise_count: Maybe<Scalars['Int']['output']>;
  /** Completed exercises divided by number of exercises on the course */
  exercises: Maybe<Scalars['Float']['output']>;
  /** Number of attempted exercises */
  exercises_attempted_count: Maybe<Scalars['Int']['output']>;
  /** Number of completed exercises */
  exercises_completed_count: Maybe<Scalars['Int']['output']>;
  /** User course progress n_points divided by max_points */
  total: Maybe<Scalars['Float']['output']>;
};

export type ExerciseWhereInput = {
  AND?: InputMaybe<Array<ExerciseWhereInput>>;
  NOT?: InputMaybe<Array<ExerciseWhereInput>>;
  OR?: InputMaybe<Array<ExerciseWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  custom_id?: InputMaybe<StringFilter>;
  deleted?: InputMaybe<BoolNullableFilter>;
  exercise_completions?: InputMaybe<ExerciseCompletionListRelationFilter>;
  id?: InputMaybe<UuidFilter>;
  max_points?: InputMaybe<IntNullableFilter>;
  name?: InputMaybe<StringNullableFilter>;
  part?: InputMaybe<IntNullableFilter>;
  section?: InputMaybe<IntNullableFilter>;
  service?: InputMaybe<ServiceWhereInput>;
  service_id?: InputMaybe<UuidNullableFilter>;
  timestamp?: InputMaybe<DateTimeNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type ExerciseWhereUniqueInput = {
  AND?: InputMaybe<Array<ExerciseWhereInput>>;
  NOT?: InputMaybe<Array<ExerciseWhereInput>>;
  OR?: InputMaybe<Array<ExerciseWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  custom_id?: InputMaybe<StringFilter>;
  deleted?: InputMaybe<BoolNullableFilter>;
  exercise_completions?: InputMaybe<ExerciseCompletionListRelationFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  max_points?: InputMaybe<IntNullableFilter>;
  name?: InputMaybe<StringNullableFilter>;
  part?: InputMaybe<IntNullableFilter>;
  section?: InputMaybe<IntNullableFilter>;
  service?: InputMaybe<ServiceWhereInput>;
  service_id?: InputMaybe<UuidNullableFilter>;
  timestamp?: InputMaybe<DateTimeNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type FloatNullableFilter = {
  equals?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  not?: InputMaybe<NestedFloatNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type Image = {
  __typename?: 'Image';
  compressed: Maybe<Scalars['String']['output']>;
  compressed_mimetype: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  default: Maybe<Scalars['Boolean']['output']>;
  encoding: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Maybe<Scalars['String']['output']>;
  original: Scalars['String']['output'];
  original_mimetype: Scalars['String']['output'];
  uncompressed: Scalars['String']['output'];
  uncompressed_mimetype: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export enum ImageOrderByRelevanceFieldEnum {
  compressed = 'compressed',
  compressed_mimetype = 'compressed_mimetype',
  encoding = 'encoding',
  id = 'id',
  name = 'name',
  original = 'original',
  original_mimetype = 'original_mimetype',
  uncompressed = 'uncompressed',
  uncompressed_mimetype = 'uncompressed_mimetype'
}

export type ImageOrderByRelevanceInput = {
  fields: ImageOrderByRelevanceFieldEnum;
  search: Scalars['String']['input'];
  sort: SortOrder;
};

export type ImageOrderByWithRelationAndSearchRelevanceInput = {
  _relevance?: InputMaybe<ImageOrderByRelevanceInput>;
  compressed?: InputMaybe<SortOrderInput>;
  compressed_mimetype?: InputMaybe<SortOrderInput>;
  courses?: InputMaybe<CourseOrderByRelationAggregateInput>;
  created_at?: InputMaybe<SortOrder>;
  default?: InputMaybe<SortOrderInput>;
  encoding?: InputMaybe<SortOrderInput>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrderInput>;
  original?: InputMaybe<SortOrder>;
  original_mimetype?: InputMaybe<SortOrder>;
  uncompressed?: InputMaybe<SortOrder>;
  uncompressed_mimetype?: InputMaybe<SortOrder>;
  updated_at?: InputMaybe<SortOrder>;
};

export type ImageWhereInput = {
  AND?: InputMaybe<Array<ImageWhereInput>>;
  NOT?: InputMaybe<Array<ImageWhereInput>>;
  OR?: InputMaybe<Array<ImageWhereInput>>;
  compressed?: InputMaybe<StringNullableFilter>;
  compressed_mimetype?: InputMaybe<StringNullableFilter>;
  courses?: InputMaybe<CourseListRelationFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  default?: InputMaybe<BoolNullableFilter>;
  encoding?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  name?: InputMaybe<StringNullableFilter>;
  original?: InputMaybe<StringFilter>;
  original_mimetype?: InputMaybe<StringFilter>;
  uncompressed?: InputMaybe<StringFilter>;
  uncompressed_mimetype?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type IntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type IntNullableFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type JsonNullableFilter = {
  array_contains?: InputMaybe<Scalars['Json']['input']>;
  array_ends_with?: InputMaybe<Scalars['Json']['input']>;
  array_starts_with?: InputMaybe<Scalars['Json']['input']>;
  equals?: InputMaybe<Scalars['Json']['input']>;
  gt?: InputMaybe<Scalars['Json']['input']>;
  gte?: InputMaybe<Scalars['Json']['input']>;
  lt?: InputMaybe<Scalars['Json']['input']>;
  lte?: InputMaybe<Scalars['Json']['input']>;
  not?: InputMaybe<Scalars['Json']['input']>;
  path?: InputMaybe<Array<Scalars['String']['input']>>;
  string_contains?: InputMaybe<Scalars['String']['input']>;
  string_ends_with?: InputMaybe<Scalars['String']['input']>;
  string_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type ManualCompletionArg = {
  completion_date?: InputMaybe<Scalars['DateTime']['input']>;
  grade?: InputMaybe<Scalars['String']['input']>;
  tier?: InputMaybe<Scalars['Int']['input']>;
  user_id: Scalars['String']['input'];
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
  addManualCompletion: Maybe<Array<Completion>>;
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
  confirmUserOrganizationJoin: Maybe<UserOrganization>;
  createCourseStatsSubscription: Maybe<CourseStatsSubscription>;
  createRegistrationAttemptDate: Maybe<Completion>;
  createSponsor: Maybe<Sponsor>;
  createSponsorImage: Maybe<SponsorImage>;
  createTag: Maybe<Tag>;
  createTagTranslation: Maybe<TagTranslation>;
  createTagType: Maybe<TagType>;
  deleteCourse: Maybe<Course>;
  deleteCourseOrganization: Maybe<CourseOrganization>;
  deleteCourseStatsSubscription: Maybe<CourseStatsSubscription>;
  deleteCourseTranslation: Maybe<CourseTranslation>;
  deleteCourseVariant: Maybe<CourseVariant>;
  deleteEmailTemplate: Maybe<EmailTemplate>;
  deleteImage: Maybe<Scalars['Boolean']['output']>;
  deleteStudyModule: Maybe<StudyModule>;
  deleteStudyModuleTranslation: Maybe<StudyModuleTranslation>;
  deleteTag: Maybe<Tag>;
  deleteTagTranslation: Maybe<TagTranslation>;
  deleteTagType: Maybe<TagType>;
  deleteUserOrganization: Maybe<UserOrganization>;
  recheckCompletions: Maybe<Scalars['String']['output']>;
  registerCompletion: Scalars['String']['output'];
  requestNewUserOrganizationJoinConfirmation: Maybe<UserOrganizationJoinConfirmation>;
  updateAbEnrollment: Maybe<AbEnrollment>;
  updateAbStudy: Maybe<AbStudy>;
  updateCourse: Maybe<Course>;
  updateCourseTranslation: Maybe<CourseTranslation>;
  updateCourseVariant: Maybe<CourseVariant>;
  updateEmailTemplate: Maybe<EmailTemplate>;
  updateOpenUniversityRegistrationLink: Maybe<OpenUniversityRegistrationLink>;
  updateOrganizationEmailTemplate: Maybe<Organization>;
  updateResearchConsent: Maybe<User>;
  updateService: Maybe<Service>;
  updateSponsor: Maybe<Sponsor>;
  updateStudyModule: Maybe<StudyModule>;
  updateStudyModuletranslation: Maybe<StudyModuleTranslation>;
  updateTag: Maybe<Tag>;
  updateTagTranslation: Maybe<TagTranslation>;
  updateTagType: Maybe<TagType>;
  updateUser: Maybe<User>;
  updateUserName: Maybe<User>;
  updateUserOrganizationConsent: Maybe<UserOrganization>;
  updateUserOrganizationOrganizationalMail: Maybe<UserOrganization>;
};


export type MutationaddAbEnrollmentArgs = {
  abEnrollment: AbEnrollmentCreateOrUpsertInput;
};


export type MutationaddAbStudyArgs = {
  abStudy: AbStudyCreateInput;
};


export type MutationaddCompletionArgs = {
  completion_language?: InputMaybe<Scalars['String']['input']>;
  course: Scalars['ID']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  student_number?: InputMaybe<Scalars['String']['input']>;
  tier?: InputMaybe<Scalars['Int']['input']>;
  user: Scalars['ID']['input'];
  user_upstream_id?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationaddCourseArgs = {
  course: CourseCreateArg;
};


export type MutationaddCourseAliasArgs = {
  course: Scalars['ID']['input'];
  course_code: Scalars['String']['input'];
};


export type MutationaddCourseOrganizationArgs = {
  course_id: Scalars['ID']['input'];
  creator?: InputMaybe<Scalars['Boolean']['input']>;
  organization_id: Scalars['ID']['input'];
};


export type MutationaddCourseTranslationArgs = {
  course?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  instructions?: InputMaybe<Scalars['String']['input']>;
  language: Scalars['String']['input'];
  link?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationaddCourseVariantArgs = {
  course_id: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  slug: Scalars['String']['input'];
};


export type MutationaddEmailTemplateArgs = {
  course_instance_language?: InputMaybe<Scalars['String']['input']>;
  exercise_completions_threshold?: InputMaybe<Scalars['Int']['input']>;
  html_body?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  points_threshold?: InputMaybe<Scalars['Int']['input']>;
  template_type?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  triggered_automatically_by_course_id?: InputMaybe<Scalars['String']['input']>;
  txt_body?: InputMaybe<Scalars['String']['input']>;
};


export type MutationaddExerciseArgs = {
  course?: InputMaybe<Scalars['ID']['input']>;
  custom_id?: InputMaybe<Scalars['String']['input']>;
  max_points?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  part?: InputMaybe<Scalars['Int']['input']>;
  section?: InputMaybe<Scalars['Int']['input']>;
  service?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationaddExerciseCompletionArgs = {
  exercise_id?: InputMaybe<Scalars['ID']['input']>;
  n_points?: InputMaybe<Scalars['Int']['input']>;
  original_submission_date?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp?: InputMaybe<Scalars['DateTime']['input']>;
  user_id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationaddImageArgs = {
  base64?: InputMaybe<Scalars['Boolean']['input']>;
  file: Scalars['Upload']['input'];
};


export type MutationaddManualCompletionArgs = {
  completions?: InputMaybe<Array<ManualCompletionArg>>;
  course_id?: InputMaybe<Scalars['ID']['input']>;
  course_slug?: InputMaybe<Scalars['String']['input']>;
};


export type MutationaddOpenUniversityRegistrationLinkArgs = {
  course: Scalars['ID']['input'];
  course_code: Scalars['String']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
};


export type MutationaddOrganizationArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  slug: Scalars['String']['input'];
};


export type MutationaddServiceArgs = {
  name: Scalars['String']['input'];
  url: Scalars['String']['input'];
};


export type MutationaddStudyModuleArgs = {
  study_module: StudyModuleCreateArg;
};


export type MutationaddStudyModuleTranslationArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  language: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  study_module: Scalars['ID']['input'];
};


export type MutationaddUserArgs = {
  user: UserCreateArg;
};


export type MutationaddUserCourseProgressArgs = {
  course_id: Scalars['ID']['input'];
  extra?: InputMaybe<Scalars['JSON']['input']>;
  max_points?: InputMaybe<Scalars['Float']['input']>;
  n_points?: InputMaybe<Scalars['Float']['input']>;
  progress?: InputMaybe<Array<PointsByGroupInput>>;
  user_id: Scalars['ID']['input'];
};


export type MutationaddUserCourseServiceProgressArgs = {
  progress: PointsByGroupInput;
  service_id: Scalars['ID']['input'];
  user_course_progress_id: Scalars['ID']['input'];
};


export type MutationaddUserOrganizationArgs = {
  language?: InputMaybe<Scalars['String']['input']>;
  organization_id?: InputMaybe<Scalars['ID']['input']>;
  organization_slug?: InputMaybe<Scalars['String']['input']>;
  organizational_email?: InputMaybe<Scalars['String']['input']>;
  organizational_identifier?: InputMaybe<Scalars['String']['input']>;
  redirect?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationaddVerifiedUserArgs = {
  verified_user: VerifiedUserArg;
};


export type MutationconfirmUserOrganizationJoinArgs = {
  code: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type MutationcreateCourseStatsSubscriptionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationcreateRegistrationAttemptDateArgs = {
  completion_registration_attempt_date: Scalars['DateTime']['input'];
  id: Scalars['ID']['input'];
};


export type MutationcreateSponsorArgs = {
  data: SponsorCreateInput;
};


export type MutationcreateSponsorImageArgs = {
  data: SponsorImageUpsertInput;
};


export type MutationcreateTagArgs = {
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  translations?: InputMaybe<Array<TagTranslationCreateOrUpdateInput>>;
  types?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationcreateTagTranslationArgs = {
  abbreviation?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  language: Scalars['String']['input'];
  name: Scalars['String']['input'];
  tag_id: Scalars['String']['input'];
};


export type MutationcreateTagTypeArgs = {
  name: Scalars['String']['input'];
};


export type MutationdeleteCourseArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type MutationdeleteCourseOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationdeleteCourseStatsSubscriptionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationdeleteCourseTranslationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationdeleteCourseVariantArgs = {
  id: Scalars['ID']['input'];
};


export type MutationdeleteEmailTemplateArgs = {
  id: Scalars['ID']['input'];
};


export type MutationdeleteImageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationdeleteStudyModuleArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type MutationdeleteStudyModuleTranslationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationdeleteTagArgs = {
  id: Scalars['String']['input'];
};


export type MutationdeleteTagTranslationArgs = {
  language: Scalars['String']['input'];
  tag_id: Scalars['String']['input'];
};


export type MutationdeleteTagTypeArgs = {
  name: Scalars['String']['input'];
};


export type MutationdeleteUserOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationrecheckCompletionsArgs = {
  course_id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type MutationregisterCompletionArgs = {
  completions: Array<CompletionArg>;
};


export type MutationrequestNewUserOrganizationJoinConfirmationArgs = {
  id: Scalars['ID']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
  organizational_email?: InputMaybe<Scalars['String']['input']>;
  redirect?: InputMaybe<Scalars['String']['input']>;
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
  course?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  instructions?: InputMaybe<Scalars['String']['input']>;
  language: Scalars['String']['input'];
  link?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationupdateCourseVariantArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type MutationupdateEmailTemplateArgs = {
  course_instance_language?: InputMaybe<Scalars['String']['input']>;
  exercise_completions_threshold?: InputMaybe<Scalars['Int']['input']>;
  html_body?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  points_threshold?: InputMaybe<Scalars['Int']['input']>;
  template_type?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  triggered_automatically_by_course_id?: InputMaybe<Scalars['String']['input']>;
  txt_body?: InputMaybe<Scalars['String']['input']>;
};


export type MutationupdateOpenUniversityRegistrationLinkArgs = {
  course: Scalars['ID']['input'];
  course_code?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
};


export type MutationupdateOrganizationEmailTemplateArgs = {
  email_template_id: Scalars['ID']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type MutationupdateResearchConsentArgs = {
  value: Scalars['Boolean']['input'];
};


export type MutationupdateServiceArgs = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};


export type MutationupdateSponsorArgs = {
  data: SponsorUpsertInput;
  id: Scalars['String']['input'];
};


export type MutationupdateStudyModuleArgs = {
  study_module: StudyModuleUpsertArg;
};


export type MutationupdateStudyModuletranslationArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  study_module: Scalars['ID']['input'];
};


export type MutationupdateTagArgs = {
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['String']['input'];
  translations?: InputMaybe<Array<TagTranslationCreateOrUpdateInput>>;
  types?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationupdateTagTranslationArgs = {
  abbreviation?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  language: Scalars['String']['input'];
  name: Scalars['String']['input'];
  tag_id: Scalars['String']['input'];
};


export type MutationupdateTagTypeArgs = {
  name: Scalars['String']['input'];
};


export type MutationupdateUserArgs = {
  user: UserUpdateArg;
};


export type MutationupdateUserNameArgs = {
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationupdateUserOrganizationConsentArgs = {
  consented?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationupdateUserOrganizationOrganizationalMailArgs = {
  id: Scalars['ID']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
  organizational_email: Scalars['String']['input'];
  redirect?: InputMaybe<Scalars['String']['input']>;
};

export type NestedBoolFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolFilter>;
};

export type NestedBoolNullableFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolNullableFilter>;
};

export type NestedDateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type NestedDateTimeNullableFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type NestedEnumCourseStatusNullableFilter = {
  equals?: InputMaybe<CourseStatus>;
  in?: InputMaybe<Array<CourseStatus>>;
  not?: InputMaybe<NestedEnumCourseStatusNullableFilter>;
  notIn?: InputMaybe<Array<CourseStatus>>;
};

export type NestedEnumOrganizationRoleNullableFilter = {
  equals?: InputMaybe<OrganizationRole>;
  in?: InputMaybe<Array<OrganizationRole>>;
  not?: InputMaybe<NestedEnumOrganizationRoleNullableFilter>;
  notIn?: InputMaybe<Array<OrganizationRole>>;
};

export type NestedFloatNullableFilter = {
  equals?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  not?: InputMaybe<NestedFloatNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type NestedIntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type NestedIntNullableFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type NestedStringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type NestedStringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type NestedUuidFilter = {
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedUuidFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type NestedUuidNullableFilter = {
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedUuidNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export enum NullsOrder {
  first = 'first',
  last = 'last'
}

export type OpenUniversityRegistrationLink = {
  __typename?: 'OpenUniversityRegistrationLink';
  course: Maybe<Course>;
  course_code: Scalars['String']['output'];
  course_id: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  language: Scalars['String']['output'];
  link: Maybe<Scalars['String']['output']>;
  start_date: Maybe<Scalars['DateTime']['output']>;
  stop_date: Maybe<Scalars['DateTime']['output']>;
  tiers: Maybe<Scalars['Json']['output']>;
  updated_at: Scalars['DateTime']['output'];
};

export type OpenUniversityRegistrationLinkCreateInput = {
  course_code: Scalars['String']['input'];
  language: Scalars['String']['input'];
  link?: InputMaybe<Scalars['String']['input']>;
  start_date?: InputMaybe<Scalars['DateTime']['input']>;
  stop_date?: InputMaybe<Scalars['DateTime']['input']>;
  tiers?: InputMaybe<Array<Scalars['JSON']['input']>>;
};

export type OpenUniversityRegistrationLinkListRelationFilter = {
  every?: InputMaybe<OpenUniversityRegistrationLinkWhereInput>;
  none?: InputMaybe<OpenUniversityRegistrationLinkWhereInput>;
  some?: InputMaybe<OpenUniversityRegistrationLinkWhereInput>;
};

export type OpenUniversityRegistrationLinkOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type OpenUniversityRegistrationLinkUpsertInput = {
  course_code: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  language: Scalars['String']['input'];
  link?: InputMaybe<Scalars['String']['input']>;
  start_date?: InputMaybe<Scalars['DateTime']['input']>;
  stop_date?: InputMaybe<Scalars['DateTime']['input']>;
  tiers?: InputMaybe<Array<Scalars['JSON']['input']>>;
};

export type OpenUniversityRegistrationLinkWhereInput = {
  AND?: InputMaybe<Array<OpenUniversityRegistrationLinkWhereInput>>;
  NOT?: InputMaybe<Array<OpenUniversityRegistrationLinkWhereInput>>;
  OR?: InputMaybe<Array<OpenUniversityRegistrationLinkWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_code?: InputMaybe<StringFilter>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<UuidFilter>;
  language?: InputMaybe<StringFilter>;
  link?: InputMaybe<StringNullableFilter>;
  start_date?: InputMaybe<DateTimeNullableFilter>;
  stop_date?: InputMaybe<DateTimeNullableFilter>;
  tiers?: InputMaybe<JsonNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type OpenUniversityRegistrationLinkWhereUniqueInput = {
  AND?: InputMaybe<Array<OpenUniversityRegistrationLinkWhereInput>>;
  NOT?: InputMaybe<Array<OpenUniversityRegistrationLinkWhereInput>>;
  OR?: InputMaybe<Array<OpenUniversityRegistrationLinkWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_code?: InputMaybe<StringFilter>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<StringFilter>;
  link?: InputMaybe<StringNullableFilter>;
  start_date?: InputMaybe<DateTimeNullableFilter>;
  stop_date?: InputMaybe<DateTimeNullableFilter>;
  tiers?: InputMaybe<JsonNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type Organization = {
  __typename?: 'Organization';
  completions_registered: Array<CompletionRegistered>;
  contact_information: Maybe<Scalars['String']['output']>;
  course_organizations: Array<CourseOrganization>;
  courses: Array<Course>;
  created_at: Scalars['DateTime']['output'];
  creator: Maybe<User>;
  creator_id: Maybe<Scalars['String']['output']>;
  disabled: Maybe<Scalars['Boolean']['output']>;
  disabled_reason: Maybe<Scalars['String']['output']>;
  email: Maybe<Scalars['String']['output']>;
  hidden: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['String']['output'];
  information: Maybe<Scalars['String']['output']>;
  join_organization_email_template: Maybe<EmailTemplate>;
  join_organization_email_template_id: Maybe<Scalars['String']['output']>;
  logo_content_type: Maybe<Scalars['String']['output']>;
  logo_file_name: Maybe<Scalars['String']['output']>;
  logo_file_size: Maybe<Scalars['Int']['output']>;
  logo_updated_at: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  organization_translations: Array<OrganizationTranslation>;
  phone: Maybe<Scalars['String']['output']>;
  pinned: Maybe<Scalars['Boolean']['output']>;
  /** Whether this organization requires email confirmation to join. */
  required_confirmation: Maybe<Scalars['Boolean']['output']>;
  /** Optional regex pattern to use when joining organization or changing organizational email. */
  required_organization_email: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  tmc_created_at: Maybe<Scalars['DateTime']['output']>;
  tmc_updated_at: Maybe<Scalars['DateTime']['output']>;
  updated_at: Scalars['DateTime']['output'];
  user_organizations: Array<UserOrganization>;
  verified: Maybe<Scalars['Boolean']['output']>;
  verified_at: Maybe<Scalars['DateTime']['output']>;
  verified_users: Array<VerifiedUser>;
  website: Maybe<Scalars['String']['output']>;
};


export type Organizationcompletions_registeredArgs = {
  cursor?: InputMaybe<CompletionRegisteredWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type Organizationcourse_organizationsArgs = {
  cursor?: InputMaybe<CourseOrganizationWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type OrganizationcoursesArgs = {
  cursor?: InputMaybe<CourseWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type Organizationorganization_translationsArgs = {
  cursor?: InputMaybe<OrganizationTranslationWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type Organizationuser_organizationsArgs = {
  cursor?: InputMaybe<UserOrganizationWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type Organizationverified_usersArgs = {
  cursor?: InputMaybe<VerifiedUserWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type OrganizationListRelationFilter = {
  every?: InputMaybe<OrganizationWhereInput>;
  none?: InputMaybe<OrganizationWhereInput>;
  some?: InputMaybe<OrganizationWhereInput>;
};

export type OrganizationOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export enum OrganizationOrderByRelevanceFieldEnum {
  contact_information = 'contact_information',
  creator_id = 'creator_id',
  disabled_reason = 'disabled_reason',
  email = 'email',
  id = 'id',
  information = 'information',
  join_organization_email_template_id = 'join_organization_email_template_id',
  logo_content_type = 'logo_content_type',
  logo_file_name = 'logo_file_name',
  name = 'name',
  phone = 'phone',
  required_organization_email = 'required_organization_email',
  secret_key = 'secret_key',
  slug = 'slug',
  website = 'website'
}

export type OrganizationOrderByRelevanceInput = {
  fields: OrganizationOrderByRelevanceFieldEnum;
  search: Scalars['String']['input'];
  sort: SortOrder;
};

export type OrganizationOrderByWithRelationAndSearchRelevanceInput = {
  _relevance?: InputMaybe<OrganizationOrderByRelevanceInput>;
  completions_registered?: InputMaybe<CompletionRegisteredOrderByRelationAggregateInput>;
  contact_information?: InputMaybe<SortOrderInput>;
  course_organizations?: InputMaybe<CourseOrganizationOrderByRelationAggregateInput>;
  courses?: InputMaybe<CourseOrderByRelationAggregateInput>;
  created_at?: InputMaybe<SortOrder>;
  creator?: InputMaybe<UserOrderByWithRelationAndSearchRelevanceInput>;
  creator_id?: InputMaybe<SortOrderInput>;
  disabled?: InputMaybe<SortOrderInput>;
  disabled_reason?: InputMaybe<SortOrderInput>;
  email?: InputMaybe<SortOrderInput>;
  email_deliveries?: InputMaybe<EmailDeliveryOrderByRelationAggregateInput>;
  hidden?: InputMaybe<SortOrderInput>;
  id?: InputMaybe<SortOrder>;
  information?: InputMaybe<SortOrderInput>;
  join_organization_email_template?: InputMaybe<EmailTemplateOrderByWithRelationAndSearchRelevanceInput>;
  join_organization_email_template_id?: InputMaybe<SortOrderInput>;
  logo_content_type?: InputMaybe<SortOrderInput>;
  logo_file_name?: InputMaybe<SortOrderInput>;
  logo_file_size?: InputMaybe<SortOrderInput>;
  logo_updated_at?: InputMaybe<SortOrderInput>;
  name?: InputMaybe<SortOrder>;
  organization_translations?: InputMaybe<OrganizationTranslationOrderByRelationAggregateInput>;
  phone?: InputMaybe<SortOrderInput>;
  pinned?: InputMaybe<SortOrderInput>;
  required_confirmation?: InputMaybe<SortOrderInput>;
  required_organization_email?: InputMaybe<SortOrderInput>;
  secret_key?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SortOrder>;
  tmc_created_at?: InputMaybe<SortOrderInput>;
  tmc_updated_at?: InputMaybe<SortOrderInput>;
  updated_at?: InputMaybe<SortOrder>;
  user_organizations?: InputMaybe<UserOrganizationOrderByRelationAggregateInput>;
  verified?: InputMaybe<SortOrderInput>;
  verified_at?: InputMaybe<SortOrderInput>;
  verified_users?: InputMaybe<VerifiedUserOrderByRelationAggregateInput>;
  website?: InputMaybe<SortOrderInput>;
};

export enum OrganizationRole {
  OrganizationAdmin = 'OrganizationAdmin',
  Student = 'Student',
  Teacher = 'Teacher'
}

export type OrganizationTranslation = {
  __typename?: 'OrganizationTranslation';
  created_at: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  information: Maybe<Scalars['String']['output']>;
  language: Scalars['String']['output'];
  name: Scalars['String']['output'];
  organization: Maybe<Organization>;
  organization_id: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
};

export type OrganizationTranslationListRelationFilter = {
  every?: InputMaybe<OrganizationTranslationWhereInput>;
  none?: InputMaybe<OrganizationTranslationWhereInput>;
  some?: InputMaybe<OrganizationTranslationWhereInput>;
};

export type OrganizationTranslationOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type OrganizationTranslationWhereInput = {
  AND?: InputMaybe<Array<OrganizationTranslationWhereInput>>;
  NOT?: InputMaybe<Array<OrganizationTranslationWhereInput>>;
  OR?: InputMaybe<Array<OrganizationTranslationWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<UuidFilter>;
  information?: InputMaybe<StringNullableFilter>;
  language?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
  organization?: InputMaybe<OrganizationWhereInput>;
  organization_id?: InputMaybe<UuidNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type OrganizationTranslationWhereUniqueInput = {
  AND?: InputMaybe<Array<OrganizationTranslationWhereInput>>;
  NOT?: InputMaybe<Array<OrganizationTranslationWhereInput>>;
  OR?: InputMaybe<Array<OrganizationTranslationWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  information?: InputMaybe<StringNullableFilter>;
  language?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
  organization?: InputMaybe<OrganizationWhereInput>;
  organization_id?: InputMaybe<UuidNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type OrganizationWhereInput = {
  AND?: InputMaybe<Array<OrganizationWhereInput>>;
  NOT?: InputMaybe<Array<OrganizationWhereInput>>;
  OR?: InputMaybe<Array<OrganizationWhereInput>>;
  completions_registered?: InputMaybe<CompletionRegisteredListRelationFilter>;
  contact_information?: InputMaybe<StringNullableFilter>;
  course_organizations?: InputMaybe<CourseOrganizationListRelationFilter>;
  courses?: InputMaybe<CourseListRelationFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  creator?: InputMaybe<UserWhereInput>;
  creator_id?: InputMaybe<UuidNullableFilter>;
  disabled?: InputMaybe<BoolNullableFilter>;
  disabled_reason?: InputMaybe<StringNullableFilter>;
  email?: InputMaybe<StringNullableFilter>;
  email_deliveries?: InputMaybe<EmailDeliveryListRelationFilter>;
  hidden?: InputMaybe<BoolNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  information?: InputMaybe<StringNullableFilter>;
  join_organization_email_template?: InputMaybe<EmailTemplateWhereInput>;
  join_organization_email_template_id?: InputMaybe<UuidNullableFilter>;
  logo_content_type?: InputMaybe<StringNullableFilter>;
  logo_file_name?: InputMaybe<StringNullableFilter>;
  logo_file_size?: InputMaybe<IntNullableFilter>;
  logo_updated_at?: InputMaybe<DateTimeNullableFilter>;
  name?: InputMaybe<StringFilter>;
  organization_translations?: InputMaybe<OrganizationTranslationListRelationFilter>;
  phone?: InputMaybe<StringNullableFilter>;
  pinned?: InputMaybe<BoolNullableFilter>;
  required_confirmation?: InputMaybe<BoolNullableFilter>;
  required_organization_email?: InputMaybe<StringNullableFilter>;
  secret_key?: InputMaybe<StringFilter>;
  slug?: InputMaybe<StringFilter>;
  tmc_created_at?: InputMaybe<DateTimeNullableFilter>;
  tmc_updated_at?: InputMaybe<DateTimeNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user_organizations?: InputMaybe<UserOrganizationListRelationFilter>;
  verified?: InputMaybe<BoolNullableFilter>;
  verified_at?: InputMaybe<DateTimeNullableFilter>;
  verified_users?: InputMaybe<VerifiedUserListRelationFilter>;
  website?: InputMaybe<StringNullableFilter>;
};

export type OrganizationWhereUniqueInput = {
  AND?: InputMaybe<Array<OrganizationWhereInput>>;
  NOT?: InputMaybe<Array<OrganizationWhereInput>>;
  OR?: InputMaybe<Array<OrganizationWhereInput>>;
  completions_registered?: InputMaybe<CompletionRegisteredListRelationFilter>;
  contact_information?: InputMaybe<StringNullableFilter>;
  course_organizations?: InputMaybe<CourseOrganizationListRelationFilter>;
  courses?: InputMaybe<CourseListRelationFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  creator?: InputMaybe<UserWhereInput>;
  creator_id?: InputMaybe<UuidNullableFilter>;
  disabled?: InputMaybe<BoolNullableFilter>;
  disabled_reason?: InputMaybe<StringNullableFilter>;
  email?: InputMaybe<StringNullableFilter>;
  email_deliveries?: InputMaybe<EmailDeliveryListRelationFilter>;
  hidden?: InputMaybe<BoolNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  information?: InputMaybe<StringNullableFilter>;
  join_organization_email_template?: InputMaybe<EmailTemplateWhereInput>;
  join_organization_email_template_id?: InputMaybe<UuidNullableFilter>;
  logo_content_type?: InputMaybe<StringNullableFilter>;
  logo_file_name?: InputMaybe<StringNullableFilter>;
  logo_file_size?: InputMaybe<IntNullableFilter>;
  logo_updated_at?: InputMaybe<DateTimeNullableFilter>;
  name?: InputMaybe<StringFilter>;
  organization_translations?: InputMaybe<OrganizationTranslationListRelationFilter>;
  phone?: InputMaybe<StringNullableFilter>;
  pinned?: InputMaybe<BoolNullableFilter>;
  required_confirmation?: InputMaybe<BoolNullableFilter>;
  required_organization_email?: InputMaybe<StringNullableFilter>;
  secret_key?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  tmc_created_at?: InputMaybe<DateTimeNullableFilter>;
  tmc_updated_at?: InputMaybe<DateTimeNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user_organizations?: InputMaybe<UserOrganizationListRelationFilter>;
  verified?: InputMaybe<BoolNullableFilter>;
  verified_at?: InputMaybe<DateTimeNullableFilter>;
  verified_users?: InputMaybe<VerifiedUserListRelationFilter>;
  website?: InputMaybe<StringNullableFilter>;
};

/** PageInfo cursor, as defined in https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** The cursor corresponding to the last nodes in edges. Null if the connection is empty. */
  endCursor: Maybe<Scalars['String']['output']>;
  /** Used to indicate whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean']['output'];
  /** Used to indicate whether more edges exist prior to the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** The cursor corresponding to the first nodes in edges. Null if the connection is empty. */
  startCursor: Maybe<Scalars['String']['output']>;
};

export type PointsByGroup = {
  __typename?: 'PointsByGroup';
  group: Scalars['String']['output'];
  max_points: Scalars['Float']['output'];
  n_points: Scalars['Float']['output'];
  progress: Scalars['Float']['output'];
};

export type PointsByGroupInput = {
  group: Scalars['String']['input'];
  max_points: Scalars['Float']['input'];
  n_points: Scalars['Float']['input'];
  progress: Scalars['Float']['input'];
};

export type Progress = {
  __typename?: 'Progress';
  course: Maybe<Course>;
  course_id: Maybe<Scalars['ID']['output']>;
  user: Maybe<User>;
  user_course_progress: Maybe<UserCourseProgress>;
  user_course_service_progresses: Maybe<Array<UserCourseServiceProgress>>;
  user_id: Maybe<Scalars['ID']['output']>;
};

export type ProgressExtra = {
  __typename?: 'ProgressExtra';
  exercisePercentage: Scalars['Float']['output'];
  exercises: Array<TierProgress>;
  exercisesNeededPercentage: Scalars['Float']['output'];
  highestTier: Maybe<Scalars['Int']['output']>;
  max_points: Scalars['Float']['output'];
  n_points: Scalars['Float']['output'];
  pointsNeeded: Scalars['Float']['output'];
  pointsNeededPercentage: Scalars['Float']['output'];
  pointsPercentage: Scalars['Float']['output'];
  projectCompletion: Scalars['Boolean']['output'];
  tiers: Array<TierInfo>;
  totalExerciseCompletions: Scalars['Int']['output'];
  totalExerciseCompletionsNeeded: Scalars['Int']['output'];
  totalExerciseCount: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  completions: Maybe<Array<Completion>>;
  completionsPaginated: Maybe<QueryCompletionsPaginated_type_Connection>;
  completionsPaginated_type: QueryCompletionsPaginated_type_Connection;
  course: Maybe<Course>;
  courseAliases: Array<CourseAlias>;
  courseOrganizations: Maybe<Array<CourseOrganization>>;
  courseTranslations: Maybe<Array<CourseTranslation>>;
  courseVariant: Maybe<CourseVariant>;
  courseVariants: Maybe<Array<CourseVariant>>;
  course_exists: Scalars['Boolean']['output'];
  courses: Maybe<Array<Course>>;
  currentUser: Maybe<User>;
  email_template: Maybe<EmailTemplate>;
  email_templates: Maybe<Array<EmailTemplate>>;
  exercise: Maybe<Exercise>;
  exerciseCompletion: Maybe<ExerciseCompletion>;
  exerciseCompletions: Array<ExerciseCompletion>;
  exercises: Array<Exercise>;
  handlerCourses: Maybe<Array<Course>>;
  openUniversityRegistrationLink: Maybe<OpenUniversityRegistrationLink>;
  openUniversityRegistrationLinks: Array<OpenUniversityRegistrationLink>;
  /** Get organization by id or slug. Admins can also query hidden/disabled courses. Fields that can be queried is more limited on normal users. */
  organization: Maybe<Organization>;
  organizations: Maybe<Array<Organization>>;
  registeredCompletions: Maybe<Array<CompletionRegistered>>;
  service: Maybe<Service>;
  services: Array<Service>;
  sponsors: Maybe<Array<Sponsor>>;
  studyModuleTranslations: Array<StudyModuleTranslation>;
  study_module: Maybe<StudyModule>;
  study_module_exists: Maybe<Scalars['Boolean']['output']>;
  study_modules: Maybe<Array<StudyModule>>;
  tagTypes: Maybe<Array<TagType>>;
  tags: Maybe<Array<Tag>>;
  user: Maybe<User>;
  userCourseProgress: Maybe<UserCourseProgress>;
  userCourseProgresses: Maybe<Array<UserCourseProgress>>;
  userCourseServiceProgress: Maybe<UserCourseServiceProgress>;
  userCourseServiceProgresses: Array<UserCourseServiceProgress>;
  userCourseSetting: Maybe<UserCourseSetting>;
  userCourseSettingCount: Maybe<Scalars['Int']['output']>;
  userCourseSettings: QueryUserCourseSettings_Connection;
  userDetailsContains: QueryUserDetailsContains_Connection;
  userOrganizationJoinConfirmation: Maybe<UserOrganizationJoinConfirmation>;
  userOrganizations: Maybe<Array<UserOrganization>>;
  users: Array<User>;
};


export type QuerycompletionsArgs = {
  after?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['ID']['input']>;
  completion_language?: InputMaybe<Scalars['String']['input']>;
  course: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerycompletionsPaginatedArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  completion_language?: InputMaybe<Scalars['String']['input']>;
  course: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerycompletionsPaginated_typeArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  completion_language?: InputMaybe<Scalars['String']['input']>;
  course: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerycourseArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  translationFallback?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QuerycourseAliasesArgs = {
  cursor?: InputMaybe<CourseAliasWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerycourseOrganizationsArgs = {
  course_id?: InputMaybe<Scalars['ID']['input']>;
  organization_id?: InputMaybe<Scalars['ID']['input']>;
};


export type QuerycourseTranslationsArgs = {
  language?: InputMaybe<Scalars['String']['input']>;
};


export type QuerycourseVariantArgs = {
  id: Scalars['ID']['input'];
};


export type QuerycourseVariantsArgs = {
  course_id?: InputMaybe<Scalars['ID']['input']>;
};


export type Querycourse_existsArgs = {
  slug: Scalars['String']['input'];
};


export type QuerycoursesArgs = {
  handledBy?: InputMaybe<Scalars['String']['input']>;
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<Array<CourseOrderByWithRelationAndSearchRelevanceInput>>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Array<CourseStatus>>;
  tag_types?: InputMaybe<Array<Scalars['String']['input']>>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QuerycurrentUserArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};


export type Queryemail_templateArgs = {
  id: Scalars['ID']['input'];
};


export type QueryexerciseArgs = {
  id: Scalars['ID']['input'];
};


export type QueryexerciseCompletionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryexerciseCompletionsArgs = {
  cursor?: InputMaybe<ExerciseCompletionWhereUniqueInput>;
  orderBy?: InputMaybe<Array<ExerciseCompletionOrderByWithRelationAndSearchRelevanceInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryexercisesArgs = {
  cursor?: InputMaybe<ExerciseWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryopenUniversityRegistrationLinkArgs = {
  id: Scalars['ID']['input'];
};


export type QueryopenUniversityRegistrationLinksArgs = {
  cursor?: InputMaybe<OpenUniversityRegistrationLinkWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryorganizationArgs = {
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryorganizationsArgs = {
  cursor?: InputMaybe<OrganizationWhereUniqueInput>;
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  orderBy?: InputMaybe<Array<OrganizationOrderByWithRelationAndSearchRelevanceInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryregisteredCompletionsArgs = {
  course?: InputMaybe<Scalars['String']['input']>;
  cursor?: InputMaybe<CompletionRegisteredWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryserviceArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  service_id?: InputMaybe<Scalars['ID']['input']>;
};


export type QuerysponsorsArgs = {
  course_id?: InputMaybe<Scalars['ID']['input']>;
  course_slug?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
};


export type Querystudy_moduleArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  translationFallback?: InputMaybe<Scalars['Boolean']['input']>;
};


export type Querystudy_module_existsArgs = {
  slug: Scalars['String']['input'];
};


export type Querystudy_modulesArgs = {
  language?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<Array<StudyModuleOrderByWithRelationAndSearchRelevanceInput>>;
};


export type QuerytagsArgs = {
  excludeTagTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  includeHidden?: InputMaybe<Scalars['Boolean']['input']>;
  includeWithNoCourses?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryuserArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  upstream_id?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryuserCourseProgressArgs = {
  course_id: Scalars['ID']['input'];
  user_id: Scalars['ID']['input'];
};


export type QueryuserCourseProgressesArgs = {
  course_id?: InputMaybe<Scalars['ID']['input']>;
  course_slug?: InputMaybe<Scalars['String']['input']>;
  cursor?: InputMaybe<UserCourseProgressCursorInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  user_id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryuserCourseServiceProgressArgs = {
  course_id?: InputMaybe<Scalars['ID']['input']>;
  service_id?: InputMaybe<Scalars['ID']['input']>;
  user_id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryuserCourseServiceProgressesArgs = {
  cursor?: InputMaybe<UserCourseServiceProgressWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<QueryUserCourseServiceProgressesWhereInput>;
};


export type QueryuserCourseSettingArgs = {
  course_id: Scalars['ID']['input'];
  user_id: Scalars['ID']['input'];
};


export type QueryuserCourseSettingCountArgs = {
  course_id?: InputMaybe<Scalars['ID']['input']>;
  user_id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryuserCourseSettingsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  course_id?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  user_id?: InputMaybe<Scalars['ID']['input']>;
  user_upstream_id?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryuserDetailsContainsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryuserOrganizationJoinConfirmationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryuserOrganizationsArgs = {
  organization_id?: InputMaybe<Scalars['ID']['input']>;
  organization_slug?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryusersArgs = {
  cursor?: InputMaybe<UserWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryCompletionsPaginated_type_Connection = {
  __typename?: 'QueryCompletionsPaginated_type_Connection';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges: Array<CompletionEdge>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum QueryMode {
  default = 'default',
  insensitive = 'insensitive'
}

export type QueryUserCourseServiceProgressesWhereInput = {
  course_id?: InputMaybe<UuidNullableFilter>;
  service_id?: InputMaybe<UuidNullableFilter>;
  user_id?: InputMaybe<UuidNullableFilter>;
};

export type QueryUserCourseSettings_Connection = {
  __typename?: 'QueryUserCourseSettings_Connection';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges: Array<UserCourseSettingEdge>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryUserDetailsContains_Connection = {
  __typename?: 'QueryUserDetailsContains_Connection';
  count: Scalars['Int']['output'];
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges: Array<UserEdge>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo;
};


export type QueryUserDetailsContains_ConnectioncountArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};

export type Service = {
  __typename?: 'Service';
  courses: Array<Course>;
  created_at: Scalars['DateTime']['output'];
  exercises: Array<Exercise>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
  user_course_service_progresses: Array<UserCourseServiceProgress>;
};


export type ServicecoursesArgs = {
  cursor?: InputMaybe<CourseWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type ServiceexercisesArgs = {
  cursor?: InputMaybe<ExerciseWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type Serviceuser_course_service_progressesArgs = {
  cursor?: InputMaybe<UserCourseServiceProgressWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type ServiceListRelationFilter = {
  every?: InputMaybe<ServiceWhereInput>;
  none?: InputMaybe<ServiceWhereInput>;
  some?: InputMaybe<ServiceWhereInput>;
};

export type ServiceOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export enum ServiceOrderByRelevanceFieldEnum {
  id = 'id',
  name = 'name',
  url = 'url'
}

export type ServiceOrderByRelevanceInput = {
  fields: ServiceOrderByRelevanceFieldEnum;
  search: Scalars['String']['input'];
  sort: SortOrder;
};

export type ServiceOrderByWithRelationAndSearchRelevanceInput = {
  _relevance?: InputMaybe<ServiceOrderByRelevanceInput>;
  courses?: InputMaybe<CourseOrderByRelationAggregateInput>;
  created_at?: InputMaybe<SortOrder>;
  exercises?: InputMaybe<ExerciseOrderByRelationAggregateInput>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updated_at?: InputMaybe<SortOrder>;
  url?: InputMaybe<SortOrder>;
  user_course_service_progresses?: InputMaybe<UserCourseServiceProgressOrderByRelationAggregateInput>;
};

export type ServiceWhereInput = {
  AND?: InputMaybe<Array<ServiceWhereInput>>;
  NOT?: InputMaybe<Array<ServiceWhereInput>>;
  OR?: InputMaybe<Array<ServiceWhereInput>>;
  courses?: InputMaybe<CourseListRelationFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  exercises?: InputMaybe<ExerciseListRelationFilter>;
  id?: InputMaybe<UuidFilter>;
  name?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  url?: InputMaybe<StringFilter>;
  user_course_service_progresses?: InputMaybe<UserCourseServiceProgressListRelationFilter>;
};

export type ServiceWhereUniqueInput = {
  AND?: InputMaybe<Array<ServiceWhereInput>>;
  NOT?: InputMaybe<Array<ServiceWhereInput>>;
  OR?: InputMaybe<Array<ServiceWhereInput>>;
  courses?: InputMaybe<CourseListRelationFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  exercises?: InputMaybe<ExerciseListRelationFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  url?: InputMaybe<StringFilter>;
  user_course_service_progresses?: InputMaybe<UserCourseServiceProgressListRelationFilter>;
};

export enum SortOrder {
  asc = 'asc',
  desc = 'desc'
}

export type SortOrderInput = {
  nulls?: InputMaybe<NullsOrder>;
  sort: SortOrder;
};

export type Sponsor = {
  __typename?: 'Sponsor';
  courses: Array<CourseSponsor>;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  images: Maybe<Array<SponsorImage>>;
  language: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  order: Maybe<Scalars['Int']['output']>;
  translations: Array<SponsorTranslation>;
  updated_at: Scalars['DateTime']['output'];
};


export type SponsorcoursesArgs = {
  cursor?: InputMaybe<CourseSponsorWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type SponsorimagesArgs = {
  maxHeight?: InputMaybe<Scalars['Int']['input']>;
  maxWidth?: InputMaybe<Scalars['Int']['input']>;
  minHeight?: InputMaybe<Scalars['Int']['input']>;
  minWidth?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type SponsortranslationsArgs = {
  language?: InputMaybe<Scalars['String']['input']>;
};

export type SponsorCreateInput = {
  id: Scalars['String']['input'];
  images?: InputMaybe<Array<SponsorImageCreateInput>>;
  name: Scalars['String']['input'];
  translations?: InputMaybe<Array<SponsorTranslationCreateInput>>;
};

export type SponsorImage = {
  __typename?: 'SponsorImage';
  created_at: Scalars['DateTime']['output'];
  height: Scalars['Int']['output'];
  sponsor: Sponsor;
  sponsor_id: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  uri: Scalars['String']['output'];
  width: Scalars['Int']['output'];
};

export type SponsorImageCreateInput = {
  height: Scalars['Int']['input'];
  type: Scalars['String']['input'];
  uri: Scalars['String']['input'];
  width: Scalars['Int']['input'];
};

export type SponsorImageListRelationFilter = {
  every?: InputMaybe<SponsorImageWhereInput>;
  none?: InputMaybe<SponsorImageWhereInput>;
  some?: InputMaybe<SponsorImageWhereInput>;
};

export type SponsorImageUpsertInput = {
  height: Scalars['Int']['input'];
  sponsor_id: Scalars['String']['input'];
  type: Scalars['String']['input'];
  uri: Scalars['String']['input'];
  width: Scalars['Int']['input'];
};

export type SponsorImageWhereInput = {
  AND?: InputMaybe<Array<SponsorImageWhereInput>>;
  NOT?: InputMaybe<Array<SponsorImageWhereInput>>;
  OR?: InputMaybe<Array<SponsorImageWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  height?: InputMaybe<IntFilter>;
  sponsor?: InputMaybe<SponsorWhereInput>;
  sponsor_id?: InputMaybe<StringFilter>;
  type?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  uri?: InputMaybe<StringFilter>;
  width?: InputMaybe<IntFilter>;
};

export type SponsorTranslation = {
  __typename?: 'SponsorTranslation';
  created_at: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  language: Scalars['String']['output'];
  link: Maybe<Scalars['String']['output']>;
  link_text: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  sponsor: Sponsor;
  sponsor_id: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type SponsorTranslationCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  language: Scalars['String']['input'];
  link?: InputMaybe<Scalars['String']['input']>;
  link_text?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type SponsorTranslationListRelationFilter = {
  every?: InputMaybe<SponsorTranslationWhereInput>;
  none?: InputMaybe<SponsorTranslationWhereInput>;
  some?: InputMaybe<SponsorTranslationWhereInput>;
};

export type SponsorTranslationUpsertInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  language: Scalars['String']['input'];
  link?: InputMaybe<Scalars['String']['input']>;
  link_text?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  sponsor_id: Scalars['String']['input'];
};

export type SponsorTranslationWhereInput = {
  AND?: InputMaybe<Array<SponsorTranslationWhereInput>>;
  NOT?: InputMaybe<Array<SponsorTranslationWhereInput>>;
  OR?: InputMaybe<Array<SponsorTranslationWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringNullableFilter>;
  language?: InputMaybe<StringFilter>;
  link?: InputMaybe<StringNullableFilter>;
  link_text?: InputMaybe<StringNullableFilter>;
  name?: InputMaybe<StringFilter>;
  sponsor?: InputMaybe<SponsorWhereInput>;
  sponsor_id?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type SponsorUniqueInput = {
  id: Scalars['String']['input'];
};

export type SponsorUniqueWithOrderInput = {
  id: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
};

export type SponsorUpsertInput = {
  id: Scalars['String']['input'];
  images?: InputMaybe<Array<SponsorImageUpsertInput>>;
  name: Scalars['String']['input'];
  translations?: InputMaybe<Array<SponsorTranslationUpsertInput>>;
};

export type SponsorWhereInput = {
  AND?: InputMaybe<Array<SponsorWhereInput>>;
  NOT?: InputMaybe<Array<SponsorWhereInput>>;
  OR?: InputMaybe<Array<SponsorWhereInput>>;
  courses?: InputMaybe<CourseSponsorListRelationFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<StringFilter>;
  images?: InputMaybe<SponsorImageListRelationFilter>;
  name?: InputMaybe<StringFilter>;
  translations?: InputMaybe<SponsorTranslationListRelationFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type StoredData = {
  __typename?: 'StoredData';
  course: Course;
  course_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  data: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
  user: User;
  user_id: Scalars['String']['output'];
};

export type StoredDataListRelationFilter = {
  every?: InputMaybe<StoredDataWhereInput>;
  none?: InputMaybe<StoredDataWhereInput>;
  some?: InputMaybe<StoredDataWhereInput>;
};

export type StoredDataOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type StoredDataWhereInput = {
  AND?: InputMaybe<Array<StoredDataWhereInput>>;
  NOT?: InputMaybe<Array<StoredDataWhereInput>>;
  OR?: InputMaybe<Array<StoredDataWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  data?: InputMaybe<StringNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidFilter>;
};

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type StringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type StudyModule = {
  __typename?: 'StudyModule';
  courses: Maybe<Array<Course>>;
  created_at: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  image: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  order: Maybe<Scalars['Int']['output']>;
  slug: Scalars['String']['output'];
  study_module_translations: Array<StudyModuleTranslation>;
  updated_at: Scalars['DateTime']['output'];
};


export type StudyModulecoursesArgs = {
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<Array<CourseOrderByWithRelationAndSearchRelevanceInput>>;
  statuses?: InputMaybe<Array<CourseStatus>>;
};


export type StudyModulestudy_module_translationsArgs = {
  cursor?: InputMaybe<StudyModuleTranslationWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type StudyModuleCreateArg = {
  image?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  slug: Scalars['String']['input'];
  study_module_translations?: InputMaybe<Array<StudyModuleTranslationUpsertInput>>;
};

export type StudyModuleListRelationFilter = {
  every?: InputMaybe<StudyModuleWhereInput>;
  none?: InputMaybe<StudyModuleWhereInput>;
  some?: InputMaybe<StudyModuleWhereInput>;
};

export type StudyModuleOrderByInput = {
  id?: InputMaybe<SortOrder>;
  image?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  order?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SortOrder>;
};

export type StudyModuleOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export enum StudyModuleOrderByRelevanceFieldEnum {
  id = 'id',
  image = 'image',
  name = 'name',
  slug = 'slug'
}

export type StudyModuleOrderByRelevanceInput = {
  fields: StudyModuleOrderByRelevanceFieldEnum;
  search: Scalars['String']['input'];
  sort: SortOrder;
};

export type StudyModuleOrderByWithRelationAndSearchRelevanceInput = {
  _relevance?: InputMaybe<StudyModuleOrderByRelevanceInput>;
  courses?: InputMaybe<CourseOrderByRelationAggregateInput>;
  created_at?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  image?: InputMaybe<SortOrderInput>;
  name?: InputMaybe<SortOrder>;
  order?: InputMaybe<SortOrderInput>;
  slug?: InputMaybe<SortOrder>;
  study_module_translations?: InputMaybe<StudyModuleTranslationOrderByRelationAggregateInput>;
  updated_at?: InputMaybe<SortOrder>;
};

export type StudyModuleTranslation = {
  __typename?: 'StudyModuleTranslation';
  created_at: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  language: Scalars['String']['output'];
  name: Scalars['String']['output'];
  study_module: Maybe<StudyModule>;
  study_module_id: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
};

export type StudyModuleTranslationCreateInput = {
  description: Scalars['String']['input'];
  language: Scalars['String']['input'];
  name: Scalars['String']['input'];
  study_module?: InputMaybe<Scalars['ID']['input']>;
};

export type StudyModuleTranslationListRelationFilter = {
  every?: InputMaybe<StudyModuleTranslationWhereInput>;
  none?: InputMaybe<StudyModuleTranslationWhereInput>;
  some?: InputMaybe<StudyModuleTranslationWhereInput>;
};

export type StudyModuleTranslationOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type StudyModuleTranslationUpsertInput = {
  description: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  language: Scalars['String']['input'];
  name: Scalars['String']['input'];
  study_module?: InputMaybe<Scalars['ID']['input']>;
};

export type StudyModuleTranslationWhereInput = {
  AND?: InputMaybe<Array<StudyModuleTranslationWhereInput>>;
  NOT?: InputMaybe<Array<StudyModuleTranslationWhereInput>>;
  OR?: InputMaybe<Array<StudyModuleTranslationWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<UuidFilter>;
  language?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
  study_module?: InputMaybe<StudyModuleWhereInput>;
  study_module_id?: InputMaybe<UuidNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type StudyModuleTranslationWhereUniqueInput = {
  AND?: InputMaybe<Array<StudyModuleTranslationWhereInput>>;
  NOT?: InputMaybe<Array<StudyModuleTranslationWhereInput>>;
  OR?: InputMaybe<Array<StudyModuleTranslationWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
  study_module?: InputMaybe<StudyModuleWhereInput>;
  study_module_id?: InputMaybe<UuidNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type StudyModuleUpsertArg = {
  id?: InputMaybe<Scalars['ID']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  new_slug?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  slug: Scalars['String']['input'];
  study_module_translations?: InputMaybe<Array<StudyModuleTranslationUpsertInput>>;
};

export type StudyModuleWhereInput = {
  AND?: InputMaybe<Array<StudyModuleWhereInput>>;
  NOT?: InputMaybe<Array<StudyModuleWhereInput>>;
  OR?: InputMaybe<Array<StudyModuleWhereInput>>;
  courses?: InputMaybe<CourseListRelationFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<UuidFilter>;
  image?: InputMaybe<StringNullableFilter>;
  name?: InputMaybe<StringFilter>;
  order?: InputMaybe<IntNullableFilter>;
  slug?: InputMaybe<StringFilter>;
  study_module_translations?: InputMaybe<StudyModuleTranslationListRelationFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type StudyModuleWhereUniqueInput = {
  AND?: InputMaybe<Array<StudyModuleWhereInput>>;
  NOT?: InputMaybe<Array<StudyModuleWhereInput>>;
  OR?: InputMaybe<Array<StudyModuleWhereInput>>;
  courses?: InputMaybe<CourseListRelationFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<StringNullableFilter>;
  name?: InputMaybe<StringFilter>;
  order?: InputMaybe<IntNullableFilter>;
  slug?: InputMaybe<Scalars['String']['input']>;
  study_module_translations?: InputMaybe<StudyModuleTranslationListRelationFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  userSearch: UserSearch;
};


export type SubscriptionuserSearchArgs = {
  fields?: InputMaybe<Array<UserSearchField>>;
  search: Scalars['String']['input'];
};

export type Tag = {
  __typename?: 'Tag';
  abbreviation: Maybe<Scalars['String']['output']>;
  courses: Array<Course>;
  created_at: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  hidden: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  language: Maybe<Scalars['String']['output']>;
  name: Maybe<Scalars['String']['output']>;
  tag_translations: Array<TagTranslation>;
  tag_types: Array<TagType>;
  types: Maybe<Array<Scalars['String']['output']>>;
  updated_at: Scalars['DateTime']['output'];
};


export type TagcoursesArgs = {
  cursor?: InputMaybe<CourseWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type Tagtag_translationsArgs = {
  cursor?: InputMaybe<TagTranslationWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type Tagtag_typesArgs = {
  cursor?: InputMaybe<TagTypeWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type TagCreateInput = {
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['String']['input'];
  tag_translations?: InputMaybe<Array<TagTranslationCreateOrUpdateInput>>;
  types?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type TagListRelationFilter = {
  every?: InputMaybe<TagWhereInput>;
  none?: InputMaybe<TagWhereInput>;
  some?: InputMaybe<TagWhereInput>;
};

export type TagOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type TagTranslation = {
  __typename?: 'TagTranslation';
  abbreviation: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  language: Scalars['String']['output'];
  name: Scalars['String']['output'];
  tag: Tag;
  tag_id: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type TagTranslationCreateOrUpdateInput = {
  abbreviation?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  language: Scalars['String']['input'];
  name: Scalars['String']['input'];
  tag_id?: InputMaybe<Scalars['String']['input']>;
};

export type TagTranslationListRelationFilter = {
  every?: InputMaybe<TagTranslationWhereInput>;
  none?: InputMaybe<TagTranslationWhereInput>;
  some?: InputMaybe<TagTranslationWhereInput>;
};

export type TagTranslationNameLanguageCompoundUniqueInput = {
  language: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type TagTranslationTag_idLanguageCompoundUniqueInput = {
  language: Scalars['String']['input'];
  tag_id: Scalars['String']['input'];
};

export type TagTranslationWhereInput = {
  AND?: InputMaybe<Array<TagTranslationWhereInput>>;
  NOT?: InputMaybe<Array<TagTranslationWhereInput>>;
  OR?: InputMaybe<Array<TagTranslationWhereInput>>;
  abbreviation?: InputMaybe<StringNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringNullableFilter>;
  language?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
  tag?: InputMaybe<TagWhereInput>;
  tag_id?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type TagTranslationWhereUniqueInput = {
  AND?: InputMaybe<Array<TagTranslationWhereInput>>;
  NOT?: InputMaybe<Array<TagTranslationWhereInput>>;
  OR?: InputMaybe<Array<TagTranslationWhereInput>>;
  abbreviation?: InputMaybe<StringNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringNullableFilter>;
  language?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
  name_language?: InputMaybe<TagTranslationNameLanguageCompoundUniqueInput>;
  tag?: InputMaybe<TagWhereInput>;
  tag_id?: InputMaybe<StringFilter>;
  tag_id_language?: InputMaybe<TagTranslationTag_idLanguageCompoundUniqueInput>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type TagType = {
  __typename?: 'TagType';
  created_at: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
  tags: Array<Tag>;
  updated_at: Scalars['DateTime']['output'];
};


export type TagTypetagsArgs = {
  cursor?: InputMaybe<TagWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type TagTypeListRelationFilter = {
  every?: InputMaybe<TagTypeWhereInput>;
  none?: InputMaybe<TagTypeWhereInput>;
  some?: InputMaybe<TagTypeWhereInput>;
};

export type TagTypeWhereInput = {
  AND?: InputMaybe<Array<TagTypeWhereInput>>;
  NOT?: InputMaybe<Array<TagTypeWhereInput>>;
  OR?: InputMaybe<Array<TagTypeWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  name?: InputMaybe<StringFilter>;
  tags?: InputMaybe<TagListRelationFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type TagTypeWhereUniqueInput = {
  AND?: InputMaybe<Array<TagTypeWhereInput>>;
  NOT?: InputMaybe<Array<TagTypeWhereInput>>;
  OR?: InputMaybe<Array<TagTypeWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  name?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<TagListRelationFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type TagUpsertInput = {
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['String']['input'];
  tag_translations?: InputMaybe<Array<TagTranslationCreateOrUpdateInput>>;
  types?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type TagWhereInput = {
  AND?: InputMaybe<Array<TagWhereInput>>;
  NOT?: InputMaybe<Array<TagWhereInput>>;
  OR?: InputMaybe<Array<TagWhereInput>>;
  courses?: InputMaybe<CourseListRelationFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  hidden?: InputMaybe<BoolFilter>;
  id?: InputMaybe<StringFilter>;
  tag_translations?: InputMaybe<TagTranslationListRelationFilter>;
  tag_types?: InputMaybe<TagTypeListRelationFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type TagWhereUniqueInput = {
  AND?: InputMaybe<Array<TagWhereInput>>;
  NOT?: InputMaybe<Array<TagWhereInput>>;
  OR?: InputMaybe<Array<TagWhereInput>>;
  courses?: InputMaybe<CourseListRelationFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  hidden?: InputMaybe<BoolFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  tag_translations?: InputMaybe<TagTranslationListRelationFilter>;
  tag_types?: InputMaybe<TagTypeListRelationFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type TierInfo = {
  __typename?: 'TierInfo';
  exerciseCompletions: Scalars['Int']['output'];
  exerciseCount: Scalars['Int']['output'];
  exercisePercentage: Scalars['Float']['output'];
  exercisesNeededPercentage: Scalars['Float']['output'];
  hasTier: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  missingFromTier: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  requiredByTier: Scalars['Int']['output'];
  tier: Scalars['Int']['output'];
};

export type TierProgress = {
  __typename?: 'TierProgress';
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']['output']>;
  custom_id: Maybe<Scalars['String']['output']>;
  exercise: Maybe<Exercise>;
  exercise_completions: Maybe<Array<ExerciseCompletion>>;
  exercise_id: Maybe<Scalars['ID']['output']>;
  exercise_number: Scalars['Int']['output'];
  max_points: Scalars['Float']['output'];
  n_points: Scalars['Float']['output'];
  name: Maybe<Scalars['String']['output']>;
  progress: Scalars['Float']['output'];
  service: Maybe<Service>;
  service_id: Maybe<Scalars['String']['output']>;
  tier: Scalars['Int']['output'];
  user_id: Scalars['String']['output'];
};


export type TierProgressexercise_completionsArgs = {
  attempted?: InputMaybe<Scalars['Boolean']['input']>;
  completed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type User = {
  __typename?: 'User';
  ab_enrollments: Array<AbEnrollment>;
  administrator: Scalars['Boolean']['output'];
  completions: Maybe<Array<Completion>>;
  completions_registered: Maybe<Array<CompletionRegistered>>;
  course_ownerships: Array<CourseOwnership>;
  course_stats_subscriptions: Array<CourseStatsSubscription>;
  created_at: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  email_deliveries: Array<EmailDelivery>;
  exercise_completions: Maybe<Array<ExerciseCompletion>>;
  first_name: Maybe<Scalars['String']['output']>;
  full_name: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  last_name: Maybe<Scalars['String']['output']>;
  organizations: Array<Organization>;
  progress: Progress;
  progresses: Maybe<Array<Progress>>;
  project_completion: Scalars['Boolean']['output'];
  real_student_number: Maybe<Scalars['String']['output']>;
  research_consent: Maybe<Scalars['Boolean']['output']>;
  student_number: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
  upstream_id: Scalars['Int']['output'];
  user_course_progresses: Maybe<Array<UserCourseProgress>>;
  /** @deprecated Use user_course_progresses instead */
  user_course_progressess: Maybe<UserCourseProgress>;
  user_course_service_progresses: Maybe<Array<UserCourseServiceProgress>>;
  user_course_settings: Array<UserCourseSetting>;
  user_course_summary: Maybe<Array<UserCourseSummary>>;
  user_organizations: Array<UserOrganization>;
  username: Scalars['String']['output'];
  verified_users: Array<VerifiedUser>;
};


export type Userab_enrollmentsArgs = {
  cursor?: InputMaybe<AbEnrollmentWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type UsercompletionsArgs = {
  course_id?: InputMaybe<Scalars['String']['input']>;
  course_slug?: InputMaybe<Scalars['String']['input']>;
};


export type Usercompletions_registeredArgs = {
  course_id?: InputMaybe<Scalars['String']['input']>;
  course_slug?: InputMaybe<Scalars['String']['input']>;
  organization_id?: InputMaybe<Scalars['String']['input']>;
};


export type Usercourse_ownershipsArgs = {
  cursor?: InputMaybe<CourseOwnershipWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type Usercourse_stats_subscriptionsArgs = {
  cursor?: InputMaybe<CourseStatsSubscriptionWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type Useremail_deliveriesArgs = {
  cursor?: InputMaybe<EmailDeliveryWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type Userexercise_completionsArgs = {
  attempted?: InputMaybe<Scalars['Boolean']['input']>;
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  course_id?: InputMaybe<Scalars['ID']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type UserorganizationsArgs = {
  cursor?: InputMaybe<OrganizationWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type UserprogressArgs = {
  course_id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type Userproject_completionArgs = {
  course_id?: InputMaybe<Scalars['ID']['input']>;
  course_slug?: InputMaybe<Scalars['String']['input']>;
};


export type Useruser_course_progressessArgs = {
  course_id?: InputMaybe<Scalars['ID']['input']>;
};


export type Useruser_course_settingsArgs = {
  cursor?: InputMaybe<UserCourseSettingWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type Useruser_course_summaryArgs = {
  course_id?: InputMaybe<Scalars['ID']['input']>;
  course_slug?: InputMaybe<Scalars['String']['input']>;
  includeDeletedExercises?: InputMaybe<Scalars['Boolean']['input']>;
  includeNoPointsAwardedExercises?: InputMaybe<Scalars['Boolean']['input']>;
  orderBy?: InputMaybe<UserCourseSummaryOrderByInput>;
};


export type Useruser_organizationsArgs = {
  cursor?: InputMaybe<UserOrganizationWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type Userverified_usersArgs = {
  cursor?: InputMaybe<VerifiedUserWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type UserAppDatumConfig = {
  __typename?: 'UserAppDatumConfig';
  created_at: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  name: Maybe<Scalars['String']['output']>;
  timestamp: Maybe<Scalars['DateTime']['output']>;
  updated_at: Scalars['DateTime']['output'];
};

export type UserCourseProgress = {
  __typename?: 'UserCourseProgress';
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  exercise_progress: ExerciseProgress;
  extra: Maybe<ProgressExtra>;
  id: Scalars['String']['output'];
  max_points: Maybe<Scalars['Float']['output']>;
  n_points: Maybe<Scalars['Float']['output']>;
  points_by_group: Array<PointsByGroup>;
  /** @deprecated use points_by_group */
  progress: Maybe<Array<Scalars['JSON']['output']>>;
  updated_at: Scalars['DateTime']['output'];
  user: Maybe<User>;
  user_course_service_progresses: Array<UserCourseServiceProgress>;
  user_course_settings: Maybe<UserCourseSetting>;
  user_id: Maybe<Scalars['String']['output']>;
};


export type UserCourseProgressuser_course_service_progressesArgs = {
  cursor?: InputMaybe<UserCourseServiceProgressWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type UserCourseProgressCursorInput = {
  id: Scalars['ID']['input'];
};

export type UserCourseProgressListRelationFilter = {
  every?: InputMaybe<UserCourseProgressWhereInput>;
  none?: InputMaybe<UserCourseProgressWhereInput>;
  some?: InputMaybe<UserCourseProgressWhereInput>;
};

export type UserCourseProgressOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type UserCourseProgressWhereInput = {
  AND?: InputMaybe<Array<UserCourseProgressWhereInput>>;
  NOT?: InputMaybe<Array<UserCourseProgressWhereInput>>;
  OR?: InputMaybe<Array<UserCourseProgressWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  extra?: InputMaybe<JsonNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  max_points?: InputMaybe<FloatNullableFilter>;
  n_points?: InputMaybe<FloatNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_course_service_progresses?: InputMaybe<UserCourseServiceProgressListRelationFilter>;
  user_id?: InputMaybe<UuidNullableFilter>;
};

export type UserCourseServiceProgress = {
  __typename?: 'UserCourseServiceProgress';
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  points_by_group: Array<PointsByGroup>;
  progress: Scalars['Json']['output'];
  service: Maybe<Service>;
  service_id: Maybe<Scalars['String']['output']>;
  timestamp: Maybe<Scalars['DateTime']['output']>;
  updated_at: Scalars['DateTime']['output'];
  user: Maybe<User>;
  user_course_progress: Maybe<UserCourseProgress>;
  user_course_progress_id: Maybe<Scalars['String']['output']>;
  user_id: Maybe<Scalars['String']['output']>;
};

export type UserCourseServiceProgressListRelationFilter = {
  every?: InputMaybe<UserCourseServiceProgressWhereInput>;
  none?: InputMaybe<UserCourseServiceProgressWhereInput>;
  some?: InputMaybe<UserCourseServiceProgressWhereInput>;
};

export type UserCourseServiceProgressOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type UserCourseServiceProgressWhereInput = {
  AND?: InputMaybe<Array<UserCourseServiceProgressWhereInput>>;
  NOT?: InputMaybe<Array<UserCourseServiceProgressWhereInput>>;
  OR?: InputMaybe<Array<UserCourseServiceProgressWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<UuidFilter>;
  service?: InputMaybe<ServiceWhereInput>;
  service_id?: InputMaybe<UuidNullableFilter>;
  timestamp?: InputMaybe<DateTimeNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_course_progress?: InputMaybe<UserCourseProgressWhereInput>;
  user_course_progress_id?: InputMaybe<UuidNullableFilter>;
  user_id?: InputMaybe<UuidNullableFilter>;
};

export type UserCourseServiceProgressWhereUniqueInput = {
  AND?: InputMaybe<Array<UserCourseServiceProgressWhereInput>>;
  NOT?: InputMaybe<Array<UserCourseServiceProgressWhereInput>>;
  OR?: InputMaybe<Array<UserCourseServiceProgressWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  service?: InputMaybe<ServiceWhereInput>;
  service_id?: InputMaybe<UuidNullableFilter>;
  timestamp?: InputMaybe<DateTimeNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_course_progress?: InputMaybe<UserCourseProgressWhereInput>;
  user_course_progress_id?: InputMaybe<UuidNullableFilter>;
  user_id?: InputMaybe<UuidNullableFilter>;
};

export type UserCourseSetting = {
  __typename?: 'UserCourseSetting';
  country: Maybe<Scalars['String']['output']>;
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']['output']>;
  course_variant: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  language: Maybe<Scalars['String']['output']>;
  marketing: Maybe<Scalars['Boolean']['output']>;
  other: Maybe<Scalars['Json']['output']>;
  research: Maybe<Scalars['Boolean']['output']>;
  updated_at: Scalars['DateTime']['output'];
  user: Maybe<User>;
  user_id: Maybe<Scalars['String']['output']>;
};

export type UserCourseSettingEdge = {
  __typename?: 'UserCourseSettingEdge';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor */
  cursor: Scalars['String']['output'];
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Node */
  node: UserCourseSetting;
};

export type UserCourseSettingListRelationFilter = {
  every?: InputMaybe<UserCourseSettingWhereInput>;
  none?: InputMaybe<UserCourseSettingWhereInput>;
  some?: InputMaybe<UserCourseSettingWhereInput>;
};

export type UserCourseSettingOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type UserCourseSettingWhereInput = {
  AND?: InputMaybe<Array<UserCourseSettingWhereInput>>;
  NOT?: InputMaybe<Array<UserCourseSettingWhereInput>>;
  OR?: InputMaybe<Array<UserCourseSettingWhereInput>>;
  country?: InputMaybe<StringNullableFilter>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  course_variant?: InputMaybe<StringNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<UuidFilter>;
  language?: InputMaybe<StringNullableFilter>;
  marketing?: InputMaybe<BoolNullableFilter>;
  other?: InputMaybe<JsonNullableFilter>;
  research?: InputMaybe<BoolNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidNullableFilter>;
};

export type UserCourseSettingWhereUniqueInput = {
  AND?: InputMaybe<Array<UserCourseSettingWhereInput>>;
  NOT?: InputMaybe<Array<UserCourseSettingWhereInput>>;
  OR?: InputMaybe<Array<UserCourseSettingWhereInput>>;
  country?: InputMaybe<StringNullableFilter>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  course_variant?: InputMaybe<StringNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<StringNullableFilter>;
  marketing?: InputMaybe<BoolNullableFilter>;
  other?: InputMaybe<JsonNullableFilter>;
  research?: InputMaybe<BoolNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidNullableFilter>;
};

export type UserCourseSettingsVisibility = {
  __typename?: 'UserCourseSettingsVisibility';
  course: Maybe<Course>;
  course_id: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  language: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type UserCourseSettingsVisibilityCreateInput = {
  course?: InputMaybe<Scalars['ID']['input']>;
  language: Scalars['String']['input'];
};

export type UserCourseSettingsVisibilityListRelationFilter = {
  every?: InputMaybe<UserCourseSettingsVisibilityWhereInput>;
  none?: InputMaybe<UserCourseSettingsVisibilityWhereInput>;
  some?: InputMaybe<UserCourseSettingsVisibilityWhereInput>;
};

export type UserCourseSettingsVisibilityOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type UserCourseSettingsVisibilityUpsertInput = {
  course?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  language: Scalars['String']['input'];
};

export type UserCourseSettingsVisibilityWhereInput = {
  AND?: InputMaybe<Array<UserCourseSettingsVisibilityWhereInput>>;
  NOT?: InputMaybe<Array<UserCourseSettingsVisibilityWhereInput>>;
  OR?: InputMaybe<Array<UserCourseSettingsVisibilityWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<UuidFilter>;
  language?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type UserCourseSettingsVisibilityWhereUniqueInput = {
  AND?: InputMaybe<Array<UserCourseSettingsVisibilityWhereInput>>;
  NOT?: InputMaybe<Array<UserCourseSettingsVisibilityWhereInput>>;
  OR?: InputMaybe<Array<UserCourseSettingsVisibilityWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  course_id?: InputMaybe<UuidNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type UserCourseSummary = {
  __typename?: 'UserCourseSummary';
  completion: Maybe<Completion>;
  completions_handled_by_id: Maybe<Scalars['ID']['output']>;
  course: Course;
  course_id: Scalars['ID']['output'];
  exercise_completions: Maybe<Array<ExerciseCompletion>>;
  exercises: Array<Exercise>;
  include_deleted_exercises: Maybe<Scalars['Boolean']['output']>;
  include_no_points_awarded_exercises: Maybe<Scalars['Boolean']['output']>;
  inherit_settings_from_id: Maybe<Scalars['ID']['output']>;
  start_date: Maybe<Scalars['DateTime']['output']>;
  tier: Maybe<Scalars['Int']['output']>;
  tier_summaries: Maybe<Array<UserCourseSummary>>;
  user_course_progress: Maybe<UserCourseProgress>;
  user_course_service_progresses: Array<UserCourseServiceProgress>;
  user_id: Scalars['ID']['output'];
};


export type UserCourseSummarycompletionArgs = {
  includeOnlyCompleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type UserCourseSummaryexercise_completionsArgs = {
  includeDeletedExercises?: InputMaybe<Scalars['Boolean']['input']>;
  includeNoPointsAwardedExercises?: InputMaybe<Scalars['Boolean']['input']>;
};


export type UserCourseSummaryexercisesArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  includeNoPointsAwarded?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserCourseSummaryOrderByInput = {
  activity_date?: InputMaybe<SortOrder>;
  completion_date?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
};

export type UserCreateArg = {
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  last_name: Scalars['String']['input'];
  research_consent: Scalars['Boolean']['input'];
  upstream_id: Scalars['Int']['input'];
  username: Scalars['String']['input'];
};

export type UserEdge = {
  __typename?: 'UserEdge';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor */
  cursor: Scalars['String']['output'];
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Node */
  node: User;
};

export enum UserOrderByRelevanceFieldEnum {
  email = 'email',
  first_name = 'first_name',
  id = 'id',
  last_name = 'last_name',
  real_student_number = 'real_student_number',
  student_number = 'student_number',
  username = 'username'
}

export type UserOrderByRelevanceInput = {
  fields: UserOrderByRelevanceFieldEnum;
  search: Scalars['String']['input'];
  sort: SortOrder;
};

export type UserOrderByWithRelationAndSearchRelevanceInput = {
  _relevance?: InputMaybe<UserOrderByRelevanceInput>;
  ab_enrollments?: InputMaybe<AbEnrollmentOrderByRelationAggregateInput>;
  administrator?: InputMaybe<SortOrder>;
  completions?: InputMaybe<CompletionOrderByRelationAggregateInput>;
  completions_registered?: InputMaybe<CompletionRegisteredOrderByRelationAggregateInput>;
  course_ownerships?: InputMaybe<CourseOwnershipOrderByRelationAggregateInput>;
  course_stats_subscriptions?: InputMaybe<CourseStatsSubscriptionOrderByRelationAggregateInput>;
  created_at?: InputMaybe<SortOrder>;
  email?: InputMaybe<SortOrder>;
  email_deliveries?: InputMaybe<EmailDeliveryOrderByRelationAggregateInput>;
  exercise_completions?: InputMaybe<ExerciseCompletionOrderByRelationAggregateInput>;
  first_name?: InputMaybe<SortOrderInput>;
  id?: InputMaybe<SortOrder>;
  last_name?: InputMaybe<SortOrderInput>;
  organizations?: InputMaybe<OrganizationOrderByRelationAggregateInput>;
  real_student_number?: InputMaybe<SortOrderInput>;
  research_consent?: InputMaybe<SortOrderInput>;
  stored_data?: InputMaybe<StoredDataOrderByRelationAggregateInput>;
  student_number?: InputMaybe<SortOrderInput>;
  updated_at?: InputMaybe<SortOrder>;
  upstream_id?: InputMaybe<SortOrder>;
  user_course_progresses?: InputMaybe<UserCourseProgressOrderByRelationAggregateInput>;
  user_course_service_progresses?: InputMaybe<UserCourseServiceProgressOrderByRelationAggregateInput>;
  user_course_settings?: InputMaybe<UserCourseSettingOrderByRelationAggregateInput>;
  user_organizations?: InputMaybe<UserOrganizationOrderByRelationAggregateInput>;
  username?: InputMaybe<SortOrder>;
  verified_users?: InputMaybe<VerifiedUserOrderByRelationAggregateInput>;
};

export type UserOrganization = {
  __typename?: 'UserOrganization';
  confirmed: Maybe<Scalars['Boolean']['output']>;
  confirmed_at: Maybe<Scalars['DateTime']['output']>;
  consented: Maybe<Scalars['Boolean']['output']>;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  organization: Maybe<Organization>;
  organization_id: Maybe<Scalars['String']['output']>;
  organizational_email: Maybe<Scalars['String']['output']>;
  organizational_identifier: Maybe<Scalars['String']['output']>;
  role: Maybe<OrganizationRole>;
  updated_at: Scalars['DateTime']['output'];
  user: Maybe<User>;
  user_id: Maybe<Scalars['String']['output']>;
  user_organization_join_confirmations: Maybe<Array<UserOrganizationJoinConfirmation>>;
};

export type UserOrganizationJoinConfirmation = {
  __typename?: 'UserOrganizationJoinConfirmation';
  confirmed: Maybe<Scalars['Boolean']['output']>;
  confirmed_at: Maybe<Scalars['DateTime']['output']>;
  created_at: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  email_delivery: Maybe<EmailDelivery>;
  email_delivery_id: Maybe<Scalars['String']['output']>;
  expired: Maybe<Scalars['Boolean']['output']>;
  expires_at: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  language: Maybe<Scalars['String']['output']>;
  redirect: Maybe<Scalars['String']['output']>;
  updated_at: Maybe<Scalars['DateTime']['output']>;
  user_organization: UserOrganization;
  user_organization_id: Scalars['String']['output'];
};

export type UserOrganizationJoinConfirmationListRelationFilter = {
  every?: InputMaybe<UserOrganizationJoinConfirmationWhereInput>;
  none?: InputMaybe<UserOrganizationJoinConfirmationWhereInput>;
  some?: InputMaybe<UserOrganizationJoinConfirmationWhereInput>;
};

export type UserOrganizationJoinConfirmationWhereInput = {
  AND?: InputMaybe<Array<UserOrganizationJoinConfirmationWhereInput>>;
  NOT?: InputMaybe<Array<UserOrganizationJoinConfirmationWhereInput>>;
  OR?: InputMaybe<Array<UserOrganizationJoinConfirmationWhereInput>>;
  confirmed?: InputMaybe<BoolNullableFilter>;
  confirmed_at?: InputMaybe<DateTimeNullableFilter>;
  created_at?: InputMaybe<DateTimeNullableFilter>;
  email?: InputMaybe<StringFilter>;
  email_delivery?: InputMaybe<EmailDeliveryWhereInput>;
  email_delivery_id?: InputMaybe<UuidNullableFilter>;
  expired?: InputMaybe<BoolNullableFilter>;
  expires_at?: InputMaybe<DateTimeNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  language?: InputMaybe<StringNullableFilter>;
  redirect?: InputMaybe<StringNullableFilter>;
  updated_at?: InputMaybe<DateTimeNullableFilter>;
  user_organization?: InputMaybe<UserOrganizationWhereInput>;
  user_organization_id?: InputMaybe<UuidFilter>;
};

export type UserOrganizationListRelationFilter = {
  every?: InputMaybe<UserOrganizationWhereInput>;
  none?: InputMaybe<UserOrganizationWhereInput>;
  some?: InputMaybe<UserOrganizationWhereInput>;
};

export type UserOrganizationOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type UserOrganizationWhereInput = {
  AND?: InputMaybe<Array<UserOrganizationWhereInput>>;
  NOT?: InputMaybe<Array<UserOrganizationWhereInput>>;
  OR?: InputMaybe<Array<UserOrganizationWhereInput>>;
  confirmed?: InputMaybe<BoolNullableFilter>;
  confirmed_at?: InputMaybe<DateTimeNullableFilter>;
  consented?: InputMaybe<BoolNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<UuidFilter>;
  organization?: InputMaybe<OrganizationWhereInput>;
  organization_id?: InputMaybe<UuidNullableFilter>;
  organizational_email?: InputMaybe<StringNullableFilter>;
  organizational_identifier?: InputMaybe<StringNullableFilter>;
  role?: InputMaybe<EnumOrganizationRoleNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidNullableFilter>;
  user_organization_join_confirmations?: InputMaybe<UserOrganizationJoinConfirmationListRelationFilter>;
};

export type UserOrganizationWhereUniqueInput = {
  AND?: InputMaybe<Array<UserOrganizationWhereInput>>;
  NOT?: InputMaybe<Array<UserOrganizationWhereInput>>;
  OR?: InputMaybe<Array<UserOrganizationWhereInput>>;
  confirmed?: InputMaybe<BoolNullableFilter>;
  confirmed_at?: InputMaybe<DateTimeNullableFilter>;
  consented?: InputMaybe<BoolNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<OrganizationWhereInput>;
  organization_id?: InputMaybe<UuidNullableFilter>;
  organizational_email?: InputMaybe<StringNullableFilter>;
  organizational_identifier?: InputMaybe<StringNullableFilter>;
  role?: InputMaybe<EnumOrganizationRoleNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidNullableFilter>;
  user_organization_join_confirmations?: InputMaybe<UserOrganizationJoinConfirmationListRelationFilter>;
};

export type UserSearch = {
  __typename?: 'UserSearch';
  allMatchIds: Array<Scalars['String']['output']>;
  /** total count of matches so far */
  count: Scalars['Int']['output'];
  /** current search condition field(s) */
  field: UserSearchField;
  /** total number of search fields */
  fieldCount: Scalars['Int']['output'];
  /** index of current search field */
  fieldIndex: Scalars['Int']['output'];
  /** total number of matches for current search field */
  fieldResultCount: Scalars['Int']['output'];
  /** total number of unique matches for current search field */
  fieldUniqueResultCount: Scalars['Int']['output'];
  /** values used for current search condition field(s) */
  fieldValue: Maybe<Scalars['String']['output']>;
  finished: Scalars['Boolean']['output'];
  matches: Array<User>;
  search: Maybe<Scalars['String']['output']>;
};

export enum UserSearchField {
  email = 'email',
  first_name = 'first_name',
  full_name = 'full_name',
  last_name = 'last_name',
  real_student_number = 'real_student_number',
  student_number = 'student_number',
  upstream_id = 'upstream_id',
  username = 'username'
}

export type UserUpdateArg = {
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  real_student_number?: InputMaybe<Scalars['String']['input']>;
  research_consent?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserWhereInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  ab_enrollments?: InputMaybe<AbEnrollmentListRelationFilter>;
  administrator?: InputMaybe<BoolFilter>;
  completions?: InputMaybe<CompletionListRelationFilter>;
  completions_registered?: InputMaybe<CompletionRegisteredListRelationFilter>;
  course_ownerships?: InputMaybe<CourseOwnershipListRelationFilter>;
  course_stats_subscriptions?: InputMaybe<CourseStatsSubscriptionListRelationFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  email?: InputMaybe<StringFilter>;
  email_deliveries?: InputMaybe<EmailDeliveryListRelationFilter>;
  exercise_completions?: InputMaybe<ExerciseCompletionListRelationFilter>;
  first_name?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  last_name?: InputMaybe<StringNullableFilter>;
  organizations?: InputMaybe<OrganizationListRelationFilter>;
  real_student_number?: InputMaybe<StringNullableFilter>;
  research_consent?: InputMaybe<BoolNullableFilter>;
  stored_data?: InputMaybe<StoredDataListRelationFilter>;
  student_number?: InputMaybe<StringNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  upstream_id?: InputMaybe<IntFilter>;
  user_course_progresses?: InputMaybe<UserCourseProgressListRelationFilter>;
  user_course_service_progresses?: InputMaybe<UserCourseServiceProgressListRelationFilter>;
  user_course_settings?: InputMaybe<UserCourseSettingListRelationFilter>;
  user_organizations?: InputMaybe<UserOrganizationListRelationFilter>;
  username?: InputMaybe<StringFilter>;
  verified_users?: InputMaybe<VerifiedUserListRelationFilter>;
};

export type UserWhereUniqueInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  ab_enrollments?: InputMaybe<AbEnrollmentListRelationFilter>;
  administrator?: InputMaybe<BoolFilter>;
  completions?: InputMaybe<CompletionListRelationFilter>;
  completions_registered?: InputMaybe<CompletionRegisteredListRelationFilter>;
  course_ownerships?: InputMaybe<CourseOwnershipListRelationFilter>;
  course_stats_subscriptions?: InputMaybe<CourseStatsSubscriptionListRelationFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  email?: InputMaybe<StringFilter>;
  email_deliveries?: InputMaybe<EmailDeliveryListRelationFilter>;
  exercise_completions?: InputMaybe<ExerciseCompletionListRelationFilter>;
  first_name?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<StringNullableFilter>;
  organizations?: InputMaybe<OrganizationListRelationFilter>;
  real_student_number?: InputMaybe<StringNullableFilter>;
  research_consent?: InputMaybe<BoolNullableFilter>;
  stored_data?: InputMaybe<StoredDataListRelationFilter>;
  student_number?: InputMaybe<StringNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  upstream_id?: InputMaybe<Scalars['Int']['input']>;
  user_course_progresses?: InputMaybe<UserCourseProgressListRelationFilter>;
  user_course_service_progresses?: InputMaybe<UserCourseServiceProgressListRelationFilter>;
  user_course_settings?: InputMaybe<UserCourseSettingListRelationFilter>;
  user_organizations?: InputMaybe<UserOrganizationListRelationFilter>;
  username?: InputMaybe<Scalars['String']['input']>;
  verified_users?: InputMaybe<VerifiedUserListRelationFilter>;
};

export type UuidFilter = {
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedUuidFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type UuidNullableFilter = {
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedUuidNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type VerifiedUser = {
  __typename?: 'VerifiedUser';
  created_at: Scalars['DateTime']['output'];
  display_name: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  organization: Maybe<Organization>;
  organization_id: Maybe<Scalars['String']['output']>;
  personal_unique_code: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  user: Maybe<User>;
  user_id: Maybe<Scalars['String']['output']>;
};

export type VerifiedUserArg = {
  display_name?: InputMaybe<Scalars['String']['input']>;
  organization_id: Scalars['ID']['input'];
  organization_secret: Scalars['String']['input'];
  personal_unique_code: Scalars['String']['input'];
};

export type VerifiedUserListRelationFilter = {
  every?: InputMaybe<VerifiedUserWhereInput>;
  none?: InputMaybe<VerifiedUserWhereInput>;
  some?: InputMaybe<VerifiedUserWhereInput>;
};

export type VerifiedUserOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type VerifiedUserUser_idPersonal_unique_codeHome_organizationCompoundUniqueInput = {
  home_organization: Scalars['String']['input'];
  personal_unique_code: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};

export type VerifiedUserWhereInput = {
  AND?: InputMaybe<Array<VerifiedUserWhereInput>>;
  NOT?: InputMaybe<Array<VerifiedUserWhereInput>>;
  OR?: InputMaybe<Array<VerifiedUserWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  display_name?: InputMaybe<StringNullableFilter>;
  home_organization?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  mail?: InputMaybe<StringNullableFilter>;
  organization?: InputMaybe<OrganizationWhereInput>;
  organization_id?: InputMaybe<UuidNullableFilter>;
  organizational_unit?: InputMaybe<StringNullableFilter>;
  person_affiliation?: InputMaybe<StringNullableFilter>;
  person_affiliation_updated_at?: InputMaybe<DateTimeNullableFilter>;
  personal_unique_code?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidNullableFilter>;
};

export type VerifiedUserWhereUniqueInput = {
  AND?: InputMaybe<Array<VerifiedUserWhereInput>>;
  NOT?: InputMaybe<Array<VerifiedUserWhereInput>>;
  OR?: InputMaybe<Array<VerifiedUserWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  display_name?: InputMaybe<StringNullableFilter>;
  home_organization?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  mail?: InputMaybe<StringNullableFilter>;
  organization?: InputMaybe<OrganizationWhereInput>;
  organization_id?: InputMaybe<UuidNullableFilter>;
  organizational_unit?: InputMaybe<StringNullableFilter>;
  person_affiliation?: InputMaybe<StringNullableFilter>;
  person_affiliation_updated_at?: InputMaybe<DateTimeNullableFilter>;
  personal_unique_code?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  user_id?: InputMaybe<UuidNullableFilter>;
  user_id_personal_unique_code_home_organization?: InputMaybe<VerifiedUserUser_idPersonal_unique_codeHome_organizationCompoundUniqueInput>;
};

export type CompletionCoreFieldsFragment = { __typename?: 'Completion', id: string, course_id: string | null, user_id: string | null, email: string, student_number: string | null, completion_language: string | null, completion_link: string | null, completion_date: any | null, tier: number | null, grade: string | null, eligible_for_ects: boolean | null, project_completion: boolean, registered: boolean, created_at: any, updated_at: any };

export type CompletionCourseFieldsFragment = { __typename?: 'Course', has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null };

export type CompletionDetailedFieldsFragment = { __typename?: 'Completion', id: string, course_id: string | null, user_id: string | null, email: string, student_number: string | null, completion_language: string | null, completion_link: string | null, completion_date: any | null, tier: number | null, grade: string | null, eligible_for_ects: boolean | null, project_completion: boolean, registered: boolean, created_at: any, updated_at: any, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, completion_id: string | null, organization_id: string | null, created_at: any, updated_at: any, organization: { __typename?: 'Organization', id: string, slug: string, name: string } | null }>, certificate_availability: { __typename?: 'CertificateAvailability', completed_course: boolean | null, existing_certificate: string | null, honors: boolean | null } | null };

export type CompletionDetailedFieldsWithCourseFragment = { __typename?: 'Completion', id: string, course_id: string | null, user_id: string | null, email: string, student_number: string | null, completion_language: string | null, completion_link: string | null, completion_date: any | null, tier: number | null, grade: string | null, eligible_for_ects: boolean | null, project_completion: boolean, registered: boolean, created_at: any, updated_at: any, course: { __typename?: 'Course', has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null } | null, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, completion_id: string | null, organization_id: string | null, created_at: any, updated_at: any, organization: { __typename?: 'Organization', id: string, slug: string, name: string } | null }>, certificate_availability: { __typename?: 'CertificateAvailability', completed_course: boolean | null, existing_certificate: string | null, honors: boolean | null } | null };

export type CompletionsQueryNodeFieldsFragment = { __typename?: 'Completion', id: string, course_id: string | null, user_id: string | null, email: string, student_number: string | null, completion_language: string | null, completion_link: string | null, completion_date: any | null, tier: number | null, grade: string | null, eligible_for_ects: boolean | null, project_completion: boolean, registered: boolean, created_at: any, updated_at: any, user: { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any } | null, course: { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string } | null, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, organization: { __typename?: 'Organization', id: string, slug: string } | null }> };

export type CompletionsQueryConnectionFieldsFragment = { __typename?: 'QueryCompletionsPaginated_type_Connection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null, endCursor: string | null }, edges: Array<{ __typename?: 'CompletionEdge', node: { __typename?: 'Completion', id: string, course_id: string | null, user_id: string | null, email: string, student_number: string | null, completion_language: string | null, completion_link: string | null, completion_date: any | null, tier: number | null, grade: string | null, eligible_for_ects: boolean | null, project_completion: boolean, registered: boolean, created_at: any, updated_at: any, user: { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any } | null, course: { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string } | null, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, organization: { __typename?: 'Organization', id: string, slug: string } | null }> } }> };

export type CertificateAvailabilityFieldsFragment = { __typename?: 'CertificateAvailability', completed_course: boolean | null, existing_certificate: string | null, honors: boolean | null };

export type CompletionRegisteredCoreFieldsFragment = { __typename?: 'CompletionRegistered', id: string, completion_id: string | null, organization_id: string | null, created_at: any, updated_at: any, organization: { __typename?: 'Organization', id: string, slug: string, name: string } | null };

export type CourseKeyFieldsFragment = { __typename?: 'Course', id: string, slug: string, name: string };

export type CourseCoreFieldsFragment = { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string };

export type CourseWithPhotoCoreFieldsFragment = { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null };

export type CourseTranslationCoreFieldsFragment = { __typename?: 'CourseTranslation', id: string, language: string, name: string };

export type CourseTranslationDetailedFieldsFragment = { __typename?: 'CourseTranslation', course_id: string | null, description: string, link: string | null, instructions: string | null, created_at: any, updated_at: any, id: string, language: string, name: string };

export type FrontpageCourseFieldsFragment = { __typename?: 'Course', description: string | null, link: string | null, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, upcoming_active_link: boolean | null, tier: number | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, start_date: any | null, end_date: any | null, has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null };

export type FrontpageModuleCourseFieldsFragment = { __typename?: 'Course', description: string | null, link: string | null, order: number | null, study_module_order: number | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, start_date: any | null, end_date: any | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string };

export type NewFrontpageCourseFieldsFragment = { __typename?: 'Course', description: string | null, link: string | null, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, upcoming_active_link: boolean | null, tier: number | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, start_date: any | null, end_date: any | null, has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, study_modules: Array<{ __typename?: 'StudyModule', id: string, slug: string, name: string }> };

export type CourseFieldsFragment = { __typename?: 'Course', description: string | null, link: string | null, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, upcoming_active_link: boolean | null, tier: number | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, start_date: any | null, end_date: any | null, has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, course_translations: Array<{ __typename?: 'CourseTranslation', id: string, language: string, name: string }>, tags: Array<{ __typename?: 'Tag', id: string, hidden: boolean, types: Array<string> | null, name: string | null, abbreviation: string | null, tag_translations: Array<{ __typename?: 'TagTranslation', tag_id: string, name: string, description: string | null, language: string, abbreviation: string | null }> }>, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null };

export type NewCourseFieldsFragment = { __typename?: 'Course', description: string | null, link: string | null, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, upcoming_active_link: boolean | null, tier: number | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, start_date: any | null, end_date: any | null, has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, course_translations: Array<{ __typename?: 'CourseTranslation', id: string, language: string, name: string }>, tags: Array<{ __typename?: 'Tag', id: string, hidden: boolean, types: Array<string> | null, name: string | null, abbreviation: string | null, tag_translations: Array<{ __typename?: 'TagTranslation', tag_id: string, name: string, description: string | null, language: string, abbreviation: string | null }> }>, sponsors: Array<{ __typename?: 'Sponsor', order: number | null, id: string, name: string, translations: Array<{ __typename?: 'SponsorTranslation', sponsor_id: string, language: string, name: string, description: string | null, link: string | null, link_text: string | null }>, images: Array<{ __typename?: 'SponsorImage', sponsor_id: string, type: string, width: number, height: number, uri: string }> | null }>, study_modules: Array<{ __typename?: 'StudyModule', id: string, slug: string, name: string }> };

export type EditorCourseFieldsFragment = { __typename?: 'Course', instructions: string | null, upcoming_active_link: boolean | null, description: string | null, link: string | null, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, tier: number | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, start_date: any | null, end_date: any | null, has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, completions_handled_by: { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string } | null, course_variants: Array<{ __typename?: 'CourseVariant', id: string, slug: string, description: string | null }>, course_aliases: Array<{ __typename?: 'CourseAlias', id: string, course_code: string }>, user_course_settings_visibilities: Array<{ __typename?: 'UserCourseSettingsVisibility', id: string, language: string }>, study_modules: Array<{ __typename?: 'StudyModule', id: string, slug: string, name: string }>, course_translations: Array<{ __typename?: 'CourseTranslation', id: string, language: string, name: string }>, tags: Array<{ __typename?: 'Tag', id: string, hidden: boolean, types: Array<string> | null, name: string | null, abbreviation: string | null, tag_translations: Array<{ __typename?: 'TagTranslation', tag_id: string, name: string, description: string | null, language: string, abbreviation: string | null }> }>, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null };

export type EditorCourseDetailedFieldsFragment = { __typename?: 'Course', automatic_completions: boolean | null, automatic_completions_eligible_for_ects: boolean | null, exercise_completions_needed: number | null, points_needed: number | null, instructions: string | null, upcoming_active_link: boolean | null, description: string | null, link: string | null, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, tier: number | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, start_date: any | null, end_date: any | null, has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, course_translations: Array<{ __typename?: 'CourseTranslation', course_id: string | null, description: string, link: string | null, instructions: string | null, created_at: any, updated_at: any, id: string, language: string, name: string }>, open_university_registration_links: Array<{ __typename?: 'OpenUniversityRegistrationLink', id: string, course_code: string, language: string, link: string | null }>, inherit_settings_from: { __typename?: 'Course', id: string, slug: string, name: string } | null, sponsors: Array<{ __typename?: 'Sponsor', order: number | null, id: string, name: string, translations: Array<{ __typename?: 'SponsorTranslation', sponsor_id: string, language: string, name: string, description: string | null, link: string | null, link_text: string | null }>, images: Array<{ __typename?: 'SponsorImage', sponsor_id: string, type: string, width: number, height: number, uri: string }> | null }>, study_modules: Array<{ __typename?: 'StudyModule', id: string, slug: string, name: string }>, completions_handled_by: { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string } | null, course_variants: Array<{ __typename?: 'CourseVariant', id: string, slug: string, description: string | null }>, course_aliases: Array<{ __typename?: 'CourseAlias', id: string, course_code: string }>, user_course_settings_visibilities: Array<{ __typename?: 'UserCourseSettingsVisibility', id: string, language: string }>, tags: Array<{ __typename?: 'Tag', id: string, hidden: boolean, types: Array<string> | null, name: string | null, abbreviation: string | null, tag_translations: Array<{ __typename?: 'TagTranslation', tag_id: string, name: string, description: string | null, language: string, abbreviation: string | null }> }>, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null };

export type EditorCourseOtherCoursesFieldsFragment = { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, course_translations: Array<{ __typename?: 'CourseTranslation', id: string, language: string, name: string }>, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null };

export type CourseDashboardCourseFieldsFragment = { __typename?: 'Course', teacher_in_charge_name: string, teacher_in_charge_email: string, start_date: any | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, completion_email: { __typename?: 'EmailTemplate', id: string, name: string | null, title: string | null, txt_body: string | null, html_body: string | null, template_type: string | null, course_instance_language: string | null, created_at: any, updated_at: any } | null, course_stats_email: { __typename?: 'EmailTemplate', id: string, name: string | null, title: string | null, txt_body: string | null, html_body: string | null, template_type: string | null, course_instance_language: string | null, created_at: any, updated_at: any } | null };

export type EmailDeliveryFieldsFragment = { __typename?: 'EmailDelivery', id: string, email: string | null, sent: boolean, error: boolean, error_message: string | null, email_template_id: string | null, user_id: string | null, organization_id: string | null, created_at: any, updated_at: any };

export type EmailTemplateCoreFieldsFragment = { __typename?: 'EmailTemplate', id: string, name: string | null, title: string | null, txt_body: string | null, html_body: string | null, template_type: string | null, course_instance_language: string | null, created_at: any, updated_at: any };

export type EmailTemplateFieldsFragment = { __typename?: 'EmailTemplate', triggered_automatically_by_course_id: string | null, exercise_completions_threshold: number | null, points_threshold: number | null, id: string, name: string | null, title: string | null, txt_body: string | null, html_body: string | null, template_type: string | null, course_instance_language: string | null, created_at: any, updated_at: any };

export type ExerciseCoreFieldsFragment = { __typename?: 'Exercise', id: string, name: string | null, custom_id: string, course_id: string | null, part: number | null, section: number | null, max_points: number | null, deleted: boolean | null };

export type ExerciseWithExerciseCompletionsFieldsFragment = { __typename?: 'Exercise', id: string, name: string | null, custom_id: string, course_id: string | null, part: number | null, section: number | null, max_points: number | null, deleted: boolean | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null };

export type ExerciseCompletionCoreFieldsFragment = { __typename?: 'ExerciseCompletion', id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> };

export type ImageCoreFieldsFragment = { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any };

export type OpenUniversityRegistrationLinkCoreFieldsFragment = { __typename?: 'OpenUniversityRegistrationLink', id: string, course_code: string, language: string, link: string | null };

export type OrganizationCoreFieldsFragment = { __typename?: 'Organization', id: string, slug: string, email: string | null, hidden: boolean | null, disabled: boolean | null, name: string, information: string | null, created_at: any, updated_at: any, required_confirmation: boolean | null, required_organization_email: string | null, organization_translations: Array<{ __typename?: 'OrganizationTranslation', id: string, organization_id: string | null, language: string, name: string, information: string | null }> };

export type ProgressCoreFieldsFragment = { __typename?: 'Progress', course: { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string } | null, user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, user_id: string | null, max_points: number | null, n_points: number | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, extra: { __typename?: 'ProgressExtra', projectCompletion: boolean, highestTier: number | null, n_points: number, max_points: number, pointsNeeded: number, pointsPercentage: number, pointsNeededPercentage: number, exercisePercentage: number, exercisesNeededPercentage: number, totalExerciseCount: number, totalExerciseCompletions: number, totalExerciseCompletionsNeeded: number, tiers: Array<{ __typename?: 'TierInfo', id: string, name: string, tier: number, hasTier: boolean, missingFromTier: number, requiredByTier: number, exercisePercentage: number, exercisesNeededPercentage: number, exerciseCompletions: number, exerciseCount: number }>, exercises: Array<{ __typename?: 'TierProgress', exercise_number: number, tier: number, n_points: number, max_points: number, progress: number, name: string | null, custom_id: string | null, course_id: string | null, exercise_id: string | null, service_id: string | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', tier: number | null, max_points: number | null, id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> } | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null, exercise_count: number | null, exercises_completed_count: number | null, exercises_attempted_count: number | null } } | null, user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', id: string, course_id: string | null, service_id: string | null, user_id: string | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, service: { __typename?: 'Service', name: string, id: string } | null }> | null };

export type ProgressExtraFieldsFragment = { __typename?: 'ProgressExtra', projectCompletion: boolean, highestTier: number | null, n_points: number, max_points: number, pointsNeeded: number, pointsPercentage: number, pointsNeededPercentage: number, exercisePercentage: number, exercisesNeededPercentage: number, totalExerciseCount: number, totalExerciseCompletions: number, totalExerciseCompletionsNeeded: number, tiers: Array<{ __typename?: 'TierInfo', id: string, name: string, tier: number, hasTier: boolean, missingFromTier: number, requiredByTier: number, exercisePercentage: number, exercisesNeededPercentage: number, exerciseCompletions: number, exerciseCount: number }>, exercises: Array<{ __typename?: 'TierProgress', exercise_number: number, tier: number, n_points: number, max_points: number, progress: number, name: string | null, custom_id: string | null, course_id: string | null, exercise_id: string | null, service_id: string | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', tier: number | null, max_points: number | null, id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> };

export type TierInfoFieldsFragment = { __typename?: 'TierInfo', id: string, name: string, tier: number, hasTier: boolean, missingFromTier: number, requiredByTier: number, exercisePercentage: number, exercisesNeededPercentage: number, exerciseCompletions: number, exerciseCount: number };

export type TierProgressFieldsFragment = { __typename?: 'TierProgress', exercise_number: number, tier: number, n_points: number, max_points: number, progress: number, name: string | null, custom_id: string | null, course_id: string | null, exercise_id: string | null, service_id: string | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', tier: number | null, max_points: number | null, id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null };

export type TierProgressExerciseCompletionFieldsFragment = { __typename?: 'ExerciseCompletion', tier: number | null, max_points: number | null, id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> };

export type PointsByGroupFieldsFragment = { __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number };

export type SponsorFieldsFragment = { __typename?: 'Sponsor', id: string, name: string };

export type SponsorTranslationFieldsFragment = { __typename?: 'SponsorTranslation', sponsor_id: string, language: string, name: string, description: string | null, link: string | null, link_text: string | null };

export type SponsorImageFieldsFragment = { __typename?: 'SponsorImage', sponsor_id: string, type: string, width: number, height: number, uri: string };

export type SponsorCoreFieldsFragment = { __typename?: 'Sponsor', id: string, name: string, translations: Array<{ __typename?: 'SponsorTranslation', sponsor_id: string, language: string, name: string, description: string | null, link: string | null, link_text: string | null }>, images: Array<{ __typename?: 'SponsorImage', sponsor_id: string, type: string, width: number, height: number, uri: string }> | null };

export type CourseSponsorFieldsFragment = { __typename?: 'Sponsor', order: number | null, id: string, name: string, translations: Array<{ __typename?: 'SponsorTranslation', sponsor_id: string, language: string, name: string, description: string | null, link: string | null, link_text: string | null }>, images: Array<{ __typename?: 'SponsorImage', sponsor_id: string, type: string, width: number, height: number, uri: string }> | null };

export type StudyModuleKeyFieldsFragment = { __typename?: 'StudyModule', id: string, slug: string, name: string };

export type StudyModuleCoreFieldsFragment = { __typename?: 'StudyModule', id: string, slug: string, name: string };

export type StudyModuleFieldsFragment = { __typename?: 'StudyModule', description: string | null, image: string | null, order: number | null, created_at: any, updated_at: any, id: string, slug: string, name: string };

export type StudyModuleTranslationFieldsFragment = { __typename?: 'StudyModuleTranslation', id: string, language: string, name: string, description: string, created_at: any, updated_at: any };

export type StudyModuleDetailedFieldsFragment = { __typename?: 'StudyModule', description: string | null, image: string | null, order: number | null, created_at: any, updated_at: any, id: string, slug: string, name: string, study_module_translations: Array<{ __typename?: 'StudyModuleTranslation', id: string, language: string, name: string, description: string, created_at: any, updated_at: any }> };

export type StudyModuleFieldsWithCoursesFragment = { __typename?: 'StudyModule', description: string | null, image: string | null, order: number | null, created_at: any, updated_at: any, id: string, slug: string, name: string, courses: Array<{ __typename?: 'Course', description: string | null, link: string | null, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, upcoming_active_link: boolean | null, tier: number | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, start_date: any | null, end_date: any | null, has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, course_translations: Array<{ __typename?: 'CourseTranslation', id: string, language: string, name: string }>, tags: Array<{ __typename?: 'Tag', id: string, hidden: boolean, types: Array<string> | null, name: string | null, abbreviation: string | null, tag_translations: Array<{ __typename?: 'TagTranslation', tag_id: string, name: string, description: string | null, language: string, abbreviation: string | null }> }>, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null }> | null };

export type NewStudyModuleFieldsWithCoursesFragment = { __typename?: 'StudyModule', description: string | null, image: string | null, order: number | null, created_at: any, updated_at: any, id: string, slug: string, name: string, courses: Array<{ __typename?: 'Course', description: string | null, link: string | null, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, upcoming_active_link: boolean | null, tier: number | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, start_date: any | null, end_date: any | null, has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, course_translations: Array<{ __typename?: 'CourseTranslation', id: string, language: string, name: string }>, tags: Array<{ __typename?: 'Tag', id: string, hidden: boolean, types: Array<string> | null, name: string | null, abbreviation: string | null, tag_translations: Array<{ __typename?: 'TagTranslation', tag_id: string, name: string, description: string | null, language: string, abbreviation: string | null }> }>, sponsors: Array<{ __typename?: 'Sponsor', order: number | null, id: string, name: string, translations: Array<{ __typename?: 'SponsorTranslation', sponsor_id: string, language: string, name: string, description: string | null, link: string | null, link_text: string | null }>, images: Array<{ __typename?: 'SponsorImage', sponsor_id: string, type: string, width: number, height: number, uri: string }> | null }>, study_modules: Array<{ __typename?: 'StudyModule', id: string, slug: string, name: string }> }> | null };

export type TagCoreFieldsFragment = { __typename?: 'Tag', id: string, hidden: boolean, types: Array<string> | null, name: string | null, abbreviation: string | null, tag_translations: Array<{ __typename?: 'TagTranslation', tag_id: string, name: string, description: string | null, language: string, abbreviation: string | null }> };

export type TagTranslationFieldsFragment = { __typename?: 'TagTranslation', tag_id: string, name: string, description: string | null, language: string, abbreviation: string | null };

export type TagTypeFieldsFragment = { __typename?: 'TagType', name: string };

export type UserCoreFieldsFragment = { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any };

export type UserDetailedFieldsFragment = { __typename?: 'User', administrator: boolean, research_consent: boolean | null, id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any };

export type UserProgressesFieldsFragment = { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any, progresses: Array<{ __typename?: 'Progress', course: { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string } | null, user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, user_id: string | null, max_points: number | null, n_points: number | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, extra: { __typename?: 'ProgressExtra', projectCompletion: boolean, highestTier: number | null, n_points: number, max_points: number, pointsNeeded: number, pointsPercentage: number, pointsNeededPercentage: number, exercisePercentage: number, exercisesNeededPercentage: number, totalExerciseCount: number, totalExerciseCompletions: number, totalExerciseCompletionsNeeded: number, tiers: Array<{ __typename?: 'TierInfo', id: string, name: string, tier: number, hasTier: boolean, missingFromTier: number, requiredByTier: number, exercisePercentage: number, exercisesNeededPercentage: number, exerciseCompletions: number, exerciseCount: number }>, exercises: Array<{ __typename?: 'TierProgress', exercise_number: number, tier: number, n_points: number, max_points: number, progress: number, name: string | null, custom_id: string | null, course_id: string | null, exercise_id: string | null, service_id: string | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', tier: number | null, max_points: number | null, id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> } | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null, exercise_count: number | null, exercises_completed_count: number | null, exercises_attempted_count: number | null } } | null, user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', id: string, course_id: string | null, service_id: string | null, user_id: string | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, service: { __typename?: 'Service', name: string, id: string } | null }> | null }> | null };

export type UserOverviewCourseFieldsFragment = { __typename?: 'Course', has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null };

export type UserOverviewFieldsFragment = { __typename?: 'User', administrator: boolean, research_consent: boolean | null, id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any, completions: Array<{ __typename?: 'Completion', id: string, course_id: string | null, user_id: string | null, email: string, student_number: string | null, completion_language: string | null, completion_link: string | null, completion_date: any | null, tier: number | null, grade: string | null, eligible_for_ects: boolean | null, project_completion: boolean, registered: boolean, created_at: any, updated_at: any, course: { __typename?: 'Course', has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null } | null, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, completion_id: string | null, organization_id: string | null, created_at: any, updated_at: any, organization: { __typename?: 'Organization', id: string, slug: string, name: string } | null }>, certificate_availability: { __typename?: 'CertificateAvailability', completed_course: boolean | null, existing_certificate: string | null, honors: boolean | null } | null }> | null };

export type UserCourseProgressCoreFieldsFragment = { __typename?: 'UserCourseProgress', id: string, course_id: string | null, user_id: string | null, max_points: number | null, n_points: number | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, extra: { __typename?: 'ProgressExtra', projectCompletion: boolean, highestTier: number | null, n_points: number, max_points: number, pointsNeeded: number, pointsPercentage: number, pointsNeededPercentage: number, exercisePercentage: number, exercisesNeededPercentage: number, totalExerciseCount: number, totalExerciseCompletions: number, totalExerciseCompletionsNeeded: number, tiers: Array<{ __typename?: 'TierInfo', id: string, name: string, tier: number, hasTier: boolean, missingFromTier: number, requiredByTier: number, exercisePercentage: number, exercisesNeededPercentage: number, exerciseCompletions: number, exerciseCount: number }>, exercises: Array<{ __typename?: 'TierProgress', exercise_number: number, tier: number, n_points: number, max_points: number, progress: number, name: string | null, custom_id: string | null, course_id: string | null, exercise_id: string | null, service_id: string | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', tier: number | null, max_points: number | null, id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> } | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null, exercise_count: number | null, exercises_completed_count: number | null, exercises_attempted_count: number | null } };

export type UserCourseServiceProgressCoreFieldsFragment = { __typename?: 'UserCourseServiceProgress', id: string, course_id: string | null, service_id: string | null, user_id: string | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, service: { __typename?: 'Service', name: string, id: string } | null };

export type UserCourseSettingCoreFieldsFragment = { __typename?: 'UserCourseSetting', id: string, user_id: string | null, course_id: string | null, created_at: any, updated_at: any };

export type UserCourseSettingDetailedFieldsFragment = { __typename?: 'UserCourseSetting', language: string | null, country: string | null, research: boolean | null, marketing: boolean | null, course_variant: string | null, other: any | null, id: string, user_id: string | null, course_id: string | null, created_at: any, updated_at: any };

export type StudentProgressesQueryNodeFieldsFragment = { __typename?: 'UserCourseSetting', id: string, user_id: string | null, course_id: string | null, created_at: any, updated_at: any, user: { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any, progress: { __typename?: 'Progress', course: { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string } | null, user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, user_id: string | null, max_points: number | null, n_points: number | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, extra: { __typename?: 'ProgressExtra', projectCompletion: boolean, highestTier: number | null, n_points: number, max_points: number, pointsNeeded: number, pointsPercentage: number, pointsNeededPercentage: number, exercisePercentage: number, exercisesNeededPercentage: number, totalExerciseCount: number, totalExerciseCompletions: number, totalExerciseCompletionsNeeded: number, tiers: Array<{ __typename?: 'TierInfo', id: string, name: string, tier: number, hasTier: boolean, missingFromTier: number, requiredByTier: number, exercisePercentage: number, exercisesNeededPercentage: number, exerciseCompletions: number, exerciseCount: number }>, exercises: Array<{ __typename?: 'TierProgress', exercise_number: number, tier: number, n_points: number, max_points: number, progress: number, name: string | null, custom_id: string | null, course_id: string | null, exercise_id: string | null, service_id: string | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', tier: number | null, max_points: number | null, id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> } | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null, exercise_count: number | null, exercises_completed_count: number | null, exercises_attempted_count: number | null } } | null, user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', id: string, course_id: string | null, service_id: string | null, user_id: string | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, service: { __typename?: 'Service', name: string, id: string } | null }> | null } } | null };

export type UserProfileUserCourseSettingsQueryNodeFieldsFragment = { __typename?: 'UserCourseSetting', language: string | null, country: string | null, research: boolean | null, marketing: boolean | null, course_variant: string | null, other: any | null, id: string, user_id: string | null, course_id: string | null, created_at: any, updated_at: any, course: { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string } | null };

export type UserCourseSummaryCourseFieldsFragment = { __typename?: 'Course', has_certificate: boolean | null, points_needed: number | null, exercise_completions_needed: number | null, tier: number | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, exercises: Array<{ __typename?: 'Exercise', id: string, name: string | null, custom_id: string, course_id: string | null, part: number | null, section: number | null, max_points: number | null, deleted: boolean | null }> | null, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null };

export type UserCourseSummaryCourseFieldsWithExerciseCompletionsFragment = { __typename?: 'Course', has_certificate: boolean | null, points_needed: number | null, exercise_completions_needed: number | null, tier: number | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, exercises: Array<{ __typename?: 'Exercise', id: string, name: string | null, custom_id: string, course_id: string | null, part: number | null, section: number | null, max_points: number | null, deleted: boolean | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> | null, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null };

export type UserCourseSummaryCoreFieldsFragment = { __typename?: 'UserCourseSummary', start_date: any | null, course: { __typename?: 'Course', has_certificate: boolean | null, points_needed: number | null, exercise_completions_needed: number | null, tier: number | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, exercises: Array<{ __typename?: 'Exercise', id: string, name: string | null, custom_id: string, course_id: string | null, part: number | null, section: number | null, max_points: number | null, deleted: boolean | null }> | null, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null }, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null, user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, user_id: string | null, max_points: number | null, n_points: number | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, extra: { __typename?: 'ProgressExtra', projectCompletion: boolean, highestTier: number | null, n_points: number, max_points: number, pointsNeeded: number, pointsPercentage: number, pointsNeededPercentage: number, exercisePercentage: number, exercisesNeededPercentage: number, totalExerciseCount: number, totalExerciseCompletions: number, totalExerciseCompletionsNeeded: number, tiers: Array<{ __typename?: 'TierInfo', id: string, name: string, tier: number, hasTier: boolean, missingFromTier: number, requiredByTier: number, exercisePercentage: number, exercisesNeededPercentage: number, exerciseCompletions: number, exerciseCount: number }>, exercises: Array<{ __typename?: 'TierProgress', exercise_number: number, tier: number, n_points: number, max_points: number, progress: number, name: string | null, custom_id: string | null, course_id: string | null, exercise_id: string | null, service_id: string | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', tier: number | null, max_points: number | null, id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> } | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null, exercise_count: number | null, exercises_completed_count: number | null, exercises_attempted_count: number | null } } | null, user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', id: string, course_id: string | null, service_id: string | null, user_id: string | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, service: { __typename?: 'Service', name: string, id: string } | null }>, completion: { __typename?: 'Completion', id: string, course_id: string | null, user_id: string | null, email: string, student_number: string | null, completion_language: string | null, completion_link: string | null, completion_date: any | null, tier: number | null, grade: string | null, eligible_for_ects: boolean | null, project_completion: boolean, registered: boolean, created_at: any, updated_at: any, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, completion_id: string | null, organization_id: string | null, created_at: any, updated_at: any, organization: { __typename?: 'Organization', id: string, slug: string, name: string } | null }>, certificate_availability: { __typename?: 'CertificateAvailability', completed_course: boolean | null, existing_certificate: string | null, honors: boolean | null } | null } | null, tier_summaries: Array<{ __typename?: 'UserCourseSummary', start_date: any | null, course: { __typename?: 'Course', has_certificate: boolean | null, points_needed: number | null, exercise_completions_needed: number | null, tier: number | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, exercises: Array<{ __typename?: 'Exercise', id: string, name: string | null, custom_id: string, course_id: string | null, part: number | null, section: number | null, max_points: number | null, deleted: boolean | null }> | null, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null }, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null, user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, user_id: string | null, max_points: number | null, n_points: number | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, extra: { __typename?: 'ProgressExtra', projectCompletion: boolean, highestTier: number | null, n_points: number, max_points: number, pointsNeeded: number, pointsPercentage: number, pointsNeededPercentage: number, exercisePercentage: number, exercisesNeededPercentage: number, totalExerciseCount: number, totalExerciseCompletions: number, totalExerciseCompletionsNeeded: number, tiers: Array<{ __typename?: 'TierInfo', id: string, name: string, tier: number, hasTier: boolean, missingFromTier: number, requiredByTier: number, exercisePercentage: number, exercisesNeededPercentage: number, exerciseCompletions: number, exerciseCount: number }>, exercises: Array<{ __typename?: 'TierProgress', exercise_number: number, tier: number, n_points: number, max_points: number, progress: number, name: string | null, custom_id: string | null, course_id: string | null, exercise_id: string | null, service_id: string | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', tier: number | null, max_points: number | null, id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> } | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null, exercise_count: number | null, exercises_completed_count: number | null, exercises_attempted_count: number | null } } | null, user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', id: string, course_id: string | null, service_id: string | null, user_id: string | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, service: { __typename?: 'Service', name: string, id: string } | null }> }> | null };

export type UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment = { __typename?: 'UserCourseSummary', start_date: any | null, course: { __typename?: 'Course', has_certificate: boolean | null, points_needed: number | null, exercise_completions_needed: number | null, tier: number | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, exercises: Array<{ __typename?: 'Exercise', id: string, name: string | null, custom_id: string, course_id: string | null, part: number | null, section: number | null, max_points: number | null, deleted: boolean | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> | null, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null }, tier_summaries: Array<{ __typename?: 'UserCourseSummary', start_date: any | null, course: { __typename?: 'Course', has_certificate: boolean | null, points_needed: number | null, exercise_completions_needed: number | null, tier: number | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, exercises: Array<{ __typename?: 'Exercise', id: string, name: string | null, custom_id: string, course_id: string | null, part: number | null, section: number | null, max_points: number | null, deleted: boolean | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> | null, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null }, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null, user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, user_id: string | null, max_points: number | null, n_points: number | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, extra: { __typename?: 'ProgressExtra', projectCompletion: boolean, highestTier: number | null, n_points: number, max_points: number, pointsNeeded: number, pointsPercentage: number, pointsNeededPercentage: number, exercisePercentage: number, exercisesNeededPercentage: number, totalExerciseCount: number, totalExerciseCompletions: number, totalExerciseCompletionsNeeded: number, tiers: Array<{ __typename?: 'TierInfo', id: string, name: string, tier: number, hasTier: boolean, missingFromTier: number, requiredByTier: number, exercisePercentage: number, exercisesNeededPercentage: number, exerciseCompletions: number, exerciseCount: number }>, exercises: Array<{ __typename?: 'TierProgress', exercise_number: number, tier: number, n_points: number, max_points: number, progress: number, name: string | null, custom_id: string | null, course_id: string | null, exercise_id: string | null, service_id: string | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', tier: number | null, max_points: number | null, id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> } | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null, exercise_count: number | null, exercises_completed_count: number | null, exercises_attempted_count: number | null } } | null, user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', id: string, course_id: string | null, service_id: string | null, user_id: string | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, service: { __typename?: 'Service', name: string, id: string } | null }> }> | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null, user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, user_id: string | null, max_points: number | null, n_points: number | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, extra: { __typename?: 'ProgressExtra', projectCompletion: boolean, highestTier: number | null, n_points: number, max_points: number, pointsNeeded: number, pointsPercentage: number, pointsNeededPercentage: number, exercisePercentage: number, exercisesNeededPercentage: number, totalExerciseCount: number, totalExerciseCompletions: number, totalExerciseCompletionsNeeded: number, tiers: Array<{ __typename?: 'TierInfo', id: string, name: string, tier: number, hasTier: boolean, missingFromTier: number, requiredByTier: number, exercisePercentage: number, exercisesNeededPercentage: number, exerciseCompletions: number, exerciseCount: number }>, exercises: Array<{ __typename?: 'TierProgress', exercise_number: number, tier: number, n_points: number, max_points: number, progress: number, name: string | null, custom_id: string | null, course_id: string | null, exercise_id: string | null, service_id: string | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', tier: number | null, max_points: number | null, id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> } | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null, exercise_count: number | null, exercises_completed_count: number | null, exercises_attempted_count: number | null } } | null, user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', id: string, course_id: string | null, service_id: string | null, user_id: string | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, service: { __typename?: 'Service', name: string, id: string } | null }>, completion: { __typename?: 'Completion', id: string, course_id: string | null, user_id: string | null, email: string, student_number: string | null, completion_language: string | null, completion_link: string | null, completion_date: any | null, tier: number | null, grade: string | null, eligible_for_ects: boolean | null, project_completion: boolean, registered: boolean, created_at: any, updated_at: any, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, completion_id: string | null, organization_id: string | null, created_at: any, updated_at: any, organization: { __typename?: 'Organization', id: string, slug: string, name: string } | null }>, certificate_availability: { __typename?: 'CertificateAvailability', completed_course: boolean | null, existing_certificate: string | null, honors: boolean | null } | null } | null };

export type UserCourseSummaryCourseListCourseFieldsFragment = { __typename?: 'Course', has_certificate: boolean | null, points_needed: number | null, exercise_completions_needed: number | null, tier: number | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null };

export type UserCourseSummaryCourseListFieldsFragment = { __typename?: 'UserCourseSummary', course: { __typename?: 'Course', has_certificate: boolean | null, points_needed: number | null, exercise_completions_needed: number | null, tier: number | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null }, tier_summaries: Array<{ __typename?: 'UserCourseSummary', course: { __typename?: 'Course', has_certificate: boolean | null, points_needed: number | null, exercise_completions_needed: number | null, tier: number | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null } }> | null };

export type UserTierCourseSummaryCoreFieldsFragment = { __typename?: 'UserCourseSummary', start_date: any | null, course: { __typename?: 'Course', has_certificate: boolean | null, points_needed: number | null, exercise_completions_needed: number | null, tier: number | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, exercises: Array<{ __typename?: 'Exercise', id: string, name: string | null, custom_id: string, course_id: string | null, part: number | null, section: number | null, max_points: number | null, deleted: boolean | null }> | null, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null }, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null, user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, user_id: string | null, max_points: number | null, n_points: number | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, extra: { __typename?: 'ProgressExtra', projectCompletion: boolean, highestTier: number | null, n_points: number, max_points: number, pointsNeeded: number, pointsPercentage: number, pointsNeededPercentage: number, exercisePercentage: number, exercisesNeededPercentage: number, totalExerciseCount: number, totalExerciseCompletions: number, totalExerciseCompletionsNeeded: number, tiers: Array<{ __typename?: 'TierInfo', id: string, name: string, tier: number, hasTier: boolean, missingFromTier: number, requiredByTier: number, exercisePercentage: number, exercisesNeededPercentage: number, exerciseCompletions: number, exerciseCount: number }>, exercises: Array<{ __typename?: 'TierProgress', exercise_number: number, tier: number, n_points: number, max_points: number, progress: number, name: string | null, custom_id: string | null, course_id: string | null, exercise_id: string | null, service_id: string | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', tier: number | null, max_points: number | null, id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> } | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null, exercise_count: number | null, exercises_completed_count: number | null, exercises_attempted_count: number | null } } | null, user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', id: string, course_id: string | null, service_id: string | null, user_id: string | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, service: { __typename?: 'Service', name: string, id: string } | null }> };

export type UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment = { __typename?: 'UserCourseSummary', start_date: any | null, course: { __typename?: 'Course', has_certificate: boolean | null, points_needed: number | null, exercise_completions_needed: number | null, tier: number | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, exercises: Array<{ __typename?: 'Exercise', id: string, name: string | null, custom_id: string, course_id: string | null, part: number | null, section: number | null, max_points: number | null, deleted: boolean | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> | null, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null }, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null, user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, user_id: string | null, max_points: number | null, n_points: number | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, extra: { __typename?: 'ProgressExtra', projectCompletion: boolean, highestTier: number | null, n_points: number, max_points: number, pointsNeeded: number, pointsPercentage: number, pointsNeededPercentage: number, exercisePercentage: number, exercisesNeededPercentage: number, totalExerciseCount: number, totalExerciseCompletions: number, totalExerciseCompletionsNeeded: number, tiers: Array<{ __typename?: 'TierInfo', id: string, name: string, tier: number, hasTier: boolean, missingFromTier: number, requiredByTier: number, exercisePercentage: number, exercisesNeededPercentage: number, exerciseCompletions: number, exerciseCount: number }>, exercises: Array<{ __typename?: 'TierProgress', exercise_number: number, tier: number, n_points: number, max_points: number, progress: number, name: string | null, custom_id: string | null, course_id: string | null, exercise_id: string | null, service_id: string | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', tier: number | null, max_points: number | null, id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> } | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null, exercise_count: number | null, exercises_completed_count: number | null, exercises_attempted_count: number | null } } | null, user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', id: string, course_id: string | null, service_id: string | null, user_id: string | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, service: { __typename?: 'Service', name: string, id: string } | null }> };

export type UserOrganizationFieldsFragment = { __typename?: 'UserOrganization', id: string, user_id: string | null, organization_id: string | null, confirmed: boolean | null, confirmed_at: any | null, consented: boolean | null, organizational_email: string | null, organizational_identifier: string | null, created_at: any, updated_at: any, organization: { __typename?: 'Organization', id: string, slug: string, email: string | null, hidden: boolean | null, disabled: boolean | null, name: string, information: string | null, created_at: any, updated_at: any, required_confirmation: boolean | null, required_organization_email: string | null, organization_translations: Array<{ __typename?: 'OrganizationTranslation', id: string, organization_id: string | null, language: string, name: string, information: string | null }> } | null };

export type UserOrganizationJoinConfirmationFieldsFragment = { __typename?: 'UserOrganizationJoinConfirmation', id: string, email: string, confirmed: boolean | null, confirmed_at: any | null, expired: boolean | null, expires_at: any | null, redirect: string | null, language: string | null, created_at: any | null, updated_at: any | null, email_delivery: { __typename?: 'EmailDelivery', id: string, email: string | null, sent: boolean, error: boolean, error_message: string | null, email_template_id: string | null, user_id: string | null, organization_id: string | null, created_at: any, updated_at: any } | null };

export type UserOrganizationWithUserOrganizationJoinConfirmationFieldsFragment = { __typename?: 'UserOrganization', id: string, user_id: string | null, organization_id: string | null, confirmed: boolean | null, confirmed_at: any | null, consented: boolean | null, organizational_email: string | null, organizational_identifier: string | null, created_at: any, updated_at: any, user_organization_join_confirmations: Array<{ __typename?: 'UserOrganizationJoinConfirmation', id: string, email: string, confirmed: boolean | null, confirmed_at: any | null, expired: boolean | null, expires_at: any | null, redirect: string | null, language: string | null, created_at: any | null, updated_at: any | null, email_delivery: { __typename?: 'EmailDelivery', id: string, email: string | null, sent: boolean, error: boolean, error_message: string | null, email_template_id: string | null, user_id: string | null, organization_id: string | null, created_at: any, updated_at: any } | null }> | null, organization: { __typename?: 'Organization', id: string, slug: string, email: string | null, hidden: boolean | null, disabled: boolean | null, name: string, information: string | null, created_at: any, updated_at: any, required_confirmation: boolean | null, required_organization_email: string | null, organization_translations: Array<{ __typename?: 'OrganizationTranslation', id: string, organization_id: string | null, language: string, name: string, information: string | null }> } | null };

export type CreateRegistrationAttemptDateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  completion_registration_attempt_date: Scalars['DateTime']['input'];
}>;


export type CreateRegistrationAttemptDateMutation = { __typename?: 'Mutation', createRegistrationAttemptDate: { __typename?: 'Completion', id: string, completion_registration_attempt_date: any | null } | null };

export type RecheckCompletionsMutationVariables = Exact<{
  slug?: InputMaybe<Scalars['String']['input']>;
}>;


export type RecheckCompletionsMutation = { __typename?: 'Mutation', recheckCompletions: string | null };

export type AddManualCompletionMutationVariables = Exact<{
  course_id?: InputMaybe<Scalars['ID']['input']>;
  course_slug?: InputMaybe<Scalars['String']['input']>;
  completions?: InputMaybe<Array<ManualCompletionArg> | ManualCompletionArg>;
}>;


export type AddManualCompletionMutation = { __typename?: 'Mutation', addManualCompletion: Array<{ __typename?: 'Completion', id: string, course_id: string | null, user_id: string | null, email: string, student_number: string | null, completion_language: string | null, completion_link: string | null, completion_date: any | null, tier: number | null, grade: string | null, eligible_for_ects: boolean | null, project_completion: boolean, registered: boolean, created_at: any, updated_at: any, user: { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any } | null }> | null };

export type AddCourseMutationVariables = Exact<{
  course: CourseCreateArg;
}>;


export type AddCourseMutation = { __typename?: 'Mutation', addCourse: { __typename?: 'Course', automatic_completions: boolean | null, automatic_completions_eligible_for_ects: boolean | null, exercise_completions_needed: number | null, points_needed: number | null, instructions: string | null, upcoming_active_link: boolean | null, description: string | null, link: string | null, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, tier: number | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, start_date: any | null, end_date: any | null, has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, course_translations: Array<{ __typename?: 'CourseTranslation', course_id: string | null, description: string, link: string | null, instructions: string | null, created_at: any, updated_at: any, id: string, language: string, name: string }>, open_university_registration_links: Array<{ __typename?: 'OpenUniversityRegistrationLink', id: string, course_code: string, language: string, link: string | null }>, inherit_settings_from: { __typename?: 'Course', id: string, slug: string, name: string } | null, sponsors: Array<{ __typename?: 'Sponsor', order: number | null, id: string, name: string, translations: Array<{ __typename?: 'SponsorTranslation', sponsor_id: string, language: string, name: string, description: string | null, link: string | null, link_text: string | null }>, images: Array<{ __typename?: 'SponsorImage', sponsor_id: string, type: string, width: number, height: number, uri: string }> | null }>, study_modules: Array<{ __typename?: 'StudyModule', id: string, slug: string, name: string }>, completions_handled_by: { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string } | null, course_variants: Array<{ __typename?: 'CourseVariant', id: string, slug: string, description: string | null }>, course_aliases: Array<{ __typename?: 'CourseAlias', id: string, course_code: string }>, user_course_settings_visibilities: Array<{ __typename?: 'UserCourseSettingsVisibility', id: string, language: string }>, tags: Array<{ __typename?: 'Tag', id: string, hidden: boolean, types: Array<string> | null, name: string | null, abbreviation: string | null, tag_translations: Array<{ __typename?: 'TagTranslation', tag_id: string, name: string, description: string | null, language: string, abbreviation: string | null }> }>, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null } | null };

export type UpdateCourseMutationVariables = Exact<{
  course: CourseUpsertArg;
}>;


export type UpdateCourseMutation = { __typename?: 'Mutation', updateCourse: { __typename?: 'Course', automatic_completions: boolean | null, automatic_completions_eligible_for_ects: boolean | null, exercise_completions_needed: number | null, points_needed: number | null, instructions: string | null, upcoming_active_link: boolean | null, description: string | null, link: string | null, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, tier: number | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, start_date: any | null, end_date: any | null, has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, completion_email: { __typename?: 'EmailTemplate', id: string, name: string | null, title: string | null, txt_body: string | null, html_body: string | null, template_type: string | null, course_instance_language: string | null, created_at: any, updated_at: any } | null, course_stats_email: { __typename?: 'EmailTemplate', id: string, name: string | null, title: string | null, txt_body: string | null, html_body: string | null, template_type: string | null, course_instance_language: string | null, created_at: any, updated_at: any } | null, course_translations: Array<{ __typename?: 'CourseTranslation', course_id: string | null, description: string, link: string | null, instructions: string | null, created_at: any, updated_at: any, id: string, language: string, name: string }>, open_university_registration_links: Array<{ __typename?: 'OpenUniversityRegistrationLink', id: string, course_code: string, language: string, link: string | null }>, inherit_settings_from: { __typename?: 'Course', id: string, slug: string, name: string } | null, sponsors: Array<{ __typename?: 'Sponsor', order: number | null, id: string, name: string, translations: Array<{ __typename?: 'SponsorTranslation', sponsor_id: string, language: string, name: string, description: string | null, link: string | null, link_text: string | null }>, images: Array<{ __typename?: 'SponsorImage', sponsor_id: string, type: string, width: number, height: number, uri: string }> | null }>, study_modules: Array<{ __typename?: 'StudyModule', id: string, slug: string, name: string }>, completions_handled_by: { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string } | null, course_variants: Array<{ __typename?: 'CourseVariant', id: string, slug: string, description: string | null }>, course_aliases: Array<{ __typename?: 'CourseAlias', id: string, course_code: string }>, user_course_settings_visibilities: Array<{ __typename?: 'UserCourseSettingsVisibility', id: string, language: string }>, tags: Array<{ __typename?: 'Tag', id: string, hidden: boolean, types: Array<string> | null, name: string | null, abbreviation: string | null, tag_translations: Array<{ __typename?: 'TagTranslation', tag_id: string, name: string, description: string | null, language: string, abbreviation: string | null }> }>, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null } | null };

export type DeleteCourseMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCourseMutation = { __typename?: 'Mutation', deleteCourse: { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string } | null };

export type UpdateEmailTemplateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  html_body?: InputMaybe<Scalars['String']['input']>;
  txt_body?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  template_type?: InputMaybe<Scalars['String']['input']>;
  triggered_automatically_by_course_id?: InputMaybe<Scalars['String']['input']>;
  exercise_completions_threshold?: InputMaybe<Scalars['Int']['input']>;
  points_threshold?: InputMaybe<Scalars['Int']['input']>;
  course_instance_language?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateEmailTemplateMutation = { __typename?: 'Mutation', updateEmailTemplate: { __typename?: 'EmailTemplate', triggered_automatically_by_course_id: string | null, exercise_completions_threshold: number | null, points_threshold: number | null, id: string, name: string | null, title: string | null, txt_body: string | null, html_body: string | null, template_type: string | null, course_instance_language: string | null, created_at: any, updated_at: any } | null };

export type AddEmailTemplateMutationVariables = Exact<{
  name: Scalars['String']['input'];
  html_body?: InputMaybe<Scalars['String']['input']>;
  txt_body?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  template_type?: InputMaybe<Scalars['String']['input']>;
  triggered_automatically_by_course_id?: InputMaybe<Scalars['String']['input']>;
  exercise_completions_threshold?: InputMaybe<Scalars['Int']['input']>;
  points_threshold?: InputMaybe<Scalars['Int']['input']>;
  course_instance_language?: InputMaybe<Scalars['String']['input']>;
}>;


export type AddEmailTemplateMutation = { __typename?: 'Mutation', addEmailTemplate: { __typename?: 'EmailTemplate', triggered_automatically_by_course_id: string | null, exercise_completions_threshold: number | null, points_threshold: number | null, id: string, name: string | null, title: string | null, txt_body: string | null, html_body: string | null, template_type: string | null, course_instance_language: string | null, created_at: any, updated_at: any } | null };

export type DeleteEmailTemplateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteEmailTemplateMutation = { __typename?: 'Mutation', deleteEmailTemplate: { __typename?: 'EmailTemplate', id: string, name: string | null, title: string | null, txt_body: string | null, html_body: string | null, template_type: string | null, course_instance_language: string | null, created_at: any, updated_at: any } | null };

export type UpdateOrganizationEmailTemplateMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  email_template_id: Scalars['ID']['input'];
}>;


export type UpdateOrganizationEmailTemplateMutation = { __typename?: 'Mutation', updateOrganizationEmailTemplate: { __typename?: 'Organization', id: string, slug: string, join_organization_email_template: { __typename?: 'EmailTemplate', id: string } | null } | null };

export type AddStudyModuleMutationVariables = Exact<{
  study_module: StudyModuleCreateArg;
}>;


export type AddStudyModuleMutation = { __typename?: 'Mutation', addStudyModule: { __typename?: 'StudyModule', description: string | null, image: string | null, order: number | null, created_at: any, updated_at: any, id: string, slug: string, name: string, study_module_translations: Array<{ __typename?: 'StudyModuleTranslation', id: string, language: string, name: string, description: string, created_at: any, updated_at: any }> } | null };

export type UpdateStudyModuleMutationVariables = Exact<{
  study_module: StudyModuleUpsertArg;
}>;


export type UpdateStudyModuleMutation = { __typename?: 'Mutation', updateStudyModule: { __typename?: 'StudyModule', description: string | null, image: string | null, order: number | null, created_at: any, updated_at: any, id: string, slug: string, name: string, study_module_translations: Array<{ __typename?: 'StudyModuleTranslation', id: string, language: string, name: string, description: string, created_at: any, updated_at: any }> } | null };

export type DeleteStudyModuleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteStudyModuleMutation = { __typename?: 'Mutation', deleteStudyModule: { __typename?: 'StudyModule', id: string, slug: string, name: string } | null };

export type UpdateUserNameMutationVariables = Exact<{
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateUserNameMutation = { __typename?: 'Mutation', updateUserName: { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any } | null };

export type UpdateResearchConsentMutationVariables = Exact<{
  value: Scalars['Boolean']['input'];
}>;


export type UpdateResearchConsentMutation = { __typename?: 'Mutation', updateResearchConsent: { __typename?: 'User', id: string } | null };

export type UserCourseStatsSubscribeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UserCourseStatsSubscribeMutation = { __typename?: 'Mutation', createCourseStatsSubscription: { __typename?: 'CourseStatsSubscription', id: string } | null };

export type UserCourseStatsUnsubscribeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UserCourseStatsUnsubscribeMutation = { __typename?: 'Mutation', deleteCourseStatsSubscription: { __typename?: 'CourseStatsSubscription', id: string } | null };

export type AddUserOrganizationMutationVariables = Exact<{
  user_id?: InputMaybe<Scalars['ID']['input']>;
  organization_id?: InputMaybe<Scalars['ID']['input']>;
  organization_slug?: InputMaybe<Scalars['String']['input']>;
  organizational_email?: InputMaybe<Scalars['String']['input']>;
  organizational_identifier?: InputMaybe<Scalars['String']['input']>;
  redirect?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type AddUserOrganizationMutation = { __typename?: 'Mutation', addUserOrganization: { __typename?: 'UserOrganization', id: string, user_id: string | null, organization_id: string | null, confirmed: boolean | null, confirmed_at: any | null, consented: boolean | null, organizational_email: string | null, organizational_identifier: string | null, created_at: any, updated_at: any, user_organization_join_confirmations: Array<{ __typename?: 'UserOrganizationJoinConfirmation', id: string, email: string, confirmed: boolean | null, confirmed_at: any | null, expired: boolean | null, expires_at: any | null, redirect: string | null, language: string | null, created_at: any | null, updated_at: any | null, email_delivery: { __typename?: 'EmailDelivery', id: string, email: string | null, sent: boolean, error: boolean, error_message: string | null, email_template_id: string | null, user_id: string | null, organization_id: string | null, created_at: any, updated_at: any } | null }> | null, organization: { __typename?: 'Organization', id: string, slug: string, email: string | null, hidden: boolean | null, disabled: boolean | null, name: string, information: string | null, created_at: any, updated_at: any, required_confirmation: boolean | null, required_organization_email: string | null, organization_translations: Array<{ __typename?: 'OrganizationTranslation', id: string, organization_id: string | null, language: string, name: string, information: string | null }> } | null } | null };

export type UpdateUserOrganizationConsentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  consented: Scalars['Boolean']['input'];
}>;


export type UpdateUserOrganizationConsentMutation = { __typename?: 'Mutation', updateUserOrganizationConsent: { __typename?: 'UserOrganization', id: string, consented: boolean | null } | null };

export type UpdateUserOrganizationOrganizationalMailMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  organizational_email: Scalars['String']['input'];
  redirect?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateUserOrganizationOrganizationalMailMutation = { __typename?: 'Mutation', updateUserOrganizationOrganizationalMail: { __typename?: 'UserOrganization', id: string, user_id: string | null, organization_id: string | null, confirmed: boolean | null, confirmed_at: any | null, consented: boolean | null, organizational_email: string | null, organizational_identifier: string | null, created_at: any, updated_at: any, user_organization_join_confirmations: Array<{ __typename?: 'UserOrganizationJoinConfirmation', id: string, email: string, confirmed: boolean | null, confirmed_at: any | null, expired: boolean | null, expires_at: any | null, redirect: string | null, language: string | null, created_at: any | null, updated_at: any | null, email_delivery: { __typename?: 'EmailDelivery', id: string, email: string | null, sent: boolean, error: boolean, error_message: string | null, email_template_id: string | null, user_id: string | null, organization_id: string | null, created_at: any, updated_at: any } | null }> | null, organization: { __typename?: 'Organization', id: string, slug: string, email: string | null, hidden: boolean | null, disabled: boolean | null, name: string, information: string | null, created_at: any, updated_at: any, required_confirmation: boolean | null, required_organization_email: string | null, organization_translations: Array<{ __typename?: 'OrganizationTranslation', id: string, organization_id: string | null, language: string, name: string, information: string | null }> } | null } | null };

export type DeleteUserOrganizationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteUserOrganizationMutation = { __typename?: 'Mutation', deleteUserOrganization: { __typename?: 'UserOrganization', id: string } | null };

export type ConfirmUserOrganizationJoinMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  code: Scalars['String']['input'];
}>;


export type ConfirmUserOrganizationJoinMutation = { __typename?: 'Mutation', confirmUserOrganizationJoin: { __typename?: 'UserOrganization', id: string, user_id: string | null, organization_id: string | null, confirmed: boolean | null, confirmed_at: any | null, consented: boolean | null, organizational_email: string | null, organizational_identifier: string | null, created_at: any, updated_at: any, user_organization_join_confirmations: Array<{ __typename?: 'UserOrganizationJoinConfirmation', id: string, email: string, confirmed: boolean | null, confirmed_at: any | null, expired: boolean | null, expires_at: any | null, redirect: string | null, language: string | null, created_at: any | null, updated_at: any | null, email_delivery: { __typename?: 'EmailDelivery', id: string, email: string | null, sent: boolean, error: boolean, error_message: string | null, email_template_id: string | null, user_id: string | null, organization_id: string | null, created_at: any, updated_at: any } | null }> | null, organization: { __typename?: 'Organization', id: string, slug: string, email: string | null, hidden: boolean | null, disabled: boolean | null, name: string, information: string | null, created_at: any, updated_at: any, required_confirmation: boolean | null, required_organization_email: string | null, organization_translations: Array<{ __typename?: 'OrganizationTranslation', id: string, organization_id: string | null, language: string, name: string, information: string | null }> } | null } | null };

export type RequestNewUserOrganizationJoinConfirmationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  organizational_email?: InputMaybe<Scalars['String']['input']>;
  redirect?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type RequestNewUserOrganizationJoinConfirmationMutation = { __typename?: 'Mutation', requestNewUserOrganizationJoinConfirmation: { __typename?: 'UserOrganizationJoinConfirmation', id: string, email: string, confirmed: boolean | null, confirmed_at: any | null, expired: boolean | null, expires_at: any | null, redirect: string | null, language: string | null, created_at: any | null, updated_at: any | null, user_organization: { __typename?: 'UserOrganization', id: string, user_id: string | null, organization_id: string | null, confirmed: boolean | null, confirmed_at: any | null, consented: boolean | null, organizational_email: string | null, organizational_identifier: string | null, created_at: any, updated_at: any, organization: { __typename?: 'Organization', id: string, slug: string, email: string | null, hidden: boolean | null, disabled: boolean | null, name: string, information: string | null, created_at: any, updated_at: any, required_confirmation: boolean | null, required_organization_email: string | null, organization_translations: Array<{ __typename?: 'OrganizationTranslation', id: string, organization_id: string | null, language: string, name: string, information: string | null }> } | null }, email_delivery: { __typename?: 'EmailDelivery', id: string, email: string | null, sent: boolean, error: boolean, error_message: string | null, email_template_id: string | null, user_id: string | null, organization_id: string | null, created_at: any, updated_at: any } | null } | null };

export type PaginatedCompletionsQueryVariables = Exact<{
  course: Scalars['String']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  completionLanguage?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type PaginatedCompletionsQuery = { __typename?: 'Query', completionsPaginated: { __typename?: 'QueryCompletionsPaginated_type_Connection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null, endCursor: string | null }, edges: Array<{ __typename?: 'CompletionEdge', node: { __typename?: 'Completion', id: string, course_id: string | null, user_id: string | null, email: string, student_number: string | null, completion_language: string | null, completion_link: string | null, completion_date: any | null, tier: number | null, grade: string | null, eligible_for_ects: boolean | null, project_completion: boolean, registered: boolean, created_at: any, updated_at: any, user: { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any } | null, course: { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string } | null, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, organization: { __typename?: 'Organization', id: string, slug: string } | null }> } }> } | null };

export type PaginatedCompletionsPreviousPageQueryVariables = Exact<{
  course: Scalars['String']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  completionLanguage?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type PaginatedCompletionsPreviousPageQuery = { __typename?: 'Query', completionsPaginated: { __typename?: 'QueryCompletionsPaginated_type_Connection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null, endCursor: string | null }, edges: Array<{ __typename?: 'CompletionEdge', node: { __typename?: 'Completion', id: string, course_id: string | null, user_id: string | null, email: string, student_number: string | null, completion_language: string | null, completion_link: string | null, completion_date: any | null, tier: number | null, grade: string | null, eligible_for_ects: boolean | null, project_completion: boolean, registered: boolean, created_at: any, updated_at: any, user: { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any } | null, course: { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string } | null, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, organization: { __typename?: 'Organization', id: string, slug: string } | null }> } }> } | null };

export type CoursesQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type CoursesQuery = { __typename?: 'Query', courses: Array<{ __typename?: 'Course', description: string | null, link: string | null, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, upcoming_active_link: boolean | null, tier: number | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, start_date: any | null, end_date: any | null, has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, course_translations: Array<{ __typename?: 'CourseTranslation', id: string, language: string, name: string }>, tags: Array<{ __typename?: 'Tag', id: string, hidden: boolean, types: Array<string> | null, name: string | null, abbreviation: string | null, tag_translations: Array<{ __typename?: 'TagTranslation', tag_id: string, name: string, description: string | null, language: string, abbreviation: string | null }> }>, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null }> | null };

export type NewCoursesQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type NewCoursesQuery = { __typename?: 'Query', courses: Array<{ __typename?: 'Course', description: string | null, link: string | null, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, upcoming_active_link: boolean | null, tier: number | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, start_date: any | null, end_date: any | null, has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, course_translations: Array<{ __typename?: 'CourseTranslation', id: string, language: string, name: string }>, tags: Array<{ __typename?: 'Tag', id: string, hidden: boolean, types: Array<string> | null, name: string | null, abbreviation: string | null, tag_translations: Array<{ __typename?: 'TagTranslation', tag_id: string, name: string, description: string | null, language: string, abbreviation: string | null }> }>, sponsors: Array<{ __typename?: 'Sponsor', order: number | null, id: string, name: string, translations: Array<{ __typename?: 'SponsorTranslation', sponsor_id: string, language: string, name: string, description: string | null, link: string | null, link_text: string | null }>, images: Array<{ __typename?: 'SponsorImage', sponsor_id: string, type: string, width: number, height: number, uri: string }> | null }>, study_modules: Array<{ __typename?: 'StudyModule', id: string, slug: string, name: string }> }> | null };

export type FrontpageCoursesModulesQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type FrontpageCoursesModulesQuery = { __typename?: 'Query', courses: Array<{ __typename?: 'Course', description: string | null, link: string | null, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, upcoming_active_link: boolean | null, tier: number | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, start_date: any | null, end_date: any | null, has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null }> | null, study_modules: Array<{ __typename?: 'StudyModule', description: string | null, image: string | null, order: number | null, created_at: any, updated_at: any, id: string, slug: string, name: string }> | null };

export type FrontpageCoursesQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type FrontpageCoursesQuery = { __typename?: 'Query', courses: Array<{ __typename?: 'Course', description: string | null, link: string | null, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, upcoming_active_link: boolean | null, tier: number | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, start_date: any | null, end_date: any | null, has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null }> | null };

export type NewFrontpageCoursesModulesQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type NewFrontpageCoursesModulesQuery = { __typename?: 'Query', courses: Array<{ __typename?: 'Course', description: string | null, link: string | null, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, upcoming_active_link: boolean | null, tier: number | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, start_date: any | null, end_date: any | null, has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, sponsors: Array<{ __typename?: 'Sponsor', id: string, name: string, translations: Array<{ __typename?: 'SponsorTranslation', sponsor_id: string, language: string, name: string, description: string | null, link: string | null, link_text: string | null }>, images: Array<{ __typename?: 'SponsorImage', sponsor_id: string, type: string, width: number, height: number, uri: string }> | null }>, study_modules: Array<{ __typename?: 'StudyModule', id: string, slug: string, name: string }> }> | null, study_modules: Array<{ __typename?: 'StudyModule', description: string | null, image: string | null, order: number | null, created_at: any, updated_at: any, id: string, slug: string, name: string }> | null };

export type EditorCoursesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  handledBy?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Array<CourseStatus> | CourseStatus>;
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type EditorCoursesQuery = { __typename?: 'Query', courses: Array<{ __typename?: 'Course', instructions: string | null, upcoming_active_link: boolean | null, description: string | null, link: string | null, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, tier: number | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, start_date: any | null, end_date: any | null, has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, completions_handled_by: { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string } | null, course_variants: Array<{ __typename?: 'CourseVariant', id: string, slug: string, description: string | null }>, course_aliases: Array<{ __typename?: 'CourseAlias', id: string, course_code: string }>, user_course_settings_visibilities: Array<{ __typename?: 'UserCourseSettingsVisibility', id: string, language: string }>, study_modules: Array<{ __typename?: 'StudyModule', id: string, slug: string, name: string }>, course_translations: Array<{ __typename?: 'CourseTranslation', id: string, language: string, name: string }>, tags: Array<{ __typename?: 'Tag', id: string, hidden: boolean, types: Array<string> | null, name: string | null, abbreviation: string | null, tag_translations: Array<{ __typename?: 'TagTranslation', tag_id: string, name: string, description: string | null, language: string, abbreviation: string | null }> }>, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null }> | null };

export type CourseFromSlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type CourseFromSlugQuery = { __typename?: 'Query', course: { __typename?: 'Course', description: string | null, instructions: string | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string } | null };

export type CourseEditorOtherCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type CourseEditorOtherCoursesQuery = { __typename?: 'Query', courses: Array<{ __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, course_translations: Array<{ __typename?: 'CourseTranslation', id: string, language: string, name: string }>, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null }> | null };

export type HandlerCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type HandlerCoursesQuery = { __typename?: 'Query', handlerCourses: Array<{ __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string }> | null };

export type CourseEditorDetailsQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']['input']>;
}>;


export type CourseEditorDetailsQuery = { __typename?: 'Query', course: { __typename?: 'Course', automatic_completions: boolean | null, automatic_completions_eligible_for_ects: boolean | null, exercise_completions_needed: number | null, points_needed: number | null, instructions: string | null, upcoming_active_link: boolean | null, description: string | null, link: string | null, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, tier: number | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, start_date: any | null, end_date: any | null, has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, course_translations: Array<{ __typename?: 'CourseTranslation', course_id: string | null, description: string, link: string | null, instructions: string | null, created_at: any, updated_at: any, id: string, language: string, name: string }>, open_university_registration_links: Array<{ __typename?: 'OpenUniversityRegistrationLink', id: string, course_code: string, language: string, link: string | null }>, inherit_settings_from: { __typename?: 'Course', id: string, slug: string, name: string } | null, sponsors: Array<{ __typename?: 'Sponsor', order: number | null, id: string, name: string, translations: Array<{ __typename?: 'SponsorTranslation', sponsor_id: string, language: string, name: string, description: string | null, link: string | null, link_text: string | null }>, images: Array<{ __typename?: 'SponsorImage', sponsor_id: string, type: string, width: number, height: number, uri: string }> | null }>, study_modules: Array<{ __typename?: 'StudyModule', id: string, slug: string, name: string }>, completions_handled_by: { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string } | null, course_variants: Array<{ __typename?: 'CourseVariant', id: string, slug: string, description: string | null }>, course_aliases: Array<{ __typename?: 'CourseAlias', id: string, course_code: string }>, user_course_settings_visibilities: Array<{ __typename?: 'UserCourseSettingsVisibility', id: string, language: string }>, tags: Array<{ __typename?: 'Tag', id: string, hidden: boolean, types: Array<string> | null, name: string | null, abbreviation: string | null, tag_translations: Array<{ __typename?: 'TagTranslation', tag_id: string, name: string, description: string | null, language: string, abbreviation: string | null }> }>, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null } | null };

export type EmailTemplateEditorCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type EmailTemplateEditorCoursesQuery = { __typename?: 'Query', courses: Array<{ __typename?: 'Course', teacher_in_charge_name: string, teacher_in_charge_email: string, start_date: any | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, completion_email: { __typename?: 'EmailTemplate', id: string, name: string | null, title: string | null, txt_body: string | null, html_body: string | null, template_type: string | null, course_instance_language: string | null, created_at: any, updated_at: any } | null, course_stats_email: { __typename?: 'EmailTemplate', id: string, name: string | null, title: string | null, txt_body: string | null, html_body: string | null, template_type: string | null, course_instance_language: string | null, created_at: any, updated_at: any } | null }> | null };

export type CourseDashboardQueryVariables = Exact<{
  slug: Scalars['String']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type CourseDashboardQuery = { __typename?: 'Query', course: { __typename?: 'Course', teacher_in_charge_name: string, teacher_in_charge_email: string, start_date: any | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, completion_email: { __typename?: 'EmailTemplate', id: string, name: string | null, title: string | null, txt_body: string | null, html_body: string | null, template_type: string | null, course_instance_language: string | null, created_at: any, updated_at: any } | null, course_stats_email: { __typename?: 'EmailTemplate', id: string, name: string | null, title: string | null, txt_body: string | null, html_body: string | null, template_type: string | null, course_instance_language: string | null, created_at: any, updated_at: any } | null } | null };

export type EmailTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type EmailTemplatesQuery = { __typename?: 'Query', email_templates: Array<{ __typename?: 'EmailTemplate', triggered_automatically_by_course_id: string | null, exercise_completions_threshold: number | null, points_threshold: number | null, id: string, name: string | null, title: string | null, txt_body: string | null, html_body: string | null, template_type: string | null, course_instance_language: string | null, created_at: any, updated_at: any }> | null };

export type EmailTemplateQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type EmailTemplateQuery = { __typename?: 'Query', email_template: { __typename?: 'EmailTemplate', triggered_automatically_by_course_id: string | null, exercise_completions_threshold: number | null, points_threshold: number | null, id: string, name: string | null, title: string | null, txt_body: string | null, html_body: string | null, template_type: string | null, course_instance_language: string | null, created_at: any, updated_at: any } | null };

export type OrganizationsQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  cursor?: InputMaybe<OrganizationWhereUniqueInput>;
  orderBy?: InputMaybe<Array<OrganizationOrderByWithRelationAndSearchRelevanceInput> | OrganizationOrderByWithRelationAndSearchRelevanceInput>;
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type OrganizationsQuery = { __typename?: 'Query', organizations: Array<{ __typename?: 'Organization', id: string, slug: string, email: string | null, hidden: boolean | null, disabled: boolean | null, name: string, information: string | null, created_at: any, updated_at: any, required_confirmation: boolean | null, required_organization_email: string | null, organization_translations: Array<{ __typename?: 'OrganizationTranslation', id: string, organization_id: string | null, language: string, name: string, information: string | null }> }> | null };

export type OrganizationQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
}>;


export type OrganizationQuery = { __typename?: 'Query', organization: { __typename?: 'Organization', id: string, slug: string, email: string | null, hidden: boolean | null, disabled: boolean | null, name: string, information: string | null, created_at: any, updated_at: any, required_confirmation: boolean | null, required_organization_email: string | null, organization_translations: Array<{ __typename?: 'OrganizationTranslation', id: string, organization_id: string | null, language: string, name: string, information: string | null }> } | null };

export type CourseEditorSponsorsQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type CourseEditorSponsorsQuery = { __typename?: 'Query', sponsors: Array<{ __typename?: 'Sponsor', id: string, name: string, translations: Array<{ __typename?: 'SponsorTranslation', sponsor_id: string, language: string, name: string, description: string | null, link: string | null, link_text: string | null }>, images: Array<{ __typename?: 'SponsorImage', sponsor_id: string, type: string, width: number, height: number, uri: string }> | null }> | null };

export type StudyModulesQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type StudyModulesQuery = { __typename?: 'Query', study_modules: Array<{ __typename?: 'StudyModule', description: string | null, image: string | null, order: number | null, created_at: any, updated_at: any, id: string, slug: string, name: string }> | null };

export type FrontpageModulesWithCoursesQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']['input']>;
  statuses?: InputMaybe<Array<CourseStatus> | CourseStatus>;
}>;


export type FrontpageModulesWithCoursesQuery = { __typename?: 'Query', study_modules: Array<{ __typename?: 'StudyModule', description: string | null, image: string | null, order: number | null, created_at: any, updated_at: any, id: string, slug: string, name: string, courses: Array<{ __typename?: 'Course', description: string | null, link: string | null, order: number | null, study_module_order: number | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, start_date: any | null, end_date: any | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string }> | null }> | null };

export type StudyModulesWithCoursesQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']['input']>;
  statuses?: InputMaybe<Array<CourseStatus> | CourseStatus>;
}>;


export type StudyModulesWithCoursesQuery = { __typename?: 'Query', study_modules: Array<{ __typename?: 'StudyModule', description: string | null, image: string | null, order: number | null, created_at: any, updated_at: any, id: string, slug: string, name: string, courses: Array<{ __typename?: 'Course', description: string | null, link: string | null, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, upcoming_active_link: boolean | null, tier: number | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, start_date: any | null, end_date: any | null, has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, course_translations: Array<{ __typename?: 'CourseTranslation', id: string, language: string, name: string }>, tags: Array<{ __typename?: 'Tag', id: string, hidden: boolean, types: Array<string> | null, name: string | null, abbreviation: string | null, tag_translations: Array<{ __typename?: 'TagTranslation', tag_id: string, name: string, description: string | null, language: string, abbreviation: string | null }> }>, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null }> | null }> | null };

export type NewStudyModulesWithCoursesQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type NewStudyModulesWithCoursesQuery = { __typename?: 'Query', study_modules: Array<{ __typename?: 'StudyModule', description: string | null, image: string | null, order: number | null, created_at: any, updated_at: any, id: string, slug: string, name: string, courses: Array<{ __typename?: 'Course', description: string | null, link: string | null, order: number | null, study_module_order: number | null, promote: boolean | null, status: CourseStatus | null, start_point: boolean | null, study_module_start_point: boolean | null, hidden: boolean | null, upcoming_active_link: boolean | null, tier: number | null, support_email: string | null, teacher_in_charge_email: string, teacher_in_charge_name: string, start_date: any | null, end_date: any | null, has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, course_translations: Array<{ __typename?: 'CourseTranslation', id: string, language: string, name: string }>, tags: Array<{ __typename?: 'Tag', id: string, hidden: boolean, types: Array<string> | null, name: string | null, abbreviation: string | null, tag_translations: Array<{ __typename?: 'TagTranslation', tag_id: string, name: string, description: string | null, language: string, abbreviation: string | null }> }>, sponsors: Array<{ __typename?: 'Sponsor', order: number | null, id: string, name: string, translations: Array<{ __typename?: 'SponsorTranslation', sponsor_id: string, language: string, name: string, description: string | null, link: string | null, link_text: string | null }>, images: Array<{ __typename?: 'SponsorImage', sponsor_id: string, type: string, width: number, height: number, uri: string }> | null }>, study_modules: Array<{ __typename?: 'StudyModule', id: string, slug: string, name: string }> }> | null }> | null };

export type EditorStudyModulesQueryVariables = Exact<{ [key: string]: never; }>;


export type EditorStudyModulesQuery = { __typename?: 'Query', study_modules: Array<{ __typename?: 'StudyModule', description: string | null, image: string | null, order: number | null, created_at: any, updated_at: any, id: string, slug: string, name: string, study_module_translations: Array<{ __typename?: 'StudyModuleTranslation', id: string, language: string, name: string, description: string, created_at: any, updated_at: any }> }> | null };

export type EditorStudyModuleDetailsQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type EditorStudyModuleDetailsQuery = { __typename?: 'Query', study_module: { __typename?: 'StudyModule', description: string | null, image: string | null, order: number | null, created_at: any, updated_at: any, id: string, slug: string, name: string, courses: Array<{ __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string }> | null, study_module_translations: Array<{ __typename?: 'StudyModuleTranslation', id: string, language: string, name: string, description: string, created_at: any, updated_at: any }> } | null };

export type StudyModuleExistsQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type StudyModuleExistsQuery = { __typename?: 'Query', study_module_exists: boolean | null };

export type CourseEditorTagsQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']['input']>;
  excludeTagTypes?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  includeWithNoCourses?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type CourseEditorTagsQuery = { __typename?: 'Query', tags: Array<{ __typename?: 'Tag', id: string, hidden: boolean, types: Array<string> | null, name: string | null, abbreviation: string | null, tag_translations: Array<{ __typename?: 'TagTranslation', tag_id: string, name: string, description: string | null, language: string, abbreviation: string | null }> }> | null };

export type TagEditorTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type TagEditorTagsQuery = { __typename?: 'Query', tags: Array<{ __typename?: 'Tag', id: string, hidden: boolean, types: Array<string> | null, name: string | null, abbreviation: string | null, tag_translations: Array<{ __typename?: 'TagTranslation', tag_id: string, name: string, description: string | null, language: string, abbreviation: string | null }> }> | null };

export type TagEditorTagTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type TagEditorTagTypesQuery = { __typename?: 'Query', tagTypes: Array<{ __typename?: 'TagType', name: string }> | null };

export type CourseCatalogueTagsQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type CourseCatalogueTagsQuery = { __typename?: 'Query', tags: Array<{ __typename?: 'Tag', id: string, hidden: boolean, types: Array<string> | null, name: string | null, abbreviation: string | null, tag_translations: Array<{ __typename?: 'TagTranslation', tag_id: string, name: string, description: string | null, language: string, abbreviation: string | null }> }> | null };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any } | null };

export type CurrentUserDetailedQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserDetailedQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', administrator: boolean, research_consent: boolean | null, id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any } | null };

export type CurrentUserStatsSubscriptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserStatsSubscriptionsQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, course_stats_subscriptions: Array<{ __typename?: 'CourseStatsSubscription', id: string, email_template: { __typename?: 'EmailTemplate', id: string } | null }> } | null };

export type UserSummaryQueryVariables = Exact<{
  upstream_id?: InputMaybe<Scalars['Int']['input']>;
  includeNoPointsAwardedExercises?: InputMaybe<Scalars['Boolean']['input']>;
  includeDeletedExercises?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UserSummaryQuery = { __typename?: 'Query', user: { __typename?: 'User', administrator: boolean, research_consent: boolean | null, id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any, user_course_summary: Array<{ __typename?: 'UserCourseSummary', start_date: any | null, course: { __typename?: 'Course', has_certificate: boolean | null, points_needed: number | null, exercise_completions_needed: number | null, tier: number | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, exercises: Array<{ __typename?: 'Exercise', id: string, name: string | null, custom_id: string, course_id: string | null, part: number | null, section: number | null, max_points: number | null, deleted: boolean | null }> | null, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null }, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null, user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, user_id: string | null, max_points: number | null, n_points: number | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, extra: { __typename?: 'ProgressExtra', projectCompletion: boolean, highestTier: number | null, n_points: number, max_points: number, pointsNeeded: number, pointsPercentage: number, pointsNeededPercentage: number, exercisePercentage: number, exercisesNeededPercentage: number, totalExerciseCount: number, totalExerciseCompletions: number, totalExerciseCompletionsNeeded: number, tiers: Array<{ __typename?: 'TierInfo', id: string, name: string, tier: number, hasTier: boolean, missingFromTier: number, requiredByTier: number, exercisePercentage: number, exercisesNeededPercentage: number, exerciseCompletions: number, exerciseCount: number }>, exercises: Array<{ __typename?: 'TierProgress', exercise_number: number, tier: number, n_points: number, max_points: number, progress: number, name: string | null, custom_id: string | null, course_id: string | null, exercise_id: string | null, service_id: string | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', tier: number | null, max_points: number | null, id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> } | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null, exercise_count: number | null, exercises_completed_count: number | null, exercises_attempted_count: number | null } } | null, user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', id: string, course_id: string | null, service_id: string | null, user_id: string | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, service: { __typename?: 'Service', name: string, id: string } | null }>, completion: { __typename?: 'Completion', id: string, course_id: string | null, user_id: string | null, email: string, student_number: string | null, completion_language: string | null, completion_link: string | null, completion_date: any | null, tier: number | null, grade: string | null, eligible_for_ects: boolean | null, project_completion: boolean, registered: boolean, created_at: any, updated_at: any, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, completion_id: string | null, organization_id: string | null, created_at: any, updated_at: any, organization: { __typename?: 'Organization', id: string, slug: string, name: string } | null }>, certificate_availability: { __typename?: 'CertificateAvailability', completed_course: boolean | null, existing_certificate: string | null, honors: boolean | null } | null } | null, tier_summaries: Array<{ __typename?: 'UserCourseSummary', start_date: any | null, course: { __typename?: 'Course', has_certificate: boolean | null, points_needed: number | null, exercise_completions_needed: number | null, tier: number | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, exercises: Array<{ __typename?: 'Exercise', id: string, name: string | null, custom_id: string, course_id: string | null, part: number | null, section: number | null, max_points: number | null, deleted: boolean | null }> | null, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null }, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null, user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, user_id: string | null, max_points: number | null, n_points: number | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, extra: { __typename?: 'ProgressExtra', projectCompletion: boolean, highestTier: number | null, n_points: number, max_points: number, pointsNeeded: number, pointsPercentage: number, pointsNeededPercentage: number, exercisePercentage: number, exercisesNeededPercentage: number, totalExerciseCount: number, totalExerciseCompletions: number, totalExerciseCompletionsNeeded: number, tiers: Array<{ __typename?: 'TierInfo', id: string, name: string, tier: number, hasTier: boolean, missingFromTier: number, requiredByTier: number, exercisePercentage: number, exercisesNeededPercentage: number, exerciseCompletions: number, exerciseCount: number }>, exercises: Array<{ __typename?: 'TierProgress', exercise_number: number, tier: number, n_points: number, max_points: number, progress: number, name: string | null, custom_id: string | null, course_id: string | null, exercise_id: string | null, service_id: string | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', tier: number | null, max_points: number | null, id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> } | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null, exercise_count: number | null, exercises_completed_count: number | null, exercises_attempted_count: number | null } } | null, user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', id: string, course_id: string | null, service_id: string | null, user_id: string | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, service: { __typename?: 'Service', name: string, id: string } | null }> }> | null }> | null } | null };

export type UserSummaryCourseListQueryVariables = Exact<{
  upstream_id?: InputMaybe<Scalars['Int']['input']>;
  includeNoPointsAwardedExercises?: InputMaybe<Scalars['Boolean']['input']>;
  includeDeletedExercises?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UserSummaryCourseListQuery = { __typename?: 'Query', user: { __typename?: 'User', administrator: boolean, research_consent: boolean | null, id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any, user_course_summary: Array<{ __typename?: 'UserCourseSummary', course: { __typename?: 'Course', has_certificate: boolean | null, points_needed: number | null, exercise_completions_needed: number | null, tier: number | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null }, tier_summaries: Array<{ __typename?: 'UserCourseSummary', course: { __typename?: 'Course', has_certificate: boolean | null, points_needed: number | null, exercise_completions_needed: number | null, tier: number | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null } }> | null }> | null } | null };

export type UserSummaryForCourseQueryVariables = Exact<{
  upstream_id?: InputMaybe<Scalars['Int']['input']>;
  course_slug: Scalars['String']['input'];
  includeNoPointsAwardedExercises?: InputMaybe<Scalars['Boolean']['input']>;
  includeDeletedExercises?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UserSummaryForCourseQuery = { __typename?: 'Query', user: { __typename?: 'User', administrator: boolean, research_consent: boolean | null, id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any, user_course_summary: Array<{ __typename?: 'UserCourseSummary', start_date: any | null, course: { __typename?: 'Course', has_certificate: boolean | null, points_needed: number | null, exercise_completions_needed: number | null, tier: number | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, exercises: Array<{ __typename?: 'Exercise', id: string, name: string | null, custom_id: string, course_id: string | null, part: number | null, section: number | null, max_points: number | null, deleted: boolean | null }> | null, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null }, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null, user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, user_id: string | null, max_points: number | null, n_points: number | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, extra: { __typename?: 'ProgressExtra', projectCompletion: boolean, highestTier: number | null, n_points: number, max_points: number, pointsNeeded: number, pointsPercentage: number, pointsNeededPercentage: number, exercisePercentage: number, exercisesNeededPercentage: number, totalExerciseCount: number, totalExerciseCompletions: number, totalExerciseCompletionsNeeded: number, tiers: Array<{ __typename?: 'TierInfo', id: string, name: string, tier: number, hasTier: boolean, missingFromTier: number, requiredByTier: number, exercisePercentage: number, exercisesNeededPercentage: number, exerciseCompletions: number, exerciseCount: number }>, exercises: Array<{ __typename?: 'TierProgress', exercise_number: number, tier: number, n_points: number, max_points: number, progress: number, name: string | null, custom_id: string | null, course_id: string | null, exercise_id: string | null, service_id: string | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', tier: number | null, max_points: number | null, id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> } | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null, exercise_count: number | null, exercises_completed_count: number | null, exercises_attempted_count: number | null } } | null, user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', id: string, course_id: string | null, service_id: string | null, user_id: string | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, service: { __typename?: 'Service', name: string, id: string } | null }>, completion: { __typename?: 'Completion', id: string, course_id: string | null, user_id: string | null, email: string, student_number: string | null, completion_language: string | null, completion_link: string | null, completion_date: any | null, tier: number | null, grade: string | null, eligible_for_ects: boolean | null, project_completion: boolean, registered: boolean, created_at: any, updated_at: any, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, completion_id: string | null, organization_id: string | null, created_at: any, updated_at: any, organization: { __typename?: 'Organization', id: string, slug: string, name: string } | null }>, certificate_availability: { __typename?: 'CertificateAvailability', completed_course: boolean | null, existing_certificate: string | null, honors: boolean | null } | null } | null, tier_summaries: Array<{ __typename?: 'UserCourseSummary', start_date: any | null, course: { __typename?: 'Course', has_certificate: boolean | null, points_needed: number | null, exercise_completions_needed: number | null, tier: number | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, exercises: Array<{ __typename?: 'Exercise', id: string, name: string | null, custom_id: string, course_id: string | null, part: number | null, section: number | null, max_points: number | null, deleted: boolean | null }> | null, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null }, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null, user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, user_id: string | null, max_points: number | null, n_points: number | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, extra: { __typename?: 'ProgressExtra', projectCompletion: boolean, highestTier: number | null, n_points: number, max_points: number, pointsNeeded: number, pointsPercentage: number, pointsNeededPercentage: number, exercisePercentage: number, exercisesNeededPercentage: number, totalExerciseCount: number, totalExerciseCompletions: number, totalExerciseCompletionsNeeded: number, tiers: Array<{ __typename?: 'TierInfo', id: string, name: string, tier: number, hasTier: boolean, missingFromTier: number, requiredByTier: number, exercisePercentage: number, exercisesNeededPercentage: number, exerciseCompletions: number, exerciseCount: number }>, exercises: Array<{ __typename?: 'TierProgress', exercise_number: number, tier: number, n_points: number, max_points: number, progress: number, name: string | null, custom_id: string | null, course_id: string | null, exercise_id: string | null, service_id: string | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', tier: number | null, max_points: number | null, id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> } | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null, exercise_count: number | null, exercises_completed_count: number | null, exercises_attempted_count: number | null } } | null, user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', id: string, course_id: string | null, service_id: string | null, user_id: string | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, service: { __typename?: 'Service', name: string, id: string } | null }> }> | null }> | null } | null };

export type CurrentUserOverviewQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserOverviewQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', administrator: boolean, research_consent: boolean | null, id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any, completions: Array<{ __typename?: 'Completion', id: string, course_id: string | null, user_id: string | null, email: string, student_number: string | null, completion_language: string | null, completion_link: string | null, completion_date: any | null, tier: number | null, grade: string | null, eligible_for_ects: boolean | null, project_completion: boolean, registered: boolean, created_at: any, updated_at: any, course: { __typename?: 'Course', has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null } | null, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, completion_id: string | null, organization_id: string | null, created_at: any, updated_at: any, organization: { __typename?: 'Organization', id: string, slug: string, name: string } | null }>, certificate_availability: { __typename?: 'CertificateAvailability', completed_course: boolean | null, existing_certificate: string | null, honors: boolean | null } | null }> | null } | null };

export type UserOverviewQueryVariables = Exact<{
  upstream_id: Scalars['Int']['input'];
}>;


export type UserOverviewQuery = { __typename?: 'Query', user: { __typename?: 'User', administrator: boolean, research_consent: boolean | null, id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any, completions: Array<{ __typename?: 'Completion', id: string, course_id: string | null, user_id: string | null, email: string, student_number: string | null, completion_language: string | null, completion_link: string | null, completion_date: any | null, tier: number | null, grade: string | null, eligible_for_ects: boolean | null, project_completion: boolean, registered: boolean, created_at: any, updated_at: any, course: { __typename?: 'Course', has_certificate: boolean | null, name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string, photo: { __typename?: 'Image', id: string, name: string | null, original: string, original_mimetype: string, compressed: string | null, compressed_mimetype: string | null, uncompressed: string, uncompressed_mimetype: string, created_at: any, updated_at: any } | null } | null, completions_registered: Array<{ __typename?: 'CompletionRegistered', id: string, completion_id: string | null, organization_id: string | null, created_at: any, updated_at: any, organization: { __typename?: 'Organization', id: string, slug: string, name: string } | null }>, certificate_availability: { __typename?: 'CertificateAvailability', completed_course: boolean | null, existing_certificate: string | null, honors: boolean | null } | null }> | null } | null };

export type CurrentUserProgressesQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserProgressesQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any, progresses: Array<{ __typename?: 'Progress', course: { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string } | null, user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, user_id: string | null, max_points: number | null, n_points: number | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, extra: { __typename?: 'ProgressExtra', projectCompletion: boolean, highestTier: number | null, n_points: number, max_points: number, pointsNeeded: number, pointsPercentage: number, pointsNeededPercentage: number, exercisePercentage: number, exercisesNeededPercentage: number, totalExerciseCount: number, totalExerciseCompletions: number, totalExerciseCompletionsNeeded: number, tiers: Array<{ __typename?: 'TierInfo', id: string, name: string, tier: number, hasTier: boolean, missingFromTier: number, requiredByTier: number, exercisePercentage: number, exercisesNeededPercentage: number, exerciseCompletions: number, exerciseCount: number }>, exercises: Array<{ __typename?: 'TierProgress', exercise_number: number, tier: number, n_points: number, max_points: number, progress: number, name: string | null, custom_id: string | null, course_id: string | null, exercise_id: string | null, service_id: string | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', tier: number | null, max_points: number | null, id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> } | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null, exercise_count: number | null, exercises_completed_count: number | null, exercises_attempted_count: number | null } } | null, user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', id: string, course_id: string | null, service_id: string | null, user_id: string | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, service: { __typename?: 'Service', name: string, id: string } | null }> | null }> | null } | null };

export type UserDetailsContainsQueryVariables = Exact<{
  search: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UserDetailsContainsQuery = { __typename?: 'Query', userDetailsContains: { __typename?: 'QueryUserDetailsContains_Connection', count: number, pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean }, edges: Array<{ __typename?: 'UserEdge', node: { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any } }> } };

export type ConnectedUserQueryVariables = Exact<{ [key: string]: never; }>;


export type ConnectedUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any, verified_users: Array<{ __typename?: 'VerifiedUser', id: string, created_at: any, updated_at: any, display_name: string | null, organization: { __typename?: 'Organization', id: string, name: string, organization_translations: Array<{ __typename?: 'OrganizationTranslation', language: string, name: string }> } | null }> } | null };

export type ConnectionTestQueryVariables = Exact<{ [key: string]: never; }>;


export type ConnectionTestQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any, verified_users: Array<{ __typename?: 'VerifiedUser', id: string, created_at: any, personal_unique_code: string, display_name: string | null, organization: { __typename?: 'Organization', slug: string, name: string, organization_translations: Array<{ __typename?: 'OrganizationTranslation', language: string, name: string }> } | null }> } | null };

export type VerifiedUserFieldsFragment = { __typename?: 'VerifiedUser', id: string, created_at: any, personal_unique_code: string, display_name: string | null, organization: { __typename?: 'Organization', slug: string, name: string, organization_translations: Array<{ __typename?: 'OrganizationTranslation', language: string, name: string }> } | null };

export type UserSearchSubscriptionVariables = Exact<{
  search: Scalars['String']['input'];
  fields?: InputMaybe<Array<UserSearchField> | UserSearchField>;
}>;


export type UserSearchSubscription = { __typename?: 'Subscription', userSearch: { __typename?: 'UserSearch', field: UserSearchField, fieldValue: string | null, search: string | null, allMatchIds: Array<string>, count: number, fieldIndex: number, fieldCount: number, fieldResultCount: number, fieldUniqueResultCount: number, finished: boolean, matches: Array<{ __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any }> } };

export type UserSearchMetaFieldsFragment = { __typename?: 'UserSearch', field: UserSearchField, fieldValue: string | null, search: string | null, allMatchIds: Array<string>, count: number, fieldIndex: number, fieldCount: number, fieldResultCount: number, fieldUniqueResultCount: number, finished: boolean };

export type ExportUserCourseProgressesQueryVariables = Exact<{
  course_slug: Scalars['String']['input'];
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ExportUserCourseProgressesQuery = { __typename?: 'Query', userCourseProgresses: Array<{ __typename?: 'UserCourseProgress', id: string, user: { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any } | null, progress: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, user_course_settings: { __typename?: 'UserCourseSetting', course_variant: string | null, country: string | null, language: string | null } | null }> | null };

export type StudentProgressesQueryVariables = Exact<{
  course_id: Scalars['ID']['input'];
  skip?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type StudentProgressesQuery = { __typename?: 'Query', userCourseSettings: { __typename?: 'QueryUserCourseSettings_Connection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor: string | null }, edges: Array<{ __typename?: 'UserCourseSettingEdge', node: { __typename?: 'UserCourseSetting', id: string, user_id: string | null, course_id: string | null, created_at: any, updated_at: any, user: { __typename?: 'User', id: string, upstream_id: number, first_name: string | null, last_name: string | null, full_name: string | null, username: string, email: string, student_number: string | null, real_student_number: string | null, created_at: any, updated_at: any, progress: { __typename?: 'Progress', course: { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string } | null, user_course_progress: { __typename?: 'UserCourseProgress', id: string, course_id: string | null, user_id: string | null, max_points: number | null, n_points: number | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, extra: { __typename?: 'ProgressExtra', projectCompletion: boolean, highestTier: number | null, n_points: number, max_points: number, pointsNeeded: number, pointsPercentage: number, pointsNeededPercentage: number, exercisePercentage: number, exercisesNeededPercentage: number, totalExerciseCount: number, totalExerciseCompletions: number, totalExerciseCompletionsNeeded: number, tiers: Array<{ __typename?: 'TierInfo', id: string, name: string, tier: number, hasTier: boolean, missingFromTier: number, requiredByTier: number, exercisePercentage: number, exercisesNeededPercentage: number, exerciseCompletions: number, exerciseCount: number }>, exercises: Array<{ __typename?: 'TierProgress', exercise_number: number, tier: number, n_points: number, max_points: number, progress: number, name: string | null, custom_id: string | null, course_id: string | null, exercise_id: string | null, service_id: string | null, exercise_completions: Array<{ __typename?: 'ExerciseCompletion', tier: number | null, max_points: number | null, id: string, exercise_id: string | null, user_id: string | null, created_at: any, updated_at: any, attempted: boolean | null, completed: boolean | null, timestamp: any, n_points: number | null, exercise_completion_required_actions: Array<{ __typename?: 'ExerciseCompletionRequiredAction', id: string, exercise_completion_id: string | null, value: string }> }> | null }> } | null, exercise_progress: { __typename?: 'ExerciseProgress', total: number | null, exercises: number | null, exercise_count: number | null, exercises_completed_count: number | null, exercises_attempted_count: number | null } } | null, user_course_service_progresses: Array<{ __typename?: 'UserCourseServiceProgress', id: string, course_id: string | null, service_id: string | null, user_id: string | null, created_at: any, updated_at: any, points_by_group: Array<{ __typename?: 'PointsByGroup', group: string, n_points: number, max_points: number, progress: number }>, service: { __typename?: 'Service', name: string, id: string } | null }> | null } } | null } }> } };

export type UserProfileUserCourseSettingsQueryVariables = Exact<{
  upstream_id?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UserProfileUserCourseSettingsQuery = { __typename?: 'Query', userCourseSettings: { __typename?: 'QueryUserCourseSettings_Connection', edges: Array<{ __typename?: 'UserCourseSettingEdge', node: { __typename?: 'UserCourseSetting', language: string | null, country: string | null, research: boolean | null, marketing: boolean | null, course_variant: string | null, other: any | null, id: string, user_id: string | null, course_id: string | null, created_at: any, updated_at: any, course: { __typename?: 'Course', name: string, ects: string | null, language: string | null, created_at: any, updated_at: any, id: string, slug: string } | null } }>, pageInfo: { __typename?: 'PageInfo', endCursor: string | null, hasNextPage: boolean } } };

export type CurrentUserUserOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserUserOrganizationsQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', user_organizations: Array<{ __typename?: 'UserOrganization', id: string, user_id: string | null, organization_id: string | null, confirmed: boolean | null, confirmed_at: any | null, consented: boolean | null, organizational_email: string | null, organizational_identifier: string | null, created_at: any, updated_at: any, user_organization_join_confirmations: Array<{ __typename?: 'UserOrganizationJoinConfirmation', id: string, email: string, confirmed: boolean | null, confirmed_at: any | null, expired: boolean | null, expires_at: any | null, redirect: string | null, language: string | null, created_at: any | null, updated_at: any | null, email_delivery: { __typename?: 'EmailDelivery', id: string, email: string | null, sent: boolean, error: boolean, error_message: string | null, email_template_id: string | null, user_id: string | null, organization_id: string | null, created_at: any, updated_at: any } | null }> | null, organization: { __typename?: 'Organization', id: string, slug: string, email: string | null, hidden: boolean | null, disabled: boolean | null, name: string, information: string | null, created_at: any, updated_at: any, required_confirmation: boolean | null, required_organization_email: string | null, organization_translations: Array<{ __typename?: 'OrganizationTranslation', id: string, organization_id: string | null, language: string, name: string, information: string | null }> } | null }> } | null };

export type UserOrganizationsQueryVariables = Exact<{
  user_id?: InputMaybe<Scalars['ID']['input']>;
  organization_id?: InputMaybe<Scalars['ID']['input']>;
  organization_slug?: InputMaybe<Scalars['String']['input']>;
}>;


export type UserOrganizationsQuery = { __typename?: 'Query', userOrganizations: Array<{ __typename?: 'UserOrganization', id: string, user_id: string | null, organization_id: string | null, confirmed: boolean | null, confirmed_at: any | null, consented: boolean | null, organizational_email: string | null, organizational_identifier: string | null, created_at: any, updated_at: any, organization: { __typename?: 'Organization', id: string, slug: string, email: string | null, hidden: boolean | null, disabled: boolean | null, name: string, information: string | null, created_at: any, updated_at: any, required_confirmation: boolean | null, required_organization_email: string | null, organization_translations: Array<{ __typename?: 'OrganizationTranslation', id: string, organization_id: string | null, language: string, name: string, information: string | null }> } | null }> | null };

export type UserOrganizationJoinConfirmationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UserOrganizationJoinConfirmationQuery = { __typename?: 'Query', userOrganizationJoinConfirmation: { __typename?: 'UserOrganizationJoinConfirmation', id: string, email: string, confirmed: boolean | null, confirmed_at: any | null, expired: boolean | null, expires_at: any | null, redirect: string | null, language: string | null, created_at: any | null, updated_at: any | null, user_organization: { __typename?: 'UserOrganization', id: string, user_id: string | null, organization_id: string | null, confirmed: boolean | null, confirmed_at: any | null, consented: boolean | null, organizational_email: string | null, organizational_identifier: string | null, created_at: any, updated_at: any, organization: { __typename?: 'Organization', id: string, slug: string, email: string | null, hidden: boolean | null, disabled: boolean | null, name: string, information: string | null, created_at: any, updated_at: any, required_confirmation: boolean | null, required_organization_email: string | null, organization_translations: Array<{ __typename?: 'OrganizationTranslation', id: string, organization_id: string | null, language: string, name: string, information: string | null }> } | null }, email_delivery: { __typename?: 'EmailDelivery', id: string, email: string | null, sent: boolean, error: boolean, error_message: string | null, email_template_id: string | null, user_id: string | null, organization_id: string | null, created_at: any, updated_at: any } | null } | null };

export type AbEnrollmentKeySpecifier = ('ab_study' | 'ab_study_id' | 'created_at' | 'group' | 'id' | 'updated_at' | 'user' | 'user_id' | AbEnrollmentKeySpecifier)[];
export type AbEnrollmentFieldPolicy = {
	ab_study?: FieldPolicy<any> | FieldReadFunction<any>,
	ab_study_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	group?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AbStudyKeySpecifier = ('ab_enrollments' | 'created_at' | 'group_count' | 'id' | 'name' | 'updated_at' | AbStudyKeySpecifier)[];
export type AbStudyFieldPolicy = {
	ab_enrollments?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	group_count?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CertificateAvailabilityKeySpecifier = ('completed_course' | 'existing_certificate' | 'honors' | CertificateAvailabilityKeySpecifier)[];
export type CertificateAvailabilityFieldPolicy = {
	completed_course?: FieldPolicy<any> | FieldReadFunction<any>,
	existing_certificate?: FieldPolicy<any> | FieldReadFunction<any>,
	honors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CompletionKeySpecifier = ('certificate_availability' | 'certificate_id' | 'completion_date' | 'completion_language' | 'completion_link' | 'completion_registration_attempt_date' | 'completions_registered' | 'course' | 'course_id' | 'created_at' | 'eligible_for_ects' | 'email' | 'grade' | 'id' | 'project_completion' | 'registered' | 'student_number' | 'tier' | 'updated_at' | 'user' | 'user_id' | 'user_upstream_id' | CompletionKeySpecifier)[];
export type CompletionFieldPolicy = {
	certificate_availability?: FieldPolicy<any> | FieldReadFunction<any>,
	certificate_id?: FieldPolicy<any> | FieldReadFunction<any>,
	completion_date?: FieldPolicy<any> | FieldReadFunction<any>,
	completion_language?: FieldPolicy<any> | FieldReadFunction<any>,
	completion_link?: FieldPolicy<any> | FieldReadFunction<any>,
	completion_registration_attempt_date?: FieldPolicy<any> | FieldReadFunction<any>,
	completions_registered?: FieldPolicy<any> | FieldReadFunction<any>,
	course?: FieldPolicy<any> | FieldReadFunction<any>,
	course_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	eligible_for_ects?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	grade?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	project_completion?: FieldPolicy<any> | FieldReadFunction<any>,
	registered?: FieldPolicy<any> | FieldReadFunction<any>,
	student_number?: FieldPolicy<any> | FieldReadFunction<any>,
	tier?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_upstream_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CompletionEdgeKeySpecifier = ('cursor' | 'node' | CompletionEdgeKeySpecifier)[];
export type CompletionEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CompletionRegisteredKeySpecifier = ('completion' | 'completion_id' | 'course' | 'course_id' | 'created_at' | 'id' | 'organization' | 'organization_id' | 'real_student_number' | 'registration_date' | 'updated_at' | 'user' | 'user_id' | CompletionRegisteredKeySpecifier)[];
export type CompletionRegisteredFieldPolicy = {
	completion?: FieldPolicy<any> | FieldReadFunction<any>,
	completion_id?: FieldPolicy<any> | FieldReadFunction<any>,
	course?: FieldPolicy<any> | FieldReadFunction<any>,
	course_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	organization?: FieldPolicy<any> | FieldReadFunction<any>,
	organization_id?: FieldPolicy<any> | FieldReadFunction<any>,
	real_student_number?: FieldPolicy<any> | FieldReadFunction<any>,
	registration_date?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CourseKeySpecifier = ('automatic_completions' | 'automatic_completions_eligible_for_ects' | 'completion_email' | 'completion_email_id' | 'completions' | 'completions_handled_by' | 'completions_handled_by_id' | 'course_aliases' | 'course_organizations' | 'course_stats_email' | 'course_stats_email_id' | 'course_translations' | 'course_variants' | 'created_at' | 'description' | 'ects' | 'end_date' | 'exercise_completions_needed' | 'exercises' | 'handles_completions_for' | 'handles_settings_for' | 'has_certificate' | 'hidden' | 'id' | 'inherit_settings_from' | 'inherit_settings_from_id' | 'instructions' | 'language' | 'link' | 'name' | 'open_university_registration_links' | 'order' | 'owner_organization' | 'owner_organization_id' | 'photo' | 'photo_id' | 'points_needed' | 'promote' | 'services' | 'slug' | 'sponsors' | 'start_date' | 'start_point' | 'status' | 'study_module_order' | 'study_module_start_point' | 'study_modules' | 'support_email' | 'tags' | 'teacher_in_charge_email' | 'teacher_in_charge_name' | 'tier' | 'upcoming_active_link' | 'updated_at' | 'user_course_settings_visibilities' | CourseKeySpecifier)[];
export type CourseFieldPolicy = {
	automatic_completions?: FieldPolicy<any> | FieldReadFunction<any>,
	automatic_completions_eligible_for_ects?: FieldPolicy<any> | FieldReadFunction<any>,
	completion_email?: FieldPolicy<any> | FieldReadFunction<any>,
	completion_email_id?: FieldPolicy<any> | FieldReadFunction<any>,
	completions?: FieldPolicy<any> | FieldReadFunction<any>,
	completions_handled_by?: FieldPolicy<any> | FieldReadFunction<any>,
	completions_handled_by_id?: FieldPolicy<any> | FieldReadFunction<any>,
	course_aliases?: FieldPolicy<any> | FieldReadFunction<any>,
	course_organizations?: FieldPolicy<any> | FieldReadFunction<any>,
	course_stats_email?: FieldPolicy<any> | FieldReadFunction<any>,
	course_stats_email_id?: FieldPolicy<any> | FieldReadFunction<any>,
	course_translations?: FieldPolicy<any> | FieldReadFunction<any>,
	course_variants?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	ects?: FieldPolicy<any> | FieldReadFunction<any>,
	end_date?: FieldPolicy<any> | FieldReadFunction<any>,
	exercise_completions_needed?: FieldPolicy<any> | FieldReadFunction<any>,
	exercises?: FieldPolicy<any> | FieldReadFunction<any>,
	handles_completions_for?: FieldPolicy<any> | FieldReadFunction<any>,
	handles_settings_for?: FieldPolicy<any> | FieldReadFunction<any>,
	has_certificate?: FieldPolicy<any> | FieldReadFunction<any>,
	hidden?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inherit_settings_from?: FieldPolicy<any> | FieldReadFunction<any>,
	inherit_settings_from_id?: FieldPolicy<any> | FieldReadFunction<any>,
	instructions?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	link?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	open_university_registration_links?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_organization?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_organization_id?: FieldPolicy<any> | FieldReadFunction<any>,
	photo?: FieldPolicy<any> | FieldReadFunction<any>,
	photo_id?: FieldPolicy<any> | FieldReadFunction<any>,
	points_needed?: FieldPolicy<any> | FieldReadFunction<any>,
	promote?: FieldPolicy<any> | FieldReadFunction<any>,
	services?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	sponsors?: FieldPolicy<any> | FieldReadFunction<any>,
	start_date?: FieldPolicy<any> | FieldReadFunction<any>,
	start_point?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	study_module_order?: FieldPolicy<any> | FieldReadFunction<any>,
	study_module_start_point?: FieldPolicy<any> | FieldReadFunction<any>,
	study_modules?: FieldPolicy<any> | FieldReadFunction<any>,
	support_email?: FieldPolicy<any> | FieldReadFunction<any>,
	tags?: FieldPolicy<any> | FieldReadFunction<any>,
	teacher_in_charge_email?: FieldPolicy<any> | FieldReadFunction<any>,
	teacher_in_charge_name?: FieldPolicy<any> | FieldReadFunction<any>,
	tier?: FieldPolicy<any> | FieldReadFunction<any>,
	upcoming_active_link?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user_course_settings_visibilities?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CourseAliasKeySpecifier = ('course' | 'course_code' | 'course_id' | 'created_at' | 'id' | 'updated_at' | CourseAliasKeySpecifier)[];
export type CourseAliasFieldPolicy = {
	course?: FieldPolicy<any> | FieldReadFunction<any>,
	course_code?: FieldPolicy<any> | FieldReadFunction<any>,
	course_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CourseOrganizationKeySpecifier = ('course' | 'course_id' | 'created_at' | 'creator' | 'id' | 'organization' | 'organization_id' | 'updated_at' | CourseOrganizationKeySpecifier)[];
export type CourseOrganizationFieldPolicy = {
	course?: FieldPolicy<any> | FieldReadFunction<any>,
	course_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	creator?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	organization?: FieldPolicy<any> | FieldReadFunction<any>,
	organization_id?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CourseOwnershipKeySpecifier = ('course' | 'course_id' | 'created_at' | 'id' | 'updated_at' | 'user' | 'user_id' | CourseOwnershipKeySpecifier)[];
export type CourseOwnershipFieldPolicy = {
	course?: FieldPolicy<any> | FieldReadFunction<any>,
	course_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CourseSponsorKeySpecifier = ('course' | 'course_id' | 'created_at' | 'order' | 'sponsor' | 'sponsor_id' | 'updated_at' | CourseSponsorKeySpecifier)[];
export type CourseSponsorFieldPolicy = {
	course?: FieldPolicy<any> | FieldReadFunction<any>,
	course_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	sponsor?: FieldPolicy<any> | FieldReadFunction<any>,
	sponsor_id?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CourseStatsSubscriptionKeySpecifier = ('created_at' | 'email_template' | 'email_template_id' | 'id' | 'updated_at' | 'user' | 'user_id' | CourseStatsSubscriptionKeySpecifier)[];
export type CourseStatsSubscriptionFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email_template?: FieldPolicy<any> | FieldReadFunction<any>,
	email_template_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CourseTranslationKeySpecifier = ('course' | 'course_id' | 'created_at' | 'description' | 'id' | 'instructions' | 'language' | 'link' | 'name' | 'updated_at' | CourseTranslationKeySpecifier)[];
export type CourseTranslationFieldPolicy = {
	course?: FieldPolicy<any> | FieldReadFunction<any>,
	course_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	instructions?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	link?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CourseVariantKeySpecifier = ('course' | 'course_id' | 'created_at' | 'description' | 'id' | 'slug' | 'updated_at' | CourseVariantKeySpecifier)[];
export type CourseVariantFieldPolicy = {
	course?: FieldPolicy<any> | FieldReadFunction<any>,
	course_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type EmailDeliveryKeySpecifier = ('created_at' | 'email' | 'email_template' | 'email_template_id' | 'error' | 'error_message' | 'id' | 'organization' | 'organization_id' | 'sent' | 'updated_at' | 'user' | 'user_id' | 'user_organization_join_confirmation' | EmailDeliveryKeySpecifier)[];
export type EmailDeliveryFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	email_template?: FieldPolicy<any> | FieldReadFunction<any>,
	email_template_id?: FieldPolicy<any> | FieldReadFunction<any>,
	error?: FieldPolicy<any> | FieldReadFunction<any>,
	error_message?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	organization?: FieldPolicy<any> | FieldReadFunction<any>,
	organization_id?: FieldPolicy<any> | FieldReadFunction<any>,
	sent?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_organization_join_confirmation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type EmailTemplateKeySpecifier = ('course_instance_language' | 'course_stats_subscriptions' | 'courses' | 'created_at' | 'email_deliveries' | 'exercise_completions_threshold' | 'html_body' | 'id' | 'joined_organizations' | 'name' | 'points_threshold' | 'template_type' | 'title' | 'triggered_automatically_by_course_id' | 'txt_body' | 'updated_at' | EmailTemplateKeySpecifier)[];
export type EmailTemplateFieldPolicy = {
	course_instance_language?: FieldPolicy<any> | FieldReadFunction<any>,
	course_stats_subscriptions?: FieldPolicy<any> | FieldReadFunction<any>,
	courses?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email_deliveries?: FieldPolicy<any> | FieldReadFunction<any>,
	exercise_completions_threshold?: FieldPolicy<any> | FieldReadFunction<any>,
	html_body?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	joined_organizations?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	points_threshold?: FieldPolicy<any> | FieldReadFunction<any>,
	template_type?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	triggered_automatically_by_course_id?: FieldPolicy<any> | FieldReadFunction<any>,
	txt_body?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExerciseKeySpecifier = ('course' | 'course_id' | 'created_at' | 'custom_id' | 'deleted' | 'exercise_completions' | 'id' | 'max_points' | 'name' | 'part' | 'section' | 'service' | 'service_id' | 'timestamp' | 'updated_at' | ExerciseKeySpecifier)[];
export type ExerciseFieldPolicy = {
	course?: FieldPolicy<any> | FieldReadFunction<any>,
	course_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	custom_id?: FieldPolicy<any> | FieldReadFunction<any>,
	deleted?: FieldPolicy<any> | FieldReadFunction<any>,
	exercise_completions?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	max_points?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	part?: FieldPolicy<any> | FieldReadFunction<any>,
	section?: FieldPolicy<any> | FieldReadFunction<any>,
	service?: FieldPolicy<any> | FieldReadFunction<any>,
	service_id?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExerciseCompletionKeySpecifier = ('attempted' | 'completed' | 'created_at' | 'exercise' | 'exercise_completion_required_actions' | 'exercise_id' | 'id' | 'max_points' | 'n_points' | 'tier' | 'timestamp' | 'updated_at' | 'user' | 'user_id' | ExerciseCompletionKeySpecifier)[];
export type ExerciseCompletionFieldPolicy = {
	attempted?: FieldPolicy<any> | FieldReadFunction<any>,
	completed?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	exercise?: FieldPolicy<any> | FieldReadFunction<any>,
	exercise_completion_required_actions?: FieldPolicy<any> | FieldReadFunction<any>,
	exercise_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	max_points?: FieldPolicy<any> | FieldReadFunction<any>,
	n_points?: FieldPolicy<any> | FieldReadFunction<any>,
	tier?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExerciseCompletionRequiredActionKeySpecifier = ('exercise_completion' | 'exercise_completion_id' | 'id' | 'value' | ExerciseCompletionRequiredActionKeySpecifier)[];
export type ExerciseCompletionRequiredActionFieldPolicy = {
	exercise_completion?: FieldPolicy<any> | FieldReadFunction<any>,
	exercise_completion_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExerciseProgressKeySpecifier = ('exercise_count' | 'exercises' | 'exercises_attempted_count' | 'exercises_completed_count' | 'total' | ExerciseProgressKeySpecifier)[];
export type ExerciseProgressFieldPolicy = {
	exercise_count?: FieldPolicy<any> | FieldReadFunction<any>,
	exercises?: FieldPolicy<any> | FieldReadFunction<any>,
	exercises_attempted_count?: FieldPolicy<any> | FieldReadFunction<any>,
	exercises_completed_count?: FieldPolicy<any> | FieldReadFunction<any>,
	total?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ImageKeySpecifier = ('compressed' | 'compressed_mimetype' | 'created_at' | 'default' | 'encoding' | 'id' | 'name' | 'original' | 'original_mimetype' | 'uncompressed' | 'uncompressed_mimetype' | 'updated_at' | ImageKeySpecifier)[];
export type ImageFieldPolicy = {
	compressed?: FieldPolicy<any> | FieldReadFunction<any>,
	compressed_mimetype?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	default?: FieldPolicy<any> | FieldReadFunction<any>,
	encoding?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	original?: FieldPolicy<any> | FieldReadFunction<any>,
	original_mimetype?: FieldPolicy<any> | FieldReadFunction<any>,
	uncompressed?: FieldPolicy<any> | FieldReadFunction<any>,
	uncompressed_mimetype?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('addAbEnrollment' | 'addAbStudy' | 'addCompletion' | 'addCourse' | 'addCourseAlias' | 'addCourseOrganization' | 'addCourseTranslation' | 'addCourseVariant' | 'addEmailTemplate' | 'addExercise' | 'addExerciseCompletion' | 'addImage' | 'addManualCompletion' | 'addOpenUniversityRegistrationLink' | 'addOrganization' | 'addService' | 'addStudyModule' | 'addStudyModuleTranslation' | 'addUser' | 'addUserCourseProgress' | 'addUserCourseServiceProgress' | 'addUserOrganization' | 'addVerifiedUser' | 'confirmUserOrganizationJoin' | 'createCourseStatsSubscription' | 'createRegistrationAttemptDate' | 'createSponsor' | 'createSponsorImage' | 'createTag' | 'createTagTranslation' | 'createTagType' | 'deleteCourse' | 'deleteCourseOrganization' | 'deleteCourseStatsSubscription' | 'deleteCourseTranslation' | 'deleteCourseVariant' | 'deleteEmailTemplate' | 'deleteImage' | 'deleteStudyModule' | 'deleteStudyModuleTranslation' | 'deleteTag' | 'deleteTagTranslation' | 'deleteTagType' | 'deleteUserOrganization' | 'recheckCompletions' | 'registerCompletion' | 'requestNewUserOrganizationJoinConfirmation' | 'updateAbEnrollment' | 'updateAbStudy' | 'updateCourse' | 'updateCourseTranslation' | 'updateCourseVariant' | 'updateEmailTemplate' | 'updateOpenUniversityRegistrationLink' | 'updateOrganizationEmailTemplate' | 'updateResearchConsent' | 'updateService' | 'updateSponsor' | 'updateStudyModule' | 'updateStudyModuletranslation' | 'updateTag' | 'updateTagTranslation' | 'updateTagType' | 'updateUser' | 'updateUserName' | 'updateUserOrganizationConsent' | 'updateUserOrganizationOrganizationalMail' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	addAbEnrollment?: FieldPolicy<any> | FieldReadFunction<any>,
	addAbStudy?: FieldPolicy<any> | FieldReadFunction<any>,
	addCompletion?: FieldPolicy<any> | FieldReadFunction<any>,
	addCourse?: FieldPolicy<any> | FieldReadFunction<any>,
	addCourseAlias?: FieldPolicy<any> | FieldReadFunction<any>,
	addCourseOrganization?: FieldPolicy<any> | FieldReadFunction<any>,
	addCourseTranslation?: FieldPolicy<any> | FieldReadFunction<any>,
	addCourseVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	addEmailTemplate?: FieldPolicy<any> | FieldReadFunction<any>,
	addExercise?: FieldPolicy<any> | FieldReadFunction<any>,
	addExerciseCompletion?: FieldPolicy<any> | FieldReadFunction<any>,
	addImage?: FieldPolicy<any> | FieldReadFunction<any>,
	addManualCompletion?: FieldPolicy<any> | FieldReadFunction<any>,
	addOpenUniversityRegistrationLink?: FieldPolicy<any> | FieldReadFunction<any>,
	addOrganization?: FieldPolicy<any> | FieldReadFunction<any>,
	addService?: FieldPolicy<any> | FieldReadFunction<any>,
	addStudyModule?: FieldPolicy<any> | FieldReadFunction<any>,
	addStudyModuleTranslation?: FieldPolicy<any> | FieldReadFunction<any>,
	addUser?: FieldPolicy<any> | FieldReadFunction<any>,
	addUserCourseProgress?: FieldPolicy<any> | FieldReadFunction<any>,
	addUserCourseServiceProgress?: FieldPolicy<any> | FieldReadFunction<any>,
	addUserOrganization?: FieldPolicy<any> | FieldReadFunction<any>,
	addVerifiedUser?: FieldPolicy<any> | FieldReadFunction<any>,
	confirmUserOrganizationJoin?: FieldPolicy<any> | FieldReadFunction<any>,
	createCourseStatsSubscription?: FieldPolicy<any> | FieldReadFunction<any>,
	createRegistrationAttemptDate?: FieldPolicy<any> | FieldReadFunction<any>,
	createSponsor?: FieldPolicy<any> | FieldReadFunction<any>,
	createSponsorImage?: FieldPolicy<any> | FieldReadFunction<any>,
	createTag?: FieldPolicy<any> | FieldReadFunction<any>,
	createTagTranslation?: FieldPolicy<any> | FieldReadFunction<any>,
	createTagType?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteCourse?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteCourseOrganization?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteCourseStatsSubscription?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteCourseTranslation?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteCourseVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteEmailTemplate?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteImage?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteStudyModule?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteStudyModuleTranslation?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteTag?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteTagTranslation?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteTagType?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteUserOrganization?: FieldPolicy<any> | FieldReadFunction<any>,
	recheckCompletions?: FieldPolicy<any> | FieldReadFunction<any>,
	registerCompletion?: FieldPolicy<any> | FieldReadFunction<any>,
	requestNewUserOrganizationJoinConfirmation?: FieldPolicy<any> | FieldReadFunction<any>,
	updateAbEnrollment?: FieldPolicy<any> | FieldReadFunction<any>,
	updateAbStudy?: FieldPolicy<any> | FieldReadFunction<any>,
	updateCourse?: FieldPolicy<any> | FieldReadFunction<any>,
	updateCourseTranslation?: FieldPolicy<any> | FieldReadFunction<any>,
	updateCourseVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	updateEmailTemplate?: FieldPolicy<any> | FieldReadFunction<any>,
	updateOpenUniversityRegistrationLink?: FieldPolicy<any> | FieldReadFunction<any>,
	updateOrganizationEmailTemplate?: FieldPolicy<any> | FieldReadFunction<any>,
	updateResearchConsent?: FieldPolicy<any> | FieldReadFunction<any>,
	updateService?: FieldPolicy<any> | FieldReadFunction<any>,
	updateSponsor?: FieldPolicy<any> | FieldReadFunction<any>,
	updateStudyModule?: FieldPolicy<any> | FieldReadFunction<any>,
	updateStudyModuletranslation?: FieldPolicy<any> | FieldReadFunction<any>,
	updateTag?: FieldPolicy<any> | FieldReadFunction<any>,
	updateTagTranslation?: FieldPolicy<any> | FieldReadFunction<any>,
	updateTagType?: FieldPolicy<any> | FieldReadFunction<any>,
	updateUser?: FieldPolicy<any> | FieldReadFunction<any>,
	updateUserName?: FieldPolicy<any> | FieldReadFunction<any>,
	updateUserOrganizationConsent?: FieldPolicy<any> | FieldReadFunction<any>,
	updateUserOrganizationOrganizationalMail?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OpenUniversityRegistrationLinkKeySpecifier = ('course' | 'course_code' | 'course_id' | 'created_at' | 'id' | 'language' | 'link' | 'start_date' | 'stop_date' | 'tiers' | 'updated_at' | OpenUniversityRegistrationLinkKeySpecifier)[];
export type OpenUniversityRegistrationLinkFieldPolicy = {
	course?: FieldPolicy<any> | FieldReadFunction<any>,
	course_code?: FieldPolicy<any> | FieldReadFunction<any>,
	course_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	link?: FieldPolicy<any> | FieldReadFunction<any>,
	start_date?: FieldPolicy<any> | FieldReadFunction<any>,
	stop_date?: FieldPolicy<any> | FieldReadFunction<any>,
	tiers?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrganizationKeySpecifier = ('completions_registered' | 'contact_information' | 'course_organizations' | 'courses' | 'created_at' | 'creator' | 'creator_id' | 'disabled' | 'disabled_reason' | 'email' | 'hidden' | 'id' | 'information' | 'join_organization_email_template' | 'join_organization_email_template_id' | 'logo_content_type' | 'logo_file_name' | 'logo_file_size' | 'logo_updated_at' | 'name' | 'organization_translations' | 'phone' | 'pinned' | 'required_confirmation' | 'required_organization_email' | 'slug' | 'tmc_created_at' | 'tmc_updated_at' | 'updated_at' | 'user_organizations' | 'verified' | 'verified_at' | 'verified_users' | 'website' | OrganizationKeySpecifier)[];
export type OrganizationFieldPolicy = {
	completions_registered?: FieldPolicy<any> | FieldReadFunction<any>,
	contact_information?: FieldPolicy<any> | FieldReadFunction<any>,
	course_organizations?: FieldPolicy<any> | FieldReadFunction<any>,
	courses?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	creator?: FieldPolicy<any> | FieldReadFunction<any>,
	creator_id?: FieldPolicy<any> | FieldReadFunction<any>,
	disabled?: FieldPolicy<any> | FieldReadFunction<any>,
	disabled_reason?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	hidden?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	information?: FieldPolicy<any> | FieldReadFunction<any>,
	join_organization_email_template?: FieldPolicy<any> | FieldReadFunction<any>,
	join_organization_email_template_id?: FieldPolicy<any> | FieldReadFunction<any>,
	logo_content_type?: FieldPolicy<any> | FieldReadFunction<any>,
	logo_file_name?: FieldPolicy<any> | FieldReadFunction<any>,
	logo_file_size?: FieldPolicy<any> | FieldReadFunction<any>,
	logo_updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	organization_translations?: FieldPolicy<any> | FieldReadFunction<any>,
	phone?: FieldPolicy<any> | FieldReadFunction<any>,
	pinned?: FieldPolicy<any> | FieldReadFunction<any>,
	required_confirmation?: FieldPolicy<any> | FieldReadFunction<any>,
	required_organization_email?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	tmc_created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	tmc_updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user_organizations?: FieldPolicy<any> | FieldReadFunction<any>,
	verified?: FieldPolicy<any> | FieldReadFunction<any>,
	verified_at?: FieldPolicy<any> | FieldReadFunction<any>,
	verified_users?: FieldPolicy<any> | FieldReadFunction<any>,
	website?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrganizationTranslationKeySpecifier = ('created_at' | 'id' | 'information' | 'language' | 'name' | 'organization' | 'organization_id' | 'updated_at' | OrganizationTranslationKeySpecifier)[];
export type OrganizationTranslationFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	information?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	organization?: FieldPolicy<any> | FieldReadFunction<any>,
	organization_id?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageInfoKeySpecifier = ('endCursor' | 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | PageInfoKeySpecifier)[];
export type PageInfoFieldPolicy = {
	endCursor?: FieldPolicy<any> | FieldReadFunction<any>,
	hasNextPage?: FieldPolicy<any> | FieldReadFunction<any>,
	hasPreviousPage?: FieldPolicy<any> | FieldReadFunction<any>,
	startCursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PointsByGroupKeySpecifier = ('group' | 'max_points' | 'n_points' | 'progress' | PointsByGroupKeySpecifier)[];
export type PointsByGroupFieldPolicy = {
	group?: FieldPolicy<any> | FieldReadFunction<any>,
	max_points?: FieldPolicy<any> | FieldReadFunction<any>,
	n_points?: FieldPolicy<any> | FieldReadFunction<any>,
	progress?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProgressKeySpecifier = ('course' | 'course_id' | 'user' | 'user_course_progress' | 'user_course_service_progresses' | 'user_id' | ProgressKeySpecifier)[];
export type ProgressFieldPolicy = {
	course?: FieldPolicy<any> | FieldReadFunction<any>,
	course_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_course_progress?: FieldPolicy<any> | FieldReadFunction<any>,
	user_course_service_progresses?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProgressExtraKeySpecifier = ('exercisePercentage' | 'exercises' | 'exercisesNeededPercentage' | 'highestTier' | 'max_points' | 'n_points' | 'pointsNeeded' | 'pointsNeededPercentage' | 'pointsPercentage' | 'projectCompletion' | 'tiers' | 'totalExerciseCompletions' | 'totalExerciseCompletionsNeeded' | 'totalExerciseCount' | ProgressExtraKeySpecifier)[];
export type ProgressExtraFieldPolicy = {
	exercisePercentage?: FieldPolicy<any> | FieldReadFunction<any>,
	exercises?: FieldPolicy<any> | FieldReadFunction<any>,
	exercisesNeededPercentage?: FieldPolicy<any> | FieldReadFunction<any>,
	highestTier?: FieldPolicy<any> | FieldReadFunction<any>,
	max_points?: FieldPolicy<any> | FieldReadFunction<any>,
	n_points?: FieldPolicy<any> | FieldReadFunction<any>,
	pointsNeeded?: FieldPolicy<any> | FieldReadFunction<any>,
	pointsNeededPercentage?: FieldPolicy<any> | FieldReadFunction<any>,
	pointsPercentage?: FieldPolicy<any> | FieldReadFunction<any>,
	projectCompletion?: FieldPolicy<any> | FieldReadFunction<any>,
	tiers?: FieldPolicy<any> | FieldReadFunction<any>,
	totalExerciseCompletions?: FieldPolicy<any> | FieldReadFunction<any>,
	totalExerciseCompletionsNeeded?: FieldPolicy<any> | FieldReadFunction<any>,
	totalExerciseCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('completions' | 'completionsPaginated' | 'completionsPaginated_type' | 'course' | 'courseAliases' | 'courseOrganizations' | 'courseTranslations' | 'courseVariant' | 'courseVariants' | 'course_exists' | 'courses' | 'currentUser' | 'email_template' | 'email_templates' | 'exercise' | 'exerciseCompletion' | 'exerciseCompletions' | 'exercises' | 'handlerCourses' | 'openUniversityRegistrationLink' | 'openUniversityRegistrationLinks' | 'organization' | 'organizations' | 'registeredCompletions' | 'service' | 'services' | 'sponsors' | 'studyModuleTranslations' | 'study_module' | 'study_module_exists' | 'study_modules' | 'tagTypes' | 'tags' | 'user' | 'userCourseProgress' | 'userCourseProgresses' | 'userCourseServiceProgress' | 'userCourseServiceProgresses' | 'userCourseSetting' | 'userCourseSettingCount' | 'userCourseSettings' | 'userDetailsContains' | 'userOrganizationJoinConfirmation' | 'userOrganizations' | 'users' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	completions?: FieldPolicy<any> | FieldReadFunction<any>,
	completionsPaginated?: FieldPolicy<any> | FieldReadFunction<any>,
	completionsPaginated_type?: FieldPolicy<any> | FieldReadFunction<any>,
	course?: FieldPolicy<any> | FieldReadFunction<any>,
	courseAliases?: FieldPolicy<any> | FieldReadFunction<any>,
	courseOrganizations?: FieldPolicy<any> | FieldReadFunction<any>,
	courseTranslations?: FieldPolicy<any> | FieldReadFunction<any>,
	courseVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	courseVariants?: FieldPolicy<any> | FieldReadFunction<any>,
	course_exists?: FieldPolicy<any> | FieldReadFunction<any>,
	courses?: FieldPolicy<any> | FieldReadFunction<any>,
	currentUser?: FieldPolicy<any> | FieldReadFunction<any>,
	email_template?: FieldPolicy<any> | FieldReadFunction<any>,
	email_templates?: FieldPolicy<any> | FieldReadFunction<any>,
	exercise?: FieldPolicy<any> | FieldReadFunction<any>,
	exerciseCompletion?: FieldPolicy<any> | FieldReadFunction<any>,
	exerciseCompletions?: FieldPolicy<any> | FieldReadFunction<any>,
	exercises?: FieldPolicy<any> | FieldReadFunction<any>,
	handlerCourses?: FieldPolicy<any> | FieldReadFunction<any>,
	openUniversityRegistrationLink?: FieldPolicy<any> | FieldReadFunction<any>,
	openUniversityRegistrationLinks?: FieldPolicy<any> | FieldReadFunction<any>,
	organization?: FieldPolicy<any> | FieldReadFunction<any>,
	organizations?: FieldPolicy<any> | FieldReadFunction<any>,
	registeredCompletions?: FieldPolicy<any> | FieldReadFunction<any>,
	service?: FieldPolicy<any> | FieldReadFunction<any>,
	services?: FieldPolicy<any> | FieldReadFunction<any>,
	sponsors?: FieldPolicy<any> | FieldReadFunction<any>,
	studyModuleTranslations?: FieldPolicy<any> | FieldReadFunction<any>,
	study_module?: FieldPolicy<any> | FieldReadFunction<any>,
	study_module_exists?: FieldPolicy<any> | FieldReadFunction<any>,
	study_modules?: FieldPolicy<any> | FieldReadFunction<any>,
	tagTypes?: FieldPolicy<any> | FieldReadFunction<any>,
	tags?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	userCourseProgress?: FieldPolicy<any> | FieldReadFunction<any>,
	userCourseProgresses?: FieldPolicy<any> | FieldReadFunction<any>,
	userCourseServiceProgress?: FieldPolicy<any> | FieldReadFunction<any>,
	userCourseServiceProgresses?: FieldPolicy<any> | FieldReadFunction<any>,
	userCourseSetting?: FieldPolicy<any> | FieldReadFunction<any>,
	userCourseSettingCount?: FieldPolicy<any> | FieldReadFunction<any>,
	userCourseSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	userDetailsContains?: FieldPolicy<any> | FieldReadFunction<any>,
	userOrganizationJoinConfirmation?: FieldPolicy<any> | FieldReadFunction<any>,
	userOrganizations?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryCompletionsPaginated_type_ConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | QueryCompletionsPaginated_type_ConnectionKeySpecifier)[];
export type QueryCompletionsPaginated_type_ConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryUserCourseSettings_ConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | QueryUserCourseSettings_ConnectionKeySpecifier)[];
export type QueryUserCourseSettings_ConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryUserDetailsContains_ConnectionKeySpecifier = ('count' | 'edges' | 'pageInfo' | QueryUserDetailsContains_ConnectionKeySpecifier)[];
export type QueryUserDetailsContains_ConnectionFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ServiceKeySpecifier = ('courses' | 'created_at' | 'exercises' | 'id' | 'name' | 'updated_at' | 'url' | 'user_course_service_progresses' | ServiceKeySpecifier)[];
export type ServiceFieldPolicy = {
	courses?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	exercises?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>,
	user_course_service_progresses?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SponsorKeySpecifier = ('courses' | 'created_at' | 'id' | 'images' | 'language' | 'name' | 'order' | 'translations' | 'updated_at' | SponsorKeySpecifier)[];
export type SponsorFieldPolicy = {
	courses?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	images?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	translations?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SponsorImageKeySpecifier = ('created_at' | 'height' | 'sponsor' | 'sponsor_id' | 'type' | 'updated_at' | 'uri' | 'width' | SponsorImageKeySpecifier)[];
export type SponsorImageFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	height?: FieldPolicy<any> | FieldReadFunction<any>,
	sponsor?: FieldPolicy<any> | FieldReadFunction<any>,
	sponsor_id?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	uri?: FieldPolicy<any> | FieldReadFunction<any>,
	width?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SponsorTranslationKeySpecifier = ('created_at' | 'description' | 'language' | 'link' | 'link_text' | 'name' | 'sponsor' | 'sponsor_id' | 'updated_at' | SponsorTranslationKeySpecifier)[];
export type SponsorTranslationFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	link?: FieldPolicy<any> | FieldReadFunction<any>,
	link_text?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	sponsor?: FieldPolicy<any> | FieldReadFunction<any>,
	sponsor_id?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StoredDataKeySpecifier = ('course' | 'course_id' | 'created_at' | 'data' | 'updated_at' | 'user' | 'user_id' | StoredDataKeySpecifier)[];
export type StoredDataFieldPolicy = {
	course?: FieldPolicy<any> | FieldReadFunction<any>,
	course_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StudyModuleKeySpecifier = ('courses' | 'created_at' | 'description' | 'id' | 'image' | 'name' | 'order' | 'slug' | 'study_module_translations' | 'updated_at' | StudyModuleKeySpecifier)[];
export type StudyModuleFieldPolicy = {
	courses?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	image?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	study_module_translations?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StudyModuleTranslationKeySpecifier = ('created_at' | 'description' | 'id' | 'language' | 'name' | 'study_module' | 'study_module_id' | 'updated_at' | StudyModuleTranslationKeySpecifier)[];
export type StudyModuleTranslationFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	study_module?: FieldPolicy<any> | FieldReadFunction<any>,
	study_module_id?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SubscriptionKeySpecifier = ('userSearch' | SubscriptionKeySpecifier)[];
export type SubscriptionFieldPolicy = {
	userSearch?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TagKeySpecifier = ('abbreviation' | 'courses' | 'created_at' | 'description' | 'hidden' | 'id' | 'language' | 'name' | 'tag_translations' | 'tag_types' | 'types' | 'updated_at' | TagKeySpecifier)[];
export type TagFieldPolicy = {
	abbreviation?: FieldPolicy<any> | FieldReadFunction<any>,
	courses?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	hidden?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	tag_translations?: FieldPolicy<any> | FieldReadFunction<any>,
	tag_types?: FieldPolicy<any> | FieldReadFunction<any>,
	types?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TagTranslationKeySpecifier = ('abbreviation' | 'created_at' | 'description' | 'language' | 'name' | 'tag' | 'tag_id' | 'updated_at' | TagTranslationKeySpecifier)[];
export type TagTranslationFieldPolicy = {
	abbreviation?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	tag?: FieldPolicy<any> | FieldReadFunction<any>,
	tag_id?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TagTypeKeySpecifier = ('created_at' | 'name' | 'tags' | 'updated_at' | TagTypeKeySpecifier)[];
export type TagTypeFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	tags?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TierInfoKeySpecifier = ('exerciseCompletions' | 'exerciseCount' | 'exercisePercentage' | 'exercisesNeededPercentage' | 'hasTier' | 'id' | 'missingFromTier' | 'name' | 'requiredByTier' | 'tier' | TierInfoKeySpecifier)[];
export type TierInfoFieldPolicy = {
	exerciseCompletions?: FieldPolicy<any> | FieldReadFunction<any>,
	exerciseCount?: FieldPolicy<any> | FieldReadFunction<any>,
	exercisePercentage?: FieldPolicy<any> | FieldReadFunction<any>,
	exercisesNeededPercentage?: FieldPolicy<any> | FieldReadFunction<any>,
	hasTier?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	missingFromTier?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	requiredByTier?: FieldPolicy<any> | FieldReadFunction<any>,
	tier?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TierProgressKeySpecifier = ('course' | 'course_id' | 'custom_id' | 'exercise' | 'exercise_completions' | 'exercise_id' | 'exercise_number' | 'max_points' | 'n_points' | 'name' | 'progress' | 'service' | 'service_id' | 'tier' | 'user_id' | TierProgressKeySpecifier)[];
export type TierProgressFieldPolicy = {
	course?: FieldPolicy<any> | FieldReadFunction<any>,
	course_id?: FieldPolicy<any> | FieldReadFunction<any>,
	custom_id?: FieldPolicy<any> | FieldReadFunction<any>,
	exercise?: FieldPolicy<any> | FieldReadFunction<any>,
	exercise_completions?: FieldPolicy<any> | FieldReadFunction<any>,
	exercise_id?: FieldPolicy<any> | FieldReadFunction<any>,
	exercise_number?: FieldPolicy<any> | FieldReadFunction<any>,
	max_points?: FieldPolicy<any> | FieldReadFunction<any>,
	n_points?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	progress?: FieldPolicy<any> | FieldReadFunction<any>,
	service?: FieldPolicy<any> | FieldReadFunction<any>,
	service_id?: FieldPolicy<any> | FieldReadFunction<any>,
	tier?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('ab_enrollments' | 'administrator' | 'completions' | 'completions_registered' | 'course_ownerships' | 'course_stats_subscriptions' | 'created_at' | 'email' | 'email_deliveries' | 'exercise_completions' | 'first_name' | 'full_name' | 'id' | 'last_name' | 'organizations' | 'progress' | 'progresses' | 'project_completion' | 'real_student_number' | 'research_consent' | 'student_number' | 'updated_at' | 'upstream_id' | 'user_course_progresses' | 'user_course_progressess' | 'user_course_service_progresses' | 'user_course_settings' | 'user_course_summary' | 'user_organizations' | 'username' | 'verified_users' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	ab_enrollments?: FieldPolicy<any> | FieldReadFunction<any>,
	administrator?: FieldPolicy<any> | FieldReadFunction<any>,
	completions?: FieldPolicy<any> | FieldReadFunction<any>,
	completions_registered?: FieldPolicy<any> | FieldReadFunction<any>,
	course_ownerships?: FieldPolicy<any> | FieldReadFunction<any>,
	course_stats_subscriptions?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	email_deliveries?: FieldPolicy<any> | FieldReadFunction<any>,
	exercise_completions?: FieldPolicy<any> | FieldReadFunction<any>,
	first_name?: FieldPolicy<any> | FieldReadFunction<any>,
	full_name?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	last_name?: FieldPolicy<any> | FieldReadFunction<any>,
	organizations?: FieldPolicy<any> | FieldReadFunction<any>,
	progress?: FieldPolicy<any> | FieldReadFunction<any>,
	progresses?: FieldPolicy<any> | FieldReadFunction<any>,
	project_completion?: FieldPolicy<any> | FieldReadFunction<any>,
	real_student_number?: FieldPolicy<any> | FieldReadFunction<any>,
	research_consent?: FieldPolicy<any> | FieldReadFunction<any>,
	student_number?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	upstream_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_course_progresses?: FieldPolicy<any> | FieldReadFunction<any>,
	user_course_progressess?: FieldPolicy<any> | FieldReadFunction<any>,
	user_course_service_progresses?: FieldPolicy<any> | FieldReadFunction<any>,
	user_course_settings?: FieldPolicy<any> | FieldReadFunction<any>,
	user_course_summary?: FieldPolicy<any> | FieldReadFunction<any>,
	user_organizations?: FieldPolicy<any> | FieldReadFunction<any>,
	username?: FieldPolicy<any> | FieldReadFunction<any>,
	verified_users?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserAppDatumConfigKeySpecifier = ('created_at' | 'id' | 'name' | 'timestamp' | 'updated_at' | UserAppDatumConfigKeySpecifier)[];
export type UserAppDatumConfigFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserCourseProgressKeySpecifier = ('course' | 'course_id' | 'created_at' | 'exercise_progress' | 'extra' | 'id' | 'max_points' | 'n_points' | 'points_by_group' | 'progress' | 'updated_at' | 'user' | 'user_course_service_progresses' | 'user_course_settings' | 'user_id' | UserCourseProgressKeySpecifier)[];
export type UserCourseProgressFieldPolicy = {
	course?: FieldPolicy<any> | FieldReadFunction<any>,
	course_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	exercise_progress?: FieldPolicy<any> | FieldReadFunction<any>,
	extra?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	max_points?: FieldPolicy<any> | FieldReadFunction<any>,
	n_points?: FieldPolicy<any> | FieldReadFunction<any>,
	points_by_group?: FieldPolicy<any> | FieldReadFunction<any>,
	progress?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_course_service_progresses?: FieldPolicy<any> | FieldReadFunction<any>,
	user_course_settings?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserCourseServiceProgressKeySpecifier = ('course' | 'course_id' | 'created_at' | 'id' | 'points_by_group' | 'progress' | 'service' | 'service_id' | 'timestamp' | 'updated_at' | 'user' | 'user_course_progress' | 'user_course_progress_id' | 'user_id' | UserCourseServiceProgressKeySpecifier)[];
export type UserCourseServiceProgressFieldPolicy = {
	course?: FieldPolicy<any> | FieldReadFunction<any>,
	course_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	points_by_group?: FieldPolicy<any> | FieldReadFunction<any>,
	progress?: FieldPolicy<any> | FieldReadFunction<any>,
	service?: FieldPolicy<any> | FieldReadFunction<any>,
	service_id?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_course_progress?: FieldPolicy<any> | FieldReadFunction<any>,
	user_course_progress_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserCourseSettingKeySpecifier = ('country' | 'course' | 'course_id' | 'course_variant' | 'created_at' | 'id' | 'language' | 'marketing' | 'other' | 'research' | 'updated_at' | 'user' | 'user_id' | UserCourseSettingKeySpecifier)[];
export type UserCourseSettingFieldPolicy = {
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	course?: FieldPolicy<any> | FieldReadFunction<any>,
	course_id?: FieldPolicy<any> | FieldReadFunction<any>,
	course_variant?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	marketing?: FieldPolicy<any> | FieldReadFunction<any>,
	other?: FieldPolicy<any> | FieldReadFunction<any>,
	research?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserCourseSettingEdgeKeySpecifier = ('cursor' | 'node' | UserCourseSettingEdgeKeySpecifier)[];
export type UserCourseSettingEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserCourseSettingsVisibilityKeySpecifier = ('course' | 'course_id' | 'created_at' | 'id' | 'language' | 'updated_at' | UserCourseSettingsVisibilityKeySpecifier)[];
export type UserCourseSettingsVisibilityFieldPolicy = {
	course?: FieldPolicy<any> | FieldReadFunction<any>,
	course_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserCourseSummaryKeySpecifier = ('completion' | 'completions_handled_by_id' | 'course' | 'course_id' | 'exercise_completions' | 'exercises' | 'include_deleted_exercises' | 'include_no_points_awarded_exercises' | 'inherit_settings_from_id' | 'start_date' | 'tier' | 'tier_summaries' | 'user_course_progress' | 'user_course_service_progresses' | 'user_id' | UserCourseSummaryKeySpecifier)[];
export type UserCourseSummaryFieldPolicy = {
	completion?: FieldPolicy<any> | FieldReadFunction<any>,
	completions_handled_by_id?: FieldPolicy<any> | FieldReadFunction<any>,
	course?: FieldPolicy<any> | FieldReadFunction<any>,
	course_id?: FieldPolicy<any> | FieldReadFunction<any>,
	exercise_completions?: FieldPolicy<any> | FieldReadFunction<any>,
	exercises?: FieldPolicy<any> | FieldReadFunction<any>,
	include_deleted_exercises?: FieldPolicy<any> | FieldReadFunction<any>,
	include_no_points_awarded_exercises?: FieldPolicy<any> | FieldReadFunction<any>,
	inherit_settings_from_id?: FieldPolicy<any> | FieldReadFunction<any>,
	start_date?: FieldPolicy<any> | FieldReadFunction<any>,
	tier?: FieldPolicy<any> | FieldReadFunction<any>,
	tier_summaries?: FieldPolicy<any> | FieldReadFunction<any>,
	user_course_progress?: FieldPolicy<any> | FieldReadFunction<any>,
	user_course_service_progresses?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserEdgeKeySpecifier = ('cursor' | 'node' | UserEdgeKeySpecifier)[];
export type UserEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserOrganizationKeySpecifier = ('confirmed' | 'confirmed_at' | 'consented' | 'created_at' | 'id' | 'organization' | 'organization_id' | 'organizational_email' | 'organizational_identifier' | 'role' | 'updated_at' | 'user' | 'user_id' | 'user_organization_join_confirmations' | UserOrganizationKeySpecifier)[];
export type UserOrganizationFieldPolicy = {
	confirmed?: FieldPolicy<any> | FieldReadFunction<any>,
	confirmed_at?: FieldPolicy<any> | FieldReadFunction<any>,
	consented?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	organization?: FieldPolicy<any> | FieldReadFunction<any>,
	organization_id?: FieldPolicy<any> | FieldReadFunction<any>,
	organizational_email?: FieldPolicy<any> | FieldReadFunction<any>,
	organizational_identifier?: FieldPolicy<any> | FieldReadFunction<any>,
	role?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_organization_join_confirmations?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserOrganizationJoinConfirmationKeySpecifier = ('confirmed' | 'confirmed_at' | 'created_at' | 'email' | 'email_delivery' | 'email_delivery_id' | 'expired' | 'expires_at' | 'id' | 'language' | 'redirect' | 'updated_at' | 'user_organization' | 'user_organization_id' | UserOrganizationJoinConfirmationKeySpecifier)[];
export type UserOrganizationJoinConfirmationFieldPolicy = {
	confirmed?: FieldPolicy<any> | FieldReadFunction<any>,
	confirmed_at?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	email_delivery?: FieldPolicy<any> | FieldReadFunction<any>,
	email_delivery_id?: FieldPolicy<any> | FieldReadFunction<any>,
	expired?: FieldPolicy<any> | FieldReadFunction<any>,
	expires_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	redirect?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user_organization?: FieldPolicy<any> | FieldReadFunction<any>,
	user_organization_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserSearchKeySpecifier = ('allMatchIds' | 'count' | 'field' | 'fieldCount' | 'fieldIndex' | 'fieldResultCount' | 'fieldUniqueResultCount' | 'fieldValue' | 'finished' | 'matches' | 'search' | UserSearchKeySpecifier)[];
export type UserSearchFieldPolicy = {
	allMatchIds?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldCount?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldIndex?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldResultCount?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldUniqueResultCount?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldValue?: FieldPolicy<any> | FieldReadFunction<any>,
	finished?: FieldPolicy<any> | FieldReadFunction<any>,
	matches?: FieldPolicy<any> | FieldReadFunction<any>,
	search?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VerifiedUserKeySpecifier = ('created_at' | 'display_name' | 'id' | 'organization' | 'organization_id' | 'personal_unique_code' | 'updated_at' | 'user' | 'user_id' | VerifiedUserKeySpecifier)[];
export type VerifiedUserFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	display_name?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	organization?: FieldPolicy<any> | FieldReadFunction<any>,
	organization_id?: FieldPolicy<any> | FieldReadFunction<any>,
	personal_unique_code?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	AbEnrollment?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AbEnrollmentKeySpecifier | (() => undefined | AbEnrollmentKeySpecifier),
		fields?: AbEnrollmentFieldPolicy,
	},
	AbStudy?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AbStudyKeySpecifier | (() => undefined | AbStudyKeySpecifier),
		fields?: AbStudyFieldPolicy,
	},
	CertificateAvailability?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CertificateAvailabilityKeySpecifier | (() => undefined | CertificateAvailabilityKeySpecifier),
		fields?: CertificateAvailabilityFieldPolicy,
	},
	Completion?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CompletionKeySpecifier | (() => undefined | CompletionKeySpecifier),
		fields?: CompletionFieldPolicy,
	},
	CompletionEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CompletionEdgeKeySpecifier | (() => undefined | CompletionEdgeKeySpecifier),
		fields?: CompletionEdgeFieldPolicy,
	},
	CompletionRegistered?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CompletionRegisteredKeySpecifier | (() => undefined | CompletionRegisteredKeySpecifier),
		fields?: CompletionRegisteredFieldPolicy,
	},
	Course?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CourseKeySpecifier | (() => undefined | CourseKeySpecifier),
		fields?: CourseFieldPolicy,
	},
	CourseAlias?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CourseAliasKeySpecifier | (() => undefined | CourseAliasKeySpecifier),
		fields?: CourseAliasFieldPolicy,
	},
	CourseOrganization?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CourseOrganizationKeySpecifier | (() => undefined | CourseOrganizationKeySpecifier),
		fields?: CourseOrganizationFieldPolicy,
	},
	CourseOwnership?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CourseOwnershipKeySpecifier | (() => undefined | CourseOwnershipKeySpecifier),
		fields?: CourseOwnershipFieldPolicy,
	},
	CourseSponsor?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CourseSponsorKeySpecifier | (() => undefined | CourseSponsorKeySpecifier),
		fields?: CourseSponsorFieldPolicy,
	},
	CourseStatsSubscription?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CourseStatsSubscriptionKeySpecifier | (() => undefined | CourseStatsSubscriptionKeySpecifier),
		fields?: CourseStatsSubscriptionFieldPolicy,
	},
	CourseTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CourseTranslationKeySpecifier | (() => undefined | CourseTranslationKeySpecifier),
		fields?: CourseTranslationFieldPolicy,
	},
	CourseVariant?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CourseVariantKeySpecifier | (() => undefined | CourseVariantKeySpecifier),
		fields?: CourseVariantFieldPolicy,
	},
	EmailDelivery?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | EmailDeliveryKeySpecifier | (() => undefined | EmailDeliveryKeySpecifier),
		fields?: EmailDeliveryFieldPolicy,
	},
	EmailTemplate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | EmailTemplateKeySpecifier | (() => undefined | EmailTemplateKeySpecifier),
		fields?: EmailTemplateFieldPolicy,
	},
	Exercise?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExerciseKeySpecifier | (() => undefined | ExerciseKeySpecifier),
		fields?: ExerciseFieldPolicy,
	},
	ExerciseCompletion?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExerciseCompletionKeySpecifier | (() => undefined | ExerciseCompletionKeySpecifier),
		fields?: ExerciseCompletionFieldPolicy,
	},
	ExerciseCompletionRequiredAction?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExerciseCompletionRequiredActionKeySpecifier | (() => undefined | ExerciseCompletionRequiredActionKeySpecifier),
		fields?: ExerciseCompletionRequiredActionFieldPolicy,
	},
	ExerciseProgress?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExerciseProgressKeySpecifier | (() => undefined | ExerciseProgressKeySpecifier),
		fields?: ExerciseProgressFieldPolicy,
	},
	Image?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ImageKeySpecifier | (() => undefined | ImageKeySpecifier),
		fields?: ImageFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	OpenUniversityRegistrationLink?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OpenUniversityRegistrationLinkKeySpecifier | (() => undefined | OpenUniversityRegistrationLinkKeySpecifier),
		fields?: OpenUniversityRegistrationLinkFieldPolicy,
	},
	Organization?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrganizationKeySpecifier | (() => undefined | OrganizationKeySpecifier),
		fields?: OrganizationFieldPolicy,
	},
	OrganizationTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrganizationTranslationKeySpecifier | (() => undefined | OrganizationTranslationKeySpecifier),
		fields?: OrganizationTranslationFieldPolicy,
	},
	PageInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageInfoKeySpecifier | (() => undefined | PageInfoKeySpecifier),
		fields?: PageInfoFieldPolicy,
	},
	PointsByGroup?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PointsByGroupKeySpecifier | (() => undefined | PointsByGroupKeySpecifier),
		fields?: PointsByGroupFieldPolicy,
	},
	Progress?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProgressKeySpecifier | (() => undefined | ProgressKeySpecifier),
		fields?: ProgressFieldPolicy,
	},
	ProgressExtra?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProgressExtraKeySpecifier | (() => undefined | ProgressExtraKeySpecifier),
		fields?: ProgressExtraFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	QueryCompletionsPaginated_type_Connection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryCompletionsPaginated_type_ConnectionKeySpecifier | (() => undefined | QueryCompletionsPaginated_type_ConnectionKeySpecifier),
		fields?: QueryCompletionsPaginated_type_ConnectionFieldPolicy,
	},
	QueryUserCourseSettings_Connection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryUserCourseSettings_ConnectionKeySpecifier | (() => undefined | QueryUserCourseSettings_ConnectionKeySpecifier),
		fields?: QueryUserCourseSettings_ConnectionFieldPolicy,
	},
	QueryUserDetailsContains_Connection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryUserDetailsContains_ConnectionKeySpecifier | (() => undefined | QueryUserDetailsContains_ConnectionKeySpecifier),
		fields?: QueryUserDetailsContains_ConnectionFieldPolicy,
	},
	Service?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ServiceKeySpecifier | (() => undefined | ServiceKeySpecifier),
		fields?: ServiceFieldPolicy,
	},
	Sponsor?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SponsorKeySpecifier | (() => undefined | SponsorKeySpecifier),
		fields?: SponsorFieldPolicy,
	},
	SponsorImage?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SponsorImageKeySpecifier | (() => undefined | SponsorImageKeySpecifier),
		fields?: SponsorImageFieldPolicy,
	},
	SponsorTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SponsorTranslationKeySpecifier | (() => undefined | SponsorTranslationKeySpecifier),
		fields?: SponsorTranslationFieldPolicy,
	},
	StoredData?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StoredDataKeySpecifier | (() => undefined | StoredDataKeySpecifier),
		fields?: StoredDataFieldPolicy,
	},
	StudyModule?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StudyModuleKeySpecifier | (() => undefined | StudyModuleKeySpecifier),
		fields?: StudyModuleFieldPolicy,
	},
	StudyModuleTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StudyModuleTranslationKeySpecifier | (() => undefined | StudyModuleTranslationKeySpecifier),
		fields?: StudyModuleTranslationFieldPolicy,
	},
	Subscription?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SubscriptionKeySpecifier | (() => undefined | SubscriptionKeySpecifier),
		fields?: SubscriptionFieldPolicy,
	},
	Tag?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TagKeySpecifier | (() => undefined | TagKeySpecifier),
		fields?: TagFieldPolicy,
	},
	TagTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TagTranslationKeySpecifier | (() => undefined | TagTranslationKeySpecifier),
		fields?: TagTranslationFieldPolicy,
	},
	TagType?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TagTypeKeySpecifier | (() => undefined | TagTypeKeySpecifier),
		fields?: TagTypeFieldPolicy,
	},
	TierInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TierInfoKeySpecifier | (() => undefined | TierInfoKeySpecifier),
		fields?: TierInfoFieldPolicy,
	},
	TierProgress?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TierProgressKeySpecifier | (() => undefined | TierProgressKeySpecifier),
		fields?: TierProgressFieldPolicy,
	},
	User?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		fields?: UserFieldPolicy,
	},
	UserAppDatumConfig?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserAppDatumConfigKeySpecifier | (() => undefined | UserAppDatumConfigKeySpecifier),
		fields?: UserAppDatumConfigFieldPolicy,
	},
	UserCourseProgress?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserCourseProgressKeySpecifier | (() => undefined | UserCourseProgressKeySpecifier),
		fields?: UserCourseProgressFieldPolicy,
	},
	UserCourseServiceProgress?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserCourseServiceProgressKeySpecifier | (() => undefined | UserCourseServiceProgressKeySpecifier),
		fields?: UserCourseServiceProgressFieldPolicy,
	},
	UserCourseSetting?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserCourseSettingKeySpecifier | (() => undefined | UserCourseSettingKeySpecifier),
		fields?: UserCourseSettingFieldPolicy,
	},
	UserCourseSettingEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserCourseSettingEdgeKeySpecifier | (() => undefined | UserCourseSettingEdgeKeySpecifier),
		fields?: UserCourseSettingEdgeFieldPolicy,
	},
	UserCourseSettingsVisibility?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserCourseSettingsVisibilityKeySpecifier | (() => undefined | UserCourseSettingsVisibilityKeySpecifier),
		fields?: UserCourseSettingsVisibilityFieldPolicy,
	},
	UserCourseSummary?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserCourseSummaryKeySpecifier | (() => undefined | UserCourseSummaryKeySpecifier),
		fields?: UserCourseSummaryFieldPolicy,
	},
	UserEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserEdgeKeySpecifier | (() => undefined | UserEdgeKeySpecifier),
		fields?: UserEdgeFieldPolicy,
	},
	UserOrganization?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserOrganizationKeySpecifier | (() => undefined | UserOrganizationKeySpecifier),
		fields?: UserOrganizationFieldPolicy,
	},
	UserOrganizationJoinConfirmation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserOrganizationJoinConfirmationKeySpecifier | (() => undefined | UserOrganizationJoinConfirmationKeySpecifier),
		fields?: UserOrganizationJoinConfirmationFieldPolicy,
	},
	UserSearch?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserSearchKeySpecifier | (() => undefined | UserSearchKeySpecifier),
		fields?: UserSearchFieldPolicy,
	},
	VerifiedUser?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VerifiedUserKeySpecifier | (() => undefined | VerifiedUserKeySpecifier),
		fields?: VerifiedUserFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;