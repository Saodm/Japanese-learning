package com.saodm.japaneselearning;

import android.app.Activity;
import android.content.res.AssetManager;
import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.IOException;
import java.net.URLEncoder;

public class MainActivity extends Activity {

    private WebView web;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setLoadWithOverviewMode(true);
        s.setUseWideViewPort(true);
        s.setSupportZoom(false);

        web.setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request != null && request.isForMainFrame()) {
                    showError("无法加载 " + request.getUrl(),
                            "错误码: " + error.getErrorCode() + " / " + error.getDescription()
                                    + "\n\nassets 里实际包含的内容:\n" + listAssets());
                }
            }
        });
        web.setWebChromeClient(new WebChromeClient());
        web.loadUrl(resolveStartUrl());
        setContentView(web);
    }

    // 自动在 assets 里查找 index.html，兼容不同打包路径
    private String resolveStartUrl() {
        String[] candidates = { "www/index.html", "index.html", "assets/www/index.html" };
        AssetManager am = getAssets();
        for (String c : candidates) {
            try {
                am.open(c).close();
                return "file:///android_asset/" + c;
            } catch (IOException ignored) {
            }
        }
        return "file:///android_asset/www/index.html";
    }

    private String listAssets() {
        StringBuilder sb = new StringBuilder();
        try {
            listDir(getAssets(), "", sb);
        } catch (IOException e) {
            sb.append(e.toString());
        }
        return sb.toString();
    }

    private void listDir(AssetManager am, String path, StringBuilder sb) throws IOException {
        for (String name : am.list(path)) {
            String full = path.isEmpty() ? name : path + "/" + name;
            sb.append(full).append("\n");
            if (name.indexOf('.') < 0) {
                listDir(am, full, sb);
            }
        }
    }

    private void showError(String title, String detail) {
        String html = "<html><body style='font-family:sans-serif;padding:20px;color:#3d3226;background:#f5f0e8'>"
                + "<h2>页面加载失败</h2>"
                + "<p><b>" + title + "</b></p>"
                + "<pre style='white-space:pre-wrap;font-size:12px;background:#fff;padding:12px;border-radius:8px'>"
                + detail + "</pre></body></html>";
        try {
            web.loadData(html, "text/html; charset=utf-8", "UTF-8");
        } catch (Exception ignored) {
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && web != null && web.canGoBack()) {
            web.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}