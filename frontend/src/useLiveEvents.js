// useLiveEvents.js
import { useEffect, useState } from 'react';

export function useLiveEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const source = new EventSource('http://localhost:3000/watch/stream');

    source.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setEvents((prev) => [data, ...prev].slice(0, 200)); // keep last 200
    };

    source.onerror = () => {
      console.warn('SSE connection lost, browser will auto-retry');
    };

    return () => source.close();
  }, []);

  return events;
}