-- ============================================================
-- DATABASE INITIALIZATION
-- ============================================================
CREATE DATABASE IF NOT EXISTS IitJammu1;
USE IitJammu1;

-- ============================================================
-- 1️⃣ POST OFFICE
-- ============================================================
CREATE TABLE PostOffice (
  PostOfficeID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(100) UNIQUE NOT NULL,
  Location VARCHAR(100) NOT NULL,
  ContactNumber VARCHAR(20) UNIQUE,
  CHECK (CHAR_LENGTH(ContactNumber) BETWEEN 7 AND 20)
);

INSERT INTO PostOffice (Name, Location, ContactNumber) VALUES
('Central Post','Jammu City','0191-1000001'),
('North Post','IIT Jammu','0191-1000002'),
('South Post','Cantonment','0191-1000003'),
('East Post','Trikuta Nagar','0191-1000004'),
('West Post','Gandhi Nagar','0191-1000005'),
('Admin Block PO','IITJ Campus','0191-1000006'),
('Library PO','IITJ Campus','0191-1000007'),
('Hostel A PO','IITJ Campus','0191-1000008'),
('Hostel B PO','IITJ Campus','0191-1000009'),
('Hostel C PO','IITJ Campus','0191-1000010'),
('Mechanical PO','IITJ Campus','0191-1000011'),
('Electrical PO','IITJ Campus','0191-1000012'),
('Civil PO','IITJ Campus','0191-1000013'),
('Chemical PO','IITJ Campus','0191-1000014'),
('Workshop PO','IITJ Campus','0191-1000015'),
('Sports PO','IITJ Campus','0191-1000016'),
('Security PO','IITJ Campus','0191-1000017'),
('Transport PO','IITJ Campus','0191-1000018'),
('DataCenter PO','IITJ Campus','0191-1000019'),
('Maintenance PO','IITJ Campus','0191-1000020');

-- ============================================================
-- 2️⃣ BUILDING
-- ============================================================
CREATE TABLE Building (
  BuildingID INT PRIMARY KEY AUTO_INCREMENT,
  BuildingName VARCHAR(100) UNIQUE NOT NULL,
  Capacity INT NOT NULL CHECK (Capacity > 0)
);

INSERT INTO Building (BuildingName, Capacity) VALUES
('Egret',250),('Fulgar',400),('Mansar',600),('Pushkar',1000),('Canary',120),
('Admin Block',200),('Library Block',350),('Hostel A',400),('Hostel B',450),
('Hostel C',480),('Workshop',300),('Faculty Housing',100),('Lecture Hall Complex',700),
('Research Block',250),('Sports Complex',300),('Canteen',100),('Security Office',50),
('Transport Office',60),('Data Center',30),('Maintenance Block',80);

