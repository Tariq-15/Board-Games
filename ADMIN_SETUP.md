# Admin Setup Guide

## Admin Authentication

**Currently**: Admin panel is accessible without login for development purposes.

### Current Setup

- **No Login Required**: Anyone can access admin pages
- **Development Mode**: Simplified for testing and development
- **Easy Access**: Navigate to `/admin` without authentication

### Future Authentication (When Ready)

When you're ready to implement authentication:

1. Open `lib/auth/admin.ts`
2. Add the user's email to the `ADMIN_EMAILS` array:

```typescript
const ADMIN_EMAILS = [
  'admin@boardgames.com',
  'admin@example.com',
  'your-email@example.com', // Add your email here
]
```

3. Update `components/admin/admin-auth-wrapper.tsx` to restore authentication checks

## Admin Features

You can access all admin features without login:

- **Admin Dashboard**: `/admin` - Overview and statistics
- **Games Management**: `/admin/games` - Manage board games
- **Users Management**: `/admin/users` - Manage user accounts
- **Reviews Management**: `/admin/reviews` - Moderate reviews
- **Settings**: `/admin/settings` - System settings

## Security Notes

- **Development Mode**: No authentication required
- **Not Production Ready**: Implement proper authentication before deploying
- **Future Security**: Will implement email-based admin access when ready
- **Database Security**: Consider using Supabase RLS policies for database-level security

## Testing Admin Access

1. **Navigate to Admin**: Go to `/admin` - you should see the admin dashboard immediately
2. **No Login Required**: Access all admin pages without authentication
3. **Full Access**: All admin features are available for testing

## Enabling Authentication Later

When you're ready to add authentication back:

1. **Restore Auth Wrapper**: Update `components/admin/admin-auth-wrapper.tsx` with the full authentication logic
2. **Add Admin Emails**: Update the `ADMIN_EMAILS` array in `lib/auth/admin.ts`
3. **Test Access**: Verify that only admin emails can access the panel
