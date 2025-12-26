

// // Get cart from localStorage
// function getCart() {
//     return JSON.parse(localStorage.getItem("cart")) || [];
// }

// // Save cart to localStorage
// function saveCart(cart) {
//     localStorage.setItem("cart", JSON.stringify(cart));
// }

// // Load cart items on cart.html page
// function loadCart() {
//     let cart = getCart();
//     let cartItems = document.getElementById("cart-items");
//     let totalAmount = 0;

//     if (!cartItems) return; // Exit if not on cart page

//     cartItems.innerHTML = "";

//     if (cart.length === 0) {
//         cartItems.innerHTML = `
//             <tr>
//                 <td colspan="6" class="text-center">Your cart is empty</td>
//             </tr>
//         `;
//         document.getElementById("total-amount").innerText = "0";
//         return;
//     }

//     cart.forEach((item, index) => {
//         let itemTotal = item.price * item.quantity;
//         totalAmount += itemTotal;

//         cartItems.innerHTML += `
//             <tr>
//                 <td><img src="${item.imageUrl}" width="50" alt="${item.name}"></td>
//                 <td>${item.name}</td>
//                 <td>₹${item.price}</td>
//                 <td>
//                     <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${index}, -1)">-</button>
//                     ${item.quantity}
//                     <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${index}, 1)">+</button>
//                 </td>
//                 <td>₹${itemTotal}</td>
//                 <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">X</button></td>
//             </tr>
//         `;
//     });

//     document.getElementById("total-amount").innerText = totalAmount;
// }

// // Add product to cart
// function addToCart(id, name, price, imageUrl) {
//     console.log("Adding product to cart:", id, name, price, imageUrl);

//     let cart = getCart();
//     price = parseFloat(price);

//     let itemIndex = cart.findIndex((item) => item.id === id);
    
//     if (itemIndex !== -1) {
//         cart[itemIndex].quantity += 1;
//     } else {
//         cart.push({
//             id: id,
//             name: name,
//             price: price,
//             imageUrl: imageUrl,
//             quantity: 1
//         });
//     }

//     saveCart(cart);
//     updateCartCounter();
//     alert("Product added to cart!");
// }

// // Update cart counter badge
// function updateCartCounter() {
//     let cart = getCart();
//     let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
//     let cartBadge = document.querySelector(".cart-badge");
//     if (cartBadge) {
//         cartBadge.innerText = totalItems;
//     }
// }

// // Change quantity of item in cart
// function changeQuantity(index, change) {
//     let cart = getCart();
    
//     cart[index].quantity += change;
    
//     if (cart[index].quantity <= 0) {
//         cart.splice(index, 1);
//     }
    
//     saveCart(cart);
//     loadCart();
//     updateCartCounter();
// }

// // Remove item from cart
// function removeFromCart(index) {
//     let cart = getCart();
//     cart.splice(index, 1);
//     saveCart(cart);
//     loadCart();
//     updateCartCounter();
// }

// // Checkout function
// function checkout() {
//     let cart = getCart();
    
//     if (cart.length === 0) {
//         alert("Your cart is empty!");
//         return;
//     }
    
//     let totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
//     if (confirm(`Proceed to payment of ₹${totalAmount}?`)) {
//         // Here you would typically send order to backend
//         alert("Payment successful! Order placed.");
//         localStorage.removeItem("cart");
//         loadCart();
//         updateCartCounter();
//         window.location.href = "index.html";
//     }
// }
// // Checkout function - Add/Replace this in your cart.js
// function checkout() {
//     let cart = getCart();
    
//     if (cart.length === 0) {
//         alert("Your cart is empty!");
//         return;
//     }
    
//     // Redirect to payment page
//     window.location.href = "payment.html";
// }

// // Initialize cart counter on page load
// document.addEventListener("DOMContentLoaded", () => {
//     updateCartCounter();
//     loadCart(); // This will only work on cart.html page
// });

// cart.js - Updated with proper cart counter management

// Get cart from localStorage
// cart.js - Cart Management Functions

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Load cart items on cart.html page
function loadCart() {
    let cart = getCart();
    let cartItems = document.getElementById("cart-items");
    let totalAmount = 0;

    if (!cartItems) return; // Exit if not on cart page

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">Your cart is empty</td>
            </tr>
        `;
        document.getElementById("total-amount").innerText = "0";
        return;
    }

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;

        cartItems.innerHTML += `
            <tr>
                <td><img src="${item.imageUrl}" width="50" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>₹${item.price}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${index}, -1)">-</button>
                    ${item.quantity}
                    <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${index}, 1)">+</button>
                </td>
                <td>₹${itemTotal}</td>
                <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">X</button></td>
            </tr>
        `;
    });

    document.getElementById("total-amount").innerText = totalAmount;
}

// Add product to cart
function addToCart(id, name, price, imageUrl) {
    console.log("Adding product to cart:", id, name, price, imageUrl);

    let cart = getCart();
    price = parseFloat(price);

    let itemIndex = cart.findIndex((item) => item.id === id);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            imageUrl: imageUrl,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCounter();
    alert("Product added to cart!");
}

// Update cart counter badge
function updateCartCounter() {
    let cart = getCart();
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart badge
    let cartBadge = document.querySelector(".cart-badge");
    if (cartBadge) {
        cartBadge.innerText = totalItems;
        
        // Hide badge if cart is empty
        if (totalItems === 0) {
            cartBadge.style.display = 'none';
        } else {
            cartBadge.style.display = 'inline-block';
        }
    }
    
    console.log("Cart counter updated:", totalItems);
}

// Change quantity of item in cart
function changeQuantity(index, change) {
    let cart = getCart();
    
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    saveCart(cart);
    loadCart();
    updateCartCounter();
}

// Remove item from cart
function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    loadCart();
    updateCartCounter();
}

// Checkout function - Redirects to payment page
function checkout() {
    let cart = getCart();
    
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    // Redirect to payment page
    window.location.href = "payment.html";
}

// Initialize cart counter on page load
document.addEventListener("DOMContentLoaded", () => {
    updateCartCounter();
    loadCart(); // This will only work on cart.html page
});

// Update cart counter when page becomes visible
document.addEventListener("visibilitychange", function() {
    if (!document.hidden) {
        updateCartCounter();
    }
});

// Also update when window regains focus
window.addEventListener("focus", function() {
    updateCartCounter();
});