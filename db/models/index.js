const Films = require('./films');
const Actors = require('./actors');
const FilmsActors = require('./filmsActors');

module.exports = (Sequelize, config) =>{
    const connection = new Sequelize(config.db, config.login, config.password, config.options);

    connection.authenticate().then(() => {
        console.log('Connection to database successful');
    }).catch((err) => {
        console.log('Unable to connect to database', err);
    });

    const films = Films(Sequelize, connection);
    const actors = Actors(Sequelize, connection);
    const filmsActors = FilmsActors(Sequelize, connection);

    actors.belongsToMany(films, {through: filmsActors});
    films.belongsToMany(actors, {through: filmsActors});

    return {
        Sequelize,
        connection,
        models: {
            films,
            actors,
            filmsActors
        }
    };
};