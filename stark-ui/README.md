# Proyecto – Frontend Practice: Stark (Nivel 3)

Implementación de una interfaz inspirada en el proyecto **Stark** de Frontend Practice, con:
- Grid responsivo de tarjetas/recursos
- Navegación accesible por teclado (Tab + flechas)
- Modal de autenticación con **UI de clave bancaria** (teclado numérico) integrado
- Header con navegación y Footer sticky multicolumna

## Ejecutar
Abre `index.html` directamente en tu navegador (no requiere servidor).

## Atajos y accesibilidad
- `Tab` / `Shift + Tab` para foco entre elementos.
- Flechas (`↑ ↓ ← →`) para moverte entre tarjetas del grid cuando alguna está enfocada.
- `Esc` cierra el modal de clave.
- En el modal, puedes usar tanto el **teclado físico** como el **teclado en pantalla**.

## Estructura
```
stark-ui/
 ├─ index.html
 ├─ styles.css
 ├─ main.js
 └─ assets/
     ├─ logo.svg
     └─ wave.svg
```

## Git – guardar en la rama `proyecto`
Desde la raíz de tu repo:

```bash
git checkout -b proyecto
git add stark-ui/**
git commit -m "Proyecto FrontendPractice Stark nivel 3 + UI clave banco"
git push -u origin proyecto
```
