<?php
$hostname= "localhost"; //主機名稱
$database= "chiubeta"; //資料庫名稱
$username= "yichin"; //資料庫登入帳號
$password= "Chiu420184"; //資料庫登入密碼
 
$database_link = mysql_connect($hostname, $username, $password);
if (!$database_link) {
    die("Connection failed: " . mysqli_connect_error());
}
mysql_select_db($database, $database_link); 
mysql_query("set names 'utf8'", $database_link);
mysql_query("set time_zone = 'America/Los_Angeles'", $database_link);
?>