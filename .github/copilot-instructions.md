# Copilot Instructions for Weather Dashboard

## Architecture Overview

This is a **Next.js full-stack IoT monitoring dashboard** that displays real-time sensor data and power consumption from a home automation system running on Raspberry Pi 5 with InfluxDB backend.

### Key Components:
- **Frontend**: Next.js React (TypeScript + Tailwind CSS) displaying sensor data via components in `src/components/`
- **API Routes**: Next.js API routes (`src/app/api/`) that serve cached data from global stores
- **Backend Services**: Express.js server (`server/`) for Puppeteer-based SolarEdge inverter automation
- **Data Pipeline**: InfluxDB queries in `src/lib/` run via Next.js instrumentation hooks, cache results in global objects, expose via API routes

### Critical Data Flow:
1. **On server startup** (`src/instrumentation.js`), background services initialize:
   - `fetchWeatherAndSensors()` runs immediately, then every 60s → updates `global.weatherStore.cachedData`
   - `fetchPower()` runs immediately, then every 10s → updates `global.powerStore.cachedData`
2. **Frontend components** (`src/components/outside.js`, `inside.js`, `power.js`) fetch from `/api/weather` and `/api/power` routes
3. **API routes** return cached data from global stores; if cache is `null`, return 503 ("Server warming up...")
4. **Fallback polling**: Frontend retries every 10s until data loads to handle startup lag

## Environment & Setup

### Configuration Files:
- **`.env.local`** (required): `INFLUX_TOKEN`, `INFLUX_URL`, `INFLUX_ORG`, `WEATHER_API_KEY`, `PI_FEEDER_URL` (e.g., `http://192.168.1.160:8080`), `NODE_ENV`, `HOST=0.0.0.0`
- **`tailwind.config.cjs`** & **`tailwind.config.ts`**: Dual configs; CSS is in `src/app/globals.css`
- **`tsconfig.json`**: TypeScript config; custom `@/` alias points to `src/`

### Development Commands:
- `npm run dev` (root): Runs **concurrently** server (port 5000) + Next.js client (port 3000)
  - Windows only: `set HOST=0.0.0.0` env var ensures listen on all interfaces (critical for Raspberry Pi Kiosk Mode)
- `npm run server`: Node Express server for SolarEdge login automation
- `npm run client`: Next.js dev server with hot reload

## Project Conventions & Patterns

### Data Fetching Pattern (Must Follow):
**Global Store Pattern** - All InfluxDB queries MUST:
1. Initialize a global singleton in `src/lib/` (e.g., `global.weatherStore`, `global.powerStore`)
2. Export both the store object AND the async fetch function
3. Call fetch function in `instrumentation.js` with `setInterval()` (not `setTimeout()`)
4. Query result stored in `cachedData` field
5. API route returns `{ error: "Server warming up..." }` with **503 status** if `cachedData` is `null`

