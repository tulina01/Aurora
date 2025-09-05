// Aurora Tenant Management System - Main JavaScript
// Global variables
let tenants = [];
let maintenanceRequests = [];
let inventory = [];

// DOM elements
let navLinks, pages, searchInput, statusFilter;

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Aurora Tenant Management System initializing...');
    
    try {
        initializeApp();
        setupEventListeners();
        
        // Check if backend is available
        console.log('🔍 Checking backend connection...');
        const backendAvailable = await api.checkConnection();
        
        if (backendAvailable) {
            console.log('✅ Backend connected successfully');
            await loadDataFromAPI();
        } else {
            console.log('⚠️ Backend not available, using localStorage');
            loadSampleData();
        }
        
        updateDashboard();
        console.log('✅ Application initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing application:', error);
        // Fallback to localStorage
        loadSampleData();
        updateDashboard();
    }
});

// Initialize app
function initializeApp() {
    console.log('🔍 Initializing app...');
    
    navLinks = document.querySelectorAll('.nav-link');
    pages = document.querySelectorAll('.page');
    searchInput = document.getElementById('tenant-search');
    statusFilter = document.getElementById('status-filter');
    
    console.log(`📊 Found ${navLinks.length} nav links, ${pages.length} pages`);
    
    // Set dashboard as active by default
    document.getElementById('dashboard').classList.add('active');
    document.querySelector('[data-page="dashboard"]').classList.add('active');
    
    console.log('✅ App initialized');
}

// Setup event listeners
function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Search and filter
    if (searchInput) {
        searchInput.addEventListener('input', handleTenantSearch);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', handleStatusFilter);
    }
    
    // Form submissions
    const addTenantForm = document.getElementById('add-tenant-form');
    if (addTenantForm) {
        console.log('✅ Add tenant form found, adding submit listener');
        
        // Remove any existing listeners first
        const newForm = addTenantForm.cloneNode(true);
        addTenantForm.parentNode.replaceChild(newForm, addTenantForm);
        
        // Get the new form reference
        const freshForm = document.getElementById('add-tenant-form');
        
        // Add submit listener
        freshForm.addEventListener('submit', function(e) {
            console.log('🚀 Form submit event fired!');
            e.preventDefault();
            handleAddTenant(e);
        });
        
        // Test form submission
        console.log('🧪 Testing form submission...');
        const submitBtn = freshForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            console.log('✅ Submit button found:', submitBtn.textContent);
            
            // Also add click listener as backup
            submitBtn.addEventListener('click', function(e) {
                console.log('🖱️ Submit button clicked!');
                // Prevent default to avoid double submission
                e.preventDefault();
                
                // Manually trigger form submission
                console.log('🔄 Manually triggering form submission...');
                const formData = new FormData(freshForm);
                console.log('📋 Form data collected:', Object.fromEntries(formData));
                
                // Call the handler directly
                handleAddTenant(e);
            });
            
                    // Test form validation
        console.log('🧪 Testing form validation...');
        const requiredFields = freshForm.querySelectorAll('[required]');
        console.log(`📋 Found ${requiredFields.length} required fields:`, Array.from(requiredFields).map(f => f.id));
        
        // Test form validity
        console.log('🧪 Testing form validity...');
        console.log('Form valid:', freshForm.checkValidity());
        console.log('Form validation message:', freshForm.validationMessage);
        
        // Check each required field
        requiredFields.forEach(field => {
            console.log(`Field ${field.id}:`, {
                valid: field.validity.valid,
                value: field.value,
                required: field.required,
                validationMessage: field.validationMessage
            });
        });
        } else {
            console.error('❌ Submit button not found!');
        }
    } else {
        console.error('❌ Add tenant form not found!');
        console.log('🔍 Available forms:', document.querySelectorAll('form').length);
        document.querySelectorAll('form').forEach((form, index) => {
            console.log(`Form ${index}:`, form.id, form.className);
        });
    }
    
    const maintenanceForm = document.getElementById('maintenance-form');
    if (maintenanceForm) {
        console.log('✅ Maintenance form found, adding submit listener');
        
        // Remove any existing listeners first
        const newMaintenanceForm = maintenanceForm.cloneNode(true);
        maintenanceForm.parentNode.replaceChild(newMaintenanceForm, maintenanceForm);
        
        // Get the new form reference
        const freshMaintenanceForm = document.getElementById('maintenance-form');
        
        // Add submit listener
        freshMaintenanceForm.addEventListener('submit', function(e) {
            console.log('🚀 Maintenance form submit event fired!');
            e.preventDefault();
            handleAddMaintenance(e);
        });
        
        // Test form submission
        console.log('🧪 Testing maintenance form submission...');
        const submitBtn = freshMaintenanceForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            console.log('✅ Maintenance submit button found:', submitBtn.textContent);
            
            // Also add click listener as backup
            submitBtn.addEventListener('click', function(e) {
                console.log('🖱️ Maintenance submit button clicked!');
                e.preventDefault();
                
                // Manually trigger form submission
                console.log('🔄 Manually triggering maintenance form submission...');
                const formData = new FormData(freshMaintenanceForm);
                console.log('📋 Maintenance form data collected:', Object.fromEntries(formData));
                
                // Call the handler directly
                handleAddMaintenance(e);
            });
        } else {
            console.error('❌ Maintenance submit button not found!');
        }
    } else {
        console.error('❌ Maintenance form not found!');
    }
    
    const inventoryForm = document.getElementById('inventory-form');
    if (inventoryForm) {
        console.log('✅ Inventory form found, adding submit listener');
        
        // Remove any existing listeners first
        const newInventoryForm = inventoryForm.cloneNode(true);
        inventoryForm.parentNode.replaceChild(newInventoryForm, inventoryForm);
        
        // Get the new form reference
        const freshInventoryForm = document.getElementById('inventory-form');
        
        // Add submit listener
        freshInventoryForm.addEventListener('submit', function(e) {
            console.log('🚀 Inventory form submit event fired!');
            e.preventDefault();
            handleAddInventory(e);
        });
        
        // Test form submission
        console.log('🧪 Testing inventory form submission...');
        const submitBtn = freshInventoryForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            console.log('✅ Inventory submit button found:', submitBtn.textContent);
            
            // Also add click listener as backup
            submitBtn.addEventListener('click', function(e) {
                console.log('🖱️ Inventory submit button clicked!');
                e.preventDefault();
                
                // Manually trigger form submission
                console.log('🔄 Manually triggering inventory form submission...');
                const formData = new FormData(freshInventoryForm);
                console.log('📋 Inventory form data collected:', Object.fromEntries(formData));
                
                // Call the handler directly
                handleAddInventory(e);
            });
        } else {
            console.error('❌ Inventory submit button not found!');
        }
    } else {
        console.error('❌ Inventory form not found!');
    }
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Cancel buttons
    document.querySelectorAll('[data-modal]').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            closeModal(modalId);
        });
    });
    
    // Add buttons
    const addTenantBtn = document.getElementById('add-tenant-btn');
    if (addTenantBtn) {
        addTenantBtn.addEventListener('click', () => {
            // Reset modal to add mode
            const modal = document.getElementById('add-tenant-modal');
            const modalTitle = modal.querySelector('.modal-header h2');
            const submitButton = modal.querySelector('button[type="submit"]');
            
            modalTitle.textContent = 'Add New Tenant';
            submitButton.textContent = 'Add Tenant';
            
            showModal('add-tenant-modal');
        });
    }
    
    const addMaintenanceBtn = document.getElementById('add-maintenance-btn');
    if (addMaintenanceBtn) {
        addMaintenanceBtn.addEventListener('click', () => showModal('maintenance-modal'));
    }
    
    const addInventoryBtn = document.getElementById('add-inventory-btn');
    if (addInventoryBtn) {
        addInventoryBtn.addEventListener('click', () => showModal('inventory-modal'));
    }
    
    // Dashboard action buttons
    const dashboardAddTenantBtn = document.getElementById('dashboard-add-tenant-btn');
    if (dashboardAddTenantBtn) {
        dashboardAddTenantBtn.addEventListener('click', () => {
            // Reset modal to add mode
            const modal = document.getElementById('add-tenant-modal');
            const modalTitle = modal.querySelector('.modal-header h2');
            const submitButton = modal.querySelector('button[type="submit"]');
            
            modalTitle.textContent = 'Add New Tenant';
            submitButton.textContent = 'Add Tenant';
            
            showModal('add-tenant-modal');
        });
    }
    
    const dashboardMaintenanceBtn = document.getElementById('dashboard-maintenance-btn');
    if (dashboardMaintenanceBtn) {
        dashboardMaintenanceBtn.addEventListener('click', () => showModal('maintenance-modal'));
    }
    
    const dashboardInventoryBtn = document.getElementById('dashboard-inventory-btn');
    if (dashboardInventoryBtn) {
        dashboardInventoryBtn.addEventListener('click', () => showModal('inventory-modal'));
    }
    
    // Inventory tab functionality
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active tab button
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab content
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById(targetTab + '-tab').classList.add('active');
        });
    });
    
    // Modal closing is now only handled by close buttons and cancel buttons
    // No click-outside-to-close functionality to prevent drag issues
    
    // Form input focus effects
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.borderColor = '#4AA0BA';
            this.style.boxShadow = '0 0 0 3px rgba(74, 160, 186, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
            this.style.borderColor = 'rgba(0, 0, 0, 0.1)';
            this.style.boxShadow = 'none';
        });
        
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.style.borderColor = '#98C454';
            } else {
                this.style.borderColor = 'rgba(0, 0, 0, 0.1)';
            }
        });
    });
    
    // Setup dynamic event delegation for dynamically created elements
    setupDynamicEventListeners();
    
    console.log('✅ Event listeners setup complete');
}

