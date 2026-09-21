import { Order, Product, SiteContentConfig, ThemeSettings } from '../types';
import { getAccessToken, authorizeGoogleSheets } from './firebaseAuth';
import { defaultSiteContent, defaultThemeSettings } from '../store/mockData';

export interface GoogleSheetsSyncResult {
  success: boolean;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  rowCount?: number;
  message: string;
}

export interface SheetAlertsData {
  announcementTextEn?: string;
  announcementTextNp?: string;
  isDashainTheme?: boolean;
  dashainBannerTextEn?: string;
  dashainBannerTextNp?: string;
  couponCode?: string;
  contactWhatsAppPhone?: string;
  contactHelpline?: string;
}

const LOCAL_STORAGE_SHEET_ID_KEY = 'dawosti_all_in_one_sheet_id';

export const getSavedSheetId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LOCAL_STORAGE_SHEET_ID_KEY);
};

export const saveSheetId = (id: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_SHEET_ID_KEY, id);
  }
};

/**
 * Creates or updates a comprehensive All-In-One Google Sheet containing:
 * 1. Orders (with PENDING status and realistic packaging notes)
 * 2. StoreAlerts (Updateable announcement bar, festive theme, WhatsApp contact number 970825194)
 * 3. Products & Stock (Live inventory and pricing)
 */
