const CACHE_NAME = 'hoikuen-checklist-v1';
// キャッシュする対象（あなたのHTMLファイル名に書き換えてください）
const ASSETS = [
  './',
  './index.html' 
];

// インストール時にHTMLをブラウザにガッチリ固定保存
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 圏外のときは、ネットワークではなく手元のキャッシュからHTMLを1秒で引き出す
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
