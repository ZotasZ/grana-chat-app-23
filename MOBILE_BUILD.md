
# Guia Completo para Gerar APK - FinControl App

## ⚠️ IMPORTANTE - Leia Primeiro!

Este app está configurado para desenvolvimento com **hot-reload** durante o desenvolvimento. Para produção, você precisará fazer algumas alterações.

## Pré-requisitos

1. **Node.js** instalado (versão 16 ou superior)
2. **Android Studio** instalado e configurado
3. **Java SDK** (JDK 11 ou superior)
4. **Git** instalado

## 🚀 Passos para gerar o APK

### Passo 1: Exportar o projeto do Lovable

1. No Lovable, clique no botão **"Export to Github"** no canto superior direito
2. Conecte sua conta GitHub se necessário
3. Escolha um nome para o repositório
4. Aguarde a exportação completar

### Passo 2: Clonar o projeto localmente

```bash
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO
```

### Passo 3: Instalar dependências

```bash
npm install
```

### Passo 4: Configurar para produção

Edite o arquivo `capacitor.config.ts` e **remova** a configuração de desenvolvimento:

```typescript
// REMOVA ou comente estas linhas:
server: {
  url: 'https://b9dbb900-963b-47f0-9ff6-8f2b654495ad.lovableproject.com?forceHideBadge=true',
  cleartext: true
},
```

O arquivo deve ficar assim:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fincontrol.app',
  appName: 'FinControl',
  webDir: 'dist',
  bundledWebRuntime: false,
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
```

### Passo 5: Fazer build do projeto

```bash
npm run build
```

### Passo 6: Adicionar plataforma Android

```bash
npx cap add android
```

### Passo 7: Sincronizar arquivos

```bash
npx cap sync android
```

### Passo 8: Configurar OAuth no Supabase

**MUITO IMPORTANTE**: Configure no Supabase Dashboard:

1. Vá em **Authentication > URL Configuration**
2. Adicione em **"Redirect URLs"**:
   - `com.fincontrol.app://callback`
   - `https://seu-dominio.com/` (se tiver um domínio próprio)
3. **Site URL**: `https://seu-dominio.com` ou `http://localhost:3000` para desenvolvimento

### Passo 9: Configurar Android para OAuth

Edite o arquivo `android/app/src/main/AndroidManifest.xml`:

Encontre a tag `<activity>` principal e adicione o intent-filter:

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
    
    <!-- ADICIONE ESTE INTENT-FILTER PARA OAUTH -->
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="com.fincontrol.app" />
    </intent-filter>
</activity>
```

### Passo 10: Abrir no Android Studio

```bash
npx cap open android
```

### Passo 11: Gerar APK no Android Studio

1. No Android Studio, aguarde a sincronização do projeto
2. Vá em **Build > Build Bundle(s) / APK(s) > Build APK(s)**
3. Aguarde a compilação (pode demorar alguns minutos na primeira vez)
4. O APK será gerado em `android/app/build/outputs/apk/debug/`

## 📱 Para Google Play Store (Produção)

1. **Build > Generate Signed Bundle / APK**
2. Escolha **Android App Bundle**
3. Configure keystore (primeira vez) ou use existente
4. Escolha **release** build
5. O AAB será gerado para upload na Play Store

## 🔧 Troubleshooting

### Se o login OAuth não funcionar:

1. ✅ Verifique se as URLs estão corretas no Supabase
2. ✅ Verifique se o `AndroidManifest.xml` foi modificado
3. ✅ Teste primeiro em modo debug
4. ✅ Verifique logs no Android Studio: **View > Tool Windows > Logcat**

### Comandos úteis para debugging:

```bash
# Limpar e rebuild
npx cap clean android
npx cap sync android

# Ver logs em tempo real (requer dispositivo conectado)
npx cap run android --livereload

# Para testar no emulador
npx cap run android
```

### Problemas comuns:

1. **"Build failed"**: Execute `npx cap clean android` e tente novamente
2. **"OAuth não funciona"**: Verifique as URLs no Supabase
3. **"App não abre"**: Verifique se o Java SDK está configurado corretamente

## 📋 Checklist final:

- [ ] Projeto exportado do Lovable
- [ ] Dependências instaladas (`npm install`)
- [ ] Configuração de produção no `capacitor.config.ts`
- [ ] Build realizado (`npm run build`)
- [ ] Plataforma Android adicionada
- [ ] URLs configuradas no Supabase
- [ ] AndroidManifest.xml modificado
- [ ] APK gerado com sucesso

## 🚀 Distribuição

### Android (Google Play):
- Taxa única de $25 para conta de desenvolvedor
- Processo de revisão: 1-3 dias
- Formato AAB obrigatório

### iOS (App Store):
- Requer Mac com Xcode
- Conta Apple Developer: $99/ano
- Processo de revisão: 24-48 horas

**✅ Sempre teste em dispositivos físicos antes de submeter às lojas!**
