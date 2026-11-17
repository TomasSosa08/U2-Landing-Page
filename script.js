
// ELEMENTOS
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const openCartButton = document.getElementById("openCart");
const closeCartButton = document.getElementById("closeCart");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const checkoutButton = document.getElementById("checkoutButton");
const toast = document.getElementById("toast");

// CARRITO
let cart = [];

// FORMATO DE PRECIOS
function formatPrice(price) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(price);
}

// MENSAJE TEMPORAL
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// ABRIR CARRITO
function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  document.body.classList.add("cart-open");
}

// CERRAR CARRITO
function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  document.body.classList.remove("cart-open");
}

openCartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// CERRAR CON ESCAPE
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
  }
});

// AGREGAR PRODUCTOS
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    if (!name || !Number.isFinite(price) || price <= 0) {
      showToast("No se pudo agregar el producto.");
      return;
    }

    const existingProduct = cart.find((item) => item.name === name);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({
        name,
        price,
        quantity: 1
      });
    }

    updateCart();
    showToast(`${name} agregado al carrito`);
  });
});

// ACTUALIZAR CARRITO
function updateCart() {
  const totalQuantity = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="empty-cart">Tu carrito está vacío.</p>';
    return;
  }

  cartItemsContainer.innerHTML = "";

  cart.forEach((item) => {
    const productElement = document.createElement("div");
    productElement.className = "cart-item";

    const info = document.createElement("div");
    info.className = "cart-item-info";

    const name = document.createElement("strong");
    name.textContent = item.name;

    const price = document.createElement("span");
    price.textContent = formatPrice(item.price * item.quantity);

    info.append(name, price);

    const actions = document.createElement("div");
    actions.className = "cart-item-actions";

    const decreaseButton = document.createElement("button");
    decreaseButton.textContent = "−";
    decreaseButton.setAttribute("aria-label", "Restar una unidad");
    decreaseButton.addEventListener("click", () => {
      changeQuantity(item.name, -1);
    });

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const increaseButton = document.createElement("button");
    increaseButton.textContent = "+";
    increaseButton.setAttribute("aria-label", "Agregar una unidad");
    increaseButton.addEventListener("click", () => {
      changeQuantity(item.name, 1);
    });

    const removeButton = document.createElement("button");
    removeButton.textContent = "×";
    removeButton.className = "remove-item";
    removeButton.setAttribute("aria-label", "Eliminar producto");
    removeButton.addEventListener("click", () => {
      removeProduct(item.name);
    });

    actions.append(
      decreaseButton,
      quantity,
      increaseButton,
      removeButton
    );

    productElement.append(info, actions);
    cartItemsContainer.appendChild(productElement);
  });
}

// CAMBIAR CANTIDAD
function changeQuantity(productName, amount) {
  const product = cart.find((item) => item.name === productName);

  if (!product) return;

  product.quantity += amount;

  if (product.quantity <= 0) {
    cart = cart.filter((item) => item.name !== productName);
  }

  updateCart();
}

// ELIMINAR PRODUCTO
function removeProduct(productName) {
  cart = cart.filter((item) => item.name !== productName);
  updateCart();
  showToast("Producto eliminado del carrito");
}

// FINALIZAR COMPRA
checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Primero agregá un producto al carrito.");
    return;
  }

  showToast("Demo: la tienda todavía no procesa pagos reales.");
});

// MENÚ PARA CELULARES
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.textContent = isOpen ? "✕" : "☰";
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Cerrar menú" : "Abrir menú"
  );
});

// CERRAR MENÚ AL ELEGIR UNA SECCIÓN
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-label", "Abrir menú");
  });
});

// ANIMACIONES AL DESPLAZARSE
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

// INICIO
updateCart();
