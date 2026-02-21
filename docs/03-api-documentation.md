# 📡 API Documentation

**Project:** E-Commerce Backend API
**Version:** 1.0.0
**Base URL:** `/api`
**Authentication:** JWT (HTTP-only Cookies)
**Architecture:** RESTful

---

# 1. API Overview

This API provides:

* User Authentication & Authorization
* Role-Based Access Control (RBAC)
* Product & Category Management
* Variant Management
* Cart Management
* Order Processing
* Address Management
* Payment Integration (Razorpay)
* Admin Dashboard & Reporting

---

# 2. Authentication Model

Authentication uses JWT stored in **HTTP-only cookies**.

Protected routes require:

* `authUser` middleware
* `adminAuth` middleware (for admin-only routes)

---

# 3. Standard Response Format

### Success Response

```json
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

---

# 4. Authentication APIs

---

## 🔹 Register User

**POST** `/api/auth/register`
**Access:** Public

### Request Body

```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "password123"
}
```

### Response

* `201 Created`
* `400 Bad Request`

---

## 🔹 Login

**POST** `/api/auth/login`
**Access:** Public

### Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Response

* `200 OK`
* Sets JWT cookie

---

## 🔹 Logout

**POST** `/api/auth/logout`
**Access:** Authenticated User

Clears authentication cookie.

---

## 🔹 Get Current User Profile

**GET** `/api/auth/me`
**Access:** Authenticated User

Returns logged-in user data.

---

# 5. User Management (Admin Only)

---

## 🔹 Get All Users

**GET** `/api/users/`
**Access:** Admin

---

## 🔹 Get User By ID

**GET** `/api/users/:id`
**Access:** Admin

---

## 🔹 Delete User

**DELETE** `/api/users/:id`
**Access:** Admin

---

# 6. Category APIs

---

## 🔹 Get All Categories

**GET** `/api/categories/`
**Access:** Public

---

## 🔹 Admin View Categories

**GET** `/api/categories/view`
**Access:** Admin

---

## 🔹 Create Category

**POST** `/api/categories/`
**Access:** Admin

### Request Body

```json
{
  "name": "Electronics"
}
```

---

## 🔹 Update Category

**PUT** `/api/categories/:id`
**Access:** Admin

---

## 🔹 Delete Category

**DELETE** `/api/categories/:id`
**Access:** Admin

---

# 7. Product APIs

---

## 🔹 Get All Products

**GET** `/api/products/`
**Access:** Public

---

## 🔹 Get Product By Slug

**GET** `/api/products/:slug`
**Access:** Public

---

## 🔹 Admin View All Products

**GET** `/api/products/view`
**Access:** Admin

---

## 🔹 Admin View Product By ID

**GET** `/api/products/view/:slug`
**Access:** Admin

---

## 🔹 Create Product

**POST** `/api/products/`
**Access:** Admin

---

## 🔹 Update Product

**PUT** `/api/products/:id`
**Access:** Admin

---

## 🔹 Delete Product

**DELETE** `/api/products/:id`
**Access:** Admin

---

# 8. Variant APIs (Admin Only)

---

## 🔹 Get All Variants

**GET** `/api/variants/view`

---

## 🔹 Create Variant

**POST** `/api/variants/`

---

## 🔹 Update Variant

**PUT** `/api/variants/:id`

---

## 🔹 Delete Variant

**DELETE** `/api/variants/:id`

---

# 9. Address APIs (Authenticated User)

---

## 🔹 Get Addresses

**GET** `/api/address/`

---

## 🔹 Add Address

**POST** `/api/address/`

---

## 🔹 Update Address

**PUT** `/api/address/:id`

---

## 🔹 Delete Address

**DELETE** `/api/address/:id`

---

# 10. Order APIs

---

## 🔹 Create Order

**POST** `/api/orders/`
**Access:** Authenticated User

---

## 🔹 Get My Orders

**GET** `/api/orders/my-orders`
**Access:** Authenticated User

---

## 🔹 Get Order Details

**GET** `/api/orders/:id`
**Access:** Authenticated User

---

## 🔹 Admin Get All Orders

**GET** `/api/orders/`
**Access:** Admin

---

## 🔹 Update Order Status

**PUT** `/api/orders/:id/status`
**Access:** Admin

---

# 11. Cart APIs (Authenticated User)

---

## 🔹 Get Cart

**GET** `/api/cart/`

---

## 🔹 Add to Cart

**POST** `/api/cart/`

---

## 🔹 Update Cart Item

**PUT** `/api/cart/:variantId`

---

## 🔹 Remove Cart Item

**DELETE** `/api/cart/:variantId`

---

## 🔹 Clear Cart

**DELETE** `/api/cart/clear`

---

# 12. Payment APIs (Razorpay Integration)

---

## 🔹 Create Razorpay Order

**POST** `/api/payment/create-order`
**Access:** Authenticated User

---

## 🔹 Verify Payment

**POST** `/api/payment/verify`
**Access:** Authenticated User

---

# 13. Admin Dashboard APIs

---

## 🔹 Dashboard Stats

**GET** `/api/admin/dashboard`

---

## 🔹 Inventory Stats

**GET** `/api/admin/inventory`

---

## 🔹 Reports

**GET** `/api/admin/reports`

---

# 14. HTTP Status Codes Used

| Code | Meaning      |
| ---- | ------------ |
| 200  | OK           |
| 201  | Created      |
| 400  | Bad Request  |
| 401  | Unauthorized |
| 403  | Forbidden    |
| 404  | Not Found    |
| 500  | Server Error |

---

# 15. Access Control Matrix

| Module          | Public | User | Admin |
| --------------- | ------ | ---- | ----- |
| Auth            | ✅      | ✅    | ✅     |
| Users           | ❌      | ❌    | ✅     |
| Categories      | ✅      | ❌    | ✅     |
| Products        | ✅      | ❌    | ✅     |
| Variants        | ❌      | ❌    | ✅     |
| Address         | ❌      | ✅    | ❌     |
| Orders          | ❌      | ✅    | ✅     |
| Cart            | ❌      | ✅    | ❌     |
| Payment         | ❌      | ✅    | ❌     |
| Admin Dashboard | ❌      | ❌    | ✅     |

---

# 16. Security Considerations

* JWT stored in HTTP-only cookies
* Role-based middleware enforcement
* Admin routes protected
* No sensitive data exposed
* Payment verification required before order confirmation

---

# 17. Versioning Strategy

Future-ready for:

```
/api/v1/
/api/v2/
```

---

# 18. Future Enhancements

* Rate limiting
* API throttling
* Logging system
* Swagger/OpenAPI documentation
* Monitoring & analytics