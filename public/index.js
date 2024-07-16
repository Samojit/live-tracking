const socket  = io();

if(navigator.geolocation) {
    navigator.geolocation.watchPosition((position)=>{
        const {longitude,latitude} = position.coords
        console.log(longitude,latitude);
        socket.emit('send-location',{longitude,latitude}); 
    },(error)=>{
        console.log(error);
    },
    {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
    }
);
}

let map = L.map('map').setView([51.505, -0.09], 16);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const markers = {}

socket.on('recived-location', function(data){
    let counter = 0
    const {id , longitude , latitude} = data
    map.setView([latitude , longitude])

    if(markers[id]){
        markers[id].setLatLng([latitude + counter,longitude + counter])
    }else{
        markers[id] = L.marker([latitude + counter, longitude + counter]).addTo(map).bindPopup(`User : ${id} Loaction`);
    }
    counter++
})

socket.on('user-disconnected', function(id){
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id]
    }
})