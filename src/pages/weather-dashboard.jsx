import React from 'react';
import { AlertTriangle, MapPin, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLocation } from '../hooks/useLocation.js';
import WeatherSkeleton from '../components/loading-skeleton';
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from '../hooks/useWeather.js';
import CurrentWeather from '../components/current-weather.jsx';
import HourlyTemparature from '../components/hourly-temparature.jsx';
import WeatherDetails from '../components/weather-details.jsx';
import WeatherForecast from '../components/weather-forecast.jsx';
import FavoriteCities from '../components/favoriteCities.jsx';

const WeatherDashboard = () => {
    const { coordinates, error: locationError, getLocation, isLoading: locationLoading } = useLocation();

    const locationQuery = useReverseGeocodeQuery(coordinates);
    const weatherQuery = useWeatherQuery(coordinates);
    const forecastQuery = useForecastQuery(coordinates);

    const handleRefresh = () => {
        getLocation();

        if (coordinates) {
            weatherQuery.refetch(),
                locationQuery.refetch(),
                forecastQuery.refetch()
        }
    }

    if (locationLoading) {
        return <WeatherSkeleton />
    }

    if (locationError) {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Location Error</AlertTitle>
                <AlertDescription className="flex flex-col gap-4">
                    <p>{locationError}</p>
                    <Button variant="outline" onClick={getLocation} className="w-fit">
                        <MapPin className="mr-2 h-4 w-4" />
                        Enable Location
                    </Button>
                </AlertDescription>
            </Alert>
        )
    }

    if (!coordinates) {
        return (
            <Alert>
                <MapPin className="h-4 w-4" />
                <AlertTitle>Location Required</AlertTitle>
                <AlertDescription className="flex flex-col gap-4">
                    <p>Please enable location access to see your local weather.</p>
                    <Button variant="outline" onClick={getLocation} className="w-fit">
                        <MapPin className="mr-2 h-4 w-4" />
                        Enable Location
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    const locationName = locationQuery.data?.[0];
    if (weatherQuery.error || forecastQuery.error) {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="flex flex-col gap-4">
                    <p>Unable to fetch weather info. Please try again!</p>
                    <Button variant="outline" onClick={handleRefresh} className="w-fit">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retry
                    </Button>
                </AlertDescription>
            </Alert>
        )
    }

    if (!weatherQuery.data || !forecastQuery.data) {
        return <WeatherSkeleton />
    }

    return (
        <div className='space-y-4'>
            <FavoriteCities />
            <div className="flex items-center justify-between">
                <h1 className='text-xl font-bold tracking-tight'>
                    My location
                </h1>
                <Button variant={"outline"} size={"icon"} onClick={handleRefresh} disabled={weatherQuery.isFetching || forecastQuery.isFetching}>
                    <RefreshCw className={`h-4 w-4 ${weatherQuery.isFetching ? "animate-spin" : ""}`} />
                </Button>
            </div>

            <div className="grid gap-6">
                <div className='flex flex-col lg:flex-row gap-4'>
                    <CurrentWeather data={weatherQuery.data} locationName={locationName} />
                    <HourlyTemparature data={forecastQuery.data} />
                </div>

                <div className='grid gap-6 md:grid-cols-2 items-start'>
                    <WeatherDetails data={weatherQuery.data} />
                    <WeatherForecast data={forecastQuery.data} />
                </div>
            </div>
        </div>
    )
}

export default WeatherDashboard;