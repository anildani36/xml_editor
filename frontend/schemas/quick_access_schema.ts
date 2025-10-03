import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
} from "lucide-react";

export type QuickAction = {
  id: string;
  icon: React.ElementType;  // icon component
  label: string;            // tooltip
  shortcut?: string;        // e.g. Ctrl+B
  command: string;          // editor command identifier
  group?: string;           // grouping (e.g. "text", "list")
};

export const quickActions: QuickAction[] = [
  {
    id: "bold",
    icon: Bold,
    label: "Bold",
    shortcut: "Ctrl+B",
    command: "toggleBold",
    group: "text",
  },
  {
    id: "italic",
    icon: Italic,
    label: "Italic",
    shortcut: "Ctrl+I",
    command: "toggleItalic",
    group: "text",
  },
  {
    id: "underline",
    icon: Underline,
    label: "Underline",
    shortcut: "Ctrl+U",
    command: "toggleUnderline",
    group: "text",
  },
  {
    id: "unordered-list",
    icon: List,
    label: "Bulleted List",
    command: "toggleBulletList",
    group: "list",
  },
  {
    id: "ordered-list",
    icon: ListOrdered,
    label: "Numbered List",
    command: "toggleOrderedList",
    group: "list",
  },
];
