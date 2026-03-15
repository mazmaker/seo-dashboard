# SEO Report Dashboard
Data Model & Database Design

Version: 1.0

---

# 1. Database Overview

Database: PostgreSQL (Supabase)

Core entities

users
clients
focus_keyword_groups
focus_keywords
keyword_snapshots
traffic_snapshots

Purpose

- store client configuration
- track focus keywords
- store historical SEO data
- enable AI analysis

---

# 2. Entity Relationship Diagram

users
  │
  └── clients
          │
          ├── focus_keyword_groups
          │       │
          │       └── focus_keywords
          │
          ├── keyword_snapshots
          │
          └── traffic_snapshots

---

# 3. Tables

## users

Managed by Supabase Auth

Fields

id (uuid)
email
created_at

---

## clients

Stores website configuration

fields

id uuid PK
user_id uuid FK → users.id

name text
slug text unique
website text

logo_url text
theme_color text

gsc_site_url text
ga4_property_id text

status text

contract_start date
contract_end date

notes text

created_at timestamptz
updated_at timestamptz

---

## focus_keyword_groups

Groups for focus keywords

fields

id uuid PK
client_id uuid FK → clients.id

name text
color text

created_at timestamptz

---

## focus_keywords

Tracked keywords

fields

id uuid PK

group_id uuid FK → focus_keyword_groups.id

keyword text

target_position integer

priority text

notes text

created_at timestamptz

---

## keyword_snapshots

Historical keyword performance

Used for trend analysis

fields

id uuid PK

client_id uuid FK → clients.id

keyword text

date date

position float
clicks integer
impressions integer
ctr float

created_at timestamptz

---

## traffic_snapshots

Historical GA4 traffic

fields

id uuid PK

client_id uuid FK → clients.id

date date

sessions integer
users integer
new_users integer

pageviews integer

bounce_rate float
avg_session_duration float

created_at timestamptz

---

# 4. Index Strategy

Important indexes

clients(user_id)

focus_keyword_groups(client_id)

focus_keywords(group_id)

keyword_snapshots(client_id, keyword, date)

traffic_snapshots(client_id, date)

Purpose

- faster analytics queries
- trend analysis

---

# 5. Data Retention

keyword_snapshots

daily records

recommended retention

2 years

traffic_snapshots

daily records

recommended retention

2 years

---

# 6. Data Sync Strategy

Data fetched from

Google Search Console
Google Analytics

sync strategy

daily cron job

Steps

1 fetch GSC data
2 store keyword snapshots
3 fetch GA4 data
4 store traffic snapshots

---

# 7. Example Query

Top keywords

SELECT
keyword,
AVG(position) as avg_position
FROM keyword_snapshots
WHERE client_id = $clientId
AND date > now() - interval '30 days'
GROUP BY keyword
ORDER BY avg_position ASC

---

# 8. Security

Supabase Row Level Security

policy

user can only access clients they own

Example

client.user_id = auth.uid()

---