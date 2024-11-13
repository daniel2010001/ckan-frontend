import { DropdownMenuDemo, Navbar } from ".";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col flex-1 w-full">
        <div className="flex flex-col flex-1 h-full">
          <div className="flex h-16 w-full justify-between items-center px-8 bg-custom-primary-1">
            <Navbar />
            <DropdownMenuDemo />
          </div>
          <main className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 h-full w-full bg-custom-primary-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
