
//Tables Function


document.addEventListener('DOMContentLoaded', () => {
    // Select all tables with the class `dataTable`
    const tables = document.querySelectorAll('.dataTable');

    tables.forEach(table => {
        const tableBody = table.querySelector('tbody');
        const filterCheckboxes = document.querySelectorAll('.tag-filter');
        const dataFilePath = table.getAttribute('data-file'); // Get the file path from the table's data-file attribute

        async function fetchData(file) {
            try {
                const response = await fetch(file);
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                const data = await response.json();
                renderTable(data);
                return data;
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        }

        function renderTable(data) {
            tableBody.innerHTML = '';
            data.forEach(item => {
                const row = document.createElement('tr');
                row.classList.add('hidden'); // Hide all rows by default
                row.dataset.tags = item.tags; // Store tags in dataset
                row.innerHTML = `
                    <td>
                        <a href="${item.link}" target="_blank" rel="noopener noreferrer">
                            <img src="${item.img}" alt="${item.name}" width="50">
                        </a>
                    </td>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>${item.tags}</td>
                    <td>${item.rating}</td>
                `;
                tableBody.appendChild(row);
            });
            applyFilters(); // Apply filters after rendering the table
        }

        function applyFilters() {
            const selectedTags = Array.from(filterCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.value);

            tableBody.querySelectorAll('tr').forEach(row => {
                const rowTags = row.dataset.tags.split(', ').map(tag => tag.trim());
                const isVisible = selectedTags.length === 0 || selectedTags.some(tag => rowTags.includes(tag));
                row.classList.toggle('hidden', !isVisible);
            });
        }

        function setupFilters() {
            filterCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', applyFilters);
            });
        }

        let isAscendingName = true;
        let isAscendingRating = true;

        function sortTable(data, columnIndex) {
            let sortedData;

            if (columnIndex === 1) {
                // Sort by Name
                sortedData = [...data].sort((a, b) => {
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();
                    if (nameA < nameB) return isAscendingName ? -1 : 1;
                    if (nameA > nameB) return isAscendingName ? 1 : -1;
                    return 0;
                });
                isAscendingName = !isAscendingName;
            } else if (columnIndex === 4) {
                // Sort by Rating
                sortedData = [...data].sort((a, b) => (isAscendingRating ? a.rating - b.rating : b.rating - a.rating));
                isAscendingRating = !isAscendingRating;
            }

            renderTable(sortedData);
        }

        fetchData(dataFilePath).then(data => {
            if (data) {
                // Attach sortTable function to specific headers
                const nameHeader = table.querySelector('th:nth-child(2)');
                const ratingHeader = table.querySelector('th:nth-child(5)');

                nameHeader.addEventListener('click', () => sortTable(data, 1));
                ratingHeader.addEventListener('click', () => sortTable(data, 4));
            }
            setupFilters(); // Set up filter event listeners after data is loaded
        });
    });
});







//Gallery Function

// Function to fetch JSON data and generate HTML
async function generateContent() {
  try {
      // Get all gallery containers with the class 'gallery'
      const containers = document.querySelectorAll('.gallery');

      // Process each container
      for (const container of containers) {
          // Get the JSON file path from the data-json attribute
          const jsonFile = container.getAttribute('data-json');

          if (!jsonFile) {
              console.warn('No JSON file specified in data-json attribute for one of the gallery containers');
              continue;
          }

          // Fetch the JSON data
          const response = await fetch(jsonFile);
          if (!response.ok) {
              throw new Error(`Network response was not ok for ${jsonFile}`);
          }
          const data = await response.json();

          // Generate HTML for each entry in the JSON file
          data.forEach(entry => {
              // Create a new div element
              const div = document.createElement('div');

              // Add the class specified in the JSON to the div
              if (entry.divClass) {
                  entry.divClass.split(' ').forEach(cls => div.classList.add(cls));
              }

              // Create an anchor element
              const anchor = document.createElement('a');
              anchor.href = entry.link;
              anchor.target = '_blank'; // Open link in a new tab
              anchor.rel = 'noopener noreferrer'; // Security attributes

              // Create an image element
              const img = document.createElement('img');
              img.src = entry.img;
              img.alt = entry.text || 'Image'; // Alt text for the image
              
              // Add multiple classes to the image if provided
              if (entry.imgClass) {
                  entry.imgClass.split(' ').forEach(cls => img.classList.add(cls));
              }

              // Append the image to the anchor
              anchor.appendChild(img);

              // Append the anchor to the div
              div.appendChild(anchor);

              // Create a paragraph element if 'text' is present
              if (entry.text) {
                  const paragraph = document.createElement('p');
                  paragraph.textContent = entry.text;

                  // Append the paragraph to the div
                  div.appendChild(paragraph);
              }

              // Append the div to the container
              container.appendChild(div);
          });
      }
  } catch (error) {
      console.error('Error fetching or processing JSON data:', error);
  }
}

// Call the function to generate content after the DOM has loaded
document.addEventListener('DOMContentLoaded', generateContent);
