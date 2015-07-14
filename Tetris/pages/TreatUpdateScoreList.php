
<?php include("ConnectDB.php") ?>
<?php include("SQLUtils.php") ?>

<?php
    
    $level = $_POST["level"];
    $name = $_POST["name"];
    $score = $_POST["score"];
    
    try{
    	updateScoreList($level, $name, $score);
    	echo "ok";
    }catch(Exception $e){
    	echo $e;
    }
	
?>

<?php mysql_close($conn); ?>

