
const {
  ActivityTypes
} = require('botbuilder');

const {
  ComponentDialog,
  TextPrompt,
  WaterfallDialog
} = require('botbuilder-dialogs');

const {
  createHeroCard
} = require('../cardFactory/cardFactory');

/**
 * A simple bot that responds to utterances with answers from QnA Maker.
 * If an answer is not found for an utterance, the bot responds with help.
 */

class BandSearchDialogue extends ComponentDialog {
  constructor(dialogId, endpoint) {
    super(dialogId);

    // ID of the child dialog that should be started anytime the component is started.
    this.initialDialogId = dialogId;
    const that = this;
    // Define the prompts used in this conversation flow.
    this.addDialog(new TextPrompt('textPrompt'));

    // Define the conversation flow using a waterfall model.
    this.addDialog(new WaterfallDialog(dialogId, [
      async function (step) {
        return await step.prompt('textPrompt', {
          prompt: 'What band would you like to search for?'
        });
      },
      async function (step) {
        let bandResults = [{
          'bandName': 'Feature Bug',
          'genre': 'Electronic',
          'image': 'Feature_Bug.jpg',
          'description': "Feature Bug is known for incorporating glitchy electronic sounds with unexpected silences. Their number 1 song _itworks_ contains a one-minute silence in the middle of the track. Unsuspecting listeners may think their headphones are broken, but Feature Bug fans (aka Buggies) know that the silence is exactly what's working.",
          'id': '48',
          'stage': 'Prod',
          'startTime': '5:00 PM',
          'endTime': '6:30 PM',
          'date': 'August 18',
          'day': 'Sunday'
        },
        {
          'bandName': 'The Shared Secrets',
          'genre': 'Jazz',
          'image': 'The_Shared_Secrets.jpg',
          'description': "Their music might sound cryptic to the average listener, but if you're in the know The Shared Secrets unlock a world of meaning. ",
          'id': '49',
          'stage': 'Dev',
          'startTime': '7:00 PM',
          'endTime': '8:30 PM',
          'date': 'August 18',
          'day': 'Sunday'
        }];

        if (bandResults[0]) {
          return await step.context.sendActivity({ attachments: [createHeroCard()] });
        } else {
          return await step.context.sendActivity('No bands found');
        }
      }
    ]));
  }
}

module.exports.BandSearchDialogue = BandSearchDialogue;
