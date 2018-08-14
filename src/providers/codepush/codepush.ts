import { GlobalProvider } from './../global/global';
import { CodePush, InstallMode, SyncStatus, DownloadProgress } from '@ionic-native/code-push';
import { Injectable } from '@angular/core';

@Injectable()
export class CodepushProvider {

  constructor(
    private cp: CodePush,
    private global: GlobalProvider
  ) {
    console.log('Hello CodepushProvider Provider', cp);
  }

  public checkCodePush() {
    let prog: any;
    this.cp.sync({ installMode: InstallMode.IMMEDIATE, updateDialog: {
      mandatoryUpdateMessage: `Hold on, we're making things awesome...`,
      mandatoryContinueButtonLabel: `Just a sec...`,

      optionalUpdateMessage: `Want to make things awesome?`,
      optionalInstallButtonLabel: `Yeah`,
      optionalIgnoreButtonLabel: `Nah, I'm fine`,

      updateTitle: `New Update Available`,
    } }, (progress: DownloadProgress) => {
        prog = progress;
        this.global.cLog(`Total: `, progress.totalBytes, `=> Received bytes: `, progress.receivedBytes);
    }).subscribe((status: SyncStatus) => {
        if (status == SyncStatus.CHECKING_FOR_UPDATE) {
            this.global.showMessage('Checking For Updates...', 2000);
            this.global.cLog('checking for update');
        }
        if (status == SyncStatus.DOWNLOADING_PACKAGE) {
            this.global.showMessage('Downloading Updates...', 2000);
            this.global.cLog('Downloading package -> ' + prog.receivedBytes + ' of ' + prog.totalBytes);
        }
        if (status == SyncStatus.IN_PROGRESS) {
        }
        if (status == SyncStatus.INSTALLING_UPDATE) {
            this.global.showMessage('Installing Updates...', 2000);
            this.global.showLoader('Installing updates...');
        }
        if (status == SyncStatus.UP_TO_DATE) {
            this.global.showMessage('Up-to Date');
        }
        if (status == SyncStatus.UPDATE_INSTALLED) {
            this.global.hideLoader();
        }
        if (status == SyncStatus.ERROR) {
            console.log("Codepush error!");
            this.global.hideLoader();
        }
    },
    err=>{
      this.global.cLog(`some error in checkCodePush subscribe `, err);      
    });
}
}
