import { omit } from "lodash";
import { TagFormValues } from "./types";
import { TagCoreFieldsFragment } from "/graphql/generated";

export function toTagForm(tags: TagCoreFieldsFragment[]): Array<TagFormValues> {
  return tags.map((tag) => ({
    ...omit(tag, ["__typename", "id", "name"]),
    _id: tag.id,
    hidden: tag.hidden ?? false,
    types: tag.types ?? [],
    tag_translations: (tag.tag_translations ?? []).map((tt) => ({
      ...omit(tt, ["__typename"]),
      language: tt.language ?? undefined,
      description: tt.description ?? undefined
    }))
  }))
}

export function fromTagForm(tags: TagFormValues) {
  return tags
}