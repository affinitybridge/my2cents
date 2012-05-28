if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(geolocationSuccess, console.log);
} else {
  console.log('html geolocation not supported');
}

function geolocationSuccess(position) {
  $.ajax({
    url: '/representatives/' + position.coords.latitude + '/' + position.coords.longitude,
    type : "GET",
    success: function(data) {
      $("#representatives").html(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $("#representatives").text('Error: ' + textStatus + " " + errorThrown);
    }
  });
}
