//mapboxgl.accessToken = 'pk.eyJ1IjoiYmVuamFtaW5sYXplcm9mZiIsImEiOiJja3VpcHN4dWwycWZqMnBxNnJtYmJpbnd3In0.H_pK2d841LgStK98lxBccA';
mapboxgl.accessToken = 'pk.eyJ1IjoiaGFiZXJrb3Juc2FtIiwiYSI6ImNrdXlpZmJ2dTczMTIyb2s2ZWV0anZzYm0ifQ.eFssB90u2FOHXf2H3NTLTg'
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/haberkornsam/ckvxfajdp5o8814s8zkgzd8eu',
    //style: 'mapbox://styles/benjaminlazeroff/ckv48a47o5fu414qopo2o38se',
    //TODO: Figure out starting points
    //center: [-77.04, 38.907],
    center: [-104.798, 38.892],
    zoom: 8
});

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
        "filter": [
            "has",
            "Aircraft Damage"
          ],
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
              "hsla(0, 0%, 0%, 0)"
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
              "hsla(0, 0%, 0%, 0)"
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

        let description = "";

        for (const property in e.features[0].properties) {
            description += "<p>" + property + ": " + e.features[0].properties[property] + "</p>";
        }

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
    var slide1 = parseFloat(slides[0].value);
    var slide2 = parseFloat(slides[1].value);
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

   var low_filter = ['>=', ['number', ['get', 'Event Year']], slide1];
   var high_filter = ['<=', ['number', ['get', 'Event Year']], slide2];

   var date_filter = ["all", low_filter, high_filter]
   map.setFilter('plane-crashes', date_filter);

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



window.onload = function () {
    // Initialize Sliders

    var lowerBound = document.getElementById("lowerbound");
    var upperBound = document.getElementById("upperbound");

    var lowerInput = document.getElementById("lowerinput");
    var upperInput = document.getElementById("upperinput");

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