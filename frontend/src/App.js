/*global H*/
import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Header from "./Header";
import ActiveAlerts from "./ActiveAlerts";
import Analytics from "./Analytics";

function App() {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [currentTowerId, setCurrentTowerId] = useState("");

  useEffect(() => {
    const mapContainer = document.getElementById("mapContainer");
    if (!mapContainer) return;

    mapContainer.innerHTML = "";
    const defaultLayers = window.platform.createDefaultLayers();
    const map_ = new H.Map(mapContainer, defaultLayers.vector.normal.map, {
      center: { lat: 50, lng: 5 },
      zoom: 4,
      pixelRatio: window.devicePixelRatio || 1,
    });
    window.map = map_;
    window.addEventListener("resize", () => map_.getViewPort().resize());

    window.behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map_));
    window.ui = H.ui.UI.createDefault(map_, defaultLayers);

    fetchLatestData();
    // Fetch new data every 5 seconds
    const intervalId = setInterval(fetchLatestData, 105000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  function addMarkersToMap(map, coordinates, group, html) {
    const marker = new H.map.Marker({
      lat: coordinates.lat,
      lng: coordinates.long,
    });
    map.addObject(marker);
    marker.setData(html);

    group.addObject(marker);
  }

  const fetchLatestData = () => {
    const group = new H.map.Group();

    window.map.addObject(group);

    group.addEventListener(
      "tap",
      function (evt) {
        // event target is the marker itself, group is a parent event target
        // for all objects that it contains
        var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
          // read custom data
          content: evt.target.getData(),
        });
        // show info bubble
        const data = evt.target.getData();

        setCurrentTowerId(data);
        // window.ui.addBubble(bubble);
      },
      false
    );

    axios
      .get("/api/data")
      .then((res) => {
        const data = res.data;
        if (data && data.length) {
          setActiveAlerts([...data]);
          data.forEach((item) => {
            const html = `${item.towerId}`;
            addMarkersToMap(window.map, item.towerLocation, group, html);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="App">
      <Header />
      <section className="top-main-container">
        <div className="left">
          <ActiveAlerts data={activeAlerts} />
        </div>
        <div id="mapContainer" className="right"></div>
      </section>
      <section>
        {currentTowerId && <Analytics tower={currentTowerId} />}
      </section>
    </div>
  );
}

export default App;
