// globals
// these save the html to reset back and forth on button press
var prePress, postPress;


function redirect(where) {
  return location.href = where;
}

function loadForm() {
  document.getElementById('reviewBtn').style.display = 'none';
  document.getElementById('reviewForm').style.display = 'block';
}
 function closeForm() {
   document.getElementById('reviewBtn').style.display = 'block';
   document.getElementById('reviewForm').style.display = 'none';
 }
