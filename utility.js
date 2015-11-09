function logResult(err, result) {
    if (err) {
        console.error(err);
    } else {
        console.log('Record' + result.insertedId + 'successfully inserted')
    }
}

function seedData(marathons) {
    var cities = ["Sofia","Veliko Turnovo","Burgas","Balchik", "Varna", "Moldova"],
        participants = ["Peter Petrov", "Maria Ivanova","Georgi Ivanov", "Ivan Georgiev", "Ivelina Gesheva"],
        sponsors = ["IBM", "Microsoft", "Google Inc."]; 

    for (var i=0;i<10;i++){
        var marathon = {};
        
        marathon.name = "Race " + i;
        marathon.location = cities[Math.floor(Math.random()*100 % cities.length)];
        marathon.distances = [Math.floor(Math.random()*100 % 43)];
        marathon.winners = [{distance: marathon.distances[0], name: participants[Math.floor(Math.random()*100 % participants.length)]}];
        marathon.participants = Math.floor(Math.random()*10000);
        
        if(i%2==0){
            marathon.sponsors = [sponsors[Math.floor(Math.random()*100 % sponsors.length)]];        
        }
        
        marathons.insertOne(marathon, logResult);
    }

    marathons.insertOne({
        name: "Marathon",
        location: "Burgas",
        distances: [42],
        winners: [{distance: 42, name: "Ivan Ginov"}],
        participants: Math.floor(Math.random()*10000)
    }, logResult);

    marathons.insertOne({
        name: "Maria's Race",
        location: "Varna",
        distances: [2, 20],
        winners: [{distance: 2, name: "Maria Ivanova"}],
        participants: Math.floor(Math.random()*10000),
        sponsors: sponsors
    }, logResult);
}

module.exports = {
	seedData: seedData
};