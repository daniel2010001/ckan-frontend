import Navbar from "./Navbar";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col flex-1 w-full">
        <div className="flex flex-col flex-1 h-full">
          <div className="flex flex-col flex-1 h-full">
            <Navbar />
            <div className="h-16 w-full bg-custom-primary-1 text-custom-primary-foreground"></div>
            <div className="h-full w-full bg-custom-primary-3 text-custom-primary-foreground"></div>
            {children}
            <div className="h-full w-full bg-custom-primary-2 text-custom-primary-foreground"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DefaultLayout;
