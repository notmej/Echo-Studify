# Studify

**A distraction-free study and productivity app for Android.**

Studify helps students organize tasks, manage focus sessions, monitor productivity, and reduce distractions through optional application blocking.

Built with **React Native, Expo, JavaScript, SQLite, and native Android Java**.

> **Development status:** Studify is under active development and is not yet a production release.

## Features

### Focus Timer

- Manage focused study sessions.
- Use the available timer modes.
- Track study time and progress.
- Integrate focus sessions with optional app blocking.

### Task Management

- Create and manage study tasks.
- Track completed and pending tasks.
- Organize daily work.

### Productivity Statistics

- View study activity and productivity statistics.
- Review recorded focus sessions.
- Track daily energy and productivity information.

### App Blocking (Android)

- View installed launcher applications.
- Search and select distracting applications.
- Save or clear the blocked-app selection.
- Restrict selected applications during supported focus sessions.
- Use Android's AccessibilityService API to detect foreground applications.

App blocking is optional. Other Studify features can be used without enabling Accessibility access.

## Technology Stack

| Component            | Technology                   |
| -------------------- | ---------------------------- |
| Framework            | React Native                 |
| Development platform | Expo SDK 54                  |
| Language             | JavaScript                   |
| Navigation           | React Navigation             |
| Local database       | SQLite (`expo-sqlite`)       |
| Local preferences    | AsyncStorage                 |
| Native Android code  | Java and Kotlin              |
| App blocking         | Android AccessibilityService |
| Android build system | Gradle                       |
| Splash screen        | `expo-splash-screen`         |

## Project Structure

```text
Studify/
├── App.js
├── app.json
├── package.json
├── package-lock.json
├── assets/
│   ├── icon.png
│   ├── adaptive-icon.png
│   ├── splash-icon.png
│   └── 25_00.png
├── AppInternals/
│   ├── Views/
│   │   ├── ViewHomePage.js
│   │   ├── ViewAppBlock.js
│   │   ├── ViewToDoDashboard.js
│   │   └── ViewStatisticsDashboard.js
│   ├── ViewModels/
│   │   └── ViewModelAppBlock.js
│   └── ...
├── android/
│   └── app/src/main/
│       ├── java/com/echogritstudio/studify/
│       │   ├── MainActivity.kt
│       │   ├── MainApplication.kt
│       │   ├── AppBlockPackage.java
│       │   ├── NativeModuleAppBlock.java
│       │   └── AppBlockAccessibilityService.java
│       ├── res/xml/
│       │   └── app_block_accessibility_service.xml
│       ├── res/values/
│       │   └── strings.xml
│       └── AndroidManifest.xml
└── README.md
```

Additional Views, ViewModels, components, and assets are maintained inside the project.

## Requirements

Install the following tools before running Studify:

- Git
- Node.js (compatible LTS version)
- npm
- Java JDK 17
- Android Studio
- Android SDK and Platform-Tools
- Android Emulator or an Android phone with USB debugging enabled
- Visual Studio Code or another code editor (optional)

Useful links:

