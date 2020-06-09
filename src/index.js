let addToy = false
const url = "http://localhost:3000/toys"
const addBtn = () => document.querySelector("#new-toy-btn")
const toyFormContainer = () => document.querySelector(".container")
const toyForm = () => document.querySelector(".add-toy-form")

document.addEventListener("DOMContentLoaded", () => {
  allToys()
  addBtn().addEventListener('click', toggleForm)
  toyForm().addEventListener('submit', handleSubmit)
})

function handleSubmit(e) {
  e.preventDefault()
  createNewToy(e.target.name.value, e.target.image.value)
  debugger
  e.target.reset()
}

function createNewToy(name, imageURL) {
  fetch(url, {
    method: "POST", 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name: name,
      image: imageURL,
      likes: 0
    })
  }).then(resp => resp.json())
  .then(renderOneToy)
}

function toggleForm() {
  addToy = !addToy;
    if (addToy) {
      toyFormContainer().style.display = "block";
    } else {
      toyFormContainer().style.display = "none";
    }
}

function allToys() {
  fetch(url)
  .then(resp => resp.json())
  .then(toys => renderToys(toys))
}

function renderToys(toys) {
  for(toy of toys) {
    renderOneToy(toy)
  }
}

function renderOneToy(toy){
  let toyContainer = document.querySelector("#toy-collection")
  let div = document.createElement('div')
  div.className = 'card'

  let name = document.createElement('h2')
  let img = document.createElement('img')
  let button = document.createElement('button')
  let likes = document.createElement('p')

  name.textContent = toy.name
  img.src = toy.image
  img.className = "toy-avatar"
  likes.textContent = `${toy.likes} Likes`
  button.textContent = "Like <3"
  button.addEventListener("click", (e) => handleLike(e, toy.id))

  div.append(name, img, button, likes)

  toyContainer.appendChild(div)
}

function handleLike(e, id) {
  let likesEl = e.target.nextElementSibling
  let likes = parseInt(likesEl.textContent.split(" ")[0]) + 1
  fetch(`${url}/${id}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({likes: likes})
  }).then(r => r.json())
  .then(() => {
    likesEl.textContent = `${likes} Likes`
  })
}


