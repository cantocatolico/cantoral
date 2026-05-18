const escala = ["DO", "DO#", "RE", "RE#", "MI", "FA", "FA#", "SOL", "SOL#", "LA", "LA#", "SI"];
const bemoles = { "REB": "DO#", "MIB": "RE#", "SOLB": "FA#", "LAB": "SOL#", "SIB": "LA#" };

// Tono inicial (Ajusta este índice según cómo escribas la canción originalmente)
let tonoActualIndex = 2; // Empezamos en RE

function inicializar() {
    const contenedor = document.getElementById('cancion');
    let texto = contenedor.innerHTML;

    // 1. Regex corregida:
    // Eliminamos la bandera 'i' para que SOLO busque MAYÚSCULAS (DO, RE, MI...)
    // El símbolo # o B sigue siendo opcional.
    const regexAcordes = /\b(DO#?|DOB|RE#?|REB|MI#?|MIB|FA#?|FAB|SOL#?|SOLB|LA#?|LAB|SI#?|SIB)(m|7|maj7|sus\d|add\d|dim|aug)?\b/g;

    contenedor.innerHTML = texto.replace(regexAcordes, (match, nota, sufijo) => {
        // 2. Verificación de Seguridad:
        // Si la nota capturada no empieza con Mayúscula, la devolvemos tal cual (es texto)
        // Esto protege palabras como "la", "re" (de repetir), "mi", "sol" (astro), etc.
        if (match[0] !== match[0].toUpperCase()) {
            return match;
        }

        const sufijoLimpio = sufijo || "";
        // Retornamos el span con la nota normalizada en mayúsculas y el sufijo original
        return `<span class="chord" data-suffix="${sufijoLimpio}">${nota.toUpperCase()}${sufijoLimpio}</span>`;
    });

    generarBotones();
}

function generarBotones() {
    const box = document.getElementById('controles');
    escala.forEach((nota, index) => {
        let btn = document.createElement('button');
        btn.innerText = nota;
        btn.className = 'btn-tono' + (index === tonoActualIndex ? ' active' : '');
        btn.onclick = () => cambiarTonalidad(index);
        box.appendChild(btn);
    });
}

function cambiarTonalidad(nuevoTonoIndex) {
    let diferencia = nuevoTonoIndex - tonoActualIndex;
    if (diferencia === 0) return;

    const todosLosAcordes = document.querySelectorAll('.chord');
    todosLosAcordes.forEach(el => {
        // Obtenemos el sufijo guardado para no perder las minúsculas
        const sufijo = el.getAttribute('data-suffix');
        el.innerText = trasponer(el.innerText, diferencia, sufijo);
    });

    tonoActualIndex = nuevoTonoIndex;
    
    document.querySelectorAll('.btn-tono').forEach((b, i) => {
        b.className = 'btn-tono' + (i === tonoActualIndex ? ' active' : '');
    });
}

function trasponer(acordeTexto, pasos, sufijo) {
    // Extraer solo la nota base (eliminando el sufijo del texto actual)
    let notaOriginal = acordeTexto.replace(sufijo, "").toUpperCase();

    if (bemoles[notaOriginal]) notaOriginal = bemoles[notaOriginal];

    let idx = escala.indexOf(notaOriginal);
    if (idx === -1) return acordeTexto;

    let nuevoIdx = (idx + pasos) % 12;
    if (nuevoIdx < 0) nuevoIdx += 12;

    // Retornamos la nueva nota en MAYÚSCULAS + el sufijo original (m, 7, etc.)
    return escala[nuevoIdx] + sufijo;
}

function toggleAcordes() {
    const cancion = document.getElementById('cancion');
    const boton = document.getElementById('btn-ocultar');
    
    // Alternar la clase 'chords-hidden' en el contenedor de la canción
    cancion.classList.toggle('chords-hidden');
    
    // Cambiar el texto del botón según el estado
    if (cancion.classList.contains('chords-hidden')) {
        boton.innerText = "Mostrar Acordes";
        boton.style.background = "#28a745"; // Verde para resaltar que se pueden volver a mostrar
    } else {
        boton.innerText = "Ocultar Acordes";
        boton.style.background = "#6c757d"; // Volver al gris original
    }
}

window.onload = inicializar;