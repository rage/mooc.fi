import * as Typegen from 'nexus-plugin-prisma/typegen'
import * as Prisma from '@prisma/client';

// Pagination type
type Pagination = {
  take?: boolean
  skip?: boolean
  cursor?: boolean
}

// Prisma custom scalar names
type CustomScalars = 'DateTime' | 'Json'

// Prisma model type definitions
interface PrismaModels {
  Completion: Prisma.Completion
  CompletionRegistered: Prisma.CompletionRegistered
  Course: Prisma.Course
  CourseAlias: Prisma.CourseAlias
  CourseOrganization: Prisma.CourseOrganization
  CourseTranslation: Prisma.CourseTranslation
  CourseVariant: Prisma.CourseVariant
  EmailDelivery: Prisma.EmailDelivery
  EmailTemplate: Prisma.EmailTemplate
  Exercise: Prisma.Exercise
  ExerciseCompletion: Prisma.ExerciseCompletion
  ExerciseCompletionRequiredAction: Prisma.ExerciseCompletionRequiredAction
  Image: Prisma.Image
  OpenUniversityRegistrationLink: Prisma.OpenUniversityRegistrationLink
  Organization: Prisma.Organization
  OrganizationTranslation: Prisma.OrganizationTranslation
  Service: Prisma.Service
  StudyModule: Prisma.StudyModule
  StudyModuleTranslation: Prisma.StudyModuleTranslation
  User: Prisma.User
  UserAppDatumConfig: Prisma.UserAppDatumConfig
  UserCourseProgress: Prisma.UserCourseProgress
  UserCourseServiceProgress: Prisma.UserCourseServiceProgress
  UserCourseSetting: Prisma.UserCourseSetting
  UserCourseSettingsVisibility: Prisma.UserCourseSettingsVisibility
  UserOrganization: Prisma.UserOrganization
  VerifiedUser: Prisma.VerifiedUser
}

