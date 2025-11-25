# GraphQL Authentication Guide

This guide shows how to make GraphQL requests with Bearer tokens (Authorization header).

## 🔑 Bearer Token Authentication

For mutations that require authentication (like `logout`, `changePassword`, `authorize`), you need to include the access token in the `Authorization` header.

---

## 📝 Request Examples

### 1. Using cURL (Command Line)

#### Logout Mutation (with Bearer Token)
```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "query": "mutation { logout(input: {_empty: null}) { code } }"
  }'
```

#### Logout Mutation (without Bearer Token - optional)
```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { logout(input: {_empty: null}) { code } }"
  }'
```

#### Change Password Mutation (requires Bearer Token)
```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "query": "mutation { changePassword(input: {currentPassword: \"old123\", newPassword: \"new123\"}) { code } }"
  }'
```

#### Authorize Mutation
```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { authorize(input: {accessToken: \"YOUR_ACCESS_TOKEN\", refreshToken: \"YOUR_REFRESH_TOKEN\"}) { code authorized userId role } }"
  }'
```

---

### 2. Using JavaScript/Fetch API

```javascript
// Logout with Bearer Token
async function logout(accessToken) {
  const response = await fetch('http://localhost:8080/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`  // Bearer token in header
    },
    body: JSON.stringify({
      query: `
        mutation {
          logout(input: {_empty: null}) {
            code
          }
        }
      `
    })
  });

  const result = await response.json();
  return result;
}

// Usage
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
logout(token).then(data => console.log(data));
```

#### Change Password Example
```javascript
async function changePassword(accessToken, currentPassword, newPassword) {
  const response = await fetch('http://localhost:8080/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      query: `
        mutation {
          changePassword(input: {
            currentPassword: "${currentPassword}",
            newPassword: "${newPassword}"
          }) {
            code
          }
        }
      `
    })
  });

  return await response.json();
}
```

---

### 3. Using Axios (JavaScript)

```javascript
import axios from 'axios';

// Logout with Bearer Token
async function logout(accessToken) {
  const response = await axios.post(
    'http://localhost:8080/graphql',
    {
      query: `
        mutation {
          logout(input: {_empty: null}) {
            code
          }
        }
      `
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  return response.data;
}
```

---

### 4. Using Postman

1. **Method**: POST
2. **URL**: `http://localhost:8080/graphql`
3. **Headers**:
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer YOUR_ACCESS_TOKEN_HERE`
4. **Body** (raw JSON):
```json
{
  "query": "mutation { logout(input: {_empty: null}) { code } }"
}
```

---

### 5. Using GraphiQL/GraphQL Playground

If you have GraphiQL enabled, you can set headers in the UI:

1. Open GraphiQL at `http://localhost:8080/graphiql` (if enabled)
2. Look for the "HTTP Headers" section (usually at the bottom)
3. Add:
```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN_HERE"
}
```
4. Then run your mutation:
```graphql
mutation {
  logout(input: {_empty: null}) {
    code
  }
}
```

    > ℹ️ **Header Logging**: Every GraphiQL and GraphQL request logs **ALL request headers** in the backend console. Look for the `=== GraphQL Request Headers ===` section in the logs to see all headers including the `Authorization` bearer token. This helps verify that headers are being sent correctly from the client.

---

### 6. Using Apollo Client (React/JavaScript)

```javascript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// HTTP Link
const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
});

// Auth Link - adds Bearer token to every request
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken'); // Get token from storage

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Create Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

// Use in component
const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout(input: {_empty: null}) {
      code
    }
  }
`;

function LogoutButton() {
  const [logout] = useMutation(LOGOUT_MUTATION);

  const handleLogout = async () => {
    try {
      const { data } = await logout();
      console.log('Logout successful:', data.logout.code);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

---

## 🔍 Important Notes

### Token Format
- The token must be prefixed with `Bearer ` (with a space)
- Format: `Authorization: Bearer <your-token-here>`
- Example: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Which Mutations Need Bearer Token?

**Requires Bearer Token (in header):**
- `logout` - Optional (works with or without token)
- `changePassword` - Required

**Does NOT need Bearer Token (token in request body):**
- `authorize` - Token is in the mutation input, not header
- `login` - No token needed (returns token)
- `refreshToken` - No token needed (uses refresh token in body)

### Logout Mutation Details

The `logout` mutation:
- **Input**: `LogoutInput` with optional `_empty: String` field
- **Authorization**: Optional (Bearer token in header)
- **Response**: Returns `code` exactly as received from identity service

Example:
```graphql
mutation {
  logout(input: {_empty: null}) {
    code
  }
}
```

---

## 🧪 Testing Examples

### Test Logout with Token
```bash
# First, login to get a token
TOKEN=$(curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { login(input: {email: \"test@example.com\", password: \"password123\"}) { accessToken } }"}' \
  | jq -r '.data.login.accessToken')

# Then use the token for logout
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query": "mutation { logout(input: {_empty: null}) { code } }"}'
```

---

## ❌ Common Mistakes

1. **Missing "Bearer " prefix**:
   - ❌ Wrong: `Authorization: YOUR_TOKEN`
   - ✅ Correct: `Authorization: Bearer YOUR_TOKEN`

2. **Token in wrong place**:
   - ❌ Wrong: Putting token in GraphQL input for `logout` or `changePassword`
   - ✅ Correct: Token goes in `Authorization` header

3. **Missing space after "Bearer"**:
   - ❌ Wrong: `Authorization: BearerYOUR_TOKEN`
   - ✅ Correct: `Authorization: Bearer YOUR_TOKEN`

---

## 📚 Related Documentation

- [GraphQL Field Selection Guide](./GRAPHQL_FIELD_SELECTION.md) - Learn how to request specific fields
- [README](./README.md) - Project setup and configuration
