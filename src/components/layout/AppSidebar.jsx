import React from "react";
import { NavLink, Link } from "react-router-dom";

import { cn } from "@/lib/utils";

import { LucideGamepad2, Sun, Moon, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useTheme } from "@/context/ThemeProvider";
import { useWishlist } from "@/context/WishlistProvider";
import { navItems } from "@/constants";

export const AppSidebar = ({ className, ...props }) => {
  const { wishlist } = useWishlist();
  const { theme, setTheme } = useTheme();
  const isDarkTheme = theme === "dark";

  return (
    <Sidebar
      collapsible="icon"
      className={cn("border-r border-muted/50", className)}
      {...props}
    >
      <SidebarHeader className="border-b border-muted/50 bg-gradient-to-b from-background to-background/80">
        <SidebarMenuButton tooltip="Game Finder" asChild>
          <Link to="/" className="flex items-center gap-2 justify-start">
            <span className="relative">
              <LucideGamepad2 className="h-6 w-6 text-primary relative z-10" />
              <span className="absolute -inset-1 rounded-full bg-primary/10 animate-pulse"></span>
            </span>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Game Finder
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-2 py-2">
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Discover
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton tooltip={item.description} asChild>
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center gap-2.5 rounded-md px-3 py-2.5 transition-all",
                        isActive
                          ? "bg-primary/10 text-primary shadow-sm"
                          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      )
                    }
                  >
                    <span className="relative">
                      {item.icon && <item.icon className="h-5 w-5" />}
                      {item.badge && item.badge(wishlist) && (
                        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                          {item.badge(wishlist)}
                        </span>
                      )}
                    </span>
                    <span className="font-medium">{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-muted/50 bg-gradient-to-t from-background to-background/80">
        <SidebarMenu className="px-2 py-2">
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Github" asChild>
              <Link
                to="https://github.com/wawrysieiczj/game-finder"
                className="group flex items-center gap-2.5 rounded-md px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
                <span className="font-medium">Github</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={
                isDarkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
              asChild
            >
              <Button
                variant="ghost"
                className="w-full justify-start gap-2.5 rounded-md px-3 py-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setTheme(isDarkTheme ? "light" : "dark")}
              >
                {isDarkTheme ? (
                  <>
                    <Sun className="h-5 w-5" />
                    <span className="font-medium">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5" />
                    <span className="font-medium">Dark Mode</span>
                  </>
                )}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
