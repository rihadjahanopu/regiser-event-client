<div align="center">

# 🎓 Talamij Event Registration & Management Platform
### *Enterprise-Grade Full-Stack Event Operating System — Client Application*

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.6-red?style=for-the-badge)](https://better-auth.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

*An advanced, high-performance, full-stack event registration and administration platform designed for high-concurrency event handling, instant client-side QR ticket vector generation, dynamic CMS-managed PDF certificate issuance, and real-time administrative analytics.*

[Explore Features](#-core-architectural-features) • [System Architecture](#-system-architecture) • [Engineering Highlights](#-engineering--architectural-highlights) • [Interview Q&A](#-technical-interview-presentation-talking-points)

</div>

---

## 📑 Table of Contents
- [Executive Overview](#-executive-overview)
- [System Architecture & Data Flow](#-system-architecture--data-flow)
- [Core Architectural Features](#-core-architectural-features)
- [Engineering & Architectural Highlights](#-engineering--architectural-highlights)
  - [1. Next.js Edge Auth Proxy Pattern](#1-nextjs-edge-auth-proxy-pattern-cross-origin-cookie-solution)
  - [2. Hybrid Canvas-to-Vector PDF Rendering Engine](#2-hybrid-canvas-to-vector-pdf-rendering-engine)
  - [3. Dynamic Singleton CMS Architecture](#3-dynamic-singleton-cms-architecture)
  - [4. Optimized Next.js Edge Middleware Guards](#4-optimized-nextjs-edge-middleware-guards)
- [Tech Stack & Dependency Matrix](#-tech-stack--dependency-matrix)
- [Directory Architecture](#-directory-architecture)
- [Environment Configuration](#-environment-configuration)
- [Installation & Local Setup](#-installation--local-setup)
- [Technical Interview Presentation Talking Points](#-technical-interview-presentation-talking-points)

---

## 🎯 Executive Overview

The **Talamij Event Registration Platform** is built to solve critical operational bottlenecks in large-scale event management. It bridges public participant enrollment, instant digital ticketing, automated anti-fraud certificate issuance, and administrative oversight under a unified, high-reliability architecture.

### Key Business & Technical Goals:
- **Zero-Latency PDF Generation**: Eliminates server memory spikes by offloading PDF rendering (tickets & certificates) entirely to the client browser.
- **Anti-Fraud Security**: Integrates scannable QR verification signatures linking physical/digital tickets directly to immutable backend Mongo records.
- **No-Code CMS Customization**: Empowers administrators to dynamically alter public registration panels, certificate titles, logos, Bismillah calligraphy toggles, watermarks, and signature assets live without code deployments.

---

## 📐 System Architecture & Data Flow

```
                                    +-----------------------------------------+
                                    |         User Browser (Client)           |
                                    +--------------------+--------------------+
                                                         |
                                 +-----------------------+-----------------------+
                                 |                                               |
                  [Public & Admin Routes]                           [Auth Requests /api/auth/*]
                                 |                                               |
                                 v                                               v
                   +---------------------------+                   +---------------------------+
                   |  Next.js 16 App Router    |                   |   Next.js Auth Edge Proxy  |
                   |   - React 19 Components   |                   |  /api/auth/[...all]/route |
                   |   - Dynamic Layout CMS    |                   +-------------+-------------+
                   |   - PDF Generation Engine |                                 |
                   +-------------+-------------+                                 | Proxy Request
                                 |                                               | Same-Origin Headers
                                 | REST APIs                                     v
                                 |                                 +---------------------------+
                                 +-------------------------------->| Node.js / Express API     |
                                                                   |  - Better Auth Engine     |
                                                                   |  - MongoDB Mongoose ORM   |
                                                                   |  - Cloudinary Storage     |
                                                                   +---------------------------+
```

---

## 🚀 Core Architectural Features

### 📋 1. Public Event Enrollment & Instant QR Ticketing
- **Responsive Dynamic Form Engine**: Validated using **React Hook Form** + **Zod** schemas for client-side type-safe form verification (email, phone number, gender, institution, district).
- **CMS-Driven Hero Panel**: Registration left-hand banner is rendered dynamically based on live database settings (organization line, headings, feature badges).
- **Instant QR Vector Ticket PDF**: Upon successful submission, a ticket confirmation page generates a vector-rendered PDF ticket incorporating:
  - Unique Registration Serial ID (`TLM-XXXXXX`)
  - Participant metadata & seating info
  - Dynamic **scannable QR code** resolving to `/verify/ticket/[id]`

### 📜 2. Dynamic Certificate Engine & Anti-Fraud Verification
- **Live Canvas PDF Certificate Generator**: High-dpi certificate rendering with admin-configurable:
  - Bismillah Arabic Calligraphy Toggle (`isBismillahActive`)
  - Dedicated Certificate Top Logo
  - Dynamic Custom Watermark background
  - Executive Signatures (President & General Secretary)
  - Custom Event & Certificate Title Text
- **Public Verification Protocol**: Anyone can scan a certificate's QR code or visit `/verify/certificate/[certificateId]` to verify authenticity against backend records in real-time.

### 🛡️ 3. Administrative Control Center & Analytics
- **Live Operational Dashboard**: Displays real-time event stats (Total Attendees, Male vs Female ratio, Daily velocity metrics) visualized via **Recharts**.
- **Data Grid & Batch Actions**: Searchable, filterable table supporting bulk operations, status updates, participant drawer inspection, and 1-click **Excel dataset export (`xlsx`)**.
- **Live CMS & Brand Manager**: Full UI for updating site assets (logos, banners, watermarks, signatures) via direct Cloudinary streaming endpoints.

---

## 💡 Engineering & Architectural Highlights

### 1. Next.js Edge Auth Proxy Pattern (Cross-Origin Cookie Solution)
> **Problem:** Deploying Frontend (`talamijbd.vercel.app`) and Backend (`talamij-server.vercel.app`) on separate Vercel domains caused modern browsers to **block cross-origin `Set-Cookie` headers** due to strict `SameSite=Lax` browser security policies.

> **Solution:** Implemented a Next.js App Router Catch-All Edge Route Proxy at `src/app/api/auth/[...all]/route.ts`. All client authentication calls are directed to the **same origin** (`/api/auth/*`), which proxies requests to the Express backend and rewrites response cookie headers onto the frontend domain.

```typescript
// src/app/api/auth/[...all]/route.ts
export async function handler(request: NextRequest, context: { params: Promise<{ all: string[] }> }) {
  const { all } = await context.params;
  const targetUrl = `${BACKEND_URL}/api/auth/${all.join("/")}`;
  
  const headers = new Headers(request.headers);
  headers.set("x-forwarded-host", request.headers.get("host") || "");
  
  const backendRes = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
    // @ts-expect-error — duplex option required for streaming bodies in Node/Edge fetch
    duplex: "half",
    redirect: "manual",
  });

  const responseHeaders = new Headers(backendRes.headers);
  const body = await backendRes.arrayBuffer();

  return new NextResponse(body, {
    status: backendRes.status,
    headers: responseHeaders,
  });
}
```

### 2. Hybrid Canvas-to-Vector PDF Rendering Engine
Client-side PDF generation combines `html2canvas` for precise visual fidelity rendering of styled HTML/Tailwind elements and `jspdf` for vector PDF layout composition. This avoids heavy server dependencies like Puppeteer, dramatically reducing server memory consumption.

### 3. Dynamic Singleton CMS Architecture
Site settings are fetched using a unified singleton pattern. Front-end components consume `useSettings` hooks that fallback gracefully to defaults if the backend is initializing, ensuring zero layout shifts or runtime exceptions.

### 4. Optimized Next.js Edge Middleware Guards
`middleware.ts` runs on Next.js Edge runtime, checking for session cookie presence before allowing navigation to `/admin/*` or `/dashboard/*` paths. By validating cookie existence at the edge before route execution, unauthorized requests are redirected with zero latency impact.

---

## 🛠️ Tech Stack & Dependency Matrix

| Layer | Technologies Used |
| :--- | :--- |
| **Core Framework** | Next.js 16.2 (App Router), React 19, TypeScript 5.0 |
| **Styling & Theme** | Tailwind CSS v4, Framer Motion, Lucide Icons, Next Themes |
| **Form Architecture** | React Hook Form 7, Zod Validation Schemas |
| **Graphics & PDF** | jsPDF 4.2, html2canvas 1.4, html-to-image, qrcode.react |
| **Data & Visualization** | Recharts 3.10, XLSX (Excel Data Exporter) |
| **Authentication** | Better Auth Client 1.6 (Session-based RBAC) |
| **HTTP Client** | Axios 1.18 |

---

## 📁 Directory Architecture

```
regiser-event-client/
├── src/
│   ├── app/
│   │   ├── admin/                    # Administrative Control Portal
│   │   │   ├── (dashboard)/          # Dashboard metrics, tables, CMS settings
│   │   │   ├── login/                # Admin auth login view
│   │   │   └── register/             # Admin account registration view
│   │   ├── api/
│   │   │   └── auth/[...all]/        # Same-Origin Edge Auth Proxy
│   │   ├── blog/                     # Public news & article portal
│   │   ├── dashboard/                # User dashboard
│   │   ├── register/                 # Dynamic public registration form
│   │   ├── success/[id]/             # Instant ticket download route
│   │   ├── verify/                   # QR Ticket & Certificate public verification
│   │   ├── globals.css               # Design system tokens & Tailwind imports
│   │   └── layout.tsx                # App root layout & providers
│   ├── components/
│   │   ├── admin/                    # Admin data tables, drawers & action modals
│   │   ├── certificate/              # Printable PDF certificate render engine
│   │   ├── home/                     # Public landing components & dynamic hero
│   │   ├── ticket/                   # Vector ticket printable canvas
│   │   └── ui/                       # Accessible Shadcn UI primitives
│   ├── lib/
│   │   ├── auth-client.ts            # Better Auth client instance
│   │   └── utils.ts                  # Class merger & formatting utilities
│   └── middleware.ts                 # Next.js Edge authentication route guard
├── public/                           # Static assets, fallback logos, fonts
├── next.config.ts                    # Next.js compiler settings & rewrites
└── package.json
```

---

## ⚙️ Environment Configuration

Create `.env.local` in the project root:

```env
# Backend REST API Server Target
NEXT_PUBLIC_API_URL=http://localhost:5000

# Frontend Client Public App Origin
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Server-Side Internal Route Execution API Target
API_URL=http://127.0.0.1:5000
```

> **Production Setup (Vercel):**
> Set `NEXT_PUBLIC_APP_URL` to `https://talamijbd.vercel.app` and `NEXT_PUBLIC_API_URL` to `https://talamij-server.vercel.app`.

---

## 💻 Installation & Local Setup

```bash
# 1. Clone repository
git clone https://github.com/your-username/talamij-event-platform.git
cd talamij/regiser-event-client

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Production build & type verification
npm run build
```

---

## 🎙️ Technical Interview Presentation Talking Points

When presenting this project during a Senior Software Engineer interview, highlight these key technical achievements:

1. **Solving Cross-Origin Cookie Storage (Edge Auth Proxy)**:
   > *"I engineered a Next.js Edge API proxy route (`/api/auth/[...all]`) to bypass cross-domain `SameSite=Lax` browser cookie blocking. This allows the client to authenticate seamlessly against a microservice backend running on a separate Vercel deployment while retaining full cookie security."*

2. **Zero-Server-Load PDF Rendering Architecture**:
   > *"Rather than bottlenecking server CPUs with heavy headless browser instances (like Puppeteer), I designed a client-side hybrid canvas/vector rendering engine using `html2canvas` and `jsPDF`. This rendered high-resolution printable PDF tickets and certificates instantly in the user's browser."*

3. **Dynamic Singleton CMS Architecture**:
   > *"I structured a single-document Settings pattern in MongoDB exposed via REST hooks. This allows administrators to toggle Bismillah calligraphy, upload custom signatures, update event dates, and swap watermark images in real time without triggering client re-deployments."*

---

<div align="center">
  <sub>Built with ❤️ for Talamij Event Management Platform. Engineered for Performance, Security, and Scalability.</sub>
</div>
