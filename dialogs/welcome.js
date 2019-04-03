'use strict';

const { 
    ActivityTypes
} = require('botbuilder');

const {
    ComponentDialog,
    ChoicePrompt,
    ConfirmPrompt,
    DateTimePrompt,
    DialogSet,
    TextPrompt,
    WaterfallDialog
} = require('botbuilder-dialogs');




class WelcomeBotDialogue extends ComponentDialog {
    constructor(dialogId) {
        super(dialogId);

        // ID of the child dialog that should be started anytime the component is started.
        this.initialDialogId = dialogId;

        // Define the prompts used in this conversation flow.
        this.addDialog(new ChoicePrompt('choicePrompt'));

        // Define the conversation flow using a waterfall model.
        this.addDialog(new WaterfallDialog(dialogId, [
            async function (step) {
                const choices = ['FAQS', 'Band Search', 'Navigate'];
               

                return await step.prompt('choicePrompt', {
                    choices: choices,
                    prompt: "How would you like to explore the event?",
                    retryPrompt: "Sorry, please try again."
                });
            },
            async function (step) {
                const choice = step.result.value;
                await step.context.sendActivity("You chose " + choice);
                return choice;
            }
        ]));
    }
}

module.exports.WelcomeBotDialogue = WelcomeBotDialogue;
