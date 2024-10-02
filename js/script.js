// Função para remover o blur da imagem e ocultar o ícone ao clicar
document.querySelectorAll('.veiculo').forEach(veiculo => {
    const img = veiculo.querySelector('img');
    const icon = veiculo.querySelector('.overlay i');

    veiculo.addEventListener('click', () => {
        img.classList.remove('blur-image'); // Remove o desfoque
        icon.style.display = 'none'; // Oculta o ícone
    });
});

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


// Carrossel
// Espera até que a página carregue completamente
document.addEventListener('DOMContentLoaded', function () {

    // Seleciona o ícone de seta para clique
    const arrowIcon = document.querySelector('.overlay i');
    const carrosselPrisma = document.getElementById('carrosselPrisma');

    // Adiciona um evento de clique no ícone de seta
    arrowIcon.addEventListener('click', function () {
        // Inicia o carrossel do Prisma após o clique
        var carouselInstance = new bootstrap.Carousel(carrosselPrisma);
        carouselInstance.cycle();

        // Remove o ícone da seta após o clique
        arrowIcon.style.display = 'none';

        // Remove o efeito blur de todas as imagens do carrossel
        const allImages = carrosselPrisma.querySelectorAll('img');
        allImages.forEach(image => {
            image.classList.remove('blur-image');
        });

        // Certifique-se de que o carrossel não re-adicione o blur nas transições
        carrosselPrisma.addEventListener('slide.bs.carousel', function () {
            allImages.forEach(image => {
                image.classList.remove('blur-image');
            });

            
        });
    });
});

// Mostrar apenas 4 veículos inicialmente
const veiculos = document.querySelectorAll('.veiculo');
veiculos.forEach((veiculo, index) => {
    if (index >= 4) {
        veiculo.classList.add('d-none');
    }
});

// Mostrar mais veículos
document.getElementById('btn-verMais').addEventListener('click', function() {
    const veiculosOcultos = document.querySelectorAll('.veiculo.d-none');
    veiculosOcultos.forEach(veiculo => {
        veiculo.classList.remove('d-none');
    });
    this.classList.add('d-none');
    document.getElementById('btn-fechar').classList.remove('d-none');
});

// Fechar a visualização dos veículos extras
document.getElementById('btn-fechar').addEventListener('click', function() {
    const veiculos = document.querySelectorAll('.veiculo');
    veiculos.forEach((veiculo, index) => {
        if (index >= 4) {
            veiculo.classList.add('d-none');
        }
    });
    document.getElementById('btn-verMais').classList.remove('d-none');
    this.classList.add('d-none');
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


