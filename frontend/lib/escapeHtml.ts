const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}

/**
 * Escapes a value for use as text or a quoted attribute value in HTML.
 *
 * The translator inserts `{{variables}}` raw, so variables of a translation
 * rendered with `dangerouslySetInnerHTML` must go through this; plain React
 * text must not, or the entities would show up literally.
 */
export const escapeHtml = (value: unknown): string =>
  String(value).replace(/[&<>"']/g, (char) => HTML_ENTITIES[char])
