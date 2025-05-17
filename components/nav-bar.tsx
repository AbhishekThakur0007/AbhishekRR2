"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, ChevronDown, X, PenLine, Phone, Sofa, Camera, LogIn, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "./theme-toggle";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Property Search",
    href: "/search",
    description:
      "Advanced search with filters for finding your perfect property.",
  },
  {
    title: "Map Search",
    href: "/maps-search",
    description: "Interactive map-based property search with location filters.",
  },
  {
    title: "Market Analysis",
    href: "/market-analysis",
    description:
      "Real-time market trends, pricing data, and neighborhood insights.",
  },
  {
    title: "Saved Properties",
    href: "/saved",
    description: "Access and manage your saved properties and searches.",
  },
  {
    title: "Mortgage Calculator",
    href: "/calculator",
    description:
      "Calculate monthly payments, interest rates, and affordability.",
  },
  {
    title: "Property Alerts",
    href: "/alerts",
    description:
      "Set up notifications for new properties matching your criteria.",
  },
];

const navItems = [
  { name: "Products", href: "/products", hasSubmenu: true },
  { name: "Solutions", href: "/solutions", hasSubmenu: true },
  { name: "Resources", href: "/resources", hasSubmenu: true },
  { name: "Pricing", href: "/pricing", hasSubmenu: false },
];

interface NavProps {
  onWriteClick?: () => void;
}

export function Nav({ onWriteClick }: NavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled
          ? "glossy-nav border-b bg-background/80 backdrop-blur-md"
          : "bg-background"
      )}
    >
      {/* Top gradient border */}
      <div className="gradient-border-animation absolute inset-x-0 top-0 h-[3px]"></div>

      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <img
              src={resolvedTheme === "dark" ? "/logo-dark.svg" : "/logo.svg"}
              alt="reVA Logo"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="https://reva.now/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "gradient-text"
                    )}
                  >
                    Search
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="https://photo.reva.now/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "gradient-text"
                    )}
                  >
                    Photo
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="https://stage.reva.now/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "gradient-text"
                    )}
                  >
                    Staging
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="https://call.reva.now/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "gradient-text"
                    )}
                  >
                    Calling
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          {/* Action Buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onWriteClick}
            className="hidden md:flex relative group gradient-text"
            data-write-button="true"
          >
            <PenLine className="h-5 w-5" />
            <span className="sr-only">Write</span>
            <span className="absolute inset-x-0 -bottom-10 px-2 py-1 bg-background border rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              Prompt Library
            </span>
          </Button>

          <Button variant="outline" size="icon" className="relative group hidden md:flex">
            <Phone className="h-5 w-5" />
            <span className="sr-only">Lead Calling</span>
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-destructive rounded-full flex items-center justify-center text-[10px] text-destructive-foreground">
              3
            </span>
            <span className="absolute inset-x-0 -bottom-10 px-2 py-1 bg-background border rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              Lead Calling
            </span>
          </Button>

          <Button variant="outline" size="icon" className="relative group hidden md:flex">
            <Sofa className="h-5 w-5" />
            <span className="sr-only">Virtual Staging</span>
            <span className="absolute inset-x-0 -bottom-10 px-2 py-1 bg-background border rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              Virtual Staging
            </span>
          </Button>

          <Button variant="outline" size="icon" className="relative group hidden md:flex">
            <Camera className="h-5 w-5" />
            <span className="sr-only">Headshots</span>
            <span className="absolute inset-x-0 -bottom-10 px-2 py-1 bg-background border rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              Headshots
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <ThemeToggle />
          <UserButton />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glossy-nav">
              <MobileNav onWriteClick={onWriteClick} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Bottom gradient border */}
      <div className="gradient-border-animation absolute inset-x-0 bottom-0 h-[1px]"></div>
    </header>
  );
}

interface MobileNavProps {
  onWriteClick?: () => void;
}

function MobileNav({ onWriteClick }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="flex flex-col gap-4 pt-10">
      <div className="relative mb-2">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search..." className="pl-8" />
      </div>
      <Button 
        variant="outline" 
        className="w-full justify-start gap-2" 
        onClick={onWriteClick}
        data-write-button="true"
      >
        <PenLine className="h-4 w-4" />
        Prompt Library
      </Button>
      <Link
        href="/search"
        className={cn(
          "text-base font-medium transition-colors hover:text-primary",
          pathname === "/search" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Property Search
      </Link>
      <Link
        href="/maps-search"
        className={cn(
          "text-base font-medium transition-colors hover:text-primary",
          pathname === "/maps-search" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Map Search
      </Link>
      <Link
        href="/market-analysis"
        className={cn(
          "text-base font-medium transition-colors hover:text-primary",
          pathname === "/market-analysis"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Market Analysis
      </Link>
      <Link
        href="/contact"
        className={cn(
          "text-base font-medium transition-colors hover:text-primary",
          pathname === "/contact" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Contact
      </Link>
      <Button asChild className="mt-4">
        <Link href="/login">Get Started</Link>
      </Button>
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

function UserButton() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
        return;
      }
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  if (!user) {
    return (
      <Button variant="outline" onClick={() => router.push("/login")}>
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.user_metadata?.avatar_url}
              alt={user.email}
            />
            <AvatarFallback>
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.user_metadata?.full_name && (
              <p className="font-medium">{user.user_metadata.full_name}</p>
            )}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            handleSignOut();
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
