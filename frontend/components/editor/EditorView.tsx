"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown, ChevronRight, FileCode } from "lucide-react";

// Dummy XML content
const initialXml = `<book>
  <title>Example XML</title>
  <author>John Doe</author>
  <chapter>
    <title>Introduction</title>
    <para>Hello world, this is XML editing!</para>
  </chapter>
</book>`;

export const EditorView = () => {
  const [xmlContent, setXmlContent] = useState(initialXml);

  // Simple XML -> tree parser for demo (very naive, no attributes/complexities)
  const parseXmlToTree = (xml: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "application/xml");

    const walk = (node: Element) => {
      return {
        name: node.nodeName,
        children: Array.from(node.children).map((child) => walk(child)),
      };
    };

    return walk(doc.documentElement);
  };

  const xmlTree = parseXmlToTree(xmlContent);

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Left Tree Panel */}
      <div className="w-1/4 border-r border-gray-200 bg-white p-3 overflow-y-auto">
        <h2 className="font-semibold text-gray-700 mb-2">XML Structure</h2>
        <XmlTree node={xmlTree} />
      </div>

      {/* Right Editor Panel */}
      <div className="flex-1 flex flex-col">
        <h2 className="p-3 font-semibold text-gray-700 border-b border-gray-200">
          XML Tag View (Monaco)
        </h2>
        <Editor
          height="100%"
          defaultLanguage="xml"
          value={xmlContent}
          onChange={(value) => setXmlContent(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            automaticLayout: true,
          }}
          theme="vs-dark"
        />
      </div>
    </div>
  );
}

// Recursive Tree component
function XmlTree({ node }: { node: { name: string; children: any[] } }) {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="ml-2">
      <Collapsible.Trigger asChild>
        <div className="flex items-center cursor-pointer select-none py-1">
          {node.children.length > 0 ? (
            open ? (
              <ChevronDown size={16} className="text-gray-600" />
            ) : (
              <ChevronRight size={16} className="text-gray-600" />
            )
          ) : (
            <FileCode size={16} className="text-gray-400" />
          )}
          <span className="ml-1 text-sm text-gray-800">{node.name}</span>
        </div>
      </Collapsible.Trigger>

      {open && node.children.length > 0 && (
        <Collapsible.Content className="pl-4 border-l border-gray-200 ml-2">
          {node.children.map((child, idx) => (
            <XmlTree node={child} key={idx} />
          ))}
        </Collapsible.Content>
      )}
    </Collapsible.Root>
  );
}
