<?php
require_once('DBlink.php');

$sql = "INSERT INTO js30_01_drum_kit (creator, rhythm, recordTime) VALUES ('" . $_POST["name"] . "', '" . $_POST["rhythm"] . "'," . $_POST["recordTime"] . ")";

mysql_query($sql,$database_link);

mysql_close($database_link);
?>