/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : SGU_TRN_0004.js
*@FileTitle : 
*Open Issues : No
*Change history : Change comment
*@LastModifyDate : 2022.06.09
*@LastModifier : Huy
*@LastVersion : 1.0
* 1.0 Creation
=========================================================*/
var sheetObjects = new Array();
var comboObjects = new Array();
var sheetCnt = 0;
var comboCnt = 0;
//Event handler when click button.
document.onclick = processButtonClick;
/**
 * This function handler button.
 * */
function processButtonClick() {
	var formObj = document.form;
	var cal = ComCalendar();
	try {
		// Get event name which corresponding to button.
		var srcName = ComGetEvent("name");
		switch (srcName) {
			// Event fires when retrieve button is clicked.
			case "btn_Retrieve":
				doActionIBSheet(sheetObjects[0], formObj, IBSEARCH);
				break;
			// Event fires when New button is clicked, reset form.	
			case "btn_New":
				onclickButtonNew();
				break;
			// Event fires when DownExcel button is clicked, down sheet to excel file.
			case "btn_DownExcel":
				doActionIBSheet(sheetObjects[0], formObj, IBDOWNEXCEL);
				break;
			// Event fires when Delete button is clicked, delete current row.
			case "btn_Delete":
				doActionIBSheet(sheetObjects[0], formObj, IBDELETE);
				break;
			// Event fires when Add button is clicked, add new row.
			case "btn_Add":
				doActionIBSheet(sheetObjects[0], formObj, IBINSERT);
				break;
			// Event fires when Save button is clicked, save new data.
			case "btn_Save":
				doActionIBSheet(sheetObjects[0], formObj, IBSAVE);
				break;
			// Event fires when Calendar button is clicked, choose date.
			case "btns_calendar1":
				cal.select(formObj.s_cre_dt_fm, "yyyy-MM-dd");
				break;
			// Event fires when Calendar button is clicked, choose date.
			case "btns_calendar2":
				cal.select(formObj.s_cre_dt_to, "yyyy-MM-dd");
				break;
		}

	} catch (e) {
		if (e == "[object Error]") {
			ComShowCodeMessage('JOO00001');
		} else {
			ComShowMessage(e.message);
		}
	}
}
/**
 *  This function calls a common function that sets the default settings of the sheet,
 *  It is the first called area when file *jsp onload event.
 * */
function loadPage() {
	// Generate Grid Layout.
	for (i = 0; i < sheetObjects.length; i++) {
		ComConfigSheet(sheetObjects[i]);
		initSheet(sheetObjects[i]);
		ComEndConfigSheet(sheetObjects[i]);
	}

	s_cre_dt_to.disabled = true;
	s_cre_dt_fm.disabled = true;
	// Generate dopdownlist data combo box.
	for (var k = 0; k < comboObjects.length; k++) {
		initCombo(comboObjects[k], k + 1);
	}
	// Search data after loading finish.
	doActionIBSheet(sheetObjects[0], document.form, IBSEARCH);
}
/**
 * Registering IBCombo Object as list parameter : combo_obj adding process for list
 * in case of needing batch processing with other items defining list on the top of source.
 * 
 * @param combo_obj: String - combo object name.
 * */
function setComboObject(combo_obj) {
	comboObjects[comboCnt++] = combo_obj;
}
/**
 * This function that define the basic properties of the combo.
 * 
 * @param comboObj:    IBSheet Object.
 * @param comboNo :    Number of IBMultiCombo Object.
 * */
function initCombo(comboObj, comboNo) {
	var formObj = document.form
	switch (comboNo) {
		case 1:
			with (comboObj) {
				// Could select multi box in combobox.
				SetMultiSelect(1);
				// Could select multi box in combobox.
				SetDropHeight(200);
			}

			pastnerList = "ALL|" + pastnerList;
			// Split all components to array.
			var comboItems = pastnerList.split("|");
			// Then add content to combo.
			addComboItem(comboObj, comboItems);
			// Default selection at index 0.
			comboObj.SetSelectIndex(0, 1, 0, 0);
			break;
	}
}
/**
 * This function adding data to combo field.
 * Web IBMultiCombo object.InsertItem(Index, Text, Code);
 * 
 * @param comboObj:   - IBMultiCombo Object name.
 * @param comboItems: - Item ComboText.
 */
