# ParkPay

ParkPay is a frontend-only parking management and payment system developed for our **ITX4104 Software Testing** project.

The main idea of the project is to make the parking process easier for staff. A vehicle can be registered when entering, given a parking ticket, tracked while parked, and processed again when leaving. The system calculates the parking duration and fee automatically based on the vehicle type and parking time.

Since this project focuses mainly on software testing, the business logic is separated from the user interface so that important functions can be tested independently.

---

## Team Members

| Name | Student ID |
| --- | --- |
| Siva Paoren | 6630064 |
| Anuson Khwansakun | 6610789 |
| Nguyen Nhat Minh | 6632058 |
| May Thu Khin | 6611281 |

**Course:** ITX4104 Software Testing  
**Section:** 542

---

## Main Features

ParkPay currently includes:

- Staff login
- Dashboard with parking statistics
- Vehicle entry and ticket generation
- Active parking list
- Search by ticket ID or plate number
- Vehicle type filtering
- Vehicle exit and fee calculation
- Payment simulation
- Cash, Card, and QR payment options
- Parking receipt
- Parking history
- Payment history
- Lost ticket workflow
- Demo parking data
- Clear all data option
- Responsive navigation for desktop and mobile
- Browser storage using localStorage

---

## Technology Used

The project was built with:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Vitest
- React Testing Library
- Lucide React

No backend, database, external API, or payment service is required.

---

## How ParkPay Works

The normal parking flow is:

```text
Vehicle Entry
     ↓
Generate Ticket
     ↓
Active Parking
     ↓
Vehicle Exit
     ↓
Find Ticket
     ↓
Calculate Duration
     ↓
Calculate Parking Fee
     ↓
Payment
     ↓
Mark Ticket as PAID
     ↓
Complete Parking
     ↓
Receipt
```

When a vehicle enters, ParkPay creates a ticket with an `ACTIVE` status.

When the vehicle exits, the system checks the ticket, calculates the duration and parking fee, and allows the staff to continue to payment.

After a successful payment, the payment status becomes `PAID` and the parking ticket becomes `COMPLETED`.

The system also prevents the same ticket from being paid twice.

---

## Parking Fee Rules

The parking fee depends on the type of vehicle.

| Vehicle | First Hour | Additional Hour |
| --- | ---: | ---: |
| Bicycle | Free | Free |
| Motorcycle | 10 THB | 5 THB |
| Car | 20 THB | 10 THB |

### Grace Period

Parking for **0–15 minutes is free**.

### Partial Hours

Partial hours are rounded up to the next hour.

Examples:

```text
30 minutes  → 1 hour
61 minutes  → 2 hours
119 minutes → 2 hours
120 minutes → 2 hours
121 minutes → 3 hours
```

For example, a car parked for 140 minutes costs:

```text
First hour:        20 THB
Additional hours:  2 × 10 THB
Total:             40 THB
```

The calculation used by the system is:

```ts
calculateFee("CAR", 140) === 40
```

---

## Project Structure

The main project structure is:

```text
parkpay/
│
├── app/
│   ├── active-parking/
│   ├── dashboard/
│   ├── entry/
│   ├── exit/
│   ├── history/
│   ├── login/
│   ├── lost-ticket/
│   ├── payment/
│   ├── payments/
│   ├── settings/
│   └── page.tsx
│
├── components/
│   ├── dashboard/
│   └── layout/
│
├── lib/
│   ├── parking/
│   │   ├── calculateDuration.ts
│   │   ├── calculateFee.ts
│   │   ├── ticket.ts
│   │   └── vehicleTypes.ts
│   │
│   ├── payment/
│   │   └── payment.ts
│   │
│   └── storage/
│       └── localStorage.ts
│
├── tests/
│   ├── integration/
│   ├── parking/
│   ├── payment/
│   ├── storage/
│   └── ui/
│
├── public/
├── package.json
├── vitest.config.ts
└── README.md
```

The parking and payment calculations are kept inside the `lib` folder instead of being written directly inside the UI pages. This makes the logic easier to reuse and test.

---

## localStorage

Because ParkPay does not use a backend or database, the project stores its data in the browser using `localStorage`.

The main storage keys are:

```text
parkpay_tickets
parkpay_payments
parkpay_auth
```

### `parkpay_tickets`

Stores parking tickets, including active and completed parking records.

### `parkpay_payments`

Stores completed payment records.

### `parkpay_auth`

Stores the demo login status.

The storage functions are kept in:

```text
lib/storage/localStorage.ts
```

This avoids repeating localStorage code throughout the project.

---

