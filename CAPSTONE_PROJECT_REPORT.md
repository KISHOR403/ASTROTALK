# Capstone Project Report: Vedic Astrology Platform

## 1. Introduction

### 1.1 Objective of the Project

The primary objective of this capstone project is to develop a comprehensive, full-stack web application that facilitates Vedic astrology services through a seamless digital platform. The application aims to:

- Connect clients with experienced astrologers for personalized consultations
- Provide automated astrological insights using AI and predictive algorithms
- Enable real-time communication between clients and astrologers through chat functionality
- Offer detailed birth chart analysis and horoscope generation
- Create a secure booking system for consultations
- Deliver a user-friendly experience across web platforms

### 1.2 Description of the Project

**Vedic Astrology Platform** is a modern web application that bridges traditional Vedic astrology with contemporary technology. The platform serves as a marketplace and consultation hub where:

- **Clients** can discover qualified astrologers, book consultations, receive personalized horoscopes, and analyze their birth charts
- **Astrologers** can manage their profiles, availability, consultations, and provide expert guidance to clients
- **System** leverages AI (Google Generative AI) for intelligent chat assistance and horoscope generation
- **Real-time Communication** is enabled through WebSocket technology for live chat interactions

The platform is built with a modern tech stack including React with TypeScript for the frontend, Node.js/Express for the backend, and MongoDB for data persistence.

### 1.3 Scope of the Project

#### 1.3.1 In-Scope Features

**User Management:**
- User registration and authentication (role-based: client/astrologer)
- Profile management with personal information and birth details
- Secure password handling with bcrypt encryption

**Astrologer Services:**
- Astrologer profile creation and management
- Specialization categories (Vedic Astrology, Numerology, Tarot, etc.)
- Rating and review system
- Availability management
- Consultation pricing

**Booking System:**
- Browse and search astrologers
- Book consultations with date/time selection
- Payment processing
- Booking confirmation and history

**Chat System:**
- Real-time messaging between clients and astrologers
- AI-powered chat assistance using Google Generative AI
- Message history and persistence
- Typing indicators

**Astrological Features:**
- Birth chart calculation and visualization
- Horoscope generation (daily, weekly, monthly)
- Zodiac sign analysis
- Rashi (Moon sign) mapping
- Report generation and download

**Additional Features:**
- Blog section with astrological content
- Contact page for inquiries
- Terms of Service and Privacy Policy
- Responsive design for mobile and desktop

#### 1.3.2 Out-of-Scope Features

- Video consultation (current phase uses text-based chat)
- Payment integration (backend support exists, frontend integration pending)
- Multi-language support (currently English only)
- Mobile native applications (web-only)
- Advanced analytics dashboard
- Third-party API integrations (beyond Google Generative AI)

#### 1.3.3 Use Case Model

```
┌─────────────────────────────────────────────────────────────┐
│                    Vedic Astrology Platform                 │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐                        ┌──────────────┐
│   Client     │                        │ Astrologer   │
└──────────────┘                        └──────────────┘
       │                                        │
       ├─── Register/Login ─────────────────────┼─── Register/Login
       │                                        │
       ├─── View Profile          ──────────────┼─── Manage Profile
       │                                        │
       ├─── Browse Astrologers ──────────────────┼─── Update Availability
       │                                        │
       ├─── View Birth Chart ──────────────────── N/A
       │                                        │
       ├─── Generate Horoscope ────────────────── N/A
       │                                        │
       ├─── Book Consultation ─────────────────→ Accept/Manage Bookings
       │                                        │
       ├─── Real-time Chat ←──────────────────→ Real-time Chat
       │                                        │
       ├─── View Reports ──────────────────────→ Generate Reports
       │                                        │
       └─── Payment Processing ────────────────→ Earnings Management

```

---

## 2. System Description

### 2.1 Customer/User Profiles

#### 2.1.1 Client User Profile

**Primary Characteristics:**
- Age: 18 years and above
- Tech-savvy individuals interested in astrological guidance
- Comfortable with digital platforms
- Seeking personalized consultations and self-discovery

