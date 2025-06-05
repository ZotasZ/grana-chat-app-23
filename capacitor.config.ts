
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.granaapp.chat',
  appName: 'Grana Chat',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
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
    }
  }
};

export default config;
