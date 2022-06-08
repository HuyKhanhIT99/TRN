package com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.event;

import javax.servlet.http.HttpServletRequest;

import com.clt.apps.opus.esm.clv.sgutraning01.errmsgmanagement.vo.ErrMsgVO;
import com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.vo.CarrierVO;
import com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.vo.CustomerServiceVO;
import com.clt.framework.component.util.JSPUtil;
import com.clt.framework.core.controller.html.HTMLActionException;
import com.clt.framework.core.layer.event.Event;
import com.clt.framework.core.layer.event.EventResponse;
import com.clt.framework.support.controller.HTMLActionSupport;
import com.clt.framework.support.controller.html.FormCommand;

public class CustomerPopupHTMLAction extends HTMLActionSupport{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	public Event perform(HttpServletRequest request) throws HTMLActionException {
		
    	FormCommand command = FormCommand.fromRequest(request);
    	CustomerPopupEvent event = new CustomerPopupEvent();
		if(command.isCommand(FormCommand.SEARCH)) {
			CustomerServiceVO customerVO = new CustomerServiceVO();
			customerVO.setCustSeq(JSPUtil.getParameter(request, "s_cust_seq", ""));
			customerVO.setCustCntCd(JSPUtil.getParameter(request, "s_cust_cnt_cd", ""));
			event.setCustomerService(customerVO);
//			ErrMsgVO[] errMsgVOs = (ErrMsgVO[])getVOs(request, ErrMsgVO .class,"");
		}
		return  event;
	}
	public void doEnd(HttpServletRequest request, EventResponse eventResponse) {
		request.setAttribute("EventResponse", eventResponse);
	}

}
