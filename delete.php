<?php
	//Code Author: Aabhas Sharma

			//echo ("Website is temporarily down. Currently running tests.");
			$servername = 'engr-cpanel-mysql.engr.illinois.edu';
			$database = 'asharm36_test_main';
			$username = 'asharm36_test2';
			$password = 'test123';
			$mysqli = mysqli_connect($servername, $username, $password, $database);
			
			//establish connection
			if($mysqli != 1) die("Unable to connect to MYSQL: ".mysql_error()); //echo "FAIL";
			
			//required variables
			$uname = $_POST['rem_name'];
			
			//sql operations
			$sql3 = "DELETE from User WHERE username='$uname'";
			
			//if connection is made, perform sql op and switch pages
			if(mysqli_query($mysqli, $sql3))
			{
				mysqli_close($mysqli);
				header( 'Location: http://web.engr.illinois.edu/~asharm36?delete=13' );
			}
			//if connection isn't made, close sql connection and switch pages
			else
			{
				mysqli_close($mysqli);
				header( 'Location: http://web.engr.illinois.edu/~asharm36?delete=7' );
			}		
			
?>
