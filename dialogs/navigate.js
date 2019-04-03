const {
  ComponentDialog,
  TextPrompt,
  ChoicePrompt,
  WaterfallDialog
} = require('botbuilder-dialogs');

const {
  createHeroCard
} = require('../cardFactory/cardFactory');

/**
 * A simple bot that responds to utterances with answers from QnA Maker.
 * If an answer is not found for an utterance, the bot responds with help.
 */

class NavigateDialogue extends ComponentDialog {
  constructor(dialogId, endpoint) {
    super(dialogId);

    // ID of the child dialog that should be started anytime the component is started.
    this.initialDialogId = dialogId;
    const that = this;
    // Define the prompts used in this conversation flow.
    this.addDialog(new ChoicePrompt('datePrompt'));
    this.addDialog(new ChoicePrompt('genrePrompt'));

    // Define the conversation flow using a waterfall model.
    this.addDialog(new WaterfallDialog(dialogId, [
      async function(step) {
        const choices = ['Friday', 'Saturday', 'Sunday', 'Any'];

        return await step.prompt('datePrompt', {
          choices: choices,
          prompt: 'What day would you like to hear music?',
          retryPrompt: 'Not a valid choice.'
        });
      },

      async function(step) {
        const day = step.result.value;

        await step.context.sendActivity(`Ok ${ day }`);
        const choices = ['Rock', 'Jazz', 'Electronic', 'Country', 'Hip-hop', 'Alternative', 'Blues'];

        return await step.prompt('genrePrompt', {
          choices: choices,
          prompt: 'Genre?',
          retryPrompt: 'Not a valid genre.'
        });
      },
      async function(step) {
        const genre = step.result.value;
        await step.context.sendActivity(`Ok ${ genre }`);
        return await step.context.sendActivity(`results soon!`);
      }

    ]));
  }
}

module.exports.NavigateDialogue = NavigateDialogue;
