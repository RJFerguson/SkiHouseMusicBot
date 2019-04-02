// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
    ActivityTypes,
    MessageFactory,
    TurnContext
} = require('botbuilder');
const {
    CardFactory
} = require('botbuilder');

const IntroCard = require('./resources/IntroCard.json');

const WELCOMED_USER = 'welcomedUserProperty';

const ValidExplorationOptions = ['FAQS', 'Band Search', 'Navigate'];

class WelcomeBot {
    /**
     *
     * @param {UserState} User state to persist boolean flag to indicate
     *                    if the bot had already welcomed the user
     */
    constructor(userState) {
        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);

        this.userState = userState;
    }
    /**
     *
     * @param {TurnContext} context on turn context object.
     */
    async onTurn(turnContext) {
        if (turnContext.activity.type === ActivityTypes.Message) {
            const didBotWelcomedUser = await this.welcomedUserProperty.get(turnContext, false);

            if (didBotWelcomedUser === false) {
                await this.sendSuggestedActions(turnContext);
                await this.welcomedUserProperty.set(turnContext, true);
            } else {
                let text = turnContext.activity.text;
                if (this.isValidChoice(text)) {
                    await turnContext.sendActivity(`You clicked ${ text }! `);
                } else {
                    await turnContext.sendActivity(`Sorry. You said [${ text }] but I don't understand what you want.`);
                }
                await this.sendSuggestedActions(turnContext);
            }
        } else if (turnContext.activity.type === ActivityTypes.ConversationUpdate) {
            if (this.memberJoined(turnContext.activity)) {
                await turnContext.sendActivity(`Hi there! I'm Botski, the ASH Music Festival Bot. I'm here to guide you around the festival :-)`);
                await this.sendSuggestedActions(turnContext);
            }
        }
        // Save state changes
        await this.userState.saveChanges(turnContext);
    }

    isValidChoice(text) {
        return ValidExplorationOptions.includes(text);
    }

    /**
     * Send suggested actions to the user.
     * @param {TurnContext} turnContext A TurnContext instance containing all the data needed for processing this conversation turn.
     */
    async sendSuggestedActions(turnContext) {
        var reply = MessageFactory.suggestedActions(ValidExplorationOptions, 'How would you like to explore the event?');
        await turnContext.sendActivity(reply);
    }

    memberJoined(activity) {
        return ((activity.membersAdded.length !== 0 && (activity.membersAdded[0].id !== activity.recipient.id)));
    }
}

module.exports.WelcomeBot = WelcomeBot;
