let services = JSON.parse(localStorage.getItem("services")) || [];
let currentPage = 1;
const servicesPerPage = 6;
let isAdmin = false;

// Render services
function renderServices(filteredServices) {
    const serviceGrid = document.getElementById("serviceGrid");
    serviceGrid.innerHTML = "";

    const servicesToShow = filteredServices || services;
    const startIndex = (currentPage - 1) * servicesPerPage;
    const endIndex = startIndex + servicesPerPage;
    const paginatedServices = servicesToShow.slice(startIndex, endIndex);

    paginatedServices.forEach((service, index) => {
        const serviceCard = document.createElement("div");
        serviceCard.className = "service-card";

        // Show delete button only in admin view
        const deleteButton = isAdmin
            ? `<button class="delete-button" onclick="deleteService(${index})"><i class="fas fa-trash"></i></button>`
            : "";

        serviceCard.innerHTML = `
            <img src="${service.image}" alt="${service.name}" class="service-image">
            <h3>${service.name}</h3>
            <p><strong>Provider:</strong> ${service.provider}</p>
            <p>${service.description}</p>
            <div class="contact-links">
                <a href="${service.whatsappLink}" target="_blank">WhatsApp</a>
                <a href="${service.telegramLink}" target="_blank">Telegram</a>
            </div>
            ${deleteButton}
        `;

        serviceGrid.appendChild(serviceCard);
    });

    updatePagination(servicesToShow.length);
}

// Update pagination
function updatePagination(totalServices) {
    const pageInfo = document.getElementById("pageInfo");
    const totalPages = Math.ceil(totalServices / servicesPerPage);

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === totalPages;
}

// Change page
function changePage(direction) {
    currentPage += direction;
    renderServices();
}

// Filter services
function filterServices() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchInput) ||
        service.provider.toLowerCase().includes(searchInput) ||
        service.description.toLowerCase().includes(searchInput)
    );
    currentPage = 1;
    renderServices(filteredServices);
}

// Show add service form
function showAddServiceForm() {
    if (isAdmin) {
        document.getElementById("addServiceForm").style.display = "block";
    }
}

// Hide add service form
function hideAddServiceForm() {
    if (isAdmin) {
        document.getElementById("addServiceForm").style.display = "none";
    }
}

// Add service
function addService(event) {
    event.preventDefault();

    if (isAdmin) {
        const name = document.getElementById("name").value;
        const provider = document.getElementById("provider").value;
        const description = document.getElementById("description").value;
        const whatsapp = document.getElementById("whatsapp").value;
        const telegram = document.getElementById("telegram").value;
        const imageFile = document.getElementById("image").files[0];

        if (name && provider && description && whatsapp && telegram && imageFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const service = {
                    name,
                    provider,
                    description,
                    whatsappLink: `https://wa.me/${whatsapp}`,
                    telegramLink: `https://t.me/${telegram}`,
                    image: e.target.result
                };
                services.push(service);
                localStorage.setItem("services", JSON.stringify(services));
                renderServices();
                hideAddServiceForm();
                alert("Service added successfully!");
            };
            reader.readAsDataURL(imageFile);
        } else {
            alert("All fields are required!");
        }
    }
}

// Delete service
function deleteService(index) {
    if (isAdmin && confirm("Are you sure you want to delete this service?")) {
        services.splice(index, 1);
        localStorage.setItem("services", JSON.stringify(services));
        renderServices();
        alert("Service deleted successfully!");
    }
}

// Login as admin
function loginAdmin() {
    const password = document.getElementById("adminPassword").value;
    if (password === "admin123") { // Replace with a secure password
        isAdmin = true;
        document.getElementById("adminLogin").style.display = "none";
        document.getElementById("adminToggle").style.display = "block";
        alert("Logged in as admin!");
    } else {
        alert("Incorrect password!");
    }
}

// Toggle admin view
function toggleAdminView() {
    isAdmin = !isAdmin;
    renderServices();
    document.getElementById("addServiceForm").style.display = isAdmin ? "block" : "none";
}

// Render services on page load
document.addEventListener("DOMContentLoaded", () => {
    renderServices();
});