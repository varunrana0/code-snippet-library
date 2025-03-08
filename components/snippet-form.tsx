"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagsInput } from "@/components/tags-input";
import { LANGUAGES, Snippet, SnippetFormData } from "@/types";

interface SnippetFormProps {
  initialData?: Snippet;
  onSubmit: (snippet: Snippet) => void;
  onCancel: () => void;
}

export function SnippetForm({
  initialData,
  onSubmit,
  onCancel,
}: SnippetFormProps) {
  const [formData, setFormData] = useState<SnippetFormData>(
    initialData || {
      title: "",
      code: "",
      language: "javascript",
      description: "",
      tags: [],
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLanguageChange = (value: string) => {
    setFormData({ ...formData, language: value });
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData({ ...formData, tags });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date().toISOString();

    const snippet: Snippet = {
      id: initialData?.id || uuidv4(),
      ...formData,
      createdAt: initialData?.createdAt || now,
      updatedAt: now,
    };

    onSubmit(snippet);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Snippet title"
          required
        />
      </div>

      <div>
        <label htmlFor="language" className="block text-sm font-medium mb-1">
          Language
        </label>
        <Select value={formData.language} onValueChange={handleLanguageChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((language) => (
              <SelectItem key={language.value} value={language.value}>
                {language.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="code" className="block text-sm font-medium mb-1">
          Code
        </label>
        <Textarea
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="Paste your code here"
          className="font-mono h-40"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe what this code does"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1">
          Tags
        </label>
        <TagsInput value={formData.tags} onChange={handleTagsChange} />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? "Update Snippet" : "Create Snippet"}
        </Button>
      </div>
    </form>
  );
}
