// hooks/useFetchFonts.js
import { useEffect, useState } from 'react';

export default function useFetchFonts() {
  const [fonts, setFonts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/fonts')
      .then((response) => response.json())
      .then((data) => setFonts(data.fonts))
      .catch((error) => setError(error));
  }, []);

  return { fonts, error };
}
