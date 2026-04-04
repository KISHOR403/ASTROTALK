from flask import Flask, request, jsonify
import swisseph as swe
from datetime import datetime
from datetime import timedelta

app = Flask(__name__)

# Basic Swiss Ephemeris setup - internal ephemeris
swe.set_ephe_path('')

PLANETS = {
    'Sun': swe.SUN,
    'Moon': swe.MOON,
    'Mars': swe.MARS,
    'Mercury': swe.MERCURY,
    'Jupiter': swe.JUPITER,
    'Venus': swe.VENUS,
    'Saturn': swe.SATURN,
    'Rahu': swe.MEAN_NODE 
}

def get_zodiac_sign(degree):
    signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
    return signs[int((degree % 360) / 30)]

@app.route('/ephemeris', methods=['POST'])
def calculate_ephemeris():
    try:
        data = request.json
        date_str = data.get('date') # "YYYY-MM-DD"
        time_str = data.get('time') # "HH:MM"
        lat = float(data.get('lat', 28.6139))
        lon = float(data.get('lon', 77.2090))
        
        # Calculate Julian Day for UTC
        dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
        dt_utc = dt - timedelta(hours=5, minutes=30)
        
        year, month, day = dt_utc.year, dt_utc.month, dt_utc.day
        hour = dt_utc.hour + dt_utc.minute/60.0
        
        jd = swe.julday(year, month, day, hour)
        
        # 'P' for Placidus house system
        cusps, ascmc = swe.houses(jd, lat, lon, b'P')
        ascendant_degree = ascmc[0]
        ascendant_sign = get_zodiac_sign(ascendant_degree)
        
        planet_positions = []
        for name, p_id in PLANETS.items():
            pos, ret = swe.calc_ut(jd, p_id)
            p_lon = pos[0]
            planet_positions.append({
                "name": name,
                "degree": p_lon,
                "sign": get_zodiac_sign(p_lon),
                # If pos[3] (speed in longitude) is negative, the planet is retrograde
                "is_retrograde": pos[3] < 0 if len(pos) > 3 else False
            })
            
        # Add Ketu exactly opposite to Rahu
        rahu_lon = next(p['degree'] for p in planet_positions if p['name'] == 'Rahu')
        ketu_lon = (rahu_lon + 180) % 360
        planet_positions.append({
            "name": "Ketu",
            "degree": ketu_lon,
            "sign": get_zodiac_sign(ketu_lon),
            "is_retrograde": True # Traditionally retrograde
        })
        
        return jsonify({
            "ascendant": {
                "name": "Ascendant",
                "degree": ascendant_degree,
                "sign": ascendant_sign
            },
            "planets": planet_positions
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
