import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../PlateyDocument";
import {disabledIfNull} from "../helpers";

export class SelectRowsById implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "select-rows-by-id";
  title = "Select Rows";
  description = "Select rows in the main table.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = disabledIfNull(currentDocument);
  }

  execute(ids: string[], e: KeyboardEvent) {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      if (!e.shiftKey) {
        // clear selection before focusing
        const selectedRowIds = currentDocument.getSelectedRowIds();
        currentDocument.deSelectRowsById(selectedRowIds);
      }

      if (ids.length > 0)
        currentDocument.focusRow(ids[0]);

      currentDocument.selectRowsById(ids);
    }
  }
}
