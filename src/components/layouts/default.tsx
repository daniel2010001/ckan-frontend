import { ScrollArea } from "@/components/ui/scroll-area";
// import { Toaster } from "@/components/ui/toaster";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from ".";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col flex-1 w-full">
        <div className="flex flex-col flex-1 h-full">
          <div className="fixed top-0 left-0 z-10 flex h-navbar-height w-full items-center justify-between bg-white shadow-md bg-gradient-to-r from-custom-primary-2 to-[#842F45]">
            <Navbar />
          </div>
          <div className="flex flex-col flex-1 w-full items-center justify-center">
            <ScrollArea className="w-full mt-navbar-height">
              <div className="-h-navbar-height">{children}</div>
            </ScrollArea>
          </div>
        </div>
      </div>
      <Toaster richColors closeButton />
    </div>
  );
}
