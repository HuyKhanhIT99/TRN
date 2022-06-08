/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : SGU_TRN_0004.js
*@FileTitle : Carrier management 
*Open Issues :
*Change history :
*@LastModifyDate : 2022.06.01
*@LastModifier : 
*@LastVersion : 1.0
* 2022.06.01 
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
 * @class SGU_TRN_0004 : SGU_TRN_0004 생성을 위한 화면에서 사용하는 업무 스크립트를 정의한다.
 */
function SGU_TRN_0004() {
	this.processButtonClick		= tprocessButtonClick;
	this.setSheetObject 		= setSheetObject;
	this.loadPage 				= loadPage;
	this.initSheet 				= initSheet;
	this.initControl            = initControl;
	this.doActionIBSheet 		= doActionIBSheet;
	this.setTabObject 			= setTabObject;
	this.validateForm 			= validateForm;
}

/* 개발자 작업 */
var sheetObjects=new Array();
var comboObjects=new Array();
var sheetCnt=0;
var comboCnt=0;
document.onclick=processButtonClick;
function processButtonClick(){
	var formObj = document.form;
	var cal = ComCalendar();
	try {
		var srcName = ComGetEvent("name");
	switch (srcName) {
	case "btn_Retrieve":
		doActionIBSheet(sheetObjects[0],formObj, IBSEARCH);
		break;
	case "btn_New":
		onclickButtonNew();
		break;
	case "btn_DownExcel":
		doActionIBSheet(sheetObjects[0],formObj, IBDOWNEXCEL);
		break;
	case "btn_Delete":
		doActionIBSheet(sheetObjects[0],formObj, IBDELETE);
		break;
	case "btn_Add":
		doActionIBSheet(sheetObjects[0], formObj, IBINSERT);
		break;
	case "btn_Save":
		doActionIBSheet(sheetObjects[0], formObj, IBSAVE);
		break;
	case "btns_calendar1":
		cal.select(formObj.s_cre_dt_fm, "yyyy-MM-dd");
		break;
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
function loadPage(){
	for (i = 0; i < sheetObjects.length; i++) {
		ComConfigSheet(sheetObjects[i]);
		initSheet(sheetObjects[i]);
		ComEndConfigSheet(sheetObjects[i]);
	}
	
	// compo carier
	    s_cre_dt_to.disabled=true;
	    s_cre_dt_fm.disabled=true;
		for ( var k = 0; k < comboObjects.length; k++) {
			initCombo(comboObjects[k], k + 1);
	     }

		doActionIBSheet(sheetObjects[0], document.form, IBSEARCH);
	}
   function setComboObject(combo_obj) {
    	comboObjects[comboCnt++] = combo_obj;
    }

	function initCombo(comboObj, comboNo) {
    	var formObj = document.form
    	switch (comboNo) {
    	case 1:
    		with (comboObj) {
    			SetMultiSelect(1);
    	        SetDropHeight(200);
    	        ValidChar(2,1);
    		}

    		pastnerList = "ALL|"+ pastnerList;
	var comboItems = pastnerList.split("|");
		addComboItem(comboObj, comboItems);
		comboObj.SetSelectIndex(0,1,0,0);
		break;
	}
}
function addComboItem(comboObj, comboItems) {
	for (var i=0 ; i < comboItems.length ; i++) {
		var comboItem=comboItems[i].split(",");
	if(comboItem.length == 1){
		comboObj.InsertItem(i, comboItem[0], comboItem[0]);
	}else{
		comboObj.InsertItem(i, comboItem[0] + "|" + comboItem[1], comboItem[1]);
		}
		
	}   		
}
function s_jo_crr_cd_OnChange( OldText, OldIndex, OldCode, NewText,NewIndex,NewCode) {
  	if(OldIndex == 0){
		s_jo_crr_cd.SetItemCheck(0,0,0);
	}
	if(NewIndex == -1){
		s_jo_crr_cd.SetItemCheck(0,1,0);
	}else if (OldIndex!=0){
		var newIndexArr = NewIndex.split(",");
		if(newIndexArr[newIndexArr.length-1] == 0){
			for(var i = 0 ; i< newIndexArr.length;i++){
				var itemChk = parseInt(newIndexArr[i]);
    			s_jo_crr_cd.SetItemCheck(itemChk,0,0);
    		}
			s_jo_crr_cd.SetItemCheck(0,1,0);
		}
	}
}
function initSheet(sheetObj){
	var cnt=0;
	var sheetID=sheetObj.id;
    switch(sheetID) {
        case "sheet1":
    	with(sheetObj){
    	var HeadTitle = "Flag|Chk|Carrier|Rev.Lane|Vendor Code|Customer Code|Customer Code|Trade|DeleteFlag|Create Date|Create User ID|Update Date|Update User ID";
        var headCount=ComCountHeadTitle(HeadTitle);

        SetConfig( { SearchMode:2, MergeSheet:5, Page:20, FrozenCol:0, DataRowMerge:1 } );

        var info    = { Sort:1, ColMove:1, HeaderCheck:0, ColResize:1 };
        var headers = [ { Text:HeadTitle, Align:"Center"} ];
        InitHeaders(headers, info);
        var cols = [ 
	             { Type : "Status",   Hidden : 1, Width : 50,  Align : "Center", ColMerge : 0, SaveName : "ibflag" }, 
	             { Type : "DelCheck", Hidden : 0, Width : 50,  Align : "Center", ColMerge : 0, SaveName : "del_chk" }, 
	             { Type : "Popup", 	  Hidden : 0, Width : 70,  Align : "Center", ColMerge : 0, SaveName : "jo_crr_cd", 	 KeyField : 1, Format : "", UpdateEdit : 0, InsertEdit : 1,  EditLen: 3   }, // carrier
	             { Type : "Combo", 	  Hidden : 0, Width : 100, Align : "Center", ColMerge : 0, SaveName : "rlane_cd",    KeyField : 1, Format : "", UpdateEdit : 0, InsertEdit : 1,  ComboText:carrierList, ComboCode:carrierList  }, // rev
																																																										// lane
// { Type : "Text", Hidden : 0, Width : 100, Align : "Center", ColMerge : 0,
// SaveName : "rlane_cd", KeyField : 1, Format : "", UpdateEdit : 1, InsertEdit
// : 1, }, //rev lane
	             { Type : "PopupEdit",	  Hidden : 0, Width : 100, Align : "Center", ColMerge : 0, SaveName : "vndr_seq",    KeyField : 1, Format : "", UpdateEdit : 1, InsertEdit : 1 , EditLen: 6 ,AcceptKeys : "N"  }, // vendor
																																																		// code
	             { Type : "Popup", 	  Hidden : 0, Width : 50,  Align : "Center", ColMerge : 0, SaveName : "cust_cnt_cd", KeyField : 1, Format : "", UpdateEdit : 1, InsertEdit : 1 , EditLen: 2   }, // Customer
																																																		// code
	             { Type : "Popup", 	  Hidden : 0, Width : 100, Align : "Center", ColMerge : 0, SaveName : "cust_seq",    KeyField : 1, Format : "", UpdateEdit : 1, InsertEdit : 1 , EditLen: 6   }, // customer
																																																		// code
	             { Type : "Popup",     Hidden : 0, Width : 70,  Align : "Center", ColMerge : 0, SaveName : "trd_cd", 	 KeyField : 0, Format : "", UpdateEdit : 1, InsertEdit : 1 , EditLen: 3   }, // trade
	             { Type : "Combo",    Hidden : 0, Width : 70,  Align : "Center", ColMerge : 0, SaveName : "delt_flg", 	 KeyField : 0, Format : "", UpdateEdit : 1, InsertEdit : 1	,ComboText:"Yes|No", ComboCode:"Y|N"}, // delete
																																																							// flag
	             { Type : "Text",     Hidden : 0, Width : 150, Align : "Center", ColMerge : 0, SaveName : "cre_dt", 	 KeyField : 0, Format : "", UpdateEdit : 0, InsertEdit : 0 				  }, // create
																																																		// date
	             { Type : "Text", 	  Hidden : 0, Width : 180, Align : "Left",   ColMerge : 0, SaveName : "cre_usr_id",  KeyField : 0, Format : "", UpdateEdit : 0, InsertEdit : 0				  }, // create
																																																		// user
																																																		// ID
	             { Type : "Text", 	  Hidden : 0, Width : 150, Align : "Center", ColMerge : 0, SaveName : "upd_dt", 	 KeyField : 0, Format : "", UpdateEdit : 0, InsertEdit : 0  			  }, // update
																																																		// date
	             { Type : "Text", 	  Hidden : 0, Width : 180, Align : "Left", 	 ColMerge : 0, SaveName : "upd_usr_id",  KeyField : 0, Format : "", UpdateEdit : 0, InsertEdit : 0				  } // update
																																																	// user
																																																	// id
   		             ];
            InitColumns(cols);
            SetWaitImageVisible(0);
            resizeSheet();
            }
        break;
    }
	
}
function sheet1_OnPopupClick(sheetObj,col,row)
{
	 var s1 = sheetObjects[0].ColSaveName(row);
	 switch(s1){
	 case "trd_cd":
	 ComOpenPopup('/opuscntr/COM_COM_0012.do',770, 470, 'setTrd', '1,0,1,1,1,1,1',true, col, row);
	 break;
 case "jo_crr_cd":
	ComOpenPopup('/opuscntr/COM_ENS_0N1.do',770, 470, 'setCrrCd', '1,0,1,1,1',true, col, row);
	break;
 case "vndr_seq":
	ComOpenPopup('/opuscntr/COM_COM_0007.do',770, 470, 'setVdrCd', '1,0,1,1,1,1,1,1',true, col, row);
	break;
 case "cust_seq":
 case "cust_cnt_cd":
	ComOpenPopup('/opuscntr/CustomerPopup.do',770, 470, 'setCustServiceSeq', '1,0,1,1,1,1,1,1',true, col, row);
		break;
	 }
}

function setTrd(aryPopupData, row, col){
	console.log(aryPopupData[0][3]);
	var sheetObject=sheetObjects[0];
	sheetObject.SetCellValue(sheetObject.GetSelectRow(),"trd_cd",aryPopupData[0][3]);
}

function setCrrCd(aryPopupData, row, col){
	console.log(aryPopupData[0][3]);
	var sheetObject=sheetObjects[0];
	sheetObject.SetCellValue(sheetObject.GetSelectRow(),"jo_crr_cd",aryPopupData[0][3]);
}

function setVdrCd(aryPopupData, row, col){
	var sheetObject=sheetObjects[0];
	sheetObject.SetCellValue(sheetObject.GetSelectRow(),"vndr_seq",aryPopupData[0][2]);
}
function setCustServiceSeq(aryPopupData, row, col){
	var sheetObject=sheetObjects[0];
	sheetObject.SetCellValue(sheetObject.GetSelectRow(),"cust_seq",aryPopupData[0][3]);
sheetObject.SetCellValue(sheetObject.GetSelectRow(),"cust_cnt_cd",aryPopupData[0][2]);
}
function setSheetObject(sheet_obj){
	sheetObjects[sheetCnt++] = sheet_obj;
}
function resizeSheet(){
	ComResizeSheet(sheetObjects[0]);
}
function doActionIBSheet(sheetObj,formObj,sAction){
	 switch(sAction){
		case IBSEARCH:
			ComOpenWait(true);
			formObj.f_cmd.value=SEARCH;
			console.log(formObj.s_jo_crr_cd.value);
			sheetObj.DoSearch("SGU_TRN_0004GS.do", FormQueryString(formObj));
		break;
	case IBINSERT:
		sheetObj.DataInsert(-1);
		break;
	case IBSAVE:
		formObj.f_cmd.value=MULTI;
		ComOpenWait(true);
		var SaveStr = sheetObj.GetSaveString();
		console.log(SaveStr);
		if(SaveStr != ""){
			if(confirm("Do you want to save?")) {
			var rtnData = sheetObj.GetSaveData("SGU_TRN_0004GS.do",SaveStr, FormQueryString(formObj));
	        sheetObj.LoadSaveData(rtnData);
	        }
		}else{
			ComShowMessage("Nothing to save. Saving is cancelled.");
		}
		//sheetObj.DoSave("SGU_TRN_0004GS.do",FormQueryString(formObj));
		break;
		case IBDELETE:	 
			if(confirm("Do you delete selected row?")){
			 	//sheetObj.SetRowStatus(sheetObj.GetSelectRow(),"D");
				formObj.f_cmd.value=MULTI;
				var SaveStr = sheetObj.GetSaveString();
				if (sheetObj.IsDataModified && SaveStr == "") return;
		        var rtnData = sheetObj.GetSaveData("SGU_TRN_0004GS.do",SaveStr, FormQueryString(formObj));
		        console.log(rtnData);
		        sheetObj.LoadSaveData(rtnData);
		     }
		break;
		case IBDOWNEXCEL:
			if(sheetObj.RowCount() < 1){
				ComShowCodeMessage("COM132501");
			}else{
				ComOpenWait(true);
				sheetObj.Down2Excel({DownCols: makeHiddenSkipCol(sheetObj), SheetDesign:1, Merge:1});
			}
			break;
		 }
	}
	function isNumber(evt) {
	    evt = (evt) ? evt : window.event;
	    var charCode = (evt.which) ? evt.which : evt.keyCode;
	    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
	        return false;
	    }
	    return true;
	}
	function onclickButtonNew(){
		sheetObjects[0].RemoveAll();
		document.form.reset();

		s_jo_crr_cd.SetItemCheck(0,1,1);
		
	}
	
 function sheet1_OnSaveEnd(sheetObj, Code, Msg, StCode, StMsg) { 
	 	ComOpenWait(false);
    	if(Msg.length > 0 ){
    	}else{
    		document.form.reset();
    		s_jo_crr_cd.SetItemCheck(0,1,1);
    		doActionIBSheet(sheetObjects[0], document.form, IBSEARCH);
    	}
    	
     }
	 function sheet1_OnSearchEnd(sheetObj, Code, Msg, StCode, StMsg) { 
	    	ComOpenWait(false);
	    	
	 }
	 function sheet1_OnChange(sheetObj,Row, Col) { 
//		 if(sheetObj.GetCellValue(Row,"jo_crr_cd") !="" && sheetObj.GetCellValue(Row,"rlane_cd") !="" ) {
//			 if(sheetObj.ColValueDup("jo_crr_cd|rlane_cd") > -1){
//				 ComShowCodeMessage("COM12115","This row can't insert , it");
//				
//			 }

		    var formObj = document.form
//		    console.log(Row);
//		    console.log(sheetObj.GetCellValue(Row,"jo_crr_cd"));
			formObj.f_cmd.value=SEARCH01;
			formObj.s_jo_crr_cd.value = sheetObj.GetCellValue(Row,"jo_crr_cd");
			formObj.s_rlane_cd.value = sheetObj.GetCellValue(Row,"rlane_cd");
			var xml = sheetObj.GetSearchData("SGU_TRN_0004GS.do", FormQueryString(formObj));
			console.log(xml);
		 }
	 }
	 function sheet1_OnDownFinish(downloadType, result) {
		 ComOpenWait(false);
		 if(!result){
			ComShowCodeMessage("COM131102","data"); 
		 }else{
			 ComShowCodeMessage("COM131101","data");
			 COM131101
		 }
	 }
	 
	 
	/* 개발자 작업 끝 */