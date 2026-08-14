<?php
session_start();

$password = 'albayan12345';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    if ($_POST['password'] === $password) {
        $_SESSION['logged_in'] = true;
    } else {
        $error = 'Password salah';
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
    exit;
}

if (!isset($_SESSION['logged_in'])) {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>FTP Manager</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #1a1a2e; color: #eee; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
            .login-box { background: #16213e; padding: 40px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); width: 100%; max-width: 400px; }
            h2 { text-align: center; margin-bottom: 25px; color: #e94560; }
            input[type="password"] { width: 100%; padding: 12px; border: 2px solid #0f3460; border-radius: 8px; background: #1a1a2e; color: #eee; font-size: 14px; margin-bottom: 15px; outline: none; }
            input[type="password"]:focus { border-color: #e94560; }
            button { width: 100%; padding: 12px; background: #e94560; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; transition: 0.3s; }
            button:hover { background: #c73e54; }
            .error { color: #ff6b6b; text-align: center; margin-top: 15px; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="login-box">
            <h2>FTP Manager</h2>
            <form method="POST">
                <input type="password" name="password" placeholder="Masukkan password" required autofocus>
                <button type="submit" name="login">Masuk</button>
            </form>
            <?php if (isset($error)) echo "<div class='error'>$error</div>"; ?>
        </div>
    </body>
    </html>
    <?php
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['connect'])) {
    $_SESSION['ftp_host'] = $_POST['ftp_host'];
    $_SESSION['ftp_user'] = $_POST['ftp_user'];
    $_SESSION['ftp_pass'] = $_POST['ftp_pass'];
    $_SESSION['ftp_port'] = $_POST['ftp_port'] ?: 21;
    $_SESSION['ftp_root'] = $_POST['ftp_root'];
    $_SESSION['ftp_passive'] = isset($_POST['ftp_passive']);
}

if (isset($_POST['disconnect'])) {
    unset($_SESSION['ftp_host'], $_SESSION['ftp_user'], $_SESSION['ftp_pass'], $_SESSION['ftp_port'], $_SESSION['ftp_root'], $_SESSION['ftp_passive']);
    $status = 'Disconnected';
}

function ftp_connect_and_login() {
    if (!isset($_SESSION['ftp_host'], $_SESSION['ftp_user'], $_SESSION['ftp_pass'])) return false;
    $conn = ftp_connect($_SESSION['ftp_host'], $_SESSION['ftp_port'], 10);
    if (!$conn) return false;
    if (!ftp_login($conn, $_SESSION['ftp_user'], $_SESSION['ftp_pass'])) {
        ftp_close($conn);
        return false;
    }
    if (isset($_SESSION['ftp_passive'])) {
        ftp_pasv($conn, true);
    }
    return $conn;
}

function format_size($bytes) {
    $units = ['B', 'KB', 'MB', 'GB'];
    $i = 0;
    while ($bytes >= 1024 && $i < count($units) - 1) {
        $bytes /= 1024;
        $i++;
    }
    return round($bytes, 2) . ' ' . $units[$i];
}

function scan_dir($conn, $dir) {
    $items = [];
    $raw = ftp_rawlist($conn, $dir);
    if (!$raw) return $items;
    foreach ($raw as $line) {
        $parts = preg_split("/\s+/", $line, 9);
        if (count($parts) < 9) continue;
        $perms = $parts[0];
        $name = $parts[8];
        $is_dir = $perms[0] === 'd';
        $size = $is_dir ? 0 : (int)$parts[4];
        $items[] = [
            'name' => $name,
            'is_dir' => $is_dir,
            'size' => $size,
            'perms' => $perms
        ];
    }
    usort($items, function($a, $b) {
        if ($a['is_dir'] && !$b['is_dir']) return -1;
        if (!$a['is_dir'] && $b['is_dir']) return 1;
        return strcasecmp($a['name'], $b['name']);
    });
    return $items;
}

$conn = null;
$status = 'Not connected';
$current_dir = $_SESSION['ftp_root'] ?? '/';
$message = '';
$error_msg = '';

if (isset($_SESSION['ftp_host'])) {
    $conn = ftp_connect_and_login();
    if ($conn) {
        $status = 'Connected to ' . $_SESSION['ftp_host'];
        if (isset($_POST['cd'])) {
            $new = $_POST['cd'];
            if ($new === '..') {
                $current_dir = rtrim(dirname($current_dir), '/') ?: '/';
            } else {
                $test = $current_dir . '/' . $new;
                if (@ftp_chdir($conn, $test)) {
                    $current_dir = $test;
                    ftp_chdir($conn, $current_dir);
                }
            }
        }
        if (isset($_POST['mkdir'])) {
            $new_dir = $current_dir . '/' . $_POST['mkdir'];
            if (@ftp_mkdir($conn, $new_dir)) {
                $message = 'Folder created';
            } else {
                $error_msg = 'Failed to create folder';
            }
        }
        if (isset($_POST['delete_file'])) {
            if (@ftp_delete($conn, $current_dir . '/' . $_POST['delete_file'])) {
                $message = 'File deleted';
            } else {
                $error_msg = 'Failed to delete file';
            }
        }
        if (isset($_POST['delete_dir'])) {
            if (@ftp_rmdir($conn, $current_dir . '/' . $_POST['delete_dir'])) {
                $message = 'Folder deleted';
            } else {
                $error_msg = 'Failed to delete folder';
            }
        }
        if (isset($_POST['rename']) && $_POST['rename_new']) {
            $old = $current_dir . '/' . $_POST['rename_old'];
            $new = $current_dir . '/' . $_POST['rename_new'];
            if (@ftp_rename($conn, $old, $new)) {
                $message = 'Renamed successfully';
            } else {
                $error_msg = 'Failed to rename';
            }
        }
        if (isset($_POST['upload_file'])) {
            if (isset($_FILES['upload']) && $_FILES['upload']['error'] === 0) {
                $remote = $current_dir . '/' . basename($_FILES['upload']['name']);
                if (ftp_put($conn, $remote, $_FILES['upload']['tmp_name'], FTP_BINARY)) {
                    $message = 'File uploaded';
                } else {
                    $error_msg = 'Upload failed';
                }
            }
        }
        if (isset($_POST['upload_folder'])) {
            $base = rtrim($current_dir, '/');
            $folder_name = basename($_POST['folder_path']);
            $local_root = rtrim($_POST['folder_path'], '/');
            if (!is_dir($local_root)) {
                $error_msg = 'Folder not found';
            } else {
                $queue = [[$local_root, $base . '/' . $folder_name]];
                while ($queue) {
                    [$local, $remote] = array_shift($queue);
                    if (@ftp_mkdir($conn, $remote) || in_array(basename($remote), [''])) {
                    }
                    $files = scandir($local);
                    foreach ($files as $f) {
                        if ($f === '.' || $f === '..') continue;
                        $lf = $local . '/' . $f;
                        $rf = $remote . '/' . $f;
                        if (is_dir($lf)) {
                            $queue[] = [$lf, $rf];
                        } else {
                            ftp_put($conn, $rf, $lf, FTP_BINARY);
                        }
                    }
                }
                $message = 'Folder uploaded';
            }
        }
    } else {
        $error_msg = 'Connection failed. Check your FTP credentials.';
        unset($_SESSION['ftp_host'], $_SESSION['ftp_user'], $_SESSION['ftp_pass'], $_SESSION['ftp_port'], $_SESSION['ftp_root'], $_SESSION['ftp_passive']);
        $status = 'Not connected';
    }
}

$items = [];
if ($conn) {
    $items = scan_dir($conn, $current_dir);
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>FTP Manager</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f6fa; color: #333; }
        .header { background: #16213e; color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; }
        .header h1 { font-size: 20px; }
        .header .status { font-size: 13px; opacity: 0.8; }
        .header a { color: #e94560; text-decoration: none; font-size: 13px; }
        .container { max-width: 1200px; margin: 20px auto; padding: 0 20px; }
        .config-bar { background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .config-bar form { display: flex; gap: 10px; align-items: flex-end; flex-wrap: wrap; }
        .config-bar input { padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; min-width: 150px; }
        .config-bar label { font-size: 12px; color: #666; display: block; margin-bottom: 3px; }
        .config-bar button { padding: 8px 16px; background: #16213e; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
        .config-bar button:hover { background: #0f3460; }
        .toolbar { background: white; padding: 12px; border-radius: 8px; margin-bottom: 15px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .toolbar form { display: inline-flex; gap: 8px; align-items: center; margin: 0; }
        .toolbar input { padding: 7px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; }
        .toolbar button { padding: 7px 14px; background: #16213e; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
        .toolbar button.danger { background: #e94560; }
        .toolbar button.danger:hover { background: #c73e54; }
        .breadcrumb { font-size: 13px; color: #666; background: white; padding: 10px 15px; border-radius: 8px; margin-bottom: 10px; }
        .breadcrumb strong { color: #16213e; }
        .file-list { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        table { width: 100%; border-collapse: collapse; }
        th { background: #16213e; color: white; padding: 12px; text-align: left; font-size: 13px; font-weight: 600; }
        td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 14px; }
        tr:hover { background: #f8f9fa; }
        tr:last-child td { border-bottom: none; }
        .icon { font-size: 18px; }
        .dir { color: #e94560; }
        .file { color: #333; }
        .size { color: #666; font-size: 13px; }
        .actions { display: flex; gap: 5px; }
        .actions button { padding: 4px 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; }
        .actions .del { background: #ffe0e3; color: #e94560; }
        .actions .edit { background: #e3f2fd; color: #1565c0; }
        .message { padding: 10px 15px; border-radius: 6px; margin-bottom: 15px; font-size: 13px; }
        .message.success { background: #e8f5e9; color: #2e7d32; }
        .message.error { background: #ffebee; color: #c62828; }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; }
        .modal.active { display: flex; }
        .modal-content { background: white; padding: 25px; border-radius: 12px; width: 90%; max-width: 400px; }
        .modal-content h3 { margin-bottom: 15px; }
        .modal-content input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 10px; font-size: 14px; }
        .modal-content button { padding: 10px; background: #16213e; color: white; border: none; border-radius: 6px; cursor: pointer; width: 100%; }
        .modal-content .cancel { background: #ccc; color: #333; margin-top: 5px; }
        .rename-form { display: inline-flex; gap: 5px; align-items: center; }
        .rename-form input { padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px; }
        .rename-form button { padding: 4px 10px; background: #16213e; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FTP Manager</h1>
        <div>
            <span class="status"><?php echo htmlspecialchars($status); ?></span>
            <a href="?logout=1">Logout</a>
        </div>
    </div>

    <div class="container">
        <?php if ($message): ?>
            <div class="message success"><?php echo htmlspecialchars($message); ?></div>
        <?php endif; ?>
        <?php if ($error_msg): ?>
            <div class="message error"><?php echo htmlspecialchars($error_msg); ?></div>
        <?php endif; ?>

        <?php if (!$conn): ?>
            <div class="config-bar">
                <form method="POST">
                    <div>
                        <label>Host</label>
                        <input type="text" name="ftp_host" placeholder="ftp.hostinger.com" required>
                    </div>
                    <div>
                        <label>Username</label>
                        <input type="text" name="ftp_user" placeholder="username" required>
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" name="ftp_pass" placeholder="password" required>
                    </div>
                    <div>
                        <label>Port</label>
                        <input type="number" name="ftp_port" value="21" style="width: 80px;">
                    </div>
                    <div>
                        <label>Root Path</label>
                        <input type="text" name="ftp_root" value="/" style="width: 120px;">
                    </div>
                    <div>
                        <label style="display:flex; align-items:center; gap:5px; cursor:pointer;">
                            <input type="checkbox" name="ftp_passive" checked style="width:auto;"> Passive
                        </label>
                    </div>
                    <button type="submit" name="connect">Connect</button>
                </form>
            </div>
        <?php else: ?>
            <form method="POST" class="toolbar">
                <input type="file" name="upload" required>
                <button type="submit" name="upload_file">Upload File</button>
                <input type="text" name="folder_path" placeholder="Local folder path" style="width: 200px;">
                <button type="submit" name="upload_folder">Upload Folder</button>
                <button type="submit" name="disconnect" class="danger">Disconnect</button>
            </form>

            <form method="POST" class="toolbar">
                <input type="text" name="mkdir" placeholder="New folder name" required>
                <button type="submit" name="mkdir">Create Folder</button>
            </form>

            <div class="breadcrumb">
                Current: <strong><?php echo htmlspecialchars($current_dir); ?></strong>
            </div>

            <div class="file-list">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Size</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($current_dir !== '/'): ?>
                            <tr>
                                <td><span class="icon">⬆️</span> <a href="javascript:void(0)" onclick="document.querySelector('input[name=cd]').value='..'; document.forms['cdform'].submit()" style="color:#16213e; text-decoration:none;">..</a></td>
                                <td></td>
                                <td></td>
                            </tr>
                        <?php endif; ?>
                        <?php foreach ($items as $item): ?>
                            <tr>
                                <td>
                                    <span class="icon"><?php echo $item['is_dir'] ? '📁' : '📄'; ?></span>
                                    <span class="<?php echo $item['is_dir'] ? 'dir' : 'file'; ?>">
                                        <?php echo htmlspecialchars($item['name']); ?>
                                    </span>
                                </td>
                                <td class="size"><?php echo $item['is_dir'] ? '-' : format_size($item['size']); ?></td>
                                <td class="actions">
                                    <?php if ($item['is_dir']): ?>
                                        <form method="POST" style="display:inline;">
                                            <input type="hidden" name="cd" value="<?php echo htmlspecialchars($item['name']); ?>">
                                            <button type="submit" class="edit">Open</button>
                                        </form>
                                        <form method="POST" style="display:inline;" onsubmit="return confirm('Delete folder?')">
                                            <input type="hidden" name="delete_dir" value="<?php echo htmlspecialchars($item['name']); ?>">
                                            <button type="submit" class="del">Delete</button>
                                        </form>
                                    <?php else: ?>
                                        <form method="POST" style="display:inline;" onsubmit="return confirm('Delete file?')">
                                            <input type="hidden" name="delete_file" value="<?php echo htmlspecialchars($item['name']); ?>">
                                            <button type="submit" class="del">Delete</button>
                                        </form>
                                    <?php endif; ?>
                                    <form method="POST" class="rename-form">
                                        <input type="hidden" name="rename_old" value="<?php echo htmlspecialchars($item['name']); ?>">
                                        <input type="text" name="rename_new" placeholder="New name" size="15" required>
                                        <button type="submit">Rename</button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                        <?php if (empty($items)): ?>
                            <tr><td colspan="3" style="text-align:center; color:#999; padding:20px;">Empty folder</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
            <form id="cdform" method="POST"><input type="hidden" name="cd"></form>
        <?php endif; ?>
    </div>
</body>
</html>