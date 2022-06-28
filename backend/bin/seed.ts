import { CourseStatus, CourseTranslation } from "@prisma/client"

import prisma from "../prisma"

const Modules = [
  {
    id: "21d838c9-54c7-4fbb-8e4c-91e8f14f0d73",
    slug: "webdev",
    name: "Web development",
    image: "WebModule.jpg",
    study_module_translations: [
      {
        id: "0616fba6-e119-4d77-9b71-2b0fae2101b3",
        language: "en_US",
        name: "Web development",
        description: "Become a super professional web developer and unicorn",
      },
      {
        id: "948698ce-837c-4e0e-93f6-679ea2688691",
        language: "fi_FI",
        name: "Verkko-ohjelmointi",
        description: "Opi ohjelmoimaan verkkosovelluksia ja ole yksisarvinen",
      },
    ],
  },
  {
    id: "662f537e-4395-40db-a32d-710b51fa169e",
    slug: "program",
    name: "Programming skills",
    image: "CodeModule.jpg",
    study_module_translations: [
      {
        id: "9fa46739-8993-4b32-8624-00d30e47830b",
        language: "fi_FI",
        name: "Ohjelmointitaidot",
        description: "Opi ohjelmoitsemaan taitavasti.",
      },
      {
        id: "b6781675-4b03-4bfa-b717-ae40f4262b74",
        language: "en_US",
        name: "Programming skills",
        description: "Learn programming.",
      },
    ],
  },
]