// Setup dynamic event listeners for dynamically created elements
function setupDynamicEventListeners() {
    // Use event delegation for dynamically created buttons
    document.addEventListener('click', function(e) {
        // Info tenant button
        if (e.target.closest('.info-tenant-btn')) {
            const tenantId = e.target.closest('.info-tenant-btn').getAttribute('data-tenant-id');
            showTenantDetails(tenantId);
        }
        
        // Edit tenant button
        if (e.target.closest('.edit-tenant-btn')) {
            const tenantId = e.target.closest('.edit-tenant-btn').getAttribute('data-tenant-id');
            editTenant(tenantId);
        }
        
        // Delete tenant button
        if (e.target.closest('.delete-tenant-btn')) {
            const tenantId = e.target.closest('.delete-tenant-btn').getAttribute('data-tenant-id');
            deleteTenant(tenantId);
        }
        
        // Complete maintenance button
        if (e.target.closest('.complete-maintenance-btn')) {
            const requestId = e.target.closest('.complete-maintenance-btn').getAttribute('data-request-id');
            completeMaintenance(requestId);
        }
        
        // Edit from details modal button
        if (e.target.closest('#edit-from-details-btn')) {
            const tenantId = document.getElementById('edit-from-details-btn').getAttribute('data-tenant-id');
            closeModal('tenant-details-modal');
            editTenant(tenantId);
        }
        
        // Edit maintenance button
        if (e.target.closest('.edit-maintenance-btn')) {
            const requestId = e.target.closest('.edit-maintenance-btn').getAttribute('data-request-id');
            editMaintenance(requestId);
        }
        
        // Delete maintenance button
        if (e.target.closest('.delete-maintenance-btn')) {
            const requestId = e.target.closest('.delete-maintenance-btn').getAttribute('data-request-id');
            deleteMaintenance(requestId);
        }
        
        // Edit inventory button
        if (e.target.closest('.edit-inventory-btn')) {
            const itemId = e.target.closest('.edit-inventory-btn').getAttribute('data-item-id');
            editInventory(itemId);
        }
        
        // Delete inventory button
        if (e.target.closest('.delete-inventory-btn')) {
            const itemId = e.target.closest('.delete-inventory-btn').getAttribute('data-item-id');
            deleteInventory(itemId);
        }
    });
}

