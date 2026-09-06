param([int]$Port = 8080)
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
try {
    $listener.Start()
    Write-Host "Server running at http://localhost:$Port/"
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response
            
            $rawPath = $request.Url.LocalPath.TrimStart('/')
            if ([string]::IsNullOrWhiteSpace($rawPath)) { $rawPath = "index.html" }
            $filePath = Join-Path (Get-Location) $rawPath
            
            if (Test-Path $filePath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".json" { "application/json; charset=utf-8" }
                    ".svg"  { "image/svg+xml" }
                    ".png"  { "image/png" }
                    default { "application/octet-stream" }
                }
                $response.ContentType = $contentType
                $response.Headers.Add("Access-Control-Allow-Origin", "*")
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.OutputStream.Write($msg, 0, $msg.Length)
            }
            $response.Close()
        } catch {
            Write-Host "Request error: $_"
        }
    }
} finally {
    $listener.Stop()
}
