/* eslint-disable */
"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DEFAULT_FIELD_CONFIG, type FieldConfig } from "@/lib/fieldConfig";
import axios from "axios";
import {
	AlertTriangle,
	Award,
	Calendar,
	CheckCircle2,
	Clock,
	Eye,
	EyeOff,
	FileText,
	Globe,
	ImageIcon,
	Layers,
	Layout,
	Loader2,
	MapPin,
	PenLine,
	Phone,
	Plus,
	Pencil,
	RotateCcw,
	Save,
	Sparkles,
	Trash2,
	Upload,
	X,
	Users,
	Flag,
	Heart,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
	const [coverUrl, setCoverUrl] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [clearing, setClearing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
	const [updatingStatus, setUpdatingStatus] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Event info state
	const [eventName, setEventName] = useState("");
	const [eventAddress, setEventAddress] = useState("");
	const [eventDate, setEventDate] = useState("");
	const [eventStartTime, setEventStartTime] = useState("");
	const [organiserContact, setOrganiserContact] = useState("");
	const [showCountdown, setShowCountdown] = useState(true);
	const [savingEvent, setSavingEvent] = useState(false);
	const [clearingEvent, setClearingEvent] = useState(false);

	// Form Field Config state — each field has { required, enabled }
	const [fieldConfig, setFieldConfig] =
		useState<FieldConfig>(DEFAULT_FIELD_CONFIG);
	const [savingFieldConfig, setSavingFieldConfig] = useState(false);

	// Certificate Signature state
	const [presidentName, setPresidentName] = useState("President");
	const [presidentTitle, setPresidentTitle] = useState(
		"President, Chhatak Uttar"
	);
	const [presidentSignatureUrl, setPresidentSignatureUrl] = useState("");
	const [secretaryName, setSecretaryName] = useState("General Secretary");
	const [secretaryTitle, setSecretaryTitle] = useState(
		"General Secretary, Chhatak Uttar"
	);
	const [secretarySignatureUrl, setSecretarySignatureUrl] = useState("");

	// Signature upload state
	const [uploadingPresidentSig, setUploadingPresidentSig] = useState(false);
	const [uploadingSecretarySig, setUploadingSecretarySig] = useState(false);
	const [deletingPresidentSig, setDeletingPresidentSig] = useState(false);
	const [deletingSecretarySig, setDeletingSecretarySig] = useState(false);
	const presidentSigInputRef = useRef<HTMLInputElement>(null);
	const secretarySigInputRef = useRef<HTMLInputElement>(null);

	// Homepage Section Visibility Toggles
	const [showHeroSection, setShowHeroSection] = useState(true);
	const [showAboutSection, setShowAboutSection] = useState(true);
	const [showStatsSection, setShowStatsSection] = useState(true);
	const [showEventsSection, setShowEventsSection] = useState(true);
	const [showGallerySection, setShowGallerySection] = useState(true);
	const [showBlogSection, setShowBlogSection] = useState(true);
	const [showTeamSection, setShowTeamSection] = useState(true);
	const [showContactSection, setShowContactSection] = useState(true);
	const [showFooter, setShowFooter] = useState(true);

	// Homepage Hero Section Content
	const [heroEyebrow, setHeroEyebrow] = useState("Chhatak Uttar Upazila");
	const [heroTitleLine1, setHeroTitleLine1] = useState("Bangladesh Anjumane");
	const [heroTitleLine2, setHeroTitleLine2] = useState("Talamije Islamia");
	const [heroDescription, setHeroDescription] = useState(
		"Dedicated to fostering education, ethical values, leadership skills, and community welfare among students and youth."
	);
	const [heroCtaRegisterText, setHeroCtaRegisterText] = useState("Register for Event");
	const [heroCtaAboutText, setHeroCtaAboutText] = useState("Learn About Us");
	const [heroCtaEventsText, setHeroCtaEventsText] = useState("View All Events");

	// Homepage About Section Content
	const [aboutBadge, setAboutBadge] = useState("About Us");
	const [aboutTitle, setAboutTitle] = useState("Talamij — A Journey of Dreams");
	const [aboutParagraph1, setAboutParagraph1] = useState(
		"Talamij is a voluntary organization working to develop the talents of young students, cultivate leadership skills, and foster a sense of social responsibility. We believe every young person holds limitless potential within them."
	);
	const [aboutParagraph2, setAboutParagraph2] = useState(
		"Through the combination of quality education, good health, and rich culture, we aim to build an enlightened generation devoted to serving their country and nation."
	);
	const [aboutFoundedYear, setAboutFoundedYear] = useState("2018");
	const [aboutMissionText, setAboutMissionText] = useState(
		"Guiding talented youth on the right path to contribute to the nation's development."
	);
	const [aboutVisionText, setAboutVisionText] = useState(
		"Building an educated, aware, and well-organized generation of young people."
	);
	const [aboutValuesText, setAboutValuesText] = useState(
		"Honesty, unity, dedication, and patriotism are our core driving forces."
	);
	const [aboutInnovationText, setAboutInnovationText] = useState(
		"Opening doors to new possibilities through the integration of education and technology."
	);

	// Homepage Stats Section Content
	const [statsMembers, setStatsMembers] = useState("5000+");
	const [statsEvents, setStatsEvents] = useState("48+");
	const [statsYears, setStatsYears] = useState("6+");
	const [statsDistricts, setStatsDistricts] = useState("12");

	// Homepage Section Titles & Subtitles
	const [eventsSectionTitle, setEventsSectionTitle] = useState("Upcoming Events");
	const [eventsSectionSubtitle, setEventsSectionSubtitle] = useState(
		"Join our upcoming educational, cultural, and Islamic events."
	);
	const [gallerySectionTitle, setGallerySectionTitle] = useState("Photo Gallery");
	const [gallerySectionSubtitle, setGallerySectionSubtitle] = useState(
		"Highlights of our past events, seminars, and activities."
	);
	const [blogSectionTitle, setBlogSectionTitle] = useState("Latest News & Blogs");
	const [blogSectionSubtitle, setBlogSectionSubtitle] = useState(
		"Stay updated with our latest news, articles, and announcements."
	);
	const [teamSectionTitle, setTeamSectionTitle] = useState("Our Leaders");
	const [teamSectionSubtitle, setTeamSectionSubtitle] = useState(
		"The dedicated leadership guiding our organization with vision and integrity."
	);
	const [contactSectionTitle, setContactSectionTitle] = useState("Get in Touch");
	const [contactSectionSubtitle, setContactSectionSubtitle] = useState(
		"For any questions, suggestions, or collaboration opportunities, write to us or reach out directly."
	);

	// Homepage Contact & Footer Info
	const [contactEmail, setContactEmail] = useState("contact@talamij.org");
	const [footerDescription, setFooterDescription] = useState(
		"Bangladesh Anjumane Talamije Islamia, Chhatak Uttar Upazila branch. Dedicated to educational excellence, moral values, and youth leadership."
	);
	const [footerCopyrightText, setFooterCopyrightText] = useState("");
	const [footerFacebookUrl, setFooterFacebookUrl] = useState("#");
	const [footerYoutubeUrl, setFooterYoutubeUrl] = useState("#");
	const [footerWebsiteUrl, setFooterWebsiteUrl] = useState("#");

	// Site Branding & Navbar Logo State
	const [navbarLogoUrl, setNavbarLogoUrl] = useState("");
	const [watermarkUrl, setWatermarkUrl] = useState("");
	const [siteTitle, setSiteTitle] = useState("Talamije Islamia");
	const [siteSubtitle, setSiteSubtitle] = useState("Chhatak Uttar Upazila");
	const [uploadingLogo, setUploadingLogo] = useState(false);
	const [deletingLogo, setDeletingLogo] = useState(false);
	const [uploadingWatermark, setUploadingWatermark] = useState(false);
	const [deletingWatermark, setDeletingWatermark] = useState(false);
	const [certTopLogoUrl, setCertTopLogoUrl] = useState("");
	const [uploadingCertLogo, setUploadingCertLogo] = useState(false);
	const [deletingCertLogo, setDeletingCertLogo] = useState(false);
	const logoInputRef = useRef<HTMLInputElement>(null);
	const watermarkInputRef = useRef<HTMLInputElement>(null);
	const certLogoInputRef = useRef<HTMLInputElement>(null);

	// Dedicated About Page Content State
	const [aboutHeroBadge, setAboutHeroBadge] = useState("About Us");
	const [aboutHeroTitle, setAboutHeroTitle] = useState("Talamij — A Journey of Dreams");
	const [aboutHeroSubtitle, setAboutHeroSubtitle] = useState("A non-profit organization dedicated to youth talent development, leadership building, and fostering social responsibility.");
	const [aboutMissionTitle, setAboutMissionTitle] = useState("Our Mission");
	const [aboutMissionDetail, setAboutMissionDetail] = useState("Guiding talented youth on the right path to contribute to national development. Inspiring youth participation in education, culture, and social development.");
	const [aboutVisionTitle, setAboutVisionTitle] = useState("Our Vision");
	const [aboutVisionDetail, setAboutVisionDetail] = useState("Building an educated, conscious, and organized youth generation — advancing the country toward a bright future with knowledge, ethics, and humanity.");
	const [aboutPromiseTitle, setAboutPromiseTitle] = useState("Our Promise");
	const [aboutPromiseDetail, setAboutPromiseDetail] = useState("Giving every young person the opportunity to develop their full potential. Creating an enlightened generation through quality education, health, and culture.");
	const [aboutHistoryStory, setAboutHistoryStory] = useState("Talamij is a voluntary organization working to develop the talents of young students...");
	const [aboutCoverUrl, setAboutCoverUrl] = useState("");
	const [uploadingAboutCover, setUploadingAboutCover] = useState(false);
	const [deletingAboutCover, setDeletingAboutCover] = useState(false);
	const aboutCoverInputRef = useRef<HTMLInputElement>(null);

	// Dedicated Events Page Content State
	const [eventsPageBadge, setEventsPageBadge] = useState("Our Activities");
	const [eventsPageTitle, setEventsPageTitle] = useState("Events & Programs");
	const [eventsPageSubtitle, setEventsPageSubtitle] = useState("Explore our past, current, and upcoming educational, cultural, and leadership programs.");
	const [upcomingEventNotice, setUpcomingEventNotice] = useState("Registration is open! Click register to submit your details and get your electronic ticket.");
	const [noEventMessage, setNoEventMessage] = useState("There is currently no active event registration open. Stay tuned for upcoming announcements!");

	// Dedicated Gallery Page Content State
	const [galleryPageBadge, setGalleryPageBadge] = useState("Official Gallery");
	const [galleryPageTitle, setGalleryPageTitle] = useState("Our Photos & Memories");
	const [galleryPageSubtitle, setGalleryPageSubtitle] = useState("Moments from Talamij's various events, workshops, and community activities.");

	// Dedicated Blog Page Content State
	const [blogPageBadge, setBlogPageBadge] = useState("Articles & News");
	const [blogPageTitle, setBlogPageTitle] = useState("Latest Blogs & Stories");
	const [blogPageSubtitle, setBlogPageSubtitle] = useState("Discover stories, event updates, educational insights, and Islamic guidance.");

	// Registration Form Left Panel Content State
	const [regFormOrgLine1, setRegFormOrgLine1] = useState("Bangladesh Anjumane Talamije Islamia");
	const [regFormOrgLine2, setRegFormOrgLine2] = useState("Chhatak Uttar Upazila");
	const [regFormHeadingLine1, setRegFormHeadingLine1] = useState("Register &");
	const [regFormHeadingLine2, setRegFormHeadingLine2] = useState("Get Your");
	const [regFormHeadingHighlight, setRegFormHeadingHighlight] = useState("Digital Ticket");
	const [regFormDescription, setRegFormDescription] = useState("Fill out the form to secure your spot. You'll receive a unique QR-verified ticket instantly.");
	const [regFormFeature1, setRegFormFeature1] = useState("Academic Excellence");
	const [regFormFeature2, setRegFormFeature2] = useState("Health & Safety");
	const [regFormFeature3, setRegFormFeature3] = useState("Multi-Subject Programs");

	// Success Page & Ticket Content State
	const [successPageTitle, setSuccessPageTitle] = useState("Registration Successful!");
	const [successPageSubtitle, setSuccessPageSubtitle] = useState("Your digital ticket is ready. Please save or print it.");
	const [ticketParticipantLabel, setTicketParticipantLabel] = useState("Participant Ticket");

	// Certificate Custom Text Controls State
	const [certMainTitle, setCertMainTitle] = useState("Certificate of Participation");
	const [certSubTitlePrefix, setCertSubTitlePrefix] = useState("This is to certify that");
	const [certBodyText, setCertBodyText] = useState("successfully registered and participated in the event");
	const [certSecurityLabel, setCertSecurityLabel] = useState("Official Security Verification");
	const [certShowBismillah, setCertShowBismillah] = useState(true);
	const [certBismillahText, setCertBismillahText] = useState("﷽");

	// About Page — History / Journey Section
	const [aboutHistorySectionBadge, setAboutHistorySectionBadge] = useState("Our History");
	const [aboutHistorySectionTitle, setAboutHistorySectionTitle] = useState("Talamij's Journey");
	const [aboutMilestones, setAboutMilestones] = useState<{ year: string; title: string; description: string; color: string }[]>([
		{ year: "2018", title: "Foundation", description: "Talamij Organization officially began its journey in Chhatok North, Sunamganj.", color: "#7c3aed" },
		{ year: "2019", title: "First Medha Jahai", description: "The first 'Medha Jahai Competition' was held with over 150 student participants.", color: "#0ea5e9" },
		{ year: "2021", title: "District Expansion", description: "Talamij activities expanded across 6 sub-districts of Sunamganj.", color: "#f59e0b" },
		{ year: "2023", title: "Inter-District Activities", description: "Outreach extended to multiple districts in the Sylhet division.", color: "#10b981" },
		{ year: "2024", title: "Digital Transformation", description: "Launched online registration, digital certificates, and organization web portal.", color: "#ec4899" },
	]);

	// About Page — Core Principles Section
	const [aboutPrinciplesSectionBadge, setAboutPrinciplesSectionBadge] = useState("Values");
	const [aboutPrinciplesSectionTitle, setAboutPrinciplesSectionTitle] = useState("Our Core Principles");
	const [aboutPrinciplesSectionSubtitle, setAboutPrinciplesSectionSubtitle] = useState("These core principles drive every decision and activity at Talamij.");
	const [aboutCoreValues, setAboutCoreValues] = useState<{ title: string; description: string; color: string }[]>([
		{ title: "Integrity & Transparency", description: "Maintaining honesty, accountability, and transparency in every activity.", color: "#7c3aed" },
		{ title: "Humanity & Service", description: "Dedicated to human welfare to build a compassionate and responsible society.", color: "#ec4899" },
		{ title: "Unity & Collaboration", description: "Fostering strong community ties by respecting diverse perspectives.", color: "#0ea5e9" },
		{ title: "Innovation & Creativity", description: "Pioneering new paths in education and development through technology.", color: "#f59e0b" },
		{ title: "Knowledge & Education", description: "Commitment to lifelong learning and creating knowledge opportunities.", color: "#10b981" },
		{ title: "Patriotism & Responsibility", description: "Pledging to build a prosperous nation through civic duty.", color: "#8b5cf6" },
	]);

	// About Page — Executive Board Section
	const [aboutBoardSectionBadge, setAboutBoardSectionBadge] = useState("Leadership");
	const [aboutBoardSectionTitle, setAboutBoardSectionTitle] = useState("Our Executive Board");
	const [aboutBoardMembers, setAboutBoardMembers] = useState<{ name: string; title: string; role: string; photoUrl: string; photoPublicId: string; accent: string }[]>([]);
	const [uploadingBoardPhoto, setUploadingBoardPhoto] = useState<number | null>(null);
	const boardPhotoInputRefs = useRef<(HTMLInputElement | null)[]>([]);

	// About Page — Join CTA Section
	const [aboutJoinTitle, setAboutJoinTitle] = useState("Join Our Organization");
	const [aboutJoinSubtitle, setAboutJoinSubtitle] = useState("Become part of the growing Talamij family. Together, let's build an enlightened generation and a better tomorrow.");
	const [aboutJoinEventsButtonText, setAboutJoinEventsButtonText] = useState("View Events");
	const [aboutJoinContactButtonText, setAboutJoinContactButtonText] = useState("Contact Us");

	const [savingHomepage, setSavingHomepage] = useState(false);

	const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploadingLogo(true);
		const formData = new FormData();
		formData.append("logo", file);
		try {
			const res = await axios.post("/api/admin/settings/logo", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			if (res.data.success) {
				setNavbarLogoUrl(res.data.data.navbarLogoUrl);
				toast.success("Navbar logo uploaded successfully!");
			} else {
				toast.error(res.data.error);
			}
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to upload logo");
		} finally {
			setUploadingLogo(false);
			if (logoInputRef.current) logoInputRef.current.value = "";
		}
	};

	const handleLogoDelete = async () => {
		if (!window.confirm("Are you sure you want to delete the navbar logo?")) return;
		setDeletingLogo(true);
		try {
			const res = await axios.delete("/api/admin/settings/logo");
			if (res.data.success) {
				setNavbarLogoUrl("");
				toast.success("Navbar logo removed");
			} else {
				toast.error(res.data.error);
			}
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to delete logo");
		} finally {
			setDeletingLogo(false);
		}
	};

	const handleWatermarkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploadingWatermark(true);
		const formData = new FormData();
		formData.append("watermark", file);
		try {
			const res = await axios.post("/api/admin/settings/watermark", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			if (res.data.success) {
				setWatermarkUrl(res.data.data.watermarkUrl);
				toast.success("Watermark image uploaded successfully!");
			} else {
				toast.error(res.data.error);
			}
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to upload watermark image");
		} finally {
			setUploadingWatermark(false);
			if (watermarkInputRef.current) watermarkInputRef.current.value = "";
		}
	};

	const handleWatermarkDelete = async () => {
		if (!window.confirm("Are you sure you want to delete the watermark image?")) return;
		setDeletingWatermark(true);
		try {
			const res = await axios.delete("/api/admin/settings/watermark");
			if (res.data.success) {
				setWatermarkUrl("");
				toast.success("Watermark image removed");
			} else {
				toast.error(res.data.error);
			}
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to delete watermark image");
		} finally {
			setDeletingWatermark(false);
		}
	};

	const handleCertLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploadingCertLogo(true);
		const formData = new FormData();
		formData.append("certLogo", file);
		try {
			const res = await axios.post("/api/admin/settings/cert-logo", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			if (res.data.success) {
				setCertTopLogoUrl(res.data.data.certTopLogoUrl);
				toast.success("Certificate top logo uploaded successfully!");
			} else {
				toast.error(res.data.error);
			}
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to upload certificate logo image");
		} finally {
			setUploadingCertLogo(false);
			if (certLogoInputRef.current) certLogoInputRef.current.value = "";
		}
	};

	const handleCertLogoDelete = async () => {
		if (!window.confirm("Are you sure you want to delete the certificate top logo?")) return;
		setDeletingCertLogo(true);
		try {
			const res = await axios.delete("/api/admin/settings/cert-logo");
			if (res.data.success) {
				setCertTopLogoUrl("");
				toast.success("Certificate top logo removed");
			} else {
				toast.error(res.data.error);
			}
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to delete certificate logo image");
		} finally {
			setDeletingCertLogo(false);
		}
	};

	const handleAboutCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploadingAboutCover(true);
		const formData = new FormData();
		formData.append("aboutCover", file);
		try {
			const res = await axios.post("/api/admin/settings/about-cover", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			if (res.data.success) {
				setAboutCoverUrl(res.data.data.aboutCoverUrl);
				toast.success("About page cover image uploaded!");
			} else {
				toast.error(res.data.error);
			}
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to upload about cover image");
		} finally {
			setUploadingAboutCover(false);
			if (aboutCoverInputRef.current) aboutCoverInputRef.current.value = "";
		}
	};

	const handleAboutCoverDelete = async () => {
		if (!window.confirm("Are you sure you want to delete the about cover image?")) return;
		setDeletingAboutCover(true);
		try {
			const res = await axios.delete("/api/admin/settings/about-cover");
			if (res.data.success) {
				setAboutCoverUrl("");
				toast.success("About page cover image removed");
			} else {
				toast.error(res.data.error);
			}
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to delete image");
		} finally {
			setDeletingAboutCover(false);
		}
	};

	// ── Board Member Photo Upload ────────────────────────────────────────────────
	const handleBoardMemberPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploadingBoardPhoto(index);
		const formData = new FormData();
		formData.append("photo", file);
		try {
			const res = await axios.post("/api/admin/settings/board-member-photo", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			if (res.data.success) {
				const updated = [...aboutBoardMembers];
				updated[index] = { ...updated[index], photoUrl: res.data.data.photoUrl, photoPublicId: res.data.data.photoPublicId };
				setAboutBoardMembers(updated);
				toast.success("Photo uploaded!");
			} else {
				toast.error(res.data.error);
			}
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to upload photo");
		} finally {
			setUploadingBoardPhoto(null);
			if (boardPhotoInputRefs.current[index]) boardPhotoInputRefs.current[index]!.value = "";
		}
	};

	const handleBoardMemberPhotoDelete = async (index: number) => {
		const member = aboutBoardMembers[index];
		if (!member.photoPublicId) {
			const updated = [...aboutBoardMembers];
			updated[index] = { ...updated[index], photoUrl: "", photoPublicId: "" };
			setAboutBoardMembers(updated);
			return;
		}
		try {
			await axios.delete("/api/admin/settings/board-member-photo", { data: { publicId: member.photoPublicId } });
			const updated = [...aboutBoardMembers];
			updated[index] = { ...updated[index], photoUrl: "", photoPublicId: "" };
			setAboutBoardMembers(updated);
			toast.success("Photo removed");
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to remove photo");
		}
	};

	// ── Milestone CRUD helpers ───────────────────────────────────────────────────
	const addMilestone = () => setAboutMilestones([...aboutMilestones, { year: "", title: "", description: "", color: "#7c3aed" }]);
	const removeMilestone = (i: number) => setAboutMilestones(aboutMilestones.filter((_, idx) => idx !== i));
	const updateMilestone = (i: number, field: string, value: string) => {
		const updated = [...aboutMilestones];
		updated[i] = { ...updated[i], [field]: value };
		setAboutMilestones(updated);
	};

	// ── Core Value CRUD helpers ──────────────────────────────────────────────────
	const addCoreValue = () => setAboutCoreValues([...aboutCoreValues, { title: "", description: "", color: "#7c3aed" }]);
	const removeCoreValue = (i: number) => setAboutCoreValues(aboutCoreValues.filter((_, idx) => idx !== i));
	const updateCoreValue = (i: number, field: string, value: string) => {
		const updated = [...aboutCoreValues];
		updated[i] = { ...updated[i], [field]: value };
		setAboutCoreValues(updated);
	};

	// ── Board Member CRUD helpers ────────────────────────────────────────────────
	const addBoardMember = () => setAboutBoardMembers([...aboutBoardMembers, { name: "", title: "", role: "", photoUrl: "", photoPublicId: "", accent: "#7c3aed" }]);
	const removeBoardMember = (i: number) => setAboutBoardMembers(aboutBoardMembers.filter((_, idx) => idx !== i));
	const updateBoardMember = (i: number, field: string, value: string) => {
		const updated = [...aboutBoardMembers];
		updated[i] = { ...updated[i], [field]: value };
		setAboutBoardMembers(updated);
	};

	const fetchSettings = async () => {

		setLoading(true);
		try {
			const res = await axios.get("/api/settings");
			if (res.data.success && res.data.data) {
				const d = res.data.data;
				setCoverUrl(d.eventCoverUrl || null);
				setIsRegistrationOpen(d.isRegistrationOpen ?? true);
				setEventName(d.eventName || "");
				setEventAddress(d.eventAddress || "");
				setEventDate(d.eventDate || "");
				setEventStartTime(d.eventStartTime || "");
				setOrganiserContact(d.organiserContact || "");
				setShowCountdown(d.showCountdown ?? true);
				setPresidentName(d.presidentName || "President");
				setPresidentTitle(d.presidentTitle || "President, Chhatak Uttar");
				setPresidentSignatureUrl(d.presidentSignatureUrl || "");
				setSecretaryName(d.secretaryName || "General Secretary");
				setSecretaryTitle(
					d.secretaryTitle || "General Secretary, Chhatak Uttar"
				);
				setSecretarySignatureUrl(d.secretarySignatureUrl || "");

				// Visibility toggles
				setShowHeroSection(d.showHeroSection ?? true);
				setShowAboutSection(d.showAboutSection ?? true);
				setShowStatsSection(d.showStatsSection ?? true);
				setShowEventsSection(d.showEventsSection ?? true);
				setShowGallerySection(d.showGallerySection ?? true);
				setShowBlogSection(d.showBlogSection ?? true);
				setShowTeamSection(d.showTeamSection ?? true);
				setShowContactSection(d.showContactSection ?? true);
				setShowFooter(d.showFooter ?? true);

				// Hero content
				if (d.heroEyebrow !== undefined) setHeroEyebrow(d.heroEyebrow);
				if (d.heroTitleLine1 !== undefined) setHeroTitleLine1(d.heroTitleLine1);
				if (d.heroTitleLine2 !== undefined) setHeroTitleLine2(d.heroTitleLine2);
				if (d.heroDescription !== undefined) setHeroDescription(d.heroDescription);
				if (d.heroCtaRegisterText !== undefined) setHeroCtaRegisterText(d.heroCtaRegisterText);
				if (d.heroCtaAboutText !== undefined) setHeroCtaAboutText(d.heroCtaAboutText);
				if (d.heroCtaEventsText !== undefined) setHeroCtaEventsText(d.heroCtaEventsText);

				// About content
				if (d.aboutBadge !== undefined) setAboutBadge(d.aboutBadge);
				if (d.aboutTitle !== undefined) setAboutTitle(d.aboutTitle);
				if (d.aboutParagraph1 !== undefined) setAboutParagraph1(d.aboutParagraph1);
				if (d.aboutParagraph2 !== undefined) setAboutParagraph2(d.aboutParagraph2);
				if (d.aboutFoundedYear !== undefined) setAboutFoundedYear(d.aboutFoundedYear);
				if (d.aboutMissionText !== undefined) setAboutMissionText(d.aboutMissionText);
				if (d.aboutVisionText !== undefined) setAboutVisionText(d.aboutVisionText);
				if (d.aboutValuesText !== undefined) setAboutValuesText(d.aboutValuesText);
				if (d.aboutInnovationText !== undefined) setAboutInnovationText(d.aboutInnovationText);

				// Stats content
				if (d.statsMembers !== undefined) setStatsMembers(d.statsMembers);
				if (d.statsEvents !== undefined) setStatsEvents(d.statsEvents);
				if (d.statsYears !== undefined) setStatsYears(d.statsYears);
				if (d.statsDistricts !== undefined) setStatsDistricts(d.statsDistricts);

				// Section titles
				if (d.eventsSectionTitle !== undefined) setEventsSectionTitle(d.eventsSectionTitle);
				if (d.eventsSectionSubtitle !== undefined) setEventsSectionSubtitle(d.eventsSectionSubtitle);
				if (d.gallerySectionTitle !== undefined) setGallerySectionTitle(d.gallerySectionTitle);
				if (d.gallerySectionSubtitle !== undefined) setGallerySectionSubtitle(d.gallerySectionSubtitle);
				if (d.blogSectionTitle !== undefined) setBlogSectionTitle(d.blogSectionTitle);
				if (d.blogSectionSubtitle !== undefined) setBlogSectionSubtitle(d.blogSectionSubtitle);
				if (d.teamSectionTitle !== undefined) setTeamSectionTitle(d.teamSectionTitle);
				if (d.teamSectionSubtitle !== undefined) setTeamSectionSubtitle(d.teamSectionSubtitle);
				if (d.contactSectionTitle !== undefined) setContactSectionTitle(d.contactSectionTitle);
				if (d.contactSectionSubtitle !== undefined) setContactSectionSubtitle(d.contactSectionSubtitle);

				// Contact & Footer
				if (d.contactEmail !== undefined) setContactEmail(d.contactEmail);
				if (d.footerDescription !== undefined) setFooterDescription(d.footerDescription);
				if (d.footerCopyrightText !== undefined) setFooterCopyrightText(d.footerCopyrightText);
				if (d.footerFacebookUrl !== undefined) setFooterFacebookUrl(d.footerFacebookUrl);
				if (d.footerYoutubeUrl !== undefined) setFooterYoutubeUrl(d.footerYoutubeUrl);
				if (d.footerWebsiteUrl !== undefined) setFooterWebsiteUrl(d.footerWebsiteUrl);

				// Branding & Logo
				if (d.navbarLogoUrl !== undefined) setNavbarLogoUrl(d.navbarLogoUrl);
				if (d.watermarkUrl !== undefined) setWatermarkUrl(d.watermarkUrl);
				if (d.siteTitle !== undefined) setSiteTitle(d.siteTitle);
				if (d.siteSubtitle !== undefined) setSiteSubtitle(d.siteSubtitle);

				// Dedicated About Page
				if (d.aboutHeroBadge !== undefined) setAboutHeroBadge(d.aboutHeroBadge);
				if (d.aboutHeroTitle !== undefined) setAboutHeroTitle(d.aboutHeroTitle);
				if (d.aboutHeroSubtitle !== undefined) setAboutHeroSubtitle(d.aboutHeroSubtitle);
				if (d.aboutMissionTitle !== undefined) setAboutMissionTitle(d.aboutMissionTitle);
				if (d.aboutMissionDetail !== undefined) setAboutMissionDetail(d.aboutMissionDetail);
				if (d.aboutVisionTitle !== undefined) setAboutVisionTitle(d.aboutVisionTitle);
				if (d.aboutVisionDetail !== undefined) setAboutVisionDetail(d.aboutVisionDetail);
				if (d.aboutPromiseTitle !== undefined) setAboutPromiseTitle(d.aboutPromiseTitle);
				if (d.aboutPromiseDetail !== undefined) setAboutPromiseDetail(d.aboutPromiseDetail);
				if (d.aboutHistoryStory !== undefined) setAboutHistoryStory(d.aboutHistoryStory);
				if (d.aboutCoverUrl !== undefined) setAboutCoverUrl(d.aboutCoverUrl);

				// History / Journey Section
				if (d.aboutHistorySectionBadge !== undefined) setAboutHistorySectionBadge(d.aboutHistorySectionBadge);
				if (d.aboutHistorySectionTitle !== undefined) setAboutHistorySectionTitle(d.aboutHistorySectionTitle);
				if (d.aboutMilestones?.length) setAboutMilestones(d.aboutMilestones.map((m: any) => ({ year: m.year || "", title: m.title || "", description: m.description || "", color: m.color || "#7c3aed" })));

				// Core Principles Section
				if (d.aboutPrinciplesSectionBadge !== undefined) setAboutPrinciplesSectionBadge(d.aboutPrinciplesSectionBadge);
				if (d.aboutPrinciplesSectionTitle !== undefined) setAboutPrinciplesSectionTitle(d.aboutPrinciplesSectionTitle);
				if (d.aboutPrinciplesSectionSubtitle !== undefined) setAboutPrinciplesSectionSubtitle(d.aboutPrinciplesSectionSubtitle);
				if (d.aboutCoreValues?.length) setAboutCoreValues(d.aboutCoreValues.map((v: any) => ({ title: v.title || "", description: v.description || "", color: v.color || "#7c3aed" })));

				// Board Section
				if (d.aboutBoardSectionBadge !== undefined) setAboutBoardSectionBadge(d.aboutBoardSectionBadge);
				if (d.aboutBoardSectionTitle !== undefined) setAboutBoardSectionTitle(d.aboutBoardSectionTitle);
				if (d.aboutBoardMembers) setAboutBoardMembers(d.aboutBoardMembers.map((m: any) => ({ name: m.name || "", title: m.title || "", role: m.role || "", photoUrl: m.photoUrl || "", photoPublicId: m.photoPublicId || "", accent: m.accent || "#7c3aed" })));

				// Join CTA Section
				if (d.aboutJoinTitle !== undefined) setAboutJoinTitle(d.aboutJoinTitle);
				if (d.aboutJoinSubtitle !== undefined) setAboutJoinSubtitle(d.aboutJoinSubtitle);
				if (d.aboutJoinEventsButtonText !== undefined) setAboutJoinEventsButtonText(d.aboutJoinEventsButtonText);
				if (d.aboutJoinContactButtonText !== undefined) setAboutJoinContactButtonText(d.aboutJoinContactButtonText);

				// Dedicated Events Page
				if (d.eventsPageBadge !== undefined) setEventsPageBadge(d.eventsPageBadge);
				if (d.eventsPageTitle !== undefined) setEventsPageTitle(d.eventsPageTitle);
				if (d.eventsPageSubtitle !== undefined) setEventsPageSubtitle(d.eventsPageSubtitle);
				if (d.upcomingEventNotice !== undefined) setUpcomingEventNotice(d.upcomingEventNotice);
				if (d.noEventMessage !== undefined) setNoEventMessage(d.noEventMessage);

				// Dedicated Gallery Page
				if (d.galleryPageBadge !== undefined) setGalleryPageBadge(d.galleryPageBadge);
				if (d.galleryPageTitle !== undefined) setGalleryPageTitle(d.galleryPageTitle);
				if (d.galleryPageSubtitle !== undefined) setGalleryPageSubtitle(d.galleryPageSubtitle);

				// Dedicated Blog Page
				if (d.blogPageBadge !== undefined) setBlogPageBadge(d.blogPageBadge);
				if (d.blogPageTitle !== undefined) setBlogPageTitle(d.blogPageTitle);
				if (d.blogPageSubtitle !== undefined) setBlogPageSubtitle(d.blogPageSubtitle);

				// Registration Form Left Panel
				if (d.regFormOrgLine1 !== undefined) setRegFormOrgLine1(d.regFormOrgLine1);
				if (d.regFormOrgLine2 !== undefined) setRegFormOrgLine2(d.regFormOrgLine2);
				if (d.regFormHeadingLine1 !== undefined) setRegFormHeadingLine1(d.regFormHeadingLine1);
				if (d.regFormHeadingLine2 !== undefined) setRegFormHeadingLine2(d.regFormHeadingLine2);
				if (d.regFormHeadingHighlight !== undefined) setRegFormHeadingHighlight(d.regFormHeadingHighlight);
				if (d.regFormDescription !== undefined) setRegFormDescription(d.regFormDescription);
				if (d.regFormFeature1 !== undefined) setRegFormFeature1(d.regFormFeature1);
				if (d.regFormFeature2 !== undefined) setRegFormFeature2(d.regFormFeature2);
				if (d.regFormFeature3 !== undefined) setRegFormFeature3(d.regFormFeature3);

				// Success Page & Ticket
				if (d.successPageTitle !== undefined) setSuccessPageTitle(d.successPageTitle);
				if (d.successPageSubtitle !== undefined) setSuccessPageSubtitle(d.successPageSubtitle);
				if (d.ticketParticipantLabel !== undefined) setTicketParticipantLabel(d.ticketParticipantLabel);

				// Certificate Custom Texts & Logo
				if (d.certMainTitle !== undefined) setCertMainTitle(d.certMainTitle);
				if (d.certSubTitlePrefix !== undefined) setCertSubTitlePrefix(d.certSubTitlePrefix);
				if (d.certBodyText !== undefined) setCertBodyText(d.certBodyText);
				if (d.certSecurityLabel !== undefined) setCertSecurityLabel(d.certSecurityLabel);
				if (d.certShowBismillah !== undefined) setCertShowBismillah(d.certShowBismillah);
				if (d.certBismillahText !== undefined) setCertBismillahText(d.certBismillahText);
				if (d.certTopLogoUrl !== undefined) setCertTopLogoUrl(d.certTopLogoUrl);

				if (d.fieldConfig) {
					// Normalise legacy boolean format or new object format
					const raw = d.fieldConfig as Record<string, any>;
					const keys = Object.keys(
						DEFAULT_FIELD_CONFIG
					) as (keyof FieldConfig)[];
					const normalised = { ...DEFAULT_FIELD_CONFIG };
					keys.forEach((k) => {
						const v = raw[k];
						if (v === null || v === undefined) return;
						if (typeof v === "boolean") {
							normalised[k] = { required: v, enabled: true };
						} else if (typeof v === "object") {
							normalised[k] = {
								required: v.required ?? DEFAULT_FIELD_CONFIG[k].required,
								enabled: v.enabled ?? DEFAULT_FIELD_CONFIG[k].enabled,
							};
						}
					});
					setFieldConfig(normalised);
				}
			}
		} catch {
			toast.error("Failed to fetch settings");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSettings();
	}, []);

	const handleSaveHomepageSettings = async (e: React.FormEvent) => {
		e.preventDefault();
		setSavingHomepage(true);
		try {
			const res = await axios.put("/api/admin/settings/homepage", {
				showHeroSection,
				showAboutSection,
				showStatsSection,
				showEventsSection,
				showGallerySection,
				showBlogSection,
				showTeamSection,
				showContactSection,
				showFooter,

				heroEyebrow,
				heroTitleLine1,
				heroTitleLine2,
				heroDescription,
				heroCtaRegisterText,
				heroCtaAboutText,
				heroCtaEventsText,

				aboutBadge,
				aboutTitle,
				aboutParagraph1,
				aboutParagraph2,
				aboutFoundedYear,
				aboutMissionText,
				aboutVisionText,
				aboutValuesText,
				aboutInnovationText,

				statsMembers,
				statsEvents,
				statsYears,
				statsDistricts,

				eventsSectionTitle,
				eventsSectionSubtitle,
				gallerySectionTitle,
				gallerySectionSubtitle,
				blogSectionTitle,
				blogSectionSubtitle,
				teamSectionTitle,
				teamSectionSubtitle,
				contactSectionTitle,
				contactSectionSubtitle,

				contactEmail,
				footerDescription,
				footerCopyrightText,
				footerFacebookUrl,
				footerYoutubeUrl,
				footerWebsiteUrl,

				// Branding
				siteTitle,
				siteSubtitle,

				// Dedicated About Page
				aboutHeroBadge,
				aboutHeroTitle,
				aboutHeroSubtitle,
				aboutMissionTitle,
				aboutMissionDetail,
				aboutVisionTitle,
				aboutVisionDetail,
				aboutPromiseTitle,
				aboutPromiseDetail,
				aboutHistoryStory,

				// About History Section
				aboutHistorySectionBadge,
				aboutHistorySectionTitle,
				aboutMilestones,

				// About Core Principles Section
				aboutPrinciplesSectionBadge,
				aboutPrinciplesSectionTitle,
				aboutPrinciplesSectionSubtitle,
				aboutCoreValues,

				// About Board Section
				aboutBoardSectionBadge,
				aboutBoardSectionTitle,
				aboutBoardMembers,

				// About Join CTA Section
				aboutJoinTitle,
				aboutJoinSubtitle,
				aboutJoinEventsButtonText,
				aboutJoinContactButtonText,

				// Dedicated Events Page
				eventsPageBadge,
				eventsPageTitle,
				eventsPageSubtitle,
				upcomingEventNotice,
				noEventMessage,

				// Dedicated Gallery & Blog Pages
				galleryPageBadge,
				galleryPageTitle,
				galleryPageSubtitle,
				blogPageBadge,
				blogPageTitle,
				blogPageSubtitle,

				// Registration Form Left Panel
				regFormOrgLine1,
				regFormOrgLine2,
				regFormHeadingLine1,
				regFormHeadingLine2,
				regFormHeadingHighlight,
				regFormDescription,
				regFormFeature1,
				regFormFeature2,
				regFormFeature3,

				// Success Page & Ticket
				successPageTitle,
				successPageSubtitle,
				ticketParticipantLabel,

				// Certificate Custom Texts & Logo
				certMainTitle,
				certSubTitlePrefix,
				certBodyText,
				certSecurityLabel,
				certShowBismillah,
				certBismillahText,
			});

			if (res.data.success) {
				toast.success("Site & Page settings saved successfully!");
			} else {
				toast.error(res.data.error || "Failed to save site settings");
			}
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to save site settings");
		} finally {
			setSavingHomepage(false);
		}
	};

	const toggleRegistrationStatus = async () => {
		setUpdatingStatus(true);
		try {
			const res = await axios.put("/api/admin/settings/status", {
				isOpen: !isRegistrationOpen,
			});
			if (res.data.success) {
				setIsRegistrationOpen(res.data.data.isRegistrationOpen);
				toast.success(
					`Registration is now ${res.data.data.isRegistrationOpen ? "Open" : "Closed"}`
				);
			} else {
				toast.error(res.data.error);
			}
		} catch (err: any) {
			toast.error(
				err.response?.data?.error || "Failed to update registration status"
			);
		} finally {
			setUpdatingStatus(false);
		}
	};

	const handleSaveEventDetails = async (e: React.FormEvent) => {
		e.preventDefault();
		setSavingEvent(true);
		try {
			const res = await axios.put("/api/admin/settings/event", {
				eventName,
				eventAddress,
				eventDate,
				eventStartTime,
				organiserContact,
				showCountdown,
				presidentName,
				presidentTitle,
				presidentSignatureUrl,
				secretaryName,
				secretaryTitle,
				secretarySignatureUrl,
			});

			if (res.data.success) {
				toast.success("Event details saved successfully!");
			} else {
				toast.error(res.data.error || "Failed to save event details");
			}
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to save event details");
		} finally {
			setSavingEvent(false);
		}
	};

	const handleClearEventDetails = async () => {
		if (!window.confirm("Are you sure you want to clear/delete event details?"))
			return;
		setClearingEvent(true);
		try {
			const res = await axios.delete("/api/admin/settings/event");
			if (res.data.success) {
				setEventName("");
				setEventAddress("");
				setEventDate("");
				setEventStartTime("");
				setOrganiserContact("");
				setShowCountdown(true);
				toast.success("Event details cleared!");
			} else {
				toast.error(res.data.error);
			}
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to clear event details");
		} finally {
			setClearingEvent(false);
		}
	};

	const handleSaveFieldConfig = async (e: React.FormEvent) => {
		e.preventDefault();
		setSavingFieldConfig(true);
		try {
			const res = await axios.put("/api/admin/settings/field-config", {
				fieldConfig,
			});
			if (res.data.success) {
				toast.success("Form field validation configuration updated!");
			} else {
				toast.error(
					res.data.error || "Failed to update validation configuration"
				);
			}
		} catch (err: any) {
			toast.error(
				err.response?.data?.error || "Failed to update validation configuration"
			);
		} finally {
			setSavingFieldConfig(false);
		}
	};

	const toggleFieldRequired = (fieldName: keyof FieldConfig) => {
		setFieldConfig((prev) => ({
			...prev,
			[fieldName]: { ...prev[fieldName], required: !prev[fieldName].required },
		}));
	};

	const toggleFieldEnabled = (fieldName: keyof FieldConfig) => {
		setFieldConfig((prev) => ({
			...prev,
			[fieldName]: { ...prev[fieldName], enabled: !prev[fieldName].enabled },
		}));
	};

	// ── Signature Upload Handlers ────────────────────────────────────────────
	const handlePresidentSignatureUpload = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploadingPresidentSig(true);
		const formData = new FormData();
		formData.append("signature", file);
		try {
			const res = await axios.post(
				"/api/admin/settings/signature/president",
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				}
			);
			if (res.data.success) {
				setPresidentSignatureUrl(res.data.data.presidentSignatureUrl);
				toast.success("President signature uploaded!");
			} else {
				toast.error(res.data.error);
			}
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to upload signature");
		} finally {
			setUploadingPresidentSig(false);
			if (presidentSigInputRef.current) presidentSigInputRef.current.value = "";
		}
	};

	const handlePresidentSignatureDelete = async () => {
		if (!window.confirm("Delete president signature?")) return;
		setDeletingPresidentSig(true);
		try {
			const res = await axios.delete("/api/admin/settings/signature/president");
			if (res.data.success) {
				setPresidentSignatureUrl("");
				toast.success("President signature removed");
			} else {
				toast.error(res.data.error);
			}
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to delete signature");
		} finally {
			setDeletingPresidentSig(false);
		}
	};

	const handleSecretarySignatureUpload = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploadingSecretarySig(true);
		const formData = new FormData();
		formData.append("signature", file);
		try {
			const res = await axios.post(
				"/api/admin/settings/signature/secretary",
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				}
			);
			if (res.data.success) {
				setSecretarySignatureUrl(res.data.data.secretarySignatureUrl);
				toast.success("Secretary signature uploaded!");
			} else {
				toast.error(res.data.error);
			}
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to upload signature");
		} finally {
			setUploadingSecretarySig(false);
			if (secretarySigInputRef.current) secretarySigInputRef.current.value = "";
		}
	};

	const handleSecretarySignatureDelete = async () => {
		if (!window.confirm("Delete secretary signature?")) return;
		setDeletingSecretarySig(true);
		try {
			const res = await axios.delete("/api/admin/settings/signature/secretary");
			if (res.data.success) {
				setSecretarySignatureUrl("");
				toast.success("Secretary signature removed");
			} else {
				toast.error(res.data.error);
			}
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to delete signature");
		} finally {
			setDeletingSecretarySig(false);
		}
	};

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);
		const formData = new FormData();
		formData.append("cover", file);

		try {
			const res = await axios.post("/api/admin/settings/cover", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			if (res.data.success) {
				setCoverUrl(res.data.data.eventCoverUrl);
				toast.success("Cover image uploaded successfully!");
			} else {
				toast.error(res.data.error);
			}
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to upload image");
		} finally {
			setUploading(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};

	const handleDelete = async () => {
		if (!window.confirm("Are you sure you want to delete the cover image?"))
			return;
		setDeleting(true);
		try {
			const res = await axios.delete("/api/admin/settings/cover");
			if (res.data.success) {
				setCoverUrl(null);
				toast.success("Cover image deleted");
			} else {
				toast.error(res.data.error);
			}
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to delete image");
		} finally {
			setDeleting(false);
		}
	};

	const handleClearAllData = async () => {
		const isConfirmed = window.confirm(
			"WARNING: Are you absolutely sure you want to delete ALL registrations? This action cannot be undone and will erase all data permanently!"
		);

		if (!isConfirmed) return;

		const doubleCheck = window.prompt("Type 'DELETE ALL' to confirm:");
		if (doubleCheck !== "DELETE ALL") {
			toast.error("Confirmation failed. Data was not deleted.");
			return;
		}

		setClearing(true);
		try {
			const res = await axios.delete("/api/admin/registrations");
			if (res.data.success) {
				toast.success("All registrations have been permanently deleted.");
			} else {
				toast.error(res.data.error);
			}
		} catch (err: any) {
			toast.error(err.response?.data?.error || "Failed to clear data");
		} finally {
			setClearing(false);
		}
	};

	return (
		<div className="space-y-6 max-w-3xl pb-12">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
					Settings
				</h1>
				<p className="text-slate-500">
					Manage event schedule, appearance, and global configuration.
				</p>
			</div>

			{/* Registration Status */}
			<Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
				<CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
					<div className="space-y-1">
						<CardTitle className="text-lg">Registration Status</CardTitle>
						<CardDescription>
							Turn event registration on or off manually.
						</CardDescription>
					</div>
					<div>
						<button
							onClick={toggleRegistrationStatus}
							disabled={updatingStatus || loading}
							className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
								isRegistrationOpen ? "bg-blue-600" : (
									"bg-slate-300 dark:bg-slate-700"
								)
							}`}>
							<span
								className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
									isRegistrationOpen ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
					</div>
				</CardHeader>

			{/* Site Branding & Navbar Logo Settings */}
			<Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
						<Globe className="w-5 h-5 text-indigo-600" />
						Site Branding & Navbar Logo
					</CardTitle>
					<CardDescription>
						Upload custom Navbar Logo and update your organization brand title and tagline shown across the entire site.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
								Site Title / Organization Name
							</label>
							<Input
								value={siteTitle}
								onChange={(e) => setSiteTitle(e.target.value)}
								placeholder="e.g. Talamije Islamia"
								className="h-9 text-xs"
							/>
						</div>
						<div>
							<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
								Site Subtitle / Tagline
							</label>
							<Input
								value={siteSubtitle}
								onChange={(e) => setSiteSubtitle(e.target.value)}
								placeholder="e.g. Chhatak Uttar Upazila"
								className="h-9 text-xs"
							/>
						</div>
					</div>

					{/* Logo Upload Preview & Control */}
					<div className="border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-3">
						<label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
							Navbar & Footer Logo Image
						</label>
						{navbarLogoUrl ? (
							<div className="flex items-center justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
								<div className="flex items-center gap-3">
									<img
										src={navbarLogoUrl}
										alt="Navbar Logo"
										className="w-12 h-12 object-contain rounded-lg border bg-white p-1"
									/>
									<div>
										<p className="text-xs font-medium text-slate-900 dark:text-white">
											Custom Logo Uploaded
										</p>
										<p className="text-[10px] text-slate-400">
											Displayed in Navbar & Footer
										</p>
									</div>
								</div>
								<div className="flex gap-2">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => logoInputRef.current?.click()}
										disabled={uploadingLogo}
										className="text-xs h-8">
										{uploadingLogo ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Upload className="w-3 h-3 mr-1" />}
										Replace
									</Button>
									<Button
										type="button"
										variant="destructive"
										size="sm"
										onClick={handleLogoDelete}
										disabled={deletingLogo}
										className="text-xs h-8">
										{deletingLogo ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
									</Button>
								</div>
							</div>
						) : (
							<div
								onClick={() => logoInputRef.current?.click()}
								className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 hover:bg-indigo-50/20 transition-all">
								{uploadingLogo ? (
									<Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
								) : (
									<Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
								)}
								<p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
									Click to upload Navbar Logo
								</p>
								<p className="text-[10px] text-slate-400">
									PNG, SVG, JPG, WEBP (Transparent background recommended)
								</p>
							</div>
						)}
						<input
							ref={logoInputRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleLogoUpload}
						/>
					</div>

					{/* Certificate & Ticket Custom Watermark Image Upload Box */}
					<div className="border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-3">
						<label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block flex items-center justify-between">
							<span>Certificate &amp; Ticket Custom Watermark Image</span>
							<span className="text-[10px] text-indigo-600 font-normal">Optional (Defaults to Navbar Logo if not uploaded)</span>
						</label>
						{watermarkUrl ? (
							<div className="flex items-center justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
								<div className="flex items-center gap-3">
									<img
										src={watermarkUrl}
										alt="Watermark Seal"
										className="w-12 h-12 object-contain rounded-lg border bg-white p-1"
									/>
									<div>
										<p className="text-xs font-medium text-slate-900 dark:text-white">
											Custom Watermark Seal Uploaded
										</p>
										<p className="text-[10px] text-slate-400">
											Used for background watermark on Certificates &amp; Tickets
										</p>
									</div>
								</div>
								<div className="flex gap-2">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => watermarkInputRef.current?.click()}
										disabled={uploadingWatermark}
										className="text-xs h-8">
										{uploadingWatermark ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Upload className="w-3 h-3 mr-1" />}
										Replace
									</Button>
									<Button
										type="button"
										variant="destructive"
										size="sm"
										onClick={handleWatermarkDelete}
										disabled={deletingWatermark}
										className="text-xs h-8">
										{deletingWatermark ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
									</Button>
								</div>
							</div>
						) : (
							<div
								onClick={() => watermarkInputRef.current?.click()}
								className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 hover:bg-indigo-50/20 transition-all">
								{uploadingWatermark ? (
									<Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
								) : (
									<Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
								)}
								<p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
									Click to upload Custom Watermark Seal / Crest
								</p>
								<p className="text-[10px] text-slate-400">
									PNG, SVG, WEBP (Transparent background recommended)
								</p>
							</div>
						)}
						<input
							ref={watermarkInputRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleWatermarkUpload}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Cover Image Upload */}
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
						<ImageIcon className="w-5 h-5 text-blue-600" />
						Event Cover Image
					</CardTitle>
					<CardDescription>
						This image will be displayed at the top of the Registration Form.
						Recommended size: 1200×400px.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{loading ?
						<div className="flex items-center justify-center h-40">
							<Loader2 className="w-6 h-6 animate-spin text-blue-600" />
						</div>
					: coverUrl ?
						<div className="space-y-4">
							<div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
								<img
									src={coverUrl}
									alt="Event Cover"
									className="w-full h-52 object-cover"
								/>
								<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
									<CheckCircle2 className="w-10 h-10 text-green-400" />
								</div>
							</div>
							<div className="flex flex-col sm:flex-row gap-3">
								<Button
									variant="outline"
									onClick={() => fileInputRef.current?.click()}
									disabled={uploading}
									className="flex-1">
									{uploading ?
										<Loader2 className="w-4 h-4 animate-spin mr-2" />
									:	<Upload className="w-4 h-4 mr-2" />}
									Replace Image
								</Button>
								<Button
									variant="destructive"
									onClick={handleDelete}
									disabled={deleting}
									className="flex-1 sm:flex-none">
									{deleting ?
										<Loader2 className="w-4 h-4 animate-spin mr-2" />
									:	<Trash2 className="w-4 h-4 mr-2" />}
									Delete Image
								</Button>
							</div>
						</div>
					:	<div
							className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center h-52 gap-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group"
							onClick={() => fileInputRef.current?.click()}>
							{uploading ?
								<>
									<Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
									<p className="text-sm text-slate-500 font-medium">
										Uploading to Cloudinary...
									</p>
								</>
							:	<>
									<div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
										<Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-600 transition-colors" />
									</div>
									<div className="text-center">
										<p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
											Click to upload cover image
										</p>
										<p className="text-xs text-slate-400 mt-1">
											PNG, JPG, WEBP up to 10MB
										</p>
									</div>
								</>
							}
						</div>
					}

					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={handleUpload}
					/>
				</CardContent>
			</Card>

			{/* ── Event Details & Schedule Management ── */}
			<Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
						<FileText className="w-5 h-5 text-blue-600" />
						Event Details & Schedule
					</CardTitle>
					<CardDescription>
						Configure Event Name, Location, Date, Time, Organiser Contact, and
						Countdown Timer. These will be displayed on the Registration Form &
						downloadable Ticket PDF. Form auto-closes 30m before Start Time!
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSaveEventDetails}
						className="space-y-4">
						<div>
							<label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
								<FileText className="w-4 h-4 text-slate-400" /> Event Name
							</label>
							<Input
								placeholder="e.g. Medha Jahai Competition 2026"
								value={eventName}
								onChange={(e) => setEventName(e.target.value)}
								className="h-10"
							/>
						</div>

						<div>
							<label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
								<MapPin className="w-4 h-4 text-slate-400" /> Event Address /
								Venue
							</label>
							<Input
								placeholder="e.g. Chhatak Uttar Secondary School Grounds"
								value={eventAddress}
								onChange={(e) => setEventAddress(e.target.value)}
								className="h-10"
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
									<Calendar className="w-4 h-4 text-slate-400" /> Event Date
								</label>
								<Input
									type="date"
									value={eventDate}
									onChange={(e) => setEventDate(e.target.value)}
									className="h-10"
								/>
							</div>

							<div>
								<label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
									<Clock className="w-4 h-4 text-slate-400" /> Event Start Time
								</label>
								<Input
									type="time"
									value={eventStartTime}
									onChange={(e) => setEventStartTime(e.target.value)}
									className="h-10"
								/>
							</div>
						</div>

						<div>
							<label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
								<Phone className="w-4 h-4 text-slate-400" /> Organiser Contact
							</label>
							<Input
								placeholder="e.g. 01700000000 / info@talamij.org"
								value={organiserContact}
								onChange={(e) => setOrganiserContact(e.target.value)}
								className="h-10"
							/>
						</div>

						<div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
							<div className="space-y-0.5">
								<p className="text-sm font-medium text-slate-800 dark:text-slate-200">
									Show Countdown Timer
								</p>
								<p className="text-xs text-slate-500">
									Display an animated live countdown clock on the registration
									form.
								</p>
							</div>
							<button
								type="button"
								onClick={() => setShowCountdown(!showCountdown)}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
									showCountdown ? "bg-blue-600" : (
										"bg-slate-300 dark:bg-slate-700"
									)
								}`}>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
										showCountdown ? "translate-x-6" : "translate-x-1"
									}`}
								/>
							</button>
						</div>

						{/* Signature & Authority Management */}
						<div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-4">
							<h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
								<Award className="w-4 h-4 text-purple-600" />
								Certificate Authorized Signatures
							</h3>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-purple-50/40 dark:bg-purple-950/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
								{/* President */}
								<div className="space-y-3">
									<span className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider block flex items-center gap-1.5">
										<PenLine className="w-3.5 h-3.5" /> President Signature
									</span>
									<div>
										<label className="text-xs text-slate-500 block mb-1">
											President Name
										</label>
										<Input
											placeholder="e.g. Professor Mohammad Farhadul Islam"
											value={presidentName}
											onChange={(e) => setPresidentName(e.target.value)}
											className="h-9 text-xs"
										/>
									</div>
									<div>
										<label className="text-xs text-slate-500 block mb-1">
											President Title / Designation
										</label>
										<Input
											placeholder="e.g. President, Chhatak Uttar"
											value={presidentTitle}
											onChange={(e) => setPresidentTitle(e.target.value)}
											className="h-9 text-xs"
										/>
									</div>
									{/* Signature Image Upload */}
									<div>
										<label className="text-xs text-slate-500 block mb-1.5">
											Signature Image Upload
										</label>
										{presidentSignatureUrl ?
											<div className="relative group rounded-xl overflow-hidden border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 p-3 flex flex-col items-center gap-2">
												<img
													src={presidentSignatureUrl}
													alt="President signature"
													className="h-16 object-contain mix-blend-multiply dark:mix-blend-normal"
												/>
												<div className="flex gap-2 w-full">
													<Button
														type="button"
														size="sm"
														variant="outline"
														className="flex-1 text-xs h-7 border-purple-200 dark:border-purple-800"
														onClick={() =>
															presidentSigInputRef.current?.click()
														}
														disabled={uploadingPresidentSig}>
														{uploadingPresidentSig ?
															<Loader2 className="w-3 h-3 animate-spin mr-1" />
														:	<Upload className="w-3 h-3 mr-1" />}
														Replace
													</Button>
													<Button
														type="button"
														size="sm"
														variant="outline"
														className="text-xs h-7 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
														onClick={handlePresidentSignatureDelete}
														disabled={deletingPresidentSig}>
														{deletingPresidentSig ?
															<Loader2 className="w-3 h-3 animate-spin" />
														:	<X className="w-3 h-3" />}
													</Button>
												</div>
											</div>
										:	<button
												type="button"
												onClick={() => presidentSigInputRef.current?.click()}
												disabled={uploadingPresidentSig}
												className="w-full border-2 border-dashed border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 rounded-xl p-4 flex flex-col items-center gap-2 bg-purple-50/40 dark:bg-purple-950/10 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all group cursor-pointer">
												{uploadingPresidentSig ?
													<Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
												:	<Upload className="w-6 h-6 text-purple-400 group-hover:text-purple-600 transition-colors" />
												}
												<span className="text-xs text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300">
													{uploadingPresidentSig ?
														"Uploading…"
													:	"Click to upload signature image"}
												</span>
												<span className="text-[10px] text-slate-400">
													PNG, JPG, SVG • Transparent background recommended
												</span>
											</button>
										}
										<input
											ref={presidentSigInputRef}
											type="file"
											accept="image/*"
											className="hidden"
											onChange={handlePresidentSignatureUpload}
										/>
									</div>
								</div>

								{/* Secretary */}
								<div className="space-y-3">
									<span className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider block flex items-center gap-1.5">
										<PenLine className="w-3.5 h-3.5" /> Secretary Signature
									</span>
									<div>
										<label className="text-xs text-slate-500 block mb-1">
											Secretary Name
										</label>
										<Input
											placeholder="e.g. Shah Rezwan Hayat"
											value={secretaryName}
											onChange={(e) => setSecretaryName(e.target.value)}
											className="h-9 text-xs"
										/>
									</div>
									<div>
										<label className="text-xs text-slate-500 block mb-1">
											Secretary Title / Designation
										</label>
										<Input
											placeholder="e.g. General Secretary, Chhatak Uttar"
											value={secretaryTitle}
											onChange={(e) => setSecretaryTitle(e.target.value)}
											className="h-9 text-xs"
										/>
									</div>
									{/* Signature Image Upload */}
									<div>
										<label className="text-xs text-slate-500 block mb-1.5">
											Signature Image Upload
										</label>
										{secretarySignatureUrl ?
											<div className="relative group rounded-xl overflow-hidden border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 p-3 flex flex-col items-center gap-2">
												<img
													src={secretarySignatureUrl}
													alt="Secretary signature"
													className="h-16 object-contain mix-blend-multiply dark:mix-blend-normal"
												/>
												<div className="flex gap-2 w-full">
													<Button
														type="button"
														size="sm"
														variant="outline"
														className="flex-1 text-xs h-7 border-purple-200 dark:border-purple-800"
														onClick={() =>
															secretarySigInputRef.current?.click()
														}
														disabled={uploadingSecretarySig}>
														{uploadingSecretarySig ?
															<Loader2 className="w-3 h-3 animate-spin mr-1" />
														:	<Upload className="w-3 h-3 mr-1" />}
														Replace
													</Button>
													<Button
														type="button"
														size="sm"
														variant="outline"
														className="text-xs h-7 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
														onClick={handleSecretarySignatureDelete}
														disabled={deletingSecretarySig}>
														{deletingSecretarySig ?
															<Loader2 className="w-3 h-3 animate-spin" />
														:	<X className="w-3 h-3" />}
													</Button>
												</div>
											</div>
										:	<button
												type="button"
												onClick={() => secretarySigInputRef.current?.click()}
												disabled={uploadingSecretarySig}
												className="w-full border-2 border-dashed border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 rounded-xl p-4 flex flex-col items-center gap-2 bg-purple-50/40 dark:bg-purple-950/10 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all group cursor-pointer">
												{uploadingSecretarySig ?
													<Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
												:	<Upload className="w-6 h-6 text-purple-400 group-hover:text-purple-600 transition-colors" />
												}
												<span className="text-xs text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300">
													{uploadingSecretarySig ?
														"Uploading…"
													:	"Click to upload signature image"}
												</span>
												<span className="text-[10px] text-slate-400">
													PNG, JPG, SVG • Transparent background recommended
												</span>
											</button>
										}
										<input
											ref={secretarySigInputRef}
											type="file"
											accept="image/*"
											className="hidden"
											onChange={handleSecretarySignatureUpload}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-3 pt-2">
							<Button
								type="submit"
								disabled={savingEvent}
								className="bg-blue-600 hover:bg-blue-700">
								{savingEvent ?
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
									</>
								:	<>
										<Save className="w-4 h-4 mr-2" /> Save Event Details
									</>
								}
							</Button>

							<Button
								type="button"
								variant="outline"
								onClick={handleClearEventDetails}
								disabled={clearingEvent}>
								{clearingEvent ?
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
										Clearing...
									</>
								:	<>
										<RotateCcw className="w-4 h-4 mr-2 text-slate-500" /> Clear
										Details
									</>
								}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			{/* ── Form Field Configuration ── */}
			<Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
						<CheckCircle2 className="w-5 h-5 text-blue-600" />
						Registration Form Field Settings
					</CardTitle>
					<CardDescription>
						প্রতিটি field-এ দুটো toggle: <strong>Enable</strong> (field
						দেখাবে/লুকাবে) এবং <strong>Required</strong> (বাধ্যতামূলক করবে)।
						Disabled field form-এ দেখাবে না।
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSaveFieldConfig}
						className="space-y-6">
						{/* Column headers */}
						<div className="hidden md:grid md:grid-cols-2 gap-4">
							<div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-3 pb-1">
								<span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
									Field
								</span>
								<span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-24 text-center">
									Enable
								</span>
								<span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-24 text-center">
									Required
								</span>
							</div>
							<div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-3 pb-1">
								<span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
									Field
								</span>
								<span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-24 text-center">
									Enable
								</span>
								<span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-24 text-center">
									Required
								</span>
							</div>
						</div>

						{/* All 17 Form Fields grouped by section */}
						<div className="space-y-6">
							{[
								{
									section: "Personal Details",
									fields: [
										{ name: "fullName", label: "Full Name" },
										{ name: "mobile", label: "Mobile Number" },
										{ name: "email", label: "Email Address" },
										{ name: "gender", label: "Gender" },
										{ name: "dob", label: "Date of Birth" },
									],
								},
								{
									section: "Academic Info",
									fields: [
										{ name: "schoolName", label: "School / College Name" },
										{ name: "class", label: "Class" },
										{ name: "subjectGroup", label: "Subject / Group" },
										{ name: "rollNumber", label: "Roll Number" },
										{ name: "regNumber", label: "Registration Number" },
										{ name: "passingYear", label: "Passing Year" },
										{ name: "gradeGpa", label: "GPA / Grade" },
									],
								},
								{
									section: "Location & Extra Info",
									fields: [
										{ name: "address", label: "Address" },
										{ name: "district", label: "District" },
										{ name: "bloodGroup", label: "Blood Group" },
										{ name: "fatherName", label: "Father's Name" },
										{ name: "emergencyContact", label: "Emergency Contact" },
									],
								},
							].map((group) => (
								<div
									key={group.section}
									className="space-y-3">
									<h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 border-b border-slate-200 dark:border-slate-800 pb-1">
										{group.section}
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										{group.fields.map((field) => {
											const fieldKey = field.name as keyof FieldConfig;
											const cfg = fieldConfig[fieldKey] || {
												required: false,
												enabled: true,
											};
											return (
												<div
													key={field.name}
													className={`rounded-xl border p-3 transition-all ${
														cfg.enabled ?
															"border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
														:	"border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 opacity-70"
													}`}>
													{/* Field name + status badge */}
													<div className="flex items-center gap-2 mb-3">
														{cfg.enabled ?
															<Eye className="w-3.5 h-3.5 text-blue-500 shrink-0" />
														:	<EyeOff className="w-3.5 h-3.5 text-slate-400 shrink-0" />
														}
														<span
															className={`text-sm font-semibold flex-1 ${
																cfg.enabled ?
																	"text-slate-800 dark:text-slate-100"
																:	"text-slate-400 dark:text-slate-500"
															}`}>
															{field.label}
														</span>
														{!cfg.enabled && (
															<span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">
																Hidden
															</span>
														)}
														{cfg.enabled && cfg.required && (
															<span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
																Required
															</span>
														)}
														{cfg.enabled && !cfg.required && (
															<span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
																Optional
															</span>
														)}
													</div>

													{/* Two toggles side by side */}
													<div className="flex items-center gap-4">
														{/* Enable toggle */}
														<div className="flex items-center gap-2 flex-1">
															<button
																type="button"
																onClick={() => toggleFieldEnabled(fieldKey)}
																className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
																	cfg.enabled ? "bg-blue-600" : (
																		"bg-slate-300 dark:bg-slate-700"
																	)
																}`}>
																<span
																	className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
																		cfg.enabled ? "translate-x-6" : (
																			"translate-x-1"
																		)
																	}`}
																/>
															</button>
															<span className="text-xs text-slate-500 dark:text-slate-400">
																{cfg.enabled ? "Enabled" : "Disabled"}
															</span>
														</div>

														{/* Required toggle — only active when field is enabled */}
														<div
															className={`flex items-center gap-2 flex-1 ${
																!cfg.enabled ?
																	"opacity-40 pointer-events-none"
																:	""
															}`}>
															<button
																type="button"
																onClick={() => toggleFieldRequired(fieldKey)}
																disabled={!cfg.enabled}
																className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
																	cfg.required ? "bg-amber-500" : (
																		"bg-slate-300 dark:bg-slate-700"
																	)
																}`}>
																<span
																	className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
																		cfg.required ? "translate-x-6" : (
																			"translate-x-1"
																		)
																	}`}
																/>
															</button>
															<span className="text-xs text-slate-500 dark:text-slate-400">
																{cfg.required ? "Required" : "Optional"}
															</span>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							))}
						</div>

						<div className="pt-4 border-t border-slate-150 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
							<span className="text-xs text-slate-500 italic">
								সবগুলো (১৭টি) Form Field এখন Admin Settings থেকে Enable/Disable
								ও Required/Optional করা যায়।
							</span>
							<Button
								type="submit"
								disabled={savingFieldConfig}
								className="bg-blue-600 hover:bg-blue-700">
								{savingFieldConfig ?
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
									</>
								:	<>
										<Save className="w-4 h-4 mr-2" /> Save Field Settings
									</>
								}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			{/* ── Home Page Control & Visibility Settings ── */}
			<Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
						<Layout className="w-5 h-5 text-blue-600" />
						Home Page Full Control & Section Visibility
					</CardTitle>
					<CardDescription>
						হোম পেজের যেকোনো সেকশন অন/অফ করুন এবং লেখা, টাইটেল, কাউন্টার ও কন্টেন্ট অ্যাডমিন প্যানেল থেকে সম্পুর্ণ পরিবর্তন করুন।
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSaveHomepageSettings} className="space-y-8">
						{/* 1. Section Visibility Switches */}
						<div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
							<div className="flex items-center gap-2 mb-2">
								<Layers className="w-4 h-4 text-blue-600" />
								<h3 className="text-sm font-bold text-slate-900 dark:text-white">
									Home Page Section Visibility Toggles (Show / Hide)
								</h3>
							</div>
							<p className="text-xs text-slate-500 mb-4">
								যেকোনো সেকশন বন্ধ করলে তা হোম পেজে আর দেখাবে না।
							</p>

							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
								{[
									{ label: "Hero Section", state: showHeroSection, setState: setShowHeroSection },
									{ label: "About Section", state: showAboutSection, setState: setShowAboutSection },
									{ label: "Stats Counters", state: showStatsSection, setState: setShowStatsSection },
									{ label: "Events Preview", state: showEventsSection, setState: setShowEventsSection },
									{ label: "Gallery Preview", state: showGallerySection, setState: setShowGallerySection },
									{ label: "Blog & News Preview", state: showBlogSection, setState: setShowBlogSection },
									{ label: "Team / Leadership", state: showTeamSection, setState: setShowTeamSection },
									{ label: "Contact Section", state: showContactSection, setState: setShowContactSection },
									{ label: "Footer Section", state: showFooter, setState: setShowFooter },
								].map((item) => (
									<div
										key={item.label}
										className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
											item.state ?
												"border-blue-200 dark:border-blue-900/40 bg-white dark:bg-slate-900"
											:	"border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/40 opacity-70"
										}`}>
										<span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
											{item.label}
										</span>
										<button
											type="button"
											onClick={() => item.setState(!item.state)}
											className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
												item.state ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
											}`}>
											<span
												className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
													item.state ? "translate-x-6" : "translate-x-1"
												}`}
											/>
										</button>
									</div>
								))}
							</div>
						</div>

						{/* 2. Hero Section Content */}
						<div className="space-y-4 pt-2">
							<h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
								<Sparkles className="w-4 h-4 text-purple-600" /> Hero Section Content
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Hero Eyebrow / Sub-badge
									</label>
									<Input
										value={heroEyebrow}
										onChange={(e) => setHeroEyebrow(e.target.value)}
										placeholder="e.g. Chhatak Uttar Upazila"
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Main Heading Line 1
									</label>
									<Input
										value={heroTitleLine1}
										onChange={(e) => setHeroTitleLine1(e.target.value)}
										placeholder="e.g. Bangladesh Anjumane"
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Main Heading Line 2 (Gradient Text)
									</label>
									<Input
										value={heroTitleLine2}
										onChange={(e) => setHeroTitleLine2(e.target.value)}
										placeholder="e.g. Talamije Islamia"
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Primary Button Text (Event Registration)
									</label>
									<Input
										value={heroCtaRegisterText}
										onChange={(e) => setHeroCtaRegisterText(e.target.value)}
										placeholder="e.g. Register for Event"
										className="h-9 text-xs"
									/>
								</div>
								<div className="sm:col-span-2">
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Hero Description / Subtitle
									</label>
									<Input
										value={heroDescription}
										onChange={(e) => setHeroDescription(e.target.value)}
										placeholder="e.g. Dedicated to fostering education..."
										className="h-9 text-xs"
									/>
								</div>
							</div>
						</div>

						{/* 3. About Section Content */}
						<div className="space-y-4 pt-2">
							<h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
								<FileText className="w-4 h-4 text-blue-600" /> About Us Section Content
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Section Badge
									</label>
									<Input
										value={aboutBadge}
										onChange={(e) => setAboutBadge(e.target.value)}
										placeholder="e.g. About Us"
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Founded Year
									</label>
									<Input
										value={aboutFoundedYear}
										onChange={(e) => setAboutFoundedYear(e.target.value)}
										placeholder="e.g. 2018"
										className="h-9 text-xs"
									/>
								</div>
								<div className="sm:col-span-2">
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										About Main Title
									</label>
									<Input
										value={aboutTitle}
										onChange={(e) => setAboutTitle(e.target.value)}
										placeholder="e.g. Talamij — A Journey of Dreams"
										className="h-9 text-xs"
									/>
								</div>
								<div className="sm:col-span-2">
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Paragraph 1
									</label>
									<textarea
										rows={2}
										value={aboutParagraph1}
										onChange={(e) => setAboutParagraph1(e.target.value)}
										className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
									/>
								</div>
								<div className="sm:col-span-2">
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Paragraph 2
									</label>
									<textarea
										rows={2}
										value={aboutParagraph2}
										onChange={(e) => setAboutParagraph2(e.target.value)}
										className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Mission Text
									</label>
									<Input
										value={aboutMissionText}
										onChange={(e) => setAboutMissionText(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Vision Text
									</label>
									<Input
										value={aboutVisionText}
										onChange={(e) => setAboutVisionText(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Values Text
									</label>
									<Input
										value={aboutValuesText}
										onChange={(e) => setAboutValuesText(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Innovation Text
									</label>
									<Input
										value={aboutInnovationText}
										onChange={(e) => setAboutInnovationText(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
							</div>
						</div>

						{/* 3.1 Dedicated About Page Details & Banner */}
						<div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
							<h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-1">
								<FileText className="w-4 h-4 text-violet-600" /> Dedicated About Page (/about) Extra Details & Banner
							</h3>

							{/* About Cover Image */}
							<div className="border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-3">
								<label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
									About Page Cover / Banner Image
								</label>
								{aboutCoverUrl ? (
									<div className="flex items-center justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
										<div className="flex items-center gap-3">
											<img
												src={aboutCoverUrl}
												alt="About Cover"
												className="w-16 h-10 object-cover rounded-lg border"
											/>
											<div>
												<p className="text-xs font-medium text-slate-900 dark:text-white">
													About Cover Image Uploaded
												</p>
												<p className="text-[10px] text-slate-400">
													Displayed on top of /about page
												</p>
											</div>
										</div>
										<div className="flex gap-2">
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => aboutCoverInputRef.current?.click()}
												disabled={uploadingAboutCover}
												className="text-xs h-8">
												{uploadingAboutCover ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Upload className="w-3 h-3 mr-1" />}
												Replace
											</Button>
											<Button
												type="button"
												variant="destructive"
												size="sm"
												onClick={handleAboutCoverDelete}
												disabled={deletingAboutCover}
												className="text-xs h-8">
												{deletingAboutCover ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
											</Button>
										</div>
									</div>
								) : (
									<div
										onClick={() => aboutCoverInputRef.current?.click()}
										className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-violet-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 hover:bg-violet-50/20 transition-all">
										{uploadingAboutCover ? (
											<Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
										) : (
											<Upload className="w-6 h-6 text-slate-400 group-hover:text-violet-600" />
										)}
										<p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
											Click to upload About Page Cover Image
										</p>
										<p className="text-[10px] text-slate-400">
											PNG, JPG, WEBP up to 10MB
										</p>
									</div>
								)}
								<input
									ref={aboutCoverInputRef}
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleAboutCoverUpload}
								/>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										About Page Hero Badge
									</label>
									<Input
										value={aboutHeroBadge}
										onChange={(e) => setAboutHeroBadge(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										About Page Hero Title
									</label>
									<Input
										value={aboutHeroTitle}
										onChange={(e) => setAboutHeroTitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div className="sm:col-span-2">
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										About Page Hero Subtitle / Brief
									</label>
									<Input
										value={aboutHeroSubtitle}
										onChange={(e) => setAboutHeroSubtitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Mission Card Title
									</label>
									<Input
										value={aboutMissionTitle}
										onChange={(e) => setAboutMissionTitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Mission Card Description
									</label>
									<textarea
										rows={2}
										value={aboutMissionDetail}
										onChange={(e) => setAboutMissionDetail(e.target.value)}
										className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Vision Card Title
									</label>
									<Input
										value={aboutVisionTitle}
										onChange={(e) => setAboutVisionTitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Vision Card Description
									</label>
									<textarea
										rows={2}
										value={aboutVisionDetail}
										onChange={(e) => setAboutVisionDetail(e.target.value)}
										className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Promise Card Title
									</label>
									<Input
										value={aboutPromiseTitle}
										onChange={(e) => setAboutPromiseTitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Promise Card Description
									</label>
									<textarea
										rows={2}
										value={aboutPromiseDetail}
										onChange={(e) => setAboutPromiseDetail(e.target.value)}
										className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
									/>
								</div>
							</div>
						</div>

						{/* 3.3 History / Journey Section Builder */}
						<div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
							<h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-1">
								<Flag className="w-4 h-4 text-cyan-500" /> Our History — Talamij's Journey Section
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">Section Badge</label>
									<Input value={aboutHistorySectionBadge} onChange={(e) => setAboutHistorySectionBadge(e.target.value)} placeholder="e.g. Our History" className="h-9 text-xs" />
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">Section Title</label>
									<Input value={aboutHistorySectionTitle} onChange={(e) => setAboutHistorySectionTitle(e.target.value)} placeholder="e.g. Talamij's Journey" className="h-9 text-xs" />
								</div>
							</div>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Timeline Milestones ({aboutMilestones.length})</p>
									<Button type="button" size="sm" variant="outline" onClick={addMilestone} className="h-7 text-xs gap-1">
										<Plus className="w-3 h-3" /> Add Milestone
									</Button>
								</div>
								{aboutMilestones.map((m, i) => (
									<div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
										<div className="flex items-center justify-between mb-1">
											<span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Milestone #{i + 1}</span>
											<Button type="button" size="sm" variant="destructive" onClick={() => removeMilestone(i)} className="h-6 w-6 p-0">
												<Trash2 className="w-3 h-3" />
											</Button>
										</div>
										<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
											<div>
												<label className="text-[10px] text-slate-500 mb-0.5 block">Year</label>
												<Input value={m.year} onChange={(e) => updateMilestone(i, "year", e.target.value)} placeholder="2018" className="h-7 text-xs" />
											</div>
											<div>
												<label className="text-[10px] text-slate-500 mb-0.5 block">Title</label>
												<Input value={m.title} onChange={(e) => updateMilestone(i, "title", e.target.value)} placeholder="Foundation" className="h-7 text-xs" />
											</div>
											<div className="col-span-2">
												<label className="text-[10px] text-slate-500 mb-0.5 block">Accent Color</label>
												<div className="flex items-center gap-2">
													<input type="color" value={m.color} onChange={(e) => updateMilestone(i, "color", e.target.value)} className="h-7 w-10 rounded cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent" />
													<Input value={m.color} onChange={(e) => updateMilestone(i, "color", e.target.value)} className="h-7 text-xs font-mono" />
												</div>
											</div>
										</div>
										<div>
											<label className="text-[10px] text-slate-500 mb-0.5 block">Description</label>
											<textarea rows={2} value={m.description} onChange={(e) => updateMilestone(i, "description", e.target.value)} placeholder="Describe this milestone..." className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
										</div>
									</div>
								))}
							</div>
						</div>

						{/* 3.4 Core Principles / Values Section Builder */}
						<div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
							<h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-1">
								<Heart className="w-4 h-4 text-pink-500" /> Our Core Principles Section
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">Section Badge</label>
									<Input value={aboutPrinciplesSectionBadge} onChange={(e) => setAboutPrinciplesSectionBadge(e.target.value)} placeholder="e.g. Values" className="h-9 text-xs" />
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">Section Title</label>
									<Input value={aboutPrinciplesSectionTitle} onChange={(e) => setAboutPrinciplesSectionTitle(e.target.value)} placeholder="e.g. Our Core Principles" className="h-9 text-xs" />
								</div>
								<div className="sm:col-span-2">
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">Section Subtitle</label>
									<Input value={aboutPrinciplesSectionSubtitle} onChange={(e) => setAboutPrinciplesSectionSubtitle(e.target.value)} placeholder="e.g. These core principles..." className="h-9 text-xs" />
								</div>
							</div>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Value Cards ({aboutCoreValues.length})</p>
									<Button type="button" size="sm" variant="outline" onClick={addCoreValue} className="h-7 text-xs gap-1">
										<Plus className="w-3 h-3" /> Add Value
									</Button>
								</div>
								{aboutCoreValues.map((v, i) => (
									<div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
										<div className="flex items-center justify-between mb-1">
											<span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Value #{i + 1}</span>
											<Button type="button" size="sm" variant="destructive" onClick={() => removeCoreValue(i)} className="h-6 w-6 p-0">
												<Trash2 className="w-3 h-3" />
											</Button>
										</div>
										<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
											<div className="sm:col-span-2">
												<label className="text-[10px] text-slate-500 mb-0.5 block">Title</label>
												<Input value={v.title} onChange={(e) => updateCoreValue(i, "title", e.target.value)} placeholder="e.g. Integrity & Transparency" className="h-7 text-xs" />
											</div>
											<div>
												<label className="text-[10px] text-slate-500 mb-0.5 block">Accent Color</label>
												<div className="flex items-center gap-2">
													<input type="color" value={v.color} onChange={(e) => updateCoreValue(i, "color", e.target.value)} className="h-7 w-10 rounded cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent" />
													<Input value={v.color} onChange={(e) => updateCoreValue(i, "color", e.target.value)} className="h-7 text-xs font-mono" />
												</div>
											</div>
										</div>
										<div>
											<label className="text-[10px] text-slate-500 mb-0.5 block">Description</label>
											<textarea rows={2} value={v.description} onChange={(e) => updateCoreValue(i, "description", e.target.value)} placeholder="Describe this value..." className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
										</div>
									</div>
								))}
							</div>
						</div>

						{/* 3.5 Executive Board Section Builder */}
						<div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
							<h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-1">
								<Users className="w-4 h-4 text-violet-500" /> Our Executive Board Section
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">Section Badge</label>
									<Input value={aboutBoardSectionBadge} onChange={(e) => setAboutBoardSectionBadge(e.target.value)} placeholder="e.g. Leadership" className="h-9 text-xs" />
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">Section Title</label>
									<Input value={aboutBoardSectionTitle} onChange={(e) => setAboutBoardSectionTitle(e.target.value)} placeholder="e.g. Our Executive Board" className="h-9 text-xs" />
								</div>
							</div>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Board Members ({aboutBoardMembers.length})</p>
									<Button type="button" size="sm" variant="outline" onClick={addBoardMember} className="h-7 text-xs gap-1">
										<Plus className="w-3 h-3" /> Add Member
									</Button>
								</div>
								{aboutBoardMembers.map((member, i) => (
									<div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
										<div className="flex items-center justify-between mb-1">
											<span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Member #{i + 1}</span>
											<Button type="button" size="sm" variant="destructive" onClick={() => removeBoardMember(i)} className="h-6 w-6 p-0">
												<Trash2 className="w-3 h-3" />
											</Button>
										</div>
										<div className="flex items-center gap-3">
											<div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0" style={{ background: `${member.accent}20` }}>
												{member.photoUrl ? (
													<img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
												) : (
													<span className="text-lg font-bold" style={{ color: member.accent }}>{(member.name || "?").charAt(0).toUpperCase()}</span>
												)}
											</div>
											<div className="flex gap-2 flex-wrap">
												<Button type="button" size="sm" variant="outline" className="text-xs h-7 gap-1" onClick={() => boardPhotoInputRefs.current[i]?.click()} disabled={uploadingBoardPhoto === i}>
													{uploadingBoardPhoto === i ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
													{member.photoUrl ? "Replace" : "Upload Photo"}
												</Button>
												{member.photoUrl && (
													<Button type="button" size="sm" variant="destructive" className="h-7 w-7 p-0" onClick={() => handleBoardMemberPhotoDelete(i)}>
														<Trash2 className="w-3 h-3" />
													</Button>
												)}
											</div>
											<input ref={(el) => { boardPhotoInputRefs.current[i] = el; }} type="file" accept="image/*" className="hidden" onChange={(e) => handleBoardMemberPhotoUpload(e, i)} />
										</div>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
											<div>
												<label className="text-[10px] text-slate-500 mb-0.5 block">Full Name</label>
												<Input value={member.name} onChange={(e) => updateBoardMember(i, "name", e.target.value)} placeholder="e.g. Md. Abdur Rahman" className="h-7 text-xs" />
											</div>
											<div>
												<label className="text-[10px] text-slate-500 mb-0.5 block">Role / Position</label>
												<Input value={member.role} onChange={(e) => updateBoardMember(i, "role", e.target.value)} placeholder="e.g. President" className="h-7 text-xs" />
											</div>
											<div className="sm:col-span-2">
												<label className="text-[10px] text-slate-500 mb-0.5 block">Title (subtitle under name)</label>
												<Input value={member.title} onChange={(e) => updateBoardMember(i, "title", e.target.value)} placeholder="e.g. President, Talamij Chhatak Uttar" className="h-7 text-xs" />
											</div>
											<div>
												<label className="text-[10px] text-slate-500 mb-0.5 block">Accent Color</label>
												<div className="flex items-center gap-2">
													<input type="color" value={member.accent} onChange={(e) => updateBoardMember(i, "accent", e.target.value)} className="h-7 w-10 rounded cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent" />
													<Input value={member.accent} onChange={(e) => updateBoardMember(i, "accent", e.target.value)} className="h-7 text-xs font-mono" />
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* 3.6 Join Our Organization CTA */}
						<div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
							<h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-1">
								<Award className="w-4 h-4 text-amber-500" /> Join Our Organization — CTA Section
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">CTA Title</label>
									<Input value={aboutJoinTitle} onChange={(e) => setAboutJoinTitle(e.target.value)} placeholder="e.g. Join Our Organization" className="h-9 text-xs" />
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">Events Button Text</label>
									<Input value={aboutJoinEventsButtonText} onChange={(e) => setAboutJoinEventsButtonText(e.target.value)} placeholder="e.g. View Events" className="h-9 text-xs" />
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">Contact Button Text</label>
									<Input value={aboutJoinContactButtonText} onChange={(e) => setAboutJoinContactButtonText(e.target.value)} placeholder="e.g. Contact Us" className="h-9 text-xs" />
								</div>
								<div className="sm:col-span-2">
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">CTA Subtitle / Description</label>
									<textarea rows={2} value={aboutJoinSubtitle} onChange={(e) => setAboutJoinSubtitle(e.target.value)} placeholder="e.g. Become part of the growing Talamij family..." className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
								</div>
							</div>
						</div>

						{/* 3.2 Dedicated Events Page Content & Notices */}
						<div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
							<h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-1">
								<Calendar className="w-4 h-4 text-cyan-600" /> Dedicated Events Page (/events) Settings & Notices
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Events Page Hero Badge
									</label>
									<Input
										value={eventsPageBadge}
										onChange={(e) => setEventsPageBadge(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Events Page Hero Title
									</label>
									<Input
										value={eventsPageTitle}
										onChange={(e) => setEventsPageTitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div className="sm:col-span-2">
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Events Page Subtitle
									</label>
									<Input
										value={eventsPageSubtitle}
										onChange={(e) => setEventsPageSubtitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div className="sm:col-span-2">
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Upcoming Event Notice / Banner Text
									</label>
									<Input
										value={upcomingEventNotice}
										onChange={(e) => setUpcomingEventNotice(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div className="sm:col-span-2">
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										No Event Active Message
									</label>
									<Input
										value={noEventMessage}
										onChange={(e) => setNoEventMessage(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
							</div>
						</div>

						{/* 3.8 Dedicated Gallery Page Content */}
						<div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
							<h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-1">
								<ImageIcon className="w-4 h-4 text-pink-500" /> Dedicated Gallery Page (/gallery) Settings
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Gallery Page Hero Badge
									</label>
									<Input
										value={galleryPageBadge}
										onChange={(e) => setGalleryPageBadge(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Gallery Page Hero Title
									</label>
									<Input
										value={galleryPageTitle}
										onChange={(e) => setGalleryPageTitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div className="sm:col-span-2">
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Gallery Page Subtitle
									</label>
									<Input
										value={galleryPageSubtitle}
										onChange={(e) => setGalleryPageSubtitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
							</div>
						</div>

						{/* 3.9 Dedicated Blog Page Content */}
						<div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
							<h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-1">
								<FileText className="w-4 h-4 text-emerald-500" /> Dedicated Blog Page (/blog) Settings
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Blog Page Hero Badge
									</label>
									<Input
										value={blogPageBadge}
										onChange={(e) => setBlogPageBadge(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Blog Page Hero Title
									</label>
									<Input
										value={blogPageTitle}
										onChange={(e) => setBlogPageTitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div className="sm:col-span-2">
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Blog Page Subtitle
									</label>
									<Input
										value={blogPageSubtitle}
										onChange={(e) => setBlogPageSubtitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
							</div>
						</div>

						{/* 3.10 Registration Form Left Panel */}
						<div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
							<h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-1">
								<FileText className="w-4 h-4 text-blue-500" /> Registration Form — Left Panel Content
							</h3>

							{/* Org Name Lines */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Organisation Name (Line 1)
									</label>
									<Input
										value={regFormOrgLine1}
										onChange={(e) => setRegFormOrgLine1(e.target.value)}
										placeholder="e.g. Bangladesh Anjumane Talamije Islamia"
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Organisation Name (Line 2)
									</label>
									<Input
										value={regFormOrgLine2}
										onChange={(e) => setRegFormOrgLine2(e.target.value)}
										placeholder="e.g. Chhatak Uttar Upazila"
										className="h-9 text-xs"
									/>
								</div>
							</div>

							{/* Main Heading */}
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Heading Line 1
									</label>
									<Input
										value={regFormHeadingLine1}
										onChange={(e) => setRegFormHeadingLine1(e.target.value)}
										placeholder="e.g. Register &"
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Heading Line 2
									</label>
									<Input
										value={regFormHeadingLine2}
										onChange={(e) => setRegFormHeadingLine2(e.target.value)}
										placeholder="e.g. Get Your"
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Heading Highlight (blue text)
									</label>
									<Input
										value={regFormHeadingHighlight}
										onChange={(e) => setRegFormHeadingHighlight(e.target.value)}
										placeholder="e.g. Digital Ticket"
										className="h-9 text-xs"
									/>
								</div>
							</div>

							{/* Description */}
							<div>
								<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
									Description Text
								</label>
								<Input
									value={regFormDescription}
									onChange={(e) => setRegFormDescription(e.target.value)}
									placeholder="e.g. Fill out the form to secure your spot..."
									className="h-9 text-xs"
								/>
							</div>

							{/* Feature List Items */}
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Feature 1 Label
									</label>
									<Input
										value={regFormFeature1}
										onChange={(e) => setRegFormFeature1(e.target.value)}
										placeholder="e.g. Academic Excellence"
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Feature 2 Label
									</label>
									<Input
										value={regFormFeature2}
										onChange={(e) => setRegFormFeature2(e.target.value)}
										placeholder="e.g. Health & Safety"
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Feature 3 Label
									</label>
									<Input
										value={regFormFeature3}
										onChange={(e) => setRegFormFeature3(e.target.value)}
										placeholder="e.g. Multi-Subject Programs"
										className="h-9 text-xs"
									/>
								</div>
							</div>
						</div>

						{/* 3.11 Ticket & Success Page Content */}
						<div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
							<h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-1">
								<CheckCircle2 className="w-4 h-4 text-green-500" /> Ticket & Success Page Content
							</h3>

							{/* Success Page Texts */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Success Page Heading
									</label>
									<Input
										value={successPageTitle}
										onChange={(e) => setSuccessPageTitle(e.target.value)}
										placeholder="e.g. Registration Successful!"
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Ticket Participant Label
									</label>
									<Input
										value={ticketParticipantLabel}
										onChange={(e) => setTicketParticipantLabel(e.target.value)}
										placeholder="e.g. Participant Ticket"
										className="h-9 text-xs"
									/>
								</div>
							</div>
							<div>
								<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
									Success Page Subtitle
								</label>
								<Input
									value={successPageSubtitle}
									onChange={(e) => setSuccessPageSubtitle(e.target.value)}
									placeholder="e.g. Your digital ticket is ready. Please save or print it."
									className="h-9 text-xs"
								/>
							</div>
							<p className="text-[11px] text-slate-400">
								💡 Ticket logo and org name use the <strong>Navbar Logo</strong> and <strong>Organisation Name (Line 1 &amp; 2)</strong> from the Registration Form settings above.
							</p>
						</div>

						{/* 3.12 Printable Certificate Content Controls */}
						<div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
							<h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-1">
								<Award className="w-4 h-4 text-purple-600" /> Certificate Template &amp; Calligraphy Controls
							</h3>

							{/* Arabic Bismillah Calligraphy Toggle & Text */}
							<div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
								<div className="flex items-center justify-between">
									<div>
										<label className="text-xs font-semibold text-slate-900 dark:text-white block">
											Arabic Calligraphy Header (e.g. ﷽ Bismillah)
										</label>
										<p className="text-[10px] text-slate-400">
											Show or hide the Arabic calligraphy header at the top of the certificate
										</p>
									</div>
									<div className="flex items-center gap-2">
										<button
											type="button"
											onClick={() => setCertShowBismillah(!certShowBismillah)}
											className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
												certShowBismillah ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
											}`}
										>
											<span
												className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
													certShowBismillah ? "translate-x-5" : "translate-x-0"
												}`}
											/>
										</button>
										<span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
											{certShowBismillah ? "ENABLED" : "DISABLED"}
										</span>
									</div>
								</div>

								{certShowBismillah && (
									<div>
										<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
											Calligraphy Text / Symbol
										</label>
										<Input
											value={certBismillahText}
											onChange={(e) => setCertBismillahText(e.target.value)}
											placeholder="e.g. ﷽"
											className="h-9 text-sm font-serif"
										/>
									</div>
								)}
							</div>

							{/* Dedicated Certificate Top Logo Upload */}
							<div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
								<label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block flex items-center justify-between">
									<span>Dedicated Certificate Top Logo (Optional)</span>
									<span className="text-[10px] text-indigo-600 font-normal">Defaults to Navbar Logo if not set</span>
								</label>
								{certTopLogoUrl ? (
									<div className="flex items-center justify-between gap-4 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
										<div className="flex items-center gap-3">
											<img
												src={certTopLogoUrl}
												alt="Certificate Top Logo"
												className="w-12 h-12 object-contain rounded-full border bg-white p-1"
											/>
											<div>
												<p className="text-xs font-medium text-slate-900 dark:text-white">
													Custom Top Logo Uploaded
												</p>
												<p className="text-[10px] text-slate-400">
													Displayed at the top header of printable certificates
												</p>
											</div>
										</div>
										<div className="flex gap-2">
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => certLogoInputRef.current?.click()}
												disabled={uploadingCertLogo}
												className="text-xs h-8">
												{uploadingCertLogo ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Upload className="w-3 h-3 mr-1" />}
												Replace
											</Button>
											<Button
												type="button"
												variant="destructive"
												size="sm"
												onClick={handleCertLogoDelete}
												disabled={deletingCertLogo}
												className="text-xs h-8">
												{deletingCertLogo ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
											</Button>
										</div>
									</div>
								) : (
									<div
										onClick={() => certLogoInputRef.current?.click()}
										className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-white dark:bg-slate-900 hover:bg-purple-50/20 transition-all">
										{uploadingCertLogo ? (
											<Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
										) : (
											<Upload className="w-6 h-6 text-slate-400 group-hover:text-purple-600" />
										)}
										<p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
											Click to upload Certificate Top Logo
										</p>
										<p className="text-[10px] text-slate-400">
											PNG, SVG, WEBP (Circular/Transparent recommended)
										</p>
									</div>
								)}
								<input
									ref={certLogoInputRef}
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleCertLogoUpload}
								/>
							</div>

							{/* Custom Certificate Titles & Texts */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Certificate Title
									</label>
									<Input
										value={certMainTitle}
										onChange={(e) => setCertMainTitle(e.target.value)}
										placeholder="e.g. Certificate of Participation"
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Sub-title Prefix
									</label>
									<Input
										value={certSubTitlePrefix}
										onChange={(e) => setCertSubTitlePrefix(e.target.value)}
										placeholder="e.g. This is to certify that"
										className="h-9 text-xs"
									/>
								</div>
							</div>

							<div>
								<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
									Participation Body Description
								</label>
								<Input
									value={certBodyText}
									onChange={(e) => setCertBodyText(e.target.value)}
									placeholder="e.g. successfully registered and participated in the event"
									className="h-9 text-xs"
								/>
							</div>

							<div>
								<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
									Security Verification Badge Text
								</label>
								<Input
									value={certSecurityLabel}
									onChange={(e) => setCertSecurityLabel(e.target.value)}
									placeholder="e.g. Official Security Verification"
									className="h-9 text-xs"
								/>
							</div>
							<p className="text-[11px] text-slate-400">
								💡 Participant Name, Registration ID, Event Name, Event Date, and Signatures are populated automatically from the database. All other header titles, Bismillah calligraphy, logos, and custom labels above are completely customizable here.
							</p>
						</div>

						{/* 4. Stats Counter Numbers */}
						<div className="space-y-4 pt-2">
							<h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
								<Clock className="w-4 h-4 text-emerald-600" /> Stats Counters (Live animated numbers)
							</h3>
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Members Count
									</label>
									<Input
										value={statsMembers}
										onChange={(e) => setStatsMembers(e.target.value)}
										placeholder="e.g. 5000+"
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Events Count
									</label>
									<Input
										value={statsEvents}
										onChange={(e) => setStatsEvents(e.target.value)}
										placeholder="e.g. 48+"
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Years Count
									</label>
									<Input
										value={statsYears}
										onChange={(e) => setStatsYears(e.target.value)}
										placeholder="e.g. 6+"
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Districts Active
									</label>
									<Input
										value={statsDistricts}
										onChange={(e) => setStatsDistricts(e.target.value)}
										placeholder="e.g. 12"
										className="h-9 text-xs"
									/>
								</div>
							</div>
						</div>

						{/* 5. Section Titles & Subtitles */}
						<div className="space-y-4 pt-2">
							<h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
								<PenLine className="w-4 h-4 text-amber-600" /> Section Titles & Subtitles
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Events Section Title
									</label>
									<Input
										value={eventsSectionTitle}
										onChange={(e) => setEventsSectionTitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Events Section Subtitle
									</label>
									<Input
										value={eventsSectionSubtitle}
										onChange={(e) => setEventsSectionSubtitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Gallery Section Title
									</label>
									<Input
										value={gallerySectionTitle}
										onChange={(e) => setGallerySectionTitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Gallery Section Subtitle
									</label>
									<Input
										value={gallerySectionSubtitle}
										onChange={(e) => setGallerySectionSubtitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Blog Section Title
									</label>
									<Input
										value={blogSectionTitle}
										onChange={(e) => setBlogSectionTitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Blog Section Subtitle
									</label>
									<Input
										value={blogSectionSubtitle}
										onChange={(e) => setBlogSectionSubtitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Team Section Title
									</label>
									<Input
										value={teamSectionTitle}
										onChange={(e) => setTeamSectionTitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Team Section Subtitle
									</label>
									<Input
										value={teamSectionSubtitle}
										onChange={(e) => setTeamSectionSubtitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Contact Section Title
									</label>
									<Input
										value={contactSectionTitle}
										onChange={(e) => setContactSectionTitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Contact Section Subtitle
									</label>
									<Input
										value={contactSectionSubtitle}
										onChange={(e) => setContactSectionSubtitle(e.target.value)}
										className="h-9 text-xs"
									/>
								</div>
							</div>
						</div>

						{/* 6. Contact & Footer Info */}
						<div className="space-y-4 pt-2">
							<h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
								<Globe className="w-4 h-4 text-sky-600" /> Contact & Footer Information
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Contact Email
									</label>
									<Input
										value={contactEmail}
										onChange={(e) => setContactEmail(e.target.value)}
										placeholder="e.g. contact@talamij.org"
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Footer Copyright Text
									</label>
									<Input
										value={footerCopyrightText}
										onChange={(e) => setFooterCopyrightText(e.target.value)}
										placeholder="Leave empty for auto-generated copyright"
										className="h-9 text-xs"
									/>
								</div>
								<div className="sm:col-span-2">
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Footer Description Text
									</label>
									<textarea
										rows={2}
										value={footerDescription}
										onChange={(e) => setFooterDescription(e.target.value)}
										className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										Facebook URL
									</label>
									<Input
										value={footerFacebookUrl}
										onChange={(e) => setFooterFacebookUrl(e.target.value)}
										placeholder="https://facebook.com/..."
										className="h-9 text-xs"
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
										YouTube URL
									</label>
									<Input
										value={footerYoutubeUrl}
										onChange={(e) => setFooterYoutubeUrl(e.target.value)}
										placeholder="https://youtube.com/..."
										className="h-9 text-xs"
									/>
								</div>
							</div>
						</div>

						<div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
							<Button
								type="submit"
								disabled={savingHomepage}
								className="bg-blue-600 hover:bg-blue-700 font-medium">
								{savingHomepage ?
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving Home Page Settings...
									</>
								:	<>
										<Save className="w-4 h-4 mr-2" /> Save Home Page Settings
									</>
								}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			{/* Danger Zone */}
			<Card className="border border-red-200 dark:border-red-900 shadow-sm">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-500">
						<AlertTriangle className="w-5 h-5" />
						Danger Zone
					</CardTitle>
					<CardDescription>
						Destructive actions that cannot be undone. Please proceed with
						caution.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-red-100 dark:border-red-900/50 rounded-lg bg-red-50/50 dark:bg-red-950/20">
						<div>
							<h4 className="font-semibold text-slate-900 dark:text-white">
								Clear All Registrations
							</h4>
							<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
								Permanently delete all registered users from the database.
							</p>
						</div>
						<Button
							variant="destructive"
							onClick={handleClearAllData}
							disabled={clearing}>
							{clearing ?
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Clearing...
								</>
							:	"Clear All Data"}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
