export function contentValue(content:Record<string,unknown>, key:string, fallback="") {
 const value=content[key];
 return typeof value==="string" ? value : fallback;
}
export function parentLabel(father:string|null,mother:string|null) {
 return [father,mother].filter(Boolean).join(" & ");
}