## Demo Login

ParkPay uses a simple frontend-only demo login.

```text
Email:    staff@parkpay.demo
Password: parkpay123
```

This is only included to demonstrate the staff interface. It is not real authentication.

---

## Running the Project

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

No environment variables or external services are required.

---

## Running Tests

Run all tests once:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

Check the project with ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

---

# Testing

Testing is one of the main parts of this project.

We used **Vitest** together with **React Testing Library** to test both the business logic and important user interactions.

At the current stage, ParkPay has:

```text
12 test files
78 passing tests
```

The test suite covers parking calculations, tickets, payments, localStorage, the main parking workflow, and important UI interactions.

---

## Unit Testing

Unit tests are used for individual functions such as:

- Parking duration calculation
- Parking fee calculation
- Ticket ID generation
- Ticket creation
- Ticket validation
- Exit calculation
- Payment processing
- localStorage functions

The core parking calculation files currently have full test coverage.

---

## Boundary Value Testing

Boundary testing is especially important for the parking fee because of the 15-minute grace period and hourly rounding.

We test values around important boundaries, including:

```text
14 minutes
15 minutes
16 minutes

59 minutes
60 minutes
61 minutes

119 minutes
120 minutes
121 minutes
```

This helps make sure the system behaves correctly immediately before, at, and after each boundary.

For example:

```text
15 minutes → Free
16 minutes → First-hour fee
```

---

## Payment Testing

Payment tests check both successful and unsuccessful situations.

Examples include:

- Successful Cash payment
- Successful Card payment
- Successful QR payment
- Missing payment method
- Invalid ticket
- Already completed ticket
- Already paid ticket
- Ticket status changing to COMPLETED
- Payment status changing to PAID

This is also used to make sure that one parking ticket cannot be paid twice.

---

## Integration Testing

An integration test checks the main ParkPay workflow from beginning to end:

```text
Create Ticket
     ↓
Store Ticket
     ↓
Calculate Exit
     ↓
Calculate Fee
     ↓
Process Payment
     ↓
Complete Ticket
```

This confirms that the separate parts of the parking system work correctly together.

---

## UI Testing

React Testing Library is used to test important actions that a staff member would perform through the interface.

The UI tests include:

- Vehicle Entry form rendering
- Selecting a vehicle type
- Creating a parking ticket
- Displaying ticket information
- Viewing active parking
- Searching active parking by plate number
- Filtering vehicles
- Searching for a ticket at Vehicle Exit
- Displaying the correct parking fee
- Selecting a payment method
- Confirming payment
- Displaying a receipt
- Preventing completed tickets from being paid again
- Preventing already-paid tickets from being paid again
- Viewing and filtering Parking History
- Viewing and filtering Payment History

---

## Negative Testing

The project also tests incorrect or invalid situations instead of testing only successful cases.

Some examples are:

- Invalid ticket ID
- Negative parking duration
- Invalid entry or exit time
- Completed ticket used again
- Already-paid ticket used again
- Missing payment method
- Missing or unavailable ticket

The goal is for ParkPay to show a clear error instead of crashing.

---

## Test Coverage

The current test coverage is:

| Coverage | Result |
| --- | ---: |
| Statements | 87.60% |
| Branches | 77.63% |
| Functions | 88.88% |
| Lines | 87.60% |

The main parking logic, including fee calculation, duration calculation, vehicle rules, and ticket logic, has **100% coverage**.

---

## Demo Data

The Settings page includes an option to load demo data.

The demo data contains:

- Active parking records
- Completed parking records
- Different vehicle types
- Different payment methods

This is useful when demonstrating the dashboard and history pages without manually creating many tickets first.

There is also a **Clear All Data** option with confirmation before the data is removed.

---

## Project Limitations

ParkPay is a **frontend-only university prototype**, not a production parking management system.

Because there is no backend or database:

- Data is saved only in the current browser.
- Data is not shared between different computers.
- Clearing browser storage removes the saved parking data.
- The login system is only a demonstration.
- Passwords are not handled by a real authentication service.
- Payments are simulated and no real money is processed.
- localStorage should not be used for sensitive production data.
- There is no real ticket scanner, payment gateway, or parking hardware connection.

These limitations are intentional because the main focus of the project is frontend development and software testing.

---

## Current Project Status

The current version has been checked with:

```bash
npm run test
npm run test:coverage
npm run lint
npm run build
```

Current result:

```text
78 tests passed
0 ESLint errors
0 ESLint warnings
Production build passed
```

---

## Repository

GitHub:

```text
https://github.com/Mtkhin/ParkPay
```