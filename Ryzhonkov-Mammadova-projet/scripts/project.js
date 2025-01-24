// Arseniy RYZHONKOV et Lala MAMMADOVA

// === constants ===
const MAX_QTY = 9;
const productIdKey = "product";
const orderIdKey = "order";
const inputIdKey = "qte";

// === global variables  ===
// the total cost of selected products 
var total = 0;



// function called when page is loaded, it performs initializations 
var init = function () {
	createShop();

	var filterInput = document.getElementById("filter");
	filterInput.addEventListener("keyup", filterProducts);
	
	// TODO : add other initializations to achieve if you think it is required
}
window.addEventListener("load", init);


var filterProducts = function () {
    var filterValue = document.getElementById("filter").value.toLowerCase(); // Récupère la valeur du filtre
    var products = document.getElementsByClassName("produit"); // Récupère tous les produits

    // Parcourir tous les produits pour afficher ou cacher selon le filtre
    for (var i = 0; i < products.length; i++) {
        var productName = products[i].getElementsByTagName("h4")[0].textContent.toLowerCase();

        if (productName.includes(filterValue)) {
            products[i].style.display = "inline-block"; // Affiche le produit
        } else {
            products[i].style.display = "none"; // Cache le produit
        }
    }
};






// usefull functions

/*
* create and add all the div.produit elements to the div#boutique element
* according to the product objects that exist in 'catalog' variable
*/
var createShop = function () {
	var shop = document.getElementById("boutique");
	for(var i = 0; i < catalog.length; i++) {
		shop.appendChild(createProduct(catalog[i], i));
	}
}

/*
* create the div.produit elment corresponding to the given product
* The created element receives the id "index-product" where index is replaced by param's value
* @param product (product object) = the product for which the element is created
* @param index (int) = the index of the product in catalog, used to set the id of the created element
*/
var createProduct = function (product, index) {
	// build the div element for product
	var block = document.createElement("div");
	block.className = "produit";
	// set the id for this product
	block.id = index + "-" + productIdKey;
	// build the h4 part of 'block'
	block.appendChild(createBlock("h4", product.name));
	
	// /!\ should add the figure of the product... does not work yet... /!\ 
	block.appendChild(createFigureBlock(product));

	// build and add the div.description part of 'block' 
	block.appendChild(createBlock("div", product.description, "description"));
	// build and add the div.price part of 'block'
	block.appendChild(createBlock("div", product.price, "prix"));
	// build and add control div block to product element
	block.appendChild(createOrderControlBlock(index));
	return block;
}


/* return a new element of tag 'tag' with content 'content' and class 'cssClass'
 * @param tag (string) = the type of the created element (example : "p")
 * @param content (string) = the html wontent of the created element (example : "bla bla")
 * @param cssClass (string) (optional) = the value of the 'class' attribute for the created element
 */
var createBlock = function (tag, content, cssClass) {
	var element = document.createElement(tag);
	if (cssClass != undefined) {
		element.className =  cssClass;
	}
	element.innerHTML = content;
	return element;
}

/*
* builds the control element (div.controle) for a product
* @param index = the index of the considered product
*
* TODO : add the event handling, 
*   /!\  in this version button and input do nothing  /!\  
*/
var createOrderControlBlock = function (index) {
	
	
	var control = document.createElement("div");
	control.className = "controle";

	// create input quantity element
	var input = document.createElement("input");
	input.id = index + '-' + inputIdKey;
	input.type = "number";
	input.step = "1";
	input.value = "0";
	input.min = "0";
	input.max = MAX_QTY.toString();

	//verifier si les valeurs entrees dans le input sont autorisees
	input.addEventListener("input", function () {
        if (parseInt(input.value) < 0) {
            input.value = "0";
        }
        if (parseInt(input.value) > MAX_QTY) {
            input.value = MAX_QTY.toString();
        }
		
    });


	// add input to control as its child
	control.appendChild(input);
	
	// create order button
	var button = document.createElement("button");
	button.className = 'commander';
	button.id = index + "-" + orderIdKey;
	button.style.opacity = "0.25";

	input.addEventListener("input", function() {
		if (parseInt(input.value) > 0){
			button.style.opacity = "1";
		} else {
			button.style.opacity = "0.25";
		}
	});

	button.addEventListener("click", function () {
        var quantity = parseInt(input.value);
        if (quantity > 0) {
			input.value = "0"; // Réinitialiser la quantité
            button.style.opacity = "0.25"; // Réinitialiser l'opacité
            addToCart(index, quantity); // Ajouter au panier
            
        }
    });

	// add control to control as its child
	control.appendChild(button);
	
	// the built control div node is returned
	return control;
}



