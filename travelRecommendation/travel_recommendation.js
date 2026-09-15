document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultsGrid = document.getElementById('results-grid');

    let jsonData = null;

    // 1. Load your JSON file
    fetch('travelRecommendation/travel_recommendation_api.json')
        .then(res => res.json())
        .then(data => {
            jsonData = data;
            console.log("JSON Loaded:", data);
        });

    // 2. SEARCH BUTTON - Only shows result AFTER click (your last point)
    searchBtn.addEventListener('click', () => {
        // Requirement: convert to lowercase using toLowerCase()
        let keyword = searchInput.value.trim().toLowerCase();

        if (keyword === '') {
            alert("Please enter a keyword like beach, temple, country");
            return;
        }

        // 3. LOGIC TO ACCEPT ALL VARIATIONS - beach, beaches, Beach, BEACH
        // We normalize the keyword
        let searchType = "";

        if (keyword === "beach" || keyword === "beaches") {
            searchType = "beaches";
        } else if (keyword === "temple" || keyword === "temples") {
            searchType = "temples";
        } else if (keyword === "country" || keyword === "countries") {
            searchType = "countries";
        } else {
            // If user types country name directly like "japan", "australia", "brazil"
            searchType = "specific";
        }

        let results = [];

        // 4. LOGIC TO MATCH KEYWORDS
        if (searchType === "beaches") {
            results = jsonData.beaches;
        } else if (searchType === "temples") {
            results = jsonData.temples;
        } else if (searchType === "countries") {
            // Show all cities from all countries
            results = jsonData.countries.flatMap(c => c.cities);
        } else if (searchType === "specific") {
            // Search inside countries name
            jsonData.countries.forEach(country => {
                if (country.name.toLowerCase().includes(keyword)) {
                    results.push(...country.cities);
                }
            });
            // Also search inside city name
            jsonData.countries.forEach(country => {
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(keyword)) {
                        results.push(city);
                    }
                });
            });
            // Search in temples and beaches by name also
            jsonData.temples.forEach(t => {
                if (t.name.toLowerCase().includes(keyword)) results.push(t);
            });
            jsonData.beaches.forEach(b => {
                if (b.name.toLowerCase().includes(keyword)) results.push(b);
            });
        }

        displayResults(results, keyword);
    });

    // 5. CLEAR BUTTON - as per task
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        resultsGrid.innerHTML = '';
    });

    // 6. DISPLAY FUNCTION
    function displayResults(items, keyword) {
        resultsGrid.innerHTML = '';

        if (items.length === 0) {
            resultsGrid.innerHTML = `<p style="color:white; grid-column:1/-1; text-align:center;">No results found for "${keyword}"</p>`;
            return;
        }

        // Remove duplicates
        const uniqueResults = [...new Map(items.map(item => [item.name, item])).values()];

        uniqueResults.forEach(item => {
            const card = `
                <div class="result-card">
                    <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300x200'">
                    <div class="result-content">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                    </div>
                </div>
            `;
            resultsGrid.innerHTML += card;
        });
    }
});

// Load JSON first
let travelData = null;

fetch('travel_recommendation_api.json')
  .then(response => response.json())
  .then(json => {
    travelData = json;
  });

// MAIN SEARCH FUNCTION - This runs when you click Search button
function searchTravel() {
  const searchInput = document.getElementById('searchInput');
  const resultsContainer = document.getElementById('results-grid');
  
  // 1. Get keyword and convert to lowercase - handles BEACH, Beach, beach
  let keyword = searchInput.value.trim().toLowerCase();

  if (keyword === "") {
    alert("Please enter a keyword like beach, temple, or country");
    return;
  }

  // 2. Handle variations - beaches -> beach, temples -> temple etc.
  if (keyword === "beaches") keyword = "beach";
  if (keyword === "temples") keyword = "temple";
  if (keyword === "countries") keyword = "country";

  let searchResults = [];

  // 3. SEARCH LOGIC
  if (keyword === "beach") {
    searchResults = travelData.beaches;
  } 
  else if (keyword === "temple") {
    searchResults = travelData.temples;
  } 
  else if (keyword === "country") {
    // Show all countries cities
    searchResults = travelData.countries.flatMap(country => country.cities);
  } 
  else {
    // If user types "japan", "australia", "brazil", "india" etc.
    travelData.countries.forEach(country => {
      if (country.name.toLowerCase().includes(keyword)) {
        searchResults.push(...country.cities);
      }
    });
  }

  // 4. DISPLAY RESULTS - Only after Search click
  resultsContainer.innerHTML = ""; // Clear old results

  if (searchResults.length === 0) {
    resultsContainer.innerHTML = `<h3 style="color:white; text-align:center; grid-column:1/-1;">No results found for "${searchInput.value}"</h3>`;
    return;
  }

  searchResults.forEach(place => {
    resultsContainer.innerHTML += `
      <div class="result-card">
        <img src="${place.imageUrl}" alt="${place.name}">
        <div class="result-content">
          <h3>${place.name}</h3>
          <p>${place.description}</p>
        </div>
      </div>
    `;
  });
}

// 5. Connect Buttons to Function
document.getElementById('searchBtn').addEventListener('click', searchTravel);

document.getElementById('clearBtn').addEventListener('click', () => {
  document.getElementById('searchInput').value = "";
  document.getElementById('results-grid').innerHTML = "";
});
