$(function () {
  $('#contact').addContactPop({
    emailUrl: 'test.com',
    emailMsg: 'Send me an email!',
    socialMsg: 'Find me on social media:',
    socialUrls: {
      twitter: 'twitter.com',
      github: 'github.com'
    },
    socialDir: 'icons/',
    testMode: true
  });
});
