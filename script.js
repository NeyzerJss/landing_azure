const contenedor = document.getElementById('tarjetas');
const estado = document.getElementById('estado');
const buscador = document.getElementById('buscador');
const chips = document.querySelectorAll('.chip');

let categoriaActiva = '';
let temporizador = null;

async function cargarAtracciones() {
    const parametros = new URLSearchParams();

    if (categoriaActiva) {
        parametros.set('categoria', categoriaActiva);
    }

    const texto = buscador.value.trim();
    if (texto) {
        parametros.set('q', texto);
    }

    estado.textContent = 'Consultando el servicio web...';
    estado.classList.remove('error');
    contenedor.innerHTML = '';

    try {
        const respuesta = await fetch(`/api/atracciones?${parametros.toString()}`);

        if (!respuesta.ok) {
            throw new Error(`el servicio respondió con estado ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        renderizar(datos.resultados);
        estado.textContent = `Servicio web: ${datos.total} atracción(es) encontrada(s).`;
    } catch (error) {
        estado.textContent = `No se pudo consultar el servicio web: ${error.message}`;
        estado.classList.add('error');
    }
}

function renderizar(atracciones) {
    if (atracciones.length === 0) {
        contenedor.innerHTML = '<p class="sin-resultados">No hay atracciones que coincidan con tu búsqueda.</p>';
        return;
    }

    contenedor.innerHTML = atracciones
        .map((atraccion) => {
            const precio = atraccion.precioMXN === 0
                ? 'Entrada libre'
                : `$${atraccion.precioMXN.toLocaleString('es-MX')} MXN`;

            return `
                <article class="tarjeta">
                    <span class="badge badge-${atraccion.categoria}">${atraccion.categoria}</span>
                    <h3>${atraccion.nombre}</h3>
                    <p class="ubicacion">${atraccion.ubicacion}</p>
                    <p>${atraccion.descripcion}</p>
                    <div class="tarjeta-pie">
                        <span class="precio">${precio}</span>
                        <span class="rating">★ ${atraccion.rating.toFixed(1)}</span>
                    </div>
                </article>
            `;
        })
        .join('');
}

chips.forEach((chip) => {
    chip.addEventListener('click', () => {
        chips.forEach((elemento) => elemento.classList.remove('activo'));
        chip.classList.add('activo');
        categoriaActiva = chip.dataset.categoria;
        cargarAtracciones();
    });
});

buscador.addEventListener('input', () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(cargarAtracciones, 300);
});

cargarAtracciones();