- [Node.js](https://nodejs.org/)
- [Android Studio](https://developer.android.com/studio)
- [JDK 17](https://adoptium.net/)
- [Visual Studio Code](https://code.visualstudio.com/)

**Important:** Studify uses custom native Android code and cannot run its app-blocking functionality in Expo Go. Use a native development build.

## 1. Clone the Repository

```bash
git clone https://github.com/notmej/Echo-Studify.git
cd Echo-Studify
```

All subsequent commands assume you are in the repository's root directory, where `package.json` is located.

To update an existing clone:

```bash
git pull
```

## 2. Install Dependencies

```bash
npm install
```

For a reproducible installation using the committed lockfile, you can use:

```bash
npm ci
```

The project includes dependencies such as:

- `expo`
- `expo-sqlite`
- `expo-splash-screen`
- `@react-native-async-storage/async-storage`
- React Native and React Navigation packages

Do not install arbitrary newer Expo SDK versions without checking compatibility.

## 3. Configure Android

### macOS

Install Android Studio and the required Android SDK components:

- Android SDK Platform
- Android SDK Platform-Tools
- Android SDK Build-Tools
- Android Emulator
- A supported Android system image

If your Android SDK is installed in the default macOS location, add the following to `~/.zshrc`:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/platform-tools"
export PATH="$PATH:$ANDROID_HOME/emulator"
```

Reload the configuration:

```bash
source ~/.zshrc
```

Verify:

```bash
adb version
java -version
```

### Windows

Install Android Studio and JDK 17.

Set `ANDROID_HOME` to your Android SDK directory. The default is commonly:

```text
C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
```

Add the following directories to the system `Path`:

```text
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
```

Restart the terminal and verify:

```bash
adb version
java -version
```

### Android SDK Location

If Gradle cannot find the SDK, create:

```text
android/local.properties
```

On macOS:

```properties
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
```

On Windows, use your installed SDK directory with properly escaped backslashes or forward slashes.

`android/local.properties` is machine-specific and should not be committed.

## 4. Start an Emulator or Connect a Device

In Android Studio:

1. Open Device Manager.
2. Create an Android Virtual Device.
3. Install a compatible Android system image.
4. Start the emulator.

Alternatively, connect an Android phone with USB debugging enabled.

Check connected devices:

```bash
adb devices
```

Expected output resembles:

```text
List of devices attached
emulator-5554    device
```

## 5. Build and Run Studify

From the repository root:

```bash
npx expo run:android --device
```

Select an emulator or connected Android device.

Expo will compile the native Android application, install the development APK, and start Metro.

For a default connected device, you can also run:

```bash
npx expo run:android
```

**Do not use Expo Go for testing native app blocking.**

After the native application has been installed, JavaScript-only changes can normally be applied through Metro's reload functionality without rebuilding the Android APK.

Native Java/Kotlin changes and changes to Android resources require a new native build.

## 6. Accessibility Permission and Consent

Studify's optional app-blocking feature uses Android's AccessibilityService API.

### What the service does

When enabled, the service detects which application is currently in the foreground, including its package identifier.

During a supported focus session, Studify compares the foreground application against the saved blocked-app selection and can redirect the user away from selected applications.

Accessibility access is sensitive because Android accessibility services can potentially observe information about other applications and their interfaces.

### First-launch disclosure

On a fresh installation, Studify displays a disclosure explaining the optional AccessibilityService feature.

Users can choose:

**Not Now**

- Declines the application's consent request.
- Closes the disclosure.
- Allows normal use of Studify without app blocking.

**I Agree & Continue**

- Records affirmative consent locally.
- Opens Android Accessibility Settings.
- Allows the user to manually enable the service.

Selecting "I Agree & Continue" does not automatically grant Android Accessibility access.

### Enabling access later

If the user previously selected "Not Now":

1. Open Studify.
2. Navigate to **App Blocking**.
3. Tap **Enable Access**.
4. Review the Accessibility disclosure.
5. Tap **I Agree & Continue**.
6. Enable Studify in Android Accessibility Settings.
7. Return to Studify.

When Android reports that the service is enabled, the App Blocking page displays **Ready**.

Users can disable the service through Android Settings at any time.

The disclosure and consent implementation should be reviewed against the application's actual native behavior before publication.

## 7. Configure App Blocking

1. Open the App Blocking page.
2. Grant Accessibility access through the consent flow if needed.
3. Browse or search installed applications.
4. Tap **Select** beside an application to add it to the blocking selection.
5. Tap **Remove** to deselect an application.
6. Select **Save Blocked Apps** to save the selection.
7. Start a supported focus session to test blocking.
8. Attempt to open a selected application.
9. Verify that Studify redirects away from the application while blocking is active.

Use **Clear Blocked Apps** to remove the saved blocking selection.

Selecting an app is not the same as immediately starting a focus session.

### Native App-Blocking Architecture

```text
React Native UI
    |
    v
ViewAppBlock.js
    |
    v
ViewModelAppBlock.js
    |
    v
AppBlockBridge.js
    |
    v
NativeModuleAppBlock.java
    |
    v
Android SharedPreferences
    |
    v
AppBlockAccessibilityService.java
```

The native service reads the configured application list and responds to relevant accessibility events.

The React Native bridge is registered through `AppBlockPackage.java` in `MainApplication.kt`.

## 8. App Branding

Studify uses a dark forest-green and gold visual identity.

The primary interface colors include:

```text
Background:    #091B15
Surface:       #102820
Raised card:   #19362C
Emerald:       #28765A
Ivory:         #F3EFE2
Gold:          #C3A777
```

### Icon Assets

```text
assets/icon.png
assets/adaptive-icon.png
assets/splash-icon.png
```

- `icon.png`: Main square icon artwork.
- `adaptive-icon.png`: Transparent foreground logo for Android adaptive icons.
- `splash-icon.png`: Image used by the native splash screen.

Android launchers control the final adaptive icon mask, which may appear circular or rounded-square.

### Splash Screen

The splash screen is configured through the `expo-splash-screen` plugin in `app.json`, with a dark-green background.

When modifying native branding resources:

1. Back up or commit the existing Android changes.
2. Update the relevant image assets and `app.json`.
3. Apply native configuration changes carefully.
4. Rebuild the Android application.

Because the project contains custom native code, avoid:

```bash
npx expo prebuild --clean
```

A clean prebuild can regenerate the native Android directory and remove manually maintained native files.

If prebuild is necessary, use:

```bash
npx expo prebuild --platform android
```

Review the resulting changes to `android/` before committing or distributing the build.

## 9. Fresh Installation

To completely uninstall Studify from a connected Android emulator or device:

```bash
adb uninstall com.echogritstudio.studify
```

Reinstall:

```bash
npx expo run:android --device
```

This is useful for testing:

- The first-launch experience.
- Accessibility disclosure.
- Initial database setup.
- Default preferences.
- Newly installed app behavior.

**Warning:** Uninstalling removes the application's locally stored data, including tasks, preferences, and saved consent information. Verify the Android service state separately after reinstalling.

## 10. Troubleshooting

### Expo Attempts to Install an Unexpected SDK

If `npx expo` attempts to install a newer Expo SDK, verify your terminal is inside the repository root:

```bash
pwd
ls package.json
```

Then:

```bash
npm install
npx expo run:android --device
```

Do not approve an unexpected SDK upgrade.

### AppBlockPackage Class Not Found

If the application crashes with:

```text
ClassNotFoundException:
com.echogritstudio.studify.AppBlockPackage
```

Verify that the file exists:

```text
android/app/src/main/java/com/echogritstudio/studify/AppBlockPackage.java
```

And that the package declaration is:

```java
package com.echogritstudio.studify;
```

`MainApplication.kt` should register the package:

```kotlin
override fun getPackages(): List<ReactPackage> =
  PackageList(this).packages.apply {
    add(AppBlockPackage())
  }
```

Compile the custom Java module:

```bash
cd android
./gradlew :app:compileDebugJavaWithJavac
```

Check for its compiled class:

```bash
find app/build -name "AppBlockPackage.class"
```

Successful compilation does not necessarily guarantee that Android can load the class from the installed APK.

If the application still crashes, inspect Android's runtime logs and confirm the correct APK is installed.

### Build Fails Due to Stale Native Files

From the repository root, try removing generated Android build outputs:

```bash
rm -rf android/app/.cxx
rm -rf android/app/build
```

Then rebuild:

```bash
npx expo run:android --device
```

These commands do not remove the native source files under `android/app/src/main`.

### Metro Reports "No Apps Connected"

This generally indicates that Metro cannot currently communicate with a running React Native instance.

Check:

```bash
adb devices
```

Then try launching the installed application:

```bash
adb shell am start -n \
com.echogritstudio.studify/.MainActivity
```

To inspect Android runtime crashes:

```bash
adb logcat -d -s AndroidRuntime:E
```

A successful Gradle build does not guarantee that the app will launch successfully.

### Accessibility Permission Does Not Appear

Android Accessibility access does not use a standard runtime permission dialog.

Studify shows its own disclosure and then opens Android Accessibility Settings after affirmative consent.

If the disclosure was already acknowledged, use the **Enable Access** button on the App Blocking page to reopen it when permission is disabled.

To test first launch, use a fresh installation on a test device.

### Installed Apps List Is Empty

Check that:

- The native Android module is available.
- The application has been rebuilt after native changes.
- The installed-app query configuration is present in the Android manifest.
- The device actually has launchable applications installed.

The Android manifest may require the relevant launcher-intent query:

```xml
<queries>
    <intent>
        <action
            android:name="android.intent.action.MAIN" />
        <category
            android:name="android.intent.category.LAUNCHER" />
    </intent>
</queries>
```

Verify compatibility with the installed Android version.

### App Blocking Does Not Work

Check that:

1. Android Accessibility access is enabled.
2. The app is included in the saved blocked-app selection.
3. A supported focus session is active.
4. The foreground application matches the saved package name.
5. The native AccessibilityService is running.

Test on a physical Android device as well as an emulator.

## 11. Git and Native Files

The `android/` directory must remain tracked because Studify contains custom native Java and Kotlin code.

Do not commit generated files such as:

```text
node_modules/
.expo/
android/.gradle/
android/build/
android/app/build/
android/app/.cxx/
android/local.properties
```

Do not ignore the entire `android/` directory.

Before changing native configuration, create a Git commit:

```bash
git add .
git commit -m "Backup native Android configuration"
```

Review modifications after running Expo prebuild:

```bash
git status
git diff -- android/
```

## 12. Preparing for Production

Before publishing Studify:

- [ ] Verify clean installation and successful startup.
- [ ] Fix all reproducible native and JavaScript crashes.
- [ ] Test Accessibility consent, including declining and retrying.
- [ ] Review the actual native service data access and behavior.
- [ ] Test app blocking on physical Android devices.
- [ ] Test timers, tasks, persistence, and statistics.
- [ ] Check dependency compatibility and security findings.
- [ ] Prepare a public privacy policy.
- [ ] Complete Google Play Accessibility API and Data Safety declarations.
- [ ] Prepare screenshots, descriptions, and store listing graphics.
- [ ] Configure production signing and versioning.
- [ ] Generate and test a signed Android App Bundle.
- [ ] Complete any required Google Play testing.

The debugging APK produced by `expo run:android` is not the final Google Play release artifact.

## 13. Useful Commands

| Task                   | Command                                    |
| ---------------------- | ------------------------------------------ |
| Install dependencies   | `npm install`                              |
| Run on Android         | `npx expo run:android --device`            |
| Start Metro            | `npx expo start`                           |
| Clear Metro cache      | `npx expo start -c`                        |
| List connected devices | `adb devices`                              |
| Uninstall Studify      | `adb uninstall com.echogritstudio.studify` |
| Check Expo project     | `npx expo-doctor`                          |
| Inspect changes        | `git status`                               |
| Build Android bundle   | `cd android && ./gradlew bundleRelease`    |

Production builds require suitable release-signing configuration.

## Repository

**GitHub:** [notmej/Echo-Studify](https://github.com/notmej/Echo-Studify)

## Development Notes

Studify was initially developed as an academic team project and is continuing through further development and refinement.

The application combines React Native functionality with custom Android integration for optional application blocking.

## Platform Support

**Android:** Primary supported development platform.

**iOS:** Some React Native functionality may be portable, but the custom Android AccessibilityService-based app-blocking implementation is Android-specific.

---

**Studify — Make your study time count.**
