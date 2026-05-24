# 🔫 Armas GPS - Backend

Sistema de rastreo GPS en tiempo real para armas. Desarrollado con **NestJS + PostgreSQL + MQTT + WebSockets**.

---

## 🏗️ Arquitectura

```
LILYGO T-SIM7670G-S3
        ↓ MQTT
   NestJS Backend
   ├── REST API (auth, weapons, tracking, alerts)
   ├── WebSocket Gateway (tiempo real)
   └── PostgreSQL (historial + datos)
        ↓ Socket.io
   React Native App
```

---

## 📦 Tecnologías

| Tecnología | Uso |
|---|---|
| NestJS | Framework backend |
| TypeORM | ORM para PostgreSQL |
| PostgreSQL | Base de datos |
| Socket.io | Tiempo real (WebSocket) |
| MQTT | Comunicación con dispositivo GPS |
| JWT + Passport | Autenticación |
| Swagger | Documentación API automática |

---

## 🚀 Instalación

### 1. Requisitos previos
- Node.js >= 18
- PostgreSQL >= 14
- (Opcional) Broker MQTT: HiveMQ público o Mosquitto local

### 2. Clonar e instalar
```bash
git clone <tu-repo>
cd armas-gps-backend
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 4. Crear base de datos PostgreSQL
```sql
CREATE DATABASE armas_gps;
```

### 5. Correr el proyecto
```bash
npm run start:dev
```

---

## 📚 Documentación API

Una vez corriendo: **http://localhost:3000/api/docs**

---

## 📡 WebSocket Events

Conectar a: `ws://localhost:3000/tracking`

```javascript
// Suscribirse a un arma
socket.emit('subscribe_weapon', { weaponId: 'uuid' });

// Recibir ubicación en tiempo real
socket.on('location_update', (data) => console.log(data));
socket.on('new_alert', (data) => console.log(data));
```

---

## 📟 Formato MQTT del LILYGO

Topic: `armas/{codigo}/gps`
```json
{ "lat": 4.1520, "lng": -73.6356, "bat": 85, "acc": 5.2, "spd": 0.0 }
```

---

## 🗂️ Estructura

```
src/
├── auth/           → JWT, login, registro
├── users/          → Gestión de usuarios  
├── weapons/        → CRUD de armas
├── tracking/       → GPS, historial, WebSocket
├── mqtt/           → Conexión con LILYGO
├── alerts/         → Alertas y notificaciones
└── common/         → Guards, decorators
```

---

## 🌐 Deploy gratuito recomendado

- **Railway**: railway.app — PostgreSQL + NestJS en un click
- **Render**: render.com — Plan gratuito disponible
