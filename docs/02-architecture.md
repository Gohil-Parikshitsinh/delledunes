# 🏗 Architecture Document

**Project:** E-Commerce Backend API
**Version:** 1.0.0
**Architecture Style:** Layered (MVC-Based REST Architecture)

---

# 1. Architecture Overview

The E-Commerce Backend API follows a **Layered MVC (Model–View–Controller) Architecture** designed for scalability, maintainability, and clear separation of concerns.

The system processes requests through structured layers:

```
Client → Routes → Middlewares → Controllers → Database
```

Each layer has a clearly defined responsibility, ensuring modular development and clean code organization.

---

# 2. High-Level System Architecture

```
                ┌──────────────────────┐
                │      Client App      │
                │ (React / Frontend)   │
                └──────────┬───────────┘
                           │ HTTP Request
                           ▼
                ┌──────────────────────┐
                │      Express API     │
                └──────────┬───────────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
      Routes Layer    Middleware Layer   Controllers
            │              │              │
            └──────────────┼──────────────┘
                           ▼
                    Database Layer
                        (MongoDB)
```

---

# 3. Architectural Principles

The system follows these core principles:

### 3.1 Separation of Concerns

Each component handles only its own responsibility:

* Routes → Define endpoints
* Middlewares → Handle cross-cutting concerns (auth, role validation)
* Controllers → Business logic
* Models → Database structure

### 3.2 Stateless API Design

The API is stateless. Each request must contain authentication credentials (JWT token in cookies).

### 3.3 Modular Structure

Each feature (User, Product, Category) is modularized.

### 3.4 Middleware-Driven Security

Authentication and role-based authorization are enforced at the middleware layer before business logic executes.

---

# 4. Folder Structure Architecture

```
/controllers
    userController.js
    productController.js
    categoryController.js

/models
    User.js
    Product.js
    Category.js

/routes
    userRoutes.js
    productRoutes.js
    categoryRoutes.js

/middlewares
    userAuth.js
    adminAuth.js

/config
    db.js

/server.js
```

---

# 5. Request Lifecycle

Every HTTP request follows this lifecycle:

```
1. Client sends HTTP request
2. Route matches endpoint
3. Middleware executes:
     - Authentication
     - Authorization
4. Controller processes business logic
5. Database query executed
6. Response returned to client
```

---

# 6. Middleware Architecture

Middleware plays a critical role in system security.

## 6.1 Authentication Middleware

Responsibilities:

* Extract JWT from cookies
* Verify token signature
* Decode user identity
* Attach user context to request object

Output:

* `req.userId`
* `req.userRole`

Failure Cases:

* Missing token → 401 Unauthorized
* Invalid/Expired token → 401 Unauthorized

---

## 6.2 Authorization Middleware (RBAC)

Responsibilities:

* Check if user role equals "admin"
* Block non-admin access to restricted routes

Failure Case:

* Unauthorized role → 403 Forbidden

---

## 6.3 Middleware Flow Example

Admin-only route execution:

```
GET /api/users

→ authUser middleware
→ adminAuth middleware
→ getAllUser controller
```

If either middleware fails, controller is never executed.

---

# 7. Controller Layer

Controllers contain:

* Business logic
* Validation logic (basic)
* Database operations
* Response formatting

Controllers do NOT:

* Handle authentication
* Handle routing definitions
* Directly manage server configuration

Example responsibilities:

* Create product
* Update product
* Delete user
* Fetch records

---

# 8. Database Architecture

## 8.1 Database Type

* MongoDB (NoSQL Document Database)

## 8.2 ODM

* Mongoose

## 8.3 Design Approach

The database uses:

* Document-based schemas
* Referencing between collections (e.g., product → category)
* Population for relational data

Example relationship:

```
Product → references → Category
Order → references → User
```

---

# 9. Authentication Architecture

The system uses JWT-based authentication.

## Flow:

1. User logs in
2. Server generates JWT
3. JWT stored in HTTP-only cookie
4. Protected routes verify token
5. User context attached to request

Security Measures:

* Token signed with secret key
* Expiration handling
* No sensitive data in payload

---

# 10. Authorization Model (RBAC)

The system implements Role-Based Access Control:

Roles:

* user
* admin

Access Levels:

| Route Type       | Access            |
| ---------------- | ----------------- |
| Public Routes    | No auth required  |
| Protected Routes | Auth required     |
| Admin Routes     | Auth + Admin role |

---

# 11. API Design Architecture

The API follows RESTful standards:

* Resource-based URLs
* Proper HTTP methods
* Structured JSON responses
* Standard status codes

Example:

```
GET     /api/products
POST    /api/products
PUT     /api/products/:id
DELETE  /api/products/:id
```

---

# 12. Error Handling Strategy

The system handles errors using:

* Structured JSON responses
* Consistent status codes:

  * 200 OK
  * 201 Created
  * 400 Bad Request
  * 401 Unauthorized
  * 403 Forbidden
  * 404 Not Found
  * 500 Internal Server Error

Error responses follow a consistent format:

```json
{
  "success": false,
  "message": "Error description"
}
```

---

# 13. Security Architecture

Security is enforced through multiple layers:

* JWT token validation
* Role-based middleware
* Controlled error responses
* Secure environment variables
* No exposure of internal server logic

Future security enhancements:

* Rate limiting
* Input validation middleware
* Helmet
* Logging system

---

# 14. Scalability Considerations

The architecture supports:

* API versioning (`/api/v1`)
* Modular feature addition
* Microservice extraction (future)
* Integration with caching (Redis)
* Load balancer support

---

# 15. Deployment Architecture (Planned)

Production deployment may include:

```
Client (React)
        ↓
Load Balancer
        ↓
Node.js API Server
        ↓
MongoDB Cluster
```

Optional:

* Docker containerization
* Cloud deployment (AWS / Render / Railway)

---

# 16. Non-Functional Architecture Goals

* Maintainable codebase
* Modular structure
* Secure authentication
* Clear separation of layers
* Scalable database structure
* Consistent response formatting

---

# 17. Future Architecture Evolution

The system can evolve into:

* Microservices architecture
* Event-driven architecture
* Service-based domain separation
* Distributed authentication service
* ML-based recommendation service integration

---

# 18. Conclusion

The E-Commerce Backend API architecture is designed to be:

* Secure
* Modular
* Scalable
* Maintainable
* Production-ready

The layered MVC structure combined with middleware-driven security ensures that the system can grow from an MVP to an enterprise-grade e-commerce platform.