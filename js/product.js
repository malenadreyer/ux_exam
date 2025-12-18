import { BASE_URL } from "./info.js";
import { capitalizeFirstLetter } from "./functions.js";
import { addToCart } from "./basket.js";
import { showModal } from './modal.js';

const productInfo = document.querySelector("#product-info");
productInfo.querySelector("h1").innerText = "Loading product...";

const queryParams = new URLSearchParams(location.search);
const productID = queryParams.get("id");

fetch(`${BASE_URL}/${productID}`)
  .then((response) => response.json())
  .then((data) => {
    showProduct(data);
  })
  .catch((error) => console.log(error));

const showProduct = (info) => {
  productInfo.querySelector("h1").innerText = info.title;

  const thumbnail = productInfo.querySelector("img");
  thumbnail.src = info.image;
  thumbnail.alt = info.title;

  productInfo.querySelector(".product-price").innerText = info.price;

  const category = capitalizeFirstLetter(info.category);
  productInfo.querySelector(".product-category").innerText = category;

  const rating = `${info.rating.rate}/5 (${info.rating.count} reviews)`
  productInfo.querySelector(".product-rating").innerText = rating ;

  const description = info.description;

  // Regular expression to identify where the description should break into new lines
  // 1. " \/ " : Matches a forward slash with spaces on both sides
  // 2. |      : OR
  // 3. ",\s*(?=[A-Z]|\d)" : Matches a comma followed by optional spaces, 
  //    but ONLY if followed by an Uppercase letter or a Digit.
  //    The (?=...) is a "lookahead" and it checks the next character without deleting it.
  const regex = / \/ |,\s*(?=[A-Z]|\d)/g;

  // Replace all matches found by the regex with two new lines (\n\n) to create 
  // clear visual spacing between points in the product description.
  productInfo.querySelector("#product-description").innerText = description.replace(regex, "\n\n");
};

const addToCartBtn = document.querySelector('#cta');
addToCartBtn.addEventListener('click', () => {
  addToCart(productID);
  showModal('Success', 'Product added to cart!');
});