var addToCart = function (index, quantity) {
    var product = catalog[index]; // Récupérer le produit à partir de l'index
    var cart = document.querySelector("#panier .achats"); // Sélectionner la div .achats

    // Vérifier si le produit est déjà dans le panier
    var existingItem = document.getElementById("cart-item-" + index);
    if (existingItem) {
        // Mettre à jour la quantité existante
        var existingQuantity = existingItem.querySelector(".quantite");
        var newQuantity = parseInt(existingQuantity.textContent) + quantity;
        existingQuantity.textContent = newQuantity;

		var existingPrice = existingItem.querySelector(".prix");
		var newPrice = parseInt(existingPrice.textContent) + parseInt(product.price) * quantity;
		existingPrice.textContent = newPrice;

    } else {
        // Créer un nouvel élément pour le produit dans le panier
        var item = document.createElement("div");
        item.className = "achat";
        item.id = "cart-item-" + index;

        // Ajouter les détails du produit
        var itemFigure = document.createElement("figure");
        var itemImg = document.createElement("img");
        itemImg.src = product.image;
        itemImg.alt = product.name;
        itemFigure.appendChild(itemImg);

        var itemName = document.createElement("h4");
        itemName.textContent = product.name;

        /*var itemQuantity = document.createElement("span");
        itemQuantity.className = "quantite";
        itemQuantity.textContent = quantity;*/

		// Ajouter la quantité (remplace span par input)
		var itemQuantity = document.createElement("input");
		itemQuantity.className = "quantite";
		itemQuantity.type = "number";
		itemQuantity.value = quantity; // Définit la quantité actuelle
		itemQuantity.min = "1"; // Quantité minimale
		itemQuantity.max = MAX_QTY.toString(); // Quantité maximale
		itemQuantity.addEventListener("change", function () {
			updateCartQuantity(index, parseInt(itemQuantity.value)); // Appelle une fonction pour mettre à jour
		});





        var itemPrice = document.createElement("span");
        itemPrice.className = "prix";
        itemPrice.textContent = (product.price * quantity).toFixed(2);

        // Bouton pour retirer du panier
        var removeButton = document.createElement("button");
        removeButton.className = "retirer";
        removeButton.addEventListener("click", function () {
            removeFromCart(index);
        });

        // Ajouter les éléments au produit
        item.appendChild(itemFigure);
        item.appendChild(itemName);
        item.appendChild(itemQuantity);
        item.appendChild(itemPrice);
        item.appendChild(removeButton);

        // Ajouter le produit au panier
        cart.appendChild(item);
    }

    // Mettre à jour le total
    updateTotal();
};


var updateTotal = function () {
    var cart = document.querySelector("#panier .achats");
    var items = cart.querySelectorAll(".achat");
    var total = 0;

    // Calculer le total
    items.forEach(function (item) {
        var quantity = parseInt(item.querySelector(".quantite").textContent);
        var price = parseFloat(item.querySelector(".prix").textContent);
        total += price;
    });

    // Mettre à jour le total dans la div#total
    var totalElement = document.querySelector("#panier #montant");
    totalElement.textContent = total.toFixed(2);
};

var removeFromCart = function (index) {
    var cartItem = document.getElementById("cart-item-" + index);
    if (cartItem) {
        cartItem.remove(); // Retirer l'élément du DOM
    }

    // Mettre à jour le total
    updateTotal();
};

var updateCartQuantity = function (index, newQuantity) {
    if (newQuantity <= 0 || newQuantity > MAX_QTY) {
        alert("Quantité invalide. La valeur doit être comprise entre 1 et " + MAX_QTY);
        return; // Annule si la quantité n'est pas valide
    }

    var product = catalog[index]; // Obtenir le produit depuis le catalogue
    var item = document.getElementById("cart-item-" + index); // Trouver l'article dans le panier

    if (item) {
        // Mettre à jour la quantité
        var itemQuantity = item.querySelector(".quantite");
        itemQuantity.value = newQuantity; // Change la valeur dans le champ input

        // Mettre à jour le prix total pour cet article
        var itemPrice = item.querySelector(".prix");
        itemPrice.textContent = (product.price * newQuantity).toFixed(2);

        // Mettre à jour le total général
        updateTotal();
    }
};

/*
* create and return the figure block for this product
* see the static version of the project to know what the <figure> should be
* @param product (product object) = the product for which the figure block is created
*
* TODO : write the correct code
*/
var createFigureBlock = function (product) {
	// this is absolutely not the correct answer !
	// TODO 
	var figure = document.createElement("figure");
	
	var img = document.createElement("img");
	img.src = product.image;
	img.alt = product.name;

	figure.appendChild(img);
	return figure;
}
