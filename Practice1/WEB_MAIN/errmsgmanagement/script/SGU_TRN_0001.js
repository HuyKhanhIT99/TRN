/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : SGU_TRN_0001.js
*@FileTitle : Error Message Management
*Open Issues :
*Change history :
*@LastModifyDate : 2022.05.06
*@LastModifier : 
*@LastVersion : 1.0
* 2022.05.05 
* 1.0 Creation
=========================================================*/
function SGU_TRN_0001() {
	this.processButtonClick = tprocessButtonClick;
	this.setSheetObject = setSheetObject;
	this.loadPage = loadPage;
	this.initSheet = initSheet;
	this.initControl = initControl;
	this.doActionIBSheet = doActionIBSheet;
	this.setTabObject = setTabObject;
	this.validateForm = validateForm;
}
var sheetObjects = new Array();
var sheetCnt = 0
var rowcount = 0;
document.onclick = processButtonClick;
function processButtonClick() {
	/** *** setting sheet object **** */
	var sheetObject1 = sheetObjects[0];
	/** **************************************************** */
	var formObj = document.form;
	try {
		var srcName = ComGetEvent("name");
		switch (srcName) {
			case "btn_Retrieve":
				doActionIBSheet(sheetObject1, formObj, IBSEARCH);
				break;
			case "btn_Add":
				doActionIBSheet(sheetObject1, formObj, IBINSERT);
				break;
			case "btn_Save":
				doActionIBSheet(sheetObject1, formObj, IBSAVE);
				break;
			case "btn_DownExcel":
				doActionIBSheet(sheetObject1, formObj, IBDOWNEXCEL);
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
function loadPage() {
	for (i = 0; i < sheetObjects.length; i++) {
		ComConfigSheet(sheetObjects[i]);
		initSheet(sheetObjects[i], i + 1);
		ComEndConfigSheet(sheetObjects[i]);
	}
	//auto search data after loading finish.
	doActionIBSheet(sheetObjects[0], document.form, IBSEARCH);
}

function setSheetObject(sheet_obj) {
	sheetObjects[sheetCnt++] = sheet_obj;
}

function doActionIBSheet(sheetObj, formObj, sAction) {
	switch (sAction) {
		case IBSEARCH:
			ComOpenWait(true);
			formObj.f_cmd.value = SEARCH;
			sheetObj.DoSearch("SGU_TRN_0001GS.do", FormQueryString(formObj));
			break;
		case IBSAVE:
			formObj.f_cmd.value = MULTI;
			sheetObj.DoSave("SGU_TRN_0001GS.do", FormQueryString(formObj));
			break;
		case IBINSERT:
			sheetObj.DataInsert();
			break;
		case IBDOWNEXCEL:
			if (sheetObj.RowCount() < 1) {
				ComShowCodeMessage("COM132501");
			} else {
				sheetObj.Down2Excel({ DownCols: makeHiddenSkipCol(sheetObj), SheetDesign: 1, Merge: 1 });
			}
			break;//??????????????????

	}
}
function initSheet(sheetObj, sheetNo) {
	var cnt = 0;
	var sheetID = sheetObj.id;
	switch (sheetID) {
		case "sheet1":
			with (sheetObj) {
				var HeadTitle = "|Del|Msg Cd|Msg Type|Msg level|Message|Description";
				var headCount = ComCountHeadTitle(HeadTitle);

				SetConfig({ SearchMode: 2, MergeSheet: 5, Page: 20, FrozenCol: 0, DataRowMerge: 1 });

				var info = { Sort: 1, ColMove: 1, HeaderCheck: 0, ColResize: 1 };
				var headers = [{ Text: HeadTitle, Align: "Center" }];
				InitHeaders(headers, info);

				var cols = [{ Type: "Status", Hidden: 1, Width: 30, Align: "Center", ColMerge: 0, SaveName: "ibflag" },
				{ Type: "DelCheck", Hidden: 0, Width: 45, Align: "Center", ColMerge: 1, SaveName: "DEL", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 1, InsertEdit: 1 },
				{ Type: "Text", Hidden: 0, Width: 80, Align: "Center", ColMerge: 0, SaveName: "err_msg_cd", KeyField: 1, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 1 },
				{ Type: "Combo", Hidden: 0, Width: 80, Align: "Center", ColMerge: 0, SaveName: "err_tp_cd", KeyField: 1, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 1, InsertEdit: 1, ComboText: "Server|UI|Both", ComboCode: "S|U|B" },
				{ Type: "Combo", Hidden: 0, Width: 80, Align: "Center", ColMerge: 0, SaveName: "err_lvl_cd", KeyField: 1, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 1, InsertEdit: 1, ComboText: "ERR|WARNING|INFO", ComboCode: "E|W|I" },
				{ Type: "Text", Hidden: 0, Width: 400, Align: "Left", ColMerge: 0, SaveName: "err_msg", KeyField: 1, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 1, InsertEdit: 1, MultiLineText: 1 },
				{ Type: "Text", Hidden: 0, Width: 250, Align: "Left", ColMerge: 0, SaveName: "err_desc", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 1, InsertEdit: 1, AcceptKeys: "N|E" }];
				InitColumns(cols);
				SetWaitImageVisible(0);
				resizeSheet();
			}
			break;
	}
}

function resizeSheet() {
	ComResizeSheet(sheetObjects[0]);
}
function sheet1_OnChange(sheetObj, Row, Col) {
	var code = sheetObj.GetCellValue(Row, Col);
	if (Col == 2) {
		if (validationErrMsgCd(sheetObj, Row, Col))
			checkDuplicate(sheetObj, Row, Col);
	}
}
function checkDuplicate(sheetObj, Row, Col) {
	var formObj = document.form;
	var code = sheetObj.GetCellValue(Row, Col);
	formObj.s_err_msg_cd.value = code;
	formObj.f_cmd.value = SEARCH01;
	var on = sheetObj.GetSearchData("SGU_TRN_0001GS.do", FormQueryString(formObj));
	var returnVal = ComGetEtcData(on, "duplicated");
	if (returnVal != undefined) {
		returnVal = returnVal.replace("[$s]", code)
		ComShowMessage(returnVal, code);
		sheetObj.SetCellValue(Row, Col, "", 0);
	}
	formObj.s_err_msg_cd.value = '';
}
function sheet1_OnBeforeSave() {

}
function sheet1_OnSearchEnd(sheetObj, Code, Msg, StCode, StMsg) {
	ComOpenWait(false);
}
function sheet1_OnSaveEnd(sheetObj, Code, Msg, StCode, StMsg) {
	var sRow = sheetObjects[0].FindStatusRow("I");
	var arRow = sRow.split(";");
	for (var i = 0; i < arRow.length; i++) {
		if (Msg.includes(sheetObjects[0].GetCellValue(arRow[i], "err_msg_cd"))) {
			sheetObj.SetRowBackColor(arRow[i], "#FF6666");
		}
	}

}

function validationErrMsgCd(sheetObj, Row, Col) {
	var code = sheetObj.GetCellValue(Row, Col);
	var errMsgCdFormat = /^[A-Z]{3}[0-9]{5}$/;
	if (!code.match(errMsgCdFormat)) {
		ComShowCodeMessage("COM132201", code);
		sheetObj.SetCellValue(Row, Col, "", 0);/// 0 l?? kh??ng choa on change
		sheetObj.SelectCell(sheetObj.GetSelectRow(), 2, 1);
		return false;
	}
	return true;

}
