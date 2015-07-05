<?php
	//Code Author: Aabhas Sharma		

			//echo ("Website is temporarily down. Currently running tests.");
			$servername = 'engr-cpanel-mysql.engr.illinois.edu';
			$database = 'asharm36_test_main';
			$username = 'asharm36_test2';
			$password = 'test123';
			$mysqli = mysqli_connect($servername, $username, $password, $database);
			
			//establish connection
			if($mysqli != 1) die("Unable to connect to MYSQL: ".mysql_error());

			//required variables
			$uname = $_POST["name"];
			$cause = $_POST["cause"];
		  	$email = $_POST["email"];
			$password = $_POST["password"];
			$phone = $_POST["phone"];
			$address = $_POST["address"];
			
			//sql queries
			$sql2 = "UPDATE User SET email='$email', phone=$phone, password='$password', address='$address' WHERE username='$uname'";
			$sql3 = "UPDATE Usercause SET cause1='$cause' WHERE username = '$uname'";
			mysqli_query($mysqli, $sql3);
			
			//if query is made
			if (mysqli_query($mysqli, $sql2))
			{
					mysqli_close($mysqli);
					header( 'Location: http://web.engr.illinois.edu/~asharm36/profile.html?update=1' ) ;
			} else {
					//echo "update failed";
					mysqli_close($mysqli);
					header( 'Location: http://web.engr.illinois.edu/~asharm36/profile.html?update=0' ) ;
			}
?>
