<?php

namespace App\Domain\Invoice\Enums;

enum InvoiceDiscountType: string
{
    case Amount = 'amount';
    case Percent = 'percent';
}
