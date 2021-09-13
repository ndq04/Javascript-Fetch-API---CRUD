const $ = document.querySelector.bind(document)
const coursesList = $('.courses-list')
const btnSubmit = $('.btn')
const name = $('input')
const description = $('textarea')
const heading = $('.heading')
let flag = 'add'

const url = 'http://localhost:3000/courses'

const getCourses = (courses) => {
  let output = ''
  courses.forEach(
    (course) =>
      (output += `
      <div class="card col-md-6 bg-light mt-4">
        <div class="card-body" data-id=${course.id}>
          <h5 class="card-title">${course.name}</h5>
          <p class="card-text">
            ${course.description}
          </p>
          <a href="#" class="card-link" id="edit-course">Edit</a>
          <a href="#" class="card-link" id="delete-course">Delete</a>
        </div>
      </div>`)
  )
  coursesList.innerHTML = output
}

// Get Read the courese
// Method: GET
fetch(url)
  .then((response) => response.json())
  .then((data) => getCourses(data))
  .catch((err) => console.log('Error', err.message))

// Create course
// Method : POST

btnSubmit.addEventListener('click', function () {
  if (flag == 'add') {
    if (name.value && description.value) {
      const course = {
        name: name.value,
        description: description.value,
      }
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(course),
      })
        // .then((res) => res.json())
        .then((data) => {
          const dataArr = []
          dataArr.push(data)
          getCourses(dataArr)
        })
    }
  }
})

coursesList.addEventListener('click', (e) => {
  flag = 'edit'
  let btnEdit = e.target.id == 'edit-course'
  let btnDelete = e.target.id == 'delete-course'

  const id = e.target.parentElement.dataset.id

  // Delete - Remove the existing course
  // Method: DELETE

  if (btnDelete) {
    if (window.confirm('Bạn có chắc muốn xóa không ?')) {
      fetch(`${url}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  }

  if (btnEdit) {
    const parent = e.target.parentElement
    let nameEdit =
      parent.querySelector('.card-title').innerText
    let descriptionEdit =
      parent.querySelector('.card-text').innerText

    name.value = nameEdit
    description.value = descriptionEdit
    btnSubmit.innerText = 'Update Course'
    heading.innerHTML = 'Edit Course'
  }

  // Update the existing course
  // Method PATCH
  if (flag == 'edit') {
    btnSubmit.addEventListener('click', (e) => {
      e.preventDefault()
      const updateCourse = {
        name: name.value,
        description: description.value,
      }
      fetch(`${url}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateCourse),
      })
    })
  }
})