// Prisma input types metadata
interface NexusPrismaInputs {
  Query: {
    completions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'certificate_id' | 'completion_language' | 'course_id' | 'created_at' | 'eligible_for_ects' | 'email' | 'grade' | 'id' | 'student_number' | 'updated_at' | 'user_id' | 'user_upstream_id' | 'course' | 'user' | 'completions_registered' | 'completion_date'
      ordering: 'certificate_id' | 'completion_language' | 'course_id' | 'created_at' | 'eligible_for_ects' | 'email' | 'grade' | 'id' | 'student_number' | 'updated_at' | 'user_id' | 'user_upstream_id' | 'completion_date'
    }
    completionRegistereds: {
      filtering: 'AND' | 'OR' | 'NOT' | 'completion_id' | 'course_id' | 'created_at' | 'id' | 'organization_id' | 'real_student_number' | 'updated_at' | 'user_id' | 'completion' | 'course' | 'organization' | 'user'
      ordering: 'completion_id' | 'course_id' | 'created_at' | 'id' | 'organization_id' | 'real_student_number' | 'updated_at' | 'user_id'
    }
    courses: {
      filtering: 'AND' | 'OR' | 'NOT' | 'automatic_completions' | 'automatic_completions_eligible_for_ects' | 'completion_email_id' | 'completions_handled_by_id' | 'created_at' | 'ects' | 'end_date' | 'exercise_completions_needed' | 'has_certificate' | 'hidden' | 'id' | 'inherit_settings_from_id' | 'name' | 'order' | 'owner_organization_id' | 'photo_id' | 'points_needed' | 'promote' | 'slug' | 'start_date' | 'start_point' | 'status' | 'study_module_order' | 'study_module_start_point' | 'support_email' | 'teacher_in_charge_email' | 'teacher_in_charge_name' | 'updated_at' | 'completion_email' | 'completions_handled_by' | 'inherit_settings_from' | 'owner_organization' | 'photo' | 'completions' | 'completions_registered' | 'handles_completions_for' | 'other_course_courseTocourse_inherit_settings_from' | 'course_aliases' | 'course_organizations' | 'course_translations' | 'course_variants' | 'exercises' | 'open_university_registration_links' | 'user_course_progresses' | 'user_course_service_progresses' | 'user_course_settings' | 'user_course_settings_visibilities' | 'services' | 'study_modules' | 'upcoming_active_link' | 'tier'
      ordering: 'automatic_completions' | 'automatic_completions_eligible_for_ects' | 'completion_email_id' | 'completions_handled_by_id' | 'created_at' | 'ects' | 'end_date' | 'exercise_completions_needed' | 'has_certificate' | 'hidden' | 'id' | 'inherit_settings_from_id' | 'name' | 'order' | 'owner_organization_id' | 'photo_id' | 'points_needed' | 'promote' | 'slug' | 'start_date' | 'start_point' | 'status' | 'study_module_order' | 'study_module_start_point' | 'support_email' | 'teacher_in_charge_email' | 'teacher_in_charge_name' | 'updated_at' | 'upcoming_active_link' | 'tier'
    }
    courseAliases: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'course_code' | 'created_at' | 'id' | 'updated_at' | 'course'
      ordering: 'course_id' | 'course_code' | 'created_at' | 'id' | 'updated_at'
    }
    courseOrganizations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'creator' | 'id' | 'organization_id' | 'updated_at' | 'course' | 'organization'
      ordering: 'course_id' | 'created_at' | 'creator' | 'id' | 'organization_id' | 'updated_at'
    }
    courseTranslations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'description' | 'id' | 'language' | 'link' | 'name' | 'updated_at' | 'course'
      ordering: 'course_id' | 'created_at' | 'description' | 'id' | 'language' | 'link' | 'name' | 'updated_at'
    }
    courseVariants: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'description' | 'id' | 'slug' | 'updated_at' | 'course'
      ordering: 'course_id' | 'created_at' | 'description' | 'id' | 'slug' | 'updated_at'
    }
    emailDeliveries: {
      filtering: 'AND' | 'OR' | 'NOT' | 'created_at' | 'email_template_id' | 'error' | 'error_message' | 'id' | 'sent' | 'updated_at' | 'user_id' | 'email_template' | 'user'
      ordering: 'created_at' | 'email_template_id' | 'error' | 'error_message' | 'id' | 'sent' | 'updated_at' | 'user_id'
    }
    emailTemplates: {
      filtering: 'AND' | 'OR' | 'NOT' | 'created_at' | 'html_body' | 'id' | 'name' | 'title' | 'txt_body' | 'updated_at' | 'courses' | 'email_deliveries'
      ordering: 'created_at' | 'html_body' | 'id' | 'name' | 'title' | 'txt_body' | 'updated_at'
    }
    exercises: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'custom_id' | 'deleted' | 'id' | 'max_points' | 'name' | 'part' | 'section' | 'service_id' | 'timestamp' | 'updated_at' | 'course' | 'service' | 'exercise_completions'
      ordering: 'course_id' | 'created_at' | 'custom_id' | 'deleted' | 'id' | 'max_points' | 'name' | 'part' | 'section' | 'service_id' | 'timestamp' | 'updated_at'
    }
    exerciseCompletions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'completed' | 'created_at' | 'exercise_id' | 'id' | 'n_points' | 'timestamp' | 'updated_at' | 'user_id' | 'exercise' | 'user' | 'exercise_completion_required_actions' | 'attempted'
      ordering: 'completed' | 'created_at' | 'exercise_id' | 'id' | 'n_points' | 'timestamp' | 'updated_at' | 'user_id' | 'attempted'
    }
    exerciseCompletionRequiredActions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'exercise_completion_id' | 'id' | 'value' | 'exercise_completion'
      ordering: 'exercise_completion_id' | 'id' | 'value'
    }
    images: {
      filtering: 'AND' | 'OR' | 'NOT' | 'compressed' | 'compressed_mimetype' | 'created_at' | 'default' | 'encoding' | 'id' | 'name' | 'original' | 'original_mimetype' | 'uncompressed' | 'uncompressed_mimetype' | 'updated_at' | 'courses'
      ordering: 'compressed' | 'compressed_mimetype' | 'created_at' | 'default' | 'encoding' | 'id' | 'name' | 'original' | 'original_mimetype' | 'uncompressed' | 'uncompressed_mimetype' | 'updated_at'
    }
    openUniversityRegistrationLinks: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'course_code' | 'created_at' | 'id' | 'language' | 'link' | 'start_date' | 'stop_date' | 'updated_at' | 'course'
      ordering: 'course_id' | 'course_code' | 'created_at' | 'id' | 'language' | 'link' | 'start_date' | 'stop_date' | 'updated_at'
    }
    organizations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'contact_information' | 'created_at' | 'creator_id' | 'disabled' | 'email' | 'hidden' | 'id' | 'logo_content_type' | 'logo_file_name' | 'logo_file_size' | 'logo_updated_at' | 'phone' | 'pinned' | 'secret_key' | 'slug' | 'tmc_created_at' | 'tmc_updated_at' | 'updated_at' | 'verified' | 'verified_at' | 'website' | 'creator' | 'completions_registered' | 'courses' | 'course_organizations' | 'organization_translations' | 'user_organizations' | 'verified_users'
      ordering: 'contact_information' | 'created_at' | 'creator_id' | 'disabled' | 'email' | 'hidden' | 'id' | 'logo_content_type' | 'logo_file_name' | 'logo_file_size' | 'logo_updated_at' | 'phone' | 'pinned' | 'secret_key' | 'slug' | 'tmc_created_at' | 'tmc_updated_at' | 'updated_at' | 'verified' | 'verified_at' | 'website'
    }
    organizationTranslations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'created_at' | 'disabled_reason' | 'id' | 'information' | 'language' | 'name' | 'organization_id' | 'updated_at' | 'organization'
      ordering: 'created_at' | 'disabled_reason' | 'id' | 'information' | 'language' | 'name' | 'organization_id' | 'updated_at'
    }
    services: {
      filtering: 'AND' | 'OR' | 'NOT' | 'created_at' | 'id' | 'name' | 'updated_at' | 'url' | 'exercises' | 'user_course_service_progresses' | 'courses'
      ordering: 'created_at' | 'id' | 'name' | 'updated_at' | 'url'
    }
    studyModules: {
      filtering: 'AND' | 'OR' | 'NOT' | 'created_at' | 'id' | 'image' | 'name' | 'order' | 'slug' | 'updated_at' | 'study_module_translations' | 'courses'
      ordering: 'created_at' | 'id' | 'image' | 'name' | 'order' | 'slug' | 'updated_at'
    }
    studyModuleTranslations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'created_at' | 'description' | 'id' | 'language' | 'name' | 'study_module_id' | 'updated_at' | 'study_module'
      ordering: 'created_at' | 'description' | 'id' | 'language' | 'name' | 'study_module_id' | 'updated_at'
    }
    users: {
      filtering: 'AND' | 'OR' | 'NOT' | 'administrator' | 'created_at' | 'email' | 'first_name' | 'id' | 'last_name' | 'real_student_number' | 'research_consent' | 'student_number' | 'updated_at' | 'upstream_id' | 'username' | 'completions' | 'completions_registered' | 'email_deliveries' | 'exercise_completions' | 'organizations' | 'user_course_progresses' | 'user_course_service_progresses' | 'user_course_settings' | 'user_organizations' | 'verified_users'
      ordering: 'administrator' | 'created_at' | 'email' | 'first_name' | 'id' | 'last_name' | 'real_student_number' | 'research_consent' | 'student_number' | 'updated_at' | 'upstream_id' | 'username'
    }
    userAppDatumConfigs: {
      filtering: 'AND' | 'OR' | 'NOT' | 'created_at' | 'id' | 'name' | 'timestamp' | 'updated_at'
      ordering: 'created_at' | 'id' | 'name' | 'timestamp' | 'updated_at'
    }
    userCourseProgresses: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'id' | 'max_points' | 'n_points' | 'progress' | 'extra' | 'updated_at' | 'user_id' | 'course' | 'user' | 'user_course_service_progresses'
      ordering: 'course_id' | 'created_at' | 'id' | 'max_points' | 'n_points' | 'progress' | 'extra' | 'updated_at' | 'user_id'
    }
    userCourseServiceProgresses: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'id' | 'progress' | 'service_id' | 'timestamp' | 'updated_at' | 'user_id' | 'user_course_progress_id' | 'course' | 'service' | 'user' | 'user_course_progress'
      ordering: 'course_id' | 'created_at' | 'id' | 'progress' | 'service_id' | 'timestamp' | 'updated_at' | 'user_id' | 'user_course_progress_id'
    }
    userCourseSettings: {
      filtering: 'AND' | 'OR' | 'NOT' | 'country' | 'course_id' | 'course_variant' | 'created_at' | 'id' | 'language' | 'marketing' | 'other' | 'research' | 'updated_at' | 'user_id' | 'course' | 'user'
      ordering: 'country' | 'course_id' | 'course_variant' | 'created_at' | 'id' | 'language' | 'marketing' | 'other' | 'research' | 'updated_at' | 'user_id'
    }
    userCourseSettingsVisibilities: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'id' | 'language' | 'updated_at' | 'course'
      ordering: 'course_id' | 'created_at' | 'id' | 'language' | 'updated_at'
    }
    userOrganizations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'created_at' | 'id' | 'organization_id' | 'role' | 'updated_at' | 'user_id' | 'organization' | 'user'
      ordering: 'created_at' | 'id' | 'organization_id' | 'role' | 'updated_at' | 'user_id'
    }
    verifiedUsers: {
      filtering: 'AND' | 'OR' | 'NOT' | 'created_at' | 'display_name' | 'id' | 'organization_id' | 'personal_unique_code' | 'updated_at' | 'user_id' | 'organization' | 'user'
      ordering: 'created_at' | 'display_name' | 'id' | 'organization_id' | 'personal_unique_code' | 'updated_at' | 'user_id'
    }
  },
  Completion: {
    completions_registered: {
      filtering: 'AND' | 'OR' | 'NOT' | 'completion_id' | 'course_id' | 'created_at' | 'id' | 'organization_id' | 'real_student_number' | 'updated_at' | 'user_id' | 'completion' | 'course' | 'organization' | 'user'
      ordering: 'completion_id' | 'course_id' | 'created_at' | 'id' | 'organization_id' | 'real_student_number' | 'updated_at' | 'user_id'
    }
  }
  CompletionRegistered: {

  }
  Course: {
    completions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'certificate_id' | 'completion_language' | 'course_id' | 'created_at' | 'eligible_for_ects' | 'email' | 'grade' | 'id' | 'student_number' | 'updated_at' | 'user_id' | 'user_upstream_id' | 'course' | 'user' | 'completions_registered' | 'completion_date'
      ordering: 'certificate_id' | 'completion_language' | 'course_id' | 'created_at' | 'eligible_for_ects' | 'email' | 'grade' | 'id' | 'student_number' | 'updated_at' | 'user_id' | 'user_upstream_id' | 'completion_date'
    }
    completions_registered: {
      filtering: 'AND' | 'OR' | 'NOT' | 'completion_id' | 'course_id' | 'created_at' | 'id' | 'organization_id' | 'real_student_number' | 'updated_at' | 'user_id' | 'completion' | 'course' | 'organization' | 'user'
      ordering: 'completion_id' | 'course_id' | 'created_at' | 'id' | 'organization_id' | 'real_student_number' | 'updated_at' | 'user_id'
    }
    handles_completions_for: {
      filtering: 'AND' | 'OR' | 'NOT' | 'automatic_completions' | 'automatic_completions_eligible_for_ects' | 'completion_email_id' | 'completions_handled_by_id' | 'created_at' | 'ects' | 'end_date' | 'exercise_completions_needed' | 'has_certificate' | 'hidden' | 'id' | 'inherit_settings_from_id' | 'name' | 'order' | 'owner_organization_id' | 'photo_id' | 'points_needed' | 'promote' | 'slug' | 'start_date' | 'start_point' | 'status' | 'study_module_order' | 'study_module_start_point' | 'support_email' | 'teacher_in_charge_email' | 'teacher_in_charge_name' | 'updated_at' | 'completion_email' | 'completions_handled_by' | 'inherit_settings_from' | 'owner_organization' | 'photo' | 'completions' | 'completions_registered' | 'handles_completions_for' | 'other_course_courseTocourse_inherit_settings_from' | 'course_aliases' | 'course_organizations' | 'course_translations' | 'course_variants' | 'exercises' | 'open_university_registration_links' | 'user_course_progresses' | 'user_course_service_progresses' | 'user_course_settings' | 'user_course_settings_visibilities' | 'services' | 'study_modules' | 'upcoming_active_link' | 'tier'
      ordering: 'automatic_completions' | 'automatic_completions_eligible_for_ects' | 'completion_email_id' | 'completions_handled_by_id' | 'created_at' | 'ects' | 'end_date' | 'exercise_completions_needed' | 'has_certificate' | 'hidden' | 'id' | 'inherit_settings_from_id' | 'name' | 'order' | 'owner_organization_id' | 'photo_id' | 'points_needed' | 'promote' | 'slug' | 'start_date' | 'start_point' | 'status' | 'study_module_order' | 'study_module_start_point' | 'support_email' | 'teacher_in_charge_email' | 'teacher_in_charge_name' | 'updated_at' | 'upcoming_active_link' | 'tier'
    }
    other_course_courseTocourse_inherit_settings_from: {
      filtering: 'AND' | 'OR' | 'NOT' | 'automatic_completions' | 'automatic_completions_eligible_for_ects' | 'completion_email_id' | 'completions_handled_by_id' | 'created_at' | 'ects' | 'end_date' | 'exercise_completions_needed' | 'has_certificate' | 'hidden' | 'id' | 'inherit_settings_from_id' | 'name' | 'order' | 'owner_organization_id' | 'photo_id' | 'points_needed' | 'promote' | 'slug' | 'start_date' | 'start_point' | 'status' | 'study_module_order' | 'study_module_start_point' | 'support_email' | 'teacher_in_charge_email' | 'teacher_in_charge_name' | 'updated_at' | 'completion_email' | 'completions_handled_by' | 'inherit_settings_from' | 'owner_organization' | 'photo' | 'completions' | 'completions_registered' | 'handles_completions_for' | 'other_course_courseTocourse_inherit_settings_from' | 'course_aliases' | 'course_organizations' | 'course_translations' | 'course_variants' | 'exercises' | 'open_university_registration_links' | 'user_course_progresses' | 'user_course_service_progresses' | 'user_course_settings' | 'user_course_settings_visibilities' | 'services' | 'study_modules' | 'upcoming_active_link' | 'tier'
      ordering: 'automatic_completions' | 'automatic_completions_eligible_for_ects' | 'completion_email_id' | 'completions_handled_by_id' | 'created_at' | 'ects' | 'end_date' | 'exercise_completions_needed' | 'has_certificate' | 'hidden' | 'id' | 'inherit_settings_from_id' | 'name' | 'order' | 'owner_organization_id' | 'photo_id' | 'points_needed' | 'promote' | 'slug' | 'start_date' | 'start_point' | 'status' | 'study_module_order' | 'study_module_start_point' | 'support_email' | 'teacher_in_charge_email' | 'teacher_in_charge_name' | 'updated_at' | 'upcoming_active_link' | 'tier'
    }
    course_aliases: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'course_code' | 'created_at' | 'id' | 'updated_at' | 'course'
      ordering: 'course_id' | 'course_code' | 'created_at' | 'id' | 'updated_at'
    }
    course_organizations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'creator' | 'id' | 'organization_id' | 'updated_at' | 'course' | 'organization'
      ordering: 'course_id' | 'created_at' | 'creator' | 'id' | 'organization_id' | 'updated_at'
    }
    course_translations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'description' | 'id' | 'language' | 'link' | 'name' | 'updated_at' | 'course'
      ordering: 'course_id' | 'created_at' | 'description' | 'id' | 'language' | 'link' | 'name' | 'updated_at'
    }
    course_variants: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'description' | 'id' | 'slug' | 'updated_at' | 'course'
      ordering: 'course_id' | 'created_at' | 'description' | 'id' | 'slug' | 'updated_at'
    }
    exercises: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'custom_id' | 'deleted' | 'id' | 'max_points' | 'name' | 'part' | 'section' | 'service_id' | 'timestamp' | 'updated_at' | 'course' | 'service' | 'exercise_completions'
      ordering: 'course_id' | 'created_at' | 'custom_id' | 'deleted' | 'id' | 'max_points' | 'name' | 'part' | 'section' | 'service_id' | 'timestamp' | 'updated_at'
    }
    open_university_registration_links: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'course_code' | 'created_at' | 'id' | 'language' | 'link' | 'start_date' | 'stop_date' | 'updated_at' | 'course'
      ordering: 'course_id' | 'course_code' | 'created_at' | 'id' | 'language' | 'link' | 'start_date' | 'stop_date' | 'updated_at'
    }
    user_course_progresses: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'id' | 'max_points' | 'n_points' | 'progress' | 'extra' | 'updated_at' | 'user_id' | 'course' | 'user' | 'user_course_service_progresses'
      ordering: 'course_id' | 'created_at' | 'id' | 'max_points' | 'n_points' | 'progress' | 'extra' | 'updated_at' | 'user_id'
    }
    user_course_service_progresses: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'id' | 'progress' | 'service_id' | 'timestamp' | 'updated_at' | 'user_id' | 'user_course_progress_id' | 'course' | 'service' | 'user' | 'user_course_progress'
      ordering: 'course_id' | 'created_at' | 'id' | 'progress' | 'service_id' | 'timestamp' | 'updated_at' | 'user_id' | 'user_course_progress_id'
    }
    user_course_settings: {
      filtering: 'AND' | 'OR' | 'NOT' | 'country' | 'course_id' | 'course_variant' | 'created_at' | 'id' | 'language' | 'marketing' | 'other' | 'research' | 'updated_at' | 'user_id' | 'course' | 'user'
      ordering: 'country' | 'course_id' | 'course_variant' | 'created_at' | 'id' | 'language' | 'marketing' | 'other' | 'research' | 'updated_at' | 'user_id'
    }
    user_course_settings_visibilities: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'id' | 'language' | 'updated_at' | 'course'
      ordering: 'course_id' | 'created_at' | 'id' | 'language' | 'updated_at'
    }
    services: {
      filtering: 'AND' | 'OR' | 'NOT' | 'created_at' | 'id' | 'name' | 'updated_at' | 'url' | 'exercises' | 'user_course_service_progresses' | 'courses'
      ordering: 'created_at' | 'id' | 'name' | 'updated_at' | 'url'
    }
    study_modules: {
      filtering: 'AND' | 'OR' | 'NOT' | 'created_at' | 'id' | 'image' | 'name' | 'order' | 'slug' | 'updated_at' | 'study_module_translations' | 'courses'
      ordering: 'created_at' | 'id' | 'image' | 'name' | 'order' | 'slug' | 'updated_at'
    }
  }
  CourseAlias: {

  }
  CourseOrganization: {

  }
  CourseTranslation: {

  }
  CourseVariant: {

  }
  EmailDelivery: {

  }
  EmailTemplate: {
    courses: {
      filtering: 'AND' | 'OR' | 'NOT' | 'automatic_completions' | 'automatic_completions_eligible_for_ects' | 'completion_email_id' | 'completions_handled_by_id' | 'created_at' | 'ects' | 'end_date' | 'exercise_completions_needed' | 'has_certificate' | 'hidden' | 'id' | 'inherit_settings_from_id' | 'name' | 'order' | 'owner_organization_id' | 'photo_id' | 'points_needed' | 'promote' | 'slug' | 'start_date' | 'start_point' | 'status' | 'study_module_order' | 'study_module_start_point' | 'support_email' | 'teacher_in_charge_email' | 'teacher_in_charge_name' | 'updated_at' | 'completion_email' | 'completions_handled_by' | 'inherit_settings_from' | 'owner_organization' | 'photo' | 'completions' | 'completions_registered' | 'handles_completions_for' | 'other_course_courseTocourse_inherit_settings_from' | 'course_aliases' | 'course_organizations' | 'course_translations' | 'course_variants' | 'exercises' | 'open_university_registration_links' | 'user_course_progresses' | 'user_course_service_progresses' | 'user_course_settings' | 'user_course_settings_visibilities' | 'services' | 'study_modules' | 'upcoming_active_link' | 'tier'
      ordering: 'automatic_completions' | 'automatic_completions_eligible_for_ects' | 'completion_email_id' | 'completions_handled_by_id' | 'created_at' | 'ects' | 'end_date' | 'exercise_completions_needed' | 'has_certificate' | 'hidden' | 'id' | 'inherit_settings_from_id' | 'name' | 'order' | 'owner_organization_id' | 'photo_id' | 'points_needed' | 'promote' | 'slug' | 'start_date' | 'start_point' | 'status' | 'study_module_order' | 'study_module_start_point' | 'support_email' | 'teacher_in_charge_email' | 'teacher_in_charge_name' | 'updated_at' | 'upcoming_active_link' | 'tier'
    }
    email_deliveries: {
      filtering: 'AND' | 'OR' | 'NOT' | 'created_at' | 'email_template_id' | 'error' | 'error_message' | 'id' | 'sent' | 'updated_at' | 'user_id' | 'email_template' | 'user'
      ordering: 'created_at' | 'email_template_id' | 'error' | 'error_message' | 'id' | 'sent' | 'updated_at' | 'user_id'
    }
  }
  Exercise: {
    exercise_completions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'completed' | 'created_at' | 'exercise_id' | 'id' | 'n_points' | 'timestamp' | 'updated_at' | 'user_id' | 'exercise' | 'user' | 'exercise_completion_required_actions' | 'attempted'
      ordering: 'completed' | 'created_at' | 'exercise_id' | 'id' | 'n_points' | 'timestamp' | 'updated_at' | 'user_id' | 'attempted'
    }
  }
  ExerciseCompletion: {
    exercise_completion_required_actions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'exercise_completion_id' | 'id' | 'value' | 'exercise_completion'
      ordering: 'exercise_completion_id' | 'id' | 'value'
    }
  }
  ExerciseCompletionRequiredAction: {

  }
  Image: {
    courses: {
      filtering: 'AND' | 'OR' | 'NOT' | 'automatic_completions' | 'automatic_completions_eligible_for_ects' | 'completion_email_id' | 'completions_handled_by_id' | 'created_at' | 'ects' | 'end_date' | 'exercise_completions_needed' | 'has_certificate' | 'hidden' | 'id' | 'inherit_settings_from_id' | 'name' | 'order' | 'owner_organization_id' | 'photo_id' | 'points_needed' | 'promote' | 'slug' | 'start_date' | 'start_point' | 'status' | 'study_module_order' | 'study_module_start_point' | 'support_email' | 'teacher_in_charge_email' | 'teacher_in_charge_name' | 'updated_at' | 'completion_email' | 'completions_handled_by' | 'inherit_settings_from' | 'owner_organization' | 'photo' | 'completions' | 'completions_registered' | 'handles_completions_for' | 'other_course_courseTocourse_inherit_settings_from' | 'course_aliases' | 'course_organizations' | 'course_translations' | 'course_variants' | 'exercises' | 'open_university_registration_links' | 'user_course_progresses' | 'user_course_service_progresses' | 'user_course_settings' | 'user_course_settings_visibilities' | 'services' | 'study_modules' | 'upcoming_active_link' | 'tier'
      ordering: 'automatic_completions' | 'automatic_completions_eligible_for_ects' | 'completion_email_id' | 'completions_handled_by_id' | 'created_at' | 'ects' | 'end_date' | 'exercise_completions_needed' | 'has_certificate' | 'hidden' | 'id' | 'inherit_settings_from_id' | 'name' | 'order' | 'owner_organization_id' | 'photo_id' | 'points_needed' | 'promote' | 'slug' | 'start_date' | 'start_point' | 'status' | 'study_module_order' | 'study_module_start_point' | 'support_email' | 'teacher_in_charge_email' | 'teacher_in_charge_name' | 'updated_at' | 'upcoming_active_link' | 'tier'
    }
  }
  OpenUniversityRegistrationLink: {

  }
  Organization: {
    completions_registered: {
      filtering: 'AND' | 'OR' | 'NOT' | 'completion_id' | 'course_id' | 'created_at' | 'id' | 'organization_id' | 'real_student_number' | 'updated_at' | 'user_id' | 'completion' | 'course' | 'organization' | 'user'
      ordering: 'completion_id' | 'course_id' | 'created_at' | 'id' | 'organization_id' | 'real_student_number' | 'updated_at' | 'user_id'
    }
    courses: {
      filtering: 'AND' | 'OR' | 'NOT' | 'automatic_completions' | 'automatic_completions_eligible_for_ects' | 'completion_email_id' | 'completions_handled_by_id' | 'created_at' | 'ects' | 'end_date' | 'exercise_completions_needed' | 'has_certificate' | 'hidden' | 'id' | 'inherit_settings_from_id' | 'name' | 'order' | 'owner_organization_id' | 'photo_id' | 'points_needed' | 'promote' | 'slug' | 'start_date' | 'start_point' | 'status' | 'study_module_order' | 'study_module_start_point' | 'support_email' | 'teacher_in_charge_email' | 'teacher_in_charge_name' | 'updated_at' | 'completion_email' | 'completions_handled_by' | 'inherit_settings_from' | 'owner_organization' | 'photo' | 'completions' | 'completions_registered' | 'handles_completions_for' | 'other_course_courseTocourse_inherit_settings_from' | 'course_aliases' | 'course_organizations' | 'course_translations' | 'course_variants' | 'exercises' | 'open_university_registration_links' | 'user_course_progresses' | 'user_course_service_progresses' | 'user_course_settings' | 'user_course_settings_visibilities' | 'services' | 'study_modules' | 'upcoming_active_link' | 'tier'
      ordering: 'automatic_completions' | 'automatic_completions_eligible_for_ects' | 'completion_email_id' | 'completions_handled_by_id' | 'created_at' | 'ects' | 'end_date' | 'exercise_completions_needed' | 'has_certificate' | 'hidden' | 'id' | 'inherit_settings_from_id' | 'name' | 'order' | 'owner_organization_id' | 'photo_id' | 'points_needed' | 'promote' | 'slug' | 'start_date' | 'start_point' | 'status' | 'study_module_order' | 'study_module_start_point' | 'support_email' | 'teacher_in_charge_email' | 'teacher_in_charge_name' | 'updated_at' | 'upcoming_active_link' | 'tier'
    }
    course_organizations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'creator' | 'id' | 'organization_id' | 'updated_at' | 'course' | 'organization'
      ordering: 'course_id' | 'created_at' | 'creator' | 'id' | 'organization_id' | 'updated_at'
    }
    organization_translations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'created_at' | 'disabled_reason' | 'id' | 'information' | 'language' | 'name' | 'organization_id' | 'updated_at' | 'organization'
      ordering: 'created_at' | 'disabled_reason' | 'id' | 'information' | 'language' | 'name' | 'organization_id' | 'updated_at'
    }
    user_organizations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'created_at' | 'id' | 'organization_id' | 'role' | 'updated_at' | 'user_id' | 'organization' | 'user'
      ordering: 'created_at' | 'id' | 'organization_id' | 'role' | 'updated_at' | 'user_id'
    }
    verified_users: {
      filtering: 'AND' | 'OR' | 'NOT' | 'created_at' | 'display_name' | 'id' | 'organization_id' | 'personal_unique_code' | 'updated_at' | 'user_id' | 'organization' | 'user'
      ordering: 'created_at' | 'display_name' | 'id' | 'organization_id' | 'personal_unique_code' | 'updated_at' | 'user_id'
    }
  }
  OrganizationTranslation: {

  }
  Service: {
    exercises: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'custom_id' | 'deleted' | 'id' | 'max_points' | 'name' | 'part' | 'section' | 'service_id' | 'timestamp' | 'updated_at' | 'course' | 'service' | 'exercise_completions'
      ordering: 'course_id' | 'created_at' | 'custom_id' | 'deleted' | 'id' | 'max_points' | 'name' | 'part' | 'section' | 'service_id' | 'timestamp' | 'updated_at'
    }
    user_course_service_progresses: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'id' | 'progress' | 'service_id' | 'timestamp' | 'updated_at' | 'user_id' | 'user_course_progress_id' | 'course' | 'service' | 'user' | 'user_course_progress'
      ordering: 'course_id' | 'created_at' | 'id' | 'progress' | 'service_id' | 'timestamp' | 'updated_at' | 'user_id' | 'user_course_progress_id'
    }
    courses: {
      filtering: 'AND' | 'OR' | 'NOT' | 'automatic_completions' | 'automatic_completions_eligible_for_ects' | 'completion_email_id' | 'completions_handled_by_id' | 'created_at' | 'ects' | 'end_date' | 'exercise_completions_needed' | 'has_certificate' | 'hidden' | 'id' | 'inherit_settings_from_id' | 'name' | 'order' | 'owner_organization_id' | 'photo_id' | 'points_needed' | 'promote' | 'slug' | 'start_date' | 'start_point' | 'status' | 'study_module_order' | 'study_module_start_point' | 'support_email' | 'teacher_in_charge_email' | 'teacher_in_charge_name' | 'updated_at' | 'completion_email' | 'completions_handled_by' | 'inherit_settings_from' | 'owner_organization' | 'photo' | 'completions' | 'completions_registered' | 'handles_completions_for' | 'other_course_courseTocourse_inherit_settings_from' | 'course_aliases' | 'course_organizations' | 'course_translations' | 'course_variants' | 'exercises' | 'open_university_registration_links' | 'user_course_progresses' | 'user_course_service_progresses' | 'user_course_settings' | 'user_course_settings_visibilities' | 'services' | 'study_modules' | 'upcoming_active_link' | 'tier'
      ordering: 'automatic_completions' | 'automatic_completions_eligible_for_ects' | 'completion_email_id' | 'completions_handled_by_id' | 'created_at' | 'ects' | 'end_date' | 'exercise_completions_needed' | 'has_certificate' | 'hidden' | 'id' | 'inherit_settings_from_id' | 'name' | 'order' | 'owner_organization_id' | 'photo_id' | 'points_needed' | 'promote' | 'slug' | 'start_date' | 'start_point' | 'status' | 'study_module_order' | 'study_module_start_point' | 'support_email' | 'teacher_in_charge_email' | 'teacher_in_charge_name' | 'updated_at' | 'upcoming_active_link' | 'tier'
    }
  }
  StudyModule: {
    study_module_translations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'created_at' | 'description' | 'id' | 'language' | 'name' | 'study_module_id' | 'updated_at' | 'study_module'
      ordering: 'created_at' | 'description' | 'id' | 'language' | 'name' | 'study_module_id' | 'updated_at'
    }
    courses: {
      filtering: 'AND' | 'OR' | 'NOT' | 'automatic_completions' | 'automatic_completions_eligible_for_ects' | 'completion_email_id' | 'completions_handled_by_id' | 'created_at' | 'ects' | 'end_date' | 'exercise_completions_needed' | 'has_certificate' | 'hidden' | 'id' | 'inherit_settings_from_id' | 'name' | 'order' | 'owner_organization_id' | 'photo_id' | 'points_needed' | 'promote' | 'slug' | 'start_date' | 'start_point' | 'status' | 'study_module_order' | 'study_module_start_point' | 'support_email' | 'teacher_in_charge_email' | 'teacher_in_charge_name' | 'updated_at' | 'completion_email' | 'completions_handled_by' | 'inherit_settings_from' | 'owner_organization' | 'photo' | 'completions' | 'completions_registered' | 'handles_completions_for' | 'other_course_courseTocourse_inherit_settings_from' | 'course_aliases' | 'course_organizations' | 'course_translations' | 'course_variants' | 'exercises' | 'open_university_registration_links' | 'user_course_progresses' | 'user_course_service_progresses' | 'user_course_settings' | 'user_course_settings_visibilities' | 'services' | 'study_modules' | 'upcoming_active_link' | 'tier'
      ordering: 'automatic_completions' | 'automatic_completions_eligible_for_ects' | 'completion_email_id' | 'completions_handled_by_id' | 'created_at' | 'ects' | 'end_date' | 'exercise_completions_needed' | 'has_certificate' | 'hidden' | 'id' | 'inherit_settings_from_id' | 'name' | 'order' | 'owner_organization_id' | 'photo_id' | 'points_needed' | 'promote' | 'slug' | 'start_date' | 'start_point' | 'status' | 'study_module_order' | 'study_module_start_point' | 'support_email' | 'teacher_in_charge_email' | 'teacher_in_charge_name' | 'updated_at' | 'upcoming_active_link' | 'tier'
    }
  }
  StudyModuleTranslation: {

  }
  User: {
    completions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'certificate_id' | 'completion_language' | 'course_id' | 'created_at' | 'eligible_for_ects' | 'email' | 'grade' | 'id' | 'student_number' | 'updated_at' | 'user_id' | 'user_upstream_id' | 'course' | 'user' | 'completions_registered' | 'completion_date'
      ordering: 'certificate_id' | 'completion_language' | 'course_id' | 'created_at' | 'eligible_for_ects' | 'email' | 'grade' | 'id' | 'student_number' | 'updated_at' | 'user_id' | 'user_upstream_id' | 'completion_date'
    }
    completions_registered: {
      filtering: 'AND' | 'OR' | 'NOT' | 'completion_id' | 'course_id' | 'created_at' | 'id' | 'organization_id' | 'real_student_number' | 'updated_at' | 'user_id' | 'completion' | 'course' | 'organization' | 'user'
      ordering: 'completion_id' | 'course_id' | 'created_at' | 'id' | 'organization_id' | 'real_student_number' | 'updated_at' | 'user_id'
    }
    email_deliveries: {
      filtering: 'AND' | 'OR' | 'NOT' | 'created_at' | 'email_template_id' | 'error' | 'error_message' | 'id' | 'sent' | 'updated_at' | 'user_id' | 'email_template' | 'user'
      ordering: 'created_at' | 'email_template_id' | 'error' | 'error_message' | 'id' | 'sent' | 'updated_at' | 'user_id'
    }
    exercise_completions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'completed' | 'created_at' | 'exercise_id' | 'id' | 'n_points' | 'timestamp' | 'updated_at' | 'user_id' | 'exercise' | 'user' | 'exercise_completion_required_actions' | 'attempted'
      ordering: 'completed' | 'created_at' | 'exercise_id' | 'id' | 'n_points' | 'timestamp' | 'updated_at' | 'user_id' | 'attempted'
    }
    organizations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'contact_information' | 'created_at' | 'creator_id' | 'disabled' | 'email' | 'hidden' | 'id' | 'logo_content_type' | 'logo_file_name' | 'logo_file_size' | 'logo_updated_at' | 'phone' | 'pinned' | 'secret_key' | 'slug' | 'tmc_created_at' | 'tmc_updated_at' | 'updated_at' | 'verified' | 'verified_at' | 'website' | 'creator' | 'completions_registered' | 'courses' | 'course_organizations' | 'organization_translations' | 'user_organizations' | 'verified_users'
      ordering: 'contact_information' | 'created_at' | 'creator_id' | 'disabled' | 'email' | 'hidden' | 'id' | 'logo_content_type' | 'logo_file_name' | 'logo_file_size' | 'logo_updated_at' | 'phone' | 'pinned' | 'secret_key' | 'slug' | 'tmc_created_at' | 'tmc_updated_at' | 'updated_at' | 'verified' | 'verified_at' | 'website'
    }
    user_course_progresses: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'id' | 'max_points' | 'n_points' | 'progress' | 'extra' | 'updated_at' | 'user_id' | 'course' | 'user' | 'user_course_service_progresses'
      ordering: 'course_id' | 'created_at' | 'id' | 'max_points' | 'n_points' | 'progress' | 'extra' | 'updated_at' | 'user_id'
    }
    user_course_service_progresses: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'id' | 'progress' | 'service_id' | 'timestamp' | 'updated_at' | 'user_id' | 'user_course_progress_id' | 'course' | 'service' | 'user' | 'user_course_progress'
      ordering: 'course_id' | 'created_at' | 'id' | 'progress' | 'service_id' | 'timestamp' | 'updated_at' | 'user_id' | 'user_course_progress_id'
    }
    user_course_settings: {
      filtering: 'AND' | 'OR' | 'NOT' | 'country' | 'course_id' | 'course_variant' | 'created_at' | 'id' | 'language' | 'marketing' | 'other' | 'research' | 'updated_at' | 'user_id' | 'course' | 'user'
      ordering: 'country' | 'course_id' | 'course_variant' | 'created_at' | 'id' | 'language' | 'marketing' | 'other' | 'research' | 'updated_at' | 'user_id'
    }
    user_organizations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'created_at' | 'id' | 'organization_id' | 'role' | 'updated_at' | 'user_id' | 'organization' | 'user'
      ordering: 'created_at' | 'id' | 'organization_id' | 'role' | 'updated_at' | 'user_id'
    }
    verified_users: {
      filtering: 'AND' | 'OR' | 'NOT' | 'created_at' | 'display_name' | 'id' | 'organization_id' | 'personal_unique_code' | 'updated_at' | 'user_id' | 'organization' | 'user'
      ordering: 'created_at' | 'display_name' | 'id' | 'organization_id' | 'personal_unique_code' | 'updated_at' | 'user_id'
    }
  }
  UserAppDatumConfig: {

  }
  UserCourseProgress: {
    user_course_service_progresses: {
      filtering: 'AND' | 'OR' | 'NOT' | 'course_id' | 'created_at' | 'id' | 'progress' | 'service_id' | 'timestamp' | 'updated_at' | 'user_id' | 'user_course_progress_id' | 'course' | 'service' | 'user' | 'user_course_progress'
      ordering: 'course_id' | 'created_at' | 'id' | 'progress' | 'service_id' | 'timestamp' | 'updated_at' | 'user_id' | 'user_course_progress_id'
    }
  }
  UserCourseServiceProgress: {

  }
  UserCourseSetting: {

  }
  UserCourseSettingsVisibility: {

  }
  UserOrganization: {

  }
  VerifiedUser: {

  }
}

