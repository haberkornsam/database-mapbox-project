mapboxgl.accessToken = 'pk.eyJ1IjoiYmVuamFtaW5sYXplcm9mZiIsImEiOiJja3VpcHN4dWwycWZqMnBxNnJtYmJpbnd3In0.H_pK2d841LgStK98lxBccA';
const default_filter = ["has", "Event Year"]
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/benjaminlazeroff/ckv48a47o5fu414qopo2o38se',

    center: [-104.798, 38.892],
    zoom: 8
});

var red_filter = true;
var yellow_filter = true;
var green_filter = true;
var blue_filter = true;

var low_filter = ['>=', ['number', ['get', 'Event Year']], 1950];
var high_filter = ['<=', ['number', ['get', 'Event Year']], 2000];

map.on('load', () => {

    map.addSource('tileset_data', {
        'url': 'mapbox://benjaminlazeroff.6qsjs25m',
        'type': "vector"
    });
    // Add a layer showing the crash points.
    map.addLayer({
        'id': 'plane-crashes',
        'type': 'circle',
        'source': 'tileset_data',
        'source-layer': 'plane_data_v2-7au7tr',
        "filter": ["all", default_filter, low_filter, high_filter],
          "paint": {
            "circle-color": [
              "match",
              [
                "get",
                "Aircraft Damage"
              ],
              "Minor",
              "hsl(128, 99%, 52%)",
              "Substantial",
              "hsl(59, 100%, 51%)",
              "Destroyed",
              "hsl(0, 100%, 47%)",
              "hsl(180, 100%, 50%)"
            ],
            "circle-radius": [
              "interpolate",
              [
                "linear"
              ],
              [
                "zoom"
              ],
              0,
              [
                "*",
                [
                  "interpolate",
                  [
                    "exponential",
                    1
                  ],
                  [
                    "get",
                    "Total Fatal Injuries"
                  ],
                  0,
                  3,
                  174.5,
                  12,
                  349,
                  21
                ],
                1
              ],
              5,
              [
                "*",
                [
                  "interpolate",
                  [
                    "exponential",
                    1
                  ],
                  [
                    "get",
                    "Total Fatal Injuries"
                  ],
                  0,
                  3,
                  174.5,
                  12,
                  349,
                  21
                ],
                1.1
              ],
              10,
              [
                "*",
                [
                  "interpolate",
                  [
                    "exponential",
                    1
                  ],
                  [
                    "get",
                    "Total Fatal Injuries"
                  ],
                  0,
                  3,
                  174.5,
                  12,
                  349,
                  21
                ],
                1.4
              ],
              22,
              [
                "*",
                [
                  "interpolate",
                  [
                    "exponential",
                    1
                  ],
                  [
                    "get",
                    "Total Fatal Injuries"
                  ],
                  0,
                  3,
                  174.5,
                  12,
                  349,
                  21
                ],
                2
              ]
            ],
            "circle-stroke-color": [
              "match",
              [
                "get",
                "Aircraft Damage"
              ],
              "Minor",
              "hsl(128, 99%, 68%)",
              "Substantial",
              "hsl(59, 100%, 66%)",
              "Destroyed",
              "hsl(0, 100%, 61%)",
              "hsl(180, 100%, 50%)"
            ],
            "circle-stroke-width": [
              "interpolate",
              [
                "linear"
              ],
              [
                "zoom"
              ],
              4,
              0.1,
              8,
              0.8,
              12,
              2
            ]
          },
    });

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true

        // TODO: scrollable stuff probably goes here
    });

    map.on('click', 'plane-crashes', (e) => {
        // Change the cursor style as a UI indicator.
        if ( map.getZoom() > 6 ){


        map.getCanvas().style.cursor = 'pointer';

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();

        let description = "<div class=infoPopup>";

        for (const property in e.features[0].properties) {
            description += "<p><b>" + property + "</b>: " + e.features[0].properties[property] + "</p>";
        }

        description += "</div>"

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(description).addTo(map);
        }
    });

    //not sure if we want this here. Not really user friendly?
    //maybe have if the point is clicked the box stays up until "x" is clicked
    map.on('mouseleave', 'plane-crashes', () => {
        map.getCanvas().style.cursor = '';
   });
   map.on('mouseenter', 'plane-crashes', () => {
       if (map.getZoom() > 6)
            map.getCanvas().style.cursor = 'pointer';
});

});

