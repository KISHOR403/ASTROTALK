# Research Paper — Tables & Workflows (Ready to Copy)

---

## TABLE I: TECHNOLOGY STACK

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Frontend Framework | React.js | 18.3 | Component-based UI rendering with virtual DOM |
| Language | TypeScript | 5.8 | Static type checking for JavaScript |
| Build Tool | Vite | 5.4 | Fast development server with Hot Module Replacement |
| Routing | React Router | 6.30 | Client-side SPA navigation |
| Styling | Tailwind CSS | 3.4 | Utility-first CSS framework |
| UI Primitives | Radix UI | Latest | Accessible, unstyled component primitives |
| Animations | Framer Motion | 12.31 | Declarative UI animations and transitions |
| State Management | TanStack React Query | 5.83 | Server state caching and synchronization |
| Form Handling | React Hook Form + Zod | 7.61 / 3.25 | Performant forms with schema validation |
| Charts | Recharts | 2.15 | Data visualization for earnings and statistics |
| Backend Runtime | Node.js | 18 | Non-blocking server-side JavaScript |
| API Framework | Express.js | 4.19 | Lightweight REST API framework |
| Database | MongoDB | 6.0 | NoSQL document database |
| ODM | Mongoose | 8.4 | Object Data Modeling for MongoDB |
| Authentication | JSON Web Token | 9.0 | Stateless token-based authentication |
| Password Hashing | bcrypt.js | 2.4 | Salted password hashing (work factor 10) |
| Real-Time Communication | Socket.io | 4.7 | Bidirectional WebSocket communication |
| AI Model | Google Gemini 1.5 Flash | Latest | Few-shot prompted horoscope and report generation |
| Ephemeris Engine | pyswisseph (Python) | 2.10 | High-precision planetary position calculations |
| Video/Voice Calls | WebRTC | Native | Peer-to-peer audio/video streaming |
| Payment Gateway | Razorpay | Latest | UPI, card, net banking payment processing |
| Caching | Redis | 7.0 | In-memory data caching layer |
| Push Notifications | Firebase Cloud Messaging | Latest | Cross-platform push notification delivery |
| Geocoding | Google Geocoding API | v3 | Location-to-coordinate conversion |

---

## TABLE II: SYSTEM MODULES AND FEATURES

| Module | Key Features | Frontend Pages | Backend Endpoints |
|---|---|---|---|
| Automated Kundali Generation | Birth chart calculation, SVG chart rendering, Dasha periods, Nakshatra positions, Yoga analysis, AI interpretation | BirthChart.tsx | POST /api/astro/birth-chart |
| AI-Enabled Horoscope Prediction | Personalized daily horoscope, mood prediction, lucky number/colour, compatibility suggestions | Horoscope.tsx, Compatibility.tsx | GET /api/astro/horoscope/:sign, POST /api/astro/compatibility |
| Real-Time Astrologer Consultation | Astrologer browsing, slot booking, text chat, video/voice call, real-time notifications | Booking.tsx, BookingPage.tsx, Chat.tsx | GET /api/astrologers, POST /api/bookings, GET /api/chat/:bookingId |
| Integrated Blog Content | Article browsing, category filtering, rich-text publishing, AI-assisted writing | Blog.tsx, BlogPost.tsx | GET /api/blog, POST /api/blog |
| Astrologer Dashboard | Session management, earnings analytics, availability scheduling, profile editing, notification settings | Dashboard.tsx, Bookings.tsx, Earnings.tsx, Availability.tsx, EditProfile.tsx, NotificationSettings.tsx | GET /api/astrologers/dashboard, GET /api/astrologers/earnings, PUT /api/astrologers/profile |

---

## TABLE III: DATABASE COLLECTIONS

