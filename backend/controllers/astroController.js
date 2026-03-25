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

// ── Rashi Name Mapping (Prokerala API returns Hindi names) ─────────────────
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
    // Already English?
    const direct = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    if (direct.includes(name)) return name;
    // Try lowercase mapping
    return RASHI_NAME_MAP[name.toLowerCase()] || name;
}

// ── Vedic Interpretation Data ──────────────────────────────────────────────
const RASHI_DATA = {
    'Aries':       { hindi: 'मेष (Mesha)',       lord: 'Mars',    element: 'Fire',  quality: 'Cardinal', nature: 'dynamic, pioneering, courageous, competitive' },
    'Taurus':      { hindi: 'वृषभ (Vrishabha)',   lord: 'Venus',   element: 'Earth', quality: 'Fixed',    nature: 'stable, sensuous, material, patient' },
    'Gemini':      { hindi: 'मिथुन (Mithuna)',    lord: 'Mercury', element: 'Air',   quality: 'Mutable',  nature: 'intellectual, communicative, versatile, curious' },
    'Cancer':      { hindi: 'कर्क (Karka)',       lord: 'Moon',    element: 'Water', quality: 'Cardinal', nature: 'nurturing, emotional, intuitive, protective' },
    'Leo':         { hindi: 'सिंह (Simha)',       lord: 'Sun',     element: 'Fire',  quality: 'Fixed',    nature: 'authoritative, generous, creative, dignified' },
    'Virgo':       { hindi: 'कन्या (Kanya)',      lord: 'Mercury', element: 'Earth', quality: 'Mutable',  nature: 'analytical, service-oriented, detail-focused, health-conscious' },
    'Libra':       { hindi: 'तुला (Tula)',        lord: 'Venus',   element: 'Air',   quality: 'Cardinal', nature: 'balanced, diplomatic, aesthetic, partnership-oriented' },
    'Scorpio':     { hindi: 'वृश्चिक (Vrishchika)', lord: 'Mars', element: 'Water', quality: 'Fixed',    nature: 'intense, transformative, researching, mysterious' },
    'Sagittarius': { hindi: 'धनु (Dhanu)',        lord: 'Jupiter', element: 'Fire',  quality: 'Mutable',  nature: 'philosophical, adventurous, optimistic, truth-seeking' },
    'Capricorn':   { hindi: 'मकर (Makara)',       lord: 'Saturn',  element: 'Earth', quality: 'Cardinal', nature: 'ambitious, disciplined, structured, responsible' },
    'Aquarius':    { hindi: 'कुंभ (Kumbha)',      lord: 'Saturn',  element: 'Air',   quality: 'Fixed',    nature: 'humanitarian, unconventional, innovative, detached' },
    'Pisces':      { hindi: 'मीन (Meena)',        lord: 'Jupiter', element: 'Water', quality: 'Mutable',  nature: 'spiritual, compassionate, imaginative, selfless' },
};

