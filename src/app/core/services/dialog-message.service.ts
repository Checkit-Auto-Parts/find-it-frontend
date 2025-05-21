import { Injectable } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { InfoMessageComponent } from "../components/dialog/info-message/info-message.component"
import { DecisionMessageComponent } from "../components/dialog/decision-message/decision-message.component"

@Injectable({
    providedIn: 'root'
})
export class DialogMessageService {

    constructor(
        private dialog: MatDialog
    ) {
    }

    showSuccessDialog(messageBody: string, title?: string, disableClose: boolean = false) {
        return this.dialog.open(InfoMessageComponent, {
            disableClose: disableClose,
            panelClass: 'custom-dialog-container',
            data: {
                title: title,
                status: true,
                messageBody: messageBody,
            }
        })
    }
    showErrorDialog(messageBody: string, title?: string, disableClose: boolean = false) {
        return this.dialog.open(InfoMessageComponent, {
            disableClose: disableClose,
            panelClass: 'custom-dialog-container',
            data: {
                title: title,
                status: false,
                messageBody: messageBody,
            }
        })
    }

    showErrorDetailedDialog(messageBody: string, errorList: string[], title?: string, disableClose: boolean = false) {
        return this.dialog.open(InfoMessageComponent, {
            disableClose: disableClose,
            panelClass: 'custom-dialog-container',
            data: {
                title: title,
                status: false,
                messageBody: messageBody,
                detailsList: errorList
            }
        })
    }

    showDecisionDialog(messageBody: string, disableClose: boolean = true) {
        return this.dialog.open(DecisionMessageComponent, {
            disableClose: disableClose,
            panelClass: 'custom-dialog-container',
            data: {
                messageBody: messageBody
            }
        })
    }
}
