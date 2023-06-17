# Temperature and cloud coverage heatmap visualization of the US states

This project was created in React using [Cesium](https://www.cesium.com/) and [Resium](https://resium.reearth.io/).

![Demo](./public/demo.gif)

## To run the project

1. Install nodeJS
2. To create-react-app, use [craco-cesium](https://github.com/reearth/craco-cesium)

4. After following the installation method of craco-cesium, run

        npm install

5. After completion of the installation, run 

        npm start

## Data
1. Data for the polygon coordinates of different US states is taken from [kaggle](https://www.kaggle.com/datasets/pompelmo/usa-states-geojson).
2. Data for the temperature and cloud coverage of different US states is taken from [OpenWeather](https://openweathermap.org/api).

## Note
1. The API key used in this project is the free one. As the free API provides only [60 calls/minute](https://openweathermap.org/price), the temperature and cloud coverage data is also downloaded to ./src/responses.js.
2. The polygon coordinates of different US states are also downloaded to *./src/us-states.js*.
3. The current code takes the data from *./src/responses.js* and *./src/us-states.js* because of the free API call limitation. **To run the code with real time data from the API, uncomment line 18 and lines 27-33. Then, comment the lines 21-23 and lines 36-39**.
4. During visualization, if you click on the particular state of the US, then the corresponding temperature and cloud coverage values of that state will pop up.