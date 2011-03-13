$(function() {	
	
	$('div.fileCatch, div.step.nodrop').fileDragDrop({dropEffect: false});
	
	$('div.step.drop').fileDragDrop('init', {types: ['dragover']}, function(e){
		if($(this).data('files')){
			e.dataTransfer.dropEffect = 'none';
			$(this).find('div.bottom p.status').addClass('error').html( function(){
				return '<img src="images/warning_16.png" />File already dropped.';
			});
		} else if(e.dataTransfer.mozItemCount > 1){
			e.dataTransfer.dropEffect = 'none';
			$(this).find('div.bottom p.status').addClass('error').html( function(){
				return '<img src="images/warning_16.png" />Only 1 file allowed.';
			});
		}
	});
	
	$('div.step.drop').fileDragDrop('init', {types: ['dragleave']}, function(e){
		if(!$(this).data('files')){
			$(this).find('div.bottom p.status').fileStatus('reset');
		} else {
			$(this).find('div.bottom p.status').fileStatus('info');
			
			$(this).find('div.bottom p.status.success').hover(
				function(){ $(this).find('img').attr('src','images/delete_16.png') },
				function(){ $(this).find('img').attr('src','images/file_16.png') }
			).find('img').click( function(){
				$(this).fileStatus('reset');
			});
		}
	});
	
	$('div.step.drop').fileDragDrop('init', {types: ['drop']}, function(e){
		$(this).dragDrop('handleFiles', {attach: true, evt: e}, function(e){
			$(this).find('div.bottom p.status').fileStatus('info');
		});
		
		$(this).find('div.bottom p.status.success').hover(
			function(){ $(this).find('img').attr('src','images/delete_16.png') },
			function(){ $(this).find('img').attr('src','images/file_16.png') }
		).find('img').click( function(){
			$(this).parent().fileStatus('reset');
		});
	});
	
	$.fn.fileStatus = function(method, options){
		/*
		var settings = {
			'preventDefault': true,
			'dropEffect': true,
			'types': ['dragover', 'dragleave', 'drop']
		};
		*/
		
		var methods = {
			reset: function(){
				//if( options ){ $.extend( settings, options ); }
				$(this).parents('div.step').data('files', null);
				$(this).removeClass('error success').addClass('status').html( function(){
					return '<img src="images/file_16.png" />Ready...';
				});
			},
			
			info: function(){
				var file = $(this).parents('div.step').data('files')[0];
				if(file){
					$(this).removeClass('error').addClass('status success').html( function(){
						return '<img src="images/file_16.png" />' + file.name + ' ' + '<span style="float: right;">[' + size_format(file.size) + ']</span>';
					});
					//$(this).find('div.bottom button[name="upload"]').removeClass('disabled').removeAttr('disabled');
				}
			}
		};
		
		if( methods[method] ){
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if( typeof method === 'object' || ! method ){
			return methods.init.apply( this, arguments );
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.fileStatus');
		}
	};
	
	function subName(name){
		return (name.len > 21) ? name.substring(0, 12) + '...' + name.substring(name.len-9) : name;
	}
	
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
		}
		return size;
	}
	
});