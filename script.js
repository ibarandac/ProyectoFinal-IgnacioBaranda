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
        icon: character.image,
        confirmButtonText: 'Cerrar'
        
      });
    });

    const evolutionsButton = document.createElement('button');
    evolutionsButton.textContent = 'Ver evoluciones';
    evolutionsButton.classList.add('more-info-btn2');

    evolutionsButton.addEventListener('click', () => {
      showEvolutions(character);
    });

    characterDiv.appendChild(characterImage);
    characterDiv.appendChild(characterName);
    characterDiv.appendChild(characterInfo);
    characterDiv.appendChild(moreInfoButton);
    characterDiv.appendChild(evolutionsButton);

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
  function showEvolutions(character) {
    if (character.transformations && character.transformations.length > 0) {
      let evolutionsText = 'Evoluciones:';
      character.transformations.forEach(evolution => {
        evolutionsText += `\n- ${transformations.name}`;
      });
      Swal.fire({
        title: `${character.name} - Evoluciones`,
        text: evolutionsText,
        icon: 'info',
        confirmButtonText: 'Cerrar'
      });
    } else {
      Swal.fire({
        title: `${character.name} - Evoluciones`,
        text: 'No hay información disponible sobre las evoluciones.',
        icon: 'info',
        confirmButtonText: 'Cerrar'
      });
    }
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