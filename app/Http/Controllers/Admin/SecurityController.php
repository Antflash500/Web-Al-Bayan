<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SecurityService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SecurityController extends Controller
{
    public function __construct(private readonly SecurityService $security) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Security', [
            'summary' => [...$this->security->summary(), 'online_count' => $this->security->onlineCount()],
            'sessions' => $this->security->activeSessions((string) $request->session()->getId()),
            'serverStatus' => $this->security->serverStatus(),
            'metricsHistory' => $this->security->serverMetricsHistory(),
            'devices' => $this->security->deviceSummary(),
            'threats' => $this->security->threatOverview(),
            'loginHistory' => $this->security->loginHistory(),
            'events' => $this->security->events(),
            'bannedIps' => $this->security->bannedIps(),
            'posture' => $this->security->securityPosture(),
            'portScan' => $request->session()->get('port_scan'),
            'selfTest' => $request->session()->get('self_test'),
        ]);
    }

    public function recordMonitoring(): SymfonyResponse
    {
        $status = $this->security->recordServerMetrics();

        if ($status === null) {
            return back()->with('error', 'Monitoring tidak bisa mencatat snapshot metrik pada platform ini.');
        }

        return back()->with('success', 'Snapshot metrik server berhasil dicatat (disk '.$status['disk_percent'].'%).');
    }

    public function scanPorts(Request $request): SymfonyResponse
    {
        $result = $this->security->scanPorts();

        return back()
            ->with('port_scan', $result)
            ->with('success', "Port scan selesai: {$result['open_count']} port terbuka dari {$result['total']}.");
    }

    public function selfTest(): SymfonyResponse
    {
        $result = $this->security->selfTestFirewall();

        return back()
            ->with('self_test', $result)
            ->with('success', "Self-test WAF selesai: {$result['diblokir']} dari {$result['total']} payload diblokir.");
    }

    public function terminateSession(Request $request): SymfonyResponse
    {
        $data = $request->validate([
            'session_id' => ['required', 'string', 'max:255'],
        ]);

        if ($data['session_id'] === (string) $request->session()->getId()) {
            return back()->with('error', 'Tidak dapat mencabut sesi Anda sendiri dari daftar ini.');
        }

        if (! $this->security->terminateSession($data['session_id'])) {
            return back()->with('error', 'Sesi tidak ditemukan atau driver sesi bukan database.');
        }

        return back()->with('success', 'Sesi perangkat tersebut telah dicabut (force logout).');
    }

    public function terminateOtherSessions(Request $request): SymfonyResponse
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        $count = $this->security->terminateOtherSessions((int) $data['user_id'], (string) $request->session()->getId());

        return back()->with('success', "{$count} sesi lain untuk pengguna tersebut telah dicabut.");
    }

    public function banIp(Request $request): SymfonyResponse
    {
        $data = $request->validate([
            'ip' => ['required', 'ip'],
        ]);

        $this->security->banIp($data['ip']);

        return back()->with('success', "IP {$data['ip']} diban untuk sementara.");
    }

    public function unbanIp(Request $request): SymfonyResponse
    {
        $data = $request->validate([
            'ip' => ['required', 'ip'],
        ]);

        $this->security->unbanIp($data['ip']);

        return back()->with('success', "IP {$data['ip']} dihapus dari daftar banned.");
    }

    public function exportCsv(): StreamedResponse
    {
        $filename = 'security-logs-'.now()->format('Y-m-d-Hi').'.csv';

        return response()->streamDownload(function (): void {
            echo $this->security->exportCsv();
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
