
/*:
 * @plugindesc Popup a window to display what item you get from the event
 * @author galuodo
 *
 * @param Offset X
 * @desc The offset value for the x coordinate.
 * @default 0
 *
 * @param Offset Y
 * @desc The offset value for the y coordinate.
 * @default 0
 *
 * @help This plugin does not provide plugin commands.
 */
var parameters = PluginManager.parameters('GainItem');
Scene_GainItem.prototype._currItem;
var offsetX = Number(parameters['Offset X'] || 0);
var offsetY = Number(parameters['Offset Y'] || 0);
Game_Interpreter.prototype.command126 = function () {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    $gameParty.gainItem($dataItems[this._params[0]], value);
    Scene_GainItem._currItem = $dataItems[this._params[0]];
 //   console.log(Scene_GainItem._currItem.name + " " + Scene_GainItem._currItem.iconIndex)
    SceneManager.push(Scene_GainItem);
    return true;
};

function Scene_GainItem() {
    this.initialize.apply(this, arguments);
}

Scene_GainItem.prototype = Object.create(Scene_MenuBase.prototype);
Scene_GainItem.prototype.constructor = Scene_GainItem;

Scene_GainItem.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_GainItem.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createMissionWindow(Scene_GainItem.itemName);
};

Scene_GainItem.prototype.start = function () {
    Scene_MenuBase.prototype.start.call(this);

};

Scene_GainItem.prototype.update = function () {
    var active = this.isActive();
    $gameTimer.update(active);
    $gameScreen.update();
    if (Input.isTriggered('ok') || Input.isTriggered('cancel') || TouchInput.isTriggered()) {
        SceneManager.pop();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function GainObjectPopup() {
    this.initialize.apply(this, arguments);
}

GainObjectPopup.prototype = Object.create(Window_Base.prototype);
GainObjectPopup.prototype.constructor = GainObjectPopup;

GainObjectPopup.prototype.initialize = function (x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
};

GainObjectPopup.prototype.windowWidth = function () {
    return 480;
};

GainObjectPopup.prototype.windowHeight = function () {
    return this.fittingHeight(1);
};

GainObjectPopup.prototype.refresh = function () {
    var x = this.textPadding();
    this.contents.clear();
    this.drawTextEx(this.value(), 48, 0);
    this.drawIcon(Scene_GainItem._currItem.iconIndex, 2, 2);
};

GainObjectPopup.prototype.value = function () {
    return "获得 [" + Scene_GainItem._currItem.name + "]";
};


GainObjectPopup.prototype.open = function () {
    this.refresh();
    Window_Base.prototype.open.call(this);
};


Scene_GainItem.prototype.createMissionWindow = function (item) {
    this._currItem = item;
    this._missionWindow = new GainObjectPopup(0, 200);
    this._missionWindow.y = (Graphics.boxHeight - this._missionWindow.height) / 2 + offsetY;
    this._missionWindow.x = (Graphics.boxWidth - this._missionWindow.width) / 2 + offsetX;
    this.addWindow(this._missionWindow);

}