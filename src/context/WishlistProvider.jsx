import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { toast } from "sonner";

// Stała dla klucza localStorage
const WISHLIST_STORAGE_KEY = "game-finder-wishlist";

// Tworzenie kontekstu
const WishlistContext = createContext();

// Hook do łatwego dostępu do kontekstu
export const useWishlist = () => useContext(WishlistContext);

// Provider dla kontekstu
export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Wczytywanie listy życzeń z localStorage podczas montowania
  useEffect(() => {
    const loadWishlist = () => {
      const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (storedWishlist) {
        try {
          setWishlist(JSON.parse(storedWishlist));
        } catch (error) {
          console.error(
            "Nie udało się wczytać wishlist z localStorage:",
            error
          );
          // Reset wishlist jeśli dane są uszkodzone
          localStorage.removeItem(WISHLIST_STORAGE_KEY);
        }
      }
      setIsLoading(false);
    };

    loadWishlist();
  }, []);

  // Aktualizacja localStorage gdy wishlist się zmienia
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, isLoading]);

  // Dodawanie gry do listy życzeń (zoptymalizowane)
  const addToWishlist = useCallback((game) => {
    if (!game) return;

    setWishlist((prev) => {
      // Sprawdź czy gra już jest na liście
      if (prev.some((item) => item.id === game.id)) {
        return prev;
      }

      // Pokaż powiadomienie
      toast(`${game.name} dodano do listy życzeń`, {
        description: "Dodano do listy życzeń",
      });

      // Dodaj do listy
      return [...prev, game];
    });
  }, []);

  // Usuwanie gry z listy życzeń (zoptymalizowane)
  const removeFromWishlist = useCallback((gameId) => {
    setWishlist((prev) => {
      // Znajdź grę do usunięcia
      const game = prev.find((item) => item.id === gameId);

      // Pokaż powiadomienie jeśli znaleziono
      if (game) {
        toast(`${game.name} usunięto z listy życzeń`, {
          description: "Usunięto z listy życzeń",
        });
      }

      // Usuń z listy
      return prev.filter((item) => item.id !== gameId);
    });
  }, []);

  // Sprawdzanie czy gra jest na liście życzeń (zoptymalizowane)
  const isInWishlist = useCallback(
    (gameId) => {
      return wishlist.some((item) => item.id === gameId);
    },
    [wishlist]
  );

  // Przełączanie stanu gry na liście życzeń (zoptymalizowane)
  const toggleWishlist = useCallback(
    (game) => {
      if (isInWishlist(game.id)) {
        removeFromWishlist(game.id);
      } else {
        addToWishlist(game);
      }
    },
    [isInWishlist, removeFromWishlist, addToWishlist]
  );

  // Memoizowane wartości kontekstu dla lepszej wydajności
  const contextValue = useMemo(
    () => ({
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      isLoading,
    }),
    [
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      isLoading,
    ]
  );

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistProvider;