**Example** ([power_data.js](src/lib/power_data.js#L1)):
```javascript
if (!global.powerStore) {
  global.powerStore = { cachedData: null };
}
global.powerStore.cachedData = { value: rows[0]._value, time: rows[0]._time };
```

### Component Pattern:
- All sensor display components are **client-side** (`"use client"` directive)
- Use `useEffect()` with polling loop that respects 503 status
- Show "Initializing Sensors..." loading state while `loading || !data`
- Example: [outside.js](src/components/outside.js#L1) polls `/api/weather` every 10s

### InfluxDB Query Pattern:
- Always filter by `_measurement` and `_field` (see [weather_data.js](src/lib/weather_data.js#L23-L35))
- Use `last()` to get most recent value
- Queries are Flux format, executed via `@influxdata/influxdb-client`
- **Range time matters**: weather uses `-1d`, power uses `-1h`

### Styling:
- **Tailwind CSS** with custom breakpoints: `hss:` (huge small screen), `sl:` (small landscape)
- **Hardcoded HSL colors**: `"hsl(218, 46%, 8%)"` for dark backgrounds
- Responsive flexbox layouts with negative margins for visual stacking
- Font Awesome icons via `react-fontawesome`

## Critical Gotchas & Debugging

1. **503 on startup**: Normal. Frontend handles retries. Check `instrumentation.js` logs for fetch errors.
2. **Global store pattern**: Must use `global.weatherStore` (not `let store`), or data won't persist across requests.
3. **Dual Tailwind configs**: Both `cjs` and `ts` exist; either works but don't delete either without testing.
4. **Windows vs Raspberry Pi**: `/server/index.js` has commented Raspberry Pi Puppeteer path (`/usr/bin/chromium-browser`); Windows uses default headless browser.
5. **No active polling in components for weather/power**: Components poll `/api/` routes, which are served from memory cache. Direct InfluxDB calls in components = unnecessary database load.

## File Purpose Quick Reference

| File | Purpose |
|------|---------|
| `src/instrumentation.js` | Entry point: starts background fetch loops on server startup |
| `src/lib/weather_data.js` | Queries InfluxDB for sensor data (temp, humidity, voltage) + external weather API |
| `src/lib/power_data.js` | Queries InfluxDB for power consumption from SolarEdge inverter |
| `src/app/api/weather/route.js` | Exposes cached weather data |
| `src/app/api/power/route.js` | Exposes cached power data |
| `src/app/api/feeder/status/route.js` | Proxies feeder status from Pi Feeder service |
| `src/app/api/feeder/feed/route.js` | Proxies POST feed commands to Pi Feeder service |
| `src/app/api/feeder/schedules/route.js` | Proxies GET/POST schedule operations to Pi Feeder service |
| `src/app/feeder/page.tsx` | Feeder dashboard page with status and feed controls |
| `src/components/outside.js` | Displays outdoor temp/humidity from `/api/weather` |
| `src/components/inside.js` | Displays indoor sensors (supports 2 sensor locations) |
| `src/components/power.js` | Gauge chart visualization of power consumption |
| `src/components/navbar.js` | Sidebar navigation (list of metrics) |
| `src/components_feeder/status.js` | Feeder status component with live connection indicator and feed button |
| `server/index.js` | Express server for SolarEdge inverter auto-login (Puppeteer) |

## Feeder Subsystem

**Overview**: Pet feeder control via separate Raspberry Pi service. Next.js acts as proxy; all requests forward to `PI_FEEDER_URL` with `force-dynamic` routing.

**Architecture**:
- `src/app/feeder/page.tsx` → displays feeder dashboard
- `src/components_feeder/status.js` → polls `/api/feeder/status` every 3s, shows connection status (heartbeat-based, <10s tolerance)
- Feeder API routes proxy to external service:
  - **GET** `/api/feeder/status` → returns `{ heartbeat, ... }` 
  - **POST** `/api/feeder/feed` → body `{ duration: 2000 }` → returns `{ ok: boolean, error?: string }`
  - **GET/POST** `/api/feeder/schedules` → schedule management

**Key Points**:
- **Error Handling**: Feed and status routes handle non-JSON responses from Pi (catch and wrap in error message)
- **Connection Check**: Client-side calculates connection status: `Date.now() - new Date(heartbeat).getTime() < 10000`
- **Environment**: Requires `PI_FEEDER_URL` (e.g., `http://192.168.1.160:8080`)
- **Button State**: Feed button disabled when offline or loading

## Integration Points

- **InfluxDB**: Queries via `@influxdata/influxdb-client` in `src/lib/`; ensure `INFLUX_*` env vars set
- **OpenWeatherMap API**: Fetched in `fetchWeatherAndSensors()` for external weather; key in `WEATHER_API_KEY`
- **Pi Feeder Service**: Separate HTTP service (port 8080 on Pi); Next.js proxies requests via `PI_FEEDER_URL` env var
- **SolarEdge Inverter**: Auto-login via Puppeteer in `server/index.js` (separate from Next.js frontend)
- **React Toastify**: Toast notifications for voltage warnings in components

## Typical Workflow for Adding Features

1. **New sensor type?** Create fetch logic in new `src/lib/` file, init global store, add to `instrumentation.js`
2. **New API route?** Add to `src/app/api/`, return cached data with 503 fallback
3. **New component?** Add to `src/components/`, use polling pattern from [outside.js](src/components/outside.js), fetch from `/api/` route
4. **Styling?** Use Tailwind classes; if responsive, account for `hss:` and `sl:` breakpoints
5. **Local testing?** Set `.env.local`, run `npm run dev`; frontend at `http://localhost:3000`, server at `http://localhost:5000`
