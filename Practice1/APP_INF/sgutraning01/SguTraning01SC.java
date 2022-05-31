/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : SguTraning01SC.java
*@FileTitle : Error Message Management
*Open Issues :
*Change history :
*@LastModifyDate : 2022.05.06
*@LastModifier : 
*@LastVersion : 1.0
* 2022.05.06 
* 1.0 Creation
=========================================================*/
package com.clt.apps.opus.esm.clv.sgutraning01;

import java.util.ArrayList;
import java.util.List;

import com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.basic.CodeManagementBC;
import com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.basic.CodeManagementBCImpl;
import com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.event.SguTrn0002Event;
import com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.vo.CodeMgmtDetailVO;
import com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.vo.CodeMgmtMasterVO;
import com.clt.apps.opus.esm.clv.sgutraning01.errmsgmanagement.basic.ErrMsgManagementBC;
import com.clt.apps.opus.esm.clv.sgutraning01.errmsgmanagement.basic.ErrMsgManagementBCImpl;
import com.clt.apps.opus.esm.clv.sgutraning01.errmsgmanagement.event.SguTrn0001Event;
import com.clt.framework.core.layer.event.Event;
import com.clt.framework.core.layer.event.EventException;
import com.clt.framework.core.layer.event.EventResponse;
import com.clt.framework.component.message.ErrorHandler;
import com.clt.framework.core.layer.event.GeneralEventResponse;
import com.clt.framework.core.layer.integration.DAOException;
import com.clt.framework.support.controller.html.FormCommand;
import com.clt.framework.support.layer.service.ServiceCommandSupport;
import com.clt.framework.support.view.signon.SignOnUserAccount;
import com.clt.apps.opus.esm.clv.sgutraning01.errmsgmanagement.vo.ErrMsgVO;


/**
 * ALPS-SguTraning01 Business Logic ServiceCommand - ALPS-SguTraning01 대한 비지니스 트랜잭션을 처리한다.
 * 
 * @author HUY
 * @see ErrMsgManagementDBDAO
 * @since J2EE 1.6
 */

public class SguTraning01SC extends ServiceCommandSupport {
	// Login User Information
	private SignOnUserAccount account = null;

