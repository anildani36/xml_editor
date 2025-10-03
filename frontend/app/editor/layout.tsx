
const EditorLayout = ({
  children
}: {
children: React.ReactNode
}) => {
  return (
    <main className="w-full flex h-screen flex-col items-start justify-start">
      {children}
    </main>
  );
}

export default EditorLayout;