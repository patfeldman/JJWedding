<?php
	if ($_SERVER['REMOTE_ADDR'] == '::1' || $_SERVER['HTTP_HOST']=='localhost'){
		include_once('autoload_local.php');
	}else{ 
		include_once('autoload_remote.php');
	}	
	date_default_timezone_set('America/New_York');

	$mysqli = new mysqli($host, $user, $password, $databaseName);
	if($mysqli->connect_errno > 0){
   		die('Unable to connect to database [' . $mysqli->connect_error . ']');
	}

	function __autoload($className)
	{
		$ar_class_directories = array(LOCATION . 'api/tables/', 
									  LOCATION . 'api/database/', 
									  LOCATION );

		foreach ($ar_class_directories as $directory) {
	        if(file_exists($directory.$className.'.class.php') ){
				require_once $directory.$className.'.class.php';
				return;
			}
		}
	}
	