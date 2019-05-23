/**
 * This file was automatically generated by Nexus 0.11.6
 * Do not make changes to this file directly
 */

import * as ctx from "../context"


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  CompletionArg: { // input type
    completion_id: string; // String!
    student_number: string; // String!
  }
  CompletionRegisteredWhereInput: { // input type
    AND?: NexusGenInputs['CompletionRegisteredWhereInput'][] | null; // [CompletionRegisteredWhereInput!]
    completion?: NexusGenInputs['CompletionWhereInput'] | null; // CompletionWhereInput
    course?: NexusGenInputs['CourseWhereInput'] | null; // CourseWhereInput
    created_at?: any | null; // DateTime
    created_at_gt?: any | null; // DateTime
    created_at_gte?: any | null; // DateTime
    created_at_in?: any[] | null; // [DateTime!]
    created_at_lt?: any | null; // DateTime
    created_at_lte?: any | null; // DateTime
    created_at_not?: any | null; // DateTime
    created_at_not_in?: any[] | null; // [DateTime!]
    id?: any | null; // UUID
    id_contains?: any | null; // UUID
    id_ends_with?: any | null; // UUID
    id_gt?: any | null; // UUID
    id_gte?: any | null; // UUID
    id_in?: any[] | null; // [UUID!]
    id_lt?: any | null; // UUID
    id_lte?: any | null; // UUID
    id_not?: any | null; // UUID
    id_not_contains?: any | null; // UUID
    id_not_ends_with?: any | null; // UUID
    id_not_in?: any[] | null; // [UUID!]
    id_not_starts_with?: any | null; // UUID
    id_starts_with?: any | null; // UUID
    NOT?: NexusGenInputs['CompletionRegisteredWhereInput'][] | null; // [CompletionRegisteredWhereInput!]
    OR?: NexusGenInputs['CompletionRegisteredWhereInput'][] | null; // [CompletionRegisteredWhereInput!]
    organisation?: string | null; // String
    organisation_contains?: string | null; // String
    organisation_ends_with?: string | null; // String
    organisation_gt?: string | null; // String
    organisation_gte?: string | null; // String
    organisation_in?: string[] | null; // [String!]
    organisation_lt?: string | null; // String
    organisation_lte?: string | null; // String
    organisation_not?: string | null; // String
    organisation_not_contains?: string | null; // String
    organisation_not_ends_with?: string | null; // String
    organisation_not_in?: string[] | null; // [String!]
    organisation_not_starts_with?: string | null; // String
    organisation_starts_with?: string | null; // String
    real_student_number?: string | null; // String
    real_student_number_contains?: string | null; // String
    real_student_number_ends_with?: string | null; // String
    real_student_number_gt?: string | null; // String
    real_student_number_gte?: string | null; // String
    real_student_number_in?: string[] | null; // [String!]
    real_student_number_lt?: string | null; // String
    real_student_number_lte?: string | null; // String
    real_student_number_not?: string | null; // String
    real_student_number_not_contains?: string | null; // String
    real_student_number_not_ends_with?: string | null; // String
    real_student_number_not_in?: string[] | null; // [String!]
    real_student_number_not_starts_with?: string | null; // String
    real_student_number_starts_with?: string | null; // String
    updated_at?: any | null; // DateTime
    updated_at_gt?: any | null; // DateTime
    updated_at_gte?: any | null; // DateTime
    updated_at_in?: any[] | null; // [DateTime!]
    updated_at_lt?: any | null; // DateTime
    updated_at_lte?: any | null; // DateTime
    updated_at_not?: any | null; // DateTime
    updated_at_not_in?: any[] | null; // [DateTime!]
    user?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
  }
  CompletionWhereInput: { // input type
    AND?: NexusGenInputs['CompletionWhereInput'][] | null; // [CompletionWhereInput!]
    completion_language?: string | null; // String
    completion_language_contains?: string | null; // String
    completion_language_ends_with?: string | null; // String
    completion_language_gt?: string | null; // String
    completion_language_gte?: string | null; // String
    completion_language_in?: string[] | null; // [String!]
    completion_language_lt?: string | null; // String
    completion_language_lte?: string | null; // String
    completion_language_not?: string | null; // String
    completion_language_not_contains?: string | null; // String
    completion_language_not_ends_with?: string | null; // String
    completion_language_not_in?: string[] | null; // [String!]
    completion_language_not_starts_with?: string | null; // String
    completion_language_starts_with?: string | null; // String
    course?: NexusGenInputs['CourseWhereInput'] | null; // CourseWhereInput
    created_at?: any | null; // DateTime
    created_at_gt?: any | null; // DateTime
    created_at_gte?: any | null; // DateTime
    created_at_in?: any[] | null; // [DateTime!]
    created_at_lt?: any | null; // DateTime
    created_at_lte?: any | null; // DateTime
    created_at_not?: any | null; // DateTime
    created_at_not_in?: any[] | null; // [DateTime!]
    email?: string | null; // String
    email_contains?: string | null; // String
    email_ends_with?: string | null; // String
    email_gt?: string | null; // String
    email_gte?: string | null; // String
    email_in?: string[] | null; // [String!]
    email_lt?: string | null; // String
    email_lte?: string | null; // String
    email_not?: string | null; // String
    email_not_contains?: string | null; // String
    email_not_ends_with?: string | null; // String
    email_not_in?: string[] | null; // [String!]
    email_not_starts_with?: string | null; // String
    email_starts_with?: string | null; // String
    id?: any | null; // UUID
    id_contains?: any | null; // UUID
    id_ends_with?: any | null; // UUID
    id_gt?: any | null; // UUID
    id_gte?: any | null; // UUID
    id_in?: any[] | null; // [UUID!]
    id_lt?: any | null; // UUID
    id_lte?: any | null; // UUID
    id_not?: any | null; // UUID
    id_not_contains?: any | null; // UUID
    id_not_ends_with?: any | null; // UUID
    id_not_in?: any[] | null; // [UUID!]
    id_not_starts_with?: any | null; // UUID
    id_starts_with?: any | null; // UUID
    NOT?: NexusGenInputs['CompletionWhereInput'][] | null; // [CompletionWhereInput!]
    OR?: NexusGenInputs['CompletionWhereInput'][] | null; // [CompletionWhereInput!]
    student_number?: string | null; // String
    student_number_contains?: string | null; // String
    student_number_ends_with?: string | null; // String
    student_number_gt?: string | null; // String
    student_number_gte?: string | null; // String
    student_number_in?: string[] | null; // [String!]
    student_number_lt?: string | null; // String
    student_number_lte?: string | null; // String
    student_number_not?: string | null; // String
    student_number_not_contains?: string | null; // String
    student_number_not_ends_with?: string | null; // String
    student_number_not_in?: string[] | null; // [String!]
    student_number_not_starts_with?: string | null; // String
    student_number_starts_with?: string | null; // String
    updated_at?: any | null; // DateTime
    updated_at_gt?: any | null; // DateTime
    updated_at_gte?: any | null; // DateTime
    updated_at_in?: any[] | null; // [DateTime!]
    updated_at_lt?: any | null; // DateTime
    updated_at_lte?: any | null; // DateTime
    updated_at_not?: any | null; // DateTime
    updated_at_not_in?: any[] | null; // [DateTime!]
    user?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    user_upstream_id?: number | null; // Int
    user_upstream_id_gt?: number | null; // Int
    user_upstream_id_gte?: number | null; // Int
    user_upstream_id_in?: number[] | null; // [Int!]
    user_upstream_id_lt?: number | null; // Int
    user_upstream_id_lte?: number | null; // Int
    user_upstream_id_not?: number | null; // Int
    user_upstream_id_not_in?: number[] | null; // [Int!]
  }
  CourseWhereInput: { // input type
    AND?: NexusGenInputs['CourseWhereInput'][] | null; // [CourseWhereInput!]
    created_at?: any | null; // DateTime
    created_at_gt?: any | null; // DateTime
    created_at_gte?: any | null; // DateTime
    created_at_in?: any[] | null; // [DateTime!]
    created_at_lt?: any | null; // DateTime
    created_at_lte?: any | null; // DateTime
    created_at_not?: any | null; // DateTime
    created_at_not_in?: any[] | null; // [DateTime!]
    id?: any | null; // UUID
    id_contains?: any | null; // UUID
    id_ends_with?: any | null; // UUID
    id_gt?: any | null; // UUID
    id_gte?: any | null; // UUID
    id_in?: any[] | null; // [UUID!]
    id_lt?: any | null; // UUID
    id_lte?: any | null; // UUID
    id_not?: any | null; // UUID
    id_not_contains?: any | null; // UUID
    id_not_ends_with?: any | null; // UUID
    id_not_in?: any[] | null; // [UUID!]
    id_not_starts_with?: any | null; // UUID
    id_starts_with?: any | null; // UUID
    name?: string | null; // String
    name_contains?: string | null; // String
    name_ends_with?: string | null; // String
    name_gt?: string | null; // String
    name_gte?: string | null; // String
    name_in?: string[] | null; // [String!]
    name_lt?: string | null; // String
    name_lte?: string | null; // String
    name_not?: string | null; // String
    name_not_contains?: string | null; // String
    name_not_ends_with?: string | null; // String
    name_not_in?: string[] | null; // [String!]
    name_not_starts_with?: string | null; // String
    name_starts_with?: string | null; // String
    NOT?: NexusGenInputs['CourseWhereInput'][] | null; // [CourseWhereInput!]
    open_university_courses_every?: NexusGenInputs['OpenUniversityCourseWhereInput'] | null; // OpenUniversityCourseWhereInput
    open_university_courses_none?: NexusGenInputs['OpenUniversityCourseWhereInput'] | null; // OpenUniversityCourseWhereInput
    open_university_courses_some?: NexusGenInputs['OpenUniversityCourseWhereInput'] | null; // OpenUniversityCourseWhereInput
    OR?: NexusGenInputs['CourseWhereInput'][] | null; // [CourseWhereInput!]
    slug?: string | null; // String
    slug_contains?: string | null; // String
    slug_ends_with?: string | null; // String
    slug_gt?: string | null; // String
    slug_gte?: string | null; // String
    slug_in?: string[] | null; // [String!]
    slug_lt?: string | null; // String
    slug_lte?: string | null; // String
    slug_not?: string | null; // String
    slug_not_contains?: string | null; // String
    slug_not_ends_with?: string | null; // String
    slug_not_in?: string[] | null; // [String!]
    slug_not_starts_with?: string | null; // String
    slug_starts_with?: string | null; // String
    updated_at?: any | null; // DateTime
    updated_at_gt?: any | null; // DateTime
    updated_at_gte?: any | null; // DateTime
    updated_at_in?: any[] | null; // [DateTime!]
    updated_at_lt?: any | null; // DateTime
    updated_at_lte?: any | null; // DateTime
    updated_at_not?: any | null; // DateTime
    updated_at_not_in?: any[] | null; // [DateTime!]
  }
  OpenUniversityCourseWhereInput: { // input type
    AND?: NexusGenInputs['OpenUniversityCourseWhereInput'][] | null; // [OpenUniversityCourseWhereInput!]
    course?: NexusGenInputs['CourseWhereInput'] | null; // CourseWhereInput
    course_code?: string | null; // String
    course_code_contains?: string | null; // String
    course_code_ends_with?: string | null; // String
    course_code_gt?: string | null; // String
    course_code_gte?: string | null; // String
    course_code_in?: string[] | null; // [String!]
    course_code_lt?: string | null; // String
    course_code_lte?: string | null; // String
    course_code_not?: string | null; // String
    course_code_not_contains?: string | null; // String
    course_code_not_ends_with?: string | null; // String
    course_code_not_in?: string[] | null; // [String!]
    course_code_not_starts_with?: string | null; // String
    course_code_starts_with?: string | null; // String
    created_at?: any | null; // DateTime
    created_at_gt?: any | null; // DateTime
    created_at_gte?: any | null; // DateTime
    created_at_in?: any[] | null; // [DateTime!]
    created_at_lt?: any | null; // DateTime
    created_at_lte?: any | null; // DateTime
    created_at_not?: any | null; // DateTime
    created_at_not_in?: any[] | null; // [DateTime!]
    id?: any | null; // UUID
    id_contains?: any | null; // UUID
    id_ends_with?: any | null; // UUID
    id_gt?: any | null; // UUID
    id_gte?: any | null; // UUID
    id_in?: any[] | null; // [UUID!]
    id_lt?: any | null; // UUID
    id_lte?: any | null; // UUID
    id_not?: any | null; // UUID
    id_not_contains?: any | null; // UUID
    id_not_ends_with?: any | null; // UUID
    id_not_in?: any[] | null; // [UUID!]
    id_not_starts_with?: any | null; // UUID
    id_starts_with?: any | null; // UUID
    NOT?: NexusGenInputs['OpenUniversityCourseWhereInput'][] | null; // [OpenUniversityCourseWhereInput!]
    OR?: NexusGenInputs['OpenUniversityCourseWhereInput'][] | null; // [OpenUniversityCourseWhereInput!]
    updated_at?: any | null; // DateTime
    updated_at_gt?: any | null; // DateTime
    updated_at_gte?: any | null; // DateTime
    updated_at_in?: any[] | null; // [DateTime!]
    updated_at_lt?: any | null; // DateTime
    updated_at_lte?: any | null; // DateTime
    updated_at_not?: any | null; // DateTime
    updated_at_not_in?: any[] | null; // [DateTime!]
  }
  UserWhereInput: { // input type
    administrator?: boolean | null; // Boolean
    administrator_not?: boolean | null; // Boolean
    AND?: NexusGenInputs['UserWhereInput'][] | null; // [UserWhereInput!]
    completions_every?: NexusGenInputs['CompletionWhereInput'] | null; // CompletionWhereInput
    completions_none?: NexusGenInputs['CompletionWhereInput'] | null; // CompletionWhereInput
    completions_some?: NexusGenInputs['CompletionWhereInput'] | null; // CompletionWhereInput
    created_at?: any | null; // DateTime
    created_at_gt?: any | null; // DateTime
    created_at_gte?: any | null; // DateTime
    created_at_in?: any[] | null; // [DateTime!]
    created_at_lt?: any | null; // DateTime
    created_at_lte?: any | null; // DateTime
    created_at_not?: any | null; // DateTime
    created_at_not_in?: any[] | null; // [DateTime!]
    email?: string | null; // String
    email_contains?: string | null; // String
    email_ends_with?: string | null; // String
    email_gt?: string | null; // String
    email_gte?: string | null; // String
    email_in?: string[] | null; // [String!]
    email_lt?: string | null; // String
    email_lte?: string | null; // String
    email_not?: string | null; // String
    email_not_contains?: string | null; // String
    email_not_ends_with?: string | null; // String
    email_not_in?: string[] | null; // [String!]
    email_not_starts_with?: string | null; // String
    email_starts_with?: string | null; // String
    first_name?: string | null; // String
    first_name_contains?: string | null; // String
    first_name_ends_with?: string | null; // String
    first_name_gt?: string | null; // String
    first_name_gte?: string | null; // String
    first_name_in?: string[] | null; // [String!]
    first_name_lt?: string | null; // String
    first_name_lte?: string | null; // String
    first_name_not?: string | null; // String
    first_name_not_contains?: string | null; // String
    first_name_not_ends_with?: string | null; // String
    first_name_not_in?: string[] | null; // [String!]
    first_name_not_starts_with?: string | null; // String
    first_name_starts_with?: string | null; // String
    id?: any | null; // UUID
    id_contains?: any | null; // UUID
    id_ends_with?: any | null; // UUID
    id_gt?: any | null; // UUID
    id_gte?: any | null; // UUID
    id_in?: any[] | null; // [UUID!]
    id_lt?: any | null; // UUID
    id_lte?: any | null; // UUID
    id_not?: any | null; // UUID
    id_not_contains?: any | null; // UUID
    id_not_ends_with?: any | null; // UUID
    id_not_in?: any[] | null; // [UUID!]
    id_not_starts_with?: any | null; // UUID
    id_starts_with?: any | null; // UUID
    last_name?: string | null; // String
    last_name_contains?: string | null; // String
    last_name_ends_with?: string | null; // String
    last_name_gt?: string | null; // String
    last_name_gte?: string | null; // String
    last_name_in?: string[] | null; // [String!]
    last_name_lt?: string | null; // String
    last_name_lte?: string | null; // String
    last_name_not?: string | null; // String
    last_name_not_contains?: string | null; // String
    last_name_not_ends_with?: string | null; // String
    last_name_not_in?: string[] | null; // [String!]
    last_name_not_starts_with?: string | null; // String
    last_name_starts_with?: string | null; // String
    NOT?: NexusGenInputs['UserWhereInput'][] | null; // [UserWhereInput!]
    OR?: NexusGenInputs['UserWhereInput'][] | null; // [UserWhereInput!]
    real_student_number?: string | null; // String
    real_student_number_contains?: string | null; // String
    real_student_number_ends_with?: string | null; // String
    real_student_number_gt?: string | null; // String
    real_student_number_gte?: string | null; // String
    real_student_number_in?: string[] | null; // [String!]
    real_student_number_lt?: string | null; // String
    real_student_number_lte?: string | null; // String
    real_student_number_not?: string | null; // String
    real_student_number_not_contains?: string | null; // String
    real_student_number_not_ends_with?: string | null; // String
    real_student_number_not_in?: string[] | null; // [String!]
    real_student_number_not_starts_with?: string | null; // String
    real_student_number_starts_with?: string | null; // String
    registered_completions_every?: NexusGenInputs['CompletionRegisteredWhereInput'] | null; // CompletionRegisteredWhereInput
    registered_completions_none?: NexusGenInputs['CompletionRegisteredWhereInput'] | null; // CompletionRegisteredWhereInput
    registered_completions_some?: NexusGenInputs['CompletionRegisteredWhereInput'] | null; // CompletionRegisteredWhereInput
    student_number?: string | null; // String
    student_number_contains?: string | null; // String
    student_number_ends_with?: string | null; // String
    student_number_gt?: string | null; // String
    student_number_gte?: string | null; // String
    student_number_in?: string[] | null; // [String!]
    student_number_lt?: string | null; // String
    student_number_lte?: string | null; // String
    student_number_not?: string | null; // String
    student_number_not_contains?: string | null; // String
    student_number_not_ends_with?: string | null; // String
    student_number_not_in?: string[] | null; // [String!]
    student_number_not_starts_with?: string | null; // String
    student_number_starts_with?: string | null; // String
    updated_at?: any | null; // DateTime
    updated_at_gt?: any | null; // DateTime
    updated_at_gte?: any | null; // DateTime
    updated_at_in?: any[] | null; // [DateTime!]
    updated_at_lt?: any | null; // DateTime
    updated_at_lte?: any | null; // DateTime
    updated_at_not?: any | null; // DateTime
    updated_at_not_in?: any[] | null; // [DateTime!]
    upstream_id?: number | null; // Int
    upstream_id_gt?: number | null; // Int
    upstream_id_gte?: number | null; // Int
    upstream_id_in?: number[] | null; // [Int!]
    upstream_id_lt?: number | null; // Int
    upstream_id_lte?: number | null; // Int
    upstream_id_not?: number | null; // Int
    upstream_id_not_in?: number[] | null; // [Int!]
    username?: string | null; // String
    username_contains?: string | null; // String
    username_ends_with?: string | null; // String
    username_gt?: string | null; // String
    username_gte?: string | null; // String
    username_in?: string[] | null; // [String!]
    username_lt?: string | null; // String
    username_lte?: string | null; // String
    username_not?: string | null; // String
    username_not_contains?: string | null; // String
    username_not_ends_with?: string | null; // String
    username_not_in?: string[] | null; // [String!]
    username_not_starts_with?: string | null; // String
    username_starts_with?: string | null; // String
  }
}

