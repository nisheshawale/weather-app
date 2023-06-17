import React, { useState, useEffect } from "react";
import { Viewer, Entity, PolygonGraphics } from "resium";
import { jsonData, stateNames } from "./us-states";
import * as Cesium from "cesium";
import axios from "axios";
import responses from "./responses";

const MyMap = () => {
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);

        // uncomment this when using real api
        // const _filteredStateNames = stateNames;

        // comment this when using real api
        const _filteredStateNames = stateNames.filter((e) =>
          Object.keys(responses).includes(e)
        );

        const weatherInfoPromises = _filteredStateNames.map(async (state) => {
          // uncomment this when using real api
          // const response = await axios.get(
          //   `https://api.openweathermap.org/data/2.5/weather?q=${state},us&appid=4bbf4153574446e5e33d8f8fa7e7f2f8`
          // );
          // return {
          //   temperature: response.data.main.temp,
          //   cloudCoverage: response.data.clouds.all,
          // };

          // comment this when using real api
          return {
            temperature: responses[state].main.temp,
            cloudCoverage: responses[state].clouds.all,
          };

        });

        const weatherInfo = await Promise.all(weatherInfoPromises);

        const temperatures = weatherInfo.map((item) => item.temperature);
        const minTemp = Math.min(...temperatures);
        const maxTemp = Math.max(...temperatures);
        // const t = (value - minTemp) / (maxTemperature - maxTemp);
        console.log("WeatherInfo", weatherInfo);
        console.log("Min", minTemp, "max", maxTemp);

        const weatherDataObj = _filteredStateNames.reduce(
          (acc, state, index) => {

            const _tempColor =
              (+weatherInfo[index].temperature - minTemp) /
              Math.max(1, maxTemp - minTemp);

            let _baseColor = new Cesium.Color();

            acc[state] = {
              ...weatherInfo[index],
              temp_color: Cesium.Color.lerp(
                Cesium.Color.BLUE,
                Cesium.Color.RED,
                _tempColor,
                _baseColor
              ),
            };
            return acc;
          },
          {}
        );

        console.log("Data obj", weatherDataObj);

        setWeatherData(weatherDataObj);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
    try {
      let _color = new Cesium.Color();
      Cesium.Color.lerp(Cesium.Color.BLUE, Cesium.Color.RED, 1.0, _color);
      console.log("color is ", _color);
    } catch (e) {
      console.log("lerp error", e);
    }
  }, []);

  return !loading ? (
    <Viewer>
      {jsonData.map((eachJson, index) => {
        if (
          weatherData[eachJson.properties.name]?.["temperature"] ===
            undefined ||
          weatherData[eachJson.properties.name]?.["cloudCoverage"] === undefined
        )
          return <div key={index}></div>;
        if (eachJson.geometry.type === "Polygon") {
          return (
            <Entity
              key={index}
              name={eachJson.properties.name}
              description={`
            <h2>Temp is : ${
              weatherData[eachJson.properties.name]["temperature"]
            }</h2>
            <h2>Cloud Coverage is : ${
              weatherData[eachJson.properties.name]["cloudCoverage"]
            }</h2>
          `}
            >
              <PolygonGraphics
                hierarchy={Cesium.Cartesian3.fromDegreesArray(
                  eachJson.geometry.coordinates[0].flat()
                )}
                material={weatherData[eachJson.properties.name]["temp_color"]}
              />
            </Entity>
          );
        } else {
          return eachJson.geometry.coordinates[0].map((coordinate, id) => (
            <Entity
              key={`${index}-${id}`}
              name={eachJson.properties.name}
              description={`
            <h2>Temp is : ${
              weatherData[eachJson.properties.name]["temperature"]
            }</h2>
            <h2>Cloud Coverage is : ${
              weatherData[eachJson.properties.name]["cloudCoverage"]
            }</h2>
          `}
            >
              <PolygonGraphics
                hierarchy={Cesium.Cartesian3.fromDegreesArray(
                  coordinate.flat()
                )}
                material={weatherData[eachJson.properties.name]["temp_color"]}
              />
            </Entity>
          ));
        }
      })}
    </Viewer>
  ) : (
    <div>Loading</div>
  );
};

export default MyMap;
