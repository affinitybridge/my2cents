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

Twilio.Device.setup(TwilioConfig.CapabilityToken);

Twilio.Device.ready(function (device) {
  callLog("Ready");
});

Twilio.Device.error(function (error) {
  callLog("Error: " + error.message);
});

Twilio.Device.connect(function (conn) {
  callLog("Successfully established call");
});

Twilio.Device.disconnect(function (conn) {
  callLog("Call ended");
});

function callLog(text) {
  $("#log").append('<p>' + text + '</p>');
}

function call(number, clickedButton) {
  $(clickedButton).parent().find(".hangup").show();
  $(clickedButton).hide();
  showScript();
  if (TwilioConfig.DemoNumber) {
    callLog("DEMO MODE: Instead of calling " + number + ", this demo number gets called: " + TwilioConfig.DemoNumber);
    number = TwilioConfig.DemoNumber;
  }
  params = {"PhoneNumber":number, "CampaignId":TwilioConfig.CampaignId};
  Twilio.Device.connect(params);
}

function hangup(clickedButton) {
  $(clickedButton).parent().find(".call").show();
  $(clickedButton).hide();
  hideScript();
  Twilio.Device.disconnectAll();
}

function showScript() {
  $("#phonescript").show();
}

function hideScript() {
  $("#phonescript").hide();
}
