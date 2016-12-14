<?php
require_once('DBlink.php');

$sql = "SELECT * FROM js30_01_drum_kit ORDER BY id";
$result = mysql_query($sql,$database_link);
while( $row = mysql_fetch_assoc($result) ){ 
	$id = $row["id"];
	$creator = $row["creator"];

	$loadButton = '<button class="loadButton" data-id=' . $row["id"] . '>' . $row["creator"] . '</button>';
	echo $loadButton;
} 

mysql_close($database_link);
?>