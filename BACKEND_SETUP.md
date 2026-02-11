# Backend API Setup Guide

## Overview
The frontend expects a backend API running on `http://localhost:3010/elpapi`

## Required API Endpoints

### Super Admin Management
All endpoints should be at: `http://localhost:3010/elpapi/super-admin`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/super-admin` | Create new super admin |
| GET | `/super-admin` | Get all super admins |
| GET | `/super-admin/{id}` | Get super admin by ID |
| PATCH | `/super-admin/{id}` | **Update super admin** ⚠️ |
| DELETE | `/super-admin/{id}` | Delete super admin |

## 404 Error Troubleshooting

### Error: "Request failed with status code 404"

This error occurs when trying to update a super admin. The issue is that the backend endpoint is not responding.

**Possible causes and solutions:**

### 1. Backend Server Not Running
```bash
# Start your backend server (Node.js example)
npm run dev
# or
yarn dev
```

**Verify it's running:**
- Open browser: `http://localhost:3010/elpapi/super-admin`
- Should show JSON response (empty array or CORS error is OK, 404 is NOT OK)

### 2. Wrong Backend Port
If your backend runs on a different port, update:
```typescript
// app/api/fapi.ts
const baseUrl = 'http://localhost:YOUR_PORT/elpapi';
```

### 3. Missing PATCH Endpoint
Ensure backend implements PATCH method:

```javascript
// Example Express.js route
router.patch('/super-admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    
    // Update in database
    const updated = await SuperAdmin.findByIdAndUpdate(id, updatedData, { new: true });
    
    res.json({ 
      success: true, 
      data: updated 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});
```

### 4. CORS Issues
If CORS errors appear, configure backend:

```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true
}));
```

## Expected Request/Response Format

### Update Super Admin Request
```typescript
// Frontend sends:
PATCH /elpapi/super-admin/{userId}
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "cnic": "12345-1234567-1",
  "address": "123 Street",
  "image": "https://cloudinary.com/...",
  "role": "Admin",
  "status": "Active",
  "password": "newPassword123" // Optional - only if changing
}
```

### Expected Response
```json
{
  "success": true,
  "data": {
    "_id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "cnic": "12345-1234567-1",
    "address": "123 Street",
    "image": "https://cloudinary.com/...",
    "role": "Admin",
    "status": "Active",
    "createdAt": "2026-02-11T00:00:00Z"
  }
}
```

**OR** (Alternative format)
```json
{
  "_id": "user123",
  "name": "John Doe",
  ...
}
```

The frontend handles both formats: `response.data.data || response.data`

## Debugging Steps

### Step 1: Check Backend Running
```bash
curl http://localhost:3010/elpapi/super-admin
```
- **Expected:** JSON response (array or object)
- **If 404:** Backend down or wrong URL
- **If CORS error:** Normal - browser won't allow it

### Step 2: Monitor Console Logs
When you try to update:
1. Open DevTools (F12 → Console)
2. Look for messages like:
   - `📡 API Request: PATCH http://localhost:3010/elpapi/super-admin/{id}`
   - `✅ API Response: 200` (success)
   - `❌ API Response Error: 404` (not found)

### Step 3: Test with cURL
```bash
# Test GET first
curl http://localhost:3010/elpapi/super-admin

# Test PATCH (replace {id} with actual user ID)
curl -X PATCH http://localhost:3010/elpapi/super-admin/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "email": "updated@example.com"
  }'
```

## Common Issues

### Issue: All API calls return 404
**Solution:** Backend is not running or baseUrl is wrong
```bash
# Verify backend is running
lsof -i :3010  # Mac/Linux
netstat -ano | findstr :3010  # Windows
```

### Issue: Create works but Update fails
**Solution:** Backend might not have PATCH route implemented
- Check backend routes file
- Ensure PATCH `/super-admin/:id` is defined
- Verify it's not a typo (e.g., `/super-admins` vs `/super-admin`)

### Issue: Network fails silently
**Solution:** Check browser DevTools Network tab
1. Press F12
2. Go to Network tab
3. Try to update a user
4. Look at failed request
5. Click it to see response details

## Alternative Backend Endpoint URLs

If your backend uses different routes, update `fapi.ts`:

```typescript
// Option 1: Different API path
const baseUrl = 'http://localhost:3010/api/v1';

// Option 2: Different domain
const baseUrl = 'https://api.yourdomain.com';

// Option 3: Production API
const baseUrl = 'https://elpb.vercel.app/elpapi';
```

## Verification Checklist

- ✅ Backend server is running on port 3010
- ✅ Frontend can access `http://localhost:3010/elpapi/super-admin`
- ✅ Backend implements `PATCH /super-admin/:id`
- ✅ Request/response format matches expected structure
- ✅ CORS is configured (if running on different domain)
- ✅ Database connection is working
- ✅ Authorization/authentication is satisfied

## Need Help?

Check browser console (F12) for:
- API request URL
- HTTP status code
- Error message
- Response body

These logs will show exactly what endpoint is being called and what error the backend returns.

---

**Quick Fix:**
```bash
# Make sure backend is running
cd /path/to/backend
npm start
# Then try updating user again
```

If still 404, check that the backend has `/super-admin/{id}` PATCH endpoint implemented.
