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
  fetch("http://localhost:3000/toys")
    .then(resp => resp.json())
    .then(toyAry => toyAry.forEach(renderOneToy))

  toyFormContainer.addEventListener("submit", handleNewToy);

});
//https://vignette.wikia.nocookie.net/disneyvillains/images/0/0a/Lots-O%27-Huggin%27-Bear.jpg
//https://vignette.wikia.nocookie.net/disney/images/1/11/Profile_-_Jessie.jpeg
function handleNewToy(e) {
    e.preventDefault()
    let newToy = {name: e.target[0].value, image: e.target[1].value, likes: '0'}
    // debugger
    fetch('http://localhost:3000/toys', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(newToy)
    })
    .then(resp => resp.json())
    .then( ty => renderOneToy(ty))
    .then( () => alert("Your new toy is at the bottom!"))
    .catch( () => alert("The JSON server is unavailable. This new toy will not be saved."))
}


function handleLikeClick(e) {

    let toyID = e.target.id.split("-")[1]
    let currentLikes = parseInt(e.target.parentNode.querySelector("p").innerText.split(' ')[0])
    let upObj = {"likes": `${currentLikes + 1}`}

    e.target.parentNode.querySelector("p").innerText = `${upObj.likes} likes`
        // this updates the display without refreshing the screen
    fetch(`http://localhost:3000/toys/${toyID}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(upObj)
    })
    .catch( () => alert("The JSON server is unavailable. This Like will not be saved."))
}


function renderOneToy(toy) {
    toyCollection = document.querySelector("#toy-collection")
    toyDiv = document.createElement("div")
    toyDiv.className = "card"

    nomen = document.createElement("h2")
    nomen.innerText = toy.name

    pic = document.createElement("img")
    pic.src = toy.image
    pic.className = "toy-avatar"

    rating = document.createElement("p")
    rating.innerText = `${toy.likes} likes`

    bt = document.createElement("button")
    bt.className = "like-btn"
    bt.id = `likeButton-${toy.id}`
    bt.innerText = "Like <3"
    bt.addEventListener("click", handleLikeClick)

    toyDiv.append(nomen, pic, rating, bt)
    toyCollection.appendChild(toyDiv)
}
