# Backend Endpoint Required

## GET /api/users/discover

The Discover screen needs a backend endpoint to fetch discoverable users.

### Expected Request
```
GET /api/users/discover
Headers: Authorization: Bearer <token>
```

### Expected Response
```json
{
  "users": [
    {
      "id": "uuid",
      "name": "John Doe",
      "age": 24,
      "education": "University of Example",
      "location": "New York",
      "profileImageUrl": "https://...",
      "photos": ["https://...", "https://..."],
      ...
    }
  ]
}
```

### Requirements
- Should exclude the current authenticated user
- Should exclude users already liked by current user
- Should exclude users who have already liked current user (to show in Likes screen instead)
- Should return users with basic profile information
- Should support pagination (optional for now)

### Implementation Notes
- This endpoint should query the `users` collection
- Filter out current user: `where id != currentUserId`
- Filter out already liked users: `where id NOT IN (likedUserIds)`
- Return users with profileComplete = true
- Order by createdAt DESC (newest first)

### Temporary Workaround
The frontend currently handles the missing endpoint gracefully by:
- Catching the error
- Showing an empty state
- Allowing the app to function for other features

Once this endpoint is implemented, the Discover screen will automatically work.

