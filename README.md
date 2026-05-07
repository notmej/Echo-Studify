# Studify Setup Guide

Studify is a React Native / Expo app with custom native Android code for app blocking. Because the project uses native Android files, it **cannot run with Expo Go**. You must build and run the Android app locally using a native build.

Use:

```bash
npx expo run:android
```

Do **not** rely on only:

```bash
npx expo start
```

## Project Requirements

A teammate needs to install:

- Visual Studio Code
- Git
- Node.js LTS
- Android Studio
- Android SDK / Emulator
- Java JDK 17
- Project dependencies with `npm install`

## Important Native Files

This project depends on custom Android files. Make sure these exist after cloning/pulling the repository:

```txt
android/app/src/main/java/com/team2/studify/NativeModuleAppBlock.java
android/app/src/main/java/com/team2/studify/AppBlockPackage.java
android/app/src/main/java/com/team2/studify/AppBlockAccessibilityService.java
android/app/src/main/res/xml/app_block_accessibility_service.xml
android/app/src/main/res/values/strings.xml
android/app/src/main/AndroidManifest.xml
```

If any of these files are missing, the app blocker may fail to build or work.

---

# 1. Install Visual Studio Code

Download and install VS Code:

```txt
https://code.visualstudio.com/
```

Recommended VS Code extensions:

```txt
ES7+ React/Redux/React-Native snippets
Prettier
JavaScript and TypeScript Nightly
GitLens
```

VS Code is only the editor. It does not build Android apps by itself.

---

# 2. Install Git

Git is needed to clone and pull the project from GitHub.

## macOS

Install Homebrew if needed:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then install Git:

```bash
brew install git
```

Check that Git installed correctly:

```bash
git --version
```

## Windows

Download Git for Windows:

```txt
https://git-scm.com/download/win
```

Then check in PowerShell or Git Bash:

```bash
git --version
```

---

# 3. Install Node.js

Install the **LTS** version of Node.js:

```txt
https://nodejs.org/
```

After installing, check:

```bash
node -v
npm -v
```

Use the LTS version, not the newest experimental/current version.

---

# 4. Install Android Studio

Download Android Studio:

```txt
https://developer.android.com/studio
```

During setup, make sure these are installed:

```txt
Android SDK
Android SDK Platform
Android SDK Platform-Tools
Android Emulator
Android SDK Build-Tools
```

You can use either:

- an Android emulator from Android Studio, or
- a physical Android phone with USB debugging enabled.

---

# 5. Set Android Environment Variables

## macOS

Open your shell config file. If you use zsh:

```bash
nano ~/.zshrc
```

Add:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

Save, then run:

```bash
source ~/.zshrc
```

Check:

```bash
echo $ANDROID_HOME
adb version
```

## Windows

Open **Environment Variables** and add:

```txt
ANDROID_HOME = C:\Users\YOUR_NAME\AppData\Local\Android\Sdk
```

Then add these to `Path`:

