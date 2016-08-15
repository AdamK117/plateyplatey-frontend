class Platey {
  constructor(wells, options = {}) {
    if(wells === undefined)
      throw "Platey: No wells provided to constructor. An array containing well definitions must be provided";

    if(!wells instanceof Array)
      throw "Platey: Invalid wells type provided to Platey constructor. Must be an Array containing well definitions";

    const wellsContainDuplicateIds =
      Platey._containsDuplicates(wells.map(well => well.id).filter(id => id !== undefined));

    if (wellsContainDuplicateIds)
      throw "Platey: Duplicate Ids found in the supplied plate";

    this._element = document.createElement("canvas");
    this._element.classList.add("plate");
    this._element.width = 1000;
    this._element.height = 1000;

    this._element.setAttribute("resize", null);
    paper.setup(this._element);

    this._gridHeight = 7;
    this._gridWidth = 14;
    this._wellDiameter = 12;

    this._wells = {};

    wells.forEach(well => {
      Platey._testWellCoordinate(well.x);
      Platey._testWellCoordinate(well.y);

      if (well.id  === undefined)
        well.id = Platey._generateGuid();

      const wellUiElement = this._createWellUiElement(well);

      this._wells[well.id] = new _Well(wellUiElement);
    });

    let startPoint, endPoint, selectionBox;
    {
      paper.view.attach("mousedown", function(e) {
        startPoint = e.point;
        endPoint = e.point;

        selectionBox = paper.Shape.Rectangle(startPoint, endPoint);
        selectionBox.strokeColor = "black";

        paper.view.update();
      });

      paper.view.attach("mousedrag", function(e) {
        if (startPoint != null && selectionBox != null)
        {
          endPoint = e.point;

          selectionBox.remove();

          selectionBox = paper.Shape.Rectangle(startPoint, endPoint);
          selectionBox.strokeColor = "black";
        }
      });

      paper.view.attach("mouseup", (e) => {
        if (startPoint != null && selectionBox != null)
        {
          endPoint = e.point;
          selectionBox.remove();
          selectionBox = null;

          const selectionArea = new paper.Rectangle(startPoint, endPoint);

          Object
          .keys(this._wells)
          .map(key => { return this._wells[key]; })
          .filter(well => { return well.isUnder(selectionArea); })
          .forEach(well => { well.select(); });
        }
      });
    }
  }

  get htmlElement() {
    return this._element;
  }

  get hasWells() {
    return this._wells.length > 0;
  }

  get numberOfWells() {
    return this._wells.length;
  }

  get wellIds() {
    return this._wells.map(well => well.id).filter(id => id !== undefined);
  }

  get wellPositions() {
    return this._wells.map(well => { return { x: well.x, y: well.y, id: well.id }});
  }

  get isInFocus() {
    throw "Not implemented";
  }

  get focusedWellId() {
    throw "Not implemented";
  }

  get selectedWellIds() {
    throw "Not implemented";
  }

  get notSelectedWellIds() {
    throw "Not implemented";
  }

  selectWell(wellId) {
    const well = this._wells[wellId];

    if (well === undefined)
      throw "Cannot select ${wellId}, does not exist in the plate";
    else well.select();
  }

  selectWells(wellIds) {
    wellIds.forEach(this.selectWell);
  }

  deSelectWell(wellId) {
    const well = this._wells[wellId];

    if (well === undefined)
      throw "Cannot select ${wellId}, does not exist in the plate.";
    else well.deSelect();
  }

  deSelectWells(wellIds) {
    wellIds.forEach(this.deselectWell);
  }

  clearSelection() {
    for (var id in this._wells)
      this.deSelectWell(id);
  }

  _gridCoordinateToViewCoordinate({ x: x, y: y }) {
    const scaledX = (x / this._gridWidth) * this._element.width;
    const scaledY = (y / this._gridWidth) * this._element.height;

    return { x: scaledX, y: scaledY };
  }

  _createWellUiElement(well) {
    const coord = this._gridCoordinateToViewCoordinate(well);

    var circle = new paper.Path.Circle(new paper.Point(coord.x, coord.y), this._wellDiameter);
    circle.strokeColor = "black";

    circle.fillColor = "white";

    return circle;
  }

  serialize() {
  }

  static deserialize(json) {
  }

  static _testWellCoordinate(coordinate) {
    if(coordinate === undefined)
      throw "Platey: A well provided to the Platey constructor did not have an `x` property";

    if(Platey._isNotNumeric(coordinate))
      throw "Platey: A well provided to the Platey constructor has an invalid `x` value (${well.x}). Value must be a number between 0 and 100";

    if(coordinate >= 100 || coordinate < 0)
      throw "Platey: A well provided to the Platey constructor has an invalid `x` value (${well.x}). Value must be a number between 0 and 100";
  }

  static _isNotNumeric(n) {
    // From: http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric#1830844
    return isNaN(parseFloat(n)) || !isFinite(n);
  }

  static _containsDuplicates(array) {
    return array.some(function(element, i) {
      return array.indexOf(element) != i;
    });
  }

  static _generateGuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
}

class _Well {
  constructor(uiElement) {
    this._uiElement = uiElement;
    this._isSelected = false;
    this._isHoveredOver = false;

    // Hovering over it
    uiElement.attach("mouseenter", this.mouseOver.bind(this));
    uiElement.attach("mouseleave", this.mouseLeave.bind(this));

    uiElement.attach("mousedown", this.select.bind(this));
  }

  get isSelected() {
    return this._isSelected;
  }

  get isHoveredOver() {
    return this._isHoveredOver;
  }

  get viewX() {
    return this._uiElement.x;
  }

  get viewY() {
    return this._uiElement.y;
  }

  select(e = null) {
    if (e != null)
      e.stopPropagation();

    this._uiElement.fillColor = "blue";
  }

  deSelect(e = null) {
    if (e != null)
      e.stopPropagation();

    this._uiElement.fillColor = "white";
  }

  mouseOver() {
    this._uiElement.scale(1.5);
  }

  mouseLeave() {
    this._uiElement.scale(0.666);
  }

  isUnder(rect) {
    return this._uiElement.isInside(rect);
  }
}