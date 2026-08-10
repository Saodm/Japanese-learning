# 五十音练习 Android APK

用 Android WebView 把网页版（index.html / style.css / script.js）打包成 APK。
网页文件会自动从仓库根目录同步，修改网页后重新运行打包脚本即可。

## 环境要求

- JDK 17（本机已安装于 `C:\Users\Administrator\android-toolchain\jdk-17.0.20+8`）
- Android SDK：`build-tools;34.0.0`、`platforms;android-35`（已装入
  `C:\Users\Administrator\AppData\Local\Android\Sdk`）

## 打包

```powershell
powershell -ExecutionPolicy Bypass -File build.ps1
```

输出：`build\dist\JapaneseLearning.apk`（签名 APK，可安装）。

## 安装

把 APK 传到手机，允许「安装未知来源应用」后安装即可。
应用名：五十音练习；包名：com.saodm.japaneselearning。
注意：应用内读音需要联网（有道/百度在线发音接口），其余功能离线可用。

## 签名

首次打包会自动生成 `japanese.keystore`（别名 japanese，口令 saodm2026）。
密钥文件不提交到仓库，请自行保管；重新生成会导致旧版本无法覆盖安装（需先卸载）。
