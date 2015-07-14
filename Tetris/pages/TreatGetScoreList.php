
<?php include("ConnectDB.php") ?>
<?php include("SQLUtils.php") ?>

<?php
    
    $level = $_POST["level"];
    
    try{
    	$scoreList = getScoreList($level);
    	echo $scoreList;
    }catch(Exception $e){
    	echo $e;
    }
	
?>

<?php mysql_close($conn); ?>
