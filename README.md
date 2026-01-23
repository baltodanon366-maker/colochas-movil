# 📱 Colochas Móvil

Aplicación móvil desarrollada con React Native y Expo para el sistema de control de rifas Colochas.

## 📋 Descripción del Proyecto

Aplicación móvil multiplataforma (iOS, Android, Web) para gestionar:
- **Autenticación** de usuarios con roles (Admin/Vendedor)
- **Ventas** de números de rifa (00-99) con múltiples números por venta
- **Turnos** configurables con categorías (Diaria/Tica)
- **Restricciones** de números por turno
- **Historial** de ventas con filtros avanzados
- **Análisis** de números vendidos con estadísticas detalladas
- **Reporte de cierre** por turno con totales por número
- **Cierres de turno** (solo admin)
- **Dashboard** con KPIs y métricas
- **Gestión de usuarios** (solo admin)
- **Impresión térmica** de boletas mediante Bluetooth

## 🛠️ Stack Tecnológico

### Frontend
- **React Native** (v0.74.5)
- **Expo** (v51.0.0)
- **TypeScript** (v5.3.3)
- **React Navigation** (Navegación)
- **Axios** (Cliente HTTP)
- **AsyncStorage** (Almacenamiento local)
- **date-fns** (Manejo de fechas)
- **react-native-bluetooth-escpos-printer** (Impresión térmica)

## 🚀 Instalación Local

### Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (para Android) o Xcode (para iOS)
- La API Colochas_Api corriendo (local o en producción)

### Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd Colochas_Movil

# Instalar dependencias
npm install
```

## 🏃 Ejecutar la Aplicación

### Desarrollo

```bash
npm start
```

Esto iniciará el servidor de desarrollo de Expo. Luego puedes:

- Presionar `a` para abrir en Android
- Presionar `i` para abrir en iOS
- Presionar `w` para abrir en Web
- Escanear el código QR con la app Expo Go en tu dispositivo móvil

### Plataformas Específicas

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 🔌 Configuración de la API

### Desarrollo Local

La aplicación está configurada para conectarse a la API en `src/config/api.config.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3000';
```

### Producción

Para conectar a la API en producción (Render, Vercel, etc.):

1. Edita `src/config/api.config.ts`:

```typescript
const API_BASE_URL = 'https://tu-api.onrender.com'; // URL de tu API en producción
```

2. O usa variables de entorno:

```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
```

Y agrega en `app.json`:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://tu-api.onrender.com"
    }
  }
}
```

## 📱 Generación de APK con EAS Build

### Paso 1: Instalar EAS CLI

```bash
npm install -g eas-cli
```

### Paso 2: Iniciar sesión en Expo

```bash
eas login
```

### Paso 3: Configurar EAS Build

El archivo `eas.json` ya está configurado. Si necesitas ajustarlo:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Paso 4: Configurar Credenciales

```bash
# Para Android (primera vez)
eas build:configure

# Esto creará las credenciales necesarias automáticamente
```

### Paso 5: Generar APK

```bash
# Build de preview (APK para testing)
eas build --platform android --profile preview

# Build de producción (APK para distribución)
eas build --platform android --profile production
```

### Paso 6: Descargar APK

1. EAS Build te dará una URL para seguir el progreso
2. Una vez completado, descarga el APK desde el dashboard de Expo
3. O usa el comando:

```bash
eas build:list
eas build:download [BUILD_ID]
```

### Paso 7: Instalar APK

```bash
# Conecta tu dispositivo Android
adb install path/to/app.apk

# O transfiere el archivo al dispositivo e instálalo manualmente
```

## 🖨️ Configuración de Impresión Bluetooth

### Requisitos

- Impresora térmica compatible con ESC/POS
- Bluetooth habilitado en el dispositivo
- Permisos de Bluetooth y ubicación (para Android 12+)

### Configuración en app.json

Los permisos ya están configurados en `app.json`:

```json
{
  "android": {
    "permissions": [
      "android.permission.BLUETOOTH",
      "android.permission.BLUETOOTH_ADMIN",
      "android.permission.BLUETOOTH_CONNECT",
      "android.permission.BLUETOOTH_SCAN",
      "android.permission.ACCESS_FINE_LOCATION"
    ]
  },
  "ios": {
    "infoPlist": {
      "NSBluetoothAlwaysUsageDescription": "Necesitamos acceso a Bluetooth para imprimir tickets",
      "NSBluetoothPeripheralUsageDescription": "Necesitamos acceso a Bluetooth para imprimir tickets"
    }
  }
}
```

### Uso de la Impresión

1. **Conectar Impresora:**
   - Ve a cualquier venta creada
   - Click en "Imprimir" en el boucher preview
   - Selecciona tu impresora de la lista
   - La app buscará dispositivos Bluetooth emparejados

