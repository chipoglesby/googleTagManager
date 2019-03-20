<script>
  (function() {
    
    // Set to false if you only want to register "BACK/FORWARD"
    // if either button was pressed.
    var detailedBackForward = true;
    
    if (!!window.Storage) {

      var openTabs  = JSON.parse(localStorage.getItem('_tab_ids')),
          tabId     = sessionStorage.getItem('_tab_id'),
          navPath   = JSON.parse(sessionStorage.getItem('_nav_path')),
          curPage   = document.location.href,
          newTab    = false,
          origin    = document.location.origin;

      var tabCount,
          redirectCount,
          navigationType,
          prevInStack,
          lastInStack,
          payload;

      var getBackForwardNavigation = function() {
        
        if (detailedBackForward === false) {
          return 'BACK/FORWARD';
        }

        if (navPath.length < 2) {
          return 'FORWARD';
        }

        prevInStack = navPath[navPath.length-2];
        lastInStack = navPath[navPath.length-1];

        if (prevInStack === curPage || lastInStack === curPage) {
          return 'BACK';
        } else {
          return 'FORWARD';
        }

      };

      var removeTabOnUnload = function() {

        var index;

        // Get the most recent values from storage
        openTabs = JSON.parse(localStorage.getItem('_tab_ids'));
        tabId    = sessionStorage.getItem('_tab_id');

        if (openTabs !== null && tabId !== null) {
          index = openTabs.indexOf(tabId);
          if (index > -1) {
            openTabs.splice(index, 1);
          }
          localStorage.setItem('_tab_ids', JSON.stringify(openTabs));
        }

      };

      var generateTabId = function() {

        // From https://stackoverflow.com/a/8809472/2367037
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
          d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });

      };
      
      var validNavigation = function(type, newTab) {
        // Return false if new tab and any other navigation type than
        // NAVIGATE or OTHER. Otherwise return true.
        return !(newTab === true && (type !== 0 && type !== 255));
      
      };

      if (tabId === null) {
        tabId = generateTabId();
        newTab = true;
        sessionStorage.setItem('_tab_id', tabId);
      }

      openTabs = openTabs || [];

      if (openTabs.indexOf(tabId) === -1) {
        openTabs.push(tabId);
        localStorage.setItem('_tab_ids', JSON.stringify(openTabs));
      }

      tabCount = openTabs.length;

      if (!!window.PerformanceNavigation) {
        navPath = navPath || [];
        redirectCount = window.performance.navigation.redirectCount;
        // Only track new tabs if type is NAVIGATE or OTHER
        if (validNavigation(window.performance.navigation.type, newTab)) {
          switch (window.performance.navigation.type) {
            case 0:
              navigationType = 'NAVIGATE';
              navPath.push(curPage);
              break;
            case 1:
              navigationType = 'RELOAD';
              if (navPath.length === 0 || navPath[navPath.length-1] !== curPage) {
                navPath.push(curPage);
              }
              break;
            case 2:
              navigationType = getBackForwardNavigation();
              if (navigationType === 'FORWARD') {
                // Only push if not coming from external domain
                if (document.referrer.indexOf(origin) > -1) {
                  navPath.push(curPage);
                }
              } else if (navigationType === 'BACK') {
                // Only remove last if not coming from external domain
                if (lastInStack !== curPage) {
                  navPath.pop();
                }
              } else {
                navPath.push(curPage);
              }
              break;
            default:
              navigationType = 'OTHER';
              navPath.push(curPage);
          }
        } else {
          navPath.push(curPage);
        }
        sessionStorage.setItem('_nav_path', JSON.stringify(navPath));
      }

      window.addEventListener('beforeunload', removeTabOnUnload);
      
      payload = {
        tabCount: tabCount,
        redirectCount: redirectCount,
        navigationType: navigationType,
        newTab: newTab === true ? 'New' : 'Existing',
        tabId: tabId
      };

      // Set the data model keys directly so they can be used in the Page View tag
      window.google_tag_manager[{{Container ID}}].dataLayer.set('browsingBehavior', payload);
      
      // Also push to dataLayer
      window.dataLayer.push({
        event: 'custom.navigation',
        browsingBehavior: payload
      });
    
    }
  
  })();
</script>
