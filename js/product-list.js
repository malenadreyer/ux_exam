import { BASE_URL } from './info.js';
import {capitalizeFirstLetter} from './functions.js';

const products = await fetch(`${BASE_URL}`) 
    .then(response => response.json())
    .catch(error => {
        console.error('Error fetching products:', error);
        return []; 
    });

const assignLink = (anchor, url, text) => {
    anchor.href = url;
    anchor.title = text;
};

const fragment = document.createDocumentFragment();

products.forEach(product => {
    
    const productCard = document.querySelector('#product-card').content.cloneNode(true);
    

    const linkURL = `product.html?id=${product.id}`;
    
   const headerLink = productCard.querySelector('h2 > a');

   const maxTitleLength = 30;
   const truncatedTitle = product.title.length > maxTitleLength
   ? product.title.slice(0, maxTitleLength) + '...': product.title;

   headerLink.innerText = truncatedTitle;
   assignLink(headerLink, linkURL, product.title);
    
    const pictureLink = productCard.querySelector('a:has(img)');
    assignLink(pictureLink, linkURL, product.title);

    const thumbnail = productCard.querySelector('img');
    thumbnail.setAttribute('src', product.image);
    thumbnail.setAttribute('alt', product.title);
    
    productCard.querySelector('.product-price').innerText = product.price;

    const category = capitalizeFirstLetter(product.category);
    productCard.querySelector('.product-category').innerText = category;
    
 

    fragment.append(productCard);

    
});



document.querySelector('#product-list').append(fragment);