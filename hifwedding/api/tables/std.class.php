<?php 
class std extends genericTable{
	const DB_TABLE_NAME = 'std_guests'; 
	const DB_UNIQUE_ID = 'std_id'; 	
	public function __construct(){
		parent::__construct(std::DB_TABLE_NAME, std::DB_UNIQUE_ID);
	}
}