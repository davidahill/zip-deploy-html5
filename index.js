$(function() {	
	
	$('div.fileCatch, div.step.nodrop').dragDrop({dropEffect: false});
	
	$('div.step.drop').dragDrop('init', {types: ['dragover']}, function(e){
		if($(this).find('div.bottom p.status').hasClass('success')) {
			$(this).find('div.bottom p.status').addClass('error').html( function(){
				return '<img src="images/warning_16.png" />File already dropped.';
			});
		} else if(e.dataTransfer.mozItemCount > 1){
			e.dataTransfer.dropEffect = 'none';
			$(this).find('div.bottom p.status').addClass('error').html( function(){
				return '<img src="images/warning_16.png" />Only 1 file allowed.';
			});
		} else {
			e.dataTransfer.dropEffect = 'all';
		}
	});
	
	$('div.step.drop').dragDrop('init', {types: ['dragleave']}, function(e){
		if(!$(this).find('div.bottom p.status').hasClass('success')){
			$(this).find('div.bottom p.status').removeClass('error').html( function(){
				return '<img src="images/file_16.png" />Ready...';
			});
		}
	});
	
	$('div.step.drop').dragDrop('init', {types: ['drop']}, function(e){
		$(this).dragDrop('handleFile', {attach: true, evt: e}, function(e){
			if(e.dataTransfer){
				var files = $(this).data('files');
				if(files.length == 1){
					var file = files[0];
					function subName(name){
						return (name.len > 21) ? name.substring(0, 12) + '...' + name.substring(name.len-9) : name;
					}
					$(this).find('div.bottom p.status').addClass('success').html( function(){
						return '<img src="images/file_16.png" />' + subName(file.name) + ' ' + '<span style="float: right;">[' + size_format(file.size) + ']</span>';
					});
					$(this).find('div.bottom button[name="upload"]').removeClass('disabled').removeAttr('disabled');
				}
			}
		});
		
		$(this).find('div.bottom p.status.success').hover(
			function(){ $(this).find('img').attr('src','images/delete_16.png') },
			function(){ $(this).find('img').attr('src','images/file_16.png') }
		).find('img').click( function(){
			console.info('delete click');
		});
	});
	
	function roundNumber(num, dec){
		var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
		return result;
	}

	function size_format(size){
		if( size >= 1073741824 ){
			size = roundNumber(size / 1073741824, 2) + ' Gb';
		} else if( size >= 1048576 ){
			size = roundNumber(size / 1048576, 2) + ' Mb';
		} else if( size >= 1024 ){
			size = roundNumber(size / 1024, 2) + ' Kb';
		} else {
			size = roundNumber(size) + ' bytes';
		};
		return size;
	}
	
});