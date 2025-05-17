import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  ChevronRightIcon,
  DotsHorizontalIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { Home, Building, MapPin } from "lucide-react";
import { useState } from "react";

export function NavListings({
  listings,
  maxCategories = 3,
  maxPropertiesPerCategory = 3,
}: {
  listings: {
    name: string;
    icon?: React.ReactNode;
    properties: {
      name: string;
      url: string;
      icon?: React.ReactNode;
    }[];
  }[];
  maxCategories?: number;
  maxPropertiesPerCategory?: number;
}) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const displayListings = listings.slice(0, maxCategories);
  const remainingCategories = Math.max(0, listings.length - maxCategories);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex justify-between items-center">
        <span>Listings</span>
        {remainingCategories > 0 && (
          <span className="text-xs text-muted-foreground">
            {listings.length} categories
          </span>
        )}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {displayListings.map((category) => (
            <Collapsible
              key={category.name}
              open={expandedCategories.includes(category.name)}
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="py-1.5"
                  onClick={() => toggleCategory(category.name)}
                >
                  <a href="#">
                    {category.icon || (
                      <Building className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    )}
                    <span className="truncate">{category.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {category.properties.length}
                    </span>
                  </a>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction
                    className="left-2 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
                    showOnHover
                    onClick={() => toggleCategory(category.name)}
                  >
                    <ChevronRightIcon />
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {category.properties
                      .slice(0, maxPropertiesPerCategory)
                      .map((property) => (
                        <SidebarMenuSubItem key={property.name}>
                          <SidebarMenuSubButton asChild className="py-1">
                            <a href={property.url}>
                              {property.icon || (
                                <Home className="h-3 w-3 mr-2 text-muted-foreground" />
                              )}
                              <span className="truncate">{property.name}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    {category.properties.length > maxPropertiesPerCategory && (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton className="text-sidebar-foreground/70 py-1">
                          <ChevronRightIcon className="mr-2" />
                          <span>
                            View{" "}
                            {category.properties.length -
                              maxPropertiesPerCategory}{" "}
                            more
                          </span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
          {remainingCategories > 0 && (
            <SidebarMenuItem>
              <SidebarMenuButton className="text-sidebar-foreground/70 py-1.5">
                <ChevronRightIcon className="mr-2" />
                <span>View {remainingCategories} more categories</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
