const readline = require('readline');
const axios = require('axios');

// Utilizamos la api recomendad en la letra
// https://app.freecurrencyapi.com/
// utilizar aca la api key correspondiente
// Utilizo el ide WebStorm
const API_KEY = 'fca_live_JQGhqi5Tdmx5BvjKg3PljP63G2mn057twGQcxzCp';
const API_URL = `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}`;

let exchangeRates = {};
let conversionHistory = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function fetchExchangeRates() {
    try {
        const response = await axios.get(API_URL);
        if (response.data && response.data.data) {
            exchangeRates = response.data.data;
            console.log("Los tipos de cambio se cargaron correctamente.");
            console.log(exchangeRates); // Mostrar las tasas de cambio obtenidas para depuración
        } else {
            console.error("Formato invalido en la respuesta", response.data);
        }
    } catch (error) {
        console.error("Error fetching . Asegúrese de que la clave API sea correcta y que el servicio esté disponible.", error);
    }
}

function mostrarMonedas() {
    console.log("Monedas Disponibles:");
    for (let currency in exchangeRates) {
        console.log(currency);
    }
}

function mostrarTipoCambio() {
    if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
        console.log("Tipos de cambio no cargados.");
        return;
    }
    console.log("Monedas y su tipo de Cambio:");
    for (let currency in exchangeRates) {
        console.log(`${currency}: ${exchangeRates[currency]}`); // Accediendo directamente a los valores de las tasas de cambio
    }
}

function convertirMonedas(cantidad, monedaDesde, monedaHacia) {
    if (exchangeRates[monedaDesde] && exchangeRates[monedaHacia]) {
        let tasa = exchangeRates[monedaHacia] / exchangeRates[monedaDesde];
        return cantidad * tasa;
    } else {
        console.log("Códigos de moneda no válidos.");
        return null;
    }
}

function showMenu() {
    console.log("\nMenu:");
    console.log("1. Lista de Monedas");
    console.log("2. Mostrar tipo de cambio");
    console.log("3. Convertir Monedas");
    console.log("4. Mostrar Historico");
    console.log("5. Salir");
    rl.question("Elegir una opcion: ", manejarMenu);
}

function manejarMenu(choice) {
    switch (choice) {
        case '1':
            mostrarMonedas();
            break;
        case '2':
            mostrarTipoCambio();
            break;
        case '3':
            rl.question("Ingrese codigo moneda desde: ", monedaDesde => {
                rl.question("Ingrese codigo moneda hacia: ", monedaHacia => {
                    rl.question("Cantidad a cambiar: ", cantidad => {
                        cantidad = parseFloat(cantidad);
                        let resultado = convertirMonedas(cantidad, monedaDesde.toUpperCase(), monedaHacia.toUpperCase());
                        if (resultado) {
                            console.log(`${cantidad} ${monedaDesde.toUpperCase()} son ${resultado.toFixed(2)} ${monedaHacia.toUpperCase()}`);
                            conversionHistory.push(`${cantidad} ${monedaDesde.toUpperCase()} -> ${resultado.toFixed(2)} ${monedaHacia.toUpperCase()}`);
                        }
                        showMenu();
                    });
                });
            });
            return;
        case '4':
            console.log("Historico de Conversion:");
            conversionHistory.forEach(record => console.log(record));
            break;
        case '5':
            console.log("Saliendo del programa");
            rl.close();
            return;
        default:
            console.log("Opcion no valida, ingrese de nuevo.");
    }
    showMenu();
}

async function main() {
    await fetchExchangeRates();
    showMenu();
}

main();
