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
        const { roomId, sender, text } = data;

        if (roomId.startsWith('bot-')) {
            // Emit user's message
            io.to(roomId).emit('receive_message', {
                _id: Date.now().toString(),
                sender: sender,
                text: text,
                createdAt: new Date()
            });

            // Emit AI bot reply
            try {
                const apiKey = process.env.GEMINI_API_KEY;
                let botReply = "";
                if (apiKey) {
                    const genAI = new GoogleGenerativeAI(apiKey);
                    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                    const prompt = `You are an expert Vedic Astrologer chatbot. A user says: "${text}". Reply to them with astrological wisdom in 1-2 short sentences. Do not use quotes around your response.`;
                    const result = await model.generateContent(prompt);
                    botReply = result.response.text().trim();
                } else {
                    // Intelligent fallback without API key
                    const lowerText = text.toLowerCase();
                    if (lowerText.includes("love") || lowerText.includes("relationship")) {
                        botReply = "Venus is aligning favorably. Love requires patience and understanding right now.";
                    } else if (lowerText.includes("career") || lowerText.includes("job") || lowerText.includes("work")) {
                        botReply = "Saturn's transit suggests hard work will soon pay off in your professional life.";
                    } else if (lowerText.includes("money") || lowerText.includes("finance") || lowerText.includes("wealth")) {
                        botReply = "Jupiter indicates a period of gradual financial growth. Avoid impulsive spending.";
                    } else if (lowerText.includes("health")) {
                        botReply = "The Sun's energy is supporting your vitality. Focus on balance and rest.";
                    } else if (lowerText.includes("hello") || lowerText.includes("hi")) {
                        botReply = "Greetings, seeker! The cosmos welcomes you. Ask me about your career, love, or future.";
                    } else {
                        botReply = `The stars are reflecting upon your words: "${text}". The cosmic energies suggest you stay positive and trust the universe's timing.`;
                    }
                }

                io.to(roomId).emit('receive_message', {
                    _id: Date.now().toString() + "bot",
                    sender: "bot",
                    text: botReply,
                    createdAt: new Date()
                });
            } catch (error) {
                console.error("Gemini Bot Error:", error);
                io.to(roomId).emit('receive_message', {
                    _id: Date.now().toString() + "bot",
                    sender: "bot",
                    text: `Cosmic Insight: Keep your hopes high.`,
                    createdAt: new Date()
                });
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
                    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
const astrologerRoutes = require('./routes/astrologerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const astroRoutes = require('./routes/astroRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/astrologers', astrologerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/astro', astroRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server running on port ${PORT}`));
