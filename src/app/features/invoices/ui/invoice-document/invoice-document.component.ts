import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@core/i18n/language.service';
import { CurrencyService } from '@core/currency/currency.service';
import { WorkshopProfileService } from '@core/workshop/workshop-profile.service';
import { Invoice } from '@features/invoices/models/invoice.model';
import { InvoicePrintService } from '@features/invoices/services/invoice-print.service';
import { InvoiceBillingService } from '@features/invoices/services/invoice-billing.service';

@Component({
  selector: 'app-invoice-document',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './invoice-document.component.html',
  styleUrl: './invoice-document.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class InvoiceDocumentComponent {
  @Input({ required: true }) invoice!: Invoice;
  @Input() isDraft = false;
  @Input() compact = false;

  private readonly printService = inject(InvoicePrintService);
  private readonly billing = inject(InvoiceBillingService);
  private readonly profileService = inject(WorkshopProfileService);
  readonly currencyService = inject(CurrencyService);
  private readonly translate = inject(TranslateService);
  readonly language = inject(LanguageService);

  get profile() {
    return this.profileService.getProfile();
  }

  get currencyCode() {
    return this.currencyService.resolveInvoiceCurrency(this.invoice);
  }

  get currency(): string {
    return this.currencyService.symbol(this.currencyCode);
  }

  get lineItems() {
    return this.printService.extractLineItems(this.invoice);
  }

  get invoiceNumber(): string {
    return this.billing.formatInvoiceNumber(this.invoice.id, this.isDraft);
  }

  get billToName(): string {
    return (
      this.invoice.bill_to_name?.trim() ||
      this.invoice.work_order?.car?.owner_name?.trim() ||
      '—'
    );
  }

  get billToAddress(): string | null {
    const address = this.invoice.bill_to_address?.trim();
    return address || null;
  }

  get subtotal(): number {
    return parseFloat(String(this.invoice.subtotal)) || 0;
  }

  get discount(): number {
    return parseFloat(String(this.invoice.discount_amount)) || 0;
  }

  get discountLabel(): string {
    return this.billing.formatDiscountLabel(
      this.invoice,
      this.translate.instant('invoice.template.discount'),
      this.language.language(),
    );
  }

  get taxable(): number {
    return Math.max(this.subtotal - this.discount, 0);
  }

  get tax(): number {
    return parseFloat(String(this.invoice.tax)) || 0;
  }

  get total(): number {
    return parseFloat(String(this.invoice.total)) || 0;
  }

  get showExchangeNote(): boolean {
    const rate = this.billing.exchangeRateValue(this.invoice.exchange_rate);
    const base = this.invoice.base_currency ?? this.currencyService.systemCurrency();
    return this.currencyCode !== base || Math.abs(rate - 1) > 0.0001;
  }

  get exchangeRate(): number {
    return this.billing.exchangeRateValue(this.invoice.exchange_rate);
  }

  get baseCurrencyCode(): string {
    return this.invoice.base_currency ?? this.currencyService.systemCurrency();
  }

  get taxRate(): number {
    return this.taxable > 0
      ? Math.round((this.tax / this.taxable) * 10000) / 100
      : this.billing.vatRate() * 100;
  }

  get invoiceNotes(): string | null {
    const notes = this.invoice.notes?.trim();
    return notes || null;
  }

  formatMoney(value: number): string {
    return this.currencyService.formatAmount(value, this.currencyCode);
  }

  formatDate(value: string | undefined): string {
    if (!value) {
      return '—';
    }
    const lang = this.language.language();
    return new Date(value).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  dueDate(value: string | undefined): string {
    const base = value ? new Date(value) : new Date();
    base.setDate(base.getDate() + this.billing.paymentTermDays);
    return this.formatDate(base.toISOString());
  }
}
