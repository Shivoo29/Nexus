# Nexus API Documentation

Complete API reference for the Nexus platform backend.

---

## Base URL

```
Development: http://localhost:3001
Production:  https://api.nexus-ide.dev
```

All API endpoints are prefixed with `/api`

---

## Authentication

Most endpoints require authentication using JWT tokens.

### How to Authenticate

Include the JWT token in the `Authorization` header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Getting a Token

Tokens are obtained by:
1. Signing up (`POST /api/auth/signup`)
2. Logging in (`POST /api/auth/login`)
3. OAuth login (GitHub/Discord)

---

## Response Format

### Success Response

```json
{
  "message": "Success message",
  "data": { /* response data */ }
}
```

### Error Response

```json
{
  "error": "Error message",
  "stack": "Error stack (development only)"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Endpoints

### Authentication

#### Sign Up

Create a new user account.

**Endpoint:** `POST /api/auth/signup`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "message": "Account created successfully",
  "user": {
    "id": "clx123...",
    "email": "john@example.com",
    "name": "John Doe",
    "avatar": null,
    "createdAt": "2025-11-18T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation:**
- Email must be valid
- Password must be at least 8 characters
- Name is required

---

#### Login

Authenticate an existing user.

**Endpoint:** `POST /api/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "user": {
    "id": "clx123...",
    "email": "john@example.com",
    "name": "John Doe",
    "avatar": null,
    "hasCompletedOnboarding": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `401` - Invalid email or password
- `403` - Account deactivated

---

#### Get Current User

Get the authenticated user's information.

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "clx123...",
    "email": "john@example.com",
    "name": "John Doe",
    "avatar": null,
    "role": "fullstack",
    "languages": ["typescript", "python"],
    "theme": "dark",
    "aiProvider": "gemini",
    "hasCompletedOnboarding": true,
    "emailVerified": false,
    "createdAt": "2025-11-18T12:00:00.000Z"
  }
}
```

---

#### Logout

Logout the current user.

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

---

### User Management

#### Get Profile

Get user profile information.

**Endpoint:** `GET /api/users/profile`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "clx123...",
    "email": "john@example.com",
    "name": "John Doe",
    "avatar": "https://...",
    "role": "fullstack",
    "languages": ["typescript", "python"],
    "theme": "dark",
    "aiProvider": "gemini",
    "hasCompletedOnboarding": true,
    "emailVerified": false,
    "createdAt": "2025-11-18T12:00:00.000Z",
    "updatedAt": "2025-11-18T12:30:00.000Z",
    "lastLoginAt": "2025-11-18T12:00:00.000Z"
  }
}
```

---

#### Update Profile

Update user profile information.

**Endpoint:** `PUT /api/users/profile`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Body:**
```json
{
  "name": "John Smith",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:** `200 OK`
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "clx123...",
    "email": "john@example.com",
    "name": "John Smith",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

---

#### Update Onboarding

Save onboarding preferences.

**Endpoint:** `PUT /api/users/onboarding`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Body:**
```json
{
  "role": "fullstack",
  "languages": ["typescript", "python", "rust"],
  "theme": "dark",
  "aiProvider": "gemini"
}
```

**Response:** `200 OK`
```json
{
  "message": "Onboarding completed successfully",
  "user": {
    "id": "clx123...",
    "role": "fullstack",
    "languages": ["typescript", "python", "rust"],
    "theme": "dark",
    "aiProvider": "gemini",
    "hasCompletedOnboarding": true
  }
}
```

---

#### Change Password

Change user password.

**Endpoint:** `POST /api/users/change-password`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password changed successfully"
}
```

**Errors:**
- `400` - Cannot change password for OAuth users
- `401` - Current password is incorrect

---

#### Delete Account

Permanently delete user account.

**Endpoint:** `DELETE /api/users/account`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK`
```json
{
  "message": "Account deleted successfully"
}
```

**Note:** This action is irreversible.

---

### Contact & Newsletter

#### Submit Contact Form

Send a message to the Nexus team.

**Endpoint:** `POST /api/contact`

**Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "type": "general",
  "message": "I have a question about Nexus..."
}
```

**Message Types:**
- `general` - General inquiry
- `support` - Technical support
- `sales` - Sales & enterprise
- `partnership` - Partnership opportunities
- `feedback` - Product feedback

**Response:** `201 Created`
```json
{
  "message": "Message sent successfully. We will get back to you soon!",
  "id": "clx456..."
}
```

**Validation:**
- Name is required
- Email must be valid
- Message must be 10-5000 characters

---

#### Subscribe to Newsletter

Subscribe to the Nexus newsletter.

**Endpoint:** `POST /api/contact/newsletter/subscribe`

**Body:**
```json
{
  "email": "jane@example.com"
}
```

**Response:** `201 Created`
```json
{
  "message": "Successfully subscribed to newsletter!"
}
```

---

#### Unsubscribe from Newsletter

Unsubscribe from the newsletter.

**Endpoint:** `POST /api/contact/newsletter/unsubscribe`

**Body:**
```json
{
  "email": "jane@example.com"
}
```

**Response:** `200 OK`
```json
{
  "message": "Successfully unsubscribed from newsletter"
}
```

---

#### Join Waitlist

Join the early access waitlist.

**Endpoint:** `POST /api/contact/waitlist`

**Body:**
```json
{
  "email": "jane@example.com",
  "name": "Jane Smith",
  "reason": "I'm excited to try Nexus because..."
}
```

**Response:** `201 Created`
```json
{
  "message": "Successfully joined the waitlist!",
  "position": 142
}
```

---

### Health Check

#### API Health

Check if the API is running.

**Endpoint:** `GET /api/health`

**Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2025-11-18T12:00:00.000Z",
  "uptime": 12345
}
```

---

## Rate Limiting

The API is rate-limited to prevent abuse:

- **Window:** 15 minutes
- **Max Requests:** 100 per window per IP

When rate limit is exceeded:

**Response:** `429 Too Many Requests`
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

---

## CORS

The API allows requests from:
- `http://localhost:3000` (development)
- `https://nexus-ide.dev` (production)

---

## Error Codes

| Code | Meaning |
|------|---------|
| `AUTH_001` | Invalid or expired token |
| `AUTH_002` | User not found |
| `AUTH_003` | Invalid credentials |
| `USER_001` | Email already registered |
| `USER_002` | Account deactivated |
| `VAL_001` | Validation error |

---

## Webhooks (Coming Soon)

Webhook support for real-time events will be added in a future release.

---

## SDK (Coming Soon)

Official TypeScript SDK will be available soon:

```typescript
import { NexusClient } from '@nexus/sdk'

const client = new NexusClient({ apiKey: 'YOUR_KEY' })
await client.auth.signup({ email, password, name })
```

---

**Last Updated:** 2025-11-18
**Version:** 1.0.0