const Courses = [
  {
    id: "jdoifsbf",
    name: "Ohjelmoinnin MOOC 2019",
    slug: "ohpe",
    course_translations: [
      {
        name: "Ohjelmoinnin MOOC 2019",
        language: "fi_FI",
        description:
          "Ohjelmointia Javalla perusteista lähtien sekä mahdollisuus opinto-oikeuteen. Täydellinen kurssi ohjelmoinnin alkeiden opetteluun. Ei vaadi esitietoja.",
        link: "https://ohjelmointi-19.mooc.fi/",
      },
    ],
    promote: true,
    status: "Active",
    start_point: true,
    study_modules: ["662f537e-4395-40db-a32d-710b51fa169e"],
  },
  {
    id: "dgoijdgoijf8904",
    name: "Full stack open 2019",
    slug: "fullstack",
    course_translations: [
      {
        id: "idojgf4903",
        name: "Full stack open 2019",
        language: "fi_FI",
        description:
          "Syväsukellus moderniin websovelluskehitykseen — ota haltuusi React, Redux, Node.js, GraphQL ja MongoDB! Kurssi alkaa 15.3. ja päättyy 15.12.",
        link: "https://fullstackopen.com/",
      },
      {
        id: "djgisopgjiotrx",
        name: "Full stack open 2019",
        language: "en_US",
        description:
          "Deep dive into modern web development — learn to master React, Redux, Node.js, GraphQL and MongoDB!",
        link: "https://fullstackopen.com/en/",
      },
    ],
    promote: false,
    status: "Active",
    start_point: true,
    study_modules: ["21d838c9-54c7-4fbb-8e4c-91e8f14f0d73"],
  },
  {
    id: "tfujhgfdgrs",
    name: "Elements of AI",
    slug: "elements-of-ai",
    course_translations: [
      {
        id: "ifghdfdh",
        name: "Elements of AI",
        language: "fi_FI",
        description:
          "Vievätkö robotit työmme? Miten tekoäly muuttaa työelämää seuraavan 10 vuoden aikana? Millainen yhteiskunnallinen vaikutus tekoälyllä on?",
        link: "https://www.elementsofai.com/fi",
      },
      {
        id: "fsysrtyrzsj",
        name: "Elements of AI",
        language: "en_US",
        description:
          "Will robots take our jobs? How will artificial intelligence change our working life in the next 10 years? How will intelligence impact our society?",
        link: "https://www.elementsofai.com/",
      },
    ],
    promote: true,
    status: "Active",
    start_point: true,
  },
  {
    id: "hftsgtraet",
    name: "Data Analysis with Python",
    slug: "data-analysis-python",
    course_translations: [
      {
        id: "gdstreedst",
        name: "Data Analysis with Python",
        language: "fi_FI",
        description:
          "Course gives a practical introduction to data analysis using a large number of programming exercises and a project delving into the realm of a selected field of science. Starts on June 19th.",
        link: "https://saskeli.github.io/data-analysis-with-python-summer-2019/",
      },
      {
        id: "sefdtgw4ya",
        name: "Data Analysis with Python",
        language: "en_US",
        description:
          "Course gives a practical introduction to data analysis using a large number of programming exercises and a project delving into the realm of a selected field of science. Starts on June 19th.",
        link: "https://saskeli.github.io/data-analysis-with-python-summer-2019/",
      },
    ],
    promote: false,
    status: "Active",
    start_point: true,
  },
  {
    id: "hfhdrr",
    name: "Web-palvelinohjelmointi Java",
    slug: "wepa",
    course_translations: [
      {
        id: "jyr6876",
        name: "Web-palvelinohjelmointi JAVA",
        language: "fi_FI",
        description:
          "Java-kielisten web-sovellusten toteutus tutuksi. Opi mm. Spring sovelluskehyksen periaatteet.Kurssi on käynnissä. Ensimmäisen osan tehtävien deadline on 18.3. Kurssi päättyy 10.5.",
        link: "https://web-palvelinohjelmointi-19.mooc.fi/",
      },
    ],
    promote: false,
    status: "Ended",
    start_point: false,
    study_modules: ["21d838c9-54c7-4fbb-8e4c-91e8f14f0d73"],
  },
  {
    id: "gsrhrthrs",
    name: "Johdatus tietoliikenteeseen",
    slug: "johto",
    course_translations: [
      {
        id: "fdnjeso",
        name: "Johdatus tietoliikenteeseen",
        language: "fi_FI",
        description:
          "Miten internet toimii? Opi miten tietokoneet, puhelimet ja palvelimet keskustelevat verkon yli. Mitä ovat reitittimet ja kytkimet?",
        link: "https://johdatus-tietoliikenteeseen-19.mooc.fi/",
      },
    ],
    promote: true,
    status: "Ended",
    start_point: true,
  },
  {
    id: "es646rki",
    name: "DevOps with Docker",
    slug: "docker",
    course_translations: [
      {
        id: "545thjftfhes",
        name: "DevOps with Docker",
        language: "fi_FI",
        description:
          "Miten sovellusten käyttöönotto tapahtuu nykyään? Tällä kurssilla tutustutaan Dockeriin ja docker-composeen. Samalla opit monista erilaisista osista joista webpalvelut koostuvat.",
        link: "https://docker-hy.github.io/",
      },
      {
        id: "ewiau8a43",
        name: "DevOps with Docker",
        language: "en_US",
        description:
          "Learn the basics of modern software deployment in this introductory course to Docker and docker-compose. Explore different parts of web services, such as reverse proxies, databases etc.",
        link: "https://docker-hy.github.io/",
      },
    ],
    promote: false,
    status: "Active",
    start_point: true,
  },
  {
    id: "egdfhftuer65745",
    name: "Tietokantojen perusteet",
    slug: "tikape",
    course_translations: [
      {
        id: "gdjiaoter",
        name: "Tietokantojen perusteet",
        language: "fi_FI",
        description:
          "Miten tietokannat toimivat? Opi SQL-kielen perusteet, relaatietokantojen suunnittelun ja käytön, sekä tietokantaa käyttävien ohjelmistojen perusteet.",
        link: "https://tietokantojen-perusteet-19.mooc.fi/",
      },
    ],
    promote: false,
    status: "Ended",
    start_point: true,
    study_modules: ["662f537e-4395-40db-a32d-710b51fa169e"],
  },
  {
    id: "dhyrrtutrutrik",
    name: "Tietorakenteet ja algoritmit",
    slug: "tira",
    course_translations: [
      {
        id: "gdfgtewt",
        name: "Tietorakenteet ja algoritmit",
        language: "fi_FI",
        description:
          "Osaat jo ohjelmoida mutta haluat kehittyä lisää. Opi suunnittelemaan tehokkaita algoritmeja, joilla voit ratkaista kinkkisiä ongelmia salamannopeasti. Kurssi alkaa näillä näkymin syksyllä 2019.",
        link: "https://tietokantojen-perusteet-19.mooc.fi/",
      },
    ],
    promote: false,
    status: "Upcoming",
    start_point: true,
    study_modules: ["662f537e-4395-40db-a32d-710b51fa169e"],
  },
  {
    id: "290e6506-00e3-433d-b938-1a258b6b04f2",
    name: "Tietokoneen toiminnan perusteet",
    slug: "tito",
    course_translations: [
      {
        id: "fsdedhbdf",
        name: "Tietokoneen toiminnan perusteet",
        language: "fi_FI",
        description:
          "Mitä tietokoneet ovat ja miten ne toimivat? Opi alkeet millaisista osista ja toiminnallisuuksista nämä meille elintärkeät laitteet koostuvat.",
        link: "",
      },
    ],
    promote: false,
    status: "Upcoming",
    start_point: true,
    study_modules: ["662f537e-4395-40db-a32d-710b51fa169e"],
  },
  {
    id: "hfdhgdrdeetteet4et4",
    name: "Cyber Security Base",
    slug: "cyber",
    course_translations: [
      {
        id: "fsjieojewoirtjoi",
        name: "Cyber Security Base",
        language: "fi_FI",
        description:
          "Become a cyber security professional. Cyber Security Base focuses on building core knowledge and abilities related to the work of a cyber security professional. Starts on October 28th.",
        link: "",
      },
      {
        id: "gndjrozipa5390",
        name: "Cyber Security Base",
        language: "en_US",
        description:
          "Become a cyber security professional. Cyber Security Base focuses on building core knowledge and abilities related to the work of a cyber security professional. Starts on October 28th.",
        link: "",
      },
    ],
    promote: false,
    status: "Upcoming",
    start_point: true,
  },
  {
    id: "sgjdeirotueori",
    name: "Ohjelmoinnin MOOC 2018",
    slug: "ohpe18",
    course_translations: [
      {
        id: "jfsjoidfoijdfoijdfsoijdfsoij",
        name: "Ohjelmoinnin MOOC 2018",
        language: "fi_FI",
        description:
          "Ohjelmointia Javalla perusteista lähtien sekä mahdollisuus opinto-oikeuteen. Täydellinen kurssi ohjelmoinnin alkeiden opetteluun. Ei vaadi esitietoja.",
        link: "",
      },
    ],
    promote: false,
    status: "Ended",
    start_point: true,
    study_modules: ["662f537e-4395-40db-a32d-710b51fa169e"],
  },
  {
    id: "4545thythyggh",
    name: "Cyber Security Base(2018)",
    slug: "cyber2018",
    course_translations: [
      {
        id: "4243trhftghf",
        name: "Cyber Security Base(2018)",
        language: "fi_FI",
        description:
          "Become a cyber security professional. Cyber Security Base focuses on building core knowledge and abilities related to the work of a cyber security professional.",
        link: "https://cybersecuritybase.mooc.fi/",
      },
      {
        id: "75tyjfxkhmx,kgxmj",
        name: "Cyber Security Base(2018)",
        language: "en_US",
        description:
          "Become a cyber security professional. Cyber Security Base focuses on building core knowledge and abilities related to the work of a cyber security professional.",
        link: "https://cybersecuritybase.mooc.fi/",
      },
    ],
    promote: false,
    status: "Ended",
    start_point: true,
  },
  {
    id: "<rwjogh<ugrixtjö",
    name: "2013 Programming with Java I",
    slug: "ohpe13",
    course_translations: [
      {
        id: "75tyjfxkhmx,kgxmj",
        name: "2013 Programming with Java I",
        language: "en_US",
        description:
          "Learn the basics of computer programming, algorithms and object-oriented programming using the Java programming language.",
        link: "http://moocfi.github.io/courses/2013/programming-part-1/",
      },
    ],
    promote: true,
    status: "Active",
    start_point: true,
    study_modules: ["662f537e-4395-40db-a32d-710b51fa169e"],
  },
  {
    id: "<rwjghrsyt",
    name: "2013 Programming with Java II",
    slug: "ohpe13-2",
    course_translations: [
      {
        id: "75tyjfxkhmx,kgxmj",
        name: "2013 Programming with Java II",
        language: "en_US",
        description:
          "This course is a direct continuation of the course Object-Oriented Programming with Java, part I.",
        link: "http://moocfi.github.io/courses/2013/programming-part-2/",
      },
    ],
    promote: false,
    status: "Active",
    start_point: true,
    study_modules: ["662f537e-4395-40db-a32d-710b51fa169e"],
  },
]

