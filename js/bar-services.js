        document.addEventListener('DOMContentLoaded', function() {
            // ========== FLOATING BUTTON FUNCTIONALITY ==========
            document.querySelector('.action-btn.whatsapp').addEventListener('click', function() {
                window.open('https://wa.me/2349166385000', '_blank');
            });
            
            document.querySelector('.action-btn.chat').addEventListener('click', function() {
                // Launch JivoChat widget
                if(typeof jivo_api !== 'undefined') {
                    jivo_api.open();
                } else {
                    alert('Live chat support is currently unavailable. Please try again later.');
                }
            });
            
            document.querySelector('.action-btn.book').addEventListener('click', function() {
                window.location.href = 'contact.html';
            });

            // ========== SEARCH FUNCTIONALITY ==========
            // Search index with diverse categories
            const searchIndex = [
                { name: "Tropical Sunrise", category: "Cocktail", price: 3500, page: "tropical-sunrise.html" },
                { name: "Golden Mule", category: "Cocktail", price: 3200, page: "golden-mule.html" },
                { name: "Coconut Shrimp", category: "Appetizer", price: 5200, page: "coconut-shrimp.html" },
                { name: "Spicy Chicken Wings", category: "Appetizer", price: 4500, page: "spicy-chicken-wings.html" },
                { name: "Beef Skewers", category: "Appetizer", price: 6800, page: "beef-skewers.html" },
                { name: "Bar Service", category: "Service", page: "bar-service.html" },
                { name: "Restaurant Service", category: "Service", page: "restaurant-service.html" },
                { name: "Night Club Service", category: "Service", page: "nightclub-service.html" },
                { name: "Events Hosting", category: "Service", page: "events-hosting.html" },
                { name: "Industrial Training", category: "Service", page: "industrial-training.html" },
                { name: "Margarita", category: "Cocktail", price: 3200, page: "margarita.html" },
                { name: "Mojito", category: "Cocktail", price: 3000, page: "mojito.html" },
                { name: "Mango Sorbet", category: "Dessert", price: 2800, page: "mango-sorbet.html" },
                { name: "Tropical Salad", category: "Appetizer", price: 3800, page: "tropical-salad.html" },
                { name: "Seafood Platter", category: "Main Course", price: 7500, page: "seafood-platter.html" },
                { name: "VIP Booth", category: "Night Club", price: 20000, page: "vip-booth.html" },
                { name: "Mixology Class", category: "Training", price: 15000, page: "mixology-class.html" },
                { name: "Private Dining", category: "Service", price: 5000, page: "private-dining.html" },
            ];

            // Function to perform search
            function search(query) {
                if (!query.trim()) return [];
                
                // Normalize query
                const normalizedQuery = query.toLowerCase().trim();
                
                // Simple fuzzy matching
                return searchIndex.filter(item => {
                    const nameMatch = item.name.toLowerCase().includes(normalizedQuery);
                    const categoryMatch = item.category.toLowerCase().includes(normalizedQuery);
                    const priceMatch = item.price && item.price.toString().includes(normalizedQuery);
                    
                    return nameMatch || categoryMatch || priceMatch;
                });
            }

            // Function to display autocomplete results
            function showAutocompleteResults(results, container) {
                container.innerHTML = '';
                if (results.length === 0) {
                    container.style.display = 'none';
                    return;
                }

                results.forEach(result => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'result-item';
                    resultItem.innerHTML = `
                        <span class="item-name">${result.name}</span>
                        <span class="item-category">${result.category}</span>
                    `;
                    resultItem.addEventListener('click', () => {
                        // Redirect to the item's page
                        window.location.href = result.page;
                    });
                    container.appendChild(resultItem);
                });

                container.style.display = 'block';
            }

            // Set up search for desktop and mobile
            const searchInput = document.getElementById('searchInput');
            const searchButton = document.getElementById('searchButton');
            const autocompleteResults = document.getElementById('autocompleteResults');

            const mobileSearchInput = document.getElementById('mobileSearchInput');
            const mobileSearchButton = document.getElementById('mobileSearchButton');
            const mobileAutocompleteResults = document.getElementById('mobileAutocompleteResults');

            if (searchInput) {
                searchInput.addEventListener('input', () => {
                    const results = search(searchInput.value);
                    showAutocompleteResults(results, autocompleteResults);
                });

                searchButton.addEventListener('click', () => {
                    // Perform the search and redirect to first result
                    const results = search(searchInput.value);
                    if (results.length > 0) {
                        window.location.href = results[0].page;
                    }
                });

                // Hide autocomplete when clicking outside
                document.addEventListener('click', (e) => {
                    if (!searchInput.contains(e.target) && !autocompleteResults.contains(e.target)) {
                        autocompleteResults.style.display = 'none';
                    }
                });
            }

            if (mobileSearchInput) {
                mobileSearchInput.addEventListener('input', () => {
                    const results = search(mobileSearchInput.value);
                    showAutocompleteResults(results, mobileAutocompleteResults);
                });

                mobileSearchButton.addEventListener('click', () => {
                    const results = search(mobileSearchInput.value);
                    if (results.length > 0) {
                        window.location.href = results[0].page;
                    }
                });
            }

            // ========== CART FUNCTIONALITY WITH LOCALSTORAGE ==========
            let cart = [];
            let currentItem = null;
            let selectedPayment = null;
            
            const cartCountElements = document.querySelectorAll('.cart-count');
            const cartLinks = document.querySelectorAll('#cartLink, #mobileCartLink');
            const checkoutLinks = document.querySelectorAll('#checkoutLink, #mobileCheckoutLink');
            const orderButtons = document.querySelectorAll('.btn-order');
            const addGoldenMuleBtn = document.getElementById('addGoldenMule');
            const placeOrderBtn = document.getElementById('placeOrderBtn');
            const confirmOrderBtn = document.getElementById('confirmOrderBtn');
            const closeReceiptBtn = document.getElementById('closeReceiptBtn');
            const printReceiptBtn = document.getElementById('printReceiptBtn');
            const notification = document.getElementById('notification');
            const notificationMessage = document.getElementById('notificationMessage');
            const notificationSound = document.getElementById('notificationSound');
            
            // Popup elements
            const quantityPopup = document.getElementById('quantityPopup');
            const checkoutPopup = document.getElementById('checkoutPopup');
            const paymentPopup = document.getElementById('paymentPopup');
            const receiptPopup = document.getElementById('receiptPopup');
            
            // Popup content elements
            const popupItemName = document.getElementById('popupItemName');
            const itemQuantity = document.getElementById('itemQuantity');
            const cartItemsContainer = document.getElementById('cartItemsContainer');
            const cartTotal = document.getElementById('cartTotal');
            const receiptItems = document.getElementById('receiptItems');
            const receiptTotal = document.getElementById('receiptTotal');
            const receiptNumber = document.getElementById('receiptNumber');
            const receiptDate = document.getElementById('receiptDate');
            const paymentStatus = document.getElementById('paymentStatus');
            const barcodeNumber = document.getElementById('barcodeNumber');
            
            // Load cart from localStorage
            function loadCart() {
                const savedCart = localStorage.getItem('mangoCart');
                if (savedCart) {
                    cart = JSON.parse(savedCart);
                }
                updateCartCount();
            }
            
            // Save cart to localStorage
            function saveCart() {
                localStorage.setItem('mangoCart', JSON.stringify(cart));
            }
            
            // Update cart count display
            function updateCartCount() {
                const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
                cartCountElements.forEach(element => {
                    element.textContent = totalItems;
                });
                saveCart(); // Save after update
            }
            
            // Show notification
            function showNotification(message, isSuccess = false) {
                notificationMessage.textContent = message;
                
                // Add success class if needed
                if (isSuccess) {
                    notification.classList.add('order-success');
                } else {
                    notification.classList.remove('order-success');
                }
                
                notification.classList.add('show');
                
                // Play notification sound
                notificationSound.currentTime = 0;
                notificationSound.play();
                
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            }
            
            // Open quantity popup
            function openQuantityPopup(itemName, itemPrice) {
                currentItem = {
                    name: itemName,
                    price: parseInt(itemPrice)
                };
                popupItemName.textContent = currentItem.name;
                itemQuantity.value = 1;
                quantityPopup.classList.add('active');
            }
            
            // Add Golden Mule to cart
            addGoldenMuleBtn && addGoldenMuleBtn.addEventListener('click', () => {
                openQuantityPopup('Golden Mule', '3200');
            });
            
            // Add to cart buttons
            orderButtons.forEach(button => {
                button.addEventListener('click', () => {
                    openQuantityPopup(button.dataset.item, button.dataset.price);
                });
            });
            
            // Quantity controls
            document.querySelector('.minus').addEventListener('click', () => {
                if (itemQuantity.value > 1) {
                    itemQuantity.value = parseInt(itemQuantity.value) - 1;
                }
            });
            
            document.querySelector('.plus').addEventListener('click', () => {
                itemQuantity.value = parseInt(itemQuantity.value) + 1;
            });
            
            // Cancel button in quantity popup
            document.querySelector('.btn-cancel').addEventListener('click', () => {
                quantityPopup.classList.remove('active');
            });
            
            // Add item to cart
            document.querySelector('.btn-add').addEventListener('click', () => {
                if (currentItem) {
                    const quantity = parseInt(itemQuantity.value);
                    
                    // Check if item already in cart
                    const existingItemIndex = cart.findIndex(item => item.name === currentItem.name);
                    
                    if (existingItemIndex !== -1) {
                        // Update quantity if already in cart
                        cart[existingItemIndex].quantity += quantity;
                    } else {
                        // Add new item to cart
                        cart.push({
                            name: currentItem.name,
                            price: currentItem.price,
                            quantity: quantity
                        });
                    }
                    
                    updateCartCount();
                    quantityPopup.classList.remove('active');
                    
                    // Show stylish notification
                    showNotification(`${quantity} ${currentItem.name} added to cart!`);
                }
            });
            
            // Open checkout popup
            checkoutLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (cart.length === 0) {
                        showNotification('Your cart is empty!');
                        return;
                    }
                    renderCartItems();
                    checkoutPopup.classList.add('active');
                });
            });
            
            // Render cart items in checkout popup
            function renderCartItems() {
                cartItemsContainer.innerHTML = '';
                let total = 0;
                
                cart.forEach((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">₦${item.price.toLocaleString()}</div>
                        </div>
                        <div class="cart-item-quantity">
                            <button class="decrease-quantity" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-quantity" data-index="${index}">+</button>
                        </div>
                        <div class="cart-item-remove" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </div>
                    `;
                    cartItemsContainer.appendChild(cartItem);
                });
                
                cartTotal.textContent = `Total: ₦${total.toLocaleString()}`;
                
                // Add event listeners to quantity buttons
                document.querySelectorAll('.decrease-quantity').forEach(button => {
                    button.addEventListener('click', () => {
                        const index = button.dataset.index;
                        if (cart[index].quantity > 1) {
                            cart[index].quantity--;
                        } else {
                            cart.splice(index, 1);
                        }
                        renderCartItems();
                        updateCartCount();
                    });
                });
                
                document.querySelectorAll('.increase-quantity').forEach(button => {
                    button.addEventListener('click', () => {
                        const index = button.dataset.index;
                        cart[index].quantity++;
                        renderCartItems();
                        updateCartCount();
                    });
                });
                
                document.querySelectorAll('.cart-item-remove').forEach(button => {
                    button.addEventListener('click', () => {
                        const index = button.dataset.index;
                        cart.splice(index, 1);
                        renderCartItems();
                        updateCartCount();
                    });
                });
            }
            
            // Place order button
            placeOrderBtn.addEventListener('click', () => {
                checkoutPopup.classList.remove('active');
                paymentPopup.classList.add('active');
                
                // Reset payment selection
                document.querySelectorAll('.payment-option').forEach(option => {
                    option.classList.remove('selected');
                });
                selectedPayment = null;
            });
            

            // Payment option selection
            document.querySelectorAll('.payment-option').forEach(option => {
                option.addEventListener('click', () => {
                    document.querySelectorAll('.payment-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    option.classList.add('selected');
                    selectedPayment = option.dataset.payment;
                });
            });
            
            // Confirm order
            confirmOrderBtn.addEventListener('click', () => {
                if (!selectedPayment) {
                    showNotification('Please select a payment method');
                    return;
                }
                
                paymentPopup.classList.remove('active');
                generateReceipt();
                receiptPopup.classList.add('active');
                
                // Clear cart after order
                cart = [];
                updateCartCount();
                
                // Show order success message
                showNotification('Order placed successfully! Thank you for your purchase!', true);
            });
            
            // Generate receipt
            function generateReceipt() {
                // Clear previous items
                receiptItems.innerHTML = '';
                
                let total = 0;
                
                // Add items to receipt
                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    
                    const receiptItem = document.createElement('div');
                    receiptItem.className = 'receipt-item';
                    receiptItem.innerHTML = `
                        <div>${item.quantity} x ${item.name}</div>
                        <div>₦${itemTotal.toLocaleString()}</div>
                    `;
                    receiptItems.appendChild(receiptItem);
                });
                
                // Add total
                receiptTotal.textContent = `₦${total.toLocaleString()}`;
                
                // Set receipt details
                const now = new Date();
                const dateStr = now.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
                const timeStr = now.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                receiptDate.textContent = `${dateStr}, ${timeStr}`;
                paymentStatus.textContent = selectedPayment === 'now' ? 'Paid' : 'Pending';
                
                // Generate receipt number
                const datePart = now.getDate().toString().padStart(2, '0') + 
                                (now.getMonth() + 1).toString().padStart(2, '0') + 
                                now.getFullYear().toString().substr(-2);
                const serialPart = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
                const receiptNum = `MW-${datePart}-${serialPart}`;
                receiptNumber.textContent = receiptNum;
                
                // Generate barcode
                barcodeNumber.textContent = receiptNum;
                JsBarcode("#receiptBarcode", receiptNum, {
                    format: "CODE128",
                    lineColor: "#000",
                    width: 2,
                    height: 60,
                    displayValue: false
                });
            }
            
            // Close receipt
            closeReceiptBtn.addEventListener('click', () => {
                receiptPopup.classList.remove('active');
            });
            
            // Print receipt
            printReceiptBtn.addEventListener('click', () => {
                window.print();
            });
            
            // Back button in payment popup
            document.querySelector('#paymentPopup .btn-cancel').addEventListener('click', () => {
                paymentPopup.classList.remove('active');
                checkoutPopup.classList.add('active');
            });
            
            // Continue shopping button in checkout popup
            document.querySelector('#checkoutPopup .btn-cancel').addEventListener('click', () => {
                checkoutPopup.classList.remove('active');
            });
            
            // Mobile menu toggle
            const mobileMenuToggle = document.getElementById('mobileMenuToggle');
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuClose = document.getElementById('mobileMenuClose');
            const servicesDropdown = document.getElementById('servicesDropdown');
            const mobileDropdown = document.getElementById('mobileDropdown');
            
            // Toggle mobile menu
            mobileMenuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                document.body.classList.toggle('no-scroll');
            });
            
            // Close mobile menu
            mobileMenuClose.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (mobileMenu.classList.contains('active') && 
                    !mobileMenu.contains(e.target) && 
                    !mobileMenuToggle.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
            
            // Mobile services dropdown
            servicesDropdown.addEventListener('click', (e) => {
                e.preventDefault();
                mobileDropdown.style.display = mobileDropdown.style.display === 'block' ? 'none' : 'block';
            });
            
            // Initialize cart on page load
            loadCart();
            
            // Prevent body scrolling when popups are open
            document.querySelectorAll('.popup-overlay').forEach(popup => {
                popup.addEventListener('click', function(e) {
                    if (e.target === this) {
                        this.classList.remove('active');
                        document.body.classList.remove('no-scroll');
                    }
                });
            });
            
            // ========== MENU CATEGORIES FUNCTIONALITY ==========
            const categoriesContainer = document.getElementById('categoriesContainer');
            const categoriesPagination = document.getElementById('categoriesPagination');
            const categoryPopup = document.getElementById('categoryPopup');
            const popupCategoryName = document.getElementById('popupCategoryName');
            const categoryItemsContainer = document.getElementById('categoryItemsContainer');
            const closeCategoryPopup = document.getElementById('closeCategoryPopup');
            
            // Beverage categories data
            const beverageCategories = [
                {
                    id: 1,
                    name: "Signature Cocktails",
                    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d",
                    items: [
                        {
                            name: "Tropical Sunrise",
                            description: "A refreshing blend of mango, pineapple, and orange with a hint of grenadine",
                            price: 4500,
                            image: "../media/images/tropical-sunrise.jpg"
                        },
                        {
                            name: "Golden Mule",
                            description: "Premium vodka, fresh lime, ginger beer, and mango puree",
                            price: 5500,
                            image: "../media/images/golden-mule.jpg"
                        },
                        {
                            name: "Mango Mojito",
                            description: "Our tropical twist on the classic mojito with fresh mango and mint",
                            price: 4500,
                            image: "../media/images/mango-mojito.jpg"
                        },
                        {
                            name: "Sunset Bliss",
                            description: "Tequila, mango nectar, lime, and a hint of chili for a spicy finish",
                            price: 5500,
                            image: "media/images/sunset-bliss.jpg"
                        }
                    ]
                },
                {
                    id: 2,
                    name: "Premium Spirits",
                    image: "https://images.unsplash.com/photo-1583961574487-8d8a9d3f8b7b",
                    items: [
                        {
                            name: "Single Malt Whisky",
                            description: "Aged 12 years with notes of oak and vanilla",
                            price: 6500,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        },
                        {
                            name: "Premium Vodka",
                            description: "Triple distilled for exceptional smoothness",
                            price: 6000,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        },
                        {
                            name: "Aged Rum",
                            description: "Dark rum aged in oak barrels with caramel notes",
                            price: 5800,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        }
                    ]
                },
                {
                    id: 3,
                    name: "Craft Beers",
                    image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13",
                    items: [
                        {
                            name: "Mango IPA",
                            description: "India Pale Ale with tropical mango notes",
                            price: 2500,
                            image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699"
                        },
                        {
                            name: "Golden Lager",
                            description: "Crisp and refreshing golden lager",
                            price: 2200,
                            image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699"
                        },
                        {
                            name: "Stout Reserve",
                            description: "Dark stout with coffee and chocolate notes",
                            price: 2800,
                            image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699"
                        }
                    ]
                },
                {
                    id: 4,
                    name: "Fine Wines",
                    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb",
                    items: [
                        {
                            name: "Chardonnay",
                            description: "Buttery white wine with oak notes",
                            price: 8500,
                            image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb"
                        },
                        {
                            name: "Cabernet Sauvignon",
                            description: "Full-bodied red wine with dark fruit flavors",
                            price: 9200,
                            image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb"
                        },
                        {
                            name: "Rosé",
                            description: "Light and crisp rosé wine",
                            price: 7800,
                            image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb"
                        }
                    ]
                },
                {
                    id: 5,
                    name: "Non-Alcoholic",
                    image: "https://images.unsplash.com/photo-1575089976121-8ed7b2a54265",
                    items: [
                        {
                            name: "Virgin Mojito",
                            description: "Fresh mint, lime, and soda",
                            price: 2000,
                            image: "https://images.unsplash.com/photo-1575089976121-8ed7b2a54265"
                        },
                        {
                            name: "Tropical Punch",
                            description: "Mango, pineapple, and orange juice blend",
                            price: 2200,
                            image: "https://images.unsplash.com/photo-1575089976121-8ed7b2a54265"
                        },
                        {
                            name: "Iced Coffee",
                            description: "Cold brew coffee with cream",
                            price: 1800,
                            image: "https://images.unsplash.com/photo-1575089976121-8ed7b2a54265"
                        }
                    ]
                },
                {
                    id: 6,
                    name: "Rum Collection",
                    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d",
                    items: [
                        {
                            name: "White Rum",
                            description: "Light and crisp for cocktails",
                            price: 4800,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        },
                        {
                            name: "Dark Rum",
                            description: "Rich and complex with caramel notes",
                            price: 5200,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        },
                        {
                            name: "Spiced Rum",
                            description: "Infused with vanilla and spices",
                            price: 5500,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        }
                    ]
                },
                {
                    id: 7,
                    name: "Tequila & Mezcal",
                    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d",
                    items: [
                        {
                            name: "Blanco Tequila",
                            description: "Unaged with crisp agave flavor",
                            price: 5800,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        },
                        {
                            name: "Reposado Tequila",
                            description: "Aged 6 months in oak barrels",
                            price: 6500,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        },
                        {
                            name: "Artisanal Mezcal",
                            description: "Smoky and complex with earthy notes",
                            price: 7500,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        }
                    ]
                },
                {
                    id: 8,
                    name: "Gin Selection",
                    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d",
                    items: [
                        {
                            name: "London Dry Gin",
                            description: "Classic juniper-forward gin",
                            price: 5200,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        },
                        {
                            name: "Botanical Gin",
                            description: "Infused with floral and citrus notes",
                            price: 5800,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        },
                        {
                            name: "Barrel-Aged Gin",
                            description: "Aged in oak barrels for complexity",
                            price: 6500,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        }
                    ]
                },
                {
                    id: 9,
                    name: "Whiskey Collection",
                    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d",
                    items: [
                        {
                            name: "Bourbon",
                            description: "American corn whiskey with vanilla notes",
                            price: 6800,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        },
                        {
                            name: "Scotch",
                            description: "Single malt with smoky character",
                            price: 7500,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        },
                        {
                            name: "Irish Whiskey",
                            description: "Smooth and triple distilled",
                            price: 7200,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        }
                    ]
                },
                {
                    id: 10,
                    name: "Vodka Range",
                    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d",
                    items: [
                        {
                            name: "Classic Vodka",
                            description: "Neutral spirit perfect for mixing",
                            price: 4800,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        },
                        {
                            name: "Flavored Vodka",
                            description: "Infused with citrus or berry notes",
                            price: 5200,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        },
                        {
                            name: "Premium Vodka",
                            description: "Distilled multiple times for purity",
                            price: 5800,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        }
                    ]
                },
                {
                    id: 11,
                    name: "Champagne & Sparkling",
                    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d",
                    items: [
                        {
                            name: "Brut Champagne",
                            description: "Dry sparkling wine with fine bubbles",
                            price: 12000,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        },
                        {
                            name: "Prosecco",
                            description: "Italian sparkling wine with fruity notes",
                            price: 8500,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        },
                        {
                            name: "Sparkling Rosé",
                            description: "Pink bubbly with berry flavors",
                            price: 9800,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        }
                    ]
                },
                {
                    id: 12,
                    name: "Liqueurs",
                    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d",
                    items: [
                        {
                            name: "Coffee Liqueur",
                            description: "Rich coffee flavor with sweet notes",
                            price: 4500,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        },
                        {
                            name: "Orange Liqueur",
                            description: "Citrus-forward for tropical cocktails",
                            price: 4200,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        },
                        {
                            name: "Cream Liqueur",
                            description: "Smooth and velvety with vanilla",
                            price: 4800,
                            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                        }
                    ]
                }
            ];
            
            // Pagination variables
            let currentPage = 1;
            const categoriesPerPage = 10;
            
            // Function to render categories
            function renderCategories() {
                categoriesContainer.innerHTML = '';
                
                // Calculate start and end index for current page
                const startIndex = (currentPage - 1) * categoriesPerPage;
                const endIndex = startIndex + categoriesPerPage;
                const currentCategories = beverageCategories.slice(startIndex, endIndex);
                
                currentCategories.forEach(category => {
                    const categoryCard = document.createElement('div');
                    categoryCard.className = 'category-card';
                    categoryCard.innerHTML = `
                        <div class="category-thumbnail">
                            <img src="${category.image}" alt="${category.name}">
                        </div>
                        <div class="category-content">
                            <h3>${category.name}</h3>
                            <button class="view-items-btn" data-category-id="${category.id}">View Items</button>
                        </div>
                    `;
                    categoriesContainer.appendChild(categoryCard);
                });
                
                // Render pagination
                renderPagination();
            }
            
            // Function to render pagination buttons
            function renderPagination() {
                categoriesPagination.innerHTML = '';
                
                const totalPages = Math.ceil(beverageCategories.length / categoriesPerPage);
                
                for (let i = 1; i <= totalPages; i++) {
                    const pageBtn = document.createElement('button');
                    pageBtn.className = 'page-btn';
                    if (i === currentPage) {
                        pageBtn.classList.add('active');
                    }
                    pageBtn.textContent = i;
                    pageBtn.addEventListener('click', () => {
                        currentPage = i;
                        renderCategories();
                    });
                    categoriesPagination.appendChild(pageBtn);
                }
            }
            
            // Function to open category items popup
            function openCategoryPopup(categoryId) {
                const category = beverageCategories.find(cat => cat.id === categoryId);
                if (category) {
                    popupCategoryName.textContent = category.name;
                    categoryItemsContainer.innerHTML = '';
                    
                    category.items.forEach(item => {
                        const itemElement = document.createElement('div');
                        itemElement.className = 'category-item';
                        itemElement.innerHTML = `
                            <div class="category-item-img">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="category-item-content">
                                <h4>${item.name}</h4>
                                <p>${item.description}</p>
                                <span class="category-item-price">₦${item.price.toLocaleString()}</span>
                                <div class="category-item-buttons">
                                    <button class="btn-learn-more" data-item="${item.name}" data-price="${item.price}">Learn More</button>
                                    <button class="btn-add-order" data-item="${item.name}" data-price="${item.price}">Add to Order</button>
                                </div>
                            </div>
                        `;
                        categoryItemsContainer.appendChild(itemElement);
                    });
                    
                    // Add event listeners to buttons in the popup
                    document.querySelectorAll('.btn-learn-more').forEach(button => {
                        button.addEventListener('click', () => {
                            const itemName = button.dataset.item;
                            showNotification(`Learn more about ${itemName}`);
                        });
                    });
                    
                    document.querySelectorAll('.btn-add-order').forEach(button => {
                        button.addEventListener('click', () => {
                            openQuantityPopup(button.dataset.item, button.dataset.price);
                            categoryPopup.classList.remove('active');
                        });
                    });
                    
                    categoryPopup.classList.add('active');
                }
            }
            
            // Event delegation for category buttons
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('view-items-btn')) {
                    const categoryId = parseInt(e.target.dataset.categoryId);
                    openCategoryPopup(categoryId);
                }
            });
            
            // Close category popup
            closeCategoryPopup.addEventListener('click', () => {
                categoryPopup.classList.remove('active');
            });
            
            // Close popup when clicking outside
            categoryPopup.addEventListener('click', (e) => {
                if (e.target === categoryPopup) {
                    categoryPopup.classList.remove('active');
                }
            });
            
            // Initialize categories
            renderCategories();
            
            // Calendar function for opening hours
            function addToCalendar() {
                showNotification('Opening hours added to your calendar!');
            }
        });