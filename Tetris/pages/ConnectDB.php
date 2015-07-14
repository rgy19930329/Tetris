
<?php 

$host = "w.rdc.sae.sina.com.cn:3307";
$name = "03nz3zyo34";
$password = "xixwz4m35xhmj1y5jwz5whwx32j321k0w2kji010";
$dbname = "app_kylinresume";

$conn = mysql_connect($host, $name, $password);
if (!$conn){
  	die("Connect Fail");
}

mysql_select_db($dbname, $conn);


?>

