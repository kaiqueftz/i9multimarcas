// Importa o cliente do Supabase via CDN
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Inicialize o cliente Supabase
const supabaseUrl = 'https://xxspvvwnzobhewonxkmi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4c3B2dnduem9iaGV3b254a21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3NzA1NzQsImV4cCI6MjA0NTM0NjU3NH0.7p4lG4c3R6YJvMex9NN03bFK1q1uuU63MELd0ggH884';
const supabase = createClient(supabaseUrl, supabaseKey);

const uploadForm = document.getElementById('uploadForm');
const imageInput = document.getElementById('imageInput');
const statusMessage = document.getElementById('status');
const imageUrlContainer = document.getElementById('imageUrlContainer');

// Recupera o ID do veículo armazenado no localStorage
const veiculoId = parseInt(localStorage.getItem('veiculoId'), 10);

uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita o envio tradicional do formulário

    if (!veiculoId) {
        alert("Veículo não encontrado. ID inválido.");
        return;
    }

    const file = imageInput.files[0];
    if (!file) {
        alert("Por favor, selecione uma imagem para enviar.");
        return;
    }

    statusMessage.textContent = "Fazendo upload da imagem...";

    const filePath = `veiculos/${veiculoId}_${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
        .from('imagens') // Nome do bucket
        .upload(filePath, file);

    if (error) {
        console.error("Erro ao fazer upload da imagem:", error.message);
        statusMessage.textContent = "Erro ao enviar imagem.";
        return;
    }

    // Gera a URL pública da imagem
    const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from('imagens')
        .getPublicUrl(filePath);

    if (publicUrlError) {
        console.error("Erro ao gerar URL pública:", publicUrlError.message);
        statusMessage.textContent = "Erro ao gerar URL pública.";
        return;
    }

    const publicUrl = publicUrlData.publicUrl;

    // Atualiza a tabela do veículo com a URL da imagem
    const { error: updateError } = await supabase
        .from('veiculos')
        .update({ imagens: publicUrl }) // Armazena a URL pública na coluna "imagens"
        .eq('id', veiculoId);

    if (updateError) {
        console.error("Erro ao atualizar o registro do veículo:", updateError.message);
        statusMessage.textContent = "Erro ao atualizar o veículo.";
        return;
    }

    statusMessage.textContent = "Imagem carregada e registro atualizado com sucesso!";
    imageUrlContainer.innerHTML = `
    `;
});
