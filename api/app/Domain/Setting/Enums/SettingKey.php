<?php

declare(strict_types=1);

namespace App\Domain\Setting\Enums;

enum SettingKey: string
{
    case WorkshopName = 'workshop_name';
    case LogoDataUrl = 'logo_data_url';
    case Address = 'address';
    case City = 'city';
    case Country = 'country';
    case Phone = 'phone';
    case Email = 'email';
    case TaxNumber = 'tax_number';
    case DefaultCurrency = 'default_currency';
    case VatRate = 'vat_rate';
    case EmailNotifications = 'email_notifications';
    case SmsNotifications = 'sms_notifications';

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
