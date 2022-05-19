var sheetObjects=new Array();
var sheetCnt=0
var cdIdValue ="";
document.onclick=processButtonClick;
function processButtonClick() {
	var formObj = document.form;
	try {
		var srcName = ComGetEvent("name");
		switch (srcName) {
		case "btn_Retrieve":
			doActionIBSheet("sheet1",formObj, IBSEARCH);
			break;
		case "btn_Add_sheet1":
			doActionIBSheet("sheet1",formObj, IBINSERT);
			break;
		case "btn_Add_sheet2":
			doActionIBSheet("sheet2",formObj, IBINSERT);
			break;
		case "btn_Save":
			console.log(sheetObjects[0].IsDataModified());
			console.log(sheetObjects[1].IsDataModified());
			if(sheetObjects[0].IsDataModified() == 0 &&sheetObjects[1].IsDataModified() == 0 ) {
				ComShowMessage("Nothing to save. Saving is cancelled.");
				break;
			}
			 if(confirm("Do you save selected codes?")){
             	  if((sheetObjects[0].RowCount("I")+sheetObjects[0].RowCount("U")+sheetObjects[0].RowCount("D")) >0 ){
             		doActionIBSheet("sheet1",formObj, IBSAVE);
             	  } 
             	  if((sheetObjects[1].RowCount("I")+sheetObjects[1].RowCount("U")+sheetObjects[1].RowCount("D")) >0 ) {
             		 doActionIBSheet("sheet2",formObj, IBSAVE);
             	  }
               }
			break;
		case "btn_Delete_sheet1":
			doActionIBSheet("sheet1",formObj, IBDELETE);
			break;
		case "btn_Delete_sheet2":
			doActionIBSheet("sheet2",formObj, IBDELETE);
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
function doActionIBSheet(sheetId,formObj,sAction) {

	if(sheetId=="sheet1"){
		formObj.sheetNo.value="sheet1";
		var sheetObj = sheetObjects[0];
	}else if(sheetId == "sheet2"){
		formObj.sheetNo.value="sheet2";
		var sheetObj = sheetObjects[1];
	}	
	switch(sAction) {
	case IBSEARCH:     
		formObj.f_cmd.value=SEARCH;
		sheetObj.DoSearch("SGU_TRN_0002GS.do", FormQueryString(formObj) );
		break;
	case IBSAVE:
		formObj.f_cmd.value=MULTI;
		var SaveStr = sheetObj.GetSaveString();
		console.log(SaveStr);
		if(SaveStr != ""){
			var rtnData = sheetObj.GetSaveData("SGU_TRN_0002GS.do",SaveStr, FormQueryString(formObj));
	        sheetObj.LoadSaveData(rtnData);

		}
    	break;
	case IBINSERT:
		if(formObj.sheetNo.value == "sheet2" && cdIdValue!=""){
			sheetObj.DataInsert();
			sheetObj.SetCellValue(sheetObj.GetSelectRow(), "intg_cd_id", cdIdValue);

		}else if(formObj.sheetNo.value == "sheet1"){
			sheetObj.DataInsert();
			sheetObj.SelectCell(sheetObj.GetSelectRow(),1,1);
		}
		
		break;
	case IBDELETE:   
		 if(confirm("Do you delete selected row?")){
			 sheetObj.SetRowStatus(sheetObj.GetSelectRow(),"D");
				formObj.f_cmd.value=MULTI;
				var SaveStr = sheetObj.GetSaveString();
				if (sheetObj.IsDataModified && SaveStr == "") return;
		        var rtnData = sheetObj.GetSaveData("SGU_TRN_0002GS.do",SaveStr, FormQueryString(formObj));
		        console.log(rtnData);
		        sheetObj.LoadSaveData(rtnData);
          }
		break;
	}
}
function loadPage(){
	var formObj = document.form;
	var sAction = "IBSEARCH";
	for (i = 0; i < sheetObjects.length; i++) {
		ComConfigSheet(sheetObjects[i]);
		initSheet(sheetObjects[i],i);
		ComEndConfigSheet(sheetObjects[i]);
	}
	loadDataSheet();
}
function initSheet(sheetObj,sheetNo) {
	var cnt=0;
	var sheetID=sheetObj.id;
	switch(sheetID) {
	    case "sheet1":
	    	with(sheetObj){
	    	var HeadTitle="|SubSystem|Cd ID|Cd Name|Length|Cd Type|Table Name|Description Remark|Flag|Create User|Create Date|Update User|Update Date";
	        var headCount=ComCountHeadTitle(HeadTitle);
	
	        SetConfig( { SearchMode:2, MergeSheet:5, Page:20, FrozenCol:0, DataRowMerge:1 } );
	
	        var info    = { Sort:0, ColMove:1, HeaderCheck:0, ColResize:1 };
	        var headers = [ { Text:HeadTitle, Align:"Center"} ];
	        InitHeaders(headers, info);
	
	        var cols = [
	                     {Type:"Status",    Hidden:1, Width:10,   Align:"Center",  ColMerge:0,   SaveName:"ibflag",          KeyField:0,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:1,   InsertEdit:1 },
	                     {Type:"Text",      Hidden:0,  Width:70,   Align:"Center",  ColMerge:0,   SaveName:"ownr_sub_sys_cd",      KeyField:1,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:0,   InsertEdit:1 },
	    	             {Type:"Text",      Hidden:0,  Width:60,   Align:"Center",  ColMerge:0,   SaveName:"intg_cd_id",      KeyField:1,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:0,   InsertEdit:1 },
	    	             {Type:"Text",      Hidden:0,  Width:200,  Align:"Left",    ColMerge:0,   SaveName:"intg_cd_nm",      KeyField:0,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:1,   InsertEdit:1 },
	    	             {Type:"Text",      Hidden:0,  Width:50,   Align:"Center",  ColMerge:0,   SaveName:"intg_cd_len",     KeyField:0,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:1,   InsertEdit:1,AcceptKeys:"N" },
	    	             {Type:"Text",     Hidden:0, Width:100,   Align:"Center",  ColMerge:0,   SaveName:"intg_cd_tp_cd",   KeyField:0,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:1,   InsertEdit:1 },
	    	             {Type:"Text",      Hidden:0,  Width:150,  Align:"Left",    ColMerge:0,   SaveName:"mng_tbl_nm",      KeyField:0,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:0,   InsertEdit:1 },
	    	             {Type:"Text",      Hidden:0,  Width:350,  Align:"Left",    ColMerge:0,   SaveName:"intg_cd_desc",    KeyField:0,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:1,   InsertEdit:1 },
	    	             {Type:"Text",     Hidden:0, Width:40,   Align:"Center",  ColMerge:0,   SaveName:"intg_cd_use_flg", KeyField:0,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:1,   InsertEdit:1 },
	    	             {Type:"Text",      Hidden:0,  Width:80,   Align:"Center",  ColMerge:0,   SaveName:"cre_usr_id",      KeyField:0,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:0,   InsertEdit:0 },
	    	             {Type:"Date",      Hidden:0,  Width:80,   Align:"Center",  ColMerge:0,   SaveName:"cre_dt",          KeyField:0,   CalcLogic:"",   Format:"Ymd",         PointCount:0,   UpdateEdit:0,   InsertEdit:0 },
	    	             {Type:"Text",      Hidden:0,  Width:80,   Align:"Center",  ColMerge:0,   SaveName:"upd_usr_id",      KeyField:0,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:0,   InsertEdit:0 },
	    	             {Type:"Date",      Hidden:0,  Width:80,   Align:"Center",  ColMerge:0,   SaveName:"upd_dt",          KeyField:0,   CalcLogic:"",   Format:"Ymd",         PointCount:0,   UpdateEdit:0,   InsertEdit:0 } ];
	                             
	        InitColumns(cols);
	        resizeSheet(sheetNo);

            SetSheetHeight(240);
	        }
	    break;
	    case "sheet2":      //IBSheet2 init
        	with(sheetObj){

                var HeadTitle="|Cd ID|Cd Val|Display Name|Description Remark|Order" ;

                SetConfig( { SearchMode:2, MergeSheet:5, Page:10, FrozenCol:0, DataRowMerge:0 } );

                var info    = { Sort:0, ColMove:1, HeaderCheck:0, ColResize:1 };
                var headers = [ { Text:HeadTitle, Align:"Center"} ];
                InitHeaders(headers, info);

                var cols = [
                 {Type:"Status",    Hidden:1, Width:10,   Align:"Center",  ColMerge:0,   SaveName:"ibflag",              KeyField:0,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:1,   InsertEdit:1 },
			     {Type:"Text",      Hidden:0, Width:60,   Align:"Center",  ColMerge:0,   SaveName:"intg_cd_id",          KeyField:1,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:0,   InsertEdit:0 },
			     {Type:"Text",      Hidden:0,  Width:60,   Align:"Center",  ColMerge:0,   SaveName:"intg_cd_val_ctnt",    KeyField:1,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:0,   InsertEdit:1 },
			     {Type:"Text",      Hidden:0,  Width:200,  Align:"Center",  ColMerge:0,   SaveName:"intg_cd_val_dp_desc", KeyField:0,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:1,   InsertEdit:1 },
			     {Type:"Text",      Hidden:0,  Width:600,  Align:"Left",    ColMerge:0,   SaveName:"intg_cd_val_desc",    KeyField:0,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:1,   InsertEdit:1 },
			     {Type:"Text",      Hidden:0,  Width:50,   Align:"Center",  ColMerge:0,   SaveName:"intg_cd_val_dp_seq",  KeyField:0,   CalcLogic:"",   Format:"",            PointCount:0,   UpdateEdit:1,   InsertEdit:1 } ];
                 
                InitColumns(cols);
	            resizeSheet(sheetNo);
	            SetSheetHeight(240);
    		}
            break;	    
	}
}
function setSheetObject(sheet_obj){
    sheetObjects[sheetCnt++]=sheet_obj;
}
function resizeSheet(sheetNo){
  	ComResizeSheet(sheetObjects[sheetNo]);
}
function sheet1_OnDblClick(Row, Col, CellX, CellY, CellW, CellH) {
	var obj = sheetObjects[0];
	cdIdValue = obj.GetCellValue(obj.GetSelectRow(), "intg_cd_id");
	if(cdIdValue!=''){
		var formObj = document.form;		
		var sAction = "IBSEARCH";
		formObj.s_intg_cd_id.value = cdIdValue;
		formObj.sheetNo.value="sheet2";
		var sXml = sheetObjects[1].GetSearchData("SGU_TRN_0002GS.do", FormQueryString(formObj));
		console.log(sXml);
		var returnVal=ComGetEtcData(sXml ,"HaveData");
		if(obj.GetCellValue(obj.GetSelectRow(), "ibflag" )!= "U" && obj.GetCellValue(obj.GetSelectRow(), "ibflag" )!= "I"){
			sheetObjects[1].LoadSearchData(sXml);
		}
	}
	
}
function loadDataSheet(){
	var formObj = document.form;
	doActionIBSheet("sheet1",formObj,IBSEARCH);
	var sheetObj = sheetObjects[1];
	formObj.f_cmd.value=SEARCH;
	formObj.s_intg_cd_id.value = cdIdValue;
	formObj.sheetNo.value="sheet2";
	sheetObj.DoSearch("SGU_TRN_0002GS.do", FormQueryString(formObj) );
}
function sheet1_OnSaveEnd(sheetObj,Code,Msg,StCode,StMsg) {
	loadDataSheet();
}
function sheet2_OnSaveEnd(sheetObj,Code,Msg,StCode,StMsg) {

}

