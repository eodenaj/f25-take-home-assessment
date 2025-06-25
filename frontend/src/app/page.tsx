"use client";
import { WeatherForm } from "@/components/weather-form";
import { WeatherDisplay } from "@/components/weather-display";
import {WeatherLookup } from "@/components/weather-lookup";
import { useState } from "react";

export default function Home() {

  const [weatherId, setWeatherId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Weather System
          </h1>
          <p className="text-muted-foreground text-lg">
            Submit weather requests and retrieve stored results
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Weather Form Section */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">
              Submit Weather Request
            </h2>
            {/* WeatherId gets updated in WeatherForm*/}
            <WeatherForm onSuccess={setWeatherId} />
          </div>

          {/* Weather Lookup and Display */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">
              Weather Display
            </h2>
            <WeatherLookup />
            {/* Recieve weaterId */}
            <WeatherDisplay id={weatherId}/>
          </div>

        </div>


      </div>
    </div>
  );
}
