// ⚡ キャッシュのバージョン管理（HTMLやこのファイルを更新した時は数字を上げてください）
const CACHE_NAME = 'hoikuen-checklist-v6';

// 💡 実際のURL・ファイル名と完全に一致させてください（フルパスは不要）
const ASSETS = [
  './hoikuen_checklist_app.html'
];

// インストール時はダウンロードのみ（強制交代はせず、ブラウザの自然なサイクルに任せる）
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 新しいバージョンが有効化されたタイミングで、古いバージョンの不要なゴミキャッシュを自動クレンジング
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('古いキャッシュを削除しました:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 🔄 Network-First（電波があるときは常に最新、圏外のときだけ身代わりを出す）戦略
self.addEventListener('fetch', (e) => {
  e.respondWith(
    // 1. まずはインターネット上の最新のデータを全力で取りに行く
    fetch(e.request)
      .then((response) => {
        // 通信が成功したら、最新のデータを手元のキャッシュ金庫に上書き保存（アップデート）しておく
        if (response && response.status === 200 && e.request.method === 'GET') {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseCopy);
          });
        }
        return response;
      })
      .catch(() => {
        // 2. 完全に圏外（ERR_INTERNET_DISCONNECTED）のときだけ、手元の金庫から身代わりを出す
        return caches.match(e.request);
      })
  );
});
