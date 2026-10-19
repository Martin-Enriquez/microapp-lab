function procesarScraper() {
  const input = document.getElementById('rawInput').value;
  const errorBox = document.getElementById('errorBox');
  const contenedorResultados = document.getElementById('contenedorResultados');
  const summaryCards = document.getElementById('summaryCards');
  const tablaCuerpo = document.getElementById('tablaCuerpo');

  errorBox.style.display = 'none';
  contenedorResultados.style.display = 'none';
  summaryCards.style.display = 'none';
  tablaCuerpo.innerHTML = '';

  if (!input.trim()) {
    mostrarError('Por favor, pega el texto o contenido HTML que deseas analizar.');
    return;
  }

  // Regex para detectar variaciones comunes de moneda: $10, $10.50, USD 10.00, US$10, 10,50 $
  const regexPrecio = /(?:(?:USD|US\$|\$)\s*)?(\d{1,3}(?:[\.,]\d{3})*(?:[\.,]\d{2})?)\s*(?:\$|USD)?/gi;
  
  // Limpieza inicial de tags HTML para obtener texto plano con saltos de línea
  const textoLimpio = input.replace(/<br\s*\/?>/gi, '\n')
                           .replace(/<\/p>/gi, '\n')
                           .replace(/<\/div>/gi, '\n')
                           .replace(/<[^>]+>/g, ' ');

  const lineas = textoLimpio.split('\n');
  const productos = [];

  lineas.forEach((linea) => {
    const lineaTrim = linea.trim();
    if (!lineaTrim) return;

    // Buscar si la línea tiene un símbolo de moneda o formato numérico claro de precio
    if (lineaTrim.includes('$') || /USD|US\$|precio/i.test(lineaTrim) || /\d+[\.,]\d{2}/.test(lineaTrim)) {
      const coincidencias = [...lineaTrim.matchAll(regexPrecio)];
      
      coincidencias.forEach(match => {
        let valorStr = match[1];
        // Normalizar formato decimal (reemplazar coma por punto si es decimal)
        if (valorStr.includes(',') && !valorStr.includes('.')) {
          valorStr = valorStr.replace(',', '.');
        } else if (valorStr.includes(',') && valorStr.includes('.')) {
          valorStr = valorStr.replace(/,/g, '');
        }

        const precioValor = parseFloat(valorStr);

        // Filtrar números irrelevantes (años, IDs pequeños o cero)
        if (!isNaN(precioValor) && precioValor > 0 && precioValor < 100000) {
          let nombreLimpio = lineaTrim.replace(match[0], '').replace(/\s+/g, ' ').trim();
          if (nombreLimpio.length > 80) {
            nombreLimpio = nombreLimpio.substring(0, 80) + '...';
          }

          productos.push({
            nombre: nombreLimpio || 'Producto / Ítem detectado',
            precio: precioValor
          });
        }
      });
    }
  });

  if (productos.length === 0) {
    mostrarError('No se detectaron montos ni precios con formato ($0.00 o USD) en el texto ingresado.');
    return;
  }

  // Métricas
  const precios = productos.map(p => p.precio);
  const menorPrecio = Math.min(...precios);
  const sumaPrecios = precios.reduce((acc, curr) => acc + curr, 0);
  const promedio = sumaPrecios / precios.length;

  document.getElementById('statTotal').innerText = productos.length;
  document.getElementById('statLowest').innerText = `$${menorPrecio.toFixed(2)}`;
  document.getElementById('statAvg').innerText = `$${promedio.toFixed(2)}`;

  // Renderizar tabla
  productos.forEach((p, idx) => {
    const tr = document.createElement('tr');
    const esMenor = p.precio === menorPrecio;

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${p.nombre}</td>
      <td><strong>$${p.precio.toFixed(2)}</strong></td>
      <td>${esMenor ? '<span class="badge-lowest">🔥 Mejor Precio</span>' : 'Estándar'}</td>
    `;
    tablaCuerpo.appendChild(tr);
  });

  summaryCards.style.display = 'grid';
  contenedorResultados.style.display = 'block';
}

function mostrarError(msg) {
  const errorBox = document.getElementById('errorBox');
  errorBox.innerText = msg;
  errorBox.style.display = 'block';
}

function limpiarScraper() {
  document.getElementById('rawInput').value = '';
  document.getElementById('errorBox').style.display = 'none';
  document.getElementById('summaryCards').style.display = 'none';
  document.getElementById('contenedorResultados').style.display = 'none';
  document.getElementById('tablaCuerpo').innerHTML = '';
}