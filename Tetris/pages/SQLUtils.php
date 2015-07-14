
<?php 

    function getTableName($level){
        $tableName = "ranklist1_tb";
        switch ($level) {
            case '1':
                $tableName = "ranklist1_tb";
                break;
            case '2':
                $tableName = "ranklist2_tb";
                break;
            case '3':
                $tableName = "ranklist3_tb";
                break;
            case '4':
                $tableName = "ranklist4_tb";
                break;
            case '5':
                $tableName = "ranklist5_tb";
                break;
            default:
                break;
        }
        return $tableName;
    }


    function updateScoreList($level, $name, $score){
        
        $tableName = getTableName($level);

        $sql = "SELECT score FROM $tableName WHERE name='$name'";
        $res = mysql_query($sql);
        //未找到该姓名记录就插入一条
        if(!mysql_affected_rows()){
            $sql = "INSERT INTO $tableName (name, score) VALUES ('$name', '$score')";
            mysql_query($sql);
        }else{//若找到该姓名记录，比较两个score，用较大值更新记录
            $row = mysql_fetch_array($res);
            $prescore = $row["score"];
            if($score > $prescore){
                $sql = "UPDATE $tableName SET score='$score' WHERE name='$name'";
                mysql_query($sql);
            }
        }
    }


	function getScoreList($level){
        $tableName = getTableName($level);

        $sql = "SELECT name, score FROM $tableName order by score desc limit 15";
        $res = mysql_query($sql);
        $temp = array();
        while($row = mysql_fetch_assoc($res)){
            array_push($temp, $row);
        }
        return json_encode($temp);
    }


?>
