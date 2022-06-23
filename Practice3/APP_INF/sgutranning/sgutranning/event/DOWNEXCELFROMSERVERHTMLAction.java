/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : DOWNEXCELFROMSERVERHTMLAction.java
*@FileTitle : DownExcelFromServer
*Open Issues :
*Change history :
*@LastModifyDate : 2022.06.14
*@LastModifier : 
*@LastVersion : 1.0
* 2022.06.14 
* 1.0 Creation
=========================================================*/
package com.clt.apps.opus.esm.clv.sgutranning.sgutranning.event;

import javax.servlet.http.HttpServletRequest;

import com.clt.framework.component.util.JSPUtil;
import com.clt.framework.core.controller.html.HTMLActionException;
import com.clt.framework.core.layer.event.Event;
import com.clt.framework.core.layer.event.EventResponse;
import com.clt.framework.support.controller.HTMLActionSupport;
import com.clt.framework.support.controller.html.FormCommand;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.JooCarrierVO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.TradeVO;

/**
 * HTTP Parser<br>
 * - Parsing the value of the HTML DOM object sent to the server through the com.clt.apps.opus.esm.clv.downexcelfromserver screen as a Java variable<br>
 * - Convert the parsed information into an event, put it in the request, and request execution with DownExcelFromServerSC<br>
 * - Set EventResponse to request that sends execution result from DownExcelFromServerSC to View (JSP)<br>
 * @author Huy
 * @see DownExcelFromServerEvent 
 * @since J2EE 1.6
 */

public class DOWNEXCELFROMSERVERHTMLAction extends HTMLActionSupport {

	private static final long serialVersionUID = 1L;
	/**
	 * DOWNEXCELFROMSERVERHTMLAction constructor
	 */
	public DOWNEXCELFROMSERVERHTMLAction() {}

	/**
	 * Parsing the HTML DOM object's Value as a Java variable<br>
	 * Parsing the information of HttpRequst as SguTranningEvent and setting it in the request<br>
	 * @param request HttpServletRequest HttpRequest
	 * @return Event Event object that implements the interface
	 * @exception HTMLActionException
	 */
	public Event perform(HttpServletRequest request) throws HTMLActionException {
		
    	FormCommand command = FormCommand.fromRequest(request);
		EsmDou0108Event event = new EsmDou0108Event();
		if(command.isCommand(FormCommand.COMMAND01)) {
			JooCarrierVO joo = new JooCarrierVO();
			joo.setJoCrrCd(JSPUtil.getParameter(request, "s_jo_crr_cd", ""));
			joo.setRlaneCd(JSPUtil.getParameter(request, "s_rlane_cd", ""));
			TradeVO trade = new TradeVO();
			String a =JSPUtil.getParameter(request, "s_trd_cd", "");
			trade.setTrdCd(a);
			trade.setFrAcctYrmon(JSPUtil.getParameter(request, "fr_acct_yrmon", ""));
			trade.setToAcctYrmon(JSPUtil.getParameter(request, "to_acct_yrmon", ""));
			event.setJooCarrierVO(joo);
			event.setTradeVO(trade);
		}
		return  event;
	}

	/**
	 * Storing the business scenario execution result value in the attribute of HttpRequest<br>
	 * Setting the ResultSet that transmits the execution result from ServiceCommand to View (JSP) in the request<br>
	 * 
	 * @param request HttpServletRequest HttpRequest
	 * @param eventResponse An object that implements the EventResponse interface.
	 */
	public void doEnd(HttpServletRequest request, EventResponse eventResponse) {
		request.setAttribute("EventResponse", eventResponse);
	}

	/**
	 * Saving the HttpRequest parsing result value in the HttpRequest attribute<br>
	 * HttpRequest parsing result value and set in request<br>
	 * 
	 * @param request HttpServletRequest HttpRequest
	 * @param Event An object that implements the Event interface.
	 */
	public void doEnd(HttpServletRequest request, Event event) {
		request.setAttribute("Event", event);
	}
}