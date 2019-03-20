function() {
  return function(model) {
    
    // Change this to the Custom Dimension index to which you want to send the experiment data!
    var customDimensionIndex = '{{optimize CD}}';

    // Make sure the new hit is only generated once (thanks Vibhor Jain!)
    var hasNewHitBeenGenerated = false;
    
    var globalSendTaskName = '_' + model.get('trackingId') + '_sendHitTask';
    
    var originalSendTask = window[globalSendTaskName] = window[globalSendTaskName] || model.get('sendHitTask');

    model.set('sendHitTask', function(sendModel) {
      var ga = window[window['GoogleAnalyticsObject']];
      var hitPayload = sendModel.get('hitPayload');
      if (sendModel.get('exp')) {
        if (sendModel.get('hitType') === 'data' && !hasNewHitBeenGenerated) {
          var tracker = sendModel.get('name');
          originalSendTask(sendModel);
          ga(tracker + '.send', 'event', 'Optimize', sendModel.get('exp'), {nonInteraction: true});
          hasNewHitBeenGenerated = true;
          return;
        }
        if (hitPayload.indexOf('&cd' + customDimensionIndex + '=') === -1) {
          sendModel.set('hitPayload', hitPayload + '&cd' + customDimensionIndex + '=' + sendModel.get('exp'), true);
        }
      }
      originalSendTask(sendModel);
    });
  };
}
