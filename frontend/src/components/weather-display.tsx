import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WeatherData = {
    id: string;
    date: string;
    location: string;
    notes: string;
    weather: any;
    location_info?: any;
    request_info?: any;
};


// receive the updated weatherID and fetches (location, weather, humidity, date, windspeed) from the backend and then display the info
export function WeatherDisplay({ id }: { id: string | null }) {
    const [data, setData] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setData(null);
            setError(null);
            return;
        }
        setData(null);
        setError(null);
        fetch(`http://localhost:8000/weather/${id}`)

        .then((res) => {
            if (!res.ok) throw new Error("Weather data not found");
            return res.json();
        })
        .then(setData)
        .catch((err) => setError(err.message));
    }, [id]);

    if (!id) return null;
    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (!data) return <div>Loading...</div>;

    // Only display the weather parameter as requested
    const weather = data.weather;

    return (
        <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
        <CardTitle>
        Weather for {data.location}
        </CardTitle>
        </CardHeader>
        <CardContent>
        {weather.weather_icons?.[0] && (
            <img
            src={weather.weather_icons[0]}
            alt={weather.weather_descriptions?.[0] || "Weather icon"}
            className="w-16 h-16 mb-4"
            />
        )}
        <div><strong>Weather:</strong> {weather.weather_descriptions?.[0] || "N/A"}</div>
        <div><strong>Date:</strong> {data.date ?? "N/A"}</div>
        <div><strong>Temperature:</strong> {weather.temperature ?? "N/A"} °C</div>
        <div><strong>Wind Speed:</strong> {weather.wind_speed ?? "N/A"} km/h</div>
        <div><strong>Humidity:</strong> {weather.humidity ?? "N/A"}%</div>

        </CardContent>
        </Card>
    );
}
