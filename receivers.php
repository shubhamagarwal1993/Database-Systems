<?php
	//Code Author: Aabhas Sharma

			//echo ("Website is temporarily down. Currently running tests.");
			//network credentials
			$servername = 'engr-cpanel-mysql.engr.illinois.edu';
			$database = 'asharm36_test_main';
			$username = 'asharm36_test2';
			$password = 'test123';
			$mysqli = mysqli_connect($servername, $username, $password, $database);
			
			//establish connection
			if($mysqli != 1) die("Unable to connect to MYSQL: ".mysql_error());

			//required variables
			$cause1 = $_POST["cause1"];
			$usr_lat = $_POST["user_lat"];
			$usr_long = $_POST["user_long"];

			//sql queries
			$sql_cause = "SELECT * FROM Receiver WHERE cause LIKE '$cause1'";
			$data = mysqli_query($mysqli, $sql_cause);

			//encode as an object
			echo json_encode(mysqli_fetch_all($data));
			
			//close connection
			mysqli_close($mysqli);		
?>
