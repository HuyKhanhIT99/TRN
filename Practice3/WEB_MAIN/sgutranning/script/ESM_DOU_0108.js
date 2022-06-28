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

//set sheet objects in an array
var sheetObjects = new Array();
//counting for multiple sheets
var sheetCnt = 0;
var comboObjects = new Array();
//counting for multiple compo
var comboCnt = 0;
var comboValues = "";
var searchSummary = "";
var searchDetail = "";
var firstLoad = true;
var tabObjects = new Array();
var tabCnt = 0;
//set this equals to 1 
var beforetab = 0;
var laneList = "";
var check3month = false;
document.onclick = processButtonClick;
/**
 * handle the click event from jsp button 
 */
function processButtonClick() {
	var formObj = document.form;
	try {
		var srcName = ComGetEvent("name");
		// Get event name which corresponding to button.
		switch (srcName) {
			// Event fires when retrieve button is clicked.
			case "btn_Retrieve":
				//asking if user want to retrieve data whether the length of month over 3 months
				if (!checkOverThreeMonth()) {
					// the variable to store user's choose
					if (!check3month) {
						if (confirm("Year Month over 3 months, do you realy want to get data?")) {
							check3month = true;
						} else {
							check3month = false;
							return;
						}
					}
				}
				doActionIBSheet(getCurrentSheet(), formObj, IBSEARCH);
				break;
			// For from date	
			// Event fires when user presses previous month button  
			case "btn_from_back":
				addMonth(formObj.fr_acct_yrmon, -1);
				break;
			//Event fires when user presses following month button 
			case "btn_from_next":
				if(!isValidDate()){
	        		ComShowMessage("Start date must be earlier than end date");
	            	break;
	        	}
	        	addMonth(formObj.fr_acct_yrmon, 1);
				break;
			// For to date
			// Event fires when user presses previous month button
			case "btn_vvd_to_back":
				if(!isValidDate()){
	        		ComShowMessage("Start date must be earlier than end date");
	            	break;
	        	}
	        	addMonth(formObj.to_acct_yrmon, -1);
				break;
			//Event fires when user presses following month button 
			case "btn_vvd_to_next":
				addMonth(formObj.to_acct_yrmon, 1);
				break;
			// Event fires when New button is clicked, reset form.
			case "btn_New":
				onclickButtonNew();
				break;
			// Event fires when DownExcel button is clicked, down sheet to excel file.
			case "btn_DownExcel":
				doActionIBSheet(sheetObjects[0], formObj, IBDOWNEXCEL);
				break;
			// Event fires when DownExcel button is clicked, down sheet to excel file.
			case "btn_Down":
				formObj.f_cmd.value = COMMAND01;
				formObj.action="DownExcelFromServerGS.do";
				formObj.submit();
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

	// generate Grid Layout
	for (i = 0; i < sheetObjects.length; i++) {
		ComConfigSheet(sheetObjects[i]);
		initSheet(sheetObjects[i], i + 1);
		ComEndConfigSheet(sheetObjects[i]);
	}
	//initializing IBMultiCombo
	for (var k = 0; k < comboObjects.length; k++) {
		initCombo(comboObjects[k], k + 1);
	}
	//initializing tabobject
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
				SetMultiSelect(1);
				SetDropHeight(200);
			}
			partnerList = "ALL|" + partnerList;
			var comboItems = partnerList.split("|");
			addComboItem(comboObj, comboItems);
			comboObj.SetSelectIndex(0, 1, 0, 0);
			break;
	}
}

/**
 * function that add item to combo box 
 * @param comboObj 
 * @param comboItems
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
 * Registering IBCombo Object as list parameter : combo_obj adding process for list
 * in case of needing batch processing with other items defining list on the top of source.
 * 
 * @param combo_obj: String - combo object name.
 **/
function setComboObject(combo_obj) {
	comboObjects[comboCnt++] = combo_obj;
}
/**
 * Registering IBSheet Object as list adding process for list in case of needing
 * batch processing with other items defining list on the top of source.
 * 
 * @param sheet_obj: String - sheet name.
 * */
function setSheetObject(sheet_obj) {
	sheetObjects[sheetCnt++] = sheet_obj;
}

/**
 * This function initSheet define the basic properties of the sheet on the screen.
 * 
 * @param sheetObj: IBSheet Object.
 * @param sheetNo:  Number of IBSheet Object.
 * */