**Use Patterns:**
- Registers with email and password
- Completes birth details (date, time, place)
- Browses astrologer profiles and specializations
- Books consultations based on availability and pricing
- Engages in real-time chat with selected astrologers
- Views generated horoscopes and birth charts
- Downloads/saves reports for future reference

**User Needs:**
- Easy registration and quick onboarding
- Clear astrologer profiles with credentials and ratings
- Flexible booking options
- Private, secure communication
- Accurate astrological analysis
- Quick response times

#### 2.1.2 Astrologer User Profile

**Primary Characteristics:**
- Experienced in Vedic astrology or related fields
- Desires to reach a wider client base digitally
- Comfortable with technology for managing consultations
- Available to provide services online

**Use Patterns:**
- Registers with detailed professional information
- Completes astrologer-specific profile with specializations
- Sets availability schedule and pricing
- Receives booking notifications
- Engages in real-time consultations via chat
- Generates and sends reports to clients
- Manages ratings and reviews

**User Needs:**
- Professional profile showcase
- Flexible scheduling options
- Reliable real-time communication
- Secure payment processing
- Client management tools
- Performance analytics

#### 2.1.3 Admin User Profile (Future Enhancement)

- Manages platform policies and content
- Moderates astrologer profiles and reviews
- Monitors platform transactions
- Manages user complaints and support

### 2.2 Assumptions and Dependencies

#### 2.2.1 Assumptions

1. **Technology Infrastructure:**
   - Users have reliable internet connectivity
   - Modern browsers are available (Chrome, Firefox, Safari, Edge)
   - MongoDB service is accessible and stable

2. **User Behavior:**
   - Users provide accurate birth information for accurate predictions
   - Clients and astrologers communicate in English
   - Users respect privacy and maintain professional conduct

3. **Business Model:**
   - Astrologers are self-employed professionals
   - Platform takes a commission on consultation fees
   - Consulting rates are competitive and transparent

4. **External Services:**
   - Google Generative AI API is available and responsive
   - Payment gateway (future) is PCI-DSS compliant
   - Email service for notifications (future enhancement)

#### 2.2.2 Dependencies

**External Dependencies:**
- **Google Generative AI API** - For intelligent chat and content generation
- **Node.js Runtime** - Server-side execution
- **MongoDB** - Database service
- **Browser APIs** - Geolocation for location-based services

**Internal Dependencies:**
- **Socket.IO** - Real-time bidirectional communication
- **JWT (JSON Web Tokens)** - Authentication and authorization
- **Bcryptjs** - Password encryption
- **CORS** - Cross-origin requests handling

**Third-Party Frameworks:**
- **React + TypeScript** - Frontend framework
- **Vite** - Build tool and dev server
- **Express.js** - Backend framework
- **Mongoose** - MongoDB ODM
- **Tailwind CSS** - Styling framework
- **shadcn/ui** - Component library

### 2.3 Functional Requirements

#### FR1: User Management and Authentication

| ID | Requirement | Description |
|---|---|---|
| FR1.1 | User Registration | System shall allow new users to register with email and password |
| FR1.2 | Email Validation | System shall validate email uniqueness and format |
| FR1.3 | Role Assignment | System shall assign 'client' or 'astrologer' role during registration |
| FR1.4 | User Login | System shall authenticate users with email and password |
| FR1.5 | JWT Token Generation | System shall issue JWT tokens for authenticated sessions |
| FR1.6 | Password Security | System shall hash passwords using bcrypt (salt rounds: 10) |
| FR1.7 | Profile Management | System shall allow users to view and update their profiles |
| FR1.8 | Birth Details Entry | System shall allow clients to input and store birth date, time, and place |

#### FR2: Astrologer Management

| ID | Requirement | Description |
|---|---|---|
| FR2.1 | Astrologer Profile Creation | System shall allow astrologers to create detailed professional profiles |
| FR2.2 | Specialization Selection | System shall provide predefined specialization categories |
| FR2.3 | Experience Recording | System shall store years of experience |
| FR2.4 | Rating System | System shall calculate and display average ratings based on client reviews |
| FR2.5 | Availability Management | System shall allow astrologers to set availability schedule |
| FR2.6 | Pricing Management | System shall store per-minute consultation rates |
| FR2.7 | Language Support | System shall record supported languages |
| FR2.8 | Astrologer Directory | System shall display searchable list of available astrologers |

