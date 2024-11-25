import { AccountButton, Navbar } from ".";
import { ScrollArea } from "@/components/ui";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col flex-1 w-full">
        <div className="flex flex-col flex-1 h-full">
          <div className="fixed top-0 left-0 z-10 flex h-navbar-height w-full items-center justify-between bg-white px-4 py-2 shadow-md">
            <Navbar />
          </div>

          <main className="flex flex-col flex-1 w-full items-center justify-center">
            <ScrollArea className="w-full overflow-auto mt-navbar-height">
              <div className="-h-navbar-height">{children}</div>
            </ScrollArea>
          </main>
        </div>
      </div>
    </div>
  );
}