	/**
	 * SguTraning01 system 업무 시나리오 선행작업<br>
	 * 업무 시나리오 호출시 관련 내부객체 생성<br>
	 */
	public void doStart() {
		log.debug("SguTraning01SC 시작");
		try {
			// 일단 comment --> 로그인 체크 부분
			account = getSignOnUserAccount();
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
	}

	/**
	 * SguTraning01 system 업무 시나리오 마감작업<br>
	 * 업무 시나리오 종료시 관련 내부객체 해제<br>
	 */
	public void doEnd() {
		log.debug("SguTraning01SC 종료");
	}

	/**
	 * 각 이벤트에 해당하는 업무 시나리오 수행<br>
	 * ALPS-SguTraning01 system 업무에서 발생하는 모든 이벤트의 분기처리<br>
	 * 
	 * @param e Event
	 * @return EventResponse
	 * @exception EventException
	 */
	public EventResponse perform(Event e) throws EventException {
		// RDTO(Data Transfer Object including Parameters)

		EventResponse eventResponse = null;

		// SC가 여러 이벤트를 처리하는 경우 사용해야 할 부분
		if (e.getEventName().equalsIgnoreCase("SguTrn0001Event")) {
			if (e.getFormCommand().isCommand(FormCommand.SEARCH)) {
				eventResponse = searchErrMsgVO(e);
			}
			else if (e.getFormCommand().isCommand(FormCommand.MULTI)) {
				eventResponse = manageErrMsgVO(e);
			}
			else if (e.getFormCommand().isCommand(FormCommand.SEARCH01)) {
				eventResponse = checkDuplicated(e);
			}
			else if (e.getFormCommand().isCommand(FormCommand.SEARCH02)) {
				eventResponse = checkServerSide(e);
			}
		}
		if (e.getEventName().equalsIgnoreCase("SguTrn0002Event")) {
			if (e.getFormCommand().isCommand(FormCommand.SEARCH)) {
				eventResponse = searchMaterVO(e);
			}
			else if (e.getFormCommand().isCommand(FormCommand.MULTI)) {
				eventResponse = manageCodeMgmt(e);
			}
		}
		return eventResponse;
	}
	private EventResponse checkServerSide(Event e) {
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		SguTrn0001Event event = (SguTrn0001Event)e;
		ErrMsgManagementBC command = new ErrMsgManagementBCImpl();
		try {
//			ErrMsgVO errmsg = event.getErrMsgVO();
//			String[] insertList = errmsg.getErrMsgCd().split(";");
//	    	for (int i = 0 ; i<insertList.length;i++){
//	    		
//	    	}
			command.validateErrMsgVO(event.getErrMsgVO());
		} catch (EventException e1) {
			eventResponse.setETCData("duplicated", new ErrorHandler(e1).getUserMessage());
		}
		return eventResponse;
	}

	private EventResponse checkDuplicated(Event e) {
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		SguTrn0001Event event = (SguTrn0001Event)e;
		ErrMsgManagementBC command = new ErrMsgManagementBCImpl();
		try {
			command.validateErrMsgVO(event.getErrMsgVO());
		} catch (EventException e1) {
			eventResponse.setETCData("duplicated", new ErrorHandler(e1).getUserMessage());
		}
		return eventResponse;
	}

	/**
	 * SGU_TRN_0001 : [이벤트]<br>
	 * [비즈니스대상]을 [행위]합니다.<br>
	 * 
	 * @param Event e
	 * @return EventResponse
	 * @exception EventException
	 */
	private EventResponse searchErrMsgVO(Event e) throws EventException {
		// PDTO(Data Transfer Object including Parameters)
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		SguTrn0001Event event = (SguTrn0001Event)e;
		ErrMsgManagementBC command = new ErrMsgManagementBCImpl();

		try{
			List<ErrMsgVO> list = command.searchErrMsgVO(event.getErrMsgVO());
			eventResponse.setRsVoList(list);
		}catch(EventException ex){
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}catch(Exception ex){
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}	
		return eventResponse;
	}
	/**
	 * SGU_TRN_0001 : [이벤트]<br>
	 * [비즈니스대상]을 [행위]합니다.<br>
	 *
	 * @param Event e
	 * @return EventResponse
	 * @exception EventException
	 */
	private EventResponse manageErrMsgVO(Event e) throws EventException {
		// PDTO(Data Transfer Object including Parameters)
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		SguTrn0001Event event = (SguTrn0001Event)e;
		ErrMsgManagementBC command = new ErrMsgManagementBCImpl();
		try{
			begin();
			command.manageErrMsgVO(event.getErrMsgVOS(),account);
			//eventResponse.setUserMessage(new ErrorHandler("XXXXXXXXX").getUserMessage());
			commit();
		} catch(EventException ex) {
			rollback();
			//eventResponse.setETCData("duplicated", new ErrorHandler(ex).getUserMessage());
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		} catch(Exception ex) {
			rollback();
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}
		return eventResponse;
	}
	
	private EventResponse searchMaterVO(Event e) throws EventException {
		// PDTO(Data Transfer Object including Parameters)
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		SguTrn0002Event event = (SguTrn0002Event)e;
		CodeManagementBC command = new CodeManagementBCImpl();
		if(event.getSheetNo() == 1){
			List<CodeMgmtMasterVO> list = null;	
			try {
				list = command.searchMasterVO(event.getCodeMgmtMasterVo());
				eventResponse.setRsVoList(list);
			} catch (DAOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
		if(event.getSheetNo() == 2 ){
			try {
				List<CodeMgmtDetailVO> list = command.searchDetailVO(event.getCodeMgmtMasterVo());
				if(list.size()>0){
					eventResponse.setRsVoList(list);
					eventResponse.setETCData("HaveData", "true");
				}else{
					eventResponse.setETCData("HaveData", "false");
				}
				
			} catch (DAOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
		return eventResponse;
	}
	private EventResponse manageCodeMgmt(Event e) throws EventException {
		// PDTO(Data Transfer Object including Parameters)
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		SguTrn0002Event event = (SguTrn0002Event)e;
		if(event.getSheetNo() == 1 ){
			eventResponse = (GeneralEventResponse) manageCodeMgmtMstVO(event);
		}
		else if(event.getSheetNo() == 2){
			eventResponse = (GeneralEventResponse) manageCodeMgmtdtlVO(event);
		}
		return eventResponse;
	}
	private EventResponse manageCodeMgmtMstVO(SguTrn0002Event e) throws EventException {
		// PDTO(Data Transfer Object including Parameters)
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		CodeManagementBC command = new CodeManagementBCImpl();
		try{
			begin();
			command.multiMasterVO(e.getCodeMgmtMasterVos(), account);
			eventResponse.setUserMessage(new ErrorHandler("XXXXXXXXX").getUserMessage());
			commit();
		} catch(EventException ex) {
			rollback();
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		} catch(Exception ex) {
			rollback();
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}
		return eventResponse;
	}
	private EventResponse manageCodeMgmtdtlVO(SguTrn0002Event e) throws EventException {
		// PDTO(Data Transfer Object including Parameters)
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		CodeManagementBC command = new CodeManagementBCImpl();
		try{
			begin();
			command.multiDetailVO(e.getCodeMgmtDetailVos(), account);
			commit();
		} catch(EventException ex) {
			rollback();
			eventResponse.setETCData("key",ex.getMessage());
		} catch(Exception ex) {
			rollback();
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}
		return eventResponse;
	}
}