// Dashboard JavaScript - Handles authentication, profile, and orders management

let currentUser = null;
let authToken = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
});

// Initialize dashboard on load
async function initializeDashboard() {
    // Check if user is logged in
    authToken = localStorage.getItem('authToken');
    currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!authToken || !currentUser) {
        // Redirect to login if not authenticated
        window.location.href = '/login';
        return;
    }

    // Display user name
    document.getElementById('userNameDisplay').textContent = currentUser.fullName;

    // Load user profile and orders
    await loadUserProfile();
    await loadUserOrders();

    // Setup event listeners
    setupEventListeners();
    setupTabNavigation();

    // Animate page entrance
    animateDashboardEntrance();
}

// Load user profile
async function loadUserProfile() {
    try {
        const response = await fetch('/api/auth/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                logout();
                return;
            }
            throw new Error('Failed to load profile');
        }

        const data = await response.json();
        currentUser = data.user;
        updateProfileForm(currentUser);
    } catch (err) {
        console.error('Profile load error:', err);
    }
}

// Update profile form with user data
function updateProfileForm(user) {
    document.getElementById('fullName').value = user.fullName || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('address').value = user.address || '';
    document.getElementById('city').value = user.city || '';
    document.getElementById('state').value = user.state || '';
    document.getElementById('zipCode').value = user.zipCode || '';
}

// Load user orders
async function loadUserOrders() {
    try {
        const response = await fetch('/api/auth/orders', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load orders');
        }

        const data = await response.json();
        const orders = data.orders || [];

        // Update stats
        updateOrderStats(orders);

        // Display recent orders on dashboard
        displayRecentOrders(orders);

        // Display all orders
        displayAllOrders(orders);
    } catch (err) {
        console.error('Orders load error:', err);
    }
}

// Update order statistics
function updateOrderStats(orders) {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const inProgress = orders.filter(o => o.status === 'in-progress').length;

    document.getElementById('totalOrders').textContent = total;
    document.getElementById('pendingOrders').textContent = pending;
    document.getElementById('completedOrders').textContent = completed;
    document.getElementById('inProgressOrders').textContent = inProgress;
}

// Display recent orders (on dashboard tab)
function displayRecentOrders(orders) {
    const container = document.getElementById('recentOrdersList');
    const recent = orders.slice(0, 5);

    if (recent.length === 0) {
        container.innerHTML = '<p class="empty-state">No orders yet. <a href="#" onclick="switchTab(\'place-order\'); return false;">Create one now!</a></p>';
        return;
    }

    container.innerHTML = recent.map(order => `
        <div class="order-item" onclick="viewOrderDetails('${order.orderId}')">
            <div class="order-summary">
                <div class="order-id">Order ${order.orderId}</div>
                <div class="order-details">
                    <span><strong>Type:</strong> ${formatWasteType(order.wasteType)}</span>
                    <span><strong>Qty:</strong> ${order.quantity} ${order.unit}</span>
                    <span><strong>Date:</strong> ${formatDate(order.scheduledDate)}</span>
                </div>
            </div>
            <span class="order-status ${order.status}">${order.status.replace('-', ' ').toUpperCase()}</span>
        </div>
    `).join('');
}

// Display all orders (on orders tab)
function displayAllOrders(orders, filter = 'all') {
    const container = document.getElementById('ordersContainer');
    let filtered = orders;

    if (filter !== 'all') {
        filtered = orders.filter(o => o.status === filter);
    }

    if (filtered.length === 0) {
        container.innerHTML = '<p class="empty-state">No orders found. <a href="#" onclick="switchTab(\'place-order\'); return false;">Create one now!</a></p>';
        return;
    }

    container.innerHTML = filtered.map(order => `
        <div class="order-item" onclick="viewOrderDetails('${order.orderId}')">
            <div class="order-summary">
                <div class="order-id">Order ${order.orderId}</div>
                <div class="order-details">
                    <span><strong>Type:</strong> ${formatWasteType(order.wasteType)}</span>
                    <span><strong>Quantity:</strong> ${order.quantity} ${order.unit}</span>
                    <span><strong>Scheduled:</strong> ${formatDate(order.scheduledDate)}</span>
                    <span><strong>Location:</strong> ${order.city}</span>
                </div>
            </div>
            <div>
                <span class="order-status ${order.status}">${order.status.replace('-', ' ').toUpperCase()}</span>
            </div>
        </div>
    `).join('');
}

