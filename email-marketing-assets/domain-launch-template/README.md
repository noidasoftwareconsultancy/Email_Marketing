# Domain Launch Email Template

Cold outreach template for domain owners who haven't launched their websites yet.

## Template Overview

**Campaign Type:** Cold Outreach / Domain Launch Assistance  
**Target Audience:** Domain owners with inactive/parked domains  
**Goal:** Book onboarding calls for website development  
**Tone:** Friendly, helpful, professional  

## Variables Used

### Required Variables
- `{{firstName}}` - Contact's first name
- `{{website}}` - Domain name (e.g., "example.com")
- `{{cta_url}}` - Booking/calendar link
- `{{unsubscribe_url}}` - Unsubscribe link (auto-generated)

### Optional Variables
- `{{logo_white_url}}` - White logo for dark header
- `{{name}}` - Full name (fallback for firstName)
- `{{company}}` - Company name (if available)

## Design Features

### Visual Elements
- **Gray outer background** (#8b8b8b) - Makes email stand out
- **Black header** - Bold, professional look with white logo
- **Clean white content area** - Easy to read
- **Minimal design** - Focuses on message
- **Social media icons** - Footer engagement

### Layout Structure
1. Subject line preview (visible in email)
2. Black header with logo and value proposition
3. White content area with personalized message
4. Footer with social links
5. Unsubscribe section

## Content Strategy

### Hook
"I came across your domain {{website}}" - Shows you did research

### Value Proposition
"We build websites that load in <5 seconds, automate workflows that save 40+ hours/week"

### Call-to-Action
"👉 Book Your Onboarding Call" - Clear, action-oriented

### Alternative
"Prefer email? Just reply" - Low-pressure option

## Personalization Points

1. **First Name** - Personal greeting
2. **Domain Name** - Shows specific interest (mentioned 3 times)
3. **Sender Name** - "Vishal" adds personal touch
4. **Company Name** - "eWynk" establishes credibility

## Best Practices

### Subject Line
- Includes domain name for personalization
- Clear value proposition
- Under 50 characters
- No spam trigger words

### Email Body
- Short paragraphs (2-3 lines max)
- Clear value proposition upfront
- Single, clear CTA
- Alternative contact method
- Personal signature

### Technical
- Mobile responsive
- Plain text version included
- Proper unsubscribe link
- Social proof in header

## Usage Instructions

### 1. Prepare Contact List
Ensure contacts have:
- `firstName` field populated
- `website` field with domain name
- Valid email addresses

### 2. Set CTA URL
Set your booking/calendar link:
```javascript
ctaUrl: "https://calendly.com/yourname/onboarding"
```

### 3. Customize Variables
Optional customizations:
- Update sender name (currently "Vishal")
- Modify company name (currently "eWynk")
- Adjust value proposition
- Change social media links

### 4. Test Before Sending
- Preview with sample data
- Test on mobile devices
- Check all links work
- Verify logo loads
- Send test to yourself

## A/B Testing Suggestions

### Subject Lines
- **A:** "Quick help with launching {{website}}"
- **B:** "{{firstName}}, ready to launch {{website}}?"

### CTA Text
- **A:** "Book Your Onboarding Call"
- **B:** "Schedule Free Consultation"
- **C:** "Get Started Today"

### Opening Line
- **A:** "I came across your domain {{website}}"
- **B:** "Noticed {{website}} isn't live yet"
- **C:** "Quick question about {{website}}"

## Expected Performance

### Benchmarks
- **Open Rate:** 25-35% (personalized subject)
- **Click Rate:** 5-10% (clear CTA)
- **Reply Rate:** 2-5% (cold outreach)
- **Booking Rate:** 1-3% (qualified leads)

### Optimization Tips
1. Send during business hours (9 AM - 5 PM)
2. Avoid Mondays and Fridays
3. Follow up after 3-5 days if no response
4. Segment by domain age/type
5. Test different value propositions

## Compliance

### Legal Requirements
- ✓ Unsubscribe link included
- ✓ Physical address in footer
- ✓ Clear sender identification
- ✓ Honest subject line
- ✓ CAN-SPAM compliant

### Best Practices
- ✓ Permission-based (or legitimate interest)
- ✓ Clear opt-out process
- ✓ Accurate sender information
- ✓ No deceptive content
- ✓ Honor unsubscribe requests immediately

## Customization Guide

### Change Logo
Update in template:
```html
<img src="{{logo_white_url}}" alt="Your Company" width="180" />
```

### Change Value Proposition
Edit header text:
```html
We build websites that [YOUR VALUE PROP]
```

### Change Sender
Update signature:
```html
- [Your Name]
```

### Change Social Links
Update footer links:
```html
<a href="https://facebook.com/yourcompany">...</a>
```

## Files Included

- `html-template.html` - Full HTML email template
- `plain-text-template.txt` - Plain text version
- `subject-lines.json` - Subject line variations
- `README.md` - This documentation

## Integration with System

### Variables Auto-Populated
- `{{firstName}}` - From contact.firstName
- `{{website}}` - From contact.website
- `{{logo_white_url}}` - From public/Logo White.svg
- `{{cta_url}}` - Set in campaign settings
- `{{unsubscribe_url}}` - Auto-generated per contact

### Usage in Campaign
1. Create new campaign
2. Select this template
3. Set target tags/segments
4. Configure CTA URL
5. Preview with sample data
6. Send or schedule

## Support

For questions or customization help:
- Check: `VARIABLE_SYSTEM.md`
- Test page: `/dashboard/templates/test-variables`
- Logo test: `/dashboard/test-logos`
