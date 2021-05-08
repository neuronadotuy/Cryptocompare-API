/** @format */

// Variables
const formulario = document.querySelector("#formulario");
const listaTweets = document.querySelector("#lista-tweets");
let tweets = [];

// EventListeners
EventListeners();
function EventListeners() {
  // Cuando el usuario crea un tweet
  formulario.addEventListener("submit", agregarTweet);

  // Cuando el documento esta listo
  document.addEventListener("DOMContentLoaded", () => {
    tweets = JSON.parse(localStorage.getItem("tweets")) || []; // Este operados evita que devuelva null, si no encuentra ningun tweet en localStorage, devuelve un arreglo vacío.
    console.log(tweets);

    crearHTML();
  });
}

// Funciones
function agregarTweet(e) {
  e.preventDefault();

  // Textarea
  const tweet = document.querySelector("#tweet").value;

  // Validacion
  if (tweet === "") {
    mostrarError("Un mensaje no puede ir vacío");
    return; // Evita que se ejecuten mas lineas de codigos
  }

  const tweetObj = {
    id: Date.now(),
    tweet: tweet,
  };

  // Añadir al arreglo de tweets
  tweets = [...tweets, tweetObj];
  console.log(tweets);

  // Crear HTML
  crearHTML();

  // Reiniciar el Formulario
  formulario.reset();
}

// Mostrar msg de error
function mostrarError(mensaje) {
  const mensajeError = document.createElement("p");
  mensajeError.textContent = mensaje;
  mensajeError.classList.add("error");

  // Insertar el mensaje en el HTML
  const contenido = document.querySelector("#contenido");
  contenido.appendChild(mensajeError);

  setTimeout(() => {
    mensajeError.remove();
  }, 3000);
}

// Muestra un listado de los Tweets
function crearHTML() {
  limpiarHTML();

  if (tweets.length > 0) {
    tweets.forEach((tweet) => {
      // Aregar botón de eliminar
      const btnEliminar = document.createElement("a");
      btnEliminar.classList.add("error");
      btnEliminar.textContent = "x";

      // Añadir la función de eliminar de localStorage
      btnEliminar.onclick = () => {
        borrarTweet(tweet.id);
      };

      // Crear el HTML
      const li = document.createElement("li");
      li.textContent = tweet.tweet;

      // Asignar el botón de Eliminar
      li.appendChild(btnEliminar);

      // Insertarlo en el HTML
      listaTweets.appendChild(li);
    });
  }

  sincronizarStorage();
}

// Agrega los Twwets actuales a LocalStorage
function sincronizarStorage() {
  localStorage.setItem("tweets", JSON.stringify(tweets));
}

// Limpiar HTML
function limpiarHTML() {
  while (listaTweets.firstChild) {
    listaTweets.removeChild(listaTweets.firstChild);
  }
}

// Elimina un Tweet
function borrarTweet(id) {
  console.log("borrando", id);
  tweets = tweets.filter((tweet) => id !== tweet.id);
  crearHTML();
}
