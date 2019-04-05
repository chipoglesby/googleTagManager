function() {
  return window._dataLayerHistory.history.filter(function(object) { return typeof object.fbclid === 'string'; }).valueOf()[0].fbclid;
}
