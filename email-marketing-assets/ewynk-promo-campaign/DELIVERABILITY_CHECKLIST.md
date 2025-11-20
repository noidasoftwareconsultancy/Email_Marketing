# Email Deliverability Checklist

Ensure your emails reach the inbox, not spam. Follow this checklist before launching any campaign.

## 🔐 Technical Setup (One-Time)

### DNS Records
- [ ] **SPF Record** configured
  ```
  v=spf1 include:_spf.google.com ~all
  ```
  - Verify: `nslookup -type=txt yourdomain.com`
  
- [ ] **DKIM Record** configured
  - Get from your email provider
  - Add to DNS as TXT record
  - Verify: Send test email, check headers
  
- [ ] **DMARC Record** configured
  ```
  v=DMARC1; p=quarantine; rct=100; rua=mailto:dmarc@yourdomain.com
  ```
  - Verify: `nslookup -type=txt _dmarc.yourdomain.com`

### Domain Reputation
- [ ] Domain age > 30 days (older is better)
- [ ] Domain has website with content
- [ ] Domain SSL certificate installed
- [ ] No history of spam complaints
- [ ] Check reputation: [SenderScore.org](https://senderscore.org)

### Email Authentication
- [ ] Sending from verified domain
- [ ] Reply-to address is valid and monitored
- [ ] From name is recognizable (use personal name, not company)
- [ ] Consistent sender identity across campaigns

---

## 📧 Email Content (Every Campaign)

### Subject Line
- [ ] Under 50 characters (mobile-friendly)
- [ ] No ALL CAPS
- [ ] No excessive punctuation (!!!, ???)
- [ ] Avoid spam trigger words:
  - ❌ Free, Winner, Cash, Prize, Guarantee
  - ❌ Act now, Limited time, Urgent
  - ❌ Click here, Buy now
  - ✅ Use: "Free strategy session" (context matters)
  - ✅ Use: "Limited slots" (softer urgency)

### Email Body
- [ ] Text-to-image ratio > 60% text
- [ ] No large images (< 1MB total)
- [ ] Images have alt text
- [ ] No image-only emails
- [ ] Links use HTTPS
- [ ] No URL shorteners (bit.ly, tinyurl)
- [ ] No excessive links (< 5 total)
- [ ] No broken links
- [ ] Proper HTML structure (no errors)

### Required Elements
- [ ] Physical mailing address in footer
- [ ] Unsubscribe link (visible, working)
- [ ] Company name
- [ ] Contact information (email/phone)
- [ ] Privacy policy link (optional but recommended)

### Personalization
- [ ] Recipient name used correctly
- [ ] No "Dear [NAME]" errors
- [ ] Merge tags tested
- [ ] Fallback values set (e.g., "Hi there" if no name)

---

## 👥 List Quality (Ongoing)

### List Hygiene
- [ ] Remove bounced emails immediately
- [ ] Remove unsubscribes within 24 hours
- [ ] Remove inactive contacts (no opens in 6 months)
- [ ] No purchased/scraped lists
- [ ] All contacts opted in (double opt-in preferred)
- [ ] List segmented by engagement level

### Engagement
- [ ] Re-engagement campaign sent to inactive contacts
- [ ] High-engagement contacts prioritized
- [ ] Bounce rate < 2%
- [ ] Complaint rate < 0.1%
- [ ] Unsubscribe rate < 0.5%

---

## 🚀 Sending Practices

### Volume & Frequency
- [ ] Gradual volume increase (warm-up)
  - Day 1: 50 emails
  - Day 2: 100 emails
  - Day 3: 200 emails
  - Day 4: 500 emails
  - Day 5+: Full volume
- [ ] Consistent sending schedule
- [ ] Not sending too frequently (max 2-3/week)
- [ ] Not sending too infrequently (min 1/month)

### Timing
- [ ] Sending during business hours (9 AM - 5 PM)
- [ ] Avoiding Mondays and Fridays
- [ ] Best days: Tuesday, Wednesday, Thursday
- [ ] Best times: 10 AM, 11 AM, 2 PM
- [ ] Timezone-aware sending (if international)

### Rate Limiting
- [ ] Sending rate < 100 emails/minute
- [ ] Delays between batches (1-2 seconds)
- [ ] Not hitting ESP rate limits
- [ ] Monitoring for throttling

---

## 🧪 Testing (Before Every Send)

### Pre-Send Tests
- [ ] Test email sent to yourself
- [ ] Checked on Gmail
- [ ] Checked on Outlook
- [ ] Checked on Apple Mail
- [ ] Checked on mobile device
- [ ] All links clicked and verified
- [ ] Unsubscribe link tested
- [ ] Images loading correctly
- [ ] No broken formatting

### Spam Testing
- [ ] Run through spam checker:
  - [Mail-Tester.com](https://www.mail-tester.com) (score > 8/10)
  - [GlockApps](https://glockapps.com)
  - [Litmus Spam Testing](https://litmus.com)
- [ ] Check spam score < 5
- [ ] No blacklist warnings
- [ ] Authentication passing (SPF, DKIM, DMARC)

### A/B Testing
- [ ] Test group size: 10-20% of list
- [ ] Wait 24-48 hours for results
- [ ] Statistical significance achieved
- [ ] Winner selected based on data

---

## 📊 Monitoring (During & After Send)

### Real-Time Monitoring
- [ ] Watch bounce rate (pause if > 5%)
- [ ] Watch complaint rate (pause if > 0.1%)
- [ ] Monitor delivery rate
- [ ] Check for blacklist additions
- [ ] Monitor ESP warnings/alerts

### Post-Send Analysis
- [ ] Delivery rate calculated
- [ ] Open rate tracked
- [ ] Click rate tracked
- [ ] Conversion rate tracked
- [ ] Unsubscribe rate reviewed
- [ ] Complaint rate reviewed
- [ ] Bounce reasons analyzed

### Reputation Monitoring
- [ ] Check SenderScore weekly
- [ ] Monitor Google Postmaster Tools
- [ ] Check Microsoft SNDS
- [ ] Review ESP reputation dashboard
- [ ] No blacklist listings

---

## 🚨 Red Flags (Stop Sending If...)

- ❌ Bounce rate > 5%
- ❌ Complaint rate > 0.1%
- ❌ Unsubscribe rate > 2%
- ❌ Blacklist listing detected
- ❌ ESP warning received
- ❌ Sudden drop in delivery rate
- ❌ Sudden drop in open rate (> 50% decrease)

**Action**: Pause campaign, investigate, fix issues, resume gradually.

---

## 🛠️ Tools & Resources

### Free Tools
- **Spam Testing**: [Mail-Tester.com](https://www.mail-tester.com)
- **DNS Checker**: [MXToolbox.com](https://mxtoolbox.com)
- **Blacklist Check**: [MultiRBL.valli.org](http://multirbl.valli.org)
- **Email Validator**: [NeverBounce](https://neverbounce.com)

### Paid Tools
- **Litmus**: Email testing & analytics
- **GlockApps**: Deliverability testing
- **Validity**: Email verification
- **SendForensics**: Spam score analysis

### Monitoring
- **Google Postmaster Tools**: [Free, Gmail insights](https://postmaster.google.com)
- **Microsoft SNDS**: [Free, Outlook insights](https://sendersupport.olc.protection.outlook.com/snds/)
- **SenderScore**: [Free, reputation score](https://senderscore.org)

---

## ✅ Quick Pre-Send Checklist

Print this and check before every campaign:

```
TECHNICAL
□ SPF/DKIM/DMARC configured
□ Sending from verified domain
□ Reply-to address valid

CONTENT
□ Subject line < 50 chars
□ No spam trigger words
□ Physical address in footer
□ Unsubscribe link present
□ All links HTTPS

LIST
□ No bounced emails
□ No unsubscribes
□ All opted-in contacts
□ List segmented

TESTING
□ Test email sent
□ Checked on mobile
□ Spam score > 8/10
□ All links work

SENDING
□ Sending during business hours
□ Rate limiting enabled
□ Monitoring dashboard open
```

---

## 📈 Deliverability Score Card

Rate your campaign setup:

| Category | Points | Your Score |
|----------|--------|------------|
| DNS Records (SPF, DKIM, DMARC) | 20 | ___ |
| List Quality (opt-in, clean) | 20 | ___ |
| Content Quality (no spam words) | 15 | ___ |
| Engagement Rate (opens, clicks) | 15 | ___ |
| Sending Practices (timing, volume) | 10 | ___ |
| Authentication (verified domain) | 10 | ___ |
| Monitoring (tracking metrics) | 10 | ___ |
| **TOTAL** | **100** | **___** |

**Scoring**:
- 90-100: Excellent deliverability
- 75-89: Good deliverability
- 60-74: Needs improvement
- < 60: High risk of spam

---

## 🎯 Goal: Inbox Placement Rate > 95%

**Current Industry Average**: 85%  
**Your Target**: 95%+  
**Best-in-Class**: 98%+

Track this metric in Google Postmaster Tools and your ESP dashboard.

---

**Last Updated**: November 2025  
**Version**: 1.0
