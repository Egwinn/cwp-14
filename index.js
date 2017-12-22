const Sequelize = require('Sequelize');
const films = require('./db/content/films.json');
const actors = require('./db/content/actors.json');

const config = require('./db/config/config.json');

const db = require('./db/models')(Sequelize, config);

WorkWork();

async function WorkWork() {
    await db.connection.sync({force: true});
    // task01-1
    // await db.models.films.create({
    //     title: "TEST",
    //     rating: -10,
    //     year: 1800,
    //     budget: -100,
    //     gross: 0,
    //     poster: "yep"
    // });
    // task01-2
    await db.models.films.bulkCreate(films.slice(0, 5));
    // task01-3
    await db.models.actors.bulkCreate(actors.slice(0, 3));
    await db.models.filmsActors.bulkCreate([
        {actorId: 1, filmId: 346},
        {actorId: 2, filmId: 435},
        {actorId: 3, filmId: 435},
        {actorId: 1, filmId: 435},
        {actorId: 2, filmId: 448},
        {actorId: 3, filmId: 346},
    ]);
    await db.models.actors.update({liked: 0}, {where: {filmsNumber: {[Sequelize.Op.lt]: 200}}});
    // task01-4
    console.log("------- task01-4 -------");
    let deletedActor = await db.models.actors.destroy({where: {liked: 0}});
    console.log('Deleted actors number: ' + deletedActor);
    // task01-5
    console.log("------- task01-5 -------");
    let film = await db.models.films.findById(346, {
        include: [{
            model: db.models.actors
        }]
    });
    console.log(film.title + " : ")
    film.actors.forEach((actor) => {
        console.log("- " + actor.name);
    });
    // task01-6
    console.log("------- task01-6 -------");
    let films2007 = await db.models.films
    .scope('releaseDate2007')
    .findAll({raw: true});
    films2007.forEach((film) => {
        console.log(film.title);
    });
    // task01-7
    console.log("------- task01-7 -------");
    let createdObjWithHook = await db.models.actors.create(actors[3]);
    console.log(createdObjWithHook.get({raw: true}));
    // task01-8
    await db.connection.transaction().then(function (t) {
        return db.models.actors.update({
            liked: 0
        }, {transaction: t, where: {}}).then(function () {
            setTimeout(function () {
                return t.rollback();
            }, 10000);
        });
    });
    // task01-9
    //sequelize init
    //sequelize model:generate --name films --attributes title:string, rating:double, year:integer, budget:integer, gross:integer, position:integer
    //sequelize model:generate --name actors --attributes name:string, birth:date, filmsNumber:integer, liked:integer, photo:string
    //sequelize db:migrate
    //sequelize db:migrate:undo
}



