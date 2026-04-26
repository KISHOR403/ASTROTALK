import os
import json
import time
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv

try:
    import google.generativeai as genai
except Exception as e:  # pragma: no cover
    raise RuntimeError(
        "google-generativeai is required. Install with: pip install google-generativeai"
    ) from e


ZODIAC_SIGNS = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
]

ELEMENT_BY_SIGN = {
    "Aries": "Fire",
    "Leo": "Fire",
    "Sagittarius": "Fire",
    "Taurus": "Earth",
    "Virgo": "Earth",
    "Capricorn": "Earth",
    "Gemini": "Air",
    "Libra": "Air",
    "Aquarius": "Air",
    "Cancer": "Water",
    "Scorpio": "Water",
    "Pisces": "Water",
}

PERIODS = ["daily", "weekly", "monthly"]

MODEL_NAME = "gemini-1.5-flash"


def _safe_write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(path.suffix + ".tmp")
    with tmp_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    tmp_path.replace(path)


def _normalize_entry(entry: dict, sign: str, dates: str) -> dict:
    # Ensure required fields exist and have correct types.
    def s(x):
        return "" if x is None else str(x).strip()

    def i(x, default=0):
        try:
            return int(x)
        except Exception:
            return default

    rating = i(entry.get("rating"), 3)
    if rating < 1:
        rating = 1
    if rating > 5:
        rating = 5

    lucky_number = i(entry.get("lucky_number"), 0)
    if lucky_number < 0:
        lucky_number = 0

    return {
        "sign": sign,
        "dates": dates,
        "element": ELEMENT_BY_SIGN.get(sign, ""),
        "overall": s(entry.get("overall")),
        "love": s(entry.get("love")),
        "career": s(entry.get("career")),
        "health": s(entry.get("health")),
        "lucky_number": lucky_number,
        "lucky_color": s(entry.get("lucky_color")),
        "lucky_day": s(entry.get("lucky_day")),
        "rating": rating,
        "tip": s(entry.get("tip")),
    }


def _build_prompt(sign: str, period: str, iso_date: str) -> str:
    dates_hint = {
        "daily": f"{iso_date}",
        "weekly": f"week starting {iso_date}",
        "monthly": f"month containing {iso_date}",
    }.get(period, iso_date)

    return f"""
You are a Vedic astrology content generator. Generate a concise, helpful {period} horoscope for the zodiac sign "{sign}" for {dates_hint}.

Return ONLY valid JSON, no markdown, no backticks, no extra text.

The JSON object MUST have exactly these keys:
{{
  "overall": string,
  "love": string,
  "career": string,
  "health": string,
  "lucky_number": number,
  "lucky_color": string,
  "lucky_day": string,
  "rating": number,
  "tip": string
}}

Rules:
- rating must be an integer from 1 to 5
- lucky_number must be an integer
- Keep each field short and readable (1-2 sentences max for overall/love/career/health, tip 1 sentence)
""".strip()


def _generate_for_sign(model, sign: str, period: str, iso_date: str) -> dict:
    prompt = _build_prompt(sign, period, iso_date)
    try:
        result = model.generate_content(prompt)
        text = (result.text or "").strip()
        # Defensive cleanup if the model wraps JSON accidentally.
        cleaned = (
            text.replace("```json", "")
            .replace("```", "")
            .strip()
        )
        parsed = json.loads(cleaned)
        if not isinstance(parsed, dict):
            raise ValueError("Gemini did not return a JSON object.")
        return parsed
    except Exception as e:
        raise RuntimeError(f"Failed generating {period} for {sign}: {e}") from e


def main() -> None:
    load_dotenv()

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable is required.")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(MODEL_NAME)

    now_utc = datetime.now(timezone.utc)
    iso_date = now_utc.strftime("%Y-%m-%d")

    base_dir = Path(__file__).resolve().parent
    out_dir = base_dir / "horoscope_data"

    for period in PERIODS:
        signs_payload: dict[str, dict] = {}

        for idx, sign in enumerate(ZODIAC_SIGNS):
            entry_raw = _generate_for_sign(model, sign, period, iso_date)
            entry = _normalize_entry(entry_raw, sign=sign, dates=iso_date)
            signs_payload[sign.lower()] = entry

            # 2 second delay between API calls to avoid rate limiting
            # (skip delay after the last call of the last period)
            is_last = period == PERIODS[-1] and idx == len(ZODIAC_SIGNS) - 1
            if not is_last:
                time.sleep(2)

        payload = {
            "date": iso_date,
            "period": period,
            "signs": signs_payload,
        }

        latest_path = out_dir / f"{period}_latest.json"
        archive_path = out_dir / f"{period}_{iso_date}.json"

        _safe_write_json(latest_path, payload)
        _safe_write_json(archive_path, payload)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        # Ensure non-zero exit for CI/workflows
        print(str(e))
        raise

