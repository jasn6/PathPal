import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPlanInfo } from "../../util/api.js";
import Map from "../../components/Map/Map";
import ExploreList from "../../components/ExploreList/ExploreList";
import Header from "../../components/Header/Header.jsx";
import "./ExplorePage.css";

export default function ExplorePage() {
  const [coords, setCoords] = useState(null);
  const [type, setType] = useState("restaurants");
  const [lists, setLists] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const { planCode } = useParams();

  const getList = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/list/all/${planCode}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      setLists(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getLocations = async () => {
    setLoadingLocations(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/location/nearbyLocations/${coords.lat}/${coords.lng}/${type}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);
      setLocations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLocations(false);
    }
  };

  useEffect(() => {
    getPlanInfo(planCode).then((data) =>
      setCoords({ lat: data.lat, lng: data.lng })
    );
    getList();
  }, [planCode]);

  useEffect(() => {
    if (coords) {
      getLocations();
    }
  }, [coords, type]);

  if (!coords) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="ExplorePage-container">
        <div className="ExplorePage-list">
          <ExploreList
            plan={planCode}
            type={type}
            setType={setType}
            locations={locations}
            lists={lists}
            loading={loadingLocations}
          />
        </div>
        <div className="ExplorePage-map">
          {loadingLocations ? (
            <div>Loading map locations...</div>
          ) : (
            <Map coords={coords} locations={locations} />
          )}
        </div>
      </div>
    </>
  );
}
