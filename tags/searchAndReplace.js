<script>
(function () {
  var links = document.querySelectorAll('a[href*="[URL]"]') 
	var searchString = "?tid=1234"
  var replacementString = "?tid={{Find GCLID}}" 	
	links.forEach(function(link){
 		var original = link.getAttribute("href");
 		var replace = original.replace(searchString,replacementString)
 		link.setAttribute("href",replace)
	})
})();

</script>
