/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : SguTranningBC.java
*@FileTitle : aa
*Open Issues :
*Change history :
*@LastModifyDate : 2022.06.23
*@LastModifier : 
*@LastVersion : 1.0
* 2022.05.26 
* 1.0 Creation
=========================================================*/
package com.clt.apps.opus.esm.clv.sgutranning.sgutranning.basic;

import java.util.ArrayList;
import java.util.List;

import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.ConditionVO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.DetailVO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.JooCarrierVO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.TradeVO;
import com.clt.framework.core.layer.event.EventException;

/**
 * ALPS-SguTranning Business Logic Command Interface<br>
 * - Interface to business logic for ALPS-SguTranning<br>
 * @author HUY
 * @since J2EE 1.6
 */
public interface SguTranningBC {
	/**
	 * This method is used for searching summary grid data 
	 * @param jooCarrierVO
	 * @param jooList
	 * @param tradeVO
	 * @return
	 * @throws EventException
	 */
	public List<JooCarrierVO> searchJooCarrierVO(ConditionVO condition)throws EventException;
	/**
	 * This method is used for getting data for partner combo box
	 * @return List<JooCarrierVO>
	 * @throws EventException
	 */
	public List<JooCarrierVO> searchPartner() throws EventException;
	/**
	 * this method is used for getting data for lane combo box 
	 * @param jooList
	 * @return List<JooCarrierVO>
	 */
	public List<JooCarrierVO> searchLane(ArrayList<String> jooList);
	/**
	 * this method is used to get data for trade combo box  
	 * @param jooList
	 * @param rlane
	 * @return List<TradeVO>
	 */
	public List<TradeVO> searchTrade(ArrayList<String> jooList, String rlane);
	/**
	 * This method is used for searching detail grid data 
	 * @param jooCarrierVO
	 * @param jooList
	 * @param tradeVO
	 * @return
	 * @throws EventException
	 */
	
	public List<DetailVO> searchDeatailVO(ConditionVO condition)throws EventException;
}