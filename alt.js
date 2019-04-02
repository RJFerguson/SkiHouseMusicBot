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
    ShowChoice: 'respond'
});

class WelcomeBot {
    constructor(botState) {
        this.botState = botState;
        this.stateAccessor = botState.createProperty('data');

        this.dialogs = new DialogSet(this.stateAccessor);

        this.dialogs.add(new WaterfallDialog(Dialogs.Root, [
            this.chooseExplorationOption.bind(this),
            this.showChoice.bind(this)
        ]));

        this.dialogs.add(new ChoicePrompt(Dialogs.EventExplorationOptions));
        this.dialogs.add(new TextPrompt(Dialogs.ShowChoice));
    }

    /**
     *
     * @param {WaterfallStepContext} step
     */
    async chooseExplorationOption(step) {
        const choices = ['larry', 'moe', 'curly'];
        return await step.prompt(Dialogs.EventExplorationOptions, `How would you like to explore the event?`, choices);
    }
    /**
     *
     * @param {WaterfallStepContext} step
     */
    async showChoice(step) {
        const choice = step.result.value;
        await step.context.sendActivity(`You clicked **${ choice }**! `);
        await step.replaceDialog(Dialogs.Root);
    }

    async onTurn(turnContext) {
        const dc = await this.dialogs.createContext(turnContext);
        if (IsIt.activity(turnContext).isMessage) {
            const utterance = (turnContext.activity.text || '').trim().toLowerCase();
            if (utterance === 'cancel') {
                if (dc.activeDialog) {
                    await dc.cancelAllDialogs();
                    await dc.context.sendActivity(`Ok... canceled.`);
                } else {
                    await dc.context.sendActivity(`Nothing to cancel.`);
                }
            }

            await dc.continueDialog();

            if (!turnContext.responded) {
                await dc.beginDialog(Dialogs.Root);
            }
        } else if (IsIt.activity(turnContext).isConversationUpdate) {
            if (this.memberJoined(turnContext.activity)) {
                await turnContext.sendActivity(`Hi there! I'm Botski, the ASH Music Festival Bot. I'm here to guide you around the festival :-)`);
                await dc.beginDialog(Dialogs.Root);
            }
        } else {
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        }

        await this.botState.saveChanges(turnContext);
    }
    memberJoined(activity) {
        return ((activity.membersAdded.length !== 0 && (activity.membersAdded[0].id !== activity.recipient.id)));
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
                    let target = dc.findDialog(Dialogs.ShowChoice);
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