function addComboItem(comboObj, comboItems) {
	for (var i = 0; i < comboItems.length; i++) {
		var comboItem = comboItems[i].split(",");
		if (comboItem.length == 1) {
			comboObj.InsertItem(i, comboItem[0], comboItem[0]);
		} else {
			comboObj.InsertItem(i, comboItem[0] + "|" + comboItem[1], comboItem[1]);
		}

	}
}
/**
 * An event occurs when the selected item is changed.
 * @param OldIndex: String Old index value
 * @param OldText: String Old text value
 * @param OldCode: String Old code value
 * @param NewIndex: String New index value: 
 * @param NewText: String New text value
 * @param NewCode: String New code value
 * */
function s_jo_crr_cd_OnChange(OldText, OldIndex, OldCode, NewText, NewIndex, NewCode) {
	if (OldIndex == 0) {
		s_jo_crr_cd.SetItemCheck(0, 0, 0);
	}
	if (NewIndex == -1) {
		s_jo_crr_cd.SetItemCheck(0, 1, 0);
	} else if (OldIndex != 0) {
		var newIndexArr = NewIndex.split(",");
		if (newIndexArr[newIndexArr.length - 1] == 0) {
			for (var i = 0; i < newIndexArr.length; i++) {
				var itemChk = parseInt(newIndexArr[i]);
				s_jo_crr_cd.SetItemCheck(itemChk, 0, 0);
			}
			s_jo_crr_cd.SetItemCheck(0, 1, 0);
		}
	}
}
/**
 * This function initSheet define the basic properties of the sheet on the screen.
 * 
 * @param sheetObj: IBSheet Object.
 * @param sheetNo:  Number of IBSheet Object.
 * */
