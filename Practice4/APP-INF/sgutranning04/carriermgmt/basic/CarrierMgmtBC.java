/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : CarrierMgmtBC.java
*@FileTitle : Carrier management 
*Open Issues :
*Change history :
*@LastModifyDate : 2022.06.01
*@LastModifier : 
*@LastVersion : 1.0
* 2022.06.01 
* 1.0 Creation
=========================================================*/
package com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.basic;

import java.util.List;

import com.clt.framework.core.layer.event.EventException;
import com.clt.framework.support.view.signon.SignOnUserAccount;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.JooCarrierVO;
import com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.vo.CarrierVO;
import com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.vo.CustomerServiceVO;

/**
 * ALPS-Sgutranning04 Business Logic Command Interface<br>
 * - ALPS-Sgutranning04에 대한 비지니스 로직에 대한 인터페이스<br>
 *
 * @author HUY
 * @since J2EE 1.6
 */

public interface CarrierMgmtBC {

	/**
	 * [비즈니스대상]을 [행위] 합니다.<br>
	 * 
	 * @param CarrierVO	carrierVO
	 * @return List<CarrierVO>
	 * @exception EventException
	 */
	public List<CarrierVO> searchCarrierVO(CarrierVO carrierVO) throws EventException;

	public List<CarrierVO> searchLane() throws EventException;
	/**
	 * [비즈니스대상]을 [행위] 합니다.<br>
	 * 
	 * @param CarrierVO[] carrierVO
	 * @param account SignOnUserAccount
	 * @exception EventException
	 */
	public void manageCarrierVO(CarrierVO[] carrierVO,SignOnUserAccount account) throws EventException;

	public List<CustomerServiceVO> searchCustomerVO(
			CustomerServiceVO customerService) throws EventException;
	public boolean checkDuplicate(CarrierVO carrierVO) throws EventException;
}