const PLANET_IN_HOUSE = {
    'Sun': {
        1: 'Strong sense of self and natural leadership. You command attention and have a powerful presence. Health is generally good but watch for ego-related conflicts.',
        2: 'Wealth through authority and government connections. Speech is commanding and family life is dignified. Potential for inherited wealth.',
        3: 'Courageous, bold communicator with strong willpower. Good relationship with siblings. Success in media, writing, or short travels.',
        4: 'Deep attachment to home and motherland. May have a government property or vehicle. Inner peace comes through accomplishment.',
        5: 'Excellent placement for intelligence, creativity, and children. Natural teacher and advisor. Romance is passionate and dramatic.',
        6: 'Victory over enemies and competition. Good health management. Success in service-oriented careers, law, or medicine.',
        7: 'Marriage to a dignified, authoritative partner. Business partnerships with influential people. May dominate relationships.',
        8: 'Interest in occult sciences and hidden knowledge. Possible health challenges in youth that build resilience. Inheritance likely.',
        9: 'Very auspicious — strong dharma and fortune. Father is influential. Success in higher education, spirituality, and long journeys.',
        10: 'Excellent career placement — authority, recognition, and leadership in profession. Government connections are beneficial.',
        11: 'Gains through influential networks and elder siblings. Fulfillment of desires. Income from government or authority figures.',
        12: 'Spiritual inclinations and foreign connections. May spend on charitable causes. Father may live abroad or there may be distance.',
    },
    'Moon': {
        1: 'Emotional, sensitive, and intuitive personality. Popular and attractive. Mind is active and changeable. Mother has strong influence.',
        2: 'Wealth fluctuates with emotions. Sweet speech and love for family. Fond of good food. Financial security through nurturing roles.',
        3: 'Mentally active with good communication skills. Close bond with siblings. Frequent short travels. Creative and imaginative mind.',
        4: 'Very comfortable placement — deep emotional contentment. Strong bond with mother. Beautiful home and vehicles. Inner peace.',
        5: 'Highly intelligent and creative. Emotional investment in children. Romantic nature. Good intuition and speculative abilities.',
        6: 'Emotional fluctuations affecting health. Service-oriented mindset. May worry excessively. Success in healthcare or social work.',
        7: 'Emotionally invested in partnerships. Attractive, caring spouse. Business sense guided by intuition. Popular in social circles.',
        8: 'Deep psychological insight and intuitive abilities. Emotional transformation through life challenges. Interest in mysticism.',
        9: 'Spiritually inclined mind. Mother is religious. Fortune through travel and higher learning. Emotional connection to dharma.',
        10: 'Public popularity and emotional fulfillment through career. Fluctuating professional life. Success in public-facing roles.',
        11: 'Gains through social connections. Emotional support from friends and elder siblings. Desires are generally fulfilled.',
        12: 'Spiritual depth and vivid dream life. Expenditure on comforts. Foreign connections. Need for solitude and meditation.',
    },
    'Mars': {
        1: 'Manglik placement — energetic, athletic, and courageous. Strong willpower but prone to anger. Natural leader with competitive spirit.',
        2: 'Bold and direct speech. Wealth through courage and effort. Family life may have conflicts. Good for military or surgical careers.',
        3: 'Excellent placement — tremendous courage and valor. Good relationship with younger siblings. Success in sports, military, and communication.',
        4: 'Property and vehicle ownership, but domestic disturbances possible. Strong attachment to land. Restless inner nature.',
        5: 'Sharp intellect with technical abilities. Children may be strong-willed. Passionate in romance. Good for engineering or sports.',
        6: 'Very strong placement — victory over enemies. Excellent health and competitive edge. Success in law, surgery, or military.',
        7: 'Manglik placement — passionate partnerships. Spouse is energetic. Business acumen. Need patience in relationships.',
        8: 'Interest in research, occult, and transformative sciences. Potential for accidents but strong recovery. Inheritance of property.',
        9: 'Active pursuit of dharma and philosophy. Father is strong-willed. Pilgrimage and adventure. Leadership in religious organizations.',
        10: 'Powerful career — authority, courage, and leadership. Success in engineering, police, military, or surgery. High professional energy.',
        11: 'Gains through courage and action. Wealthy and influential friends. Desires fulfilled through effort. Elder siblings are strong.',
        12: 'Expenditure on property or vehicles. Hidden enemies. Interest in spirituality through action (Karma Yoga). Foreign lands favored.',
    },
    'Mercury': {
        1: 'Intelligent, youthful appearance, and excellent communication skills. Quick learner with analytical mind. Good sense of humor.',
        2: 'Wealth through intellect and business. Eloquent speaker. Good education. Financial planning abilities. Knowledge of languages.',
        3: 'Excellent placement — brilliant communicator, writer, or media person. Skilled with hands. Good sibling relationships. Short travels.',
        4: 'Educated and mentally peaceful. Good academic environment at home. Knowledge of mathematics and literature. Happy domestic life.',
        5: 'Highly intelligent with creative writing abilities. Good advisor. Children are intelligent. Success in education and speculation.',
        6: 'Analytical problem-solver. Good in overcoming competition through intellect. Health-conscious. Success in accounting or analysis.',
        7: 'Business-minded partnerships. Spouse is intelligent and communicative. Success in trade, commerce, and negotiations.',
        8: 'Research-oriented mind. Interest in astrology and hidden sciences. Good longevity. Inheritance through documentation.',
        9: 'Scholar and philosopher. Higher education and foreign travel for learning. Father is intellectual. Religious texts study.',
        10: 'Career in communication, business, or education. Professional versatility. Good managerial skills. Multiple income sources.',
        11: 'Gains through intellect and networking. Intelligent friends. Successful in multiple ventures. Desires fulfilled through communication.',
        12: 'Expenditure on education or travel. Spiritual intellect. Foreign education possible. Interest in meditation and inner sciences.',
    },
    'Jupiter': {
        1: 'Most auspicious — wise, optimistic, generous personality. Natural teacher and guide. Good health and long life. Spiritual inclination.',
        2: 'Wealth, knowledge, and family happiness. Eloquent and truthful speech. Good education. Accumulation of wisdom and fortune.',
        3: 'Courageous and righteous. Good relationship with siblings through wisdom. Interest in publishing and teaching. Short pilgrimages.',
        4: 'Very auspicious — comfortable life, good education, loving mother. Property and vehicles. Deep inner contentment and spiritual peace.',
        5: 'Excellent for children, education, and mantras. Wise advisor. Strong past-life merit (Purva Punya). Creative and spiritual intelligence.',
        6: 'Victory over enemies through wisdom. Good health management. Service to humanity. May overindulge — moderation needed.',
        7: 'Blessed marriage — wise and supportive spouse. Successful partnerships. Business expansion. Diplomatic nature.',
        8: 'Long life and interest in occult wisdom. Spiritual transformation. Inheritance. Protection during crises. Deep research abilities.',
        9: 'Most powerful placement (own house) — tremendous fortune, dharma, and father\'s blessings. Higher education, pilgrimage, and spiritual mastery.',
        10: 'Respected career with authority and recognition. Success in education, law, finance, or religion. Professional ethics are strong.',
        11: 'Great gains, wealthy friends, and fulfilled desires. Elder siblings prosper. Networking through spiritual or educational circles.',
        12: 'Spiritual liberation and foreign connections. Expenditure on charity. Moksha karaka — deep spiritual progress. Foreign residence.',
    },
    'Venus': {
        1: 'Attractive personality with refined tastes. Love for beauty, art, and luxury. Charming and diplomatic. Romantic nature.',
        2: 'Wealth through beauty, art, or luxury goods. Sweet speech. Happy family life. Good food and comforts. Accumulation of valuables.',
        3: 'Artistic talents in communication — music, art, writing. Good relationship with sisters. Pleasant short travels.',
        4: 'Luxurious home and vehicles. Comfortable domestic life. Mother is beautiful or artistic. Love for luxury furnishings.',
        5: 'Romantic, creative, and artistic. Love for entertainment and performance. Children are attractive. Success in film or fashion.',
        6: 'Service through beauty or art. May face challenges in love life. Health issues related to overindulgence. Success in health industry.',
        7: 'Best placement for marriage — beautiful, loving spouse. Happy partnerships. Business success in luxury goods. Diplomatic skills.',
        8: 'Hidden wealth and secret relationships. Interest in tantric knowledge. Longevity. Inheritance of jewelry or valuables.',
        9: 'Love for philosophy and culture. Beautiful spiritual journey. Father is refined. Foreign travel for pleasure. Artistic pilgrimages.',
        10: 'Career in arts, entertainment, fashion, or luxury. Professional charm. Recognition for aesthetic contributions. Public beauty.',
        11: 'Gains through art, beauty, and relationships. Wealthy and refined friends. Desires for luxury fulfilled. Social popularity.',
        12: 'Expenditure on luxuries and pleasures. Foreign connections through love. Spiritual devotion (Bhakti). Bed pleasures.',
    },
    'Saturn': {
        1: 'Disciplined, mature personality. Hard worker with strong endurance. May face early life hardships that build character. Long life.',
        2: 'Wealth accumulation through patience and hard work. Speech is measured. Family responsibilities. Conservative financial approach.',
        3: 'Courageous through perseverance. Younger siblings may face challenges. Success through sustained effort in communication.',
        4: 'Property through hard work. Mother may face health issues. Domestic responsibilities. Late-life comfort. Emotional restraint.',
        5: 'Delayed children or limited creative expression in youth. Disciplined intellect. Children are responsible. Traditional education.',
        6: 'Excellent placement — victory over enemies through persistence. Good for chronic disease management. Hard-working service.',
        7: 'Delayed or mature marriage. Partner is serious and responsible. Business partnerships require patience. Loyal but reserved.',
        8: 'Long life but chronic health concerns. Deep interest in occult. Karmic transformations. Slow but sure inheritance.',
        9: 'Traditional and disciplined approach to dharma. Father may face challenges. Late-life spiritual wisdom. Structured philosophy.',
        10: 'Powerful career placement — authority through hard work and discipline. Government or corporate leadership. Professional respect.',
        11: 'Steady gains over time. Older, reliable friends. Desires fulfilled after persistent effort. Elder siblings are hardworking.',
        12: 'Expenditure on duties. Foreign residence or isolation. Spiritual discipline. Interest in meditation and renunciation. Karmic debts.',
    },
    'Rahu': {
        1: 'Unconventional personality. Ambitious and worldly. May have a mysterious aura. Obsessive tendencies. Foreign connections.',
        2: 'Unusual wealth accumulation. Unconventional speech or multilingual. Non-traditional family values. Material desires are strong.',
        3: 'Bold and unconventional communication. Success in media, technology, or foreign trades. Adventurous short travels.',
        4: 'Unusual home environment. Foreign property. Restless mind. Technological comforts. Mother may have unconventional views.',
        5: 'Unconventional intelligence. Interest in foreign education. Unusual romance. Children may be unique. Speculative gains.',
        6: 'Strong placement — victory over hidden enemies. Unusual diseases but good recovery. Success in research or investigation.',
        7: 'Unconventional partnerships. Foreign spouse possible. Business with foreign elements. Passionate but complex relationships.',
        8: 'Deep interest in occult and hidden knowledge. Sudden transformations. Research abilities. Hidden wealth from unexpected sources.',
        9: 'Unorthodox spiritual path. Foreign guru or philosophy. Challenges with father. Unconventional higher education.',
        10: 'Ambitious career with sudden rises. Fame through unconventional means. Foreign career connections. Technology-related success.',
        11: 'Large gains through networking and foreign connections. Ambitious friends. Desires are worldly and often fulfilled unexpectedly.',
        12: 'Foreign residence or spiritual exploration. Hidden expenditure. Dreams and subconscious are active. Past-life connections.',
    },
    'Ketu': {
        1: 'Spiritual and detached personality. Past-life wisdom. May appear mysterious. Interest in moksha. Health concerns in early life.',
        2: 'Detachment from material wealth. Speech may be sharp or minimal. Spiritual family values. Knowledge of ancient texts.',
        3: 'Courageous in unconventional ways. Interest in spiritual communication. May distance from siblings. Inner strength.',
        4: 'Detachment from material comforts. Spiritual home environment. Past-life connection to motherland. Inner peace through renunciation.',
        5: 'Past-life spiritual merit. Unusual or intuitive intelligence. Detachment from romantic desires. Children are spiritually inclined.',
        6: 'Victory over enemies through spiritual means. Unusual health patterns. Service through spiritual healing.',
        7: 'Detachment in partnerships. Spiritual spouse. Business with spiritual or healing elements. Unconventional relationships.',
        8: 'Excellent for spiritual transformation and moksha. Deep occult knowledge. Past-life awareness. Sudden spiritual awakenings.',
        9: 'Strong past-life dharma. Spiritual father figure. Interest in ancient wisdom. Pilgrimage holds special significance.',
        10: 'Unconventional career path. Detachment from worldly success. Spiritual leadership. Recognition through inner work.',
        11: 'Gains through spiritual connections. Unusual friendships. Desires are spiritual rather than material. Karmic fulfillments.',
        12: 'Excellent for moksha (spiritual liberation). Deep meditation abilities. Past-life awareness. Complete spiritual immersion.',
    },
};

