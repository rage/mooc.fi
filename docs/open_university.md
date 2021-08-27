# Open University

This document was written mainly to describe how the new tiered credit system with the Open University system functions and is used. 

For new developers, it should be noted:
* Each course is assigned a unique Open University ID (where applicable).
* Once IDs are added, registration links are automatically fetched.
* Registration links are rotated and rechecked every 10 minutes with a cron job.

As of writing this, Building AI is the only course which uses the tiered system built for Open University compatability. Originally, we had only one Open University ID for Building AI, and course completion credits could be upgraded. When the Open University system changed, they could no longer upgrade completion credits. This led to us having three individual Open University IDs for each tier of Building AI. This way, we can check for completion on the MOOC backend, then present the correct registration links associated with each tier (which are considered courses in the MOOC system).

### Updating Open University IDs for Tiered Courses
There is fundamentally no difference updating Open University IDs of Tiered Courses from Normal Courses.

## Setting up an Upgradable Chain
There currently is no Dashboard / Input accessible way to add an upgrade chain for a course. This can be added using Datagrip into the database. Specifically, you would add this in the `open_university_registration_link` table in the `tiers` column.

This is an example of Building AI's upgrade chain: 
```
[
    {
        "tier":2,
        "name":"Building AI Intermediate",
        "course_id":"3a2790fc-227c-4045-9f4c-40a2bdabe76a",
        "adjacent":[]
    },
    {
        "tier":3,
        "name":"Building AI Advanced",
        "course_id":"0e9d1a22-0e19-4320-8c8c-84115bb26452",
        "adjacent":[
            {
                "tier":2,
                "name":"Building AI Intermediate",
                "course_id":"3a2790fc-227c-4045-9f4c-40a2bdabe76a"
            }
        ]
    }
]
```

The chain is added to the Handler Course's row. Beginner course credit isn't there because we don't award credits for it. Here's a break down of the JSON object:

* tier - The tier to display registration link upon completion
* name - The course name to be displayed on the registration page
* course_id - ID of the course tier
* adjacent - Courses while are displayed if the parent course is complete.

To give an example of the "adjacent" courses:
If Tier 2 is complete, we will only display the Tier 2 registration link.
If Tier 2 and Tier 3 are complete, we will display both Tier 2 and Tier 3 registration links.
If Tier 3 is complete, we will display both Tier 2 and Tier 3 registration links because Tier 2 is included in the Tier 3's adjacent array. 


