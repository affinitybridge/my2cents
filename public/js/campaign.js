(function () {

  function callLog(text) {
    $("#log").append('<p>' + text + '</p>');
  }

  function geolocationSuccess(position) {
    $.ajax({
      url: '/representatives/' + position.coords.latitude + '/' + position.coords.longitude,
      type : "GET",
      success: function(data) {
        $("#representatives .inner").html(data);
        // make widget full height of the window.
        $('#main').height($(window).height() - 2);
        var elementHeights = $('.widget-header').height() + $('#footer').height() + 20;
        // This needs a set height to make the scroll bar work.
        $('#representatives .inner').height($('#main').height() - elementHeights);
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

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
  } else {
    callLog('Geolocation Error: HTML 5 Geolocation not supported.');
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
    $('#representatives .hangup').hide();
  });

  function call(number, hash, clickedButton) {
    $(clickedButton).parent().find('.hangup').show();
    $('.call').hide();
    showScript(clickedButton);
    if (TwilioConfig.DemoNumber) {
      callLog("DEMO MODE: Instead of calling " + number + ", this demo number gets called: " + TwilioConfig.DemoNumber);
    }
    var params = {
      "PhoneNumber":number,
      "PhoneHash":hash,
      "CampaignId":TwilioConfig.CampaignId
    };
    Twilio.Device.connect(params);
  }

  function hangup(clickedButton) {
    Twilio.Device.disconnectAll();
  }

  function showScript(clickedButton) {
    var id = $(clickedButton).parents('div.rep').attr('data-id');
    $("#phonescript").show();
  }

  function hideScript() {
    $("#phonescript").hide();
    $('#representatives div.rep').slideDown(200);
  }

  $("#representatives").on("click", "button.call", function(event) {
    call($(this).attr('data-phone'), $(this).attr('data-hash'), this);
  });

  $("#representatives, #phonescript").on("click", "button.hangup", function(event) {
    hangup(this);
  });

  $(".showScript").on("click", function(event) {
    showScript();
  });

  $(".hideScript").on("click", function(event) {
    hideScript();
  });
}());
