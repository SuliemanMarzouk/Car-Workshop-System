<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Invoice\Actions\CreateInvoiceAction;
use App\Application\Invoice\Actions\GetInvoiceAction;
use App\Application\Invoice\Actions\ListInvoicesAction;
use App\Application\Invoice\Data\CreateInvoiceData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Invoice\StoreInvoiceRequest;
use App\Http\Resources\InvoiceResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class InvoiceController extends Controller
{
    public function index(ListInvoicesAction $action): AnonymousResourceCollection
    {
        return InvoiceResource::collection($action->execute());
    }

    public function store(StoreInvoiceRequest $request, CreateInvoiceAction $action): InvoiceResource
    {
        $invoice = $action->execute(CreateInvoiceData::fromValidated($request->validated()));

        return new InvoiceResource($invoice);
    }

    public function show(int $invoice, GetInvoiceAction $action): InvoiceResource
    {
        return new InvoiceResource($action->execute($invoice));
    }
}
