# Landlord API Documentation & Demo Requests/Responses

This document provides complete documentation for all API routes defined in `LandlordController` (`/landlord`), including HTTP methods, endpoints, parameter definitions, request payload body schemas, and realistic JSON responses.

---

## Table of Contents
1. [Authentication](#1-authentication)
   - [Register Landlord](#11-register-landlord)
   - [Login Landlord](#12-login-landlord)
2. [Profile Management](#2-profile-management)
   - [Get Landlord Profile by ID](#21-get-landlord-profile-by-id)
   - [Update Full Landlord Profile](#22-update-full-landlord-profile)
   - [Update Landlord Password](#23-update-landlord-password)
3. [Property Management](#3-property-management)
   - [Get Specific Property Details](#31-get-specific-property-details)
   - [Get All Properties for Landlord](#32-get-all-properties-for-landlord)
   - [Update Property Rent Amount](#33-update-property-rent-amount)
   - [Update Property Service Charge](#34-update-property-service-charge)
   - [Update Property Parking Fee](#35-update-property-parking-fee)
   - [Update Property Listing Status](#36-update-property-listing-status)
   - [Update Property Occupancy Status](#37-update-property-occupancy-status)
4. [Tenant Management](#4-tenant-management)
   - [Get All Tenants for Landlord](#41-get-all-tenants-for-landlord)
   - [Approve Tenant Application](#42-approve-tenant-application)
   - [Reject Tenant Application](#43-reject-tenant-application)
5. [Work Orders](#5-work-orders)
   - [Create Work Order](#51-create-work-order)
   - [Get All Work Orders for Landlord](#52-get-all-work-orders-for-landlord)
6. [Transactions & Dashboard](#6-transactions--dashboard)
   - [Get Landlord Transactions](#61-get-landlord-transactions)
   - [Get Landlord Dashboard Summary](#62-get-landlord-dashboard-summary)

---

## 1. Authentication

### 1.1 Register Landlord
* **Route:** `POST /landlord/register`
* **Description:** Registers a new landlord in the system. The plain password is automatically hashed before saving.

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "password_hash": "SecretPassword123!"
}
```

#### Response (`201 Created`)
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "password_hash": "$2b$10$e8.yI3sZ9d4A8MvO0vXG0uK5G4lJ1s2w3x4y5z6a7b8c9d0e1f2g3",
  "status": "active",
  "created_at": "2026-09-05T10:15:30.000Z"
}
```

---

### 1.2 Login Landlord
* **Route:** `POST /landlord/login`
* **Description:** Authenticates a landlord using name and password.

#### Request Body
```json
{
  "name": "John Doe",
  "password_hash": "SecretPassword123!"
}
```

#### Response (`200 OK`)
```json
{
  "message": "Login successful"
}
```

---

## 2. Profile Management

### 2.1 Get Landlord Profile by ID
* **Route:** `GET /landlord/profile/:id`
* **Url Params:** `id` (number) - Landlord ID

#### Response (`200 OK`)
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "status": "active",
  "created_at": "2026-09-05T10:15:30.000Z"
}
```

---

### 2.2 Update Full Landlord Profile
* **Route:** `PUT /landlord/update/:id`
* **Url Params:** `id` (number) - Landlord ID

#### Request Body
```json
{
  "name": "Johnathan Doe",
  "email": "johnathan.doe@example.com",
  "phone": "+1987654321"
}
```

#### Response (`200 OK`)
```json
{
  "id": 1,
  "name": "Johnathan Doe",
  "email": "johnathan.doe@example.com",
  "phone": "+1987654321",
  "status": "active",
  "created_at": "2026-09-05T10:15:30.000Z"
}
```

---

### 2.3 Update Landlord Password
* **Route:** `PATCH /landlord/update_password/:id`
* **Url Params:** `id` (number) - Landlord ID

#### Request Body
```json
{
  "name": "Johnathan Doe",
  "password_hash": "SecretPassword123!",
  "newpassword": "BrandNewPassword456!"
}
```

#### Response (`200 OK`)
```json
{
  "id": 1,
  "name": "Johnathan Doe",
  "email": "johnathan.doe@example.com",
  "phone": "+1987654321",
  "password_hash": "BrandNewPassword456!",
  "status": "active",
  "created_at": "2026-09-05T10:15:30.000Z"
}
```

---

## 3. Property Management

### 3.1 Get Specific Property Details
* **Route:** `GET /landlord/properties/:landlordId/:propertyId`
* **Url Params:** 
  * `landlordId` (number) - Landlord ID
  * `propertyId` (number) - Property ID

#### Response (`200 OK`)
```json
{
  "id": 101,
  "unit_number": "A-402",
  "rent_amount": 1500.00,
  "service_charge": 150.00,
  "has_parking": true,
  "parking_fee": 50.00,
  "listing_status": "for_rent",
  "status": "vacant",
  "created_by": "Admin",
  "created_at": "2026-01-15T08:00:00.000Z"
}
```

---

### 3.2 Get All Properties for Landlord
* **Route:** `GET /landlord/properties/:landlordId`
* **Url Params:** `landlordId` (number) - Landlord ID

#### Response (`200 OK`)
```json
[
  {
    "id": 101,
    "unit_number": "A-402",
    "rent_amount": 1500.00,
    "service_charge": 150.00,
    "has_parking": true,
    "parking_fee": 50.00,
    "listing_status": "for_rent",
    "status": "vacant",
    "created_by": "Admin",
    "created_at": "2026-01-15T08:00:00.000Z"
  },
  {
    "id": 102,
    "unit_number": "B-105",
    "rent_amount": 2200.00,
    "service_charge": 200.00,
    "has_parking": false,
    "parking_fee": null,
    "listing_status": "not_listed",
    "status": "occupied",
    "created_by": "Admin",
    "created_at": "2026-02-01T09:30:00.000Z"
  }
]
```

---

### 3.3 Update Property Rent Amount
* **Route:** `PATCH /landlord/propety/update/rent/:landlordId/:propertyId`
* **Url Params:** 
  * `landlordId` (number)
  * `propertyId` (number)

#### Request Body
```json
{
  "rent_amount": 1650.00
}
```

#### Response (`200 OK`)
```json
{
  "id": 101,
  "unit_number": "A-402",
  "rent_amount": 1650.00,
  "service_charge": 150.00,
  "has_parking": true,
  "parking_fee": 50.00,
  "listing_status": "for_rent",
  "status": "vacant",
  "created_by": "Admin",
  "created_at": "2026-01-15T08:00:00.000Z"
}
```

---

### 3.4 Update Property Service Charge
* **Route:** `PATCH /landlord/propety/update/service_charge/:landlordId/:propertyId`
* **Url Params:** 
  * `landlordId` (number)
  * `propertyId` (number)

#### Request Body
```json
{
  "service_charge": 175.00
}
```

#### Response (`200 OK`)
```json
{
  "id": 101,
  "unit_number": "A-402",
  "rent_amount": 1650.00,
  "service_charge": 175.00,
  "has_parking": true,
  "parking_fee": 50.00,
  "listing_status": "for_rent",
  "status": "vacant",
  "created_by": "Admin",
  "created_at": "2026-01-15T08:00:00.000Z"
}
```

---

### 3.5 Update Property Parking Fee
* **Route:** `PATCH /landlord/propety/update/parking/:landlordId/:propertyId`
* **Url Params:** 
  * `landlordId` (number)
  * `propertyId` (number)

#### Request Body
```json
{
  "parking": 75.00
}
```

#### Response (`200 OK`)
```json
{
  "id": 101,
  "unit_number": "A-402",
  "rent_amount": 1650.00,
  "service_charge": 175.00,
  "has_parking": true,
  "parking_fee": 75.00,
  "listing_status": "for_rent",
  "status": "vacant",
  "created_by": "Admin",
  "created_at": "2026-01-15T08:00:00.000Z"
}
```

---

### 3.6 Update Property Listing Status
* **Route:** `PATCH /landlord/propety/update/listing_status/:landlordId/:propertyId`
* **Url Params:** 
  * `landlordId` (number)
  * `propertyId` (number)

#### Request Body
```json
{
  "listing_status": "for_rent"
}
```
*(Options: `not_listed`, `for_rent`, `for_sale`)*

#### Response (`200 OK`)
```json
{
  "id": 101,
  "unit_number": "A-402",
  "rent_amount": 1650.00,
  "service_charge": 175.00,
  "has_parking": true,
  "parking_fee": 75.00,
  "listing_status": "for_rent",
  "status": "vacant",
  "created_by": "Admin",
  "created_at": "2026-01-15T08:00:00.000Z"
}
```

---

### 3.7 Update Property Occupancy Status
* **Route:** `PATCH /landlord/propety/update/status/:landlordId/:propertyId`
* **Url Params:** 
  * `landlordId` (number)
  * `propertyId` (number)

#### Request Body
```json
{
  "status": "occupied"
}
```
*(Options: `vacant`, `occupied`, `sold`)*

#### Response (`200 OK`)
```json
{
  "id": 101,
  "unit_number": "A-402",
  "rent_amount": 1650.00,
  "service_charge": 175.00,
  "has_parking": true,
  "parking_fee": 75.00,
  "listing_status": "not_listed",
  "status": "occupied",
  "created_by": "Admin",
  "created_at": "2026-01-15T08:00:00.000Z"
}
```

---

## 4. Tenant Management

### 4.1 Get All Tenants for Landlord
* **Route:** `GET /landlord/tenants/:landlordid`
* **Url Params:** `landlordid` (number) - Landlord ID

#### Response (`200 OK`)
```json
[
  {
    "id": 501,
    "name": "Alice Smith",
    "email": "alice.smith@example.com",
    "phone": "+1555019283",
    "nid_number": "NID-9876543210",
    "nid_document_url": "https://storage.example.com/docs/nid_alice.pdf",
    "has_vehicle": true,
    "status": "PENDING",
    "created_at": "2026-08-20T14:22:00.000Z"
  },
  {
    "id": 502,
    "name": "Bob Johnson",
    "email": "bob.j@example.com",
    "phone": "+1555098765",
    "nid_number": "NID-1234567890",
    "nid_document_url": "https://storage.example.com/docs/nid_bob.pdf",
    "has_vehicle": false,
    "status": "APPROVED",
    "created_at": "2026-07-10T11:00:00.000Z"
  }
]
```

---

### 4.2 Approve Tenant Application
* **Route:** `PATCH /landlord/tenant/approve/:landlordid/:tenantid`
* **Url Params:** 
  * `landlordid` (number)
  * `tenantid` (number)

#### Response (`200 OK`)
```json
{
  "id": 501,
  "name": "Alice Smith",
  "email": "alice.smith@example.com",
  "phone": "+1555019283",
  "nid_number": "NID-9876543210",
  "nid_document_url": "https://storage.example.com/docs/nid_alice.pdf",
  "has_vehicle": true,
  "status": "APPROVED",
  "created_at": "2026-08-20T14:22:00.000Z"
}
```

---

### 4.3 Reject Tenant Application
* **Route:** `PATCH /landlord/tenant/reject/:landlordid/:tenantid`
* **Url Params:** 
  * `landlordid` (number)
  * `tenantid` (number)

#### Response (`200 OK`)
```json
{
  "id": 501,
  "name": "Alice Smith",
  "email": "alice.smith@example.com",
  "phone": "+1555019283",
  "nid_number": "NID-9876543210",
  "nid_document_url": "https://storage.example.com/docs/nid_alice.pdf",
  "has_vehicle": true,
  "status": "REJECTED",
  "created_at": "2026-08-20T14:22:00.000Z"
}
```

---

## 5. Work Orders

### 5.1 Create Work Order
* **Route:** `POST /landlord/workorder/:landlordId`
* **Url Params:** `landlordId` (number) - Landlord ID

#### Request Body
```json
{
  "property_id": 101,
  "issue_id": 12,
  "landlord_id": 1,
  "tenant_id": 501,
  "staff_id": 3,
  "worker_id": 8,
  "review_id": null,
  "created_by_type": "landlord",
  "created_by_id": 1,
  "status": "pending"
}
```

#### Response (`201 Created`)
```json
{
  "id": 801,
  "created_by_type": "landlord",
  "created_by_id": 1,
  "status": "pending",
  "labor_cost": 150.00,
  "materials_cost": 85.50,
  "additional_cost": 0.00,
  "created_at": "2026-09-05T11:00:00.000Z",
  "landlord": {
    "id": 1,
    "name": "Johnathan Doe"
  }
}
```

---

### 5.2 Get All Work Orders for Landlord
* **Route:** `GET /landlord/workorders/:landlordId`
* **Url Params:** `landlordId` (number) - Landlord ID

#### Response (`200 OK`)
```json
[
  {
    "id": 801,
    "created_by_type": "landlord",
    "created_by_id": 1,
    "status": "pending",
    "labor_cost": 150.00,
    "materials_cost": 85.50,
    "additional_cost": 0.00,
    "created_at": "2026-09-05T11:00:00.000Z",
    "completed_at": null
  },
  {
    "id": 780,
    "created_by_type": "landlord",
    "created_by_id": 1,
    "status": "complete",
    "labor_cost": 200.00,
    "materials_cost": 120.00,
    "additional_cost": 15.00,
    "created_at": "2026-08-10T09:15:00.000Z",
    "completed_at": "2026-08-12T16:30:00.000Z"
  }
]
```

---

## 6. Transactions & Dashboard





### 6.1 Get Landlord Transactions
* **Route:** `GET /landlord/transactions/:landlordId`
* **Url Params:** `landlordId` (number) - Landlord ID

#### Response (`200 OK`)
```json
[
  {
    "id": 901,
    "type": "rent",
    "amount": 1650.00,
    "payer_type": "tenant",
    "status": "paid",
    "created_by_type": "tenant",
    "created_at": "2026-09-01T10:00:00.000Z",
    "paid_at": "2026-09-01T10:05:00.000Z"
  },
  {
    "id": 902,
    "type": "work_order_cost",
    "amount": 235.50,
    "payer_type": "landlord",
    "status": "pending",
    "created_by_type": "staff",
    "created_at": "2026-09-05T11:00:00.000Z",
    "paid_at": null
  }
]
```

---

### 6.2 Get Landlord Dashboard Summary
* **Route:** `GET /landlord/dashboard/summery`
* **Note:** Route query/param implementation expects `landlordId` passed to controller service.

#### Response (`200 OK`)
```json
[
  {
    "total_properties": "5",
    "total_tenants": "4",
    "total_work_orders": "12",
    "total_income": "18500.00"
  }
]
```
### 6.3 Get Landlord issue posted by tenants
* **Route:** `GET issues/:landlordId`
* **Note:** Route query/param implementation expects `landlordId` passed to controller service.

#### Response (`200 OK`)
```json
[
    {
        "id": 1,
        "image_url": null,
        "status": "IN_PROGRESS",
        "created_at": "2026-09-06T06:51:22.716Z",
        "tenant_id": 1,
        "property_id": 3,
        "description": "shob"
    }
]

```

### 6.4 assign property to tenants by landlord
* **Route:** `PATCH tenant/assign-property/:landlordId/:tenantId`
* **Note:** Route query/param implementation expects `landlordId` passed to controller service.

#### Request Body
```json
{
  "property_id": 1
}

```
#### Response (`200 OK`)
```json
[
    {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "status": "APPROVED",
    "approved_by": 1,
    "property": {
        "id": 1,
        "title": "Sunset Apartment",
        "rent_amount": 12500.00
    }
}
]

```
### 6.5 Get reviews of tenants by landlord
* **Route:** GET landlord/reviews/:landlordId
* **Note:** landlordId is passed to the controller and service to retrieve reviews associated with that landlord's work orders.

#### Request Body 

No request body is required.

#### Example Request

GET /landlord/reviews/1

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "work_order_id": 5,
    "rating": "5",
    "comment": "Very good service.",
    "tenant_id": 2,
    "created_at": "2026-09-06T10:30:00.000Z"
  },
  {
    "id": 2,
    "work_order_id": 8,
    "rating": "4",
    "comment": "The problem was fixed properly.",
    "tenant_id": 4,
    "created_at": "2026-09-06T12:15:00.000Z"
  }
]

```

### 6.5 Kick tenant by landlord
* **Route:** PATCH tenant/kick/:landlordid/:tenantid
* **Note:** landlordid and tenantid are passed as route parameters. The landlord is first verified, then the tenant's status is changed to REJECTED.

#### Request

No request body is required.

#### Example Request

PATCH /tenant/kick/1/2

#### Response (200 OK)
```JSON
{
  "id": 2,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "01700000000",
  "status": "REJECTED"
}

```
### 6.6 Create transaction
* **Route:** POST transaction/:landlordId
* **Note:** landlordId is passed as a route parameter. The landlord and property are verified before creating the transaction.

#### Request Body
```JSON
{
  "type": "electricity",
  "amount": 2500,
  "property_id": 3,
  "payer_type": "landlord",
  "status": "pending"
}

#### Example Request

POST /transaction/18

#### Response (201 Created)
```JSON
{
  "id": 13,
  "type": "electricity",
  "amount": 2500,
  "property_id": {
    "id": 3,
    "unit_number": "A-101",
    "rent_amount": "15000.00",
    "service_charge": "2000.00",
    "has_parking": true,
    "parking_fee": "1000.00",
    "listing_status": "for_rent",
    "status": "vacant",
    "created_by": "Admin",
    "created_at": "2026-09-05T17:51:00.829Z"
  },
  "landlord": {
    "id": 18,
    "name": "666",
    "email": "666@gmail.com",
    "phone": "01711111111",
    "status": "active",
    "created_at": "2026-09-04T15:54:51.352Z"
  },
  "payer_type": "landlord",
  "status": "pending",
  "created_by_type": "landlord",
  "created_at": "2026-09-06T15:00:53.122Z",
  "paid_at": "2026-09-06T15:00:53.122Z"
}