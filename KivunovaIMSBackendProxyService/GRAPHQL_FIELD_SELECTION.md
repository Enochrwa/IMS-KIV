# GraphQL Field Selection Guide

## Overview

This GraphQL API supports **field selection**, allowing clients to specify exactly which fields they want in the response. This is a core feature of GraphQL that reduces over-fetching and gives you complete control over the response structure.

## How It Works

When you make a GraphQL query or mutation, you can specify exactly which fields you want in the response. The API will only return the fields you request, even though the full response object is available.

## Examples

### Example 1: Login Mutation - Request Only Specific Fields

**Request:**
```graphql
mutation {
  login(input: {email: "user@example.com", password: "password123"}) {
    code
    accessToken
  }
}
```

**Response:**
```json
{
  "data": {
    "login": {
      "code": "LOGIN_SUCCESS",
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

Notice that `refreshToken` and `emailVerified` are not returned because they weren't requested.

### Example 2: Login Mutation - Request All Fields

**Request:**
```graphql
mutation {
  login(input: {email: "user@example.com", password: "password123"}) {
    code
    accessToken
    refreshToken
    emailVerified
  }
}
```

**Response:**
```json
{
  "data": {
    "login": {
      "code": "LOGIN_SUCCESS",
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "emailVerified": true
    }
  }
}
```

### Example 3: Authorize Mutation - Selective Field Selection

**Request:**
```graphql
mutation {
  authorize(input: {
    accessToken: "token_here"
    refreshToken: "refresh_token_here"
  }) {
    code
    authorized
    userId
    role
  }
}
```

**Response:**
```json
{
  "data": {
    "authorize": {
      "code": "OK",
      "authorized": true,
      "userId": "user123",
      "role": "ADMIN"
    }
  }
}
```

Notice that `companyId`, `storeId`, `accessToken`, and `refreshToken` are not returned.

### Example 4: Validate Token Query - Minimal Response

**Request:**
```graphql
query {
  validateToken(input: {token: "token_here"}) {
    valid
    code
  }
}
```

**Response:**
```json
{
  "data": {
    "validateToken": {
      "valid": true,
      "code": "OK"
    }
  }
}
```

### Example 5: Validate Token Query - Full Response

**Request:**
```graphql
query {
  validateToken(input: {token: "token_here"}) {
    valid
    code
    userId
    role
    companyId
    storeId
  }
}
```

**Response:**
```json
{
  "data": {
    "validateToken": {
      "valid": true,
      "code": "OK",
      "userId": "user123",
      "role": "ADMIN",
      "companyId": "company456",
      "storeId": "store789"
    }
  }
}
```

### Example 6: Register Mutation - Selective Fields

**Request:**
```graphql
mutation {
  register(input: {
    company: { name: "Company Name", ... }
    admin: { firstName: "John", ... }
    store: { name: "Store Name", ... }
  }) {
    code
    companyId
    userId
  }
}
```

**Response:**
```json
{
  "data": {
    "register": {
      "code": "REGISTERED",
      "companyId": "company123",
      "userId": "user456"
    }
  }
}
```

## Benefits

1. **Reduced Payload Size**: Only request the data you need
2. **Better Performance**: Less data transferred over the network
3. **Flexibility**: Different clients can request different fields for the same mutation/query
4. **Type Safety**: GraphQL validates that requested fields exist in the schema

## Important Notes

- All fields defined in the GraphQL schema are available for selection
- You can request any combination of fields from a response type
- Fields marked with `!` (non-null) are required in the schema but optional in your query
- Nested objects also support field selection (when applicable)
- The response structure matches exactly what you request

## Available Response Types

All mutations and queries support field selection. Here are the main response types:

- `LoginResponse`: `code`, `accessToken`, `refreshToken`, `emailVerified`
- `AuthorizeResponse`: `code`, `authorized`, `userId`, `role`, `companyId`, `storeId`, `accessToken`, `refreshToken`
- `ValidateTokenResponse`: `valid`, `code`, `userId`, `role`, `companyId`, `storeId`
- `RegisterResponse`: `code`, `companyId`, `userId`, `companyStatus`, `adminStatus`, `storeId`, `storeStatus`
- `RefreshResponse`: `code`, `accessToken`, `refreshToken`
- And many more...

## Testing Field Selection

You can test field selection using:
- GraphQL Playground (if enabled)
- GraphiQL (if enabled)
- Any GraphQL client (Apollo, Relay, etc.)
- Direct HTTP POST requests to `/graphql` endpoint

Example using curl:
```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { login(input: {email: \"test@example.com\", password: \"pass\"}) { code accessToken } }"
  }'
```
