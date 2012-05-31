if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
} else {
  callLog('Geolocation Error: HTML 5 Geolocation not supported.');
}

function geolocationSuccess(position) {
  $.ajax({
    url: '/representatives/' + position.coords.latitude + '/' + position.coords.longitude,
    type : "GET",
    success: function(data) {
      $("#representatives").html(data);
      $("button", "#representatives").button();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      callLog('Representatives DB Error: ' + textStatus + ' ' + errorThrown);
    }
  });
}

function geolocationError(error) {
  var codeStr = 'Unknown error';
  switch (error.code) {
    case error.PERMISSION_DENIED:
      codeStr = 'Permission denied';
      break;
    case error.POSITION_UNAVAILABLE:
      codeStr = 'Position unavailable';
      break;
    case error.TIMEOUT:
      codeStr = 'Timeout';
      break;
  }
  callLog('Geolocation Error: ' + codeStr + '. ' + error.message);
}

Twilio.Device.setup(TwilioConfig.CapabilityToken);

Twilio.Device.ready(function (device) {
  callLog("Ready");
});

Twilio.Device.error(function (error) {
  callLog("Twilio Error: " + error.message);
});

Twilio.Device.connect(function (conn) {
  callLog("Successfully established call");
});

Twilio.Device.disconnect(function (conn) {
  callLog("Call ended");
  hideScript();
  $('.call').show();
  $('.hangup').hide();
});

function callLog(text) {
  $("#log").append('<p>' + text + '</p>');
}

function call(number, clickedButton) {
  $(clickedButton).parent().find('.hangup').show();
  $('.call').hide();
  showScript();
  if (TwilioConfig.DemoNumber) {
    callLog("DEMO MODE: Instead of calling " + number + ", this demo number gets called: " + TwilioConfig.DemoNumber);
    number = TwilioConfig.DemoNumber;
  }
  params = {"PhoneNumber":number, "CampaignId":TwilioConfig.CampaignId};
  Twilio.Device.connect(params);
}

function hangup(clickedButton) {
  Twilio.Device.disconnectAll();
}

function showScript() {
  $("#phonescript").slideDown();
  $(".showScript").hide();
  $(".hideScript").show();
}

function hideScript() {
  $("#phonescript").slideUp();
  $(".showScript").show();
  $(".hideScript").hide();
}

$("#representatives").on("click", "button.call", function(event) {
	call($(this).attr('data-phone'), this);
});

$("#representatives").on("click", "button.hangup", function(event) {
	hangup(this);
});

$(".showScript").on("click", function(event) {
	showScript();
}).button();

$(".hideScript").on("click", function(event) {
	hideScript();
}).button();
