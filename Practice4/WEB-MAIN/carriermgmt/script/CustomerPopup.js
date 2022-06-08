var sheetObjects=new Array();
	var sheetCnt=0
	var rowcount=0;
	document.onclick=processButtonClick;
function setSheetObject(sheet_obj){
	sheetObjects[sheetCnt++] = sheet_obj;
}
function processButtonClick() {
	/** *** setting sheet object **** */
	var sheetObject1 = sheetObjects[0];
	/** **************************************************** */
	var formObj = document.form;
	try {
		var srcName = ComGetEvent("name");
		switch (srcName) {                 
			case "btn_Retrieve":
				//console.log("retrieve");
				doActionIBSheet(sheetObject1, formObj, IBSEARCH);
				break;
			case "btn_Close":
        		ComClosePopup(); 
        		break;
        	case "btn_OK":
        		comPopupOK();
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
		initSheet(sheetObjects[i],i+1);
		ComEndConfigSheet(sheetObjects[i]);
	}
	//auto search data after loading finish.
	doActionIBSheet(sheetObjects[0], document.form, IBSEARCH);
	}
function doActionIBSheet(sheetObj,formObj,sAction) {
    switch(sAction) {
		case IBSEARCH:
		 	ComOpenWait(true);
			formObj.f_cmd.value=SEARCH;
			sheetObj.DoSearch("CustomerPopupGS.do", FormQueryString(formObj) );
			break;
		case IBSAVE:
        	formObj.f_cmd.value=MULTI;
            sheetObj.DoSave("SGU_TRN_0001GS.do", FormQueryString(formObj));
			break;
		case IBINSERT:
			sheetObj.DataInsert();
			break;
		case IBDOWNEXCEL:
			if(sheetObj.RowCount() < 1){
				ComShowCodeMessage("COM132501");
			}else{
				sheetObj.Down2Excel({DownCols: makeHiddenSkipCol(sheetObj), SheetDesign:1, Merge:1});
			}
			break;//엑셀다운로드
			
    }
}
function sheet1_OnSearchEnd(sheetObj, Code, Msg, StCode, StMsg) { 
 	ComOpenWait(false);

 }
function initSheet(sheetObj,sheetNo) {
var cnt=0;
var sheetID=sheetObj.id;
	switch(sheetID) {
	    case "sheet1":
	    	with(sheetObj){
	        var HeadTitle="|Country|Country|Sequence|CUST_LGL_ENG_NM|CUST_ABBR_NM|LOC_CD|OFC_CD|" ;
	        var headCount=ComCountHeadTitle(HeadTitle);
	
	        SetConfig( { SearchMode:2, MergeSheet:5, Page:20, FrozenCol:0, DataRowMerge:1 } );
	
	        var info    = { Sort:1, ColMove:1, HeaderCheck:0, ColResize:1 };
	        var headers = [ { Text:HeadTitle, Align:"Center"} ];
	        InitHeaders(headers, info);
	//OFC_CD,LOC_CD,CUST_ABBR_NM,CUST_LGL_ENG_NM,CUST_SEQ,CUST_CNT_CD
	        var cols = [ 
	                 {Type:"Radio",     Hidden:0, Width:20,   Align:"Center",  ColMerge:0,   SaveName:"radio",     KeyField:0,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:1,   InsertEdit:1 },
	                 {Type:"Text",      Hidden:0, Width:80,   Align:"Center",  ColMerge:0,   SaveName:"cust_cnt_cd",  KeyField:1,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:0,   InsertEdit:1 },
	                 {Type:"Text",      Hidden:0, Width:80,   Align:"Center",  ColMerge:0,   SaveName:"cust_cnt_cd",  KeyField:1,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:0,   InsertEdit:1 },
	                 {Type:"Text",     Hidden:0, Width:80,   Align:"Center",  ColMerge:0,   SaveName:"cust_seq",   KeyField:1,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:0,   InsertEdit:1, },
	                 {Type:"Text",     Hidden:0, Width:80,   Align:"Center",  ColMerge:0,   SaveName:"cust_lgl_eng_nm",  KeyField:1,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:0,   InsertEdit:1,  },
	                 {Type:"Text",      Hidden:0, Width:400,  Align:"Left",    ColMerge:0,   SaveName:"cust_abbr_nm",     KeyField:1,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:0,   InsertEdit:1,  },
	                 {Type:"Text",      Hidden:0, Width:250,  Align:"Left",    ColMerge:0,   SaveName:"loc_cd",    KeyField:0,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:0,   InsertEdit:1  },
	        		{Type:"Text",      Hidden:0, Width:250,  Align:"Left",    ColMerge:0,   SaveName:"ofc_cd",    KeyField:0,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:0,   InsertEdit:1 } ];
	        InitColumns(cols);
	        SetWaitImageVisible(0);
	        resizeSheet();
	        }
	    break;
	}
}

function resizeSheet(){
        ComResizeSheet(sheetObjects[0]);
}