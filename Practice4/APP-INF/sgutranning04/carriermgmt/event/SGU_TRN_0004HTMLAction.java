/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : SGU_TRN_0004HTMLAction.java
*@FileTitle : Carrier management 
*Open Issues :
*Change history :
*@LastModifyDate : 2022.06.01
*@LastModifier : 
*@LastVersion : 1.0
* 2022.06.01 
* 1.0 Creation
=========================================================*/
package com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.event;

import javax.servlet.http.HttpServletRequest;

import com.clt.framework.component.util.JSPUtil;
import com.clt.framework.core.controller.html.HTMLActionException;
import com.clt.framework.core.layer.event.Event;
import com.clt.framework.core.layer.event.EventResponse;
import com.clt.framework.support.controller.HTMLActionSupport;
import com.clt.framework.support.controller.html.FormCommand;
import com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.vo.CarrierVO;

/**
 * HTTP Parser<br>
 * - com.clt.apps.opus.esm.clv.sgutranning04 화면을 통해 서버로 전송되는 HTML DOM 객체의 Value를 자바 변수로 Parsing<br>
 * - Parsing 한 정보를 Event로 변환, request에 담아 SguTranning04SC로 실행요청<br>
 * - SguTranning04SC에서 View(JSP)로 실행결과를 전송하는 EventResponse를 request에 셋팅<br>
 * @author HUY
 * @see SguTranning04Event 참조
 * @since J2EE 1.6
 */

public class SGU_TRN_0004HTMLAction extends HTMLActionSupport {

	private static final long serialVersionUID = 1L;
	/**
	 * SGU_TRN_0004HTMLAction 객체를 생성
	 */
	public SGU_TRN_0004HTMLAction() {}

	/**
	 * HTML DOM 객체의 Value를 자바 변수로 Parsing<br>
	 * HttpRequst의 정보를 SguTranning04Event로 파싱하여 request에 셋팅<br>
	 * @param request HttpServletRequest HttpRequest
	 * @return Event Event interface를 구현한 객체
	 * @exception HTMLActionException
	 */
	public Event perform(HttpServletRequest request) throws HTMLActionException {
		
    	FormCommand command = FormCommand.fromRequest(request);
		SguTrn0004Event event = new SguTrn0004Event();
		
		if(command.isCommand(FormCommand.MULTI)) {
			event.setCarrierVOS((CarrierVO[])getVOs(request, CarrierVO.class,""));
		}
		else if(command.isCommand(FormCommand.SEARCH)) {
//			event.setCarrierVO((CarrierVO)getVO(request, CarrierVO .class));
			String creDt = JSPUtil.getParameter(request, "s_cre_dt_fm", " ") + ","+JSPUtil.getParameter(request, "s_cre_dt_to", " ");
			CarrierVO crr = new CarrierVO();
			crr.setJoCrrCd(JSPUtil.getParameter(request, "s_jo_crr_cd", ""));
			crr.setVndrSeq(JSPUtil.getParameter(request, "s_vndr_seq", ""));
			crr.setCreDt(creDt);
//			trade.setFrAcctYrmon(JSPUtil.getParameter(request, "fr_acct_yrmon", ""));
//			trade.setToAcctYrmon(JSPUtil.getParameter(request, "to_acct_yrmon", ""));
			event.setCarrierVO(crr);
		}
		else if(command.isCommand(FormCommand.SEARCH01)) {
			CarrierVO crr = new CarrierVO();
			crr.setJoCrrCd(JSPUtil.getParameter(request, "s_jo_crr_cd", ""));
			crr.setRlaneCd(JSPUtil.getParameter(request, "s_rlane_cd", ""));
			event.setCarrierVO(crr);
		}

		return  event;
	}

	/**
	 * HttpRequest의 attribute에 업무시나리오 수행결과 값 저장<br>
	 * ServiceCommand에서 View(JSP)로 실행결과를 전송하는 ResultSet을 request에 셋팅<br>
	 * 
	 * @param request HttpServletRequest HttpRequest
	 * @param eventResponse EventResponse interface를 구현한 객체
	 */
	public void doEnd(HttpServletRequest request, EventResponse eventResponse) {
		request.setAttribute("EventResponse", eventResponse);
	}

	/**
	 * HttpRequest의 attribute에 HttpRequest 파싱 수행결과 값 저장<br>
	 * HttpRequest 파싱 수행결과 값 request에 셋팅<br>
	 * 
	 * @param request HttpServletRequest HttpRequest
	 * @param event Event interface를 구현한 객체
	 */
	public void doEnd(HttpServletRequest request, Event event) {
		request.setAttribute("Event", event);
	}
}