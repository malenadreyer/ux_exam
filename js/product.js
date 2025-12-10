import { BASE_URL } from "./info.js";
import { capitalizeFirstLetter } from "./functions.js";
import { addToCart } from "./basket.js";

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

  const description = info.description;
  const regex = / \/ |,\s*(?=[A-Z]|\d)/g;
  productInfo.querySelector("#product-description").innerText = description.replace(regex, "\n\n");



};
const addToCartBtn = document.querySelector('#cta');
addToCartBtn.addEventListener('click', () => {
  addToCart(productID);
});
