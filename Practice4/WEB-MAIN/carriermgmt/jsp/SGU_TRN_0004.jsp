<%
/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : SGU_TRN_0004.jsp
*@FileTitle : Carrier management 
*Open Issues :
*Change history :
*@LastModifyDate : 2022.06.01
*@LastModifier : 
*@LastVersion : 1.0
* 2022.06.01 
* 1.0 Creation
=========================================================*/
%>

<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page import="com.clt.framework.component.util.JSPUtil"%>
<%@ page import="com.clt.framework.component.util.DateTime"%>
<%@ page import="com.clt.framework.component.message.ErrorHandler"%>
<%@ page import="com.clt.framework.core.layer.event.GeneralEventResponse"%>
<%@ page import="com.clt.framework.support.controller.html.CommonWebKeys"%>
<%@ page import="com.clt.framework.support.view.signon.SignOnUserAccount"%>
<%@ page import="com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.event.SguTrn0004Event"%>
<%@ page import="org.apache.log4j.Logger" %>

<%
	SguTrn0004Event  event = null;					//PDTO(Data Transfer Object including Parameters)
	Exception serverException   = null;			//서버에서 발생한 에러
	String strErrMsg = "";						//에러메세지
	int rowCount	 = 0;						//DB ResultSet 리스트의 건수

	String successFlag = "";
	String codeList  = "";
	String pageRows  = "100";

	String strUsr_id		= "";
	String strUsr_nm		= "";
	Logger log = Logger.getLogger("com.clt.apps.SguTranning04.CarrierMgmt");
	
	String pastners = "";
	String carriers = "";
	try {
	   	SignOnUserAccount account=(SignOnUserAccount)session.getAttribute(CommonWebKeys.SIGN_ON_USER_ACCOUNT);
		strUsr_id =	account.getUsr_id();
		strUsr_nm = account.getUsr_nm();


		event = (SguTrn0004Event)request.getAttribute("Event");
		serverException = (Exception)request.getAttribute(CommonWebKeys.EXCEPTION_OBJECT);

		if (serverException != null) {
			strErrMsg = new ErrorHandler(serverException).loadPopupMessage();
		}

		// 초기화면 로딩시 서버로부터 가져온 데이터 추출하는 로직추가 ..
		GeneralEventResponse eventResponse = (GeneralEventResponse) request.getAttribute("EventResponse");
		pastners = eventResponse.getETCData("pastner");
		carriers = eventResponse.getETCData("carrier");
	}catch(Exception e) {
		out.println(e.toString());
	}
%>
<script language="javascript">
	var carrierList = "|<%=carriers%>";
	var pastnerList = "<%=pastners%>";
	function setupPage(){
		var errMessage = "<%=strErrMsg%>";
		if (errMessage.length >= 1) {
			ComShowMessage(errMessage);
		} // end if
		loadPage();
	}
</script>
<form name="form">
<input type="hidden" name="f_cmd">

<input type="hidden" name="s_rlane_cd">
<input type="hidden" name="combobox_name">
<input type="hidden" name="pagerows">
<!-- page_title_area(S) -->
<div class="page_title_area clear">
	
		<!-- page_title(S) -->
	<h2 class="page_title"><button type="button"><span id="title"></span></button></h2>
	<!-- page_title(E) -->
	
	<!-- opus_design_btn (S) -->
	<div class="opus_design_btn">
		<button class="btn_accent" name="btn_Retrieve" id="btn_Retrieve" type="button">Retrieve</button><!-- 
	    --><button class="btn_normal" name="btn_New" id="btn_New" type="button">New</button><!--
		--><button class="btn_normal" name="btn_Save" id="btn_Save" type="button">Save</button><!--
		--><button class="btn_normal" name="btn_DownExcel" id=btn_DownExcel type="button">Down Excel</button>
	</div>
	<!-- opus_design_btn (E) -->

	<!-- page_location(S) -->
	<div class="location">	
		<span id="navigation"></span>
	</div>
	<!-- page_location(E) -->
</div>
<!-- page_title_area(E) -->

<div class="wrap_search">
	<!-- opus_design_inquiry(S) -->
	<div class="opus_design_inquiry wFit">
		<table>
			<colgroup>
				<col width="70" />				
				<col width="100" />						
				<col width="70" />	
				<col width="100" />				
				<col width="70" />					
		   </colgroup> 
		   <tbody>
		   		<tr>
					<th>Carrier</th>
					<!--  ComComboObject receive comboid, iColCnt, iWidth, iStyle, iCss, iShowCol, iEdit, iTab, iUseCode-->
					<td><script type="text/javascript">ComComboObject('s_jo_crr_cd',1,90,0,0,0);</script></td>
					<th>Vendor</th>
					<td><input type="text" onkeypress="return isNumber(event)" style="width:60px;" name="s_vndr_seq" id="s_vndr_seq" dataformat="num" maxlength="6"/></td>
					<th>Create Date</th>
					<td>
						<input type="text" style="width:100px;text-align:center;" placeholder="YYYY-MM-DD" caption="Create Date From" name="s_cre_dt_fm" id="s_cre_dt_fm" dataformat="ymd" maxLength="10" minlength="8" ><!--  
						--><button type="button" class="calendar ir" name="btns_calendar1" id="btns_calendar1" ></button>~
						<input type="text" style="width:100px;text-align:center;" placeholder="YYYY-MM-DD" caption="Create Date To" name="s_cre_dt_to" id="s_cre_dt_to" dataformat="ymd" maxLength="10" minlength="8"><!-- 
						--><button type="button" class="calendar ir" name="btns_calendar2" id="btns_calendar2" "></button>
					</td>
				</tr> 
		   </tbody>
		</table>
	</div>
	<!-- opus_design_inquiry(E) -->
</div>
<div class="wrap_result">
	<div class="opus_design_grid">
			<div class="opus_design_btn">
				<button type="button" class="btn_accent" name="btn_Add" id="btn_Add">Row Add</button><!-- 
			 --><button type="button" class="btn_accent" name="btn_Delete" id="btn_Delete">Delete Row</button>
			</div>
			<script language="javascript">ComSheetObject('sheet1');</script>
		</div>
</div>
</form>