export interface NexusGenEnums {
  CompletionOrderByInput: "completion_language_ASC" | "completion_language_DESC" | "created_at_ASC" | "created_at_DESC" | "createdAt_ASC" | "createdAt_DESC" | "email_ASC" | "email_DESC" | "id_ASC" | "id_DESC" | "student_number_ASC" | "student_number_DESC" | "updated_at_ASC" | "updated_at_DESC" | "updatedAt_ASC" | "updatedAt_DESC" | "user_upstream_id_ASC" | "user_upstream_id_DESC"
  CompletionRegisteredOrderByInput: "created_at_ASC" | "created_at_DESC" | "createdAt_ASC" | "createdAt_DESC" | "id_ASC" | "id_DESC" | "organisation_ASC" | "organisation_DESC" | "real_student_number_ASC" | "real_student_number_DESC" | "updated_at_ASC" | "updated_at_DESC" | "updatedAt_ASC" | "updatedAt_DESC"
  OpenUniversityCourseOrderByInput: "course_code_ASC" | "course_code_DESC" | "created_at_ASC" | "created_at_DESC" | "createdAt_ASC" | "createdAt_DESC" | "id_ASC" | "id_DESC" | "updated_at_ASC" | "updated_at_DESC" | "updatedAt_ASC" | "updatedAt_DESC"
}

