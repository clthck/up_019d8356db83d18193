+function (window, jQuery, document) {

	$( () => {
    $('a[href="' + location.pathname + '"]', '#navbar').parents('li').addClass('active');

		$('.rest').restfulizer();
    $('.select2').select2();
    $('select.select2.with-all-option').on('select2:select', (e) => {
      var $this = $(e.target),
          value = $this.val();
      if (e.params.data.id === '-1') {
        $this.val(['-1']).trigger('change');
      } else {
        value = _.without(value, '-1');
        $this.val(value).trigger('change');
      }
    });
    $('select.select2').each(function() {
      var $this = $(this),
          value = $this.data('value');
      $this.val(value).trigger('change');
    });
	});

} (window, window.jQuery, document);