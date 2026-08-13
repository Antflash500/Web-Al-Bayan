<?php

namespace App\Support;

class AgentParser
{
    public static function parse(?string $userAgent): array
    {
        $browser = self::browser((string) $userAgent);
        $os = self::os((string) $userAgent);

        return [
            'browser' => $browser,
            'sistem_operasi' => $os,
        ];
    }

    private static function browser(string $ua): string
    {
        if ($ua === '') {
            return 'Unknown';
        }

        $ua = strtolower($ua);

        if (str_contains($ua, 'edg/')) {
            return 'Microsoft Edge';
        }
        if (str_contains($ua, 'opr/')) {
            return 'Opera';
        }
        if (str_contains($ua, 'samsungbrowser')) {
            return 'Samsung Internet';
        }
        if (str_contains($ua, 'firefox/') || str_contains($ua, 'fxios')) {
            return 'Firefox';
        }
        if (str_contains($ua, 'chromium')) {
            return 'Chromium';
        }
        if (str_contains($ua, 'chrome')) {
            return 'Chrome';
        }
        if (str_contains($ua, 'safari') || str_contains($ua, 'mobile safari')) {
            return 'Safari';
        }
        if (str_contains($ua, 'bot')) {
            return 'Bot';
        }

        return 'Other';
    }

    private static function os(string $ua): string
    {
        if ($ua === '') {
            return 'Unknown';
        }

        $ua = strtolower($ua);

        $map = [
            'windows nt 10' => 'Windows 10/11',
            'windows nt 6.3' => 'Windows 8.1',
            'windows nt 6.2' => 'Windows 8',
            'windows nt 6.1' => 'Windows 7',
            'windows' => 'Windows',
            'android' => 'Android',
            'iphone' => 'iOS',
            'ipad' => 'iPadOS',
            'mac os x' => 'macOS',
            'linux' => 'Linux',
            'ubuntu' => 'Ubuntu',
        ];

        foreach ($map as $needle => $label) {
            if (str_contains($ua, $needle)) {
                return $label;
            }
        }

        return 'Other';
    }
}
