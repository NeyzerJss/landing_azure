const { app } = require('@azure/functions');
const atracciones = require('../data/atracciones.json');

app.http('atracciones', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'atracciones',
  handler: async (request, context) => {
    const categoria = (request.query.get('categoria') || '').trim().toLowerCase();
    const q = (request.query.get('q') || '').trim().toLowerCase();

    let resultados = atracciones;

    if (categoria) {
      resultados = resultados.filter((atraccion) => atraccion.categoria === categoria);
    }

    if (q) {
      resultados = resultados.filter(
        (atraccion) =>
          atraccion.nombre.toLowerCase().includes(q) ||
          atraccion.descripcion.toLowerCase().includes(q) ||
          atraccion.ubicacion.toLowerCase().includes(q)
      );
    }

    context.log(`Consulta de atracciones: categoria="${categoria}" q="${q}" -> ${resultados.length} resultados`);

    return {
      jsonBody: {
        total: resultados.length,
        resultados
      }
    };
  }
});