function initSheet(sheetObj) {
	var cnt = 0;
	switch (sheetObj.id) {
		case "t1sheet1": // sheet1 init
			with (sheetObj) {
				var HeadTitle1 = "|Partner|Lane|Invoice No|Slip No|Approved|Curr.|Revenue|Expense|Customer/S.Provider|Customer/S.Provider|cust_vndr_cnt_cd|cust_vndr_seq";
				var HeadTitle2 = "|Partner|Lane|Invoice No|Slip No|Approved|Curr.|Revenue|Expense|Code|Name|cust_vndr_cnt_cd|cust_vndr_seq";		
				SetConfig({ SearchMode: 0, MergeSheet: 5, Page: 500, DataRowMerge: 0 });
				var info = { Sort: 0, ColMove: 0, HeaderCheck: 0, ColResize: 1 };
				var headers = [{ Text: HeadTitle1, Align: "Center" }, { Text: HeadTitle2, Align: "Center" }];
				InitHeaders(headers, info);
				var cols = [
					{ Type: "Status",Hidden: 1, Width: 0,   Align: "Center", ColMerge: 0, SaveName: "ibflag" },
					{ Type: "Text",  Hidden: 0, Width: 50,  Align: "Center", ColMerge: 0, SaveName: "jo_crr_cd",        KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },
					{ Type: "Text",  Hidden: 0, Width: 70,  Align: "Center", ColMerge: 0, SaveName: "rlane_cd",         KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },
					{ Type: "Text",  Hidden: 0, Width: 90,  Align: "Center", ColMerge: 0, SaveName: "inv_no",           KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },
					{ Type: "Text",  Hidden: 0, Width: 120, Align: "Center", ColMerge: 0, SaveName: "csr_no",           KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },
					{ Type: "Text",  Hidden: 0, Width: 90,  Align: "Center", ColMerge: 0, SaveName: "apro_flg",         KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },
					{ Type: "Text",  Hidden: 0, Width: 50,  Align: "Center", ColMerge: 0, SaveName: "locl_curr_cd",     KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },
					{ Type: "Float", Hidden: 0, Width: 120, Align: "Right",  ColMerge: 0, SaveName: "inv_rev_act_amt",  KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },
					{ Type: "Float", Hidden: 0, Width: 120, Align: "Right",  ColMerge: 0, SaveName: "inv_exp_act_amt",  KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },
					{ Type: "Text",  Hidden: 0, Width: 100, Align: "Center", ColMerge: 0, SaveName: "prnr_ref_no",      KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },
					{ Type: "Text",  Hidden: 0, Width: 40,  Align: "Center", ColMerge: 0, SaveName: "cust_vndr_eng_nm", KeyField: 0, UpdateEdit: 0, InsertEdit: 0 }, 
					{ Type: "Text",  Hidden: 1, Width: 90,  Align: "Left",   ColMerge: 0, SaveName: "cust_vndr_cnt_cd", KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },
					{ Type: "Text",  Hidden: 1, Width: 90,  Align: "Left",   ColMerge: 0, SaveName: "cust_vndr_seq",    KeyField: 0, UpdateEdit: 0, InsertEdit: 0 }
				];

				InitColumns(cols);
				SetWaitImageVisible(0);
				SetEditable(1);
				resizeSheet();
				ShowSubSum([{StdCol:"inv_no" , SumCols:"7|8",ShowCumulate:0,CaptionText:"",CaptionCol:3}]);
				
			}
			break;
		case "t2sheet1": 
			with (sheetObj) {
				var HeadTitle1 = "|Partner|Lane|Invoice No|Slip No|Approved|Rev / Exp|Item|Curr.|Revenue|Expense|Customer/S.Provider|Customer/S.Provider";
				var HeadTitle2 = "|Partner|Lane|Invoice No|Slip No|Approved|Rev / Exp|Item|Curr.|Revenue|Expense|Code|Name";
				SetConfig({ SearchMode: 0, MergeSheet: 5, Page: 500, DataRowMerge: 1 });
				var info = { Sort: 0, HeaderCheck: 1, ColResize: 0 };
				var headers = [{ Text: HeadTitle1, Align: "Center" }, { Text: HeadTitle2, Align: "Center" }];
				InitHeaders(headers, info);
				var cols = [{ Type: "Status", Hidden: 1, Width: 10, Align: "Center", ColMerge: 0, SaveName: "ibflag", KeyField: 0, CalcLogic: "", Format: "", UpdateEdit: 0, InsertEdit: 0 },// 
				{ Type: "Text", Hidden: 0, Width: 50,  Align: "Center", ColMerge: 0, SaveName: "jo_crr_cd",			KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },// partner
				{ Type: "Text", Hidden: 0, Width: 50,  Align: "Center", ColMerge: 0, SaveName: "rlane_cd",			KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },//lane
				{ Type: "Text", Hidden: 0, Width: 150, Align: "Center", ColMerge: 0, SaveName: "inv_no", 			KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },//invoice no
				{ Type: "Text", Hidden: 0, Width: 150, Align: "Center", ColMerge: 0, SaveName: "csr_no",		 	KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },//slipno
				{ Type: "Text", Hidden: 0, Width: 70,  Align: "Center", ColMerge: 0, SaveName: "apro_flg", 			KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },//approved 
				{ Type: "Text", Hidden: 0, Width: 70,  Align: "Center", ColMerge: 0, SaveName: "re_divr_cd", 		KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },//rev/exp
				{ Type: "Text", Hidden: 0, Width: 60,  Align: "Center", ColMerge: 0, SaveName: "jo_stl_itm_cd", 	KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },//item
				{ Type: "Text", Hidden: 0, Width: 40,  Align: "Center", ColMerge: 0, SaveName: "locl_curr_cd", 		KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },//currency 
				{ Type: "Float",Hidden: 0, Width: 100, Align: "Right",  ColMerge: 0, SaveName: "inv_rev_act_amt", 	KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },//revenue
				{ Type: "Float",Hidden: 0, Width: 100, Align: "Right",  ColMerge: 0, SaveName: "inv_exp_act_amt", 	KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },//expense	
				{ Type: "Text", Hidden: 0, Width: 100, Align: "Center", ColMerge: 0, SaveName: "prnr_ref_no", 		KeyField: 0, UpdateEdit: 0, InsertEdit: 0 },//code
				{ Type: "Text", Hidden: 0, Width: 40,  Align: "Center", ColMerge: 0, SaveName: "cust_vndr_eng_nm",  KeyField: 0, UpdateEdit: 0, InsertEdit: 0 }//name	
				];
				InitColumns(cols);
				SetColProperty(0, "re_divr_cd", { ComboText: "|Rev|Exp", ComboCode: "|R|E", DefaultValue: "R" });	
				SetEditable(1);
				ShowSubSum([{StdCol:"inv_no" , SumCols:"9|10",ShowCumulate:0,CaptionText:"",CaptionCol:3}]);
			}
			break;
	}

}


