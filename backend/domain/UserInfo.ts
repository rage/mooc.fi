export interface UserInfo {
  id: number
  username: string
  email: string
  user_field: UserField
  extra_fields: ExtraFields
  administrator: boolean
  //password: string
}

export interface ExtraFields {}

export interface UserField {
  first_name: string
  last_name: string
  html1: string
  organizational_id: string
  course_announcements: boolean
}

export interface OrganizationInfo {
  name: string
  information: string | null
  slug: string
  verified_at: string
  verified: boolean
  disabled: boolean
  disabled_reason: string | null
  created_at: string
  updated_at: string
  hidden: boolean
  creator_id: Number
  logo_file_name: string | null
  logo_content_type: string | null
  logo_file_size: Number | null
  logo_updated_at: string
  phone: string
  contact_information: string | null
  email: string | null
  website: string | null
  pinned: boolean
  whilelisted_ips: [string] | []
}

// Converts JSON strings to/from your types
export class Convert {
  public static toUserInfo(json: string): UserInfo {
    return JSON.parse(json)
  }

  public static userInfoToJson(value: UserInfo): string {
    return JSON.stringify(value)
  }
}
