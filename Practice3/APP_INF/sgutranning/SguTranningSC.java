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

import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.basic.SguTranningBC;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.basic.SguTranningBCImpl;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.event.EsmDou0108Event;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.integration.SguTranningDBDAO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.DetailVO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.JooCarrierVO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.TradeVO;
import com.clt.framework.component.message.ErrorHandler;
import com.clt.framework.core.layer.event.Event;
import com.clt.framework.core.layer.event.EventException;
import com.clt.framework.core.layer.event.EventResponse;
import com.clt.framework.core.layer.event.GeneralEventResponse;
import com.clt.framework.support.controller.html.FormCommand;
import com.clt.framework.support.layer.service.ServiceCommandSupport;
import com.clt.framework.support.view.signon.SignOnUserAccount;


/**
 * ALPS-SguTranning Business Logic ServiceCommand - Process business transaction for ALPS-SguTranning.
 * 
 * @author HUY
 * @see SguTranningDBDAO
 * @since J2EE 1.6
 */

public class SguTranningSC extends ServiceCommandSupport {
	// Login User Information
	private SignOnUserAccount account = null;


	/**
	* SguTranning system task scenario precedent work<br>
	* Creating related internal objects when calling a business scenario<br>
	*/
	public void doStart() {
		log.debug("SguTranningSC 시작");
		try {
			account = getSignOnUserAccount();
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
	}

	/**
	* SguTranning system work scenario finishing work<br>
	* Release related internal objects when the work scenario is finished<br>
	*/
	public void doEnd() {
		log.debug("SguTranningSC 종료");
	}


	/**
	* Carry out business scenarios for each event<br>
	* Branch processing of all events occurring in ALPS-SguTranning system work<br>
	*
	* @param e Event
	* @return EventResponse
	* @exception EventException
	*/
	public EventResponse perform(Event e) throws EventException {
		// RDTO(Data Transfer Object including Parameters)
		EventResponse eventResponse = null;
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
			}else if (e.getFormCommand().isCommand(FormCommand.COMMAND01)) {
				eventResponse = excelDownloadFromServer(e);
			}
		}
		return eventResponse;
	}
	/**
	 * this function is used for downloading data from server side
	 * @param e
	 * @return EventResponse
	 * @throws EventException
	 */
	private EventResponse excelDownloadFromServer(Event e) throws EventException {
		SguTranningBC command = new SguTranningBCImpl();
		EsmDou0108Event event = (EsmDou0108Event)e;
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		JooCarrierVO joo = event.getJooCarrierVO();
		eventResponse.setCustomData("vos", command.searchJooCarrierVO(event.getCondition()));
		eventResponse.setCustomData("title", joo.getColumn());
		eventResponse.setCustomData("columns",joo.getColumn());
		eventResponse.setCustomData("fileName", "a.xls");
		eventResponse.setCustomData("isZip", false);
		return eventResponse;
	}
	/**
	 * This method is used for searching detail grid data 
	 * @param e
	 * @return EventResponse
	 */
	private EventResponse searchDetail(Event e) {
		GeneralEventResponse eventResponse = new GeneralEventResponse();
		EsmDou0108Event event = (EsmDou0108Event)e;
		SguTranningBC command = new SguTranningBCImpl();

		try{
			List<DetailVO> list = command.searchDeatailVO(event.getCondition());
			eventResponse.setRsVoList(list);
		}catch(EventException ex){
		}catch(Exception ex){
		}	
		return eventResponse;
	}

	/**
	* ESM_DOU_0108 : [Event]<br>
	* [Act] for [Business Target].<br>
	* This method is used for searching summary grid data  
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
			List<JooCarrierVO> list = command.searchJooCarrierVO(event.getCondition());
			eventResponse.setRsVoList(list);
		}catch(EventException ex){
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}catch(Exception ex){
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}	
		return eventResponse;
	}
	/**
	 *  This method is used for searching data for lane combo box
	 * @param e
	 * @return EventResponse
	 * @throws EventException
	 */
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
					if(!"ALL".equals(jooCdId)){
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
	/**
	 *  This method is used for searching data for trade combo box
	 * @param e
	 * @return EventResponse
	 * @throws EventException
	 */
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
	 * this function is used for initializing data for partner combo box
	 * @return EventResponse
	 * @throws EventException
	 */
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
			eventResponse.setETCData("partner", pastners.toString());
		}catch(EventException ex){
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}catch(Exception ex){
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}	
		return eventResponse;
	}
}