/* eslint-disable */

import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core"

declare module "@apollo/client" {
  export function gql(
    source: "\n  fragment CompletionCoreFields on Completion {\n    id\n    course_id\n    user_id\n    email\n    student_number\n    completion_language\n    completion_link\n    completion_date\n    tier\n    grade\n    eligible_for_ects\n    project_completion\n    registered\n    created_at\n    updated_at\n  }\n",
  ): typeof import("./graphql").CompletionCoreFieldsFragmentDoc
  export function gql(
    source: "\n  fragment CompletionCourseFields on Course {\n    ...CourseWithPhotoCoreFields\n    has_certificate\n  }\n  \n",
  ): typeof import("./graphql").CompletionCourseFieldsFragmentDoc
  export function gql(
    source: "\n  fragment CompletionDetailedFields on Completion {\n    ...CompletionCoreFields\n    completions_registered {\n      ...CompletionRegisteredCoreFields\n    }\n  }\n  \n  \n",
  ): typeof import("./graphql").CompletionDetailedFieldsFragmentDoc
  export function gql(
    source: "\n  fragment CompletionDetailedFieldsWithCourse on Completion {\n    ...CompletionDetailedFields\n    course {\n      ...CompletionCourseFields\n    }\n  }\n  \n  \n",
  ): typeof import("./graphql").CompletionDetailedFieldsWithCourseFragmentDoc
  export function gql(
    source: "\n  fragment CompletionsQueryNodeFields on Completion {\n    ...CompletionCoreFields\n    user {\n      ...UserCoreFields\n    }\n    course {\n      ...CourseCoreFields\n      id\n      name\n    }\n    completions_registered {\n      id\n      organization {\n        id\n        slug\n      }\n    }\n  }\n  \n  \n  \n",
  ): typeof import("./graphql").CompletionsQueryNodeFieldsFragmentDoc
  export function gql(
    source: "\n  fragment CompletionsQueryConnectionFields on QueryCompletionsPaginated_type_Connection {\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n    edges {\n      node {\n        ...CompletionsQueryNodeFields\n      }\n    }\n  }\n  \n",
  ): typeof import("./graphql").CompletionsQueryConnectionFieldsFragmentDoc
  export function gql(
    source: "\n  fragment CompletionRegisteredCoreFields on CompletionRegistered {\n    id\n    completion_id\n    organization_id\n    organization {\n      id\n      slug\n    }\n    created_at\n    updated_at\n  }\n",
  ): typeof import("./graphql").CompletionRegisteredCoreFieldsFragmentDoc
  export function gql(
    source: "\n  fragment CourseCoreFields on Course {\n    id\n    slug\n    name\n    description\n    ects\n    created_at\n    updated_at\n  }\n",
  ): typeof import("./graphql").CourseCoreFieldsFragmentDoc
  export function gql(
    source: "\n  fragment CourseWithPhotoCoreFields on Course {\n    ...CourseCoreFields\n    photo {\n      ...ImageCoreFields\n    }\n  }\n  \n  \n",
  ): typeof import("./graphql").CourseWithPhotoCoreFieldsFragmentDoc
  export function gql(
    source: "\n  fragment CourseTranslationCoreFields on CourseTranslation {\n    id\n    course_id\n    language\n    name\n    created_at\n    updated_at\n  }\n",
  ): typeof import("./graphql").CourseTranslationCoreFieldsFragmentDoc
  export function gql(
    source: "\n  fragment CourseFields on Course {\n    ...CourseWithPhotoCoreFields\n    order\n    study_module_order\n    promote\n    status\n    start_point\n    study_module_start_point\n    hidden\n    description\n    link\n    upcoming_active_link\n    tier\n    support_email\n    teacher_in_charge_email\n    teacher_in_charge_name\n    start_date\n    end_date\n    course_translations {\n      ...CourseTranslationCoreFields\n    }\n    study_modules {\n      ...StudyModuleCoreFields\n    }\n    photo {\n      ...ImageCoreFields\n    }\n  }\n  \n  \n  \n",
  ): typeof import("./graphql").CourseFieldsFragmentDoc
  export function gql(
    source: "\n  fragment EditorCourseFields on Course {\n    ...CourseFields\n    instructions\n    has_certificate\n    upcoming_active_link\n    completions_handled_by {\n      ...CourseCoreFields\n    }\n    course_variants {\n      id\n      slug\n      description\n    }\n    course_aliases {\n      id\n      course_code\n    }\n    user_course_settings_visibilities {\n      id\n      language\n    }\n  }\n  \n  \n",
  ): typeof import("./graphql").EditorCourseFieldsFragmentDoc
  export function gql(
    source: "\n  fragment EditorCourseDetailedFields on Course {\n    ...EditorCourseFields\n    course_translations {\n      ...CourseTranslationCoreFields\n      description\n      instructions\n      link\n    }\n    open_university_registration_links {\n      ...OpenUniversityRegistrationLinkCoreFields\n    }\n    inherit_settings_from {\n      id\n    }\n    automatic_completions\n    automatic_completions_eligible_for_ects\n    exercise_completions_needed\n    points_needed\n  }\n  \n  \n  \n",
  ): typeof import("./graphql").EditorCourseDetailedFieldsFragmentDoc
  export function gql(
    source: "\n  fragment EditorCourseOtherCoursesFields on Course {\n    ...CourseWithPhotoCoreFields\n    course_translations {\n      ...CourseTranslationCoreFields\n    }\n  }\n  \n  \n",
  ): typeof import("./graphql").EditorCourseOtherCoursesFieldsFragmentDoc
  export function gql(
    source: "\n  fragment EmailTemplateCoreFields on EmailTemplate {\n    id\n    name\n    title\n    txt_body\n    html_body\n    template_type\n    created_at\n    updated_at\n  }\n",
  ): typeof import("./graphql").EmailTemplateCoreFieldsFragmentDoc
  export function gql(
    source: "\n  fragment EmailTemplateFields on EmailTemplate {\n    ...EmailTemplateCoreFields\n    triggered_automatically_by_course_id\n    exercise_completions_threshold\n    points_threshold\n  }\n  \n",
  ): typeof import("./graphql").EmailTemplateFieldsFragmentDoc
  export function gql(
    source: "\n  fragment ExerciseCoreFields on Exercise {\n    id\n    name\n    custom_id\n    course_id\n    part\n    section\n    max_points\n    deleted\n  }\n",
  ): typeof import("./graphql").ExerciseCoreFieldsFragmentDoc
  export function gql(
    source: "\n  fragment ExerciseCompletionCoreFields on ExerciseCompletion {\n    id\n    exercise_id\n    user_id\n    created_at\n    updated_at\n    attempted\n    completed\n    timestamp\n    n_points\n    exercise_completion_required_actions {\n      id\n      exercise_completion_id\n      value\n    }\n  }\n",
  ): typeof import("./graphql").ExerciseCompletionCoreFieldsFragmentDoc
  export function gql(
    source: "\n  fragment ImageCoreFields on Image {\n    id\n    name\n    original\n    original_mimetype\n    compressed\n    compressed_mimetype\n    uncompressed\n    uncompressed_mimetype\n    created_at\n    updated_at\n  }\n",
  ): typeof import("./graphql").ImageCoreFieldsFragmentDoc
  export function gql(
    source: "\n  fragment OpenUniversityRegistrationLinkCoreFields on OpenUniversityRegistrationLink {\n    id\n    course_code\n    language\n    link\n  }\n",
  ): typeof import("./graphql").OpenUniversityRegistrationLinkCoreFieldsFragmentDoc
  export function gql(
    source: "\n  fragment OrganizationCoreFields on Organization {\n    id\n    slug\n    hidden\n    created_at\n    updated_at\n    # required_confirmation\n    # required_organization_email\n    organization_translations {\n      id\n      organization_id\n      language\n      name\n      information\n    }\n  }\n",
  ): typeof import("./graphql").OrganizationCoreFieldsFragmentDoc
  export function gql(
    source: "\n  fragment ProgressCoreFields on Progress {\n    course {\n      ...CourseCoreFields\n    }\n    user_course_progress {\n      ...UserCourseProgressCoreFields\n    }\n    user_course_service_progresses {\n      ...UserCourseServiceProgressCoreFields\n    }\n  }\n  \n  \n  \n",
  ): typeof import("./graphql").ProgressCoreFieldsFragmentDoc
  export function gql(
    source: "\n  fragment StudyModuleCoreFields on StudyModule {\n    id\n    slug\n    name\n    created_at\n    updated_at\n  }\n",
  ): typeof import("./graphql").StudyModuleCoreFieldsFragmentDoc
  export function gql(
    source: "\n  fragment StudyModuleFields on StudyModule {\n    ...StudyModuleCoreFields\n    description\n    image\n    order\n  }\n  \n",
  ): typeof import("./graphql").StudyModuleFieldsFragmentDoc
  export function gql(
    source: "\n  fragment StudyModuleTranslationFields on StudyModuleTranslation {\n    id\n    study_module_id\n    language\n    name\n    description\n    created_at\n    updated_at\n  }\n",
  ): typeof import("./graphql").StudyModuleTranslationFieldsFragmentDoc
  export function gql(
    source: "\n  fragment StudyModuleDetailedFields on StudyModule {\n    ...StudyModuleFields\n    study_module_translations {\n      ...StudyModuleTranslationFields\n    }\n  }\n  \n  \n",
  ): typeof import("./graphql").StudyModuleDetailedFieldsFragmentDoc
  export function gql(
    source: "\n  fragment UserCoreFields on User {\n    id\n    upstream_id\n    first_name\n    last_name\n    username\n    email\n    student_number\n    real_student_number\n    created_at\n    updated_at\n  }\n",
  ): typeof import("./graphql").UserCoreFieldsFragmentDoc
  export function gql(
    source: "\n  fragment UserDetailedFields on User {\n    ...UserCoreFields\n    administrator\n    research_consent\n  }\n  \n",
  ): typeof import("./graphql").UserDetailedFieldsFragmentDoc
  export function gql(
    source: "\n  fragment UserProgressesFields on User {\n    ...UserCoreFields\n    progresses {\n      ...ProgressCoreFields\n    }\n  }\n  \n  \n",
  ): typeof import("./graphql").UserProgressesFieldsFragmentDoc
  export function gql(
    source: "\n  fragment UserOverviewFields on User {\n    ...UserDetailedFields\n    completions {\n      ...CompletionDetailedFields\n      course {\n        ...CourseWithPhotoCoreFields\n        has_certificate\n      }\n    }\n  }\n  \n  \n  \n",
  ): typeof import("./graphql").UserOverviewFieldsFragmentDoc
  export function gql(
    source: "\n  fragment UserCourseProgressCoreFields on UserCourseProgress {\n    id\n    course_id\n    user_id\n    max_points\n    n_points\n    progress\n    extra\n    exercise_progress {\n      total\n      exercises\n    }\n    created_at\n    updated_at\n  }\n",
  ): typeof import("./graphql").UserCourseProgressCoreFieldsFragmentDoc
  export function gql(
    source: "\n  fragment UserCourseServiceProgressCoreFields on UserCourseServiceProgress {\n    id\n    course_id\n    service_id\n    user_id\n    progress\n    service {\n      name\n      id\n    }\n    created_at\n    updated_at\n  }\n",
  ): typeof import("./graphql").UserCourseServiceProgressCoreFieldsFragmentDoc
  export function gql(
    source: "\n  fragment UserCourseSettingCoreFields on UserCourseSetting {\n    id\n    user_id\n    course_id\n    created_at\n    updated_at\n  }\n",
  ): typeof import("./graphql").UserCourseSettingCoreFieldsFragmentDoc
  export function gql(
    source: "\n  fragment UserCourseSettingDetailedFields on UserCourseSetting {\n    ...UserCourseSettingCoreFields\n    language\n    country\n    research\n    marketing\n    course_variant\n    other\n  }\n  \n",
  ): typeof import("./graphql").UserCourseSettingDetailedFieldsFragmentDoc
  export function gql(
    source: "\n  fragment StudentProgressesQueryNodeFields on UserCourseSetting {\n    ...UserCourseSettingCoreFields\n    user {\n      ...UserCoreFields\n      progress(course_id: $course_id) {\n        ...ProgressCoreFields\n      }\n    }\n  }\n  \n  \n  \n",
  ): typeof import("./graphql").StudentProgressesQueryNodeFieldsFragmentDoc
  export function gql(
    source: "\n  fragment UserProfileUserCourseSettingsQueryNodeFields on UserCourseSetting {\n    ...UserCourseSettingDetailedFields\n    course {\n      ...CourseCoreFields\n    }\n  }\n  \n  \n",
  ): typeof import("./graphql").UserProfileUserCourseSettingsQueryNodeFieldsFragmentDoc
  export function gql(
    source: "\n  fragment UserCourseSummaryCourseFields on Course {\n    ...CourseWithPhotoCoreFields\n    has_certificate\n    exercises {\n      ...ExerciseCoreFields\n    }\n  }\n  \n  \n",
  ): typeof import("./graphql").UserCourseSummaryCourseFieldsFragmentDoc
  export function gql(
    source: "\n  fragment UserCourseSummaryCoreFields on UserCourseSummary {\n    course {\n      ...UserCourseSummaryCourseFields\n    }\n    exercise_completions {\n      ...ExerciseCompletionCoreFields\n    }\n    user_course_progress {\n      ...UserCourseProgressCoreFields\n    }\n    user_course_service_progresses {\n      ...UserCourseServiceProgressCoreFields\n    }\n    completion {\n      ...CompletionDetailedFields\n    }\n  }\n  \n  \n  \n  \n",
  ): typeof import("./graphql").UserCourseSummaryCoreFieldsFragmentDoc
  export function gql(
    source: "\n  fragment UserOrganizationCoreFields on UserOrganization {\n    id\n    user_id\n    organization_id\n    # confirmed\n    # consented\n    organization {\n      ...OrganizationCoreFields\n    }\n    created_at\n    updated_at\n  }\n  \n",
  ): typeof import("./graphql").UserOrganizationCoreFieldsFragmentDoc
  export function gql(
    source: "\n  mutation CreateRegistrationAttemptDate(\n    $id: ID!\n    $completion_registration_attempt_date: DateTime!\n  ) {\n    createRegistrationAttemptDate(\n      id: $id\n      completion_registration_attempt_date: $completion_registration_attempt_date\n    ) {\n      id\n      completion_registration_attempt_date\n    }\n  }\n",
  ): typeof import("./graphql").CreateRegistrationAttemptDateDocument
  export function gql(
    source: "\n  mutation RecheckCompletions($slug: String) {\n    recheckCompletions(slug: $slug)\n  }\n",
  ): typeof import("./graphql").RecheckCompletionsDocument
  export function gql(
    source: "\n  mutation AddManualCompletion(\n    $course_id: String!\n    $completions: [ManualCompletionArg!]\n  ) {\n    addManualCompletion(course_id: $course_id, completions: $completions) {\n      ...CompletionCoreFields\n      user {\n        ...UserCoreFields\n      }\n    }\n  }\n  \n  \n",
  ): typeof import("./graphql").AddManualCompletionDocument
  export function gql(
    source: "\n  mutation AddCourse($course: CourseCreateArg!) {\n    addCourse(course: $course) {\n      ...EditorCourseDetailedFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").AddCourseDocument
  export function gql(
    source: "\n  mutation UpdateCourse($course: CourseUpsertArg!) {\n    updateCourse(course: $course) {\n      ...EditorCourseDetailedFields\n      completion_email {\n        ...EmailTemplateCoreFields\n      }\n      course_stats_email {\n        ...EmailTemplateCoreFields\n      }\n    }\n  }\n  \n  \n",
  ): typeof import("./graphql").UpdateCourseDocument
  export function gql(
    source: "\n  mutation DeleteCourse($id: ID!) {\n    deleteCourse(id: $id) {\n      ...CourseCoreFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").DeleteCourseDocument
  export function gql(
    source: "\n  mutation UpdateEmailTemplate(\n    $id: ID!\n    $name: String\n    $html_body: String\n    $txt_body: String\n    $title: String\n    $template_type: String\n    $triggered_automatically_by_course_id: String\n    $exercise_completions_threshold: Int\n    $points_threshold: Int\n  ) {\n    updateEmailTemplate(\n      id: $id\n      name: $name\n      html_body: $html_body\n      txt_body: $txt_body\n      title: $title\n      template_type: $template_type\n      triggered_automatically_by_course_id: $triggered_automatically_by_course_id\n      exercise_completions_threshold: $exercise_completions_threshold\n      points_threshold: $points_threshold\n    ) {\n      ...EmailTemplateFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").UpdateEmailTemplateDocument
  export function gql(
    source: "\n  mutation AddEmailTemplate(\n    $name: String!\n    $html_body: String\n    $txt_body: String\n    $title: String\n    $template_type: String\n    $triggered_automatically_by_course_id: String\n    $exercise_completions_threshold: Int\n    $points_threshold: Int\n  ) {\n    addEmailTemplate(\n      name: $name\n      html_body: $html_body\n      txt_body: $txt_body\n      title: $title\n      template_type: $template_type\n      triggered_automatically_by_course_id: $triggered_automatically_by_course_id\n      exercise_completions_threshold: $exercise_completions_threshold\n      points_threshold: $points_threshold\n    ) {\n      ...EmailTemplateFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").AddEmailTemplateDocument
  export function gql(
    source: "\n  mutation DeleteEmailTemplate($id: ID!) {\n    deleteEmailTemplate(id: $id) {\n      ...EmailTemplateCoreFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").DeleteEmailTemplateDocument
  export function gql(
    source: "\n  mutation AddStudyModule($study_module: StudyModuleCreateArg!) {\n    addStudyModule(study_module: $study_module) {\n      ...StudyModuleDetailedFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").AddStudyModuleDocument
  export function gql(
    source: "\n  mutation UpdateStudyModule($study_module: StudyModuleUpsertArg!) {\n    updateStudyModule(study_module: $study_module) {\n      ...StudyModuleDetailedFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").UpdateStudyModuleDocument
  export function gql(
    source: "\n  mutation DeleteStudyModule($id: ID!) {\n    deleteStudyModule(id: $id) {\n      ...StudyModuleCoreFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").DeleteStudyModuleDocument
  export function gql(
    source: "\n  mutation UpdateUserName($first_name: String, $last_name: String) {\n    updateUserName(first_name: $first_name, last_name: $last_name) {\n      ...UserCoreFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").UpdateUserNameDocument
  export function gql(
    source: "\n  mutation UpdateResearchConsent($value: Boolean!) {\n    updateResearchConsent(value: $value) {\n      id\n    }\n  }\n",
  ): typeof import("./graphql").UpdateResearchConsentDocument
  export function gql(
    source: "\n  mutation UserCourseStatsSubscribe($id: ID!) {\n    createCourseStatsSubscription(id: $id) {\n      id\n    }\n  }\n",
  ): typeof import("./graphql").UserCourseStatsSubscribeDocument
  export function gql(
    source: "\n  mutation UserCourseStatsUnsubscribe($id: ID!) {\n    deleteCourseStatsSubscription(id: $id) {\n      id\n    }\n  }\n",
  ): typeof import("./graphql").UserCourseStatsUnsubscribeDocument
  export function gql(
    source: "\n  mutation AddUserOrganization($user_id: ID!, $organization_id: ID!) {\n    addUserOrganization(user_id: $user_id, organization_id: $organization_id) {\n      id\n    }\n  }\n",
  ): typeof import("./graphql").AddUserOrganizationDocument
  export function gql(
    source: "\n  mutation UpdateUserOrganization($id: ID!, $role: OrganizationRole) {\n    updateUserOrganization(id: $id, role: $role) {\n      id\n    }\n  }\n",
  ): typeof import("./graphql").UpdateUserOrganizationDocument
  export function gql(
    source: "\n  mutation DeleteUserOrganization($id: ID!) {\n    deleteUserOrganization(id: $id) {\n      id\n    }\n  }\n",
  ): typeof import("./graphql").DeleteUserOrganizationDocument
  export function gql(
    source: "\n  query PaginatedCompletions(\n    $course: String!\n    $cursor: String\n    $completionLanguage: String\n    $search: String\n  ) {\n    completionsPaginated(\n      course: $course\n      completion_language: $completionLanguage\n      search: $search\n      first: 50\n      after: $cursor\n    ) {\n      ...CompletionsQueryConnectionFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").PaginatedCompletionsDocument
  export function gql(
    source: "\n  query PaginatedCompletionsPreviousPage(\n    $course: String!\n    $cursor: String\n    $completionLanguage: String\n    $search: String\n  ) {\n    completionsPaginated(\n      course: $course\n      completion_language: $completionLanguage\n      search: $search\n      last: 50\n      before: $cursor\n    ) {\n      ...CompletionsQueryConnectionFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").PaginatedCompletionsPreviousPageDocument
  export function gql(
    source: "\n  query Courses($language: String) {\n    courses(orderBy: { order: asc }, language: $language) {\n      ...CourseFields\n      user_course_settings_visibilities {\n        id\n        language\n      }\n    }\n  }\n  \n",
  ): typeof import("./graphql").CoursesDocument
  export function gql(
    source: "\n  query EditorCourses(\n    $search: String\n    $hidden: Boolean\n    $handledBy: String\n    $status: [CourseStatus!]\n  ) {\n    courses(\n      orderBy: { name: asc }\n      search: $search\n      hidden: $hidden\n      handledBy: $handledBy\n      status: $status\n    ) {\n      ...EditorCourseFields\n    }\n    currentUser {\n      id\n      administrator\n    }\n  }\n  \n",
  ): typeof import("./graphql").EditorCoursesDocument
  export function gql(
    source: "\n  query CourseFromSlug($slug: String!) {\n    course(slug: $slug) {\n      ...CourseCoreFields\n      description\n      instructions\n    }\n  }\n  \n",
  ): typeof import("./graphql").CourseFromSlugDocument
  export function gql(
    source: "\n  query CourseEditorOtherCourses {\n    courses {\n      ...EditorCourseOtherCoursesFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").CourseEditorOtherCoursesDocument
  export function gql(
    source: "\n  query HandlerCourses {\n    handlerCourses {\n      ...CourseCoreFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").HandlerCoursesDocument
  export function gql(
    source: "\n  query CourseEditorDetails($slug: String) {\n    course(slug: $slug) {\n      ...EditorCourseDetailedFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").CourseEditorDetailsDocument
  export function gql(
    source: "\n  query EmailTemplateEditorCourses {\n    courses {\n      ...CourseCoreFields\n      teacher_in_charge_name\n      teacher_in_charge_email\n      start_date\n      completion_email {\n        ...EmailTemplateCoreFields\n      }\n      course_stats_email {\n        ...EmailTemplateCoreFields\n      }\n    }\n  }\n  \n  \n",
  ): typeof import("./graphql").EmailTemplateEditorCoursesDocument
  export function gql(
    source: "\n  query CourseDashboard($slug: String!) {\n    course(slug: $slug) {\n      ...CourseCoreFields\n      teacher_in_charge_name\n      teacher_in_charge_email\n      start_date\n      completion_email {\n        ...EmailTemplateCoreFields\n      }\n      course_stats_email {\n        ...EmailTemplateCoreFields\n      }\n    }\n  }\n  \n  \n",
  ): typeof import("./graphql").CourseDashboardDocument
  export function gql(
    source: "\n  query EmailTemplates {\n    email_templates {\n      ...EmailTemplateFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").EmailTemplatesDocument
  export function gql(
    source: "\n  query EmailTemplate($id: ID!) {\n    email_template(id: $id) {\n      ...EmailTemplateFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").EmailTemplateDocument
  export function gql(
    source: "\n  query Organizations {\n    organizations {\n      id\n      slug\n      hidden\n      # required_confirmation\n      # required_organization_email\n      organization_translations {\n        language\n        name\n        information\n      }\n    }\n  }\n",
  ): typeof import("./graphql").OrganizationsDocument
  export function gql(
    source: "\n  query OrganizationById($id: ID!) {\n    organization(id: $id) {\n      hidden\n      organization_translations {\n        name\n      }\n    }\n  }\n",
  ): typeof import("./graphql").OrganizationByIdDocument
  export function gql(
    source: "\n  query StudyModules($language: String) {\n    study_modules(orderBy: { id: asc }, language: $language) {\n      ...StudyModuleFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").StudyModulesDocument
  export function gql(
    source: "\n  query EditorStudyModules {\n    study_modules(orderBy: { id: asc }) {\n      ...StudyModuleDetailedFields\n    }\n  }\n  \n  \n",
  ): typeof import("./graphql").EditorStudyModulesDocument
  export function gql(
    source: "\n  query EditorStudyModuleDetails($slug: String!) {\n    study_module(slug: $slug) {\n      ...StudyModuleFields\n      courses {\n        ...CourseCoreFields\n      }\n      study_module_translations {\n        ...StudyModuleTranslationFields\n      }\n    }\n  }\n  \n  \n  \n",
  ): typeof import("./graphql").EditorStudyModuleDetailsDocument
  export function gql(
    source: "\n  query StudyModuleExists($slug: String!) {\n    study_module_exists(slug: $slug)\n  }\n",
  ): typeof import("./graphql").StudyModuleExistsDocument
  export function gql(
    source: "\n  query CurrentUser {\n    currentUser {\n      ...UserCoreFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").CurrentUserDocument
  export function gql(
    source: "\n  query CurrentUserDetailed {\n    currentUser {\n      ...UserDetailedFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").CurrentUserDetailedDocument
  export function gql(
    source: "\n  query CurrentUserStatsSubscriptions {\n    currentUser {\n      id\n      course_stats_subscriptions {\n        id\n        email_template {\n          id\n        }\n      }\n    }\n  }\n",
  ): typeof import("./graphql").CurrentUserStatsSubscriptionsDocument
  export function gql(
    source: "\n  query UserSummary($upstream_id: Int) {\n    user(upstream_id: $upstream_id) {\n      id\n      username\n      user_course_summary {\n        ...UserCourseSummaryCoreFields\n      }\n    }\n  }\n  \n",
  ): typeof import("./graphql").UserSummaryDocument
  export function gql(
    source: "\n  query CurrentUserUserOverview {\n    currentUser {\n      ...UserOverviewFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").CurrentUserUserOverviewDocument
  export function gql(
    source: "\n  query UserOverview($upstream_id: Int) {\n    user(upstream_id: $upstream_id) {\n      ...UserOverviewFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").UserOverviewDocument
  export function gql(
    source: "\n  query UserProgresses {\n    currentUser {\n      ...UserProgressesFields\n    }\n  }\n  \n",
  ): typeof import("./graphql").UserProgressesDocument
  export function gql(
    source: "\n  query UserDetailsContains(\n    $search: String!\n    $first: Int\n    $last: Int\n    $before: String\n    $after: String\n    $skip: Int\n  ) {\n    userDetailsContains(\n      search: $search\n      first: $first\n      last: $last\n      before: $before\n      after: $after\n      skip: $skip\n    ) {\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        node {\n          ...UserCoreFields\n        }\n      }\n      count(search: $search)\n    }\n  }\n  \n",
  ): typeof import("./graphql").UserDetailsContainsDocument
  export function gql(
    source: "\n  query ConnectedUser {\n    currentUser {\n      ...UserCoreFields\n      verified_users {\n        id\n        created_at\n        updated_at\n        display_name\n        organization {\n          id\n          organization_translations {\n            language\n            name\n          }\n        }\n      }\n    }\n  }\n  \n",
  ): typeof import("./graphql").ConnectedUserDocument
  export function gql(
    source: "\n  query ConnectionTest {\n    currentUser {\n      ...UserCoreFields\n      verified_users {\n        id\n        organization {\n          slug\n          organization_translations {\n            language\n            name\n          }\n        }\n        created_at\n        personal_unique_code\n        display_name\n      }\n    }\n  }\n  \n",
  ): typeof import("./graphql").ConnectionTestDocument
  export function gql(
    source: "\n  query ExportUserCourseProgresses(\n    $course_slug: String!\n    $skip: Int\n    $take: Int\n  ) {\n    userCourseProgresses(course_slug: $course_slug, skip: $skip, take: $take) {\n      id\n      user {\n        ...UserCoreFields\n      }\n      progress\n      user_course_settings {\n        course_variant\n        country\n        language\n      }\n    }\n  }\n  \n",
  ): typeof import("./graphql").ExportUserCourseProgressesDocument
  export function gql(
    source: "\n  query StudentProgresses(\n    $course_id: ID!\n    $skip: Int\n    $after: String\n    $search: String\n  ) {\n    userCourseSettings(\n      course_id: $course_id\n      first: 15\n      after: $after\n      skip: $skip\n      search: $search\n    ) {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        node {\n          ...StudentProgressesQueryNodeFields\n        }\n      }\n      totalCount\n    }\n  }\n  \n",
  ): typeof import("./graphql").StudentProgressesDocument
  export function gql(
    source: "\n  query UserProfileUserCourseSettings($upstream_id: Int) {\n    userCourseSettings(user_upstream_id: $upstream_id, first: 50) {\n      edges {\n        node {\n          ...UserProfileUserCourseSettingsQueryNodeFields\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n  \n",
  ): typeof import("./graphql").UserProfileUserCourseSettingsDocument
  export function gql(
    source: "\n  query CurrentUserOrganizations {\n    currentUser {\n      user_organizations {\n        ...UserOrganizationCoreFields\n        # user_organization_join_confirmations {\n        #   ...UserOrganizationJoinConfirmationData\n        # }\n      }\n    }\n  }\n  \n",
  ): typeof import("./graphql").CurrentUserOrganizationsDocument
  export function gql(
    source: "\n  query UserOrganizations($user_id: ID) {\n    userOrganizations(user_id: $user_id) {\n      id\n      organization {\n        id\n      }\n    }\n  }\n",
  ): typeof import("./graphql").UserOrganizationsDocument
  export function gql(source: string): unknown

  export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
    TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
}
