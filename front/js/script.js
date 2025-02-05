// Adresse URL de l'API.
const apiAdress = "http://localhost:3000/api/products";
// Élément parent de l'HTML à insérer (les produits).
const parent = document.getElementById("items");

/**
 * Envoie une requête à l'API en utilisant fetch,
 * récupère les données de l'API sous la forme d'un
 * tableau d'objet.
 * @returns { (Array.{<colors: Array.<String>, _id: String, name: String, price: Integer,  imageUrl: String, description: String, altTxt: String>} | Error) }
 */
async function receive() {
  return await fetch(apiAdress)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      return data;
    })
    .catch(function (err) {
      console.log(err);
    });
}

/**
 * Crée l'HTML à insérer dans le DOM grâce à un littéral de gabarit.
 * @param { Object.<colors: Array.<String>, _id: String, name: String, price: Integer,  imageUrl: String, description: String, altTxt: String> } item
 * @returns { String }
 */
function createHTMLProduct(item) {
  const model = `<a href="./product.html?id=${item._id}">
        <article>
            <img src="${item.imageUrl}" alt="${item.altTxt}">
            <h3 class="productName">${item.name}</h3>
            <p class="productDescription">${item.description}</p>
        </article>
    </a>`;
  return model;
}

/**
 * Récupère les attributs à utiliser pour créer l'HTML,
 * retourne un tableau des éléments à insérer dans le DOM.
 * @returns { Array.<String> }
 */
async function setHTMLAttribute() {
  const products = await receive();
  // Array, contiendra l'HTML à intégrer sous forme de String.
  const htmlToPublish = [];
  for (product of products) {
    htmlToPublish.push(createHTMLProduct(product));
  }
  return htmlToPublish;
}

/**
 * Intègre l'HTML dans le DOM.
 */
async function publishHTML() {
  const productsHTML = await setHTMLAttribute();
  let htmlToPublish = "";
  for (article of productsHTML) {
    htmlToPublish += article;
  }
  parent.innerHTML = htmlToPublish;
}

publishHTML();
