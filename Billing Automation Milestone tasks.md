# **Milestone 1: Subscription Plans, Customers & Billing Engine**

# **Task 1: Project Setup and Database Schema Design**

### **Objective**

Create the FastAPI project structure and configure PostgreSQL.

### **Requirements**

* Create FastAPI project  
* Configure PostgreSQL connection  
* Setup SQLAlchemy ORM  
* Create environment variables (.env)  
* Configure Swagger/OpenAPI docs

### **Deliverable**

Application runs successfully and connects to PostgreSQL.

---

## **Task 2:** 

### **Objective**

Design all core billing tables.

### **Requirements**

Create models for:

* Plans  
* Customers  
* Subscriptions  
* BillingCycles  
* Invoices  
* Payments  
* AuditLogs

### **Important Fields**

**Plans**

* name  
* price  
* billing\_interval  
* trial\_days  
* features

**Customers**

* name  
* email  
* company\_name

**Subscriptions**

* customer\_id  
* plan\_id  
* status  
* start\_date  
* End\_date

**Billing cycles**

* subscription\_id  
* cycle\_start\_date  
* cycle\_end\_date  
* renewal\_date  
* status                (pending/completed)  
* created\_at  
* updated\_at

**Invoice:**

* invoice\_number  
* subscription\_id  
* customer\_id  
* invoice\_date  
* due\_date  
* subtotal  
* tax\_amount  
* Total\_amount

* status (draft/paid/unpaid/void) 

Payment:

* invoice\_id  
* payment\_reference  
* amount  
* payment\_method  
* status (pending/success/failed/refunded)  
* payment\_date  
* created\_at  
* Updated\_at

Audit logs:

* entity\_type (plan/subscription/invoice/payment)  
* entity\_id  
* action  
* old\_value  
* new\_value  
* performed\_by  
* created\_at 

## **Task 3: Subscription Status State Machine**

### **Objective**

Implement valid subscription lifecycle transitions.

### **Allowed States**

* trial  
* active  
* past\_due  
* cancelled

### **Valid Transitions**

trial \-\> active  
trial \-\> cancelled

active \-\> past\_due  
active \-\> cancelled

past\_due \-\> active  
past\_due \-\> cancelled

### **Requirements**

* Prevent invalid transitions  
* Store status change timestamps

### **Deliverable**

Service function validating state changes

**Task 4: User Authentication:**

Create signup, signin, home pages.

## **Task 4: Plan Management APIs**

### **Objective**

Create APIs to manage subscription plans.

### **APIs**

#### **Create Plan**

POST /plans

#### **List Plans**

GET /plans

#### **Update Plan**

PUT /plans/{id}

#### **Archive Plan**

PATCH /plans/{id}/archive

### 

## **Task 5: Customer Management APIs**

### **Objective**

Manage SaaS customers.

### **APIs**

#### **Create Customer**

POST /customers

#### **Get Customer**

GET /customers/{id}

#### **List Customers**

GET /customers

#### **Update Customer**

PUT /customers/{id}

## **Task 6: Subscription Creation API**

### **Objective**

Allow customers to subscribe to plans.

### **Requirements**

When subscription is created:

* Validate customer exists  
* Validate plan exists  
* Assign trial period  
* Calculate subscription start date  
* Set status \= trial or active

### **API**

POST /subscriptions

### **Deliverable**

Customer can subscribe to a plan successfully.

---

## **Task 7: Subscription Operations APIs**

### **Objective**

Manage subscription lifecycle.

### **APIs**

#### **Change Plan**

POST /subscriptions/{id}/change-plan

#### **Pause Subscription**

POST /subscriptions/{id}/pause

#### **Resume Subscription**

POST /subscriptions/{id}/resume

#### **Cancel Subscription**

POST /subscriptions/{id}/cancel

### **Deliverable**

All lifecycle operations working.

---

## **Task 8: Billing Cycle Engine**

### **Objective**

Generate billing cycle records.

### **Requirements**

* Monthly plans create next renewal date  
* Annual plans create next renewal date  
* Store billing cycle history

### **Deliverable**

Billing cycle calculation service.

---

## **Task 9: Audit Logging**

### **Objective**

Track every important action.

### **Log Events**

* Plan created  
* Plan updated  
* Customer created  
* Subscription created  
* Plan changed  
* Subscription cancelled

### **Deliverable**

Audit logs automatically generated.

## **Milestone 2** **Task 1: Invoice Generation**

### Automatically generate invoices for active subscriptions.

### **Requirements**

* Generate unique invoice numbers  
* Create invoice for each billing cycle  
* Invoice items  
  * Customer  
  * plan  
  * Plan fee  
  * Tax  
  * total  
  * status:(paid/unpaid  
* Calculate subtotal and total

### **APIs**

POST /invoices/generate   
GET /invoices  
 GET /invoices/{id} 

**UI**  
Invoices tab in sidebar  
Invoice list and view functionality  
Search filter([invoice.no](http://invoice.no), datetime)  
Status filter(paid or unpaid)  
Pdf download

### **Task 2: Proration & Plan Change Logic**

Allow customers to **upgrade or downgrade plans in the middle of a billing cycle** and charge them fairly.

### **What is Proration?**

Suppose:

Pro Plan      ₹1000/month

Customer subscribed on: 1 July

On: 15 July Customer wants to upgrade to Premium Plan ₹2000/month

The customer has already used **15 days** of the Pro plan and has **15 days remaining**.

Instead of charging the full ₹2000 again, the system calculates:

Unused Pro Amount \= Credit  
Premium Remaining Cost \= Debit

Then generates the final amount.

## **Backend Work**

### **API**

POST /subscriptions/{id}/change-plan

### **Request**

{  
  "new\_plan\_id": 2  
}

### **Logic**

1. Get current subscription.  
2. Get current plan.  
3. Calculate remaining days.  
4. Calculate unused amount.  
5. Calculate new plan cost for remaining period.  
6. Create proration adjustment.  
7. Update subscription with new plan.  
8. Store audit log.

### **Example**

Current Plan  : ₹1000/month  
New Plan      : ₹2000/month

Remaining Days \= 15

Credit  \= ₹500  
Charge  \= ₹1000

Amount Due \= ₹500

Example:

Pro Plan Credit        \-₹500  
Premium Plan Charge    \+₹1000

## **Frontend Work**

### **Plan Change Screen**

Current Plan

Pro Plan  
₹1000/month

Select New Plan

( ) Basic  
( ) Premium  
( ) Enterprise

\[Upgrade Plan\]

### **Proration Preview**

Before confirming:

Plan Upgrade Summary

Unused Plan Credit      \-₹500  
New Plan Charge         \+₹1000

Amount Due              ₹500

\[Confirm Upgrade\]

### **Subscription Details Page**

Show:

Current Plan : Premium

Previous Plan Changes

Pro → Premium  
15 Jul 2026  
Adjustment ₹500

### **Flow**

Customer  
    |  
Changes Plan  
    |  
Proration Calculated  
    |  
Invoice Adjustment Created  
    |  
Subscription Updated  
