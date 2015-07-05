<?php
	//Code Author: Aabhas Sharma

			//network credentials
			$servername = 'engr-cpanel-mysql.engr.illinois.edu';
			$database = 'asharm36_test_main';
			$username = 'asharm36_test2';
			$password = 'test123';
			$con = mysqli_connect($servername, $username, $password, $database);
			
			//establish connection
			if($con != 1) die("Unable to connect to MYSQL: ".mysql_error()); //echo "FAIL";
			
			//required variables
			$username = $_POST["username"];
			$password = $_POST["password"];

			//sql operations
			$sql2 = "SELECT * FROM User WHERE username='$username' AND password='$password'";
			$sql3 = "SELECT cause1 FROM Usercause WHERE username='$username'";

			//sql connections
			$data = mysqli_query($con, $sql2);
			$data2 = mysqli_query($con, $sql3);

			//array representing database table columns
			$columns = ["name", "birthdate", "email", "phone", "gender", "username", "password", "address", "cause1"];
			$causes = mysqli_fetch_row($data2);
			$cause1 = $causes[0];

			// If one was found
			if (mysqli_num_rows($data)) 
			{
				$row = mysqli_fetch_row($data);
				array_push($row, $cause1);
				$return = array_combine($columns, $row);
				//var_dump($return);
				echo json_encode($return);
			}

			else {
			 	echo "not found";
			}

			mysqli_close($con);
?>
