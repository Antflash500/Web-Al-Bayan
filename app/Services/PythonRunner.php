<?php

namespace App\Services;

class PythonRunner
{
    private static ?string $binaryCache = null;

    /**
     * Mendeteksi binary Python yang tersedia dan punya PIL terpasang.
     * Nilai dari env (KWITANSI_PYTHON / PYTHON_BINARY) tetap divalidasi
     * terlebih dahulu — kalau path itu tidak bisa dipakai (mis. path Windows
     * yang dibawa ke server Linux), otomatis jatuh ke deteksi sistem.
     */
    public function binary(): string
    {
        if (self::$binaryCache !== null) {
            return self::$binaryCache;
        }

        $configured = [];
        foreach ([config('services.python.binary'), config('services.kwitansi.python')] as $candidate) {
            if (is_string($candidate) && $candidate !== '') {
                $configured[] = $candidate;
            }
        }

        foreach (array_unique($configured) as $candidate) {
            if ($this->works($candidate)) {
                return self::$binaryCache = $candidate;
            }
        }

        $candidates = [];

        if (PHP_OS_FAMILY === 'Windows') {
            $local = getenv('LOCALAPPDATA') ?: '';

            if ($local !== '') {
                $storeBin = $local.'\\Microsoft\\WindowsApps';
                $candidates = array_merge($candidates, glob($storeBin.'\\PythonSoftwareFoundation.Python.*_*'.DIRECTORY_SEPARATOR.'python.exe') ?: []);
                $candidates = array_merge($candidates, glob($local.'\\Programs\\Python\\Python3*'.DIRECTORY_SEPARATOR.'python.exe') ?: []);
            }

            // Environment-independent fallback (web server may not export LOCALAPPDATA).
            $candidates = array_merge($candidates, glob('C:\\Users\\*\\AppData\\Local\\Microsoft\\WindowsApps\\PythonSoftwareFoundation.Python.*_*'.DIRECTORY_SEPARATOR.'python.exe') ?: []);
            $candidates = array_merge($candidates, glob('C:\\Users\\*\\AppData\\Local\\Programs\\Python\\Python3*'.DIRECTORY_SEPARATOR.'python.exe') ?: []);

            $candidates[] = 'C:\\Python\\python.exe';
            $candidates[] = 'python';
        } else {
            $candidates[] = 'python3';
            $candidates[] = 'python';
        }

        foreach ($candidates as $candidate) {
            if ($this->works($candidate)) {
                return self::$binaryCache = $candidate;
            }
        }

        return self::$binaryCache = 'python';
    }

    private function works(string $binary): bool
    {
        try {
            $result = $this->run([$binary, '-c', 'import PIL; print(1)'], 15);

            return $result['code'] === 0;
        } catch (\Throwable) {
            return false;
        }
    }

    /**
     * Menjalankan subproses via proc_open (argv array) agar Windows tidak
     * meneruskan perintah melalui cmd.exe (yang merusak alias Python Store
     * dan lokasi site-packages). Menghindari Symfony Process.
     *
     * @param  array<int,string>  $argv
     * @return array{code:int,out:string,err:string}
     */
    public function run(array $argv, int $timeout = 60): array
    {
        $pipes = [0 => ['pipe', 'r'], 1 => ['pipe', 'w'], 2 => ['pipe', 'w']];
        $proc = proc_open($argv, $pipes, $p, base_path());

        if (! is_resource($proc)) {
            throw new \RuntimeException('Tidak dapat menjalankan Python (proc_open gagal).');
        }

        fclose($p[0]);

        stream_set_blocking($p[1], false);
        stream_set_blocking($p[2], false);

        $out = '';
        $err = '';
        $start = microtime(true);

        while (true) {
            $out .= stream_get_contents($p[1]);
            $err .= stream_get_contents($p[2]);

            $status = proc_get_status($proc);

            if (! $status['running']) {
                break;
            }

            if ((microtime(true) - $start) > $timeout) {
                proc_terminate($proc);
                fclose($p[1]);
                fclose($p[2]);
                proc_close($proc);

                throw new \RuntimeException('Python tidak merespons (timeout '.$timeout.' detik).');
            }

            usleep(100_000);
        }

        $out .= stream_get_contents($p[1]);
        $err .= stream_get_contents($p[2]);
        fclose($p[1]);
        fclose($p[2]);
        proc_close($proc);

        return [
            'code' => (int) ($status['exitcode'] ?? 1),
            'out' => $out,
            'err' => $err,
        ];
    }
}