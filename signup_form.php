<?php
	//Code Author: Aabhas Sharma

			//echo ("Website is temporarily down. Currently running tests.");
			$servername = 'engr-cpanel-mysql.engr.illinois.edu';
			$database = 'asharm36_test_main';
			$username = 'asharm36_test2';
			$password = 'test123';
			$mysqli = mysqli_connect($servername, $username, $password, $database);
			
			////establish connection
			if($mysqli != 1) die("Unable to connect to MYSQL: ".mysql_error());
			
			//required variables
			$name = $_POST["signup_name"];
			$birthdate = $_POST["signup_birthdate"];
		  	$email = $_POST["signup_email"];
			$phone = $_POST["signup_phone"];
			$gender = $_POST["signup_gender"];
			$username = $_POST["signup_username"];
			$password = $_POST["signup_password"];
			$address = $_POST["signup_address"];

			//default value
			$cause = "Health";
			
			//sql queries
			$sql0 = "SELECT * from User WHERE username='$username'";
			$data = mysqli_query($mysqli, $sql0);
			
			//if tuples found
			if (mysqli_num_rows($data)) 
			{
				mysqli_close($mysqli);
				header( 'Location: http://web.engr.illinois.edu/~asharm36/login.html?exists=13' ) ;
			}
			else
			{
				$sql2 = "INSERT INTO User(name, birthdate, email, phone, gender, username, password, address) VALUES ('" . $name . "', '" . $birthdate . "', '" . $email . "', '" . $phone . "', '" . $gender . "', '" . $username . "', '" . $password . "', '" . $address . "')";
				$sql3 = "INSERT INTO Usercause(username, cause1) VALUES ('" . $username . "', '" . $cause . "')";
				mysqli_query($mysqli, $sql3);
				if (mysqli_query($mysqli, $sql2)) {
			    		
				} else {
			    		echo "Error: " . $sql2 . "<br>" . $mysqli->error;
				}
				mysqli_close($mysqli);
				header( 'Location: http://web.engr.illinois.edu/~asharm36/login.html?exists=7' ) ;	
			}
?>
		