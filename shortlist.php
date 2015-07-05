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
			$recvr_id = $_POST["id"];
			$uname = $_POST["user"];

			//sql queries
			$sql3 = "SELECT * FROM Interests WHERE username='$uname' AND receiverID='$recvr_id'";
			$data = mysqli_query($mysqli, $sql3);

			if (mysqli_num_rows($data) || $recvr_id == 99) 
			{
				$sql_recvr = "SELECT * FROM Receiver INNER JOIN Interests ON Receiver.receiverID = Interests.ReceiverID where Interests.username = '$uname' ORDER BY Receiver.name";	
				$shortlisted = mysqli_query($mysqli, $sql_recvr);
				//array_push($shortlisted, "found");
				echo json_encode(mysqli_fetch_all($shortlisted));
				mysqli_close($mysqli);
			}
			else
			{
				$sql2 = "INSERT INTO Interests(username, receiverID) VALUES ('" . $uname . "', '" . $recvr_id . "')";
				$sql_recvr = "SELECT * FROM Receiver INNER JOIN Interests ON Receiver.receiverID = Interests.ReceiverID where Interests.username = '$uname' ORDER BY Receiver.name";	
				if (mysqli_query($mysqli, $sql2)) {
			   		 	//echo "Inserted";
			   		 	$shortlisted = mysqli_query($mysqli, $sql_recvr);
						echo json_encode(mysqli_fetch_all($shortlisted));
				} else {
			    		echo "Error: " . $sql2 . "<br>" . $mysqli->error;
				}
				mysqli_close($mysqli);
			}
?>
