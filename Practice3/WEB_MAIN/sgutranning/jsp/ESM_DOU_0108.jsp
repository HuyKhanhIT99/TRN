<%
/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : ESM_DOU_0108.jsp
*@FileTitle : aa
*Open Issues :
*Change history :
*@LastModifyDate : 2022.05.26
*@LastModifier : 
*@LastVersion : 1.0
* 2022.05.26 
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
<%@ page import="com.clt.apps.opus.esm.clv.sgutranning.sgutranning.event.EsmDou0108Event"%>
<%@ page import="org.apache.log4j.Logger" %>

<%
	EsmDou0108Event  event = null;				
	Exception serverException   = null;			
	String strErrMsg = "";				
	int rowCount	 = 0;						

	String successFlag = "";
	String codeList  = "";
	String pageRows  = "100";
	String partners = "";
	try {
		event = (EsmDou0108Event)request.getAttribute("Event");
		serverException = (Exception)request.getAttribute(CommonWebKeys.EXCEPTION_OBJECT);

		if (serverException != null) {
			strErrMsg = new ErrorHandler(serverException).loadPopupMessage();
		}
		GeneralEventResponse eventResponse = (GeneralEventResponse) request.getAttribute("EventResponse");
		partners = eventResponse.getETCData("partner");
	}catch(Exception e) {
		out.println(e.toString());
	}
%>
<script language="javascript">
	var partnerList = "<%=partners%>";
	function setupPage() {
		var errMessage = "<%=strErrMsg%>";
		if (errMessage.length >= 1) {
			ComShowMessage(errMessage);
		} 
		loadPage();
	}
</script>
<form name="form">
	<input type="hidden" name="f_cmd">
	<input type="hidden" name="pagerows">
	<!-- page_title_area(S) -->
	<div class="page_title_area clear">
		<!-- page_title(S) -->
		<h2 class="page_title"><button type="button"><span id="title"></span></button></h2>
		<!-- page_title(E) -->
		<!-- opus_design_btn(S) -->
		<div class="opus_design_btn"><!-- 
		--><button type="button" class="btn_accent" name="btn_Retrieve" id="btn_Retrieve">Retrieve</button><!-- 
		--><button type="button" class="btn_normal" name="btn_New" id="btn_New">New</button><!--  
		--><button type="button" class="btn_normal" name="btn_DownExcel" id="btn_DownExcel">Down Excel</button><!-- 
		--><button type="button" class="btn_normal" name="btn_Down" id="btn_Down">Down</button>
		</div>
		<!-- opus_design_btn(E) -->
		<!-- page_location(S) -->
		<div class="location">
			<span id="navigation"></span>
		</div>
		<!-- page_location(E) -->
	</div>
	<!-- page_title_area(E) -->

	<!-- wrap_search(S) -->
	<div class="wrap_search_tab">
		<!-- opus_design_inquiry(S) -->
		<div class="opus_design_inquiry wFit">
			<table>
				<tbody>
					<colgroup>
						<col width="80px">
						<col width="100px">
						<col width="105px">
						<col width="75px">
						<col width="55px">
						<col width="75px">
						<col width="55px">
						<col width="*" />
					</colgroup>
					<tr class="h23">
						<th>Year Month</th>
						<td><input type="text" style="width: 80px" class="input1" dataformat="ym" maxlength="6" name="fr_acct_yrmon" value="" id="fr_acct_yrmon" readonly/><!--  
							--><button type="button" class="btn_left" name="btn_from_back" id="btn_vvd_from_back"></button><!--  
							--><button type="button" class="btn_right" name="btn_from_next" id="btn_vvd_from_next"></button><!--  
							--><input type="text" style="width: 80px" class="input1" maxlength="6" dataformat="ym" name="to_acct_yrmon" value="" id="to_acct_yrmon" readonly /><!-- 
							--><button type="button" class="btn_left" name="btn_vvd_to_back" id="btn_vvd_to_back"></button><!--  
							--><button type="button" class="btn_right" name="btn_vvd_to_next" id="btn_vvd_to_next"></button>
						</td>
						<th>Partner</th>
						<td>
							<script type="text/javascript">ComComboObject('s_jo_crr_cd', 1, 100, 0, 0);</script>
						</td>
						<th>Lane</th>
						<td>
							<script type="text/javascript">ComComboObject('s_rlane_cd', 1, 100, 0, 0);</script>
						</td>
						<th>Trade</th>
						<td>
							<script type="text/javascript">ComComboObject('s_trd_cd', 1, 100, 0, 0);</script>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- opus_design_inquiry(E) -->
	</div>
	<!-- wrap_search(E) -->

	<!-- wrap_result(S) -->
        <div class="wrap_result">
            <div class="opus_design_tab">
                <script type="text/javascript">ComTabObject('tab1')</script>
            </div>
            <div class="opus_design_inquiry">
                <!-- opus_design_grid(S) -->
                <div class="opus_design_grid" name="tabLayer" id="tabLayer">
                	<script language="javascript">ComSheetObject('t1sheet1');</script>
                </div>
                <!-- opus_design_grid(E) -->
            </div>
            
            <div class="opus_design_inquiry">
                <!-- opus_design_grid(S) -->
                <div class="opus_design_grid" name="tabLayer" id="tabLayer">
                	<script language="javascript">ComSheetObject('t2sheet1');</script>
                </div>
                <!-- opus_design_grid(E) -->
            </div>
        </div>
      
      <!-- wrap_result(E) -->
</form>