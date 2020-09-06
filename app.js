
var electron = require("electron");
var url = require("url");
var path = require("path");
var BrowserWindow = electron.BrowserWindow;
var app = electron.app;
var win = null;

function main(){
    win = new BrowserWindow({
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule: true
        },
        width: 1200,
        height: 700,
        frame: false
    });

    // win.webContents.openDevTools()

    win.loadURL(url.format({
        pathname: path.join(`${__dirname}/web/`,"index.html"),
        protocol: "file",
        slashes: true
    }));

    win.on("closed",function(){
        win = null;
    });
}

app.on("ready",main);

app.on("window-all-closed",function(){
    if(process.platform !== "darwin"){
        app.quit();
    }
});