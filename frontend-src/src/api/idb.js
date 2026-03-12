// ── IndexedDB API-response cache ────────────────────────────────────────────
// Stores last successful GET response per URL path so the app can serve
// stale data while offline.  Non-critical: all errors are swallowed.

const DB_NAME = 'agrisahayak-cache'
const STORE   = 'api-responses'
const VERSION = 1

let _db = null

function openDB() {
  if (_db) return Promise.resolve(_db)
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION)
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE, { keyPath: 'url' })
    }
    req.onsuccess = (e) => {
      _db = e.target.result
      resolve(_db)
    }
    req.onerror = (e) => reject(e.target.error)
  })
}

/** Persist a successful API response keyed by URL path. Fire-and-forget. */
export async function cacheResponse(url, data) {
  try {
    const db = await openDB()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put({ url, data, timestamp: Date.now() })
      tx.oncomplete = () => resolve()
      tx.onerror   = (e) => reject(e.target.error)
    })
  } catch {
    // intentionally silent
  }
}

/** Retrieve the last cached response for a URL path, or null if absent. */
export async function getCachedResponse(url) {
  try {
    const db = await openDB()
    return await new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).get(url)
      req.onsuccess = (e) => resolve(e.target.result ?? null)
      req.onerror   = (e) => reject(e.target.error)
    })
  } catch {
    return null
  }
}