2. **Imprimir Boletas:**
   - Una vez conectada, las boletas se imprimirán automáticamente
   - El formato incluye:
     - Encabezado con nombre de empresa
     - Número de boucher
     - Fecha y hora
     - Detalles de venta (números y montos)
     - Total
     - Pie de página

### Solución de Problemas de Impresión

- **No encuentra impresora:**
  - Asegúrate de que la impresora esté encendida
  - Empareja la impresora desde los ajustes de Bluetooth del dispositivo
  - Verifica que Bluetooth esté habilitado

- **Error al conectar:**
  - Verifica que la impresora esté dentro del rango de Bluetooth
  - Reinicia Bluetooth en el dispositivo
  - Algunas impresoras requieren estar en "modo emparejamiento"

- **No imprime en APK:**
  - Verifica que los permisos estén correctamente configurados
  - Asegúrate de que el build incluya las dependencias nativas
  - Usa `eas build` en lugar de build local para incluir todas las dependencias

## 📱 Funcionalidades Principales

### Ventas
- Crear ventas con múltiples números (00-99)
- Seleccionar turno activo
- Ingresar montos por número
- Validación de restricciones antes de crear venta
- Vista previa de boucher antes de confirmar
- Historial de ventas del turno actual
- Impresión térmica de boletas

### Historial / Reporte
- Ver historial de ventas propias (vendedor) o de todos los usuarios (admin)
- Filtros por fecha (último día, semana, 15 días, mes, personalizado)
- Filtros por turno (categoría, turno específico)
- Análisis de números vendidos con estadísticas detalladas
- **Reporte de cierre** por turno mostrando los 100 números con totales vendidos

### Restricciones (Solo Admin)
- Restringir números individuales o múltiples
- Tipos de restricción: completa o con límite de monto
- Ver todas las restricciones activas
- Eliminar restricciones

### Cierres de Turno (Solo Admin)
- Ver resumen de ventas por turno
- Cerrar turnos
- Ver estadísticas de cierre

### Dashboard
- KPIs principales
- Resumen de ventas del día
- Turnos activos
- Métricas en tiempo real

### Gestión de Usuarios (Solo Admin)
- Ver todos los usuarios
- Crear nuevos usuarios
- Activar/Desactivar usuarios
- Editar información de usuarios
- Asignar/Remover roles

## 🔐 Autenticación

### Flujo de Autenticación

1. **Registro:**
   - El usuario se registra con email, contraseña y nombre
   - El sistema crea la cuenta con estado `inactivo`
   - Un administrador debe activar la cuenta

2. **Login:**
   - El usuario ingresa email y contraseña
   - El sistema valida las credenciales
   - Se genera un token JWT que se guarda localmente
   - Se redirige a la pantalla principal

3. **Sesión Persistente:**
   - El token JWT se guarda en AsyncStorage
   - La aplicación verifica automáticamente si hay una sesión activa al iniciar
   - Si hay token válido, se redirige automáticamente a la pantalla principal

## 🐛 Solución de Problemas

### Error de conexión a la API

- Verifica que la API esté corriendo y accesible
- Si usas dispositivo físico, asegúrate de usar la IP correcta o URL de producción
- Verifica que el puerto no esté bloqueado por el firewall
- Revisa la configuración en `src/config/api.config.ts`

### Error de CORS

- Asegúrate de que la API tenga CORS habilitado para tu URL
- Revisa la configuración en `Colochas_Api/src/main.ts`
- En producción, configura `CORS_ORIGIN` con la URL de tu app

### Token no se guarda

- Verifica que AsyncStorage esté instalado correctamente
- Revisa los permisos de la aplicación

### Errores de compilación

- Limpia el caché: `npx expo start --clear`
- Elimina `node_modules` y reinstala: `rm -rf node_modules && npm install`
- Para builds con EAS, verifica que todas las dependencias estén en `package.json`

### Problemas con impresión en APK

- Asegúrate de usar `eas build` (no build local) para incluir dependencias nativas
- Verifica que los permisos estén en `app.json`
- Algunas impresoras requieren configuración adicional en el código

## 📝 Notas Importantes

- El token JWT se guarda automáticamente al hacer login
- La sesión persiste entre reinicios de la app
- El token se incluye automáticamente en todas las peticiones protegidas
- Si el token expira (401), se limpia automáticamente y se redirige al login
- La aplicación maneja correctamente las zonas horarias (Nicaragua UTC-6)
- Las fechas y horas se muestran consistentemente en toda la aplicación

## 🎨 Diseño

- **Colores principales**: Verde (#10B981) y Dorado (#F59E0B)
- **Tipografía**: Sistema por defecto
- **Componentes**: Diseño consistente y moderno
- **Navegación**: Bottom tabs para pantallas principales

## 📄 Licencia

Este proyecto es privado y está destinado únicamente para uso interno.

---

**Desarrollado con ❤️ usando React Native y Expo**

**Última actualización:** 2025
