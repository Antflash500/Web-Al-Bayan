<?php
session_start();

$password = 'albayan12345';
$root_dir = __DIR__;

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
        <title>Web File Manager</title>
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
            <h2>Web File Manager</h2>
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

function get_size($bytes) {
    $units = ['B', 'KB', 'MB', 'GB'];
    $i = 0;
    while ($bytes >= 1024 && $i < count($units) - 1) {
        $bytes /= 1024;
        $i++;
    }
    return round($bytes, 2) . ' ' . $units[$i];
}

function scan_dir($dir) {
    $items = [];
    if (!is_dir($dir)) return $items;
    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        $full_path = $dir . '/' . $file;
        $is_dir = is_dir($full_path);
        $size = $is_dir ? 0 : filesize($full_path);
        $items[] = [
            'name' => $file,
            'is_dir' => $is_dir,
            'size' => $size,
            'path' => $full_path,
            'modified' => date('Y-m-d H:i', filemtime($full_path))
        ];
    }
    usort($items, function($a, $b) {
        if ($a['is_dir'] && !$b['is_dir']) return -1;
        if (!$a['is_dir'] && $b['is_dir']) return 1;
        return strcasecmp($a['name'], $b['name']);
    });
    return $items;
}

$current_dir = isset($_GET['dir']) ? realpath($root_dir . '/' . $_GET['dir']) : $root_dir;
if (!$current_dir || strpos($current_dir, $root_dir) !== 0) {
    $current_dir = $root_dir;
}
$current_dir = str_replace('\\', '/', $current_dir);
$rel_dir = str_replace($root_dir, '', $current_dir);

$message = '';
$error_msg = '';

if (isset($_POST['mkdir'])) {
    $new_dir = $current_dir . '/' . preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['mkdir']);
    if (mkdir($new_dir, 0755)) {
        $message = 'Folder created';
    } else {
        $error_msg = 'Failed to create folder';
    }
}

if (isset($_POST['delete_file'])) {
    if (unlink($current_dir . '/' . $_POST['delete_file'])) {
        $message = 'File deleted';
    } else {
        $error_msg = 'Failed to delete file';
    }
}

if (isset($_POST['delete_dir'])) {
    $dir_path = $current_dir . '/' . $_POST['delete_dir'];
    function delete_dir($dir) {
        if (!is_dir($dir)) return false;
        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {
            delete_dir("$dir/$file");
        }
        return rmdir($dir);
    }
    if (delete_dir($dir_path)) {
        $message = 'Folder deleted';
    } else {
        $error_msg = 'Failed to delete folder';
    }
}

if (isset($_POST['rename']) && $_POST['rename_new']) {
    $old = $current_dir . '/' . $_POST['rename_old'];
    $new = $current_dir . '/' . preg_replace('/[^a-zA-Z0-9_.-]/', '', $_POST['rename_new']);
    if (rename($old, $new)) {
        $message = 'Renamed successfully';
    } else {
        $error_msg = 'Failed to rename';
    }
}

if (isset($_POST['save_file'])) {
    $file = $current_dir . '/' . $_POST['file_name'];
    if (file_put_contents($file, $_POST['file_content']) !== false) {
        $message = 'File saved';
    } else {
        $error_msg = 'Failed to save file';
    }
}

if (isset($_POST['create_file'])) {
    $filename = preg_replace('/[^a-zA-Z0-9_.-]/', '', $_POST['filename']);
    $file = $current_dir . '/' . $filename;
    if (!file_exists($file)) {
        if (file_put_contents($file, '') !== false) {
            $message = 'File created';
        } else {
            $error_msg = 'Failed to create file';
        }
    } else {
        $error_msg = 'File already exists';
    }
}

if (isset($_POST['upload_file'])) {
    if (isset($_FILES['upload']) && $_FILES['upload']['error'] === 0) {
        $remote = $current_dir . '/' . basename($_FILES['upload']['name']);
        if (move_uploaded_file($_FILES['upload']['tmp_name'], $remote)) {
            $message = 'File uploaded';
        } else {
            $error_msg = 'Upload failed';
        }
    }
}

