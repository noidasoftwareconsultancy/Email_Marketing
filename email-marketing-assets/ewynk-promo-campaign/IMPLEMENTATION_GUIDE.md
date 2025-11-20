# eWynk Promo Campaign - Implementation Guide

## 📦 What's Included

This package contains everything you need to launch a complete email marketing campaign:

### 1. Email Templates
- **Full HTML Template** (`html-template.html`) - Complete responsive email with dark mode support
- **Short Email Template** (`short-email-template.html`) - Condensed version for quick sends
- **Plain Text Template** (`plain-text-template.txt`) - Fallback for email clients that don't support HTML
- **Follow-up Templates** (`followup-templates.json`) - 3-step follow-up sequence

### 2. Subject Lines & Preview Text
- **Subject Lines** (`subject-lines.json`) - 80 subject lines across 4 audience segments
  - 20 general
  - 20 e-commerce focused
  - 20 service business focused
  - 20 startup focused
- **Preview Text** (`preview-text.json`) - 10 options + recommended pairings

### 3. Tracking & Analytics
- **UTM Configuration** (`utm-config.json`) - Pre-configured UTM parameters for all channels
- **Campaign Tracking** (`campaign-tracking.csv`) - Spreadsheet template for tracking performance
- **A/B Test Config** (`ab-test-config.json`) - 4 test scenarios with recommendations

### 4. Additional Channels
- **WhatsApp Template** (`whatsapp-template.txt`) - Short promotional message for WhatsApp
- SMS template (included in WhatsApp file, just shorten further)

---

## 🚀 Quick Start

### Step 1: Import Templates into Your System

Run the seed script to automatically import all templates:

```bash
npm run seed:ewynk-campaign
```

This will create:
- 1 main promotional template
- 1 short version template
- 3 follow-up templates
- All with proper UTM tracking configured

### Step 2: Choose Your Subject Line

Pick from `subject-lines.json` based on your audience:
- **General audience**: Use lines 1-20
- **E-commerce**: Use e-commerce section
- **Service businesses**: Use service_business section
- **Startups**: Use startups section

**Top 3 recommended for general audience:**
1. "Free strategy session — no strings attached"
2. "Book a free call with eWynk — limited slots"
3. "Turn your website into a lead machine"

### Step 3: Set Up UTM Tracking

All templates use these UTM parameters (already configured):
- `utm_source=email`
- `utm_medium=promo`
- `utm_campaign=promo_nov2025`
- `utm_content=cta_schedule` (varies by email type)

**CTA URL format:**
```
https://ewynk.com/contact-us?utm_source=email&utm_medium=promo&utm_campaign=promo_nov2025&utm_content=cta_schedule
```

### Step 4: Create Campaign in Dashboard

1. Go to **Dashboard → Campaigns → Create Campaign**
2. Select the "eWynk Promo - Main" template
3. Choose your target audience (tags)
4. Schedule or send immediately

### Step 5: Set Up Follow-up Sequence

Create 3 follow-up campaigns with these timings:
- **Follow-up 1**: 2-3 days after initial (gentle reminder)
- **Follow-up 2**: 5-7 days after initial (value add with tips)
- **Follow-up 3**: 10-12 days after initial (scarcity/last chance)

---

## 📊 A/B Testing Guide

### Test 1: Subject Lines (Recommended First)
**Goal**: Find highest open rate

**Setup**:
- Split your list 50/50
- Variant A: "Free strategy session — no strings attached"
- Variant B: "Turn your website into a lead machine"
- Send to 200 contacts (100 each)
- Wait 24-48 hours
- Winner = highest open rate

### Test 2: Email Length
**Goal**: Find highest click-through rate

**Setup**:
- Use winning subject from Test 1
- Variant A: Full HTML template
- Variant B: Short email template
- Send to 400 contacts (200 each)
- Winner = highest click rate

### Test 3: CTA Text
**Goal**: Optimize conversion rate

**Setup**:
- Use winning subject + format from Tests 1 & 2
- Test 3 CTA variations:
  - "Schedule Free Call →"
  - "Get Your Free Strategy Session →"
  - "Book Your Spot Now →"
- Send to 300 contacts (100 each)
- Winner = highest click-to-conversion rate

### Test 4: Audience Segmentation
**Goal**: Validate personalization value

**Setup**:
- E-commerce segment: Generic vs Shopify-specific
- Service business segment: Generic vs Automation-focused
- Send to 150 per segment (75 each variant)
- Winner = highest reply rate

---

## 📈 Tracking Performance

### Key Metrics to Track

1. **Delivery Rate** = (Delivered / Sent) × 100
   - Target: >98%

2. **Open Rate** = (Opened / Delivered) × 100
   - Target: >25% (industry average: 21%)

3. **Click Rate** = (Clicked / Delivered) × 100
   - Target: >3% (industry average: 2.3%)

4. **Reply Rate** = (Replied / Delivered) × 100
   - Target: >1%

5. **Conversion Rate** = (Converted / Delivered) × 100
   - Target: >0.5%

### Using the Tracking Spreadsheet

1. Open `campaign-tracking.csv`
2. Add a new row for each campaign send
3. Fill in:
   - Campaign details (name, ID, audience)
   - Subject line and preview text used
   - Send date
   - Performance metrics (update daily)
   - UTM parameters
   - Notes

