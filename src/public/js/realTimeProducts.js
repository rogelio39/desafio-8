const socket = io();

const form = document.getElementById('idForm');
const showProducts = document.getElementById('showProducts');

const products = [];


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dataForm = new FormData(e.target);
    const prod = Object.fromEntries(dataForm);
    socket.emit('nuevoProducto', prod);
    e.target.reset();
}
)

socket.on('prods', prods => {
    products.length = 0;
    products.push(...prods);
})


socket.on('prod', prod => {
    products.push(prod);
    renderProducts();
}
)

// Función para renderizar todos los productos en la sección de productos
function renderProducts() {
    let productsHTML = '';

    products.forEach(prod => {
        productsHTML += `
        <div class="products">
            <p>Nombre: ${prod.title}</p>
            <p>Descripción: ${prod.description}</p>
            <p>Precio: $ ${prod.price}</p>
            <p>Stock disponible: ${prod.stock}</p>
            <p>Código del producto: ${prod.code}</p>
        </div>`;
    });

    showProducts.innerHTML = productsHTML;
}