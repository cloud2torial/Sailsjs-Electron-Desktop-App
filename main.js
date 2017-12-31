const {app, BrowserWindow} = require('electron');
const path=require('path');
const Sails = require('sails').constructor;
const sailsApp = new Sails();
var mainWindow;
function createWindow () {
    const{screen}= require('electron');
  let mainScreen = screen.getPrimaryDisplay();
     let dimensions = mainScreen.size;
     let shouldQuit = makeSingleInstance()
      if (shouldQuit) return app.quit()
      mainWindow = new BrowserWindow({
        width: dimensions.width,
        height: dimensions.height,
        title: "DesktopApp",
        center: true
      });
     
      mainWindow.on('closed', function () {
        mainWindow = null
      });
  mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null);

  initialize()
}

function initialize(){
   sailsApp.lift({
    "paths": {
         "public": "assets"
        },
        "appPath":__dirname
     }, function (err) {
  if (err) {
    console.log('Error occurred loading Sails app:', err);
    return;
  }
   console.log('Sails app loaded successfully!');
   mainWindow.loadURL('http://localhost:1337');
   mainWindow.webContents.on('did-finish-load', function() {
   mainWindow.focus();
   })
  });
 }

app.disableHardwareAcceleration();

 app.on('quit', function () {
  sailsApp.lower(
  function (err) {
    if (err) {
      return console.log("Error occurred lowering Sails app: ", err);
    }
     process.exit(err ? 1 : 0);
    console.log("Sails app lowered successfully!");
  }
)
});
app.on('ready',function(){
    createWindow()
})
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});

function makeSingleInstance () {
  if (process.mas) return false

  return app.makeSingleInstance(function () {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}
