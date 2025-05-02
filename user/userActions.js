const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require('../prisma')
const jwtKey = process.env.JWT_KEY;


const userActions = {
  getUser: async (req, res) => {
    try{
      const userId = req.params.id;
      const connectedUser = await prisma.users.findUnique({
        where: {
            id: parseInt(userId),
        },
        select: {
            id: true,
            username: true,
            pseudo: true,
            email: true
        }
      });
      if (!connectedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(connectedUser);

  } catch (error) {
      console.error("Error retrieving the user:", error);
      return res.status(500).json({ error: "Server error", details: error.message });
  }
  },

  updateUser: async (req, res) => {
    //TODO: Compare connected user id found in token with the id trying to be updated
    try {
      // const userId = req.user.id;
      const profileId = req.params.id;
      const { username, email } = req.body;
      
      const userExists = await prisma.users.findUnique({
        where: { id: parseInt(profileId) }
      });
      
      if (!userExists) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const updatedUser = await prisma.users.update({
        where: {
          id: parseInt(profileId)
        },
        data: {
          username: username,
          email: email
        }
      });
      
      return res.status(200).json({ 
        message: "User successfully updated",
        user: updatedUser 
      });
    } catch (error) {
      console.error("Error updating the user:", error);
      return res.status(500).json({ error: "Server error", details: error.message });
    }
  },

  deleteUser: async (req, res) => {

  //TODO: Compare connected user id found in token with the id trying to be deleted
    try {
    // const userId = req.user.id;
    const profileId = req.params.id

    const userExists = await prisma.users.findUnique({
      where: { id: parseInt(profileId) }
    });

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const deleteUser = await prisma.users.delete({
      where: {
        id: parseInt(profileId)
      }
    });
    return res.status(200).json({
      message: "User successfully deleted"
    })
  } catch (error){
    console.error("Error deleting the user:", error);
      return res.status(500).json({ error: "Server error", details: error.message });
  }
}
}

module.exports = userActions