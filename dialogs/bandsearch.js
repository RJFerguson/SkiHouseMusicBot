
const {
  ComponentDialog,
  TextPrompt,
  WaterfallDialog
} = require('botbuilder-dialogs');

const {
  createHeroCard
} = require('../cardFactory/cardFactory');
const { getSearchResults } = require('../searchServices/searchServices');
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
      async function(step) {
        if (step.options && step.options.query) {
          step.values.query = step.options.query;
          return await step.next();
        }
        return await step.prompt('textPrompt', {
          prompt: 'What band would you like to search for?'
        });
      },
      async function(step) {
        const choice = step.result || step.values.query;
        const bandResults = await getSearchResults(choice);
        if (bandResults[0]) {
          return await step.context.sendActivity({ attachments: [createHeroCard(bandResults[0])] });
        } else {
          return await step.context.sendActivity('No bands found');
        }
      }
    ]));
  }
}

module.exports.BandSearchDialogue = BandSearchDialogue;
