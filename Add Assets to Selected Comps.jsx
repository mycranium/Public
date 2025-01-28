{
  function myScript(thisObj) {
    function myScript_buildUI(thisObj) {
      var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Add Assets to Selected Comps", undefined, { resizeable: true });

      res = "group{\
              orientation: 'column',\
              alignment:['fill','fill'],\
              alignChildren:['fill','fill'],\
              resizeable:true,\
              assetGrp: Group{\
                orientation:'column',\
                alignChildren:['fill','fill'],\
                alignment:['fill','fill'],\
                assetPanel: Panel{\
                  text:'Asset Folder',\
                  assetInst: StaticText{\
                    alignment:['fill','fill'],\
                    properties:{multiline:true},\
                    text: 'Select the asset folder in the project panel, then click the \"Select Assets\" button.',\
                    helpTip: 'Make sure the asset folder is the only item selected in the project panel.\\n\\nSelect the folder only - do not select items in the folder.'\
                  },\
                  assetBtn: Button{text:'Select Assets'},\
                  assetConf: Group{\
                    orientation:'row',\
                    alignChildren:['fill','fill'],\
                    alignment:['fill','fill'],\
                    selectedAssetsLbl: StaticText{text:'Asset Folder: ', alignment: 'left'},\
                    selectedAssets: StaticText{text:''}\
                  }\
                }\
              },\
              compGrp: Group{\
                orientation:'column',\
                alignChildren:['fill','fill'],\
                alignment:['fill','fill'],\
                compPanel: Panel{\
                  text:'Comp Folder',\
                  compInst: StaticText{\
                    alignment:['fill','fill'],\
                    properties:{multiline:true},\
                    text: 'Select the comp folder in the project panel, then click the \"Select Comps\" button.',\
                    helpTip: 'Make sure the comp folder is the only item selected in the project panel.\\n\\nSelect the folder only - do not select items in the folder.'\
                  },\
                  compBtn: Button{text:'Select Comps'},\
                  compConf: Group{\
                    orientation:'row',\
                    alignChildren:['fill','fill'],\
                    alignment:['fill','fill'],\
                    selectedCompsLbl: StaticText{text:'Comp Folder: ', alignment: 'left'},\
                    selectedComps: StaticText{text:''}\
                  }\
                }\
              },\
              startGrp: Group{\
                orientation:'column',\
                alignChildren:['fill','fill'],\
                alignment:['fill','fill'],\
                startPanel: Panel{\
                  text:'Asset Start Time (seconds)',\
                  startInst: StaticText{\
                    alignment:['fill','fill'],\
                    properties:{multiline:true},\
                    text: 'Set the start time for the asset in the comp timeline, in seconds.',\
                    helpTip: 'Negative values are permitted.'\
                  },\
                  startNum: EditText{characters: 7, text: '0'},\
                  startSldr: Slider{minvalue: -100, maxvalue: 100, value: 0, alignment: 'fill'},\
                }\
              },\
              btnGrp: Group{\
                orientation:'column',\
                goBtn: Button{text:'Add Layers to Comps'},\
                resetBtn: Button{text: 'Reset Fields'}\
              }\
            }";

      myPanel.grp = myPanel.add(res);
      myPanel.layout.layout(true);
      myPanel.grp.minimumSize = myPanel.grp.size;
      myPanel.layout.resize();
      myPanel.onResizing = myPanel.onResize = function () { this.layout.resize() };

      var assetBtn = myPanel.grp.assetGrp.assetPanel.assetBtn;
      var compBtn = myPanel.grp.compGrp.compPanel.compBtn;
      var slider = myPanel.grp.startGrp.startPanel.startSldr;
      var strtNum = myPanel.grp.startGrp.startPanel.startNum;
      var goBtn = myPanel.grp.btnGrp.goBtn;
      var resetBtn = myPanel.grp.btnGrp.resetBtn;
      
      assetBtn.onClick = function () {
        myPanel.grp.assetGrp.assetPanel.assetConf.selectedAssets.text = ""; // clear field
        var mySelects = app.project.selection;
        // Validate selections
        if (mySelects.length === 0) {
          return alert("No folder selected.");
        }
        if (mySelects.length > 1) {
          return alert("You may only select one folder item.")
        }
        if (validateSelection("assets")) {
          myPanel.grp.assetGrp.assetPanel.assetConf.selectedAssets.text = mySelects[0].name;
        } else {
          return alert("There are no assets in this folder. Subfolders are not searched.");
        }
      }

      compBtn.onClick = function () {
        myPanel.grp.compGrp.compPanel.compConf.selectedComps.text = "";
        var mySelects = app.project.selection;
        if (mySelects.length === 0) {
          return alert("No folder selected.");
        }
        if (mySelects.length > 1) {
          return alert("You may only select one folder item.")
        }
        if (validateSelection("comps")) {
          myPanel.grp.compGrp.compPanel.compConf.selectedComps.text = mySelects[0].name;
        } else {
          return alert("There are no comps in this folder. Subfolders are not searched.");
        }
      }

      slider.onChanging = function () { // Update displayed number on slider drag
        strtNum.text = this.value.toFixed(4);
      }

      strtNum.onChange = function () { // Update slider position on number entry, validating number
        var myNum = this.text;
        if (isNaN(parseFloat(myNum))) {
          this.text = slider.value.toFixed(4);
          alert('Only numbers are permitted.');
        } else {
          slider.value = parseFloat(myNum).toFixed(4);
        }
      }

      goBtn.onClick = function () {
        if (rejectDupes(myPanel.grp)) {addLayers(myPanel.grp);} 
      }

      resetBtn.onClick = function () {
        myPanel.grp.assetGrp.assetPanel.assetConf.selectedAssets.text = "";
        myPanel.grp.compGrp.compPanel.compConf.selectedComps.text = "";
        slider.value = 0;
        strtNum.text = "0";
      }

      return myPanel;
    }

    var myScriptPal = myScript_buildUI(thisObj);
    if ((myScriptPal != null) && (myScriptPal instanceof Window)) {
      myScriptPal.center();
      myScriptPal.show();
    }
  }
  myScript(this);
}

