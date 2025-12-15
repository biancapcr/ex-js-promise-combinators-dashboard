// funzione asincrona che recupera i dati della dashboard
async function getDashboardData(query) {
  try {
    // chiamate fetch in parallelo
    // destinations: nome e paese
    // weathers: temperatura e descrizione meteo
    // airports: nome dell’aeroporto
    const destinationsFetch = fetch(
      `http://localhost:3333/destinations?search=${query}`
    ).then((res) => res.json());

    const weathersFetch = fetch(
      `http://localhost:3333/weathers?search=${query}`
    ).then((res) => res.json());

    const airportsFetch = fetch(
      `http://localhost:3333/airports?search=${query}`
    ).then((res) => res.json());

    // Promise.allSettled() → attende che tutte finiscano
    const results = await Promise.allSettled([
      destinationsFetch,
      weathersFetch,
      airportsFetch,
    ]);

    // map dei risultati: se "fulfilled", prendo .value; se "rejected", assegno []
    const [destinations, weathers, airports] = results.map((r, i) => {
      if (r.status === "fulfilled") {
        return r.value; // la chiamata è andata a buon fine
      } else {
        console.error(`Request ${i + 1} failed:`, r.reason);
        return []; // ritorna un array vuoto se la chiamata è fallita
      }
    });

    // primo elemento da ciascun array (se esiste)
    const destination = destinations[0] || {};
    const weather = weathers[0] || {};
    const airport = airports[0] || {};

    // oggetto finale con i dati aggregati
    const data = {
      city: destination.name || null,
      country: destination.country || null,
      temperature: weather.temperature || null,
      weather: weather.weather_description || null,
      airport: airport.name || null,
    };

    // restituzione dell’oggetto
    return data;
  } catch (error) {
    // cattura eventuali errori globali
    throw new Error("Unexpected error: " + error.message);
  }
}

// test
getDashboardData("london")
  .then((data) => {
    // stampa in console l'oggetto ricevuto
    console.log("Dashboard data:", data);

    // messaggio formattato
    let message = "";

    if (data.city && data.country)
      message += `${data.city} is in ${data.country}.\n`;

    if (data.temperature && data.weather)
      message += `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n`;

    if (data.airport) message += `The main airport is ${data.airport}.\n`;

    console.log(message || "No data available for this city.");
  })
  .catch((error) => console.error(error.message));
