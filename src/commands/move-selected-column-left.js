class MoveSelectedColumnLeftCommand {

  constructor(primativeCommands, applicationEvents) {
    this._primativeCommands = primativeCommands;
    this.id = "move-selected-column-left";
    this.title = "Move Selected Column Left";
    this.description = "Move the currently selected column left.";

    this.disabledSubject = new Rx.BehaviorSubject(this._calculateDisabled());

    const updateCallback = () => this.disabledSubject.onNext(this._calculateDisabled());

    applicationEvents.subscribeTo("after-column-selection-changed", updateCallback);
    applicationEvents.subscribeTo("after-table-columns-changed", updateCallback);
  }

  _calculateDisabled() {
    const allColumns = this._primativeCommands.getColumnIds();
    const selectedColumn = this._primativeCommands.getSelectedColumnId();

    if (selectedColumn === null) {
      return {
        isDisabled: true,
        hasReason: true,
        reason: "No column currently selected."
      };
    }
    else if (allColumns.indexOf(selectedColumn) === 0) {
      return {
        isDisabled: true,
        hasReason:true,
        reason: "Selected column is as leftwards as it can go.",
      };
    }
    else return { isDisabled: false };
  }

  execute() {
    const selectedColumn = this._primativeCommands.getSelectedColumnId();
    const allColumns = this._primativeCommands.getColumnIds();
    const oldIndex = allColumns.indexOf(selectedColumn);
    const newIndex = oldIndex - 1;

    this._primativeCommands.moveColumn(selectedColumn, newIndex);
  }
}