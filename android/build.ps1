# 打包 五十音练习 APK（无需 Gradle）
# 用法：powershell -ExecutionPolicy Bypass -File build.ps1
$ErrorActionPreference = 'Stop'

$scriptDir = $PSScriptRoot
$repoRoot  = Split-Path $scriptDir -Parent

# ---- 环境探测 ----
$sdk = $env:ANDROID_HOME
if (-not $sdk) { $sdk = Join-Path $env:LOCALAPPDATA 'Android\Sdk' }
$buildTools = Join-Path $sdk 'build-tools\34.0.0'
$androidJar  = Join-Path $sdk 'platforms\android-35\android.jar'
if (-not (Test-Path $buildTools)) { throw "找不到 build-tools: $buildTools" }
if (-not (Test-Path $androidJar)) { throw "找不到 android.jar: $androidJar" }

$javaHome = $env:JAVA_HOME
if (-not $javaHome) {
    $jdkDir = Get-ChildItem 'C:\Users\Administrator\android-toolchain' -Directory -Filter 'jdk*' -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($jdkDir) { $javaHome = $jdkDir.FullName }
}
if (-not $javaHome -or -not (Test-Path (Join-Path $javaHome 'bin\javac.exe'))) { throw '找不到 JDK，请设置 JAVA_HOME' }
$env:JAVA_HOME = $javaHome
$env:Path = "$javaHome\bin;$env:Path"

$ksPass = 'saodm2026'
$ksFile = Join-Path $scriptDir 'japanese.keystore'

# ---- 工作目录 ----
$build = Join-Path $scriptDir 'build'
if (Test-Path $build) { Remove-Item -LiteralPath $build -Recurse -Force }
New-Item -ItemType Directory -Path "$build\classes", "$build\dexout", "$build\dist" -Force | Out-Null
# 复制一份 android.jar 到构建目录，避免编译时原文件被占用
Copy-Item -LiteralPath $androidJar -Destination "$build\android.jar" -Force
$androidJar = "$build\android.jar"

# ---- 1. 同步网页资源 ----
$assets = Join-Path $scriptDir 'app\assets\www'
New-Item -ItemType Directory -Path $assets -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $repoRoot 'index.html'), (Join-Path $repoRoot 'style.css'), (Join-Path $repoRoot 'script.js') -Destination $assets -Force
Write-Output '网页资源已同步'

# ---- 2. 编译 Java ----
& "$javaHome\bin\javac.exe" -encoding UTF-8 -source 1.8 -target 1.8 -bootclasspath $androidJar -d "$build\classes" (Join-Path $scriptDir 'app\src\com\saodm\japaneselearning\MainActivity.java')
if ($LASTEXITCODE -ne 0) { throw 'javac 编译失败' }
Write-Output 'Java 编译完成'

# ---- 3. 生成 dex ----
Push-Location "$build\dexout"
& "$buildTools\d8.bat" --release --lib $androidJar --min-api 21 --output . "$build\classes\com\saodm\japaneselearning\MainActivity.class"
Pop-Location
if ($LASTEXITCODE -ne 0) { throw 'd8 生成 dex 失败' }
Write-Output 'dex 生成完成'

# ---- 4. 资源与网页资源打包（aapt，官方方式，保证 assets 路径为正向斜杠） ----
& "$buildTools\aapt.exe" package -f -M (Join-Path $scriptDir 'app\AndroidManifest.xml') -S (Join-Path $scriptDir 'app\res') -I $androidJar -F "$build\app.unsigned.apk"
if ($LASTEXITCODE -ne 0) { throw 'aapt package 失败' }

# 网页资源以 assets 根目录下的正向斜杠路径加入
Push-Location (Join-Path $scriptDir 'app\assets')
& "$buildTools\aapt.exe" add "$build\app.unsigned.apk" www/index.html www/script.js www/style.css
Pop-Location
if ($LASTEXITCODE -ne 0) { throw 'aapt add 资源失败' }
Write-Output '资源打包完成'

# ---- 5. 写入 classes.dex ----
Push-Location "$build\dexout"
& "$buildTools\aapt.exe" add "$build\app.unsigned.apk" classes.dex
Pop-Location
if ($LASTEXITCODE -ne 0) { throw '写入 dex 失败' }

# ---- 6. 对齐 ----
& "$buildTools\zipalign.exe" -f 4 "$build\app.unsigned.apk" "$build\app.aligned.apk"
if ($LASTEXITCODE -ne 0) { throw 'zipalign 失败' }

# ---- 7. 签名 ----
if (-not (Test-Path $ksFile)) {
    & "$javaHome\bin\keytool.exe" -genkeypair -v -keystore $ksFile -alias japanese -keyalg RSA -keysize 2048 -validity 10000 -storepass $ksPass -keypass $ksPass -dname 'CN=Japanese Learning, OU=App, O=Saodm, L=Shanghai, ST=Shanghai, C=CN'
    if ($LASTEXITCODE -ne 0) { throw 'keytool 生成密钥失败' }
}
$apk = Join-Path $build 'dist\JapaneseLearning.apk'
& "$buildTools\apksigner.bat" sign --ks $ksFile --ks-pass pass:$ksPass --key-pass pass:$ksPass --out $apk "$build\app.aligned.apk"
if ($LASTEXITCODE -ne 0) { throw 'apksigner 签名失败' }
& "$buildTools\apksigner.bat" verify --print-certs $apk | Out-Null
Write-Output "APK 已生成: $apk"





