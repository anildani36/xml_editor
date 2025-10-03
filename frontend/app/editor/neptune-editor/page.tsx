import { XmlSlateEditor } from "@/components/editor/EditorView";
import { MenuBar } from "@/components/editor/menu-bar";
import { QuickAccessBar } from "@/components/editor/quick-access-bar";


const NeptuneEditorPage = () => {
  return (
    <>
      <MenuBar />
      <QuickAccessBar />
      <XmlSlateEditor />
    </>
  );
}

export default NeptuneEditorPage;
