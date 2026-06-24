# NextStep Backend

Run the backend:

```bash
npm run dev:api
```

Default URL:

```text
http://localhost:4000
```

The server uses only built-in Node.js modules, so no extra backend packages are required.

## API

### Health

`GET /api/health`

### Auth

`POST /api/auth/signup`

```json
{
  "name": "Alex Chen",
  "email": "alex@example.com",
  "password": "secret123"
}
```

`POST /api/auth/login`

```json
{
  "email": "alex@example.com",
  "password": "secret123"
}
```

Use the returned token as:

```text
Authorization: Bearer TOKEN
```

`GET /api/me`

### Careers

`GET /api/careers/categories`

`GET /api/careers/categories/engineering`

Supported category IDs:

- `engineering`
- `medical`
- `arts`
- `commerce`
- `government`
- `entrepreneurship`

`GET /api/engineering/colleges`

### Colleges

`GET /api/colleges`

Optional filters:

```text
/api/colleges?state=Tamil%20Nadu
/api/colleges?city=Chennai
/api/colleges?type=Engineering
/api/colleges?q=iit
```

`GET /api/colleges/states`

### Saved Colleges

`POST /api/saved-colleges`

```json
{
  "collegeName": "IIT Bombay"
}
```

`GET /api/saved-colleges`

Both saved-college routes require `Authorization`.

### Exams

`GET /api/exams`

### Scholarships

`GET /api/scholarships`

### Assessments

`POST /api/assessments`

```json
{
  "answers": {
    "interest": "technology",
    "workStyle": "problem-solving"
  }
}
```

## Storage

User accounts, sessions, saved colleges, and assessment answers are stored locally in:

```text
backend/.data/db.json
```

This is good for a local/demo project. For production, replace it with a real database such as PostgreSQL or MongoDB.
