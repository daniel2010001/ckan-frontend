import { DropdownMenuDemo, Navbar } from ".";
import { ScrollArea } from "@/components/ui";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col flex-1 w-full">
        <div className="flex flex-col flex-1 h-full">
          <div className="fixed top-0 left-0 z-10 flex h-16 w-full items-center p-4 bg-white">
            <Navbar />
            <DropdownMenuDemo />
          </div>

          <ScrollArea className="h-[calc(100vh-4rem)] w-full overflow-y-auto mt-16">
            <main className="flex flex-col items-center h-full w-full">{children}</main>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