export interface NexusGenRootTypes {
  Completion: { // root type
    completion_language?: string | null; // String
    created_at?: any | null; // DateTime
    email: string; // String!
    id: any; // UUID!
    student_number?: string | null; // String
    updated_at?: any | null; // DateTime
    user_upstream_id?: number | null; // Int
  }
  CompletionRegistered: { // root type
    created_at?: any | null; // DateTime
    id: any; // UUID!
    organisation: string; // String!
    real_student_number: string; // String!
    updated_at?: any | null; // DateTime
  }
  Course: { // root type
    created_at?: any | null; // DateTime
    id: any; // UUID!
    name: string; // String!
    slug: string; // String!
    updated_at?: any | null; // DateTime
  }
  Mutation: {};
  OpenUniversityCourse: { // root type
    course_code: string; // String!
    created_at?: any | null; // DateTime
    id: any; // UUID!
    updated_at?: any | null; // DateTime
  }
  Query: {};
  User: { // root type
    administrator: boolean; // Boolean!
    created_at?: any | null; // DateTime
    email: string; // String!
    first_name?: string | null; // String
    id: any; // UUID!
    last_name?: string | null; // String
    real_student_number?: string | null; // String
    student_number?: string | null; // String
    updated_at?: any | null; // DateTime
    upstream_id: number; // Int!
    username: string; // String!
  }
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  DateTime: any;
  UUID: any;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  CompletionArg: NexusGenInputs['CompletionArg'];
  CompletionRegisteredWhereInput: NexusGenInputs['CompletionRegisteredWhereInput'];
  CompletionWhereInput: NexusGenInputs['CompletionWhereInput'];
  CourseWhereInput: NexusGenInputs['CourseWhereInput'];
  OpenUniversityCourseWhereInput: NexusGenInputs['OpenUniversityCourseWhereInput'];
  UserWhereInput: NexusGenInputs['UserWhereInput'];
  CompletionOrderByInput: NexusGenEnums['CompletionOrderByInput'];
  CompletionRegisteredOrderByInput: NexusGenEnums['CompletionRegisteredOrderByInput'];
  OpenUniversityCourseOrderByInput: NexusGenEnums['OpenUniversityCourseOrderByInput'];
}