| Collection | Key Fields | Relationships | Purpose |
|---|---|---|---|
| Users | _id, name, email, password (bcrypt), role (client/astrologer), birthDetails {date, time, place}, reports[], timestamps | Referenced by Astrologers, Bookings, Messages, BirthCharts | Stores all registered user accounts with role-based access |
| Astrologers | _id, user (ref: Users), title, avatar, specializations[], experience, rating, totalConsultations, pricePerMinute, bio, languages[], isAvailable | References Users; Referenced by Bookings | Extended profile for users with astrologer role |
| Bookings | _id, user (ref: Users), astrologer (ref: Astrologers), startTime, duration, status (scheduled/completed/cancelled), price, topic, paymentStatus (pending/paid/failed), timestamps | References Users and Astrologers; Referenced by Messages and Transactions | Tracks consultation session lifecycle |
| Messages | _id, booking (ref: Bookings), sender (ref: Users), text, timestamps | References Bookings and Users | Stores real-time chat messages per consultation |
| BirthCharts | _id, user (ref: Users), dateOfBirth, timeOfBirth, location, coordinates, chartData (Mixed), timestamps | References Users | Stores generated Kundali data with planetary positions |
| Reports | _id, title, url, date | Embedded in Users | Stores astrological report references |
| BlogPosts (Planned) | _id, title, slug, content, author, category, tags[], coverImage, isPublished, publishedAt | — | Dynamic blog content management |
| Transactions (Planned) | _id, user (ref: Users), booking (ref: Bookings), razorpayOrderId, razorpayPaymentId, amount, currency, status, timestamps | References Users and Bookings | Payment transaction records |

---

## TABLE IV: REST API ENDPOINTS

| # | Method | Endpoint | Access Level | Description |
|---|---|---|---|---|
| 1 | POST | /api/auth/register | Public | Register new user with name, email, password, role |
| 2 | POST | /api/auth/login | Public | Authenticate user and return JWT token |
| 3 | GET | /api/users/profile | Private | Retrieve logged-in user profile |
| 4 | GET | /api/users/birth-details | Private | Retrieve saved birth details |
| 5 | GET | /api/users/reports | Private | Retrieve generated astrological reports |
| 6 | GET | /api/users/chats | Private | Retrieve chat history overview |
| 7 | GET | /api/astrologers | Public | List all registered astrologers |
| 8 | GET | /api/astrologers/:id | Public | Get specific astrologer profile |
| 9 | GET | /api/astrologers/me | Astrologer | Get own astrologer profile |
| 10 | PUT | /api/astrologers/profile | Astrologer | Update astrologer profile details |
| 11 | GET | /api/astrologers/dashboard | Astrologer | Retrieve dashboard statistics |
| 12 | GET | /api/astrologers/earnings | Astrologer | Retrieve earnings breakdown |
| 13 | PUT | /api/astrologers/availability | Astrologer | Toggle online/offline availability |
| 14 | POST | /api/astrologers/availability/slots | Astrologer | Create available time slots for a date |
| 15 | POST | /api/bookings | Client | Create a new consultation booking |
| 16 | GET | /api/bookings/user | Private | List user's bookings |
| 17 | GET | /api/bookings/astrologer | Astrologer | List bookings for astrologer |
| 18 | PUT | /api/bookings/:id/status | Private | Update booking status |
| 19 | PATCH | /api/bookings/:id/pay | Client | Mark booking payment as paid |
| 20 | GET | /api/astro/horoscope/:sign | Public | Get daily horoscope for zodiac sign |
| 21 | POST | /api/astro/compatibility | Public | Check compatibility between two signs |
| 22 | POST | /api/astro/birth-chart | Public | Generate Kundali birth chart |
| 23 | GET | /api/chat/:bookingId | Private | Retrieve chat messages for a booking |

---

## TABLE V: SOCKET.IO REAL-TIME EVENTS

