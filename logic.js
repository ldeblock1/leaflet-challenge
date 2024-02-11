
const earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

function createMap(earthquakeData) {
  try {
    const myMap = L.map("map", {
      center: [0, 0],
      zoom: 2,
    });
  
    //title
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(myMap);
  
    // for loop: loop through earthquake data and add markers to the map by coordinates, magnitude, and depth
    for (let i = 0; i < earthquakeData.features.length; i++) {
      const earthquake = earthquakeData.features[i];
      const coordinates = earthquake.geometry.coordinates;
      const magnitude = earthquake.properties.mag;
      const depth = coordinates[2];
  
      // marker size and color based on magnitude and depth
      const markerOptions = {
        radius: magnitude * 3,
        fillColor: getColor(depth),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      };
  
      // create marker and popup
      L.circleMarker([coordinates[1], coordinates[0]], markerOptions)
        .bindPopup(
          `<h3>${earthquake.properties.place}</h3><hr>
           <p>Magnitude: ${magnitude}</p>
           <p>Depth: ${depth} km</p>`
        )
        .addTo(myMap);
    }
  
    // add legend
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function (map) {
      const div = L.DomUtil.create("div", "info legend");
      const depthLevels = [0, 10, 30, 50, 70, 90];
      div.innerHTML += "<b>Depth (km)</b><br>";
      for (let i = 0; i < depthLevels.length; i++) {
        div.innerHTML +=
          `<i style="background:${getColor(depthLevels[i] + 1)}"></i>
           ${depthLevels[i]}${depthLevels[i + 1] ? "&ndash;" + depthLevels[i + 1] + "<br>" : "+"}`;
      }
      return div;
    };
    legend.addTo(myMap);
  } catch (error) {
    console.error("An error occurred:", error);
    
    document.getElementById("map").innerHTML = "An error occurred while loading the map.";
  }
}

// get color based on depth
function getColor(depth) {
  return depth > 90
    ? "#FF0000"
    : depth > 70
    ? "#FF4500"
    : depth > 50
    ? "#FFA500"
    : depth > 30
    ? "#FFFF00"
    : depth > 10
    ? "#ADFF2F"
    : "#32CD32";
}

// get earthquake data 
d3.json(earthquakeURL).then(createMap).catch(error => {
  console.error("Error fetching earthquake data:", error);
  // display an error message to the user
  document.getElementById("map").innerHTML = "An error occurred while fetching earthquake data.";
});
