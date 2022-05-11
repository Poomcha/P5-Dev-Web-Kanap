// Intéger l'HTML :

// Objet URL, contient les données de l'URL de la page courante.
const currentURL = new URL(document.location.href);
// String, contient l'URL de la page produit grâce à recupID.
const apiAdressById =
  "http://localhost:3000/api/products/" + recupID(currentURL);

  const products = [
    {
      colors: ['Blue', 'White', 'Black'],
      _id: '107fb5b75607497b96722bda5b504926',
      name: 'Kanap Sinopé',
      price: 1849,
      imageUrl: 'kanap01.jpeg',
      description:
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      altTxt: "Photo d'un canapé bleu, deux places",
    },
    {
      colors: ['Black/Yellow', 'Black/Red'],
      _id: '415b7cacb65d43b2b5c1ff70f3393ad1',
      name: 'Kanap Cyllène',
      price: 4499,
      imageUrl: 'kanap02.jpeg',
      description:
        'Morbi nec erat aliquam, sagittis urna non, laoreet justo. Etiam sit amet interdum diam, at accumsan lectus.',
      altTxt: "Photo d'un canapé jaune et noir, quattre places",
    },
    {
      colors: ['Green', 'Red', 'Orange'],
      _id: '055743915a544fde83cfdfc904935ee7',
      name: 'Kanap Calycé',
      price: 3199,
      imageUrl: 'kanap03.jpeg',
      description:
        'Pellentesque fermentum arcu venenatis ex sagittis accumsan. Vivamus lacinia fermentum tortor.Mauris imperdiet tellus ante.',
      altTxt: "Photo d'un canapé d'angle, vert, trois places",
    },
    {
      colors: ['Pink', 'White'],
      _id: 'a557292fe5814ea2b15c6ef4bd73ed83',
      name: 'Kanap Autonoé',
      price: 1499,
      imageUrl: 'kanap04.jpeg',
      description:
        'Donec mattis nisl tortor, nec blandit sapien fermentum at. Proin hendrerit efficitur fringilla. Lorem ipsum dolor sit amet.',
      altTxt: "Photo d'un canapé rose, une à deux place",
    },
    {
      colors: ['Grey', 'Purple', 'Blue'],
      _id: '8906dfda133f4c20a9d0e34f18adcf06',
      name: 'Kanap Eurydomé',
      price: 2249,
      imageUrl: 'kanap05.jpeg',
      description:
        'Ut laoreet vulputate neque in commodo. Suspendisse maximus quis erat in sagittis. Donec hendrerit purus at congue aliquam.',
      altTxt: "Photo d'un canapé gris, trois places",
    },
    {
      colors: ['Grey', 'Navy'],
      _id: '77711f0e466b4ddf953f677d30b0efc9',
      name: 'Kanap Hélicé',
      price: 999,
      imageUrl: 'kanap06.jpeg',
      description:
        'Curabitur vel augue sit amet arcu aliquet interdum. Integer vel quam mi. Morbi nec vehicula mi, sit amet vestibulum.',
      altTxt: "Photo d'un canapé gris, deux places",
    },
    {
      colors: ['Red', 'Silver'],
      _id: '034707184e8e4eefb46400b5a3774b5f',
      name: 'Kanap Thyoné',
      price: 1999,
      imageUrl: 'kanap07.jpeg',
      description:
        'EMauris imperdiet tellus ante, sit amet pretium turpis molestie eu. Vestibulum et egestas eros. Vestibulum non lacus orci.',
      altTxt: "Photo d'un canapé rouge, deux places",
    },
    {
      colors: ['Pink', 'Brown', 'Yellow', 'White'],
      _id: 'a6ec5b49bd164d7fbe10f37b6363f9fb',
      name: 'Kanap orthosie',
      price: 3999,
      imageUrl: 'kanap08.jpeg',
      description:
        'Mauris molestie laoreet finibus. Aenean scelerisque convallis lacus at dapibus. Morbi imperdiet enim metus rhoncus.',
      altTxt: "Photo d'un canapé rose, trois places",
    },
  ];


/**
 * Retourne l'ID d'un produit grâce à son URL, et l'objet URLSearchParams.
 * @param { Object } url URL Object
 * @returns { String }
 */
function recupID(url) {
  // Objet URLSearchParams, recupère la partie search de l'URL (l'ID).
  const searchParams = new URLSearchParams(url.search);
  // On cherche si l'URL a un attribut "id", grâce à la méthode has(), de l'objet URLSearchparams,
  // Si oui on le retourne.
  if (searchParams.has("id")) {
    return searchParams.get("id");
  }
}

/**
 * Envoie une requête à l'API en utilisant fetch,
 * récupère les données de l'API d'un seul élément
 * grâce à son id sous la forme d'un objet.
 * @returns { (Object.<colors: Array.<String>, _id: String, name: String, price: Integer,  imageUrl: String, description: String, altTxt: String> | Error) }
 */
