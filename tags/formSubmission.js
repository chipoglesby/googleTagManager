<script type="text/javascript">
 jQuery(document).ready(function() {
   jQuery(document).bind("gform_confirmation_loaded", function(event, formID) {
     window.dataLayer = window.dataLayer || [];
     window.dataLayer.push({
       event: "formSubmission",
       formID: formID
     });
   });
 });
</script>
