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

async function fetchArtworks(searchTerm) {
   const artworks = await fetch(`https://api.artic.edu/api/v1/artworks?keyword=${searchTerm}`);
   const data = await artworks.json();
   console.log(data);
   artworksWrapper.innerHTML = data.data.map((artworks) => {
      return `<div class='images'>
      <img src="https://www.artic.edu/iiif/2/${artworks.image_id}/full/843,/0/default.jpg">
      <h2>${artworks.title}</h2>
      <h4>${artworks.artist_title}</h4>
      <h4>${artworks.artwork_type_title}</h4>
      <h4>${artworks.department_title}</h4>
      <h4>${artworks.date_display}</h4>
      <button>Learn More</button>
      </div>`;
   });
}


function onSearchChange(event) {
   console.log(event.target.value);
   fetchArtworks(event.target.value);
}