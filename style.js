// Product information
const products = [
    {
        id: 1,
        name: "Headphones",
        price: 1200,
        category: "Electronics",
        emoji: "🎧"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 2500,
        category: "Electronics",
        emoji: "⌚"
    },
    {
        id: 3,
        name: "T-Shirt",
        price: 600,
        category: "Clothing",
        emoji: "👕"
    },
    {
        id: 4,
        name: "Shoes",
        price: 1800,
        category: "Clothing",
        emoji: "👟"
    },
    {
        id: 5,
        name: "Backpack",
        price: 900,
        category: "Accessories",
        emoji: "🎒"
    },
    {
        id: 6,
        name: "Sunglasses",
        price: 700,
        category: "Accessories",
        emoji: "🕶️"
    }
];

let cart = [];
let discountPercent = 0;

// Get HTML elements
const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");


// Display products
function displayProducts() {
    const searchText = document
        .getElementById("search")
        .value.toLowerCase();

    const selectedCategory =
        document.getElementById("category").value;

    const sortValue =
        document.getElementById("sort").value;

    // Filter products using search and category
    let filteredProducts = products.filter(function(product) {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Sort products by price
    if (sortValue === "low") {
        filteredProducts.sort(function(a, b) {
            return a.price - b.price;
        });
    } else if (sortValue === "high") {
        filteredProducts.sort(function(a, b) {
            return b.price - a.price;
        });
    }

    // Display the filtered products
    productList.innerHTML = "";

    document.getElementById("no-products").hidden =
        filteredProducts.length !== 0;

    filteredProducts.forEach(function(product) {
        productList.innerHTML += `
            <div class="product-card">
                <div class="emoji">${product.emoji}</div>

                <h3>${product.name}</h3>

                <p>Category: ${product.category}</p>

                <p><strong>Price: ₹${product.price}</strong></p>

                <button onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
    });
}


// Add product to cart
function addToCart(productId) {
    const existingItem = cart.find(function(item) {
        return item.id === productId;
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    displayCart();
}


// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(function(item) {
        return item.id !== productId;
    });

    displayCart();
}


// Increase or decrease quantity
function changeQuantity(productId, change) {
    const item = cart.find(function(item) {
        return item.id === productId;
    });

    if (!item) {
        return;
    }

    item.quantity += change;

    // Remove the item if its quantity becomes zero
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    displayCart();
}


// Calculate the subtotal
function calculateSubtotal() {
    let subtotal = 0;

    cart.forEach(function(item) {
        const product = products.find(function(product) {
            return product.id === item.id;
        });

        subtotal += product.price * item.quantity;
    });

    return subtotal;
}


// Display cart and calculate prices
function displayCart() {
    cartItems.innerHTML = "";

    let totalQuantity = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    }

    cart.forEach(function(item) {
        const product = products.find(function(product) {
            return product.id === item.id;
        });

        totalQuantity += item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <h3>${product.name}</h3>

                    <p>Price: ₹${product.price}</p>

                    <p>Quantity: ${item.quantity}</p>

                    <p>
                        Item Total: ₹${product.price * item.quantity}
                    </p>
                </div>

                <div class="quantity-buttons">
                    <button
                        onclick="changeQuantity(${product.id}, -1)"
                    >-</button>

                    <span>${item.quantity}</span>

                    <button
                        onclick="changeQuantity(${product.id}, 1)"
                    >+</button>

                    <button
                        class="remove-button"
                        onclick="removeFromCart(${product.id})"
                    >Remove</button>
                </div>
            </div>
        `;
    });

    const subtotal = calculateSubtotal();
    const discount = subtotal * discountPercent / 100;
    const total = subtotal - discount;

    document.getElementById("cart-count").textContent =
        totalQuantity;

    document.getElementById("subtotal").textContent =
        subtotal.toFixed(2);

    document.getElementById("discount").textContent =
        discount.toFixed(2);

    document.getElementById("total").textContent =
        total.toFixed(2);

    document.getElementById("checkout-total").textContent =
        total.toFixed(2);
}


// Search products
document.getElementById("search").addEventListener(
    "input",
    displayProducts
);


// Filter by category
document.getElementById("category").addEventListener(
    "change",
    displayProducts
);


// Sort products
document.getElementById("sort").addEventListener(
    "change",
    displayProducts
);


// Clear the cart
document.getElementById("clear-cart").addEventListener(
    "click",
    function() {
        cart = [];
        discountPercent = 0;

        document.getElementById("coupon").value = "";

        document.getElementById("coupon-message").textContent = "";

        displayCart();
    }
);


// Apply discount coupon
document.getElementById("coupon-form").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        const couponCode = document
            .getElementById("coupon")
            .value.trim()
            .toUpperCase();

        const message =
            document.getElementById("coupon-message");

        if (cart.length === 0) {
            discountPercent = 0;
            message.textContent = "Add products before applying a coupon.";
            displayCart();
            return;
        }

        if (couponCode === "SAVE10") {
            discountPercent = 10;
            message.textContent = "10% discount applied!";
        } else if (couponCode === "SAVE20") {
            discountPercent = 20;
            message.textContent = "20% discount applied!";
        } else {
            discountPercent = 0;
            message.textContent = "Invalid coupon code.";
        }

        displayCart();
    }
);


// Open checkout
document.getElementById("checkout-button").addEventListener(
    "click",
    function() {
        if (cart.length === 0) {
            alert("Please add products to your cart first.");
            return;
        }

        document.getElementById("checkout").hidden = false;

        document.getElementById("checkout").scrollIntoView({
            behavior: "smooth"
        });
    }
);


// Return to cart
document.getElementById("back-button").addEventListener(
    "click",
    function() {
        document.getElementById("checkout").hidden = true;

        document.getElementById("cart").scrollIntoView({
            behavior: "smooth"
        });
    }
);


// Place order
document.getElementById("checkout-form").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        if (cart.length === 0) {
            document.getElementById("order-message").textContent =
                "Your cart is empty.";

            return;
        }

        const customerName =
            document.getElementById("name").value.trim();

        document.getElementById("order-message").textContent =
            "Thank you, " + customerName +
            "! Your demo order has been placed successfully.";

        // Empty the cart after placing the demo order
        cart = [];
        discountPercent = 0;

        document.getElementById("coupon").value = "";
        document.getElementById("coupon-message").textContent = "";

        displayCart();

        document.getElementById("checkout-form").reset();
    }
);


// Display everything when the page opens
displayProducts();
displayCart();