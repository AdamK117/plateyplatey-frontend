import {AllCommands} from "./AllCommands";
import {BehaviorSubject} from "rxjs";
import {PlateyDocument} from "./PlateyDocument";

export class BodyClickHandler {
  static sourcesWithClickHandlers =
    ["button", "input", "td", "th", "circle", "text", "circle", "option", "select"];

  private _commands: AllCommands;
  private _currentDocument: BehaviorSubject<PlateyDocument | null>;

  constructor(commands: AllCommands, currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._commands = commands;
    this._currentDocument = currentDocument;
  }

  handler(e: MouseEvent) {
    const sourceElement = (<HTMLElement>e.target).tagName.toLowerCase();
    const sourceHandledByStandardHtmlElement =
      BodyClickHandler.sourcesWithClickHandlers.indexOf(sourceElement) !== -1;

    if (sourceHandledByStandardHtmlElement) return;
    else {
      const currentDocument = this._currentDocument.getValue();
      if (currentDocument !== null) {
        currentDocument.deSelectRowsById(currentDocument.getSelectedRowIds());
      }
    }
  }
}