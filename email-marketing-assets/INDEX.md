# Email Marketing Assets - Master Index

Complete email marketing campaign package for eWynk promotional campaigns.

## 📦 Package Overview

This repository contains everything needed to launch, track, and optimize email marketing campaigns:

- **8 Email Templates** (HTML + Plain Text)
- **80 Subject Lines** (4 audience segments)
- **10 Preview Text Options** with recommended pairings
- **3 Follow-up Email Sequences**
- **UTM Tracking Configuration**
- **A/B Testing Scenarios**
- **Campaign Tracking Spreadsheet**
- **WhatsApp & SMS Templates**
- **Complete Implementation Guides**

---

## 📁 Directory Structure

```
email-marketing-assets/
└── ewynk-promo-campaign/
    ├── README.md                          # Package overview & quick start
    ├── IMPLEMENTATION_GUIDE.md            # Detailed implementation guide
    ├── QUICK_REFERENCE.md                 # One-page quick reference
    ├── DELIVERABILITY_CHECKLIST.md        # Email deliverability best practices
    │
    ├── html-template.html                 # Main responsive HTML email
    ├── short-email-template.html          # Condensed version
    ├── plain-text-template.txt            # Plain text fallback
    ├── followup-templates.json            # 3-step follow-up sequence
    │
    ├── subject-lines.json                 # 80 subject lines (4 segments)
    ├── preview-text.json                  # Preview text + pairings
    ├── utm-config.json                    # UTM tracking setup
    ├── ab-test-config.json                # A/B test scenarios
    ├── campaign-builder.json              # Campaign sequence builder
    ├── campaign-tracking.csv              # Performance tracking spreadsheet
    │
    └── whatsapp-template.txt              # WhatsApp promotional message
```

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Import Templates

```bash
npm run seed:ewynk-campaign
```

This creates 8 templates in your database:
- Main promotional email (full HTML)
- Short version
- E-commerce focused
- Service business focused
- Startup focused
- 3 follow-up emails

### Step 2: Create Campaign

1. Go to **Dashboard → Campaigns → Create Campaign**
2. Select "eWynk Promo - Main (Full HTML)"
3. Choose target audience
4. Send or schedule

### Step 3: Schedule Follow-ups

- **Day 3**: Follow-up 1 (Gentle Reminder)
- **Day 7**: Follow-up 2 (Value Add)
- **Day 12**: Follow-up 3 (Last Chance)

---

## 📚 Documentation Guide

### For First-Time Users
Start here:
1. **README.md** - Package overview
2. **QUICK_REFERENCE.md** - Fast launch guide
3. **IMPLEMENTATION_GUIDE.md** - Detailed setup

### For Campaign Managers
Essential reading:
1. **campaign-builder.json** - Pre-built sequences
2. **ab-test-config.json** - Testing strategies
3. **campaign-tracking.csv** - Performance tracking

### For Technical Teams
Important files:
1. **DELIVERABILITY_CHECKLIST.md** - Technical setup
2. **utm-config.json** - Tracking parameters
3. **html-template.html** - Template structure

---

## 📧 Template Library

### Main Templates

| Template Name | Use Case | Open Rate | File |
|--------------|----------|-----------|------|
| **Main (Full HTML)** | Cold outreach, general audience | 25-30% | `html-template.html` |
| **Short Version** | Warm leads, mobile-first | 30-35% | `short-email-template.html` |
| **E-commerce Focus** | Online stores, Shopify | 35-40% | Created by seed script |
| **Service Business** | Consultants, agencies | 30-35% | Created by seed script |
| **Startup Focus** | Founders, early-stage | 35-40% | Created by seed script |

### Follow-up Templates

| Template Name | Timing | Purpose | Expected Lift |
|--------------|--------|---------|---------------|
| **Follow-up 1** | Day 2-3 | Gentle reminder | +10% open rate |
| **Follow-up 2** | Day 5-7 | Value add (tips) | +15% engagement |
| **Follow-up 3** | Day 10-12 | Urgency/scarcity | +20% conversion |

---

## 🎯 Subject Line Library

### By Audience (80 total)

**General (20 lines)**
- Best: "Free strategy session — no strings attached"
- Best: "Turn your website into a lead machine"
- File: `subject-lines.json` → `general`

