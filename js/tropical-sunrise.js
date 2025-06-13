        document.addEventListener('DOMContentLoaded', function() {
            // ========== FLOATING BUTTON FUNCTIONALITY ==========
            document.querySelector('.action-btn.whatsapp').addEventListener('click', function() {
                window.open('https://wa.me/2349166385000', '_blank');
            });
            
            document.querySelector('.action-btn.chat').addEventListener('click', function() {
                alert('Live chat support coming soon!');
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
                { name: "Tuna Poke Bowl", category: "Main Course", price: 6500, page: "tuna-poke-bowl.html" },
                { name: "Mango Chicken Skewers", category: "Appetizer", price: 4800, page: "mango-chicken-skewers.html" },
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
            const addTropicalBtn = document.getElementById('addTropicalSunrise');
            const placeOrderBtn = document.getElementById('placeOrderBtn');
            const confirmOrderBtn = document.getElementById('confirmOrderBtn');
            const closeReceiptBtn = document.getElementById('closeReceiptBtn');
            const printReceiptBtn = document.getElementById('printReceiptBtn');
            const notification = document.getElementById('notification');
            const notificationMessage = document.getElementById('notificationMessage');
            
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
            
            // Add Tropical Sunrise to cart
            addTropicalBtn.addEventListener('click', () => {
                openQuantityPopup('Tropical Sunrise', '3500');
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
        });