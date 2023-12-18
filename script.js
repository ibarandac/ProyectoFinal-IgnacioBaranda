document.addEventListener("DOMContentLoaded", () => {
  const charactersList = document.getElementById("characters-list");
  const searchInput = document.getElementById("search");

  function createCharacterCard(character) {
    const characterDiv = document.createElement('div');
    characterDiv.classList.add('character');

    const characterImage = document.createElement('img');
    characterImage.src = character.image;
    characterImage.alt = character.name;

    const characterName = document.createElement('h2');
    characterName.textContent = character.name;

    const characterInfo = document.createElement('p');
    characterInfo.innerHTML = `<strong>Race:</strong> ${character.race}<br>
                               <strong>Ki:</strong> ${character.ki}<br>
                               <strong>Affiliation:</strong> ${character.affiliation}`;

    const moreInfoButton = document.createElement('button');
    moreInfoButton.textContent = 'Ver más información';
    moreInfoButton.classList.add('more-info-btn');

    moreInfoButton.addEventListener('click', () => {
      Swal.fire({
        customClass: {
          confirmButtonColor: 'swalBtnColor'
        },
        title: character.name,
        text: character.description,
        confirmButtonText: 'Cerrar'
        
      });
    });

  

    characterDiv.appendChild(characterImage);
    characterDiv.appendChild(characterName);
    characterDiv.appendChild(characterInfo);
    characterDiv.appendChild(moreInfoButton);

    charactersList.appendChild(characterDiv);
  }

  function fetchCharacters(url) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        data.items.forEach(character => {
          createCharacterCard(character);
        });
        if (data.links.next) {
          fetchCharacters(data.links.next);
        }
      })
      .catch(error => {
        console.error('Error fetching characters:', error);
      });
  }
  

  fetchCharacters('https://dragonball-api.com/api/characters');

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const characters = document.querySelectorAll('.character');

    characters.forEach(character => {
      const name = character.querySelector('h2').textContent.toLowerCase();
      const info = character.querySelector('p').textContent.toLowerCase();

      if (name.includes(searchTerm) || info.includes(searchTerm)) {
        character.style.display = 'block';
      } else {
        character.style.display = 'none';
      }
    });
  });
});

let timerInterval;
Swal.fire({
  title: "Bienvenidos al mundo de",
  imageUrl: src="imagenes/Dragon_Ball_Z_Logo_C.png",
  imageWidth: 300,
  imageHeight: 125,
  html: "Me cerraré en <b></b> millisegundos.",
  timer: 3000,
  timerProgressBar: true,
  didOpen: () => {
    Swal.showLoading();
    const timer = Swal.getPopup().querySelector("b");
    timerInterval = setInterval(() => {
      timer.textContent = `${Swal.getTimerLeft()}`;
    }, 100);
  },
  willClose: () => {
    clearInterval(timerInterval);
  }
}).then((result) => {
  /* Read more about handling dismissals below */
  if (result.dismiss === Swal.DismissReason.timer) {
    console.log("I was closed by the timer");
  }
});