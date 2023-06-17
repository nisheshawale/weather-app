import React, { useState, useEffect } from "react";
import { Viewer, Entity, PolygonGraphics } from "resium";
import { jsonData,stateNames } from "./us-states";
import * as Cesium from "cesium";
import axios from "axios";

const MyMap = () => {
  const [weatherData, setWeatherData] = useState({});
  // const [minTemperature, setMinTemperature] = useState(null);
  // const [maxTemperature, setMaxTemperature] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      // const startColor = Cesium.Color.BLUE;
      // const endColor = Cesium.Color.RED;

      // Function to map a value to a color in the gradient
      // function getColor(value) {
      //   const t = (value - minTemperature) / (maxTemperature - minTemperature); // Normalize the value between 0 and 1
      //   console.log(t)
      //   console.log(startColor)
      //   console.log(endColor)
      //   const c = Cesium.Color.lerp(startColor, endColor, t);
      //   return c;
      // }

      try {
        setLoading(true);
        const weatherInfoPromises = stateNames.map(async (state) => {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${state},us&appid=4bbf4153574446e5e33d8f8fa7e7f2f8`
          );

          // const _data =
          //   state === "Texas"
          //     ? {
          //         coord: { lon: -99.2506, lat: 31.2504 },
          //         weather: [
          //           {
          //             id: 803,
          //             main: "Clouds",
          //             description: "broken clouds",
          //             icon: "04n",
          //           },
          //         ],
          //         base: "stations",
          //         main: {
          //           temp: 300.12,
          //           feels_like: 300.36,
          //           temp_min: 296.84,
          //           temp_max: 300.12,
          //           pressure: 1014,
          //           humidity: 47,
          //         },
          //         visibility: 10000,
          //         wind: { speed: 5.66, deg: 210 },
          //         clouds: { all: 75 },
          //         dt: 1686981045,
          //         sys: {
          //           type: 1,
          //           id: 3395,
          //           country: "US",
          //           sunrise: 1687001561,
          //           sunset: 1687052589,
          //         },
          //         timezone: -18000,
          //         id: 4736286,
          //         name: "Texas",
          //         cod: 200,
          //       }
          //     : {
          //         coord: { lon: -86.7503, lat: 32.7504 },
          //         weather: [
          //           {
          //             id: 804,
          //             main: "Clouds",
          //             description: "overcast clouds",
          //             icon: "04n",
          //           },
          //         ],
          //         base: "stations",
          //         main: {
          //           temp: 294.33,
          //           feels_like: 294.93,
          //           temp_min: 292.3,
          //           temp_max: 295.01,
          //           pressure: 1012,
          //           humidity: 93,
          //           sea_level: 1012,
          //           grnd_level: 995,
          //         },
          //         visibility: 10000,
          //         wind: { speed: 3.31, deg: 177, gust: 9.1 },
          //         clouds: { all: 99 },
          //         dt: 1686977785,
          //         sys: {
          //           type: 2,
          //           id: 2001352,
          //           country: "US",
          //           sunrise: 1686911924,
          //           sunset: 1686963400,
          //         },
          //         timezone: -18000,
          //         id: 4829764,
          //         name: "Alabama",
          //         cod: 200,
          //       };

         
                return {
            temperature: response.data.main.temp,
            cloudCoverage: response.data.clouds.all,
          };
        });

        const weatherInfo = await Promise.all(weatherInfoPromises);

        const temperatures = weatherInfo.map((item) => item.temperature);
        const minTemp = Math.min(...temperatures);
        const maxTemp = Math.max(...temperatures);
        // const t = (value - minTemp) / (maxTemperature - maxTemp);
        console.log("WeatherInfo", weatherInfo);
        console.log("Min", minTemp, "max", maxTemp);

        const weatherDataObj = stateNames.reduce((acc, state, index) => {
          // acc[state] = {...weatherInfo[index], "temp_color": Cesium.Color.lerp(Cesium.Color.BLUE, Cesium.Color.RED, (weatherInfo[index].temperature - minTemp) / (maxTemp - minTemp))};

          const _tempColor = (+weatherInfo[index].temperature - minTemp)/ Math.max(1,(maxTemp-minTemp));

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
        }, {});

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
        // let tempValue = weatherData["Alaska"].temperature ?? 1;
        // console.log(tempValue)
        // let color = getColor(tempValue);
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
                // material={eachJson.temp_color}
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
