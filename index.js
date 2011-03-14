$(function() {	
	
	///////////////////////////////////////////////////////
    // Step 1 - Upload
    
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
			$(this).find('div.bottom p.status').fileStatus('file');
			
			$(this).find('div.bottom p.status.success').hover(
				function(){ $(this).find('img').attr('src','images/delete_16.png'); },
				function(){ $(this).find('img').attr('src','images/file_16.png'); }
			).find('img').click( function(){
				$(this).parent().fileStatus('reset');
			});
		}
	});
	
	$('div.step.drop').fileDragDrop('init', {types: ['drop']}, function(e){
		$(this).fileDragDrop('handleFiles', {attach: true, evt: e}, function(e){
			$(this).find('div.bottom p.status').fileStatus('file');
		});
		
		$(this).find('div.bottom p.status.success').hover(
			function(){ $(this).find('img').attr('src','images/delete_16.png'); },
			function(){ $(this).find('img').attr('src','images/file_16.png'); }
		).find('img').click( function(){
			$(this).parent().fileStatus('reset');
		});
	});
	
	$('div.step').fileDragDrop('init', {types: ['dragover']}, function(e){
		$(this).addClass('blue');
	});
	
	$('div.step').fileDragDrop('init', {types: ['dragleave']}, function(e){
		$(this).removeClass('blue');
	});
	
	$('div.step:eq(0) input[name="overwrite"]').attr('checked','checked');
	$('button[name="upload"]').removeAttr('disabled');
	
	$('button[name="upload"]').data({
    	'step': $('div.step:eq(0)'),
    	'overwrite': $('div.step:eq(0) input[name="overwrite"]'),
    	'loading': $('div.step:eq(0) h2:eq(0) img')
    });
	
	$('button[name="upload"]').click( function(){
    	var button = $(this);
    	button.addClass('disabled').attr('disabled', 'disabled');
    	$('div.step:eq(0) input[name="overwrite"]').attr('disabled', 'disabled');
    	
		$.ajax({
			type: 'POST',
			url: '/upload',
			dataType: 'json',
			data: { 
				'overwrite': button.data('overwrite').is(':checked')
			},
			beforeSend: function(){
				button.data('loading').fadeIn('slow');
			},
			success: function(json){
				button.data('loading').fadeOut('slow');
			},
			error: function(error){
				button.data('loading').fadeOut('slow');
			}
		});
	});
	
	///////////////////////////////////////////////////////
    // Step 2 - Select & Target

    // File
	
	$('button[name="select"]').data({
    	'line': $('div.step:eq(1) p.status:eq(0)'),
    	'icon': $('div.step:eq(1) p.status:eq(0) img'),
    	'step': $('div.step:eq(1)')
    });
    
    $('button[name="select"]').click( function(){
        $('div[class^="popup-back"]').fadeIn('fast', function(){
        	$(this).next('div.popup-list').fadeIn().find('div.bottom li').unbind('click').click( function(){
            	console.log($(this));
            	$(this).parents('div.popup-list')
            });
        });
    });
    
    // Target
	
	$('button[name="target"]').data({
    	'line': $('div.step:eq(1) p.status:eq(1)'),
    	'icon': $('div.step:eq(1) p.status:eq(1) img'),
    	'step': $('div.step:eq(1)')
    });
    
    $('button[name="target"]').click( function(){	
        $('div[class^="popup-back"]').fadeIn('fast', function(){
        	$(this).next('div.popup-list').fadeIn().find('div.bottom li').unbind('click').click( function(){
            	console.log($(this));
            	$(this).parents('div.popup-list')
            });
        });
    });
    
    ///////////////////////////////////////////////////////
    // Step 3 - Purge & Extract

    // Purge
    
    $('button[name="purge"]').data({
    	'line': $('div.step:eq(2) p.status:eq(0)'),
    	'icon': $('div.step:eq(2) p.status:eq(0) img'),
    	'loading': $('div.step:eq(2) h2:eq(0) img'),
    	'step': $('div.step:eq(2)')
    });
    
    $('button[name="purge"]').click( function(e){
    	var button = $(this);
		$.ajax({
			type: 'POST',
			url: '/purge',
			dataType: 'json',
			data: { 
				'foo': 'bar'
			},
			beforeSend: function(){
				button.data('loading').fadeIn('slow');
			},
			success: function(json){
				button.data('loading').fadeOut('slow');
				button.data('line').html('<img src="images/tick_16.png" />Directory Purged');
			},
			error: function(error){
				button.data('loading').fadeOut('slow');
				button.data('line').html('<img src="images/warning_16.png" />Purge Error');
			}
		});
	});
    
    // Extract
    
    $('button[name="extract"]').data({
    	'line': $('div.step:eq(2) p.status:eq(1)'),
    	'icon': $('div.step:eq(2) p.status:eq(1) img'),
    	'loading': $('div.step:eq(2) h2:eq(1) img'),
    	'step': $('div.step:eq(2)')
    });
    
    $('button[name="extract"]').click( function(e){
    	var button = $(this);
		$.ajax({
			type: 'POST',
			url: '/extract',
			dataType: 'json',
			data: { 
				'foo': 'bar'
			},
			beforeSend: function(){
				button.data('loading').fadeIn('slow');
			},
			success: function(json){
				button.data('loading').fadeOut('slow');
				button.data('line').html('<img src="images/tick_16.png" />504 Files Extracted');
			},
			error: function(error){
				button.data('loading').fadeOut('slow');
				button.data('line').html('<img src="images/warning_16.png" />Extract Error');
			}
		});
	});
    
    ///////////////////////////////////////////////////////
    // Common Function
    
    $('div.popup-list div.top').click( function(){
        $(this).parent().fadeOut( function(){
            $(this).prev('div.popup-back').fadeOut('fast');
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
			ready: function(){
				//if( options ){ $.extend( settings, options ); }
				$(this).parents('div.step').data('files', null);
				$(this).removeClass('error success').addClass('status').html( function(){
					return '<img src="images/file_16.png" />Ready...';
				});
			},
			
			file: function(){
				var file = $(this).parents('div.step').data('files')[0];
				if(file){
					$(this).removeClass('error').addClass('status success').html( function(){
						return '<img src="images/file_16.png" />' + file.name + ' ' + '<span style="float: right;">[' + size_format(file.size) + ']</span>';
					});
					//$(this).find('div.bottom button[name="upload"]').removeClass('disabled').removeAttr('disabled');
				}
			},
			
			reset: function(){
				//if( options ){ $.extend( settings, options ); }
				$(this).parents('div.step').data('files', null);
				$(this).removeClass('error success').addClass('status').html( function(){
					return '<img src="images/file_16.png" />Drop file here.';
				});
			},
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