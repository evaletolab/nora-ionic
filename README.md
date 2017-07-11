nora-ionic
=============


## Quick Start

Clone the repository

```bash
$ git clone https://github.com/evaletolab/nora-ionic.git
$ cd nora-ionic
```

Install the dependencies

```bash
#NVM (please install and set default node v6.x)
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
npm install -g ionic cordova 
npm install
```


Watch Mode (this will run the Ionic development server)

```bash
ionic serve
```

Adding/Reinstall Cordova Plugins
```bash
ionic state reset
ionic platform add ios
```
* [install others natives plugins](https://ionicframework.com/docs/v2/native/) 

Adding Platforms

```bash
ionic platform add ios
```


Emulate Ionic app on `iPad-Pro`
```bash
ionic emulate ios --target="Ipad-Pro"
```

Emulate Ionic app on Android
```bash
ionic run android
# pour voir le log spécifique à javascript et Ionic
adb logcat CordovaLog:D *:S
```

Run Ionic app on `iPad-Pro` device
```bash
ionic build 
open platforms/ios/NoraIonic.xcodeproj
# Configure xcode to get this settings
```

Adding Android permission in AndroidManifest.xml
```XML
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_LOCATION_EXTRA_COMMANDS" />
```

In config.xml
```XML
<preference name="AndroidPersistentFileLocation" value="Compatibility" />
```