#### FR3: Booking and Consultation Management

| ID | Requirement | Description |
|---|---|---|
| FR3.1 | Booking Creation | System shall allow clients to book consultations with selected astrologers |
| FR3.2 | Date/Time Selection | System shall provide calendar widget for selecting consultation date and time |
| FR3.3 | Availability Validation | System shall validate booking against astrologer availability |
| FR3.4 | Booking Confirmation | System shall generate confirmation with booking details |
| FR3.5 | Booking History | System shall maintain consultation history for both parties |
| FR3.6 | Booking Cancellation | System shall allow cancellation with appropriate time window |
| FR3.7 | Booking Notifications | System shall notify both parties of booking confirmation |

#### FR4: Real-time Chat System

| ID | Requirement | Description |
|---|---|---|
| FR4.1 | WebSocket Connection | System shall establish WebSocket connection for real-time messaging |
| FR4.2 | Message Sending | System shall allow bidirectional message exchange |
| FR4.3 | Message Persistence | System shall store chat history in database |
| FR4.4 | Typing Indicator | System shall display typing status during active conversation |
| FR4.5 | AI Chat Assistant | System shall provide AI-powered responses using Google Generative AI |
| FR4.6 | Message Timestamps | System shall record time of each message |
| FR4.7 | Chat History Retrieval | System shall retrieve chat history for past conversations |

#### FR5: Astrological Calculations and Features

| ID | Requirement | Description |
|---|---|---|
| FR5.1 | Horoscope Generation | System shall generate horoscopes (daily, weekly, monthly) based on zodiac sign |
| FR5.2 | Rashi Calculation | System shall map zodiac signs to Sanskrit Rashi names |
| FR5.3 | Birth Chart Parsing | System shall display birth chart data with planetary positions |
| FR5.4 | Zodiac Analysis | System shall provide characteristics and predictions for each zodiac sign |
| FR5.5 | Report Generation | System shall create downloadable PDF reports of analyses |
| FR5.6 | Horoscope Dataset | System shall maintain comprehensive horoscope data by sign and period |

#### FR6: Content Management

| ID | Requirement | Description |
|---|---|---|
| FR6.1 | Blog Publishing | System shall display blog posts on astrological topics |
| FR6.2 | Blog Search | System shall allow filtering/searching blog content |
| FR6.3 | Contact Form | System shall accept and store contact inquiries |
| FR6.4 | Static Pages | System shall display Terms of Service and Privacy Policy |

### 2.4 Non-Functional Requirements

#### NFR1: Performance

| ID | Requirement | Description |
|---|---|---|
| NFR1.1 | Page Load Time | Frontend pages shall load in less than 3 seconds on 4G connection |
| NFR1.2 | API Response Time | Backend APIs shall respond within 500ms average |
| NFR1.3 | Database Query Optimization | Queries shall complete in less than 200ms |
| NFR1.4 | Real-time Message Latency | Chat messages shall be delivered within 1 second |
| NFR1.5 | Concurrent Users | System shall support at least 100 concurrent users |

#### NFR2: Security

| ID | Requirement | Description |
|---|---|---|
| NFR2.1 | Password Encryption | Passwords shall be hashed using bcrypt with 10 salt rounds |
| NFR2.2 | Authentication Token | JWT tokens shall expire after 24 hours |
| NFR2.3 | HTTPS Communication | All data transmission shall use HTTPS protocol |
| NFR2.4 | Input Validation | All user inputs shall be validated and sanitized |
| NFR2.5 | SQL Injection Protection | Mongoose ODM shall prevent SQL injection |
| NFR2.6 | CORS Configuration | CORS shall be restricted to authorized domains in production |
| NFR2.7 | Role-Based Access Control | Resources shall be accessible only to authorized users |
| NFR2.8 | Data Privacy | Personal information shall be securely stored and encrypted |

#### NFR3: Usability

