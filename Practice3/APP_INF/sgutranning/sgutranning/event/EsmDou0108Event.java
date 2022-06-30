/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : EsmDou0108Event.java
*@FileTitle : aa
*Open Issues :
*Change history :
*@LastModifyDate : 2022.05.26
*@LastModifier : 
*@LastVersion : 1.0
* 2022.05.26 
* 1.0 Creation
=========================================================*/
package com.clt.apps.opus.esm.clv.sgutranning.sgutranning.event;

import com.clt.framework.support.layer.event.EventSupport;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.ConditionVO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.JooCarrierVO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.TradeVO;
import com.tangosol.coherence.reporter.Collection;


/**
 * ESM_DOU_0108 for PDTO(Data Transfer Object including Parameters)<br>
 * - Created from ESM_DOU_0108HTMLAction<br>
 * - Used as PDTO delivered to ServiceCommand Layer<br>
 *
 * @author HUY
 * @see ESM_DOU_0108HTMLAction 참조
 * @since J2EE 1.6
 */

public class EsmDou0108Event extends EventSupport {
	private static final long serialVersionUID = 1L;
	JooCarrierVO jooCarrierVO = null;
	JooCarrierVO[] jooCarrierVOs = null;
	ConditionVO condition = null;
	
	public ConditionVO getCondition() {
		return condition;
	}

	public void setCondition(ConditionVO condition) {
		this.condition = condition;
	}

	TradeVO tradeVO = null;
	public TradeVO getTradeVO() {
		return tradeVO;
	}

	public void setTradeVO(TradeVO tradeVO) {
		this.tradeVO = tradeVO;
	}

	String loadComboBox = null;

	public String getLoadComboBox() {
		return loadComboBox;
	}

	public void setLoadComboBox(String loadComboBox) {
		this.loadComboBox = loadComboBox;
	}

	public EsmDou0108Event(){}
	
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