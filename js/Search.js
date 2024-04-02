
// Función para realizar la búsqueda
async function buscarEnFreeSound(query, page = 1, resultsPerPage = 40, apiKey  ) {
  try {
      // Construir la URL de la solicitud de búsqueda
      const url = `https://freesound.org/apiv2/search/text/?query=${query}&token=${apiKey}&page=${page}&page_size=${resultsPerPage}`;
    
    // Realizar la solicitud GET utilizando fetch()
    const response = await fetch(url);
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error('No se pudo realizar la solicitud');
    }
    
      // Convertir la respuesta a formato JSON
      const data = await response.json();
      
      const totalResults = data.count;
      //const totalPages = Math.ceil(totalResults / resultsPerPage);

      // Devolver los resultados de la búsqueda
      return { resultados: data.results };
      
  } catch (error) {
    console.error('Error al realizar la búsqueda:', error);
    return []; // Devolver un array vacío en caso de error
  }
}

// valdría la pena subir mis propios samples para no depender de la existencia o no de packetes 

module.exports = { buscarEnFreeSound }; 

