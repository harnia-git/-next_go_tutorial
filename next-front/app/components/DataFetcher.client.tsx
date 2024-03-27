// next-front/app/components/DataFetcher.client.tsx
"use client";
import { useState, useEffect } from 'react';

export default function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:8080/api/data');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {data ? (
        <div>
          <h2>Data from Backend:</h2>
          <p>{data.text}</p>
        </div>
      ) : (
        <p>Loading data from backend...</p>
      )}
    </div>
  );
}
