/**
 * Se ejecuta cuando cargue toda la página
 * En caso solo quieras que sea el DOM:
 * -> document.addEventListener('DOMContentLoaded', {})
 * O agregando el atributo "defer" cuando llamas el script
 */
window.addEventListener('load', function() {
    // Referenciar elementos de la página
    const tipoDocumento = document.getElementById('tipoDocumento');
    const numeroDocumento = document.getElementById('numeroDocumento');
    const password = document.getElementById('password');
    const btnIngresar = document.getElementById('btnIngresar');
    const msgError = document.getElementById('mensaje');

    // Implementar listener
    btnIngresar.addEventListener('click', function() {
        // Validar campos de entrada
        if (!tipoDocumento.value.trim() || !numeroDocumento.value.trim() || !password.value.trim()) {
            mostrarAlerta('Ingrese todos los datos necesarios', msgError);
            return;
        }
        
        ocultarAlerta(msgError);
        autenticar(tipoDocumento.value, numeroDocumento.value, password.value, msgError);
    });
});

function mostrarAlerta(mensaje, msgError) {
    msgError.innerHTML = mensaje;
    msgError.style.display = 'block';
}

function ocultarAlerta(msgError) {
    msgError.innerHTML = '';
    msgError.style.display = 'none';
}

async function autenticar(tipoDocumento, numeroDocumento, password, msgError) {
    const url = 'http://localhost:8082/login/autenticar-async';
    const data = {
        tipoDocumento: tipoDocumento,
        numeroDocumento: numeroDocumento,
        password: password
    };
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            mostrarAlerta('Error: Problema en la autenticación', msgError);
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Respuesta del servidor', result);

        if (result.codigo === '00') {
            localStorage.setItem('result', JSON.stringify(result));
            localStorage.setItem('tipodocumento', tipoDocumento);
            localStorage.setItem('numerodocumento', numeroDocumento);
            window.location.replace('principal.html');
        } else {
            mostrarAlerta(result.mensaje, msgError);
        }

    } catch (error) {
        console.error('Error: Problema en el servicio', error);
        mostrarAlerta('Error: Problema en el servicio', msgError);
    }
}
