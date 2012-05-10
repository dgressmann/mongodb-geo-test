var infoWindow = new google.maps.InfoWindow();

function setMarker(lat, lng, map, title, showCircle) {
   var pos = new google.maps.LatLng(lat, lng);
   var options = {position:pos,map:map,title:title, content:title};
   var marker = new google.maps.Marker(options);

   google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setOptions(options);
      infoWindow.open(map, marker);
   });

   if (showCircle) {
      var circle = new google.maps.Circle({
         map:map, radius: 50, fillColor: '#AA0000',
         strokeWeight: 0.5, clickable: false });
      circle.bindTo('center', marker, 'position');
   }
}

function nearestInfo(lat,lon){
   $.post("/nearest",{lat: lat, lon: lon}, function(data) { $("#info").empty().append(data); });
}

function initialize() {
   var pos = new google.maps.LatLng(48.854355,2.298800);
   var myOptions = {
      center: pos, zoom: 15, 
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false, draggable: true };
   var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
   google.maps.event.addListener(map, 'click', function() { infoWindow.close(); });  	

   setMarker(48.857320,2.285930, map, 'Passy metro station', false);
   setMarker(48.853645,2.289355, map, 'Bir-Hakeim metro station', false);
   setMarker(48.857770,2.310560, map, 'La Tour-Maubourg metro station', false);
   setMarker(48.854690,2.306315, map, 'Ecole Militaire metro station', false);
   setMarker(48.857910,2.29510, map, 'Eiffel tower', true);
   setMarker(48.848900,2.297945, map, 'La Motte-Picquet - Grenelle', false);
   var me = new google.maps.Marker({position:pos,map:map,icon:'http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png',title:'My current location', draggable: true});
   google.maps.event.addListener(me, 'dragend', function() { 
      console.log("Loc: %s", me.getPosition().toString());
      nearestInfo(me.getPosition.lat(),me.getPosition().lon());
   });
   nearestInfo();
}

