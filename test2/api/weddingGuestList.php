<?php

	require_once("database/autoload.php");
	$rsvp = new rsvp();
	echo $rsvp->generateHtmlTable();