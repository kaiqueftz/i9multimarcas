// Importa o cliente do Supabase via CDN
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Inicialize o cliente Supabase
const supabaseUrl = 'https://xxspvvwnzobhewonxkmi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4c3B2dnduem9iaGV3b254a21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3NzA1NzQsImV4cCI6MjA0NTM0NjU3NH0.7p4lG4c3R6YJvMex9NN03bFK1q1uuU63MELd0ggH884';
const supabase = createClient(supabaseUrl, supabaseKey);

const inputFile = document.getElementById("imagens");
const imagePreview = document.getElementById("imagePreview");
const form = document.getElementById("formCadastroVeiculo");

inputFile.addEventListener("change", function (event) {
    const files = event.target.files;
    imagePreview.innerHTML = ""; // Limpa a visualização atual

    // Exibe as imagens selecionadas
    Array.from(files).forEach((file, index) => {
        if (index < 3) {  // Limite de 3 imagens
            const reader = new FileReader();
            reader.onload = function (e) {
                const imgElement = document.createElement("img");
                imgElement.src = e.target.result;

                const previewItem = document.createElement("div");
                previewItem.classList.add("preview-item");

                const removeBtn = document.createElement("button");
                removeBtn.classList.add("remove-btn");
                removeBtn.innerHTML = "X";
                removeBtn.addEventListener("click", function () {
                    previewItem.remove();  // Remove a imagem ao clicar no "X"
                });

                previewItem.appendChild(imgElement);
                previewItem.appendChild(removeBtn);
                imagePreview.appendChild(previewItem);
            };

            reader.readAsDataURL(file);  // Lê a imagem como URL
        }
    });
});

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Previne o envio padrão

    const formData = new FormData(form);
    const imagens = inputFile.files;

    // Validação de campos numéricos
    const quilometragem = formData.get("km");
    const preco = formData.get("preco");

    if (isNaN(quilometragem) || isNaN(preco)) {
        alert("Quilometragem e preço devem ser números válidos!");
        return;
    }

    const quilometragemInt = parseInt(quilometragem, 10);
    const precoFloat = parseFloat(preco);

    // Dados do veículo
    const veiculoData = {
        nome: formData.get("nome"),
        marca: formData.get("marca"),
        modelo: formData.get("modelo"),
        ano: formData.get("ano"),
        cor: formData.get("cor"),
        quilometragem: quilometragem,
        preco: precoFloat,
        opcionais: formData.get("opcionais"),
        motor: formData.get("motor"),
        cambio: formData.get("cambio"),
        whatsapp: formData.get("whatsapp"),
    };

    try {
        // Inserir o veículo no banco de dados
        const { data: veiculoInserido, error: erroInsercao } = await supabase
            .from('veiculos')
            .insert(veiculoData)
            .select(); // Retorna os dados inseridos

        if (erroInsercao) {
            console.error("Erro ao salvar veículo:", erroInsercao.message);
            alert("Erro ao cadastrar veículo!");
            return;
        }

        // Obter o ID do veículo inserido
        const veiculoId = veiculoInserido[0].id;

        // Salvar o ID do veículo no localStorage
        localStorage.setItem("veiculoId", veiculoId);
        console.log("ID do veículo salvo no localStorage:", veiculoId);

        // Upload das imagens e atualização com URLs públicas
        const imageUrls = [];
        for (let i = 0; i < imagens.length && i < 3; i++) {
            const file = imagens[i];

            // Normalizar o nome do arquivo
            const fileName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-zA-Z0-9.\-_]/g, "_");

            const filePath = `veiculos/${Date.now()}_${fileName}`;

            const { data: uploadData, error: erroUpload } = await supabase.storage
                .from('imagens')
                .upload(filePath, file);

            if (erroUpload) {
                console.error("Erro ao fazer upload da imagem:", erroUpload.message);
                alert("Erro ao fazer upload de imagens!");
                return;
            }

            const publicUrl = supabase.storage.from('imagens').getPublicUrl(uploadData.path).publicURL;
            imageUrls.push(publicUrl);
        }

        // Atualizar o veículo com as URLs das imagens
        const { error: erroAtualizacao } = await supabase
            .from('veiculos')
            .update({ imagens: imageUrls })
            .eq('id', veiculoId);

        if (erroAtualizacao) {
            console.error("Erro ao atualizar imagens do veículo:", erroAtualizacao.message);
            alert("Erro ao associar imagens ao veículo!");
            return;
        }

        // Buscar detalhes do veículo do backend
        const response = await fetch(`http://localhost:3000/veiculos/${veiculoId}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar detalhes do veículo!");
        }

        const veiculoDetalhes = await response.json();
        console.log("Detalhes do veículo:", veiculoDetalhes);

        alert("Veículo cadastrado com sucesso!");
        form.reset();
        imagePreview.innerHTML = ""; // Limpa a pré-visualização

        // Redirecionar para a página de upload ou detalhes
        window.location.href = `../upload.html?id=${veiculoId}`;
    } catch (error) {
        console.error("Erro geral:", error.message);
        alert("Erro ao processar o cadastro do veículo!");
    }
});



