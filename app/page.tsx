"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchBar } from "@/components/search-bar";
import { LanguageFilter } from "@/components/language-filter";
import { SnippetForm } from "@/components/snippet-form";
import { SnippetList } from "@/components/snippet-list";
import { Snippet } from "@/types";
import {
  getSnippets,
  addSnippet,
  updateSnippet,
  deleteSnippet,
  searchSnippets,
  filterSnippetsByLanguage,
  exportSnippets,
} from "@/lib/storage";
import { PlusCircle, Download } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [tab, setTab] = useState("all");

  // Load snippets from localStorage on initial load
  useEffect(() => {
    const loadedSnippets = getSnippets();
    console.log({ loadedSnippets });
    setSnippets(loadedSnippets);
  }, []);

  // Create a filtered list of snippets based on search and language filter
  const filteredSnippets = useMemo(() => {
    let filtered = snippets;

    if (searchQuery) {
      filtered = searchSnippets(searchQuery);
    } else if (languageFilter !== "all") {
      filtered = filterSnippetsByLanguage(languageFilter);
    }

    // Sort by updatedAt date (newest first)
    console.log({ filtered });
    return [...filtered].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [snippets, searchQuery, languageFilter]);

  const handleCreateSnippet = (snippet: Snippet) => {
    addSnippet(snippet);
    setSnippets(getSnippets());
    setIsFormOpen(false);

    toast("Snippet created", {
      description: "Your code snippet has been saved.",
    });
  };

  const handleUpdateSnippet = (snippet: Snippet) => {
    updateSnippet(snippet);
    setSnippets(getSnippets());
    setEditingSnippet(undefined);
    toast("Snippet updated", {
      description: "Your code snippet has been updated.",
    });
  };

  const handleDeleteSnippet = (id: string) => {
    if (confirm("Are you sure you want to delete this snippet?")) {
      deleteSnippet(id);
      setSnippets(getSnippets());
      toast("Snippet deleted", {
        description: "Your code snippet has been removed.",
      });
    }
  };

  const handleEditSnippet = (snippet: Snippet) => {
    setEditingSnippet(snippet);
  };

  const handleExport = () => {
    const jsonData = exportSnippets();
    const blob = new Blob([jsonData], { type: "application/json" });
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

  // const handleImport = () => {
  //   const input = document.createElement("input");
  //   input.type = "file";
  //   input.accept = ".json";

  //   input.onchange = (e) => {
  //     const file = (e.target as HTMLInputElement).files?.[0];
  //     if (!file) return;

  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       const content = event.target?.result as string;
  //       console.log({ content });
  //       const success = importSnippets(content);

  //       if (success) {
  //         setSnippets(getSnippets());
  //         toast("Snippets imported", {
  //           description: "Your snippets have been imported successfully.",
  //         });
  //       } else {
  //         toast("Import failed", {
  //           description: "The file format is invalid.",
  //           descriptionClassName: "destructive",
  //         });
  //       }
  //     };

  //     reader.readAsText(file);
  //   };

  //   input.click();
  // };

  return (
    <div className="w-full container mx-auto py-6 max-w-7xl px-5">
      <header className="mb-8 w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between items-baseline space-y-4 sm:space-y-0 w-full">
          <h1 className="text-3xl font-bold w-full ">Code Snippet Library</h1>
          <div className="flex gap-2 items-center w-full">
            <Button
              onClick={() => setIsFormOpen(true)}
              className="sm:ml-auto md:w-fit"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Snippet
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              className="md:w-fit"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <main>
        <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All Snippets</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>

          <div className="mt-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-3">
            <div className="w-full sm:w-1/4">
              <SearchBar query={searchQuery} onSearch={setSearchQuery} />
            </div>
            <div className="w-full sm:w-1/3">
              <LanguageFilter
                value={languageFilter}
                onChange={setLanguageFilter}
              />
            </div>
          </div>
          <TabsContent value="all" className="mt-6">
            <SnippetList
              snippets={filteredSnippets}
              onEdit={handleEditSnippet}
              onDelete={handleDeleteSnippet}
            />
          </TabsContent>

          <TabsContent value="recent" className="mt-6">
            <SnippetList
              snippets={filteredSnippets.slice(0, 6)}
              onEdit={handleEditSnippet}
              onDelete={handleDeleteSnippet}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Create snippet dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Snippet</DialogTitle>
          </DialogHeader>
          <SnippetForm
            onSubmit={handleCreateSnippet}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit snippet dialog */}
      <Dialog
        open={!!editingSnippet}
        onOpenChange={(open) => {
          if (!open) setEditingSnippet(undefined);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Snippet</DialogTitle>
          </DialogHeader>
          {editingSnippet && (
            <SnippetForm
              initialData={editingSnippet}
              onSubmit={handleUpdateSnippet}
              onCancel={() => setEditingSnippet(undefined)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
