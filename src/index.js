// ASSIGNING DOM ELEMENTS TO VARIABLES TO USE LATER
let ramenCount = 0;
const ramenMenu = document.getElementById('ramen-menu')
const displayImg = document.getElementById('display-image')
const displayName = document.getElementById('display-name')
const displayRestaurant = document.getElementById('display-restaurant')
const displayRating = document.getElementById('rating-display')
const displayComment = document.getElementById('comment-display')
const newRamenForm = document.getElementById('new-ramen')
const formName = document.getElementById('new-name')
const formRestaurant = document.getElementById('new-restaurant')
const formImg = document.getElementById('new-image')
const formRating = document.getElementById('new-rating')
const formComment = document.getElementById('new-comment')
const updateRamenForm = document.getElementById('edit-ramen')
const updateRating = document.getElementById('update-rating')
const updateComment = document.getElementById('update-comment')
const button = document.querySelector('button')

// THIS FUNCTION WILL DISPLAY THE RAMEN THAT YOU CLICK ON 
const handleClick = (ramen) => {
  displayImg.src = ramen.target.src
  displayImg.dataset.id = ramen.target.dataset.id
  displayName.textContent = ramen.target.dataset.name
  displayRestaurant.textContent = ramen.target.dataset.restaurant
  displayRating.textContent = ramen.target.dataset.rating
  displayComment.textContent = ramen.target.dataset.comment
};


// THIS FUNCTION WILL ADD FUNCTIONALITY TO BOTH FORMS
const addSubmitListener = () => {
  newRamenForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const img = document.createElement('img')
    img.src = formImg.value
    img.dataset.name = formName.value
    img.dataset.restaurant = formRestaurant.value
    img.dataset.rating = formRating.value
    img.dataset.comment = formComment.value
    img.addEventListener('click', handleClick)
    ramenMenu.append(img)
    fetch('http://localhost:3000/ramens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: (ramenCount + 1).toString(),
        name: formName.value,
        restaurant: formRestaurant.value,
        image: formImg.value,
        rating: formRating.value,
        comment: formComment.value
      })
    })
    formName.value = ''
    formRestaurant.value = ''
    formImg.value = ''
    formRating.value = ''
    formComment.value = ''
    ramenCount++
  })
  updateRamenForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const ramenToUpdate = ramenMenu.querySelector(`[data-id="${displayImg.dataset.id}"]`)
    ramenToUpdate.dataset.rating = updateRating.value
    ramenToUpdate.dataset.comment = updateComment.value
    displayRating.textContent = updateRating.value
    displayComment.textContent = updateComment.value
    fetch(`http://localhost:3000/ramens/${displayImg.dataset.id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        rating: parseInt(updateRating.value),
        comment: updateComment.value
      })
    })
    updateRating.value = ''
    updateComment.value = ''
  })
}

// THIS FUNCTION WILL POPULATE ALL THE RAMENS WHEN THE PAGE LOADS AND DISPLAY THE FIRST RAMEN
const displayRamens = () => {
  fetch('http://localhost:3000/ramens')
    .then(resp => resp.json())
    .then(data => data.forEach(ramen => {
      if (ramen.id === '1') {
        displayImg.src = ramen.image
        displayImg.dataset.id = ramen.id
        displayName.textContent = ramen.name
        displayRestaurant.textContent = ramen.restaurant
        displayRating.textContent = ramen.rating
        displayComment.textContent = ramen.comment
      }
      const img = document.createElement('img')
      img.src = ramen.image
      img.dataset.id = ramen.id
      img.dataset.name = ramen.name
      img.dataset.restaurant = ramen.restaurant
      img.dataset.rating = ramen.rating
      img.dataset.comment = ramen.comment
      img.addEventListener('click', handleClick)
      ramenMenu.append(img)
      ramenCount++
    }))
};

// THIS FUNCTION ADDS DELETE FUNCTION

button.addEventListener('click', () => {
  if (confirm('Are you sure you wish to delete this ramen?')) {
    ramenMenu.querySelector(`[data-id="${displayImg.dataset.id}"]`).remove()
    displayImg.src = './assets/image-placeholder.jpg'
    displayName.textContent = 'Insert Name Here'
    displayRestaurant.textContent = 'Insert Restaurant Here'
    displayRating.textContent = ''
    displayComment.textContent = ''
    fetch(`http://localhost:3000/ramens/${displayImg.dataset.id}`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    })
  }
})

const main = () => {
  displayRamens()
  addSubmitListener()
}

main()

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};
