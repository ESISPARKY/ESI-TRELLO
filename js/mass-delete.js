const TRELLO_API_KEY = 'a7ac2ed825a81b44dfa0bbd7d0881c75';
const TRELLO_API_TOKEN = 'ATTA4a1b7acd5029df9e2afb0459c391a544ec3ebd8d9fd3a70d58104b1d3cdec4358BDF58F1';

let t = window.TrelloPowerUp.iframe();

async function deleteSelected() {
  const token = await t.arg('member', 'token');
  if (!token) {
    await t.alert({
      message: 'Please authorize the Power-Up first',
      duration: 3,
      display: 'error'
    });
    return;
  }

  const cards = Array.from(selectedCards);
  if (cards.length === 0) {
    await t.alert({
      message: 'No cards selected for deletion',
      duration: 3,
      display: 'warning'
    });
    return;
  }

  const confirmed = await t.popup({
    type: 'confirm',
    title: 'Confirm Deletion',
    message: `Are you sure you want to delete ${cards.length} cards? This cannot be undone.`,
    confirmText: 'Delete Cards',
    confirmStyle: 'danger'
  });

  if (confirmed) {
    try {
      const deletePromises = cards.map(cardId =>
        fetch(`https://api.trello.com/1/cards/${cardId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `OAuth oauth_consumer_key="${TRELLO_API_KEY}", oauth_token="${TRELLO_API_TOKEN}"`,
            'Content-Type': 'application/json'
          }
        })
      );

      await Promise.all(deletePromises);
      
      selectedCards.clear();
      await t.alert({
        message: `Successfully deleted ${cards.length} cards`,
        duration: 3
      });
      
      t.closePopup();
    } catch (error) {
      console.error('Error deleting cards:', error);
      await t.alert({
        message: 'Failed to delete some cards. Please try again.',
        duration: 5,
        display: 'error'
      });
    }
  }
}

async function selectByList() {
  const lists = await t.lists('id', 'name');
  const selectedList = await t.popup({
    type: 'list',
    items: lists.map(list => ({
      text: list.name,
      callback: async (t) => {
        const cards = await t.cards('id', 'name', 'idList');
        const listCards = cards.filter(card => card.idList === list.id);
        listCards.forEach(card => selectedCards.add(card.id));
        updateSelectionSummary();
      }
    }))
  });
}

async function selectByLabel() {
  const labels = await t.board('labels');
  const selectedLabel = await t.popup({
    type: 'list',
    items: labels.labels.map(label => ({
      text: label.name || label.color,
      callback: async (t) => {
        const cards = await t.cards('id', 'name', 'labels');
        const labelCards = cards.filter(card => 
          card.labels.some(cardLabel => cardLabel.id === label.id)
        );
        labelCards.forEach(card => selectedCards.add(card.id));
        updateSelectionSummary();
      }
    }))
  });
}

async function selectAll() {
  const cards = await t.cards('id');
  cards.forEach(card => selectedCards.add(card.id));
  updateSelectionSummary();
}

async function updateSelectionSummary() {
  const summary = document.getElementById('selection-summary');
  summary.textContent = `${selectedCards.size} cards selected for deletion`;
}
