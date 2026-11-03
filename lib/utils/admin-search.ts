/**
 * Normalize a search term before embedding it in a PostgREST .or() expression.
 * Keep Unicode letters, numbers and spaces; strip filter grammar and wildcard
 * characters so user input cannot alter the expression structure.
 */
export function sanitizeAdminSearch(value: string | undefined): string {
  return (value ?? "")
    .normalize("NFKC")
    .trim()
    .slice(0, 80)
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ");
}

/**
 * Collapse separators from names, slugs, and email addresses so a search such
 * as "mail@example.com" can match a normalized database search column.
 */
export function normalizeAdminSearchTerm(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("id-ID").replace(/[^\p{L}\p{N}]/gu, "");
}
