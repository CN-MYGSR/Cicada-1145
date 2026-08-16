param(
  [string]$Key = ''
)

$salt = 'VERITAS-1145-SAPERE'
$sha = [System.Security.Cryptography.SHA256]::Create()

function Get-HexHash([byte[]]$bytes) {
  $sb = New-Object System.Text.StringBuilder
  foreach ($b in $bytes) {
    [void]$sb.Append($b.ToString('x2'))
  }
  return $sb.ToString()
}

if ($Key -ne '') {
  $fingerprint = 'db9917594a4382f174969249fa05678d0bcbfea5b2b669832a0563ba80ab9155'
  $hash = Get-HexHash $sha.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($Key))
  if ($hash -eq $fingerprint) {
    Write-Output "KEY OK :: SHA-256($Key) 匹配 CICADA 1145 指纹"
  } else {
    Write-Output "KEY WRONG :: SHA-256($Key) = $hash"
  }
} else {
  $u = $env:USERNAME
  $hash = Get-HexHash $sha.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($u + $salt))
  Write-Output $hash
}
