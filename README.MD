## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

```bash
git clone <your-repo-url>
cd devblog
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
MONGODB_URL=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDNARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDNARY_API_KEY=your_cloudinary_api_key
CLOUDNARY_API_SECRET=your_cloudinary_api_secret
```

### Run the server

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:8000` by default.

## API Endpoints

Base URL: `/api/v1/blog`

### Auth / User

| Method | Endpoint         | Auth Required | Description                  |
|--------|------------------|----------------|-------------------------------|
| POST   | `/register`      | No             | Register a new user           |
| POST   | `/login`         | No             | Log in with username/email    |
| POST   | `/refresh-token` | No (refresh token cookie) | Get a new access token |
| POST   | `/logout`        | Yes            | Log out and clear tokens      |
| GET    | `/profile`       | Yes            | Get logged-in user's profile  |
| PUT    | `/update`        | Yes            | Update username/email/bio/password |
| PATCH  | `/avatar`        | Yes            | Update avatar image           |
| DELETE | `/delete`        | Yes            | Delete own account            |

### Posts

| Method | Endpoint          | Auth Required | Description                    |
|--------|-------------------|----------------|----------------------------------|
| POST   | `/posts`          | Yes            | Create a new post (with cover image) |
| GET    | `/postProfile`    | Yes            | Get all posts by logged-in user |
| GET    | `/post/:id`       | Yes            | Get a single post by ID (increments views) |

### Comments

| Method | Endpoint     | Auth Required | Description             |
|--------|--------------|----------------|---------------------------|
| POST   | `/:id`       | Yes            | Add a comment to a post   |

### Likes

| Method | Endpoint            | Auth Required | Description                |
|--------|---------------------|----------------|------------------------------|
| POST   | `/:postId/like`     | Yes            | Like or unlike a post (toggle) |

## Authentication Flow

1. Register or log in — receive `accessToken` and `refreshToken` as HTTP-only cookies
2. Use `accessToken` to access protected routes
3. When `accessToken` expires, call `/refresh-token` to get a new one
4. Call `/logout` to invalidate the refresh token and clear cookies

## Response Format

All responses follow a consistent shape:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success message"
}
```

Errors:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Roadmap

- [ ] Update / delete post
- [ ] Public post feed (all posts, paginated)
- [ ] Fetch comments for a post
- [ ] Delete own comment
- [ ] Rate limiting on auth routes
- [ ] Automated tests (Jest + Supertest)

## Author

Sadish