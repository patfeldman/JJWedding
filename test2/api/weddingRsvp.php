<?php

	require_once("database/autoload.php");

	$first_name = $_POST['first_name'];
	$last_name = $_POST['last_name'];
	$email = $_POST['email'];
	$numguests = $_POST['numguests'];
	$campFri = (isset($_POST['campFri']) && $_POST['campFri'] == 'on') ? 1 : 0;
	$campSat = (isset($_POST['campSat']) && $_POST['campSat'] == 'on') ? 1 : 0;
	$buildingBox = (isset($_POST['buildingBox']) && $_POST['buildingBox'] == 'on') ? 1 : 0;
	$team_name = $_POST['team_name'];

	$sql = "INSERT INTO std_rsvp (first_name, last_name, email, num_guests, 
			camp_friday, camp_saturday, is_building, team_name)
		VALUES ('" . $first_name . "','" . $last_name . "','" . $email . "'," . $numguests 
		. "," . $campFri . "," . $campSat . "," . $buildingBox . ",'" . $team_name . "')";


	$sql_query=$mysqli->query($sql);
	$mysqli->close();

	echo '{}';