# Research Paper Methodology — Corrections & Review

Below are all inaccuracies found in your methodology text, compared against your actual codebase. Each issue shows **what you wrote → what it actually is**, with corrected text.

---

## Section A: Dataset

> [!NOTE]
> This section describes a Kaggle dataset. **No such dataset file (CSV/JSON) exists in your codebase.** Your current `astroController.js` uses hardcoded mock horoscope strings, not a dataset. If you plan to add this dataset, do so before submitting. Otherwise, this section is fine as a description of planned work.

**No factual errors** in this section if the dataset is being added. Just ensure the dataset file is actually integrated into the project.

---

## Section B: Few-Shot Prompting with Gemini AI

> [!NOTE]
> Gemini AI is **NOT currently implemented** in your codebase. `horoscopeController.js` is empty, and `astroController.js` uses hardcoded mock data. This section is fine if describing the **proposed/planned** system, but should not claim it is already working unless you implement it first.

**No factual errors** — the description is technically sound as a proposed approach.

---

## Section C: Kundali Generation using Swiss Ephemeris

> [!WARNING]
> Your current codebase uses **Prokerala API** for planetary calculations, NOT Swiss Ephemeris. Also it uses **OpenStreetMap Nominatim** for geocoding, NOT Google Geocoding API. If you plan to switch, implement it first. Otherwise, update the text to match reality.

**No factual errors** if this describes the planned/target system. But make sure your implementation matches before submission.

---

## Section D: System Modules

✅ **No errors found.** The five modules match what exists + what's planned.

---

## Section A (V): Frontend Development — ❌ ERRORS FOUND

### Error 1: Dashboard sections listed incorrectly

**You wrote:**
> React Router 6 was used to facilitate client-side navigation between the Dashboard's 5 principal sections — **Home, Kundali, Predictions, Consult and Blog**

**Actual routes in `App.tsx`:**
The 5 principal public sections are: **Home (`/`), Kundali (`/birth-chart`), Horoscope (`/horoscope`), Astrologers/Booking (`/booking`), and Blog (`/blog`)**

**Corrected text:**
> React Router 6 was used to facilitate client-side navigation between the application's 5 principal sections — **Home, Kundali, Horoscope, Consult and Blog**, all without full page refresh...

---

### Error 2: WebRTC is NOT implemented

**You wrote:**
> the WebRTC peer-connection is created through a bespoke signalling layer on top of Socket.io

**Reality:** WebRTC is **planned but not yet built**. Your codebase only has Socket.io text chat.

**Corrected text (if describing planned system):**
> the WebRTC peer-connection **is proposed to be** created through a bespoke signalling layer on top of Socket.io

**Or, if you plan to state it's implemented, you must build it first.**

---

## Section B (V): Backend Development — ❌ ERRORS FOUND

### Error 1: Express.js version wrong

**You wrote:** `express.js 4.18`
**Actual (`package.json`):** `express 4.19.2`

**Correction:** → `Express.js 4.19`

---

### Error 2: bcrypt work factor wrong

**You wrote:** `passwords are encrypted into hashes of work factor 12 using bcrypt`
**Actual code (`User.js` line 31):**
```javascript
const salt = await bcrypt.genSalt(10);
```

**Correction:** → `work factor 10` (not 12)

---

### Error 3: RBAC roles wrong — no "platform administrator" exists

**You wrote:** `RBAC user, registered astrologer, platform administrator roles`
**Actual (`User.js` line 11):**
```javascript
enum: ['client', 'astrologer']
```

There are only **2 roles**: `client` and `astrologer`. No `administrator` role exists.

**Corrected text:**
> Role-based access control (RBAC) is maintained through two primary roles: **client** and **astrologer**, with distinct permission boundaries for each.

**If you want to claim 3 roles, you need to add an `admin` role to the User model.**

---

### Error 4: "access and refresh token pairs" — only access tokens exist

**You wrote:** `employs access and refresh token pairs through JWT`
**Actual (`authController.js`):**
```javascript
jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
```

Only a **single JWT access token** is issued (30-day expiry). There is **no refresh token** mechanism.

**Corrected text:**
> Stateless authentication employs **JWT access tokens** with a 30-day expiration period; passwords are encrypted...

---

### Error 5: Socket.io version wrong

**You wrote:** `Socket.io 4.6`
**Actual (`backend/package.json`):** `socket.io 4.7.5`

**Correction:** → `Socket.io 4.7`

---

### Error 6: Gemini & Flask microservice not implemented

**You wrote:** `Gemini AI is integrated using the official @google/generative-ai SDK` and `Python Swiss Ephemeris computation is exposed to Node.js through a Flask microservice`

