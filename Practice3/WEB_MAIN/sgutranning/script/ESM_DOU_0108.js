/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : ESM_DOU_0108.js
*@FileTitle : aa
*Open Issues :
*Change history :
*@LastModifyDate : 2022.05.26
*@LastModifier : 
*@LastVersion : 1.0
* 2022.05.26 
* 1.0 Creation
=========================================================*/
/****************************************************************************************
  이벤트 구분 코드: [초기화]INIT=0; [입력]ADD=1; [조회]SEARCH=2; [리스트조회]SEARCHLIST=3;
					[수정]MODIFY=4; [삭제]REMOVE=5; [리스트삭제]REMOVELIST=6 [다중처리]MULTI=7
					기타 여분의 문자상수  COMMAND01=11; ~ COMMAND20=30;
 ***************************************************************************************/

/*------------------다음 코드는 JSDoc을 잘 만들기 위해서 추가된 코드임 ------------------*/
/**
  * @fileoverview 업무에서 공통으로 사용하는 자바스크립트파일로 달력 관련 함수가 정의되어 있다.
  * @author 한진해운
  */

/**
 * @extends 
 * @class ESM_DOU_0108 : ESM_DOU_0108 생성을 위한 화면에서 사용하는 업무 스크립트를 정의한다.
 */
function ESM_DOU_0108() {
	this.processButtonClick = tprocessButtonClick;
	this.setSheetObject = setSheetObject;
	this.loadPage = loadPage;
	this.initSheet = initSheet;
	this.initControl = initControl;
	this.doActionIBSheet = doActionIBSheet;
	this.setTabObject = setTabObject;
	this.validateForm = validateForm;
}

/* 개발자 작업	*/

var sheetObjects = new Array();
var sheetCnt = 0;
var comboObjects = new Array();
var comboCnt = 0;
var comboValues = "";
var tabObjects = new Array();
var tabCnt = 0;
var beforetab = 1;
var laneList = "";
var pastnerValue = "";
var laneValue = "";
var check3month = false;
var paramPastnerSearch = "";
document.onclick = processButtonClick;

