# NestJS App API

Overview

This project implements a complete authentication system in a NestJS application.
It includes email/password login, Google (Gmail) authentication, and JWT-based protection using NestJS Guards.

## 🚀 Features

### 👤 User Management

- **Signup & Verification**
  - Register new users with email confirmation.
  - Resend verification code if needed.

- **Authentication**
  - Login with email/password or Gmail.

- **Password Management**
  - Forget/Reset password flow with token support.

### 🧾 User Profile
- Added new API endpoint to **retrieve the user profile**.
- Returns the authenticated user’s data using access token verification.
- Protected by `AuthenticationGuard` and `AuthorizationGuard`.

### 🧱 Guards & Decorators
- Implemented custom guards:
  - **AuthenticationGuard** – validates JWT tokens.
  - **AuthorizationGuard** – checks user roles.
- Added composite decorator `@Auth()` combining:
  - Token type selection (`access` / `refresh`)
  - Role-based access (`user`, `admin`, etc.)
  - Automatic guard usage

### 🛍️ Brand Management
- **Create Brand** – add new brand.
- **Update Brand** – modify brand details.
- **Update Brand Image** – upload/update brand image.
- **Freeze Brand** – soft delete a brand.
- **Restore Brand** – undo freeze action.
- **Delete Brand** – permanently delete brand.
- **Get All Brands** – retrieve paginated list of brands.

### 🏷️ Category Management
- **Create Category** – add new category.
- **Update Category** – modify category details.
- **Update Category Image** – upload/update category image.
- **Freeze Category** – soft delete a category.
- **Restore Category** – undo freeze action.
- **Delete Category** – permanently delete category.
- **Get All Categories** – retrieve paginated list of categories.

### 🗂️ SubCategory Management
- **Create SubCategory** – add new subcategory.
- **Update SubCategory** – modify subcategory details.
- **Update SubCategory Image** – upload/update subcategory image.
- **Freeze SubCategory** – soft delete a subcategory.
- **Restore SubCategory** – undo freeze action.
- **Delete SubCategory** – permanently delete subcategory.
- **Get All SubCategories** – retrieve paginated list of subcategories.

### 🛒 Product Management
- **Create Product** – add new product with optional image upload and category/subcategory assignment.

## 🧠 Tech Stack
**NestJS – backend framework**  

**@nestjs/jwt – JWT handling**  

**Google Auth Library – Gmail login verification**  

**MongoDB / Mongoose – user storage**  

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MahmoudSalahDev/NestApp
cd NestApp




### 2. Install dependencies:

npm install

### 3. Create a .env file inside a folder called "config" in the root directory with the following variables:

PORT=
DB_URL ="mongodb://127.0.0.1:27017/nestApp"
SALT_ROUNDS = "12"
SECRET_KEY =
SIGNATURE =
ACCESS_TOKEN_USER =
ACCESS_TOKEN_ADMIN =
REFRESH_TOKEN_USER =
REFRESH_TOKEN_ADMIN =
EMAIL =
PASS =
BEARER_USER =
BEARER_ADMIN =



put a value to each one of them


### 4. Run the development server:
npm run start:dev


-------------------------------------------------------
📖 API Reference

Full API documentation is available here:
👉 https://documenter.getpostman.com/view/39713502/2sB3WmS2N4

--------------------------------------------------------
```