function initSheet(sheetObj) {
	var cnt = 0;
	var sheetID = sheetObj.id;
	switch (sheetID) {
		case "sheet1":
			// Initiated sheet1.
			with (sheetObj) {
				/**
				 * setting for header
				 * 
				 * @param Text:  String of texts to display in header,adjoined by "|"
				 * @param Align: String How to align header text, value default: "Center"
				 */
				var HeadTitle = "Flag|Chk|Carrier|Rev.Lane|Vendor Code|Customer Code|Customer Code|Trade|DeleteFlag|Create Date|Create User ID|Update Date|Update User ID";
				var headCount = ComCountHeadTitle(HeadTitle);
				/**
				 * This function SetConfig Configure how to fetch initialized sheet, location of frozen rows or columns and other basic configurations.
				 * 
				 * @param SearchMode:   Is where you can configure search mode by selecting one from General, Paging,LazyLoad or real-time server processing modes, 
				 *                      the default value is: 0 load all data|1 load by page mode|2 is lazy load.
				 * @param Page:         Number of rows to display in one page (default:20).
				 * @param MergeSheet:   Is where you can configure merge styles, The default value is: 0 no merge|1 merge for all|5 merge only header.
				 * @param DataRowMerge: Whether to allow horizontal merge of the entire row, The default value is: 0
				 **/
				SetConfig({ SearchMode: 2, MergeSheet: 5, Page: 20, FrozenCol: 0, DataRowMerge: 1 });

				/**
				 * info set information for sheet.
				 * 
				 * @param Sort:        Whether to allow sorting by clicking on the header, value default is: 1 yes|0 no.
				 * @param ColMove:     Whether to allow column movement in header, value default is: 1 yes|0 no.
				 * @param HeaderCheck: Whether the CheckAll in the header is checked, value default: 1 yes|0 no.
				 * @param ColResize:   Whether to allow resizing of column width, value default: 1 yes| 0 no.
				 **/
				var info = { Sort: 1, ColMove: 1, HeaderCheck: 0, ColResize: 1 };

				var headers = [{ Text: HeadTitle, Align: "Center" }];
				/**
				 * This function define header of Grid, can define the header title and function using this method.
				 * 
				 * @param headers: Make header list.
				 * @param info:    Set information for sheet.
				 **/
				InitHeaders(headers, info);
				/**
				 * configure for each column
				 * 
				 * @param Type:       String  - Column data type, this is Required.
				 * @param Hidden:     Boolean - Whether a column is hidden, value: 1 hide|0 show.
				 * @param Width:      Number  - Column width.
				 * @param Align:      String  - Data alignment.
				 * @param ColMerge:   Boolean - whether to allow vertical merge for data columns, value: 1 yes|0 no.
				 * @param SaveName:   String  - Can be used to configure the parameter names to use when saving data.
				 * @param KeyField:   Boolean - Whether to make a data cell a required field, value: 1 required| 0 not required.
				 * @param UpdateEdit: Boolean - Can be used to configure editable of data the transaction status of which is Search, value: 1 yes|0 no.
				 * @param InsertEdit: Boolean - can be used to configure editable of data the transaction status of which is Insert, value: 1 yes|0 no.
				 * @param EditLen:    Number  - Can be used to configure the maximum number of characters to allow for a piece of data.
				 **/
				var cols = [
					{ Type: "Status", Hidden: 1, Width: 50, Align: "Center", ColMerge: 0, SaveName: "ibflag" },
					{ Type: "DelCheck", Hidden: 0, Width: 50, Align: "Center", ColMerge: 0, SaveName: "del_chk" },
					{ Type: "Popup", Hidden: 0, Width: 70, Align: "Center", ColMerge: 0, SaveName: "jo_crr_cd", KeyField: 1, Format: "", UpdateEdit: 0, InsertEdit: 1, EditLen: 3 }, // carrier
					{ Type: "Combo", Hidden: 0, Width: 100, Align: "Center", ColMerge: 0, SaveName: "rlane_cd", KeyField: 1, Format: "", UpdateEdit: 0, InsertEdit: 1, ComboText: carrierList, ComboCode: carrierList }, // rev
					{ Type: "PopupEdit", Hidden: 0, Width: 100, Align: "Center", ColMerge: 0, SaveName: "vndr_seq", KeyField: 1, Format: "", UpdateEdit: 1, InsertEdit: 1, EditLen: 6, AcceptKeys: "N" }, // vendor code
					{ Type: "Popup", Hidden: 0, Width: 50, Align: "Center", ColMerge: 0, SaveName: "cust_cnt_cd", KeyField: 1, Format: "", UpdateEdit: 1, InsertEdit: 1, EditLen: 2 }, // Customer code
					{ Type: "Popup", Hidden: 0, Width: 100, Align: "Center", ColMerge: 0, SaveName: "cust_seq", KeyField: 1, Format: "", UpdateEdit: 1, InsertEdit: 1, EditLen: 6 }, // customer  code
					{ Type: "Popup", Hidden: 0, Width: 70, Align: "Center", ColMerge: 0, SaveName: "trd_cd", KeyField: 0, Format: "", UpdateEdit: 1, InsertEdit: 1, EditLen: 3 }, // trade
					{ Type: "Combo", Hidden: 0, Width: 70, Align: "Center", ColMerge: 0, SaveName: "delt_flg", KeyField: 0, Format: "", UpdateEdit: 1, InsertEdit: 1, ComboText: "Yes|No", ComboCode: "Y|N" }, // delete=flag
					{ Type: "Text", Hidden: 0, Width: 150, Align: "Center", ColMerge: 0, SaveName: "cre_dt", KeyField: 0, Format: "", UpdateEdit: 0, InsertEdit: 0 }, // create= date
					{ Type: "Text", Hidden: 0, Width: 180, Align: "Left", ColMerge: 0, SaveName: "cre_usr_id", KeyField: 0, Format: "", UpdateEdit: 0, InsertEdit: 0 }, // create userID
					{ Type: "Text", Hidden: 0, Width: 150, Align: "Center", ColMerge: 0, SaveName: "upd_dt", KeyField: 0, Format: "", UpdateEdit: 0, InsertEdit: 0 }, // updatedate
					{ Type: "Text", Hidden: 0, Width: 180, Align: "Left", ColMerge: 0, SaveName: "upd_usr_id", KeyField: 0, Format: "", UpdateEdit: 0, InsertEdit: 0 } // update userid
				];
				InitColumns(cols);
				/**
				 * Check or configure whether to display waiting image during processing.
				 * The value: 0 no waiting image.
				 * */
				SetWaitImageVisible(0);
				resizeSheet();
			}
			break;
	}

}
/**
 * Event fires when user clicks the pop-up button in the cell that appears when focus is put on the cell,
 * or tries to edit the cell, given that a cell type is either Pop-up or PopupEdit.
 * 
 * @param Row: Long - Row index of the cell.
 * @param Col: Long - Column index of the cell.
 * */
