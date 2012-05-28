var map;
var panorama;
var infoWindow = new google.maps.InfoWindow();

function setMarker(markerOptions) {

   var content = markerOptions.content || markerOptions.title;
   var icon = markerOptions.icon || '/images/underground.png';

   var options = {
      position: new google.maps.LatLng(markerOptions.lat, markerOptions.lng),
      map: map, title: markerOptions.title, icon: icon, shadow: '/images/shadow.png', 
      zIndex: 1, content: content, draggable: false};
   var marker = new google.maps.Marker(options);

   google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setOptions(options);
      infoWindow.open(map, marker);
   });

   if (markerOptions.radius) {
      var circle = new google.maps.Circle({
         map: map, radius: markerOptions.radius, fillColor: '#AA0000',
         strokeWeight: 0.5, clickable: false });
      circle.bindTo('center', marker, 'position');
   }
}

function nearestInfo(pos){
   var req = new XMLHttpRequest();
   req.open('GET','/nearest?lat='+pos.lat()+'&lon='+pos.lng(),true);
   req.onreadystatechange = function () { 
      if (req.readyState == 4 ) {
         if (req.status == 200 ) {
            document.getElementById("info").innerHTML=req.responseText;
         }
         else {
            alert('Error making request');
         }
      }
   };
   req.send(null);
}

function initialize() {
   var pos = new google.maps.LatLng(48.854355,2.298800);
   var mapOptions = {
      center: pos, zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false, draggable: true };
   var panoramaOptions = {
      position: new google.maps.LatLng(48.855299,2.289587),
      pov: { heading: 50, pitch:10, zoom: 1 }
   };
   map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
   panorama = new google.maps.StreetViewPanorama(document.getElementById("streetview"),panoramaOptions);
   google.maps.event.addListener(map, 'click', function() { infoWindow.close(); });

   setMarker({lat: 48.857320, lng: 2.285930, title: 'Passy metro station'});
   setMarker({lat: 48.853645, lng: 2.289355, title: 'Bir-Hakeim metro station'});
   setMarker({lat: 48.857770, lng: 2.310560, title: 'La Tour-Maubourg metro station'});
   setMarker({lat: 48.854690, lng: 2.306315, title: 'Ecole Militaire metro station'});
   setMarker({lat: 48.857910, lng: 2.29510,  title: 'Eiffel tower', radius: 50, icon: '/images/eiffel.png'});
   setMarker({lat: 48.848900, lng: 2.297945, title: 'La Motte-Picquet - Grenelle'});

   google.maps.event.addListener(panorama, 'position_changed', function() {
      nearestInfo(panorama.getPosition());
   });
   map.setStreetView(panorama);
   nearestInfo(panorama.getPosition());
}

