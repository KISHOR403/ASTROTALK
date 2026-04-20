const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const BirthChart = require('../models/BirthChart');
const Horoscope = require('../models/Horoscope');

// @desc    Get AI-generated few-shot horoscope for a zodiac sign
// @route   GET /api/astro/horoscope/:sign
// @access  Public
const getHoroscope = async (req, res) => {
    try {
        const { sign } = req.params;
        const todayStr = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

        // 1. Check if we already have a generated horoscope for this sign today
        let cachedHoroscope = await Horoscope.findOne({ sign: new RegExp(`^${sign}$`, 'i'), date: todayStr });
        if (cachedHoroscope) {
            return res.json({
                sign: cachedHoroscope.sign,
                daily: cachedHoroscope.daily,
                mood: cachedHoroscope.mood,
                colour: cachedHoroscope.colour,
                lucky_number: cachedHoroscope.lucky_number,
                compatible_sign: cachedHoroscope.compatible_sign
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            // Fallback for missing API Key to prevent crash
            return res.json({ 
                sign, 
                daily: "Today brings powerful cosmic energy. Focus on your goals.",
                mood: "Optimistic", colour: "Blue", lucky_number: 7, compatible_sign: "Taurus"
            });
        }

        // Load mock dataset for few-shot prompting
        const datasetPath = path.join(__dirname, '..', 'data', 'horoscope_dataset.json');
        let examplesArray = [];
        if (fs.existsSync(datasetPath)) {
            const data = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
            examplesArray = data.filter(d => d.sign.toLowerCase() === sign.toLowerCase());
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let prompt = `You are an expert Vedic Astrologer. Generate a daily horoscope for the zodiac sign ${sign}.\n`;
        prompt += `Include the following in your prediction based on astrological transits:\n`;
        prompt += `- daily: A personalized daily horoscope paragraph (about 3-4 sentences)\n`;
        prompt += `- mood: The dominant mood for the day\n`;
        prompt += `- colour: Lucky colour\n`;
        prompt += `- lucky_number: Lucky digit (10-99)\n`;
        prompt += `- compatible_sign: Most compatible sign today\n\n`;

        if (examplesArray.length > 0) {
            prompt += `Here are some past examples of the tone and style you should match for ${sign}:\n`;
            examplesArray.slice(0, 3).forEach((ex, idx) => {
                prompt += `Example ${idx + 1}: ${ex.caption}. Mood: ${ex.mood}. Color: ${ex.colour}. Number: ${ex.lucky_digit}. Compatible: ${ex.compatible_sign}\n`;
            });
        }

        prompt += `\nPlease output the response purely as a valid JSON object without any markdown formatting. Use the exact keys: 'daily', 'mood', 'colour', 'lucky_number', 'compatible_sign'.`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        
        // Clean markdown JSON wrapping if Gemini adds it
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const parsedData = JSON.parse(responseText);

        // Save to DB for caching
        await Horoscope.create({
            sign,
            date: todayStr,
            ...parsedData
        });

        res.json({ sign, ...parsedData });
    } catch (error) {
        console.error("Gemini Horoscope Error:", error);
        res.status(500).json({ message: "Failed to generate horoscope" });
    }
};

// @desc    Get AI compatibility between two zodiac signs
// @route   POST /api/astro/compatibility
// @access  Public
const getCompatibility = async (req, res) => {
    const { partner1, partner2 } = req.body;

    if (!partner1 || !partner2) {
        return res.status(400).json({ message: "Please provide both zodiac signs." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        // Fallback
        const score = Math.floor(Math.random() * 41) + 60;
        return res.json({ partner1, partner2, score: `${score}%`, insight: "A harmonious connection built on mutual respect and understanding." });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are an expert Vedic Astrologer. Analyze the zodiac compatibility between ${partner1} and ${partner2}.
Return a JSON object with these exact keys:
- "score": a percentage string like "78%" reflecting true Vedic compatibility
- "insight": a detailed 3-4 sentence Vedic compatibility analysis mentioning planetary rulers, elemental harmony, and relationship dynamics

Output ONLY valid JSON, no markdown.`;

        const result = await model.generateContent(prompt);
        let text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(text);

        res.json({ partner1, partner2, ...parsed });
    } catch (error) {
        console.error("Gemini Compatibility Error:", error);
        const score = Math.floor(Math.random() * 41) + 60;
        res.json({ partner1, partner2, score: `${score}%`, insight: "A dynamic pairing with potential for growth." });
    }
};

// Function to get coordinates from location string
const getCoordinates = async (location) => {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`, {
            headers: { 'User-Agent': 'VedicAstroApp/1.0 (contact@vedic.app)' }
        });
        const data = await res.json();
        if (data && data.length > 0) {
            return `${data[0].lat},${data[0].lon}`;
        }
    } catch (error) {
        console.error("Geocoding failed:", error);
    }
    return '28.6139,77.2090'; // Default to Delhi if geocoding fails
};

// ── Rashi Name Mapping ─────────────────────────────────────────────────────
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

// ── Gemini AI Interpretation Generator ─────────────────────────────────────
async function generateGeminiInterpretation(ascendant, sunSign, moonSign, planetsArray) {
    const apiKey = process.env.GEMINI_API_KEY;

    // Build planetary context string for the prompt
    const planetSummary = planetsArray
        .filter(p => p.name !== 'Ascendant')
        .map(p => {
            const sign = normalizeRashiName(p.rasi?.name);
            const retro = p.is_retrograde ? ' (Retrograde)' : '';
            return `${p.name}: ${sign}, House ${p.position || '?'}, ${parseFloat(p.degree || 0).toFixed(2)}°${retro}`;
        })
        .join('\n');

    if (!apiKey) {
        // Return basic fallback if no API key
        return buildFallbackInterpretation(ascendant, sunSign, moonSign, planetsArray);
    }

    const MODELS_TO_TRY = ['gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];

    const prompt = `You are a world-class Vedic Astrologer (Jyotish Acharya) with deep knowledge of classical texts like Brihat Parashara Hora Shastra and Phaladeepika. Analyze this birth chart and generate a comprehensive Kundali interpretation.

BIRTH CHART DATA:
- Lagna (Ascendant): ${ascendant}
- Sun Sign (Surya Rashi): ${sunSign}
- Moon Sign (Chandra Rashi): ${moonSign}

PLANETARY POSITIONS:
${planetSummary}

Generate a detailed, personalized Vedic astrology interpretation. Return ONLY a valid JSON object (no markdown) with this exact structure:

{
  "sections": [
    {
      "title": "Lagna (Ascendant) Analysis",
      "icon": "↑",
      "sign": "${ascendant}",
      "signHindi": "<Hindi name with transliteration>",
      "lord": "<Ruling planet>",
      "element": "<Fire/Earth/Air/Water>",
      "description": "<3-4 sentence deep Vedic analysis of the ascendant, personality traits, physical constitution, and life approach based on classical texts>"
    },
    {
      "title": "Chandra Rashi (Moon Sign)",
      "icon": "☽",
      "sign": "${moonSign}",
      "signHindi": "<Hindi name>",
      "lord": "<Ruling planet>",
      "element": "<element>",
      "description": "<3-4 sentence analysis of emotional nature, mind, subconscious patterns, and mental disposition according to Vedic astrology>"
    },
    {
      "title": "Surya Rashi (Sun Sign)",
      "icon": "☉",
      "sign": "${sunSign}",
      "signHindi": "<Hindi name>",
      "lord": "<Ruling planet>",
      "element": "<element>",
      "description": "<3-4 sentence analysis of soul purpose, core identity, vitality, and Atma based on Sun placement>"
    }
  ],
  "planetDetails": [
    {
      "planet": "<Planet name>",
      "sign": "<Sign name>",
      "signHindi": "<Hindi sign name>",
      "house": <house number>,
      "degree": "<degree>°",
      "lord": "<Sign lord>",
      "interpretation": "<2-3 sentence specific interpretation of this planet in this house and sign, referencing classical Vedic principles. Mention the Bhava significations affected.>"
    }
  ],
  "overallReport": "<A comprehensive 6-8 sentence overall Kundali summary covering: dominant planetary influences, key Yogas if detectable (e.g., Gajakesari, Budhaditya, Manglik), Dasha implications, career tendencies, relationship patterns, health indicators, and spiritual inclinations. Make it personal and insightful.>"
}

IMPORTANT RULES:
- Include ALL 9 planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu) in planetDetails
- Use authentic Vedic terminology (Bhava, Rashi, Graha, Yoga, Dasha)
- Reference classical texts where appropriate
- Make interpretations specific to the actual house and sign placements, not generic
- The overallReport should synthesize all placements into a cohesive life reading`;

    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of MODELS_TO_TRY) {
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                console.log(`  Trying model: ${modelName} (attempt ${attempt})...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                let responseText = result.response.text();
                responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

                const parsed = JSON.parse(responseText);
                console.log(`  ✅ Success with model: ${modelName}`);
                return parsed;
            } catch (error) {
                console.error(`  ❌ ${modelName} attempt ${attempt} failed:`, error.message?.substring(0, 120));
                // Wait before retry (2s first, 5s second)
                if (attempt < 2) await new Promise(r => setTimeout(r, 2000));
            }
        }
    }

    console.error("All Gemini models failed. Using fallback.");
    return buildFallbackInterpretation(ascendant, sunSign, moonSign, planetsArray);
}

// Minimal fallback when Gemini is unavailable
function buildFallbackInterpretation(ascendant, sunSign, moonSign, planetsArray) {
    const sections = [
        {
            title: 'Lagna (Ascendant) Analysis',
            icon: '↑',
            sign: ascendant,
            signHindi: ascendant,
            lord: 'N/A',
            element: 'N/A',
            description: `Your ascendant is ${ascendant}, shaping your outward personality and approach to life. The ascendant is the most important point in your Vedic birth chart.`,
        },
        {
            title: 'Chandra Rashi (Moon Sign)',
            icon: '☽',
            sign: moonSign,
            signHindi: moonSign,
            lord: 'N/A',
            element: 'N/A',
            description: `Your Moon is in ${moonSign}, governing your emotional nature and subconscious patterns. In Vedic astrology, the Moon sign is considered paramount.`,
        },
        {
            title: 'Surya Rashi (Sun Sign)',
            icon: '☉',
            sign: sunSign,
            signHindi: sunSign,
            lord: 'N/A',
            element: 'N/A',
            description: `Your Sun is placed in ${sunSign}, revealing your soul purpose and core identity. The Sun represents your Atma (soul) and vitality.`,
        },
    ];

    const planetDetails = planetsArray
        .filter(p => p.name !== 'Ascendant')
        .map(p => ({
            planet: p.name,
            sign: normalizeRashiName(p.rasi?.name),
            signHindi: normalizeRashiName(p.rasi?.name),
            house: p.position || 0,
            degree: `${parseFloat(p.degree || 0).toFixed(2)}°`,
            lord: 'N/A',
            interpretation: `${p.name} is placed in ${normalizeRashiName(p.rasi?.name)} in house ${p.position || '?'}. AI interpretation is currently unavailable — please ensure the Gemini API key is configured.`,
        }));

    return {
        sections,
        planetDetails,
        overallReport: 'AI-powered Kundali interpretation is currently unavailable. Please ensure the Gemini API key is configured in the backend .env file to receive a comprehensive personalized reading.',
    };
}

// @desc    Get birth chart from Python Microservice (pyswisseph) + Gemini AI Interpretation
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
        const [latStr, lonStr] = coordinates.split(',');
        const lat = parseFloat(latStr);
        const lon = parseFloat(lonStr);

        // 2. Fetch Planet Positions from local Python Microservice
        const planetRes = await fetch(`http://127.0.0.1:5001/ephemeris`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date: dateOfBirth, // format: YYYY-MM-DD
                time: timeOfBirth, // format: HH:MM
                lat,
                lon
            })
        });

        if (!planetRes.ok) {
            const errBody = await planetRes.text();
            throw new Error(`Python Microservice error: ${errBody}`);
        }

        const planetData = await planetRes.json();

        // 3. Map returned data to expected planetsArray format
        const planetsArray = [];
        planetsArray.push({
            name: 'Ascendant',
            rasi: { name: planetData.ascendant.sign },
            degree: planetData.ascendant.degree,
            is_retrograde: false
        });
        
        if (planetData.planets) {
            planetData.planets.forEach(p => {
                 planetsArray.push({
                     name: p.name,
                     rasi: { name: p.sign },
                     degree: p.degree,
                     is_retrograde: p.is_retrograde
                 });
            });
        }

        const ascendantObj = planetsArray.find(p => p.name === 'Ascendant');
        const ascendant = normalizeRashiName(ascendantObj?.rasi?.name);
        const ascendantDegree = parseFloat(ascendantObj?.degree || 0).toFixed(2);
        const sunSign = normalizeRashiName(planetsArray.find(p => p.name === 'Sun')?.rasi?.name);
        const moonSign = normalizeRashiName(planetsArray.find(p => p.name === 'Moon')?.rasi?.name);

        // 4. Build houses with planet placements for Kundli chart
        const rashiNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
        const ascendantRashiIndex = rashiNames.indexOf(ascendant);

        // Map planets to houses (1-12) relative to ascendant
        const housePlanets = {};
        for (let i = 1; i <= 12; i++) housePlanets[i] = [];

        const planetAbbreviations = { Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke' };

        for (const p of planetsArray) {
            if (p.name === 'Ascendant') continue;
            const planetRashiIndex = rashiNames.indexOf(normalizeRashiName(p.rasi?.name));
            if (planetRashiIndex === -1) continue;
            let house = ((planetRashiIndex - ascendantRashiIndex + 12) % 12) + 1;
            p.position = house; // attach house to planet data for interpretations
            const abbr = planetAbbreviations[p.name] || p.name.substring(0, 2);
            housePlanets[house].push(abbr);
        }

        // Rashi numbers for each house
        const houseRashiNumbers = {};
        for (let i = 1; i <= 12; i++) {
            houseRashiNumbers[i] = ((ascendantRashiIndex + i - 1) % 12) + 1;
        }

        // 5. Build planetary positions table
        const planetaryPositions = planetsArray.filter(p => p.name !== 'Ascendant').map(p => ({
            planet: p.name,
            sign: normalizeRashiName(p.rasi?.name),
            house: p.position || 0,
            degree: `${parseFloat(p.degree || 0).toFixed(2)}°`,
            nakshatra: p.nakshatra?.name || '',
            isRetrograde: p.is_retrograde || false,
        }));

        // 6. Generate AI-powered interpretations using Gemini
        console.log("🔮 Generating Gemini AI Kundali interpretation...");
        const interpretations = await generateGeminiInterpretation(ascendant, sunSign, moonSign, planetsArray);
        console.log("✅ Gemini AI interpretation generated successfully.");

        const responseChart = {
            ascendant,
            ascendantDegree: `${ascendantDegree}°`,
            sunSign,
            moonSign,
            housePlanets,
            houseRashiNumbers,
            planetaryPositions,
            interpretations,
            rawPlanetData: planetData.data,
        };

        // 7. Save to DB
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
