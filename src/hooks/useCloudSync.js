import { useEffect, useRef } from 'react';
import { getUserAppState, upsertUserAppState } from '../services/appData.service.js';
import { snapshotLocal, restoreLocal } from '../services/storage.js';
import { setStorageChangeHandler } from '../utils/helpers.js';

// Cloud sync strategy (low-risk, snapshot-based):
//  - On login: fetch remote app_state.
//      * remote non-empty & differs from local  -> restore to localStorage, then remount the
//        provider (onRehydrated) so its useState initializers re-read the restored data.
//        Falls back to location.reload() if no remount callback is provided.
//      * remote empty                            -> seed remote from current local snapshot.
//  - The debounced uploader is started ONLY after the initial hydrate settles, so an early
//    safeSet during the async fetch can't overwrite good remote data with an empty local snapshot.
//  - While logged in: any safeSet() schedules a debounced upload of the full snapshot.
export function useCloudSync(userId, enabled, onRehydrated) {
  const timer = useRef(null);

  useEffect(() => {
    if (!enabled || !userId) return;
    let cancelled = false;
    const hydrateFlag = 'op_hydrated_' + userId;

    const startUploader = () => {
      setStorageChangeHandler(() => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          upsertUserAppState(userId, snapshotLocal()).catch((e) =>
            console.warn('[cloudSync] push failed:', e?.message || e)
          );
        }, 1000);
      });
    };

    (async () => {
      try {
        // Already hydrated this session (e.g. after the remount) — just resume uploading.
        if (sessionStorage.getItem(hydrateFlag)) { startUploader(); return; }

        const remote = await getUserAppState(userId);
        if (cancelled) return;

        if (remote && Object.keys(remote).length > 0) {
          const local = snapshotLocal();
          if (JSON.stringify(remote) !== JSON.stringify(local)) {
            restoreLocal(remote);
            sessionStorage.setItem(hydrateFlag, '1');
            // Re-read restored data into React state. Prefer an in-app remount over a full
            // page reload (reload is unreliable in native WebViews).
            if (typeof onRehydrated === 'function') onRehydrated();
            else location.reload();
            return; // uploader starts after the remount re-runs this effect
          }
        } else {
          await upsertUserAppState(userId, snapshotLocal());
        }
        sessionStorage.setItem(hydrateFlag, '1');
        startUploader();
      } catch (e) {
        console.warn('[cloudSync] init failed:', e?.message || e);
        startUploader(); // don't strand the user offline — still persist locally→cloud
      }
    })();

    return () => {
      cancelled = true;
      setStorageChangeHandler(null);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [userId, enabled]);
}