async function receiveById() {
  return await fetch(apiAdressById)
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

function fakeReceiveById() {
  return [...products.filter(product => product._id === recupID(currentURL))];
}

/**
 * Insère l'HTML dans le DOM
 */
async function publishHTML() {
  // const product = await receiveById();
  const [product] = fakeReceiveById()
  // Change le titre de la page.
  document.getElementsByTagName("title")[0].textContent = product.name;
  // Intègre l'image de la page par son URL.
  document.getElementsByClassName(
    "item__img"
  )[0].innerHTML = `<img src="./front/public/images/${product.imageUrl}" alt="${product.altTxt}">`;
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
 * Retourne le contenu du panier sous forme de tableau, retourne false s'il n'existe pas encore.
 * @returns { Array.{<colors: Array.<String>, _id: String, name: String, price: Integer,  imageUrl: String, description: String, altTxt: String>} | Boolean{false}}
 */
function getCart() {
  if (localStorage.cart) {
    return JSON.parse(localStorage.cart);
  }
  return undefined;
}

/**
 * Stock le panier entier à jour dans le localStorage
 * @param { Array.{<colors: Array.<String>, _id: String, name: String, price: Integer,  imageUrl: String, description: String, altTxt: String>}
 *  } cart
 */
function setCart(cart) {
  localStorage.cart = JSON.stringify(cart);
}

/**
 * Récupère la valeur actuelle d'un bloc select.
 * @param { String } selectId
 * @returns { String }
 */
function getSelectedValue(selectId) {
  // Récupération de l'élément <select>.
  const select = document.getElementById(selectId);
  // Retourne la valeur de l'option actuellement sélectionnée.
  return select.options[select.selectedIndex].value;
}

/**
 * Valide les entrées de l'utilisateur.
 * @param { Object.<id: String, color: String, quantity: String> } item
 * @returns { Boolean }
 */
async function validateAdd(item) {
  // const product = await receiveById();
  const [product] = fakeReceiveById();
  const colors = product.colors;
  const cart = getCart();
  // Teste si la couleur est renseignée :
  if (!colors.find((element) => element === item.color)) {
    alert("Veuillez choisir une couleur.");
    return false;
  }
  // Teste si la quantité est comprise entre 1 et 100 :
  if (item.quantity < 1 || item.quantity > 100) {
    alert("Choisissez une quantité entre 1 et 100.");
    return false;
  }
  // Teste si la quantité déjà en stock + la quantité à ajouter du même item
  // ne va pas dépasser 100 :
  if (checkLocalStorage(item).in) {
    ({ pos } = checkLocalStorage(item));
    if (parseInt(cart[pos].quantity) + parseInt(item.quantity) > 100) {
      const qAuthorised = 100 - parseInt(cart[pos].quantity);
      alert(
        "Vous avez déjà " +
          cart[pos].quantity +
          " items, vous pouvez en rajouter " +
          qAuthorised +
          " au maximum."
      );
      return false;
    }
  }
  return true;
}

/**
 * Vérifie si un objet est présent dans le localStorage grâce à son ID
 * et sa couleur, retourne false si elle n'y est pas, l'indice à laquelle
 * elle est présente sinon, et contrôle si le totale d'item est < 100.
 * @param { Object.<id: String, color: String, quantity: String> } item
 * @returns { (Boolean{false} | Object.<in: Boolean{true}, pos: Integer>) }
 */
function checkLocalStorage(item) {
  const cart = getCart();
  // Le panier n'existe pas :
  if (!cart) {
    return false;
  }
  // Le panier existe :
  else {
    let index = 0;
    // On parcourt le panier :
    for (index; index < cart.length; index++) {
      ({ id, color } = cart[index]);
      // L'ID et la couleur sont les mêmes :
      if (id === item.id && color === item.color) {
        return { in: true, pos: index };
      }
    }
    return false;
  }
}

/**
 * Change la quantité d'un item dans le localStorage.
 * @param { Number } pos
 * @param { Number } quantity
 */
function updateQuantity(pos, quantity) {
  const cart = getCart();
  cart[pos].quantity = parseInt(cart[pos].quantity) + parseInt(quantity);
  setCart(cart);
}

/**
 * Ajoute les données au localStorage si l'item n'y est pas déjà,
 * sinon incrémente la quantité de l'item.
 * @param { Object.<id: String, color: String, quantity: String> } item
 */
function addtoCart(item) {
  const checkCart = checkLocalStorage(item);
  // Item dans le panier :
  if (checkCart.in) {
    updateQuantity(checkCart.pos, item.quantity);
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

// Écoute sur le fomulaire d'ajout au panier.
addCartBtn.addEventListener("click", async function () {
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