export interface NexusGenFieldTypes {
  Completion: { // field return type
    completion_language: string | null; // String
    course: NexusGenRootTypes['Course']; // Course!
    created_at: any | null; // DateTime
    email: string; // String!
    id: any; // UUID!
    student_number: string | null; // String
    updated_at: any | null; // DateTime
    user: NexusGenRootTypes['User']; // User!
    user_upstream_id: number | null; // Int
  }
  CompletionRegistered: { // field return type
    completion: NexusGenRootTypes['Completion']; // Completion!
    course: NexusGenRootTypes['Course']; // Course!
    created_at: any | null; // DateTime
    id: any; // UUID!
    organisation: string; // String!
    real_student_number: string; // String!
    updated_at: any | null; // DateTime
    user: NexusGenRootTypes['User']; // User!
  }
  Course: { // field return type
    created_at: any | null; // DateTime
    id: any; // UUID!
    name: string; // String!
    open_university_courses: NexusGenRootTypes['OpenUniversityCourse'][] | null; // [OpenUniversityCourse!]
    slug: string; // String!
    updated_at: any | null; // DateTime
  }
  Mutation: { // field return type
    addCourse: NexusGenRootTypes['Course']; // Course!
    addOpenUniversityCourse: NexusGenRootTypes['OpenUniversityCourse']; // OpenUniversityCourse!
    registerCompletion: NexusGenRootTypes['CompletionRegistered'][]; // [CompletionRegistered!]!
  }
  OpenUniversityCourse: { // field return type
    course: NexusGenRootTypes['Course']; // Course!
    course_code: string; // String!
    created_at: any | null; // DateTime
    id: any; // UUID!
    updated_at: any | null; // DateTime
  }
  Query: { // field return type
    completions: NexusGenRootTypes['Completion'][]; // [Completion!]!
    courses: NexusGenRootTypes['Course'][]; // [Course!]!
    currentUser: NexusGenRootTypes['User']; // User!
    openUniversityCourses: NexusGenRootTypes['OpenUniversityCourse'][]; // [OpenUniversityCourse!]!
    registeredCompletions: NexusGenRootTypes['CompletionRegistered'][]; // [CompletionRegistered!]!
    users: NexusGenRootTypes['User'][]; // [User!]!
  }
  User: { // field return type
    administrator: boolean; // Boolean!
    completions: NexusGenRootTypes['Completion'][] | null; // [Completion!]
    created_at: any | null; // DateTime
    email: string; // String!
    first_name: string | null; // String
    id: any; // UUID!
    last_name: string | null; // String
    real_student_number: string | null; // String
    registered_completions: NexusGenRootTypes['CompletionRegistered'][] | null; // [CompletionRegistered!]
    student_number: string | null; // String
    updated_at: any | null; // DateTime
    upstream_id: number; // Int!
    username: string; // String!
  }
}

