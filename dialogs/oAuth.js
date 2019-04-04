const { ActivityTypes } = require('botbuilder');
const { ChoicePrompt, OAuthPrompt, WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');


const OAUTH_PROMPT = 'oauthDialog';
const CONFIRM_PROMPT = 'confirm_prompt';

const AUTH_DIALOG = 'auth_dialog';

const HELP_TEXT = ' Type anything to get logged in. Type \'logout\' to signout.' +
  ' Type \'help\' to view this message again';

const CONNECTION_NAME = 'alpineAAD';

const OAUTH_SETTINGS = {
  connectionName: CONNECTION_NAME,
  title: 'Sign In',
  text: 'Please Sign In',
  timeout: 300000 // User has 5 minutes to log in.
};

class OAuthDialogue extends ComponentDialog {
  constructor(dialogId) {
    super(dialogId);

    this.initialDialogId = dialogId;

    this.dialogs.add(new ChoicePrompt(CONFIRM_PROMPT));
    this.dialogs.add(new OAuthPrompt(OAUTH_PROMPT, OAUTH_SETTINGS));

    this.dialogs.add(new WaterfallDialog(AUTH_DIALOG, [
      this.oauthPrompt.bind(this),
      this.loginResults.bind(this),
      this.displayToken.bind(this)
    ]));
  }

  async oauthPrompt(step) {
    return await step.prompt(OAUTH_PROMPT);
  }

  async loginResults(step) {
    let tokenResponse = step.result;
    if (tokenResponse != null) {
      await step.context.sendActivity('You are now logged in.');
      return await step.prompt(CONFIRM_PROMPT, 'Do you want to view your token?', ['yes', 'no']);
    }
    await step.context.sendActivity('Login was not sucessful please try again');
    return await step.endDialog();
  }

  async displayToken(step) {
    const result = step.result.value;
    if (result === 'yes') {
      // Call the prompt again because we need the token. The reasons for this are:
      // 1. If the user is already logged in we do not need to store the token locally in the bot and worry
      // about refreshing it. We can always just call the prompt again to get the token.
      // 2. We never know how long it will take a user to respond. By the time the
      // user responds the token may have expired. The user would then be prompted to login again.
      //
      // There is no reason to store the token locally in the bot because we can always just call
      // the OAuth prompt to get the token or get a new token if needed.
      let prompt = await step.prompt(OAUTH_PROMPT);
      var tokenResponse = prompt.result;
      if (tokenResponse != null) {
        await step.context.sendActivity(`Here is your token: ${tokenResponse.token}`);
        await step.context.sendActivity(HELP_TEXT);
        return await step.endDialog();
      }
    }

    await step.context.sendActivity(HELP_TEXT);
    return await step.endDialog();
  }
}

module.exports.OAuthDialogue = OAuthDialogue;
