#!/usr/bin/env python3
"""
Microapp: Cotizador de Envíos Nacionales Ecuador v2.0
Descripción: Cotizador realista con tarifas por provincias, peso volumétrico,
             seguro opcional e impuestos (IVA 15%).
"""

IVA_ECUADOR = 0.15

TARIFAS_REGION = {
    "1": {"region": "Pichincha (Urbano/Local)", "base": 2.50, "extra_kg": 0.50},
    "2": {"region": "Sierra / Costa (Nacional)", "base": 4.50, "extra_kg": 1.25},
    "3": {"region": "Oriente / Amazonía", "base": 6.00, "extra_kg": 1.75},
    "4": {"region": "Galápagos (Insular)", "base": 12.00, "extra_kg": 3.50},
}


def calcular_peso_volumetrico(largo_cm: float, ancho_cm: float, alto_cm: float) -> float:
    """Calcula el peso volumétrico estándar de paquetería (L x A x H / 5000)."""
    return (largo_cm * ancho_cm * alto_cm) / 5000.0


def solicitar_float(mensaje: str) -> float:
    """Solicita un valor float positivo validando la entrada."""
    while True:
        try:
            valor = float(input(mensaje))
            if valor <= 0:
                print("❌ El valor debe ser mayor a 0.")
                continue
            return valor
        except ValueError:
            print("❌ Entrada inválida. Ingrese un número válido (ej. 1.5).")


def seleccionar_destino() -> dict:
    """Muestra el menú de destinos y retorna la tarifa seleccionada."""
    print("\n📍 Seleccione la región de destino:")
    for clave, datos in TARIFAS_REGION.items():
        print(f"  {clave}. {datos['region']} (Base: ${datos['base']:.2f})")

    while True:
        opcion = input("Opción (1-4): ").strip()
        if opcion in TARIFAS_REGION:
            return TARIFAS_REGION[opcion]
        print("❌ Opción no válida. Elija un número del 1 al 4.")


def main():
    print("==================================================")
    print(" 📦 COTIZADOR DE ENVÍOS NACIONALES ECUADOR v2.0")
    print("==================================================")

    # 1. Seleccionar Destino
    destino = seleccionar_destino()

    # 2. Datos del Paquete
    print("\n📏 Dimensiones y Peso del Paquete:")
    peso_real = solicitar_float(" • Peso físico real (kg): ")
    largo = solicitar_float(" • Largo (cm): ")
    ancho = solicitar_float(" • Ancho (cm): ")
    alto = solicitar_float(" • Alto (cm): ")

    peso_vol = calcular_peso_volumetrico(largo, ancho, alto)
    peso_facturable = max(peso_real, peso_vol)

    # 3. Extras
    print("\n🛡️ Cobertura Adicional:")
    asegurar = input(" ¿Desea incluir seguro por pérdida/daño? (s/n): ").strip().lower() == "s"
    valor_declarado = 0.0
    costo_seguro = 0.0
    if asegurar:
        valor_declarado = solicitar_float(" • Valor declarado del producto ($): ")
        costo_seguro = valor_declarado * 0.02  # 2% del valor declarado

    # 4. Cálculo de Tarifas
    base = destino["base"]
    kg_adicionales = max(0.0, peso_facturable - 1.0)  # El primer kg está incluido en la tarifa base
    costo_peso_extra = kg_adicionales * destino["extra_kg"]

    subtotal = base + costo_peso_extra + costo_seguro
    monto_iva = subtotal * IVA_ECUADOR
    total = subtotal + monto_iva

    # 5. Desglose Final
    print("\n" + "=" * 50)
    print("🧾 RESUMEN DE LA COTIZACIÓN")
    print("=" * 50)
    print(f" • Destino:             {destino['region']}")
    print(f" • Peso Real / Vol.:    {peso_real:.2f} kg / {peso_vol:.2f} kg")
    print(f" • Peso Facturable:     {peso_facturable:.2f} kg")
    print("--------------------------------------------------")
    print(f" • Tarifa Base (1er kg): ${base:.2f}")
    if kg_adicionales > 0:
        print(f" • Peso Extra ({kg_adicionales:.2f} kg): ${costo_peso_extra:.2f}")
    if asegurar:
        print(f" • Seguro (2% de ${valor_declarado:.2f}): ${costo_seguro:.2f}")
    print(f" • Subtotal:            ${subtotal:.2f}")
    print(f" • IVA (15%):           ${monto_iva:.2f}")
    print("--------------------------------------------------")
    print(f" 💳 TOTAL A PAGAR:      ${total:.2f}")
    print("=" * 50 + "\n")


if __name__ == "__main__":
    main()