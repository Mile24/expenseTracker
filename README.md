# Expense Tracker Backend

Express.js backend using Firebase Authentication (Email/Password) and MongoDB (Mongoose).

Setup

1. Copy `.env.example` to `.env` and fill values.
2. Place your Firebase service account JSON file and set `SERVICE_ACCOUNT_PATH` to its path in `.env`.
3. Set `FIREBASE_API_KEY` (from Firebase project -> Web app -> Config) in `.env`.
4. Install dependencies:

```bash
npm install
```

Run

```bash
npm run dev
# or
npm start
```

Endpoints

1.POST http://localhost:5000/api/register
Body JSON: { "email": "you@example.com", "password": "secret123" }

Reponse 
    {
    "message": "User registered successfully",
    "uid": "1aaJLj8lHaZpcjONORnvoUCMJTN2"
    }

Repeated Register
{
    "message": "The email address is already in use by another account."
}


2.Login:
POST http://localhost:5000/api/login
Body JSON: { "email": "john@example.com", "password": "secret123" }
Use returned token as Authorization: Bearer <token> for logout

    Reponse 
        {
    "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM4MTFiMDdmMjhiODQxZjRiNDllNDgyNTg1ZmQ2NmQ1NWUzOGRiNWQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZXhwZW5zZWxvZ2luLThhMWQyIiwiYXVkIjoiZXhwZW5zZWxvZ2luLThhMWQyIiwiYXV0aF90aW1lIjoxNzY2MDcyODYzLCJ1c2VyX2lkIjoiSFVIMFVkTVcxRlMwV2NSNjRSbnk1aDd1bG1tMiIsInN1YiI6IkhVSDBVZE1XMUZTMFdjUjY0Um55NWg3dWxtbTIiLCJpYXQiOjE3NjYwNzI4NjMsImV4cCI6MTc2NjA3NjQ2MywiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImpvaG5AZXhhbXBsZS5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.FuTPXRDCUE_bQRnEsm_9UJrqImHMQXUogc_b2MsSseRY0dGI5i6_fsyqd6J18inpj6Dm0eV6xkQBkXHhJquY-XDeADY-ZP4gu3Cp0EcbAV50Npbn0loly0c_CQpbIZb2KTbUix6ecDuLSuWKuE2eOmXT-i2HMSp8Lw_QWiB_zg_OmSMINCzE4HhSBOb-ccuXgBxIdt4GyQDuVNNQx1pA7u2AcGZev_ljLjdbcv7vJpzqmB1Pnq9yz9oUQu68tTn3BbMn1_bhU-oD6VP7c-BPzx4cOVQUqoDhLZloW9l6cXQ-ghn-hPw2eU4tu4ld0fYsb3MkzbnZkj52DmEg49ZYlQ",
    "message": "Login successful"
}

Invalid login
    input json  { "email": "jhn@example.com", "password": "secret123" }
    output json {
    "message": "INVALID_LOGIN_CREDENTIALS"
}


3.Logout:
POST http://localhost:5000/api/logout
Header: Authorization: Bearer <token>

    {
    "message": "Logout successful"
    }



4.POST http://localhost:5000/api/expenses
Header: Authorization: Bearer <token>
Body:
        {
  "title": "Lunch",
  "amount": 15.50,
  "category": "Food",
  "date": "2025-12-18"
}

output json 
    {
    "message": "Expense added successfully",
    "id": "694422f6edd150253a10eb6d"
}

5.Method: GET
URL: http://localhost:5000/api/expenses/67643f8c9b2d1e5a2c8f9a01
Header: Authorization: Bearer <token>


            [
    {
        "_id": "6943a607d5afbeb4bf2ef0ea",
        "uid": "HUH0UdMW1FS0WcR64Rny5h7ulmm2",
        "title": "Lunch at Italian Restaurant",
        "amount": 25.99,
        "category": "Food",
        "date": "2025-12-18T00:00:00.000Z",
        "createdAt": "2025-12-18T06:58:15.548Z",
        "__v": 0
    },
    {
        "_id": "6943aa49a8d0bc93d52516a3",
        "uid": "HUH0UdMW1FS0WcR64Rny5h7ulmm2",
        "title": "Lunch",
        "amount": 15.5,
        "category": "Food",
        "date": "2025-12-18T00:00:00.000Z",
        "createdAt": "2025-12-18T07:16:25.658Z",
        "__v": 0
    },
    {
        "_id": "6943aaa6a8d0bc93d52516a6",
        "uid": "HUH0UdMW1FS0WcR64Rny5h7ulmm2",
        "title": "Movie ticket",
        "amount": 15.5,
        "category": "entertainment",
        "date": "2025-12-18T00:00:00.000Z",
        "createdAt": "2025-12-18T07:17:58.116Z",
        "__v": 0
    },]


6. Method post
URL: http://localhost:5000/api/expenses


    {
    "_id": "694422f6edd150253a10eb6d",
    "uid": "HUH0UdMW1FS0WcR64Rny5h7ulmm2",
    "title": "medicine",
    "amount": 122.5,
    "category": "health",
    "date": "2025-11-18T00:00:00.000Z",
    "createdAt": "2025-12-18T15:51:18.546Z",
    "__v": 0
}


7. PUT /api/expenses/:id (Update expense)
Method: PUT
URL: http://localhost:5000/api/expenses/67643f8c9b2d1e5a2c8f9a01
Header: Authorization: Bearer <token>
Content-Type: application/json

json body

    {
  "title": "Lunch at Italian Restaurant",
  "amount": 25.99,
  "category": "Food",
  "date": "2025-12-18"
}

reponse 
        {
    "message": "Expense updated successfully"
}



Incorrect token 
    {
    "message": "Invalid or expired token"
}



8. Method: DELETE
URL: http://localhost:5000/api/expenses/67643f8c9b2d1e5a2c8f9a01
Header: Authorization: Bearer <token>
No body needed

response
    {
    "message": "Expense deleted successfully"
}




9. Method: GET
URL: http://localhost:5000/api/reports/monthly?month=12&year=2025
Header: Authorization: Bearer <token>

{
    "total": 56.989999999999995,
    "categories": {
        "Food": 41.489999999999995,
        "entertainment": 15.5
    }
}


10. Method: GET
URL: http://localhost:5000/api/reports/category?category=entertainment
Header: Authorization: Bearer <token>

[
    {
        "id": "6943aaa6a8d0bc93d52516a6",
        "title": "Movie ticket",
        "amount": 15.5,
        "date": "2025-12-18T00:00:00.000Z"
    }
]

Postman notes

- Use the `/api/login` response `token` as the `Authorization` header for protected routes: `Bearer <token>`.

Security notes

- This server creates users via Firebase Admin and signs-in via Firebase REST API to obtain ID tokens.
- `logout` revokes refresh tokens so new ID tokens cannot be obtained using refresh tokens.

