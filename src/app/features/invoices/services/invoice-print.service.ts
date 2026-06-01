import { inject, Injectable } from '@angular/core';
import { LanguageService } from '@core/i18n/language.service';
import { WorkshopProfileService } from '@core/workshop/workshop-profile.service';
import { Invoice } from '@features/invoices/models/invoice.model';
import { InvoiceBillingService } from '@features/invoices/services/invoice-billing.service';

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface InvoicePrintLabels {
  taxInvoice: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  workOrder: string;
  from: string;
  billTo: string;
  phone: string;
  email: string;
  vatNumber: string;
  plate: string;
  vin: string;
  vehicle: string;
  description: string;
  qty: string;
  unitPrice: string;
  amount: string;
  subtotal: string;
  discount: string;
  taxableAmount: string;
  vat: string;
  totalDue: string;
  invoiceNotes: string;
  paymentTerms: string;
  paymentTermsText: string;
  thankYou: string;
  noItems: string;
}

@Injectable({ providedIn: 'root' })
export class InvoicePrintService {
  private readonly profileService = inject(WorkshopProfileService);
  private readonly language = inject(LanguageService);
  private readonly billing = inject(InvoiceBillingService);
  print(invoice: Invoice): void {
    const html = this.buildPrintDocument(invoice);
    if (!this.printWithIframe(html)) {
      this.printWithBlobWindow(html);
    }
  }

  /** Same-origin iframe — reliable print dialog without empty popups. */
  private printWithIframe(html: string): boolean {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('title', 'Invoice print');
    iframe.style.cssText =
      'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';

    document.body.appendChild(iframe);

    const frameWindow = iframe.contentWindow;
    const frameDoc = frameWindow?.document;

    if (!frameWindow || !frameDoc) {
      iframe.remove();
      return false;
    }

    frameDoc.open();
    frameDoc.write(html);
    frameDoc.close();

    const runPrint = (): void => {
      try {
        frameWindow.focus();
        frameWindow.print();
      } finally {
        window.setTimeout(() => iframe.remove(), 1500);
      }
    };

    window.setTimeout(runPrint, 350);
    return true;
  }

  /** Fallback when iframe is unavailable; blob URL avoids blank about:blank windows. */
  private printWithBlobWindow(html: string): void {
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    const win = window.open(url, '_blank');

    if (!win) {
      URL.revokeObjectURL(url);
      return;
    }

    const cleanup = (): void => URL.revokeObjectURL(url);

    win.addEventListener(
      'load',
      () => {
        window.setTimeout(() => {
          win.focus();
          win.print();
          cleanup();
        }, 400);
      },
      { once: true },
    );

    window.setTimeout(cleanup, 120_000);
  }

