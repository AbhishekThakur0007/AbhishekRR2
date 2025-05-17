import React, { useState, useEffect } from 'react';
import { MLSListing, PropertyDetailResponse } from '@/app/types/real-estate';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast, ToastAction } from '@/components/ui/toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import {
  MapPin,
  CircleDollarSign,
  Home,
  Bed,
  Bath,
  Ruler,
  Phone,
  Mail,
  Calendar,
  Clock,
  Info,
  SquareIcon,
  Share2,
  Building2,
  User,
  DollarSign,
  Percent,
  MessageSquare,
  Loader2,
  Heart,
} from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PropertyHeroProps {
  propertyData?: PropertyDetailResponse | null;
  mlsData?: MLSListing | null;
}

export function PropertyHero({ propertyData, mlsData }: PropertyHeroProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [tourDate, setTourDate] = useState('');
  const [tourTime, setTourTime] = useState('');
  const [tourNotes, setTourNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if user is following this property
  useEffect(() => {
    const checkFollowStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data } = await supabase
        .from('reva_property_follows')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('property_address', propertyData?.data?.propertyInfo?.address?.label)
        .single();

      setIsFollowing(!!data);
    };

    checkFollowStatus();
  }, [propertyData?.data?.propertyInfo?.address?.label]);

  // Skip rendering if no data is available
  if (!propertyData && !mlsData) {
    return (
      <Card className="border-2 border-dashed border-muted">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
          <Info className="mb-4 w-12 h-12 text-muted-foreground" />
          <p className="text-xl font-medium text-muted-foreground">Property details unavailable</p>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn&apos;t find property information for this address.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Format currency values
  const formatCurrency = (value: number | null | undefined): string => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Extract property information
  const address = propertyData?.data?.propertyInfo?.address;
  const propertyInfo = propertyData?.data?.propertyInfo;
  const lotInfo = propertyData?.data?.lotInfo;
  const ownerInfo = propertyData?.data?.ownerInfo;
  const currentMortgage = propertyData?.data?.currentMortgages?.[0];

  // Create the full address display string
  const fullAddress = address?.label || 'N/A';
  const city = address?.city || 'N/A';
  const state = address?.state || 'N/A';
  const zip = address?.zip || 'N/A';
  const neighborhood = lotInfo?.subdivision || 'N/A';

  const listPrice = mlsData?.listPrice || propertyData?.data?.mlsListingPrice || 0;
  const formattedPrice = formatCurrency(listPrice);

  const beds = propertyInfo?.bedrooms || mlsData?.property?.bedroomsTotal || 'N/A';
  const baths = propertyInfo?.bathrooms || mlsData?.property?.bathroomsTotal || 'N/A';
  const sqft = propertyInfo?.livingSquareFeet || mlsData?.property?.livingArea || 'N/A';
  const formattedSqft =
    sqft !== 'N/A' ? new Intl.NumberFormat('en-US').format(Number(sqft)) : 'N/A';

  const status = mlsData?.standardStatus || mlsData?.customStatus || 'Not Listed';
  const daysOnMarket = mlsData?.daysOnMarket || 'N/A';

  const agentName = mlsData?.listingAgent?.fullName || 'N/A';
  const agentPhone = mlsData?.listingAgent?.phone || 'N/A';
  const agentEmail = mlsData?.listingAgent?.email || 'N/A';

  const primaryImage = mlsData?.media?.primaryListingImageUrl || '/placeholder.svg';

  // Define share variables
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `${fullAddress} - ${formattedPrice}`;
  const shareDescription = `${beds} beds, ${baths} baths, ${formattedSqft} sqft property located at ${fullAddress}`;

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const hashtags = ['realestate', 'property', 'realtors', 'homeforsale', 'dreamhome'].join(',');

    switch (platform) {
      case 'twitter':
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtags}`;
        window.open(twitterUrl, '_blank', 'width=600,height=450,scrollbars=yes');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        break;
    }
  };

  // Determine badge color based on status
  const getBadgeColor = (status: string) => {
    if (!status || status === 'Not Listed') return 'bg-red-500 hover:bg-red-600';

    const statusLower = status.toLowerCase();

    if (statusLower.includes('active') || statusLower === 'for sale')
      return 'bg-green-500 hover:bg-green-600';

    if (statusLower.includes('pending') || statusLower.includes('contingent'))
      return 'bg-yellow-500 hover:bg-yellow-600';

    if (statusLower.includes('sold')) return 'bg-blue-500 hover:bg-blue-600';

    return 'bg-secondary';
  };

  // Contact agent functionality
  const handleContactAgent = (method: 'email' | 'phone' | 'sms') => {
    if (!agentEmail && !agentPhone && !mlsData?.listingOffice?.phone) return;

    const subject = `Inquiry about ${fullAddress}`;
    const body = `Hello${
      agentName !== 'N/A' ? ` ${agentName}` : ''
    },\n\nI'm interested in the property at ${fullAddress}.\n\nBest regards`;

    // Format phone number to remove any non-numeric characters
    const formatPhoneNumber = (phone: string) => {
      return phone.replace(/\D/g, '');
    };

    // Use office phone as fallback if agent phone is not available
    const contactPhone = formatPhoneNumber(
      agentPhone !== 'N/A' ? agentPhone : mlsData?.listingOffice?.phone || '',
    );

    switch (method) {
      case 'email':
        if (agentEmail) {
          window.location.href = `mailto:${agentEmail}?subject=${encodeURIComponent(
            subject,
          )}&body=${encodeURIComponent(body)}`;
        }
        break;
      case 'phone':
        if (contactPhone) {
          window.location.href = `tel:${contactPhone}`;
        }
        break;
      case 'sms':
        if (contactPhone) {
          window.location.href = `sms:${contactPhone}?body=${encodeURIComponent(
            `Hi${agentName !== 'N/A' ? ` ${agentName}` : ''}, I'm interested in ${fullAddress}`,
          )}`;
        }
        break;
    }
  };

  const handleScheduleTour = async () => {
    try {
      setIsSubmitting(true);

      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          variant: 'destructive',
          title: 'Authentication required',
          description: 'Please sign in to schedule a tour',
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        return;
      }

      // Create tour request
      const { error } = await supabase.from('tour_requests').insert({
        user_id: session.user.id,
        property_address: fullAddress,
        mls_number: mlsData?.mlsNumber || null,
        requested_date: tourDate,
        requested_time: tourTime,
        notes: tourNotes,
        agent_email: agentEmail,
        agent_phone: agentPhone,
        agent_name: agentName,
        status: 'pending',
      });

      if (error) throw error;

      // Success
      toast({
        title: 'Tour Scheduled!',
        description: 'Your tour request has been submitted successfully.',
      });

      setDialogOpen(false);
      setTourDate('');
      setTourTime('');
      setTourNotes('');
    } catch (error) {
      console.error('Error scheduling tour:', error);
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Failed to schedule tour. Please try again.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      setIsFollowLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        toast({
          variant: 'destructive',
          title: 'Authentication required',
          description: 'Please sign in to follow properties',
        });
        return;
      }

      const propertyAddress = propertyData?.data?.propertyInfo?.address?.label;

      if (!propertyAddress) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Property information is missing',
        });
        return;
      }

      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('reva_property_follows')
          .delete()
          .eq('user_id', session.user.id)
          .eq('property_address', propertyAddress);

        if (error) throw error;

        toast({
          title: 'Unfollowed',
          description: 'Property removed from your follows',
        });
      } else {
        // Follow
        const { error } = await supabase.from('reva_property_follows').insert({
          user_id: session.user.id,
          property_address: propertyAddress,
          mls_number: mlsData?.mlsNumber,
          property_data: {
            price: mlsData?.listPrice || propertyData?.data?.mlsListingPrice,
            beds: propertyData?.data?.propertyInfo?.bedrooms || mlsData?.property?.bedroomsTotal,
            baths: propertyData?.data?.propertyInfo?.bathrooms || mlsData?.property?.bathroomsTotal,
            sqft:
              propertyData?.data?.propertyInfo?.livingSquareFeet || mlsData?.property?.livingArea,
            status: mlsData?.standardStatus || mlsData?.customStatus || 'Not Listed',
            image_url: mlsData?.media?.primaryListingImageUrl,
          },
        });

        if (error) throw error;

        toast({
          title: 'Following',
          description: 'Property added to your follows',
        });
      }

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update follow status',
      });
    } finally {
      setIsFollowLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="container px-4 py-8 mx-auto property-hero-section md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="property-info">
            <div className="mb-4 address-info">
              <h1 className="text-3xl font-bold md:text-2xl text-primary-800">{fullAddress}</h1>
              {neighborhood !== 'N/A' && (
                <p className="mt-1 text-xl text-gray-600">{neighborhood}</p>
              )}
            </div>
            <div className="mb-6 price-info">
              <div className="flex gap-2 items-baseline">
                <h2 className="text-2xl font-semibold md:text-3xl text-primary-700">
                  {formattedPrice}
                </h2>
                <Badge variant="secondary" className={getBadgeColor(status)}>
                  {status}
                </Badge>
              </div>
              {daysOnMarket !== 'N/A' && (
                <p className="flex gap-1 items-center mt-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {daysOnMarket} days on market
                </p>
              )}
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6 property-stats md:grid-cols-4">
              <div className="flex flex-col items-center p-3 rounded-lg stat-item bg-muted/50">
                <Bed className="mb-1 w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium">{beds} Beds</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg stat-item bg-muted/50">
                <Bath className="mb-1 w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium">{baths} Baths</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg stat-item bg-muted/50">
                <SquareIcon className="mb-1 w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium">{formattedSqft} sq ft</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg stat-item bg-muted/50">
                <Calendar className="mb-1 w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium">{propertyInfo?.yearBuilt || 'N/A'}</span>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="flex gap-2 items-center text-sm font-medium">
                  <Building2 className="w-4 h-4 text-primary-600" />
                  Property Type
                </h3>
                <p className="text-sm text-muted-foreground">
                  {propertyInfo?.propertyUse || mlsData?.property?.propertyType || 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="flex gap-2 items-center text-sm font-medium">
                  <User className="w-4 h-4 text-primary-600" />
                  Listed By
                </h3>
                <p className="text-sm text-muted-foreground">{agentName}</p>
              </div>
              {currentMortgage && (
                <div className="space-y-2">
                  <h3 className="flex gap-2 items-center text-sm font-medium">
                    <DollarSign className="w-4 h-4 text-primary-600" />
                    Current Mortgage
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(currentMortgage.amount)} at {currentMortgage.interestRate}%
                  </p>
                </div>
              )}
              {ownerInfo && (
                <div className="space-y-2">
                  <h3 className="flex gap-2 items-center text-sm font-medium">
                    <Percent className="w-4 h-4 text-primary-600" />
                    Equity
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(ownerInfo.equity)} ({ownerInfo.equityPercent}%)
                  </p>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              {(mlsData?.standardStatus || mlsData?.customStatus) && (
                <>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="default" className="flex gap-2 items-center">
                        <Calendar className="w-4 h-4" />
                        Schedule a Tour
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Schedule a Property Tour</DialogTitle>
                        <DialogDescription>Schedule a tour for {fullAddress}</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="tour-date">Preferred Date</Label>
                          <Input
                            id="tour-date"
                            type="date"
                            value={tourDate}
                            onChange={(e) => setTourDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="tour-time">Preferred Time</Label>
                          <Input
                            id="tour-time"
                            type="time"
                            value={tourTime}
                            onChange={(e) => setTourTime(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="tour-notes">Additional Notes</Label>
                          <Input
                            id="tour-notes"
                            placeholder="Any special requests or questions?"
                            value={tourNotes}
                            onChange={(e) => setTourNotes(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={handleScheduleTour}
                          disabled={!tourDate || !tourTime || isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            'Schedule Tour'
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  {(agentEmail || agentPhone || mlsData?.listingOffice?.phone) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex gap-2 items-center border-primary-600 text-primary-600"
                        >
                          <Phone className="w-4 h-4" />
                          Contact Agent
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {agentEmail && (
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleContactAgent('email')}
                          >
                            <Mail className="mr-2 w-4 h-4" />
                            Email Agent
                          </DropdownMenuItem>
                        )}
                        {(agentPhone !== 'N/A' || mlsData?.listingOffice?.phone) && (
                          <>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleContactAgent('phone')}
                            >
                              <Phone className="mr-2 w-4 h-4" />
                              Call {agentPhone !== 'N/A' ? 'Agent' : 'Office'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleContactAgent('sms')}
                            >
                              <MessageSquare className="mr-2 w-4 h-4" />
                              Text {agentPhone !== 'N/A' ? 'Agent' : 'Office'}
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleFollowToggle}
                disabled={isFollowLoading}
                className={`gap-2 ${
                  isFollowing ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
              >
                <Heart className={`h-4 w-4 ${isFollowing ? 'fill-current' : ''}`} />
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleShare('twitter')}
                  >
                    Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleShare('copy')}>
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Property Image */}
          {mlsData?.standardStatus || mlsData?.customStatus ? (
            <div className="property-image">
              <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-gray-100">
                {primaryImage ? (
                  <Image
                    src={primaryImage}
                    alt={`${fullAddress || 'Property'} main image`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center h-full bg-gray-200">
                    <Home className="w-16 h-16 text-gray-400" />
                    <span className="sr-only">No image available</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="order-first property-image">
              <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-gray-100">
                <div className="flex flex-col gap-2 justify-center items-center h-full bg-gray-200">
                  <Home className="w-16 h-16 text-gray-400" />
                  <p className="text-sm text-gray-500">Property Not Listed</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
