const TARIFAS = {
  pichincha: { base: 2.50, extraKg: 0.50, nombre: "Pichincha Urbano" },
  nacional: { base: 4.50, extraKg: 1.25, nombre: "Sierra/Costa Nacional" },
  oriente: { base: 6.00, extraKg: 1.75, nombre: "Oriente/Amazonía" },
  galapagos: { base: 12.00, extraKg: 3.50, nombre: "Galápagos Insular" }
};

function toggleSeguro() {
  const check = document.getElementById('asegurar').checked;
  document.getElementById('seguro-box').style.display = check ? 'block' : 'none';
}

function toggleCOD() {
  const check = document.getElementById('cod').checked;
  document.getElementById('cod-box').style.display = check ? 'block' : 'none';
}

function calcularCotizacion() {
  const regKey = document.getElementById('region').value;
  const tarifa = TARIFAS[regKey];
  const esExpress = document.getElementById('tipoServicio').value === 'express';

  // Peso
  const pesoReal = parseFloat(document.getElementById('peso').value) || 0;
  const largo = parseFloat(document.getElementById('largo').value) || 0;
  const ancho = parseFloat(document.getElementById('ancho').value) || 0;
  const alto = parseFloat(document.getElementById('alto').value) || 0;

  const pesoVol = (largo * ancho * alto) / 5000;
  const pesoFacturable = Math.max(pesoReal, pesoVol);

  // Flete Base y Kg Extras
  let fleteBase = tarifa.base;
  const kgExtra = Math.max(0, pesoFacturable - 1);
  fleteBase += (kgExtra * tarifa.extraKg);

  // Recargo Express
  let costoExpress = esExpress ? (fleteBase * 0.35) : 0;

  // Recargo COD (Contraentrega)
  let costoCOD = 0;
  const tieneCOD = document.getElementById('cod').checked;
  if (tieneCOD) {
    const montoRecaudar = parseFloat(document.getElementById('montoCOD').value) || 0;
    costoCOD = Math.max(1.50, montoRecaudar * 0.03); // $1.50 mínimo o 3%
  }

  // Seguro
  let costoSeguro = 0;
  const tieneSeguro = document.getElementById('asegurar').checked;
  if (tieneSeguro) {
    const valorDeclarado = parseFloat(document.getElementById('valorDeclarado').value) || 0;
    costoSeguro = valorDeclarado * 0.02;
  }

  // Totales
  const subtotal = fleteBase + costoExpress + costoCOD + costoSeguro;
  const iva = subtotal * 0.15;
  const total = subtotal + iva;

  // Mostrar filas según selección
  document.getElementById('resPeso').innerText = `${pesoFacturable.toFixed(2)} kg (${pesoVol > pesoReal ? 'Volumétrico IATA' : 'Físico'})`;
  document.getElementById('resBase').innerText = `$${fleteBase.toFixed(2)}`;

  document.getElementById('rowExpress').style.display = esExpress ? 'flex' : 'none';
  document.getElementById('resExpress').innerText = `$${costoExpress.toFixed(2)}`;

  document.getElementById('rowCOD').style.display = tieneCOD ? 'flex' : 'none';
  document.getElementById('resCOD').innerText = `$${costoCOD.toFixed(2)}`;

  document.getElementById('rowSeguro').style.display = tieneSeguro ? 'flex' : 'none';
  document.getElementById('resSeguro').innerText = `$${costoSeguro.toFixed(2)}`;

  document.getElementById('resSubtotal').innerText = `$${subtotal.toFixed(2)}`;
  document.getElementById('resIVA').innerText = `$${iva.toFixed(2)}`;
  document.getElementById('resTotal').innerText = `$${total.toFixed(2)}`;

  // Enlace directo a WhatsApp con mensaje estructurado
  const textoWhatsApp = encodeURIComponent(
    `Hola ExpressLogistics! 📦 Deseo solicitar una guía:\n` +
    `• Destino: ${tarifa.nombre}\n` +
    `• Peso Facturable: ${pesoFacturable.toFixed(2)} kg\n` +
    `• Servicio: ${esExpress ? 'Express (24h)' : 'Estándar'}\n` +
    `• Cotización Total: $${total.toFixed(2)}`
  );
  document.getElementById('btnWhatsapp').href = `https://wa.me/593999999999?text=${textoWhatsApp}`;

  document.getElementById('resultado').style.display = 'block';
}