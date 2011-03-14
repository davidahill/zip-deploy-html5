<?php

if($_POST['f'] == 'purge'){
	$results['success'] = false;
	
	if(isset($_POST['target'])){
		function deleteDirectory($dir) {
			if(!file_exists($dir)) return true;
			if(!is_dir($dir) || is_link($dir)) return unlink($dir);
			foreach(scandir($dir) as $item){
				if($item == '.' || $item == '..') continue;
				if(!deleteDirectory($dir . "/" . $item)){
					chmod($dir . "/" . $item, 0777);
					if (!deleteDirectory($dir . "/" . $item)) return false;
				};
			}
			return rmdir($dir);
		}
		
		deleteDirectory($target);
		mkdir($target);
		
		$purged = (sizeof(scandir($target)) == 2) ? true : false;
		
		if($purged){
			$results['success'] = true;
			$results['result'] = 'Purge successful.';
		} else {
			$results['result'] = 'Unable to purge, try again.';
		}
	}
	
	if($results['success'] == true){
		echo header('HTTP/1.0 200 Ok');
		echo json_encode( $results );
	} else {
		echo header('HTTP/1.0 400 Bad Request');
		echo $results['result'];
	}
	
} else {
	$results['success'] = false;
	$results['result'] = 'Invalid task.';
	echo header('HTTP/1.0 400 Bad Request');
	echo $results['result'];
}

?>