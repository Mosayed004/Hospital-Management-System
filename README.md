# 🏥 Hospital Management System (HMS)

[![Next.js](https://img.shields.io/badge/Next.js-14%2F15-black.svg?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Radix UI](https://img.shields.io/badge/UI-Radix%20%2F%20Shadcn-purple.svg)](https://ui.shadcn.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A modern, responsive, and full-featured Hospital & Healthcare Management System web application designed to digitize medical records, streamline doctor-patient workflows, manage pharmacy inventories, and oversee billing.

---

## 📌 Overview

Healthcare facilities require reliable, accessible, and role-secured software to manage daily hospital operations without friction. 

**Hospital Management System** is built on Next.js with React Server Components, TypeScript, and modern UI primitives. It centralizes patient lifecycle management, specialist doctor schedules, lab test results, pharmacy dispensaries, and billing into a unified, secure dashboard.

---

## ✨ Core Modules & Features

- **👤 Patient Management (`/patients`):** Complete patient profiles, medical history tracking, contact data, admission status, and emergency contacts.
- **📅 Appointment Scheduling (`/appointments`):** Interactive booking calendar for outpatient visits, consultations, and status updates (pending, confirmed, completed).
- **🩺 Doctor Dashboard (`/doctor-dashboard`):** Tailored workspace for physicians to view daily schedules, diagnose patients, issue prescriptions, and update health records.
- **🔬 Laboratory Management (`/laboratory`):** Track diagnostic requests, test processing status, report uploads, and specimen logs.
- **💊 Pharmacy & Dispensary (`/pharmacy`):** Medication stock tracking, prescription fulfillment, and dosage management.
- **📦 Medical Inventory (`/inventory`):** Real-time monitoring of medical supplies, surgical tools, reorder thresholds, and equipment status.
- **💳 Invoicing & Billing (`/billing`):** Automated invoice generation for consultations, procedures, lab tests, and pharmacy items.
- **📊 Analytics & Reports (`/reports`):** Hospital metrics, patient throughput, revenue analytics, and department performance.
- **🛡️ Role-Based Authentication & Guard (`/login`, `/unauthorized`):** Integrated route protection via `auth-guard.tsx` ensuring confidential data is restricted by staff roles.

---

## 🏗️ Project Structure

```
Hospital-Management-System/
├── app/
│   ├── appointments/         # Appointment booking & calendar routes
│   ├── billing/              # Invoice & payment processing
│   ├── doctor-dashboard/     # Physician workflow and patient queue
│   ├── inventory/            # Medical supplies & stock monitoring
│   ├── laboratory/           # Lab tests, specimens, and diagnostic reports
│   ├── login/                # Authentication page
│   ├── patients/             # Patient profiles and medical charts
│   ├── pharmacy/             # Prescription fulfillment & medicine inventory
│   ├── records/              # Centralized electronic health records (EHR)
│   ├── reports/              # Clinical and financial reports
│   ├── settings/             # System and profile configurations
│   ├── layout.tsx            # Global layout and root wrapper
│   └── page.tsx              # Main landing / executive overview
├── components/               # Reusable Shadcn / Radix UI components
│   ├── auth-guard.tsx        # Client/Server auth protection
│   └── ui/                   # Dialog, dropdown, button, card primitives
├── hooks/                    # Custom React hooks
├── styles/                   # Custom theme and stylesheet extensions
├── public/                   # Static assets and icons
├── components.json           # Shadcn UI configuration
├── tailwind.config.ts        # Tailwind typography, theme tokens & plugins
└── package.json              # Project dependencies & scripts
```

---

## ⚙️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Component Library:** Radix UI primitives & Shadcn UI
- **Icons:** Lucide React
- **Forms & Validation:** React Hook Form & Zod

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or 20.x installed
- Package manager: `pnpm`, `npm`, or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mosayed004/Hospital-Management-System.git
   cd Hospital-Management-System
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 👤 Author

Developed by **Mohamed Sayed** ([@Mosayed004](https://github.com/Mosayed004)).
Licensed under the **MIT License**.
