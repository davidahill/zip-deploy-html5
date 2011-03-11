(function( $ ){

	$.fn.dragDrop = function(method, options, callback){
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
			
			handleFile: function(options){
				return this.each( function(){
					if(options.attach){ $(this).data('files', options.evt.dataTransfer.files); }
					console.info($(this).data());
					if(callback){ callback.apply($(this), [options.evt]); }
				});
			}
		};
		
		parseFiles = function(files){
			return files;
		};
		
		if( methods[method] ){
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if( typeof method === 'object' || ! method ){
			return methods.init.apply( this, arguments );
		} else {
			console.info('Method ' +  method + ' does not exist');
		}
	};

})( jQuery );