// Data persistence
function saveDataToStorage() {
    localStorage.setItem('aurora-tenants', JSON.stringify(tenants));
    localStorage.setItem('aurora-maintenance', JSON.stringify(maintenanceRequests));
    localStorage.setItem('aurora-inventory', JSON.stringify(inventory));
}

function loadDataFromStorage() {
    const savedTenants = localStorage.getItem('aurora-tenants');
    const savedMaintenance = localStorage.getItem('aurora-maintenance');
    const savedInventory = localStorage.getItem('aurora-inventory');
    
    if (savedTenants) tenants = JSON.parse(savedTenants);
    if (savedMaintenance) maintenanceRequests = JSON.parse(savedMaintenance);
    if (savedInventory) inventory = JSON.parse(savedInventory);
}

// Load data from API
async function loadDataFromAPI() {
    try {
        console.log('📥 Loading data from API...');
        
        // Load tenants
        console.log('👥 Loading tenants...');
        // First update all tenant statuses based on current dates
        await api.updateTenantStatuses();
        
        const tenantsResponse = await api.getTenants();
        if (tenantsResponse.success) {
            tenants = tenantsResponse.data.map(tenant => api.transformTenantData(tenant));
            console.log(`✅ Loaded ${tenants.length} tenants`);
        }
        
        // Load maintenance
        console.log('🔧 Loading maintenance requests...');
        const maintenanceResponse = await api.getMaintenance();
        if (maintenanceResponse.success) {
            maintenanceRequests = maintenanceResponse.data.map(maintenance => api.transformMaintenanceData(maintenance));
            console.log(`✅ Loaded ${maintenanceRequests.length} maintenance requests`);
        }
        
        // Load inventory
        console.log('📦 Loading inventory...');
        const inventoryResponse = await api.getInventory();
        if (inventoryResponse.success) {
            inventory = inventoryResponse.data.map(item => api.transformInventoryData(item));
            console.log(`✅ Loaded ${inventory.length} inventory items`);
        }
        
        console.log('✅ Data loaded from API successfully');
    } catch (error) {
        console.error('❌ Error loading data from API:', error);
        // Fallback to localStorage
        console.log('🔄 Falling back to localStorage...');
        loadDataFromStorage();
    }
}

// Load tenants from API
async function loadTenantsFromAPI() {
    try {
        // First update all tenant statuses based on current dates
        await api.updateTenantStatuses();
        
        // Then load the updated tenants
        const response = await api.getTenants();
        if (response.success) {
            tenants = response.data.map(tenant => api.transformTenantData(tenant));
        }
    } catch (error) {
        console.error('❌ Error loading tenants from API:', error);
    }
}

// Load maintenance from API
async function loadMaintenanceFromAPI() {
    try {
        const response = await api.getMaintenance();
        if (response.success) {
            maintenanceRequests = response.data.map(maintenance => api.transformMaintenanceData(maintenance));
        }
    } catch (error) {
        console.error('❌ Error loading maintenance from API:', error);
    }
}

// Load inventory from API
async function loadInventoryFromAPI() {
    try {
        const response = await api.getInventory();
        if (response.success) {
            inventory = response.data.map(item => api.transformInventoryData(item));
        }
    } catch (error) {
        console.error('❌ Error loading inventory from API:', error);
    }
}

// Sample data for demonstration
function loadSampleData() {
    if (tenants.length === 0) {
        tenants = [
            {
                id: '1',
                name: 'John Doe',
                phone: '+1-555-0123',
                email: 'john@example.com',
                apartmentNumber: 'A101',
                checkinDate: '2024-01-15',
                checkoutDate: null,
                rentalBasis: 'monthly',
                rentAmount: 1200,
                deposit: 1200,
                bookingSource: 'online',
                specialRequests: 'Early check-in preferred',
                remarks: 'Quiet tenant, pays on time',
                status: 'active',
                createdAt: '2024-01-15T10:00:00Z'
            },
            {
                id: '2',
                name: 'Jane Smith',
                phone: '+1-555-0456',
                email: 'jane@example.com',
                apartmentNumber: 'B205',
                checkinDate: '2024-02-01',
                checkoutDate: null,
                rentalBasis: 'monthly',
                rentAmount: 1100,
                deposit: 1100,
                bookingSource: 'in-person',
                specialRequests: 'Pet-friendly unit',
                remarks: 'Has a small dog, very clean',
                status: 'active',
                createdAt: '2024-02-01T14:00:00Z'
            }
        ];
    }
    
    if (maintenanceRequests.length === 0) {
        maintenanceRequests = [
            {
                id: '1',
                apartmentNumber: 'A101',
                type: 'plumbing',
                description: 'Kitchen sink is clogged',
                priority: 'medium',
                reportedDate: '2024-01-20',
                status: 'completed',
                createdAt: '2024-01-20T09:00:00Z'
            }
        ];
    }
    
    if (inventory.length === 0) {
        inventory = [
            {
                id: '1',
                apartmentNumber: 'A101',
                category: 'furniture',
                type: 'Sofa',
                count: 1,
                notes: '3-seater, beige color',
                createdAt: '2024-01-15T10:00:00Z'
            }
        ];
    }
    
    saveDataToStorage();
}