| ID | Requirement | Description |
|---|---|---|
| NFR3.1 | Responsive Design | UI shall be responsive on devices from 320px to 2560px width |
| NFR3.2 | Accessibility | Platform shall follow WCAG 2.1 AA standards |
| NFR3.3 | Navigation | Users shall find main features within 3 clicks |
| NFR3.4 | Mobile Friendly | Platform shall be fully functional on mobile devices |
| NFR3.5 | Consistent UI | Design patterns and components shall be consistent throughout |

#### NFR4: Reliability and Availability

| ID | Requirement | Description |
|---|---|---|
| NFR4.1 | Uptime SLA | System shall maintain 99.5% uptime |
| NFR4.2 | Error Handling | System shall gracefully handle errors with user-friendly messages |
| NFR4.3 | Data Backup | Database shall be backed up daily |
| NFR4.4 | Recovery Time Objective | System recovery time shall be less than 1 hour |
| NFR4.5 | Data Integrity | System shall maintain referential integrity in database |

#### NFR5: Scalability

| ID | Requirement | Description |
|---|---|---|
| NFR5.1 | Horizontal Scaling | Backend shall support load balancing across multiple instances |
| NFR5.2 | Database Scaling | MongoDB shall support replication and sharding |
| NFR5.3 | Cache Implementation | High-traffic endpoints shall implement caching (Redis) |
| NFR5.4 | CDN Integration | Static assets shall be served via Content Delivery Network |

#### NFR6: Maintainability

| ID | Requirement | Description |
|---|---|---|
| NFR6.1 | Code Documentation | Code shall include JSDoc and TypeScript comments |
| NFR6.2 | Modular Architecture | Components shall follow single responsibility principle |
| NFR6.3 | Version Control | Git shall be used for source code management |
| NFR6.4 | Testing Coverage | Unit tests shall cover 70% of codebase |

---

## 3. Design

### 3.1 System Design

#### 3.1.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │    React Frontend (TypeScript + Tailwind CSS)        │  │
│  │  - Pages: Home, Login, Booking, Chat, Dashboard      │  │
│  │  - Components: Navbar, Forms, Chat, ProfileCards     │  │
│  │  - State Management: React Context + React Query     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────┬──────────────────┬──────────────────────────┘
                  │                  │
        HTTP/REST │                  │ WebSocket
                  │                  │
┌─────────────────┴──────────────────┴──────────────────────────┐
│                    Node.js/Express Backend                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            API Routes & Controllers                   │  │
│  │  - Auth Routes: /api/auth/register, /api/auth/login  │  │
│  │  - User Routes: /api/users/profile                   │  │
│  │  - Astrologer Routes: /api/astrologers               │  │
│  │  - Booking Routes: /api/bookings                     │  │
│  │  - Chat Routes: /api/chats                           │  │
│  │  - Horoscope Routes: /api/horoscopes                 │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Socket.IO Server (Real-time)              │  │
│  │  - Chat namespaces and event handlers                │  │
│  │  - Message broadcasting                              │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        Middleware & Utilities                         │  │
│  │  - Authentication (JWT & authMiddleware)             │  │
│  │  - Request validation                                │  │
│  │  - Error handling                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────┬──────────────────┬──────────────────────────┘
                  │                  │
        MongoDB   │                  │ Google Generative AI
                  │                  │
