const {
  LuisRecognizer
} = require('botbuilder-ai');

class Lu {
  constructor() {
    let descriptor = {
      applicationId: '123bf86d-887f-4195-a31a-1d959f2be5dc',
      endpoint: 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/123bf86d-887f-4195-a31a-1d959f2be5dc?verbose=true&timezoneOffset=-360&subscription-key=cd4f9eaaa25646418d0b664e5ac89291&q=',
      endpointKey: 'cd4f9eaaa25646418d0b664e5ac89291'
    };
    this.luisRecognizer = new LuisRecognizer(descriptor, {}, true);
  }
  async getQuery(ctx) {
    const recognized = await this.luisRecognizer.recognize(ctx);
    const topIntent = recognized.luisResult.topScoringIntent;
    switch (topIntent.intent) {
      case 'bandsearch':
        const terms = recognized.luisResult.entities.map(entry => {
          return `${ entry.type } eq "${ entry.entity }"`;
        });
        const query = terms.join(' and ');
        console.log(query);
        return query;
      default:
        console.log('no intent found for ' + ctx);
        return null;
    }
  }
}

module.exports.Lu = Lu;
