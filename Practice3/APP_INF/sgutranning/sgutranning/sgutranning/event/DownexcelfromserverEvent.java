/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : DownexcelfromserverEvent.java
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

import com.clt.framework.support.layer.event.EventSupport;
import com.clt.apps.opus.esm.clv.downexcelfromserver.downexcelfromserver.vo.JooCarrierVO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.TradeVO;


/**
 * DownExcelFromServer 에 대한 PDTO(Data Transfer Object including Parameters)<br>
 * -  DownExcelFromServerHTMLAction에서 작성<br>
 * - ServiceCommand Layer로 전달하는 PDTO로 사용<br>
 *
 * @author Huy
 * @see DownExcelFromServerHTMLAction 참조
 * @since J2EE 1.6
 */

public class DownexcelfromserverEvent extends EventSupport {

	private static final long serialVersionUID = 1L;
	
	/** Table Value Object 조회 조건 및 단건 처리  */
	JooCarrierVO jooCarrierVO = null;
	
	/** Table Value Object Multi Data 처리 */
	JooCarrierVO[] jooCarrierVOs = null;
	TradeVO tradeVO = null;

	public TradeVO getTradeVO() {
		return tradeVO;
	}

	public void setTradeVO(TradeVO tradeVO) {
		this.tradeVO = tradeVO;
	}

	public DownexcelfromserverEvent(){}
	
	public void setJooCarrierVO(JooCarrierVO jooCarrierVO){
		this. jooCarrierVO = jooCarrierVO;
	}

	public void setJooCarrierVOS(JooCarrierVO[] jooCarrierVOs){
		this. jooCarrierVOs = jooCarrierVOs;
	}

	public JooCarrierVO getJooCarrierVO(){
		return jooCarrierVO;
	}

	public JooCarrierVO[] getJooCarrierVOS(){
		return jooCarrierVOs;
	}

}