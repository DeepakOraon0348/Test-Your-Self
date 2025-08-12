//get all dropdowns from the document.
const dropdowns=document.querySelectorAll('.dropdown');

//Loop through all dropdown element
dropdowns.forEach(dropdown=>{
  //get inner element from each dropdwon
  const select=dropdown.querySelector('.select');
  const caret=dropdown.querySelector('.caret');
  const menu=dropdown.querySelector('.menu');
  const options=dropdown.querySelectorAll('.menu li');


  select.addEventListener('click',()=>{
    //add the clicked select styles to this select element
    select.classList.toggle('select-clicked');
    
    //add the rotate style to the caret element
    caret.classList.toggle('caret-rotate');

    //Add the open styles to the menu element
    menu.classList.toggle('menu-open');
  })
})

//update the set title and set order
function loadSet(topic, set) {
  // Update right side display
  document.querySelector(".topic-name").textContent = topic;
  document.querySelector(".set-order").textContent = set;

  
  
  
  const start=document.querySelector('.start');
  start.addEventListener('click',function(){
    localStorage.setItem("selectedTopic", topic);
    localStorage.setItem("selectedSet", set);
    window.location.href="../Assets/test.html";
  })
}

  