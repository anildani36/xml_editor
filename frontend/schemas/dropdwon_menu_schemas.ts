type MenuItem = {
  label: string;
  onClick: () => void;
};

type Menu = {
  label: string;
  items: MenuItem[];
};

export const menus: Menu[] = [
  {
    label: "File",
    items: [
      { label: "New", onClick: () => alert("New File") },
      { label: "Open", onClick: () => alert("Open File") },
      { label: "Save", onClick: () => alert("Save File") },
    ],
  },
  {
    label: "Edit",
    items: [
      { label: "Undo", onClick: () => alert("Undo Action") },
      { label: "Redo", onClick: () => alert("Redo Action") },
      { label: "Preferences", onClick: () => alert("Preferences Opened") },
    ],
  },
  {
    label: "Help",
    items: [
      { label: "Documentation", onClick: () => alert("Docs Opened") },
      { label: "About", onClick: () => alert("About App") },
    ],
  },
];
