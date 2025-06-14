
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fincontrol.app',
  appName: 'FinControl',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    url: 'https://b9dbb900-963b-47f0-9ff6-8f2b654495ad.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#22c55e",
      showSpinner: false
    },
    StatusBar: {
      style: 'LIGHT_CONTENT',
      backgroundColor: "#22c55e"
    },
    App: {
      appUrlOpen: {
        iosCustomScheme: "com.fincontrol.app",
        androidCustomScheme: "com.fincontrol.app"
      }
    }
  }
};

export default config;
