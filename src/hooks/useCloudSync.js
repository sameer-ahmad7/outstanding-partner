import { useEffect, useRef } from 'react';
import { getUserAppState, upsertUserAppState } from '../services/appData.service.js';
import { snapshotLocal, restoreLocal } from '../services/storage.js';
import { setStorageChangeHandler } from '../utils/helpers.js';

// Cloud sync strategy (low-risk, snapshot-based):
//  - On login: fetch remote app_state.
//      * remote non-empty & differs from local  -> restore to localStorage, reload once
//        (the app's useState initializers re-read localStorage on the fresh mount)
//      * remote empty                            -> seed remote from current local snapshot
//  - While logged in: any safeSet() schedules a debounced upload of the full snapshot.
export function useCloudSync(userId, enabled) {
  const timer = useRef(null);

  useEffect(() => {
    if (!enabled || !userId) return;
    let cancelled = false;
    const hydrateFlag = 'op_hydrated_' + userId;

    (async () => {
      try {
        const remote = await getUserAppState(userId);
        if (cancelled) return;
        if (remote && Object.keys(remote).length > 0) {
          const local = snapshotLocal();
          const differs = JSON.stringify(remote) !== JSON.stringify(local);
          if (differs && !sessionStorage.getItem(hydrateFlag)) {
            restoreLocal(remote);
            sessionStorage.setItem(hydrateFlag, '1');
            location.reload();
            return;
          }
        } else {
          await upsertUserAppState(userId, snapshotLocal());
          sessionStorage.setItem(hydrateFlag, '1');
        }
      } catch (e) {
        console.warn('[cloudSync] init failed:', e?.message || e);
      }
    })();

    // Debounced uploader, triggered by safeSet() writes.
    setStorageChangeHandler(() => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        upsertUserAppState(userId, snapshotLocal()).catch((e) =>
          console.warn('[cloudSync] push failed:', e?.message || e)
        );
      }, 1000);
    });

    return () => {
      cancelled = true;
      setStorageChangeHandler(null);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [userId, enabled]);
}
