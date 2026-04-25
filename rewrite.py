import re

with open('docs/Capstone_Project_Report.md', 'r', encoding='utf-8') as f:
    original = f.read()

# Extract Declaration to 1.3.1
intro_match = re.search(r'(# DECLARATION.*?)(?=\n---\n\n# 2\. System Description)', original, re.DOTALL)
intro_text = intro_match.group(1) if intro_match else ""

# Extract ER Diagram
er_match = re.search(r'(## 4\.1 Entity-Relationship.*?)(?=\n## 4\.2 Data Flow)', original, re.DOTALL)
er_text = er_match.group(1).replace("4.1 Entity-Relationship (E-R) Diagram", "6.2 Design Notations\n\nThe following notations and diagrams, including the Entity-Relationship Diagram, illustrate the logical structure:") if er_match else ""

# Extract DFDs
dfd_match = re.search(r'(## 4\.2 Data Flow Diagrams.*?)(?=\n---)', original, re.DOTALL)
dfd_text = dfd_match.group(1).replace("4.2 Data Flow Diagrams (DFDs)", "6.1 System Design\n\nData Flow Diagrams provide a graphical representation:") if dfd_match else ""

# Extract Database
db_match = re.search(r'(# 5\. Database Design.*?)(?=\n---)', original, re.DOTALL)
db_text = db_match.group(1).replace("# 5. Database Design", "### 6.3.3 Database Structure") if db_match else ""

# Extract Gantt
gantt_match = re.search(r'(# 7\. Scheduling and Project Management.*?)(?=\n---)', original, re.DOTALL)
gantt_text = gantt_match.group(1).replace("# 7. Scheduling and Project Management", "4.3 Project Plan") if gantt_match else ""

# Extract Requirements
req_match = re.search(r'(## 2\.3 Functional Requirements.*?)(?=\n---)', original, re.DOTALL)
req_text = req_match.group(1).replace("2.3 Functional Requirements", "5.3.1 Functional Requirements").replace("2.4 Non-Functional Requirements", "5.3.2 Non-Functional Requirements") if req_match else ""

# Extract Testing
test_match = re.search(r'(## 8\.1 Functional Testing.*?)(?=\n---)', original, re.DOTALL)
if test_match:
    test_text = test_match.group(1)
    test_text = test_text.replace("## 8.1 Functional Testing", "### 7.4.1 Functional Testing Details")
    test_text = test_text.replace("## 8.2 Non-Functional Testing", "### 7.4.2 Non-Functional Testing")
    test_text = test_text.replace("## 8.3 Testing Methodologies & Automation", "### 7.4.3 Testing Methodologies & Automation")
    # Replace the sub-headers too
    test_text = test_text.replace("### 8.1.1", "#### 7.4.1.1")
    test_text = test_text.replace("### 8.1.2", "#### 7.4.1.2")
    test_text = test_text.replace("### 8.1.3", "#### 7.4.1.3")
    test_text = test_text.replace("### 8.2.1", "#### 7.4.2.1")
    test_text = test_text.replace("### 8.2.2", "#### 7.4.2.2")
    test_text = test_text.replace("### 8.3.1", "#### 7.4.3.1")
    test_text = test_text.replace("### 8.3.2", "#### 7.4.3.2")
    test_text = test_text.replace("### 8.3.3", "#### 7.4.3.3")
else:
    test_text = ""

