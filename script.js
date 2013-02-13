function usePosition(pos) {
    alert("lat:"+pos.coords.latitude+' lng:'+pos.coords.longitude);
}

function initGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(usePosition);
    } else {
        alert("HTML5 Geolocation API is not supported by your browser");
    }
}