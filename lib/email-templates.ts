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
};

export function getTemplateByKey(key: keyof typeof emailTemplates) {
  return emailTemplates[key];
}

export function getAllTemplates() {
  return Object.values(emailTemplates);
}