| Event Name | Direction | Payload | Purpose |
|---|---|---|---|
| connection | Client → Server | — | Establish WebSocket connection |
| join_room | Client → Server | bookingId | Join a chat room for a specific booking |
| send_message | Client → Server | {roomId, sender, text} | Send a chat message |
| receive_message | Server → Client | {_id, booking, sender, text, createdAt} | Broadcast received message to room participants |
| new_notification | Server → Client | {type, message, bookingId, timestamp} | Push booking/payment notification to astrologer |
| disconnect | Client → Server | — | Close WebSocket connection |
| call_initiate | Client → Server | {bookingId, callType} | Initiate WebRTC video/voice call |
| call_offer | Server → Client | {sdp} | Forward SDP offer to callee |
| call_answer | Client → Server | {sdp} | Send SDP answer back to caller |
| ice_candidate | Bidirectional | {candidate} | Exchange ICE candidates for peer connection |
| call_end | Either → Server | {bookingId} | Terminate active call |

---

## TABLE VI: SECURITY MEASURES

| Security Layer | Implementation | Details |
|---|---|---|
| Password Storage | bcrypt hashing | Salt rounds: 10; plaintext never stored |
| Authentication | JWT Access Tokens | 30-day expiration; signed with server-side secret |
| Authorization | Role-Based Access Control | Two roles: client, astrologer; middleware-enforced |
| API Security | CORS Middleware | Cross-origin request filtering |
| Route Protection | Dual-layer guards | Client-side ProtectedRoute component + server-side protect middleware |
| Data Encryption (Planned) | AES-256 at rest | Personal and financial information |
| Transport Security (Planned) | TLS 1.3 | Encrypted API communication |

---

## TABLE VII: COMPARISON WITH EXISTING SYSTEMS

| Feature | AstroSage | Kundli Software | Co-Star | Proposed System |
|---|---|---|---|---|
| AI-Generated Horoscopes | ✗ | ✗ | Partial | ✓ (Gemini 1.5 Flash) |
| Kundali Generation | ✓ | ✓ | ✗ | ✓ (Swiss Ephemeris) |
| Real-Time Astrologer Chat | ✗ | ✗ | ✗ | ✓ (Socket.io) |
| Video/Voice Consultation | ✗ | ✗ | ✗ | ✓ (WebRTC) |
| Astrologer Dashboard | ✗ | ✗ | ✗ | ✓ |
| Integrated Blog | ✗ | ✗ | ✗ | ✓ |
| Online Payment | ✗ | ✗ | ✗ | ✓ (Razorpay) |
| Few-Shot Prompting | ✗ | ✗ | ✗ | ✓ |
| Personalization | ✗ | ✗ | ✓ | ✓ |
| Open Source | ✗ | ✗ | ✗ | ✓ |

---

## WORKFLOW 1: USER REGISTRATION AND AUTHENTICATION

Step 1: User navigates to the registration page and enters name, email, password, and selects role (client or astrologer).

Step 2: Frontend sends POST request to /api/auth/register with user credentials.

Step 3: Server checks if user with the provided email already exists in MongoDB.

Step 4: If user exists, returns error 400 ("User already exists"). If not, proceeds.

Step 5: Password is hashed using bcrypt with a salt factor of 10.

Step 6: New user document is created and saved in the Users collection.

Step 7: Server generates a JWT access token with the user's ID and 30-day expiry.

Step 8: Server responds with user profile data (_id, name, email, role) and JWT token.

Step 9: Frontend stores the response in localStorage and React AuthContext state.

Step 10: User is redirected to the dashboard page (/dashboard).

For subsequent logins, Steps 1–4 are replaced by email/password submission to /api/auth/login, where bcrypt.compare() verifies the password hash before issuing a new token.

---

## WORKFLOW 2: KUNDALI (BIRTH CHART) GENERATION

Step 1: User enters date of birth, time of birth, and place of birth on the Birth Chart page.

Step 2: Frontend sends POST request to /api/astro/birth-chart with the three input fields.

Step 3: Backend geocodes the location string to latitude and longitude coordinates using the Geocoding API.

Step 4: Date and time are formatted into an ISO 8601 datetime string with timezone offset.

Step 5: Backend authenticates with the planetary calculation service using OAuth2 client credentials.

Step 6: Backend requests planetary positions for the given datetime and coordinates.

