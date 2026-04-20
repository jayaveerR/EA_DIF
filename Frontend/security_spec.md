# EA-DIF Firestore Security Specification

## Data Invariants
1. Students records can only be created by authenticated staff (admins).
2. Alerts must have a valid `student_id` matching an existing student record.
3. Timestamps must use `request.time`.
4. Risk scores must be between 0 and 100.

## The Dirty Dozen (Vulnerability Test Payloads)

1. **Identity Spoofing**: Attempting to create a student record with a different researcher's UID.
2. **Schema Poisoning**: High-risk flag with `risk_score` as a string instead of a number.
3. **Data Pollution**: Student record with a 5MB base64 string in the `grade` field.
4. **ID Injection**: Alert document with an ID containing malicious script characters.
5. **Backdated Entry**: Forcing a `timestamp` from 1990 to bypass drift monitoring.
6. **Self-Promotion**: Non-admin user trying to create an alert.
7. **Orphaned Write**: Creating an alert for a non-existent student ID.
8. **Shadow Field Update**: Updating a student record to include an `is_admin` boolean.
9. **Bulk Scrape**: Querying all alerts without being signed in.
10. **Terminal State Bypass**: Modifying an alert after its status has been set to 'Resolved'.
11. **Negative Risk**: Setting a risk score of -50 to hide anomalies.
12. **Attendance Inflation**: Setting `attendance_percentage` to 150%.

## Security Assertion
All the above payloads MUST return `PERMISSION_DENIED`.