/**
 * function fires when user double click at row
 * @param Row: Long - Row index of the cell.
 * @param Col: Long - Column index of the cell.
 * */
function t1sheet1_OnDblClick(sheetObj, Row, Col) {
	if(sheetObjects[1].RowCount()==0){
		doActionIBSheet(sheetObjects[1],document.form,IBSEARCH);
	}
//	setTimeout(function(){
		if(sheetObj.GetCellValue(Row,"jo_crr_cd")!=""){
			var saveNames=["jo_crr_cd","rlane_cd","inv_no","csr_no","locl_curr_cd","prnr_ref_no"];
			var summaryData=getDataRow(t1sheet1,Row,saveNames);
			console.log(summaryData);
			var size=t2sheet1.RowCount();
			for(var i=2;i<=size;i++){
				console.log(getDataRow(t2sheet1,i,saveNames));
				if(summaryData==getDataRow(t2sheet1,i,saveNames)){
					
					tab1_OnChange(tabObjects[1], 1);
					sheetObjects[1].SetSelectRow(i);
//					console.log('row '+i);
					return;
				}
			}
			ComShowCodeMessage('COM132701');
		}
//	}, 100);
	
}

/**
 * This function is used to get data at row and append that data to string
 * @param sheetObj: Sheet Object
 * @param row: selected row
 * @param saveNames: array of save name
 * @returns data
 */
function getDataRow(sheetObj,row,saveNames){
	var result="";
	for(var i=0; i<saveNames.length;i++){
		result+=sheetObj.GetCellValue(row,saveNames[i]);
	}
	return result;
}
/**
 * This function resize sheet,
 * If don't call this functions, it will may make UI breakable.
 * */
function resizeSheet() {
	ComResizeSheet(sheetObjects[0]);
	ComResizeSheet(sheetObjects[1]);
}

