onst TRELLO_API_KEY = 'a7ac2ed825a81b44dfa0bbd7d0881c75';
const TRELLO_API_TOKEN = 'ATTA4a1b7acd5029df9e2afb0459c391a544ec3ebd8d9fd3a70d58104b1d3cdec4358BDF58F1';

let selectedCards = new Set();

window.TrelloPowerUp.initialize({
  'board-buttons': function(t, options) {
    return [{
      icon: {
        dark: './images/icon-dark.svg',
        light: './images/icon-light.svg'
      },
      text: 'Mass Delete Cards',
      callback: function(t) {
        return t.modal({
          url: './mass-delete.html',
          height: 400,
          title: 'ESI Card Deletion'
        });
      }
    }];
  },
  
  'card-buttons': function(t, options) {
    return [{
      icon: {
        dark: './images/checkbox-dark.svg',
        light: './images/checkbox-light.svg'
      },
      text: 'Select for Deletion',
      callback: async function(t) {
        const card = await t.card('id', 'name');
        if (selectedCards.has(card.id)) {
          selectedCards.delete(card.id);
          return t.alert({
            message: `Unselected "${card.name}"`,
            duration: 1
          });
        } else {
          selectedCards.add(card.id);
          return t.alert({
            message: `Selected "${card.name}" for deletion`,
            duration: 1
          });
        }
      }
    }];
  },
  
  'authorization-status': function(t, options) {
    return t.get('member', 'private', 'token')
      .then(function(token) {
        return { authorized: token != null };
      });
  }
});