```txt
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

Restart the terminal, then check:

```bash
adb version
```

---

# 6. Install Java / JDK 17

Android builds need a compatible JDK. Use **JDK 17**.

## macOS with Homebrew

```bash
brew install --cask zulu@17
```

Check:

```bash
java -version
```

## Windows

Install JDK 17 from:

```txt
https://adoptium.net/
```

Then check:

```bash
java -version
```

---

# 7. Clone the Project

In the folder where you want the project:

```bash
git clone YOUR_REPO_URL
cd Studify
```

Example:

```bash
git clone https://github.com/YOUR_USERNAME/Studify.git
cd Studify
```

Then pull the latest code:

```bash
git pull
```

---

# 8. Install Project Dependencies

From the main `Studify` folder:

```bash
npm install
```

This installs dependencies from `package.json`.

Do **not** push `node_modules/` to Git.

---

# 9. Create `android/local.properties`

This file is local to each computer and should **not** be pushed to Git.

Create this file:

```txt
android/local.properties
```

## macOS

Add this, replacing `YOUR_MAC_USERNAME`:

```txt
sdk.dir=/Users/YOUR_MAC_USERNAME/Library/Android/sdk
```

Example:

```txt
sdk.dir=/Users/yuna/Library/Android/sdk
```

## Windows

Add this, replacing `YOUR_WINDOWS_USERNAME`:

```txt
sdk.dir=C:\\Users\\YOUR_WINDOWS_USERNAME\\AppData\\Local\\Android\\Sdk
```

---

# 10. Start an Android Emulator

Open Android Studio.

Go to:

```txt
Tools → Device Manager
```

Create an emulator if needed.

Recommended emulator setup:

```txt
Pixel device
Recent Android API
Google Play image
```

Start the emulator.

Then check that the terminal sees it:

```bash
adb devices
```

Expected output:

```txt
List of devices attached
emulator-5554 device
```

---

# 11. Build and Run the App

From the main `Studify` folder:

```bash
npx expo run:android
```

This builds the native Android project and installs it on the emulator/device.

Do **not** use Expo Go for this project.

You can still start Metro with:

```bash
npx expo start
```

but the app itself must be installed through the native Android build first.

---

# 12. Enable Accessibility Permission

The app blocker uses Android Accessibility Service.

After the app opens:

```txt
1. Go to the App Blocking page.
2. Press Open Permission Settings / Open Accessibility Settings.
3. Android Settings will open.
4. Find Studify.
5. Enable the Studify accessibility service.
6. Go back to Studify.
7. Press Check Permissions.
```

If permission is enabled, the app should show something like:

```txt
Accessibility permission is enabled.
```

---

# 13. Test App Blocking

Use this flow:

```txt
1. Open App Blocking page.
2. Select an app, for example YouTube.
3. Press Save Blocked Apps.
4. Press Start Blocking.
5. Leave Studify.
6. Open YouTube.
7. Studify should reopen / redirect you away from YouTube.
```

The app blocker flow is:

```txt
ViewAppBlock.js
→ ViewModelAppBlock.js
→ AppBlockBridge.js
→ NativeModuleAppBlock.java
→ SharedPreferences
→ AppBlockAccessibilityService.java
```

The selected blocked apps are saved in Android `SharedPreferences`. The accessibility service reads that saved list and reacts when a blocked app appears in the foreground.

---

# 14. Common Build Errors and Fixes

## Error: `resource xml/app_block_accessibility_service not found`

This means this file is missing:

```txt
android/app/src/main/res/xml/app_block_accessibility_service.xml
```

Create the folder:

```bash
mkdir -p android/app/src/main/res/xml
```

Then create:

```txt
android/app/src/main/res/xml/app_block_accessibility_service.xml
```

with:

```xml
<?xml version="1.0" encoding="utf-8"?>
<accessibility-service
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:accessibilityEventTypes="typeWindowStateChanged|typeWindowsChanged"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:accessibilityFlags="flagReportViewIds"
    android:canRetrieveWindowContent="false"
    android:description="@string/app_block_accessibility_description"
    android:notificationTimeout="100" />
```

## Error: `string/app_block_accessibility_description not found`

Open:

```txt
android/app/src/main/res/values/strings.xml
```

Add this inside `<resources>`:

```xml
<string name="app_block_accessibility_description">
  Studify uses accessibility access to detect when selected blocked apps are opened during a focus session.
</string>
```

## Error: `AppBlockModule is not available`

This usually means the native module is not registered or the app was opened through Expo Go.

Check these files:

```txt
android/app/src/main/java/com/team2/studify/AppBlockPackage.java
android/app/src/main/java/com/team2/studify/MainApplication.kt
```

`MainApplication.kt` should include:

```kotlin
override fun getPackages(): List<ReactPackage> =
  PackageList(this).packages.apply {
    add(AppBlockPackage())
  }
```

Then rebuild:

```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

## Error: App opens but no installed apps show

Make sure the native build was rebuilt:

```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

Also check that `AndroidManifest.xml` has the launcher package query:

```xml
<queries>
  <intent>
    <action android:name="android.intent.action.MAIN"/>
    <category android:name="android.intent.category.LAUNCHER"/>
  </intent>
</queries>
```

## Error: App does not block after selecting apps

Check this flow:

```txt
1. Accessibility permission is enabled.
2. You pressed Save Blocked Apps.
3. You pressed Start Blocking.
4. The selected app is actually the app being opened.
```

Then rebuild if needed.

---

# 15. Useful Cleanup Commands

From the main project folder:

```bash
cd android
./gradlew clean
cd ..
npm install
npx expo run:android
```

If Metro cache acts weird:

```bash
npx expo start -c
```

---

# 16. Git Notes

Do not push:

```txt
node_modules/
.expo/
android/.gradle/
android/build/
android/app/build/
android/local.properties
```

But the `android/` folder itself **must be tracked**, because the project contains custom native Android files.

Keep this commented out in `.gitignore`:

```gitignore
#/android
```

Do **not** change it to:

```gitignore
/android
```

or Git will ignore the native Android files.

Recommended `.gitignore` Android section:

```gitignore
# generated native folders
/ios
#/android

# Android build/cache
android/.gradle/
android/build/
android/app/build/
android/local.properties
```

---

# 17. Final Command Summary

For a brand-new teammate:

```bash
git clone YOUR_REPO_URL
cd Studify
npm install
```

Create:

```txt
android/local.properties
```

with their Android SDK path.

Start an emulator in Android Studio.

Then run:

```bash
npx expo run:android
```

After the app opens, enable Accessibility permission for Studify from Android Settings.

---

# 18. Quick Reminder

This project now requires a native Android build.

```txt
Expo Go will not work.
```
