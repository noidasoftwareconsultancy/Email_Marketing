# eWynk Campaign - Quick Reference Guide

One-page reference for launching campaigns fast.

## 🚀 5-Minute Launch

```bash
# 1. Import templates
npm run seed:ewynk-campaign

# 2. Go to dashboard
# Dashboard → Campaigns → Create Campaign

# 3. Select template
# "eWynk Promo - Main (Full HTML)"

# 4. Choose subject
# "Free strategy session — no strings attached"

# 5. Set target tags
# Leave empty for all contacts, or specify: "prospect", "cold-lead"

# 6. Send or schedule
# Best time: Tuesday/Wednesday 10-11 AM
```

---

## 📧 Template Quick Picks

| Audience | Template | Subject Line | Expected Open Rate |
|----------|----------|--------------|-------------------|
| **General** | Main (Full HTML) | Free strategy session — no strings attached | 25-30% |
| **E-commerce** | E-commerce Focus | Boost your Shopify store sales | 35-40% |
| **Service Biz** | Service Business Focus | Get more service bookings | 30-35% |
| **Startups** | Startup Focus | Launch your MVP faster | 35-40% |
| **Quick Send** | Short Version | Quick 15-minute call | 30-35% |

---

## 📅 Follow-up Schedule

| Day | Template | Subject | Target |
|-----|----------|---------|--------|
| **0** | Main Promo | Free strategy session | All contacts |
| **3** | Follow-up 1 | Any time for a short chat? | Non-openers |
| **7** | Follow-up 2 | 3 quick wins to improve conversions | Openers who didn't click |
| **12** | Follow-up 3 | Final call — few slots left | Engaged non-converters |

---

## 🎯 UTM Parameters

**Base URL**: `https://ewynk.com/contact-us`

**Parameters**:
```
utm_source=email
utm_medium=promo
utm_campaign=promo_nov2025
utm_content=cta_schedule (or followup1, followup2, followup3)
```

**Full URL**:
```
https://ewynk.com/contact-us?utm_source=email&utm_medium=promo&utm_campaign=promo_nov2025&utm_content=cta_schedule
```

---

## 📊 Success Metrics

| Metric | Target | Excellent |
|--------|--------|-----------|
| **Delivery Rate** | 98% | 99%+ |
| **Open Rate** | 25% | 35%+ |
| **Click Rate** | 3% | 5%+ |
| **Reply Rate** | 1% | 2%+ |
| **Conversion Rate** | 0.5% | 1%+ |

---

## ⏰ Best Send Times

| Day | Time | Open Rate Boost |
|-----|------|-----------------|
| **Tuesday** | 10:00 AM | +15% |
| **Wednesday** | 11:00 AM | +12% |
| **Thursday** | 2:00 PM | +10% |

**Avoid**: Monday mornings, Friday afternoons, weekends

---

## ✅ Pre-Send Checklist (30 seconds)

```
□ Template selected
□ Subject line set
□ Target audience defined
□ Test email sent to yourself
□ Checked on mobile
□ Unsubscribe link works
□ Scheduled for optimal time
```

---

## 🔧 Quick Customizations

### Change CTA Text
Find: `Schedule Free Call →`  
Replace with:
- `Book Now →`
- `Get Started →`
- `Claim Your Spot →`

### Update Stats
Find: `100+ Brands Served`  
Replace with your numbers

### Change Colors
Find: `#0ea5e9` (primary blue)  
Replace with your brand color

---

## 📱 Multi-Channel URLs

**Email**:
```
?utm_source=email&utm_medium=promo&utm_campaign=promo_nov2025&utm_content=cta_schedule
```

**WhatsApp**:
```
?utm_source=whatsapp&utm_medium=direct&utm_campaign=promo_nov2025&utm_content=wa_message
```

**SMS**:
```
?utm_source=sms&utm_medium=direct&utm_campaign=promo_nov2025&utm_content=sms_message
```

---

## 🆘 Troubleshooting

| Problem | Quick Fix |
|---------|-----------|
| **Low open rate** | Change subject line, use personal sender name |
| **Low click rate** | Make CTA bigger, simplify email |
| **Going to spam** | Check SPF/DKIM/DMARC, remove spam words |
| **High bounces** | Clean list, verify emails |

---

## 📞 Contact Info to Update

Find and replace in templates:

```
help@ewynk.com → your@email.com
+91-9971978446 → your-phone-number
Plot-202, Block-G, Sector 63, Noida → your-address
```

---

## 🎨 Brand Colors

Current:
- Primary: `#0ea5e9` (Sky Blue)
- Secondary: `#3b82f6` (Blue)
- Accent: `#0c4a6e` (Dark Blue)

Update in `<style>` section:
```css
:root {
  --brand-1: #0ea5e9;  /* Your color */
  --brand-2: #3b82f6;  /* Your color */
}
```

---

## 📈 A/B Test Quick Setup

**Test 1: Subject Lines**
- Split: 50/50
- Size: 200 contacts
- Variant A: "Free strategy session — no strings attached"
- Variant B: "Turn your website into a lead machine"
- Winner: Highest open rate

**Test 2: Email Length**
- Split: 50/50
- Size: 400 contacts
- Variant A: Full HTML
- Variant B: Short version
- Winner: Highest click rate

---

## 🔗 Quick Links

- **Full Guide**: `IMPLEMENTATION_GUIDE.md`
- **Deliverability**: `DELIVERABILITY_CHECKLIST.md`
- **Subject Lines**: `subject-lines.json`
- **A/B Tests**: `ab-test-config.json`
- **Tracking**: `campaign-tracking.csv`

---

## 💡 Pro Tips

1. **Personalize sender name**: Use "Vishal from eWynk" not "eWynk Team"
2. **Test on mobile first**: 60% of emails opened on mobile
3. **Keep subject under 50 chars**: Mobile preview cuts off
4. **Send Tuesday-Thursday**: Best engagement days
5. **Follow up 3 times**: 80% of conversions happen after 5+ touches
6. **Track everything**: Use UTM parameters religiously
7. **Clean list monthly**: Remove bounces and inactive contacts
8. **Warm up new domains**: Start with 50 emails/day, increase gradually

---

## 📊 Expected Results (1,000 contacts)

| Metric | Count |
|--------|-------|
| Delivered | 980 |
| Opened | 250-350 |
| Clicked | 30-50 |
| Replied | 10-20 |
| Converted | 5-10 |

**ROI**: If 5 conversions at $5,000 average = $25,000 revenue from one campaign

---

## 🎯 Campaign Goals

**Primary**: Book 10+ strategy calls  
**Secondary**: Build email list engagement  
**Tertiary**: Brand awareness in target market

---

**Need Help?**  
📧 help@ewynk.com  
📞 +91-9971978446

---

**Last Updated**: November 2025  
**Version**: 1.0
