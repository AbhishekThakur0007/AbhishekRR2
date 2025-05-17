import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import React from "react";
import {
  Phone,
  Share2,
  ChevronRight,
  Home,
  Mail,
  MessageSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MLSListing, PropertyDetailResponse } from "@/app/types/real-estate";

interface SearchHeaderProps {
  propertyData?: PropertyDetailResponse | null;
  mlsData?: MLSListing | null;
  showRightSidebar: boolean;
  setShowRightSidebar: (show: boolean) => void;
}

export function SearchHeader({ propertyData, mlsData }: SearchHeaderProps) {
  // console.log("propertyData", propertyData);
  // console.log("mlsData", mlsData);
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

  const handleShare = (platform: string) => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareTitle = propertyData
      ? `${
          propertyData.data.propertyInfo.address.label
        } - ${new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(
          mlsData?.listPrice || propertyData?.data?.mlsListingPrice || 0
        )}`
      : "Check out this property";

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const hashtags = [
      "realestate",
      "property",
      "realtors",
      "homeforsale",
      "dreamhome",
    ].join(",");

    switch (platform) {
      case "twitter":
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtags}`;
        window.open(
          twitterUrl,
          "_blank",
          "width=600,height=450,scrollbars=yes"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        break;
    }
  };

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

  const handleContactAgent = (method: "email" | "phone" | "sms") => {
    if (!mlsData?.listingAgent) return;

    const agentName = mlsData.listingAgent.fullName || "";
    const agentEmail = mlsData.listingAgent.email || "";
    const agentPhone = mlsData.listingAgent.phone || "";
    const officePhone = mlsData.listingOffice?.phone || "";
    const propertyAddress =
      propertyData?.data?.propertyInfo?.address?.label || "";

    // Format phone number to remove any non-numeric characters
    const formatPhoneNumber = (phone: string) => {
      return phone.replace(/\D/g, "");
    };

    // Use office phone as fallback if agent phone is not available
    const contactPhone = formatPhoneNumber(agentPhone || officePhone);

    const subject = `Inquiry about ${propertyAddress}`;
    const body = `Hello${
      agentName ? ` ${agentName}` : ""
    },\n\nI'm interested in the property at ${propertyAddress}.\n\nBest regards`;

    switch (method) {
      case "email":
        if (agentEmail) {
          window.location.href = `mailto:${agentEmail}?subject=${encodeURIComponent(
            subject
          )}&body=${encodeURIComponent(body)}`;
        }
        break;
      case "phone":
        if (contactPhone) {
          window.location.href = `tel:${contactPhone}`;
        }
        break;
      case "sms":
        if (contactPhone) {
          window.location.href = `sms:${contactPhone}?body=${encodeURIComponent(
            `Hi${
              agentName ? ` ${agentName}` : ""
            }, I'm interested in ${propertyAddress}`
          )}`;
        }
        break;
    }
  };

  // Format address for breadcrumb
  const formatAddress = () => {
    if (!propertyData?.data?.propertyInfo?.address) return "Property Details";

    const address = propertyData.data.propertyInfo.address;
    return `${address.house} ${address.street} ${address.streetType}, ${address.city}, ${address.state}`;
  };

  return (
    <div className="sticky top-0 z-10">
      <header className="flex gap-2 items-center h-14 shrink-0 bg-background">
        {/* Left section with breadcrumb */}
        <div className="flex flex-1 gap-2 items-center px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex gap-1 items-center">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1 max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                  {formatAddress()}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Navigation - hidden on mobile */}
        <div className="hidden gap-4 items-center md:flex">
          <nav className="flex gap-4 items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "https://reva.now")}
            >
              Search
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "https://photo.reva.now")}
            >
              Photo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "https://stage.reva.now")}
            >
              Staging
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "https://call.reva.now")}
            >
              Calling
            </Button>
          </nav>
        </div>

        <Separator
          orientation="vertical"
          className="hidden mr-2 h-4 md:block"
        />

        {/* Property Details in Header - hidden on mobile */}
        {propertyData && (
          <div className="hidden gap-4 items-center mr-4 md:flex">
            <div className="flex gap-2 items-center">
              {(mlsData?.standardStatus || mlsData?.customStatus) && (
                <span className="font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(
                    mlsData?.listPrice ??
                      propertyData?.data?.mlsListingPrice ??
                      0
                  )}
                </span>
              )}
              <Badge
                variant="secondary"
                className={`${
                  mlsData?.standardStatus || mlsData?.customStatus
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {mlsData?.standardStatus ||
                  mlsData?.customStatus ||
                  "Not Listed"}
              </Badge>
            </div>
            <div className="flex gap-2 items-center">
              {(mlsData?.standardStatus || mlsData?.customStatus) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Phone className="w-4 h-4" />
                      <span className="hidden lg:inline">Contact Agent</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {mlsData?.listingAgent?.email && (
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleContactAgent("email")}
                      >
                        <Mail className="mr-2 w-4 h-4" />
                        Email Agent
                      </DropdownMenuItem>
                    )}
                    {(mlsData?.listingAgent?.phone ||
                      mlsData?.listingOffice?.phone) && (
                      <>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleContactAgent("phone")}
                        >
                          <Phone className="mr-2 w-4 h-4" />
                          Call{" "}
                          {mlsData?.listingAgent?.phone ? "Agent" : "Office"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleContactAgent("sms")}
                        >
                          <MessageSquare className="mr-2 w-4 h-4" />
                          Text{" "}
                          {mlsData?.listingAgent?.phone ? "Agent" : "Office"}
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    <span className="hidden lg:inline">Share</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleShare("twitter")}
                  >
                    Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleShare("copy")}
                  >
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        {/* Theme Toggle and User - always visible */}
        <div className="flex gap-2 items-center mr-2 sm:gap-4 sm:mr-4">
          <ThemeToggle />
          {!user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/login")}
              className="hidden sm:flex"
            >
              Sign In
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative w-8 h-8 rounded-full"
                >
                  <Avatar className="w-8 h-8">
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
                <div className="flex gap-2 justify-start items-center p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.user_metadata?.full_name && (
                      <p className="font-medium">
                        {user.user_metadata.full_name}
                      </p>
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
          )}
        </div>
      </header>
    </div>
  );
}
