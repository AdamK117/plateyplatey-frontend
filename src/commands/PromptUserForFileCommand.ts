import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {promptUserForFile} from "../helpers";

export class PromptUserForFileCommand implements Command {

  id = "prompt-user-for-file";
  title = "Prompt User for File";
  description = "Prompt a user to browse for a file on their local filesystem";
  disabledSubject = new BehaviorSubject<DisabledMessage>({ isDisabled: false });

  constructor() {}

  execute(mimeTypes = "") {
    return promptUserForFile(mimeTypes);
  }
}
