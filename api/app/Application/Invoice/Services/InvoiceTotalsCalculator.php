<?php

namespace App\Application\Invoice\Services;

use App\Domain\Invoice\Enums\InvoiceDiscountType;
use App\Infrastructure\Persistence\Eloquent\Models\WorkOrder;
use InvalidArgumentException;

class InvoiceTotalsCalculator
{
    public const VAT_RATE = 0.15;

    /**
     * @return array{
     *     subtotal: float,
     *     discount_amount: float,
     *     taxable_amount: float,
     *     tax: float,
     *     total: float
     * }
     */
    public function fromWorkOrder(
        WorkOrder $workOrder,
        string $discountType = 'amount',
        float $discountValue = 0,
    ): array {
        $workOrder->loadMissing('items');

        if ($workOrder->items->isEmpty()) {
            throw new InvalidArgumentException(__('Work order has no billable line items.'));
        }

        $subtotal = round(
            (float) $workOrder->items->sum(fn ($item) => (float) $item->price),
            2,
        );

        $discount = $this->resolveDiscountAmount($subtotal, $discountType, $discountValue);
        $taxable = round($subtotal - $discount, 2);
        $tax = round($taxable * self::VAT_RATE, 2);
        $total = round($taxable + $tax, 2);

        return [
            'subtotal' => $subtotal,
            'discount_amount' => $discount,
            'taxable_amount' => $taxable,
            'tax' => $tax,
            'total' => $total,
        ];
    }

    public function resolveDiscountAmount(float $subtotal, string $discountType, float $discountValue): float
    {
        if ($discountValue <= 0 || $subtotal <= 0) {
            return 0.0;
        }

        $type = InvoiceDiscountType::tryFrom($discountType) ?? InvoiceDiscountType::Amount;

        if ($type === InvoiceDiscountType::Percent) {
            $percent = min(max($discountValue, 0), 100);

            return round(min($subtotal * $percent / 100, $subtotal), 2);
        }

        return round(min(max($discountValue, 0), $subtotal), 2);
    }
}
