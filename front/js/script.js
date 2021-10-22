// class Product {
//     constructor(id, name, color, price, imgURL, desc, altText) {

//     }
// }


const apiAdress = "http://localhost:3000/api/products";
const parent = document.getElementById("items");
let productList = [];

/**
 * 
 * 
 */
async function receive() {
    await fetch(apiAdress)
        .then(function(result) {
            if (result.ok) {return result.json()}
        })
        .then(function(data) {
            productList = data;
            // console.log(productList);
        })
        .catch(function(err) {console.log(err)});
        // console.log(productList);
}

/**
 * 
 */
async function testPrintObj () {
    await receive();
    console.log(productList);
}

// testPrintObj();

/**
 * 
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
 * 
 */
async function setHTMLAttribute() {
    await receive();
    let htmlToPublish = [];
    for(let product of productList) {
        htmlToPublish.push(createHTMLProduct(product._id, product.imageUrl, product.altTxt, product.name, product.description));
    }
    // console.log(htmlToPublish);
    return htmlToPublish;
}

/**
 * 
 */
async function publishHTML() {
    const productsHTML = await setHTMLAttribute();
    let htmlToPublish = "";
    // console.log(html);
    for(article of productsHTML) {
        htmlToPublish += article;
    }
    parent.innerHTML = htmlToPublish;
}

publishHTML();