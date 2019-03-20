function() {
  var clientIdIndex = 1; // Change this number to the index of your Client ID Custom Dimension
  var hitTypeIndex = 10; // Change this number to the index of your Hit Type Custom Dimension
  var payloadLengthIndex = 11; // Change this number to the index of your Payload Length Custom Dimension
  var optimizeIndex = 12;
  return function(model) {
    var globalSendTaskName, originalSendHitTask, originalHitPayload, hitPayload, customDimensionParameter;

    if (typeof clientIdIndex === 'number') {
      model.set('dimension' + clientIdIndex, model.get('clientId'));
    }

    if (typeof hitTypeIndex === 'number') {
      model.set('dimension' + hitTypeIndex, model.get('hitType'));
    }

    if (typeof payloadLengthIndex === 'number') {
      globalSendTaskName = '_' + model.get('trackingId') + '_sendHitTask';

      originalSendHitTask = window[globalSendTaskName] = window[globalSendTaskName] || model.get('sendHitTask');

      model.set('sendHitTask', function(sendModel) {

        try {

          originalHitPayload = sendModel.get('hitPayload');

          hitPayload = sendModel.get('hitPayload');
          customDimensionParameter = '&cd' + payloadLengthIndex;

          // If hitPayload already has that Custom Dimension, note this in the console and do not overwrite the existing dimension

          if (hitPayload.indexOf(customDimensionParameter + '=') > -1) {

            console.log('Google Analytics error: tried to send hit payload length in an already assigned Custom Dimension');
            originalSendHitTask(sendModel);

          } else {

            // Otherwise add the Custom Dimension to the string
            // together with the complete length of the payload
            hitPayload += customDimensionParameter + '=';
            hitPayload += (hitPayload.length + hitPayload.length.toString().length);

            sendModel.set('hitPayload', hitPayload, true);
            originalSendHitTask(sendModel);

          }

        } catch (e) {

          console.error('Error sending hit payload length to Google Analytics');
          sendModel.set('hitPayload', originalHitPayload, true);
          originalSendHitTask(sendModel);

        }

      });
    }
    if (typeof optimizeIndex === 'number') {
      var hasNewHitBeenGenerated = false;
      var globalSendTaskName = '_' + model.get('trackingId') + '_sendHitTask';
      var originalSendTask = window[globalSendTaskName] = window[globalSendTaskName] || model.get('sendHitTask');

      model.set('sendHitTask', function(sendModel) {
        var ga = window[window['GoogleAnalyticsObject']];
        var hitPayload = sendModel.get('hitPayload');
        if (sendModel.get('exp')) {
          if (sendModel.get('hitType') === 'pageview' && !hasNewHitBeenGenerated) {
            var tracker = sendModel.get('name');
            originalSendTask(sendModel);
            ga(tracker + '.send', 'event', 'Optimize', sendModel.get('exp'), {
              nonInteraction: true
            });
            hasNewHitBeenGenerated = true;
            return;
          }
          if (hitPayload.indexOf('&cd' + optimizeIndex + '=') === -1) {
            sendModel.set('hitPayload', hitPayload + '&cd' + optimizeIndex + '=' + sendModel.get('exp'), true);
          }
        }
        originalSendTask(sendModel);
      });
    }
  }
}
