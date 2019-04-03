const {
  QnAMaker
} = require('botbuilder-ai');

const {
  ComponentDialog,
  TextPrompt,
  WaterfallDialog
} = require('botbuilder-dialogs');

/**
 * A simple bot that responds to utterances with answers from QnA Maker.
 * If an answer is not found for an utterance, the bot responds with help.
 */

class QnAMakerDialogue extends ComponentDialog {
  constructor(dialogId, endpoint) {
    super(dialogId);

    this.qnaMaker = new QnAMaker(endpoint, {});

    // ID of the child dialog that should be started anytime the component is started.
    this.initialDialogId = dialogId;
    const that = this;
    // Define the prompts used in this conversation flow.
    this.addDialog(new TextPrompt('textPrompt'));

    // Define the conversation flow using a waterfall model.
    this.addDialog(new WaterfallDialog(dialogId, [
      async function (step) {
        return await step.prompt('textPrompt', {
          prompt: 'Ask me a question about the Festival and I will do my best to answer.'
        });
      },
      async function (step) {
        console.log('lets do this!');
        let qnaResults;
        qnaResults = await that.qnaMaker.getAnswers(step.context);

        if (qnaResults[0]) {
          return await step.context.sendActivity(`I have an answer! **${qnaResults[0].answer}**`);
        } else {
          return await step.context.sendActivity('No QnA Maker answers were found. This example uses a QnA Maker Knowledge Base that focuses on smart light bulbs. To see QnA Maker in action, ask the bot questions like "Why won\'t it turn on?" or "I need help."');
        }

      }
    ]));
  }
}

module.exports.QnAMakerDialogue = QnAMakerDialogue;
