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

    // Promise.all() => esegue tutte le chiamate contemporaneamente
    // il risultato sarà un array con le risposte in ordine
    const [destinations, weathers, airports] = await Promise.all([
      destinationsFetch,
      weathersFetch,
      airportsFetch,
    ]);

    // primo elemento da ciascun array
    const destination = destinations[0];
    const weather = weathers[0];
    const airport = airports[0];

    // oggetto finale con i dati aggregati
    const data = {
      city: destination.name, // nome città
      country: destination.country, // paese
      temperature: weather.temperature, // temperatura attuale
      weather: weather.weather_description, // descrizione meteo
      airport: airport.name, // aeroporto principale
    };

    // restituzione dell’oggetto
    return data;
  } catch (error) {
    // cattura di qualsiasi errore
    throw new Error("Error fetching dashboard data: " + error.message);
  }
}

// test
getDashboardData("london")
  .then((data) => {
    // stampa in console l'oggetto ricevuto
    console.log("Dashboard data:", data);

    // messaggio formattato
    console.log(
      `${data.city} is in ${data.country}.\n` +
        `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n` +
        `The main airport is ${data.airport}.\n`
    );
  })
  .catch((error) => console.error(error.message));
