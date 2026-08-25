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
        const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}`);
        const data = await response.json();
        console.log(data);
    }


function onSearchChange(event) {
   console.log(event.target.value);
   searchArtworks(event.target.value);
}


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
