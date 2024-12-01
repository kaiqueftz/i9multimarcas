document.getElementById("filtro-form").addEventListener("submit", function(event) {
    event.preventDefault();  // Evita o recarregamento da página
    // Seu código de filtro aqui (caso haja lógica de filtro)

    // Rola a página até a seção de veículos
    document.getElementById("veiculos").scrollIntoView({ behavior: "smooth" });
});

// Redefinir filtros e mostrar todos os veículos
document.getElementById('btn-redefinir').addEventListener('click', function() {
    document.getElementById('filtro-form').reset();
    const veiculos = document.querySelectorAll('.veiculo');
    veiculos.forEach(veiculo => {
        veiculo.style.display = 'block';
    });
});

// Filtrar veículos ao enviar o formulário
document.getElementById('filtro-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const marca = document.getElementById('marca').value;
    const ano = document.getElementById('ano').value;
    const cor = document.getElementById('cor').value;
    const modelo = document.getElementById('modelo').value;
    const veiculos = document.querySelectorAll('.veiculo');
    const precoMaximo = parseFloat(document.getElementById('preco').value.replace('.', '').replace(',', '.'));

    veiculos.forEach(veiculo => {
        const veiculoMarca = veiculo.getAttribute('data-marca');
        const veiculoAno = veiculo.getAttribute('data-ano');
        const veiculoCor = veiculo.getAttribute('data-cor');
        const veiculoModelo = veiculo.getAttribute('data-modelo');
        const veiculoPreco = parseFloat(veiculo.getAttribute('data-preco').replace('.', '').replace(',', '.'));

        const matches = (marca === 'Escolher...' || veiculoMarca === marca) &&
                        (ano === '' || veiculoAno === ano) &&
                        (cor === 'Escolher...' || veiculoCor === cor) &&
                        (modelo === 'Escolher...' || veiculoModelo === modelo) &&
                        (isNaN(precoMaximo) || veiculoPreco <= precoMaximo);

        veiculo.style.display = matches ? 'block' : 'none';
    });
});

//Filtro escolhido fica visível na tela
document.addEventListener('DOMContentLoaded', () => {
    const selectedFiltersList = document.getElementById('selected-filters-list');
    const filters = ['marca', 'ano', 'modelo', 'cor', 'preco'];

    // Função para atualizar os filtros selecionados
    function updateSelectedFilters() {
        selectedFiltersList.innerHTML = ''; // Limpa a lista atual

        filters.forEach(filterId => {
            const filterElement = document.getElementById(filterId);
            let value = filterElement.value;

            if (value && value !== 'Escolher...' && value !== '') {
                const filterBadge = document.createElement('span');
                filterBadge.className = 'badge bg-primary position-relative';
                filterBadge.textContent = `${filterElement.previousElementSibling.textContent}: ${value}`;
                
                // Adicionar botão para remover filtro
                const removeBtn = document.createElement('button');
                removeBtn.className = 'btn-close btn-close-white position-absolute top-0 end-0 ms-2';
                removeBtn.style.fontSize = '0.8em';
                removeBtn.addEventListener('click', () => {
                    if (filterElement.tagName === 'SELECT') filterElement.selectedIndex = 0;
                    else filterElement.value = '';
                    updateSelectedFilters();
                });

                filterBadge.appendChild(removeBtn);
                selectedFiltersList.appendChild(filterBadge);
            }
        });
    }

    // Adiciona eventos para atualizar ao mudar qualquer filtro
    filters.forEach(filterId => {
        document.getElementById(filterId).addEventListener('change', updateSelectedFilters);
    });

    // Botão de redefinir filtros
    document.getElementById('btn-redefinir').addEventListener('click', () => {
        filters.forEach(filterId => {
            const filterElement = document.getElementById(filterId);
            if (filterElement.tagName === 'SELECT') filterElement.selectedIndex = 0;
            else filterElement.value = '';
        });
        updateSelectedFilters();
    });
});



document.addEventListener("DOMContentLoaded", function () {
    var navbarCollapse = document.querySelector('.navbar-collapse');
    var navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
    });
});


//Voltar para o topo com o clique
document.addEventListener('DOMContentLoaded', function () {
    // Função para rolar suavemente para o topo da página
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Adiciona o evento de clique na logo
    const logo = document.getElementById('logo-navbar');
    logo.addEventListener('click', scrollToTop);

    // Adiciona o evento de clique no nome da marca
    const brandLink = document.getElementById('brand-link');
    brandLink.addEventListener('click', scrollToTop);
});

