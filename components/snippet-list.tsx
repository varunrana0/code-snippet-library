"use client";

import { Snippet } from "@/types";
import { SnippetCard } from "@/components/snippet-card";

interface SnippetListProps {
  snippets: Snippet[];
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
}

export function SnippetList({ snippets, onEdit, onDelete }: SnippetListProps) {
  if (snippets.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">
          No snippets found. Create your first snippet!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {snippets.map((snippet, index) => (
        <SnippetCard
          key={index}
          snippet={snippet}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
