import React, { useEffect, useState } from 'react';
import { Viewer, GeoJsonDataSource } from 'resium';
import axios from 'axios';


const WeatherMap = () => {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/box/city?bbox=-74,40,-73,41,10&appid=03c27f6bdfbfbd05ce95cb05b778f7a6`
        );

        setWeatherData(response.data.list);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchData();
  }, []);

  const createGeoJsonData = () => {
    const geoJsonData = {
      type: 'FeatureCollection',
      features: weatherData.map((data) => {
        if (!data.coord || typeof data.coord.lon !== 'number' || typeof data.coord.lat !== 'number') {
          return null; // Skip invalid data points
        }

        return {
          type: 'Feature',
          properties: {
            temperature: data.main.temp,
            cloudCoverage: data.clouds.all,
          },
          geometry: {
            type: 'Point',
            coordinates: [data.coord.lon, data.coord.lat],
          },
        };
      }).filter((feature) => feature !== null), // Filter out null values
    };

    return geoJsonData;
  };

  return (
    <Viewer full>
      <GeoJsonDataSource data={createGeoJsonData()} />
    </Viewer>
  );
};

export default WeatherMap;