<?php

if($_SERVER['HTTP_X_TASK'] == 'upload'){
	$results['success'] = false;
	
	$current = file_get_contents('php://input');

	$zip = new ZipArchive;
	if($zip->open($current)){
		$file = './uploads/' . $_SERVER['HTTP_X_FILE_NAME'];
		file_put_contents($file, $current);
		
		$results['name'] = $_SERVER['HTTP_X_FILE_NAME'];
		$results['size'] = $_SERVER['CONTENT_LENGTH'];
		
		//$results['result'] = $results['name'] . ' successfully uploaded - ' . round($results['size']/1048576, 2) . ' MBs';
		$results['result'] = 'Success';
		$results['success'] = true;
	}
	
	if($results['success'] == true){
		echo header('HTTP/1.0 200 Ok');
		echo json_encode( $results );
	} else {
		echo header('HTTP/1.0 400 Bad Request');
		$results['result'] = 'Not an archive file, please try again.';
		echo $results['result'];
	}
	
} else if($_POST['f'] == 'purge'){
	$results['success'] = false;
		
	if(is_dir($_POST['target'])){
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
		
		$purged = false;
		if(deleteDirectory($_POST['target'])){
			if(mkdir($_POST['target'])){
				$purged = (sizeof(scandir($_POST['target'])) == 2) ? true : false;
			}
		}
		
		if($purged){
			$results['success'] = true;
			$results['result'] = 'Purge successful.';
		} else {
			$results['result'] = 'Unable to purge, try again.';
		}
	} else {
		$results['result'] = 'Invalid path.';
	}
	
	if($results['success'] == true){
		echo header('HTTP/1.0 200 Ok');
		echo json_encode( $results );
	} else {
		echo header('HTTP/1.0 400 Bad Request');
		echo $results['result'];
	}
	
} else if($_POST['f'] == 'extract'){
	$results['success'] = false;
		
	if(is_dir($_POST['target'])){
		$zip = new ZipArchive;
		if($zip->open('./uploads/' . $_POST['file']) === TRUE){
			$zip->extractTo($_POST['target']);
			$results['numOfFiles'] = $zip->numFiles;
			$zip->close();
			
			$results['result'] = $results['numOfFiles'] . ' file(s) extracted.';
			$results['success'] = true;
		} else {
			$results['result'] = 'Invalid archive.';
		}
	} else {
		$results['result'] = 'Invalid path.';
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