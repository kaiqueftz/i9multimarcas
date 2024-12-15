const express = require('express');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const supabaseUrl = ''; // Substitua pela URL do seu Supabase
const supabaseKey = ''; // Substitua pela chave do seu projeto Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuração do Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware para enviar imagens para o Supabase
async function uploadImageToSupabase(imageBuffer, fileName) {
    const { data, error } = await supabase.storage
        .from('imagens')
        .upload(fileName, imageBuffer, { upsert: true });
    if (error) throw error;
    return data;
}

app.use(express.json());

// Rota para criar um veículo
app.post('/veiculos', async (req, res) => {
    const { nome, marca, modelo, ano, cor, km, preco, opcionais, motor, cambio, whatsapp, imagens } = req.body;
    try {
        const { data, error } = await supabase
            .from('veiculos')
            .insert([{ nome, marca, modelo, ano, cor, km, preco, opcionais, motor, cambio, whatsapp, imagens }]);

        if (error) throw error;
        res.status(201).json({ message: 'Veículo criado com sucesso', data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rota para listar todos os veículos
app.get('/veiculos', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('veiculos')
            .select('*');

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rota para obter um veículo específico pelo ID
app.get('/veiculos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('veiculos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Rota para atualizar um veículo
app.put('/veiculos/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const { data, error } = await supabase
            .from('veiculos')
            .update(updates)
            .eq('id', id);

        if (error) throw error;
        res.status(200).json({ message: 'Veículo atualizado com sucesso', data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rota para deletar um veículo
app.delete('/veiculos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('veiculos')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.status(200).json({ message: 'Veículo deletado com sucesso', data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Inicializando o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
