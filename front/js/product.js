// Intéger l'HTML :

// Objet URL, contient les données de l'URL de la page courante.
const currentURL = new URL(document.location.href);
// String, contient l'URL de la page produit grâce à recupID.
const apiAdressById = "http://localhost:3000/api/products/" + recupID(currentURL);


console.log("URL de la page : " + currentURL);

/**
 * Retourne l'ID d'un produit grâce à son URL.
 * @param {Object} url
 * @param {String} url.search
 * @return {String} 
 */
function recupID(url) {
    let id = "";
    console.log("Partie search de l'objet URL : " + url.search);
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
// localStorage
const cart = localStorage;


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
    const [, color, quantity] = item;
    console.log("Couleur : " + color + ", Quantity : " + quantity);
    const colors = product.colors;
    // Teste si la couleur est renseignée :
    if (!colors.find(element => element === color)) {
        alert("Veuillez choisir une couleur.")
        return false
    }
    // Teste si la quantité est comprise entre 1 et 100 :
    if((quantity < 1) || (quantity > 100)) {
        alert("Choisissez une quantité entre 1 et 100.")
        return false;
    }
    // Teste si la quantité déjà en stock + la quantité à ajouter du même item 
    // ne va pas dépasser 100 : 
    if (checkLocalStorage(item)[0]) {
        const [,,quantityInCart] = JSON.parse(cart[checkLocalStorage(item)[1]]);
        if (parseInt(quantityInCart) + parseInt(quantity) > 100) {
            const qAuthorised = 100 - parseInt(quantityInCart);
            alert("Vous avez déjà " + quantityInCart + " items, vous pouvez en rajouter " + qAuthorised + " au maximum.");
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
    const [id, color, quantityAdd] = item;
    // console.log("id : " + id + " Couleur : " + color);
    // console.log("Taille du localStorage avant ajout : " + cart.length);
    // Le panier n'existe pas :
    if (cart.length == 0) {
        // console.log("Le panier n'existe pas encore.")
        return false;
    }
    // Le panier existe :
    else {
        // console.log("Le panier existe déjà.");
        let index = 0;
        // On parcourt le localStorage grâce à ses clés :
        for (index; index < cart.length; index++) {
            const [idInCart, colorInCart,] = JSON.parse(cart[index]);
            // L'ID et la couleur sont les mêmes : 
            if((idInCart == id) && (colorInCart == color)) {
                return [true, index];
            }
        }
        return false;
    }
}

/**
 * Récupère la quantité d'un item stockée dans le localStorage
 * grâce à sa clé.
 * @param {Number} key
 * @returns {Number} 
 */
function quantityInStock (key) {
    const [,,quantity] = JSON.parse(cart[key]);
    return quantity;
}

/**
 * Change la quantité d'un item dans le localStorage s'il y est déjà.
 * @param {Number} key
 * @param {Number} quantity
 */
function updateQuantity (key, quantity) {
    const qInitial = parseInt(quantityInStock(key));
    const qUpdated = qInitial + parseInt(quantity);
    const [id, color,] = JSON.parse(cart[key]);
    cart.removeItem(key);
    cart.setItem(cart.length++, JSON.stringify([id, color, qUpdated]));
}

/**
 * Ajoute les données au localStorage si l'item n'y est pas déjà,
 * sinon incrémente la quantité de l'item.
 * @param {Object[]} item
 */
function addtoCart(item) {
    console.log(checkLocalStorage(item));
    if (checkLocalStorage(item)[0]) {
        console.log("Objet déjà présent.");
        const [,key] = checkLocalStorage(item);
        const [,,quantity] = item
        updateQuantity(key, quantity);
    }
    else {
        cart.setItem(cart.length++, JSON.stringify(item));
    }
}

// localStorage.clear();

addCartBtn.addEventListener("click", async function() {
    const item = [];
    // Récupère l'id de la page.
    item.push(recupID(currentURL));
    console.log("ID onclick : " + item[0]);
    // Récupère la couleur de l'item.
    item.push(getSelectedValue("colors"));
    console.log("Couleur onclick : " + item[1]);
    // Récupère le nombre d'article.
    item.push(document.getElementById("quantity").value);
    console.log("Quantité onclick : " + item[2]);

    if (await validateAdd(item)) {
        console.log("Panier valide.");
        console.log("Item à ajouter au panier : " + item);
        addtoCart(item);

    }
    console.log(cart);
    console.log("\n\n\n");
    // console.log("Taille du localStorage après ajout : " + localStorage.length + "\n\n\n");
});

