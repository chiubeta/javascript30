<?php
require_once('DBlink.php');

$sql = "SELECT * FROM js30_01_drum_kit WHERE id=" . $_POST['id'];
$result = mysql_query($sql,$database_link);
while( $row = mysql_fetch_assoc($result) ){ 
	$creator = $row["creator"];
	$rhythm = $row["rhythm"];
	$recordTime = $row["recordTime"];

	echo json_encode($row);
} 

mysql_close($database_link);
?>