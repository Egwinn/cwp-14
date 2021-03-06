module.exports = (sequelize, connection) =>{
    return connection.define('films', {
        title: {
            type: sequelize.STRING(500),
            allowNull: false
        },
        rating: {
            type: sequelize.DOUBLE,
            allowNull: false,
            validate: {
                min: 0,
                max: 10,
                isFloat: true
            }
        },
        year: {
            type: sequelize.INTEGER,
            allowNull: false,
            validate: {
                goodRange(value){
                    if (value < 1912 || value > 2017)
                        throw new Error('Only even values are allowed!');
                }
            }
        },
        budget: {
            type: sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        gross: {
            type: sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        position: {
            type: sequelize.INTEGER,
            allowNull: false
        }
    },
    {
        scopes:{
            releaseDate2007:function (){
                const Sequelize = require('Sequelize');
                return {
                    where: {
                        year: {
                            [Sequelize.Op.gt]:2007
                        }
                    }
                }
            }
        }
    });
};

