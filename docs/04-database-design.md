# 🗃 Database Design Document

**Project:** E-Commerce Backend API
**Database:** MongoDB
**ODM:** Mongoose
**Version:** 1.0.0

---

# 1. Overview

The system uses **MongoDB (NoSQL Document Database)** to store application data in structured collections.

The database is designed to:

* Support scalable e-commerce operations
* Maintain data integrity
* Enable efficient querying
* Support relational references where needed
* Ensure normalization where appropriate

---

# 2. Database Architecture

## 2.1 Database Type

* Document-based (NoSQL)
* JSON-like documents (BSON)

## 2.2 Design Approach

* Reference-based relationships (ObjectId)
* Controlled denormalization where needed
* Indexed frequently queried fields
* Soft relational mapping via population

---

# 3. Collections Overview

| Collection | Purpose                                |
| ---------- | -------------------------------------- |
| users      | Store user and admin accounts          |
| categories | Product classification                 |
| products   | Core product data                      |
| variants   | Product variations (size, color, etc.) |
| addresses  | User shipping addresses                |
| carts      | Temporary cart items                   |
| orders     | Confirmed purchases                    |
| payments   | Payment transaction details            |

---

# 4. Collection Schemas

---

# 4.1 Users Collection

## Collection: `users`

### Description

Stores all registered users and admins.

### Schema Structure

| Field     | Type   | Required     | Description      |
| --------- | ------ | ------------ | ---------------- |
| name      | String | Yes          | Full name        |
| email     | String | Yes (Unique) | User email       |
| password  | String | Yes          | Hashed password  |
| role      | String | Yes          | user / admin     |
| createdAt | Date   | Auto         | Account creation |
| updatedAt | Date   | Auto         | Last update      |

### Indexes

* `email` (unique index)

---

# 4.2 Categories Collection

## Collection: `categories`

### Description

Stores product category data.

### Schema Structure

| Field     | Type   | Required     | Description       |
| --------- | ------ | ------------ | ----------------- |
| name      | String | Yes          | Category name     |
| slug      | String | Yes (Unique) | URL-friendly name |
| createdAt | Date   | Auto         | Timestamp         |

### Indexes

* `slug` (unique index)

---

# 4.3 Products Collection

## Collection: `products`

### Description

Stores core product data.

### Schema Structure

| Field       | Type     | Required     | Description           |
| ----------- | -------- | ------------ | --------------------- |
| name        | String   | Yes          | Product name          |
| slug        | String   | Yes (Unique) | SEO-friendly URL      |
| description | String   | Yes          | Product description   |
| category    | ObjectId | Yes          | Reference to Category |
| basePrice   | Number   | Yes          | Base price            |
| images      | Array    | No           | Image URLs            |
| isActive    | Boolean  | Default true | Availability          |
| createdAt   | Date     | Auto         | Timestamp             |

### Relationships

* References `categories._id`
* One-to-many with `variants`

### Indexes

* `slug`
* `category`
* `name`

---

# 4.4 Variants Collection

## Collection: `variants`

### Description

Represents product variations like size, color, stock.

### Schema Structure

| Field      | Type     | Required | Description          |
| ---------- | -------- | -------- | -------------------- |
| product    | ObjectId | Yes      | Reference to product |
| sku        | String   | Yes      | Stock keeping unit   |
| attributes | Object   | Yes      | Size, color, etc.    |
| price      | Number   | Yes      | Variant price        |
| stock      | Number   | Yes      | Available stock      |
| createdAt  | Date     | Auto     | Timestamp            |

### Relationships

* References `products._id`

### Indexes

* `product`
* `sku`

---

# 4.5 Addresses Collection

## Collection: `addresses`

### Description

Stores shipping addresses per user.

### Schema Structure

| Field      | Type     | Required | Description       |
| ---------- | -------- | -------- | ----------------- |
| user       | ObjectId | Yes      | Reference to user |
| fullName   | String   | Yes      | Receiver name     |
| phone      | String   | Yes      | Contact number    |
| street     | String   | Yes      | Address line      |
| city       | String   | Yes      | City              |
| state      | String   | Yes      | State             |
| postalCode | String   | Yes      | ZIP               |
| country    | String   | Yes      | Country           |
| createdAt  | Date     | Auto     | Timestamp         |

### Relationships

* References `users._id`

---

# 4.6 Cart Collection

## Collection: `carts`

### Description

Stores active cart items per user.

### Schema Structure

| Field          | Type     | Required | Description          |
| -------------- | -------- | -------- | -------------------- |
| user           | ObjectId | Yes      | Reference to user    |
| items          | Array    | Yes      | Cart items           |
| items.variant  | ObjectId | Yes      | Reference to variant |
| items.quantity | Number   | Yes      | Quantity selected    |
| updatedAt      | Date     | Auto     | Last update          |

### Relationships

* References `users`
* References `variants`

---

# 4.7 Orders Collection

## Collection: `orders`

### Description

Stores confirmed purchase data.

### Schema Structure

| Field           | Type     | Required | Description                      |
| --------------- | -------- | -------- | -------------------------------- |
| user            | ObjectId | Yes      | Buyer reference                  |
| items           | Array    | Yes      | Ordered products                 |
| items.variant   | ObjectId | Yes      | Purchased variant                |
| items.quantity  | Number   | Yes      | Quantity                         |
| totalAmount     | Number   | Yes      | Total order price                |
| shippingAddress | Object   | Yes      | Snapshot of address              |
| paymentStatus   | String   | Yes      | pending / paid / failed          |
| orderStatus     | String   | Yes      | processing / shipped / delivered |
| createdAt       | Date     | Auto     | Order time                       |

### Relationships

* References `users`
* References `variants`

---

# 4.8 Payments Collection

## Collection: `payments`

### Description

Stores Razorpay transaction details.

### Schema Structure

| Field             | Type     | Required | Description            |
| ----------------- | -------- | -------- | ---------------------- |
| user              | ObjectId | Yes      | Reference to user      |
| order             | ObjectId | Yes      | Related order          |
| razorpayOrderId   | String   | Yes      | Razorpay order ID      |
| razorpayPaymentId | String   | Yes      | Payment ID             |
| razorpaySignature | String   | Yes      | Verification signature |
| status            | String   | Yes      | success / failed       |
| createdAt         | Date     | Auto     | Timestamp              |

---

# 5. Relationships Overview

```
User
 ├── Addresses
 ├── Cart
 ├── Orders
 └── Payments

Category
 └── Products

Product
 └── Variants

Variant
 ├── Cart Items
 └── Order Items
```

---

# 6. Indexing Strategy

To ensure performance:

* Unique index on:

  * email
  * slug
  * sku
* Index on:

  * product reference
  * category reference
  * user reference
  * orderStatus
  * paymentStatus

---

# 7. Data Integrity Rules

* Passwords must be hashed
* Slugs must be unique
* Stock cannot be negative
* Order must not be created without verified payment
* Admin role must be validated at middleware level

---

# 8. Scalability Considerations

Designed to support:

* Horizontal scaling
* MongoDB Atlas cluster
* Read replicas
* Future sharding
* Caching layer (Redis)

---

# 9. Future Enhancements

* Wishlist collection
* Review & rating collection
* Coupon system
* Audit logs
* Soft delete system
* Inventory tracking logs

---

# 10. Conclusion

The database design is:

* Modular
* Scalable
* Optimized for e-commerce workflows
* Secure
* Suitable for production-grade deployment

It supports current features and allows smooth expansion toward enterprise-level architecture.
