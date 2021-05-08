/** @format */

const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
  moneda: "",
  criptomoneda: "",
};

// Crear un Promise
const obtenerCripto = (criptomonedas) =>
  new Promise((resolve) => resolve(criptomonedas));

document.addEventListener("DOMContentLoaded", () => {
  consultarCripto();

  formulario.addEventListener("submit", submitFormulario);
  criptomonedasSelect.addEventListener("change", leerValor);
  monedaSelect.addEventListener("change", leerValor);
});

function consultarCripto() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  fetch(url)
    .then((res) => res.json())
    .then((result) => obtenerCripto(result.Data))
    .then((criptomonedas) => selectCriptomonedas(criptomonedas));
}

function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    console.log(cripto);
    const { FullName, Name } = cripto.CoinInfo;

    const option = document.createElement("option");
    option.value = Name;
    // option.style = `background-image:url(https://www.cryptocompare.com/${ImageUrl})`;
    option.innerHTML = `${Name} - ${FullName}`;

    criptomonedasSelect.appendChild(option);
  });
}

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
  console.log(objBusqueda);
}

function submitFormulario(e) {
  e.preventDefault();

  // Validar
  const { moneda, criptomoneda } = objBusqueda;
  if (moneda === "" || criptomoneda === "") {
    mostrarAlerta("Ambos campos son obligatorios");
    return;
  }

  // Consultar la API
  consultarAPI();
}

function mostrarAlerta(mensaje) {
  const noRepeatError = document.querySelector(".no--repeat-error");
  if (!noRepeatError) {
    alerta = document.createElement("p");
    alerta.textContent = mensaje;
    alerta.classList.add("error", "no--repeat-error");

    formulario.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();

  fetch(url)
    .then((res) => res.json())
    .then((cotizacion) =>
      mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
    );
}

function mostrarCotizacionHTML(cotizacion) {
  limpiarHTML();

  const {
    PRICE,
    HIGHDAY,
    LOWDAY,
    CHANGEPCT24HOUR,
    IMAGEURL,
    LASTUPDATE,
  } = cotizacion;

  const img = document.createElement("img");
  img.src = `https://www.cryptocompare.com/${IMAGEURL}`;
  img.classList.add("coin--img");

  const precio = document.createElement("p");
  precio.classList.add("precio");
  precio.textContent = PRICE;

  const nombre = document.createElement("p");
  nombre.classList.add("coin--nombre");
  nombre.textContent = objBusqueda.criptomoneda;

  const divNombre = document.createElement("div");
  divNombre.classList.add("div--nombre");

  const precioAlto = document.createElement("p");
  precioAlto.innerHTML = `Max: <span>${HIGHDAY}</span>`;

  const precioBajo = document.createElement("p");
  precioBajo.innerHTML = `Min: <span>${LOWDAY}</span>`;

  resultado.appendChild(divNombre);
  divNombre.appendChild(img);
  divNombre.appendChild(nombre);
  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function mostrarSpinner() {
  limpiarHTML();

  const spinner = document.createElement("div");
  spinner.classList.add("sk-cube-grid");

  spinner.innerHTML = `
  
  <div class="sk-cube sk-cube1"></div>
  <div class="sk-cube sk-cube2"></div>
  <div class="sk-cube sk-cube3"></div>
  <div class="sk-cube sk-cube4"></div>
  <div class="sk-cube sk-cube5"></div>
  <div class="sk-cube sk-cube6"></div>
  <div class="sk-cube sk-cube7"></div>
  <div class="sk-cube sk-cube8"></div>
  <div class="sk-cube sk-cube9"></div>
  
  `;

  resultado.appendChild(spinner);
}
