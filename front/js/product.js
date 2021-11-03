// Intéger l'HTML :

// Objet URL, contient les données de l'URL de la page courante.
const currentURL = new URL(document.location.href);
// String, contient l'URL de la page produit grâce à recupID.
const apiAdressById = "http://localhost:3000/api/products/" + recupID(currentURL);

/**
 * Retourne l'ID d'un produit grâce à son URL.
 * @param {Object} url
 * @param {String} url.search
 * @return {String} 
 */
function recupID(url) {
    let id = "";
    // Objet URLSearchParams, recupère la partie search de l'URL.
    let searchParams = new URLSearchParams(url.search)
    if (searchParams.has("id")) {
        id = searchParams.get("id");
    }
    return id;
}

/**
 * Envoie une requête à l'API en utilisant fetch,
 * récupère les données de l'API d'un seul élément
 * grâce à son id sous la forme d'un objet.
 */
async function receiveById() {
    // console.log(id);
    return await fetch(apiAdressById)
        .then(function(response) {
            if (response.ok) {return response.json();}
        })
        .then(function(data) {
            return data;
        })
        .catch(function(err) {console.log(err)});
}

/**
 * Insère l'HTML dans le DOM
 */
async function publishHTML() {
    const product = await receiveById();
    // Change le titre de la page.
    document.getElementsByTagName("title")[0].textContent = product.name;
    // Intègre l'image de la page par son URL.
    document.getElementsByClassName("item__img")[0].innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    // Intègre l'élément title.
    document.getElementById("title").textContent = product.name;
    // Intègre l'élément price.
    document.getElementById("price").textContent = product.price;
    // Intègre l'élément description.
    document.getElementById("description").textContent = product.description;
    // Intègre les éléments option grâce à une boucle for ... of.
    for (clr of product.colors) {
        let option = document.createElement("option");
        document.getElementById("colors").appendChild(option);
        option.setAttribute("value", clr);
        option.textContent = clr;
    }
    

}

publishHTML();

// Ajouter des éléments au panier : 

// Bouton d'ajout au panier
const addCartBtn = document.getElementById("addToCart");

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
 * Récupère la valeur actuelle d'un bloc select.
 * @param {String} selectId
 * @return {String}
 */ 
function getSelectedValue(selectId) {
    const select = document.getElementById(selectId);
    return select.options[select.selectedIndex].value;
}

/**
 * Valide les entrées de l'utilisateur.
 * @param {Object[]} item
 * @return {Boolean}
 */
async function validateAdd(item) {
    const product = await receiveById();
    const colors = product.colors;
    const cart = getCart();
    // Teste si la couleur est renseignée :
    if (!colors.find(element => element === item.color)) {
        alert("Veuillez choisir une couleur.")
        return false
    }
    // Teste si la quantité est comprise entre 1 et 100 :
    if((item.quantity < 1) || (item.quantity > 100)) {
        alert("Choisissez une quantité entre 1 et 100.")
        return false;
    }
    // Teste si la quantité déjà en stock + la quantité à ajouter du même item 
    // ne va pas dépasser 100 : 
    if (checkLocalStorage(item).in) {
        ({pos} = checkLocalStorage(item));
        if (parseInt(cart[pos].quantity) + parseInt(item.quantity) > 100) {
            const qAuthorised = 100 - parseInt(cart[pos].quantity);
            alert("Vous avez déjà " + cart[pos].quantity + " items, vous pouvez en rajouter " + qAuthorised + " au maximum.");
            return false;
        }
    }
    return true;
}

/**
 * Vérifie si un objet est présent dans le localStorage grâce à son ID
 * et sa couleur, retourne false si elle n'y est pas, l'indice à laquelle 
 * elle est présente sinon, et contrôle si le totale d'item est < 100.
 * @param {Object[]} item 
 * @returns {(Boolean|Number)}
 */
function checkLocalStorage(item) {
    const cart = getCart();
    // Le panier n'existe pas :
    if (cart.length == 0) {
        return false;
    }
    // Le panier existe :
    else {
        let index = 0;
        // On parcourt le panier :
        for (index; index < cart.length; index++) {
            ({id, color} = cart[index])
            // L'ID et la couleur sont les mêmes : 
            if((id == item.id) && (color == item.color)) {
                return {in: true, pos: index};
            }
        }
        return false;
    }
}

/**
 * Change la quantité d'un item dans le localStorage s'il y est déjà.
 * @param {Number} pos
 * @param {Number} quantity
 */
function updateQuantity (pos, quantity) {
    const cart = getCart();
    cart[pos].quantity = parseInt(cart[pos].quantity) + parseInt(quantity);
    setCart(cart); 
}

/**
 * Ajoute les données au localStorage si l'item n'y est pas déjà,
 * sinon incrémente la quantité de l'item.
 * @param {Object[]} item
 */
function addtoCart(item) {
    // Item dans le panier : 
    if (checkLocalStorage(item).in) {
        updateQuantity(checkLocalStorage(item).pos, item.quantity);
    }
    // Item pas dans le panier : 
    else {
        // Panier intialisé: :
        if (getCart()) {
            const cart = getCart();
            cart.push(item);
            setCart(cart);
        }
        // Panier pas encore intialisé :
        else {
            setCart([item]);
        }
    }
}

addCartBtn.addEventListener("click", async function() {
    const item = {};
    // Récupère l'id de la page.
    item.id = recupID(currentURL);
    // Récupère la couleur de l'item.
    item.color = getSelectedValue("colors");
    // Récupère le nombre d'article.
    item.quantity = document.getElementById("quantity").value;
    if (await validateAdd(item)) {
        addtoCart(item);
    }
});