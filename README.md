# HDC Install Server

A MidwayJS-based Node.js server for installing applications on devices using HDC (Harmony Device Connector).

## Features

- RESTful API for installing applications on devices
- Application caching to avoid redundant downloads
- Single-instance installation to prevent parallel operations
- Automatic cache cleaning for old applications (older than 7 days)
- PM2 integration for process management

## Prerequisites

- Node.js 14.x or later
- HDC command-line tool installed and available in PATH

## Installation

```bash
# Install dependencies
npm install

# Build the application
npm run build
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode with PM2

```bash
npm run pm2
```

## API Endpoints

### Install Application

```
POST /api/install
```

Request body:

```json
{
  "appUrl": "https://example.com/app.hap",
  "deviceIp": "192.168.1.100",
  "devicePort": 5555
}
```

### Get Server Status

```
GET /api/status
```

### Clean Cache Manually

```
POST /api/clean-cache
```

### Get Cache Information

```
GET /api/cache-info
```

## Configuration

Configuration files are located in `src/config/`:

- `config.default.ts`: Default configuration
- `config.local.ts`: Local development configuration
- `config.prod.ts`: Production configuration

## License

ISC