function processButtonClick() {
	var formObj = document.form;
	try {
		var srcName = ComGetEvent("name");
		switch (srcName) {
			case "btn_Retrieve":
				if (!checkOverThreeMonth()) {
					if (!check3month) {
						if (confirm("Year Month over 3 months, do you realy want to get data?")) {
							check3month = true;
						} else {
							check3month = false;
							return;
						}
					}
				}
				doActionIBSheet(sheetObjects[0], formObj, IBSEARCH);
				break;
			case "btn_from_back":
				modifyMonth(formObj.fr_acct_yrmon, -1)
				break;
			case "btn_from_next":
				modifyMonth(formObj.fr_acct_yrmon, +1)
				break;

			case "btn_vvd_to_back":
				modifyMonth(formObj.to_acct_yrmon, -1)
				break;
			case "btn_vvd_to_next":
				modifyMonth(formObj.to_acct_yrmon, +1)
				break;
			case "btn_New":
				onclickButtonNew();
				break;
			case "btn_DownExcel":
				doActionIBSheet(sheetObjects[0], formObj, IBDOWNEXCEL);
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
function getCurrentSheet() {
	var sheetObj = null;
	if (beforetab == 0) {
		sheetObj = sheetObjects[0];
	} else {
		sheetObj = sheetObjects[1];
	}

	return sheetObj;
}

function loadPage() {

	// generate Grid Layout
	for (i = 0; i < sheetObjects.length; i++) {
		ComConfigSheet(sheetObjects[i]);
		initSheet(sheetObjects[i], i + 1);
		ComEndConfigSheet(sheetObjects[i]);
	}

	for (var k = 0; k < comboObjects.length; k++) {
		initCombo(comboObjects[k], k + 1);
	}
	initControl();

	for (k = 0; k < tabObjects.length; k++) {
		initTab(tabObjects[k], k + 1);
		tabObjects[k].SetSelectedIndex(0);
	}
	s_rlane_cd.SetEnable(false);
	s_trd_cd.SetEnable(false);
	initPeriod();

	// auto search data after loading finish.
	doActionIBSheet(sheetObjects[0], document.form, IBSEARCH);
}
function initCombo(comboObj, comboNo) {
	var formObj = document.form
	switch (comboNo) {
		case 1:
			with (comboObj) {
				SetMultiSelect(1);
				SetDropHeight(200);
				ValidChar(2, 1);
			}

			pastnerList = "ALL|" + pastnerList;
			var comboItems = pastnerList.split("|");
			addComboItem(comboObj, comboItems);
			comboObj.SetSelectIndex(0, 1, 0, 0);
			break;
	}
}
function addComboItem(comboObj, comboItems) {
	for (var i = 0; i < comboItems.length; i++) {
		var comboItem = comboItems[i].split(",");
		//comboObj.InsertItem(i, comboItem[0] + "|" + comboItem[1], comboItem[1]);
		//NYK Modify 2014.10.21
		if (comboItem.length == 1) {
			comboObj.InsertItem(i, comboItem[0], comboItem[0]);
		} else {
			comboObj.InsertItem(i, comboItem[0] + "|" + comboItem[1], comboItem[1]);
		}

	}
}

function initControl() {

}

function setComboObject(combo_obj) {
	comboObjects[comboCnt++] = combo_obj;
}

function setSheetObject(sheet_obj) {
	sheetObjects[sheetCnt++] = sheet_obj;
}

function initSheet(sheetObj) {
	var cnt = 0;
	switch (sheetObj.id) {
		case "t1sheet1": // sheet1 init
			with (sheetObj) {
				var HeadTitle1 = "|Partner|Lane|Invoice No|Slip No|Approved|Curr.|Revenue|Expense|Customer/S.Provider|Customer/S.Provider|cust_vndr_cnt_cd|cust_vndr_seq";
				var HeadTitle2 = "|Partner|Lane|Invoice No|Slip No|Approved|Curr.|Revenue|Expense|Code|Name|cust_vndr_cnt_cd|cust_vndr_seq";
				var headCount = ComCountHeadTitle(HeadTitle1);
				SetConfig({ SearchMode: 0, MergeSheet: 7, Page: 500, DataRowMerge: 0 });
				var info = { Sort: 0, ColMove: 0, HeaderCheck: 1, ColResize: 0 };
				var headers = [{ Text: HeadTitle1, Align: "Center" }, { Text: HeadTitle2, Align: "Center" }];
				InitHeaders(headers, info);
				var cols = [
					{ Type: "Status", Hidden: 1, Width: 0, Align: "Center", ColMerge: 1, SaveName: "ibflag" },
					{ Type: "Text", Hidden: 0, Width: 50, Align: "Center", ColMerge: 0, SaveName: "jo_crr_cd", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },
					{ Type: "Text", Hidden: 0, Width: 70, Align: "Center", ColMerge: 0, SaveName: "rlane_cd", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },
					{ Type: "Text", Hidden: 0, Width: 90, Align: "Center", ColMerge: 0, SaveName: "inv_no", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },
					{ Type: "Text", Hidden: 0, Width: 120, Align: "Center", ColMerge: 0, SaveName: "csr_no", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },
					{ Type: "Text", Hidden: 0, Width: 90, Align: "Center", ColMerge: 0, SaveName: "apro_flg", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },
					{ Type: "Text", Hidden: 0, Width: 50, Align: "Center", ColMerge: 0, SaveName: "locl_curr_cd", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },
					{ Type: "Float", Hidden: 0, Width: 120, Align: "Right", ColMerge: 0, SaveName: "inv_rev_act_amt", KeyField: 0, CalcLogic: "", Format: "NullFloat", PointCount: 2, UpdateEdit: 0, InsertEdit: 0 },
					{ Type: "Float", Hidden: 0, Width: 120, Align: "Right", ColMerge: 0, SaveName: "inv_exp_act_amt", KeyField: 0, CalcLogic: "", Format: "NullFloat", PointCount: 2, UpdateEdit: 0, InsertEdit: 0 },
					{ Type: "Text", Hidden: 0, Width: 100, Align: "Center", ColMerge: 0, SaveName: "prnr_ref_no", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },//code
					{ Type: "Text", Hidden: 0, Width: 40, Align: "Center", ColMerge: 0, SaveName: "cust_vndr_eng_nm", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },//name	,   
					{ Type: "Text", Hidden: 1, Width: 90, Align: "Left", ColMerge: 0, SaveName: "cust_vndr_cnt_cd", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },
					{ Type: "Text", Hidden: 1, Width: 90, Align: "Left", ColMerge: 0, SaveName: "cust_vndr_seq", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 }
				];

				InitColumns(cols);
				SetWaitImageVisible(0);
				SetEditable(1);
				resizeSheet();
				//ShowSubSum([{StdCol:3 , SumCols:"7|8",ShowCumulate:0,CaptionText:"",CaptionCol:0}]);
			}
			break;
		case "t2sheet1": // sheet2 init
			with (sheetObj) {
				var HeadTitle1 = "|Partner|Lane|Invoice No|Slip No|Approved|Rev / Exp|Item|Curr.|Revenue|Expense|Customer/S.Provider|Customer/S.Provider";
				var HeadTitle2 = "|Partner|Lane|Invoice No|Slip No|Approved|Rev / Exp|Item|Curr.|Revenue|Expense|Code|Name";
				var headCount = ComCountHeadTitle(HeadTitle2);
				SetConfig({ SearchMode: 0, MergeSheet: 5, Page: 500, DataRowMerge: 0 });
				var info = { Sort: 0, HeaderCheck: 1, ColResize: 0 };
				var headers = [{ Text: HeadTitle1, Align: "Center" }, { Text: HeadTitle2, Align: "Center" }];
				InitHeaders(headers, info);

				var cols = [{ Type: "Status", Hidden: 1, Width: 10, Align: "Center", ColMerge: 0, SaveName: "ibflag", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },// 
				{ Type: "Text", Hidden: 0, Width: 50, Align: "Center", ColMerge: 0, SaveName: "jo_crr_cd", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },// partner
				{ Type: "Text", Hidden: 0, Width: 50, Align: "Center", ColMerge: 0, SaveName: "rlane_cd", KeyField: 1, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },//lane
				{ Type: "Text", Hidden: 0, Width: 150, Align: "Center", ColMerge: 0, SaveName: "inv_no", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },//invoice no
				{ Type: "Text", Hidden: 0, Width: 150, Align: "Center", ColMerge: 0, SaveName: "csr_no", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },//slipno
				{ Type: "Text", Hidden: 0, Width: 70, Align: "Center", ColMerge: 0, SaveName: "apro_flg", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },//approved 
				{ Type: "Text", Hidden: 0, Width: 70, Align: "Center", ColMerge: 0, SaveName: "re_divr_cd", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },//rev/exp
				{ Type: "Text", Hidden: 0, Width: 60, Align: "Center", ColMerge: 0, SaveName: "jo_stl_itm_cd", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },//item
				{ Type: "Text", Hidden: 0, Width: 40, Align: "Center", ColMerge: 0, SaveName: "locl_curr_cd", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },//currency 
				{ Type: "Float", Hidden: 0, Width: 100, Align: "Right", ColMerge: 0, SaveName: "inv_rev_act_amt", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },//revenue
				{ Type: "Float", Hidden: 0, Width: 100, Align: "Right", ColMerge: 0, SaveName: "inv_exp_act_amt", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },//expense	
				{ Type: "Text", Hidden: 0, Width: 100, Align: "Center", ColMerge: 0, SaveName: "prnr_ref_no", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 },//code
				{ Type: "Text", Hidden: 0, Width: 40, Align: "Center", ColMerge: 0, SaveName: "cust_vndr_eng_nm", KeyField: 0, CalcLogic: "", Format: "", PointCount: 0, UpdateEdit: 0, InsertEdit: 0 }//name	
				];

				InitColumns(cols);
				SetColProperty(0, "re_divr_cd", { ComboText: "|Rev|Exp", ComboCode: "|R|E", DefaultValue: "R" });
				SetCountPosition();
				SetEditable(1);
				//ShowSubSum([{StdCol:3 , SumCols:"9|10",ShowCumulate:0,CaptionText:"",CaptionCol:0}]);
			}
			break;
	}

}
function t1sheet1_OnDblClick(sheetObj, Row, Col) {
	var dataRows = t1sheet1.GetSelectionRows(",");
	console.log(dataRows);
	var inv_no = sheetObj.GetCellValue(Row, "inv_no");
	tab1_OnChange(tabObjects[1], 1);
	var x = t2sheet1.FindText(3, inv_no);
	sheetObjects[1].SetSelectRow(x);
}

function resizeSheet() {
	ComResizeSheet(sheetObjects[0]);
	ComResizeSheet(sheetObjects[1]);
}


function doActionIBSheet(sheetObj, formObj, sAction) {
	sheetObj.ShowDebugMsg(false);
	switch (sAction) {
		case IBSEARCH: // retrieve

			formObj.f_cmd.value = SEARCH;
			ComOpenWait(true);
			sheetObj.DoSearch("ESM_DOU_0108GS.do", FormQueryString(formObj));
			formObj.f_cmd.value = SEARCH03;
			var xml = sheetObjects[1].GetSearchData("ESM_DOU_0108GS.do", FormQueryString(formObj));
			sheetObjects[1].LoadSearchData(xml);
			break;
		case IBDOWNEXCEL:	//엑셀다운로드
			if (sheetObj.RowCount() < 1) {
				ComShowCodeMessage("COM132501");
			} else {
				sheetObj.Down2ExcelBuffer(true);
				sheetObj.Down2Excel({ FileName: 'excel1', SheetName: ' sheet1', DownCols: makeHiddenSkipCol(sheetObj), SheetDesign: 1, Merge: 1 });
				sheetObjects[1].Down2Excel({ SheetName: ' sheet2', DownCols: makeHiddenSkipCol(sheetObjects[1]), Merge: 1 });
				sheetObj.Down2ExcelBuffer(false);
			}
			break;
	}
}

function t1sheet1_OnSearchEnd(sheetObj, Code, Msg, StCode, StMsg) {
	ComOpenWait(false);
	hightLightSubsumTotalSum(sheetObj);

}
function t2sheet1_OnSearchEnd(sheetObj, Code, Msg, StCode, StMsg) {
	//     	ComOpenWait(false);
	hightLightSubsumTotalSum(sheetObj);

}
function hightLightSubsumTotalSum(sheetObj) {
	if (sheetObj.RowCount() > 0) {
		for (var i = sheetObj.HeaderRows(); i <= sheetObj.LastRow(); i++) {
			if (sheetObj.GetCellValue(i, "jo_crr_cd") == '') {
				if (sheetObj.GetCellValue(i, "inv_no") == '') {
					sheetObj.SetRangeFontBold(i, 1, i, 10, 1);
					sheetObj.SetRowBackColor(i, "#ff9933");
				} else {
					sheetObj.SetRowFontColor(i, "#ff3300");
					sheetObj.SetRangeFontBold(i, 1, i, 10, 1);
					sheetObj.SetCellValue(i, "inv_no", "");

				}
			}
		}
	}
}
function setTabObject(tab_obj) {
	tabObjects[tabCnt++] = tab_obj;
}


function initTab(tabObj, tabNo) {
	switch (tabNo) {
		case 1:
			with (tabObj) {
				var cnt = 0;
				InsertItem("Summary", "");
				InsertItem("Detail", "");
			}
			break;
	}
}

function tab1_OnChange(tabObj, nItem) {
	var objs = document.all.item("tabLayer");
	objs[nItem].style.display = "Inline";
	// --------------- this is important! --------------------------//
	for (var i = 0; i < objs.length; i++) {
		if (i != nItem) {
			objs[i].style.display = "none";
			objs[beforetab].style.zIndex = objs[nItem].style.zIndex - 1;
		}
	}
	// ------------------------------------------------------//
	beforetab = nItem;
	tab1.SetSelectedIndex(beforetab)
	resizeSheet();
}
function validateForm(sheetObj, formObj, sAction) {
}

function s_jo_crr_cd_OnCheckClick(Code, Index, Checked) {
	//    		 alert("SELECTED VALUE IS "+Checked);
	//    		 console.log(Code);
	//    		 console.log(Checked);
	//    		 console.log(Index);

}
function s_jo_crr_cd_OnChange(OldText, OldIndex, OldCode, NewText, NewIndex, NewCode) {
	if ((NewCode.length - 3) >= 0) {
		s_rlane_cd.SetEnable(true);
	} else {
		s_rlane_cd.SetEnable(false);
		s_trd_cd.RemoveAll();
		s_trd_cd.SetEnable(false);
	}
	if (OldIndex == 0) {
		s_jo_crr_cd.SetItemCheck(0, 0, 0);
	}
	if (NewIndex == -1) {
		s_jo_crr_cd.SetItemCheck(0, 1, 0);
	} else if (OldIndex != 0) {
		var newIndexArr = NewIndex.split(",");
		//    		console.log(newIndexArr[newIndexArr.length-1]);
		if (newIndexArr[newIndexArr.length - 1] == 0 && OldIndex != -1) {
			for (var i = 0; i < newIndexArr.length; i++) {
				var itemChk = parseInt(newIndexArr[i]);
				s_jo_crr_cd.SetItemCheck(itemChk, 0, 0);
			}
			s_jo_crr_cd.SetItemCheck(0, 1, 0);
			s_rlane_cd.RemoveAll();
			s_rlane_cd.SetEnable(false);
		}
	}
	//    	console.log(NewCode);
	var formObj = document.form;
	formObj.f_cmd.value = SEARCH01;
	pastnerValue = NewCode;
	formObj.s_jo_crr_cd.value = NewCode;
	var xml = sheetObjects[0].GetSearchData("ESM_DOU_0108GS.do", FormQueryString(formObj));
	var laneList = ComGetEtcData(xml, "lane");
	initComboBoxLane(laneList);
}
function s_jo_crr_cd_OnCheckClick(Checked, Index, Code) {

}

function s_rlane_cd_OnChange(OldText, OldIndex, OldCode, NewText, NewIndex, NewCode) {
	if (NewCode.length != 0) {
		s_trd_cd.SetEnable(true);
	} else {
		s_trd_cd.SetEnable(false);
	}
	laneValue = NewCode;
	var formObj = document.form;
	formObj.f_cmd.value = SEARCH02;
	formObj.s_jo_crr_cd.value = pastnerValue;
	formObj.s_rlane_cd.value = laneValue;
	var xml = sheetObjects[0].GetSearchData("ESM_DOU_0108GS.do", FormQueryString(formObj));
	var tradeList = ComGetEtcData(xml, "trade");
	//  		console.log(tradeList);
	initComboBoxTrade(tradeList);
}
function initComboBoxLane(laneList) {
	var formObj = document.form
	with (comboObjects[1]) {
		RemoveAll();
		SetMultiSelect(0);
		SetDropHeight(200);
		ValidChar(2, 1);
	}
	var comboItems = laneList.split("|");
	addComboItem(comboObjects[1], comboItems);
}
function initComboBoxTrade(tradeList) {
	var formObj = document.form

	with (comboObjects[2]) {
		RemoveAll();
		SetMultiSelect(0);
		SetDropHeight(200);
		ValidChar(2, 1);
	}
	var comboItems = tradeList.split("|");
	addComboItem(comboObjects[2], comboItems);
}

function initPeriod() {
	var formObj = document.form;
	var ymTo = ComGetNowInfo("ym", "-");
	formObj.to_acct_yrmon.value = ymTo;
	var ymFrom = ComGetDateAdd(formObj.to_acct_yrmon.value + "-01", "M", -2);
	formObj.fr_acct_yrmon.value = GetDateFormat(ymFrom, "ym");
}

function GetDateFormat(obj, sFormat) {
	var sVal = String(getArgValue(obj));
	sVal = sVal.replace(/\/|\-|\.|\:|\ /g, "");
	if (ComIsEmpty(sVal)) return "";

	var retValue = "";
	switch (sFormat) {
		case "ym":
			retValue = sVal.substring(0, 6);
			break;
	}
	retValue = ComGetMaskedValue(retValue, sFormat);
	return retValue;
}


function checkOverThreeMonth() {
	var formObj = document.form;
	var fromDate = formObj.fr_acct_yrmon.value.replaceStr("-", "") + "01";
	var toDate = formObj.to_acct_yrmon.value.replaceStr("-", "") + "01";
	console.log(ComGetDaysBetween(fromDate, toDate));
	if (ComGetDaysBetween(fromDate, toDate) > 88)
		return false;
	return true;
}
function modifyMonth(obj, iMonth) {
	sheetObjects[0].RemoveAll();
	sheetObjects[1].RemoveAll();
	var formObj = document.form;
	var frDt = formObj.fr_acct_yrmon.value.replaceStr("-", "") + "01";
	var toDt = formObj.to_acct_yrmon.value.replaceStr("-", "") + "01";
	var modifyDate = obj.value.replaceStr("-", "") + "01";
	if (ComGetDaysBetween(modifyDate, frDt) == 0) {
		modifyDate = ComGetDateAdd(obj.value + "-01", "M", iMonth).substring(0, 7);
		modifyDate = modifyDate.replaceStr("-", "") + "01";
		if (ComGetDaysBetween(modifyDate, toDt) <= 0) {
			ComShowCodeMessage("COM132002");
			return false;
		}
	} else if (ComGetDaysBetween(modifyDate, toDt) == 0) {
		modifyDate = ComGetDateAdd(obj.value + "-01", "M", iMonth).substring(0, 7);
		modifyDate = modifyDate.replaceStr("-", "") + "01";
		console.log(ComGetDaysBetween(modifyDate, frDt));
		if (ComGetDaysBetween(modifyDate, frDt) >= 0) {
			ComShowCodeMessage("COM132002");
			return false;
		}
	}
	obj.value = ComGetDateAdd(obj.value + "-01", "M", iMonth).substring(0, 7);
	return true;
}
function onclickButtonNew() {
	if (sheetObjects[0].RowCount() > 0) {
		sheetObjects[0].RemoveAll();
		sheetObjects[1].RemoveAll();
		initPeriod();
		s_jo_crr_cd.SetItemCheck(0, 1, 1);
		s_rlane_cd.RemoveAll();
		s_trd_cd.RemoveAll();
		s_trd_cd.SetEnable(false);
	}


}


/* 개발자 작업  끝 */