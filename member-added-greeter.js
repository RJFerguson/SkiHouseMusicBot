'use strict';

const IsIt = require('./is-it');
const TurnContext = require('botbuilder');

class Greeter {
    /**
     *
     * @param {string | function} greetActivity
     */
    constructor(greetActivity = undefined) {
        if (typeof greetActivity === 'undefined') {
            this.handler = undefined;
        }

        if (typeof greetActivity === 'string') {
            this.handler = () => greetActivity;
        }
        if (typeof greetActivity === 'function') {
            this.handler = greetActivity;
        }
    }

    /**
     *
     * @param {TurnContext} context
     */
    static isMemberAddedActivity(context) {
        return Boolean(IsIt.activity(context).isConversationUpdate &&
            context.activity.membersAdded &&
            context.activity.membersAdded.length > 0);
    }

    /**
     * @param {TurnContext} context
     */
    async greet(context) {
        const eligible = Greeter.extractEligibleMembers(context);

        if (eligible.length > 0) {
            const promises = eligible.map(async m => {
                const message = this.handler(context, m);
                return await context.sendActivity(message);
            });
            await Promise.all(promises);
            return eligible.length;
        }

        return 0;
    }

    /**
     * @param {TurnContext} context
     */
    static extractEligibleMembers(context) {
        if (!Array.isArray(context.activity.membersAdded)) {
            return [];
        }
        return context.activity.membersAdded.filter(m => m.id !== context.activity.recipient.id);
    }
};

class GreeterMiddleware {
    constructor(greeter = new Greeter()) {
        this.greeter = greeter;
    }

    async onTurn(context, next) {
        const count = await this.greeter.greet(context);
        if (count === 0) {
            await next();
        }
    }

    withGreeter(greeter) {
        this.greeter = greeter;
        return this;
    }
}
module.exports = {
    Greeter,
    GreeterMiddleware
};
