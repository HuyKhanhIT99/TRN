package com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.event;

import javax.servlet.http.HttpServletRequest;

import com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.vo.CodeMgmtDetailVO;
import com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.vo.CodeMgmtMasterVO;
import com.clt.framework.component.util.JSPUtil;
import com.clt.framework.core.controller.html.HTMLActionException;
import com.clt.framework.core.layer.event.Event;
import com.clt.framework.core.layer.event.EventResponse;
import com.clt.framework.support.controller.HTMLActionSupport;
import com.clt.framework.support.controller.html.FormCommand;

public class SGU_TRN_0002HTMLAction extends HTMLActionSupport{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	public Event perform(HttpServletRequest request) throws HTMLActionException {
		FormCommand command = FormCommand.fromRequest(request);
		SguTrn0002Event event = new SguTrn0002Event();
		if(command.isCommand(FormCommand.SEARCH)) {
			if(JSPUtil.getParameter(request, "sheetNo", "").equals("sheet1")){
				event.setSheetNo(1);
				CodeMgmtMasterVO masterVo = new CodeMgmtMasterVO();
				masterVo.setOwnrSubSysCd(JSPUtil.getParameter(request, "s_sub_system", ""));
				masterVo.setIntgCdId(JSPUtil.getParameter(request, "s_cd_id", ""));
				event.setCodeMgmtMasterVo(masterVo);
			}else if(JSPUtil.getParameter(request, "sheetNo", "").equals("sheet2")){
				event.setSheetNo(2);
				CodeMgmtMasterVO masterVo = new CodeMgmtMasterVO();
				masterVo.setIntgCdId(JSPUtil.getParameter(request, "s_intg_cd_id" , ""));
				event.setCodeMgmtMasterVo((masterVo));
			}
		}
		if(command.isCommand(FormCommand.MULTI)){
			if(JSPUtil.getParameter(request, "sheetNo", "").equals("sheet1")){
				event.setSheetNo(1);
				event.setCodeMgmtMasterVos((CodeMgmtMasterVO[])getVOs(request, CodeMgmtMasterVO.class));
			}else if(JSPUtil.getParameter(request, "sheetNo", "").equals("sheet2")){
				event.setSheetNo(2);
				event.setCodeMgmtDetailVos((CodeMgmtDetailVO[])getVOs(request, CodeMgmtDetailVO.class));
			}
		}
		return  event;
	}
	public void doEnd(HttpServletRequest request, EventResponse eventResponse) {
		request.setAttribute("EventResponse", eventResponse);
	}

	public void doEnd(HttpServletRequest request, Event event) {
		request.setAttribute("Event", event);
	}

}
