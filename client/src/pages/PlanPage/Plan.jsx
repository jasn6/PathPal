import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlanInfo } from "../../util/api";
import DisplayList from "../../components/DisplayList/DisplayList";
import Header from "../../components/Header/Header";
import PlanMap from "../../components/PlanMap/PlanMap";
import "./Plan.css"; // Changed import to Plan.css

export default function Plan() {
  const [planInfo, setPlanInfo] = useState(null);
  const [childClicked, setChildClicked] = useState(null);
  const [places, setPlaces] = useState([]);
  const [lists, setLists] = useState([]);
  const [title, setTitle] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { planCode } = useParams();
  const navigate = useNavigate();

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

  const getPlaces = async (listItem) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/list/${listItem._id}/places`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/list/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          planCode,
        }),
      });
      const data = await response.json();
      setLists((prev) => (Array.isArray(prev) ? [...prev, data] : [data]));
    } catch (error) {
      console.error(error);
    }
  };

  const calculateWidth = () => {
    const baseWidth = 301; // Minimum width in pixels
    const scalingFactor = 11; // Increase in width per character
    return Math.max(baseWidth, title.length * scalingFactor);
  };

  const handleEdit = async () => {
    try {
      await fetch(`http://localhost:3001/api/plan/${planCode}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
        }),
      });
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  useEffect(() => {
    if (lists.length) {
      const fetchPlaces = async () => {
        const promises = lists.map((list) => getPlaces(list));
        try {
          const placesResults = await Promise.all(promises);
          setPlaces(placesResults);
        } catch (error) {
          console.error("Failed to fetch places:", error);
        }
      };

      fetchPlaces();
    }
  }, [lists]);

  useEffect(() => {
    if (planInfo) setTitle(planInfo.title);
  }, [planInfo]);

  useEffect(() => {
    const fetchData = async () => {
      const planInfoData = await getPlanInfo(planCode);
      setPlanInfo(planInfoData);
      await getList();
    };

    fetchData();
  }, [planCode]);

  if (!planInfo || !lists) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="plan-container">
        <div className="plan-grid-container">
          <div className="plan-grid-item">
            <div className="plan-list-container">
              <button
                className="plan-explore-button"
                onClick={() => navigate(`/plan/${planCode}/explore`)}
              >
                Explore Places
              </button>
              <div className="plan-title-form-control">
                <input
                  className="plan-title-text-field"
                  style={{ width: calculateWidth() }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    handleEdit();
                    setIsFocused(false);
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                />
              </div>
              {lists &&
                lists.length > 0 &&
                lists.map((listItem, listIndex) => (
                  <DisplayList
                    listItem={listItem}
                    key={listItem._id}
                    listIndex={listIndex}
                    allPlaces={places}
                    setAllPlaces={setPlaces}
                    lists={lists}
                    setLists={setLists}
                    childClicked={childClicked}
                  />
                ))}

              <button className="plan-add-button" onClick={handleAdd}>
                Add a new list
              </button>
            </div>
          </div>
          <div className="plan-grid-item">
            <div className="plan-map-container">
              <PlanMap
                places={places}
                coords={{ lat: planInfo.lat, lng: planInfo.lng }}
                setChildClicked={setChildClicked}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}