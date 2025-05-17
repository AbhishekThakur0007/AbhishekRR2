"use client";

import { ArrowUpRight, Link, Clock, Trash2, ChevronRight } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

export function NavHistory({
  history,
  maxItems = 5,
}: {
  history: {
    name: string;
    url: string;
    date?: string;
  }[];
  maxItems?: number;
}) {
  const { isMobile } = useSidebar();
  const displayHistory = history.slice(0, maxItems);
  const remainingCount = Math.max(0, history.length - maxItems);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex justify-between items-center">
        <span>History</span>
        {remainingCount > 0 && (
          <span className="text-xs text-muted-foreground">
            {history.length} items
          </span>
        )}
      </SidebarGroupLabel>
      <SidebarMenu>
        {displayHistory.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild className="py-1.5">
              <a href={item.url} title={item.name}>
                {/* <Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground" /> */}
                <span className="truncate">{item.name}</span>
                {item.date && (
                  <span className="ml-auto text-xs text-muted-foreground hidden sm:inline-block">
                    {item.date}
                  </span>
                )}
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <DotsHorizontalIcon />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Clock className="text-muted-foreground" />
                  <span>Remove from History</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link className="text-muted-foreground" />
                  <span>Copy Link</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowUpRight className="text-muted-foreground" />
                  <span>Open in New Tab</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {remainingCount > 0 && (
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70 py-1.5">
              <ChevronRight className="h-3.5 w-3.5 mr-2" />
              <span>View {remainingCount} more</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
