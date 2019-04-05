function() {
  return window._dataLayerHistory.history.filter(function(object) { return typeof object.gclid === 'string'; }).valueOf()[0].gclid;
}
