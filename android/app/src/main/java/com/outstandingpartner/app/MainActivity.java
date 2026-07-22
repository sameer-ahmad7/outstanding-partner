package com.outstandingpartner.app;

import android.os.Bundle;
import android.util.Log;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Surface Meta app-event activity in logcat (tag "OPMeta" / "AppEvents") so the
        // Facebook SDK integration is verifiable locally, mirroring the iOS console
        // diagnostic. Auto-logging (AutoLogAppEventsEnabled in the manifest) still does
        // the actual activate/session logging; this only makes it visible + confirms init.
        try {
            com.facebook.FacebookSdk.setIsDebugEnabled(true);
            com.facebook.FacebookSdk.addLoggingBehavior(com.facebook.LoggingBehavior.APP_EVENTS);
            Log.i("OPMeta", "Facebook SDK present; appId=" + com.facebook.FacebookSdk.getApplicationId()
                    + " initialized=" + com.facebook.FacebookSdk.isInitialized());
        } catch (Throwable t) {
            Log.w("OPMeta", "Facebook SDK unavailable: " + t.getMessage());
        }
    }
}
