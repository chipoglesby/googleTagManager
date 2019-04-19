function() {
  var times = window._dataLayerHistory.history.filter(function(obj) { return typeof obj.gclid === 'string'; }).length;
if (times > 0) {
  times = times - 1;
} else {
  times = 0
}
  return window._dataLayerHistory.history.filter(function(object) { return typeof object.gclid === 'string'; }).valueOf()[times].gclid;
}
