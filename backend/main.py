from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uvicorn
import uuid
import requests
import os

app = FastAPI(title="Weather Data System", version="1.0.0")
WEATHERSTACK_API_KEY = "5c01a5e54a01d7f50c053fdadb763331"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# memoryfor weather data
weather_storage: Dict[str, Dict[str, Any]] = {}

class WeatherRequest(BaseModel):
    date: str
    location: str
    notes: Optional[str] = ""

class WeatherResponse(BaseModel):
    id: str


    """
    You need to implement this endpoint to handle the following:
    1. Receive form data (date, location, notes)
    2. Calls WeatherStack API for the location
    3. Stores combined data with unique ID in memory
    4. Returns the ID to frontend
    """

@app.post("/weather", response_model=WeatherResponse)
async def create_weather_request(request: WeatherRequest):
    weather_id = str(uuid.uuid4())

    params = {
        "access_key": WEATHERSTACK_API_KEY,
        "query": request.location
    }

    try:
        api_response = requests.get("http://api.weatherstack.com/current", params=params, timeout=10)
        data = api_response.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error contacting WeatherStack: {e}")

    if api_response.status_code != 200 or "current" not in data:
        error_msg = data.get("error", {}).get("info", "Failed to fetch weather data")
        raise HTTPException(status_code=502, detail=error_msg)

    # Receive form data (date, location, notes)
    weather_storage[weather_id] = {
        "id": weather_id,
        "date": request.date,
        "location": request.location,
        "notes": request.notes,
        "weather": data["current"],  # This line is important!
        "location_info": data.get("location", {}),
        "request_info": data.get("request", {})
    }


    print("WeatherStack API response:", data)

    return WeatherResponse(id=weather_id)



@app.get("/weather/{weather_id}")
async def get_weather_data(weather_id: str):
    """
    Retrieve stored weather data by ID.
    This endpoint is already implemented for the assessment.
    """
    if weather_id not in weather_storage:
        raise HTTPException(status_code=404, detail="Weather data not found")

    return weather_storage[weather_id]


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

