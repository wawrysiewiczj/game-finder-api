import React from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-background to-background/90 z-0" />

      {/* Grain overlay */}
      <div className="fixed inset-0 opacity-30 z-0 pointer-events-none bg-[url('/noise.svg')]" />

      <SidebarProvider>
        <AppSidebar className="z-30 border-muted/50 bg-background/80 backdrop-blur-md" />
        <SidebarInset>
          <header className="flex items-center justify-between p-4 sticky top-0 z-20 bg-background/70 backdrop-blur-md border-b border-muted/50">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <main className="flex-1 relative z-10">
            <div className="container mx-auto">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
