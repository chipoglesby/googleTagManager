function() {
  return window._dataLayerHistory.history.filter(function(obj) { return obj.event === 'gtm.js'; }).length;
}