// View order details in modal
function viewOrderDetails(orderId) {
    const orders = currentUser.orders || [];
    const order = orders.find(o => o.orderId === orderId);

    if (!order) return;

    const modalBody = document.getElementById('modalBody');
    const createdDate = new Date(order.createdAt);

    modalBody.innerHTML = `
        <h2>Order Details</h2>
        <div style="margin-top: 1.5rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                <div>
                    <p style="color: var(--text-dim); font-size: 0.85rem;">Order ID</p>
                    <p style="font-weight: 600; color: var(--primary-700);">${order.orderId}</p>
                </div>
                <div>
                    <p style="color: var(--text-dim); font-size: 0.85rem;">Status</p>
                    <span class="order-status ${order.status}" style="display: inline-block;">${order.status.replace('-', ' ').toUpperCase()}</span>
                </div>
                <div>
                    <p style="color: var(--text-dim); font-size: 0.85rem;">Waste Type</p>
                    <p style="font-weight: 600;">${formatWasteType(order.wasteType)}</p>
                </div>
                <div>
                    <p style="color: var(--text-dim); font-size: 0.85rem;">Quantity</p>
                    <p style="font-weight: 600;">${order.quantity} ${order.unit}</p>
                </div>
                <div>
                    <p style="color: var(--text-dim); font-size: 0.85rem;">Scheduled Date</p>
                    <p style="font-weight: 600;">${formatDate(order.scheduledDate)}</p>
                </div>
                <div>
                    <p style="color: var(--text-dim); font-size: 0.85rem;">Created Date</p>
                    <p style="font-weight: 600;">${formatDate(createdDate)}</p>
                </div>
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--card-border);">
                <h3 style="margin-bottom: 1rem;">Delivery Information</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                    <div>
                        <p style="color: var(--text-dim); font-size: 0.85rem;">Phone</p>
                        <p style="font-weight: 600;">${order.phone}</p>
                    </div>
                    <div>
                        <p style="color: var(--text-dim); font-size: 0.85rem;">City</p>
                        <p style="font-weight: 600;">${order.city}</p>
                    </div>
                    <div style="grid-column: 1 / -1;">
                        <p style="color: var(--text-dim); font-size: 0.85rem;">Address</p>
                        <p style="font-weight: 600; word-break: break-word;">${order.address}</p>
                    </div>
                </div>
            </div>
            ${order.status === 'pending' ? `
                <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                    <button onclick="cancelOrder('${order.orderId}')" class="btn btn-secondary" style="flex: 1;">
                        <i class="fas fa-trash"></i>
                        Cancel Order
                    </button>
                </div>
            ` : ''}
        </div>
    `;

    document.getElementById('orderModal').classList.add('active');
}

