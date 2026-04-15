import type { Subject } from "@/types/subject";

export type SubjectGuideTag = "beginner" | "advanced" | "creative" | "jobReady";

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function normalizeSubjectHtml(input: string): string {
  return decodeHtmlEntities(input).trim();
}

export function stripHtml(input: string): string {
  return normalizeSubjectHtml(input).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function makeSubjectExcerpt(subject: Subject, maxLen = 130): string {
  const plain = stripHtml(subject.description ?? "");
  if (!plain) return "";
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen).trim()}...`;
}

export function inferSubjectGuideTags(subject: Subject): SubjectGuideTag[] {
  const text = `${subject.name} ${stripHtml(subject.description ?? "")}`.toLowerCase();
  const tags: SubjectGuideTag[] = [];

  if (/(basic|beginner|foundation|starter|intro)/.test(text)) {
    tags.push("beginner");
  }
  if (/(advanced|logic|algorithm|problem solving|intermediate)/.test(text)) {
    tags.push("advanced");
  }
  if (/(design|creative|art|ui|ux|media)/.test(text)) {
    tags.push("creative");
  }
  if (/(career|project|practical|job|real world|portfolio)/.test(text)) {
    tags.push("jobReady");
  }

  if (tags.length === 0) {
    tags.push("beginner");
  }

  return tags.slice(0, 2);
}
