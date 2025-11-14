
# 📮 IIT Jammu Post Office System — API Documentation

This document describes all backend API endpoints for the IIT Jammu Post Office Management System.

Covers:

- Authentication (`server.js`)
- User Routes (`/api/user`)
- Employee Routes (`/api/employee`)
- Admin Routes (`/api/admin`)
- SQL queries executed by each endpoint

---

# 🛡️ Authentication Endpoints (`server.js`)

## **GET /**
Health check  
_No SQL executed_

---

## **POST /login**
Unified login: **admin**, **employee**, **user**

### Body
```json
{
  "username": "string",
  "password": "string",
  "userType": "admin | employee | user"
}

---

### **Admin Login — SQL**

```sql
SELECT 
    EmployeeID AS id, 
    Name, 
    Role, 
    LoginID AS username, 
    PasswordHash, 
    ContactNumber, 
    PostOfficeID, 
    HasAccess
FROM Employee 
WHERE LoginID = ? 
  AND Role = 'Admin' 
  AND HasAccess = TRUE
```

---

### **Employee Login — SQL**

```sql
SELECT 
    EmployeeID AS id, 
    Name, 
    Role, 
    LoginID AS username, 
    PasswordHash, 
    ContactNumber, 
    PostOfficeID, 
    HasAccess
FROM Employee 
WHERE LoginID = ?
  AND HasAccess = TRUE
  AND Role <> 'Admin'
```

---

### **User Login — SQL**

```sql
SELECT 
    PersonID AS id, 
    Name, 
    Email AS username, 
    PasswordHash, 
    ContactNumber
FROM Person 
WHERE Email = ?
```

---

# 👤 User Routes (`/api/user`)

## **GET /profile/:id**

```sql
SELECT 
  p.*, d.DeptName, b.BuildingName
FROM Person p
LEFT JOIN Department d ON p.DeptID = d.DeptID
LEFT JOIN Building b ON p.BuildingID = b.BuildingID
WHERE p.PersonID = ?
```

---

## **POST /signup**

### Body

```json
{
  "name": "...",
  "role": "...",
  "email": "...",
  "password": "...",
  "contactNumber": "...",
  "deptId": 1,
  "buildingId": 1,
  "roomNumber": "101"
}
```

### SQL

```sql
INSERT INTO Person 
  (Name, Role, Email, ContactNumber, DeptID, BuildingID, RoomNumber, PasswordHash)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
```

---

## **GET /parcels/in-transit/:id**

```sql
SELECT *
FROM MailItem
WHERE ReceiverID = ? AND CurrentStatus = 'In Transit'
```

---

## **GET /parcels/history/:id**

```sql
SELECT *
FROM MailItem
WHERE ReceiverID = ?
ORDER BY DateReceived DESC
```

---

## **GET /parcels/upcoming/:id**

```sql
SELECT MailID, BarcodeNo, Type, ExpectedDeliveryDate, CurrentStatus
FROM MailItem
WHERE ReceiverID = ?
  AND CurrentStatus IN ('Pending','Waiting','In Transit')
ORDER BY ExpectedDeliveryDate IS NULL, ExpectedDeliveryDate ASC, MailID DESC
LIMIT 10
```

---

## **GET /parcels/recent-events/:id**

```sql
SELECT 
  te.*, m.BarcodeNo
FROM TrackingEvent te
INNER JOIN MailItem m ON te.MailID = m.MailID
WHERE m.ReceiverID = ?
ORDER BY te.Timestamp DESC
LIMIT 20
```

---

## **GET /delivery-records/:id**

```sql
SELECT 
  dr.*, m.BarcodeNo
FROM DeliveryRecord dr
INNER JOIN MailItem m ON dr.MailID = m.MailID
WHERE m.ReceiverID = ?
ORDER BY dr.DeliveryTime DESC
LIMIT 20
```

---

## **GET /notifications/:id**

```sql
SELECT 
  n.*, m.BarcodeNo, m.CurrentStatus
FROM Notification n
LEFT JOIN MailItem m ON n.MailID = m.MailID
WHERE n.PersonID = ?
ORDER BY n.SentTime DESC
LIMIT 20
```

---

# 👨‍💼 Employee Routes (`/api/employee`)

## **GET /profile/:id**

```sql
SELECT 
  e.*, po.Name AS PostOfficeName, po.Location AS PostOfficeLocation
FROM Employee e
LEFT JOIN PostOffice po ON e.PostOfficeID = po.PostOfficeID
WHERE e.EmployeeID = ?
```

---

## **GET /parcels/assigned/:id**

```sql
SELECT 
  m.*, p.Name AS ReceiverName, p.Email AS ReceiverEmail
FROM MailItem m
LEFT JOIN Person p ON m.ReceiverID = p.PersonID
WHERE m.HandledBy = ?
  AND m.CurrentStatus IN ('Pending','In Transit','Waiting')
