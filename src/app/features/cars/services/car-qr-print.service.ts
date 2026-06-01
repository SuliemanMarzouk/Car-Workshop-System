import { inject, Injectable } from '@angular/core';
import QRCode from 'qrcode';
import { resolveWorkshopLogo, WORKSHOP_BRAND } from '@core/workshop/workshop-brand';
import { WorkshopProfileService } from '@core/workshop/workshop-profile.service';
import { Car } from '@features/cars/models/car.model';
import { CarQrPrintContext, CarQrPrintLabels } from '@features/cars/models/car-qr.model';

/** Portrait card 3″ × 4″ (76.2 × 101.6 mm). */
const CARD_WIDTH_MM = '76.2mm';
const CARD_HEIGHT_MM = '101.6mm';

const QR_OPTIONS = {
  errorCorrectionLevel: 'H' as const,
  margin: 1,
  color: { dark: '#0f172a', light: '#ffffff' },
};

const PHONE_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="10" height="10" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.25 1.01l-2.2 2.22z"/></svg>`;

@Injectable({ providedIn: 'root' })
export class CarQrPrintService {
  private readonly profileService = inject(WorkshopProfileService);

  buildScanUrl(carId: number): string {
    const origin =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : '';
    return `${origin}/cars?vehicle=${carId}`;
  }

  async buildPrintDocument(context: CarQrPrintContext): Promise<string> {
    const qrDataUrl = await QRCode.toDataURL(context.scanUrl, {
      ...QR_OPTIONS,
      width: 600,
    });
    return this.wrapDocument(this.buildCardHtml({ ...context, qrDataUrl }), context.lang);
  }

  async print(car: Car, labels: CarQrPrintLabels, lang: 'ar' | 'en'): Promise<void> {
    const html = await this.buildPrintDocument(this.createContext(car, labels, lang));
    if (!this.printWithIframe(html)) {
      this.printWithBlobWindow(html);
    }
  }

  createContext(car: Car, labels: CarQrPrintLabels, lang: 'ar' | 'en'): CarQrPrintContext {
    const profile = this.profileService.getProfile();
    return {
      car,
      labels,
      workshopName: profile.workshopName?.trim() || (lang === 'ar' ? 'ورشة السيارات' : 'Car Workshop'),
      workshopPhone: this.formatPhone(profile.phone?.trim() || '—'),
      logoDataUrl: resolveWorkshopLogo(profile.logoDataUrl),
      lang,
      scanUrl: this.buildScanUrl(car.id),
    };
  }

