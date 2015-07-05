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
			
			//sql queries
			$sql_id = "SELECT * FROM User WHERE username='$uname'";
			$sql_cause = "SELECT cause1 FROM Usercause WHERE username='$uname'";
			$data = mysqli_query($mysqli, $sql_id);
			$columns = ["name", "birthdate", "email", "phone", "gender", "username", "password", "address", "cause1"];
			
			$data2 = mysqli_query($mysqli, $sql_cause);
			mysqli_query($mysqli, $sql_cause);
			$causes = mysqli_fetch_row($data2);
			$cause1 = $causes[0];

			//if tuples found
			 if (mysqli_num_rows($data)) 
			 {
			 	$row = mysqli_fetch_row($data);
			 	array_push($row, $cause1);
			 	$return = array_combine($columns, $row);
			 	echo json_encode($return);
			 }

			 else {
			  	echo "not found";
			}
			mysqli_close($mysqli);
			
?>