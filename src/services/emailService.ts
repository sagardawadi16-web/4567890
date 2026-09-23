/**
 * DAWOSTI Kathmandu Boutique - VIP Email Notification & Drop Campaign Service
 */

import { EmailCampaign, EmailSubscriber, Product } from '../types';

export interface ProductEmailPayload {
  id: string;
  title: { en: string; np: string };
  description: { en: string; np: string };
  price: number;
  originalPrice?: number;
  fabric?: { en: string; np: string };
  images?: string[];
  categoryName?: { en: string; np: string };
}

/**
 * Generates email content following the exact merchant request:
 * "hey we are selling this and with product name bio when you add a product via admin"
 */
export const buildNewProductEmailContent = (
  product: ProductEmailPayload,
  storeUrl: string = typeof window !== 'undefined' ? window.location.origin : 'https://dawosti.com.np'
): { subject: string; bodyText: string; bodyHtml: string } => {
  const subject = `Hey, we are selling this! ✨ ${product.title.en}`;

  const bodyText = `Hey!

We are selling this brand-new handcrafted piece at DAWOSTI Boutique Kathmandu:

✨ Product: ${product.title.en} (${product.title.np || ''})
${product.fabric?.en ? `🧵 Fabric: ${product.fabric.en}\n` : ''}💰 Price: Rs. ${product.price.toLocaleString('en-IN')}${product.originalPrice ? ` (Original: Rs. ${product.originalPrice.toLocaleString('en-IN')})` : ''}

📖 About this design:
${product.description.en}

${product.description.np ? `नेपालीमा: ${product.description.np}\n` : ''}
📍 Available online & in our New Road Boutique, Kathmandu.
🚚 Fast Delivery all across Nepal (COD available) | Worldwide Courier.

👉 Check it out & order now:
${storeUrl}#product-${product.id}

For instant inquiries or direct phone/WhatsApp order:
📞 +977 9708251494
✉️ contact.dawosti@gmail.com

Warm regards,
DAWOSTI Atelier Kathmandu
Opposite Bishal Bazar, New Road, Kathmandu`;

  const bodyHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF2E9; color: #2B1810; margin: 0; padding: 24px;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #EADCCE; box-shadow: 0 4px 20px rgba(43,24,16,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color: #561F1F; padding: 28px; text-align: center; border-bottom: 3px solid #D4AF37;">
              <span style="display: inline-block; width: 8px; height: 8px; background-color: #D4AF37; transform: rotate(45deg); margin-right: 8px;"></span>
              <span style="font-size: 24px; font-weight: bold; color: #FFF8F0; letter-spacing: 3px; text-transform: uppercase;">DAWOSTI</span>
              <span style="display: inline-block; width: 8px; height: 8px; background-color: #D4AF37; transform: rotate(45deg); margin-left: 8px;"></span>
              <p style="margin: 6px 0 0 0; font-size: 11px; color: #D4AF37; letter-spacing: 1.5px; text-transform: uppercase;">Kathmandu Luxury Boutique</p>
            </td>
          </tr>

          <!-- Hero Greeting -->
          <tr>
            <td style="padding: 32px 32px 16px 32px;">
              <span style="background-color: #FAF2E9; color: #8B3A3A; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #EADCCE;">Exclusive Drop Alert</span>
              <h1 style="color: #2B1810; font-size: 24px; margin: 16px 0 8px 0; line-height: 1.3;">Hey, we are selling this! ✨</h1>
              <p style="color: #6B564C; font-size: 15px; margin: 0 0 20px 0; line-height: 1.6;">Our artisans have just published a fresh, handcrafted addition to our catalog:</p>
            </td>
          </tr>

          <!-- Product Card -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF2E9; border-radius: 12px; border: 1px solid #EADCCE; overflow: hidden;">
                ${product.images && product.images[0] ? `
                <tr>
                  <td style="text-align: center; background-color: #F5EBE1; padding: 0;">
                    <img src="${product.images[0]}" alt="${product.title.en}" style="width: 100%; max-height: 380px; object-fit: cover; display: block;" />
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="font-size: 20px; color: #2B1810; margin: 0 0 8px 0;">${product.title.en}</h2>
                    ${product.title.np ? `<p style="font-size: 14px; color: #8B3A3A; margin: 0 0 12px 0; font-weight: bold;">${product.title.np}</p>` : ''}
                    
                    <p style="font-size: 14px; color: #503E36; line-height: 1.6; margin: 0 0 16px 0; white-space: pre-line;">
                      ${product.description.en}
                    </p>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px dashed #D5C2B1; padding-top: 14px; margin-top: 14px;">
                      <tr>
                        <td>
                          <span style="font-size: 12px; color: #6B564C; text-transform: uppercase;">Special Price</span>
                          <div style="font-size: 22px; font-weight: bold; color: #8B3A3A;">Rs. ${product.price.toLocaleString('en-IN')}</div>
                        </td>
                        <td align="right">
                          <a href="${storeUrl}#product-${product.id}" style="background-color: #8B3A3A; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                            View in Shop →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Contact -->
          <tr>
            <td style="background-color: #F8EFE4; padding: 24px 32px; border-top: 1px solid #EADCCE; text-align: center; color: #6B564C; font-size: 12px; line-height: 1.6;">
              <p style="margin: 0 0 8px 0; font-weight: bold; color: #2B1810;">DAWOSTI Boutique Kathmandu</p>
              <p style="margin: 0 0 8px 0;">New Road (Opposite Bishal Bazar), Kathmandu | WhatsApp: +977 9708251494</p>
              <p style="margin: 0; color: #9E897E;">You are receiving this because you subscribed to new drop alerts at DAWOSTI.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return { subject, bodyText, bodyHtml };
};

/**
 * Creates a mailto URL with all recipients BCC'd so the merchant
 * can click 1-click and have their default email client send to everyone.
 */
export const buildMailtoUrl = (
  recipients: string[],
  subject: string,
  bodyText: string
): string => {
  if (recipients.length === 0) {
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  }
  const bcc = recipients.join(',');
  return `mailto:contact.dawosti@gmail.com?bcc=${encodeURIComponent(bcc)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
};
