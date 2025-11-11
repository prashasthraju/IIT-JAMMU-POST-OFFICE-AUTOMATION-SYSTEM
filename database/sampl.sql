CREATE DATABASE Iitjammu;
USE Iitjammu;

-- --- TABLES ---

CREATE TABLE PostOffice (
  PostOfficeID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(100),
  Location VARCHAR(100),
  ContactNumber VARCHAR(20)
);

CREATE TABLE Building (
  BuildingId INT PRIMARY KEY AUTO_INCREMENT,
  BuildingName VARCHAR(50) UNIQUE,
  Capacity INT
);

CREATE TABLE Employee (
  EmployeeID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(100),
  Role VARCHAR(50),
  ContactNumber VARCHAR(15),
  PostOfficeID INT,
  LoginID VARCHAR(50) UNIQUE,
  PasswordHash VARCHAR(255),
  FOREIGN KEY (PostOfficeID) REFERENCES PostOffice(PostOfficeID),
  CHECK (Role IN ('Head Officer', 'Manager', 'Assistant Manager', 'Clerk', 'Delivery Staff'))
);

-- (FIXED) Department table now correctly uses BuildingId
CREATE TABLE Department (
  DeptID INT PRIMARY KEY AUTO_INCREMENT,
  DeptName VARCHAR(100),
  BuildingId INT,
  FOREIGN KEY (BuildingId) REFERENCES Building(BuildingId)
);

-- (FIXED) Person table no longer has redundant BuildingName
-- (IMPROVED) Added UNIQUE constraint on Email
CREATE TABLE Person (
  PersonID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(100),
  Role ENUM('Student','Faculty','Staff'),
  Email VARCHAR(100) UNIQUE,
  ContactNumber VARCHAR(15),
  DeptID INT,
  BuildingId INT,
  RoomNumber VARCHAR(10),
  PasswordHash VARCHAR(255),
  FOREIGN KEY (DeptID) REFERENCES Department(DeptID),
  FOREIGN KEY (BuildingId) REFERENCES Building(BuildingId)
); 

-- (IMPROVED) MailItem now has DEFAULT values
CREATE TABLE MailItem (
  MailID INT PRIMARY KEY AUTO_INCREMENT,
  BarcodeNo VARCHAR(50) UNIQUE,
  Type VARCHAR(50),
  Mode ENUM('Incoming','Outgoing','Internal'),
  SenderName VARCHAR(100),
  SenderAddress VARCHAR(255),
  ReceiverID INT,
  DateReceived DATETIME DEFAULT NOW(),
  ExpectedDeliveryDate DATETIME,
  CurrentStatus VARCHAR(50) DEFAULT 'Pending',
  HandledBy INT,
  FOREIGN KEY (ReceiverId) REFERENCES Person(PersonID) ON DELETE SET NULL,
  FOREIGN KEY (HandledBy) REFERENCES Employee(EmployeeID) ON DELETE SET NULL,
  CHECK (CurrentStatus IN ('Pending','Waiting','In Transit','Delivered','Returned'))
);

-- (NOTE) This table will now be created successfully
CREATE TABLE TrackingEvent (
  EventID INT PRIMARY KEY AUTO_INCREMENT,
  MailID INT,
  Timestamp DATETIME,
  EventType VARCHAR(50),
  Location VARCHAR(100),
  Remarks VARCHAR(255),
  HandledBy INT,
  FOREIGN KEY (MailID) REFERENCES MailItem(MailID) ON DELETE CASCADE, -- Cascade delete: if mail is deleted, tracking is too
  FOREIGN KEY (HandledBy) REFERENCES Employee(EmployeeID) ON DELETE SET NULL,
  CHECK (EventType IN ('Received', 'Dispatched', 'In Transit', 'Reached', 'Delivered', 'Returned'))
);

-- (NOTE) This table will now be created successfully
CREATE TABLE DeliveryRecord (
  DeliveryID INT PRIMARY KEY AUTO_INCREMENT,
  MailID INT,
  DeliveredBy INT,
  DeliveredTo INT,
  DeliveryTime DATETIME,
  DeliveryStatus VARCHAR(50),
  SignaturePath VARCHAR(255),
  Remarks VARCHAR(255),
  FOREIGN KEY (MailID) REFERENCES MailItem(MailID) ON DELETE CASCADE,
  FOREIGN KEY (DeliveredBy) REFERENCES Employee(EmployeeID) ON DELETE SET NULL,
  FOREIGN KEY (DeliveredTo) REFERENCES Person(PersonID) ON DELETE SET NULL,
  CHECK (DeliveryStatus IN ('On Time', 'Delayed', 'Returned'))
);

-- (NOTE) This table will now be created successfully
CREATE TABLE Notification (
  NotificationID INT PRIMARY KEY AUTO_INCREMENT,
  MailID INT,
  PersonID INT,
  Message VARCHAR(255),
  SentTime DATETIME,
  Status ENUM('Sent','Read') DEFAULT 'Sent',
  FOREIGN KEY (MailID) REFERENCES MailItem(MailID) ON DELETE CASCADE,
  FOREIGN KEY (PersonID) REFERENCES Person(PersonID) ON DELETE CASCADE,
  CHECK (Status IN ('Sent', 'Read'))
);


-- --- INSERTS ---

INSERT INTO PostOffice (Name, Location, ContactNumber) VALUES
('Central Post', 'Jammu City', '0191-1234567'),
('North Post', 'Iit Jammu', '0191-2345678'),
('South Post', 'Jammu Cantonment', '0191-3456789'),
('East Post', 'Trikuta Nagar', '0191-4567890'),
('West Post', 'Gandhi Nagar', '0191-5678901');
select * from PostOffice;


