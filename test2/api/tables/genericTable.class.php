<?php
class genericTable{
	protected $db;
	protected $dbName;
	protected $last_id;
	protected $unique_id; // UNIQUE TABLE IDENTIFIER HAS TO BE VAR 1
	protected $sql_query;
	protected $variables;
	
	public function __construct($dbName, $unique_id){
		global $mysqli; 
		$this->db = $mysqli;
		$this->variables = array(); 
		$this->dbName = $dbName;
		$this->unique_id = $unique_id;
	}

	public function __destruct(){
		if (isset($this->sql_query) && ($this->sql_query != null))
			$this->sql_query->close();
	}


	public function set_variable($varName, $value){$this->variables[$varName]=$value;}
	public function get_variable($varName){return $this->variables[$varName];}
		
	public function reset_query(){
		if ($this->sql_query  && isset($this->sql_query)){
			$this->sql_query->free();
			$this->sql_query=NULL;
		}
		foreach ($this->variables as $key => $value){
			$this->variables = array();
		}
	}
		
	public function loadRowInformation($row){
		foreach ($row as $key => $value){
			$this->variables[$key] = $row[$key];
		}

	}
		
	public function createNew(){
		if (!empty($this->variables[$this->unique_id]) && $this->countAll() > 0) { 
			return $this->update();
		}else{
			$this->db->query("INSERT INTO " . $this->dbName . " " . $this->getSetString());
			return $this->last_id=$this->db->insert_id;
		}
	}
		
	public function update(){
		$this->db->query("UPDATE " . $this->dbName . " " . $this->getSetString(). " WHERE " . $this->unique_id . "='" . $this->variables[$this->unique_id] . "'" );
		return $this->last_id = $this->get_variable($this->unique_id);
	}
	
	public function delete($whereClause=''){
		if ($whereClause == ''){
			$whereClause = $this->getWhereString();
		}
		$sql = "DELETE FROM "  . $this->dbName . " " . $whereClause;
		return $this->db->query($sql);
	}
	

	public function load($extraWhere='', $selectValue='*', $loadRow = true, $orderby=''){
		$sql = "SELECT ".$selectValue." FROM " . $this->dbName . " " . $this->getWhereString($extraWhere);
		$sql .= $orderby;	
		$this->sql_query=$this->db->query($sql);
		if (($this->sql_query && $loadRow) && $row = $this->sql_query->fetch_assoc() ) 
			$this->loadRowInformation($row);
		else
			return !$loadRow;
		return true;
	}
	public function loadOr($extraWhere='', $selectValue='*', $loadRow = true, $orderby=''){
		$sql = "SELECT ".$selectValue." FROM " . $this->dbName . " " . $this->getWhereString($extraWhere, false);
		$sql .= $orderby;	
		$this->sql_query=$this->db->query($sql);
		if (($this->sql_query && $loadRow) && $row = $this->sql_query->fetch_assoc() ) 
			$this->loadRowInformation($row);
		else
			return !$loadRow;
		return true;
	}

	public function loadAndReturnEntireObject($extraWhere='', $selectValue='*', $loadRow = true, $orderby=''){
		$sql = "SELECT ".$selectValue." FROM " . $this->dbName . " " . $this->getWhereString($extraWhere, false);
		$sql .= $orderby;	
		$this->sql_query=$this->db->query($sql);
		$rows = array();
		if ($this->sql_query){			
			while($r = $this->sql_query->fetch_assoc()) {
			    $rows[] = $r;
			}
		}
		return $rows;		
	}
	
		
			
	public function loadNext($extraWhere='', $orderby=''){
		if ($this->sql_query  && isset($this->sql_query)){
			if ($row = $this->sql_query->fetch_assoc() ) 
				$this->loadRowInformation($row);
			else
				return false;
		}else{
			return $this->load($extraWhere, '*', true, $orderby );
		}
		return true;
	}

	public function loadNextOr($extraWhere='', $orderby=''){
		if ($this->sql_query  && isset($this->sql_query)){
			if ($row = $this->sql_query->fetch_assoc() ) 
				$this->loadRowInformation($row);
			else
				return false;
		}else{
			return $this->loadOr($extraWhere, '*', true, $orderby );
		}
		return true;
	}

	public function loadNextFromSql($sql){
		if (!$this->sql_query  || !isset($this->sql_query)){
			$this->sql_query=$this->db->query($sql);
		}
		if ($row = $this->sql_query->fetch_assoc() ) 
			$this->loadRowInformation($row);
		else
			return false;
		return true;
	}




