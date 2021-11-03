// Intégration des données du panier :

// Adresse URL de l'API
const apiAdress = "http://localhost:3000/api/products";
// Élément parent de l'HTML à insérer (les produits)
const panierParent = document.getElementById("cart__items");
// Élment à insérer pour le total du nombre d'articles
const totalArticle = document.getElementById("totalQuantity");
// Élément à insérer pour le total du prix 
const totalPrice = document.getElementById("totalPrice");


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

/**
 * Retourne le contenu du panier sous forme de tableau.
 * @returns {Object[]|Boolean}
 */
 function getCart() {
    if (localStorage.cart) {
        return JSON.parse(localStorage.cart);
    }
    return false;
}

/**
 * Stock le panier entier à jour dans le localStorage
 * @param {Object[]} cart
 */
 function setCart(cart) {
    localStorage.cart = JSON.stringify(cart);
}

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
        ({id, color, quantity} = product);
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
    return data;
}

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
    const cart = getCart();
    let total = 0;
    for (product of cart) {
        total += parseInt(product.quantity);
    }
    return total;
}

/**
 * Retourne le prix total.
 * @returns {Number}
 */
function getTotalPrice() {
    const pricesCtn = document.querySelectorAll(".cart__item__content__titlePrice > p");
    const quantity = document.querySelectorAll(".itemQuantity");
    let prices = 0;
    let i = 0;
    for(p of pricesCtn) {
        const price = parseInt(p.innerText.replace("€", ""));
        prices += parseInt(quantity[i].value) * price;
        i++;
    }
    return prices;
}

/**
 * Intègre l'HTML dans le DOM.
 */
async function publishHTML () {
    // Intégration du panier :
    panierParent.innerHTML = await createHTML();
    // Intégration du total d'article / prix :
    totalArticle.textContent = getTotalArticles();
    totalPrice.textContent = getTotalPrice();
}


// Possibilité de modification / suppression :

/**
 * Retourne l'ID de l'élément grâce à Element.closest().
 * @param {Object{}} element
 * @return {String}
 */
function getID (element) {
    return element.closest(".cart__item").dataset.id;
}

/**
 * Retourne la couleur de l'élément.
 * @param {Object{}} element 
 */
function getColor(element) {
    const parent =  element.closest(".cart__item__content");
    const parentChildText = parent.querySelector("h2").innerText;
    const splitText = parentChildText.split(' ');
    return splitText[splitText.length - 1];
}

/**
 * Modifie le panier à partir de l'ID d'un item et de quantité
 * @param {Object[]} item
 */
function modifyCart (item) {
    const [id, color, quantity] = item;
    const cart = getCart();
    for (product of cart) {
        if ((product.id == id) && (product.color == color)) {
            product.quantity = quantity;
        }
    }
    setCart(cart);
}

/**
 * Supprime un article de localStorage et du DOM.
 * @param {Object[]} item
 */
function supItem(item) {
    const cart = getCart();
    const [id, color] = item;
    setCart(cart.filter(product => !((product.id == id) && (product.color == color))));
}

async function cartMod () {
    await publishHTML();
    const cart = getCart();
    // Élément sur lequel on écoute le chgt
    const quantityChanger = document.querySelectorAll(".itemQuantity");
    // Élément sur lequel on écoute la suppression
    const sup = document.querySelectorAll(".deleteItem");
    let i = 0;
    for (i; i < cart.length; i++) {
        quantityChanger[i].addEventListener('input', function() {
            modifyCart([getID(this), getColor(this), this.value]);
            totalArticle.textContent = getTotalArticles();
            totalPrice.textContent = getTotalPrice();
        });
        sup[i].addEventListener('click', function() {
            supItem([getID(this), getColor(this)]);
            panierParent.removeChild(this.closest(".cart__item"));
            totalArticle.textContent = getTotalArticles();
            totalPrice.textContent = getTotalPrice();
        });
    }  
}

cartMod();


