import { Snippet, SnippetStore } from "@/types";

const STORAGE_KEY = "code-snippet-library";

export const getSnippets = (): Snippet[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const data: SnippetStore = stored ? JSON.parse(stored) : { snippets: [] };
    return data.snippets;
  } catch (error) {
    console.error("Failed to load snippets from storage:", error);
    return [];
  }
};

export const saveSnippets = (snippets: Snippet[]): void => {
  if (typeof window === "undefined") return;

  try {
    const data: SnippetStore = { snippets };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save snippets to storage:", error);
  }
};

export const addSnippet = (snippet: Snippet): void => {
  const snippets = getSnippets();
  saveSnippets([...snippets, snippet]);
};

export const updateSnippet = (updatedSnippet: Snippet): void => {
  const snippets = getSnippets();
  const updated = snippets.map((snippet) =>
    snippet.id === updatedSnippet.id ? updatedSnippet : snippet
  );
  saveSnippets(updated);
};

export const deleteSnippet = (id: string): void => {
  const snippets = getSnippets();
  const filtered = snippets.filter((snippet) => snippet.id !== id);
  saveSnippets(filtered);
};

export const searchSnippets = (query: string): Snippet[] => {
  const snippets = getSnippets();
  if (!query.trim()) return snippets;

  const lowerQuery = query.toLowerCase();
  return snippets.filter(
    (snippet) =>
      snippet.title.toLowerCase().includes(lowerQuery) ||
      snippet.description.toLowerCase().includes(lowerQuery) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      snippet.language.toLowerCase().includes(lowerQuery)
  );
};

export const filterSnippetsByLanguage = (language: string): Snippet[] => {
  if (!language || language === "all") return getSnippets();

  const snippets = getSnippets();
  return snippets.filter((snippet) => snippet.language === language);
};

export const exportSnippets = (): string => {
  const snippets = getSnippets();
  return JSON.stringify({ snippets }, null, 2);
};

export const importSnippets = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);

    // Extracting the first array found in the JSON if `snippets` is not present
    let snippets: Snippet[] = [];

    if (Array.isArray(data.snippets)) {
      snippets = data.snippets;
    } else {
      // Try to find the first array in the object
      const firstArray = Object.values(data).find((value) =>
        Array.isArray(value)
      );
      console.log({ firstArray });
      if (Array.isArray(firstArray)) {
        snippets = firstArray as Snippet[];
      } else {
        throw new Error("No valid array found in the imported data.");
      }
    }

    saveSnippets(snippets);
    return true;
  } catch (error) {
    console.error("Failed to import snippets:", error);
    return false;
  }
};
