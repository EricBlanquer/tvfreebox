chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('Flyout.html', {
    id: 'mainWindow',
    frame: 'none',
    bounds: {
      width: 152,
      height: 600,
    }
  });
});