const seed = async () => {
  await prisma.studyModule.deleteMany({ where: {} })
  await prisma.course.deleteMany({ where: {} })

  await Promise.all(
    Modules.map(async (module) => {
      const _module = {
        ...module,
        study_module_translations: module.study_module_translations
          ? {
              create: (module.study_module_translations || []).map((t) => ({
                ...t,
                id: undefined,
              })),
            }
          : undefined,
      }

      return await prisma.studyModule.create({
        data: _module,
      })
    }),
  )

  return await Promise.all(
    Courses.map(async (course) => {
      const _course = {
        ...course,
        id: undefined,
        photo: undefined,
        teacher_in_charge_name: "",
        teacher_in_charge_email: "",
        start_date: "",
        status: course.status as CourseStatus,
        course_translations: course.course_translations
          ? {
              create:
                (course?.course_translations as CourseTranslation[])?.map(
                  (t) => ({
                    ...t,
                    id: undefined,
                    link: t.link || "",
                  }),
                ) ?? undefined,
            }
          : undefined,
        study_modules: undefined,
      }

      const newCourse = await prisma.course.create({ data: _course })
      if (course.study_modules) {
        await prisma.course.update({
          where: {
            id: newCourse.id,
          },
          data: {
            study_modules: {
              connect: course.study_modules.map((id) => ({
                id,
              })),
            },
          },
        })
      }

      return Promise.resolve()
    }),
  )
}

seed().finally(() => process.exit(0))
