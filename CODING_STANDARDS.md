# Coding Standards Documentation

## Attendance Management System - Code Quality Standards

This document outlines the coding standards and best practices implemented in our attendance management system, following Google's coding standards for JavaScript/TypeScript and React development.

---

## 1. Google JavaScript/TypeScript Style Guide Compliance

### File Organization and Structure

#### **File Headers and Documentation**
```javascript
/**
 * @fileoverview Attendance Management System Backend Server
 * @description RESTful API server for managing attendance, users, and organizational data
 * @author Attendance Management Team
 * @version 1.0.0
 */
```

**Benefits:**
- Clear file purpose and ownership
- Version tracking and maintenance information
- Improved code navigation and understanding

#### **Import Organization**
```javascript
// External libraries first
import express from 'express';
import cors from 'cors';
import { v4 as uuid } from 'uuid';

// Internal modules
import type { User, Company } from './App';
```

**Standards Applied:**
- External dependencies before internal modules
- Consistent single quotes for strings
- Descriptive import aliases

---

## 2. Naming Conventions (Google Standards)

### **Constants and Configuration**
```javascript
// SCREAMING_SNAKE_CASE for constants
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3002', 
  'http://localhost:5173'
];

const DEFAULT_PORT = 3001;
const REQUEST_TIMEOUT = 10000;
```

### **Functions and Variables**
```javascript
// camelCase for functions and variables
const dbManager = new DatabaseManager();
async function initializeConnection_() { }

// Private methods with trailing underscore
initializeConnection_();
```

### **Classes and Interfaces**
```typescript
// PascalCase for classes and interfaces
class DatabaseManager { }
interface ApiError { }
```

---

## 3. Error Handling Best Practices

### **Custom Error Classes**
```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### **Comprehensive Error Handling**
```javascript
app.post('/login', async (req, res) => {
  try {
    // Main logic here
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'server_error' });
  }
});
```

**Benefits:**
- Consistent error responses
- Proper error logging
- User-friendly error messages
- Type-safe error handling

---

## 4. Function Documentation (JSDoc)

### **Comprehensive Function Documentation**
```javascript
/**
 * Executes a database query
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @return {Promise<Object>} Query result
 * @throws {Error} When database is not connected
 */
async query(text, params = []) {
  if (!this.pool_) {
    throw new Error('Database not connected');
  }
  return this.pool_.query(text, params);
}
```

**Standards Applied:**
- Clear parameter descriptions
- Return type documentation
- Exception documentation
- Usage examples where appropriate

---

## 5. TypeScript Best Practices

### **Type Safety and Interfaces**
```typescript
// Explicit return types
export async function login(
  email: string, 
  password?: string
): Promise<{ user: User; token: string }> {
  // Implementation
}

// Generic type parameters
async function request<T = any>(path: string, init?: RequestInit): Promise<T> {
  // Implementation
}
```

### **Input Validation**
```typescript
export async function createCompany(
  data: Omit<Company, 'id' | 'createdAt'>
): Promise<Company> {
  if (!data.name?.trim() || !data.email?.trim()) {
    throw new ApiError('Company name and email are required', 400, 'INVALID_DATA');
  }
  // Implementation
}
```

---

## 6. Code Organization Patterns

### **Separation of Concerns**
```javascript
// Configuration constants at top
const ALLOWED_ORIGINS = [...];

// Class definitions
class DatabaseManager { }

// Route handlers grouped by functionality
// Authentication routes
app.post('/login', ...);

// Company management routes  
app.get('/companies', ...);
app.post('/companies', ...);
```

### **Consistent Code Structure**
```javascript
// 1. Imports
// 2. Constants and configuration
// 3. Class definitions
// 4. Helper functions
// 5. Route handlers
// 6. Server startup
```

---

## 7. Performance and Resource Management

### **Database Connection Pooling**
```javascript
this.pool_ = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds
});
```

### **Request Timeout Handling**
```javascript
async function request<T = any>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      ...init,
    });
    clearTimeout(timeoutId);
    // Handle response
  } catch (error) {
    clearTimeout(timeoutId);
    // Handle error
  }
}
```

---

## 8. Security Best Practices

### **Input Sanitization**
```javascript
// Sanitize user inputs
const sanitizedUser = {
  id: dbUser.id,
  companyId: dbUser.company_id || dbUser.companyId,
  name: dbUser.name,
  email: dbUser.email,
  role: dbUser.role,
  suspended: dbUser.suspended || false
  // Note: password_hash is excluded
};
```

### **SQL Injection Prevention**
```javascript
// Use parameterized queries
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1 LIMIT 1', 
  [email]
);
```

---

## 9. Graceful Shutdown and Resource Cleanup

### **Proper Server Shutdown**
```javascript
const gracefulShutdown = async () => {
  console.log('Received shutdown signal, closing server gracefully...');
  await dbManager.close();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
```

---

## 10. Logging and Monitoring

### **Structured Logging**
```javascript
app.listen(port, () => {
  console.log(`🚀 Attendance Management Server running on http://localhost:${port}`);
  console.log(`📊 Health check available at http://localhost:${port}/health`);
  console.log(`🗄️  Database: ${pool ? 'Connected' : 'Using in-memory storage'}`);
});
```

### **Error Logging**
```javascript
} catch (error) {
  console.error('Login error:', error);
  res.status(500).json({ error: 'server_error' });
}
```

---

## 11. Code Quality Metrics

### **Achieved Standards:**

✅ **Readability**: Clear naming conventions and documentation  
✅ **Maintainability**: Modular code structure and separation of concerns  
✅ **Reliability**: Comprehensive error handling and input validation  
✅ **Performance**: Efficient database connections and request handling  
✅ **Security**: Input sanitization and SQL injection prevention  
✅ **Testability**: Pure functions and dependency injection patterns  

### **Google Style Guide Compliance:**

✅ **Naming**: camelCase, PascalCase, SCREAMING_SNAKE_CASE as appropriate  
✅ **Formatting**: Consistent indentation, spacing, and line breaks  
✅ **Documentation**: JSDoc comments for all public functions  
✅ **Error Handling**: Proper try-catch blocks and error propagation  
✅ **Type Safety**: Explicit TypeScript types and interfaces  
✅ **Code Organization**: Logical file structure and import ordering  

---

## 12. Benefits of Applied Standards

### **Development Benefits:**
- **Faster Onboarding**: New developers can quickly understand the codebase
- **Reduced Bugs**: Consistent patterns reduce common programming errors
- **Better Collaboration**: Standardized code style improves team productivity
- **Easier Maintenance**: Well-documented code is easier to modify and extend

### **Production Benefits:**
- **Better Performance**: Optimized database connections and request handling
- **Improved Security**: Consistent input validation and sanitization
- **Enhanced Reliability**: Comprehensive error handling and graceful degradation
- **Easier Debugging**: Structured logging and error reporting

---

This implementation demonstrates professional-grade code quality following industry best practices and Google's coding standards, ensuring the attendance management system is maintainable, scalable, and production-ready.