/*
	Copyright Myles Trevino
	Licensed under the Apache License, Version 2.0
	http://www.apache.org/licenses/LICENSE-2.0
*/


const Electron = require('electron');


let window;


// Hide the application menu.
Electron.Menu.setApplicationMenu(null);


// Initializes the application.
Electron.app.whenReady().then(createWindow);

function createWindow()
{
	// Create the window.
	window = new Electron.BrowserWindow
	({
		width: 560, // width: 1200,
		height: 560,
		resizable: false,
		frame: false,
		backgroundColor: 'black',
		show: false,
		webPreferences:
		{
			nodeIntegration: true,
			contextIsolation:false,
			nativeWindowOpen: true
		}
	});

	// Load the page.
	window.loadFile(`${__dirname}/../build/index.html`);

	// Show Chrome developer tools.
	// window.webContents.openDevTools();

	// Open new tab links in the browser.
	window.webContents.setWindowOpenHandler(({url}) =>
	{
		Electron.shell.openExternal(url);
		return {action: 'deny'};
	});
}


// Show the window.
Electron.ipcMain.on('show-window', () => window.show());


// Window controls.
Electron.ipcMain.on('minimize', () => window.minimize());

Electron.ipcMain.on('close', () => window.close());


// Close the process when all windows have been exited.
Electron.app.on('window-all-closed', () => { Electron.app.quit(); });
