<?php

require('config.php');

foreach($targets as $key => $target){
	if(!is_dir($key)){
    	mkdir($key, 0644);
	}
}

if(!is_dir($uploaddir)){
    mkdir($uploaddir, 0644);
}

Header( "Location: /" );

?>