'use strict';

const {
    ActivityTypes
} = require('botbuilder');

const {
    ChoicePrompt,
    ConfirmPrompt,
    DateTimePrompt,
    DialogSet,
    TextPrompt,
    WaterfallDialog
} = require('botbuilder-dialogs');

const IsIt = require('./is-it');

const Dialogs = Object.freeze({
    Root: 'root',
    EventExplorationOptions: 'eventExplorationOptions',
    Respond: 'respond'
});

class WelcomeBot {
    constructor(botState) {
        this.stateAccessor = botState.createProperty('data');

        this.dialogs = new DialogSet(this.stateAccessor);

        this.dialogs.add(new WaterfallDialog(Dialogs.Root, [
            this.chooseExplorationOption.bind(this),
            this.respond.bind(this)
        ]));

        this.dialogs.add(new ChoicePrompt(Dialogs.EventExplorationOptions));
        this.dialogs.add(new TextPrompt(Dialogs.Respond));
    }

    /**
     *
     * @param {WaterfallStepContext} step
     */
    async chooseExplorationOption(step) {
        const choices = ['larry', 'moe', 'curly'];
        const result = await step.prompt(Dialogs.EventExplorationOptions, `How would you like to explore the event?`, choices);
    }
    /**
     *
     * @param {WaterfallStepContext} step
     */
    async respond(step) {
        const state = step.value;
        await step.context.sendActivity(`K. got **${ state }**`);
    }

    async onTurn(turnContext) {
        if (turnContext.activity.type === ActivityTypes.Message) {
            // Save state changes
            await this.messageActivityHandler(turnContext);
        } else if (turnContext.activity.type === ActivityTypes.ConversationUpdate) {
            // Send greeting when users are added to the conversation.
            await turnContext.sendActivity('Convo update...');
        } else {
            // Generic message for all other activities
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        }
    }

    async messageActivityHandler(ctx) {
        const dc = await this.dialogs.createContext(ctx);
        const utterance = (ctx.activity.text || '').trim().toLowerCase();
        if (utterance === 'cancel') {
            if (dc.activeDialog) {
                await dc.cancelAllDialogs();
            }
            await dc.context.sendActivity(`Sure thing! Canceled.`);
        }

        const dialogResult = await dc.continueDialog();

        if (!ctx.responded) {
            if (IsIt.turn(dialogResult).empty) {
                console.log(`... no previous dialog result.`);
                await dc.beginDialog(Dialogs.Root);
            } else {
                console.log(`I can haz dialog result`);
                if (this.shouldRepeat(dialogResult)) {
                    console.log(`should repeat!`);
                    let target = dc.findDialog(Dialogs.Respond);
                    await target.repromptDialog(dc.context);
                }

                if (IsIt.turn(dialogResult).complete) {
                    console.log(`prev dialog complete!`);
                    ctx.sendActivity(`Ask me another`);
                }
            }
        } else {
            console.log(`--already responsed --`);
        }
    }
}

module.exports.WelcomeBot = WelcomeBot;
