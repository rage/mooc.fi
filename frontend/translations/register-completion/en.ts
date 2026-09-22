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
  sisuInstructionsHeading: "Enroll in Sisu",
  finnishIdQuestion:
    "Are you Finnish, or do you have a Finnish personal identity code (henkilötunnus)?",
  needQuestionTitle: "Which do you need?",
  needQuestionBody:
    "Credits in the University of Helsinki study registry are useful mainly if you study in Finland. If you only want to show that you completed this course (to your own school, employer, or someone else), a certificate is enough.",
  needCertificateOption: "A certificate of completion",
  needCreditsOption: "Credits in the UH study registry",
  certificateHandoffHeading: "Your certificate is ready",
  certificateHandoffBody:
    "A certificate of completion is available for this course. Create it here and you can show it right away.",
  identificationQuestionTitle:
    "Are you able to identify yourself with one of the Suomi.fi e-identification methods?",
  identificationQuestionBody:
    "Enrollment requires strong authentication. Choose how you will identify yourself when you log in to Sisu.",
  identificationEidasOption: "eIDAS",
  identificationOtherSuomiFiOption: "Another Suomi.fi e-identification method",
  identificationNoneOption: "No",
  identificationEidasExplanation:
    'eIDAS lets you identify yourself with an electronic ID issued by another EU or EEA country. <a href="{{url}}" target="_blank" rel="noopener noreferrer">Check which countries you can use it from<span style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;"> (opens in a new tab)</span></a>.',
  identificationOtherSuomiFiExplanation:
    'Suomi.fi also accepts other Finnish identification methods, such as online banking codes or a mobile certificate. <a href="{{url}}" target="_blank" rel="noopener noreferrer">See all accepted identification methods<span style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;"> (opens in a new tab)</span></a>.',
  identificationEidasTip:
    "In Sisu, choose Suomi.fi e-identification when prompted to authenticate. Then select Identification methods for foreigners.",
  identificationOtherSuomiFiTip:
    "In Sisu, choose Suomi.fi e-identification when prompted to authenticate. Then select your identification method.",
  reconsiderTitle: "Reconsider",
  reconsiderBody:
    "Without a Suomi.fi e-identification method, enrollment asks you to contact our support team, and we verify your identity manually. This can take from a few days to several weeks, and we may ask you for extra documents. If a certificate meets your need, you can get it right away.",
  justificationTitle: "Tell us why",
  justificationBody:
    "This process asks more of you than a normal enrollment, and it takes staff time on our side. Tell us briefly why you need the credits in the University of Helsinki study registry instead of the certificate. This helps us understand these situations and find ways to make this easier in the future.",
  justificationLabel:
    "Why do you need the credits in the study registry instead of a certificate?",
  justificationContinue: "Continue",
  updateReason: "Update reason",
  justificationSaveFailed:
    "Saving your answer failed. Check your connection and try again.",
  openUniversityInstructionsHeading: "Enroll through Open University",
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