// Cancel order
async function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
        const response = await fetch(`/api/auth/orders/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            alert('Failed to cancel order');
            return;
        }

        showSuccessMessage('Order cancelled successfully');
        closeModal();
        await loadUserOrders();
    } catch (err) {
        console.error('Cancel order error:', err);
        alert('Failed to cancel order');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Profile form submit
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }

    // Place order form submit
    const placeOrderForm = document.getElementById('placeOrderForm');
    if (placeOrderForm) {
        placeOrderForm.addEventListener('submit', handlePlaceOrder);
    }

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Modal close
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.getElementById('orderModal').addEventListener('click', (e) => {
        if (e.target.id === 'orderModal') closeModal();
    });

    // Order filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            displayAllOrders(currentUser.orders || [], btn.dataset.filter);
        });
    });
}

// Setup tab navigation
function setupTabNavigation() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const tabName = item.dataset.tab;
            switchTab(tabName);
        });
    });
}

// Switch between tabs
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected tab
    const tab = document.getElementById(`${tabName}-tab`);
    if (tab) {
        tab.classList.add('active');
    }

    // Activate menu item
    const menuItem = document.querySelector(`[data-tab="${tabName}"]`);
    if (menuItem) {
        menuItem.classList.add('active');
    }
}

// Handle profile form submission
async function handleProfileSubmit(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const zipCode = document.getElementById('zipCode').value.trim();

    if (!fullName) {
        alert('Full name is required');
        return;
    }

    try {
        const response = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                fullName,
                phone,
                address,
                city,
                state,
                zipCode
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        const data = await response.json();
        currentUser = data.user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        document.getElementById('userNameDisplay').textContent = currentUser.fullName;

        showSuccessMessage('Profile updated successfully');
    } catch (err) {
        console.error('Profile update error:', err);
        alert('Failed to update profile');
    }
}

// Handle place order submission
async function handlePlaceOrder(e) {
    e.preventDefault();

    const wasteType = document.getElementById('wasteType').value.trim();
    const quantity = document.getElementById('quantity').value.trim();
    const phone = document.getElementById('orderPhone').value.trim();
    const address = document.getElementById('orderAddress').value.trim();
    const city = document.getElementById('orderCity').value.trim();
    const scheduledDate = document.getElementById('scheduledDate').value;

    if (!wasteType || !quantity || !phone || !address || !city || !scheduledDate) {
        alert('Please fill in all required fields');
        return;
    }

    try {
        const response = await fetch('/api/auth/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                wasteType,
                quantity: parseInt(quantity),
                phone,
                address,
                city,
                scheduledDate
            })
        });

        if (!response.ok) {
            throw new Error('Failed to place order');
        }

        const data = await response.json();
        showSuccessMessage(`Order placed successfully! Order ID: ${data.order.orderId}`);

        // Reset form
        document.getElementById('placeOrderForm').reset();

        // Reload orders
        await loadUserOrders();

        // Switch to orders tab
        setTimeout(() => switchTab('orders'), 1000);
    } catch (err) {
        console.error('Place order error:', err);
        alert('Failed to place order');
    }
}

// Helper: Format waste type
function formatWasteType(type) {
    const types = {
        'computers': 'Computers & Laptops',
        'mobile': 'Mobile Phones',
        'appliances': 'Kitchen Appliances',
        'tvs': 'TVs & Monitors',
        'batteries': 'Batteries',
        'cables': 'Cables & Wires',
        'other': 'Other'
    };
    return types[type] || type;
}

// Helper: Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show success message
function showSuccessMessage(message) {
    // Create a temporary success message
    const msg = document.createElement('div');
    msg.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(34, 197, 94, 0.2);
        border: 1px solid #34d399;
        color: #34d399;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    msg.textContent = message;
    document.body.appendChild(msg);

    setTimeout(() => {
        msg.remove();
    }, 3000);
}

// Close modal
function closeModal() {
    document.getElementById('orderModal').classList.remove('active');
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
}

// Animate dashboard entrance
function animateDashboardEntrance() {
    gsap.from('.dashboard-nav', {
        duration: 0.6,
        y: -50,
        opacity: 0,
        ease: 'power3.out'
    });

    gsap.from('.sidebar', {
        duration: 0.8,
        x: -50,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.2
    });

    gsap.from('.section-header', {
        duration: 0.8,
        y: 20,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.3
    });

    gsap.from('.stat-card', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.4
    });
    gsap.to('.stat-card', {
        duration: 0.8,
        opacity:1,
        y: 0,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.4
    }

    )
}
