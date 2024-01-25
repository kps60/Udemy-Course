
// https://developers.google.com/maps/documentation/geocoding/overview 
// follow this page for more details about the convertion of address into coordinates
// do not use the throw in the node in the axios block || precisely refer the videoNo:104; 
function getCoordsForAddress(address) {
    return {
        lat: 40.7485045,
        lng: -73.985673
    }
}

export default getCoordsForAddress;