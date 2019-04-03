
const {
  CardFactory
} = require('botbuilder');

function createHeroCard(choice) {
  console.log(choice)
  return CardFactory.heroCard(choice.bandName, [`https://westeuropebotassets.blob.core.windows.net/assets/images/${choice.image}`],
    '', { text: choice.description });
}

module.exports.createHeroCard = createHeroCard;