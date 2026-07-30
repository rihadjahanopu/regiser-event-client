/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import StatsSection from "@/components/home/StatsSection";
import EventsPreview from "@/components/home/EventsPreview";
import GalleryPreview from "@/components/home/GalleryPreview";
import BlogPreview from "@/components/home/BlogPreview";
import TeamSection from "@/components/home/TeamSection";
import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/home/Footer";

interface GalleryPhoto {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
}

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  designation: string;
  imageUrl: string;
  signatureUrl: string;
  order: number;
}

interface EventSettings {
  eventName?: string;
  eventDate?: string;
  eventAddress?: string;
  eventStartTime?: string;
  organiserContact?: string;
  isRegistrationOpen?: boolean;
  presidentName?: string;
  presidentTitle?: string;
  secretaryName?: string;
  secretaryTitle?: string;
  presidentSignatureUrl?: string;
  secretarySignatureUrl?: string;
  coverUrl?: string | null;

  // Visibility Toggles
  showHeroSection?: boolean;
  showAboutSection?: boolean;
  showStatsSection?: boolean;
  showEventsSection?: boolean;
  showGallerySection?: boolean;
  showBlogSection?: boolean;
  showTeamSection?: boolean;
  showContactSection?: boolean;
  showFooter?: boolean;

  // Hero
  heroEyebrow?: string;
  heroTitleLine1?: string;
  heroTitleLine2?: string;
  heroDescription?: string;
  heroCtaRegisterText?: string;
  heroCtaAboutText?: string;
  heroCtaEventsText?: string;

  // About
  aboutBadge?: string;
  aboutTitle?: string;
  aboutParagraph1?: string;
  aboutParagraph2?: string;
  aboutFoundedYear?: string;
  aboutMissionText?: string;
  aboutVisionText?: string;
  aboutValuesText?: string;
  aboutInnovationText?: string;

  // Stats
  statsMembers?: string;
  statsEvents?: string;
  statsYears?: string;
  statsDistricts?: string;

  // Section Titles
  eventsSectionTitle?: string;
  eventsSectionSubtitle?: string;
  gallerySectionTitle?: string;
  gallerySectionSubtitle?: string;
  blogSectionTitle?: string;
  blogSectionSubtitle?: string;
  teamSectionTitle?: string;
  teamSectionSubtitle?: string;
  contactSectionTitle?: string;
  contactSectionSubtitle?: string;

  // Contact & Footer
  contactEmail?: string;
  footerDescription?: string;
  footerCopyrightText?: string;
  footerFacebookUrl?: string;
  footerYoutubeUrl?: string;
  footerWebsiteUrl?: string;

  // Branding
  navbarLogoUrl?: string;
  siteTitle?: string;
  siteSubtitle?: string;
}

