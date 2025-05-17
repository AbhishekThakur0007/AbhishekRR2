'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PricingTier {
  name: string;
  icon: React.ReactNode;
  iconColor: string;
  description: string;
  monthlyPrice: number;
  annualPrice?: number;
  features: string[];
  buttonText: string;
  buttonVariant: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive' | null;
  backgroundColor: string;
  borderColor?: string;
}

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pricingTiers: PricingTier[] = [
    {
      name: 'Silver',
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 0L26.7 13.3L40 20L26.7 26.7L20 40L13.3 26.7L0 20L13.3 13.3L20 0Z"
            fill="#FFB6C1"
          />
        </svg>
      ),
      iconColor: 'text-pink-300',
      description: 'Perfect for small agents selling <$1M',
      monthlyPrice: 99,
      annualPrice: 990,
      features: ['Task Management', 'AI Summary', 'Progress Tracking', 'Smart Labels'],
      buttonText: 'Get Started',
      buttonVariant: 'default',
      backgroundColor: 'bg-gray-200',
    },
    {
      name: 'Power Agent',
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="10" cy="10" r="10" fill="#FFCBA4" />
          <circle cx="30" cy="10" r="10" fill="#FFCBA4" />
          <circle cx="10" cy="30" r="10" fill="#FFCBA4" />
          <circle cx="30" cy="30" r="10" fill="#FFCBA4" />
        </svg>
      ),
      iconColor: 'text-orange-300',
      description: 'Ideal for Agents Selling <$5M',
      monthlyPrice: 199,
      annualPrice: 1990,
      features: [
        'Everything in Basic +',
        'Team Collaboration',
        'Bulk Actions',
        '2-way Translation',
        'Advanced Reporting',
        'Customizable Dashboards',
        'Priority Support',
      ],
      buttonText: 'Start 7-day free trial',
      buttonVariant: 'default',
      backgroundColor: 'bg-gray-200',
      borderColor: 'from-pink-400 to-purple-400',
    },
    {
      name: 'Elite Agent',
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 0L23.5 13.5L37 17L23.5 20.5L20 34L16.5 20.5L3 17L16.5 13.5L20 0Z"
            fill="#E6E6FA"
          />
        </svg>
      ),
      iconColor: 'text-purple-300',
      description: 'Built for Agents selling or looking to sell $10M+',
      monthlyPrice: 299,
      annualPrice: 2990,
      features: [
        'Everything in Basic +',
        'SAML sso',
        'Dedicated Account Manager',
        'Enterprise Integrations',
        'Data Analytics',
        'Security Enhancements',
        'Custom Workflows',
      ],
      buttonText: 'Start 7-day free trial',
      buttonVariant: 'default',
      backgroundColor: 'bg-black',
    },
  ];

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-6 overflow-hidden">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-center">Pricing</DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            Flexible, transparent pricing to support your team&apos;s productivity and growth at
            every stage
          </p>
        </DialogHeader>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'font-medium',
                billingCycle === 'monthly' ? 'text-black' : 'text-gray-500',
              )}
            >
              Billed Monthly
            </span>
            <Switch
              checked={billingCycle === 'annual'}
              onCheckedChange={(checked: boolean) =>
                setBillingCycle(checked ? 'annual' : 'monthly')
              }
            />
            <span
              className={cn(
                'font-medium',
                billingCycle === 'annual' ? 'text-black' : 'text-gray-500',
              )}
            >
              Billed yearly
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((tier) => (
            <div key={tier.name} className="flex flex-col">
              <div className="mb-4 flex justify-center">{tier.icon}</div>
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">{tier.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold">
                  ${billingCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice}
                </span>
                <span className="text-muted-foreground"> per member / month</span>
              </div>

              <Button
                variant={tier.buttonVariant}
                className="w-full mb-6 bg-black text-white hover:bg-black/90"
              >
                {tier.buttonText}
              </Button>

              <div
                className={cn(
                  'rounded-lg p-4 flex-1',
                  tier.backgroundColor,
                  tier.name === 'Elite Agent' ? 'text-white' : 'text-black',
                  tier.borderColor &&
                    `relative before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:${tier.borderColor} before:-z-10 before:content-['']`,
                )}
              >
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-1 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
