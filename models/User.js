const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');


const User = sequelize.define(
    "users",
    {
        idUser: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
            trim: true,
        },

        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            trim: true,
            validate: {
                isEmail: {
                    args: true,
                    msg: "Email is invalid"
                }
            }
        },

        password: {
            type: DataTypes.TIME,
            allowNull: false,
            trim: true,
            validate: {
                len: {
                    args: [8, 100],
                    msg: "Le mot de passe doit comporter entre 8 et 100 caractères"
                },
                notContains: {
                    args: "password",
                    msg: "Password cannot contain the word password"
                }
            }
        },

        token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        freezeTableName: true,
    }
);


module.exports = User;