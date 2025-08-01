// src/app/(dashboard)/layout.js
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { DraggableCalculator } from "@/components/draggable-calculator";
import { FloatingAIButton } from "@/components/floating-ai-button";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";


export default function DashboardLayout({ children }) {


  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)"
      }}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>      </SidebarInset>
      <div className="fixed bottom-4 right-4 z-50">
        <DraggableCalculator />
        <FloatingAIButton />
      </div>
    </SidebarProvider>
  );
}