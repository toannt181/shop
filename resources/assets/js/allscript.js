/*
 * sticky
 */  
$(window).load(function(){      
	$('#menu li').hover(function() {
		var obj = $(this);
		$('#menu-detail div').hide();
		$('#menu-detail div#menu-detail-'+obj.data('id')).show();
	});
});