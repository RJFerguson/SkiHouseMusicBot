const {
    ActivityTypes
} = require('botbuilder');
const {
    DialogSet,
    ChoicePrompt,
    WaterfallDialog
} = require('botbuilder-dialogs');
const {
    WelcomeBotDialogue
} = require('./dialogs/welcome');
const {
    QnAMakerDialogue
} = require('./dialogs/qna');

const MAIN_DIALOG = 'mainDialog';
const WELCOMEDIALOG = 'welcomeDialog';
const QNADIALOG = 'QNADialog';
const DIALOG_STATE_PROPERTY = 'dialogState';

class Bot {
    constructor(conversationState, endpoint) {
        this.conversationState = conversationState;

        // Configure dialogs
        this.dialogState = this.conversationState.createProperty(DIALOG_STATE_PROPERTY);
        this.dialogs = new DialogSet(this.dialogState);
        // this.dialogs.add(new ChoicePrompt(MENU_PROMPT));

        this.dialogs.add(new WelcomeBotDialogue(WELCOMEDIALOG));
        this.dialogs.add(new QnAMakerDialogue(QNADIALOG, endpoint));

        // Adds a waterfall dialog that prompts users for the top level menu to the dialog set
        this.dialogs.add(new WaterfallDialog(MAIN_DIALOG, [
            this.promptForMenu.bind(this),
            this.handleMenuResult.bind(this),
            this.resetDialog.bind(this)
        ]));
    }

    async onTurn(turnContext) {
        const dialogContext = await this.dialogs.createContext(turnContext);

        if (turnContext.activity.type === ActivityTypes.Message) {
            if (dialogContext.activeDialog) {
                await dialogContext.continueDialog();
            } else {
                await dialogContext.beginDialog(MAIN_DIALOG);
            }
        } else if (turnContext.activity.type === ActivityTypes.ConversationUpdate) {
            if (this.memberJoined(turnContext.activity)) {
                await turnContext.sendActivity(`Alpine Yo`);
                await dialogContext.beginDialog(MAIN_DIALOG);
            }
        }
        await this.conversationState.saveChanges(turnContext);
    }

    /**
     * The first function in our waterfall dialog prompts the user with two options, 'Donate Food' and 'Food Bank'.
     * It uses the ChoicePrompt added in the contructor and referenced by the MENU_PROMPT string. The array of 
     * strings passed in as choices will be rendered as suggestedAction buttons which the user can then click. If the 
     * user types anything other than the button text, the choice prompt will reject it and reprompt using the retryPrompt
     * string. 
     * @param step Waterfall dialog step
     */
    async promptForMenu(step) {
        return step.beginDialog(WELCOMEDIALOG);
    }

    /**
     * This step handles the result from the menu prompt above. It begins the appropriate dialog based on which button 
     * was clicked. 
     * @param step Waterfall Dialog Step 
     */
    async handleMenuResult(step) {
        await step.beginDialog(QNADIALOG);
        // switch (step.result.value) {
        //     case "FAQS":
        //         return step.beginDialog(QNADIALOG);
        //     default :
        //         await step.sendActivity("not implemented");
        // }
        // return step.next();
    }

    /**
     * This final step in our waterfall dialog replaces the dialog with itself, effectively starting the conversation over. This is often referred to as a 'message loop'.
     * @param step Waterfall Dialog Step
     */
    async resetDialog(step) {
        return step.replaceDialog(MAIN_DIALOG);
    }

    /**
     * @param activity Incoming conversationUpdate activity
     * @returns Returns true if a new user is added to the conversation, which is useful for determining when to welcome a user. 
     */
    memberJoined(activity) {
        return ((activity.membersAdded.length !== 0 && (activity.membersAdded[0].id !== activity.recipient.id)));
    }
}

module.exports.Bot = Bot;
