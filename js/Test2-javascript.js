
 // Cart functionality
        let cart = [];
        const cartCountElements = document.querySelectorAll('.cart-count');
        const cartLinks = document.querySelectorAll('#cartLink, #mobileCartLink');
        const checkoutLinks = document.querySelectorAll('#checkoutLink, #mobileCheckoutLink');
        const orderButtons = document.querySelectorAll('.btn-order');
        const addTropicalBtn = document.getElementById('addTropicalSunrise');
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        const confirmOrderBtn = document.getElementById('confirmOrderBtn');
        const closeReceiptBtn = document.getElementById('closeReceiptBtn');
        
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
        
        // Update cart count display
        function updateCartCount() {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElements.forEach(element => {
                element.textContent = totalItems;
            });
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
                
                // Show confirmation
                alert(`${quantity} ${currentItem.name} added to cart!`);
            }
        });
        
        // Open checkout popup
        checkoutLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (cart.length === 0) {
                    alert('Your cart is empty!');
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
                alert('Please select a payment method');
                return;
            }
            
            paymentPopup.classList.remove('active');
            generateReceipt();
            receiptPopup.classList.add('active');
            
            // Clear cart after order
            cart = [];
            updateCartCount();
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
            receiptNumber.textContent = `MW-${datePart}-${serialPart}`;
        }
        
        // Close receipt
        closeReceiptBtn.addEventListener('click', () => {
            receiptPopup.classList.remove('active');
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
        const servicesDropdown = document.getElementById('servicesDropdown');
        const mobileDropdown = document.getElementById('mobileDropdown');
        
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
        
        servicesDropdown.addEventListener('click', (e) => {
            e.preventDefault();
            mobileDropdown.style.display = mobileDropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // Close popups when clicking outside
        document.querySelectorAll('.popup-overlay').forEach(popup => {
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    popup.classList.remove('active');
                }
            });
        });
        
        // Initialize cart count
        updateCartCount();