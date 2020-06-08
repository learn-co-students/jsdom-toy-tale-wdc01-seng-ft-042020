let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  loadToys();
  newToy();

});

function handleLike(e) {
  e.preventDefault()
  // conditionally render like without reloading

  let card = e.target.parentNode;

  //get like info
  let pTag = card.querySelector('p')
  let numberOfLikes = parseInt(pTag.innerText.split(' ')[0]);
  typeof numberOfLikes === 'number' ? numberOfLikes += 1 : console.log('Error');
  
  //get id info
  let cardID = card.id.split('-')[1]
  console.log(cardID);
  // update server

  fetch(`http://localhost:3000/toys/${cardID}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": numberOfLikes
    })
  })
  .then(response => response.json())
  .then(data => {
    updateLikeRender(data)
  })
}

function updateLikeRender(data) {
  const card = document.querySelector(`div#toy-${data.id}`)
  const pTag = card.querySelector(`p`)
  pTag.innerText = `${data.likes} Likes`

}

function handleSubmit(e){
  
  e.preventDefault();
  const newName = e.target.name.value;
  const newImage = e.target.image.value;
  e.target.reset();
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "name": `${newName}`,
      "image": `${newImage}`,
      "likes": 0
    })
  })
  .then( response => response.json() )
  .then( toyData => renderToy(toyData))
}

function newToy(){

  const form = document.querySelector('form.add-toy-form');

  form.addEventListener("submit", handleSubmit);

}


function loadToys() {

  fetch('http://localhost:3000/toys')
  .then( response => response.json() )
  .then( data => {
    data.forEach((toy) => {
      renderToy(toy)
    })  
    // console.log(data) 
    
  })
}

function renderToy(toyObject) {
  
  // find container
  const collection = document.querySelector('div#toy-collection')
  
  //create card
  let card = document.createElement('div');
  card.className = 'card';
  card.id = `toy-${toyObject.id}`

  //create data nodes
  let toyName = document.createElement('h2');
  let toyImage = document.createElement('img');
  let toyLikes = document.createElement('p');
  let toyButton = document.createElement('button');

  //add info to nodes
  toyName.innerText = toyObject.name;
  toyImage.src = toyObject.image;
  toyImage.className = 'toy-avatar';
  toyLikes.innerText = `${toyObject.likes} Likes`;
  toyButton.className = "like-button";
  toyButton.innerText = 'Like <3';
  toyButton.addEventListener("click", handleLike)
  
  //add nodes to card
  card.appendChild(toyName);
  card.appendChild(toyImage);
  card.appendChild(toyLikes);
  card.appendChild(toyButton);
  
  //add card to container
  collection.appendChild(card)
  

}