// @desc    Get mock horoscope for a zodiac sign
const BirthChart = require('../models/BirthChart');
// @route   GET /api/astro/horoscope/:sign
// @access  Public
const getHoroscope = async (req, res) => {
    const { sign } = req.params;
    const horoscopes = {
        aries: "Today, your energy is high. Take the lead in new projects.",
        taurus: "Focus on stability. A financial opportunity may arise.",
        gemini: "Communication is key. Share your ideas with others.",
        cancer: "Trust your intuition. Home and family take center stage.",
        leo: "Your creativity shines. Step into the spotlight.",
        virgo: "Attention to detail will pay off. Organize your workspace.",
        libra: "Balance is essential. Seek harmony in your relationships.",
        scorpio: "Embrace transformation. Let go of what no longer serves you.",
        sagittarius: "Adventure awaits. Expand your horizons through learning.",
        capricorn: "Hard work brings rewards. Stay disciplined and focused.",
        aquarius: "Innovation is sparked. Think outside the box.",
        pisces: "Dream big. Your imagination is a powerful tool."
    };

    const message = horoscopes[sign.toLowerCase()] || "May the stars guide you today!";
    res.json({ sign, message });
};

// @desc    Get mock compatibility between two zodiac signs
// @route   POST /api/astro/compatibility
// @access  Public
const getCompatibility = async (req, res) => {
    const { partner1, partner2 } = req.body;

    if (!partner1 || !partner2) {
        return res.status(400).json({ message: "Please provide both zodiac signs." });
    }

    // Simple mock logic for score
    const score = Math.floor(Math.random() * 41) + 60; // Random score between 60% and 100%

    const insights = [
        "Your energies align perfectly. A strong foundation for growth.",
        "A dynamic pairing with intense chemistry. Communication is vital.",
        "A harmonious connection built on mutual respect and understanding.",
        "Your differences complement each other, creating a unique bond.",
        "A steady and reliable partnership. Focus on shared long-term goals."
    ];

    const insight = insights[Math.floor(Math.random() * insights.length)];

    res.json({
        partner1,
        partner2,
        score: `${score}%`,
        insight
    });
};

// Function to get Prokerala Token
const getProkeralaToken = async () => {
    const clientId = process.env.ASTRO_CLIENT_ID;
    const clientSecret = process.env.ASTRO_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error("Prokerala API credentials missing in .env");
    }

    const response = await fetch('https://api.prokerala.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret
        })
    });

    if (!response.ok) {
        throw new Error("Failed to authenticate with Prokerala API");
    }

    const data = await response.json();
    return data.access_token;
};

// Function to get coordinates from location string
const getCoordinates = async (location) => {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`);
        const data = await res.json();
        if (data && data.length > 0) {
            return `${data[0].lat},${data[0].lon}`;
        }
    } catch (error) {
        console.error("Geocoding failed:", error);
    }
    return '28.6139,77.2090'; // Default to Delhi if geocoding fails
};

// @desc    Get birth chart from external API
// @route   POST /api/astro/birth-chart
// @access  Public
const getBirthChart = async (req, res) => {
    const { dateOfBirth, timeOfBirth, location } = req.body;

    if (!dateOfBirth || !timeOfBirth || !location) {
        return res.status(400).json({ message: "Please provide date, time, and location of birth." });
    }

    try {
        // 1. Get Coordinates
        const coordinates = await getCoordinates(location);

        // 2. Format DateTime (Assuming IST +05:30 for standard Indian astrology matching, or change as needed)
        const dateTimeStr = `${dateOfBirth}T${timeOfBirth}:00+05:30`;

        // 3. Get Auth Token
        const token = await getProkeralaToken();

        // 4. Fetch Planet Positions
        const planetRes = await fetch(`https://api.prokerala.com/v2/astrology/planet-position?datetime=${encodeURIComponent(dateTimeStr)}&coordinates=${coordinates}&ayanamsa=1`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!planetRes.ok) {
            const errBody = await planetRes.text();
            throw new Error(`Prokerala API error: ${errBody}`);
        }

        const planetData = await planetRes.json();

        // 5. Build standard response
        // Prokerala returns { data: { planet_position: [ {name, rasi...}, ... ] } }
        const planetsArray = planetData.data?.planet_position || [];

        const ascendant = planetsArray.find(p => p.name === 'Ascendant')?.rasi?.name || "Unknown";
        const sunSign = planetsArray.find(p => p.name === 'Sun')?.rasi?.name || "Unknown";
        const moonSign = planetsArray.find(p => p.name === 'Moon')?.rasi?.name || "Unknown";

        const houses = planetsArray.filter(p => p.name !== 'Ascendant').map(p => ({
            planet: p.name,
            sign: p.rasi?.name || "Unknown",
            house: p.position,
            degree: parseFloat(p.degree || 0).toFixed(2)
        }));

        const responseChart = {
            ascendant,
            sunSign,
            moonSign,
            planetsAndHouses: houses,
            rawPlanetData: planetData.data,
            insights: [
                `Your ascendant is ${ascendant}.`,
                `The Sun is placed securely in ${sunSign}.`,
                `The Moon is positioned in ${moonSign}.`
            ]
        };

        // 6. Save to DB
        const newChart = await BirthChart.create({
            user: req.user ? req.user._id : undefined,
            dateOfBirth,
            timeOfBirth,
            location,
            coordinates,
            chartData: responseChart
        });

        res.json({
            dateOfBirth,
            timeOfBirth,
            location,
            coordinates,
            chart: responseChart,
            chartId: newChart._id
        });
    } catch (error) {
        console.error("Error fetching birth chart:", error.message);
        res.status(500).json({ message: "Failed to generate birth chart", error: error.message });
    }
};

module.exports = {
    getHoroscope,
    getCompatibility,
    getBirthChart
};
