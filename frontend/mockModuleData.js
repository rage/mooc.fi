export const mockModules = {
  study_modules: [
    {
      id: "21d838c9-54c7-4fbb-8e4c-91e8f14f0d73",
      image: "../../public/images/modules/WebModule.jpg",
      study_module_translations: [
        {
          id: "0616fba6-e119-4d77-9b71-2b0fae2101b3",
          language: "en",
          name: "Web development",
          description: "Become a super professional web developer and unicorn",
        },
        {
          id: "948698ce-837c-4e0e-93f6-679ea2688691",
          language: "fi",
          name: "Verkko-ohjelmointi",
          description: "Opi ohjelmoimaan verkkosovelluksia ja ole yksisarvinen",
        },
      ],
      courses: [
        {
          id: "03dfa6a0-5854-4e71-ace6-e796ff851915",
          slug: "docker",
          photo: "../../public/images/courseimages/tikape.jpg",
          promote: true,
          status: "Active",
          start_point: true,
          course_translations: [
            {
              id: "766b966b-5691-4867-8b0a-62bef040df05",
              language: "fi",
              name: "DevOps with Docker",
              description: "Opi mikropalveluitsemaan Dockerilla.",
              link: "https://docker-hy.github.io",
            },
            {
              id: "dda3697a-0edb-4722-9996-201450994c90",
              language: "en",
              name: "DevOps with Docker",
              description: "Become as master of containers.",
              link: "https://docker-hy.github.io",
            },
          ],
        },
        {
          id: "bb772ed2-7eb0-4876-9fae-9659700edc16",
          slug: "fullstack-harkka",
          photo: "../../public/images/courseimages/fullstack.2.png",
          promote: false,
          status: "Active",
          start_point: false,
          course_translations: [
            {
              id: "6ee5bc43-2b18-4bbc-90ca-1acccf445fcf",
              language: "en",
              name: "Full Stack Project",
              description: "Do modern webmagics.",
              link: "https://fullstackopen.com/en/",
            },
            {
              id: "f3a9bf22-79a9-4720-9118-37728289a228",
              language: "fi",
              name: "Full Stack Harjoitustyö",
              description: "Rakenna oma websovellus noin 170 tunnissa.",
              link: "https://fullstackopen.com/",
            },
          ],
        },
        {
          id: "dabb43a1-3e39-4ef9-ad9a-6b183fbc4cbb",
          slug: "fullstack",
          photo: "../../public/images/courseimages/fullstack.2.png",
          promote: false,
          status: "Active",
          start_point: true,
          course_translations: [
            {
              id: "589de8a6-d57a-40b4-b936-77b469fd6bbb",
              language: "en",
              name: "Full Stack open 2019",
              description: "Deep dive into modern web development.",
              link: "https://fullstackopen.com/en",
            },
            {
              id: "d1295201-8c6a-41f6-8928-9bf562bb0a61",
              language: "fi",
              name: "Full Stack open 2019",
              description: "Syväsykellus moderniin websovelluskehitykseen.",
              link: "https://fullstackopen.com",
            },
          ],
        },
      ],
    },
    {
      id: "662f537e-4395-40db-a32d-710b51fa169e",
      image: "../../public/images/modules/CodeModule.jpg",
      study_module_translations: [
        {
          id: "9fa46739-8993-4b32-8624-00d30e47830b",
          language: "fi",
          name: "Ohjelmointitaidot",
          description: "Opi ohjelmoitsemaan taitavasti.",
        },
        {
          id: "b6781675-4b03-4bfa-b717-ae40f4262b74",
          language: "en",
          name: "Programming skills",
          description: "Learn programming.",
        },
      ],
      courses: [
        {
          id: "4591d276-af80-4e5c-8bb0-305d4923bcc6",
          slug: "tira",
          photo: "../../public/images/courseimages/tira.png",
          promote: false,
          status: "Active",
          start_point: false,
          course_translations: [
            {
              id: "5922bacc-ccb0-4c21-924a-3ae8204efcc8",
              language: "en",
              name: "Data structures and algorithms",
              description: "Become algorithmic wizard.",
              link: "https://google.com",
            },
            {
              id: "b4dd88b7-a52e-47db-b8bc-d19c538369d9",
              language: "fi",
              name: "Tietorakenteet ja algoritmit",
              description: "Ratkaise kinkkisiä ongelmia salamannopeasti",
              link: "https://google.com",
            },
          ],
        },
        {
          id: "7c409f15-60b5-4aea-9841-d42cb5070800",
          slug: "mooc1",
          photo: "../../public/images/courseimages/doggos.png",
          promote: true,
          status: "Active",
          start_point: true,
          course_translations: [
            {
              id: "6286dcfe-4b22-408a-bc63-39f4a92bb25e",
              language: "en",
              name: "Programming with Java I",
              description:
                "Learn the basics of computer programming with Java.",
              link: "http://moocfi.github.io/courses/2013/programming-part-1/",
            },
            {
              id: "63abf913-642a-4ffc-aa14-f3b2ac929dd4",
              language: "fi",
              name: "Ohjelmoinnin MOOC I 2019",
              description:
                "Ohjelmointia Javalla perusteista lähtien, sekä mahdollisuus opinto-oikeuteen. Täydellinen kurssi ohjelmoinnin alkeiden opetteluun. Ei vaadi esitietoja.",
              link: "https://ohjelmointi-19.mooc.fi/",
            },
          ],
        },
        {
          id: "af48ac2b-6790-45d0-8413-61ffca25e962",
          slug: "tito",
          photo:
            "../../public/images/courseimages/tietokoneen-toiminnan-perusteet.jpg",
          promote: false,
          status: "Active",
          start_point: false,
          course_translations: [
            {
              id: "5c318e80-1818-473c-90fa-367c5b7404a6",
              language: "fi",
              name: "Tietokoneen toiminta",
              description: "Hae juustoa jääkaapista, Kuusta tai Jupiterista.",
              link: "https://google.com",
            },
          ],
        },
        {
          id: "ec3877c5-b768-453e-9998-f7068b8c2463",
          slug: "mooc2",
          photo: "../../public/images/courseimages/doggos.png",
          promote: false,
          status: "Active",
          start_point: false,
          course_translations: [
            {
              id: "9276fe6d-cbd7-4287-96e2-887133c07374",
              language: "en",
              name: "Programming with Java II",
              description: "Direct continuation of part I.",
              link: "http://moocfi.github.io/courses/2013/programming-part-2/",
            },
            {
              id: "c5a07cec-c96e-4cd9-9d05-621c2a0f7629",
              language: "fi",
              name: "Ohjelmoinnin MOOC II 2019",
              description: "Ohjelmoinnin jatkokurssi.",
              link: "https://ohjelmointi-19.mooc.fi/",
            },
          ],
        },
      ],
    },
  ],
}
