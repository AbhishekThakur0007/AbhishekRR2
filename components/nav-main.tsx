"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
  maxItems,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
  }[];
  maxItems?: number;
}) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items;

  return (
    <SidebarMenu>
      {displayItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            isActive={item.isActive}
            className="py-1.5"
          >
            <a href={item.url} title={item.title}>
              <item.icon className="h-4 w-4" />
              <span className="truncate">{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
