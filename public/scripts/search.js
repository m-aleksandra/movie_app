const inputElement = document.getElementById('search-box');
const searchResultsElement = document.getElementById('search-results');

// if user types at least 1 character in a searchbox,
// we' re quering the database for titles that match the characters


inputElement.addEventListener('input', function(e) {
  const payload = e.target.value;
  if (payload.length > 0) {
    sendDataToServer(payload);
  } else {
    searchResultsElement.innerHTML = '';
  }
});

function sendDataToServer(payload) {
  fetch('/getResults', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payload })
  })
  .then(response => response.json())
  .then(data => {
    if (data.length > 0) {
      const rect = inputElement.getBoundingClientRect();
      searchResultsElement.style.left = rect.left + 'px';
      searchResultsElement.style.top = rect.bottom + 'px';
      searchResultsElement.style.width = '300px';
      
      searchResultsElement.innerHTML = generateResultsHTML(data);
    } else {
      searchResultsElement.innerHTML = '';
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// html with movie poster and title for each result
function generateResultsHTML(results) {
    let html = '<ul class="list-group">';
    results.forEach(result => {
        html += `<li class="list-group-item d-flex align-items-center">
                    <a href="/movie/${result.id}" style="text-decoration: none; color: inherit;">
                    <img src="${result.poster_path}" class="me-2" height="50" alt="Result Image">
                    ${result.title}
                    </a>
                </li>`;
    });
    html += '</ul>';
    return html;
}

