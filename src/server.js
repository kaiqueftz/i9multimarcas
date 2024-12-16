require('dotenv').config();  // Carrega as variáveis do .env

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const supabaseUrl = process.env.SUPABASE_URL; // Substitua pela URL do seu Supabase
const supabaseKey = process.env.SUPABASE_KEY; // Substitua pela chave do seu projeto Supabase
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

app.use(cors());
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

app.post('/registro', async (req, res) => {
    const { user, senha } = req.body;

    console.log('Dados recebidos:', { user, senha }); // Adiciona log para verificar os dados recebidos

    try {
        // Hash da senha com bcrypt
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Inserir o novo usuário no Supabase
        const { data, error } = await supabase
            .from('usuarios')
            .insert([{ user, senha: hashedPassword }]);

        if (error) {
            console.error('Erro ao registrar o usuário:', error); // Log do erro ao inserir
            return res.status(400).json({ error: 'Erro ao registrar o usuário' });
        }

        res.status(201).json({ message: 'Usuário registrado com sucesso', data });
    } catch (err) {
        console.error('Erro no servidor:', err); // Log de erro geral
        res.status(500).json({ error: 'Erro ao registrar o usuário' });
    }
});

// Rota de Login
app.post('/login', async (req, res) => {
    const { user, senha } = req.body;

    try {
        // Buscar o usuário pelo nome
        const { data: usuario, error } = await supabase
            .from('usuarios')
            .select('id, senha')
            .eq('user', user)
            .single();

        if (error || !usuario) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos' });
        }

        // Comparar a senha fornecida com a senha armazenada
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos' });
        }

        // Login bem-sucedido
        res.status(200).json({ message: 'Login bem-sucedido', id: usuario.id });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Inicializar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

