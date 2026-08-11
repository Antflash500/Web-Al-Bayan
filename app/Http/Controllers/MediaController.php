<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function programImage(string $path): Response
    {
        $key = 'program:programs/'.$path;
        $bytes = $this->fromRedis($key);

        if ($bytes === null) {
            $disk = Storage::disk('public');
            $relative = 'programs/'.$path;

            if (! $disk->exists($relative)) {
                return new Response('Not Found', 404);
            }

            $bytes = $disk->get($relative);
            $this->toRedis($key, $bytes);
        }

        return new Response((string) $bytes, 200, [
            'Content-Type' => $this->mimeFor($path),
            'Cache-Control' => 'public, max-age=2592000',
        ]);
    }

    public function buktiImage(string $path): Response
    {
        $key = 'bukti:bukti/'.$path;
        $bytes = $this->fromRedis($key);

        if ($bytes === null) {
            $disk = Storage::disk('public');
            $relative = 'bukti/'.$path;

            if (! $disk->exists($relative)) {
                return new Response('Not Found', 404);
            }

            $bytes = $disk->get($relative);
            $this->toRedis($key, $bytes);
        }

        return new Response((string) $bytes, 200, [
            'Content-Type' => $this->mimeFor($path),
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    private function fromRedis(string $key): ?string
    {
        try {
            $value = Redis::get($key);

            return $value === null || $value === false ? null : (string) $value;
        } catch (\Throwable $e) {
            report($e);

            return null;
        }
    }

    private function toRedis(string $key, string $bytes): void
    {
        try {
            Redis::setex($key, 30 * 24 * 3600, $bytes);
        } catch (\Throwable $e) {
            report($e);
        }
    }

    private function mimeFor(string $path): string
    {
        return match (strtolower(pathinfo($path, PATHINFO_EXTENSION))) {
            'png' => 'image/png',
            'webp' => 'image/webp',
            'gif' => 'image/gif',
            default => 'image/jpeg',
        };
    }
}