function sheet1_OnPopupClick(sheetObj, col, row) {
	var s1 = sheetObjects[0].ColSaveName(row);
	switch (s1) {
		case "trd_cd":
			/**
			 * This function open the pop-up.
			 * 
			 * @param sUrl: {string} - Required, pop-up address to be called.
			 * @param iWidth: {int} - Required, the width of the pop-up window
			 * @param iHeight: {int} - Required, the height of the pop-up window
			 * @param sFunc: {string} - Required, function return data to parent window.
			 * @param sDisplay: {string} - Required, column of the grid in the pop-up window is hidden, value: 1 visible|0 hidden.
			 * @param bModal: {bool} - Selection, is the pop-up modal?
			 * */
			ComOpenPopup('/opuscntr/COM_COM_0012.do', 770, 470, 'setTrd', '1,0,1,1,1,1,1', true, col, row);
			break;
		case "jo_crr_cd":
			ComOpenPopup('/opuscntr/COM_ENS_0N1.do', 770, 470, 'setCrrCd', '1,0,1,1,1', true, col, row);
			break;
		case "vndr_seq":
			ComOpenPopup('/opuscntr/COM_COM_0007.do', 770, 470, 'setVdrCd', '1,0,1,1,1,1,1,1', true, col, row);
			break;
		case "cust_seq":
		case "cust_cnt_cd":
			ComOpenPopup('/opuscntr/CustomerPopup.do', 770, 470, 'setCustServiceSeq', '1,0,1,1,1,1,1,1', true, col, row);
			break;
	}
}

/**
 * This function return data for cell pop-up column trade.
 * */
function setTrd(aryPopupData, row, col) {
	console.log(aryPopupData[0][3]);
	var sheetObject = sheetObjects[0];
	sheetObject.SetCellValue(sheetObject.GetSelectRow(), "trd_cd", aryPopupData[0][3]);
}
/**
 * This function return data for cell pop-up column carrier.
 * */
function setCrrCd(aryPopupData, row, col) {
	console.log(aryPopupData[0][3]);
	var sheetObject = sheetObjects[0];
	sheetObject.SetCellValue(sheetObject.GetSelectRow(), "jo_crr_cd", aryPopupData[0][3]);
}
/**
 * This function return data for cell pop-up column vendor code.
 * */
function setVdrCd(aryPopupData, row, col) {
	var sheetObject = sheetObjects[0];
	sheetObject.SetCellValue(sheetObject.GetSelectRow(), "vndr_seq", aryPopupData[0][2]);
}

/**
 * This function return data for cell pop-up column customer code.
 * */
function setCustServiceSeq(aryPopupData, row, col) {
	var sheetObject = sheetObjects[0];
	sheetObject.SetCellValue(sheetObject.GetSelectRow(), "cust_seq", aryPopupData[0][3]);
	sheetObject.SetCellValue(sheetObject.GetSelectRow(), "cust_cnt_cd", aryPopupData[0][2]);
}
/**
 * Registering IBSheet Object as list adding process for list in case of needing
 * batch processing with other items defining list on the top of source.
 * 
 * @param sheet_obj: String - sheet name.
 **/
function setSheetObject(sheet_obj) {
	sheetObjects[sheetCnt++] = sheet_obj;
}
/**
 * This function resize sheet,
 * If don't call this functions, it will may make UI breakable.
 * */
function resizeSheet() {
	ComResizeSheet(sheetObjects[0]);
}
/**
 *  This function defines the transaction logic between the user interface and the server of IBSheet.
 *  
 *  @param sheetObj:  IBSSheet Object.
 *  @param formObj :  Form object.
 *  @param sAction :  Action Code (e.g. IBSEARCH, IBSAVE, IBDELETE, IBDOWNEXCEL).
 * */
