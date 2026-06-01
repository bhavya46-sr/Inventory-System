let products = JSON.parse(localStorage.getItem("products")) || [];

const form = document.getElementById("productForm");

if (form) {

    displayProducts();

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const product = {
            name: document.getElementById("name").value,
            id: document.getElementById("productId").value,
            category: document.getElementById("category").value,
            quantity: Number(document.getElementById("quantity").value),
            price: Number(document.getElementById("price").value),
            supplier: document.getElementById("supplier").value
        };

        const editIndex = document.getElementById("editIndex").value;

        if (editIndex === "") {
            products.push(product);
        } else {
            products[editIndex] = product;
        }

        localStorage.setItem("products", JSON.stringify(products));

        form.reset();
        document.getElementById("editIndex").value = "";

        displayProducts();
    });

    document.getElementById("search").addEventListener("input", function () {
        displayProducts(this.value);
    });
}

function displayProducts(searchTerm = "") {

    const table = document.getElementById("productTable");

    if (!table) return;

    table.innerHTML = "";

    products
        .filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .forEach((product, index) => {

            const row = document.createElement("tr");

            if (product.quantity < 10) {
                row.classList.add("low-stock");
            }

            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.id}</td>
                <td>${product.category}</td>
                <td>${product.quantity}</td>
                <td>₹${product.price}</td>
                <td>${product.supplier}</td>
                <td>
                    <button onclick="editProduct(${index})">Edit</button>
                    <button onclick="deleteProduct(${index})">Delete</button>
                </td>
            `;

            table.appendChild(row);
        });
}

function editProduct(index) {

    const p = products[index];

    document.getElementById("name").value = p.name;
    document.getElementById("productId").value = p.id;
    document.getElementById("category").value = p.category;
    document.getElementById("quantity").value = p.quantity;
    document.getElementById("price").value = p.price;
    document.getElementById("supplier").value = p.supplier;

    document.getElementById("editIndex").value = index;
}

function deleteProduct(index) {

    if (confirm("Delete this product?")) {

        products.splice(index, 1);

        localStorage.setItem("products", JSON.stringify(products));

        displayProducts();
    }
}

function loadDashboard() {

    const products = JSON.parse(localStorage.getItem("products")) || [];

    const totalProducts = products.length;

    const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);

    const inventoryValue = products.reduce(
        (sum, p) => sum + (p.quantity * p.price), 0
    );

    const lowStock = products.filter(
        p => p.quantity < 10
    ).length;

    let categories = {};

    products.forEach(p => {
        categories[p.category] =
            (categories[p.category] || 0) + p.quantity;
    });

    let topCategory = "N/A";
    let max = 0;

    for (let cat in categories) {
        if (categories[cat] > max) {
            max = categories[cat];
            topCategory = cat;
        }
    }

    if (document.getElementById("totalProducts")) {

        document.getElementById("totalProducts").innerText = totalProducts;
        document.getElementById("totalStock").innerText = totalStock;
        document.getElementById("inventoryValue").innerText = "₹" + inventoryValue;
        document.getElementById("lowStock").innerText = lowStock;
        document.getElementById("topCategory").innerText = topCategory;

        const categoryTable = document.getElementById("categoryTable");

        categoryTable.innerHTML = "";

        for (let cat in categories) {

            categoryTable.innerHTML += `
                <tr>
                    <td>${cat}</td>
                    <td>${categories[cat]}</td>
                </tr>
            `;
        }
    }
}

function exportCSV() {

    let products = JSON.parse(localStorage.getItem("products")) || [];

    if (products.length === 0) {
        alert("No products available to export!");
        return;
    }

    let csv =
        "Product Name,Product ID,Category,Quantity,Unit Price,Supplier\n";

    products.forEach(product => {
        csv += `${product.name},${product.id},${product.category},${product.quantity},${product.price},${product.supplier}\n`;
    });

    let blob = new Blob([csv], { type: "text/csv" });

    let url = window.URL.createObjectURL(blob);

    let a = document.createElement("a");

    a.href = url;
    a.download = "inventory_data.csv";

    a.click();

    window.URL.revokeObjectURL(url);
}

loadDashboard();