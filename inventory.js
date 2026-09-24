let products = JSON.parse(localStorage.getItem("products")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];
function addButton(){
    let name=document.getElementById("name").value;
    let category=document.getElementById("category").value;
    let price=document.getElementById("price").value;
    let quantity=document.getElementById("quantity").value;
    
    if(name.trim()==""||category.trim()==""||price==""||quantity==""){
        alert("please fill the all the forms")
        return
    }
if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
    alert("Please enter a valid price");
    return;
}

if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
    alert("Quantity must be a positive whole number");
    return;
}
    let product={
        name:name,
        category:category,
        price:Number(price),
        quantity:Number(quantity),
    };
    products.push(product)
    console.log(products)
    localStorage.setItem("products", JSON.stringify(products));

displayProducts();
loadSaleProducts();
alert("Product added successfully!");
    document.getElementById("name").value="";
    document.getElementById("category").value="";
    document.getElementById("price").value="";
    document.getElementById("quantity").value="";
}
function displayProducts(){
    let table=document.getElementById("tablesection")
    table.innerHTML="";
    if (products.length === 0) {
    table.innerHTML = `
        <tr>
            <td colspan="8">No products available</td>
        </tr>
    `;
    updateDashboard();
    return;
}
    products.forEach(function(product,index) {
        let status;
        if (product.quantity === 0) {
    status = `<span class="out-of-stock">Out of Stock</span>`;
} else if (product.quantity < 10) {
    status = `<span class="low-stock">Low Stock</span>`;
} else {
    status = `<span class="available">Available</span>`;
}
        table.innerHTML+=`
        <tr>
        <td>${index+1}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>₹${product.price}</td>
        <td>${product.quantity}</td>
        <td>${status}</td>
        <td>
        <button class="delete-btn"
        onclick="deleteproduct(${index})">Delete
        </button>
        <button class="edit-btn" onclick="editProduct(${index})">Edit</button></td>
        </tr>
        `;
    });
    updateDashboard();
}

function deleteproduct(index){
    products.splice(index,1)
        localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
    loadSaleProducts();
}
function deleteproduct(index){

    let confirmDelete = confirm("Are you sure you want to delete this product?");

    if (!confirmDelete) {
        return;
    }

    products.splice(index,1);

    localStorage.setItem("products", JSON.stringify(products));

    displayProducts();
    loadSaleProducts();
}
function updateDashboard(){
    document.getElementById("totalProducts").innerHTML=products.length
    let totalstock=0;
    let lowstock=0;
    products.forEach(function(product){
             totalstock += product.quantity;

        if (product.quantity < 10) {
            lowstock++;
        }

    });
    document.getElementById("totalstock").innerHTML=totalstock;
    document.getElementById("lowstock").innerHTML=lowstock;

let totalSales = 0;
let totalSalesAmount = 0;

sales.forEach(function(sale) {
    totalSales += sale.quantity;
    totalSalesAmount += sale.totalAmount;
});

document.getElementById("totalSales").innerHTML = totalSales;
document.getElementById("totalSalesAmount").innerHTML =
    "₹" + totalSalesAmount;
}

function searchProduct() {

    let searchValue =
        document.getElementById("search").value.toLowerCase().trim();

    let rows =
        document.querySelectorAll("#tablesection tr");

    rows.forEach(function(row) {

        let productName =
            row.children[1].innerText.toLowerCase();

        let category =
            row.children[2].innerText.toLowerCase();

        if (
            productName.includes(searchValue) ||
            category.includes(searchValue)
        ) {
            row.style.display = "";
        }
        else {
            row.style.display = "none";
        }

    });
}
let editindex=null;
function editProduct(index){
    let product = products[index];
    editindex=index

    document.getElementById("name").value = product.name;
    document.getElementById("category").value = product.category;
    document.getElementById("price").value = product.price;
    document.getElementById("quantity").value = product.quantity;
    document.getElementById("addButton").innerText = "Update Product";

}
function updateProduct(){
       
  
   
let name = document.getElementById("name").value;
let category = document.getElementById("category").value;
let price = document.getElementById("price").value;
let quantity = document.getElementById("quantity").value;
editindex = null;
document.getElementById("addButton").innerText = "Add Product";
if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
    alert("Please enter a valid price");
    return;
}

if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
    alert("Quantity must be a positive whole number");
    return;
}
  if(name.trim()==""||category.trim()==""||price==""||quantity==""){
        alert("please fill the all the forms")
        return
    }
 products[editindex] = {
    name: name,
    category: category,
    price: Number(price),
    quantity: Number(quantity)
};
 localStorage.setItem("products", JSON.stringify(products));
 displayProducts();
loadSaleProducts();

alert("Product updated successfully!");
    document.getElementById("name").value="";
    document.getElementById("category").value="";
    document.getElementById("price").value="";
    document.getElementById("quantity").value="";
}
function loadSaleProducts() {
    let select = document.getElementById("saleProduct");

    select.innerHTML = `<option value="">Select Product</option>`;

    products.forEach(function(product, index) {
        let option = document.createElement("option");

        option.value = index;
        option.textContent = product.name;

        select.appendChild(option);
    });

    document.getElementById("availableStock").innerText = "";
}
function showAvailableStock() {
    let index=document.getElementById("saleProduct").value
        let stock = products[index].quantity;

    document.getElementById("availableStock").innerText =
        "Available Stock: " + stock;
    
}
function sellProduct() {

    let index = document.getElementById("saleProduct").value;

    let saleQuantity =
        Number(document.getElementById("saleQuantity").value);

    if (index === "") {
        alert("Please select a product");
        return;
    }

    let product = products[index];
    if (saleQuantity > product.quantity) {
    alert("Not enough stock");
    return;
}

    if (saleQuantity <= 0) {
        alert("Please enter valid sale quantity");
        return;
    }

    if (saleQuantity > product.quantity) {
        alert("Not enough stock");
        return;
    }

    let sale = {
        productName: product.name,
        quantity: saleQuantity,
        price: product.price,
        totalAmount: saleQuantity * product.price,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
    };

    sales.push(sale);

    localStorage.setItem("sales", JSON.stringify(sales));

    product.quantity = product.quantity - saleQuantity;

    localStorage.setItem("products", JSON.stringify(products));

    displayProducts();

    showAvailableStock();
    viewsales();

    document.getElementById("saleQuantity").value = "";

    alert("Product sold successfully");
}
function viewsales() {

    let saleTable = document.getElementById("salesTable");

    saleTable.innerHTML = "";
    if (sales.length === 0) {
    saleTable.innerHTML = `
        <tr>
            <td colspan="8">No sales available</td>
        </tr>
    `;
    return;
}

    sales.forEach(function(sale, index) {

        saleTable.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${sale.productName}</td>
            <td>${sale.quantity}</td>
            <td>₹${sale.price}</td>
<td>₹${sale.totalAmount}</td>
            <td>${sale.date}</td>
<td>${sale.time}</td>
                <td>
        <button class="delete-btn"
        onclick="deletesale(${index})">delete
        </button>
        </td>
        </tr>
        `;
    });
    
}
function deletesale(index){
    sales.splice(index,1)
    localStorage.setItem("sales", JSON.stringify(sales));
    viewsales();
}
function deletesale(index){

    let confirmDelete = confirm("Are you sure you want to delete this sale?");

    if (!confirmDelete) {
        return;
    }

    sales.splice(index,1);

    localStorage.setItem("sales", JSON.stringify(sales));

    viewsales();
    updateDashboard();
}




displayProducts();
loadSaleProducts();
viewsales();