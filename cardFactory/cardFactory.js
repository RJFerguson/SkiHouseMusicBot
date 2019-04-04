const {
  CardFactory
} = require('botbuilder');

function createHeroCard(choice) {
  return CardFactory.heroCard(`${choice.bandName} \n ${choice.day}, ${choice.date} \n ${choice.startTime} - ${choice.endTime}`, [`https://westeuropebotassets.blob.core.windows.net/assets/images/${choice.image}`],
    '', {
      text: `${choice.description} \n stage:  ${choice.stage} \n`
    });
}

module.exports.createHeroCard = createHeroCard;
