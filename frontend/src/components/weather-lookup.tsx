import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Weather data, has an id, date, location, and notes.
// Know that weather, location_info, request_info can be any data
type WeatherData = {
    id: string;
    date: string;
    location: string;
    notes: string;
    weather: any;
    location_info?: any;
    request_info?: any;
};


// WeatherLookup is a React Component with a search bar that
// contains a search bar, return (location, date, weather, humidity) when user enters a valid id.
// fetches data from the backend.
export function WeatherLookup() {
    const [inputId, setInputId] = useState<string>("");
    const [activeId, setActiveId] = useState<string | null>(null);
    const [data, setData] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!activeId) {
            setData(null);
            setError(null);
            return;
        }
        setData(null);
        setError(null);
        fetch(`http://localhost:8000/weather/${activeId}`)
        .then((res) => {
            if (!res.ok) throw new Error("Weather data not found");
            return res.json();
        })
        .then(setData)
        .catch((err) => setError(err.message));
    }, [activeId]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputId.trim()) {
            setActiveId(inputId.trim());
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
        <CardTitle>
        Weather Lookup
        </CardTitle>
        </CardHeader>
        <CardContent>
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
        type="text"
        placeholder="Enter request ID"
        value={inputId}
        onChange={e => setInputId(e.target.value)}
        className="border rounded px-3 py-2 flex-1"
        />
        <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        >
        Search
        </button>
        </form>

        {/* Display Weather Data */}
        {!activeId && <div className="text-muted-foreground">Enter a request ID to view weather data.</div>}
        {error && <div className="text-red-500">{error}</div>}
        {activeId && !error && !data && <div>Loading...</div>}
        {data && (
            <div>
            <div className="font-semibold mb-2">Weather for {data.location}</div>
            {data.weather.weather_icons?.[0] && (
                <img
                src={data.weather.weather_icons[0]}
                alt={data.weather.weather_descriptions?.[0] || "Weather icon"}
                className="w-16 h-16 mb-4"
                />
            )}
            <div><strong>Weather:</strong> {data.weather.weather_descriptions?.[0] || "N/A"}</div>
            <div><strong>Date:</strong> {data.date ?? "N/A"}</div>
            <div><strong>Temperature:</strong> {data.weather.temperature ?? "N/A"} °C</div>
            <div><strong>Wind Speed:</strong> {data.weather.wind_speed ?? "N/A"} km/h</div>
            <div><strong>Humidity:</strong> {data.weather.humidity ?? "N/A"}%</div>
            </div>
        )}
        </CardContent>
        </Card>
    );
}
