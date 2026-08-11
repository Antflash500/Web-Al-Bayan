<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RoomUpdated implements ShouldBroadcast
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public int $kamarId;

    public ?string $nomorKamar;

    public int $terisi;

    public int $tersedia;

    public int $totalRanjang;

    public string $action;

    public function __construct(
        int $kamarId,
        ?string $nomorKamar,
        int $terisi,
        int $tersedia,
        int $totalRanjang,
        string $action = 'updated'
    ) {
        $this->kamarId = $kamarId;
        $this->nomorKamar = $nomorKamar;
        $this->terisi = $terisi;
        $this->tersedia = $tersedia;
        $this->totalRanjang = $totalRanjang;
        $this->action = $action;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('admin'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'RoomUpdated';
    }

    public function broadcastWith(): array
    {
        return [
            'kamarId' => $this->kamarId,
            'nomorKamar' => $this->nomorKamar,
            'terisi' => $this->terisi,
            'tersedia' => $this->tersedia,
            'totalRanjang' => $this->totalRanjang,
            'action' => $this->action,
        ];
    }
}