function doActionIBSheet(sheetObj, formObj, sAction) {
	switch (sAction) {
		// Retrieve button event.
		case IBSEARCH:
			ComOpenWait(true);
			formObj.f_cmd.value = SEARCH;
			console.log(formObj.s_jo_crr_cd.value);
			sheetObj.DoSearch("SGU_TRN_0004GS.do", FormQueryString(formObj));
			break;
		// Row Add button event.
		case IBINSERT:
			sheetObj.DataInsert(-1);
			break;
		// Save data button event.
		case IBSAVE:
			formObj.f_cmd.value = MULTI;
			var SaveStr = sheetObj.GetSaveString();
			if (SaveStr != "") {
				ComOpenWait(true);
				if (confirm("Do you want to save?")) {
					var rtnData = sheetObj.GetSaveData("SGU_TRN_0004GS.do", SaveStr, FormQueryString(formObj));
					sheetObj.LoadSaveData(rtnData);
				}
			} else {
				ComShowMessage("Nothing to save. Saving is cancelled.");
			}
			break;
		// Row Delete button event
		case IBDELETE:
			if (sheetObjects[0].RowCount("D") > 0) {
				if (confirm("Do you delete selected row?")) {
					//sheetObj.SetRowStatus(sheetObj.GetSelectRow(),"D");
					formObj.f_cmd.value = MULTI;
					var SaveStr = sheetObj.GetSaveString();
					if (sheetObj.IsDataModified && SaveStr == "") return;
					var rtnData = sheetObj.GetSaveData("SGU_TRN_0004GS.do", SaveStr, FormQueryString(formObj));
					sheetObj.LoadSaveData(rtnData);
				}
			}
			break;
		// Row Down excel button event
		case IBDOWNEXCEL:
			if (sheetObj.RowCount() < 1) {
				ComShowCodeMessage("COM132501");
			} else {
				ComOpenWait(true);
				sheetObj.Down2Excel({ DownCols: makeHiddenSkipCol(sheetObj), SheetDesign: 1, Merge: 1 });
			}
			break;
	}
}
function initControl() {
	document.getElementById('s_vndr_seq').addEventListener('keypress', function () { ComKeyOnlyNumber(this); });
}
function onclickButtonNew() {
	sheetObjects[0].RemoveAll();
	document.form.reset();

	s_jo_crr_cd.SetItemCheck(0, 1, 1);

}
/**
 * This function load search data went add button completed.
 * Event fires when saving is completed using saving function and other internal processing has been also completed.
 * */
function sheet1_OnSaveEnd(sheetObj, Code, Msg, StCode, StMsg) {
	ComOpenWait(false);
	if (Code < 0) {
		document.form.reset();
		s_jo_crr_cd.SetItemCheck(0, 1, 1);
		doActionIBSheet(sheetObjects[0], document.form, IBSEARCH);
	}
}
/**
 * This function close image wait.
 * Event fires when search is completed using a search function and other internal data processing are also completed.
 * ComOpenWait() :configure whether a loading image will appears and lock the screen, value: true lock screen| false normal.
 * */
function sheet1_OnSearchEnd(sheetObj, Code, Msg, StCode, StMsg) {
	ComOpenWait(false);
}
/**
 * This function handling when sheet1 on change.
 * Event fires when the cell editing is completed and the previous value has been updated.
 * ColSaveName(): Check the SaveName set in InitColumns function that corresponds to Index of a particular column.
 * GetSearchData(): Call search page, complete search and return search result data in string.
 * 
 * @param sheetObj : Object  - Object sheet.
 * @param Row      : Long    - Row index of the cell.
 * @param Col      : Long    - Column index of the cell.
 * @param Value    : string  - Updated value.
 * @param OldValue : string  - Value before update.
 * @param RaiseFlag: Integer - Event fire option, value: 0 manual editing|1 method|2 paste.
 * */
function sheet1_OnChange(sheetObj, Row, Col) {
	var colName = sheetObj.ColSaveName(Col)
	if (colName == "jo_crr_cd" && colName == "rlane_cd") {
		if (sheetObj.GetCellValue(Row, "jo_crr_cd") != "" && sheetObj.GetCellValue(Row, "rlane_cd") != "") {
			if (sheetObj.ColValueDup("jo_crr_cd|rlane_cd") > -1) {
				ComShowCodeMessage("COM12115", "This row can't insert , it");

			}
			var formObj = document.form
			formObj.f_cmd.value = SEARCH01;
			formObj.s_jo_crr_cd.value = sheetObj.GetCellValue(Row, "jo_crr_cd");
			formObj.s_rlane_cd.value = sheetObj.GetCellValue(Row, "rlane_cd");
			var xml = sheetObj.GetSearchData("SGU_TRN_0004GS.do", FormQueryString(formObj));
			var msgInfo = ComGetEtcData(xml, "duplicated");
			var msg = msgInfo.split("<||>");
			ComShowMessage(msg[3]);
		}
	}
}
function sheet1_OnDownFinish(downloadType, result) {
	ComOpenWait(false);
	if (!result) {
		ComShowCodeMessage("COM131102", "data");
	} else {
		ComShowCodeMessage("COM131101", "data");
		COM131101
	}
}

function SGU_TRN_0004() {
	this.processButtonClick = tprocessButtonClick;
	this.setSheetObject = setSheetObject;
	this.loadPage = loadPage;
	this.initSheet = initSheet;
	this.initControl = initControl;
	this.doActionIBSheet = doActionIBSheet;
	this.setTabObject = setTabObject;
	this.validateForm = validateForm;
}
