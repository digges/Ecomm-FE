const BASE_URL = "https://ecomm-be1-production.up.railway.app";

async function loadProducts() {
    try {
        const response = await fetch(`${BASE_URL}/products`);
        const products = await response.json();
        console.log("Products loaded:", products);
        
        let trendingList = document.getElementById("trending-products");
        let clothingList = document.getElementById("clothing-products");
        let electronicsList = document.getElementById("electronics-products");

        if (trendingList) trendingList.innerHTML = "";
        if (clothingList) clothingList.innerHTML = "";
        if (electronicsList) electronicsList.innerHTML = "";

        products.forEach((product) => {
            let productCard = `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card h-100">
                        <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="price"><strong>₹${product.price}</strong></p>
                            <button class="btn btn-primary mt-auto"
                            onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${product.imageUrl}')">
                            Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;

            if (product.category === "Clothing") {
                if (clothingList) clothingList.innerHTML += productCard;
            } else if (product.category === "Electronics") {
                if (electronicsList) electronicsList.innerHTML += productCard;
            } else {
                if (trendingList) trendingList.innerHTML += productCard;
            }
        });

        // Update cart counter on page load
        updateCartCounter();

    } catch (error) {
        console.error("Error fetching products:", error);
        
        // Show error message to user
        const containers = [
            document.getElementById("trending-products"),
            document.getElementById("clothing-products"),
            document.getElementById("electronics-products")
        ];
        
        containers.forEach(container => {
            if (container) {
                container.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-danger" role="alert">
                            <i class="fas fa-exclamation-triangle"></i>
                            Failed to load products. Please check if the backend is running on ${BASE_URL}
                        </div>
                    </div>
                `;
            }
        });
    }
}