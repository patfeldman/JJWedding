<?php 
class rsvp extends genericTable{
	const DB_TABLE_NAME = 'std_rsvp'; 
	const DB_UNIQUE_ID = 'rsvp_id'; 	
	public function __construct(){
		parent::__construct(rsvp::DB_TABLE_NAME, rsvp::DB_UNIQUE_ID);
	}
}