'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface PageSection {
  id: string;
  label: string;
  icon?: string | React.ReactNode; // Allow string for simple emoji icons or ReactNode for Lucide icons etc.
}

interface PageSectionNavProps {
  sections: PageSection[];
  activeSection: string;
  className?: string;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
}

export function PageSectionNav({
  sections,
  activeSection,
  className,
  scrollContainerRef,
}: PageSectionNavProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn(
        'overflow-x-hidden w-full border-b backdrop-blur-sm bg-background/90 dark:bg-background/80',
        'supports-[backdrop-filter]:bg-background/60 dark:supports-[backdrop-filter]:bg-background/60',
        className,
      )}
    >
      <div className="container flex overflow-x-auto gap-2 items-center px-4 h-12">
        <div className="flex gap-2 items-center">
          {sections.map((section) => {
            const IconComponent =
              typeof section.icon === 'string' ? (
                <span className="mr-1.5">{section.icon}</span>
              ) : section.icon ? (
                React.isValidElement(section.icon) &&
                React.cloneElement(section.icon as React.ReactElement, {
                  className: 'mr-1.5 h-4 w-4',
                })
              ) : null;

            return (
              <Link href={`#${section.id}`} key={section.id} passHref legacyBehavior>
                <Button
                  variant={activeSection === section.id ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'whitespace-nowrap h-8 px-3 transition-all',
                    activeSection === section.id
                      ? 'font-semibold text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={(e) => {
                    const element = document.getElementById(section.id);
                    if (element) {
                      e.preventDefault(); // Prevent default anchor behavior if we're scrolling manually
                      // The offset needs to account for the total height of the new combined sticky header.
                      // NewNavbar is h-16 (64px), PageSectionNav is h-12 (48px). Total = 112px.

                      const isModalScroll = !!scrollContainerRef?.current;

                      let targetElement: Element | null = null;

                      if (isModalScroll) {
                        // In modal: find within the scrollable container
                        targetElement = scrollContainerRef!.current!.querySelector(
                          `#${section.id}`,
                        );
                      } else {
                        // Regular page: find in the document
                        targetElement = document.getElementById(section.id);
                      }

                      if (targetElement) {
                        if (isModalScroll) {
                          // For modal: scroll the container
                          const containerTop =
                            scrollContainerRef!.current!.getBoundingClientRect().top;
                          const elementTop = targetElement.getBoundingClientRect().top;
                          const relativeTop = elementTop - containerTop;

                          // Get current scroll position and add the relative offset
                          scrollContainerRef!.current!.scrollTo({
                            top: scrollContainerRef!.current!.scrollTop + relativeTop - 60, // adjust offset as needed
                            behavior: 'smooth',
                          });
                        } else {
                          const combinedHeaderHeight = 112;
                          const elementPosition =
                            element.getBoundingClientRect().top + window.pageYOffset;
                          const offsetPosition = elementPosition - combinedHeaderHeight;
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth',
                          });
                        }
                      }
                    }
                  }}
                >
                  {IconComponent}
                  {section.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
