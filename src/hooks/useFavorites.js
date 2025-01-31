import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalStorage";

export function useFavorite() {
    const [favorites, setFavorites] = useLocalStorage("favorites", []);
    const queryClient = useQueryClient();

    const favoriteQuery = useQuery({
        queryKey: ["favorites"],
        queryFn: () => favorites,
        initialData: favorites,
        staleTime: Infinity,
    });

    const addToFavorite = useMutation({
        mutationFn: async (city) => {
            const newFavorite = {
                ...city,
                id: `${city.lat}-${city.lon}`,
                addedAt: Date.now(),
            }

            const ifExists = favorites.some((fav) => fav.id === newFavorite.id);
            if (ifExists) return favorites;

            const newFavorites = [newFavorite, ...favorites].slice(0, 10);
            setFavorites(newFavorites);

            return newFavorites;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favorites"]
            });
        }
    });

    const removeFavorite = useMutation({
        mutationFn: async (cityId) => {
            const newFavorite = favorites.filter((city) => city.id !== cityId);
            setFavorites(newFavorite);

            return newFavorite;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favorites"]
            });
        }
    });

    return {
        favorites: favoriteQuery.data,
        addToFavorite,
        removeFavorite,
        isFavorite: (lat, lon) => favorites.some((city) => city.lat === lat && city.lon === lon),
    }
}