Step 7: Response is parsed to extract: Ascendant (Lagna), Sun Sign, Moon Sign, and positions for all nine Navagraha bodies.

Step 8: House positions array is constructed with planet name, sign, house number, and degree for each planet.

Step 9: Birth chart data is saved to the BirthCharts collection in MongoDB.

Step 10: Complete chart data including planetary positions and astrological insights is returned to the frontend.

Step 11: Frontend renders the North Indian / South Indian style Kundali chart as an interactive SVG graphic.

---

## WORKFLOW 3: AI-POWERED HOROSCOPE GENERATION

Step 1: User selects their zodiac sign on the Horoscope page.

Step 2: Frontend sends GET request to /api/astro/horoscope/:sign.

Step 3: Backend checks Redis cache for an existing horoscope for the sign and current date.

Step 4: If cache hit, cached horoscope is returned immediately (skip to Step 9).

Step 5: If cache miss, backend loads three example horoscope descriptions for the same zodiac sign from the dataset file.

Step 6: A structured prompt is constructed containing: the zodiac sign, current date, user context, and the three example descriptions as few-shot examples.

Step 7: Prompt is sent to Google Gemini 1.5 Flash API via the @google/generative-ai SDK.

Step 8: Gemini generates a personalized horoscope prediction including daily prediction text, mood, lucky colour, lucky number, and compatible sign.

Step 9: Generated response is cached in Redis with a 24-hour TTL.

Step 10: Horoscope data is returned to the frontend and rendered with animations.

---

## WORKFLOW 4: ASTROLOGER CONSULTATION BOOKING

Step 1: Authenticated client navigates to the Booking page.

Step 2: Frontend loads all available astrologers via GET /api/astrologers.

Step 3: Client browses astrologer profiles (specializations, experience, rating, price, languages).

Step 4: Client selects an astrologer and navigates to /book/:astrologerId.

Step 5: Frontend displays the astrologer's detailed profile and available time slots.

Step 6: Client selects a time slot, enters consultation topic and duration.

Step 7: Frontend sends POST /api/bookings with astrologerId, slotId, startTime, duration, price, and topic.

Step 8: Backend validates that the selected slot exists and is not already booked.

Step 9: Slot is marked as booked in the Astrologer document.

Step 10: A new Booking document is created with status "scheduled" and paymentStatus "pending".

Step 11: Server emits a "new_notification" event via Socket.io to the astrologer's user room.

Step 12: Astrologer receives a real-time notification about the new booking.

Step 13: Client is redirected to /chat/:bookingId to begin the consultation.

---

## WORKFLOW 5: REAL-TIME CHAT COMMUNICATION

Step 1: User navigates to /chat/:bookingId after booking is created.

Step 2: Frontend establishes a Socket.io WebSocket connection to the server.

Step 3: Client emits "join_room" event with the bookingId to join the chat room.

Step 4: Frontend sends GET /api/chat/:bookingId to load previous chat history from MongoDB.

Step 5: Previous messages are rendered in chronological order in the chat interface.

Step 6: User types a message and clicks send.

Step 7: Frontend emits "send_message" event with {roomId, sender, text} via Socket.io.

Step 8: Server receives the event and saves the message to the Messages collection in MongoDB.

Step 9: Server broadcasts "receive_message" event with the saved message to all participants in the room.

Step 10: Both the client and astrologer see the new message appear in real-time without page refresh.

Step 11: When a user leaves, "disconnect" event is emitted and Socket.io performs cleanup.

---

## WORKFLOW 6: PAYMENT PROCESSING (RAZORPAY)

Step 1: Client selects a booking and initiates payment.

Step 2: Frontend sends POST /api/payments/create-order with booking amount and currency.

Step 3: Backend creates a Razorpay order via the Razorpay Node.js SDK with the specified amount.

Step 4: Razorpay returns an order_id which is sent back to the frontend.

Step 5: Frontend opens the Razorpay Checkout modal with the order_id.

