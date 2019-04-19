function() {
  var times = window._dataLayerHistory.history.filter(function(obj) { return typeof obj.fbclid === 'string'; }).length;
if (times > 0) {
  times = times - 1;
} else {
  times = 0
}
  return window._dataLayerHistory.history.filter(function(object) { return typeof object.fbclid === 'string'; }).valueOf()[times].fbclid;
}
