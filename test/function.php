<?php
$conn = mysqli_connect("localhost", "root", "", "upload");

if(isset($_FILES["fileImg"]["name"])){
  $totalFiles = count($_FILES['fileImg']['name']);
  $filesArray = array();

  for($i = 0; $i < $totalFiles; $i++){
    $imageName = $_FILES["fileImg"]["name"][$i];
    $tmpName = $_FILES["fileImg"]["tmp_name"][$i];

    $imageExtension = explode('.', $imageName);

    $name = $imageExtension[0];
    $imageExtension = strtolower(end($imageExtension));

    $newImageName = $name . " - " . uniqid(); // Generate new image name
    $newImageName .= '.' . $imageExtension;

    move_uploaded_file($tmpName, 'uploads/' . $newImageName);
    $filesArray[] = $newImageName;
  }

  $filesArray = json_encode($filesArray);
  $query = "INSERT INTO tb_upload VALUES('', '$filesArray')";
  mysqli_query($conn, $query);
  echo "Success";
}
else{
  echo "Please Fill Out The Form!";
}
?>
