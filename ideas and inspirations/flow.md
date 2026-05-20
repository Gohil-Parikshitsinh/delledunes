**Phase 1 — Foundation**
Things everything else depends on. Do these before writing a single page.

- Folder structure (done ✅)
- `axiosInstance.js` (done ✅)
- `AuthContext` + `useAuth` (done ✅)
- `CartContext` + `useCart` (done ✅)
- `App.jsx` with full routing setup (done ✅)
- `MainLayout` and `AdminLayout` (done ✅)
- `ProtectedRoute` component (guards auth + admin routes) (done ✅)

---

**Phase 2 — API Layer** (done ✅)
One file per domain, all your backend calls live here. No fetch/axios calls scattered inside components.

- `auth.js`, `products.js`, `categories.js`
- `cart.js`, `orders.js`, `address.js`
- `payment.js` (Pending ⚠), `admin.js`

---

**Phase 3 — Storefront Pages**
In order of dependency — simpler pages first.

- Login / Register (done ✅)
- Home (landing page) (done ✅)
- Shop (product listing) (done ✅)
- Product Detail
- Cart (done ✅)
- Checkout + Razorpay integration
- My Orders

---

**Phase 4 — Admin Pages**
- Dashboard
- Products (list + add/edit)
- Orders + status update
- Inventory + low stock
- Customers
- Reports + charts (Recharts)
- Predictions (ML endpoints)

---

**Phase 5 — Polish**
- Loading states / skeletons
- Error handling globally
- Empty states
- Responsiveness pass
- Seasonal theme system (later)