// Adresse URL de l'API.
const apiAdress = "http://localhost:3000/api/products";
// Élément parent de l'HTML à insérer (les produits).
const parent = document.getElementById("items");
// Array, contiendra les produits
let productList = [];

/**
 * Envoie une requête à l'API en utilisant fetch,
 * récupère les données de l'API sous la forme d'un
 * tableau d'objet.
 */
async function receive() {
    await fetch(apiAdress)
        .then(function(response) {
            if (response.ok) {return response.json();}
        })
        .then(function(data) {
            productList = data;
            console.log("Array productList récupéré avec fetch() : " + productList);
            console.log(productList);
        })
        .catch(function(err) {console.log(err)});
}

/**
 * Crée l'HTML à insérer dans le DOM grâce à un littéral de gabarit.
 * @param {String} productId
 * @param {String} imageUrl
 * @param {String} altText
 * @param {String} productName
 * @param {String} desc
 * @return {String}
 */
function createHTMLProduct(productId, imgURL, altText, productName, desc) {
    const model = 
    `<a href="./product.html?id=${productId}">
        <article>
            <img src="${imgURL}" alt="${altText}">
            <h3 class="productName">${productName}</h3>
            <p class="productDescription">${desc}</p>
        </article>
    </a>`;
    return model;
}

// createHTMLProduct(42, "../../back/images/kanap01.jpeg", "Un kanap", "Kanap 1", "Il est beau mon Kanap");

/**
 * Récupère les attributs à utiliser pour créer l'HTML,
 * retourne un tableau des éléments à insérer dans le DOM.
 * @return {Object[]}
 */
async function setHTMLAttribute() {
    await receive();
    // Array, contiendra l'HTML à intégrer sous forme de String.
    let htmlToPublish = [];
    for(let product of productList) {
        htmlToPublish.push(createHTMLProduct(product._id, product.imageUrl, product.altTxt, product.name, product.description));
    }
    console.log("\n\Array du HTML à intégrer : \n\n\n" + htmlToPublish);
    return htmlToPublish;
}

/**
 * Intègre l'HTML dans le DOM.
 */
async function publishHTML() {
    const productsHTML = await setHTMLAttribute();
    let htmlToPublish = "";
    console.log("\n\nString à intégrer : \n\n\n" + productsHTML);
    for(article of productsHTML) {
        htmlToPublish += article;
    }
    parent.innerHTML = htmlToPublish;
}

publishHTML();