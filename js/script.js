// Função para remover o blur da imagem e ocultar o ícone ao clicar
document.querySelectorAll('.veiculo').forEach(veiculo => {
    const img = veiculo.querySelector('img');
    const icon = veiculo.querySelector('.overlay i');

    veiculo.addEventListener('click', () => {
        img.classList.remove('blur-image'); // Remove o desfoque
        icon.style.display = 'none'; // Oculta o ícone
    });
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
    const veiculos = document.querySelectorAll('.veiculo');

    veiculos.forEach(veiculo => {
        const veiculoMarca = veiculo.getAttribute('data-marca');
        const veiculoAno = veiculo.getAttribute('data-ano');
        const veiculoCor = veiculo.getAttribute('data-cor');

        const matches = (marca === 'Escolher...' || veiculoMarca === marca) &&
                        (ano === '' || veiculoAno === ano) &&
                        (cor === 'Escolher...' || veiculoCor === cor);

        veiculo.style.display = matches ? 'block' : 'none';
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
