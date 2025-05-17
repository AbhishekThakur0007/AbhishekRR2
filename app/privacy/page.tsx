"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollProgress } from "@/components/scroll-progress";
import { DocsSidebar } from "@/components/docs-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const sidebarItems = [
  { title: "Interpretation and Definitions", href: "#interpretation" },
  { title: "Definitions", href: "#definitions" },
  { title: "Types of Data Collected", href: "#data-collected" },
  { title: "Tracking Technologies and Cookies", href: "#cookies" },
  { title: "Use of Your Personal Data", href: "#data-usage" },
  { title: "Security of Your Personal Data", href: "#security" },
  { title: "Children's Privacy", href: "#children" },
  { title: "Changes to this Privacy Policy", href: "#changes" },
  { title: "Contact Us", href: "#contact" },
];

export default function PrivacyPage() {
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
              <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
              <div className="text-sm text-muted-foreground mb-8">
                Last updated: March 28, 2025
              </div>

              <div className="space-y-8">
                <section id="interpretation">
                  <h2 className="text-2xl font-semibold mb-4">
                    Interpretation and Definitions
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    This Privacy Policy describes Our policies and procedures on
                    the collection, use and disclosure of Your information when
                    You use the Service and tells You about Your privacy rights
                    and how the law protects You.
                  </p>
                  <p className="text-muted-foreground">
                    We use Your Personal data to provide and improve the
                    Service. By using the Service, You agree to the collection
                    and use of information in accordance with this Privacy
                    Policy.
                  </p>
                </section>

                <section id="definitions">
                  <h2 className="text-2xl font-semibold mb-4">Definitions</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Account</h3>
                      <p className="text-muted-foreground">
                        means a unique account created for You to access our
                        Service or parts of our Service.
                      </p>
                    </div>
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
                      <h3 className="font-medium">Company</h3>
                      <p className="text-muted-foreground">
                        (referred to as either &quot;the Company&quot;,
                        &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in
                        this Agreement) refers to Reva.Now.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Cookies</h3>
                      <p className="text-muted-foreground">
                        are small files that are placed on Your computer, mobile
                        device or any other device by a website, containing the
                        details of Your browsing history on that website among
                        its many uses.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Country</h3>
                      <p className="text-muted-foreground">
                        refers to: Kentucky, United States
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
                      <h3 className="font-medium">Personal Data</h3>
                      <p className="text-muted-foreground">
                        is any information that relates to an identified or
                        identifiable individual.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Service</h3>
                      <p className="text-muted-foreground">
                        refers to the Website.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Service Provider</h3>
                      <p className="text-muted-foreground">
                        means any natural or legal person who processes the data
                        on behalf of the Company. It refers to third-party
                        companies or individuals employed by the Company to
                        facilitate the Service, to provide the Service on behalf
                        of the Company, to perform services related to the
                        Service or to assist the Company in analyzing how the
                        Service is used.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Usage Data</h3>
                      <p className="text-muted-foreground">
                        refers to data collected automatically, either generated
                        by the use of the Service or from the Service
                        infrastructure itself (for example, the duration of a
                        page visit).
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Website</h3>
                      <p className="text-muted-foreground">
                        refers to Reva.Now, accessible from https://Reva.Now/
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

                <section id="data-collected">
                  <h2 className="text-2xl font-semibold mb-4">
                    Types of Data Collected
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Personal Data</h3>
                      <p className="text-muted-foreground mb-4">
                        While using Our Service, We may ask You to provide Us
                        with certain personally identifiable information that
                        can be used to contact or identify You. Personally
                        identifiable information may include, but is not limited
                        to:
                      </p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Email address</li>
                        <li>First name and last name</li>
                        <li>Phone number</li>
                        <li>Address, State, Province, ZIP/Postal code, City</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Usage Data</h3>
                      <p className="text-muted-foreground">
                        Usage Data is collected automatically when using the
                        Service. Usage Data may include information such as Your
                        Device&apos;s Internet Protocol address (e.g. IP
                        address), browser type, browser version, the pages of
                        our Service that You visit, the time and date of Your
                        visit, the time spent on those pages, unique device
                        identifiers and other diagnostic data.
                      </p>
                    </div>
                  </div>
                </section>

                <section id="cookies">
                  <h2 className="text-2xl font-semibold mb-4">
                    Tracking Technologies and Cookies
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    We use Cookies and similar tracking technologies to track
                    the activity on Our Service and store certain information.
                    Tracking technologies used are beacons, tags, and scripts to
                    collect and track information and to improve and analyze Our
                    Service.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">
                        Cookies or Browser Cookies
                      </h3>
                      <p className="text-muted-foreground">
                        A cookie is a small file placed on Your Device. You can
                        instruct Your browser to refuse all Cookies or to
                        indicate when a Cookie is being sent. However, if You do
                        not accept Cookies, You may not be able to use some
                        parts of our Service.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Web Beacons</h3>
                      <p className="text-muted-foreground">
                        Certain sections of our Service and our emails may
                        contain small electronic files known as web beacons
                        (also referred to as clear gifs, pixel tags, and
                        single-pixel gifs) that permit the Company, for example,
                        to count users who have visited those pages or opened an
                        email and for other related website statistics.
                      </p>
                    </div>
                  </div>
                </section>

                <section id="data-usage">
                  <h2 className="text-2xl font-semibold mb-4">
                    Use of Your Personal Data
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    The Company may use Personal Data for the following
                    purposes:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>
                      To provide and maintain our Service, including to monitor
                      the usage of our Service.
                    </li>
                    <li>
                      To manage Your Account: to manage Your registration as a
                      user of the Service.
                    </li>
                    <li>
                      For the performance of a contract: the development,
                      compliance and undertaking of the purchase contract for
                      the products, items or services You have purchased.
                    </li>
                    <li>
                      To contact You: To contact You by email, telephone calls,
                      SMS, or other equivalent forms of electronic
                      communication.
                    </li>
                    <li>
                      To provide You with news, special offers and general
                      information about other goods, services and events.
                    </li>
                    <li>
                      To manage Your requests: To attend and manage Your
                      requests to Us.
                    </li>
                    <li>
                      For business transfers: We may use Your information to
                      evaluate or conduct a merger, divestiture, restructuring,
                      reorganization, dissolution, or other sale or transfer.
                    </li>
                  </ul>
                </section>

                <section id="security">
                  <h2 className="text-2xl font-semibold mb-4">
                    Security of Your Personal Data
                  </h2>
                  <p className="text-muted-foreground">
                    The security of Your Personal Data is important to Us, but
                    remember that no method of transmission over the Internet,
                    or method of electronic storage is 100% secure. While We
                    strive to use commercially acceptable means to protect Your
                    Personal Data, We cannot guarantee its absolute security.
                  </p>
                </section>

                <section id="children">
                  <h2 className="text-2xl font-semibold mb-4">
                    Children&apos;s Privacy
                  </h2>
                  <p className="text-muted-foreground">
                    Our Service does not address anyone under the age of 13. We
                    do not knowingly collect personally identifiable information
                    from anyone under the age of 13. If You are a parent or
                    guardian and You are aware that Your child has provided Us
                    with Personal Data, please contact Us.
                  </p>
                </section>

                <section id="changes">
                  <h2 className="text-2xl font-semibold mb-4">
                    Changes to this Privacy Policy
                  </h2>
                  <p className="text-muted-foreground">
                    We may update Our Privacy Policy from time to time. We will
                    notify You of any changes by posting the new Privacy Policy
                    on this page. We will let You know via email and/or a
                    prominent notice on Our Service, prior to the change
                    becoming effective and update the &quot;Last updated&quot;
                    date at the top of this Privacy Policy.
                  </p>
                </section>

                <section id="contact">
                  <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy, You can
                    contact us at:{" "}
                    <a
                      href="mailto:hi@Reva.Now"
                      className="text-primary hover:underline"
                    >
                      hi@Reva.Now
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
