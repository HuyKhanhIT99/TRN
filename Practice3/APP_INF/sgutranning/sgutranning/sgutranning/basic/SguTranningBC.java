/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : SguTranningBC.java
*@FileTitle : aa
*Open Issues :
*Change history :
*@LastModifyDate : 2022.05.26
*@LastModifier : 
*@LastVersion : 1.0
* 2022.05.26 
* 1.0 Creation
=========================================================*/
package com.clt.apps.opus.esm.clv.sgutranning.sgutranning.basic;

import java.util.ArrayList;
import java.util.List;

import com.clt.framework.core.layer.event.EventException;
import com.clt.framework.support.view.signon.SignOnUserAccount;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.DetailVO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.JooCarrierVO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.TradeVO;

/**
 * ALPS-Sgutranning Business Logic Command Interface<br>
 * - ALPS-Sgutranning에 대한 비지니스 로직에 대한 인터페이스<br>
 *
 * @author HUY
 * @since J2EE 1.6
 */

public interface SguTranningBC {

	/**
	 * [비즈니스대상]을 [행위] 합니다.<br>
	 * @param jooList 
	 * @param tradeVO 
	 * 
	 * @param JooCarrierVO	jooCarrierVO
	 * @return List<JooCarrierVO>
	 * @exception EventException
	 */
	public List<JooCarrierVO> searchJooCarrierVO(JooCarrierVO jooCarrierVO, ArrayList<String> jooList, TradeVO tradeVO) throws EventException;
	public List<JooCarrierVO> searchPartner() throws EventException;
	
	/**
	 * [비즈니스대상]을 [행위] 합니다.<br>
	 * 
	 * @param JooCarrierVO[] jooCarrierVO
	 * @param account SignOnUserAccount
	 * @exception EventException
	 */
	public void multiJooCarrierVO(JooCarrierVO[] jooCarrierVO,SignOnUserAccount account) throws EventException;
	public List<JooCarrierVO> searchLane(ArrayList<String> jooList);
	public List<TradeVO> searchTrade(ArrayList<String> jooList,
			String rlane);
	public List<DetailVO> searchDeatailVO(JooCarrierVO jooCarrierVO,
			ArrayList<String> jooList, TradeVO tradeVO) throws EventException;
}