INSERT INTO Building (BuildingName, Capacity) VALUES
('Egret', 250),    -- ID 1
('Fulgar', 500),   -- ID 2
('Mansar', 800),   -- ID 3
('Pushkar', 1000), -- ID 4
('Canary', 100);  -- ID 5
Select * from Building;


INSERT INTO Employee (Name, Role, ContactNumber, PostOfficeID, LoginID, PasswordHash) VALUES
('Rajesh Kumar', 'Head Officer', '9876543210', 1, 'rajesh01', 'hash1'),
('Anita Singh', 'Manager', '9876543211', 2, 'anita02', 'hash2'),
('Vikram Patel', 'Assistant Manager', '9876543212', 3, 'vikram03', 'hash3'),
('Sonia Verma', 'Clerk', '9876543213', 4, 'sonia04', 'hash4'),
('Rohit Gupta', 'Delivery Staff', '9876543214', 5, 'rohit05', 'hash5');
Select * from Employee;


-- (FIXED) Inserts now use the correct BuildingId
INSERT INTO Department (DeptName, BuildingId) VALUES
('Computer Science', 3), -- Mansar
('Electrical', 4),       -- Pushkar
('Mechanical', 3),       -- Mansar
('Civil', 1),            -- Egret
('Chemical', 2);          -- Fulgar
select * from Department;


-- (FIXED) Inserts now only use BuildingId, no redundant name
-- (ADDED) PasswordHash column for login authentication
INSERT INTO Person (Name, Role, Email, ContactNumber, DeptID, BuildingId, RoomNumber, PasswordHash) VALUES
('Manogna', 'Student', '2023uma0222@iitjammu.ac.in', '7051025654', 1, 1, '4019', 'hash1'),
('Bob Verma', 'Faculty', '2020uce0102@iitjammu.ac.in', '9000000002', 2, 2, '2021', 'hash2'),
('Charlie Singh', 'Student', '2021uME0103@iitjammu.ac.in', '9000000003', 3, 3, '3032', 'hash3'),
('Diana Kaur', 'Staff', '2019uCE0104@iitjammu.ac.in', '9000000004', 4, 1, '4043', 'hash4'),
('Ethan Gupta', 'Student', '2024umt0105@iitjammu.ac.in', '9000000005', 5, 5, '2032', 'hash5');
select * from Person;


-- (NOTE) I kept your 'Outgoing' mail with ReceiverID=2 to match your data,
-- but be aware this is illogical. A better 'Outgoing' mail would have ReceiverID = NULL
-- and a new column like 'ExternalReceiverAddress'.
INSERT INTO MailItem (BarcodeNo, Type, Mode, SenderName, SenderAddress, ReceiverID, ExpectedDeliveryDate, CurrentStatus, HandledBy) VALUES
('B001', 'Letter', 'Incoming', 'Manogna', 'Egret, Room 4019', 1, NOW() + INTERVAL 2 DAY, 'Pending', 1),
('B002', 'Parcel', 'Outgoing', 'Bob Verma', 'New Faculty Block, Room 2021', 2, NOW() + INTERVAL 3 DAY, 'Waiting', 2),
('B003', 'Document', 'Internal', 'Charlie Singh', 'Fulgar, Room 3032', 3, NOW() + INTERVAL 1 DAY, 'In Transit', 3),
('B004', 'Letter', 'Incoming', 'Diana Kaur', 'Old Faculty Block, Room 4043', 4, NOW() + INTERVAL 4 DAY, 'Delivered', 4),
('B005', 'Parcel', 'Outgoing', 'Ethan Gupta', 'Dedhar, Room 2032', 5, NOW() + INTERVAL 5 DAY, 'Returned', 5);
select * from MailItem;


-- (FIXED) Changed 'Alice Sharma' to a real location
INSERT INTO TrackingEvent (MailID, Timestamp, EventType, Location, Remarks, HandledBy) VALUES
(1, NOW(), 'Received', 'Central Post', 'Mail received', 1),
(2, NOW(), 'Dispatched', 'North Post', 'Parcel sent', 2),
(3, NOW(), 'In Transit', 'Mechanical Dept', 'Document on the way', 3),
(4, NOW(), 'Reached', 'Civil Dept', 'Letter arrived', 4),
(5, NOW(), 'Returned', 'Central Post', 'Parcel returned to sender', 5);
select * from TrackingEvent; 


-- (FIXED) Corrected delivery status to match MailItem status
INSERT INTO DeliveryRecord (MailID, DeliveredBy, DeliveredTo, DeliveryTime, DeliveryStatus, SignaturePath, Remarks) VALUES
(1, 1, 2, NOW(), 'On Time', 'sign1.png', 'Delivered successfully'),
(2, 2, 3, NOW(), 'Delayed', 'sign2.png', 'Delayed due to weather'),
(3, 3, 4, NOW(), 'On Time', 'sign3.png', 'Delivered as scheduled'),
(4, 4, 5, NOW(), 'On Time', 'sign4.png', 'Delivered to recipient'), -- Fixed: Was 'Returned'
(5, 5, 1, NOW(), 'Returned', 'sign5.png', 'Recipient not available'); -- Fixed: Was 'On Time'
Select * from DeliveryRecord;


INSERT INTO Notification (MailID, PersonID, Message, SentTime, Status) VALUES
(1, 2, 'Your mail has been received', NOW(), 'Sent'),
(2, 3, 'Your parcel is dispatched', NOW(), 'Sent'),
(3, 4, 'Document is in transit', NOW(), 'Sent'),
(4, 5, 'Letter has reached your office', NOW(), 'Read'),
(5, 1, 'Your returned parcel has been delivered', NOW(), 'Sent');
-- (FIXED) Corrected typo
select * from Notification;