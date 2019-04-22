export interface UserInfo {
  id: number;
  username: string;
  email: string;
  administrator: boolean;
  user_field: UserField;
  extra_fields: ExtraFields;
  completed_enough: boolean | undefined;
}

export interface ExtraFields {}

export interface UserField {
  first_name: string;
  last_name: string;
  html1: string;
  organizational_id: string;
  course_announcements: boolean;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toUserInfo(json: string): UserInfo {
    return JSON.parse(json);
  }

  public static userInfoToJson(value: UserInfo): string {
    return JSON.stringify(value);
  }
}