export interface NexusGenArgTypes {
  Course: {
    open_university_courses: { // args
      after?: string | null; // String
      before?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
      orderBy?: NexusGenEnums['OpenUniversityCourseOrderByInput'] | null; // OpenUniversityCourseOrderByInput
      skip?: number | null; // Int
      where?: NexusGenInputs['OpenUniversityCourseWhereInput'] | null; // OpenUniversityCourseWhereInput
    }
  }
  Mutation: {
    addCourse: { // args
      name?: string | null; // String
      slug?: string | null; // String
    }
    addOpenUniversityCourse: { // args
      course?: string | null; // ID
      course_code?: string | null; // String
    }
    registerCompletion: { // args
      completions?: NexusGenInputs['CompletionArg'][] | null; // [CompletionArg!]
      organisation?: string | null; // String
    }
  }
  Query: {
    completions: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      course?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
    }
    currentUser: { // args
      email?: string | null; // String
    }
    registeredCompletions: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      course?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
    }
  }
  User: {
    completions: { // args
      after?: string | null; // String
      before?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
      orderBy?: NexusGenEnums['CompletionOrderByInput'] | null; // CompletionOrderByInput
      skip?: number | null; // Int
      where?: NexusGenInputs['CompletionWhereInput'] | null; // CompletionWhereInput
    }
    registered_completions: { // args
      after?: string | null; // String
      before?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
      orderBy?: NexusGenEnums['CompletionRegisteredOrderByInput'] | null; // CompletionRegisteredOrderByInput
      skip?: number | null; // Int
      where?: NexusGenInputs['CompletionRegisteredWhereInput'] | null; // CompletionRegisteredWhereInput
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "Completion" | "CompletionRegistered" | "Course" | "Mutation" | "OpenUniversityCourse" | "Query" | "User";

export type NexusGenInputNames = "CompletionArg" | "CompletionRegisteredWhereInput" | "CompletionWhereInput" | "CourseWhereInput" | "OpenUniversityCourseWhereInput" | "UserWhereInput";

export type NexusGenEnumNames = "CompletionOrderByInput" | "CompletionRegisteredOrderByInput" | "OpenUniversityCourseOrderByInput";

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "DateTime" | "Float" | "ID" | "Int" | "String" | "UUID";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: ctx.Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}