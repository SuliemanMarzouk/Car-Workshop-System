<?php

declare(strict_types=1);

namespace App\Application\Invoice\Services;

use App\Application\Contracts\Repositories\SettingRepositoryInterface;
use App\Domain\Invoice\Enums\InvoiceDiscountType;
use App\Infrastructure\Persistence\Eloquent\Models\WorkOrder;
use InvalidArgumentException;

class InvoiceTotalsCalculator
{
    public function __construct(
        private readonly SettingRepositoryInterface $settings,
    ) {}

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
        float $exchangeRate = 1.0,
    ): array {
        $workOrder->loadMissing('items');

        if ($workOrder->items->isEmpty()) {
            throw new InvalidArgumentException(__('Work order has no billable line items.'));
        }

        $rate = max((float) $exchangeRate, 0.000001);
        $vatRate = $this->settings->vatRate();

        $subtotalBase = round(
            (float) $workOrder->items->sum(fn ($item) => (float) $item->price),
            2,
        );

        $discountBase = $this->resolveDiscountAmount(
            $subtotalBase,
            $discountType,
            $discountValue,
            $rate,
        );

        $taxableBase = round($subtotalBase - $discountBase, 2);
        $taxBase = round($taxableBase * $vatRate, 2);
        $totalBase = round($taxableBase + $taxBase, 2);

        return [
            'subtotal' => round($subtotalBase * $rate, 2),
            'discount_amount' => round($discountBase * $rate, 2),
            'taxable_amount' => round($taxableBase * $rate, 2),
            'tax' => round($taxBase * $rate, 2),
            'total' => round($totalBase * $rate, 2),
        ];
    }

    public function resolveDiscountAmount(
        float $subtotal,
        string $discountType,
        float $discountValue,
        float $exchangeRate = 1.0,
    ): float {
        if ($discountValue <= 0 || $subtotal <= 0) {
            return 0.0;
        }

        $rate = max((float) $exchangeRate, 0.000001);
        $type = InvoiceDiscountType::tryFrom($discountType) ?? InvoiceDiscountType::Amount;

        if ($type === InvoiceDiscountType::Percent) {
            $percent = min(max($discountValue, 0), 100);

            return round(min($subtotal * $percent / 100, $subtotal), 2);
        }

        $discountBase = round($discountValue / $rate, 2);

        return round(min(max($discountBase, 0), $subtotal), 2);
    }
}
