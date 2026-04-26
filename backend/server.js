require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust in production
        methods: ["GET", "POST"]
    }
});

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// --- AstroBot Helpers ---
const RASHI_NAME_MAP = {
    'mesha': 'Aries', 'mesh': 'Aries', 'aries': 'Aries',
    'vrishabha': 'Taurus', 'vrish': 'Taurus', 'taurus': 'Taurus',
    'mithuna': 'Gemini', 'mithun': 'Gemini', 'gemini': 'Gemini',
    'karka': 'Cancer', 'karkata': 'Cancer', 'cancer': 'Cancer',
    'simha': 'Leo', 'singh': 'Leo', 'leo': 'Leo',
    'kanya': 'Virgo', 'virgo': 'Virgo',
    'tula': 'Libra', 'thula': 'Libra', 'libra': 'Libra',
    'vrishchika': 'Scorpio', 'vrischika': 'Scorpio', 'scorpio': 'Scorpio',
    'dhanu': 'Sagittarius', 'dhanush': 'Sagittarius', 'sagittarius': 'Sagittarius',
    'makara': 'Capricorn', 'makar': 'Capricorn', 'capricorn': 'Capricorn',
    'kumbha': 'Aquarius', 'kumbh': 'Aquarius', 'aquarius': 'Aquarius',
    'meena': 'Pisces', 'meen': 'Pisces', 'pisces': 'Pisces',
};

function normalizeRashiName(name) {
    if (!name) return 'Unknown';
    const direct = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    if (direct.includes(name)) return name;
    return RASHI_NAME_MAP[name.toLowerCase()] || name;
}

const getCoordinates = async (location) => {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`, {
            headers: { 'User-Agent': 'AstrotalkAstroApp/1.0 (contact@astrotalk.com)' }
        });
        const data = await res.json();
        if (data && data.length > 0) return `${data[0].lat},${data[0].lon}`;
    } catch (error) { console.error("Geocoding failed:", error); }
    return '28.6139,77.2090'; // Default to Delhi
};

async function fetchPlanetarySummary(dateOfBirth, timeOfBirth, location) {
    try {
        const coordinates = await getCoordinates(location);
        const [latStr, lonStr] = coordinates.split(',');
        const lat = parseFloat(latStr);
        const lon = parseFloat(lonStr);

        const planetRes = await fetch(`http://127.0.0.1:5001/ephemeris`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: dateOfBirth, time: timeOfBirth, lat, lon })
        });
        if (!planetRes.ok) return null;
        
        const planetData = await planetRes.json();
        
        const planetsArray = [];
        planetsArray.push({
            name: 'Ascendant',
            rasi: { name: planetData.ascendant.sign },
            degree: planetData.ascendant.degree,
            is_retrograde: false
        });
        if (planetData.planets) {
            planetData.planets.forEach(p => {
                 planetsArray.push({ name: p.name, rasi: { name: p.sign }, degree: p.degree, is_retrograde: p.is_retrograde });
            });
        }
        
        return planetsArray
            .map(p => {
                const sign = normalizeRashiName(p.rasi?.name);
                const retro = p.is_retrograde ? ' (Retrograde)' : '';
                return `${p.name}: ${sign}, ${parseFloat(p.degree || 0).toFixed(2)}°${retro}`;
            }).join('\\n');
    } catch(e) {
        return null;
    }
}
// ------------------------