function getVals() {
    // Get slider values
    var parent = this.parentNode;
    var slides = parent.getElementsByTagName("input");
    var low_slider = document.getElementById("lowerbound");
    var high_slider = document.getElementById("upperbound");
    var slide1 = parseFloat(low_slider.value);
    var slide2 = parseFloat(high_slider.value);
    // Neither slider will clip the other, so make sure we determine which is larger
    if (slide1 > slide2) { var tmp = slide2; slide2 = slide1; slide1 = tmp; }

    var lowinput = document.getElementById("lowerinput");
    var highinput = document.getElementById("upperinput");
    var low_popup = document.getElementById("popupLowerBound");
    var high_popup = document.getElementById("popupUpperBound");
    var low_popup_label = document.getElementById("popupLabelLower");
    var high_popup_label = document.getElementById("popupLabelUpper")


    lowinput.value = slide1;
    highinput.value = slide2;
    low_popup_label.innerHTML = slide1;
    high_popup_label.innerHTML = slide2;


    var deltaDiv = document.getElementById("delta");
    var start = ((slide1 - 1920) / (2017 - 1920)) * 100;
    var delta = ((slide2 - slide1) / (2017 - 1920)) * 100;

    deltaDiv.style.left = start + "%";
    deltaDiv.style.width = delta + "%";

    low_popup.style.left = (start-1.5) + "%";
    high_popup.style.left = (start+delta-2) + "%";

   low_filter = ['>=', ['number', ['get', 'Event Year']], slide1];
   high_filter = ['<=', ['number', ['get', 'Event Year']], slide2];

   setFilters();

}

function setSliders() {
    var lowerBound = document.getElementById("lowerbound");
    var upperBound = document.getElementById("upperbound");

    var lowerInput = document.getElementById("lowerinput");
    var upperInput = document.getElementById("upperinput");

    var lowerNum = parseFloat(lowerInput.value);
    var upperNum = parseFloat(upperInput.value);

    if (lowerNum >= 1920 && upperNum <= 2017 && upperNum >= 1920) {
        lowerBound.value = lowerNum;
        upperBound.value = upperNum;

        lowerBound.oninput()
    }
}

function lowerBoundClicked() {
    document.getElementById("popupLowerBound").style.visibility = 'visible'
}

function upperBoundClicked() {
    document.getElementById("popupUpperBound").style.visibility = 'visible'
}

function lowerBoundReleased() {
    document.getElementById("popupLowerBound").style.visibility = 'hidden'
}

function upperBoundReleased() {
    document.getElementById("popupUpperBound").style.visibility = 'hidden'
}

function redCheckboxClicked() {
    var checkbox = document.getElementById("redCheckbox");

    red_filter = checkbox.checked;

    setFilters();
  }

  function yellowCheckboxClicked() {
    var checkbox = document.getElementById("yellowCheckbox");

    yellow_filter = checkbox.checked;

    setFilters();
  }
  function greenCheckboxClicked() {
    var checkbox = document.getElementById("greenCheckbox");
  
    green_filter = checkbox.checked;
    setFilters();
  }

function blueCheckboxClicked() {
    var checkbox = document.getElementById("blueCheckbox");
  
    blue_filter = checkbox.checked;

    setFilters();
  }
    
function setFilters() {
  var damages = ['placeholder'];
  if (red_filter) {
    damages.push("Destroyed")
  }
  if (yellow_filter) {
    damages.push("Substantial")
  }
  if (green_filter) {
    damages.push("Minor")
  }

  var color_filter = ['match', ['get', 'Aircraft Damage'], damages, true, false];

  var blue = ['!', ['has', 'Aircraft Damage']];

  if (blue_filter) {

  var combined_fitler = ['any', color_filter, blue];
  } else {
    var combined_fitler = color_filter;
  }


  map.setFilter('plane-crashes', ['all', combined_fitler, default_filter, low_filter, high_filter]);
}


window.onload = function () {
    // Initialize Sliders

    var lowerBound = document.getElementById("lowerbound");
    var upperBound = document.getElementById("upperbound");

    var lowerInput = document.getElementById("lowerinput");
    var upperInput = document.getElementById("upperinput");

    var redCheckbox = document.getElementById("redCheckbox");
    var yellowCheckbox = document.getElementById("yellowCheckbox");
    var greenCheckbox = document.getElementById("greenCheckbox");
    var blueCheckbox = document.getElementById("blueCheckbox");

    redCheckbox.onclick = redCheckboxClicked;
    yellowCheckbox.onclick = yellowCheckboxClicked;
    greenCheckbox.onclick = greenCheckboxClicked;
    blueCheckbox.onclick = blueCheckboxClicked;

    lowerBound.oninput = getVals;
    upperBound.oninput = getVals;

    lowerBound.onmousedown = lowerBoundClicked;
    upperBound.onmousedown = upperBoundClicked;

    lowerBound.onmouseup = lowerBoundReleased;
    upperBound.onmouseup = upperBoundReleased;

    lowerInput.oninput = setSliders;
    upperInput.oninput = setSliders;
    lowerBound.oninput();
};