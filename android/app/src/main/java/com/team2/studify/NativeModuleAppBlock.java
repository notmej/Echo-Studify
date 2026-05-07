package com.team2.studify;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.provider.Settings;
import android.text.TextUtils;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class NativeModuleAppBlock extends ReactContextBaseJavaModule {

    private static final String PREF_NAME = "StudifyAppBlockPrefs";
    private static final String KEY_BLOCKED_APPS = "blockedAppsList";
    private static final String KEY_BLOCKING_ENABLED = "blockingEnabled";

    private final ReactApplicationContext reactContext;

    private ArrayList<String> blockedAppsList = new ArrayList<>();
    private String currentBlockedApp = "";
    private boolean nativeBlockingState = false;
    private boolean permissionStatus = false;
    private String nativeStatusMessage = "";

    public NativeModuleAppBlock(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "AppBlockModule";
    }

    @ReactMethod
    public void startBlockingService(Promise promise) {
        try {
            permissionStatus = isAccessibilityServiceEnabled();

            if (!permissionStatus) {
                nativeBlockingState = false;
                nativeStatusMessage = "Accessibility permission is not enabled.";
                promise.resolve(createNativeStateMap());
                return;
            }

            if (blockedAppsList.isEmpty()) {
                loadBlockedAppsFromPreferences();
            }

            if (blockedAppsList.isEmpty()) {
                nativeBlockingState = false;
                nativeStatusMessage = "No apps selected for blocking.";
                promise.resolve(createNativeStateMap());
                return;
            }

            nativeBlockingState = true;
            saveBlockingEnabledToPreferences(true);

            nativeStatusMessage = "Accessibility app blocking started.";

            promise.resolve(createNativeStateMap());

        } catch (Exception error) {
            nativeBlockingState = false;
            nativeStatusMessage = "Failed to start accessibility blocking.";
            promise.reject("START_BLOCKING_ERROR", nativeStatusMessage, error);
        }
    }

    @ReactMethod
    public void stopBlockingService(Promise promise) {
        try {
            nativeBlockingState = false;
            currentBlockedApp = "";

            saveBlockingEnabledToPreferences(false);

            nativeStatusMessage = "Accessibility app blocking stopped.";

            promise.resolve(createNativeStateMap());

        } catch (Exception error) {
            nativeStatusMessage = "Failed to stop accessibility blocking.";
            promise.reject("STOP_BLOCKING_ERROR", nativeStatusMessage, error);
        }
    }

    @ReactMethod
    public void blockSelectedApps(ReadableArray selectedApps, Promise promise) {
        try {
            blockedAppsList.clear();

            for (int i = 0; i < selectedApps.size(); i++) {
                ReadableType type = selectedApps.getType(i);

                if (type == ReadableType.String) {
                    String packageName = selectedApps.getString(i);

                    if (isValidPackageName(packageName)) {
                        blockedAppsList.add(packageName);
                    }
                }

                if (type == ReadableType.Map) {
                    ReadableMap appObject = selectedApps.getMap(i);

                    if (appObject.hasKey("packageName")) {
                        String packageName = appObject.getString("packageName");

                        if (isValidPackageName(packageName)) {
                            blockedAppsList.add(packageName);
                        }
                    }
                }
            }

            saveBlockedAppsToPreferences();

            if (blockedAppsList.isEmpty()) {
                nativeStatusMessage = "No valid apps were added to the block list.";
            } else {
                nativeStatusMessage = "Selected apps saved for accessibility blocking.";
            }

            promise.resolve(createNativeStateMap());

        } catch (Exception error) {
            nativeStatusMessage = "Failed to save selected apps.";
            promise.reject("BLOCK_SELECTED_APPS_ERROR", nativeStatusMessage, error);
        }
    }

    @ReactMethod
    public void unblockApps(Promise promise) {
        try {
            blockedAppsList.clear();
            currentBlockedApp = "";
            nativeBlockingState = false;

            SharedPreferences preferences =
                    reactContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);

            preferences.edit()
                    .remove(KEY_BLOCKED_APPS)
                    .putBoolean(KEY_BLOCKING_ENABLED, false)
                    .apply();

            nativeStatusMessage = "Blocked apps cleared.";

            promise.resolve(createNativeStateMap());

        } catch (Exception error) {
            nativeStatusMessage = "Failed to clear blocked apps.";
            promise.reject("UNBLOCK_APPS_ERROR", nativeStatusMessage, error);
        }
    }

    @ReactMethod
    public void monitorForegroundApp(Promise promise) {
        nativeStatusMessage = "Foreground monitoring is handled by AccessibilityService.";
        promise.resolve(createNativeStateMap());
    }

    @ReactMethod
    public void getBlockedAppState(Promise promise) {
        try {
            permissionStatus = isAccessibilityServiceEnabled();
            loadBlockedAppsFromPreferences();

            SharedPreferences preferences =
                    reactContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);

            nativeBlockingState = preferences.getBoolean(KEY_BLOCKING_ENABLED, false);

            if (nativeBlockingState) {
                nativeStatusMessage = "Accessibility blocking is active.";
            } else {
                nativeStatusMessage = "Accessibility blocking is inactive.";
            }

            promise.resolve(createNativeStateMap());

        } catch (Exception error) {
            nativeStatusMessage = "Failed to get blocking state.";
            promise.reject("GET_BLOCKED_APP_STATE_ERROR", nativeStatusMessage, error);
        }
    }

    @ReactMethod
    public void checkUsageAccessPermission(Promise promise) {
        try {
            permissionStatus = isAccessibilityServiceEnabled();

            if (permissionStatus) {
                nativeStatusMessage = "Accessibility permission is enabled.";
            } else {
                nativeStatusMessage = "Accessibility permission is not enabled.";
            }

            promise.resolve(createNativeStateMap());

        } catch (Exception error) {
            nativeStatusMessage = "Failed to check accessibility permission.";
            promise.reject("CHECK_PERMISSION_ERROR", nativeStatusMessage, error);
        }
    }

    @ReactMethod
    public void openUsageAccessSettings(Promise promise) {
        try {
            Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            reactContext.startActivity(intent);

            nativeStatusMessage = "Accessibility settings opened.";

            promise.resolve(createNativeStateMap());

        } catch (Exception error) {
            nativeStatusMessage = "Failed to open accessibility settings.";
            promise.reject("OPEN_ACCESSIBILITY_SETTINGS_ERROR", nativeStatusMessage, error);
        }
    }

    @ReactMethod
    public void getInstalledApps(Promise promise) {
        try {
            PackageManager packageManager = reactContext.getPackageManager();

            Intent launcherIntent = new Intent(Intent.ACTION_MAIN, null);
            launcherIntent.addCategory(Intent.CATEGORY_LAUNCHER);

            List<ResolveInfo> launcherApps =
                    packageManager.queryIntentActivities(launcherIntent, 0);

            WritableArray appsArray = new WritableNativeArray();

            for (ResolveInfo resolveInfo : launcherApps) {
                String appName = resolveInfo.loadLabel(packageManager).toString();
                String packageName = resolveInfo.activityInfo.packageName;

                if (packageName.equals(reactContext.getPackageName())) {
                    continue;
                }

                if (appName == null || appName.trim().isEmpty()) {
                    continue;
                }

                WritableMap appMap = new WritableNativeMap();
                appMap.putString("appName", appName);
                appMap.putString("packageName", packageName);

                appsArray.pushMap(appMap);
            }

            nativeStatusMessage = "Launcher apps loaded.";
            promise.resolve(appsArray);

        } catch (Exception error) {
            nativeStatusMessage = "Failed to load launcher apps.";
            promise.reject("GET_INSTALLED_APPS_ERROR", nativeStatusMessage, error);
        }
    }

    private void saveBlockedAppsToPreferences() {
        SharedPreferences preferences =
                reactContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);

        Set<String> blockedSet = new HashSet<>(blockedAppsList);

        preferences.edit()
                .putStringSet(KEY_BLOCKED_APPS, blockedSet)
                .apply();
    }

    private void loadBlockedAppsFromPreferences() {
        SharedPreferences preferences =
                reactContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);

        Set<String> blockedSet =
                preferences.getStringSet(KEY_BLOCKED_APPS, new HashSet<String>());

        blockedAppsList.clear();
        blockedAppsList.addAll(blockedSet);
    }

    private void saveBlockingEnabledToPreferences(boolean enabled) {
        SharedPreferences preferences =
                reactContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);

        preferences.edit()
                .putBoolean(KEY_BLOCKING_ENABLED, enabled)
                .apply();
    }

    private boolean isAccessibilityServiceEnabled() {
        String expectedServiceName =
                reactContext.getPackageName() + "/" + AppBlockAccessibilityService.class.getName();

        String enabledServices = Settings.Secure.getString(
                reactContext.getContentResolver(),
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        );

        if (enabledServices == null) {
            return false;
        }

        TextUtils.SimpleStringSplitter splitter =
                new TextUtils.SimpleStringSplitter(':');

        splitter.setString(enabledServices);

        while (splitter.hasNext()) {
            String serviceName = splitter.next();

            if (serviceName.equalsIgnoreCase(expectedServiceName)) {
                return true;
            }
        }

        return false;
    }

    private boolean isValidPackageName(String packageName) {
        return packageName != null && packageName.trim().length() > 0;
    }

    private WritableMap createNativeStateMap() {
        WritableMap map = new WritableNativeMap();

        map.putArray("blockedAppsList", createBlockedAppsArray());
        map.putString("currentBlockedApp", currentBlockedApp);
        map.putBoolean("nativeBlockingState", nativeBlockingState);
        map.putBoolean("permissionStatus", permissionStatus);
        map.putString("nativeStatusMessage", nativeStatusMessage);

        return map;
    }

    private WritableArray createBlockedAppsArray() {
        WritableArray array = new WritableNativeArray();

        for (String packageName : blockedAppsList) {
            array.pushString(packageName);
        }

        return array;
    }
}