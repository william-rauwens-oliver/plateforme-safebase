# Environment Variables

This document describes all environment variables used in SafeBase.

## Required Variables

### ENCRYPTION_KEY

**Required in production**

Encryption key for database passwords. Must be a base64-encoded 32-byte key.

**Generation:**
```bash
openssl rand -base64 32
```

**Example:**
```env
ENCRYPTION_KEY=your-generated-key-here-base64-32-bytes
```

**Note:** In development, a default key is used (not secure). In production, the application will refuse to start without this key.

## Optional Variables

### API_KEY

API key for protecting endpoints. If not set, the API is accessible without authentication (development only).

**Generation:**
```bash
openssl rand -hex 32
```

**Example:**
```env
API_KEY=your-api-key-here
```

### CORS_ORIGIN

Allowed origin for CORS. Defaults to allow all origins.

**Example:**
```env
CORS_ORIGIN=http://localhost:5173
```

### DATA_DIR

Directory for storing metadata files. Defaults to `/app/data`.

**Example:**
```env
DATA_DIR=/app/data
```

### BACKUPS_DIR

Directory for storing backup files. Defaults to `/backups`.

**Example:**
```env
BACKUPS_DIR=/backups
```

### RETAIN_PER_DB

Number of backup versions to keep per database. Defaults to `10`.

**Example:**
```env
RETAIN_PER_DB=10
```

### SCHEDULER_API_URL

API URL for the scheduler service. Defaults to `http://api:8080`.

**Example:**
```env
SCHEDULER_API_URL=http://api:8080
```

### ALERT_WEBHOOK_URL

Webhook URL for alerts (Slack, Teams, HTTP). Optional.

**Example:**
```env
ALERT_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### NODE_ENV

Node.js environment. Set to `production` for production deployments.

**Example:**
```env
NODE_ENV=production
```

## Testing Variables

### VALIDATE_CONNECTION

Set to `0` to disable database connection validation (testing only). Defaults to `1`.

**Example:**
```env
VALIDATE_CONNECTION=0
```

### FAKE_DUMP

Set to `1` to enable fake dump mode (testing only). Defaults to `0`.

**Example:**
```env
FAKE_DUMP=1
```

## Example .env File

Create a `.env` file in the project root:

```env
# Required in production
ENCRYPTION_KEY=your-encryption-key-here

# Optional
API_KEY=your-api-key-here
CORS_ORIGIN=http://localhost:5173
DATA_DIR=/app/data
BACKUPS_DIR=/backups
RETAIN_PER_DB=10
SCHEDULER_API_URL=http://api:8080
NODE_ENV=development
```

## Security Notes

- Never commit `.env` files to version control
- Use strong, randomly generated keys in production
- Rotate keys regularly
- Use different keys for different environments
- The `.env` file is already in `.gitignore`

