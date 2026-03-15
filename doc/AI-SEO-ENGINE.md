# AI SEO Engine
Automated SEO Analysis Logic

Version: 1.0

---

# 1. Purpose

AI SEO Engine วิเคราะห์ข้อมูล SEO เพื่อสร้าง

SEO Insights
Keyword Opportunities
SEO Alerts

based on

Google Search Console
Google Analytics
Focus Keywords

---

# 2. Input Data

Sources

keyword_snapshots
traffic_snapshots
focus_keywords

Metrics used

position
clicks
impressions
ctr
sessions

---

# 3. Analysis Modules

AI SEO Engine has multiple modules

1 Keyword Ranking Analysis
2 CTR Optimization
3 Keyword Opportunity
4 Traffic Trend Analysis
5 Focus Keyword Monitoring

---

# 4. Keyword Ranking Analysis

Detect ranking changes

Algorithm

1 get keyword position for last 7 days
2 get previous 7 days
3 calculate delta

formula

change = previous_position - current_position

Interpretation

positive change → ranking improved
negative change → ranking dropped

Example

previous position = 5
current position = 11

result

ranking dropped

---

# 5. CTR Optimization

Goal

detect pages with low CTR

criteria

impressions > 500
ctr < 2%

AI recommendation

optimize title
optimize meta description

Example insight

Keyword

solar panel thailand

CTR

1.2%

Recommendation

rewrite title

---

# 6. Keyword Opportunity Detection

Find keywords close to page 1

criteria

position between

8 and 20

and

impressions high

logic

IF

position <= 20
AND impressions > 500

THEN

keyword opportunity

AI recommendation

optimize content
add internal links
increase content depth

---

# 7. Focus Keyword Monitoring

Track important keywords

logic

for each focus keyword

track

position change

alert conditions

position drop > 3

generate alert

Example

keyword

solar rooftop thailand

previous position

4

current position

9

alert

ranking drop

---

# 8. Traffic Trend Analysis

Detect traffic anomalies

Algorithm

compare

last 7 days
vs
previous 7 days

traffic change

delta = current_sessions - previous_sessions

percentage

delta / previous_sessions

alerts

traffic drop > 20%

---

# 9. AI Insight Generation

AI prompt example

Input

SEO metrics
keyword changes
traffic trends

Prompt

Analyze the SEO data and generate insights

Output example

Top Insights

1 5 keywords lost ranking this week
2 CTR dropped for 3 high impression keywords
3 organic traffic decreased by 18%

Recommendations

update title tags
improve internal linking
optimize focus keywords

---

# 10. Insight Output Format

JSON

{
"type": "ranking_drop",
"keyword": "solar panel thailand",
"previous_position": 4,
"current_position": 9,
"recommendation": "update content and internal links"
}

---

# 11. AI Model Integration

Supported LLM

OpenAI
Claude
Local LLM

Recommended flow

SEO data

↓

analysis engine

↓

LLM summarization

↓

dashboard insights

---

# 12. Future Improvements

Competitor analysis

SERP analysis

Content gap detection

Backlink correlation

---

# 13. Example Workflow

Daily cron job

1 fetch SEO data
2 update snapshots
3 run AI analysis
4 store insights
5 show insights in dashboard