// Navigation handler
async function handleNavigation(e) {
    e.preventDefault();
    
    const targetPage = this.getAttribute('data-page');
    
    // Update active navigation link
    navLinks.forEach(link => link.classList.remove('active'));
    this.classList.add('active');
    
    // Show target page
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(targetPage).classList.add('active');
    
    // Update page content based on current page
    await updatePageContent(targetPage);
}

// Update page content
async function updatePageContent(page) {
    switch(page) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'tenants':
            await loadTenantsFromAPI();
            renderTenantsTable();
            break;
        case 'maintenance':
            await loadMaintenanceFromAPI();
            renderMaintenanceLists();
            break;
        case 'inventory':
            await loadInventoryFromAPI();
            renderInventoryGrids();
            break;
    }
}

// Update dashboard
async function updateDashboard() {
    try {
        // Get dashboard stats from API
        const statsResponse = await api.getTenantStats();
        if (statsResponse.success) {
            const stats = statsResponse.data;
            
            // Update stats
            document.getElementById('total-tenants').textContent = stats.totalTenants || 0;
            document.getElementById('occupied-units').textContent = stats.activeTenants || 0;
            document.getElementById('pending-maintenance').textContent = maintenanceRequests.filter(m => m.status === 'pending').length;
            document.getElementById('monthly-revenue').textContent = `$${(stats.totalRevenue || 0).toFixed(2)}`;
            
            // Update recent tenants
            const recentTenants = stats.recentTenants || [];
            
            const recentTenantsContainer = document.getElementById('recent-tenants');
            
            if (recentTenants.length === 0) {
                recentTenantsContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <h3>No tenants yet</h3>
                        <p>Add your first tenant to get started</p>
                    </div>
                `;
            } else {
                recentTenantsContainer.innerHTML = recentTenants.map(tenant => `
                    <div class="recent-item">
                        <div class="recent-item-avatar">${tenant.name.charAt(0).toUpperCase()}</div>
                        <div class="recent-item-info">
                            <h4>${tenant.name}</h4>
                            <p>Apartment ${tenant.apartmentNumber} • ${formatDate(tenant.checkinDate)}</p>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error updating dashboard:', error);
        // Fallback to local data
        document.getElementById('total-tenants').textContent = tenants.length;
        document.getElementById('occupied-units').textContent = tenants.filter(t => t.status === 'active').length;
        document.getElementById('pending-maintenance').textContent = maintenanceRequests.filter(m => m.status === 'pending').length;
        
        const monthlyRevenue = tenants
            .filter(t => t.status === 'active')
            .reduce((sum, t) => sum + t.rentAmount, 0);
        document.getElementById('monthly-revenue').textContent = `$${monthlyRevenue.toFixed(2)}`;
    }
}

// Form handlers
async function handleAddTenant(e) {
    console.log('🚀 handleAddTenant function called!');
    e.preventDefault();
    
    try {
        console.log('📝 Processing tenant form submission...');
        
        // Debug: Check if form fields exist
        const formFields = {
            name: document.getElementById('tenant-name'),
            phone: document.getElementById('tenant-phone'),
            email: document.getElementById('tenant-email'),
            apartmentNumber: document.getElementById('apartment-number'),
            checkinDate: document.getElementById('checkin-date'),
            checkoutDate: document.getElementById('checkout-date'),
            rentalBasis: document.getElementById('rental-basis'),
            rentAmount: document.getElementById('rent-amount'),
            deposit: document.getElementById('deposit'),
            bookingSource: document.getElementById('booking-source'),
            specialRequests: document.getElementById('special-requests'),
            remarks: document.getElementById('remarks')
        };
        
        console.log('🔍 Form field elements found:', Object.keys(formFields).map(key => ({
            field: key,
            exists: !!formFields[key],
            value: formFields[key] ? formFields[key].value : 'NOT FOUND'
        })));
        
        const tenantData = {
            name: formFields.name?.value || '',
            phone: formFields.phone?.value || '',
            email: formFields.email?.value || '',
            apartmentNumber: formFields.apartmentNumber?.value || '',
            checkinDate: formFields.checkinDate?.value || '',
            checkoutDate: formFields.checkoutDate?.value || null,
            rentalBasis: formFields.rentalBasis?.value || '',
            rentAmount: parseFloat(formFields.rentAmount?.value || '0'),
            deposit: parseFloat(formFields.deposit?.value || '0'),
            bookingSource: formFields.bookingSource?.value || '',
            specialRequests: formFields.specialRequests?.value || '',
            remarks: formFields.remarks?.value || '',
            status: 'active'
        };
        
        console.log('📋 Tenant data:', tenantData);
        
        // Check if this is an edit operation
        const editId = document.getElementById('add-tenant-form').getAttribute('data-edit-id');
        let response;
        
        if (editId) {
            // Update existing tenant
            console.log(`🔄 Updating tenant with ID: ${editId}`);
            response = await api.updateTenant(editId, tenantData);
            if (response.success) {
                showMessage('Tenant updated successfully!', 'success');
            }
        } else {
            // Create new tenant
            console.log('🆕 Creating new tenant...');
            console.log('📡 Making API call to create tenant...');
            
            try {
                response = await api.createTenant(tenantData);
                console.log('📡 API response received:', response);
                if (response.success) {
                    showMessage('Tenant added successfully!', 'success');
                }
            } catch (apiError) {
                console.error('❌ API call failed:', apiError);
                throw apiError;
            }
        }
        
        if (response.success) {
            console.log('✅ Tenant saved successfully');
            closeModal('add-tenant-modal');
            // Clear the edit ID
            document.getElementById('add-tenant-form').removeAttribute('data-edit-id');
            await loadTenantsFromAPI();
            updateDashboard();
            
            if (document.getElementById('tenants').classList.contains('active')) {
                renderTenantsTable();
            }
        } else {
            console.error('❌ Failed to save tenant:', response.message);
            showMessage('Failed to save tenant: ' + response.message, 'error');
        }
    } catch (error) {
        console.error('❌ Error saving tenant:', error);
        showMessage('Error saving tenant: ' + error.message, 'error');
    }
}

async function handleAddMaintenance(e) {
    e.preventDefault();
    
    try {
        console.log('🔧 Processing maintenance form submission...');
        
        // Debug: Check if form fields exist
        const formFields = {
            apartmentNumber: document.getElementById('maintenance-apartment'),
            type: document.getElementById('maintenance-type'),
            description: document.getElementById('maintenance-description'),
            priority: document.getElementById('maintenance-priority'),
            reportedDate: document.getElementById('maintenance-date')
        };
        
        console.log('🔍 Maintenance form field elements found:', Object.keys(formFields).map(key => ({
            field: key,
            exists: !!formFields[key],
            value: formFields[key] ? formFields[key].value : 'NOT FOUND'
        })));
        
        const maintenanceData = {
            apartmentNumber: formFields.apartmentNumber?.value || '',
            type: formFields.type?.value || '',
            description: formFields.description?.value || '',
            priority: formFields.priority?.value || 'medium',
            reportedDate: formFields.reportedDate?.value || new Date().toISOString().split('T')[0],
            status: 'pending'
        };
        
        console.log('📋 Maintenance data:', maintenanceData);
        
        // Check if this is an edit operation
        const editId = document.getElementById('maintenance-form').getAttribute('data-edit-id');
        let response;
        
        if (editId) {
            // Update existing maintenance request
            console.log(`🔄 Updating maintenance request with ID: ${editId}`);
            response = await api.updateMaintenance(editId, maintenanceData);
            if (response.success) {
                showMessage('Maintenance request updated successfully!', 'success');
            }
        } else {
            // Create new maintenance request
            console.log('🆕 Creating new maintenance request...');
            console.log('📡 Making API call to create maintenance request...');
            
            try {
                response = await api.createMaintenance(maintenanceData);
                console.log('📡 Maintenance API response received:', response);
                if (response.success) {
                    showMessage('Maintenance request submitted successfully!', 'success');
                }
            } catch (apiError) {
                console.error('❌ Maintenance API call failed:', apiError);
                throw apiError;
            }
        }
        
        if (response.success) {
            closeModal('maintenance-modal');
            // Clear the edit ID
            document.getElementById('maintenance-form').removeAttribute('data-edit-id');
            await loadMaintenanceFromAPI();
            updateDashboard();
            
            if (document.getElementById('maintenance').classList.contains('active')) {
                renderMaintenanceLists();
            }
        } else {
            showMessage('Failed to save maintenance request: ' + response.message, 'error');
        }
    } catch (error) {
        console.error('❌ Error adding maintenance request:', error);
        showMessage('Error adding maintenance request: ' + error.message, 'error');
    }
}

async function handleAddInventory(e) {
    e.preventDefault();
    
    try {
        console.log('📦 Processing inventory form submission...');
        
        // Debug: Check if form fields exist
        const formFields = {
            apartmentNumber: document.getElementById('inventory-apartment'),
            category: document.getElementById('inventory-category'),
            type: document.getElementById('item-type'),
            count: document.getElementById('item-count'),
            notes: document.getElementById('item-notes')
        };
        
        console.log('🔍 Inventory form field elements found:', Object.keys(formFields).map(key => ({
            field: key,
            exists: !!formFields[key],
            value: formFields[key] ? formFields[key].value : 'NOT FOUND'
        })));
        
        const inventoryData = {
            apartmentNumber: formFields.apartmentNumber?.value || '',
            category: formFields.category?.value || '',
            type: formFields.type?.value || '',
            count: parseInt(formFields.count?.value || '1'),
            notes: formFields.notes?.value || ''
        };
        
        console.log('📋 Inventory data:', inventoryData);
        
        // Check if this is an edit operation
        const editId = document.getElementById('inventory-form').getAttribute('data-edit-id');
        let response;
        
        if (editId) {
            // Update existing inventory item
            console.log(`🔄 Updating inventory item with ID: ${editId}`);
            response = await api.updateInventory(editId, inventoryData);
            if (response.success) {
                showMessage('Inventory item updated successfully!', 'success');
            }
        } else {
            // Create new inventory item
            console.log('🆕 Creating new inventory item...');
            console.log('📡 Making API call to create inventory item...');
            
            try {
                response = await api.createInventory(inventoryData);
                console.log('📡 Inventory API response received:', response);
                if (response.success) {
                    showMessage('Inventory item added successfully!', 'success');
                }
            } catch (apiError) {
                console.error('❌ Inventory API call failed:', apiError);
                throw apiError;
            }
        }
        
        if (response.success) {
            closeModal('inventory-modal');
            // Clear the edit ID
            document.getElementById('inventory-form').removeAttribute('data-edit-id');
            await loadInventoryFromAPI();
            
            if (document.getElementById('inventory').classList.contains('active')) {
                renderInventoryGrids();
            }
        } else {
            showMessage('Failed to save inventory item: ' + response.message, 'error');
        }
    } catch (error) {
        console.error('❌ Error adding inventory item:', error);
        showMessage('Error adding inventory item: ' + error.message, 'error');
    }
}

// Search and filter handlers
async function handleTenantSearch(e) {
    const searchTerm = e.target.value;
    
    if (searchTerm.length > 0) {
        try {
            const response = await api.searchTenants(searchTerm);
            if (response.success) {
                tenants = response.data.map(tenant => api.transformTenantData(tenant));
                renderTenantsTable(tenants);
            }
        } catch (error) {
            console.error('Error searching tenants:', error);
        }
    } else {
        // Load all tenants when search is cleared
        await loadTenantsFromAPI();
        renderTenantsTable();
    }
}

async function handleStatusFilter(e) {
    const status = e.target.value;
    
    try {
        const params = status ? { status } : {};
        const response = await api.getTenants(params);
        if (response.success) {
            tenants = response.data.map(tenant => api.transformTenantData(tenant));
            renderTenantsTable(tenants);
        }
    } catch (error) {
        console.error('Error filtering tenants:', error);
    }
}

// Render functions
function renderTenantsTable(tenantsToRender = tenants) {
    const tbody = document.getElementById('tenants-table-body');
    
    if (tenantsToRender.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No tenants found</h3>
                    <p>Add your first tenant to get started</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = tenantsToRender.map(tenant => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="recent-item-avatar">${tenant.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <strong>${tenant.name}</strong>
                        <br>
                        <small>${tenant.email || 'No email'}</small>
                    </div>
                </div>
            </td>
            <td><strong>${tenant.apartmentNumber}</strong></td>
            <td>${tenant.phone}</td>
            <td>${formatDate(tenant.checkinDate)}</td>
            <td>$${tenant.rentAmount.toFixed(2)}</td>
            <td>
                <span class="status-badge status-${tenant.status}">
                    ${tenant.status}
                </span>
            </td>
            <td>
                <button class="btn-secondary info-tenant-btn" data-tenant-id="${tenant.id}" title="View Details">
                    <i class="fas fa-info-circle"></i>
                </button>
                <button class="btn-secondary edit-tenant-btn" data-tenant-id="${tenant.id}" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-secondary delete-tenant-btn" data-tenant-id="${tenant.id}" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderMaintenanceLists() {
    const pendingContainer = document.getElementById('pending-maintenance-list');
    const completedContainer = document.getElementById('completed-maintenance-list');
    
    const pending = maintenanceRequests.filter(m => m.status === 'pending');
    const completed = maintenanceRequests.filter(m => m.status === 'completed');
    
    // Render pending requests
    if (pending.length === 0) {
        pendingContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tools"></i>
                <h3>No pending requests</h3>
                <p>All maintenance is up to date!</p>
            </div>
        `;
    } else {
        pendingContainer.innerHTML = pending.map(request => `
            <div class="maintenance-item">
                <div class="maintenance-header">
                    <h4>${request.type.charAt(0).toUpperCase() + request.type.slice(1)} - Apt ${request.apartmentNumber}</h4>
                    <span class="priority-badge priority-${request.priority}">${request.priority}</span>
                </div>
                <p>${request.description}</p>
                <div class="maintenance-footer">
                    <small>Reported: ${formatDate(request.reportedDate)}</small>
                    <div class="maintenance-actions">
                        <button class="btn-secondary edit-maintenance-btn" data-request-id="${request.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-secondary delete-maintenance-btn" data-request-id="${request.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn-secondary complete-maintenance-btn" data-request-id="${request.id}">
                            Mark Complete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Render completed requests
    if (completed.length === 0) {
        completedContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <h3>No completed requests</h3>
                <p>Complete some maintenance to see them here</p>
            </div>
        `;
    } else {
        completedContainer.innerHTML = completed.map(request => `
            <div class="maintenance-item completed">
                <div class="maintenance-header">
                    <h4>${request.type.charAt(0).toUpperCase() + request.type.slice(1)} - Apt ${request.apartmentNumber}</h4>
                    <span class="status-badge status-completed">Completed</span>
                </div>
                <p>${request.description}</p>
                <div class="maintenance-footer">
                    <small>Completed: ${formatDate(request.completedAt)}</small>
                    <div class="maintenance-actions">
                        <button class="btn-secondary edit-maintenance-btn" data-request-id="${request.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-secondary delete-maintenance-btn" data-request-id="${request.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function renderInventoryGrids() {
    const furnitureContainer = document.getElementById('furniture-grid');
    const appliancesContainer = document.getElementById('appliances-grid');
    const utensilsContainer = document.getElementById('utensils-grid');
    
    const furniture = inventory.filter(item => item.category === 'furniture');
    const appliances = inventory.filter(item => item.category === 'appliances');
    const utensils = inventory.filter(item => item.category === 'utensils');
    
    // Render furniture
    if (furniture.length === 0) {
        furnitureContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-couch"></i>
                <h3>No furniture items</h3>
                <p>Add furniture to get started</p>
            </div>
        `;
    } else {
        furnitureContainer.innerHTML = furniture.map(item => `
            <div class="inventory-item">
                <div class="inventory-header">
                    <h4>${item.type}</h4>
                    <div class="inventory-actions">
                        <button class="btn-secondary edit-inventory-btn" data-item-id="${item.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-secondary delete-inventory-btn" data-item-id="${item.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p>Apartment: ${item.apartmentNumber}</p>
                <p>Count: ${item.count}</p>
                <p>${item.notes}</p>
            </div>
        `).join('');
    }
    
    // Render appliances
    if (appliances.length === 0) {
        appliancesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-plug"></i>
                <h3>No appliances</h3>
                <p>Add appliances to get started</p>
            </div>
        `;
    } else {
        appliancesContainer.innerHTML = appliances.map(item => `
            <div class="inventory-item">
                <div class="inventory-header">
                    <h4>${item.type}</h4>
                    <div class="inventory-actions">
                        <button class="btn-secondary edit-inventory-btn" data-item-id="${item.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-secondary delete-inventory-btn" data-item-id="${item.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p>Apartment: ${item.apartmentNumber}</p>
                <p>Count: ${item.count}</p>
                <p>${item.notes}</p>
            </div>
        `).join('');
    }
    
    // Render utensils
    if (utensils.length === 0) {
        utensilsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-utensils"></i>
                <h3>No utensils</h3>
                <p>Add utensils to get started</p>
            </div>
        `;
    } else {
        utensilsContainer.innerHTML = utensils.map(item => `
            <div class="inventory-item">
                <div class="inventory-header">
                    <h4>${item.type}</h4>
                    <div class="inventory-actions">
                        <button class="btn-secondary edit-inventory-btn" data-item-id="${item.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-secondary delete-inventory-btn" data-item-id="${item.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p>Apartment: ${item.apartmentNumber}</p>
                <p>Count: ${item.count}</p>
                <p>${item.notes}</p>
            </div>
        `).join('');
    }
}

// Action functions
async function editTenant(tenantId) {
    try {
        const response = await api.getTenant(tenantId);
        if (response.success) {
            const tenant = response.data;
            
            // Populate form with tenant data
            document.getElementById('tenant-name').value = tenant.name;
            document.getElementById('tenant-phone').value = tenant.phone;
            document.getElementById('tenant-email').value = tenant.email || '';
            document.getElementById('apartment-number').value = tenant.apartmentNumber;
            document.getElementById('checkin-date').value = tenant.checkinDate.split('T')[0];
            document.getElementById('checkout-date').value = tenant.checkoutDate ? tenant.checkoutDate.split('T')[0] : '';
            document.getElementById('rental-basis').value = tenant.rentalBasis;
            document.getElementById('rent-amount').value = tenant.rentAmount;
            document.getElementById('deposit').value = tenant.deposit || '';
            document.getElementById('booking-source').value = tenant.bookingSource || '';
            document.getElementById('special-requests').value = tenant.specialRequests || '';
            document.getElementById('remarks').value = tenant.remarks || '';
            
            // Store the tenant ID for update
            document.getElementById('add-tenant-form').setAttribute('data-edit-id', tenantId);
            
            // Update modal title and button text for edit mode
            const modal = document.getElementById('add-tenant-modal');
            const modalTitle = modal.querySelector('.modal-header h2');
            const submitButton = modal.querySelector('button[type="submit"]');
            
            modalTitle.textContent = 'Edit Tenant';
            submitButton.textContent = 'Update Tenant';
            
            showModal('add-tenant-modal');
        } else {
            showMessage('Failed to load tenant data: ' + response.message, 'error');
        }
    } catch (error) {
        console.error('Error loading tenant data:', error);
        showMessage('Error loading tenant data: ' + error.message, 'error');
    }
}

async function deleteTenant(tenantId) {
    if (confirm('Are you sure you want to delete this tenant?')) {
        try {
            const response = await api.deleteTenant(tenantId);
            
            if (response.success) {
                await loadTenantsFromAPI();
                updateDashboard();
                renderTenantsTable();
                showMessage('Tenant deleted successfully', 'success');
            } else {
                showMessage('Failed to delete tenant: ' + response.message, 'error');
            }
        } catch (error) {
            console.error('Error deleting tenant:', error);
            showMessage('Error deleting tenant: ' + error.message, 'error');
        }
    }
}

async function showTenantDetails(tenantId) {
    try {
        const response = await api.getTenant(tenantId);
        if (response.success) {
            const tenant = response.data;
            
            // Populate the details modal with tenant data
            document.getElementById('detail-name').textContent = tenant.name || 'Not provided';
            document.getElementById('detail-phone').textContent = tenant.phone || 'Not provided';
            document.getElementById('detail-email').textContent = tenant.email || 'Not provided';
            document.getElementById('detail-apartment').textContent = tenant.apartmentNumber || 'Not provided';
            document.getElementById('detail-checkin').textContent = tenant.checkinDate ? formatDate(tenant.checkinDate) : 'Not provided';
            document.getElementById('detail-checkout').textContent = tenant.checkoutDate ? formatDate(tenant.checkoutDate) : 'Not provided';
            document.getElementById('detail-rental-basis').textContent = tenant.rentalBasis ? tenant.rentalBasis.charAt(0).toUpperCase() + tenant.rentalBasis.slice(1) : 'Not provided';
            document.getElementById('detail-rent-amount').textContent = tenant.rentAmount ? `$${tenant.rentAmount.toFixed(2)}` : 'Not provided';
            document.getElementById('detail-deposit').textContent = tenant.deposit ? `$${tenant.deposit.toFixed(2)}` : 'Not provided';
            document.getElementById('detail-booking-source').textContent = tenant.bookingSource ? tenant.bookingSource.charAt(0).toUpperCase() + tenant.bookingSource.slice(1) : 'Not provided';
            document.getElementById('detail-status').innerHTML = `<span class="status-badge status-${tenant.status}">${tenant.status}</span>`;
            document.getElementById('detail-special-requests').textContent = tenant.specialRequests || 'Not provided';
            document.getElementById('detail-remarks').textContent = tenant.remarks || 'Not provided';
            
            // Store the tenant ID for the edit button
            document.getElementById('edit-from-details-btn').setAttribute('data-tenant-id', tenantId);
            
            // Show the modal
            showModal('tenant-details-modal');
        } else {
            showMessage('Failed to load tenant details: ' + response.message, 'error');
        }
    } catch (error) {
        console.error('Error loading tenant details:', error);
        showMessage('Error loading tenant details: ' + error.message, 'error');
    }
}

async function completeMaintenance(requestId) {
    try {
        const response = await api.completeMaintenance(requestId, new Date().toISOString());
        
        if (response.success) {
            // Reload maintenance data from API to get updated status
            await loadMaintenanceFromAPI();
            // Re-render the maintenance lists with updated data
            renderMaintenanceLists();
            // Update dashboard
            updateDashboard();
            showMessage('Maintenance request marked as completed', 'success');
        } else {
            showMessage('Failed to complete maintenance request: ' + response.message, 'error');
        }
    } catch (error) {
        console.error('Error completing maintenance request:', error);
        showMessage('Error completing maintenance request: ' + error.message, 'error');
    }
}

async function editMaintenance(requestId) {
    try {
        const response = await api.getMaintenance(requestId);
        if (response.success) {
            const maintenance = response.data;
            
            // Populate form with maintenance data
            document.getElementById('maintenance-apartment').value = maintenance.apartmentNumber;
            document.getElementById('maintenance-type').value = maintenance.type;
            document.getElementById('maintenance-description').value = maintenance.description;
            document.getElementById('maintenance-priority').value = maintenance.priority;
            document.getElementById('maintenance-date').value = maintenance.reportedDate ? maintenance.reportedDate.split('T')[0] : '';
            
            // Store the maintenance ID for update
            document.getElementById('maintenance-form').setAttribute('data-edit-id', requestId);
            
            // Update modal title and button text for edit mode
            const modal = document.getElementById('maintenance-modal');
            const modalTitle = modal.querySelector('.modal-header h2');
            const submitButton = modal.querySelector('button[type="submit"]');
            
            modalTitle.textContent = 'Edit Maintenance Request';
            submitButton.textContent = 'Update Request';
            
            showModal('maintenance-modal');
        } else {
            showMessage('Failed to load maintenance data: ' + response.message, 'error');
        }
    } catch (error) {
        console.error('Error loading maintenance data:', error);
        showMessage('Error loading maintenance data: ' + error.message, 'error');
    }
}

async function deleteMaintenance(requestId) {
    if (confirm('Are you sure you want to delete this maintenance request?')) {
        try {
            const response = await api.deleteMaintenance(requestId);
            
            if (response.success) {
                await loadMaintenanceFromAPI();
                renderMaintenanceLists();
                updateDashboard();
                showMessage('Maintenance request deleted successfully', 'success');
            } else {
                showMessage('Failed to delete maintenance request: ' + response.message, 'error');
            }
        } catch (error) {
            console.error('Error deleting maintenance request:', error);
            showMessage('Error deleting maintenance request: ' + error.message, 'error');
        }
    }
}

async function editInventory(itemId) {
    try {
        const response = await api.getInventory(itemId);
        if (response.success) {
            const item = response.data;
            
            // Populate form with inventory data
            document.getElementById('inventory-apartment').value = item.apartmentNumber;
            document.getElementById('inventory-category').value = item.category;
            document.getElementById('item-type').value = item.type;
            document.getElementById('item-count').value = item.count;
            document.getElementById('item-notes').value = item.notes || '';
            
            // Store the item ID for update
            document.getElementById('inventory-form').setAttribute('data-edit-id', itemId);
            
            // Update modal title and button text for edit mode
            const modal = document.getElementById('inventory-modal');
            const modalTitle = modal.querySelector('.modal-header h2');
            const submitButton = modal.querySelector('button[type="submit"]');
            
            modalTitle.textContent = 'Edit Inventory Item';
            submitButton.textContent = 'Update Item';
            
            showModal('inventory-modal');
        } else {
            showMessage('Failed to load inventory data: ' + response.message, 'error');
        }
    } catch (error) {
        console.error('Error loading inventory data:', error);
        showMessage('Error loading inventory data: ' + error.message, 'error');
    }
}

async function deleteInventory(itemId) {
    if (confirm('Are you sure you want to delete this inventory item?')) {
        try {
            const response = await api.deleteInventory(itemId);
            
            if (response.success) {
                await loadInventoryFromAPI();
                renderInventoryGrids();
                updateDashboard();
                showMessage('Inventory item deleted successfully', 'success');
            } else {
                showMessage('Failed to delete inventory item: ' + response.message, 'error');
            }
        } catch (error) {
            console.error('Error deleting inventory item:', error);
            showMessage('Error deleting inventory item: ' + error.message, 'error');
        }
    }
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function showModal(modalId) {
    console.log(`🔓 Opening modal: ${modalId}`);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log(`✅ Modal ${modalId} opened successfully`);
        
        // Check if form exists in modal
        const form = modal.querySelector('form');
        if (form) {
            console.log(`✅ Form found in modal:`, form.id);
        } else {
            console.error(`❌ No form found in modal ${modalId}`);
        }
    } else {
        console.error(`❌ Modal ${modalId} not found!`);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset form if it's a form modal
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            form.removeAttribute('data-edit-id');
            
            // Reset modal title and button text for add tenant modal
            if (modalId === 'add-tenant-modal') {
                const modalTitle = modal.querySelector('.modal-header h2');
                const submitButton = modal.querySelector('button[type="submit"]');
                
                modalTitle.textContent = 'Add New Tenant';
                submitButton.textContent = 'Add Tenant';
            }
            
            // Reset modal title and button text for maintenance modal
            if (modalId === 'maintenance-modal') {
                const modalTitle = modal.querySelector('.modal-header h2');
                const submitButton = modal.querySelector('button[type="submit"]');
                
                modalTitle.textContent = 'New Maintenance Request';
                submitButton.textContent = 'Submit Request';
            }
            
            // Reset modal title and button text for inventory modal
            if (modalId === 'inventory-modal') {
                const modalTitle = modal.querySelector('.modal-header h2');
                const submitButton = modal.querySelector('button[type="submit"]');
                
                modalTitle.textContent = 'Add Inventory Item';
                submitButton.textContent = 'Add Item';
            }
        }
    }
}

function showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
        messageContainer.textContent = message;
        messageContainer.className = `message message-${type}`;
        messageContainer.style.display = 'block';
        
        // Reset transform for animation
        messageContainer.style.transform = 'translateX(100%)';
        
        // Trigger animation
        setTimeout(() => {
            messageContainer.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 5000);
    }
}

// Note: Functions are now accessed through event delegation instead of global window assignment
