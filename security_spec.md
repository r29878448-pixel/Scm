# Security Specification - Sachin Academy Pro

## Data Invariants
1. A user profile (`/users/{uid}`) must be created by the user themselves.
2. User's `purchasedBatches` and `token` are private and should only be readable by the owner.
3. Batches (`/batches/{id}`) are public for reading by authenticated users but only writable by admins.
4. Admins are defined in a top-level collection `/admins/{uid}`.

## The Dirty Dozen (Vulnerability Test Cases)
1. **Identity Spoofing**: User A attempts to create a document in `/users/UserB`. (DENIED)
2. **State Shortcutting**: User attempts to update their own `purchasedBatches` directly without a payment record (if that logic existed). (DENIED - immutability of core fields)
3. **Resource Poisoning**: Attacker sends a 2MB string as a `displayName`. (DENIED - size constraints)
4. **ID Injection**: Attacker uses a 500-character string as a userId. (DENIED - isValidId)
5. **Admin Escalation**: User A attempts to create a document in `/admins/UserA`. (DENIED - admins collection is internal)
6. **PII Leak**: User A tries to `get()` the profile of User B. (DENIED)
7. **Query Scraping**: User tries to list all user documents without filters. (DENIED)
8. **Shadow Field**: User adds `isVerified: true` to their user document during update. (DENIED - hasOnly)
9. **Timestamp Spoofing**: User sends a past date for `lastLogin`. (DENIED - serverTimestamp requirement)
10. **Batch Poisoning**: User tries to update batch price to 0. (DENIED - write restricted to admins)
11. **Orphaned Writes**: User tries to link to a non-existent batch. (DENIED - exists check)
12. **Recursive Attack**: User tries to list thousands of results to drain wallet. (DENIED - list limits)
