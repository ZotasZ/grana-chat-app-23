
# Guia para Gerar APK - FinControl App

## Pré-requisitos

1. **Node.js** instalado (versão 16 ou superior)
2. **Android Studio** instalado
3. **Java SDK** (JDK 11 ou superior)

## Passos para gerar o APK

### 1. Instalar Capacitor (localmente)

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/app @capacitor/browser
```

### 2. Fazer build do projeto

```bash
npm run build
```

### 3. Inicializar Capacitor (se não feito ainda)

```bash
npx cap init
```

### 4. Adicionar plataforma Android

```bash
npx cap add android
```

### 5. Sincronizar arquivos

```bash
npx cap sync android
```

### 6. Configurar OAuth no Supabase

**IMPORTANTE**: Configure no Supabase Dashboard:

1. Vá em Authentication > URL Configuration
2. Adicione em "Redirect URLs":
   - `com.fincontrol.app://callback`
   - `https://seu-dominio.com/` (se tiver)
3. Site URL: `https://seu-dominio.com`

### 7. Configurar Android para OAuth

Edite `android/app/src/main/AndroidManifest.xml`:

```xml
<activity
    android:name=".MainActivity"
    android:exported="true"
    android:launchMode="singleTask"
    android:theme="@style/AppTheme.NoActionBarLaunch">
    
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
    
    <!-- Adicione este intent-filter para OAuth -->
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="com.fincontrol.app" />
    </intent-filter>
</activity>
```

### 8. Abrir no Android Studio

```bash
npx cap open android
```

### 9. Gerar APK no Android Studio

1. No Android Studio, vá em **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2. Aguarde a compilação
3. O APK será gerado em `android/app/build/outputs/apk/debug/`

## Para Google Play Store

1. **Build > Generate Signed Bundle / APK**
2. Escolha **Android App Bundle**
3. Configure keystore (primeira vez) ou use existente
4. Escolha release build
5. O AAB será gerado para upload na Play Store

## Troubleshooting OAuth

### Se o login não funcionar:

1. Verifique se as URLs estão corretas no Supabase
2. Teste primeiro em modo debug
3. Verifique logs no Android Studio: View > Tool Windows > Logcat
4. Para iOS, também configure o URL scheme no Info.plist

### Comandos úteis:

```bash
# Limpar e rebuild
npx cap clean android
npx cap sync android

# Ver logs em tempo real
npx cap run android --livereload

# Para iOS
npx cap add ios
npx cap sync ios
npx cap open ios
```

## Configurações Importantes

- O app será instalado com o ID: `com.fincontrol.app`
- Nome do app: "FinControl"
- Tema verde para splash screen e status bar
- Deep linking configurado para OAuth

## Distribuição

### Android (Google Play):
1. Gere AAB assinado
2. Crie conta de desenvolvedor Google Play (taxa única $25)
3. Faça upload do AAB
4. Preencha informações da loja
5. Submeta para revisão (1-3 dias)

### iOS (App Store):
1. Precisa de Mac com Xcode
2. Conta Apple Developer ($99/ano)
3. Configure certificados e provisioning profiles
4. Archive e upload via Xcode
5. Submeta para revisão (24-48 horas)

**Nota**: Teste sempre em dispositivos físicos antes de submeter às lojas.
