"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollProgress } from "@/components/scroll-progress";
import { DocsSidebar } from "@/components/docs-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const sidebarItems = [
  { title: "Interpretation and Definitions", href: "#interpretation" },
  { title: "Definitions", href: "#definitions" },
  { title: "Acknowledgment", href: "#acknowledgment" },
  { title: "Links to Other Websites", href: "#links" },
  { title: "Termination", href: "#termination" },
  { title: "Limitation of Liability", href: "#liability" },
  { title: "Governing Law", href: "#governing" },
  { title: "Contact Us", href: "#contact" },
];

export default function TermsPage() {
  return (
    <SidebarProvider>
      <ScrollProgress />
      <div className="flex min-h-screen">
        <div className="hidden border-r lg:block w-64">
          <DocsSidebar items={sidebarItems} />
        </div>
        <SidebarInset>
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
              <div className="text-sm text-muted-foreground mb-8">
                Last updated: March 28, 2025
              </div>

              <div className="space-y-8">
                <section id="interpretation">
                  <h2 className="text-2xl font-semibold mb-4">
                    Interpretation and Definitions
                  </h2>
                  <h3 className="text-xl font-medium mb-2">Interpretation</h3>
                  <p className="text-muted-foreground">
                    The words of which the initial letter is capitalized have
                    meanings defined under the following conditions. The
                    following definitions shall have the same meaning regardless
                    of whether they appear in singular or in plural.
                  </p>
                </section>

                <section id="definitions">
                  <h2 className="text-2xl font-semibold mb-4">Definitions</h2>
                  <p className="text-muted-foreground mb-4">
                    For the purposes of these Terms and Conditions:
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Affiliate</h3>
                      <p className="text-muted-foreground">
                        means an entity that controls, is controlled by or is
                        under common control with a party, where
                        &quot;control&quot; means ownership of 50% or more of
                        the shares, equity interest or other securities entitled
                        to vote for election of directors or other managing
                        authority.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Country</h3>
                      <p className="text-muted-foreground">
                        refers to: Kentucky, United States
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Company</h3>
                      <p className="text-muted-foreground">
                        (referred to as either &quot;the Company&quot;,
                        &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in
                        this Agreement) refers to Reva.Now.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Device</h3>
                      <p className="text-muted-foreground">
                        means any device that can access the Service such as a
                        computer, a cellphone or a digital tablet.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Service</h3>
                      <p className="text-muted-foreground">
                        refers to the Website.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Terms and Conditions</h3>
                      <p className="text-muted-foreground">
                        (also referred as &quot;Terms&quot;) mean these Terms
                        and Conditions that form the entire agreement between
                        You and the Company regarding the use of the Service.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">
                        Third-party Social Media Service
                      </h3>
                      <p className="text-muted-foreground">
                        means any services or content (including data,
                        information, products or services) provided by a
                        third-party that may be displayed, included or made
                        available by the Service.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Website</h3>
                      <p className="text-muted-foreground">
                        refers to Reva.Now, accessible from https://reva.now/
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">You</h3>
                      <p className="text-muted-foreground">
                        means the individual accessing or using the Service, or
                        the company, or other legal entity on behalf of which
                        such individual is accessing or using the Service, as
                        applicable.
                      </p>
                    </div>
                  </div>
                </section>

                <section id="acknowledgment">
                  <h2 className="text-2xl font-semibold mb-4">
                    Acknowledgment
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      These are the Terms and Conditions governing the use of
                      this Service and the agreement that operates between You
                      and the Company. These Terms and Conditions set out the
                      rights and obligations of all users regarding the use of
                      the Service.
                    </p>
                    <p>
                      Your access to and use of the Service is conditioned on
                      Your acceptance of and compliance with these Terms and
                      Conditions. These Terms and Conditions apply to all
                      visitors, users and others who access or use the Service.
                    </p>
                    <p>
                      By accessing or using the Service You agree to be bound by
                      these Terms and Conditions. If You disagree with any part
                      of these Terms and Conditions then You may not access the
                      Service.
                    </p>
                    <p>
                      You represent that you are over the age of 18. The Company
                      does not permit those under 18 to use the Service.
                    </p>
                    <p>
                      Your access to and use of the Service is also conditioned
                      on Your acceptance of and compliance with the Privacy
                      Policy of the Company. Our Privacy Policy describes Our
                      policies and procedures on the collection, use and
                      disclosure of Your personal information when You use the
                      Application or the Website and tells You about Your
                      privacy rights and how the law protects You. Please read
                      Our Privacy Policy carefully before using Our Service.
                    </p>
                  </div>
                </section>

                <section id="links">
                  <h2 className="text-2xl font-semibold mb-4">
                    Links to Other Websites
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Our Service may contain links to third-party web sites or
                      services that are not owned or controlled by the Company.
                    </p>
                    <p>
                      The Company has no control over, and assumes no
                      responsibility for, the content, privacy policies, or
                      practices of any third party web sites or services. You
                      further acknowledge and agree that the Company shall not
                      be responsible or liable, directly or indirectly, for any
                      damage or loss caused or alleged to be caused by or in
                      connection with the use of or reliance on any such
                      content, goods or services available on or through any
                      such web sites or services.
                    </p>
                    <p>
                      We strongly advise You to read the terms and conditions
                      and privacy policies of any third-party web sites or
                      services that You visit.
                    </p>
                  </div>
                </section>

                <section id="termination">
                  <h2 className="text-2xl font-semibold mb-4">Termination</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      We may terminate or suspend Your access immediately,
                      without prior notice or liability, for any reason
                      whatsoever, including without limitation if You breach
                      these Terms and Conditions.
                    </p>
                    <p>
                      Upon termination, Your right to use the Service will cease
                      immediately.
                    </p>
                  </div>
                </section>

                <section id="liability">
                  <h2 className="text-2xl font-semibold mb-4">
                    Limitation of Liability
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Not with standing any damages that You might incur, the
                      entire liability of the Company and any of its suppliers
                      under any provision of this Terms and Your exclusive
                      remedy for all of the foregoing shall be limited to the
                      amount actually paid by You through the Service or 100 USD
                      if You haven&apos;t purchased anything through the
                      Service.
                    </p>
                    <p>
                      To the maximum extent permitted by applicable law, in no
                      event shall the Company or its suppliers be liable for any
                      special, incidental, indirect, or consequential damages
                      whatsoever (including, but not limited to, damages for
                      loss of profits, loss of data or other information, for
                      business interruption, for personal injury, loss of
                      privacy arising out of or in any way related to the use of
                      or inability to use the Service, third-party software
                      and/or third-party hardware used with the Service, or
                      otherwise in connection with any provision of this Terms),
                      even if the Company or any supplier has been advised of
                      the possibility of such damages and even if the remedy
                      fails of its essential purpose.
                    </p>
                    <p>
                      Some states do not allow the exclusion of implied
                      warranties or limitation of liability for incidental or
                      consequential damages, which means that some of the above
                      limitations may not apply. In these states, each
                      party&apos;s liability will be limited to the greatest
                      extent permitted by law.
                    </p>
                  </div>
                </section>

                <section id="governing">
                  <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
                  <p className="text-muted-foreground">
                    The laws of the Country, excluding its conflicts of law
                    rules, shall govern this Terms and Your use of the Service.
                    Your use of the Application may also be subject to other
                    local, state, national, or international laws.
                  </p>
                </section>

                <section id="contact">
                  <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about these Terms and Conditions,
                    You can contact us at:{" "}
                    <a
                      href="mailto:hi@reva.now"
                      className="text-primary hover:underline"
                    >
                      hi@reva.now
                    </a>
                  </p>
                </section>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