### Google Analytics Setup

1. Go to **GA4 → Reports → Acquisition → Traffic Acquisition**
2. Add secondary dimension: "Campaign"
3. Filter by `promo_nov2025`
4. Track:
   - Sessions from email
   - Conversion events
   - Form submissions

---

## 🎯 Audience Segmentation

### Segment 1: General (No specific industry)
- **Subject**: "Free strategy session — no strings attached"
- **Template**: Main HTML template
- **Focus**: Broad value proposition

### Segment 2: E-commerce Owners
- **Subject**: "Boost your Shopify store sales — free consultation"
- **Template**: Main HTML (customize services section to emphasize e-commerce)
- **Focus**: Conversion optimization, cart abandonment

### Segment 3: Service Businesses
- **Subject**: "Get more service bookings from your website"
- **Template**: Main HTML (emphasize automation benefits)
- **Focus**: Lead generation, booking automation

### Segment 4: Startups
- **Subject**: "Launch your MVP faster with eWynk"
- **Template**: Short email (startups prefer brevity)
- **Focus**: Speed to market, affordable pricing

---

## 📧 ESP-Specific Instructions

### For Mailchimp
1. Create new campaign
2. Paste HTML from `html-template.html`
3. Replace `{{name}}` with `*|FNAME|*`
4. Replace `{{cta_url}}` with your UTM-equipped URL
5. Replace `{{unsubscribe_url}}` with `*|UNSUB|*`

### For SendGrid
1. Create new template
2. Paste HTML
3. Replace `{{name}}` with `{{firstName}}`
4. Replace `{{cta_url}}` with your URL
5. Replace `{{unsubscribe_url}}` with `{{{unsubscribe}}}`

### For Your Custom System (Current)
- Templates already use `{{name}}` format
- Just ensure your system replaces:
  - `{{name}}` → Contact's first name
  - `{{cta_url}}` → Full URL with UTM parameters
  - `{{unsubscribe_url}}` → Unsubscribe link

---

## ✅ Pre-Send Checklist

Before sending any campaign:

- [ ] Subject line chosen and tested
- [ ] Preview text set
- [ ] All `{{variables}}` replaced correctly
- [ ] UTM parameters added to all links
- [ ] Unsubscribe link working
- [ ] Test email sent to yourself
- [ ] Checked on mobile device
- [ ] Checked in Gmail, Outlook, Apple Mail
- [ ] Verified sender email and name
- [ ] Confirmed target audience/tags
- [ ] Scheduled time set (if scheduling)

---

## 🔧 Customization Tips

### Personalizing for Your Brand

1. **Update company stats** in the "Trusted by" section:
   - Change "100+ Brands Served" to your number
   - Update "15+ Industries" if different
   - Adjust "95% On-Time Delivery" to your metric

2. **Modify services** in the solutions section:
   - Keep 4 services or reduce to 3
   - Update emojis and descriptions
   - Adjust border colors if needed

3. **Change CTA text**:
   - Current: "Schedule Free Call →"
   - Alternatives: "Book Now →", "Get Started →", "Claim Your Spot →"

4. **Update contact info**:
   - Email: help@ewynk.com
   - Phone: +91-9971978446
   - Address: Plot-202, Block-G, Sector 63, Noida

### Color Scheme

Current brand colors (in CSS variables):
- Primary: `#0ea5e9` (sky blue)
- Secondary: `#3b82f6` (blue)
- Accent: `#0c4a6e` (dark blue)

To change, update the `:root` variables in the `<style>` section.

---

## 📱 WhatsApp Campaign

### Setup
1. Use `whatsapp-template.txt`
2. Replace `{{name}}` with contact name
3. Replace `{{cta_url}}` with WhatsApp-specific UTM:
   ```
   https://ewynk.com/contact-us?utm_source=whatsapp&utm_medium=direct&utm_campaign=promo_nov2025&utm_content=wa_message
   ```

### Best Practices
- Send during business hours (10 AM - 6 PM)
- Personalize the greeting
- Keep it under 160 characters if possible
- Include emoji for visual appeal
- Always provide opt-out option

---

## 🆘 Troubleshooting

### Low Open Rates (<15%)
- Test different subject lines
- Check sender name (use personal name, not company)
- Verify emails aren't going to spam
- Clean your list (remove bounces)

### Low Click Rates (<2%)
- Make CTA button more prominent
- Test different CTA text
- Simplify email (remove distractions)
- Add urgency/scarcity

### High Bounce Rate (>5%)
- Clean your email list
- Use email verification service
- Remove old/inactive contacts
- Check for typos in email addresses

### Emails Going to Spam
- Set up SPF, DKIM, DMARC records
- Avoid spam trigger words
- Include physical address
- Add unsubscribe link
- Warm up your sending domain

---

## 📞 Support

Questions about implementation?
- Email: help@ewynk.com
- Phone: +91-9971978446

---

## 📝 License & Usage

These templates are created for eWynk's promotional campaigns. Feel free to:
- Customize for your brand
- A/B test variations
- Translate to other languages
- Adapt for different products/services

---

**Last Updated**: November 2025
**Version**: 1.0