// Prisma output types metadata
interface NexusPrismaOutputs {
  Query: {
    completion: 'Completion'
    completions: 'Completion'
    completionRegistered: 'CompletionRegistered'
    completionRegistereds: 'CompletionRegistered'
    course: 'Course'
    courses: 'Course'
    courseAlias: 'CourseAlias'
    courseAliases: 'CourseAlias'
    courseOrganization: 'CourseOrganization'
    courseOrganizations: 'CourseOrganization'
    courseTranslation: 'CourseTranslation'
    courseTranslations: 'CourseTranslation'
    courseVariant: 'CourseVariant'
    courseVariants: 'CourseVariant'
    emailDelivery: 'EmailDelivery'
    emailDeliveries: 'EmailDelivery'
    emailTemplate: 'EmailTemplate'
    emailTemplates: 'EmailTemplate'
    exercise: 'Exercise'
    exercises: 'Exercise'
    exerciseCompletion: 'ExerciseCompletion'
    exerciseCompletions: 'ExerciseCompletion'
    exerciseCompletionRequiredAction: 'ExerciseCompletionRequiredAction'
    exerciseCompletionRequiredActions: 'ExerciseCompletionRequiredAction'
    image: 'Image'
    images: 'Image'
    openUniversityRegistrationLink: 'OpenUniversityRegistrationLink'
    openUniversityRegistrationLinks: 'OpenUniversityRegistrationLink'
    organization: 'Organization'
    organizations: 'Organization'
    organizationTranslation: 'OrganizationTranslation'
    organizationTranslations: 'OrganizationTranslation'
    service: 'Service'
    services: 'Service'
    studyModule: 'StudyModule'
    studyModules: 'StudyModule'
    studyModuleTranslation: 'StudyModuleTranslation'
    studyModuleTranslations: 'StudyModuleTranslation'
    user: 'User'
    users: 'User'
    userAppDatumConfig: 'UserAppDatumConfig'
    userAppDatumConfigs: 'UserAppDatumConfig'
    userCourseProgress: 'UserCourseProgress'
    userCourseProgresses: 'UserCourseProgress'
    userCourseServiceProgress: 'UserCourseServiceProgress'
    userCourseServiceProgresses: 'UserCourseServiceProgress'
    userCourseSetting: 'UserCourseSetting'
    userCourseSettings: 'UserCourseSetting'
    userCourseSettingsVisibility: 'UserCourseSettingsVisibility'
    userCourseSettingsVisibilities: 'UserCourseSettingsVisibility'
    userOrganization: 'UserOrganization'
    userOrganizations: 'UserOrganization'
    verifiedUser: 'VerifiedUser'
    verifiedUsers: 'VerifiedUser'
  },
  Mutation: {
    createOneCompletion: 'Completion'
    updateOneCompletion: 'Completion'
    updateManyCompletion: 'BatchPayload'
    deleteOneCompletion: 'Completion'
    deleteManyCompletion: 'BatchPayload'
    upsertOneCompletion: 'Completion'
    createOneCompletionRegistered: 'CompletionRegistered'
    updateOneCompletionRegistered: 'CompletionRegistered'
    updateManyCompletionRegistered: 'BatchPayload'
    deleteOneCompletionRegistered: 'CompletionRegistered'
    deleteManyCompletionRegistered: 'BatchPayload'
    upsertOneCompletionRegistered: 'CompletionRegistered'
    createOneCourse: 'Course'
    updateOneCourse: 'Course'
    updateManyCourse: 'BatchPayload'
    deleteOneCourse: 'Course'
    deleteManyCourse: 'BatchPayload'
    upsertOneCourse: 'Course'
    createOneCourseAlias: 'CourseAlias'
    updateOneCourseAlias: 'CourseAlias'
    updateManyCourseAlias: 'BatchPayload'
    deleteOneCourseAlias: 'CourseAlias'
    deleteManyCourseAlias: 'BatchPayload'
    upsertOneCourseAlias: 'CourseAlias'
    createOneCourseOrganization: 'CourseOrganization'
    updateOneCourseOrganization: 'CourseOrganization'
    updateManyCourseOrganization: 'BatchPayload'
    deleteOneCourseOrganization: 'CourseOrganization'
    deleteManyCourseOrganization: 'BatchPayload'
    upsertOneCourseOrganization: 'CourseOrganization'
    createOneCourseTranslation: 'CourseTranslation'
    updateOneCourseTranslation: 'CourseTranslation'
    updateManyCourseTranslation: 'BatchPayload'
    deleteOneCourseTranslation: 'CourseTranslation'
    deleteManyCourseTranslation: 'BatchPayload'
    upsertOneCourseTranslation: 'CourseTranslation'
    createOneCourseVariant: 'CourseVariant'
    updateOneCourseVariant: 'CourseVariant'
    updateManyCourseVariant: 'BatchPayload'
    deleteOneCourseVariant: 'CourseVariant'
    deleteManyCourseVariant: 'BatchPayload'
    upsertOneCourseVariant: 'CourseVariant'
    createOneEmailDelivery: 'EmailDelivery'
    updateOneEmailDelivery: 'EmailDelivery'
    updateManyEmailDelivery: 'BatchPayload'
    deleteOneEmailDelivery: 'EmailDelivery'
    deleteManyEmailDelivery: 'BatchPayload'
    upsertOneEmailDelivery: 'EmailDelivery'
    createOneEmailTemplate: 'EmailTemplate'
    updateOneEmailTemplate: 'EmailTemplate'
    updateManyEmailTemplate: 'BatchPayload'
    deleteOneEmailTemplate: 'EmailTemplate'
    deleteManyEmailTemplate: 'BatchPayload'
    upsertOneEmailTemplate: 'EmailTemplate'
    createOneExercise: 'Exercise'
    updateOneExercise: 'Exercise'
    updateManyExercise: 'BatchPayload'
    deleteOneExercise: 'Exercise'
    deleteManyExercise: 'BatchPayload'
    upsertOneExercise: 'Exercise'
    createOneExerciseCompletion: 'ExerciseCompletion'
    updateOneExerciseCompletion: 'ExerciseCompletion'
    updateManyExerciseCompletion: 'BatchPayload'
    deleteOneExerciseCompletion: 'ExerciseCompletion'
    deleteManyExerciseCompletion: 'BatchPayload'
    upsertOneExerciseCompletion: 'ExerciseCompletion'
    createOneExerciseCompletionRequiredAction: 'ExerciseCompletionRequiredAction'
    updateOneExerciseCompletionRequiredAction: 'ExerciseCompletionRequiredAction'
    updateManyExerciseCompletionRequiredAction: 'BatchPayload'
    deleteOneExerciseCompletionRequiredAction: 'ExerciseCompletionRequiredAction'
    deleteManyExerciseCompletionRequiredAction: 'BatchPayload'
    upsertOneExerciseCompletionRequiredAction: 'ExerciseCompletionRequiredAction'
    createOneImage: 'Image'
    updateOneImage: 'Image'
    updateManyImage: 'BatchPayload'
    deleteOneImage: 'Image'
    deleteManyImage: 'BatchPayload'
    upsertOneImage: 'Image'
    createOneOpenUniversityRegistrationLink: 'OpenUniversityRegistrationLink'
    updateOneOpenUniversityRegistrationLink: 'OpenUniversityRegistrationLink'
    updateManyOpenUniversityRegistrationLink: 'BatchPayload'
    deleteOneOpenUniversityRegistrationLink: 'OpenUniversityRegistrationLink'
    deleteManyOpenUniversityRegistrationLink: 'BatchPayload'
    upsertOneOpenUniversityRegistrationLink: 'OpenUniversityRegistrationLink'
    createOneOrganization: 'Organization'
    updateOneOrganization: 'Organization'
    updateManyOrganization: 'BatchPayload'
    deleteOneOrganization: 'Organization'
    deleteManyOrganization: 'BatchPayload'
    upsertOneOrganization: 'Organization'
    createOneOrganizationTranslation: 'OrganizationTranslation'
    updateOneOrganizationTranslation: 'OrganizationTranslation'
    updateManyOrganizationTranslation: 'BatchPayload'
    deleteOneOrganizationTranslation: 'OrganizationTranslation'
    deleteManyOrganizationTranslation: 'BatchPayload'
    upsertOneOrganizationTranslation: 'OrganizationTranslation'
    createOneService: 'Service'
    updateOneService: 'Service'
    updateManyService: 'BatchPayload'
    deleteOneService: 'Service'
    deleteManyService: 'BatchPayload'
    upsertOneService: 'Service'
    createOneStudyModule: 'StudyModule'
    updateOneStudyModule: 'StudyModule'
    updateManyStudyModule: 'BatchPayload'
    deleteOneStudyModule: 'StudyModule'
    deleteManyStudyModule: 'BatchPayload'
    upsertOneStudyModule: 'StudyModule'
    createOneStudyModuleTranslation: 'StudyModuleTranslation'
    updateOneStudyModuleTranslation: 'StudyModuleTranslation'
    updateManyStudyModuleTranslation: 'BatchPayload'
    deleteOneStudyModuleTranslation: 'StudyModuleTranslation'
    deleteManyStudyModuleTranslation: 'BatchPayload'
    upsertOneStudyModuleTranslation: 'StudyModuleTranslation'
    createOneUser: 'User'
    updateOneUser: 'User'
    updateManyUser: 'BatchPayload'
    deleteOneUser: 'User'
    deleteManyUser: 'BatchPayload'
    upsertOneUser: 'User'
    createOneUserAppDatumConfig: 'UserAppDatumConfig'
    updateOneUserAppDatumConfig: 'UserAppDatumConfig'
    updateManyUserAppDatumConfig: 'BatchPayload'
    deleteOneUserAppDatumConfig: 'UserAppDatumConfig'
    deleteManyUserAppDatumConfig: 'BatchPayload'
    upsertOneUserAppDatumConfig: 'UserAppDatumConfig'
    createOneUserCourseProgress: 'UserCourseProgress'
    updateOneUserCourseProgress: 'UserCourseProgress'
    updateManyUserCourseProgress: 'BatchPayload'
    deleteOneUserCourseProgress: 'UserCourseProgress'
    deleteManyUserCourseProgress: 'BatchPayload'
    upsertOneUserCourseProgress: 'UserCourseProgress'
    createOneUserCourseServiceProgress: 'UserCourseServiceProgress'
    updateOneUserCourseServiceProgress: 'UserCourseServiceProgress'
    updateManyUserCourseServiceProgress: 'BatchPayload'
    deleteOneUserCourseServiceProgress: 'UserCourseServiceProgress'
    deleteManyUserCourseServiceProgress: 'BatchPayload'
    upsertOneUserCourseServiceProgress: 'UserCourseServiceProgress'
    createOneUserCourseSetting: 'UserCourseSetting'
    updateOneUserCourseSetting: 'UserCourseSetting'
    updateManyUserCourseSetting: 'BatchPayload'
    deleteOneUserCourseSetting: 'UserCourseSetting'
    deleteManyUserCourseSetting: 'BatchPayload'
    upsertOneUserCourseSetting: 'UserCourseSetting'
    createOneUserCourseSettingsVisibility: 'UserCourseSettingsVisibility'
    updateOneUserCourseSettingsVisibility: 'UserCourseSettingsVisibility'
    updateManyUserCourseSettingsVisibility: 'BatchPayload'
    deleteOneUserCourseSettingsVisibility: 'UserCourseSettingsVisibility'
    deleteManyUserCourseSettingsVisibility: 'BatchPayload'
    upsertOneUserCourseSettingsVisibility: 'UserCourseSettingsVisibility'
    createOneUserOrganization: 'UserOrganization'
    updateOneUserOrganization: 'UserOrganization'
    updateManyUserOrganization: 'BatchPayload'
    deleteOneUserOrganization: 'UserOrganization'
    deleteManyUserOrganization: 'BatchPayload'
    upsertOneUserOrganization: 'UserOrganization'
    createOneVerifiedUser: 'VerifiedUser'
    updateOneVerifiedUser: 'VerifiedUser'
    updateManyVerifiedUser: 'BatchPayload'
    deleteOneVerifiedUser: 'VerifiedUser'
    deleteManyVerifiedUser: 'BatchPayload'
    upsertOneVerifiedUser: 'VerifiedUser'
  },
  Completion: {
    certificate_id: 'String'
    completion_language: 'String'
    course_id: 'String'
    created_at: 'DateTime'
    eligible_for_ects: 'Boolean'
    email: 'String'
    grade: 'String'
    id: 'String'
    student_number: 'String'
    updated_at: 'DateTime'
    user_id: 'String'
    user_upstream_id: 'Int'
    course: 'Course'
    user: 'User'
    completions_registered: 'CompletionRegistered'
    completion_date: 'DateTime'
  }
  CompletionRegistered: {
    completion_id: 'String'
    course_id: 'String'
    created_at: 'DateTime'
    id: 'String'
    organization_id: 'String'
    real_student_number: 'String'
    updated_at: 'DateTime'
    user_id: 'String'
    completion: 'Completion'
    course: 'Course'
    organization: 'Organization'
    user: 'User'
  }
  Course: {
    automatic_completions: 'Boolean'
    automatic_completions_eligible_for_ects: 'Boolean'
    completion_email_id: 'String'
    completions_handled_by_id: 'String'
    created_at: 'DateTime'
    ects: 'String'
    end_date: 'String'
    exercise_completions_needed: 'Int'
    has_certificate: 'Boolean'
    hidden: 'Boolean'
    id: 'String'
    inherit_settings_from_id: 'String'
    name: 'String'
    order: 'Int'
    owner_organization_id: 'String'
    photo_id: 'String'
    points_needed: 'Int'
    promote: 'Boolean'
    slug: 'String'
    start_date: 'String'
    start_point: 'Boolean'
    status: 'CourseStatus'
    study_module_order: 'Int'
    study_module_start_point: 'Boolean'
    support_email: 'String'
    teacher_in_charge_email: 'String'
    teacher_in_charge_name: 'String'
    updated_at: 'DateTime'
    completion_email: 'EmailTemplate'
    completions_handled_by: 'Course'
    inherit_settings_from: 'Course'
    owner_organization: 'Organization'
    photo: 'Image'
    completions: 'Completion'
    completions_registered: 'CompletionRegistered'
    handles_completions_for: 'Course'
    other_course_courseTocourse_inherit_settings_from: 'Course'
    course_aliases: 'CourseAlias'
    course_organizations: 'CourseOrganization'
    course_translations: 'CourseTranslation'
    course_variants: 'CourseVariant'
    exercises: 'Exercise'
    open_university_registration_links: 'OpenUniversityRegistrationLink'
    user_course_progresses: 'UserCourseProgress'
    user_course_service_progresses: 'UserCourseServiceProgress'
    user_course_settings: 'UserCourseSetting'
    user_course_settings_visibilities: 'UserCourseSettingsVisibility'
    services: 'Service'
    study_modules: 'StudyModule'
    upcoming_active_link: 'Boolean'
    tier: 'Int'
  }
  CourseAlias: {
    course_id: 'String'
    course_code: 'String'
    created_at: 'DateTime'
    id: 'String'
    updated_at: 'DateTime'
    course: 'Course'
  }
  CourseOrganization: {
    course_id: 'String'
    created_at: 'DateTime'
    creator: 'Boolean'
    id: 'String'
    organization_id: 'String'
    updated_at: 'DateTime'
    course: 'Course'
    organization: 'Organization'
  }
  CourseTranslation: {
    course_id: 'String'
    created_at: 'DateTime'
    description: 'String'
    id: 'String'
    language: 'String'
    link: 'String'
    name: 'String'
    updated_at: 'DateTime'
    course: 'Course'
  }
  CourseVariant: {
    course_id: 'String'
    created_at: 'DateTime'
    description: 'String'
    id: 'String'
    slug: 'String'
    updated_at: 'DateTime'
    course: 'Course'
  }
  EmailDelivery: {
    created_at: 'DateTime'
    email_template_id: 'String'
    error: 'Boolean'
    error_message: 'String'
    id: 'String'
    sent: 'Boolean'
    updated_at: 'DateTime'
    user_id: 'String'
    email_template: 'EmailTemplate'
    user: 'User'
  }
  EmailTemplate: {
    created_at: 'DateTime'
    html_body: 'String'
    id: 'String'
    name: 'String'
    title: 'String'
    txt_body: 'String'
    updated_at: 'DateTime'
    courses: 'Course'
    email_deliveries: 'EmailDelivery'
  }
  Exercise: {
    course_id: 'String'
    created_at: 'DateTime'
    custom_id: 'String'
    deleted: 'Boolean'
    id: 'String'
    max_points: 'Int'
    name: 'String'
    part: 'Int'
    section: 'Int'
    service_id: 'String'
    timestamp: 'DateTime'
    updated_at: 'DateTime'
    course: 'Course'
    service: 'Service'
    exercise_completions: 'ExerciseCompletion'
  }
  ExerciseCompletion: {
    completed: 'Boolean'
    created_at: 'DateTime'
    exercise_id: 'String'
    id: 'String'
    n_points: 'Float'
    timestamp: 'DateTime'
    updated_at: 'DateTime'
    user_id: 'String'
    exercise: 'Exercise'
    user: 'User'
    exercise_completion_required_actions: 'ExerciseCompletionRequiredAction'
    attempted: 'Boolean'
  }
  ExerciseCompletionRequiredAction: {
    exercise_completion_id: 'String'
    id: 'String'
    value: 'String'
    exercise_completion: 'ExerciseCompletion'
  }
  Image: {
    compressed: 'String'
    compressed_mimetype: 'String'
    created_at: 'DateTime'
    default: 'Boolean'
    encoding: 'String'
    id: 'String'
    name: 'String'
    original: 'String'
    original_mimetype: 'String'
    uncompressed: 'String'
    uncompressed_mimetype: 'String'
    updated_at: 'DateTime'
    courses: 'Course'
  }
  OpenUniversityRegistrationLink: {
    course_id: 'String'
    course_code: 'String'
    created_at: 'DateTime'
    id: 'String'
    language: 'String'
    link: 'String'
    start_date: 'DateTime'
    stop_date: 'DateTime'
    updated_at: 'DateTime'
    course: 'Course'
  }
  Organization: {
    contact_information: 'String'
    created_at: 'DateTime'
    creator_id: 'String'
    disabled: 'Boolean'
    email: 'String'
    hidden: 'Boolean'
    id: 'String'
    logo_content_type: 'String'
    logo_file_name: 'String'
    logo_file_size: 'Int'
    logo_updated_at: 'DateTime'
    phone: 'String'
    pinned: 'Boolean'
    secret_key: 'String'
    slug: 'String'
    tmc_created_at: 'DateTime'
    tmc_updated_at: 'DateTime'
    updated_at: 'DateTime'
    verified: 'Boolean'
    verified_at: 'DateTime'
    website: 'String'
    creator: 'User'
    completions_registered: 'CompletionRegistered'
    courses: 'Course'
    course_organizations: 'CourseOrganization'
    organization_translations: 'OrganizationTranslation'
    user_organizations: 'UserOrganization'
    verified_users: 'VerifiedUser'
  }
  OrganizationTranslation: {
    created_at: 'DateTime'
    disabled_reason: 'String'
    id: 'String'
    information: 'String'
    language: 'String'
    name: 'String'
    organization_id: 'String'
    updated_at: 'DateTime'
    organization: 'Organization'
  }
  Service: {
    created_at: 'DateTime'
    id: 'String'
    name: 'String'
    updated_at: 'DateTime'
    url: 'String'
    exercises: 'Exercise'
    user_course_service_progresses: 'UserCourseServiceProgress'
    courses: 'Course'
  }
  StudyModule: {
    created_at: 'DateTime'
    id: 'String'
    image: 'String'
    name: 'String'
    order: 'Int'
    slug: 'String'
    updated_at: 'DateTime'
    study_module_translations: 'StudyModuleTranslation'
    courses: 'Course'
  }
  StudyModuleTranslation: {
    created_at: 'DateTime'
    description: 'String'
    id: 'String'
    language: 'String'
    name: 'String'
    study_module_id: 'String'
    updated_at: 'DateTime'
    study_module: 'StudyModule'
  }
  User: {
    administrator: 'Boolean'
    created_at: 'DateTime'
    email: 'String'
    first_name: 'String'
    id: 'String'
    last_name: 'String'
    real_student_number: 'String'
    research_consent: 'Boolean'
    student_number: 'String'
    updated_at: 'DateTime'
    upstream_id: 'Int'
    username: 'String'
    completions: 'Completion'
    completions_registered: 'CompletionRegistered'
    email_deliveries: 'EmailDelivery'
    exercise_completions: 'ExerciseCompletion'
    organizations: 'Organization'
    user_course_progresses: 'UserCourseProgress'
    user_course_service_progresses: 'UserCourseServiceProgress'
    user_course_settings: 'UserCourseSetting'
    user_organizations: 'UserOrganization'
    verified_users: 'VerifiedUser'
  }
  UserAppDatumConfig: {
    created_at: 'DateTime'
    id: 'String'
    name: 'String'
    timestamp: 'DateTime'
    updated_at: 'DateTime'
  }
  UserCourseProgress: {
    course_id: 'String'
    created_at: 'DateTime'
    id: 'String'
    max_points: 'Float'
    n_points: 'Float'
    progress: 'Json'
    extra: 'Json'
    updated_at: 'DateTime'
    user_id: 'String'
    course: 'Course'
    user: 'User'
    user_course_service_progresses: 'UserCourseServiceProgress'
  }
  UserCourseServiceProgress: {
    course_id: 'String'
    created_at: 'DateTime'
    id: 'String'
    progress: 'Json'
    service_id: 'String'
    timestamp: 'DateTime'
    updated_at: 'DateTime'
    user_id: 'String'
    user_course_progress_id: 'String'
    course: 'Course'
    service: 'Service'
    user: 'User'
    user_course_progress: 'UserCourseProgress'
  }
  UserCourseSetting: {
    country: 'String'
    course_id: 'String'
    course_variant: 'String'
    created_at: 'DateTime'
    id: 'String'
    language: 'String'
    marketing: 'Boolean'
    other: 'Json'
    research: 'Boolean'
    updated_at: 'DateTime'
    user_id: 'String'
    course: 'Course'
    user: 'User'
  }
  UserCourseSettingsVisibility: {
    course_id: 'String'
    created_at: 'DateTime'
    id: 'String'
    language: 'String'
    updated_at: 'DateTime'
    course: 'Course'
  }
  UserOrganization: {
    created_at: 'DateTime'
    id: 'String'
    organization_id: 'String'
    role: 'OrganizationRole'
    updated_at: 'DateTime'
    user_id: 'String'
    organization: 'Organization'
    user: 'User'
  }
  VerifiedUser: {
    created_at: 'DateTime'
    display_name: 'String'
    id: 'String'
    organization_id: 'String'
    personal_unique_code: 'String'
    updated_at: 'DateTime'
    user_id: 'String'
    organization: 'Organization'
    user: 'User'
  }
}

