$(function() {	
	
	$('div.fileCatch, div.step.nodrop').fileDragDrop({dropEffect: false});
	
	$('div.step').fileDragDrop('init', {types: ['dragover']}, function(e){
		$(this).addClass('blue');
	});
	
	$('div.step').fileDragDrop('init', {types: ['dragleave']}, function(e){
		$(this).removeClass('blue');
	});
	
	///////////////////////////////////////////////////////
    // Step 1 - Upload
	
	$('div.step:eq(0) input[name="overwrite"]').removeAttr('disabled').attr('checked','checked');
	$('button[name="upload"]').removeAttr('disabled');
	$('input[name="files"]').val('');
	
	$('p.browse').hover(
		function(){ $(this).find('sup span').hide(); },
		function(){ $(this).find('sup span').show(); }
	);
    
	$('div.step.drop').fileDragDrop('init', {types: ['dragover']}, function(e){
		if($(this).data('files')){
			e.dataTransfer.dropEffect = 'none';
			$(this).find('div.bottom div.ribbon').fileStatus('filled');
		} else if(e.dataTransfer.mozItemCount > 1){
			e.dataTransfer.dropEffect = 'none';
			$(this).find('div.bottom div.ribbon').fileStatus('nomore');
		}
	});
	
	$('div.step.drop').fileDragDrop('init', {types: ['dragleave']}, function(e){
		if(!$(this).data('files')){
			$(this).find('div.bottom div.ribbon').fileStatus('reset');
		} else {
			$(this).find('div.bottom div.ribbon').fileStatus('file');
			
			$(this).find('div.bottom div.ribbon.success').hover(
				function(){ $(this).find('img').attr('src','images/delete_16.png'); },
				function(){ $(this).find('img').attr('src','images/file_16.png'); }
			).find('img').click( function(){
				$(this).parent().fileStatus('reset');
			});
		}
	});
	
	$('div.step.drop').fileDragDrop('init', {types: ['drop']}, function(e){
		$(this).fileDragDrop('handleFiles', {attach: true, evt: e}, function(e){
			$(this).find('div.bottom div.ribbon').fileStatus('file');
		});
		
		$(this).find('div.bottom div.ribbon.success').hover(
			function(){ $(this).find('img').attr('src','images/delete_16.png'); },
			function(){ $(this).find('img').attr('src','images/file_16.png'); }
		).find('img').click( function(){
			$(this).parent().fileStatus('reset');
		});
	});
	
	$('input[name="files"]').bind('change', function(){
		var fileName = $('input[name="files"]')[0].files[0].name;
		if(fileName.length > 0){
			$('div.step.drop div.bottom p.browse sup span').html(subName(fileName));
		}
	});
	
	$('button[name="upload"]').data({
    	'step': $('div.step:eq(0)'),
    	'overwrite': $('div.step:eq(0) input[name="overwrite"]'),
    	'loading': $('div.step:eq(0) h2:eq(0) img'),
    	'percent': $('div.step:eq(0) button[name="upload"]')
    });
	
	$('button[name="upload"]').click( function(){
    	var _self = $(this);
    	_self.addClass('disabled').attr('disabled', 'disabled');
    	$('div.step:eq(0) input[name="overwrite"]').attr('disabled', 'disabled');
    	
    	/*
    	var fileInput = $('input[name="files"]')[0];
		var file = fileInput.files[0];
		
		//$('input[name="files"]').attr('disabled', 'disabled');
		
		//if($('input[name="files"]').val().length > 0){
		//	fileName = $('input[name="files"]').val();
		//}
		*/
		
		//console.log(file.type); // image/jpeg

		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'tasks.php', true);
		
		xhr.upload.addEventListener('progress', function(e){
			if(e.lengthComputable){
				var percentage = Math.round((e.loaded * 100) / e.total);
				_self.data('percent').text(percentage + '%');
			}
		}, false);
	
		//xhr.upload.addEventListener('load', function(){
		//	step.find('h2 img').remove();
		//	step.addClass('success');
		//}, false);
		
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 1){
				_self.data('loading').fadeIn('slow');
			}
			if(xhr.readyState == 4){				
				$('div.step:eq(0) input[name="overwrite"]').removeAttr('disabled').attr('checked','checked');
				$('button[name="upload"]').removeClass('disabled').removeAttr('disabled');
				$('input[name="files"]').val('');
				_self.data('percent').text('Upload');
				_self.data('loading').fadeOut('slow');	
				
				if(xhr.status == 200 || xhr.status == 304){
					_self.data('step').find('div.ribbon').fileStatus('success');
				} else {
					_self.data('step').find('div.ribbon').fileStatus('error');
				}
			}
		}
		
		if($('div.step:eq(0)').data('files') != undefined){
			var file = $('div.step:eq(0)').data('files')[0];
			
			xhr.setRequestHeader('Content-Type', 'application/octet-stream');
			xhr.setRequestHeader('X-File-Name', file.name);
			xhr.setRequestHeader('X-Content-Length', file.size);
			xhr.setRequestHeader('X-Task', 'upload');
			
			xhr.sendAsBinary(file.getAsBinary());
		} else {
			$('div.step:eq(0) input[name="overwrite"]').removeAttr('disabled').attr('checked','checked');
			$('button[name="upload"]').removeClass('disabled').removeAttr('disabled');
			_self.data('loading').fadeOut('slow');
		}
		
	});
	
	///////////////////////////////////////////////////////
    // Step 2 - Select & Target
    
    // Target
	
	$('button[name="target"]').data({
    	'text': $('div.step:eq(1) div.ribbon:eq(0) span.text'),
    	'icon': $('div.step:eq(1) div.ribbon:eq(0) img')
    });
    
    $('button[name="target"]').click( function(){
    	var _self = $(this);
    	$.ajax({
			type: 'POST',
			url: 'tasks.php',
			dataType: 'json',
			data: {
				'f': 'target'
			},
			success: function(json){
				var ul = $('div[class="popup-list"] div.bottom ul').empty();
				$.each(json.targets, function(key, target){
					$('<li>').text(target).prepend('<img src="images/folder_16.png" />').click( function(){
						$('form').data('target', key);
						_self.data('text').text(target);
						$(this).parents('div.popup-list').fadeOut( function(){
		                    $(this).prev('div.popup-back').fadeOut('fast');
		                });
					}).appendTo(ul);
				});
				$('div[class^="popup-back"]').fadeIn('fast', function(){
		        	$(this).next('div.popup-list').fadeIn();
		        });				
			},
			error: function(error){
				_self.data('icon').attr('src', 'images/warning_16.png');
				_self.data('text').text(error.responseText);
			}
		});
    });
    
    // Select File
	
	$('button[name="select"]').data({
    	'text': $('div.step:eq(1) div.ribbon:eq(1) span.text'),
    	'icon': $('div.step:eq(1) div.ribbon:eq(1) img')
    });
    
    $('button[name="select"]').click( function(){
    	var _self = $(this);
    	$.ajax({
			type: 'POST',
			url: 'tasks.php',
			dataType: 'json',
			data: {
				'f': 'select'
			},
			success: function(json){
				var ul = $('div[class="popup-list"] div.bottom ul').empty();
				$.each(json.selects, function(key, select){
					$('<li>').text(select).prepend('<img src="images/document_16.png" />').click( function(){
						$('form').data('select', select);
						_self.data('text').text(select);
						$(this).parents('div.popup-list').fadeOut( function(){
		                    $(this).prev('div.popup-back').fadeOut('fast');
		                });
					}).appendTo(ul);
				});
				$('div[class^="popup-back"]').fadeIn('fast', function(){
		        	$(this).next('div.popup-list').fadeIn();
		        });				
			},
			error: function(error){
				_self.data('icon').attr('src', 'images/warning_16.png');
				_self.data('text').text(error.responseText);
			}
		});
    });
    
    ///////////////////////////////////////////////////////
    // Step 3 - Purge & Extract

    // Purge
    
    $('button[name="purge"]').data({
    	'text': $('div.step:eq(2) div.ribbon:eq(0) span.text'),
    	'icon': $('div.step:eq(2) div.ribbon:eq(0) img'),
    	'loading': $('div.step:eq(2) h2:eq(0) img')
    });
    
    $('button[name="purge"]').click( function(e){
    	var _self = $(this);
		$.ajax({
			type: 'POST',
			url: 'tasks.php',
			dataType: 'json',
			data: {
				'f': 'purge',
				'target': $('form').data('target')
			},
			beforeSend: function(){
				_self.data('loading').fadeIn('slow');
			},
			success: function(json){
				_self.data('loading').fadeOut('slow');
				_self.data('icon').attr('src', 'images/tick_16.png');
				_self.data('text').text('Directory Purged');
			},
			error: function(error){
				_self.data('loading').fadeOut('slow');
				_self.data('icon').attr('src', 'images/warning_16.png');
				_self.data('text').text(error.responseText);
			}
		});
	});
    
    // Extract
    
    $('button[name="extract"]').data({
    	'text': $('div.step:eq(2) div.ribbon:eq(1) span.text'),
    	'icon': $('div.step:eq(2) div.ribbon:eq(1) img'),
    	'loading': $('div.step:eq(2) h2:eq(1) img')
    });
    
    $('button[name="extract"]').click( function(e){
    	var _self = $(this);
		$.ajax({
			type: 'POST',
			url: 'tasks.php',
			dataType: 'json',
			data: {
				'f': 'extract',
				'target': $('form').data('target'),
				'file': $('form').data('select')
			},
			beforeSend: function(){
				_self.data('loading').fadeIn('slow');
			},
			success: function(json){
				_self.data('loading').fadeOut('slow');
				_self.data('icon').attr('src', 'images/tick_16.png');
				_self.data('text').text(json.result);
			},
			error: function(error){
				_self.data('loading').fadeOut('slow');
				_self.data('icon').attr('src', 'images/warning_16.png');
				_self.data('text').text(error.responseText);
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
				$(this).removeClass('error success').addClass('status').find('img').attr('src', 'images/file_16.png').next('span.text').text('Ready...');
			},
			
			file: function(){
				var file = $(this).parents('div.step').data('files')[0];
				if(file){
					$(this).removeClass('error').addClass('status success').find('img').attr('src', 'images/file_16.png').next('span.text').html( function(){
						return subName(file.name);
					});
					$(this).find('sup').text(size_format(file.size));
					//$(this).find('div.bottom button[name="upload"]').removeClass('disabled').removeAttr('disabled');
				}
			},
			
			reset: function(){
				//if( options ){ $.extend( settings, options ); }
				$(this).parents('div.step').data('files', null);
				$(this).removeClass('error success').addClass('status').find('img').attr('src', 'images/file_16.png').next('span.text').text('Drop file here.');
				$(this).find('sup').text('');
			},
			
			nomore: function(){
				//if( options ){ $.extend( settings, options ); }
				$(this).parents('div.step').data('files', null);
				$(this).removeClass('success').addClass('error').find('img').attr('src', 'images/warning_16.png').next('span.text').text('Only 1 file allowed.');
			},
			
			filled: function(){
				//if( options ){ $.extend( settings, options ); }
				$(this).parents('div.step').data('files', null);
				$(this).removeClass('success').addClass('error').find('img').attr('src', 'images/warning_16.png').next('span.text').text('File already dropped.');
			},
			
			error: function(){
				$(this).parents('div.step').data('files', null);
				$(this).removeClass('success').addClass('error').find('img').attr('src', 'images/warning_16.png').next('span.text').text('Upload error.');
			},
			
			success: function(){
				$(this).parents('div.step').data('files', null);
				$(this).removeClass('error').addClass('success').find('img').attr('src', 'images/tick_16.png').next('span.text').text('Upload successful.');
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
		return (name.length > 15) ? name.substring(0, 8) + '...' + name.substring(name.length - 7) : name;
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