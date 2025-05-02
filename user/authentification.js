const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require('../prisma')
const jwtKey = process.env.JWT_KEY;


const authentification = {
  signUp: async (req, res) => {
    try {
      const { username, pseudo, email, password } = req.body;
      
      if (!username || !pseudo || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      
      const existingUser = await prisma.users.findUnique({
        where: { email }
      });

      //TODO: add message for the front
      if (existingUser) {
        return res.status(409).json({ error: 'This email is already linked to an account' });
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
        message: 'User created successfully',
        user: userWithoutPassword
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors de la création du compte' });
    }
  }
}
  module.exports = authentification