$edit_file = '';
if (isset($_GET['edit'])) {
    $edit_file = realpath($current_dir . '/' . $_GET['edit']);
    if (!$edit_file || strpos($edit_file, $root_dir) !== 0 || is_dir($edit_file)) {
        $edit_file = '';
    }
}

$items = scan_dir($current_dir);
?>
<!DOCTYPE html>
<html>
<head>
    <title>Web File Manager</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f6fa; color: #333; }
        .header { background: #16213e; color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; }
        .header h1 { font-size: 20px; }
        .header .status { font-size: 13px; opacity: 0.8; }
        .header a { color: #e94560; text-decoration: none; font-size: 13px; }
        .container { max-width: 1200px; margin: 20px auto; padding: 0 20px; }
        .toolbar { background: white; padding: 12px; border-radius: 8px; margin-bottom: 15px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .toolbar form { display: inline-flex; gap: 8px; align-items: center; margin: 0; }
        .toolbar input { padding: 7px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; }
        .toolbar button { padding: 7px 14px; background: #16213e; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
        .toolbar button.danger { background: #e94560; }
        .toolbar button.danger:hover { background: #c73e54; }
        .breadcrumb { font-size: 13px; color: #666; background: white; padding: 10px 15px; border-radius: 8px; margin-bottom: 10px; }
        .breadcrumb a { color: #16213e; text-decoration: none; }
        .breadcrumb strong { color: #e94560; }
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
        .editor { background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .editor textarea { width: 100%; min-height: 400px; font-family: 'Courier New', monospace; font-size: 13px; padding: 10px; border: 1px solid #ddd; border-radius: 6px; }
        .rename-form { display: inline-flex; gap: 5px; align-items: center; }
        .rename-form input { padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px; }
        .rename-form button { padding: 4px 10px; background: #16213e; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; }
        .modal.active { display: flex; }
        .modal-content { background: white; padding: 25px; border-radius: 12px; width: 90%; max-width: 400px; }
        .modal-content h3 { margin-bottom: 15px; }
        .modal-content input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 10px; font-size: 14px; }
        .modal-content button { padding: 10px; background: #16213e; color: white; border: none; border-radius: 6px; cursor: pointer; width: 100%; }
        .modal-content .cancel { background: #ccc; color: #333; margin-top: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Web File Manager</h1>
        <div>
            <span class="status"><?php echo htmlspecialchars($root_dir); ?></span>
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

        <div class="toolbar">
            <form method="GET" style="display:inline-flex; gap:8px; align-items:center; margin:0;">
                <input type="text" name="dir" value="<?php echo htmlspecialchars($rel_dir); ?>" placeholder="Current path" style="width: 300px;">
                <button type="submit">Go</button>
            </form>
            <form method="POST" style="display:inline;">
                <input type="text" name="mkdir" placeholder="New folder" required>
                <button type="submit" name="mkdir">Create Folder</button>
            </form>
            <form method="POST" enctype="multipart/form-data" style="display:inline;">
                <input type="file" name="upload" required>
                <button type="submit" name="upload_file">Upload File</button>
            </form>
            <button onclick="document.getElementById('createFileModal').classList.add('active')">Create File</button>
        </div>

        <div class="breadcrumb">
            <a href="?dir=">Root</a>
            <?php
            $parts = explode('/', $rel_dir);
            $build = '';
            foreach ($parts as $part) {
                if ($part === '') continue;
                $build .= '/' . $part;
                echo ' / <a href="?dir=' . urlencode($build) . '">' . htmlspecialchars($part) . '</a>';
            }
            ?>
        </div>

        <?php if ($edit_file): ?>
            <div class="editor">
                <h3 style="margin-bottom:10px;">Editing: <?php echo htmlspecialchars(str_replace($root_dir, '', $edit_file)); ?></h3>
                <form method="POST">
                    <input type="hidden" name="file_name" value="<?php echo htmlspecialchars(basename($edit_file)); ?>">
                    <textarea name="file_content"><?php echo htmlspecialchars(file_get_contents($edit_file)); ?></textarea>
                    <div style="margin-top:10px; display:flex; gap:10px;">
                        <button type="submit" name="save_file">Save File</button>
                        <a href="?dir=<?php echo urlencode($rel_dir); ?>" style="padding:7px 14px; background:#ccc; color:#333; text-decoration:none; border-radius:6px; font-size:13px; display:inline-block;">Cancel</a>
                    </div>
                </form>
            </div>
        <?php else: ?>
            <div class="file-list">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Size</th>
                            <th>Modified</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($rel_dir !== ''): ?>
                            <tr>
                                <td><span class="icon">⬆️</span> <a href="?dir=<?php echo urlencode(dirname($rel_dir)); ?>" style="color:#16213e; text-decoration:none; font-weight:bold;">..</a></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        <?php endif; ?>
                        <?php foreach ($items as $item): ?>
                            <tr>
                                <td>
                                    <span class="icon"><?php echo $item['is_dir'] ? '📁' : '📄'; ?></span>
                                    <span class="<?php echo $item['is_dir'] ? 'dir' : 'file'; ?>">
                                        <?php if ($item['is_dir']): ?>
                                            <a href="?dir=<?php echo urlencode($rel_dir . '/' . $item['name']); ?>" style="color:#e94560; text-decoration:none; font-weight:bold;"><?php echo htmlspecialchars($item['name']); ?></a>
                                        <?php else: ?>
                                            <a href="?dir=<?php echo urlencode($rel_dir); ?>&edit=<?php echo urlencode($item['name']); ?>" style="color:#333; text-decoration:none;"><?php echo htmlspecialchars($item['name']); ?></a>
                                        <?php endif; ?>
                                    </span>
                                </td>
                                <td class="size"><?php echo $item['is_dir'] ? '-' : get_size($item['size']); ?></td>
                                <td class="size"><?php echo $item['modified']; ?></td>
                                <td class="actions">
                                    <?php if (!$item['is_dir']): ?>
                                        <a href="?dir=<?php echo urlencode($rel_dir); ?>&edit=<?php echo urlencode($item['name']); ?>" class="edit">Edit</a>
                                    <?php endif; ?>
                                    <form method="POST" class="rename-form">
                                        <input type="hidden" name="rename_old" value="<?php echo htmlspecialchars($item['name']); ?>">
                                        <input type="text" name="rename_new" placeholder="New name" size="12" required>
                                        <button type="submit">Rename</button>
                                    </form>
                                    <?php if ($item['is_dir']): ?>
                                        <form method="POST" style="display:inline;" onsubmit="return confirm('Delete folder and all contents?')">
                                            <input type="hidden" name="delete_dir" value="<?php echo htmlspecialchars($item['name']); ?>">
                                            <button type="submit" class="del">Delete</button>
                                        </form>
                                    <?php else: ?>
                                        <form method="POST" style="display:inline;" onsubmit="return confirm('Delete file?')">
                                            <input type="hidden" name="delete_file" value="<?php echo htmlspecialchars($item['name']); ?>">
                                            <button type="submit" class="del">Delete</button>
                                        </form>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                        <?php if (empty($items)): ?>
                            <tr><td colspan="4" style="text-align:center; color:#999; padding:20px;">Empty folder</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>

    <div id="createFileModal" class="modal">
        <div class="modal-content">
            <h3>Create New File</h3>
            <form method="POST">
                <input type="text" name="filename" placeholder="filename.php" required>
                <button type="submit" name="create_file">Create File</button>
                <button type="button" class="cancel" onclick="document.getElementById('createFileModal').classList.remove('active')">Cancel</button>
            </form>
        </div>
    </div>
</body>
</html>