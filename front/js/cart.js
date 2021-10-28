// Adresse URL de l'API.
const apiAdress = "http://localhost:3000/api/products";
// Élément parent de l'HTML à insérer (les produits).
const parent = document.getElementById("cart__items");

/**
 * Envoie une requête à l'API en utilisant fetch,
 * récupère les données de l'API sous la forme d'un
 * tableau d'objet.
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

async function testReceive() {
    const products = await receive();
    console.log(products);
}

// testReceive();