┌─────────────────┴──────────────────┴──────────────────────────┐
│                    External Services                          │
│  - MongoDB Database (Users, Astrologers, Bookings, Messages) │
│  - Google Generative AI (Chat assistance, Content generation)│
│  - Payment Gateway (Stripe/PayPal - Future)                  │
└─────────────────────────────────────────────────────────────┘
```

#### 3.1.2 Entity-Relationship (ER) Diagram

```
                    ┌─────────────┐
                    │    User     │
                    ├─────────────┤
                    │ _id         │◄─────────┐
                    │ name        │           │
                    │ email       │           │ references
                    │ password    │           │
                    │ role        │           │
                    │ birthDetails│           │
                    │ reports[]   │           │
                    │ timestamps  │           │
                    └─────────────┘           │
                       ▲       ▲              │
                       │       │ 1:1          │
                  ┌────┴───────┴──┬───────────┘
                  │                │
              1:1 │ 1:M            │ 1:M
                  │                │
            ┌─────────────┐  ┌────────────────┐
            │ Astrologer  │  │   Booking      │
            ├─────────────┤  ├────────────────┤
            │ _id         │  │ _id            │
            │ user(ref)   │  │ client(ref)    │
            │ title       │  │ astrologer(ref)│
            │ avatar      │  │ date           │
            │ specializ.. │  │ time           │
            │ experience  │  │ duration       │
            │ rating      │  │ status         │
            │ totalConsul.│  │ price          │
            │ pricePerMin │  │ paymentStatus  │
            │ bio         │  │ createdAt      │
            │ languages   │  └────────────────┘
            │ isAvailable │
            └─────────────┘       │
                  ▲               │ 1:M
                  │               │
              1:M │               ▼
                  │        ┌─────────────┐
                  │        │   Message   │
                  │        ├─────────────┤
                  │        │ _id         │
                  │        │ booking(ref)│
                  │        │ sender(ref) │
                  │        │ content     │
                  │        │ timestamp   │
                  │        └─────────────┘
                  │
            ┌─────┴─────────┐
            │               │ 1:M
            │               │
      ┌──────────────┐ ┌──────────────┐
      │  Horoscope   │ │ BirthChart   │
      ├──────────────┤ ├──────────────┤
      │ _id          │ │ _id          │
      │ zodiacSign   │ │ user(ref)    │
      │ period       │ │ planetData   │
      │ prediction   │ │ aspects      │
      │ date         │ │ calculations │
      │ content      │ │ generatedAt  │
      └──────────────┘ └──────────────┘
```

#### 3.1.3 Data Flow Diagrams (DFDs)

**Level 0 - Context Diagram:**

```
                    ┌─────────────┐
                    │   Client    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Vedic App  │
                    └──────┬──────┘
                           │
                  ┌────────┴──────────┐
                  │                   │
          ┌───────▼────────┐   ┌──────▼────────┐
          │    MongoDB     │   │ Google GenAI  │
          │   (Database)   │   │  (Chat & AI)  │
          └────────────────┘   └───────────────┘
```

**Level 1 - Main Processes:**

```
                        ┌────────────────┐
                        │ Vedic Platform │
                        └────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        │                      │                      │
    ┌───▼────┐          ┌──────▼──────┐        ┌──────▼──────┐
    │ Process│          │ Process     │        │ Process     │
    │ 1.0    │          │ 2.0         │        │ 3.0         │
    │Authen- │          │Astrologer   │        │Booking &    │
    │tication│          │Management   │        │Consultation │
    └────────┘          └─────────────┘        └─────────────┘
        │                     │                      │
        │                     │                      │
    ┌───▼────┐          ┌──────▼──────┐        ┌──────▼──────┐
    │ Process│          │ Process     │        │ Process     │
    │ 4.0    │          │ 5.0         │        │ 6.0         │
    │Real-   │          │Astrology    │        │Content      │
    │time    │          │Features     │        │Management   │
    │Chat    │          │             │        │             │
    └────────┘          └─────────────┘        └─────────────┘
```

**Process 1.0 - Authentication Data Flow:**

```
                         User Input
                             │
                             ▼
                    ┌─────────────────┐
                    │   Validation    │◄──── Email format check
                    │   Engine        │      Password requirements
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Encryption     │◄──── Bcrypt hashing
                    │  Engine         │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Database     │◄──── MongoDB
                    │    Store        │      Users collection
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Token Gen.    │◄──── JWT creation
                    │                 │
                    └────────┬────────┘
                             │
                             ▼
                        Auth Token
```

**Process 2.0 - Astrologer Management Data Flow:**

```
        Astrologer Profile Data
                 │
                 ▼
        ┌─────────────────┐
        │ Data Validation │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Profile Service │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │   MongoDB       │
        │ Astrologer DB   │
        └────────┬────────┘
                 │
                 ▼
        Astrologer Record Created
