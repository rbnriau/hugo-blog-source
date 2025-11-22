// Espera a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
  // Carga el índice de búsqueda generado por Hugo
  fetch('/index.json')
    .then(response => response.json())
    .then(data => {
      // Crea el índice con Lunr.js
      const idx = lunr(function() {
        this.ref('permalink');
        this.field('title');
        this.field('content');

        data.forEach(function(item) {
          this.add(item);
        }, this);
      });

      // Función para realizar la búsqueda
      function search() {
        const query = document.getElementById('searchInput').value;
        const results = idx.search(query);
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = '';

        if (results.length === 0) {
          resultsContainer.innerHTML = '<li>No se encontraron resultados.</li>';
          return;
        }

        results.forEach(function(result) {
          const item = data.find(item => item.permalink === result.ref);
          if (item) {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${item.permalink}">${item.title}</a>`;
            resultsContainer.appendChild(li);
          }
        });
      }

      // Asigna el evento de búsqueda al campo de entrada
      document.getElementById('searchInput').addEventListener('input', search);
    })
    .catch(error => console.error('Error cargando el índice de búsqueda:', error));
});
