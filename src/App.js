import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';C

const API_URL = "http://localhost:8080/api/v1/help";

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(API_URL).then((response) => {
      setData(response.data);
    });
  }, []);

  const renderEndpoints = (endpoints) => {
    return Object.keys(endpoints).map((endpointName) => (
      <div key={endpointName}>
        <h3>{endpointName}</h3>
        <p>Help Path: {endpoints[endpointName].helpPath}</p>
        <p>Brief: {endpoints[endpointName].brief}</p>
      </div>
    ));
  };

  const renderDescriptions = (descriptions) => {
    return descriptions.map((desc, index) => (
      <p key={index}>Description: {desc}</p>
    ));
  };

    const renderCategory = (category, categoryData) => {
      return (
        <div key={category} className="my-3">   
          <h2 className="mb-3">{category}</h2>
          {categoryData.description && (
            <div className="ml-4">
              {renderDescriptions(categoryData.description)}
            </div>
          )}
          {categoryData.endpoints && (
            <div className="ml-4">
              {renderEndpoints(categoryData.endpoints)}
            </div>
          )}
          {categoryData.categories &&
            Object.entries(categoryData.categories).map(([subCategory, subCategoryData]) => (
              <div key={subCategory} className="ml-4">
                {renderCategory(subCategory, subCategoryData)}
              </div>
            ))}
        </div>
      );
    };
  

  if (!data) return null;

  return (
    <div>
      {data.description && <h1>Description: {data.description[0]}</h1>}
      {data.endpoints && (
        <div>
          <h1>Endpoints:</h1>
          {renderEndpoints(data.endpoints)}
        </div>
      )}
      {data.categories && (
        <div>
          <h1>Categories:</h1>
          {Object.entries(data.categories).map(([category, categoryData]) =>
            renderCategory(category, categoryData)
          )}
        </div>
      )}
    </div>
  );
}
