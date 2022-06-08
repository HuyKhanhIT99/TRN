/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : SguTranning04SC.java
*@FileTitle : Carrier management 
*Open Issues :
*Change history :
*@LastModifyDate : 2022.06.01
*@LastModifier : 
*@LastVersion : 1.0
* 2022.06.01 
* 1.0 Creation
=========================================================*/
package com.clt.apps.opus.esm.clv.sgutranning04;

import java.util.List;

import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.basic.SguTranningBC;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.basic.SguTranningBCImpl;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.JooCarrierVO;
import com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.basic.CarrierMgmtBC;
import com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.basic.CarrierMgmtBCImpl;
import com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.event.CustomerPopupEvent;
import com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.event.SguTrn0004Event;
import com.clt.framework.core.layer.event.Event;
import com.clt.framework.core.layer.event.EventException;
import com.clt.framework.core.layer.event.EventResponse;
import com.clt.framework.component.message.ErrorHandler;
import com.clt.framework.core.layer.event.GeneralEventResponse;
import com.clt.framework.support.controller.html.FormCommand;
import com.clt.framework.support.layer.service.ServiceCommandSupport;
import com.clt.framework.support.view.signon.SignOnUserAccount;
import com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.vo.CarrierVO;
import com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.vo.CustomerServiceVO;


/**
 * ALPS-SguTranning04 Business Logic ServiceCommand - ALPS-SguTranning04 대한 비지니스 트랜잭션을 처리한다.
 * 
 * @author HUY
 * @see CarrierMgmtDBDAO
 * @since J2EE 1.6
 */

public class SguTranning04SC extends ServiceCommandSupport {
	// Login User Information
	private SignOnUserAccount account = null;

	/**
	 * SguTranning04 system 업무 시나리오 선행작업<br>
	 * 업무 시나리오 호출시 관련 내부객체 생성<br>
	 */
	public void doStart() {
		log.debug("SguTranning04SC 시작");
		try {
			// 일단 comment --> 로그인 체크 부분
			account = getSignOnUserAccount();
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
	}

	/**
	 * SguTranning04 system 업무 시나리오 마감작업<br>
	 * 업무 시나리오 종료시 관련 내부객체 해제<br>
	 */
	public void doEnd() {
		log.debug("SguTranning04SC 종료");
	}

	/**
	 * 각 이벤트에 해당하는 업무 시나리오 수행<br>
	 * ALPS-SguTranning04 system 업무에서 발생하는 모든 이벤트의 분기처리<br>
	 * 
	 * @param e Event
	 * @return EventResponse
	 * @exception EventException
	 */
	public EventResponse perform(Event e) throws EventException {
		// RDTO(Data Transfer Object including Parameters)
		EventResponse eventResponse = null;

		// SC가 여러 이벤트를 처리하는 경우 사용해야 할 부분
		if (e.getEventName().equalsIgnoreCase("SguTrn0004Event")) {
			if (e.getFormCommand().isCommand(FormCommand.SEARCH)) {
				eventResponse = searchCarrierVO(e);
			}
			else if (e.getFormCommand().isCommand(FormCommand.DEFAULT)) {
				eventResponse = initData();
			}
			else if (e.getFormCommand().isCommand(FormCommand.SEARCH01)) {
				eventResponse = checkDuplicate(e);
			}
			else if (e.getFormCommand().isCommand(FormCommand.MULTI)) {
				eventResponse = manageCarrierVO(e);
			}
		}
		if (e.getEventName().equalsIgnoreCase("CustomerPopupEvent")) {
			eventResponse = searchCustomerVO(e);
		}
		return eventResponse;
	}
	private EventResponse initData() throws EventException {
		// PDTO(Data Transfer Object including Parameters)
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		SguTranningBC bc = new SguTranningBCImpl();
		CarrierMgmtBC carrierBC = new CarrierMgmtBCImpl();

		try{
			List<JooCarrierVO> list = bc.searchPartner();
			StringBuilder pastners = new StringBuilder();
			if(null != list && list.size() > 0){
				for(int i =0; i < list.size(); i++){
					pastners.append(list.get(i).getJoCrrCd());
					if (i < list.size() - 1){
						pastners.append("|");
					}	
				}
			}
			List<CarrierVO> listLane = carrierBC.searchLane();
			StringBuilder carrier = new StringBuilder();
			if(null != listLane && listLane.size() > 0){
				for(int j =0; j < listLane.size(); j++){
					carrier.append(listLane.get(j).getRlaneCd());
					if (j < listLane.size() - 1){
						carrier.append("|");
					}	
				}
			}
			eventResponse.setETCData("pastner", pastners.toString());
			eventResponse.setETCData("carrier", carrier.toString());
		}catch(EventException ex){
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}catch(Exception ex){
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}	
		return eventResponse;
	}
	/**
	 * SGU_TRN_0004 : [이벤트]<br>
	 * [비즈니스대상]을 [행위]합니다.<br>
	 * 
	 * @param Event e
	 * @return EventResponse
	 * @exception EventException
	 */
	private EventResponse searchCarrierVO(Event e) throws EventException {
		// PDTO(Data Transfer Object including Parameters)
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		SguTrn0004Event event = (SguTrn0004Event)e;
		CarrierMgmtBC command = new CarrierMgmtBCImpl();

		try{
			List<CarrierVO> list = command.searchCarrierVO(event.getCarrierVO());
			eventResponse.setRsVoList(list);
		}catch(EventException ex){
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}catch(Exception ex){
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}	
		return eventResponse;
	}
	/**
	 * SGU_TRN_0004 : [이벤트]<br>
	 * [비즈니스대상]을 [행위]합니다.<br>
	 *
	 * @param Event e
	 * @return EventResponse
	 * @exception EventException
	 */
	private EventResponse manageCarrierVO(Event e) throws EventException {
		// PDTO(Data Transfer Object including Parameters)
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		SguTrn0004Event event = (SguTrn0004Event)e;
		CarrierMgmtBC command = new CarrierMgmtBCImpl();
		try{
			begin();
			command.manageCarrierVO(event.getCarrierVOS(),account);
			eventResponse.setUserMessage(new ErrorHandler("DOU00001").getUserMessage());
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
	private EventResponse searchCustomerVO(Event e) throws EventException {
		// PDTO(Data Transfer Object including Parameters)
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		CustomerPopupEvent event = (CustomerPopupEvent)e;
		CarrierMgmtBC command = new CarrierMgmtBCImpl();

		try{
			List<CustomerServiceVO> list = command.searchCustomerVO(event.getCustomerService());
			eventResponse.setRsVoList(list);
		}catch(Exception ex){
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}	
		return eventResponse;
	}
	private EventResponse checkDuplicate(Event e) throws EventException{
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		SguTrn0004Event event = (SguTrn0004Event)e;
		CarrierMgmtBC command = new CarrierMgmtBCImpl();
		try {
			if(!command.checkDuplicate(event.getCarrierVO())){
				eventResponse.setETCData("duplicated",new ErrorHandler("ERR00002").getUserMessage());
			}
		} catch (EventException e1) {
			eventResponse.setETCData("duplicated",e1.getMessage());
			eventResponse.setUserMessage(new ErrorHandler("ERR00002").getUserMessage());
			throw new EventException(new ErrorHandler(e1).getMessage(),e1);
//			eventResponse.setETCData("duplicated",e1.getMessage());

		}
		return eventResponse;
	}
}