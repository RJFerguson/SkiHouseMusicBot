const {
    TurnContext,
    ActivityTypes,
} = require('botbuilder');

const {
    DialogTurnResult,
    DialogTurnStatus,
    DialogReason
} = require('botbuilder-dialogs');

module.exports = class IsIt {
    /**
     *
     * @param {TurnContext} turnContext
     */
    static activity(turnContext) {
        return {
            get isMessage() {
                return turnContext && turnContext.activity.type === ActivityTypes.Message;
            },
            get isContactRelationUpdate() {
                return turnContext && turnContext.activity.type === ActivityTypes.ContactRelationUpdate;
            },
            get isConversationUpdate() {
                return turnContext && turnContext.activity.type === ActivityTypes.ConversationUpdate;
            },
            get isTyping() {
                return turnContext && turnContext.activity.type === ActivityTypes.Typing;
            },
            get isEndOfConversation() {
                return turnContext && turnContext.activity.type === ActivityTypes.EndOfConversation;
            },
            get isEvent() {
                return turnContext && turnContext.activity.type === ActivityTypes.Event;
            },
            get isInvoke() {
                return turnContext && turnContext.activity.type === ActivityTypes.Invoke;
            },
            get isDeleteUserData() {
                return turnContext && turnContext.activity.type === ActivityTypes.DeleteUserData;
            },
            get isMessageUpdate() {
                return turnContext && turnContext.activity.type === ActivityTypes.MessageUpdate;
            },
            get isMessageDelete() {
                return turnContext && turnContext.activity.type === ActivityTypes.MessageDelete;
            },
            get isInstallationUpdate() {
                return turnContext && turnContext.activity.type === ActivityTypes.InstallationUpdate;
            },
            get isMessageReaction() {
                return turnContext && turnContext.activity.type === ActivityTypes.MessageReaction;
            },
            get isSuggestion() {
                return turnContext && turnContext.activity.type === ActivityTypes.Suggestion;
            },
            get isTrace() {
                return turnContext && turnContext.activity.type === ActivityTypes.Trace;
            },
            get isHandoff() {
                return turnContext && turnContext.activity.type === ActivityTypes.Handoff;
            }
        };
    }

    /**
     *
     * @param {DialogTurnResult} target
     */
    static turn(target) {
        return {
            get cancelled() {
                return target && target.status === DialogTurnStatus.cancelled;
            },
            get complete() {
                return target && target.status === DialogTurnStatus.complete;
            },
            get empty() {
                return target && target.status === DialogTurnStatus.empty;
            },
            get waiting() {
                return target && target.status === DialogTurnStatus.waiting;
            }
        };
    }
    static reason(context) {
        return {
            get beginCalled() {
                return context && context.reason === DialogReason.beginCalled
            },
            get cancelCalled() {
                return context && context.reason === DialogReason.cancelCalled
            },
            get continueCalled() {
                return context && context.reason === DialogReason.continueCalled
            },
            get endCalled() {
                return context && context.reason === DialogReason.endCalled
            },
            get nextCalled() {
                return context && context.reason === DialogReason.nextCalled
            },
            get replaceCalled() {
                return context && context.reason === DialogReason.replaceCalled
            }
        };
    }
};
