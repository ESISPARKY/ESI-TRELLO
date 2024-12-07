console.log('Connector initializing...');
window.TrelloPowerUp.initialize({
  'board-buttons': () => {
    console.log('Generating board button');
    return [{
      text: 'ESI CSV',
      icon: {
        dark: './esi.png',
        light: './esi.png'
      },
      condition: 'always',
      callback: (t) => {
        console.log('Button clicked');
        return t.popup({
          title: 'ESI CSV Sync',
          url: './index.html',
          height: 600
        });
      }
    }];
  }
}, {
  appKey: 'your-api-key', // Add your Trello API key here
  appName: 'ESI CSV Sync'
});