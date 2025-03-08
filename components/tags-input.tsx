"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export function TagsInput({ value, onChange }: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    if (!inputValue.trim()) return;

    // Don't add duplicate tags
    if (!value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
    }

    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Add a tag..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow"
        />
        <Button type="button" onClick={addTag} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <Badge
            key={tag}
            variant="default"
            className="px-2 py-1 bg-black cursor-pointer"
            onClick={() => removeTag(tag.trim())}
          >
            {tag}
            <X key={tag} className="ml-2 h-3 w-3 cursor-pointer" />
          </Badge>
        ))}
      </div>
    </div>
  );
}