const ASCENDANT_INTERPRETATIONS = {
    'Aries': 'With Mesha (Aries) Lagna, you are a natural-born leader with dynamic energy, courage, and a pioneering spirit. Mars as your Lagna lord blesses you with physical vitality and mental determination. You approach life head-on and are driven by action. Your personality is assertive, independent, and often competitive.',
    'Taurus': 'With Vrishabha (Taurus) Lagna, you possess a grounded and steady personality. Venus as your Lagna lord gives you a love for beauty, comfort, and material security. You are patient, reliable, and have refined aesthetic sensibilities. Financial stability is a primary life focus.',
    'Gemini': 'With Mithuna (Gemini) Lagna, your personality is intellectual, curious, and communicative. Mercury as your Lagna lord makes you versatile, witty, and skilled with words. You excel in learning, networking, and adapting to change. Your dual nature gives you multiple talents.',
    'Cancer': 'With Karka (Cancer) Lagna, you are deeply emotional, nurturing, and intuitive. The Moon as your Lagna lord connects you strongly to family, home, and emotional security. You have a caring disposition and strong protective instincts toward loved ones.',
    'Leo': 'With Simha (Leo) Lagna, you radiate confidence, dignity, and natural authority. The Sun as your Lagna lord gives you leadership abilities and a desire for recognition. You are generous, creative, and have a commanding presence that inspires others.',
    'Virgo': 'With Kanya (Virgo) Lagna, you are analytical, detail-oriented, and service-minded. Mercury as your Lagna lord blesses you with a sharp intellect and practical wisdom. You excel in problem-solving and have a strong desire to improve and perfect everything around you.',
    'Libra': 'With Tula (Libra) Lagna, you value balance, harmony, and fairness in all areas of life. Venus as your Lagna lord gives you charm, diplomatic skills, and aesthetic appreciation. Partnerships and relationships are central to your life path.',
    'Scorpio': 'With Vrishchika (Scorpio) Lagna, you possess intense depth, transformative power, and penetrating insight. Mars as your Lagna lord gives you resilience and determination. You are naturally drawn to mysteries, research, and the deeper aspects of existence.',
    'Sagittarius': 'With Dhanu (Sagittarius) Lagna, you are philosophical, optimistic, and truth-seeking. Jupiter as your Lagna lord blesses you with wisdom, good fortune, and expansive thinking. You are drawn to higher education, spirituality, and exploration.',
    'Capricorn': 'With Makara (Capricorn) Lagna, you are ambitious, disciplined, and focused on building lasting structures. Saturn as your Lagna lord gives you patience, perseverance, and a strong sense of duty. You achieve success through sustained effort.',
    'Aquarius': 'With Kumbha (Aquarius) Lagna, you are innovative, humanitarian, and unconventional. Saturn as your Lagna lord combined with Aquarian energy makes you a progressive thinker who values social justice and collective well-being.',
    'Pisces': 'With Meena (Pisces) Lagna, you are compassionate, imaginative, and spiritually inclined. Jupiter as your Lagna lord blesses you with wisdom, devotion, and a deep connection to the transcendent. You are naturally empathetic and artistic.',
};