  buildPrintDocument(invoice: Invoice): string {
    const lang = this.language.language();
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    const profile = this.profileService.getProfile();
    const currency = this.profileService.currencyLabel(profile.currency, lang);
    const labels = this.getLabels(lang);
    const items = this.extractLineItems(invoice);
    const invoiceNumber = this.formatInvoiceNumber(invoice.id);
    const issueDate = this.formatDate(invoice.created_at, lang);
    const dueDate = this.formatDueDate(invoice.created_at, lang);
    const wo = invoice.work_order;
    const car = wo?.car;
    const subtotal = this.toNumber(invoice.subtotal);
    const discount = this.toNumber(invoice.discount_amount ?? 0);
    const discountLabel = this.billing.formatDiscountLabel(
      invoice,
      labels.discount,
      lang,
    );
    const taxable = Math.max(subtotal - discount, 0);
    const tax = this.toNumber(invoice.tax);
    const total = this.toNumber(invoice.total);
    const taxRate = taxable > 0 ? Math.round((tax / taxable) * 10000) / 100 : 15;
    const billToName =
      invoice.bill_to_name?.trim() || car?.owner_name?.trim() || '—';
    const billToAddress = invoice.bill_to_address?.trim() || '';
    const invoiceNotes = invoice.notes?.trim() || '';

    const rowsHtml = items
      .map(
        (item, index) => `
        <tr>
          <td class="num">${index + 1}</td>
          <td class="desc">${this.escapeHtml(item.description)}</td>
          <td class="num">${item.quantity}</td>
          <td class="money">${this.formatMoney(item.unitPrice)}</td>
          <td class="money">${this.formatMoney(item.amount)}</td>
        </tr>`,
      )
      .join('');

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8" />
  <title>${labels.taxInvoice} ${invoiceNumber}</title>
  <style>
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
      font-size: 11pt;
      color: #0f172a;
      margin: 0;
      padding: 0;
      line-height: 1.45;
    }
    .invoice {
      max-width: 210mm;
      margin: 0 auto;
      border: 1px solid #e2e8f0;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 20px 24px;
      background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
      color: #fff;
    }
    .header h1 {
      margin: 0 0 4px;
      font-size: 22pt;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    .header .seller {
      font-size: 10pt;
      opacity: 0.95;
    }
    .header .meta {
      text-align: ${dir === 'rtl' ? 'left' : 'right'};
      font-size: 10pt;
    }
    .header .meta .badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 4px 10px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 9pt;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .parties {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      padding: 20px 24px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    .party h2 {
      margin: 0 0 10px;
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #64748b;
      font-weight: 700;
    }
    .party p { margin: 0 0 4px; font-size: 10pt; }
    .party .name { font-size: 12pt; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
    table.items {
      width: 100%;
      border-collapse: collapse;
      margin: 0;
    }
    table.items thead th {
      background: #1e293b;
      color: #fff;
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 10px 12px;
      text-align: ${dir === 'rtl' ? 'right' : 'left'};
    }
    table.items thead th.num,
    table.items thead th.money { text-align: center; }
    table.items tbody td {
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 10pt;
      vertical-align: top;
    }
    table.items tbody tr:nth-child(even) { background: #f8fafc; }
    table.items td.num,
    table.items td.money { text-align: center; white-space: nowrap; }
    table.items td.money { font-variant-numeric: tabular-nums; }
    .totals-wrap {
      display: flex;
      justify-content: ${dir === 'rtl' ? 'flex-start' : 'flex-end'};
      padding: 16px 24px 20px;
    }
    .totals {
      width: 280px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }
    .totals .row {
      display: flex;
      justify-content: space-between;
      padding: 10px 16px;
      font-size: 10pt;
      border-bottom: 1px solid #e2e8f0;
    }
    .totals .row.grand {
      background: #1e40af;
      color: #fff;
      font-size: 12pt;
      font-weight: 700;
      border: none;
    }
    .footer {
      padding: 16px 24px 24px;
      border-top: 1px solid #e2e8f0;
      font-size: 9pt;
      color: #64748b;
    }
    .footer .notes { margin-bottom: 12px; }
    .footer strong { color: #334155; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .invoice { border: none; }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="seller">
        <h1>${this.escapeHtml(profile.workshopName)}</h1>
        ${profile.address ? `<div>${this.escapeHtml(profile.address)}</div>` : ''}
        ${profile.city ? `<div>${this.escapeHtml(profile.city)}${profile.country ? ', ' + this.escapeHtml(profile.country) : ''}</div>` : ''}
        ${profile.phone ? `<div>${labels.phone}: ${this.escapeHtml(profile.phone)}</div>` : ''}
        ${profile.email ? `<div>${labels.email}: ${this.escapeHtml(profile.email)}</div>` : ''}
        ${profile.taxNumber ? `<div>${labels.vatNumber}: ${this.escapeHtml(profile.taxNumber)}</div>` : ''}
      </div>
      <div class="meta">
        <div class="badge">${labels.taxInvoice}</div>
        <div><strong>${labels.invoiceNumber}:</strong> ${invoiceNumber}</div>
        <div><strong>${labels.issueDate}:</strong> ${issueDate}</div>
        <div><strong>${labels.dueDate}:</strong> ${dueDate}</div>
        <div><strong>${labels.workOrder}:</strong> WO-${invoice.work_order_id}</div>
      </div>
    </div>

    <div class="parties">
      <div class="party">
        <h2>${labels.from}</h2>
        <p class="name">${this.escapeHtml(profile.workshopName)}</p>
        ${profile.taxNumber ? `<p>${labels.vatNumber}: ${this.escapeHtml(profile.taxNumber)}</p>` : ''}
      </div>
      <div class="party">
        <h2>${labels.billTo}</h2>
        <p class="name">${this.escapeHtml(billToName)}</p>
        ${billToAddress ? `<p>${this.escapeHtml(billToAddress)}</p>` : ''}
        ${car?.plate_number ? `<p>${labels.plate}: ${this.escapeHtml(car.plate_number)}</p>` : ''}
        ${car?.vin ? `<p>${labels.vin}: ${this.escapeHtml(car.vin)}</p>` : ''}
        ${car?.car_model ? `<p>${labels.vehicle}: ${this.escapeHtml(car.car_model)}${car.color ? ' · ' + this.escapeHtml(car.color) : ''}</p>` : ''}
      </div>
    </div>

    <table class="items">
      <thead>
        <tr>
          <th class="num">#</th>
          <th class="desc">${labels.description}</th>
          <th class="num">${labels.qty}</th>
          <th class="money">${labels.unitPrice}</th>
          <th class="money">${labels.amount}</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml || `<tr><td colspan="5" style="text-align:center;padding:20px">${labels.noItems}</td></tr>`}
      </tbody>
    </table>

    <div class="totals-wrap">
      <div class="totals">
        <div class="row"><span>${labels.subtotal}</span><span>${this.formatMoney(subtotal)} ${currency}</span></div>
        ${discount > 0 ? `<div class="row"><span>${this.escapeHtml(discountLabel)}</span><span>−${this.formatMoney(discount)} ${currency}</span></div>` : ''}
        ${discount > 0 ? `<div class="row"><span>${labels.taxableAmount}</span><span>${this.formatMoney(taxable)} ${currency}</span></div>` : ''}
        <div class="row"><span>${labels.vat} (${taxRate}%)</span><span>${this.formatMoney(tax)} ${currency}</span></div>
        <div class="row grand"><span>${labels.totalDue}</span><span>${this.formatMoney(total)} ${currency}</span></div>
      </div>
    </div>

    <div class="footer">
      ${invoiceNotes ? `<div class="notes"><strong>${labels.invoiceNotes}:</strong> ${this.escapeHtml(invoiceNotes)}</div>` : ''}
      <div class="notes"><strong>${labels.paymentTerms}:</strong> ${labels.paymentTermsText}</div>
      <div>${labels.thankYou}</div>
    </div>
  </div>
</body>
</html>`;
  }

  extractLineItems(invoice: Invoice): InvoiceLineItem[] {
    const rawItems = invoice.work_order?.items ?? [];
    const items = Array.isArray(rawItems) ? rawItems : Object.values(rawItems as Record<string, never>);
    if (items.length === 0) {
      return [
        {
          description: 'Service charges',
          quantity: 1,
          unitPrice: this.toNumber(invoice.subtotal),
          amount: this.toNumber(invoice.subtotal),
        },
      ];
    }

    return items.map((item) => {
      const unitPrice = parseFloat(String(item.price)) || 0;
      return {
        description: item.description,
        quantity: 1,
        unitPrice,
        amount: unitPrice,
      };
    });
  }

  private getLabels(lang: 'ar' | 'en'): InvoicePrintLabels {
    if (lang === 'ar') {
      return {
        taxInvoice: 'فاتورة ضريبية',
        invoiceNumber: 'رقم الفاتورة',
        issueDate: 'تاريخ الإصدار',
        dueDate: 'تاريخ الاستحقاق',
        workOrder: 'أمر العمل',
        from: 'من',
        billTo: 'فاتورة إلى',
        phone: 'هاتف',
        email: 'بريد',
        vatNumber: 'الرقم الضريبي',
        plate: 'رقم اللوحة',
        vin: 'رقم الهيكل',
        vehicle: 'المركبة',
        description: 'الوصف',
        qty: 'الكمية',
        unitPrice: 'سعر الوحدة',
        amount: 'المبلغ',
        subtotal: 'المجموع الفرعي',
        discount: 'الحسم',
        taxableAmount: 'المبلغ الخاضع للضريبة',
        vat: 'ضريبة القيمة المضافة',
        invoiceNotes: 'ملاحظات',
        totalDue: 'الإجمالي المستحق',
        paymentTerms: 'شروط الدفع',
        paymentTermsText: 'الدفع مستحق خلال 15 يوماً من تاريخ الفاتورة.',
        thankYou: 'شكراً لتعاملكم معنا.',
        noItems: 'لا توجد بنود',
      };
    }

    return {
      taxInvoice: 'Tax Invoice',
      invoiceNumber: 'Invoice No.',
      issueDate: 'Issue Date',
      dueDate: 'Due Date',
      workOrder: 'Work Order',
      from: 'From',
      billTo: 'Bill To',
      phone: 'Phone',
      email: 'Email',
      vatNumber: 'VAT / TRN',
      plate: 'Plate',
      vin: 'VIN',
      vehicle: 'Vehicle',
      description: 'Description',
      qty: 'Qty',
      unitPrice: 'Unit Price',
      amount: 'Amount',
      subtotal: 'Subtotal',
      discount: 'Discount',
      taxableAmount: 'Taxable amount',
      vat: 'VAT',
      invoiceNotes: 'Notes',
      totalDue: 'Total Due',
      paymentTerms: 'Payment Terms',
      paymentTermsText: 'Payment is due within 15 days of the invoice date.',
      thankYou: 'Thank you for your business.',
      noItems: 'No line items',
    };
  }

  private formatInvoiceNumber(id: number): string {
    const year = new Date().getFullYear();
    if (id <= 0) {
      return `INV-${year}-DRAFT`;
    }
    return `INV-${year}-${String(id).padStart(5, '0')}`;
  }

  private formatDate(value: string | undefined, lang: 'ar' | 'en'): string {
    if (!value) {
      return '—';
    }
    return new Date(value).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private formatDueDate(value: string | undefined, lang: 'ar' | 'en'): string {
    const base = value ? new Date(value) : new Date();
    base.setDate(base.getDate() + 15);
    return base.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private formatMoney(value: number): string {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  private toNumber(value: string | number): number {
    return parseFloat(String(value)) || 0;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