export default function HomePage() {
  const [settings, setSettings] = useState<EventSettings>({});
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    axios
      .get("/api/settings")
      .then((res) => {
        if (res.data.success && res.data.data) {
          const d = res.data.data;
          setSettings({
            eventName: d.eventName || "Talamij Event",
            eventDate: d.eventDate || "",
            eventAddress: d.eventAddress || "",
            eventStartTime: d.eventStartTime || "",
            organiserContact: d.organiserContact || "",
            isRegistrationOpen: d.isRegistrationOpen ?? true,
            presidentName: d.presidentName || "",
            presidentTitle: d.presidentTitle || "",
            secretaryName: d.secretaryName || "",
            secretaryTitle: d.secretaryTitle || "",
            presidentSignatureUrl: d.presidentSignatureUrl || "",
            secretarySignatureUrl: d.secretarySignatureUrl || "",
            coverUrl: d.eventCoverUrl || null,

            // Section Toggles
            showHeroSection: d.showHeroSection ?? true,
            showAboutSection: d.showAboutSection ?? true,
            showStatsSection: d.showStatsSection ?? true,
            showEventsSection: d.showEventsSection ?? true,
            showGallerySection: d.showGallerySection ?? true,
            showBlogSection: d.showBlogSection ?? true,
            showTeamSection: d.showTeamSection ?? true,
            showContactSection: d.showContactSection ?? true,
            showFooter: d.showFooter ?? true,

            // Hero
            heroEyebrow: d.heroEyebrow,
            heroTitleLine1: d.heroTitleLine1,
            heroTitleLine2: d.heroTitleLine2,
            heroDescription: d.heroDescription,
            heroCtaRegisterText: d.heroCtaRegisterText,
            heroCtaAboutText: d.heroCtaAboutText,
            heroCtaEventsText: d.heroCtaEventsText,

            // About
            aboutBadge: d.aboutBadge,
            aboutTitle: d.aboutTitle,
            aboutParagraph1: d.aboutParagraph1,
            aboutParagraph2: d.aboutParagraph2,
            aboutFoundedYear: d.aboutFoundedYear,
            aboutMissionText: d.aboutMissionText,
            aboutVisionText: d.aboutVisionText,
            aboutValuesText: d.aboutValuesText,
            aboutInnovationText: d.aboutInnovationText,

            // Stats
            statsMembers: d.statsMembers,
            statsEvents: d.statsEvents,
            statsYears: d.statsYears,
            statsDistricts: d.statsDistricts,

            // Section Titles
            eventsSectionTitle: d.eventsSectionTitle,
            eventsSectionSubtitle: d.eventsSectionSubtitle,
            gallerySectionTitle: d.gallerySectionTitle,
            gallerySectionSubtitle: d.gallerySectionSubtitle,
            blogSectionTitle: d.blogSectionTitle,
            blogSectionSubtitle: d.blogSectionSubtitle,
            teamSectionTitle: d.teamSectionTitle,
            teamSectionSubtitle: d.teamSectionSubtitle,
            contactSectionTitle: d.contactSectionTitle,
            contactSectionSubtitle: d.contactSectionSubtitle,

            // Contact & Footer
            contactEmail: d.contactEmail,
            footerDescription: d.footerDescription,
            footerCopyrightText: d.footerCopyrightText,
            footerFacebookUrl: d.footerFacebookUrl,
            footerYoutubeUrl: d.footerYoutubeUrl,
            footerWebsiteUrl: d.footerWebsiteUrl,
          });
        }
      })
      .catch(() => {/* silent */});

    // Fetch gallery photos
    axios
      .get("/api/settings/gallery")
      .then((res) => {
        if (res.data.success && res.data.data) {
          setGalleryPhotos(res.data.data);
        }
      })
      .catch(() => {/* silent */});

    // Fetch team members
    axios
      .get("/api/settings/team")
      .then((res) => {
        if (res.data.success && res.data.data) {
          setTeamMembers(res.data.data);
        }
      })
      .catch(() => {/* silent */});
  }, []);

  return (
    <main style={{ background: "#060612" }}>
      <Navbar
        isRegistrationOpen={settings.isRegistrationOpen}
        navbarLogoUrl={settings.navbarLogoUrl}
        siteTitle={settings.siteTitle}
        siteSubtitle={settings.siteSubtitle}
      />
      
      {settings.showHeroSection !== false && (
        <HeroSection
          eyebrow={settings.heroEyebrow}
          titleLine1={settings.heroTitleLine1}
          titleLine2={settings.heroTitleLine2}
          description={settings.heroDescription}
          ctaRegisterText={settings.heroCtaRegisterText}
          ctaAboutText={settings.heroCtaAboutText}
          ctaEventsText={settings.heroCtaEventsText}
        />
      )}

      {settings.showAboutSection !== false && (
        <AboutSection
          badge={settings.aboutBadge}
          title={settings.aboutTitle}
          paragraph1={settings.aboutParagraph1}
          paragraph2={settings.aboutParagraph2}
          foundedYear={settings.aboutFoundedYear}
          missionText={settings.aboutMissionText}
          visionText={settings.aboutVisionText}
          valuesText={settings.aboutValuesText}
          innovationText={settings.aboutInnovationText}
        />
      )}

      {settings.showStatsSection !== false && (
        <StatsSection
          members={settings.statsMembers}
          events={settings.statsEvents}
          years={settings.statsYears}
          districts={settings.statsDistricts}
        />
      )}

      {settings.showEventsSection !== false && (
        <EventsPreview
          title={settings.eventsSectionTitle}
          subtitle={settings.eventsSectionSubtitle}
          upcomingEvent={{
            name: settings.eventName,
            date: settings.eventDate,
            address: settings.eventAddress,
            startTime: settings.eventStartTime,
            isOpen: settings.isRegistrationOpen,
            coverUrl: settings.coverUrl,
          }}
        />
      )}

      {settings.showGallerySection !== false && (
        <GalleryPreview
          title={settings.gallerySectionTitle}
          subtitle={settings.gallerySectionSubtitle}
          photos={galleryPhotos}
        />
      )}

      {settings.showBlogSection !== false && (
        <BlogPreview
          title={settings.blogSectionTitle}
          subtitle={settings.blogSectionSubtitle}
        />
      )}

      {settings.showTeamSection !== false && (
        <TeamSection
          title={settings.teamSectionTitle}
          subtitle={settings.teamSectionSubtitle}
          members={teamMembers}
        />
      )}

      {settings.showContactSection !== false && (
        <ContactSection
          title={settings.contactSectionTitle}
          subtitle={settings.contactSectionSubtitle}
          contactEmail={settings.contactEmail}
          organiserContact={settings.organiserContact}
          eventAddress={settings.eventAddress}
        />
      )}

      {settings.showFooter !== false && (
        <Footer
          description={settings.footerDescription}
          copyrightText={settings.footerCopyrightText}
          facebookUrl={settings.footerFacebookUrl}
          youtubeUrl={settings.footerYoutubeUrl}
          websiteUrl={settings.footerWebsiteUrl}
          navbarLogoUrl={settings.navbarLogoUrl}
          siteTitle={settings.siteTitle}
          siteSubtitle={settings.siteSubtitle}
        />
      )}
    </main>
  );
}