Step 6: User completes payment through UPI, credit/debit card, net banking, or wallet.

Step 7: Razorpay sends a callback/webhook to the backend at POST /api/payments/verify.

Step 8: Backend verifies the payment signature using HMAC SHA256 with the Razorpay secret key.

Step 9: If signature is valid, the booking's paymentStatus is updated to "paid".

Step 10: A new Transaction document is created recording the razorpayOrderId, razorpayPaymentId, amount, and status.

Step 11: Server emits "new_notification" event to the astrologer notifying them of payment receipt.

Step 12: If signature is invalid, payment is marked as "failed" and the client is notified.

---

## WORKFLOW 7: WEBRTC VIDEO/VOICE CALL

Step 1: Client clicks "Start Call" button on the chat page during an active booking session.

Step 2: Frontend creates an RTCPeerConnection object and captures local media (camera/microphone) using getUserMedia().

Step 3: Client creates an SDP offer and sets it as the local description.

Step 4: Client emits "call_initiate" and "call_offer" events with the SDP offer via Socket.io (signaling server).

Step 5: Server forwards the call offer to the astrologer's socket.

Step 6: Astrologer receives the offer, creates an RTCPeerConnection, and sets the received SDP as remote description.

Step 7: Astrologer creates an SDP answer, sets it as local description, and emits "call_answer" via Socket.io.

Step 8: Server forwards the answer back to the client, who sets it as remote description.

Step 9: Both parties exchange ICE candidates via "ice_candidate" Socket.io events for NAT traversal.

Step 10: Once ICE negotiation completes, a direct peer-to-peer connection is established.

Step 11: Video/audio streams flow directly between client and astrologer browsers without passing through the server.

Step 12: Either party can end the call by emitting "call_end", which closes the peer connection on both sides.

---

## TABLE VIII: FRONTEND ROUTING ARCHITECTURE

| # | Route Path | Component | Access | Description |
|---|---|---|---|---|
| 1 | / | Index.tsx | Public | Landing page with hero section and features |
| 2 | /horoscope | Horoscope.tsx | Public | Daily horoscope for 12 zodiac signs |
| 3 | /birth-chart | BirthChart.tsx | Public | Kundali generation form and chart display |
| 4 | /compatibility | Compatibility.tsx | Public | Zodiac compatibility checker |
| 5 | /blog | Blog.tsx | Public | Blog article listing page |
| 6 | /blog/:slug | BlogPost.tsx | Public | Individual blog post view |
| 7 | /contact | Contact.tsx | Public | Contact form |
| 8 | /login | Login.tsx | Public | User login page |
| 9 | /signup | Signup.tsx | Public | User registration page |
| 10 | /privacy | PrivacyPolicy.tsx | Public | Privacy policy page |
| 11 | /terms | TermsOfService.tsx | Public | Terms of service page |
| 12 | /dashboard | Dashboard.tsx | Protected | User dashboard with profile and bookings |
| 13 | /chat | Chat.tsx | Protected | Chat interface |
| 14 | /chat/:bookingId | Chat.tsx | Protected | Chat room for specific booking |
| 15 | /booking | Booking.tsx | Protected | Browse and select astrologers |
| 16 | /book/:astrologerId | BookingPage.tsx | Protected | Book session with specific astrologer |
| 17 | /astrologer/dashboard | Dashboard.tsx | Protected (Astrologer) | Astrologer statistics dashboard |
| 18 | /astrologer/bookings | Bookings.tsx | Protected (Astrologer) | Manage incoming bookings |
| 19 | /astrologer/availability | Availability.tsx | Protected (Astrologer) | Set available time slots |
| 20 | /astrologer/earnings | Earnings.tsx | Protected (Astrologer) | View earnings and payouts |
| 21 | /astrologer/edit-profile | EditProfile.tsx | Protected (Astrologer) | Edit professional profile |
| 22 | /astrologer/notifications | NotificationSettings.tsx | Protected (Astrologer) | Notification preferences |