```

### 3.2 Database Design

#### 3.2.1 Collections Schema

**Users Collection:**

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['client', 'astrologer'], default: 'client'),
  birthDetails: {
    date: Date,
    time: String,
    place: String
  },
  reports: [
    {
      title: String,
      url: String,
      date: Date (default: current date)
    }
  ],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Astrologers Collection:**

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  title: String (required),
  avatar: String (default: '✨'),
  specializations: [String] (required),
  experience: Number (required),
  rating: Number (default: 5.0),
  totalConsultations: Number (default: 0),
  pricePerMinute: Number (required),
  bio: String (required),
  languages: [String] (required),
  isAvailable: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Bookings Collection:**

```javascript
{
  _id: ObjectId,
  client: ObjectId (ref: User, required),
  astrologer: ObjectId (ref: Astrologer, required),
  date: Date (required),
  time: String (required),
  duration: Number (in minutes, required),
  status: String (enum: ['pending', 'confirmed', 'completed', 'cancelled']),
  price: Number (calculated: duration * pricePerMinute),
  paymentStatus: String (enum: ['pending', 'completed', 'failed']),
  notes: String,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Messages Collection:**

```javascript
{
  _id: ObjectId,
  booking: ObjectId (ref: Booking, required),
  sender: ObjectId (ref: User, required),
  content: String (required),
  timestamp: Date (default: Date.now),
  isAIAssisted: Boolean (default: false),
  read: Boolean (default: false)
}
```

**Horoscopes Collection:**

```javascript
{
  _id: ObjectId,
  zodiacSign: String (enum: [all 12 signs]),
  period: String (enum: ['daily', 'weekly', 'monthly']),
  date: Date,
  prediction: String,
  content: String,
  createdAt: Date (auto)
}
```

**BirthCharts Collection:**

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  planetData: Object {
    sun: Object,
    moon: Object,
    mars: Object,
    mercury: Object,
    jupiter: Object,
    venus: Object,
    saturn: Object
  },
  aspects: [Object],
  calculations: Object,
  generatedAt: Date (auto)
}
```

**Reports Collection:**

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  title: String,
  type: String (enum: ['birth_chart', 'horoscope', 'compatibility']),
  content: String,
  generatedAt: Date (auto),
  expiresAt: Date (30 days from creation)
}
```

#### 3.2.2 Indexes for Performance

```javascript
// Users Collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })

// Astrologers Collection
db.astrologers.createIndex({ user: 1 }, { unique: true })
db.astrologers.createIndex({ specializations: 1 })
db.astrologers.createIndex({ rating: -1 })
db.astrologers.createIndex({ isAvailable: 1 })

// Bookings Collection
db.bookings.createIndex({ client: 1 })
db.bookings.createIndex({ astrologer: 1 })
db.bookings.createIndex({ date: 1 })
db.bookings.createIndex({ status: 1 })

// Messages Collection
db.messages.createIndex({ booking: 1 })
db.messages.createIndex({ sender: 1 })
db.messages.createIndex({ timestamp: -1 })

// Horoscopes Collection
db.horoscopes.createIndex({ zodiacSign: 1, period: 1 })
db.horoscopes.createIndex({ date: -1 })

// BirthCharts Collection
db.birthcharts.createIndex({ user: 1 })
```

#### 3.2.3 Data Integrity and Constraints

| Collection | Field | Constraint | Type | Rule |
|---|---|---|---|---|
| Users | email | Unique | Database | No duplicate emails |
| Users | password | Not Null | Application | Required field |
| Users | role | Enum | Application | 'client' or 'astrologer' |
| Astrologers | user | Foreign Key | Database | Must reference valid User |
| Astrologers | pricePerMinute | Min Value | Application | Must be > 0 |
| Bookings | client | Foreign Key | Database | Must reference valid User |
| Bookings | astrologer | Foreign Key | Database | Must reference valid Astrologer |
| Bookings | date | Not Null | Application | Booking must have date |
| Messages | booking | Foreign Key | Database | Must reference valid Booking |
| Messages | content | Max Length | Application | Max 5000 characters |

---

## 4. Scheduling and Estimates

### 4.1 Project Timeline

#### Phase 1: Foundation & Setup (2 weeks)
- **Duration:** Week 1-2
- **Tasks:**
  - Environment setup and tooling
  - Database schema design and MongoDB setup
  - Basic project structure for frontend and backend
  - Git repository initialization and documentation
- **Deliverables:** Development environment, database schema, project scaffolding
- **Estimated Effort:** 80 hours