  private formatPhone(phone: string): string {
    if (phone === '—') {
      return phone;
    }
    const digits = phone.replace(/\s+/g, '');
    if (digits.length >= 10 && digits.startsWith('0')) {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`.trim();
    }
    return phone;
  }

  private buildCardHtml(ctx: CarQrPrintContext & { qrDataUrl: string }): string {
    const { car, labels, workshopName, workshopPhone, logoDataUrl, qrDataUrl, lang } = ctx;
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    const langClass = lang === 'ar' ? 'lang-ar' : 'lang-en';

    return `
      <article class="card ${langClass}" dir="${dir}">
        <header class="card-header">
          <div class="logo-wrap">
            <img src="${this.escape(logoDataUrl)}" alt="" class="logo" />
          </div>
          <div class="header-copy">
            <p class="workshop-name">${this.escape(workshopName)}</p>
            <p class="card-title">${this.escape(labels.cardTitle)}</p>
          </div>
        </header>
        <section class="zone-qr" aria-label="QR">
          <div class="qr-card">
            <div class="qr-frame">
              <img src="${qrDataUrl}" alt="QR" class="qr" />
            </div>
          </div>
          <p class="scan-hint">${this.escape(labels.scanHint)}</p>
        </section>
        <footer class="zone-info">
          <div class="info-grid">
            <div class="info-cell info-cell--phone">
              <span class="info-key">${this.escape(labels.companyPhone)}</span>
              <span class="info-val info-val--phone">
                ${PHONE_ICON_SVG}
                <span dir="ltr">${this.escape(workshopPhone)}</span>
              </span>
            </div>
            <div class="info-cell">
              <span class="info-key">${this.escape(labels.plate)}</span>
              <span class="info-val info-val--plate">${this.escape(car.plate_number)}</span>
            </div>
            <div class="info-cell">
              <span class="info-key">${this.escape(labels.vin)}</span>
              <span class="info-val info-val--vin mono">${this.escape(car.vin)}</span>
            </div>
          </div>
        </footer>
      </article>`;
  }

  private wrapDocument(body: string, lang: 'ar' | 'en'): string {
    const fontAr = "'Segoe UI', 'Tahoma', 'Arial', sans-serif";
    const fontEn = "'Segoe UI', system-ui, -apple-system, sans-serif";
    const b = WORKSHOP_BRAND;

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>QR</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: ${CARD_WIDTH_MM} ${CARD_HEIGHT_MM}; margin: 0; }
    html, body {
      width: ${CARD_WIDTH_MM};
      height: ${CARD_HEIGHT_MM};
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      background: #fff;
      font-family: ${lang === 'ar' ? fontAr : fontEn};
    }
    .card {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-rows: auto 2fr 1fr;
      overflow: hidden;
      border-radius: 2mm;
      border: 0.3mm solid ${b.primaryDeep};
      background: #fff;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 2.5mm;
      padding: 2mm 3mm;
      min-height: 11mm;
      background: ${b.gradient};
      color: ${b.onPrimary};
    }
    .logo-wrap {
      flex: 0 0 8mm;
      width: 8mm;
      height: 8mm;
      border-radius: 1.8mm;
      background: rgba(255,255,255,0.22);
      border: 0.2mm solid rgba(255,255,255,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .logo {
      max-width: 6.5mm;
      max-height: 6.5mm;
      width: auto;
      height: auto;
      object-fit: contain;
    }
    .header-copy { flex: 1; min-width: 0; }
    .workshop-name {
      font-size: 8pt;
      font-weight: 800;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .card-title {
      font-size: 6pt;
      font-weight: 600;
      line-height: 1.25;
      margin-top: 0.4mm;
      opacity: 0.92;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .lang-en .card-title {
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .zone-qr {
      min-height: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2mm 4mm 1.5mm;
      background: linear-gradient(165deg, ${b.soft} 0%, #fff 55%, ${b.soft} 100%);
    }
    .qr-card {
      position: relative;
      flex: 1;
      width: 100%;
      max-width: 58mm;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qr-frame {
      width: min(100%, 54mm);
      aspect-ratio: 1;
      padding: 1.8mm;
      background: #fff;
      border-radius: 1.8mm;
      border: 0.3mm solid ${b.primary};
      box-shadow: 0 1mm 2.5mm rgba(29, 78, 216, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qr {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
    .scan-hint {
      flex: 0 0 auto;
      margin-top: 1.2mm;
      font-size: 5.5pt;
      font-weight: 600;
      color: ${b.primaryDeep};
      text-align: center;
      line-height: 1.2;
      max-width: 100%;
    }
    .zone-info {
      min-height: 0;
      padding: 2mm 2.5mm 2.2mm;
      background: ${b.footerGradient};
      color: ${b.onDark};
      display: flex;
      align-items: center;
    }
    .info-grid {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.2mm 2mm;
      align-items: stretch;
    }
    .info-cell {
      background: rgba(255,255,255,0.1);
      border: 0.15mm solid rgba(255,255,255,0.22);
      border-radius: 1.2mm;
      padding: 1mm 1.5mm;
      text-align: center;
      min-width: 0;
    }
    .info-cell--phone { grid-column: 1 / -1; }
    .info-cell--vin { grid-column: 1 / -1; }
    .info-key {
      display: block;
      font-size: 4.8pt;
      font-weight: 600;
      color: ${b.mutedOnDark};
      margin-bottom: 0.4mm;
      line-height: 1.1;
    }
    .info-val {
      display: block;
      line-height: 1.2;
      color: #fff;
    }
    .info-val--phone {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 1mm;
      font-size: 8pt;
      font-weight: 700;
      width: 100%;
    }
    .info-val--phone svg { flex-shrink: 0; opacity: 0.9; }
    .info-val--plate {
      font-size: 9.5pt;
      font-weight: 800;
      letter-spacing: 0.06em;
    }
    .info-val--vin {
      font-size: 5.2pt;
      font-weight: 500;
      word-break: break-all;
      hyphens: auto;
      color: #e2e8f0;
    }
    .mono { font-family: 'Consolas', 'Courier New', monospace; letter-spacing: 0.02em; }
    @media print {
      html, body { margin: 0; overflow: hidden; }
      .card { border-radius: 0; }
    }
  </style>
</head>
<body>${body}</body>
</html>`;
  }

  private escape(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private printWithIframe(html: string): boolean {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('title', 'Car QR print');
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
      void this.whenImagesReady(frameDoc).then(() => {
        try {
          frameWindow.focus();
          frameWindow.print();
        } finally {
          window.setTimeout(() => iframe.remove(), 1500);
        }
      });
    };

    if (frameDoc.readyState === 'complete') {
      window.setTimeout(runPrint, 300);
    } else {
      iframe.onload = () => window.setTimeout(runPrint, 300);
    }

    return true;
  }

  private printWithBlobWindow(html: string): void {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) {
      URL.revokeObjectURL(url);
      return;
    }
    win.onload = () => {
      void this.whenImagesReady(win.document).then(() => {
        win.focus();
        win.print();
        URL.revokeObjectURL(url);
      });
    };
  }

  private whenImagesReady(doc: Document): Promise<void> {
    const images = Array.from(doc.querySelectorAll('img'));
    if (images.length === 0) {
      return Promise.resolve();
    }
    return Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalWidth > 0) {
              resolve();
              return;
            }
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }),
      ),
    ).then(() => undefined);
  }
}
