import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { remote } from 'electron';
import { writeFile } from 'fs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  openWindow() {
    const win = new remote.BrowserWindow({
      parent: remote.getCurrentWindow(),
      modal: true,
      width: 460,
      height: 720,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: false
      }
    });

    win.loadURL('https://order.jd.com/center/list.action');
    win.webContents.on('did-finish-load', function () {
      console.log('did-finish-load fired');
    });

    win.webContents.once('dom-ready', () => {
      console.log('dom-ready');
      win.webContents.executeJavaScript(`
      console.log("This loads no problem!");
    `);
      /* win.webContents.executeJavaScript(`document.body.innerHTML`, false).then((result) => {
        console.log(result);
      });
      win.webContents.executeJavaScript('window.close();');
      win.webContents.executeJavaScript(`console.log(document.body);`); */
    });

    remote.ipcMain.on('return-data-message', (result) => {
      console.log('return-data-message ：' + result);
    });

    win.webContents.session.cookies.on('changed', (event) => {
      // 检测cookies变动事件，标记cookies发生变化
    });

    win.webContents.session.cookies
      .get({
        url: win.webContents.getURL()
      })
      .then((cookies) => {
        let cookieStr = '';

        for (let i = 0; i < cookies.length; i++) {
          const info = cookies[i];
          cookieStr += `${info.name}=${info.value};`;
        }

        if (cookieStr.indexOf('pinId') > -1 && cookieStr.indexOf('pin') > -1) {
          win.hide();
          console.log('get cookies', cookieStr);
        }

        // win.hide();

        // win.webContents.executeJavaScript('window.close()');
      });
  }

  showOpenDialog() {
    remote.dialog
      .showOpenDialog(null, { title: 'Select a folder', properties: ['openDirectory'] })
      .then((folderPath) => {
        if (folderPath === undefined) {
          console.log("You didn't select a folder");
          return;
        }
      });
  }

  saveFile() {
    remote.dialog.showSaveDialog(null, {}).then((res) => {
      if (!res.canceled) {
        writeFile(res.filePath, { dd: 'dsds' }, (err) => {
          if (err) {
            alert('An error ocurred creating the file ' + err.message);
          }

          alert('The file has been succesfully saved');
        });
      }
    });
  }
}
