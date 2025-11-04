const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('./models/Usuario'); // modelo
const Usuario = mongoose.model('usuarios');

// Conecta diretamente no banco "lanchonete"
mongoose.connect('mongodb://localhost:27017/lanchonete', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  // Remove duplicados antes de criar
  await Usuario.deleteMany({ nomeUsuario: 'admin' });

  // Cria o admin
  const hash = await bcrypt.hash('123456', 10);
  const novo = new Usuario({
    nome: 'Administrador',
    email: 'admin@lanchonete.com',
    admin: 1,
    nomeUsuario: 'admin',
    senha: hash
  });

  await novo.save();
  console.log('Usuário admin criado com sucesso!');

  mongoose.connection.close();
}).catch(err => console.log(err));