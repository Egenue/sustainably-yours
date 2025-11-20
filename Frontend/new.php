<?php
function number(){
    static $num = 5;
    $num =$num++;
}

echo number();
echo number();
?>