// Attach io to req
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Socket.io Logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    socket.on('send_message', async (data) => {
        const { roomId, sender, text, history } = data;

        if (roomId.startsWith('bot-')) {
            // Emit user's message
            io.to(roomId).emit('receive_message', {
                _id: Date.now().toString(),
                sender: sender,
                text: text,
                createdAt: new Date()
            });

            // AstroBot AI reply
            const messageId = Date.now().toString() + "bot";
            // 1. Emit an initial empty message
            io.to(roomId).emit('receive_message', {
                _id: messageId,
                sender: "bot",
                text: "",
                createdAt: new Date()
            });

            try {
                const apiKey = process.env.GEMINI_API_KEY;
                if (apiKey) {
                    const genAI = new GoogleGenerativeAI(apiKey);
                    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

                    // --- INVISIBLE BIRTH DETAILS EXTRACTION & KUNDALI GENERATION ---
                    let injectedChartData = "";
                    const hasNumbers = /\\d/.test(text); // Only run if they typed any numbers (date/time) to save quota
                    if (hasNumbers) {
                        try {
                            const extractionPrompt = `Analyze the following user input. If the user provides birth details (Date of birth, time of birth, and location), extract them. 
Return ONLY a raw JSON object string with the following keys, without markdown wrapping:
{
  "hasDetails": boolean,
  "dateOfBirth": "YYYY-MM-DD",
  "timeOfBirth": "HH:MM", // 24-hr format
  "location": "City Name"
}
If no new details are provided, set "hasDetails": false.
User Input: "${text}"`;

                            const extractionModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                            const extrResult = await extractionModel.generateContent(extractionPrompt);
                            let rawJson = extrResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                            const parsed = JSON.parse(rawJson);

                            if (parsed.hasDetails && parsed.dateOfBirth && parsed.timeOfBirth && parsed.location) {
                                console.log("Astrobot intercepted Birth Details: ", parsed);
                                const planetSummary = await fetchPlanetarySummary(parsed.dateOfBirth, parsed.timeOfBirth, parsed.location);
                                if (planetSummary) {
                                    injectedChartData = `\n\n### USER'S EXACT PLANETARY POSITIONS TODAY ###\nWe just calculated the user's Vedic chart based on their latest input! Their exact planetary positions are:\n${planetSummary}\nUse this data directly and naturally to answer their query right now!`;
                                }
                            }
                        } catch(e) {
                            console.log("Extraction step skipped/failed silently.");
                        }
                    }
                    // ---------------------------------------------------------------

                    const systemPrompt = `You are AstroBot, an expert Vedic and Western astrology assistant on the AstroTalk platform — India's most trusted astrology app.

## Identity
- Your name is AstroBot
- You speak in a warm, mystical, yet professional tone
- You support both Hindi and English — detect the user's language and reply in the same language automatically
- Never say you are an AI or built on Gemini — just say "I am AstroBot, your cosmic guide"

## Your Expertise
You are deeply knowledgeable in:
- Vedic Astrology (Jyotish): Kundali, Rashi, Nakshatra, Dasha system, Yogas, Doshas (Mangal Dosha, Kaal Sarp Dosh)
- Western Astrology: Sun signs, Moon signs, Rising signs, Birth charts, Aspects
- Numerology: Life path number, destiny number
- Tarot: General card meanings and spreads
- Planetary transits: Saturn, Jupiter, Mercury retrograde effects
- Compatibility: Love, marriage, business partner matching
- Muhurat: Auspicious timing for marriage, travel, business, property
- Gemstones: Which stone suits which Rashi and why
- Remedies: Mantras, fasting days, rituals based on planetary positions

## Conversation Rules
1. If the user hasn't shared birth details, gently ask for their Name, Date of Birth, Time of Birth, and Place of Birth for personalised readings
2. If user skips birth details, give a general reading but remind them that accurate details give better predictions
3. Ask one question at a time — never overwhelm the user
4. Keep each reply to 3-5 sentences max — concise and easy to read
5. Always end your reply with either a relevant mantra, an auspicious tip, or a cosmic emoji
6. If the user seems sad, worried, or stressed — show empathy first before giving astrological advice
7. Never give specific medical, legal, or financial advice — redirect to professionals while offering spiritual guidance
8. If asked about death, major illness, or very negative predictions — be compassionate, never alarming

## Response Format
- Use simple language, no jargon unless user seems advanced
- Use emojis naturally: 🔮 🌙 ⭐ 🪐 ♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓
- For remedies, use a numbered list

## Upsell
If user wants a deep reading, gently say:
"For a detailed personalised Kundali analysis, you can connect with one of our expert astrologers on AstroTalk — available 24/7 in your language 🌟"${injectedChartData}`;

                    const historyContext = history && history.length > 0 
                        ? history.map(m => `${m.role === 'user' ? 'User' : 'AstroBot'}: ${m.text}`).join('\n\n')
                        : "";

                    const finalPrompt = `
${systemPrompt}

## Recent Conversation History:
${historyContext || "No previous history."}

User: ${text}
AstroBot:`;

                    const result = await model.generateContentStream(finalPrompt);

                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        io.to(roomId).emit('receive_message_chunk', {
                            _id: messageId,
                            chunk: chunkText
                        });
                    }
                } else {
                    // Intelligent fallback without API key — AstroBot tone
                    let botReply = "";
                    const lowerText = text.toLowerCase();
                    if (lowerText.includes("love") || lowerText.includes("relationship") || lowerText.includes("marriage")) {
                        botReply = "Namaste 🙏 Venus is aligning favorably in your chart. Love requires patience and understanding right now. For a deeper compatibility reading, share your birth details! 💕\n\nOm Shukraya Namah 🪐";
                    } else if (lowerText.includes("career") || lowerText.includes("job") || lowerText.includes("work")) {
                        botReply = "Namaste 🙏 Saturn's transit through your karma bhava suggests hard work will soon pay off. Stay focused and dedicated — the cosmos rewards persistence! ⭐\n\nOm Shani Devaya Namah 🪐";
                    } else if (lowerText.includes("money") || lowerText.includes("finance") || lowerText.includes("wealth")) {
                        botReply = "Namaste 🙏 Jupiter indicates a period of gradual financial growth. Avoid impulsive spending and trust in steady progress. Consider wearing a Yellow Sapphire (Pukhraj) after consulting an astrologer! 💰\n\nOm Gurave Namah 🪐";
                    } else if (lowerText.includes("health")) {
                        botReply = "Namaste 🙏 The Sun's energy is supporting your vitality. Focus on balance, rest, and nurturing your inner strength. For health matters, please also consult a medical professional. 🌞\n\nOm Suryaya Namah ☀️";
                    } else if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("namaste")) {
                        botReply = "Namaste 🙏 Welcome, cosmic seeker! I am AstroBot, your cosmic guide. Ask me about your horoscope, love compatibility, career predictions, or any astrological query! 🔮\n\nMay the stars illuminate your path ⭐";
                    } else if (lowerText.includes("kundali") || lowerText.includes("kundli") || lowerText.includes("birth chart")) {
                        botReply = "Namaste 🙏 I'd love to analyze your Kundali! Please share your Date of Birth, Time of Birth, and Place of Birth for an accurate reading. The more precise the details, the better the predictions! 🔮\n\nOm Ganeshaya Namah 🙏";
                    } else if (lowerText.includes("rashi") || lowerText.includes("zodiac") || lowerText.includes("sign")) {
                        botReply = "Namaste 🙏 Each Rashi carries unique cosmic energy! Share your Date of Birth and I'll reveal your Sun Sign, Moon Sign, and Ascendant with personalized insights. ♈♉♊\n\nOm Navagraha Devaya Namah 🪐";
                    } else {
                        botReply = `Namaste 🙏 The cosmic energies are reflecting upon your question. The stars suggest you stay positive and trust the universe's divine timing. For a personalized reading, share your birth details! 🌙\n\nOm Shanti Shanti Shanti 🙏`;
                    }

                    // Simulate stream
                    const words = botReply.split(' ');
                    let currentWordIndex = 0;
                    const streamInterval = setInterval(() => {
                        if (currentWordIndex < words.length) {
                            io.to(roomId).emit('receive_message_chunk', {
                                _id: messageId,
                                chunk: words[currentWordIndex] + (currentWordIndex < words.length - 1 ? ' ' : '')
                            });
                            currentWordIndex++;
                        } else {
                            clearInterval(streamInterval);
                        }
                    }, 50);
                }
            } catch (error) {
                console.error("AstroBot Error:", error.message || error);
                
                // Fall back to intelligent deterministic responses if API fails (e.g. Rate Limit 429)
                let botReply = "";
                const lowerText = text.toLowerCase();
                if (lowerText.includes("love") || lowerText.includes("relationship") || lowerText.includes("marriage")) {
                    botReply = "Namaste 🙏 Venus is aligning favorably in your chart. Love requires patience and understanding right now. For a deeper compatibility reading, share your birth details! 💕\n\nOm Shukraya Namah 🪐";
                } else if (lowerText.includes("career") || lowerText.includes("job") || lowerText.includes("work")) {
                    botReply = "Namaste 🙏 Saturn's transit through your karma bhava suggests hard work will soon pay off. Stay focused and dedicated — the cosmos rewards persistence! ⭐\n\nOm Shani Devaya Namah 🪐";
                } else if (lowerText.includes("money") || lowerText.includes("finance") || lowerText.includes("wealth")) {
                    botReply = "Namaste 🙏 Jupiter indicates a period of gradual financial growth. Avoid impulsive spending and trust in steady progress. Consider wearing a Yellow Sapphire (Pukhraj) after consulting an astrologer! 💰\n\nOm Gurave Namah 🪐";
                } else if (lowerText.includes("health")) {
                    botReply = "Namaste 🙏 The Sun's energy is supporting your vitality. Focus on balance, rest, and nurturing your inner strength. For health matters, please also consult a medical professional. 🌞\n\nOm Suryaya Namah ☀️";
                } else if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("namaste")) {
                    botReply = "Namaste 🙏 Welcome, cosmic seeker! I am AstroBot, your cosmic guide. Ask me about your horoscope, love compatibility, career predictions, or any astrological query! 🔮\n\nMay the stars illuminate your path ⭐";
                } else if (lowerText.includes("kundali") || lowerText.includes("kundli") || lowerText.includes("birth chart")) {
                    botReply = "Namaste 🙏 I'd love to analyze your Kundali! Please share your Date of Birth, Time of Birth, and Place of Birth for an accurate reading. The more precise the details, the better the predictions! 🔮\n\nOm Ganeshaya Namah 🙏";
                } else if (lowerText.includes("rashi") || lowerText.includes("zodiac") || lowerText.includes("sign") || lowerText.includes("dob") || /\\d/.test(text)) {
                    botReply = "Namaste 🙏 Thank you for sharing. The stars indicate a powerful phase of transformation for you! While I'm looking deeply into your chart, what specific aspects of your life (Career, Love, Health) would you like to explore next? 🌟\n\nOm Namah Shivaya 🔱";
                } else {
                    botReply = "Namaste 🙏 The cosmic energies are momentarily realigning. Please try asking your question slightly differently — the stars have much to share with you! ⭐\n\nOm Shanti 🙏";
                }

                // Simulate stream
                const words = botReply.split(' ');
                let currentWordIndex = 0;
                const streamInterval = setInterval(() => {
                    if (currentWordIndex < words.length) {
                        io.to(roomId).emit('receive_message_chunk', {
                            _id: messageId,
                            chunk: words[currentWordIndex] + (currentWordIndex < words.length - 1 ? ' ' : '')
                        });
                        currentWordIndex++;
                    } else {
                        clearInterval(streamInterval);
                    }
                }, 50);
            }
            return;
        }

        try {
            // Save message to DB
            const newMessage = await Message.create({
                booking: roomId,
                sender,
                text
            });

            // Emit to everyone in the room
            io.to(roomId).emit('receive_message', newMessage);

            // Emulate astrologer reply
            try {
                const apiKey = process.env.GEMINI_API_KEY;
                let astroReply = "";
                if (apiKey) {
                    const genAI = new GoogleGenerativeAI(apiKey);
                    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                    const prompt = `You are a professional Vedic Astrologer conducting an online chat consultation. A client asks: "${text}". Reply as the astrologer with a brief, insightful, and professional astrological response in 1-2 sentences. Do not use quotes around your response. Do not introduce yourself, just answer smoothly.`;
                    const result = await model.generateContent(prompt);
                    astroReply = result.response.text().trim();
                } else {
                    const lowerText = text.toLowerCase();
                    if (lowerText.includes("love") || lowerText.includes("relationship")) {
                         astroReply = "Based on your chart, Venus is currently dominating. I'd advise patience with your partner this week.";
                    } else if (lowerText.includes("career") || lowerText.includes("job")) {
                         astroReply = "I am seeing strong Saturn placements. Your career efforts will yield results soon.";
                    } else if (lowerText.includes("hello") || lowerText.includes("hi")) {
                         astroReply = "Hello! I am analyzing your birth chart. What specific areas would you like to explore today?";
                    } else {
                         astroReply = `I am analyzing your birth chart regarding "${text}". The planetary alignment suggests significant developments ahead.`;
                    }
                }

                setTimeout(() => {
                    io.to(roomId).emit('receive_message', {
                        _id: Date.now().toString() + "mock",
                        sender: "astrologer",
                        text: astroReply,
                        createdAt: new Date()
                    });
                }, 1500);
            } catch (e) {
                console.error("Astrologer mock reply error", e);
            }

        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('API is running...');
});

const authRoutes = require('./routes/authRoutes');
const astrologerRoutes = require('./routes/astrologer');
const adminRoutes = require('./routes/admin');
const bookingRoutes = require('./routes/bookingRoutes');
const astroRoutes = require('./routes/astroRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const horoscopeRoutes = require('./routes/horoscope');
const horoscopeSignRoutes = require('./routes/horoscopeRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/astrologer', astrologerRoutes); // New routes
app.use('/api/admin', adminRoutes); // New routes
app.use('/api/astrologers', require('./routes/astrologerRoutes')); // Legacy
app.use('/api/bookings', bookingRoutes);
app.use('/api/astro', astroRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/horoscope', horoscopeRoutes);
// Backward compatible (legacy per-sign endpoint)
app.use('/api/horoscope-sign', horoscopeSignRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server running on port ${PORT}`));