#### Phase 2: Authentication & User Management (3 weeks)
- **Duration:** Week 3-5
- **Tasks:**
  - User registration and login implementation
  - JWT-based authentication
  - Password encryption and security
  - Role-based access control (RBAC)
  - User profile management
- **Deliverables:** Auth endpoints, protected routes, user profiles
- **Estimated Effort:** 120 hours

#### Phase 3: Astrologer Management (2 weeks)
- **Duration:** Week 6-7
- **Tasks:**
  - Astrologer profile creation and management
  - Specialization categories
  - Rating and review system
  - Astrologer directory and search
- **Deliverables:** Astrologer endpoints, directory UI
- **Estimated Effort:** 100 hours

#### Phase 4: Booking System (2 weeks)
- **Duration:** Week 8-9
- **Tasks:**
  - Booking creation and validation
  - Calendar widget for date/time selection
  - Availability checking
  - Booking confirmation workflow
  - Booking history tracking
- **Deliverables:** Booking endpoints, booking UI, calendar component
- **Estimated Effort:** 110 hours

#### Phase 5: Real-time Chat System (3 weeks)
- **Duration:** Week 10-12
- **Tasks:**
  - Socket.IO WebSocket setup
  - Chat message implementation
  - Message persistence
  - Typing indicators
  - Google Generative AI integration
- **Deliverables:** Chat system, AI chat assistant, message history
- **Estimated Effort:** 140 hours

#### Phase 6: Astrological Features (2 weeks)
- **Duration:** Week 13-14
- **Tasks:**
  - Horoscope generation engine
  - Birth chart calculation
  - Zodiac sign analysis
  - Report generation
- **Deliverables:** Horoscope module, birth chart component, report generation
- **Estimated Effort:** 100 hours

#### Phase 7: Content & Static Pages (1 week)
- **Duration:** Week 15
- **Tasks:**
  - Blog section implementation
  - Contact form
  - Terms of Service and Privacy Policy
  - Landing page enhancements
- **Deliverables:** Content pages, blog system
- **Estimated Effort:** 60 hours

#### Phase 8: Testing & QA (2 weeks)
- **Duration:** Week 16-17
- **Tasks:**
  - Unit testing
  - Integration testing
  - End-to-end testing
  - Performance testing
  - Security testing
- **Deliverables:** Test suite, test reports
- **Estimated Effort:** 130 hours

#### Phase 9: Deployment & Documentation (1 week)
- **Duration:** Week 18
- **Tasks:**
  - Production environment setup
  - Deployment pipeline
  - Comprehensive documentation
  - User manuals
  - Handover
- **Deliverables:** Deployed application, documentation
- **Estimated Effort:** 80 hours

### 4.2 Resource Allocation

| Role | Count | Responsibilities |
|---|---|---|
| Full Stack Developer | 2 | Frontend and backend development |
| Backend Developer | 1 | Backend optimization, API development |
| Frontend Developer | 1 | UI/UX implementation, responsive design |
| QA Engineer | 1 | Testing, bug reporting, quality assurance |
| Database Administrator | 0.5 | Schema optimization, performance tuning |
| DevOps Engineer | 0.5 | Deployment, infrastructure, monitoring |
| Project Manager | 1 | Coordination, timeline tracking, stakeholder communication |

### 4.3 Effort Estimation Summary

| Phase | Estimated Hours | Estimated Days | Team Size |
|---|---|---|---|
| Phase 1: Foundation & Setup | 80 | 10 | 2 |
| Phase 2: Authentication | 120 | 15 | 2 |
| Phase 3: Astrologer Management | 100 | 13 | 2 |
| Phase 4: Booking System | 110 | 14 | 2 |
| Phase 5: Real-time Chat | 140 | 18 | 2 |
| Phase 6: Astrological Features | 100 | 13 | 2 |
| Phase 7: Content & Pages | 60 | 8 | 1 |
| Phase 8: Testing & QA | 130 | 17 | 2 |
| Phase 9: Deployment & Docs | 80 | 10 | 1 |
| **TOTAL** | **920** | **118 days** | **~1.5 FTE** |