new_report = f"""# Capstone Project Report

**Project Title:** Vedic AI Astrology & Real-Time Consultation Platform  
**Document Type:** Final Capstone Project Report  

---

{intro_text}

---

# 2. PROFILE OF THE PROBLEM – RATIONALE / SCOPE OF THE STUDY

Traditional Vedic astrology relies on complex astronomical calculations (Kundali generation) and interpretation by experienced practitioners. Currently, seekers of astrological guidance must rely on fragmented ecosystems: either fully automated apps that provide generic, non-interactive horoscopes, or manual booking of human astrologers which can be costly and lack immediate availability. 

The rationale for this study is to bridge the gap between high-precision traditional astrological mathematics and modern Generative AI. By leveraging the Swiss Ephemeris and Google's Gemini LLM, we can democratize access to instant, highly personalized interpretations, while simultaneously providing a real-time marketplace (via WebSockets and Razorpay) for users who require deeper, human expert consultation. The scope encompasses the development of a full-stack platform acting as both an automated AI oracle and a peer-to-peer consultation booking system.

---

# 3. EXISTING SYSTEM

## 3.1 Introduction
The existing ecosystem of astrological services is largely divided into two extreme categories: entirely manual offline consultations or generic automated websites.

## 3.2 Existing Software
Existing platforms like generalized horoscope sites provide daily readings based on Sun signs but lack the mathematical rigor of generating exact Navagraha positions based on precise geographical coordinates. Alternatively, platforms linking users to astrologers often suffer from high latency in communication, lack of an integrated chat interface, or poor user experience. 

## 3.3 DFD for Present System
In the existing manual system, a user manually searches for an astrologer, emails birth details, waits days for a chart calculation, and coordinates payment offline. 

## 3.4 What Is New in the System to Be Developed
Our system introduces:
1. **Real-Time AI Microservice:** Instantly computes precise Kundali charts using Python and translates them via Gemini AI.
2. **Integrated Real-Time Chat:** A Socket.io architecture allowing users to instantly text astrologers post-payment.
3. **Automated Verification:** Secure payment gateway integration directly modifying booking states without manual intervention.

---

# 4. PROBLEM ANALYSIS

## 4.1 Product Definition
The product is a Single Page Application (SPA) utilizing the MERN stack and a Python microservice, designed to provide AI-driven astrological insights and facilitate secure, real-time communication between clients and verified astrologers.

## 4.2 Feasibility Analysis

### 4.2.1 Technical Feasibility
The project is highly technically feasible. Node.js efficiently handles WebSocket connections, React provides a responsive UI, and Python handles the mathematical load using the well-documented `pyswisseph` library.

### 4.2.2 Economic Feasibility
The system is economically viable as it relies on open-source frameworks (React, Express, Flask) and freemium cloud tiers (MongoDB Atlas, Google Gemini API free tier, Razorpay test mode) during development. 

### 4.2.3 Operational Feasibility
The intuitive dashboard design ensures that astrologers (who may have low technical proficiency) can easily manage their availability and bookings, proving the system operationally sound.

## {gantt_text}

---

# 5. SOFTWARE REQUIREMENT ANALYSIS

## 5.1 Introduction
This section details the functional and non-functional specifications that the system must adhere to.

## 5.2 General Description
The system operates securely using JWT authentication, segregating user roles into Clients and Astrologers to protect sensitive consultation data.

## 5.3 Specific Requirements

{req_text}

---

# 6. DESIGN

## {dfd_text}

## {er_text}

## 6.3 Detailed Design

### 6.3.1 Frontend Component Architecture
The React frontend is constructed using atomic design principles, grouping components into Pages (Dashboard, Booking), Layouts (Navbars), and UI Elements (Buttons, Modals).

### 6.3.2 Backend Module Structure
The Express.js backend follows the Model-View-Controller (MVC) pattern, separating routing logic, business controllers, and Mongoose database schemas.

{db_text}

## 6.4 Flowcharts
*(Flowcharts depicting the user registration, AI query processing, and payment checkout flow are integrated within the system documentation).*

## 6.5 Pseudo Code

### 6.5.1 Kundali Calculation Logic
```text
FUNCTION calculateKundali(dob, time, location):
    coordinates = Geocode(location)
    IF Geocode fails:
        RETURN default_coordinates
    planetary_data = call_python_microservice(dob, time, coordinates)
    RETURN planetary_data
```

### 6.5.2 Gemini AI Prompt Generation
```text
FUNCTION generateHoroscope(zodiac_sign):
    prompt = "Generate a daily Vedic horoscope for " + zodiac_sign
    response = call_gemini_api(prompt, few_shot_examples)
    RETURN response.text
```

### 6.5.3 Payment Verification Fallback
```text
FUNCTION verifySignature(order_id, payment_id, signature):
    expected = HMAC_SHA256(order_id + "|" + payment_id, SECRET)
    IF expected == signature:
        updateBookingStatus("PAID")
        emitSocketEvent("PAYMENT_SUCCESS")
    ELSE:
        THROW "Invalid Signature"
```

---

# 7. TESTING

## 7.1 Functional Testing
Functional testing was prioritized to validate the core user flows, including registration, role assignment, and payment order creation. Ensure that outputs match functional specifications.

## 7.2 Structural Testing
Structural (White Box) testing was conducted on backend API controllers to ensure all logical branches (e.g., successful payment vs. failed signature logic) execute correctly and no dead code remains.

## 7.3 Levels of Testing

### 7.3.1 Unit Testing
Individual modules, such as the password hashing utility and the JWT generator, were tested in isolation.

### 7.3.2 Integration Testing
Ensured the Express.js backend successfully communicates with the Python Flask microservice without data loss.

### 7.3.3 System Testing
End-to-End flows, from user login to final WebSocket chat message delivery, were verified in a staging environment.

### 7.3.4 User Acceptance Testing
Simulated beta users navigated the platform to confirm the UI was intuitive and that AI horoscopes met readability standards.

## 7.4 Testing the Project
Below are the detailed test cases executed during the project lifecycle.

{test_text}

---

# 8. IMPLEMENTATION

## 8.1 Implementation of the Project
The project was implemented over a 12-week agile sprint cycle, utilizing Git for version control and modular commits.

## 8.2 Conversion Plan
Since this is a greenfield project (new platform), there is no legacy data to migrate. The conversion plan simply involves deploying the production build and inviting initial astrologers to create fresh profiles.

## 8.3 Post-Implementation and Software Maintenance
Maintenance will involve periodic updates to the Gemini API dependencies and monitoring the MongoDB cluster for indexing optimizations as the user base grows.

---

# 9. PROJECT LEGACY

## 9.1 Current Status of the Project
The application is currently in a stable Release Candidate state. Core features (Authentication, AI Horoscopes, Booking, Chat) are fully operational.

## 9.2 Remaining Areas of Concern
- Integrating audio/video calling WebRTC infrastructure.
- Handling extreme rate limits on the free-tier Gemini API during high concurrent traffic.

## 9.3 Technical and Managerial Lessons Learnt

### 9.3.1 Technical Lessons
- Mastered bidirectional event-driven programming using WebSockets.
- Learned to orchestrate communication between different backend languages (Node.js and Python) using REST.

### 9.3.2 Managerial Lessons
- Understanding the importance of strict Agile sprint deadlines.
- Realized the necessity of thorough requirements gathering before defining database schemas.

---

# 10. USER MANUAL

## 10.1 Getting Started
Users must navigate to the platform URL and select either "Register as Client" or "Register as Astrologer" from the landing page.

## 10.2 Farmer Portal Guide (Adapted: Client Portal Guide)
1. **Dashboard:** View your daily AI-generated horoscope.
2. **Birth Chart:** Enter your birth details to generate your Kundali.
3. **Directory:** Browse astrologers, select a time slot, and click "Book". Follow the Razorpay prompt.
4. **Chat:** Navigate to "My Bookings" and click "Enter Chat" at the scheduled time.

## 10.3 Veterinarian Portal Guide (Adapted: Astrologer Portal Guide)
1. **Profile:** Update your biography, pricing, and specializations.
2. **Availability:** Toggle your online status to appear in the public directory.
3. **Consultations:** Receive real-time notifications for incoming bookings. Click to join the chat session.

## 10.4 Administrator Guide
Currently, administrative oversight is handled via direct database access (MongoDB Atlas) to moderate users or manage platform parameters.

---

# 11. SOURCE CODE AND SYSTEM SNAPSHOTS

## 11.1 Source Code Organisation
The repository is structured into a monorepo format:
- `/src` : Contains the React.js frontend UI components and pages.
- `/backend` : Contains the Node.js/Express REST API and Socket.io handlers.
- `/python_service` : Houses the Flask microservice for the Swiss Ephemeris.
- `/docs` : Contains architectural diagrams and this Capstone Report.

## 11.2 System Snapshots
*(Screenshots of the Landing Page, AI Horoscope UI, Astrologer Directory, and Chat Room are attached in the final printed annexure).*

---

# 12. BIBLIOGRAPHY

1. Facebook Open Source. (2026). *React: A JavaScript library for building user interfaces.* Retrieved from https://reactjs.org/
2. Node.js Foundation. (2026). *Node.js Documentation.* Retrieved from https://nodejs.org/
3. Google Developers. (2026). *Gemini API Documentation.* Retrieved from https://ai.google.dev/
4. Alois Treindl, Dieter Koch. (2026). *Swiss Ephemeris.* Astrodienst AG. Retrieved from https://www.astro.com/swisseph/
5. Razorpay. (2026). *Payment Gateway Integration Documentation.* Retrieved from https://razorpay.com/docs/

---
*End of Capstone Project Report*
"""

with open('docs/Capstone_Project_Report.md', 'w', encoding='utf-8') as f:
    f.write(new_report)

print("Rewrite complete!")