**E-commerce (20 lines)**
- Best: "Boost your Shopify store sales — free consultation"
- Best: "Turn browsers into buyers: e-commerce optimization"
- File: `subject-lines.json` → `ecommerce`

**Service Business (20 lines)**
- Best: "Get more service bookings from your website"
- Best: "Automate client onboarding and save 10 hours/week"
- File: `subject-lines.json` → `service_business`

**Startups (20 lines)**
- Best: "Launch your MVP faster with eWynk"
- Best: "Startup-friendly web development & automation"
- File: `subject-lines.json` → `startups`

---

## 📊 Tracking & Analytics

### UTM Parameters

All templates include UTM tracking:
```
utm_source=email
utm_medium=promo
utm_campaign=promo_nov2025
utm_content=cta_schedule (varies)
```

**Configuration**: `utm-config.json`  
**Examples**: See `utm-config.json` → `examples`

### Performance Tracking

**Spreadsheet**: `campaign-tracking.csv`

Track these metrics:
- Delivery rate (target: 98%+)
- Open rate (target: 25%+)
- Click rate (target: 3%+)
- Reply rate (target: 1%+)
- Conversion rate (target: 0.5%+)

### Google Analytics

1. Go to **GA4 → Acquisition → Traffic Acquisition**
2. Filter by campaign: `promo_nov2025`
3. Track conversions and form submissions

---

## 🧪 A/B Testing

### Pre-Configured Tests

**Test 1: Subject Lines**
- Variants: 2
- Sample: 200 contacts
- Metric: Open rate
- File: `ab-test-config.json` → `subject_line_test_1`

**Test 2: Email Length**
- Variants: 2 (Full vs Short)
- Sample: 400 contacts
- Metric: Click rate
- File: `ab-test-config.json` → `email_length_test_1`

**Test 3: CTA Text**
- Variants: 3
- Sample: 300 contacts
- Metric: Conversion rate
- File: `ab-test-config.json` → `cta_text_test_1`

**Test 4: Audience Segmentation**
- Segments: 3 (E-commerce, Service, Startup)
- Sample: 150 per segment
- Metric: Reply rate
- File: `ab-test-config.json` → `audience_segment_test_1`

---

## 📱 Multi-Channel Support

### Email
- **Primary channel**
- **Templates**: All HTML templates
- **Tracking**: Full UTM + analytics

### WhatsApp
- **Template**: `whatsapp-template.txt`
- **Best for**: VIP contacts, warm leads
- **Expected engagement**: 36% click rate
- **UTM**: `utm_source=whatsapp`

### SMS
- **Template**: Shortened WhatsApp template
- **Best for**: Urgent offers, time-sensitive
- **Character limit**: 160 chars
- **UTM**: `utm_source=sms`

---

## 🎨 Customization

### Quick Edits

**Update company stats**:
- Find: `100+ Brands Served`
- Replace with your numbers
- Location: `html-template.html` line ~85

**Change CTA text**:
- Find: `Schedule Free Call →`
- Replace: `Book Now →` or `Get Started →`
- Location: `html-template.html` line ~180

**Update contact info**:
- Email: `help@ewynk.com`
- Phone: `+91-9971978446`
- Address: `Plot-202, Block-G, Sector 63, Noida`
- Location: Footer section

### Brand Colors

Current palette:
```css
--brand-1: #0ea5e9;  /* Sky Blue */
--brand-2: #3b82f6;  /* Blue */
--accent-1: #0c4a6e; /* Dark Blue */
```

Update in `<style>` section of HTML templates.

---

## ✅ Pre-Launch Checklist

### Technical Setup (One-Time)
- [ ] SPF, DKIM, DMARC records configured
- [ ] Sending domain verified
- [ ] Gmail/SMTP credentials added
- [ ] Templates imported (`npm run seed:ewynk-campaign`)

### Campaign Setup (Every Send)
- [ ] Template selected
- [ ] Subject line chosen
- [ ] Preview text set
- [ ] Target audience defined
- [ ] UTM parameters verified
- [ ] Test email sent
- [ ] Checked on mobile
- [ ] Scheduled for optimal time

### Post-Send Monitoring
- [ ] Delivery rate > 98%
- [ ] Bounce rate < 2%
- [ ] Complaint rate < 0.1%
- [ ] Open rate tracking
- [ ] Click rate tracking
- [ ] Conversion tracking