**Reality:** Neither is currently in the codebase. No `@google/generative-ai` dependency exists in `package.json`. No Flask microservice exists.

**Corrected text (if describing proposed system):**
> Gemini AI **is proposed to be** integrated using the official @google/generative-ai SDK... Python Swiss Ephemeris computation **will be** exposed to Node.js through a Flask microservice...

---

## Section C (V): Database Design — ❌ ERRORS FOUND

### Error 1: Wrong number and names of collections

**You wrote 6 collections:**
> Users, Astrologers, Horoscopes, Bookings, BlogPosts, Transactions

**Actual Mongoose models in `backend/models/`:**

| Model | File | Status |
|---|---|---|
| Users | `User.js` | ✅ Exists |
| Astrologers | `Astrologer.js` | ✅ Exists |
| Bookings | `Booking.js` | ✅ Exists |
| Messages | `Message.js` | ✅ Exists (you didn't mention this!) |
| BirthCharts | `BirthChart.js` | ✅ Exists (you didn't mention this!) |
| Reports | `Report.js` | ✅ Exists (you didn't mention this!) |
| Horoscopes | — | ❌ Does NOT exist |
| BlogPosts | — | ❌ Does NOT exist (planned) |
| Transactions | — | ❌ Does NOT exist (planned) |

**Corrected text:**
> There are six major collections: **Users** (profile, birth data, role, authentication tokens), **Astrologers** (extended profile, specialisations, availability), **Bookings** (session lifecycle, payment status), **Messages** (real-time chat transcripts linked to bookings), **BirthCharts** (generated Kundali data with planetary positions), and **Reports** (astrological report references). Additional collections for **BlogPosts** and **Transactions** are planned for future integration.

---

### Error 2: Redis not implemented

**You wrote:** `The caching layer of 7.0 version of redis is utilized...`

**Reality:** Redis is **not installed or configured** anywhere in the project. No `redis` or `ioredis` package exists in `package.json`.

**Corrected text (if planned):**
> A caching layer using **Redis** is proposed to look up commonly accessed datasets...

---

### Error 3: AES-256 & TLS 1.3 not implemented

**You wrote:** `personal or financial information is encrypted using the AES-256 at rest, and the communication in APIs is enforced using TLS 1.3`

**Reality:** 
- No AES-256 encryption is configured in the codebase
- No TLS/SSL configuration exists in `server.js` (it uses plain HTTP)
- CORS is set to `origin: "*"` (allows all origins)

**Corrected text (if planned):**
> Encryption of personal or financial information using AES-256 at rest and TLS 1.3 for API communication **are planned for production deployment**.

---

### Error 4: Astrologer schema details wrong

**You wrote:** `Astrologers (extended profile, specialisations, availability, wallet balance)`

**Actual `Astrologer.js`:** There is **no `wallet balance` field**. The actual fields are: `user, title, avatar, specializations, experience, rating, totalConsultations, pricePerMinute, bio, languages, isAvailable`.

**Correction:** Remove "wallet balance" or add the field to the model.

---

## Summary of All Corrections

| # | Section | What You Wrote | What It Should Be |
|---|---|---|---|
| 1 | Frontend | Dashboard sections: Home, Kundali, Predictions, Consult, Blog | Home, Kundali, **Horoscope**, Consult, Blog |
| 2 | Frontend | WebRTC is created | WebRTC **is proposed** (not yet built) |
| 3 | Backend | Express.js **4.18** | Express.js **4.19** |
| 4 | Backend | bcrypt work factor **12** | bcrypt work factor **10** |
| 5 | Backend | RBAC: user, astrologer, **platform administrator** | RBAC: **client**, **astrologer** (no admin role) |
| 6 | Backend | Access and **refresh token pairs** | **Single access token** only (30-day expiry) |
| 7 | Backend | Socket.io **4.6** | Socket.io **4.7** |
| 8 | Backend | Gemini AI **is integrated** | Gemini AI **is proposed** (not yet built) |
| 9 | Backend | Flask microservice (present) | Flask microservice **is proposed** (not yet built) |
| 10 | Database | 6 collections: Users, Astrologers, **Horoscopes**, Bookings, **BlogPosts**, **Transactions** | 6 collections: Users, Astrologers, Bookings, **Messages**, **BirthCharts**, **Reports** |
| 11 | Database | Redis **7.0 is utilized** | Redis **is not implemented** |
| 12 | Database | AES-256 at rest, TLS 1.3 | **Not implemented** — planned for production |
| 13 | Database | Astrologer has **wallet balance** | **No wallet balance field** exists |
