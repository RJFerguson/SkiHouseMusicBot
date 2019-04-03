const { SearchService } = require('azure-search-client');

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
        const choice = step.result;
        const client = new SearchService('alpine-ski-house', '4B30F37835DFF403D277640BD0304073', '2017-11-11');
        const resp = await client.indexes.use('azureblob-index').search({
          search: choice
        });
        console.log(resp.result.value);
        if (bandResults[0]) {
          return await step.context.sendActivity({ attachments: [createHeroCard(resp.result.value)] });
        } else {
          return await step.context.sendActivity('No bands found');
        }
      }
    ]));
  }
}

module.exports.BandSearchDialogue = BandSearchDialogue;
