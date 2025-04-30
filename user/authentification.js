const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require('../prisma')
const jwtKey = process.env.JWT_KEY;


const authentification = {
  signUp: async (req, res) => {
    try {
      const { username, pseudo, email, password } = req.body;
      
      if (!username || !pseudo || !email || !password) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
      }
      
      const existingUser = await prisma.users.findUnique({
        where: { email }
      });
      if (existingUser) {
        return res.status(409).json({ error: 'Un utilisateur avec cet email existe déjà' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.users.create({
        data: {
          username,
          pseudo,
          email,
          password: hashedPassword
        }
      });

      const { password: _, ...userWithoutPassword } = user;
      return res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return res.status(500).json({ error: 'Erreur lors de la création du compte' });
    }
  }
}
  module.exports = authentification