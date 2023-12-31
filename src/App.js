import React, { useState, useEffect } from "react";
import axios from "axios";
import classNames from "classnames";
import 'bootstrap/dist/css/bootstrap.min.css';
import './customStyles.css'

const API_URL = "http://localhost:8080/api/v1/help";

export default function App() {
  const [data, setData] = useState(null);
  const [openCategories, setOpenCategories] = useState([]);

  useEffect(() => {
    axios.get(API_URL).then((response) => {
      setData(response.data);
    });
  }, []);

  const toggleDropdown = (category) => {
    setOpenCategories((prevOpenCategories) => {
      if (prevOpenCategories.includes(category)) {
        return prevOpenCategories.filter((cat) => cat !== category);
      } else {
        return [...prevOpenCategories, category];
      }
    });
  };  

  const renderEndpoints = (endpoints) => {
    if (!endpoints || Object.keys(endpoints).length === 0) {
      return null;
    }

    return Object.keys(endpoints).map((endpointName) => {
      const endpoint = endpoints[endpointName];
  
      if (!endpoint) {
        return null;
      }
  
      return (
        <div key={endpointName}>
          <h3>{endpointName}</h3>
          <p>Help Path: {endpoint.helpPath}</p>
          <p>Brief: {endpoint.brief}</p>
        </div>
      );
    });
  };

  const renderDescriptions = (descriptions) => {
    if (!descriptions || descriptions.length === 0) {
      return null;
    }

    return descriptions.map((desc, index) => (
      <p key={index}>Description: {desc}</p>
    ));
  };

  const renderCategory = (category, categoryData, index) => {
    const isOpen = openCategories.includes(category);
  
    return (
      <div key={category} className={`category-container ${isOpen ? "open" : ""}`}>
        <div
          onClick={() => toggleDropdown(category)}
          className="dropdown-toggle"
          style={{ cursor: "pointer" }}
        >
          <h2 className="mb-3 left-indent-two-">{category}</h2>
        </div>
        <div className={classNames("dropdown-menu", "ml-4", "left-indent-three", { show: isOpen })}>
          {categoryData.description && (
            <div>{renderDescriptions(categoryData.description)}</div>
          )}
          {categoryData.endpoints && (
            <div>{renderEndpoints(categoryData.endpoints)}</div>
          )}
        </div>
        {categoryData.categories &&
          Object.entries(categoryData.categories).map(([subCategory, subCategoryData], index) => (
            <div key={subCategory} className="ml-4 left-indent-five">
              {renderCategory(subCategory, subCategoryData, index)}
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
            renderCategory(category, categoryData, category)
          )}
        </div>
      )}
    </div>
  );
}
