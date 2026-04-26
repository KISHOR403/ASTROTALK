const express = require('express');
const router = express.Router();

// Hardcoded data for 12 signs x 3 periods (Daily, Weekly, Monthly)
const horoscopeData = {
    aries: {
        sign: "Aries",
        planet: "Mars",
        element: "Fire",
        daily: {
            date: "April 26, 2026",
            insight: "Mars energizes your ambitions today. A bold move in your professional life could open unexpected doors. In love, patience will be rewarded.",
            meters: { love: 72, career: 85, health: 60 },
            lucky: { color: "Red", number: 9, stone: "Ruby" }
        },
        weekly: {
            date: "April 26 - May 2, 2026",
            insight: "This week, focus on your inner strength. New social connections will bring unexpected professional benefits. Your energy is peaking.",
            meters: { love: 65, career: 92, health: 78 },
            lucky: { color: "Crimson", number: 1, stone: "Coral" }
        },
        monthly: {
            date: "April 2026",
            insight: "April is a month of transformation for Aries. Expect major breakthroughs in long-pending projects. Financial gains are highly likely.",
            meters: { love: 80, career: 88, health: 85 },
            lucky: { color: "Scarlet", number: 4, stone: "Garnet" }
        }
    },
    taurus: {
        sign: "Taurus",
        planet: "Venus",
        element: "Earth",
        daily: {
            date: "April 26, 2026",
            insight: "Steady progress is your theme today. Trust your practical instincts in financial matters. A beautiful evening with loved ones awaits.",
            meters: { love: 88, career: 70, health: 92 },
            lucky: { color: "Green", number: 6, stone: "Emerald" }
        },
        weekly: {
            date: "April 26 - May 2, 2026",
            insight: "You'll feel a strong urge to reorganize your space this week. This clarity of environment will mirror your clarity of thought.",
            meters: { love: 75, career: 82, health: 80 },
            lucky: { color: "Forest Green", number: 2, stone: "Jade" }
        },
        monthly: {
            date: "April 2026",
            insight: "April brings focus to your personal values. You may find yourself reconsidering long-held beliefs about success and happiness.",
            meters: { love: 90, career: 75, health: 85 },
            lucky: { color: "Olive", number: 8, stone: "Malachite" }
        }
    },
    gemini: {
        sign: "Gemini",
        planet: "Mercury",
        element: "Air",
        daily: {
            date: "April 26, 2026",
            insight: "Your curiosity is your best asset today. Ask questions and seek new perspectives. A message from the past might bring good news.",
            meters: { love: 60, career: 90, health: 75 },
            lucky: { color: "Yellow", number: 5, stone: "Citrine" }
        },
        weekly: {
            date: "April 26 - May 2, 2026",
            insight: "Multiple small opportunities will present themselves this week. Stay agile and don't be afraid to pivot your plans.",
            meters: { love: 82, career: 85, health: 70 },
            lucky: { color: "Amber", number: 3, stone: "Agate" }
        },
        monthly: {
            date: "April 2026",
            insight: "Networking takes center stage this month. Your social circle will expand, bringing influential people into your orbit.",
            meters: { love: 70, career: 95, health: 80 },
            lucky: { color: "Gold", number: 11, stone: "Topaz" }
        }
    },
    cancer: {
        sign: "Cancer",
        planet: "Moon",
        element: "Water",
        daily: {
            date: "April 26, 2026",
            insight: "Trust your intuition in family matters. A quiet day spent at home or in nature will replenish your emotional reserves.",
            meters: { love: 95, career: 60, health: 80 },
            lucky: { color: "Silver", number: 2, stone: "Pearl" }
        },
        weekly: {
            date: "April 26 - May 2, 2026",
            insight: "Your nurturing side will be in high demand this week. Remember to set boundaries to protect your own energy.",
            meters: { love: 88, career: 70, health: 75 },
            lucky: { color: "White", number: 7, stone: "Moonstone" }
        },
        monthly: {
            date: "April 2026",
            insight: "April is a month for emotional deep-diving. You'll resolve long-standing internal conflicts and emerge stronger.",
            meters: { love: 92, career: 65, health: 85 },
            lucky: { color: "Seafoam", number: 9, stone: "Opal" }
        }
    },
    leo: {
        sign: "Leo",
        planet: "Sun",
        element: "Fire",
        daily: {
            date: "April 26, 2026",
            insight: "Your charisma is at an all-time high. It's a perfect day to pitch an idea or take the lead on a project. Shine brightly!",
            meters: { love: 80, career: 95, health: 85 },
            lucky: { color: "Gold", number: 1, stone: "Ruby" }
        },
        weekly: {
            date: "April 26 - May 2, 2026",
            insight: "A creative project you've been working on will finally gain recognition this week. Your passion is infectious.",
            meters: { love: 90, career: 88, health: 70 },
            lucky: { color: "Orange", number: 5, stone: "Amber" }
        },
        monthly: {
            date: "April 2026",
            insight: "April brings opportunities for travel and expansion. Say yes to invitations that take you out of your comfort zone.",
            meters: { love: 85, career: 92, health: 80 },
            lucky: { color: "Saffron", number: 3, stone: "Tiger's Eye" }
        }
    },
    virgo: {
        sign: "Virgo",
        planet: "Mercury",
        element: "Earth",
        daily: {
            date: "April 26, 2026",
            insight: "Your attention to detail is legendary today. Use it to solve a complex problem at work. Your health routine is showing results.",
            meters: { love: 65, career: 92, health: 90 },
            lucky: { color: "Beige", number: 4, stone: "Sapphire" }
        },
        weekly: {
            date: "April 26 - May 2, 2026",
            insight: "Focus on fine-tuning your daily habits this week. Small adjustments will lead to significant long-term benefits.",
            meters: { love: 75, career: 85, health: 95 },
            lucky: { color: "Navy", number: 8, stone: "Lapis Lazuli" }
        },
        monthly: {
            date: "April 2026",
            insight: "April is a month of productivity. You'll clear your to-do list and find time for a new hobby that relaxes you.",
            meters: { love: 70, career: 90, health: 88 },
            lucky: { color: "Grey", number: 12, stone: "Amethyst" }
        }
    },
    libra: {
        sign: "Libra",
        planet: "Venus",
        element: "Air",
        daily: {
            date: "April 26, 2026",
            insight: "Balance is your superpower today. You'll mediate a conflict with grace. A surprise romantic gesture will brighten your night.",
            meters: { love: 92, career: 75, health: 80 },
            lucky: { color: "Pink", number: 7, stone: "Rose Quartz" }
        },
        weekly: {
            date: "April 26 - May 2, 2026",
            insight: "Collaborations are favored this week. Look for partners who complement your skills and share your vision.",
            meters: { love: 85, career: 88, health: 75 },
            lucky: { color: "Light Blue", number: 6, stone: "Turquoise" }
        },
        monthly: {
            date: "April 2026",
            insight: "April brings focus to your one-on-one relationships. Deeper connections will form as you practice radical honesty.",
            meters: { love: 95, career: 70, health: 85 },
            lucky: { color: "Lavender", number: 10, stone: "Aquamarine" }
        }
    },
    scorpio: {
        sign: "Scorpio",
        planet: "Pluto",
        element: "Water",
        daily: {
            date: "April 26, 2026",
            insight: "Your focus is intense today. Dive deep into a project that requires concentration. Your mystery is drawing people in.",
            meters: { love: 85, career: 88, health: 75 },
            lucky: { color: "Maroon", number: 8, stone: "Black Tourmaline" }
        },
        weekly: {
            date: "April 26 - May 2, 2026",
            insight: "Financial insights will be strong this week. Look for unconventional ways to grow your assets or manage your debt.",
            meters: { love: 70, career: 92, health: 80 },
            lucky: { color: "Black", number: 13, stone: "Obsidian" }
        },
        monthly: {
            date: "April 2026",
            insight: "April is a month of intense growth. You'll face a challenge head-on and emerge with a renewed sense of purpose.",
            meters: { love: 88, career: 85, health: 70 },
            lucky: { color: "Plum", number: 5, stone: "Onyx" }
        }
    },
    sagittarius: {
        sign: "Sagittarius",
        planet: "Jupiter",
        element: "Fire",
        daily: {
            date: "April 26, 2026",
            insight: "Adventure is calling! Even a small change of scenery will boost your mood. Your optimism is your greatest strength today.",
            meters: { love: 70, career: 85, health: 90 },
            lucky: { color: "Purple", number: 3, stone: "Amethyst" }
        },
        weekly: {
            date: "April 26 - May 2, 2026",
            insight: "Learning something new will bring you joy this week. Sign up for a workshop or dive into a book that challenges you.",
            meters: { love: 82, career: 75, health: 88 },
            lucky: { color: "Indigo", number: 9, stone: "Sodalite" }
        },
        monthly: {
            date: "April 2026",
            insight: "April brings a desire for freedom. You'll find ways to integrate more autonomy into your professional life.",
            meters: { love: 75, career: 88, health: 85 },
            lucky: { color: "Magenta", number: 12, stone: "Jasper" }
        }
    },
    capricorn: {
        sign: "Capricorn",
        planet: "Saturn",
        element: "Earth",
        daily: {
            date: "April 26, 2026",
            insight: "Your discipline is unmatched today. Complete a difficult task early to enjoy a relaxing evening. Recognition is on its way.",
            meters: { love: 60, career: 95, health: 85 },
            lucky: { color: "Brown", number: 10, stone: "Garnet" }
        },
        weekly: {
            date: "April 26 - May 2, 2026",
            insight: "Long-term planning is favored this week. Review your goals and make adjustments that reflect your true desires.",
            meters: { love: 70, career: 92, health: 80 },
            lucky: { color: "Grey", number: 4, stone: "Onyx" }
        },
        monthly: {
            date: "April 2026",
            insight: "April is a month of career progress. You'll step into a leadership role or receive praise for a job well done.",
            meters: { love: 85, career: 95, health: 75 },
            lucky: { color: "Dark Green", number: 2, stone: "Hematite" }
        }
    },
    aquarius: {
        sign: "Aquarius",
        planet: "Uranus",
        element: "Air",
        daily: {
            date: "April 26, 2026",
            insight: "Your innovative ideas are your best feature today. Don't be afraid to think outside the box. A community project needs you.",
            meters: { love: 75, career: 88, health: 82 },
            lucky: { color: "Cyan", number: 11, stone: "Turquoise" }
        },
        weekly: {
            date: "April 26 - May 2, 2026",
            insight: "Social connections will bring a pleasant surprise this week. An old friend might reach out with an interesting proposal.",
            meters: { love: 80, career: 82, health: 85 },
            lucky: { color: "Silver", number: 8, stone: "Fluorite" }
        },
        monthly: {
            date: "April 2026",
            insight: "April brings a focus on personal growth. You'll find yourself drawn to new philosophies and ways of living.",
            meters: { love: 90, career: 75, health: 80 },
            lucky: { color: "Sky Blue", number: 1, stone: "Labradorite" }
        }
    },
    pisces: {
        sign: "Pisces",
        planet: "Neptune",
        element: "Water",
        daily: {
            date: "April 26, 2026",
            insight: "Your dreams are vivid and meaningful today. Pay attention to your subconscious. A creative project will flow effortlessly.",
            meters: { love: 90, career: 70, health: 85 },
            lucky: { color: "Teal", number: 12, stone: "Aquamarine" }
        },
        weekly: {
            date: "April 26 - May 2, 2026",
            insight: "Compassion will be your guiding light this week. Help someone in need and you'll find your own heart lighter.",
            meters: { love: 85, career: 75, health: 90 },
            lucky: { color: "Sea Blue", number: 7, stone: "Bloodstone" }
        },
        monthly: {
            date: "April 2026",
            insight: "April is a month of spiritual awakening. You'll find yourself more connected to the world around you than ever before.",
            meters: { love: 95, career: 65, health: 88 },
            lucky: { color: "Turquoise", number: 3, stone: "Larimar" }
        }
    }
};

router.get('/:sign/:period', (req, res) => {
    const { sign, period } = req.params;
    const signData = horoscopeData[sign.toLowerCase()];
    
    if (!signData) {
        return res.status(404).json({ message: "Zodiac sign not found" });
    }
    
    const periodData = signData[period.toLowerCase()];
    if (!periodData) {
        return res.status(404).json({ message: "Horoscope period not found" });
    }
    
    const response = {
        sign: signData.sign,
        period: period.toLowerCase(),
        planet: signData.planet,
        element: signData.element,
        ...periodData
    };
    
    res.json(response);
});

module.exports = router;
