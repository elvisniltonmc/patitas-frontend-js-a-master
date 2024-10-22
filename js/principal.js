window.addEventListener('load', function() {
    // Enviamos mensaje
    const msgSuccess = document.getElementById('mensaje');

    // Obtenemos información del localStorage
    const result = JSON.parse(localStorage.getItem('result'));
    const numeroDocumento = localStorage.getItem('numerodocumento');
    const tipoDocumento = localStorage.getItem('tipodocumento');

    mostrarAlerta(result.nombreUsuario, msgSuccess);

    const btnCerrar = document.getElementById('btnCerrarSesion');
    const btnCerrarEF = document.getElementById('btnCerrarSesion2');

    btnCerrar.addEventListener('click', function() {
        cerrarSesion(result.correoUsuario, msgSuccess);
    });

    btnCerrarEF.addEventListener('click', function() {
        cerrarSesionEF(numeroDocumento, tipoDocumento, msgSuccess);
    });
});

function mostrarAlerta(mensaje, msg) {
    msg.innerHTML = mensaje;
    msg.style.display = 'block';
}

function ocultarAlerta(msg) {
    msg.innerHTML = '';
    msg.style.display = 'none';
}

async function cerrarSesion(email, msg) {
    mostrarAlerta("Cerrando sesión...", msg);
    const url = 'http://localhost:8082/login/close-async';
    const data = { email };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            mostrarAlerta('Error! Problema al cerrar sesión', msg);
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Respuesta del servidor', result);

        if (result.codigo === '00') {
            localStorage.removeItem('result');
            localStorage.removeItem('tipodocumento');
            localStorage.removeItem('numerodocumento');
            window.location.replace('index.html');
        } else {
            mostrarAlerta(result.mensaje, msg);
        }

    } catch (error) {
        console.error('Error: Problema en el servicio', error);
        mostrarAlerta('Error: Problema en el servicio', msg);
    }
}

async function cerrarSesionEF(tipoDocumento, numeroDocumento, msg) {
    mostrarAlerta("Cerrando sesión...", msg);
    const url = 'http://localhost:8082/login/close-ef';
    const data = { tipoDocumento, numeroDocumento };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            mostrarAlerta('Error! Problema al cerrar sesión', msg);
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Respuesta del servidor', result);

        if (result.codigo === '00') {
            localStorage.removeItem('result');
            localStorage.removeItem('tipodocumento');
            localStorage.removeItem('numerodocumento');
            window.location.replace('index.html');
        } else {
            console.error('Error: Problema en el servidor');
            mostrarAlerta("Error: Problema en el servidor", msg);
        }

    } catch (error) {
        console.error('Error: Problema en el servicio', error);
        mostrarAlerta('Error: Problema en el servicio', msg);
    }
}
