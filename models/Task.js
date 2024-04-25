const { DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");
const User = require("./User.js"); // Importer le modèle User correctement

const Task = sequelize.define(
    "tasks",
    {
        idTask: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        completed: {
            type: DataTypes.BOOLEAN,
        },

        // Champ pour faire référence à qui appartient la tâche (relation entre tache et utilisateur)
        owner: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "idUser",
            },
        }
    },
    {
        freezeTableName: true,
    }
);

module.exports = Task;