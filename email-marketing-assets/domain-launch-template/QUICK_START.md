# Domain Launch Template - Quick Start

## ✅ Template Added Successfully!

The template is now in your database and ready to use.

## 🚀 Quick Start (3 Steps)

### Step 1: Preview the Template
Visit: http://ewynk.com/dashboard/templates/domain-launch-preview

- See the exact design
- Test with different data
- Verify variables work

### Step 2: Prepare Your Contacts

Your contacts need these fields:
```javascript
{
  firstName: "John",      // Required - for greeting
  website: "example.com", // Required - domain name
  email: "john@example.com" // Required - recipient
}
```

**Import contacts with these fields or add them manually.**

### Step 3: Create Campaign

1. Go to **Campaigns** → **Create New Campaign**
2. Select template: **"Domain Launch - Cold Outreach"**
3. Set **CTA URL** to your booking link (e.g., Calendly)
4. Select target contacts (with firstName + website)
5. **Preview** with real contact data
6. **Send test** to yourself
7. **Launch** campaign!

## 📧 What the Email Looks Like

**Subject:**
```
Quick help with launching example.com
```

**Content:**
```
Hi John,

I came across your domain example.com and wanted to 
check if you're planning to take it live soon.

I run eWynk, and we help businesses launch clean, 
modern websites quickly. If you'd like help getting 
example.com live, you can book a quick call below.

👉 Book Your Onboarding Call

Prefer email? Just reply and we'll get back to you ASAP.

- Vishal
```

## 🔧 Required Setup

### 1. Set Your Booking URL

When creating campaign, set CTA URL to:
- Calendly link: `https://calendly.com/yourname/call`
- Cal.com link: `https://cal.com/yourname/call`
- Or any booking page URL

### 2. Ensure Contacts Have Data

**Minimum required:**
- ✓ firstName
- ✓ website
- ✓ email

**Optional but helpful:**
- name (full name)
- company
- Other contact fields

## 📝 Example Contact CSV

```csv
firstName,email,website,name
John,john@example.com,example.com,John Doe
Sarah,sarah@startup.io,startup.io,Sarah Johnson
Mike,mike@tech.com,tech.com,Mike Chen
```

## 🎯 Best Practices

### Target Audience
- Domain owners with inactive domains
- Businesses planning to launch
- Startups needing websites
- Companies with parked domains

### Timing
- Send Tuesday-Thursday
- 9 AM - 5 PM local time
- Avoid Mondays and Fridays
- Follow up after 3-5 days

### Personalization
- Use actual domain names
- Research before sending
- Segment by domain type
- Customize CTA if needed

## ✨ Template Features

✓ **Personalized** - Uses first name and domain
✓ **Professional** - Clean, modern design
✓ **Mobile Responsive** - Looks great everywhere
✓ **Clear CTA** - Single, focused action
✓ **Social Proof** - Value prop in header
✓ **Compliant** - Unsubscribe and address included

## 🔍 Testing Checklist

Before launching:
- [ ] Preview template looks correct
- [ ] Variables replace properly
- [ ] Logo loads in header
- [ ] CTA link works
- [ ] Send test to yourself
- [ ] Check on mobile device
- [ ] Verify in different email clients
- [ ] Unsubscribe link works

## 📊 Expected Results

### Typical Performance
- **Open Rate:** 25-35%
- **Click Rate:** 5-10%
- **Reply Rate:** 2-5%
- **Booking Rate:** 1-3%

### Optimization Tips
1. Test different subject lines
2. Segment by domain age
3. Personalize value proposition
4. Follow up with non-responders
5. Track which domains convert best

## 🛠️ Customization

### Change Sender Name
Edit in template:
```html
- Vishal  →  - [Your Name]
```

### Change Company Name
Edit in template:
```html
eWynk  →  [Your Company]
```

### Change Value Prop
Edit header:
```html
We build websites that...  →  [Your Value Prop]
```

### Change CTA Text
Edit button:
```html
Book Your Onboarding Call  →  [Your CTA]
```

## 📱 Preview Pages

**Live Preview:**
http://ewynk.com/dashboard/templates/domain-launch-preview

**Variable Test:**
http://ewynk.com/dashboard/templates/test-variables

**Logo Test:**
http://ewynk.com/dashboard/test-logos

## 🆘 Troubleshooting

### "Variables not replacing"
- Check contact has firstName and website fields
- Preview with sample data first
- Verify variable syntax: `{{variable}}`

### "Logo not showing"
- Visit: http://ewynk.com/dashboard/test-logos
- Check `.env` has `NEXT_PUBLIC_APP_URL`
- See: `LOGO_TROUBLESHOOTING.md`

### "Template not in list"
- Refresh the page
- Check database connection
- Run seed script again

## 📚 Documentation

- **Full Guide:** `README.md`
- **Design Match:** `DESIGN_MATCH.md`
- **Complete Info:** `TEMPLATE_COMPLETE.md`
- **Variable System:** `../VARIABLE_SYSTEM.md`
- **Logo Setup:** `../LOGO_QUICK_START.md`

## 🎉 You're Ready!

The template is set up and ready to use. Start by:
1. Previewing at `/dashboard/templates/domain-launch-preview`
2. Preparing your contact list
3. Creating your first campaign

Good luck with your outreach! 🚀