export const syncAllInOneGoogleSheet = async ({
  orders,
  products,
  siteContent,
  themeSettings,
  contactPhone = '970825194',
}: {
  orders: Order[];
  products: Product[];
  siteContent: SiteContentConfig;
  themeSettings: ThemeSettings;
  contactPhone?: string;
}): Promise<GoogleSheetsSyncResult> => {
  let token = await getAccessToken();

  if (!token) {
    try {
      token = await authorizeGoogleSheets();
    } catch (authErr: any) {
      return {
        success: false,
        message:
          authErr?.message ||
          'Google Sheets authorization was cancelled or blocked in browser preview. Please authorize Google Sheets access.',
      };
    }
  }

  if (!token) {
    return {
      success: false,
      message: 'Google Sheets access token not available. Please click "Sync All-in-One Google Sheet" and complete the Google prompt.',
    };
  }

  try {
    let spreadsheetId = getSavedSheetId();
    let isNewSheet = false;

    // 1. Create a new Spreadsheet if none saved, or if saved spreadsheet is invalid
    if (!spreadsheetId) {
      const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            title: `Dawosti Kathmandu Atelier - All-in-One Master Sheet`,
          },
          sheets: [
            { properties: { title: 'Orders', gridProperties: { frozenRowCount: 1 } } },
            { properties: { title: 'StoreAlerts', gridProperties: { frozenRowCount: 1 } } },
            { properties: { title: 'Products', gridProperties: { frozenRowCount: 1 } } },
          ],
        }),
      });

      if (!createResponse.ok) {
        const errText = await createResponse.text();
        throw new Error(`Failed to create Master Sheet: ${createResponse.statusText} (${errText})`);
      }

      const spreadsheet = await createResponse.json();
      spreadsheetId = spreadsheet.spreadsheetId;
      if (spreadsheetId) {
        saveSheetId(spreadsheetId);
        isNewSheet = true;
      }
    }

    if (!spreadsheetId) {
      throw new Error('Spreadsheet ID could not be generated.');
    }

    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    // 2. Prepare Tab 1: Orders (With PENDING status & Fake Packaging note)
    const ordersHeader = [
      'Order ID',
      'Order Number',
      'Customer Name',
      'Customer Phone',
      'Delivery Address',
      'City / District',
      'Province',
      'Items & Sizes',
      'Payment Method',
      'Subtotal (NPR)',
      'Discount (NPR)',
      'Delivery Fee (NPR)',
      'Total Amount (NPR)',
      'Fulfillment Status',
      'Packaging & Inspection Note',
      'Tracking Number',
      'Courier Partner',
      'Order Date',
    ];

    const ordersRows = orders.map((ord) => {
      const itemsFormatted = ord.items
        .map((it) => `${it.product.title.en} (${it.selectedSize}) x${it.quantity}`)
        .join('; ');

      // Fake packaging & tracking info if not explicitly assigned
      const trackingNumber = ord.trackingNumber || `NP-KTM-${ord.orderNumber.replace(/\D/g, '') || Math.floor(1000000 + Math.random() * 9000000)}`;
      const courierPartner = 'Nepal Post EMS / Sundar Express Logistics (Kathmandu Hub)';
      const packagingNote =
        ord.status === 'delivered'
          ? 'Delivered to Customer'
          : ord.status === 'shipped'
          ? 'In Transit with Dispatch Courier'
          : 'Packaging & Quality Inspection in progress at Kathmandu Atelier. Golden wax seal applied.';

      return [
        ord.id,
        ord.orderNumber,
        ord.shippingAddress.fullName || ord.customerLoginName || 'Verified Customer',
        ord.shippingAddress.phone,
        ord.shippingAddress.addressLine,
        ord.shippingAddress.city,
        ord.shippingAddress.province,
        itemsFormatted,
        ord.paymentMethod.toUpperCase(),
        ord.subtotalAmount,
        ord.discountAmount,
        ord.deliveryFee,
        ord.totalAmount,
        (ord.status || 'PENDING').toUpperCase(),
        packagingNote,
        trackingNumber,
        courierPartner,
        new Date(ord.createdAt).toLocaleString(),
      ];
    });

    // 3. Prepare Tab 2: StoreAlerts (Updateable announcement bar & contacts)
    const alertsHeader = [
      'Config Key',
      'Value (English)',
      'Value (Nepali)',
      'Active / Enabled',
      'Instructions / Help',
    ];

    const alertsRows = [
      [
        'announcement_bar_text',
        siteContent.announcementText.en || 'Free Delivery Across All 77 Districts on orders above NPR 3,000',
        siteContent.announcementText.np || 'रु ३,००० भन्दा माथिको अर्डरमा नेपालका ७७ वटै जिल्लामा निःशुल्क डेलिभरी',
        'TRUE',
        'Edit this text to update the live banner at the top of the website',
      ],
      [
        'dashain_theme_active',
        themeSettings.isDashainTheme ? 'TRUE' : 'FALSE',
        themeSettings.isDashainTheme ? 'TRUE' : 'FALSE',
        themeSettings.isDashainTheme ? 'TRUE' : 'FALSE',
        'Set to TRUE to show Dashain/Tihar festive theme or FALSE for regular elegance',
      ],
      [
        'dashain_banner_text',
        themeSettings.bannerText.en || 'Bada Dashain & Tihar Festive Edit • 15% Off All Handloom Silk & Dhaka',
        themeSettings.bannerText.np || 'बडा दसैँ तथा तिहार विशेष अफर • शुद्ध हातेतान सिल्क र ढाकामा १५% विशेष छुट',
        'TRUE',
        'Festive announcement text displayed when Dashain Theme is enabled',
      ],
      [
        'promo_coupon_code',
        themeSettings.couponCode || 'DAWOSTI10',
        themeSettings.couponCode || 'DAWOSTI10',
        'TRUE',
        'Promo code accepted during website checkout (gives discount)',
      ],
      [
        'contact_whatsapp_phone',
        contactPhone || '970825194',
        contactPhone || '970825194',
        'TRUE',
        'Official WhatsApp phone number (e.g. 970825194)',
      ],
      [
        'contact_helpline',
        `+977 ${contactPhone || '970825194'}`,
        `+977 ${contactPhone || '970825194'}`,
        'TRUE',
        'Customer care phone displayed on footer and top announcement bar',
      ],
    ];

    // 4. Prepare Tab 3: Products (Live inventory & pricing)
    const productsHeader = [
      'Product ID',
      'Category Slug',
      'Title (English)',
      'Title (Nepali)',
      'Price (NPR)',
      'In Stock',
      'Sizes',
      'Featured',
      'Rating',
    ];

    const productsRows = products.map((prod) => [
      prod.id,
      prod.categoryId,
      prod.title.en,
      prod.title.np,
      prod.price,
      prod.inStock ? 'TRUE' : 'FALSE',
      prod.availableSizes.join(', '),
      prod.isFeatured ? 'TRUE' : 'FALSE',
      prod.rating,
    ]);

    // 5. Batch update all 3 tabs without corrupting formulas
    const batchUpdatePayload = {
      valueInputOption: 'USER_ENTERED',
      data: [
        {
          range: 'Orders!A1',
          majorDimension: 'ROWS',
          values: [ordersHeader, ...ordersRows],
        },
        {
          range: 'StoreAlerts!A1',
          majorDimension: 'ROWS',
          values: [alertsHeader, ...alertsRows],
        },
        {
          range: 'Products!A1',
          majorDimension: 'ROWS',
          values: [productsHeader, ...productsRows],
        },
      ],
    };

    const updateResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchUpdatePayload),
      }
    );

    if (!updateResponse.ok) {
      const errBody = await updateResponse.text();
      // If the tabs don't exist in existing sheet, fall back to Orders tab
      console.warn('Batch update warning, attempting single sheet write:', errBody);
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Orders!A1?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            range: 'Orders!A1',
            majorDimension: 'ROWS',
            values: [ordersHeader, ...ordersRows],
          }),
        }
      );
    }

    return {
      success: true,
      spreadsheetId,
      spreadsheetUrl,
      rowCount: ordersRows.length,
      message: isNewSheet
        ? `Created All-in-One Master Sheet with Orders (Pending + Fake Packaging), StoreAlerts, and Products!`
        : `Successfully synchronized ${ordersRows.length} order(s) and StoreAlerts to Master Sheet!`,
    };
  } catch (error: any) {
    console.error('Master Sheet sync error:', error);
    return {
      success: false,
      message: error?.message || 'Failed to sync with Google Sheet.',
    };
  }
};

