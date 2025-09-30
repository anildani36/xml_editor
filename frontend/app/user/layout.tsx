const AuthLayout = ({
  children
}: {
children: React.ReactNode
}) => {
  return (
    <main className="bg-radial from-sky-400 to-blue-800 flex h-screen flex-col items-center justify-center">
      {children}
    </main>
  );
}

export default AuthLayout;