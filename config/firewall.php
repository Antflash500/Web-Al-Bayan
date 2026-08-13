<?php

return [

    /*
    |--------------------------------------------------------------------------
    | IP Routing
    |--------------------------------------------------------------------------
    |
    | allowed_ips:      IP yang selalu lolos dari firewall (opsional).
    | blocked_ips:      IP yang selalu ditolak aksesnya (opsional).
    | admin_allowed_ips: Jika tidak kosong, hanya IP dalam daftar ini yang
    |                     boleh mengakses seluruh area /admin/*. Kosongkan agar
    |                     tidak mengunci akses Anda sendiri.
    |
    | IP dapat berupa alamat tunggal, CIDR (192.168.1.0/24), maupun wildcard
    | parsial (192.168.1.*).
    */

    'allowed_ips' => array_values(array_filter(array_map('trim', explode(',', (string) env('FIREWALL_ALLOWED_IPS', ''))))),
    'blocked_ips' => array_values(array_filter(array_map('trim', explode(',', (string) env('FIREWALL_BLOCKED_IPS', ''))))),
    'admin_allowed_ips' => array_values(array_filter(array_map('trim', explode(',', (string) env('FIREWALL_ADMIN_ALLOWED_IPS', ''))))),

    /*
    |--------------------------------------------------------------------------
    | Throttle / Ban
    |--------------------------------------------------------------------------
    |
    | max_blocked_hits:   Jumlah pelanggaran pola dalam 10 menit sebelum IP diban.
    | ban_minutes:        Durasi ban sementara (menit).
    | failed_login_threshold: Jumlah gagal login dalam 15 menit sebelum IP diban.
    */

    'max_blocked_hits' => (int) env('FIREWALL_MAX_BLOCKED_HITS', 5),
    'ban_minutes' => (int) env('FIREWALL_BAN_MINUTES', 60),
    'failed_login_threshold' => (int) env('FIREWALL_FAILED_LOGIN_THRESHOLD', 8),

    /*
    |--------------------------------------------------------------------------
    | Cache Prefix
    |--------------------------------------------------------------------------
    */

    'cache_prefix' => env('FIREWALL_CACHE_PREFIX', 'sec:fw:'),
    'ban_cache_prefix' => env('FIREWALL_BAN_PREFIX', 'sec:ban:'),

    /*
    |--------------------------------------------------------------------------
    | Batas Panjang Input yang Dipindai
    |--------------------------------------------------------------------------
    |
    | Nilai input yang lebih panjang dari ini tidak dipindai untuk mencegah
    | abuse melalui payload raksasa (protection DoS pada lapisan pindai).
    */

    'max_input_scan_length' => (int) env('FIREWALL_MAX_SCAN_LENGTH', 4096),

    /*
    |--------------------------------------------------------------------------
    | Pola URI (path + query string)
    |--------------------------------------------------------------------------
    */

    'uri_patterns' => [
        'sqli-union' => '/\bunion\s+(?:all\s+)?select\b/i',
        'sqli-crud' => '/\b(?:select|insert|update|delete|drop|alter|create|truncate|grant)\b.{0,40}\b(?:from|into|table|database|user|view)\b/i',
        'sqli-time' => '/\b(?:sleep|benchmark|pg_sleep|waitfor)\s*\(/i',
        'sqli-enum' => '/\b(?:information_schema|performance_schema|xp_cmdshell|@@version|@@datadir|@@hostname)\b/i',
        'sqli-hex' => '/\b0x[0-9a-fA-F]{6,}\b/i',
        'xss-tag' => '/<(?:script|iframe|object|embed|applet)\b/i',
        'xss-js' => '/\bjavascript\s*:/i',
        'xss-event' => '/\bon(?:error|load|click|mouseover|focus|blur|submit|change)\s*=/i',
        'xss-doc' => '/\bdocument\s*\.\s*(?:cookie|write|location|domain)\b/i',
        'traversal' => '/(?:\.\.\/|\.\.\\\\)/',
        'traversal-encode' => '/%2e%2e(?:%2f|%5c|\/)/i',
        'crlf' => '/%0d%0a|%0a|%0d/i',
        'nullbyte' => '/%00/i',
        'cmd-inject' => '/\b(?:wget|curl|powershell|cmd|nc\s+-e|netcat|/bin/sh|/bin/bash)\b/i',
        'php-globals' => '/\b(?:$_GET|$_POST|$_COOKIE|$_SERVER|$_REQUEST|GLOBALS\s*\[|__globals__)\b/i',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pola Body / Form (lebih sempit agar tidak memblokir konten sah)
    |--------------------------------------------------------------------------
    */

    'body_patterns' => [
        'xss-tag' => '/<\s*(?:script|iframe|object|embed)\b/i',
        'xss-js' => '/\bjavascript\s*:/i',
        'xss-event' => '/\bon(?:error|load|mouseover|focus|blur)\s*=/i',
        'xss-doc' => '/\b(?:document\.cookie|document\.write|eval\s*\()/i',
        'sqli-union' => '/\bunion\s+(?:all\s+)?select\b/i',
        'sqli-crud' => '/\b(?:select|insert|update|delete|drop)\s+(?:\*|[a-z_]+)\s+from\s+/i',
        'sqli-time' => '/\b(?:sleep|benchmark|pg_sleep|waitfor)\s*\(/i',
        'sqli-enum' => '/\b(?:information_schema|xp_cmdshell|@@version)\b/i',
        'sqli-hex' => '/\b0x[0-9a-fA-F]{6,}\b/i',
        'proto-pollution' => '/(?:__proto__|constructor\[\s*["\']prototype|__stringify)/i',
        'crlf-null' => '/%0d%0a|%00/i',
    ],

    /*
    |--------------------------------------------------------------------------
    | User-Agent Scanner
    |--------------------------------------------------------------------------
    */

    'bad_user_agents' => [
        'sqlmap',
        'nikto',
        'nessus',
        'acunetix',
        'openvas',
        'metasploit',
        'masscan',
        'zgrab',
        'dirbuster',
        'gobuster',
        'wpscan',
        'joomscan',
        'arachni',
        'skipfish',
        'hydra',
        'ffuf',
        'nuclei',
        'w3af',
        'wafw00f',
        'sqliv',
        'havij',
        'wascan',
        'netsparker',
        'netsparker Cloud',
    ],
];