**Timeline:** Approximately 18 weeks (4.5 months) with concurrent development across teams

### 4.4 Risk Assessment and Mitigation

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Database performance issues | Medium | High | Implement indexing, caching, query optimization from day 1 |
| Third-party API failures | Low | Medium | Implement fallback mechanisms, error handling |
| Scope creep | High | High | Strict requirement management, change control process |
| Team member unavailability | Medium | Medium | Cross-training, documentation, backup resources |
| Security vulnerabilities | Low | High | Security audits, penetration testing, code review |
| Integration challenges | Medium | Medium | Early integration testing, regular syncs between teams |

### 4.5 Deliverables by Phase

| Phase | Key Deliverables |
|---|---|
| 1 | Database schema document, project structure, setup guide |
| 2 | Authentication module, user management APIs, tests |
| 3 | Astrologer module, directory feature, rating system |
| 4 | Booking APIs, calendar widget, booking management UI |
| 5 | Chat system, WebSocket implementation, AI integration |
| 6 | Horoscope engine, birth chart, report generator |
| 7 | Blog system, static pages, contact form |
| 8 | Test suite, QA report, bug tracking list |
| 9 | Deployed application, user documentation, API docs |

### 4.6 Quality Metrics

| Metric | Target | Measurement |
|---|---|---|
| Code Coverage | 70% | Unit test coverage report |
| Test Pass Rate | 95% | Automated test results |
| Performance (API Response) | <500ms | Load testing report |
| Page Load Time | <3s | Performance profiling |
| Bug Detection | <5 critical bugs | QA testing results |
| Documentation Completeness | 100% | Documentation checklist |
| Uptime | 99.5% | Monitoring dashboard |

---

## 5. Appendices

### 5.1 Technology Stack Summary

**Frontend:**
- React 18+ with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- shadcn/ui (component library)
- React Query (state management)
- Socket.IO Client (real-time communication)

**Backend:**
- Node.js + Express.js
- MongoDB with Mongoose ODM
- Socket.IO (WebSocket server)
- JWT for authentication
- Bcryptjs for password hashing
- Google Generative AI API
- CORS middleware

**Development Tools:**
- Vitest (testing)
- ESLint (code quality)
- Git (version control)
- Nodemon (dev auto-reload)

### 5.2 Environment Configuration

**Development Environment:**
```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vedic_astrology
JWT_SECRET=dev_secret_key_123
GOOGLE_API_KEY=your_google_api_key
```

**Production Environment:**
```
VITE_API_URL=https://api.vedicastrology.com
VITE_SOCKET_URL=https://socket.vedicastrology.com
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vedic_astrology
JWT_SECRET=production_secret_key_secure
GOOGLE_API_KEY=production_google_api_key
```

### 5.3 API Endpoints Reference

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Token verification

**Users:**
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/birth-details` - Save birth details

**Astrologers:**
- `GET /api/astrologers` - List all astrologers
- `GET /api/astrologers/:id` - Get astrologer details
- `POST /api/astrologers` - Create astrologer profile
- `PUT /api/astrologers/:id` - Update astrologer profile

**Bookings:**
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking

**Chat:**
- `GET /api/chat/history/:bookingId` - Get chat history
- `POST /api/chat/send` - Send message (via WebSocket)

**Horoscopes:**
- `GET /api/horoscopes/:sign` - Get horoscope by zodiac sign
- `GET /api/horoscopes/:sign/:period` - Get period horoscope

---

## Conclusion

This Vedic Astrology Platform represents a comprehensive, full-stack web application that successfully bridges traditional astrological wisdom with modern technology. The project demonstrates proficiency in:

- **Full-stack development** across frontend (React) and backend (Node.js)
- **Real-time communication** using WebSocket technology
- **Database design** with MongoDB and relational modeling
- **Security implementation** with JWT and bcrypt
- **API design** following REST principles
- **User experience** with responsive, modern UI design
- **Software engineering practices** including testing, documentation, and DevOps

The application is positioned for future enhancements including video consultation, payment integration, mobile app development, and advanced analytics capabilities.

---

**Report Generated:** April 22, 2026  
**Project Status:** Capstone Project Documentation  
**Version:** 1.0