ORDER BY m.DateReceived DESC
```

---

## **POST /parcels/update-status**

### Body

```json
{
  "mailId": 1,
  "newStatus": "Delivered",
  "empId": 5
}
```

### SQL 1

```sql
UPDATE MailItem
SET CurrentStatus = ?, HandledBy = ?
WHERE MailID = ?
```

### SQL 2

```sql
INSERT INTO TrackingEvent
  (MailID, Timestamp, EventType, Location, Remarks, HandledBy)
VALUES 
  (?, NOW(), ?, 'Post Office', 'Updated by employee', ?)
```

---

## **POST /parcels/create**

### Body

```json
{
  "barcodeNo": "...",
  "type": "...",
  "mode": "...",
  "senderName": "...",
  "senderAddress": "...",
  "receiverEmail": "...",
  "expectedDeliveryDate": "...",
  "handledBy": 5
}
```

### SQL: Lookup Receiver

```sql
SELECT PersonID FROM Person WHERE Email = ?
```

### SQL: Insert MailItem

```sql
INSERT INTO MailItem 
  (BarcodeNo, Type, Mode, SenderName, SenderAddress, ReceiverID, ExpectedDeliveryDate, CurrentStatus, HandledBy)
VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?)
```

### SQL: Initial Tracking Event

```sql
INSERT INTO TrackingEvent
  (MailID, Timestamp, EventType, Location, Remarks, HandledBy)
VALUES (?, NOW(), 'Received', 'Post Office', 'Created by employee', ?)
```

---

## **GET /parcels/recent-events/:id**

```sql
SELECT 
  te.*, m.BarcodeNo
FROM TrackingEvent te
INNER JOIN MailItem m ON te.MailID = m.MailID
WHERE te.HandledBy = ? OR m.HandledBy = ?
ORDER BY te.Timestamp DESC
LIMIT 25
```

---

# 🛠️ Admin Routes (`/api/admin`)

## **GET /profile/:id**

```sql
SELECT 
  e.*, po.Name AS PostOfficeName
FROM Employee e
LEFT JOIN PostOffice po ON e.PostOfficeID = po.PostOfficeID
WHERE e.EmployeeID = ?
```

---

## **GET /summary**

```sql
SELECT CurrentStatus, COUNT(*) AS Count 
FROM MailItem 
GROUP BY CurrentStatus
```

---

## **GET /metrics**

Runs 7 queries:

### 1. Total parcels

```sql
SELECT COUNT(*) AS totalParcels FROM MailItem
```

### 2. Pending parcels

```sql
SELECT COUNT(*) AS pendingParcels 
FROM MailItem 
WHERE CurrentStatus IN ('Pending','Waiting','In Transit')
```

### 3. Delivered today

```sql
SELECT COUNT(*) AS deliveredToday
FROM TrackingEvent
WHERE EventType='Delivered' AND DATE(Timestamp)=CURDATE()
```

### 4. Returned today

```sql
SELECT COUNT(*) AS returnedToday
FROM TrackingEvent
WHERE EventType='Returned' AND DATE(Timestamp)=CURDATE()
```

### 5. Total users

```sql
SELECT COUNT(*) AS totalUsers FROM Person
```

### 6. Active employees

```sql
SELECT COUNT(*) AS activeEmployees 
FROM Employee 
WHERE HasAccess=TRUE
```

### 7. Average delivery time

```sql
SELECT AVG(TIMESTAMPDIFF(HOUR, m.DateReceived, dr.DeliveryTime)) AS avgDeliveryHours
FROM MailItem m
JOIN DeliveryRecord dr ON dr.MailID=m.MailID
```

---

## **GET /daily-stats**

(7-day statistics)

```sql
WITH date_span AS (...),
received AS (...),
delivered AS (...),
returned AS (...)
SELECT 
  DATE_FORMAT(ds.day, '%Y-%m-%d') AS date,
  COALESCE(r.cnt, 0) AS received,
  COALESCE(d.cnt, 0) AS delivered,
  COALESCE(rt.cnt, 0) AS returned
FROM date_span ds
LEFT JOIN received r ON ds.day = r.day
LEFT JOIN delivered d ON ds.day = d.day
LEFT JOIN returned rt ON ds.day = rt.day
ORDER BY ds.day ASC
```

---

## **GET /parcels**

Optional: `?status=Pending`

### With filter:

```sql
SELECT m.*, p.Name AS ReceiverName, p.Email AS ReceiverEmail
FROM MailItem m
LEFT JOIN Person p ON m.ReceiverID = p.PersonID
WHERE m.CurrentStatus = ?
```

### Without filter:

```sql
SELECT m.*, p.Name AS ReceiverName, p.Email AS ReceiverEmail
FROM MailItem m
LEFT JOIN Person p ON m.ReceiverID = p.PersonID
```

---

# ✅ End of API Documentation

```

---

If you want, I can also:

✅ generate a **Swagger/OpenAPI 3.0** version  
✅ generate a **Postman collection JSON**  
✅ generate a **PDF**  

Just tell me which one.
```
