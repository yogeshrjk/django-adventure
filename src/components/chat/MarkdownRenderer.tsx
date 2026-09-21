"use client";

import { useState, type ReactElement } from "react";
import { Check, Copy, Terminal, Code2 } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  isSensei?: boolean;
}

// Tokenize Python & Django syntax for fast, crisp client-side highlighting
function highlightCode(code: string, language = "python"): string {
  // Escape HTML
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Strings (single, double, triple quotes)
  html = html.replace(
    /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g,
    '<span class="text-[#7ee787]">$1</span>'
  );

  // Comments (# comment)
  html = html.replace(
    /(#.*$|\/\/.*$)/gm,
    '<span class="text-[#8b949e] italic">$1</span>'
  );

  // Django Template tags {{ ... }} and {% ... %}
  html = html.replace(
    /({[{%][\s\S]*?[%}]})/g,
    '<span class="text-[#d2a8ff] font-bold">$1</span>'
  );

  // Python / JS Keywords
  const keywords =
    /\b(def|class|import|from|return|if|elif|else|for|while|in|is|not|and|or|try|except|finally|with|as|pass|raise|break|continue|lambda|yield|True|False|None|async|await|const|let|var|function)\b/g;
  html = html.replace(keywords, '<span class="text-[#f2b705] font-bold">$1</span>');

  // Common Python / Django built-in functions & classes
  const builtins =
    /\b(print|len|range|str|int|float|list|dict|set|tuple|super|type|self|models|views|urls|path|re_path|include|render|redirect|get_object_or_404|HttpResponse|JsonResponse|Model|CharField|IntegerField|DateTimeField|ForeignKey|CASCADE|serializers|ModelSerializer|APIView|ViewSet|objects|filter|get|create|all|save|delete)\b/g;
  html = html.replace(builtins, '<span class="text-[#79c0ff]">$1</span>');

  // Numbers
  html = html.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="text-[#ffa657]">$1</span>');

  return html;
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLang = (language || "python").toLowerCase();

  return (
    <div className="my-2.5 overflow-hidden rounded-md border-2 border-[#191924] bg-[#0d0d15] text-white shadow-[3px_3px_0_#191924] dark:border-black">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#161622] px-3 py-1.5 text-xs font-mono">
        <span className="flex items-center gap-1.5 text-[#f2b705] font-bold uppercase tracking-wider text-[11px]">
          <Code2 className="h-3.5 w-3.5" />
          <span>{displayLang}</span>
        </span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-[11px] font-sans font-bold text-white transition hover:bg-white/20 active:scale-95"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-400" />
              <span className="text-green-400">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed text-[#e6edf3]">
        <code dangerouslySetInnerHTML={{ __html: highlightCode(code, displayLang) }} />
      </pre>
    </div>
  );
}

// Inline formatting parser (bold, italic, inline code)
function formatInlineText(text: string) {    const parts: (string | ReactElement)[] = [];
  // Regex to match inline code (`code`), bold (**bold**), and italic (*italic*)
  const regex = /(`[^`\r\n]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("`") && token.endsWith("`")) {
      const codeContent = token.slice(1, -1);
      parts.push(
        <code
          key={match.index}
          className="rounded border border-black/20 bg-black/10 px-1.5 py-0.5 font-mono text-[11px] font-bold text-[#d62839] dark:bg-white/10 dark:text-[#f2b705]"
        >
          {codeContent}
        </code>
      );
    } else if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-black text-[#191924] dark:text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(<em key={match.index}>{token.slice(1, -1)}</em>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Split into code blocks (triple backticks) and markdown text blocks
  const blocks: { type: "code" | "text"; content: string; language?: string }[] = [];
  const codeBlockRegex = /```([a-zA-Z0-9_\-+]+)?\s*[\r\n]+([\s\S]*?)(?:```|$)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({
        type: "text",
        content: content.slice(lastIndex, match.index),
      });
    }

    blocks.push({
      type: "code",
      language: (match[1] || "python").trim(),
      content: match[2].trim(),
    });

    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    blocks.push({
      type: "text",
      content: content.slice(lastIndex),
    });
  }

  return (
    <div className="space-y-2 leading-relaxed break-words">
      {blocks.map((block, idx) => {
        if (block.type === "code") {
          return (
            <CodeBlock
              key={idx}
              code={block.content}
              language={block.language || "python"}
            />
          );
        }

        // Render text block lines (paragraphs, bullet points, headers)
        const lines = block.content.split("\n");
        return (
          <div key={idx} className="space-y-1.5">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lineIdx} className="h-1" />;

              // Horizontal Rule (---, ***, ___)
              if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
                return (
                  <hr
                    key={lineIdx}
                    className="my-2.5 border-t-2 border-dashed border-[#191924]/30 dark:border-white/20"
                  />
                );
              }

              // Blockquote (> quote)
              if (trimmed.startsWith("> ")) {
                return (
                  <div
                    key={lineIdx}
                    className="my-1.5 rounded-r border-l-4 border-[#f2b705] bg-[#f2b705]/10 px-2.5 py-1 text-xs font-bold italic"
                  >
                    {formatInlineText(trimmed.slice(2))}
                  </div>
                );
              }

              // Headers
              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={lineIdx} className="font-comic text-base text-[#191924] dark:text-[#f2b705] mt-2 mb-1">
                    {trimmed.slice(4)}
                  </h3>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h2 key={lineIdx} className="font-comic text-lg text-[#191924] dark:text-[#f2b705] mt-2.5 mb-1">
                    {trimmed.slice(3)}
                  </h2>
                );
              }
              if (trimmed.startsWith("# ")) {
                return (
                  <h1 key={lineIdx} className="font-comic text-xl text-[#191924] dark:text-[#f2b705] mt-3 mb-1">
                    {trimmed.slice(2)}
                  </h1>
                );
              }

              // Bullet points
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return (
                  <div key={lineIdx} className="flex items-start gap-1.5 pl-2">
                    <span className="text-[#f2b705] font-black">•</span>
                    <span>{formatInlineText(trimmed.slice(2))}</span>
                  </div>
                );
              }

              // Numbered list
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
              if (numMatch) {
                return (
                  <div key={lineIdx} className="flex items-start gap-1.5 pl-2">
                    <span className="font-mono text-xs font-black text-[#2f6bff]">{numMatch[1]}.</span>
                    <span>{formatInlineText(numMatch[2])}</span>
                  </div>
                );
              }

              return <p key={lineIdx}>{formatInlineText(line)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}
