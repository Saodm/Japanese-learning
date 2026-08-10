# 一键重新打包：同步网页 -> Gradle 构建 -> 签名 -> 输出到桌面 web 文件夹
$ErrorActionPreference = 'Stop'
$cap = $PSScriptRoot
$repoRoot = Split-Path $cap -Parent
$outApk = Join-Path $repoRoot '..\Desktop\web\JapaneseLearning.apk'

$env:JAVA_HOME = 'C:\Users\Administrator\android-toolchain\jdk-21.0.12+8'
$env:ANDROID_HOME = 'C:\Users\Administrator\AppData\Local\Android\Sdk'
$env:GRADLE_USER_HOME = 'C:\Users\Administrator\.gradle'
$env:USERPROFILE = 'C:\Users\Administrator'
$env:HOME = 'C:\Users\Administrator'
$env:JAVA_TOOL_OPTIONS = '-Djavax.net.ssl.trustStoreType=WINDOWS-ROOT'

# 1. 安装依赖（首次）
if (-not (Test-Path "$cap\node_modules")) {
    Push-Location $cap
    & npm.cmd install --no-audit --no-fund
    Pop-Location
}

# 2. 同步最新网页
Copy-Item -LiteralPath (Join-Path $repoRoot 'index.html'), (Join-Path $repoRoot 'style.css'), (Join-Path $repoRoot 'script.js') -Destination "$cap\www" -Force
Push-Location $cap
& node node_modules/@capacitor/cli/bin/capacitor sync android
Pop-Location

# 3. 构建 release
Push-Location "$cap\android"
& .\gradlew.bat assembleRelease --no-daemon
Pop-Location

# 4. 签名（沿用本地密钥，保证可覆盖安装）
$bt = "$env:ANDROID_HOME\build-tools\34.0.0"
$ks = Join-Path $repoRoot 'android\japanese.keystore'
$unsigned = "$cap\android\app\build\outputs\apk\release\app-release-unsigned.apk"
$aligned = "$cap\android\app\build\outputs\apk\release\app-aligned.apk"
$final = "$cap\android\app\build\outputs\apk\release\JapaneseLearning.apk"
& "$bt\zipalign.exe" -f 4 $unsigned $aligned
& "$bt\apksigner.bat" sign --ks $ks --ks-pass pass:saodm2026 --key-pass pass:saodm2026 --out $final $aligned
Copy-Item -LiteralPath $final -Destination $outApk -Force
Write-Output "APK 已生成: $outApk"