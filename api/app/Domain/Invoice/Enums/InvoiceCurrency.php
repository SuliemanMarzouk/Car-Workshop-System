<?php

namespace App\Domain\Invoice\Enums;

enum InvoiceCurrency: string
{
    case Usd = 'USD';
    case Sar = 'SAR';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
