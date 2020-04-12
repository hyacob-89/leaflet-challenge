var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";


d3.json(queryUrl, function(data) {

    // console.log(data.features);

    var featuresData = data.features;

// Create a map object
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5
    });
    
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets-basic",
        accessToken: API_KEY
    }).addTo(myMap);
       

    var earthquakes = [];
    
    featuresData.forEach(function(entry) {
        var placeObj = {};
            placeObj['place'] = entry.properties.place;
            placeObj['magnitude'] = entry.properties.mag;
            placeObj['location'] = entry.geometry.coordinates.reverse().splice(1);
            earthquakes.push(placeObj);

    });
    console.log(earthquakes);

    function createFeatures(earthquakeData) {
        function onEachFeature(feature, layer) {
            layer.bindPopup("<h2>" + earthquakes[i].place + "</h2> <hr> <h3>Magnitude: " + earthquakes[i].magnitude + "</h3>");
        }

        var earthquakes = L.geoJSON(earthquakeData, {
            onEachFeature: onEachFeature
        });

        createMap(earthquakes);
    }

    function markerSize(magnitude) {
        return magnitude * 20000;
    }

    function circleColor(magnitude) {
        if (magnitude < 1.0) {
          return "#ccff33"
        }
        else if (magnitude < 2.0) {
          return "#ffff33"
        }
        else if (magnitude < 3.0) {
          return "#ffcc33"
        }
        else if (magnitude < 4.0) {
          return "#ff6633"
        }
        else if (magnitude < 5.0) {
          return "#ff6633"
        }
        else {
          return "#ff3333"
        }
    }

    function createMap(earthquakes) {
        var myMap = L.map("map", {
            center: [37.09, -95.71],
            zoom: 5
        });

        L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.streets-basic",
            accessToken: API_KEY
        }).addTo(myMap);

        var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 10,
            id: "mapbox.dark",
            accessToken: API_KEY
          });

        var baseMaps = {
            "Street Map": streetmap,
            "Dark Map": darkmap
        };

        var overlayMaps = {
            Earthquakes: earthquakes
          };
        
    }


    for (var i = 0; i < earthquakes.length; i++) {
        L.circle(earthquakes[i].location, {
        fillOpacity: 0.50,
        color: circleColor(earthquakes[i].magnitude),
        weight: 1,
        stroke: true,
        radius: markerSize(earthquakes[i].magnitude)
        }).bindPopup("<h2>" + earthquakes[i].place + "</h2> <hr> <h3>Magnitude: " + earthquakes[i].magnitude + "</h3>").addTo(myMap);
    }

});