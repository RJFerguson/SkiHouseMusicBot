
const {
  CardFactory
} = require('botbuilder');

function createHeroCard() {
  return CardFactory.heroCard(
    'BotFramework Hero Card',
    CardFactory.images(['https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg']),
    CardFactory.actions([
      {
        type: 'openUrl',
        title: 'Get started',
        value: 'https://docs.microsoft.com/en-us/azure/bot-service/'
      }
    ])
  );
}

module.exports.createHeroCard = createHeroCard;