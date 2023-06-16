import React, { useState, useEffect } from 'react';
import { Viewer, Entity, PolygonGraphics } from 'resium';
import { jsonData } from './us-states';
import * as Cesium from 'cesium';

const MyMap = () => {
  // const [jsonData, setJsonData] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('/home/nishesh/Documents/Personal/Projects/weather-app/weather-app/us-states.json');
  //       console.log("The data")
  //       console.log(response.json());
  //       const data = await response.json();
  //       setJsonData(data.features);
  //     } catch (error) {
  //       console.error('Error fetching JSON:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // if (!jsonData) {
  //   return <div>Loading...</div>;
  // }

  // console.log(typeof jsonData[0].geometry.coordinates[0].flat().map(obj => parseFloat(obj))[0]);
  // console.log(Array.isArray(jsonData));
  // console.log(jsonData[0].geometry.type === "Polygon");
  // jsonData.forEach((eachJson) => {
  //   if(eachJson.geometry.type === "Polygon") {
  //     console.log("Aaku")
  //   }
  // })
  
  return (
    <Viewer>
      {jsonData.map((eachJson, index) => {
        if (eachJson.geometry.type === "Polygon") {
          return (
            <Entity key={index}>
              <PolygonGraphics
                hierarchy={Cesium.Cartesian3.fromDegreesArray(eachJson.geometry.coordinates[0].flat())}
                material={Cesium.Color.GREEN.withAlpha(0.5)}
              />
            </Entity>
          );
        } else {
          return eachJson.geometry.coordinates[0].map((coordinate, id) => (
            <Entity key={`${index}-${id}`}>
              <PolygonGraphics
                hierarchy={Cesium.Cartesian3.fromDegreesArray(coordinate.flat())}
                material={Cesium.Color.GREEN.withAlpha(0.5)}
              />
            </Entity>
      ))}
      })}
    </Viewer>
    // <Viewer>
    //   {
    //       <Entity>
    //         <PolygonGraphics
    //           hierarchy={Cesium.Cartesian3.fromDegreesArray(jsonData[0].geometry.coordinates[0].flat())}
    //           material={Cesium.Color.RED.withAlpha(0.5)}
    //         />
    //       </Entity>
    //   }
    // </Viewer>
  );
};

export default MyMap;
