console.log('Connector initializing...');
window.TrelloPowerUp.initialize({
  'board-buttons': () => {
    console.log('Generating board button');
    return [{
      text: 'ESI CARD GENERATOR',
      icon: {
        dark: './esi.png',
        light: './esi.png'
      },
      condition: 'always',
      callback: (t) => {
        console.log('Button clicked');
        return t.popup({
          title: 'ESI CARD GENERATOR',
          url: './index.html',
          height: 900
        });
      }
    }];
  }
}, {
  appKey: 'your-api-key', // Add your Trello API key here
  appName: 'ESI CARD GENERATOR'
});