// Helper to gather all methods relative to a model
interface NexusPrismaMethods {
  Completion: Typegen.NexusPrismaFields<'Completion'>
  CompletionRegistered: Typegen.NexusPrismaFields<'CompletionRegistered'>
  Course: Typegen.NexusPrismaFields<'Course'>
  CourseAlias: Typegen.NexusPrismaFields<'CourseAlias'>
  CourseOrganization: Typegen.NexusPrismaFields<'CourseOrganization'>
  CourseTranslation: Typegen.NexusPrismaFields<'CourseTranslation'>
  CourseVariant: Typegen.NexusPrismaFields<'CourseVariant'>
  EmailDelivery: Typegen.NexusPrismaFields<'EmailDelivery'>
  EmailTemplate: Typegen.NexusPrismaFields<'EmailTemplate'>
  Exercise: Typegen.NexusPrismaFields<'Exercise'>
  ExerciseCompletion: Typegen.NexusPrismaFields<'ExerciseCompletion'>
  ExerciseCompletionRequiredAction: Typegen.NexusPrismaFields<'ExerciseCompletionRequiredAction'>
  Image: Typegen.NexusPrismaFields<'Image'>
  OpenUniversityRegistrationLink: Typegen.NexusPrismaFields<'OpenUniversityRegistrationLink'>
  Organization: Typegen.NexusPrismaFields<'Organization'>
  OrganizationTranslation: Typegen.NexusPrismaFields<'OrganizationTranslation'>
  Service: Typegen.NexusPrismaFields<'Service'>
  StudyModule: Typegen.NexusPrismaFields<'StudyModule'>
  StudyModuleTranslation: Typegen.NexusPrismaFields<'StudyModuleTranslation'>
  User: Typegen.NexusPrismaFields<'User'>
  UserAppDatumConfig: Typegen.NexusPrismaFields<'UserAppDatumConfig'>
  UserCourseProgress: Typegen.NexusPrismaFields<'UserCourseProgress'>
  UserCourseServiceProgress: Typegen.NexusPrismaFields<'UserCourseServiceProgress'>
  UserCourseSetting: Typegen.NexusPrismaFields<'UserCourseSetting'>
  UserCourseSettingsVisibility: Typegen.NexusPrismaFields<'UserCourseSettingsVisibility'>
  UserOrganization: Typegen.NexusPrismaFields<'UserOrganization'>
  VerifiedUser: Typegen.NexusPrismaFields<'VerifiedUser'>
  Query: Typegen.NexusPrismaFields<'Query'>
  Mutation: Typegen.NexusPrismaFields<'Mutation'>
}

interface NexusPrismaGenTypes {
  inputs: NexusPrismaInputs
  outputs: NexusPrismaOutputs
  methods: NexusPrismaMethods
  models: PrismaModels
  pagination: Pagination
  scalars: CustomScalars
}

declare global {
  interface NexusPrismaGen extends NexusPrismaGenTypes {}

  type NexusPrisma<
    TypeName extends string,
    ModelOrCrud extends 'model' | 'crud'
  > = Typegen.GetNexusPrisma<TypeName, ModelOrCrud>;
}
  