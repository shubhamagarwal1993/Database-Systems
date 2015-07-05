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
			$uname = $_POST["uname"];
			$usr_lat = $_POST["user_lat"];
			$usr_long = $_POST["user_long"];

			//sql query
			$sql3 = "SELECT * FROM 
					(SELECT * , ( 3959 * ACOS( COS( RADIANS( '$usr_lat' ) ) * COS( RADIANS( lat ) ) * COS( RADIANS( longitude ) - RADIANS( '$usr_long' ) ) + SIN( RADIANS('$usr_lat' ) ) * SIN( RADIANS( lat ) ) ) ) AS distance
										FROM Receiver
										HAVING distance <25
										ORDER BY distance
										LIMIT 0 , 10 ) AS SB
					WHERE SB.receiverID NOT IN (Select Interests.receiverID FROM Interests where Interests.username = '$uname')";
			$data = mysqli_query($mysqli, $sql3);

			//if tuples found
			if (mysqli_num_rows($data)) 
			{
				echo json_encode(mysqli_fetch_all($data));
				mysqli_close($mysqli);
			}
			else 
			{
				echo ("not found");
				mysqli_close($mysqli);
			}
?>
