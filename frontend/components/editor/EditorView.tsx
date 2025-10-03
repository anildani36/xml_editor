"use client";

import React, { useCallback, useMemo, useEffect, useState } from "react";
import { createEditor, Descendant, Transforms, Editor, Element as SlateElement, Node } from "slate";
import { Slate, Editable, withReact, ReactEditor, useSlate } from "slate-react";
import { withHistory } from "slate-history";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  // icons from lucide-react
} from "lucide-react";

/* ---------------------------
   Types / helpers
   --------------------------- */

type CustomElement = { type: string; children: Descendant[]; [key: string]: any };
type CustomText = { text: string; bold?: boolean; italic?: boolean; underline?: boolean };

declare module "slate" {
  interface CustomTypes {
    Element: CustomElement;
    Text: CustomText;
  }
}

/* ---------------------------
   Initial value
   --------------------------- */

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "Welcome to the XML editor. Try formatting, copy as XML or paste XML." }],
  },
];

/* ---------------------------
   Serialization: Slate -> XML
   --------------------------- */

function serializeNodeToXML(node: Node): string {
  if (Editor.isEditor(node)) return node.children.map(serializeNodeToXML).join("");
  if (SlateElement.isElement(node)) {
    const tag = node.type === "paragraph" ? "p" : node.type;
    const inner = node.children.map(serializeNodeToXML).join("");
    return `<${tag}>${inner}</${tag}>`;
  }
  // text node
  let txt = node.text as string;
  // wrap with mark tags
  if ((node as CustomText).bold) txt = `<strong>${txt}</strong>`;
  if ((node as CustomText).italic) txt = `<em>${txt}</em>`;
  if ((node as CustomText).underline) txt = `<u>${txt}</u>`;
  // escape basic chars
  return txt
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function serializeSelectionToXML(editor: Editor): string {
  const { selection } = editor;
  if (!selection) {
    // full document
    return editor.children.map((n) => serializeNodeToXML(n)).join("");
  }
  // collect nodes in selection by slice
  const fragment = Editor.fragment(editor, selection);
  return fragment.map(serializeNodeToXML).join("");
}

/* ---------------------------
   Deserialization: XML -> Slate nodes (very small parser)
   Note: This is a simple approach. For complex XML, adapt or use XML parser libs.
   --------------------------- */

function parseHtmlStringToSlateNodes(htmlString: string): Descendant[] {
  // use DOMParser to parse HTML-like XML
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const body = doc.body;

    const walk = (el: ChildNode): Descendant[] => {
      const results: Descendant[] = [];

      if (el.nodeType === Node.TEXT_NODE) {
        const txt = el.textContent || "";
        results.push({ text: txt });
        return results;
      }

      if (el.nodeType === Node.ELEMENT_NODE) {
        const element = el as Element;
        const tag = element.tagName.toLowerCase();

        // If tag is inline formatting
        if (tag === "strong" || tag === "b") {
          const children = Array.from(element.childNodes).flatMap((c) => walk(c));
          return children.map((child) => ({ ...child, bold: true }));
        }
        if (tag === "em" || tag === "i") {
          const children = Array.from(element.childNodes).flatMap((c) => walk(c));
          return children.map((child) => ({ ...child, italic: true }));
        }
        if (tag === "u") {
          const children = Array.from(element.childNodes).flatMap((c) => walk(c));
          return children.map((child) => ({ ...child, underline: true }));
        }

        // block elements
        if (tag === "p" || tag === "div") {
          const children = Array.from(element.childNodes).flatMap((c) => walk(c));
          return [{ type: "paragraph", children }];
        }

        if (tag === "ul") {
          const items = Array.from(element.children).flatMap((li) => {
            const liChildren = Array.from(li.childNodes).flatMap((c) => walk(c));
            return [{ type: "bulleted-list", children: [{ type: "list-item", children: liChildren }] }];
          });
          return items;
        }

        if (tag === "ol") {
          const items = Array.from(element.children).flatMap((li) => {
            const liChildren = Array.from(li.childNodes).flatMap((c) => walk(c));
            return [{ type: "numbered-list", children: [{ type: "list-item", children: liChildren }] }];
          });
          return items;
        }

        // fallback: inline-contained paragraph
        const children = Array.from(element.childNodes).flatMap((c) => walk(c));
        return [{ type: "paragraph", children }];
      }

      return results;
    };

    const nodes = Array.from(body.childNodes).flatMap((c) => walk(c));
    return nodes.length > 0 ? nodes : [{ type: "paragraph", children: [{ text: "" }] }];
  } catch (err) {
    console.error("parseHtmlStringToSlateNodes error:", err);
    return [{ type: "paragraph", children: [{ text: htmlString }] }];
  }
}

/* ---------------------------
   Toolbar utilities
   --------------------------- */

const isMarkActive = (editor: Editor, format: keyof CustomText) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => Text.isText(n) && (n as any)[format] === true,
    universal: true,
  });
  return !!match;
};

