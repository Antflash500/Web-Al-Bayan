<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Services\PembayaranService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function __construct(private readonly PembayaranService $pembayaranService) {}

    public function handlePayment(Request $request)
    {
        $signature = $request->header('X-Signature') ?? '';
        $expectedSignature = hash_hmac(
            'sha256',
            $request->getContent(),
            config('services.payment_webhook_secret', 'albayan-webhook-key')
        );

        if (! hash_equals($expectedSignature, $signature)) {
            Log::warning('Webhook signature mismatch', [
                'ip' => $request->ip(),
                'path' => $request->path(),
            ]);

            return response()->json(['status' => 'error', 'message' => 'Invalid signature'], 403);
        }

        $action = $request->input('action', 'status_update');
        $kodeTransaksi = $request->input('kode_transaksi');
        $newStatus = $request->input('status');

        if (! $kodeTransaksi) {
            return response()->json(['status' => 'error', 'message' => 'kode_transaksi required'], 400);
        }

        $transaksi = Transaksi::where('kode_transaksi', $kodeTransaksi)->first();

        if (! $transaksi) {
            return response()->json(['status' => 'error', 'message' => 'Transaction not found'], 404);
        }

        if ($action === 'cancel' || $newStatus === 'cancelled') {
            $this->pembayaranService->cancelPayment($transaksi);
        }

        if ($newStatus === 'paid' || $action === 'verify_paid') {
            $transaksi = $this->pembayaranService->processPaymentSuccess($kodeTransaksi);
        }

        return response()->json([
            'status' => 'success',
            'kode_transaksi' => $transaksi->kode_transaksi,
            'transaction_status' => $transaksi->status,
        ]);
    }
}
