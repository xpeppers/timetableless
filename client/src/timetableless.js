function showError(message) {
  let formClasses = document.querySelector("#form").classList
  formClasses.add("border-red-500")
  document.querySelector(".error-message").innerHTML = message
}

function hideError() {
  let formClasses = document.querySelector("#form").classList
  formClasses.remove("border-red-500")
  document.querySelector(".error-message").innerHTML = ""
}

function showSuccess() {
  document.querySelector(".succeeded").classList.remove("hidden")
  document.querySelector(".inputs").classList.add("hidden")
  document.querySelector("#train-number").value = ""
  document.querySelector("#station").value = ""
  document.querySelector("#stationId").setAttribute("value", "")
  document.querySelector("#stationId").setAttribute("name", "")
}

function addLoading(button, form) {
  button.classList.remove("bg-purple-700")
  button.classList.remove("hover:bg-purple-900")
  button.classList.add("bg-purple-500")
  button.classList.add("hover:bg-purple-500")
  button.setAttribute("disabled", "disabled")
  form.classList.add("loading")
  form.classList.add("border-purple-500")
}

function removeLoading(button, form) {
  button.classList.add("bg-purple-700")
  button.classList.add("hover:bg-purple-900")
  button.classList.remove("bg-purple-500")
  button.classList.remove("hover:bg-purple-500")
  button.removeAttribute("disabled")
  form.classList.remove("loading")
  form.classList.remove("border-purple-500")
}

document.querySelectorAll("#form input").forEach(function(element) {
  element.addEventListener("focus", hideError)
})

new autoComplete({
  selector: '#station',
  source: function(term, response) {
    axios
      .get(`${process.env.BACKEND_HOST}/stations/autocomplete/${term}`)
      .then(function(result) {
        response(result.data.split("\n"))
      })
  },

  renderItem: function (item, search) {
    let [name, id] = item.split("|")
    return `<div class="autocomplete-suggestion" data-id="${id}" data-val="${name}">${name}</div>`
  },

  onSelect: function(e, term, item) {
    document.querySelector("#stationId").setAttribute("value", item.getAttribute('data-id'))
    document.querySelector("#stationId").setAttribute("name", item.getAttribute('data-val'))
  }
})

document.querySelector("#station").addEventListener("change", function(e) {
  if(e.target.value === "") {
    document.querySelector("#stationId").setAttribute("value", "")
    document.querySelector("#stationId").setAttribute("name", "")
  }
})

document.querySelector("#station").addEventListener("blur", function(e) {
  console.log(e.target)
  e.target.value = document.querySelector("#stationId").getAttribute('name')
  e.target.setAttribute("data-id", document.querySelector("#stationId").getAttribute('value'))
  e.target.setAttribute("data-val", document.querySelector("#stationId").getAttribute('name'))
})

document.querySelector("#submit-button").addEventListener('click', function(e) {
  addLoading(e.target, document.querySelector("#form"))

  var email = document.querySelector("#email").value.trim()
  var trainNumber = document.querySelector("#train-number").value.trim()
  var station = document.querySelector("#stationId").value

  axios.post(`${process.env.BACKEND_HOST}/registration`, {email: email, trainNumber: trainNumber, station: station})
    .then(function(result) {
      showSuccess()

      removeLoading(e.target, document.querySelector("#form"))
    })
    .catch(function(error) {
      removeLoading(e.target, document.querySelector("#form"))
      showError("I valori inseriti non sono validi")
    })
})

document.querySelector("#register-again").addEventListener('click', function(e) {
  document.querySelector(".succeeded").classList.add("hidden")
  document.querySelector(".inputs").classList.remove("hidden")
})
