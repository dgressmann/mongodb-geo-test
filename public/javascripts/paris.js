var map;
var infoWindow = new google.maps.InfoWindow();

function setMarker(markerOptions) {
   var pos = new google.maps.LatLng(markerOptions.lat, markerOptions.lng);
   var content;
   if (markerOptions.content) {
      content = markerOptions.content;
   }
   else {
      content = markerOptions.title;
   }
   var icon;
   if (markerOptions.icon) {
      icon = markerOptions.icon;
   }
   else {
      icon = '/images/underground.png';
   }

   var options = {position:pos, map: map, title: markerOptions.title, 
                  icon: icon, shadow: '/images/shadow.png',
                  content: content, draggable: false};
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

function nearestInfo(lat,lon){
   $.get("/nearest",{lat: lat, lon: lon}, function(data) { $("#info").empty().append(data); });
}

function initialize() {
   var pos = new google.maps.LatLng(48.854355,2.298800);
   var myOptions = {
      center: pos, zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false, draggable: true };
   map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
   google.maps.event.addListener(map, 'click', function() { infoWindow.close(); });

   setMarker({lat: 48.857320, lng: 2.285930, title: 'Passy metro station'});
   setMarker({lat: 48.853645, lng: 2.289355, title: 'Bir-Hakeim metro station'});
   setMarker({lat: 48.857770, lng: 2.310560, title: 'La Tour-Maubourg metro station'});
   setMarker({lat: 48.854690, lng: 2.306315, title: 'Ecole Militaire metro station'});
   setMarker({lat: 48.857910, lng: 2.29510,  title: 'Eiffel tower', radius: 50, icon: '/images/eiffel.png'});
   setMarker({lat: 48.848900, lng: 2.297945, title: 'La Motte-Picquet - Grenelle'});

   var me = new google.maps.Marker({position: pos, map: map,
      icon: '/images/smiley.png', shadow: '/images/shadow.png',
       title: 'My current location', draggable: true});

   new google.maps.Marker(myOptions);
   google.maps.event.addListener(me, 'dragend', function() {
      console.log("Loc: %s", me.getPosition().toString());
      nearestInfo(me.getPosition().lat(),me.getPosition().lng());
   });
   nearestInfo();
}