	private function getSetString()
	{
		$set = "";
		foreach ($this->variables as $key => $value){
			if ($key == $this->unique_id) continue;
			if (isset($this->variables[$key])) $set.= $key . "='" . $this->variables[$key] . "', " ;
		}
		if (!empty($set))
			$set = "SET " . substr($set, 0, strrpos($set, ','));
		return $set;
	}

	public function getWhereString($extraWhere='', $useAnd = true)
	{
		$where = "";
		$conjunction = ($useAnd) ? "AND" : "OR";
		if (!empty($this->variables[$this->unique_id]) ){
			$where = "WHERE " . $this->unique_id . "='" . $this->variables[$this->unique_id] . "'";
		} else {
			foreach ($this->variables as $key => $value){
				if ($key == $this->unique_id) continue;
				if ($this->variables[$key]!=='') {
					$where .= $key . "='" . $this->variables[$key] . "' " . $conjunction . " ";
				}
			}
			if (!empty($where))
				$where = "WHERE " . substr($where, 0, strripos($where, $conjunction));			
		}
		if (!empty($extraWhere)){
			if (!empty($where)){
				$where .= " ". $conjunction ." " . $extraWhere . " ";
			} else {
				$where = " WHERE " . $extraWhere . " ";
			}
		}
		return $where;
	}
		
	public function countAll($extraWhere='', $orderby='', $selectValue='*')
	{
		$numRows=0;
		if ($this->load($extraWhere, $selectValue, false, $orderby))
			$numRows = mysqli_num_rows($this->sql_query);			
		return intval($numRows);
	}

	public function numRows()
	{
		$numRows = mysqli_num_rows($this->sql_query);			
		return intval($numRows);
	}

	public function generateHtmlTable($sql=null){
		$tableHeader = "\t<thead>\n\t\t<tr>\n\t\t<th>Index</th>\n";
		$tableBody = "\t<tbody>\n";
		$first = true;
		$counter =1;
		if ($sql != null){
			while ($this->loadNextFromSql($sql)){
				$tableBody.= "\t\t<tr>\n\t\t<td>" . $counter++ . "</td>";
				foreach ($this->variables as $key => $value){
					if ($first)	$tableHeader .= "\t\t<th>" . $key . "</th>\n";
					$tableBody .= "\t\t<td class='".$key."'>" . $value . "</td>\n";
				}
				$tableBody .= "\t</tr>\n";
				$first = false;			
			}
		} else {
			while ($this->loadNext()){
				$tableBody.= "\t\t<tr>\n\t\t<td>" . $counter++ . "</td>";
				foreach ($this->variables as $key => $value){
					if ($first)	$tableHeader .= "\t\t<th>" . $key . "</th>\n";
					$tableBody .= "\t\t<td class='".$key."'>" . $value . "</td>\n";
				}
				$tableBody .= "\t</tr>\n";
				$first = false;			
			}
		}
		$tableBody.="\t</tbody>\n";
		$tableHeader.="\t</thead>\n";
		
		$table = "<table>\n" . $tableHeader . $tableBody . "</table>\n";
		return $table;
	}

	public function createGenericObject(){
		while ($this->loadNext()){
			$tableBody.= "\t\t<tr>\n\t\t<td>" . $counter++ . "</td>";
			foreach ($this->variables as $key => $value){
				if ($first)	$tableHeader .= "\t\t<th>" . $key . "</th>\n";
				$tableBody .= "\t\t<td class='".$key."'>" . $value . "</td>\n";
			}
			$tableBody .= "\t</tr>\n";
			$first = false;			
		}
		return $table;
	}

	
	public function debug(){
		$currentFieldsString = print_r($this->variables, true);
		$updateString = "UPDATE " . $this->dbName . " " . $this->getSetString(). " WHERE " . $this->unique_id . "='" . $this->variables[$this->unique_id] . "'" ;
		$loadString = "SELECT * FROM " . $this->dbName . " " . $this->getWhereString();
		$createString = "INSERT INTO " . $this->dbName . " " . $this->getSetString();

		return "DB=" . $this->dbName . "\nUniqueIDName=". $this->unique_id . 
			"\nFields=" . $currentFieldsString . "\nUpdateString=" . $updateString . "\nLoad = " . $loadString . "\nCreate = " . $createString ;
	}
}