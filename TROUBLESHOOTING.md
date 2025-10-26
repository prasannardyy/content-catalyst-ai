# Troubleshooting Guide

## Issue 1: Email/Password Authentication Not Working

### Quick Fixes:

1. **Check Firebase Console Settings**:
   - Go to: https://console.firebase.google.com/project/contentcatalyst-1d0ea/authentication/providers
   - Make sure **Email/Password** is **ENABLED**
   - Make sure **Email link (passwordless sign-in)** is **DISABLED** (unless you want it)

2. **Check Password Requirements**:
   - Password must be **at least 6 characters**
   - Try with a simple password like: `password123`

3. **Check Email Format**:
   - Use a valid email format: `test@example.com`
   - Don't use spaces or special characters

4. **Clear Browser Cache**:
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or open in incognito/private mode

### Common Error Messages:

- **"Password should be at least 6 characters"** → Use longer password
- **"The email address is badly formatted"** → Check email format
- **"The email address is already in use"** → Try signing in instead of signing up

## Issue 2: Video Generation Network Error

### Status: FIXED ✅
- Updated API client to use mock data instead of calling non-existent backend
- Video generation now works with realistic demo content
- No network errors when creating projects

### What Works Now:
- ✅ Create projects with YouTube URLs
- ✅ Simulate video processing (3 seconds)
- ✅ View generated content (blog, social posts, images)
- ✅ Copy/download content

## Current Application Status:

### ✅ Working Features:
- Google Sign-in authentication
- Project creation and management
- AI content generation (mock data)
- Content viewing and interaction
- User dashboard

### ⚠️ Needs Attention:
- Email/Password authentication (check Firebase settings)

### 🚧 Future Enhancements:
- Real backend API for actual video processing
- Real AI content generation
- User data persistence in Firestore

## Testing Steps:

1. **Test Google Sign-in**: ✅ Working
2. **Test Email/Password**: Follow troubleshooting steps above
3. **Test Project Creation**: ✅ Working (no network errors)
4. **Test Content Generation**: ✅ Working (mock data)

## Need Help?

If email/password still doesn't work:
1. Check browser console for error messages
2. Verify Firebase Authentication is properly enabled
3. Try with different email/password combinations
4. Test in incognito mode