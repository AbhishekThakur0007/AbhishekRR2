import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DocsSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    title: string;
    href: string;
  }[];
}

export function DocsSidebar({ className, items, ...props }: DocsSidebarProps) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = items.map((item) => ({
        id: item.href.replace("#", ""),
        element: document.getElementById(item.href.replace("#", "")),
      }));

      const currentSection = sections.find((section) => {
        if (!section.element) return false;
        const rect = section.element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  return (
    <div
      className={cn("sticky top-0 h-screen overflow-hidden", className)}
      {...props}
    >
      <div className="space-y-4 py-4 h-full flex flex-col">
        <div className="px-3 py-2">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <div className="px-3 py-2 flex-1">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Privacy Policy
          </h2>
          <div className="space-y-1">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              {items.map((item) => {
                const sectionId = item.href.replace("#", "");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      activeSection === sectionId
                        ? "bg-accent text-accent-foreground"
                        : "transparent"
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
