
# Guia para Gerar APK - FinControl App

## Pré-requisitos

1. **Node.js** instalado (versão 16 ou superior)
2. **Android Studio** instalado
3. **Java SDK** (JDK 11 ou superior)

## Passos para gerar o APK

### 1. Instalar Capacitor (localmente)

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### 2. Fazer build do projeto

```bash
npm run build
```

### 3. Inicializar Capacitor

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

### 6. Abrir no Android Studio

```bash
npx cap open android
```

### 7. Gerar APK no Android Studio

1. No Android Studio, vá em **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2. Aguarde a compilação
3. O APK será gerado em `android/app/build/outputs/apk/debug/`

## Configurações Importantes

- O app será instalado com o ID: `com.fincontrol.app`
- Nome do app: "FinControl"
- Tema verde para splash screen e status bar

## Troubleshooting

- Se der erro de permissões, execute: `chmod +x gradlew` na pasta android
- Para APK de produção, configure signing no Android Studio
- Certifique-se que o Android SDK está configurado corretamente

## Distribuição

Após gerar o APK, você pode:
1. Enviar o arquivo `.apk` diretamente para seus amigos
2. Eles precisam habilitar "Fontes desconhecidas" nas configurações do Android
3. Instalar o APK no dispositivo

**Nota**: Para distribuição via Google Play Store, será necessário gerar um AAB (Android App Bundle) assinado.
