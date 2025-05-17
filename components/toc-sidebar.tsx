"use client";

import { useState, useEffect } from "react";

interface TocItem {
  id: string;
  label: string;
  icon: string;
}

interface TocSidebarProps {
  items: TocItem[];
}

export function TocSidebar({ items }: TocSidebarProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => {
      items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [items]);

  return (
    <div className="hidden lg:block sticky top-20 ml-8 w-48">
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">On This Page</h3>
        <nav>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`flex items-center gap-2 py-1 px-2 rounded-md text-sm transition-colors ${
                    activeSection === item.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xs">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
