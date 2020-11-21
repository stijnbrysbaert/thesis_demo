"use strict";

// Initialize the map
const initMap = function () {
  // Get map element
  const mapElement = document.getElementById("map");
  
  // Create map
  const map = L.map(mapElement).setView([50.846684, 4.352585], 8);

  // Load a tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: "pk.eyJ1Ijoic2JyeXNiYWUiLCJhIjoiY2tocWVqMWdlMDhsNzJzdDB1eXlxb2FsMiJ9.7y2XQ3jh4gmSBhq5BkaWuw",
    }
  ).addTo(map);
};

// Self invoking function to start main
(function() {
  window.addEventListener("DOMContentLoaded", initMap); // document.getElementById will return null if called before DOM loaded
})()