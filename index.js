$(function() {
	/*
	$.fn.fileEvent = function(type, callback){
		return this.each( function(){
			var $this = $(this);
			$($this).get(0).addEventListener(type, function(e){
				if( callback ){
					callback.apply($this, [e]);
				}
			}, false);
		});
	};
	*/
	
	$.fn.fileEvent = function(method, options, callback){
		var settings = {
			'preventDefault': true,
			'dropEffect': false
		};
		
		var methods = {
			dragover: function(options){
				return this.each(function(){
					if( options ){ $.extend( settings, options ); }
					
					$(this).get(0).addEventListener(method, function(e){
						if(settings.preventDefault){ e.preventDefault(); }
						e.dataTransfer.dropEffect = (settings.dropEffect) ? 'all' : 'none';
						if(callback){ callback.apply($(this), [e]); }
					}, false);
				});
			},
			
			dragleave: function(options){
				return this.each(function(){
					if( options ){ $.extend( settings, options ); }
					
					$(this).get(0).addEventListener(method, function(e){
						if(settings.preventDefault){ e.preventDefault(); }
						e.dataTransfer.dropEffect = (settings.dropEffect) ? 'all' : 'none';
						if(callback){ callback.apply($(this), [e]); }
					}, false);
				});
			},
			
			drop: function(options){
				return this.each(function(){
					if( options ){ $.extend( settings, options ); }
					
					$(this).get(0).addEventListener(method, function(e){
						if(settings.preventDefault){ e.preventDefault(); }
						e.dataTransfer.dropEffect = (settings.dropEffect) ? 'all' : 'none';
						if(callback){ callback.apply($(this), [e]); }
					}, false);
				});
			}
		}
		
		if( methods[method] ){
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if( typeof method === 'object' || ! method ){
			//return methods.init.apply( this, arguments );
			console.info('Must supply method');
		} else {
			console.info('Method ' +  method + ' does not exist');
		}
	}
	
	$.fn.attachFile = function(e){
		if(e.dataTransfer){
			var files = e.dataTransfer.files;
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
	};
	
	$('div.step.drop div.bottom p.status').hover(
		function(){ $(this).find('img').attr('src','images/delete_16.png') },
		function(){ $(this).find('img').attr('src','images/file_16.png') }
	).find('img').click( function(){
		console.info('delete click');
	});
	
	$('div.step.drop').fileEvent('dragover', {dropEffect: true}, function(e){
		if(e.dataTransfer.mozItemCount > 1 && !$(this).find('div.bottom p.status').hasClass('success')){
			e.dataTransfer.dropEffect = 'none';
			$(this).find('div.bottom p.status').addClass('error').html( function(){
				return '<img src="images/warning_16.png" />Only 1 file allowed.';
			});
		} else {
			e.dataTransfer.dropEffect = 'all';
		}
	});
	
	$('div.step.drop').fileEvent('dragleave', {dropEffect: true}, function(e){
		if(!$(this).find('div.bottom p.status').hasClass('success')){
			$(this).find('div.bottom p.status').removeClass('error').html( function(){
				return '<img src="images/file_16.png" />Ready...';
			});
		}
	});
	
	$('div.step.drop').fileEvent('drop', {dropEffect: true}, function(e){
		$(this).attachFile(e);
	});
	
	$('div.fileCatch, div.step.nodrop').fileEvent('dragover');
	$('div.fileCatch, div.step.nodrop').fileEvent('dragleave');
	$('div.fileCatch, div.step.nodrop').fileEvent('drop');
	
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