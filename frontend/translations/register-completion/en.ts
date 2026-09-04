export default {
  title: "Register Completion",
  course: "Course: {{course}}",
  credits: "Credits: {{ects}}",
  studentTypeQuestion:
    "Are you a student or an exchange student at the University of Helsinki?",
  studentTypeQuestionHint:
    "Open University students and everyone else: select No.",
  yes: "Yes",
  no: "No",
  sisuInstructions:
    "Enroll through your own Sisu account (Structure of studies) to register your credits.",
  sisuEmailNotice:
    "Your credits are matched to you by email address, so your Sisu profile must include <strong>{{email}}</strong>, the address you used on this course. If it is not your primary address in Sisu, add it as a secondary email address in your Sisu settings.",
  sisuLink: "Go to Sisu",
  credits_details:
    "Credits for this course are registered through the Open University of the University of Helsinki.",
  donow:
    'Fill in the Open University enrollment form. Use <strong>{{email}}</strong> as your email address there. Enrollment requires strong authentication, see the <a href="{{infoUrl}}" target="_blank" rel="noopener noreferrer">open university enrollment page</a> for details.',
  InstructionsEmail:
    "Use this email address on the enrollment form: <strong>{{email}}</strong>. If you use a different address, we cannot match your enrollment to your completion and your credits will not be registered.",
  grades: "Credits will be registered within a few days.",
  link: "To the enrollment form",
  linkAria:
    "To the enrollment form. External link to the Open University opens in a new tab.",
  emailChangedTitle:
    "I have changed my email address since completing this course",
  emailChangedBody:
    "The email address shown on this page, <strong>{{email}}</strong>, is the one you were using on the platform when you completed this course. Registration only recognizes that address. Even if you have since changed your email address here, you must use <strong>{{email}}</strong> for this registration. If you use a different address, you will not get your credits.",
  course_completion_not_found_title: "Completion not found",
  course_completion_not_found:
    "Cannot find course completion. Are you logged in with the right account?",
  course_not_found_title: "Course not found",
  course_not_found:
    "Cannot find course {{course}}. Check the link you received and try again.",
  course_completion_already_registered_title: "Completion already registered",
  course_completion_already_registered:
    "Course completion has already been registered.",
  see_completion_link:
    "After your completion has been registered, you can view your completed credits at Koski: ",
  see_completion_NB:
    "<strong>NOTE!</strong> There is some delay on registering a completion and the credits being visible at Koski.",
  open_university_registration_not_open:
    "Open University registration is not open at the moment for the course",
  registrationClosed:
    "Open University Registration will be closed from May 15th through May 30th 2021.",
  error: "Error",
  notLoggedIn: "You are not logged in. Please log in to the site.",
  fi_FI: "Finnish",
  en_US: "English",
  sv_SE: "Swedish",
} as const