const toggleMark = (editor: Editor, format: keyof CustomText) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });
  return !!match;
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = format === "bulleted-list" || format === "numbered-list";

  Transforms.unwrapNodes(editor, {
    match: (n) => SlateElement.isElement(n) && (n.type === "bulleted-list" || n.type === "numbered-list"),
    split: true,
  });

  const newType = isActive ? "paragraph" : isList ? "list-item" : format;
  Transforms.setNodes<SlateElement>(editor, { type: newType });

  if (!isActive && isList) {
    const block: SlateElement = { type: format, children: [] };
    Transforms.wrapNodes(editor, block, { match: (n) => n.type === "list-item" });
  }
};

/* ---------------------------
   Button components
   --------------------------- */

const IconButton: React.FC<{
  title: string;
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}> = ({ title, onClick, children }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClick}>
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{title}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

/* ---------------------------
   Main Editor component
   --------------------------- */

export function XmlSlateEditor() {
  const editor = useMemo(() => withHistory(withReact(createEditor() as ReactEditor)), []);
  // const [editor] = useState(() => withReact(createEditor()))
  const [value, setValue] = useState<Descendant[]>(initialValue);
  

  // Copy selection as XML to clipboard
  const handleCopyAsXML = useCallback(async () => {
    try {
      const xml = serializeSelectionToXML(editor);
      await navigator.clipboard.writeText(xml);
      // optionally show toast
      console.info("Copied XML:", xml);
    } catch (err) {
      console.error("Copy failed", err);
    }
  }, [editor]);

  // Paste handling: if clipboard contains XML/HTML, parse
  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      const clipboard = event.clipboardData.getData("text/plain");
      if (!clipboard) return;

      // quick check for tags
      if (/<[a-z][\s\S]*>/i.test(clipboard)) {
        event.preventDefault();
        const nodes = parseHtmlStringToSlateNodes(clipboard);
        // insert nodes at selection
        Transforms.insertFragment(editor, nodes as Descendant[]);
      }
      // otherwise let browser handle plain text
    },
    [editor]
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;


  return (
    <div className="w-full max-w-4xl mx-auto border rounded bg-white shadow">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-2 py-2 border-b bg-gray-50">
        <IconButton
          title="Bold (Ctrl/Cmd+B)"
          onClick={(e) => {
            e.preventDefault();
            toggleMark(editor, "bold");
          }}
        >
          <Bold className="h-4 w-4" />
        </IconButton>

        <IconButton
          title="Italic (Ctrl/Cmd+I)"
          onClick={(e) => {
            e.preventDefault();
            toggleMark(editor, "italic");
          }}
        >
          <Italic className="h-4 w-4" />
        </IconButton>

        <IconButton
          title="Underline (Ctrl/Cmd+U)"
          onClick={(e) => {
            e.preventDefault();
            toggleMark(editor, "underline");
          }}
        >
          <Underline className="h-4 w-4" />
        </IconButton>

        <div className="border-l h-6 mx-2" />

        <IconButton
          title="Bulleted list"
          onClick={(e) => {
            e.preventDefault();
            toggleBlock(editor, "bulleted-list");
          }}
        >
          <List className="h-4 w-4" />
        </IconButton>

        <IconButton
          title="Numbered list"
          onClick={(e) => {
            e.preventDefault();
            toggleBlock(editor, "numbered-list");
          }}
        >
          <ListOrdered className="h-4 w-4" />
        </IconButton>

        <div className="flex-1" />

        <Button variant="ghost" size="sm" onClick={() => editor.undo()}>
          Undo
        </Button>
        <Button variant="ghost" size="sm" onClick={() => editor.redo()}>
          Redo
        </Button>

        <Button variant="outline" size="sm" onClick={handleCopyAsXML}>
          Copy as XML
        </Button>
      </div>

      {/* Editor area */}
      <Slate editor={editor} initialValue={initialValue} onChange={(newVal) => setValue(newVal)}>
        <Editable
          className="min-h-[240px] p-4 focus:outline-none"
          onPaste={handlePaste}
          renderElement={(props) => <Element {...props} />}
          renderLeaf={(props) => <Leaf {...props} />}
          onKeyDown={(event) => {
            // keyboard shortcuts
            if ((event.ctrlKey || event.metaKey) && event.key === "b") {
              event.preventDefault();
              toggleMark(editor, "bold");
            }
            if ((event.ctrlKey || event.metaKey) && event.key === "i") {
              event.preventDefault();
              toggleMark(editor, "italic");
            }
            if ((event.ctrlKey || event.metaKey) && event.key === "u") {
              event.preventDefault();
              toggleMark(editor, "underline");
            }
            if ((event.ctrlKey || event.metaKey) && (event.key === "z" || (event.shiftKey && event.key === "z"))) {
              // let history handle default undo/redo; but you can also call editor.undo()
            }
          }}
        />
      </Slate>
    </div>
  );
}

/* ---------------------------
   Renderers for Slate Leaves / Elements
   --------------------------- */

const Element: React.FC<any> = ({ attributes, children, element }) => {
  switch (element.type) {
    case "bulleted-list":
      return <ul {...attributes} className="list-disc ml-6">{children}</ul>;
    case "numbered-list":
    case "numbered-list":
      return <ol {...attributes} className="list-decimal ml-6">{children}</ol>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "paragraph":
    default:
      return <p {...attributes} className="my-1">{children}</p>;
  }
};

const Leaf: React.FC<any> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  return <span {...attributes}>{children}</span>;
};
