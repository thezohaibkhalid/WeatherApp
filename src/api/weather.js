import { API_CONFIG } from "./config"

class WeatherAPI {
    #createUrl = (endpoints, params) => {
        const searchParams = new URLSearchParams({
            appid: API_CONFIG.API_KEY,
            ...params,
        });

        return `${endpoints}?${searchParams.toString()}`;
    }

    #fetchData = async (url) => {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Weather Api error: ${response.statusText}`);
        }

        return response.json();
    }

    getCurrentWeather = async ({ lat, lon }) => {
        const url = this.#createUrl(`${API_CONFIG.BASE_URL}/weather`, {
            lat: lat.toString(),
            lon: lon.toString(),
            units: API_CONFIG.DEFAULT_PARAMS.units
        });

        return this.#fetchData(url);
    }

    getForecast = async ({ lat, lon }) => {
        const url = this.#createUrl(`${API_CONFIG.BASE_URL}/forecast`, {
            lat: lat.toString(),
            lon: lon.toString(),
            units: API_CONFIG.DEFAULT_PARAMS.units
        });

        return this.#fetchData(url);
    }

    reverseGeocode = async ({ lat, lon }) => {
        const url = this.#createUrl(`${API_CONFIG.GEO}/reverse`, {
            lat: lat.toString(),
            lon: lon.toString(),
            limit: "1"
        });

        return this.#fetchData(url);
    }

    searchLocation = async (query) => {
        const url = this.#createUrl(`${API_CONFIG.GEO}/direct`, {
            q: query,
            limit: "5",
        });

        return this.#fetchData(url);
    }
}

export const weatherAPI = new WeatherAPI();