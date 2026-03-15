# SEO Report Dashboard / AI SEO Platform
Product Requirements Document (PRD)

Version: 1.0
Owner: SEO / Product Team
Last Updated: 2026

---

# 1. Product Overview

SEO Report Dashboard คือระบบสำหรับ **วิเคราะห์และรายงานผล SEO สำหรับหลายเว็บไซต์ (Multi-Client)** โดยเชื่อมต่อข้อมูลจาก

- Google Search Console (GSC)
- Google Analytics 4 (GA4)

ระบบจะแสดงข้อมูลในรูปแบบ

- KPI Cards
- Charts
- Keyword Ranking Tables
- Focus Keyword Tracking
- SEO Reports

ระบบถูกออกแบบสำหรับ

- SEO Agencies
- Digital Marketing Teams
- Freelance SEO

---

# 2. Goals

Primary Goals

1. รวมข้อมูล SEO จากหลายแหล่งใน Dashboard เดียว
2. ช่วย SEO agency วิเคราะห์ performance ของหลาย client
3. ลดเวลาในการสร้าง SEO report
4. เพิ่มความเข้าใจ SEO performance ให้ลูกค้า

Future Goals

- AI SEO Insights
- Keyword Opportunity Detection
- AI Report Generator

---

# 3. Target Users

Primary Users

SEO Agency
- ดู performance ลูกค้า
- ทำ SEO report

Marketing Team
- วิเคราะห์ organic traffic

Freelance SEO
- ดู keyword ranking

---

# 4. Key Features

## 4.1 Multi-Client Management

รองรับหลายเว็บไซต์

แต่ละ Client มี

- Website
- GSC Site URL
- GA4 Property ID
- Focus Keywords

URL structure

/dashboard
/dashboard/[clientId]
/dashboard/[clientId]/keywords
/dashboard/[clientId]/traffic
/dashboard/[clientId]/focus-keywords

---

## 4.2 SEO Dashboard

แสดง KPI หลัก

KPI metrics

- Total Clicks
- Total Impressions
- Average CTR
- Average Position
- Total Sessions
- Total Users
- Bounce Rate
- Avg Session Duration

Features

- KPI comparison
- Trend charts
- Date range selector

---

## 4.3 Keyword Ranking

Table view

Columns

Keyword
Position
Previous Position
Change
Clicks
Impressions
CTR

Features

- search
- sort
- filter
- export CSV

---

## 4.4 Traffic Analytics

Charts

- Sessions trend
- Users trend
- Device breakdown
- Traffic source
- Top pages
- Top countries

---

## 4.5 Focus Keywords Tracking

ผู้ใช้สามารถตั้ง

Focus Keyword Groups

ตัวอย่าง

Brand Keywords
Commercial Keywords
Blog Keywords

ระบบจะ track

- ranking change
- weekly comparison
- monthly comparison

Features

- trend chart
- heatmap table
- keyword scoring

---

## 4.6 Reports

Report builder

ผู้ใช้สามารถ

- เลือก date range
- เลือก sections
- export CSV

future

- export PDF
- auto report

---

# 5. User Flow

User login

↓

Dashboard

↓

Select client

↓

View SEO overview

↓

Analyze keywords

↓

Generate report

---

# 6. Functional Requirements

FR-1  
User login via Google OAuth

FR-2  
User can create clients

FR-3  
Each client stores GSC + GA4 configuration

FR-4  
Dashboard fetches GSC data

FR-5  
Dashboard fetches GA4 data

FR-6  
Keyword ranking table supports search + filter

FR-7  
Focus keywords stored per client

FR-8  
Reports can export CSV

---

# 7. Non-Functional Requirements

Performance

Dashboard load < 2 seconds

Security

OAuth authentication
Supabase RLS

Scalability

Support 100+ clients

Reliability

Fallback demo data

---

# 8. Future Features

AI SEO Insights

AI วิเคราะห์

- keyword drop
- CTR issues
- traffic changes

AI Keyword Opportunity

AI หา keyword ที่ควร optimize

AI Report Generator

สร้าง report อัตโนมัติ

---

# 9. Success Metrics

Active clients
Dashboard usage
Report exports

SEO Agencies adoption

---

# 10. Out of Scope (MVP)

Competitor tracking
Backlink analysis
Rank tracking outside GSC