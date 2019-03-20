function() {
  return function() {
    var interactedFields = window.dataLayer.filter(function(item) {
      return item.event === 'gtm4wp.formElementEnter';
    }) || [];
    var lastField = interactedFields[interactedFields.length - 1] && interactedFields[interactedFields.length - 1].inputName;

    if (lastField) {
      window.dataLayer.push({
        event: 'formAbandon',
        lastField: lastField
      });
    }
  }
}