//ADICIONAR CARROS PELO JSON
document.addEventListener("DOMContentLoaded", function () {
  // Carrega os dados dos veículos do JSON
  fetch('js/carros.json')
      .then(response => response.json())
      .then(data => {
          const listaCarros = document.getElementById('lista-carros');
          let htmlContent = '';

          data.forEach((carro, index) => {
              const carrosselId = `carrossel${index}`; // ID único para cada carrossel
              htmlContent += `
                  <div class="col-lg-3 col-md-6 mb-4 veiculo" data-nome="${carro.nome}" data-marca="${carro.marca}" data-modelo="${carro.modelo}" data-ano="${carro.anoFiltro}" data-cor="${carro.cor}" data-km="${carro.km}"data-preco="${carro.precoFiltro}">
                      <div class="card h-100">
                          <div class="image-container">
                              <div id="${carrosselId}" class="carousel slide" data-bs-ride="carousel">
                                  <div class="carousel-inner">
                                      ${carro.imagens.map((img, imgIndex) => `
                                          <div class="carousel-item ${imgIndex === 0 ? 'active' : ''}">
                                              <img src="${img}" class="d-block w-100 lazy-image blur-image" alt="Imagem ${imgIndex + 1}">
                                          </div>
                                      `).join('')}
                                  </div>
                                  <button class="carousel-control-prev" type="button" data-bs-target="#${carrosselId}" data-bs-slide="prev">
                                      <i class="bi bi-caret-left-fill" style="font-size: 2rem; color: white;"></i>
                                  </button>
                                  <button class="carousel-control-next" type="button" data-bs-target="#${carrosselId}" data-bs-slide="next">
                                      <i class="bi bi-caret-right-fill" style="font-size: 2rem; color: white;"></i>
                                  </button>
                              </div>
                          </div>
                          <div class="card-body">
                              <h5 class="card-title"><b>${carro.nome}</b></h5>
                              <p class="card-text">
                                  <li class="oculto"><b>Ano:</b> ${carro.anoFiltro}</li>
                                  <li><b>Ano:</b> ${carro.ano}</li>
                                  <li><b>Marca:</b> ${carro.marca}</li>
                                  <li><b>Cor:</b> ${carro.cor}</li>
                                  <li><b>Km:</b> ${carro.km}</li>
                                  <li><b>Opcionais:</b> ${carro.opcionais}</li>
                                  <li><b>Motor:</b> ${carro.motor}</li>
                                  <li><b>Câmbio:</b> ${carro.cambio}</li>
                              </p>
                              <div class="price">
                                  <h5 class="card-price">${carro.preco}</h5>
                                   <li class="oculto"><b>Ano:</b> ${carro.precoFiltro}</li>
                              </div>
                          </div>
                          <div class="card-footer d-flex justify-content-center">
                              <a class="btn btn-success" href="https://api.whatsapp.com/send?phone=${carro.whatsapp}&text=Ol%C3%A1,%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20os%20ve%C3%ADculos%20dispon%C3%ADveis.%20Encontrei%20voc%C3%AAs%20pelo%20site%20da%20i9%20Multimarcas!">Consultar um Vendedor</a>
                          </div>
                      </div>
                  </div>
              `;
          });
          listaCarros.innerHTML = htmlContent;

          // Adiciona o efeito de blur nas imagens
          document.querySelectorAll(".lazy-image").forEach(image => {
              image.addEventListener("load", () => {
                  image.classList.remove("blur-image"); // Remove o blur quando a imagem está carregada
              });
          });
      })
      .catch(error => console.error('Erro ao carregar os dados dos carros:', error));

  // Filtros
  document.getElementById("filtro-form").addEventListener("submit", function(event) {
      event.preventDefault();  // Evita o recarregamento da página
      
      const marca = document.getElementById('marca').value;
      const ano = document.getElementById('ano').value;
      const cor = document.getElementById('cor').value;
      const modelo = document.getElementById('modelo').value;
      const precoMaximo = parseFloat(document.getElementById('preco').value.replace('.', '').replace(',', '.'));

      document.querySelectorAll('.veiculo').forEach(veiculo => {
          const veiculoMarca = veiculo.getAttribute('data-marca');
          const veiculoAno = veiculo.getAttribute('data-ano');
          const veiculoCor = veiculo.getAttribute('data-cor');
          const veiculoModelo = veiculo.getAttribute('data-modelo');
          const veiculoPreco = parseFloat(veiculo.getAttribute('data-preco').replace('.', '').replace(',', '.'));

          const matches = (marca === 'Escolher...' || veiculoMarca === marca) &&
                          (ano === '' || veiculoAno === ano) &&
                          (cor === 'Escolher...' || veiculoCor === cor) &&
                          (modelo === 'Escolher...' || veiculoModelo === modelo) &&
                          (isNaN(precoMaximo) || veiculoPreco <= precoMaximo);

          veiculo.style.display = matches ? 'block' : 'none';
      });
      
      // Rola a página até a seção de veículos
      document.getElementById("veiculos").scrollIntoView({ behavior: "smooth" });
  });

  // Redefinir filtros
  document.getElementById('btn-redefinir').addEventListener('click', function() {
      document.getElementById('filtro-form').reset();
      document.querySelectorAll('.veiculo').forEach(veiculo => {
          veiculo.style.display = 'block';
      });
  });
});

  
  
  
  
