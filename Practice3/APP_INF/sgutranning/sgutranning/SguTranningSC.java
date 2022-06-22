/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : SguTranningSC.java
*@FileTitle : aa
*Open Issues :
*Change history :
*@LastModifyDate : 2022.05.26
*@LastModifier : 
*@LastVersion : 1.0
* 2022.05.26 
* 1.0 Creation
=========================================================*/
package com.clt.apps.opus.esm.clv.sgutranning;

import java.util.ArrayList;
import java.util.List;

import com.clt.apps.opus.esm.clv.downexcelfromserver.downexcelfromserver.basic.DownExcelFromServerBC;
import com.clt.apps.opus.esm.clv.downexcelfromserver.downexcelfromserver.basic.DownExcelFromServerBCImpl;
import com.clt.apps.opus.esm.clv.downexcelfromserver.downexcelfromserver.event.DownexcelfromserverEvent;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.basic.SguTranningBC;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.basic.SguTranningBCImpl;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.event.EsmDou0108Event;
import com.clt.framework.core.layer.event.Event;
import com.clt.framework.core.layer.event.EventException;
import com.clt.framework.core.layer.event.EventResponse;
import com.clt.framework.component.message.ErrorHandler;
import com.clt.framework.core.layer.event.GeneralEventResponse;
import com.clt.framework.support.controller.html.FormCommand;
import com.clt.framework.support.layer.service.ServiceCommandSupport;
import com.clt.framework.support.view.signon.SignOnUserAccount;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.DetailVO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.JooCarrierVO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.TradeVO;


/**
 * ALPS-SguTranning Business Logic ServiceCommand - ALPS-SguTranning 대한 비지니스 트랜잭션을 처리한다.
 * 
 * @author HUY
 * @see SguTranningDBDAO
 * @since J2EE 1.6
 */

public class SguTranningSC extends ServiceCommandSupport {
	// Login User Information
	private SignOnUserAccount account = null;

