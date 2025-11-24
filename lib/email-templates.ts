/**
 * Pre-built email templates for common use cases
 * These templates use variables that will be replaced with actual data
 * Available variables: {{name}}, {{email}}, {{company_name}}, {{company_address}}, etc.
 */

import { appConfig } from './config';

export const emailTemplates = {
  welcome: {
    name: 'Welcome Email',
    description: 'Welcome new subscribers to your list',
    category: 'Onboarding',
    subject: 'Welcome to {{company_name}}! 🎉',
    previewText: 'Thanks for joining us. Here\'s what to expect next.',
    htmlBody: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px;">Welcome! 🎉</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px;">
                Hi {{name}},
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px;">
                Thanks for subscribing to our newsletter! We're excited to have you as part of our community.
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 30px;">
                Here's what you can expect from us:
              </p>
              <ul style="font-size: 16px; line-height: 1.8; color: #333333; margin: 0 0 30px; padding-left: 20px;">
                <li>Weekly tips and insights</li>
                <li>Exclusive offers and updates</li>
                <li>Industry news and trends</li>
              </ul>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{website_url}}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 5px; font-size: 16px; font-weight: bold;">
                      Get Started
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="font-size: 14px; color: #6c757d; margin: 0 0 10px;">
                {{company_name}} | {{company_address}}
              </p>
              <p style="font-size: 12px; color: #6c757d; margin: 0;">
                <a href="{{unsubscribe_url}}" style="color: #6c757d; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },

  newsletter: {
    name: 'Monthly Newsletter',
    description: 'Regular newsletter template',
    category: 'Newsletter',
    subject: '📰 {{month}} Newsletter - {{company_name}}',
    previewText: 'Your monthly update is here!',
    htmlBody: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px; text-align: center; border-bottom: 3px solid #4f46e5;">
              <h1 style="color: #1f2937; margin: 0; font-size: 28px;">{{company_name}}</h1>
              <p style="color: #6b7280; margin: 10px 0 0; font-size: 14px;">{{month}} Newsletter</p>
            </td>
          </tr>
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 24px;">What's New This Month</h2>
              
              <!-- Article 1 -->
              <div style="margin-bottom: 30px;">
                <h3 style="color: #4f46e5; margin: 0 0 10px; font-size: 20px;">Article Title Here</h3>
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 15px;">
                  Brief description of your article or update. Keep it concise and engaging to encourage clicks.
                </p>
                <a href="{{article_url}}" style="color: #4f46e5; text-decoration: none; font-weight: bold;">Read More →</a>
              </div>
              
              <!-- Article 2 -->
              <div style="margin-bottom: 30px;">
                <h3 style="color: #4f46e5; margin: 0 0 10px; font-size: 20px;">Another Great Update</h3>
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 15px;">
                  Share your latest news, product updates, or valuable content with your subscribers.
                </p>
                <a href="{{article_url}}" style="color: #4f46e5; text-decoration: none; font-weight: bold;">Read More →</a>
              </div>
              
              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 40px;">
                <tr>
                  <td align="center" style="background-color: #4f46e5; padding: 20px; border-radius: 5px;">
                    <a href="{{cta_url}}" style="color: #ffffff; text-decoration: none; font-size: 18px; font-weight: bold;">
                      Visit Our Website
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px;">
                {{company_name}} | {{company_address}}
              </p>
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                <a href="{{unsubscribe_url}}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },

  promotional: {
    name: 'Promotional Offer',
    description: 'Promote special offers and discounts',
    category: 'Promotional',
    subject: '🎁 Special Offer: {{discount}}% Off!',
    previewText: 'Limited time offer - Don\'t miss out!',
    htmlBody: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Special Offer</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #fef3c7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); padding: 50px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0 0 10px; font-size: 36px; font-weight: bold;">SPECIAL OFFER</h1>
              <p style="color: #ffffff; margin: 0; font-size: 24px;">{{discount}}% OFF</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 28px;">Limited Time Only!</h2>
              <p style="font-size: 18px; line-height: 1.6; color: #4b5563; margin: 0 0 30px;">
                Get {{discount}}% off on all products. Use code <strong style="color: #dc2626;">{{promo_code}}</strong> at checkout.
              </p>
              <p style="font-size: 16px; color: #6b7280; margin: 0 0 40px;">
                Offer expires: {{expiry_date}}
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{shop_url}}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 50px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      Shop Now
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px;">
                {{company_name}} | {{company_address}}
              </p>
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                <a href="{{unsubscribe_url}}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },

  ewynkConsultation: {
    name: 'eWynk Free Consultation',
    description: 'Business consultation outreach for new domain registrations',
    category: 'Outreach',
    subject: 'Unlock Your Business Potential – Free Strategy Session Inside',
    previewText: '100+ brands accelerated. 95% on-time delivery. Your free consultation awaits.',
    htmlBody: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unlock Your Business Potential</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 20px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <!-- Header with Brand -->
          <tr>
            <td style="background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0 0 10px; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">eWynk</h1>
              <p style="color: #e0f2fe; margin: 0; font-size: 14px; font-weight: 500;">Digital Transformation Partner</p>
            </td>
          </tr>

          <!-- Personalized Greeting -->
          <tr>
            <td style="padding: 35px 30px 25px;">
              <p style="font-size: 17px; color: #1e293b; margin: 0 0 8px; font-weight: 600;">Hi {{name}},</p>
              <p style="font-size: 16px; line-height: 1.7; color: #475569; margin: 0;">
                Congratulations on your new online presence! We noticed your recent domain registration and wanted to extend a warm welcome to the digital world.
              </p>
            </td>
          </tr>

          <!-- Social Proof Banner -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 8px; border-left: 4px solid #0ea5e9;">
                <tr>
                  <td style="padding: 20px 25px;">
                    <p style="margin: 0 0 12px; font-size: 15px; color: #0c4a6e; font-weight: 600;">Trusted by Growing Businesses</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="33%" style="text-align: center; padding: 5px;">
                          <p style="margin: 0; font-size: 24px; font-weight: 700; color: #0ea5e9;">100+</p>
                          <p style="margin: 5px 0 0; font-size: 12px; color: #475569;">Brands Served</p>
                        </td>
                        <td width="33%" style="text-align: center; padding: 5px; border-left: 1px solid #bae6fd; border-right: 1px solid #bae6fd;">
                          <p style="margin: 0; font-size: 24px; font-weight: 700; color: #0ea5e9;">15+</p>
                          <p style="margin: 5px 0 0; font-size: 12px; color: #475569;">Industries</p>
                        </td>
                        <td width="33%" style="text-align: center; padding: 5px;">
                          <p style="margin: 0; font-size: 24px; font-weight: 700; color: #0ea5e9;">95%</p>
                          <p style="margin: 5px 0 0; font-size: 12px; color: #475569;">On-Time Delivery</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Value Proposition -->
          <tr>
            <td style="padding: 0 30px 25px;">
              <h2 style="color: #1e293b; margin: 0 0 18px; font-size: 22px; font-weight: 700;">We Help You Build, Automate & Scale</h2>
              <p style="font-size: 16px; line-height: 1.7; color: #475569; margin: 0 0 20px;">
                Whether you already have a website that needs optimization, are planning your first online storefront, or want to automate workflows—we're here to accelerate your digital journey.
              </p>
            </td>
          </tr>

          <!-- Solutions Grid -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom: 15px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; border-left: 3px solid #3b82f6;">
                      <tr>
                        <td style="padding: 18px 20px;">
                          <p style="margin: 0 0 6px; font-size: 15px; font-weight: 600; color: #1e293b;">⚡ Custom Web Development</p>
                          <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6;">Blazing-fast, mobile-first, SEO-optimized websites that convert</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 15px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; border-left: 3px solid #8b5cf6;">
                      <tr>
                        <td style="padding: 18px 20px;">
                          <p style="margin: 0 0 6px; font-size: 15px; font-weight: 600; color: #1e293b;">🤖 Workflow Automation</p>
                          <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6;">Save 40+ hours per week with AI-powered integrations</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 15px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; border-left: 3px solid #10b981;">
                      <tr>
                        <td style="padding: 18px 20px;">
                          <p style="margin: 0 0 6px; font-size: 15px; font-weight: 600; color: #1e293b;">🎯 Digital Marketing</p>
                          <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6;">Drive more qualified leads and boost sales</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; border-left: 3px solid #f59e0b;">
                      <tr>
                        <td style="padding: 18px 20px;">
                          <p style="margin: 0 0 6px; font-size: 15px; font-weight: 600; color: #1e293b;">🛍️ Shopify Development</p>
                          <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6;">Complete e-commerce solutions with ongoing optimization</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Why Choose Us -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px;">
                <tr>
                  <td style="padding: 25px;">
                    <p style="margin: 0 0 15px; font-size: 16px; font-weight: 600; color: #78350f;">Why Partner with eWynk?</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="padding-right: 10px; vertical-align: top;">
                          <p style="margin: 0 0 10px; font-size: 14px; color: #92400e;">✓ 95% on-time delivery</p>
                          <p style="margin: 0 0 10px; font-size: 14px; color: #92400e;">✓ 99% client satisfaction</p>
                        </td>
                        <td width="50%" style="padding-left: 10px; vertical-align: top;">
                          <p style="margin: 0 0 10px; font-size: 14px; color: #92400e;">✓ Fast ROI & results</p>
                          <p style="margin: 0; font-size: 14px; color: #92400e;">✓ Transparent process</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Primary CTA -->
          <tr>
            <td style="padding: 0 30px 35px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%); border-radius: 10px; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);">
                <tr>
                  <td style="padding: 30px 25px; text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 18px; font-weight: 700; color: #ffffff;">Get Your Free Strategy Session</p>
                    <p style="margin: 0 0 20px; font-size: 14px; color: #e0f2fe;">No obligation. Discuss your goals and discover opportunities.</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="{{booking_url}}" style="display: inline-block; background-color: #ffffff; color: #0369a1; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 700; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            Schedule Free Call →
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 20px 0 0; font-size: 13px; color: #e0f2fe;">⏱️ Limited slots available this week</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Secondary Contact Options -->
          <tr>
            <td style="padding: 0 30px 35px; text-align: center;">
              <p style="margin: 0 0 15px; font-size: 15px; color: #475569;">Prefer to reach out directly?</p>
              <p style="margin: 0; font-size: 14px; color: #64748b;">
                📧 <a href="mailto:help@ewynk.com" style="color: #0ea5e9; text-decoration: none; font-weight: 600;">help@ewynk.com</a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                📞 <a href="tel:+919971978446" style="color: #0ea5e9; text-decoration: none; font-weight: 600;">+91-9971978446</a>
              </p>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding: 0 30px 35px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; padding: 20px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px; font-size: 15px; color: #1e293b; font-weight: 600;">Looking forward to seeing your business thrive online!</p>
                    <p style="margin: 0 0 4px; font-size: 14px; color: #475569; font-weight: 600;">Vishal Vishwakarma</p>
                    <p style="margin: 0 0 2px; font-size: 13px; color: #64748b;">Founder & CEO, eWynk</p>
                    <p style="margin: 0; font-size: 13px;">
                      <a href="https://ewynk.com" style="color: #0ea5e9; text-decoration: none;">ewynk.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 13px; color: #64748b; margin: 0 0 8px;">
                eWynk - Digital Transformation Partner
              </p>
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                <a href="{{unsubscribe_url}}" style="color: #94a3b8; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },

  announcement: {
    name: 'Product Announcement',
    description: 'Announce new products or features',
    category: 'Announcement',
    subject: '🚀 Introducing {{product_name}}',
    previewText: 'We\'re excited to share something new with you!',
    htmlBody: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product Announcement</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <h1 style="color: #1f2937; margin: 0 0 10px; font-size: 32px;">🚀 Big News!</h1>
              <p style="color: #6b7280; margin: 0; font-size: 18px;">We're excited to introduce...</p>
            </td>
          </tr>
          <!-- Product Image -->
          <tr>
            <td style="padding: 0 30px;">
              <div style="background-color: #e0e7ff; height: 300px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <p style="color: #4f46e5; font-size: 24px; margin: 0;">[Product Image]</p>
              </div>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 28px; text-align: center;">{{product_name}}</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 20px; text-align: center;">
                {{product_description}}
              </p>
              <h3 style="color: #1f2937; margin: 30px 0 15px; font-size: 20px;">Key Features:</h3>
              <ul style="font-size: 16px; line-height: 1.8; color: #4b5563; margin: 0 0 30px; padding-left: 20px;">
                <li>Feature 1: Amazing capability</li>
                <li>Feature 2: Powerful functionality</li>
                <li>Feature 3: Easy to use</li>
              </ul>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{product_url}}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 5px; font-size: 16px; font-weight: bold;">
                      Learn More
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px;">
                {{company_name}} | {{company_address}}
              </p>
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                <a href="{{unsubscribe_url}}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },

  domainLaunchHelp: {
    name: 'Domain Launch Help',
    description: 'Outreach to new domain owners offering website launch assistance',
    category: 'Outreach',
    subject: 'Quick help with launching {{website}}',
    previewText: 'We help businesses launch clean, modern websites quickly.',
    htmlBody: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Quick help with launching {{website}}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    body, table, td, a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table {
      border-collapse: collapse !important;
    }
    img {
      border: 0;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      display: block;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    @media only screen and (max-width: 620px) {
      .container {
        width: 100% !important;
      }
      .content {
        padding: 30px 20px !important;
      }
      .header-text {
        font-size: 18px !important;
        line-height: 1.4 !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#8b8b8b; font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <!-- Outer Container -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#8b8b8b; padding:40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="container" style="width:600px; max-width:100%; background-color:#ffffff; margin:0 auto;">
          <!-- Header with Logo and Tagline -->
          <tr>
            <td style="background-color:#000000; padding:40px 30px; text-align:center;">
              <!-- Logo -->
              <img src="{{logo_white_url}}" alt="eWynk Logo" width="180" style="display:block; margin:0 auto 30px; max-width:100%; height:auto;" />
              <!-- Tagline -->
              <p style="margin:0; font-size:20px; line-height:1.5; color:#ffffff; font-weight:400;" class="header-text">
                We build websites that load in &lt;5 seconds, automate<br />workflows that save 40+ hours/week
              </p>
            </td>
          </tr>
          <!-- Main Content -->
          <tr>
            <td class="content" style="padding:40px 50px; background-color:#ffffff;">
              <!-- Greeting -->
              <p style="margin:0 0 25px; font-size:16px; line-height:1.6; color:#000000;">Hi {{firstName}},</p>
              <!-- First Paragraph -->
              <p style="margin:0 0 25px; font-size:16px; line-height:1.6; color:#000000;">
                I came across your domain <strong>{{website}}</strong> and wanted to check if you're planning to take it live soon.
              </p>
              <!-- Second Paragraph -->
              <p style="margin:0 0 25px; font-size:16px; line-height:1.6; color:#000000;">
                I run <strong>eWynk</strong>, and we help businesses launch clean, modern websites quickly. If you'd like help getting <strong>{{website}}</strong> live, you can book a quick call below.
              </p>
              <!-- CTA Button -->
              <p style="margin:0 0 25px;">
                <span style="font-size:16px; color:#000000;">👉 </span>
                <a href="https://ewynk.com/contact-us" target="_blank" style="font-size:16px; font-weight:700; color:#000000; text-decoration:none;">Book Your Onboarding Call</a>
              </p>
              <!-- Alternative Contact -->
              <p style="margin:0 0 25px; font-size:16px; line-height:1.6; color:#000000;">
                Prefer email? Just reply and we'll get back to you ASAP.
              </p>
              <p style="margin:0 0 4px; font-size:14px; color:#666666; font-weight:600;">Vishal Vishwakarma</p>
              <p style="margin:0 0 2px; font-size:13px; color:#666666;">Founder & CEO, eWynk</p>
              <p style="margin:0; font-size:13px;">
                <a href="https://ewynk.com" style="color:#000000; text-decoration:none;">ewynk.com</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#ffffff; text-align:center;">
              <!-- Footer Text -->
              <p style="margin:0 0 20px; font-size:14px; color:#000000;">Build your dream website today.</p>
            </td>
          </tr>
          <!-- Unsubscribe -->
          <tr>
            <td style="padding:20px 30px; background-color:#f5f5f5; text-align:center;">
              <p style="margin:0; font-size:11px; color:#666666; line-height:1.5;">
                eWynk - Digital Transformation Partner<br />
                Plot-202, Block-G, Sector 63, Noida, Uttar Pradesh, India – 201301<br />
                <a href="{{unsubscribe_url}}" style="color:#666666; text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },
};

export function getTemplateByKey(key: keyof typeof emailTemplates) {
  return emailTemplates[key];
}

export function getAllTemplates() {
  return Object.values(emailTemplates);
}