-- ============================================================
-- 3️⃣ DEPARTMENT
-- ============================================================
CREATE TABLE Department (
  DeptID INT PRIMARY KEY AUTO_INCREMENT,
  DeptName VARCHAR(100) UNIQUE NOT NULL,
  BuildingID INT,
  FOREIGN KEY (BuildingID) REFERENCES Building(BuildingID)
    ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO Department (DeptName, BuildingID) VALUES
('Computer Science',3),('Electrical',4),('Mechanical',5),('Civil',1),
('Chemical',2),('Physics',6),('Mathematics',7),('Humanities',8),
('Biotechnology',9),('Design',10),('Aerospace',11),('Materials',12),
('IT Support',13),('Library',14),('Sports',15),('Admin Department',16),
('Security',17),('Transport',18),('Maintenance',19),('Cultural',20);

-- ============================================================
-- 4️⃣ EMPLOYEE
-- ============================================================
CREATE TABLE Employee (
  EmployeeID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Role VARCHAR(50) NOT NULL,
  ContactNumber VARCHAR(15) UNIQUE,
  PostOfficeID INT,
  LoginID VARCHAR(50) UNIQUE,
  PasswordHash VARCHAR(255),
  HasAccess BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (PostOfficeID) REFERENCES PostOffice(PostOfficeID)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CHECK (Role IN ('Head Officer','Manager','Assistant Manager','Clerk','Delivery Staff','Admin')),
  CHECK (CHAR_LENGTH(ContactNumber) BETWEEN 7 AND 15)
);

INSERT INTO Employee (Name, Role, ContactNumber, PostOfficeID, LoginID, PasswordHash, HasAccess) VALUES
('Rajesh Kumar','Head Officer','9876500001',1,'rajesh01','hash1',TRUE),
('Anita Singh','Manager','9876500002',2,'anita02','hash2',TRUE),
('Vikram Patel','Assistant Manager','9876500003',3,'vikram03','hash3',TRUE),
('Sonia Verma','Clerk','9876500004',4,NULL,NULL,FALSE),
('Rohit Gupta','Delivery Staff','9876500005',5,NULL,NULL,FALSE),
('Pooja Mehta','Manager','9876500006',6,'pooja06','hash6',TRUE),
('Deepak Sharma','Clerk','9876500007',7,NULL,NULL,FALSE),
('Alok Das','Delivery Staff','9876500008',8,NULL,NULL,FALSE),
('Sneha Rani','Assistant Manager','9876500009',9,'sneha09','hash9',TRUE),
('Gaurav Singh','Manager','9876500010',10,'gaurav10','hash10',TRUE),
('Rita Joshi','Delivery Staff','9876500011',11,NULL,NULL,FALSE),
('Amit Verma','Clerk','9876500012',12,NULL,NULL,FALSE),
('Meena Pandey','Clerk','9876500013',13,NULL,NULL,FALSE),
('Harsh Tiwari','Manager','9876500014',14,'harsh14','hash14',TRUE),
('Ravi Prasad','Delivery Staff','9876500015',15,NULL,NULL,FALSE),
('Admin One','Admin','9000000010',1,'admin1','admin1hash',TRUE),
('Admin Two','Admin','9000000030',1,'admin2','admin2hash',TRUE),
('Admin Three','Admin','9000000031',1,'admin3','admin3hash',TRUE),
('Admin Four','Admin','9000000032',1,'admin4','admin4hash',TRUE),
('Ramesh Khanna','Admin','9000000022',1,'ramesh.admin','admin5hash',TRUE);

-- ============================================================
-- 5️⃣ PERSON
-- ============================================================
CREATE TABLE Person ( 
  PersonID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Role VARCHAR(20) NOT NULL,
  Email VARCHAR(100) UNIQUE NOT NULL,
  ContactNumber VARCHAR(15),
  DeptID INT,
  BuildingID INT,
  RoomNumber VARCHAR(10),
  PasswordHash VARCHAR(255) NOT NULL,
  FOREIGN KEY (DeptID) REFERENCES Department(DeptID)
    ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (BuildingID) REFERENCES Building(BuildingID)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CHECK (Role IN ('Student','Faculty','Staff')),
  CHECK (CHAR_LENGTH(ContactNumber) BETWEEN 7 AND 15)
);

INSERT INTO Person (Name, Role, Email, ContactNumber, DeptID, BuildingID, RoomNumber, PasswordHash) VALUES
('Manogna','Student','2023uma0222@iitjammu.ac.in','7051025654',1,1,'4019','hash1'),
('Bob Verma','Faculty','2020uce0102@iitjammu.ac.in','9000000002',2,2,'2021','hash2'),
('Charlie Singh','Student','2021ume0103@iitjammu.ac.in','9000000003',3,3,'3032','hash3'),
('Diana Kaur','Staff','2019uce0104@iitjammu.ac.in','9000000004',4,1,'4043','hash4'),
('Ethan Gupta','Student','2024umt0105@iitjammu.ac.in','9000000005',5,5,'2032','hash5'),
('Akhil Sharma','Faculty','akhil@iitjammu.ac.in','9000000011',6,4,'E103','hash6'),
('Riya Patel','Student','riya@iitjammu.ac.in','9000000012',3,8,'B204','hash7'),
('Arjun Nair','Staff','arjun@iitjammu.ac.in','9000000013',19,10,'S101','hash8'),
('Sneha Iyer','Student','sneha@iitjammu.ac.in','9000000014',1,9,'C209','hash9'),
('Vikram Rao','Faculty','vikram@iitjammu.ac.in','9000000015',11,11,'FH12','hash10'),
('Priya Jain','Staff','priya@iitjammu.ac.in','9000000016',14,12,'L105','hash11'),
('Karan Das','Student','karan@iitjammu.ac.in','9000000017',7,13,'W03','hash12'),
('Sana Sheikh','Student','sana@iitjammu.ac.in','9000000018',1,8,'A407','hash13'),
('Neha Gupta','Faculty','neha@iitjammu.ac.in','9000000019',6,4,'E202','hash14'),
('Tanya Roy','Staff','tanya@iitjammu.ac.in','9000000020',20,18,'T01','hash15'),
('Abhishek Yadav','Student','abhishek@iitjammu.ac.in','9000000021',10,15,'R02','hash16'),
('Simran Gill','Faculty','simran@iitjammu.ac.in','9000000023',9,14,'L301','hash17'),
('Tejas Rao','Student','tejas@iitjammu.ac.in','9000000024',8,15,'C102','hash18'),
('Madhav Reddy','Student','madhav@iitjammu.ac.in','9000000025',1,8,'A303','hash19'),
('Anjali Sharma','Staff','anjali@iitjammu.ac.in','9000000026',20,17,'Sec2','hash20');

-- ============================================================
-- 6️⃣ MAIL ITEM
-- ============================================================
CREATE TABLE MailItem (
  MailID INT PRIMARY KEY AUTO_INCREMENT,
  BarcodeNo VARCHAR(50) UNIQUE NOT NULL,
  Type VARCHAR(50) NOT NULL,
  Mode VARCHAR(20) NOT NULL,
  SenderName VARCHAR(100),
  SenderAddress VARCHAR(255),
  ReceiverID INT,
  DateReceived DATETIME DEFAULT NOW(),
  ExpectedDeliveryDate DATETIME,
  CurrentStatus VARCHAR(30) DEFAULT 'Pending',
  HandledBy INT,
  FOREIGN KEY (ReceiverID) REFERENCES Person(PersonID)
    ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (HandledBy) REFERENCES Employee(EmployeeID)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CHECK (Mode IN ('Incoming','Outgoing','Internal')),
  CHECK (CurrentStatus IN ('Pending','Waiting','In Transit','Delivered','Returned')),
  CHECK (ExpectedDeliveryDate >= DateReceived)
);

-- (20 rows inserted earlier, same data)

-- ============================================================
-- 7️⃣ TRACKING EVENT
-- ============================================================
CREATE TABLE TrackingEvent (
  EventID INT PRIMARY KEY AUTO_INCREMENT,
  MailID INT NOT NULL,
  Timestamp DATETIME DEFAULT NOW(),
  EventType VARCHAR(50) NOT NULL,
  Location VARCHAR(100),
  Remarks VARCHAR(255),
  HandledBy INT,
  FOREIGN KEY (MailID) REFERENCES MailItem(MailID)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (HandledBy) REFERENCES Employee(EmployeeID)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CHECK (EventType IN ('Received','Dispatched','In Transit','Reached','Delivered','Returned'))
);

-- (20 tracking rows inserted earlier)

-- ============================================================
-- 8️⃣ DELIVERY RECORD
-- ============================================================
CREATE TABLE DeliveryRecord (
  DeliveryID INT PRIMARY KEY AUTO_INCREMENT,
  MailID INT NOT NULL,
  DeliveredBy INT,
  DeliveredTo INT,
  DeliveryTime DATETIME DEFAULT NOW(),
  DeliveryStatus VARCHAR(20) DEFAULT 'On Time',
  SignaturePath VARCHAR(255),
  Remarks VARCHAR(255),
  FOREIGN KEY (MailID) REFERENCES MailItem(MailID)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (DeliveredBy) REFERENCES Employee(EmployeeID)
    ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (DeliveredTo) REFERENCES Person(PersonID)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CHECK (DeliveryStatus IN ('On Time','Delayed','Returned'))
);

-- (20 delivery rows inserted earlier)

-- ============================================================
-- 9️⃣ NOTIFICATION
-- ============================================================
CREATE TABLE Notification (
  NotificationID INT PRIMARY KEY AUTO_INCREMENT,
  MailID INT,
  PersonID INT,
  Message VARCHAR(255),
  SentTime DATETIME DEFAULT NOW(),
  Status VARCHAR(10) DEFAULT 'Sent',
  FOREIGN KEY (MailID) REFERENCES MailItem(MailID)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (PersonID) REFERENCES Person(PersonID)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CHECK (Status IN ('Sent','Read'))
);

-- (20 notification rows inserted earlier)

-- ============================================================
-- 🔟 LOGIN VIEW
-- ============================================================
CREATE OR REPLACE VIEW LoginStatusView AS
SELECT 
    PersonID AS ID,
    Name,
    Email AS Username,
    Role,
    'User' AS AccessLevel,
    'Person' AS SourceTable
FROM Person
UNION ALL
SELECT 
    EmployeeID AS ID,
    Name,
    LoginID AS Username,
    Role,
    CASE WHEN HasAccess THEN 'Employee' ELSE 'NoAccess' END AS AccessLevel,
    'Employee' AS SourceTable
FROM Employee;



SELECT * FROM PostOffice;
SELECT * FROM Building;
SELECT * FROM Department;

SELECT * FROM Employee;
SELECT * FROM Person;
use IitJammu1;
SELECT * FROM MailItem;
use IitJammu1;
SELECT * FROM TrackingEvent;
use IitJammu1;
SELECT * FROM DeliveryRecord;
use IitJammu1;
SELECT * FROM Notification;
use IitJammu1;
SELECT * FROM LoginStatusView;
use IitJammu1;
INSERT INTO MailItem 
(BarcodeNo, Type, Mode, SenderName, SenderAddress, ReceiverID, ExpectedDeliveryDate, CurrentStatus, HandledBy)
VALUES
('B001', 'Letter', 'Incoming', 'India Post', 'Central Post Office, Jammu', 1, NOW() + INTERVAL 2 DAY, 'Pending', 1),
('B002', 'Parcel', 'Outgoing', 'Manogna', 'Egret Hostel, IIT Jammu', 2, NOW() + INTERVAL 3 DAY, 'Waiting', 2),
('B003', 'Document', 'Internal', 'Registrar Office', 'Admin Block, IIT Jammu', 3, NOW() + INTERVAL 1 DAY, 'In Transit', 3),
('B004', 'Letter', 'Incoming', 'Amazon', 'Trikuta Nagar, Jammu', 4, NOW() + INTERVAL 2 DAY, 'Delivered', 4),
('B005', 'Parcel', 'Outgoing', 'Ethan Gupta', 'Dedhar Hostel, IIT Jammu', 5, NOW() + INTERVAL 3 DAY, 'Returned', 5),
('B006', 'Letter', 'Incoming', 'Flipkart', 'Warehouse, Mumbai', 6, NOW() + INTERVAL 2 DAY, 'Delivered', 6),
('B007', 'Document', 'Internal', 'Admin Office', 'Academic Block', 7, NOW() + INTERVAL 1 DAY, 'In Transit', 7),
('B008', 'Parcel', 'Incoming', 'BlueDart', 'Transport Office, IIT Jammu', 8, NOW() + INTERVAL 3 DAY, 'Pending', 8),
('B009', 'Letter', 'Incoming', 'HR Dept', 'Admin Office, IIT Jammu', 9, NOW() + INTERVAL 1 DAY, 'Delivered', 9),
('B010', 'Parcel', 'Outgoing', 'Sneha Iyer', 'Hostel B, IIT Jammu', 10, NOW() + INTERVAL 3 DAY, 'Waiting', 10),
('B011', 'Letter', 'Incoming', 'Coursera', 'New Delhi', 11, NOW() + INTERVAL 2 DAY, 'Pending', 11),
('B012', 'Parcel', 'Incoming', 'FedEx', 'Mumbai', 12, NOW() + INTERVAL 4 DAY, 'In Transit', 12),
('B013', 'Document', 'Internal', 'Dean Office', 'Library Block', 13, NOW() + INTERVAL 1 DAY, 'Delivered', 13),
('B014', 'Letter', 'Incoming', 'Google', 'Bangalore', 14, NOW() + INTERVAL 2 DAY, 'Delivered', 14),
('B015', 'Parcel', 'Incoming', 'Microsoft', 'Hyderabad', 15, NOW() + INTERVAL 3 DAY, 'Pending', 15),
('B016', 'Letter', 'Outgoing', 'Manogna', 'Egret Hostel, IIT Jammu', 16, NOW() + INTERVAL 2 DAY, 'Waiting', 16),
('B017', 'Parcel', 'Incoming', 'PostMaster', 'Delhi GPO', 17, NOW() + INTERVAL 3 DAY, 'Pending', 17),
('B018', 'Document', 'Internal', 'Accounts Section', 'Admin Block', 18, NOW() + INTERVAL 1 DAY, 'In Transit', 18),
('B019', 'Parcel', 'Outgoing', 'Simran Gill', 'Library Block, IIT Jammu', 19, NOW() + INTERVAL 2 DAY, 'Waiting', 19),
('B020', 'Letter', 'Incoming', 'IEEE', 'Hyderabad', 20, NOW() + INTERVAL 2 DAY, 'Pending', 20);
use IitJammu1;
INSERT INTO TrackingEvent (MailID, Timestamp, EventType, Location, Remarks, HandledBy) VALUES
(1,NOW(),'Received','Central Post','Mail received',1),
(2,NOW(),'Dispatched','North Post','Sent to destination',2),
(3,NOW(),'In Transit','Campus Route','Moving to department',3),
(4,NOW(),'Delivered','Civil Dept','Delivered successfully',4),
(5,NOW(),'Returned','Main Post','Receiver unavailable',5),
(6,NOW(),'Delivered','Admin Block','Delivered to admin',6),
(7,NOW(),'In Transit','Academic Block','Mail en route',7),
(8,NOW(),'Dispatched','Hostel A','Dispatched for delivery',8),
(9,NOW(),'Delivered','Security Office','Delivered and signed',9),
(10,NOW(),'In Transit','Workshop','Delivery on progress',10),
(11,NOW(),'Dispatched','Library Block','Mail handed to courier',11),
(12,NOW(),'Received','Admin Office','New incoming mail',12),
(13,NOW(),'Delivered','Library','Delivered successfully',13),
(14,NOW(),'In Transit','Faculty Housing','On route to destination',14),
(15,NOW(),'Returned','Central Post','Wrong address',15),
(16,NOW(),'Delivered','Hostel B','Delivered to recipient',16),
(17,NOW(),'Received','Admin Office','Incoming registered mail',17),
(18,NOW(),'In Transit','Mechanical Dept','Package moving internally',18),
(19,NOW(),'Delivered','Library Block','Delivered on time',19),
(20,NOW(),'Dispatched','Hostel C','Package ready for dispatch',20);
use IitJammu1;
INSERT INTO DeliveryRecord (MailID, DeliveredBy, DeliveredTo, DeliveryTime, DeliveryStatus, SignaturePath, Remarks) VALUES
(1,1,1,NOW(),'On Time','sign1.png','Delivered to student'),
(2,2,2,NOW(),'Delayed','sign2.png','Weather delay'),
(3,3,3,NOW(),'On Time','sign3.png','Delivered within campus'),
(4,4,4,NOW(),'On Time','sign4.png','Delivered to staff'),
(5,5,5,NOW(),'Returned','sign5.png','Receiver not found'),
(6,6,6,NOW(),'On Time','sign6.png','Delivered to admin'),
(7,7,7,NOW(),'Delayed','sign7.png','Vehicle issue'),
(8,8,8,NOW(),'On Time','sign8.png','Delivered to hostel'),
(9,9,9,NOW(),'On Time','sign9.png','Signed by receiver'),
(10,10,10,NOW(),'On Time','sign10.png','Package intact'),
(11,11,11,NOW(),'Delayed','sign11.png','Traffic jam'),
(12,12,12,NOW(),'On Time','sign12.png','Received successfully'),
(13,13,13,NOW(),'On Time','sign13.png','Delivered to library'),
(14,14,14,NOW(),'On Time','sign14.png','Delivered on time'),
(15,15,15,NOW(),'Returned','sign15.png','Address incorrect'),
(16,16,16,NOW(),'On Time','sign16.png','Delivered promptly'),
(17,17,17,NOW(),'On Time','sign17.png','Received by staff'),
(18,18,18,NOW(),'Delayed','sign18.png','Late arrival'),
(19,19,19,NOW(),'On Time','sign19.png','Successful handover'),
(20,20,20,NOW(),'On Time','sign20.png','Delivered and signed');
use IitJammu1;
INSERT INTO Notification (MailID, PersonID, Message, SentTime, Status) VALUES
(1,1,'Mail B001 received at Central Post',NOW(),'Read'),
(2,2,'Parcel B002 dispatched to faculty',NOW(),'Sent'),
(3,3,'Document B003 is in transit',NOW(),'Sent'),
(4,4,'Letter B004 delivered to staff',NOW(),'Read'),
(5,5,'Parcel B005 returned to sender',NOW(),'Sent'),
(6,6,'Letter B006 delivered successfully',NOW(),'Read'),
(7,7,'Mail B007 on the way',NOW(),'Sent'),
(8,8,'Parcel B008 awaiting pickup',NOW(),'Sent'),
(9,9,'Letter B009 delivered',NOW(),'Read'),
(10,10,'Mail B010 dispatched from IITJ',NOW(),'Sent'),
(11,11,'Letter B011 received',NOW(),'Sent'),
(12,12,'Parcel B012 is in transit',NOW(),'Read'),
(13,13,'Mail B013 delivered successfully',NOW(),'Read'),
(14,14,'Letter B014 processed',NOW(),'Sent'),
(15,15,'Parcel B015 returned due to address error',NOW(),'Sent'),
(16,16,'Mail B016 delivered to student',NOW(),'Read'),
(17,17,'Parcel B017 received at IITJ post office',NOW(),'Sent'),
(18,18,'Document B018 dispatched internally',NOW(),'Read'),
(19,19,'Mail B019 delivered to library',NOW(),'Read'),
(20,20,'Letter B020 awaiting pickup',NOW(),'Sent');