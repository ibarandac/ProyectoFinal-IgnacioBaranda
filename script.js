document.addEventListener("DOMContentLoaded", () => {
  const charactersList = document.getElementById("characters-list");
  const searchInput = document.getElementById("search");
  const userButton = document.getElementById("viewUserInfo");

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
        title: character.name,
        text: character.description,
        confirmButtonText: 'Cerrar',
        didOpen: () => {
          saveToLocalStorage(userName, character.name);
        }
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

  function getLocalStorageData() {
    const storedName = localStorage.getItem("userName");
    const storedCharacter = localStorage.getItem("favoriteCharacter");

    if (storedName && storedCharacter) {
      showAlert(storedName, storedCharacter, true);
    } else {
      requestUserInfo();
    }
  }

  function showAlert(name, character, returningUser) {
    let title = `¡Bienvenido ${name}!`;
    let message = `¡Aquí podrás encontrar tus personajes favoritos de la serie!`;

    if (returningUser) {
      title = `¡Bienvenido de vuelta ${name}!`;
      message = `Tu personaje favorito de Dragon Ball Z es ${character}.`;
    }

    Swal.fire({
      title,
      text: message,
      imageUrl: src="imagenes/Dragon_Ball_Z_Logo_C.png",
      imageWidth: 300,
      imageHeight: 125,
      confirmButtonText: "Entendido",
    });
  }

  function saveToLocalStorage(name, character) {
    localStorage.setItem("userName", name);
    localStorage.setItem("favoriteCharacter", character);
  }

  function requestUserInfo() {
    Swal.fire({
      imageUrl: src="imagenes/Dragon_Ball_Z_Logo_C.png",
      imageWidth: 300,
      imageHeight: 125,
      title: "Ingresa tu nombre y tu personaje favorito",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Nombre">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Personaje favorito">',
      focusConfirm: false,
      preConfirm: () => {
        const userName = Swal.getPopup().querySelector("#swal-input1").value;
        const favoriteCharacter = Swal.getPopup().querySelector("#swal-input2").value;
        if (!userName || !favoriteCharacter) {
          Swal.showValidationMessage("Por favor, completa ambos campos");
        }
        return { userName, favoriteCharacter };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { userName, favoriteCharacter } = result.value;
        saveToLocalStorage(userName, favoriteCharacter);
        showAlert(userName, favoriteCharacter);
      }
    });
  }

  userButton.addEventListener("click", () => {
    const storedName = localStorage.getItem("userName");
    const storedCharacter = localStorage.getItem("favoriteCharacter");

    if (storedName && storedCharacter) {
      showAlert(storedName, storedCharacter, true);
    } 
  });

  getLocalStorageData();
});
