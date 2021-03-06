import {Command} from "./Command";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../document/PlateyDocument";
import {Helpers} from "../../Helpers";

export class AddColumnCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "add-column";
  title = "Add Column";
  description = "Add a column to the table";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = Helpers.disabledIfNull(currentDocument);
  }

  execute() {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null)
      currentDocument.addColumn();
  }
}
