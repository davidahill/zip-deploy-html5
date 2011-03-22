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
    	'loading': $('div.step:eq(0) h2:eq(0) img')
    });
	
	$('button[name="upload"]').click( function(){
    	var button = $(this);
    	button.addClass('disabled').attr('disabled', 'disabled');
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
				console.log('Upload progress: ' + percentage + '%');
			}
		}, false);
	
		//xhr.upload.addEventListener('load', function(){
		//	step.find('h2 img').remove();
		//	step.addClass('success');
		//}, false);
		
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 1){
				//step.find('h2').append('<img src="loading.gif" />');
			}
			if(xhr.readyState == 4){
				//step.find('h2 img').remove();
				
				if(xhr.status == 200 || xhr.status == 304){
					//tep.addClass('success');
					//step.find('p.result').text(xhr.responseText).slideDown();
					//$('span.selectedFile').text(fileName);
					$('div.step:eq(0) input[name="overwrite"]').removeAttr('disabled').attr('checked','checked');
					$('button[name="upload"]').removeClass('disabled').removeAttr('disabled');
					$('input[name="files"]').val('');
				} else {
					//step.addClass('error');
					//step.find('p.result').text(xhr.responseText).slideDown();
				}
			}
		}
		
		var file = $('div.step:eq(0)').data('files')[0];
		
		xhr.setRequestHeader('Content-Type', 'application/octet-stream');
		xhr.setRequestHeader('X-File-Name', file.name);
		xhr.setRequestHeader('X-Content-Length', file.size);
		xhr.setRequestHeader('X-Task', 'upload');
		
		xhr.sendAsBinary(file.getAsBinary());
    	
		/*
		$.ajax({
			type: 'POST',
			url: 'tasks.php',
			dataType: 'json',
			data: {
				'f': 'upload',
				'overwrite': (button.data('overwrite').is(':checked') == true) ? true : undefined,
				'file': 'foo.zip',
				'target': 'tbd'
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
		*/
	});
	
	///////////////////////////////////////////////////////
    // Step 2 - Select & Target
    
    // Target
	
	$('button[name="target"]').data({
    	'line': $('div.step:eq(1) div.ribbon:eq(0)'),
    	'text': $('div.step:eq(1) div.ribbon:eq(0) span.text'),
    	'icon': $('div.step:eq(1) div.ribbon:eq(0) img'),
    	'step': $('div.step:eq(1)')
    });
    
    $('button[name="target"]').click( function(){
    	var button = $(this);
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
					$('<li>').text(target).click( function(){
						$('form').data('target', key);
						button.data('text').text(target);
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
				button.data('icon').attr('src', 'images/warning_16.png');
				button.data('text').text(error.responseText);
			}
		});
    });
    
    // Select File
	
	$('button[name="select"]').data({
    	'line': $('div.step:eq(1) div.ribbon:eq(1)'),
    	'text': $('div.step:eq(1) div.ribbon:eq(1) span.text'),
    	'icon': $('div.step:eq(1) div.ribbon:eq(1) img'),
    	'step': $('div.step:eq(1)')
    });
    
    $('button[name="select"]').click( function(){
    	var button = $(this);
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
					$('<li>').text(select).click( function(){
						$('form').data('select', key);
						button.data('text').text(select);
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
				button.data('icon').attr('src', 'images/warning_16.png');
				button.data('text').text(error.responseText);
			}
		});
    });
    
    ///////////////////////////////////////////////////////
    // Step 3 - Purge & Extract

    // Purge
    
    $('button[name="purge"]').data({
    	'line': $('div.step:eq(2) div.ribbon:eq(0)'),
    	'text': $('div.step:eq(2) div.ribbon:eq(0) span.text'),
    	'icon': $('div.step:eq(2) div.ribbon:eq(0) img'),
    	'loading': $('div.step:eq(2) h2:eq(0) img'),
    	'step': $('div.step:eq(2)')
    });
    
    $('button[name="purge"]').click( function(e){
    	var button = $(this);
		$.ajax({
			type: 'POST',
			url: 'tasks.php',
			dataType: 'json',
			data: {
				'f': 'purge',
				'target': 'folder1'
			},
			beforeSend: function(){
				button.data('loading').fadeIn('slow');
			},
			success: function(json){
				button.data('loading').fadeOut('slow');
				button.data('icon').attr('src', 'images/tick_16.png');
				button.data('text').text('Directory Purged');
			},
			error: function(error){
				button.data('loading').fadeOut('slow');
				button.data('icon').attr('src', 'images/warning_16.png');
				button.data('text').text(error.responseText);
			}
		});
	});
    
    // Extract
    
    $('button[name="extract"]').data({
    	'line': $('div.step:eq(2) div.ribbon:eq(1)'),
    	'text': $('div.step:eq(2) div.ribbon:eq(1) span.text'),
    	'icon': $('div.step:eq(2) div.ribbon:eq(1) img'),
    	'loading': $('div.step:eq(2) h2:eq(1) img'),
    	'step': $('div.step:eq(2)')
    });
    
    $('button[name="extract"]').click( function(e){
    	var button = $(this);
		$.ajax({
			type: 'POST',
			url: 'tasks.php',
			dataType: 'json',
			data: {
				'f': 'extract',
				'target': 'folder1',
				'file': 'file1.zip'
			},
			beforeSend: function(){
				button.data('loading').fadeIn('slow');
			},
			success: function(json){
				button.data('loading').fadeOut('slow');
				button.data('icon').attr('src', 'images/tick_16.png');
				button.data('text').text(json.result);
			},
			error: function(error){
				button.data('loading').fadeOut('slow');
				button.data('icon').attr('src', 'images/warning_16.png');
				button.data('text').text(error.responseText);
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
						return subName(file.name) + ' ' + '<span style="float: right;">[' + size_format(file.size) + ']</span>';
					});
					//$(this).find('div.bottom button[name="upload"]').removeClass('disabled').removeAttr('disabled');
				}
			},
			
			reset: function(){
				//if( options ){ $.extend( settings, options ); }
				$(this).parents('div.step').data('files', null);
				$(this).removeClass('error success').addClass('status').find('img').attr('src', 'images/file_16.png').next('span.text').text('Drop file here.');
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