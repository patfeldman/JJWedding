<?php

	require_once("database/autoload.php");

	$first_name = $_POST['first_name'];
	$last_name = $_POST['last_name'];
	$email = $_POST['email'];
	$numguests = $_POST['numguests'];
	$campFri = (isset($_POST['campFri']) && $_POST['campFri'] == 'on') ? 1 : 0;
	$campSat = (isset($_POST['campSat']) && $_POST['campSat'] == 'on') ? 1 : 0;
	$teamType = (isset($_POST['teamtype'])) ? $_POST['teamtype'] : "none"; 
	$numParticipants = (isset($_POST['numparticipants'])) ? $_POST['numparticipants'] : 0;
	$team_name = (isset($_POST['team_name'])) ? $_POST['team_name'] : "";

	$isBuilding = $teamType == "none" ? 0 : 1 ;
	$isFreeAgent = $teamType == "rand" ? 1 : 0;


	$sql = "INSERT INTO std_rsvp (first_name, last_name, email, num_guests, 
			camp_friday, camp_saturday, is_building, team_name, num_builders, is_free_agent)
		VALUES ('" . $first_name . "','" . $last_name . "','" . $email . "'," . $numguests 
		. "," . $campFri . "," . $campSat . "," . $isBuilding . ",'" . $team_name 
		. "' , " . $numParticipants . " , " . $isFreeAgent . " )";


	$sql_query=$mysqli->query($sql);
	$mysqli->close();

	$jsonPost = json_encode($_POST);
	echo '{}';