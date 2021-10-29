// Intégration des données du panier :

// Adresse URL de l'API.
const apiAdress = "http://localhost:3000/api/products";
// Élément parent de l'HTML à insérer (les produits).
const parent = document.getElementById("cart__items");
// localStorage
const cart = localStorage;
// Nombre d'articles total
let totalArticle = 0;
// Prix total
let totalPrice = 0;

/**
 * Envoie une requête à l'API en utilisant fetch,
 * récupère les données de l'API sous la forme d'un
 * tableau d'objet.
 * @returns {Object[]}
 */
 async function receive() {
    return await fetch(apiAdress)
        .then(function(response) {
            if (response.ok) {return response.json();}
        })
        .then(function(data) {
            return data;
        })
        .catch(function(err) {console.log(err)});
}

// async function testReceive() {
//     const products = await receive();
//     console.log(products);
// }

// testReceive();

/**
 * Récupère les données à intégrer de localStorage,
 * retourn un tableau des données contenu dans le localStorage.
 * @return {Object[]}
 */
function getCart() {
    index = 0;
    const data = [];
    for(index; index < cart.length; index++) {
        data.push(JSON.parse(cart[index]));
    }
    console.log(data);
    return data;
}

// getCart();

/**
 * Retourne un tableau des données à intégrer.
 * @return {Object[]}
 */
async function dataToIntegrate() {
    const products = await receive();
    const productInCart = getCart();
    const data = [];
    // Parcours le panier :
    for (product of productInCart) {
        const [id, color, quantity] = product;
        const dataFromDatas = [];
        dataFromDatas.push(id, color, quantity);
        // Parcours l'ensemble des produits :
        for (prdt of products) {
            // Si l'ID correspond on ajoute les autres attributs aux datas
            if (prdt._id == id) {
                dataFromDatas.push(prdt.name, prdt.price, prdt.imageUrl, prdt.altTxt);
            }
        }
        data.push(dataFromDatas);
    }
    console.log(data);
    return data;
}

// dataToIntegrate();

/**
 * Crée le model à insérer dans le DOM à partir des données
 * à intégrer, retourne ce model
 * @param {Object[]} data
 * @return {String}
 */
function createHTMLModel(data) {
    const [id, color, quantity, name, price, imageUrl, altTxt] = data;
    const model = 
   `<article class="cart__item" data-id="${id}">
        <div class="cart__item__img">
            <img src="${imageUrl}" alt="${altTxt}">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__titlePrice">
                <h2>${name} ${color}</h2>
                <p>${price} €</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                </div>
            </div>
        </div>
    </article>`
    console.log(model);
    return model;
}

/**
 * Crée l'HTML du panier à intégrer.
 * @return {String} 
 */
async function createHTML() {
    const data = await dataToIntegrate();
    let html = "";
    for (item of data) {
        html += createHTMLModel(item);
    }
    return html;
}

/**
 * Retourne le nombre total d'articles dans le panier.
 * @returns {Number}
 */
function getTotalArticles() {
    let total = 0;
    let i = 0;
    for (i; i < cart.length; i++) {
        const [,,quantity] = JSON.parse(cart[i]);
        total += parseInt(quantity);
    }
    return total;
}

/**
 * Retourne le prix total.
 * @returns {Number}
 */
function getTotalPrice() {
    const pricesCtn = document.querySelectorAll(".cart__item__content__titlePrice > p");
    let prices = 0;
    let i = 0;
    for(p of pricesCtn) {
        const price = parseInt(p.innerText.replace("€", ""));
        // console.log(price);
        const [,,quantity] = JSON.parse(cart[i]);
        i++;
        prices += parseInt(quantity) * price;
    }
    // console.log(prices);
    return prices;
}

/**
 * Intègre l'HTML dans le DOM.
 */
async function publishHTML () {
    // Intégration du panier :
    parent.innerHTML = await createHTML();
    // Intégration du total d'article / prix :
    document.getElementById("totalQuantity").textContent = getTotalArticles();
    document.getElementById("totalPrice").textContent = getTotalPrice();
}

publishHTML();


// Possibilité de modification / suppression :