**Full checklist**: `DELIVERABILITY_CHECKLIST.md`

---

## 📈 Expected Results

### For 1,000 Contacts

| Metric | Conservative | Expected | Optimistic |
|--------|-------------|----------|------------|
| **Delivered** | 950 | 980 | 990 |
| **Opened** | 200 | 280 | 350 |
| **Clicked** | 20 | 35 | 50 |
| **Replied** | 5 | 12 | 20 |
| **Converted** | 2 | 6 | 10 |

### ROI Calculation

**Assumptions**:
- Average deal value: $5,000
- Conversion rate: 0.6% (6 conversions per 1,000 emails)
- Campaign cost: $500 (time + tools)

**ROI**: 
- Revenue: 6 × $5,000 = $30,000
- Cost: $500
- ROI: 5,900% or 59x return

---

## 🆘 Troubleshooting

### Common Issues

**Low Open Rates (<15%)**
- ✅ Test different subject lines
- ✅ Use personal sender name
- ✅ Send at optimal times (Tue-Thu, 10-11 AM)
- ✅ Clean email list

**Low Click Rates (<2%)**
- ✅ Make CTA more prominent
- ✅ Simplify email design
- ✅ Test different CTA text
- ✅ Add urgency/scarcity

**Emails Going to Spam**
- ✅ Check SPF/DKIM/DMARC
- ✅ Remove spam trigger words
- ✅ Include physical address
- ✅ Warm up sending domain

**High Bounce Rate (>5%)**
- ✅ Verify email addresses
- ✅ Remove old contacts
- ✅ Use double opt-in
- ✅ Clean list regularly

**Full troubleshooting**: `DELIVERABILITY_CHECKLIST.md`

---

## 🔗 File Reference

### Essential Files

| File | Purpose | When to Use |
|------|---------|-------------|
| `README.md` | Package overview | First time setup |
| `QUICK_REFERENCE.md` | Fast launch guide | Every campaign |
| `IMPLEMENTATION_GUIDE.md` | Detailed setup | Initial setup |
| `DELIVERABILITY_CHECKLIST.md` | Technical setup | Before first send |

### Template Files

| File | Purpose | Format |
|------|---------|--------|
| `html-template.html` | Main email | HTML |
| `short-email-template.html` | Short version | HTML |
| `plain-text-template.txt` | Fallback | Plain text |
| `followup-templates.json` | Follow-ups | JSON |

### Configuration Files

| File | Purpose | Format |
|------|---------|--------|
| `subject-lines.json` | 80 subject lines | JSON |
| `preview-text.json` | Preview options | JSON |
| `utm-config.json` | Tracking setup | JSON |
| `ab-test-config.json` | Test scenarios | JSON |
| `campaign-builder.json` | Sequence builder | JSON |

### Tracking Files

| File | Purpose | Format |
|------|---------|--------|
| `campaign-tracking.csv` | Performance tracking | CSV |

### Additional Files

| File | Purpose | Format |
|------|---------|--------|
| `whatsapp-template.txt` | WhatsApp message | Plain text |

---

## 🎓 Learning Path

### Beginner
1. Read `README.md`
2. Run `npm run seed:ewynk-campaign`
3. Follow `QUICK_REFERENCE.md`
4. Send first campaign

### Intermediate
1. Study `IMPLEMENTATION_GUIDE.md`
2. Set up follow-up sequences
3. Implement UTM tracking
4. Run first A/B test

### Advanced
1. Master `DELIVERABILITY_CHECKLIST.md`
2. Optimize all 4 A/B tests
3. Build custom sequences
4. Achieve 35%+ open rates

---

## 📞 Support

**Questions or need help?**

- 📧 Email: help@ewynk.com
- 📞 Phone: +91-9971978446
- 🌐 Website: https://ewynk.com

**Documentation Issues?**

Open an issue or submit a pull request.

---

## 📝 Version History

**v1.0** (November 2025)
- Initial release
- 8 email templates
- 80 subject lines
- 4 A/B test scenarios
- Complete tracking setup
- Multi-channel support

---

## 📄 License

Proprietary - eWynk Internal Use

These templates and assets are created for eWynk's promotional campaigns. Customize for your brand as needed.

---

**Last Updated**: November 19, 2025  
**Maintained by**: eWynk Digital Transformation Team  
**Version**: 1.0.0
