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
  fetch('http://localhost:3000/toys')
    .then(res => res.json())
    .then(data => data.forEach(renderToy))
  const form = document.querySelector('.add-toy-form');
  form.addEventListener('submit', handleSubmit);
});

const handleSubmit = (e) => {
  e.preventDefault();
  let name = e.target.name.value;
  let url = e.target.image.value;
  let body = {
    name: name,
    image: url,
    likes: 0
  }
  fetch('http://localhost:3000/toys',
   {
     headers: 
    {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    method: 'POST',
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(data => {
      renderToy(data)
      e.target.reset()
    })
}

const renderToy = (toy) => {
  toyCollection = document.querySelector('#toy-collection')
  name = toy.name
  image = toy.image
  likes = toy.likes
  div = document.createElement('div')
  let h2 = document.createElement('h2')
  let img = document.createElement('img')
  let p = document.createElement('p')
  let button = document.createElement('button')
  div.addEventListener('click', handleLike)
  h2.innerText = name
  img.src = image
  img.className = 'toy-avatar'
  p.innerHTML = `<span>${likes}</span> likes`
  button.innerText = 'Like <3'
  div.className = 'card'
  div.id = toy.id
  div.append(h2, img, button, p)
  toyCollection.append(div)
}

const handleLike = (e) => {
  e.preventDefault()
  let id = e.currentTarget.id
  let p = e.currentTarget.querySelector('span')
  let likes = parseInt(p.innerText, 10)
  let img = e.currentTarget.querySelector('img').src
  let name = e.currentTarget.querySelector('h2').innerText
  let body = {
    likes: ++likes
  }
  fetch(`http://localhost:3000/toys/${id}`, 
  { 
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify(body)
  })
    .then(res => {p.innerText++})
}