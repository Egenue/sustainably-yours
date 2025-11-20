<?php
$marks = 44;
$grade = "";

echo ($marks < 40) ? "Marks = $marks : Grade = E"
    : (($marks < 50) ? "Marks = $marks : Grade = D"
    : (($marks < 60) ? "Marks = $marks : Grade = C"
    : (($marks < 70) ? "Marks = $marks : Grade = B"
    : "Marks = $marks : Grade = A"))); 
// }
// else if($marks  >= 40 && $marks < 50 ){
//     $grade = "D";
// }

// else if($marks  >= 50 && $marks < 60 ){
//     $grade = "C";
// }

// else if($marks  >= 60 && $marks < 70 ){
//     $grade = "B";
// }

// else if($marks  >= 70){
//     $grade = "A";
// }

// echo "Marks = $marks : Grade $grade";
?>