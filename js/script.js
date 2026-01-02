// script.js - Payment Page Script for Cart System

document.addEventListener("DOMContentLoaded", function () {
  // Get cart from localStorage
  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  // Calculate total from cart
  function calculateCartTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Check if cart is empty
  const cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is empty!");
    window.location.href = "cart.html";
    return;
  }

  // Calculate prices from cart
  const ORIGINAL_PRICE = calculateCartTotal();
  const DISCOUNT_PERCENT = 60.5; // EARLYBIRD discount
  const DISCOUNT_AMOUNT = (ORIGINAL_PRICE * DISCOUNT_PERCENT) / 100;
  const DISCOUNTED_PRICE = ORIGINAL_PRICE - DISCOUNT_AMOUNT;

  // Update price display on page load
  document.querySelector(".price-row:nth-child(1) span:last-child").textContent = `₹${ORIGINAL_PRICE.toFixed(2)}`;
  document.querySelector(".price-row:nth-child(2) span:last-child").textContent = `-₹${DISCOUNT_AMOUNT.toFixed(2)}`;
  document.querySelector(".total-row span:last-child").textContent = `₹${DISCOUNTED_PRICE.toFixed(2)}`;
  document.querySelector(".pay-button").innerHTML = `<i class="fas fa-lock"></i> Pay ₹${Math.round(DISCOUNTED_PRICE)}`;

  // Price display elements
  const discountElement = document.querySelector(".price-row:nth-child(2) span:last-child");
  const totalElement = document.querySelector(".total-row span:last-child");
  const payButtonElement = document.querySelector(".pay-button");

  // Coupon code elements
  const clearButton = document.querySelector(".clear-coupon");
  const couponInput = document.getElementById("coupon");
  const successMessage = document.querySelector(".success-message");

  // Coupon code functionality
  clearButton.addEventListener("click", function () {
    couponInput.value = "";
    successMessage.style.display = "none";
    updatePricing(false);
    clearButton.style.backgroundColor = "#e5e7eb";
    setTimeout(() => {
      clearButton.style.backgroundColor = "transparent";
    }, 300);
  });

  couponInput.addEventListener("input", function () {
    if (this.value.toUpperCase() === "EARLYBIRD") {
      successMessage.style.display = "flex";
      updatePricing(true);
    } else {
      successMessage.style.display = "none";
      updatePricing(false);
    }
  });

  // Function to update pricing based on coupon status
  function updatePricing(hasDiscount) {
    if (hasDiscount) {
      discountElement.textContent = `-₹${DISCOUNT_AMOUNT.toFixed(2)}`;
      totalElement.textContent = `₹${DISCOUNTED_PRICE.toFixed(2)}`;
      payButtonElement.innerHTML = `<i class="fas fa-lock"></i> Pay ₹${Math.round(DISCOUNTED_PRICE)}`;
    } else {
      discountElement.textContent = `₹0.00`;
      totalElement.textContent = `₹${ORIGINAL_PRICE.toFixed(2)}`;
      payButtonElement.innerHTML = `<i class="fas fa-lock"></i> Pay ₹${Math.round(ORIGINAL_PRICE)}`;
    }
  }

  // Input field focus effects
  const inputFields = document.querySelectorAll("input");
  inputFields.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });
    input.addEventListener("blur", function () {
      this.parentElement.classList.remove("focused");
    });
  });

  // Show more functionality
  const showMoreButton = document.querySelector(".show-more");
  if (showMoreButton) {
    const showMoreText = document.getElementById("show-more-text");
    const showMoreIcon = showMoreButton.querySelector("i");
    let expanded = false;

    showMoreButton.addEventListener("click", function () {
      expanded = !expanded;
      if (expanded) {
        showMoreText.textContent = "Show less";
        showMoreIcon.classList.remove("fa-chevron-down");
        showMoreIcon.classList.add("fa-chevron-up");
      } else {
        showMoreText.textContent = "Show more";
        showMoreIcon.classList.remove("fa-chevron-up");
        showMoreIcon.classList.add("fa-chevron-down");
      }
    });
  }

  // ============================================
  // MAIN PAYMENT BUTTON HANDLER
  // ============================================
  const payButton = document.querySelector(".pay-button");
  payButton.addEventListener("click", function () {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    // Reset validation
    document.querySelectorAll(".form-group").forEach((group) => {
      group.classList.remove("error");
    });

    let hasError = false;
    if (!name) {
      document.getElementById("name").parentElement.classList.add("error");
      hasError = true;
    }
    if (!email || !isValidEmail(email)) {
      document.getElementById("email").parentElement.classList.add("error");
      hasError = true;
    }
    if (!phone || !isValidPhone(phone)) {
      document.getElementById("phone").parentElement.parentElement.classList.add("error");
      hasError = true;
    }

    if (hasError) {
      shakeButton();
      alert("Please fill all required fields correctly.");
      return;
    }

    // Get current price based on coupon
    const currentPrice = couponInput.value.toUpperCase() === "EARLYBIRD" 
      ? Math.round(DISCOUNTED_PRICE)
      : Math.round(ORIGINAL_PRICE);

    // Show loading state
    payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    payButton.disabled = true;

    // Create Razorpay order via your backend
    fetch("https://pay-deployment.onrender.com/api/payment/create-Order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        courseName: "Shopping Cart Payment",
        amount: currentPrice,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const razorpayOrderId = data.id;

        const options = {
          key: "rzp_test_RoHpC7vB30UOU6", // Your Razorpay key
          amount: currentPrice * 100,
          currency: "INR",
          name: "SHOPLANE",
          description: "Product Purchase",
          order_id: razorpayOrderId,
          prefill: {
            name: name,
            email: email,
            contact: phone,
          },
          theme: {
            color: "#667eea",
          },
          modal: {
            backdropclose: false,
            escape: false,
            ondismiss: function () {
              // User cancelled payment
              payButton.innerHTML = `<i class="fas fa-lock"></i> Pay ₹${currentPrice}`;
              payButton.disabled = false;
            },
          },
          handler: function (response) {
            // ✅ PAYMENT SUCCESS - THIS IS THE CRITICAL PART
            console.log("Payment successful!", response);

            // Update backend with payment success
            fetch("https://pay-deployment.onrender.com/api/payment/update-Order", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                status: "SUCCESS",
              }),
            })
              .then(() => {
                // Save order to history
                saveOrderHistory(response.razorpay_payment_id, currentPrice);

                // Clear the cart from localStorage
                localStorage.removeItem("cart");
                console.log("Cart cleared from localStorage!");

                // Show success message
                showSuccessMessage(currentPrice);

                // Redirect to index.html after 2 seconds
                setTimeout(() => {
                  window.location.href = "index.html";
                }, 2000);
              })
              .catch((err) => {
                console.error("Backend update error:", err);
                
                // Even if backend fails, clear cart and redirect
                localStorage.removeItem("cart");
                showSuccessMessage(currentPrice);
                setTimeout(() => {
                  window.location.href = "index.html";
                }, 2000);
              });
          },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      })
      .catch((err) => {
        console.error("Error creating order:", err);
        alert("Something went wrong. Please try again.");
        payButton.disabled = false;
        payButton.innerHTML = `<i class="fas fa-lock"></i> Pay ₹${currentPrice}`;
      });
  });

  // Save order to localStorage for order history
  function saveOrderHistory(paymentId, amount) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const cart = getCart();
    
    const newOrder = {
      orderId: paymentId,
      date: new Date().toISOString(),
      items: cart,
      totalAmount: amount,
      status: 'Completed'
    };
    
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    console.log("Order saved to history:", newOrder);
  }

  // Show success message overlay
  function showSuccessMessage(amount) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
    `;

    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
      background: white;
      padding: 50px 70px;
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      animation: slideIn 0.4s ease-out;
    `;

    messageBox.innerHTML = `
      <div style="font-size: 80px; color: #10b981; margin-bottom: 20px;">
        ✓
      </div>
      <h2 style="color: #1f2937; margin-bottom: 15px; font-size: 28px;">Payment Successful!</h2>
      <p style="color: #6b7280; font-size: 18px; margin-bottom: 10px;">
        Thank you for your purchase of <strong>₹${amount}</strong>
      </p>
      <p style="color: #9ca3af; font-size: 14px;">
        Redirecting to home page...
      </p>
    `;

    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: scale(0.7);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Helper functions
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^\d{10}$/.test(phone);
  }

  function shakeButton() {
    payButton.classList.add("shake");
    setTimeout(() => {
      payButton.classList.remove("shake");
    }, 500);
  }

  // Add CSS for validation and animations
  const style = document.createElement("style");
  style.textContent = `
    .form-group.error input {
      border-color: #ef4444;
      background-color: #fef2f2;
    }
    
    .form-group.focused input {
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }
    
    .shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
  `;
  document.head.appendChild(style);

});