/**
 * Reads the 'StoreAlerts' tab from the Google Sheet and returns the updated text/configs.
 * Used to let merchants update alerts and announcement bars directly through their Google Sheet!
 */
export const fetchAlertsFromGoogleSheet = async (
  customSpreadsheetId?: string
): Promise<{ success: boolean; data?: SheetAlertsData; message: string }> => {
  let token = await getAccessToken();
  const spreadsheetId = customSpreadsheetId || getSavedSheetId();

  if (!spreadsheetId) {
    return {
      success: false,
      message: 'No Google Sheet connected. Please sync or enter your Spreadsheet ID first.',
    };
  }

  if (!token) {
    try {
      token = await authorizeGoogleSheets();
    } catch (e: any) {
      return {
        success: false,
        message: 'Please authorize Google Sheets access to fetch live Sheet alerts.',
      };
    }
  }

  if (!token) {
    return {
      success: false,
      message: 'Google Sheets access token not available.',
    };
  }

  try {
    const fetchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/StoreAlerts!A2:E20`;
    const res = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Google Sheets API responded with ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    const rows = (json.values || []) as string[][];

    const result: SheetAlertsData = {};

    rows.forEach((row) => {
      const key = (row[0] || '').trim().toLowerCase();
      const valEn = (row[1] || '').trim();
      const valNp = (row[2] || '').trim();

      if (key === 'announcement_bar_text') {
        if (valEn) result.announcementTextEn = valEn;
        if (valNp) result.announcementTextNp = valNp;
      } else if (key === 'dashain_theme_active') {
        result.isDashainTheme = valEn.toUpperCase() === 'TRUE' || valEn === '1';
      } else if (key === 'dashain_banner_text') {
        if (valEn) result.dashainBannerTextEn = valEn;
        if (valNp) result.dashainBannerTextNp = valNp;
      } else if (key === 'promo_coupon_code') {
        if (valEn) result.couponCode = valEn;
      } else if (key === 'contact_whatsapp_phone') {
        if (valEn) result.contactWhatsAppPhone = valEn.replace(/\D/g, '');
      } else if (key === 'contact_helpline') {
        if (valEn) result.contactHelpline = valEn;
      }
    });

    return {
      success: true,
      data: result,
      message: 'Successfully retrieved live announcement alerts & settings from Google Sheet!',
    };
  } catch (err: any) {
    console.error('Fetch alerts error:', err);
    return {
      success: false,
      message: err?.message || 'Could not fetch StoreAlerts from Google Sheet.',
    };
  }
};

/**
 * Automatically appends a newly placed order to the Google Sheet as 'PENDING' with packaging note.
 */
export const appendPendingOrderToSheet = async (order: Order): Promise<boolean> => {
  const token = await getAccessToken();
  const spreadsheetId = getSavedSheetId();

  if (!token || !spreadsheetId) {
    return false;
  }

  try {
    const itemsFormatted = order.items
      .map((it) => `${it.product.title.en} (${it.selectedSize}) x${it.quantity}`)
      .join('; ');

    const trackingNumber =
      order.trackingNumber || `NP-KTM-${order.orderNumber.replace(/\D/g, '') || Math.floor(1000000 + Math.random() * 9000000)}`;
    const courierPartner = 'Nepal Post EMS / Sundar Express Logistics (Kathmandu Hub)';
    const packagingNote =
      'Packaging & Quality Inspection in progress at Kathmandu Atelier. Golden wax seal applied.';

    const newRow = [
      order.id,
      order.orderNumber,
      order.shippingAddress.fullName || order.customerLoginName || 'Verified Customer',
      order.shippingAddress.phone,
      order.shippingAddress.addressLine,
      order.shippingAddress.city,
      order.shippingAddress.province,
      itemsFormatted,
      order.paymentMethod.toUpperCase(),
      order.subtotalAmount,
      order.discountAmount,
      order.deliveryFee,
      order.totalAmount,
      'PENDING',
      packagingNote,
      trackingNumber,
      courierPartner,
      new Date(order.createdAt).toLocaleString(),
    ];

    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Orders!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: 'Orders!A1',
          majorDimension: 'ROWS',
          values: [newRow],
        }),
      }
    );

    return appendRes.ok;
  } catch (e) {
    console.warn('Auto-append to Google Sheet skipped or failed:', e);
    return false;
  }
};

/**
 * Backward-compatible helper to sync orders to the all-in-one Google Sheet
 */
export const syncOrdersToGoogleSheet = async (
  orders: Order[]
): Promise<GoogleSheetsSyncResult> => {
  return syncAllInOneGoogleSheet({
    orders,
    products: [],
    siteContent: defaultSiteContent,
    themeSettings: defaultThemeSettings,
    contactPhone: '970825194',
  });
};