// Helper to build detailed interpretations from real API data
function buildInterpretations(ascendant, sunSign, moonSign, planetsArray) {
    const sections = [];

    // 1. Lagna / Ascendant analysis
    const lagnaDesc = ASCENDANT_INTERPRETATIONS[ascendant] || `Your ascendant is ${ascendant}, shaping your outward personality and approach to life.`;
    const lagnaRashi = RASHI_DATA[ascendant];
    sections.push({
        title: 'Lagna (Ascendant) Analysis',
        icon: '↑',
        sign: ascendant,
        signHindi: lagnaRashi?.hindi || ascendant,
        lord: lagnaRashi?.lord || 'Unknown',
        element: lagnaRashi?.element || 'Unknown',
        description: lagnaDesc,
    });

    // 2. Moon Sign (Rashi) analysis
    const moonRashi = RASHI_DATA[moonSign];
    sections.push({
        title: 'Chandra Rashi (Moon Sign)',
        icon: '☽',
        sign: moonSign,
        signHindi: moonRashi?.hindi || moonSign,
        lord: moonRashi?.lord || 'Unknown',
        element: moonRashi?.element || 'Unknown',
        description: `Your Moon is in ${moonRashi?.hindi || moonSign}, indicating a mind that is ${moonRashi?.nature || 'unique and complex'}. The Moon governs your emotional nature, subconscious patterns, and mental disposition. In Vedic astrology, your Moon sign (Rashi) is considered even more important than your Sun sign as it reveals your inner emotional world.`,
    });

    // 3. Sun Sign analysis
    const sunRashi = RASHI_DATA[sunSign];
    sections.push({
        title: 'Surya Rashi (Sun Sign)',
        icon: '☉',
        sign: sunSign,
        signHindi: sunRashi?.hindi || sunSign,
        lord: sunRashi?.lord || 'Unknown',
        element: sunRashi?.element || 'Unknown',
        description: `Your Sun is placed in ${sunRashi?.hindi || sunSign}, revealing your soul purpose and core identity. The Sun represents your Atma (soul), vitality, authority, and relationship with father. In ${sunSign}, your soul expresses itself in a manner that is ${sunRashi?.nature || 'distinctive and powerful'}.`,
    });

    // 4. Planetary placement interpretations
    const planetDetails = [];
    const mainPlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

    for (const p of planetsArray) {
        if (p.name === 'Ascendant') continue;
        const planetName = p.name;
        if (!mainPlanets.includes(planetName)) continue;

        const house = p.position || 0;
        const sign = normalizeRashiName(p.rasi?.name);
        const degree = parseFloat(p.degree || 0).toFixed(2);
        const rashi = RASHI_DATA[sign];
        const houseInterp = PLANET_IN_HOUSE[planetName]?.[house] || `${planetName} in house ${house} influences the matters of this house with its unique energy.`;

        planetDetails.push({
            planet: planetName,
            sign,
            signHindi: rashi?.hindi || sign,
            house,
            degree: `${degree}°`,
            lord: rashi?.lord || 'Unknown',
            interpretation: houseInterp,
        });
    }

    return { sections, planetDetails };
}

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

        // 2. Format DateTime
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

        // 5. Parse planet positions
        const planetsArray = planetData.data?.planet_position || [];

        const ascendantObj = planetsArray.find(p => p.name === 'Ascendant');
        const ascendant = normalizeRashiName(ascendantObj?.rasi?.name);
        const ascendantDegree = parseFloat(ascendantObj?.degree || 0).toFixed(2);
        const sunSign = normalizeRashiName(planetsArray.find(p => p.name === 'Sun')?.rasi?.name);
        const moonSign = normalizeRashiName(planetsArray.find(p => p.name === 'Moon')?.rasi?.name);

        // 6. Build houses with planet placements for Kundli chart
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

        // 7. Build planetary positions table
        const planetaryPositions = planetsArray.filter(p => p.name !== 'Ascendant').map(p => ({
            planet: p.name,
            sign: normalizeRashiName(p.rasi?.name),
            house: p.position || 0,
            degree: `${parseFloat(p.degree || 0).toFixed(2)}°`,
            nakshatra: p.nakshatra?.name || '',
            isRetrograde: p.is_retrograde || false,
        }));

        // 8. Build detailed interpretations
        const interpretations = buildInterpretations(ascendant, sunSign, moonSign, planetsArray);

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

        // 9. Save to DB
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