function rejectDupes(grp) { // Validate that both folder types are selected and not the same
  try {
  var assetFldrName = grp.assetGrp.assetPanel.assetConf.selectedAssets.text;
  var compFldrName = grp.compGrp.compPanel.compConf.selectedComps.text;
    var noAssetMsg = "an Asset folder";
    var noCompsMsg = "a Comps folder";
    var unSelMsg = "You must select ";
    if (assetFldrName !== "" && compFldrName !== "" && assetFldrName !== compFldrName) {
      return true;
    }
    if (assetFldrName === "" && compFldrName === "") {
      unSelMsg += noAssetMsg + " and " + noCompsMsg + ".";
    } else if (assetFldrName === "") {
      unSelMsg += noAssetMsg + ".";
    } else if (compFldrName === "") {
      unSelMsg += noCompsMsg + ".";
    } else if (assetFldrName === compFldrName) {
      unSelMsg = "Comps folder and Assets folder cannot be the same folder (or have the same name)";
    }
    alert(unSelMsg);
  } catch (e) {alert(e.line + ", " + e.message);}
    return false;
}

function validateSelection(type) {
try {  var myFldr = app.project.selection[0];
  var fldrLen = myFldr.numItems;
  var hasItems = false;
  for (var i = 1; i <= fldrLen; i++) {
    var myItem = myFldr.items[i];
    if (type === "assets") {
      if (myItem.typeName !== "Folder") {
        hasItems = true;
        break;
      }
    } else if (type === "comps") {
      if (myItem.typeName === "Composition") {
        hasItems = true;
        break;
      }
    }
  }
  return hasItems;
} catch (e) {alert(e.line + ", " + e.message);}
}

function addLayers(grp) {
  app.beginUndoGroup("Add Assets to Selected Comps");
  try {
    var assetFldrName = grp.assetGrp.assetPanel.assetConf.selectedAssets.text;
    var compFldrName = grp.compGrp.compPanel.compConf.selectedComps.text;
    var assetTime = grp.startGrp.startPanel.startSldr.value.toFixed(4); // Set start time for asset in comp
    // Get asset and comp folder items
    var projItems = app.project.items;
    var projLen = app.project.numItems;
    var assetFldr;
    var compFldr;
    for (var i = 1; i <= projLen; i++) {
      var myItem = projItems[i];
      if (myItem.typeName != "Folder") {
        continue;
      } else {
        if (myItem.name === assetFldrName) {
          assetFldr = myItem;
        } else if (myItem.name === compFldrName) {
          compFldr = myItem;
        }
      }
      if (assetFldr && compFldr) {
        break;
      }
    }
    var failArray = []; // Collect names of comps that haven't had assets added
    var numItems = compFldr.numItems;
    var numAssets = assetFldr.numItems;
    var compCount = 0;
    for (var c = 1; c <= numItems; c++) { // Iterate over comps folder items
      var added = false; // Has comp had asset added?
      var myItem = compFldr.items[c];
      if (myItem.typeName === "Composition") { // if item is a comp item, loop assets to find matching asset
        var nameArr = myItem.name.split("_"); // Hard-coded matching for Road-eo project asset names
        var matchName = nameArr[1] + nameArr[2];
        for (var a = 1; a <= numAssets; a++) {
          var myAsset = assetFldr.items[a];
          if (myAsset.name.indexOf(matchName.toLowerCase()) !== -1) {
            var newLayer = myItem.layers.add(myAsset);
            newLayer.startTime = assetTime;
            added = true; // Match found, so asset added to this comp
            compCount++;
            break;
          } else {
            added = false; // if no match found, no asset added
          }
        }
        if (added === false) { // Push comps without assets added into fail array
          failArray.push(myItem.name);
        }
      }
    }
  } catch (e) { alert(e.line + ", " + e.message); }
  var outMessage = "";
  if (compCount === 0) { // If no cops had assets added
    outMessage = "Assets were not added to any comps. Please check your selections and try again.";
  } else if (compCount > 0 && failArray.length > 0) { // If some comps had assets added and some didn't
    outMessage = "Operation complete. Assets were not added to these comps:\r\r" + failArray.join("\r");
  } else if (compCount > 0 && failArray.length === 0) { // If comps had assets added and none didn't
    outMessage = (failArray.length > 0) ? failList : "Operation complete.All comps updated.";
  }
  if (outMessage !== "") {
    alert(outMessage);
  }
  app.endUndoGroup();
}