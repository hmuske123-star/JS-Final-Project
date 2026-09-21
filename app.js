/* Harvard Art Museums API Key:
   0705d3ec-7bc9-4cc0-bd62-23302fbd3f04
*/

function openMenu() {
  document.querySelector(".showMenu").classList.add("active");
  document.querySelector(".close-btn").classList.add("show");
}

function closeMenu() {
  document.querySelector(".showMenu").classList.remove("active");
  document.querySelector(".close-btn").classList.remove("show");
}

const artworksWrapper = document.querySelector(".artworks");

async function searchArtworks(query) {
  if (!artworksWrapper) {
    console.log(artworksWrapper);
    return;
  }

  const searchTerm = query.trim();

  if (!searchTerm) {
    artworksWrapper.innerHTML = "";
    return;
  }

  artworksWrapper.innerHTML =
    "<p class='search-status'>Loading artworks...</p>";

  try {
    const response = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${encodeURIComponent(searchTerm)}`,
    );
    if (!response.ok) {
      throw new Error("The search request failed.");
    }

    const data = await response.json();
    const objectIDs = (data.objectIDs || []).slice(0, 6);
    const objectResults = await Promise.allSettled(
      objectIDs.map((objectID) =>
        fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`,
        ),
      ),
    );
    const artworks = await Promise.all(
      objectResults
        .filter((result) => result.status === "fulfilled" && result.value.ok)
        .map((result) => result.value.json()),
    );

    if (!artworks.length) {
      artworksWrapper.innerHTML = `<p class='search-status'>No artworks found for "${escapeHtml(searchTerm)}".</p>`;
      return;
    }

    artworksWrapper.innerHTML = artworks
      .map(
        (artwork) => `
         <article class="artwork-card">
            <img src="${artwork.primaryImage || artwork.primaryImageSmall}" alt="${escapeHtml(artwork.title || "Untitled artwork")}" loading="lazy">
            <div class="artwork-card__details">
               <h2>${escapeHtml(artwork.title || "Untitled artwork")}</h2>
               <p>${escapeHtml(artwork.artistDisplayName || "Artist unknown")}</p>
               <p>${escapeHtml(artwork.objectDate || "Date unknown")}</p>
               <a href="${artwork.objectURL}" target="_blank" rel="noopener">View details</a>
            </div>
         </article>
      `,
      )
      .join("");
  } catch (error) {
    artworksWrapper.innerHTML =
      "<p class='search-status'>Unable to load artworks. Please try again.</p>";
    console.error(error);
  }
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character],
  );
}

function onSearchChange(event) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }

  // Determine the search input value for both form submit and input change
  let searchValue = '';
  const target = event && event.target;

  if (target && target.tagName === 'INPUT') {
    searchValue = target.value;
  } else if (event && event.currentTarget && event.currentTarget.querySelector) {
    const input = event.currentTarget.querySelector('input');
    searchValue = input ? input.value : '';
  } else {
    const input = document.querySelector('.input__wrapper input, .input__text');
    searchValue = input ? input.value : '';
  }

  const trimmed = String(searchValue || '').trim();
  if (!trimmed) return;

  // If we're not on the browse page, navigate there with the query param
  const path = window.location.pathname || '';
  const isBrowse = path.endsWith('/browse.html') || path.endsWith('browse.html');
  if (!isBrowse) {
    const params = new URLSearchParams();
    params.set('q', trimmed);
    // Use a relative path so navigation works both when served over HTTP and when opened via file://
    window.location.href = `browse.html?${params.toString()}`;
    return;
  }

  // On the browse page: populate the input and run the search
  const browseInput = document.querySelector('.input__wrapper input, .input__text');
  if (browseInput) browseInput.value = trimmed;
  searchArtworks(trimmed);
}

// On page load, if there's a `q` query param, populate the input and run the search
document.addEventListener('DOMContentLoaded', () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      const input = document.querySelector('.input__wrapper input, .input__text');
      if (input) input.value = q;
      // Small timeout to ensure other deferred scripts/readiness
      setTimeout(() => searchArtworks(q), 0);
    }
  } catch (e) {
    // ignore malformed URLSearchParams
  }
});

/* AIC API

async function fetchArtworks(searchTerm) {
   const artworks = await fetch(
  `https://api.artic.edu/api/v1/artworks/search?q=${searchTerm}&fields=id,title,artist_title,artwork_type_title,department_title,date_display,image_id`);
   const data = await artworks.json();
   console.log(data);
   console.log(data.data.map(artworks => artworks.image_id));
   artworksWrapper.innerHTML = data.data.map((artworks) => {
      return `<div class='images'>
      <img src="${data.config.iiif_url}/${artworks.image_id}/full/843,/0/default.jpg">
      <h2>${artworks.title}</h2>
      <h4>${artworks.artist_title}</h4>
      <h4>${artworks.artwork_type_title}</h4>
      <h4>${artworks.department_title}</h4>
      <h4>${artworks.date_display}</h4>
      <button>Learn More</button>
      </div>`;
   }).join('');
}*/