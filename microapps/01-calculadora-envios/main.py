#!/usr/bin/env python3
"""
Microapp: Calculadora de Envíos Rápidos
Descripción: Herramienta ligera para estimar costos de envío según el peso y tipo de servicio.
"""

def calcular_costo_envio(peso_kg: float, tipo_servicio: str = "estandar") -> float:
    """
    Calcula el tarifa de envío según el peso en kg y la tarifa del servicio.
    """
    tarifa_base = 2.50
    costo_por_kg = 1.20

    costo_total = tarifa_base + (peso_kg * costo_por_kg)

    if tipo_servicio == "expres":
        costo_total *= 1.5  # Recargo del 50% para envío exprés

    return round(costo_total, 2)


def solicitar_peso() -> float:
    """Solicita el peso al usuario validando que sea un número positivo."""
    while True:
        try:
            peso = float(input("👉 Ingrese el peso del paquete en kg: "))
            if peso <= 0:
                print("❌ El peso debe ser mayor a 0 kg. Intente de nuevo.")
                continue
            return peso
        except ValueError:
            print("❌ Entrada inválida. Ingrese un valor numérico (ej. 2.5).")


def main():
    print("==========================================")
    print(" 📦 CALCULADORA DE ENVÍOS RÁPIDOS v1.0")
    print("==========================================\n")

    peso = solicitar_peso()

    print("\nSeleccione el tipo de servicio:")
    print("1. Estándar (Entrega normal)")
    print("2. Exprés (+50% recargo)")
    
    opcion = input("Seleccione una opción (1/2) [Por defecto 1]: ").strip()
    
    tipo_servicio = "expres" if opcion == "2" else "estandar"
    costo = calcular_costo_envio(peso, tipo_servicio)

    print("\n------------------------------------------")
    print(f"📋 RESUMEN DEL CÁLCULO:")
    print(f" • Peso ingresado : {peso:.2f} kg")
    print(f" • Servicio       : {tipo_servicio.capitalize()}")
    print(f" • Total a pagar  : ${costo:.2f}")
    print("------------------------------------------\n")


if __name__ == "__main__":
    main()