	/**
	 * SguTranning system 업무 시나리오 선행작업<br>
	 * 업무 시나리오 호출시 관련 내부객체 생성<br>
	 */
	public void doStart() {
		log.debug("SguTranningSC 시작");
		try {
			// 일단 comment --> 로그인 체크 부분
			account = getSignOnUserAccount();
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
	}

	/**
	 * SguTranning system 업무 시나리오 마감작업<br>
	 * 업무 시나리오 종료시 관련 내부객체 해제<br>
	 */
	public void doEnd() {
		log.debug("SguTranningSC 종료");
	}

	/**
	 * 각 이벤트에 해당하는 업무 시나리오 수행<br>
	 * ALPS-SguTranning system 업무에서 발생하는 모든 이벤트의 분기처리<br>
	 * 
	 * @param e Event
	 * @return EventResponse
	 * @exception EventException
	 */
	public EventResponse perform(Event e) throws EventException {
		// RDTO(Data Transfer Object including Parameters)
		EventResponse eventResponse = null;
		// SC가 여러 이벤트를 처리하는 경우 사용해야 할 부분
		if (e.getEventName().equalsIgnoreCase("EsmDou0108Event")) {
			if (e.getFormCommand().isCommand(FormCommand.SEARCH)) {
				eventResponse = searchJooCarrierVO(e);
			}else if (e.getFormCommand().isCommand(FormCommand.DEFAULT)) {
				eventResponse = initData();
			}else if (e.getFormCommand().isCommand(FormCommand.SEARCH01)) {
				eventResponse = searchLane(e);
			}else if (e.getFormCommand().isCommand(FormCommand.SEARCH02)) {
				eventResponse = searchTrade(e);
			}else if (e.getFormCommand().isCommand(FormCommand.SEARCH03)) {
				eventResponse = searchDetail(e);
			}
			else if (e.getFormCommand().isCommand(FormCommand.MULTI)) {
				eventResponse = manageJooCarrierVO(e);
			}else if (e.getFormCommand().isCommand(FormCommand.COMMAND01)) {
				eventResponse = excelDownloadFromServer(e);
			}
		}
		return eventResponse;
	}
	private EventResponse excelDownloadFromServer(Event e) throws EventException {
		SguTranningBC command = new SguTranningBCImpl();
		EsmDou0108Event event = (EsmDou0108Event)e;
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		JooCarrierVO joo = event.getJooCarrierVO();
		ArrayList<String> jooList = new ArrayList<String>();
		if(joo.getJoCrrCd().contains(",")){
			String[] jooCrrCdList = joo.getJoCrrCd().split(",");
			for(String jooCdId :jooCrrCdList){
				jooList.add(jooCdId);
			}
		}else{
			jooList.add(joo.getJoCrrCd());
		}
		eventResponse.setCustomData("vos", command.searchJooCarrierVO(event.getJooCarrierVO() , jooList, event.getTradeVO()));
		eventResponse.setCustomData("title", joo.getColumn());
		eventResponse.setCustomData("columns",joo.getColumn());
		eventResponse.setCustomData("fileName", "a.xls");
		eventResponse.setCustomData("isZip", false);
		return eventResponse;
	}
	private EventResponse searchDetail(Event e) {
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		EsmDou0108Event event = (EsmDou0108Event)e;
		SguTranningBC command = new SguTranningBCImpl();

		try{
			JooCarrierVO joo = event.getJooCarrierVO();
			ArrayList<String> jooList = new ArrayList<String>();
			if(joo.getJoCrrCd().contains(",")){
				String[] jooCrrCdList = joo.getJoCrrCd().split(",");
				for(String jooCdId :jooCrrCdList){
					jooList.add(jooCdId);
				}
			}else{
				jooList.add(joo.getJoCrrCd());
			}
			List<DetailVO> list = command.searchDeatailVO(event.getJooCarrierVO() , jooList, event.getTradeVO());
			eventResponse.setRsVoList(list);
		}catch(EventException ex){
		}catch(Exception ex){
		}	
		return eventResponse;
	}

	/**
	 * ESM_DOU_0108 : [이벤트]<br>
	 * [비즈니스대상]을 [행위]합니다.<br>
	 * 
	 * @param Event e
	 * @return EventResponse
	 * @exception EventException
	 */
	private EventResponse searchJooCarrierVO(Event e) throws EventException {
		// PDTO(Data Transfer Object including Parameters)
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		EsmDou0108Event event = (EsmDou0108Event)e;
		SguTranningBC command = new SguTranningBCImpl();

		try{
			JooCarrierVO joo = event.getJooCarrierVO();
			ArrayList<String> jooList = new ArrayList<String>();
			if(joo.getJoCrrCd().contains(",")){
				String[] jooCrrCdList = joo.getJoCrrCd().split(",");
				for(String jooCdId :jooCrrCdList){
					jooList.add(jooCdId);
				}
			}else{
				jooList.add(joo.getJoCrrCd());
			}
			List<JooCarrierVO> list = command.searchJooCarrierVO(event.getJooCarrierVO() , jooList, event.getTradeVO());
			eventResponse.setRsVoList(list);
		}catch(EventException ex){
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}catch(Exception ex){
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}	
		return eventResponse;
	}
	private EventResponse searchLane(Event e) throws EventException {
		// PDTO(Data Transfer Object including Parameters)
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		EsmDou0108Event event = (EsmDou0108Event)e;
		SguTranningBC command = new SguTranningBCImpl();

		try{
			JooCarrierVO joo = event.getJooCarrierVO();
			ArrayList<String> jooList = new ArrayList<String>();
			if(joo.getJoCrrCd().contains(",")){
				String[] jooCrrCdList = joo.getJoCrrCd().split(",");
				for(String jooCdId :jooCrrCdList){
					if(!jooCdId.equals("ALL")){
						jooList.add(jooCdId);
					}
				}
			}else{
				jooList.add(joo.getJoCrrCd());
			}
			List<JooCarrierVO> list = command.searchLane(jooList);
			StringBuilder lane = new StringBuilder();
			if(null != list && list.size() > 0){
				for(int i =0; i < list.size(); i++){
					lane.append(list.get(i).getRlaneCd());
					if (i < list.size() - 1){
						lane.append("|");
					}	
				}
			}
			eventResponse.setETCData("lane", lane.toString());	
		}catch(Exception ex){
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}	
		return eventResponse;
	}
	private EventResponse searchTrade(Event e) throws EventException {
		// PDTO(Data Transfer Object including Parameters)
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		EsmDou0108Event event = (EsmDou0108Event)e;
		SguTranningBC command = new SguTranningBCImpl();

		try{
			JooCarrierVO joo = event.getJooCarrierVO();
			ArrayList<String> jooList = new ArrayList<String>();

			String rlane = joo.getRlaneCd();
			if(joo.getJoCrrCd().contains(",")){
				String[] jooCrrCdList = joo.getJoCrrCd().split(",");
				for(String jooCdId :jooCrrCdList){
					jooList.add(jooCdId);
				}
			}else{
				jooList.add(joo.getJoCrrCd());
			}
			List<TradeVO> list = command.searchTrade(jooList,rlane);
			StringBuilder trade = new StringBuilder();
			if(null != list && list.size() > 0){
				for(int i =0; i < list.size(); i++){
					trade.append(list.get(i).getTrdCd());
					if (i < list.size() - 1){
						trade.append("|");
					}	
				}
			}
			eventResponse.setETCData("trade", trade.toString());	
		}catch(Exception ex){
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}	
		return eventResponse;
	}
	
	
	/**
	 * ESM_DOU_0108 : [이벤트]<br>
	 * [비즈니스대상]을 [행위]합니다.<br>
	 *
	 * @param Event e
	 * @return EventResponse
	 * @exception EventException
	 */
	private EventResponse manageJooCarrierVO(Event e) throws EventException {
		// PDTO(Data Transfer Object including Parameters)
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		EsmDou0108Event event = (EsmDou0108Event)e;
		SguTranningBC command = new SguTranningBCImpl();
		try{
			begin();
			command.multiJooCarrierVO(event.getJooCarrierVOS(),account);
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
	private EventResponse initData() throws EventException {
		// PDTO(Data Transfer Object including Parameters)
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		SguTranningBC bc = new SguTranningBCImpl();

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
			eventResponse.setETCData("pastner", pastners.toString());
		}catch(EventException ex){
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}catch(Exception ex){
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}	
		return eventResponse;
	}
}