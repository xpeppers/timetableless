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

document.querySelectorAll("#form input").forEach(function(element) {
  element.addEventListener("focus", hideError)
})

let stationId = document.querySelector("#stationId")

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
    stationId.setAttribute("value", item.getAttribute('data-id'))
    stationId.setAttribute("name", item.getAttribute('data-val'))
  }
})

document.querySelector("#station").addEventListener("change", function(e) {
  if(e.target.value === "") {
    stationId.setAttribute("value", "")
    stationId.setAttribute("name", "")
  }
})

document.querySelector("#station").addEventListener("blur", function(e) {
  console.log(e.target)
  e.target.value = stationId.getAttribute('name')
  e.target.setAttribute("data-id", stationId.getAttribute('value'))
  e.target.setAttribute("data-val", stationId.getAttribute('name'))
})

document.querySelector("#submit-button").addEventListener('click', function(e) {
  e.target.classList.remove("bg-purple-700")
  e.target.classList.remove("hover:bg-purple-900")
  e.target.classList.add("bg-purple-500")
  e.target.classList.add("hover:bg-purple-500")
  e.target.setAttribute("disabled", "disabled")

  var email = document.querySelector("#email").value.trim()
  var trainNumber = document.querySelector("#train-number").value.trim()
  var station = stationId.value

  axios.post(`${process.env.BACKEND_HOST}/registration`, {email: email, trainNumber: trainNumber, station: station})
    .then(function(result) {
      document.querySelector(".succeeded").classList.remove("hidden")
      document.querySelector(".inputs").classList.add("hidden")
      document.querySelector("#train-number").value = ""
      document.querySelector("#station").value = ""
      document.querySelector("#stationId").setAttribute("value", "")
      document.querySelector("#stationId").setAttribute("name", "")

      e.target.removeAttribute("disabled", false)
      e.target.classList.add("bg-purple-700")
      e.target.classList.add("hover:bg-purple-900")
      e.target.classList.remove("bg-purple-500")
      e.target.classList.remove("hover:bg-purple-500")
    })
    .catch(function(error) {
      showError("I valori inseriti non sono validi")
      e.target.removeAttribute("disabled", false)
      e.target.classList.add("bg-purple-700")
      e.target.classList.add("hover:bg-purple-900")
      e.target.classList.remove("bg-purple-500")
      e.target.classList.remove("hover:bg-purple-500")
    })
})

document.querySelector("#register-again").addEventListener('click', function(e) {
  document.querySelector(".succeeded").classList.add("hidden")
  document.querySelector(".inputs").classList.remove("hidden")
})