/**
 *  This function defines the transaction logic between the user interface and the server of IBSheet.
 *  
 *  @param sheetObj:  IBSSheet Object.
 *  @param formObj :  Form object.
 *  @param sAction :  Action Code (e.g. IBSEARCH, IBSAVE, IBDELETE, IBDOWNEXCEL).
 * */
function doActionIBSheet(sheetObj, formObj, sAction) {
	ComOpenWait(true);
	sheetObj.ShowDebugMsg(false);
	switch (sAction) {
		// Retrieve button event.
		case IBSEARCH: 
			if(sheetObj.id=="t1sheet1"){
				searchSummary = getSearchOption();
				formObj.f_cmd.value = SEARCH;
				sheetObj.DoSearch("ESM_DOU_0108GS.do", FormQueryString(formObj));
			}
			else{
				searchDetail = getSearchOption();
//            	formObj.f_cmd.value=SEARCH03;
//                ComOpenWait(true);
//                var sXml = sheetObj.GetSearchData("ESM_DOU_0108GS.do", FormQueryString(formObj));
//                sheetObj.LoadSearchData(sXml, {Sync:1});
//				searchDetail = getSearchOption();
//				formObj.f_cmd.value = SEARCH03;
//				sheetObj.DoSearch("ESM_DOU_0108GS.do", FormQueryString(formObj),{Sync:1});
				formObj.f_cmd.value = SEARCH03;
				var xml = sheetObjects[1].GetSearchData("ESM_DOU_0108GS.do", FormQueryString(formObj));
				sheetObjects[1].LoadSearchData(xml,{Sync:1});
			}
		
			break;
		case IBDOWNEXCEL:	
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
/**
 * This function close image wait.
 * Event fires when search sheet1 is completed using a search function and other internal data processing are also completed.
 * ComOpenWait() :configure whether a loading image will appears and lock the screen, value: true lock screen| false normal.
 * */
function t1sheet1_OnSearchEnd(sheetObj, Code, Msg, StCode, StMsg) {
	ComOpenWait(false);
	//sheetObj.ShowSubSum([{StdCol:"locl_curr_cd" , SumCols:"7|8",ShowCumulate:0,CaptionText:"",CaptionCol:3}]);
	hightLightSubsumTotalSum(sheetObj);
	totalSum(sheetObj);
//	sheetObj.DataInsert(-1);
//	sheetObj.SetCellValue(sheetObj.LastRow(),"locl_curr_cd","VND");
	//sheetObj.SetRowHidden(sheetObj.LastRow(),1);
}
/**
 * This function close image wait.
 * Event fires when search sheet2 is completed using a search function and other internal data processing are also completed.
 * ComOpenWait() :configure whether a loading image will appears and lock the screen, value: true lock screen| false normal.
 * */
function t2sheet1_OnSearchEnd(sheetObj, Code, Msg, StCode, StMsg) {
	ComOpenWait(false);
	hightLightSubsumTotalSum(sheetObj);
	totalSum(sheetObj);
}
/**
 * hightLighting sub/total sum row 
 * @param sheetObj
 */
function hightLightSubsumTotalSum(sheetObj) {
	if (sheetObj.RowCount() > 0) {
		for (var i = sheetObj.HeaderRows(); i <= sheetObj.LastRow(); i++) {
			if (sheetObj.GetCellValue(i, "jo_crr_cd") == '') {
				if (sheetObj.GetCellValue(i, "inv_no") != '') {
					sheetObj.SetCellValue(i, "inv_no", "");
					sheetObj.SetCellValue(i, "locl_curr_cd", sheetObj.GetCellValue(i-1, "locl_curr_cd"));
					
				} 
			}
		}
	}
}
/**
 * set tab object
 * @param tab_obj : tab object
 * */
function setTabObject(tab_obj) {
	tabObjects[tabCnt++] = tab_obj;
}

/**
 * init tab object
 * @param tab_obj : tab object 
 * @param tabNo
 * */
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
/**
 * Event when clicking Tab
 * activating selected tab items
 * nItem --> the number of tab that user click in
 * @param tabObj
 * @param nItem
 */ 
function tab1_OnChange(tabObj, nItem) {
	// it handles the case where there are multiple elements with the same name properly
	var objs = document.all.item("tabLayer");
	//set the style display for next tab
	objs[nItem].style.display = "Inline";
	// --------------- this is important! --------------------------//
	for (var i = 0; i < objs.length; i++) {
		if (i != nItem) {
			//hide the current tab
			objs[i].style.display = "none";
			//display next tab and replace the current tab
			objs[beforetab].style.zIndex = objs[nItem].style.zIndex - 1;
		}
	}
	// ------------------------------------------------------//
	beforetab = nItem;

	tab1.SetSelectedIndex(beforetab)
	handleOnchangeTab();
	resizeSheet();
}
/**
 *  this function handles  data flow for com box of partner
 *  @param OldText
 *  @param OldIndex
 *  @param OldCode
 *  @param NewIndex
 *  @param NewCode
 *  @param NewText
 */  

function s_jo_crr_cd_OnChange(OldText, OldIndex, OldCode, NewText, NewIndex, NewCode) {
	// handling events when user checks all item partner's combo
	if (OldIndex == 0) {
		s_jo_crr_cd.SetItemCheck(0, 0, 0);
	}
	if (NewIndex == -1) {
		s_jo_crr_cd.SetItemCheck(0, 1, 0);
		s_rlane_cd.RemoveAll();
		s_rlane_cd.SetEnable(false);
		s_trd_cd.RemoveAll();
		s_trd_cd.SetEnable(false);
	} else if (OldIndex != 0) {
		var newIndexArr = NewIndex.split(",");
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
	// when user check item form combo , combo rlane will be loaded data 
	var formObj = document.form;
	formObj.f_cmd.value = SEARCH01;
	var xml = sheetObjects[0].GetSearchData("ESM_DOU_0108GS.do", FormQueryString(formObj));
	var laneList = ComGetEtcData(xml, "lane");
	initComboBoxLane(laneList);
}
/**
 *  this function handles  data flow for com box of lane
 *  @param OldText
 *  @param OldIndex
 *  @param OldCode
 *  @param NewIndex
 *  @param NewCode
 *  @param NewText
 */ 
function s_rlane_cd_OnChange(OldText, OldIndex, OldCode, NewText, NewIndex, NewCode) {
	if (NewCode.length != 0) {
		s_trd_cd.SetEnable(true);
	} else {
		s_trd_cd.SetEnable(false);
	}
	laneValue = NewCode;
	var formObj = document.form;
	formObj.f_cmd.value = SEARCH02;
	var xml = sheetObjects[0].GetSearchData("ESM_DOU_0108GS.do", FormQueryString(formObj));
	var tradeList = ComGetEtcData(xml, "trade");
	//  		console.log(tradeList);
	initComboBoxTrade(tradeList);
}
/**
 * This function that define the basic properties of the combo of lane.
 * @param laneList list of lane
 */
function initComboBoxLane(laneList) {
	var formObj = document.form
	with (comboObjects[1]) {
		RemoveAll();
		SetMultiSelect(0);
		SetDropHeight(200);
	}
	var comboItems = laneList.split("|");
	addComboItem(comboObjects[1], comboItems);
}

/**
 * This function that define the basic properties of the combo of trade.
 * 
 * @param tradeList   list of trade
 * */
function initComboBoxTrade(tradeList) {
	var formObj = document.form

	with (comboObjects[2]) {
		RemoveAll();
		SetMultiSelect(0);
		SetDropHeight(200);
	}
	var comboItems = tradeList.split("|");
	addComboItem(comboObjects[2], comboItems);
}
/**
 * set default date
 */
function initPeriod() {
	var formObj = document.form;
	var ymTo = ComGetNowInfo("ym", "-");
	formObj.to_acct_yrmon.value = ymTo;
	var ymFrom = ComGetDateAdd(formObj.to_acct_yrmon.value + "-01", "M", -2);
	formObj.fr_acct_yrmon.value = getDateFormat(ymFrom, "ym");
}
/**
 * to format date time
 * @param obj
 * @param sFormat
 * @returns {String}
 */
function getDateFormat(obj, sFormat) {
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

/**
 * check if the number of month(s) between from_date and to_date is over three months 
 * checkOverThreeMonth
 * @returns {Boolean}
 */
function checkOverThreeMonth() {
	var formObj = document.form;
	var fromDate = formObj.fr_acct_yrmon.value.replaceStr("-", "") + "01";
	var toDate = formObj.to_acct_yrmon.value.replaceStr("-", "") + "01";
	if (ComGetDaysBetween(fromDate, toDate) > 88)
		return false;
	return true;
}
/**
 * This function is used to increment/decrement month by step 
 * @param obj DATE object 
 * @param iMounth step (nagative: decrement; positive: increment)
 * */

function isValidDate(){
	var from=new Date(document.form.fr_acct_yrmon.value);
	var to = new Date(document.form.to_acct_yrmon.value);
	return from < to;
}

function addMonth(obj, month){
	if (obj.value != ""){
			obj.value = ComGetDateAdd(obj.value + "-01", "M", month).substr(0,7);
	}
}
/**
 * This function will delete the values ​​in the input and the Grid that are displayed in the UI when click new button.
 * reset(): Remove all configurations in IBSheet and reset to OOTB state.
 **/
function onclickButtonNew() {
	ComResetAll();
	initPeriod();
	s_jo_crr_cd.SetItemCheck(0, 1, 1);
	s_rlane_cd.SetEnable(false);
	s_trd_cd.SetEnable(false);
}
function s_jo_crr_cd_OnCheckClick(sheetObj, Index, Code) {
	if(Code=="ALL"){
		s_rlane_cd.SetEnable(false);
		s_trd_cd.RemoveAll();
		s_trd_cd.SetEnable(false);
	}else{
		s_rlane_cd.SetEnable(true);
	}
}
function totalSum(sheetObj){
	var totalVND = 0;
	var totalUSD = 0;
	var totalVND1 = 0;
	var totalUSD1 = 0;
	var subsum = sheetObj.FindSubSumRow();
	var arrSubsum = subsum.split("|");
	for (var i = 0; i < arrSubsum.length; i++) {
		if(sheetObj.GetCellValue(arrSubsum[i],"locl_curr_cd")=="VND"){
			totalVND+=sheetObj.GetCellValue(arrSubsum[i],"inv_rev_act_amt");
			totalVND1+=sheetObj.GetCellValue(arrSubsum[i],"inv_exp_act_amt");
		}else{
			totalUSD+=sheetObj.GetCellValue(arrSubsum[i],"inv_rev_act_amt");
			totalUSD1+=sheetObj.GetCellValue(arrSubsum[i],"inv_exp_act_amt");
		}	
	}
	sheetObj.DataInsert(-1);
	sheetObj.SetCellValue(sheetObj.LastRow(),"locl_curr_cd","VND");
	sheetObj.SetCellValue(sheetObj.LastRow(),"inv_rev_act_amt",totalVND);
	sheetObj.SetCellValue(sheetObj.LastRow(),"inv_exp_act_amt",totalVND1);
	sheetObj.SetRangeFontBold(sheetObj.LastRow(), 1, i, 10, 1);
	sheetObj.SetRowBackColor(sheetObj.LastRow(), "#ff9933");
	sheetObj.DataInsert(-1);
	sheetObj.SetCellValue(sheetObj.LastRow(),"locl_curr_cd","USD");
	sheetObj.SetCellValue(sheetObj.LastRow(),"inv_rev_act_amt",totalUSD);
	sheetObj.SetCellValue(sheetObj.LastRow(),"inv_exp_act_amt",totalUSD1);
	sheetObj.SetRangeFontBold(sheetObj.LastRow(), 1, i, 10, 1);
	sheetObj.SetRowBackColor(sheetObj.LastRow(), "#ff9933"); 	
//	sheetObj.SetSelectRow(3);
	
}
o
function handleOnchangeTab(){
	if(firstLoad) {
		firstLoad=false;
		return;
	}
	
	var currentSheet=getCurrentSheet();
	var formQuery = getSearchOption();

	if(searchSummary!=formQuery&&formQuery!=searchDetail){
		if (confirm("Search data was changed. Do you want to retrieve?")) {
			doActionIBSheet(currentSheet,document.form,IBSEARCH);
		} else {
			return;
		}
	}
	if(currentSheet.id=="t1sheet1"){//dang o summary
		if(searchSummary!=formQuery){
			doActionIBSheet(currentSheet, document.form, IBSEARCH)
		}
	}else{
		if(searchDetail!=formQuery){
			doActionIBSheet(currentSheet, document.form, IBSEARCH)
		}
	}
}

function getCurrentSheet() {
	return sheetObjects[beforetab];
}

function getSearchOption(){
	var formObject = document.form;
	var searchOptionString = formObject.fr_acct_yrmon.value+formObject.to_acct_yrmon.value
				+formObject.s_jo_crr_cd.value+formObject.s_rlane_cd.value+formObject.s_trd_cd.value
	return searchOptionString;
}
function isSameSeairchOption(){
	return searchDetail==searchSummary;
}