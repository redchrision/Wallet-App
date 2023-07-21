import React, { useState, useEffect } from "react";
import axios from "axios";

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

  const renderCategory = (category, categoryData, indentLevel = 1) => {
    const indentation = `${(indentLevel - 1) * 20}px`; // Adjust indentation as needed
    return (
      <div key={category} style={{ marginLeft: indentation }}>
        <h2>{category}</h2>
        {categoryData.description && renderDescriptions(categoryData.description)}
        {categoryData.endpoints && renderEndpoints(categoryData.endpoints)}
        {categoryData.categories &&
          Object.entries(categoryData.categories).map(([subCategory, subCategoryData]) =>
            renderCategory(subCategory, subCategoryData, indentLevel + 1)
          )}
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
