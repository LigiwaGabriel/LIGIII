import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'LIGIIIII.watchlist';
const WatchlistContext = createContext(null);

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function WatchlistProvider({ children }) {
  const [items, setItems] = useState(load);

  // Persist every change so the list survives a page refresh.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full or disabled: keep working in memory */
    }
  }, [items]);

  const isSaved = useCallback(
    (item) => items.some((i) => i.id === item.id && i.type === item.type),
    [items]
  );

  const toggle = useCallback((item) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id && i.type === item.type);
      if (exists) return prev.filter((i) => !(i.id === item.id && i.type === item.type));
      // Store only the fields needed to render a card.
      const { id, type, title, poster, backdrop, overview, year, date, rating, genreIds } = item;
      return [{ id, type, title, poster, backdrop, overview, year, date, rating, genreIds }, ...prev];
    });
  }, []);

  const value = useMemo(() => ({ items, isSaved, toggle }), [items, isSaved, toggle]);
  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export const useWatchlist = () => useContext(WatchlistContext);
