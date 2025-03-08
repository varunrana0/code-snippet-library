"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

interface CodeViewProps {
  code: string;
  language: string;
}

export function CodeView({ code, language }: CodeViewProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        size="sm"
        variant="ghost"
        className="absolute cursor-pointer top-2 right-2 text-white hover:text-black dark:bg-gray-800/80 z-10 text-xs"
        onClick={copyToClipboard}
      >
        <Copy className="text-xs h-10 w-10 mr-1" />
        {copied ? "Copied!" : "Copy"}
      </Button>
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{
          margin: 0,
          borderRadius: "8px",
          maxHeight: "350px",
          scrollbarWidth: "none",
        }}
        wrapLines
        wrapLongLines
        useInlineStyles
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
