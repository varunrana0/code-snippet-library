"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeView } from "@/components/code-view";
import { Snippet } from "@/types";
import { Download, Edit, Trash2 } from "lucide-react";
import { LANGUAGES } from "@/types";
import { toast } from "sonner";

interface SnippetCardProps {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
}

export function SnippetCard({ snippet, onEdit, onDelete }: SnippetCardProps) {
  const getLanguageLabel = (value: string) => {
    const language = LANGUAGES.find((lang) => lang.value === value);
    return language?.label || value;
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString();
  };

  const handleExport = () => {
    const jsonData = JSON.stringify(snippet, null, 2);
    const blob = new Blob([jsonData], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = "code-snippets.json";
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast("Snippets exported", {
      description: "Your snippets have been exported to a JSON file.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{snippet.title}</CardTitle>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(snippet)}
              title="Edit snippet"
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              title="Export snippet"
              className="cursor-pointer"
            >
              <Download className="h-4 w-4 text-black" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(snippet.id)}
              title="Delete snippet"
              className="cursor-pointer"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {getLanguageLabel(snippet.language)} • Updated:{" "}
          {formatDate(snippet.updatedAt)}
        </div>
      </CardHeader>

      <CardContent>
        <CodeView code={snippet.code} language={snippet.language} />

        {snippet.description && (
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            {snippet.description}
          </p>
        )}
      </CardContent>

      {snippet.tags.length > 0 && (
        <CardFooter className="pt-0 flex flex-wrap gap-1">
          {snippet.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
