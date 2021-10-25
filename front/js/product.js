// Objet URL, contient les données de l'URL de la page courante.
const currentURL = new URL(document.location.href);
// String, contient l'URL de la page produit grâce à recupID.
const apiAdressById = "http://localhost:3000/api/products/" + recupID(currentURL);
// Objet, contiendra les spécificités du prduit.
let product = {};

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
    await fetch(apiAdressById)
        .then(function(response) {
            if (response.ok) {return response.json();}
        })
        .then(function(data) {
            product = data;
            console.log("Array product récupéré de la Promise envoyé par fetch() : " + product);
            console.log(product);
        })
        .catch(function(err) {console.log(err)});
}

/**
 * Insère l'HTML dans le DOM
 */
async function publishHTML() {
    await receiveById();
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