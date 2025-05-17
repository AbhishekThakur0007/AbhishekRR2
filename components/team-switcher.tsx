"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChevronDownIcon, PlusIcon } from "@radix-ui/react-icons";

// Create a component to render the logo
const LogoComponent = ({
  logo: Logo,
  className,
}: {
  logo: React.ComponentType<{ className?: string }>;
  className?: string;
}) => {
  return <Logo className={className} />;
};

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ComponentType<{ className?: string }>;
    plan: string;
  }[];
}) {
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="py-1.5 h-auto">
              <LogoComponent logo={activeTeam.logo} className="h-4 w-4 mr-2" />
              <span className="truncate">{activeTeam.name}</span>
              <ChevronDownIcon className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Teams</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {teams.map((team) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
              >
                <LogoComponent logo={team.logo} className="mr-2 h-4 w-4" />
                <span className="truncate">{team.name}</span>
                {team.plan === "free" && (
                  <DropdownMenuShortcut>FREE</DropdownMenuShortcut>
                )}
                {team.plan === "pro" && (
                  <DropdownMenuShortcut>PRO</DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
