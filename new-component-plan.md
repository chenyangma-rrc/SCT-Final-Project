# New Component Research: Express Rate Limiting

## What is Rate Limiting?

Rate limiting controls how many requests users can make to API in certain time. This prevents spam and protects server from crashing.

## Why Express-rate-limit?

I choose `express-rate-limit` because:
- Very simple to use (just few lines of code)
- Popular package 
- Good documentation with clear examples
- Lightweight and fast

## How It Works

It counts requests from same IP address. If too many requests in short time, it blocks the user and returns error message.

Example: Allow 100 requests per 15 minutes. If user sends 101 requests, they get blocked until 15 minutes pass.

## Implementation Plan

### Installation
```bash
npm install express-rate-limit
```

### Create Middleware File
File: `src/middleware/rateLimiter.ts`

Two rate limiters:
1. **General limiter**: 100 requests/15 min for all API routes
2. **Strict limiter**: 5 requests/15 min for future auth routes

### Apply to App
In `app.ts`:
```typescript
app.use('/api/', apiLimiter);
```

This protects all routes under `/api/`.

### Testing
- Use Postman to send many requests quickly
- Verify it blocks after reaching limit
- Check error message is clear

## Integration

Middleware order in my app:
```
helmet → cors → json parser → rate limiter → routes
```

File location: `src/middleware/rateLimiter.ts`

## Benefits

- Prevents API abuse
- Protects from DDoS attacks  
- Makes API more professional
- Easy to implement

## Challenges & Solutions

**Challenge 1**: Hard to test manually
- Solution: Use Postman or simple test script

**Challenge 2**: Don't know best limit numbers
- Solution: Start with 100/15min, adjust based on usage

**Challenge 3**: Might be annoying during development
- Solution: Set high limit in dev environment

## Time Estimate

- Implementation: 1 hour
- Testing: 30 minutes
- Total: 1.5 hours

## Conclusion

Express-rate-limit is good choice for this project. It's simple, effective, and will make my API more secure. I can implement this easily.