(function( $ ){

	$.fn.fileDragDrop = function(method, options, callback){
		var settings = {
			'preventDefault': true,
			'dropEffect': true,
			'types': ['dragover', 'dragleave', 'drop']
		};
		
		var methods = {
			init: function(options){
				return this.each( function(){
					if( options ){ $.extend( settings, options ); }
					var scope = $(this);
					$.each(settings.types, function(i, type){
						scope.get(0).addEventListener(type, function(e){
							if(settings.preventDefault){ e.preventDefault(); }
							e.dataTransfer.dropEffect = (settings.dropEffect) ? 'all' : 'none';
							if(callback){ callback.apply(scope, [e]); }
						}, false);
					});
				});
			},
			
			handleFiles: function(options){
				return this.each( function(){
					if(options.attach){ $(this).data('files', options.evt.dataTransfer.files); }
					if(callback){ callback.apply($(this), [options.evt]); }
				});
			}
		};
		
		parseFiles = function(files){
			// currently not used
			return files;
		};
		
		if( methods[method] ){
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if( typeof method === 'object' || ! method ){
			return methods.init.apply( this, arguments );
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.dragdrop');
		}
	};

})( jQuery );
