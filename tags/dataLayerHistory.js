<script>
  (function() {
    // Set the timeout for when the dataLayer history should be purged. The default is 24 hours.
    // The timeout needs to be in milliseconds.
    // Changed to 30 days
    // var timeout = 1440*60*1000;
    var timeout = 30*24*60*60*1000;
    
    // Change dataLayerName only if you've defined another named for the dataLayer array in your
    // GTM container snippet.
    var dataLayerName = 'dataLayer';
    
    // Don't change anything below.
    // Initial settings
    var initialLoad     = true,
        oldPush         = window[dataLayerName].push;
    
    // Method to copy items from dataLayer from before the GTM container snippet was loaded.
    var backfillHistory = function() {
      var tempHistory = [],
          i           = 0,
          len         = window[dataLayerName].length - 1;
      for (; i < len; i++) {
        tempHistory.push(window[dataLayerName][i]);
      }
      return tempHistory;
    };
    
    // Method to check if object is a plain object.
    // From https://bit.ly/2A3Fuqe
    var isPlainObject = function(value) {
      if (!value || typeof value !== 'object' ||    // Nulls, dates, etc.
          value.nodeType ||                             // DOM nodes.
          value === value.window) {                      // Window objects.
        return false;
      }
      try {
        if (value.constructor && !value.hasOwnProperty('constructor') &&
            !value.constructor.prototype.hasOwnProperty('isPrototypeOf')) {
          return false;
        }
      } catch (e) {
        return false;
      }
      var key;
      for (key in value) {}
      return key === undefined || value.hasOwnProperty(key);
    };
    
    // Method to merge the stored data model and the history model together.
    // From https://bit.ly/2FrPQWL
    var mergeStates = function(storedModel, historyModel) {
      for (var property in storedModel) {
        if (storedModel.hasOwnProperty(property)) {
          var storedProperty = storedModel[property];
          if (Array.isArray(storedProperty)) {
            if (!Array.isArray(historyModel[property])) historyModel[property] = [];
            mergeStates(storedProperty, historyModel[property]);
          } else if (isPlainObject(storedProperty)) {
            if (!isPlainObject(historyModel[property])) historyModel[property] = {};
            mergeStates(storedProperty, historyModel[property]);
          } else {
            historyModel[property] = storedProperty;
          }
        }
      }
    };
    
    window[dataLayerName].push = function() {
      try {
        
        // Build the history array from local storage
        window._dataLayerHistory = JSON.parse(
          window.localStorage.getItem('_dataLayerHistory') || 
          '{"timeout": null, "history": [], "model": {}}'
        );
        
        // Initial settings
        var timeNow     = new Date().getTime(),
            states      = [].slice.call(arguments, 0),
            results     = oldPush.apply(window[dataLayerName], states),
            oDataLayer  = window[dataLayerName],
            dHistory    = window._dataLayerHistory,
            oDataModel  = window.google_tag_manager[{{Container ID}}].dataLayer.get({split: function() { return []; }});
        
        // Method to reset the history array to the current page state only
        dHistory.reset = function() {
          dHistory.timeout = null;
          dHistory.history = backfillHistory();
          dHistory.model = {};
          mergeStates(oDataModel, dHistory.model);
          window.localStorage.setItem('_dataLayerHistory', JSON.stringify(dHistory));
        };
      
        // From https://bit.ly/2A2ZcCG
        dHistory.model.get = function(key) {
          var target = dHistory.model;
          var split = key.split('.');
          for (var i = 0; i < split.length; i++) {
            if (target[split[i]] === undefined) return undefined;
            target = target[split[i]];
          }
          return target;
        };

        // Add history if this is the initialization event itself
        if (initialLoad) {
          dHistory.history = dHistory.history.concat(backfillHistory());
          initialLoad = false;
        }
        
        // If timeout is reached, reset the history array
        if (dHistory.hasOwnProperty('timeout') && dHistory.timeout < timeNow) {
          dHistory.reset();
        }
        
        // Push latest item from dataLayer into the history array
        dHistory.history.push(oDataLayer[oDataLayer.length-1]);
        
        // Merge GTM's data model with the history model
        mergeStates(oDataModel, dHistory.model);
        
        // Update the timeout
        dHistory.timeout = timeNow + timeout;
        
        // Write the new history into localStorage
        window.localStorage.setItem('_dataLayerHistory', JSON.stringify(dHistory));
        return results;
      } catch(e) {
        console.log('Problem interacting with dataLayer history: ' + e);
        var states  = [].slice.call(arguments, 0),
            results = oldPush.apply(window[dataLayerName], states);
        return results;
      }
    };
  })();
</script>
