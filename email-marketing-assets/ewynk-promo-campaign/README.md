# eWynk Promotional Campaign Package

Complete email marketing campaign package with templates, subject lines, tracking, and A/B testing configurations.

## 📦 Package Contents

```
ewynk-promo-campaign/
├── html-template.html              # Full responsive HTML email
├── short-email-template.html       # Condensed version
├── plain-text-template.txt         # Plain text fallback
├── followup-templates.json         # 3-step follow-up sequence
├── subject-lines.json              # 80 subject lines (4 audiences)
├── preview-text.json               # Preview text options + pairings
├── utm-config.json                 # UTM tracking configuration
├── ab-test-config.json             # A/B test scenarios
├── campaign-tracking.csv           # Performance tracking spreadsheet
├── whatsapp-template.txt           # WhatsApp promotional message
├── IMPLEMENTATION_GUIDE.md         # Detailed implementation guide
└── README.md                       # This file
```

## 🚀 Quick Start

### 1. Import Templates to Database

```bash
npm run seed:ewynk-campaign
```

This creates 8 ready-to-use templates in your system:
- Main promotional email (full HTML)
- Short version
- E-commerce focused
- Service business focused
- Startup focused
- 3 follow-up emails

### 2. Create Your First Campaign

1. Go to **Dashboard → Campaigns → Create Campaign**
2. Select "eWynk Promo - Main (Full HTML)" template
3. Choose target audience tags
4. Send or schedule

### 3. Set Up Follow-up Sequence

Schedule 3 follow-ups:
- **Day 3**: "eWynk Follow-up 1 - Gentle Reminder"
- **Day 7**: "eWynk Follow-up 2 - Value Add (3 Tips)"
- **Day 12**: "eWynk Follow-up 3 - Last Chance"

## 📊 What's Included

### Subject Lines (80 total)
- **20 General**: Broad appeal for mixed audiences
- **20 E-commerce**: Shopify, conversion optimization focus
- **20 Service Business**: Automation, booking systems focus
- **20 Startups**: MVP, fast launch, affordable pricing focus

**Top performers** (based on industry benchmarks):
1. "Free strategy session — no strings attached" (30-35% open rate)
2. "Turn your website into a lead machine" (35-40% open rate)
3. "Book a free call with eWynk — limited slots" (28-32% open rate)

### Email Templates

#### Main Template Features:
- ✅ Responsive design (mobile-optimized)
- ✅ Dark mode support
- ✅ UTM tracking built-in
- ✅ Unsubscribe link
- ✅ Social proof (stats, testimonials)
- ✅ Clear CTA
- ✅ Professional footer

#### Short Template Features:
- ✅ Under 200 words
- ✅ Single CTA focus
- ✅ Fast load time
- ✅ Perfect for mobile

### Follow-up Sequence

**Email 1** (Day 2-3): Gentle Reminder
- Subject: "Any time for a short chat this week?"
- Tone: Friendly, non-pushy
- Goal: Re-engage non-openers

**Email 2** (Day 5-7): Value Add
- Subject: "3 quick wins to improve conversions"
- Tone: Educational, helpful
- Goal: Build trust, demonstrate expertise

**Email 3** (Day 10-12): Last Chance
- Subject: "Final call — a few slots left this month"
- Tone: Urgent, scarcity-driven
- Goal: Convert fence-sitters

### UTM Tracking

All links include UTM parameters for Google Analytics tracking:

```
utm_source=email
utm_medium=promo
utm_campaign=promo_nov2025
utm_content=cta_schedule (varies by email)
```

**Track in GA4:**
- Acquisition → Traffic Acquisition
- Filter by campaign: "promo_nov2025"
- Monitor conversions, sessions, engagement

### A/B Testing

4 pre-configured test scenarios:

1. **Subject Line Test**: Direct vs Benefit-focused
2. **Email Length Test**: Full HTML vs Short version
3. **CTA Text Test**: 3 variations
4. **Audience Segmentation Test**: Generic vs Industry-specific

See `ab-test-config.json` for full details.

## 📈 Expected Performance

Based on industry benchmarks for B2B service emails:

| Metric | Industry Avg | Target | Excellent |
|--------|-------------|--------|-----------|
| Delivery Rate | 95% | 98% | 99%+ |
| Open Rate | 21% | 25% | 35%+ |
| Click Rate | 2.3% | 3% | 5%+ |
| Reply Rate | 0.5% | 1% | 2%+ |
| Conversion Rate | 0.2% | 0.5% | 1%+ |

**For a 1,000 contact list:**
- Expected opens: 250-350
- Expected clicks: 30-50
- Expected replies: 10-20
- Expected conversions: 5-10

## 🎯 Audience Segmentation

### When to Use Each Template

