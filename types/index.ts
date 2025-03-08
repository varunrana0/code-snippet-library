export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type SnippetFormData = Omit<Snippet, "id" | "createdAt" | "updatedAt">;

export interface SnippetStore {
  snippets: Snippet[];
}

export type ProgrammingLanguage = {
  value: string;
  label: string;
};

export const LANGUAGES: ProgrammingLanguage[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "go", label: "Go" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "rust", label: "Rust" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
  { value: "markdown", label: "Markdown" },
  { value: "yaml", label: "YAML" },
  { value: "other", label: "Other" },
];
