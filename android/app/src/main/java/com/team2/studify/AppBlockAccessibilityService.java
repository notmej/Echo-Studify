package com.team2.studify;

import android.accessibilityservice.AccessibilityService;
import android.content.Intent;
import android.content.SharedPreferences;
import android.view.accessibility.AccessibilityEvent;

import java.util.HashSet;
import java.util.Set;

public class AppBlockAccessibilityService extends AccessibilityService {

    private static final String PREF_NAME = "StudifyAppBlockPrefs";
    private static final String KEY_BLOCKED_APPS = "blockedAppsList";
    private static final String KEY_BLOCKING_ENABLED = "blockingEnabled";

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        if (event == null) {
            return;
        }

        int eventType = event.getEventType();

        if (
            eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED &&
            eventType != AccessibilityEvent.TYPE_WINDOWS_CHANGED
        ) {
            return;
        }

        CharSequence packageNameCharSequence = event.getPackageName();

        if (packageNameCharSequence == null) {
            return;
        }

        String foregroundPackageName = packageNameCharSequence.toString();

        if (foregroundPackageName.equals(getPackageName())) {
            return;
        }

        SharedPreferences preferences = getSharedPreferences(PREF_NAME, MODE_PRIVATE);

        boolean blockingEnabled = preferences.getBoolean(KEY_BLOCKING_ENABLED, false);

        if (!blockingEnabled) {
            return;
        }

        Set<String> blockedApps = preferences.getStringSet(KEY_BLOCKED_APPS, new HashSet<String>());

        if (blockedApps.contains(foregroundPackageName)) {
            redirectUserToStudify();
        }
    }

    private void redirectUserToStudify() {
        Intent launchIntent = getPackageManager().getLaunchIntentForPackage(getPackageName());

        if (launchIntent != null) {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            startActivity(launchIntent);
        } else {
            performGlobalAction(GLOBAL_ACTION_HOME);
        }
    }

    @Override
    public void onInterrupt() {
        // Required method.
    }
}