**Main Template (Full HTML)**
- Use for: Cold outreach, general audience
- Best for: Desktop users, detailed readers
- Expected open rate: 25-30%

**Short Template**
- Use for: Warm leads, mobile-first audiences
- Best for: Busy executives, quick decision-makers
- Expected open rate: 30-35%

**E-commerce Template**
- Use for: Online store owners, Shopify users
- Best for: Retail, D2C brands
- Expected open rate: 35-40%

**Service Business Template**
- Use for: Consultants, agencies, service providers
- Best for: B2B services
- Expected open rate: 30-35%

**Startup Template**
- Use for: Founders, early-stage companies
- Best for: Tech startups, SaaS
- Expected open rate: 35-40%

## 🔧 Customization

### Quick Edits

**Change company stats:**
```html
<!-- In html-template.html, find: -->
<p style="margin:0; font-size:24px; font-weight:700; color:#0ea5e9;">100+</p>
<p style="margin:5px 0 0; font-size:12px; color:#475569;">Brands Served</p>

<!-- Update to your numbers -->
```

**Change CTA text:**
```html
<!-- Find: -->
Schedule Free Call →

<!-- Replace with: -->
Book Now →
Get Started →
Claim Your Spot →
```

**Update contact info:**
```html
<!-- Find and replace: -->
help@ewynk.com → your@email.com
+91-9971978446 → your-phone
```

### Brand Colors

Current palette:
- Primary: `#0ea5e9` (Sky Blue)
- Secondary: `#3b82f6` (Blue)
- Accent: `#0c4a6e` (Dark Blue)

To change, update CSS variables in `<style>` section:
```css
:root {
  --brand-1: #0ea5e9;  /* Your primary color */
  --brand-2: #3b82f6;  /* Your secondary color */
  --accent-1: #0c4a6e; /* Your accent color */
}
```

## 📱 Multi-Channel Support

### Email
- Primary channel
- Full tracking and analytics
- Automated follow-ups

### WhatsApp
- Use `whatsapp-template.txt`
- Higher engagement (36% click rate vs 3% email)
- Best for VIP contacts
- UTM: `utm_source=whatsapp`

### SMS
- Shorten WhatsApp template to <160 chars
- Use for urgent/time-sensitive offers
- UTM: `utm_source=sms`

## 📊 Tracking & Analytics

### Using the CSV Tracker

1. Open `campaign-tracking.csv`
2. Add row for each send
3. Update metrics daily
4. Calculate rates:
   - Open Rate = (Opened / Delivered) × 100
   - Click Rate = (Clicked / Delivered) × 100
   - Conversion Rate = (Converted / Delivered) × 100

### Google Analytics Dashboard

Create custom report:
1. **Dimension**: Campaign Name
2. **Metrics**: Sessions, Users, Conversions
3. **Filter**: Campaign contains "promo_nov2025"
4. **Date Range**: Last 30 days

### Key Questions to Answer

- Which subject line performs best?
- Which audience segment converts highest?
- What time of day gets most opens?
- Which CTA text drives most clicks?
- Do follow-ups improve conversion?

## ✅ Pre-Launch Checklist

Before sending:

- [ ] Templates imported to database
- [ ] Subject line chosen
- [ ] Preview text set
- [ ] Target audience defined
- [ ] UTM parameters verified
- [ ] Test email sent to yourself
- [ ] Checked on mobile
- [ ] Unsubscribe link works
- [ ] Sender email verified
- [ ] Follow-up sequence scheduled

## 🆘 Troubleshooting

### Low Open Rates
- ✅ Test different subject lines
- ✅ Use personal sender name (not company)
- ✅ Send during business hours (10 AM - 2 PM)
- ✅ Clean your list (remove bounces)

### Low Click Rates
- ✅ Make CTA more prominent
- ✅ Simplify email (remove distractions)
- ✅ Test different CTA text
- ✅ Add urgency/scarcity

### Emails Going to Spam
- ✅ Set up SPF, DKIM, DMARC
- ✅ Avoid spam trigger words
- ✅ Include physical address
- ✅ Warm up sending domain

## 📚 Additional Resources

- **Full Implementation Guide**: See `IMPLEMENTATION_GUIDE.md`
- **A/B Testing Guide**: See `ab-test-config.json`
- **UTM Configuration**: See `utm-config.json`
- **Subject Line Library**: See `subject-lines.json`

## 📞 Support

Questions or need help?
- Email: help@ewynk.com
- Phone: +91-9971978446
- Website: https://ewynk.com

## 📝 Version History

**v1.0** (November 2025)
- Initial release
- 8 templates
- 80 subject lines
- 4 A/B test scenarios
- Complete tracking setup

---

**Created by**: eWynk Digital Transformation Team  
**Last Updated**: November 19, 2025  
**License**: Proprietary (eWynk Internal Use)
