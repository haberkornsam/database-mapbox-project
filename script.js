mapboxgl.accessToken = 'pk.eyJ1IjoiYmVuamFtaW5sYXplcm9mZiIsImEiOiJja3VpcHN4dWwycWZqMnBxNnJtYmJpbnd3In0.H_pK2d841LgStK98lxBccA';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/benjaminlazeroff/ckv48a47o5fu414qopo2o38se',
    center: [-77.04, 38.907],
    zoom: 11.15
});

map.on('load', () => {
    map.addSource('tileset_data', {
        'url': 'mapbox://benjaminlazeroff.7hcyjhf2',
        'type': "vector"
    });
    // Add a layer showing the places.
    map.addLayer({
        'id': 'plane-crashes',
        'type': 'circle',
        'source': 'tileset_data',
        'source-layer': 'plane_data_full-8vfstn',
        'paint': {
            'circle-color': '#4264fb',
            'circle-radius': 6,
            'circle-stroke-width': 0,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0
        }
    });

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'plane-crashes', (e) => {
        // Change the cursor style as a UI indicator.
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
    });

    map.on('mouseleave', 'places', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

});