const escala = ["DO", "DO#", "RE", "RE#", "MI", "FA", "FA#", "SOL", "SOL#", "LA", "LA#", "SI"];
const bemoles = { "REB": "DO#", "MIB": "RE#", "SOLB": "FA#", "LAB": "SOL#", "SIB": "LA#" };

// Tono inicial (Ajusta este índice según cómo escribas la canción originalmente)
let tonoActualIndex = 7; // Empezamos en SOL

// Nueva Regex más inteligente:
// 1. Solo busca notas en mayúsculas o con la primera mayúscula (LA, La, DO, Do...)
// 2. Evita confundir artículos comunes si están en minúsculas.
const regexAcordes = /\b(DO#?|RE#?|MI#?|FA#?|SOL#?|LA#?|SI#?|DOB|REB|MIB|SOLB|LAB|SIB)(m|7|maj7|sus\d|add\d|dim|aug)?\b/g; 
// Quitamos la bandera 'i' (ignore case) para que sea sensible a mayúsculas

function inicializar() {
    const contenedor = document.getElementById('cancion');
    let lineas = contenedor.innerHTML.split('\n');
    let nuevoTexto = "";

    lineas.forEach(linea => {
        // Regla de Oro: En un cancionero, las líneas de acordes suelen tener 
        // muchos más espacios o una densidad menor de letras que las de texto.
        // Si la línea tiene muchas minúsculas y espacios normales, es probable que sea letra.
        
        // Aplicamos el reemplazo solo si la palabra coincide exactamente con el patrón de acorde
        // y no es un artículo "la" en minúscula rodeado de texto.
        let lineaProcesada = linea.replace(regexAcordes, (match, nota, sufijo) => {
            // Si el match es "la" (todo minúscula), lo ignoramos y devolvemos el original
            if (match === "la") return match;
            
            const sufijoLimpio = sufijo || "";
            return `<span class="chord" data-suffix="${sufijoLimpio}">${nota.toUpperCase()}${sufijoLimpio}</span>`;
        });
        
        nuevoTexto += lineaProcesada + '\n';
    });

    contenedor.innerHTML = nuevoTexto;
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