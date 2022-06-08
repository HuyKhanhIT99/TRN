/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : SguTrn0004Event.java
*@FileTitle : Carrier management 
*Open Issues :
*Change history :
*@LastModifyDate : 2022.06.01
*@LastModifier : 
*@LastVersion : 1.0
* 2022.06.01 
* 1.0 Creation
=========================================================*/
package com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.event;

import com.clt.framework.support.layer.event.EventSupport;
import com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.vo.CarrierVO;


/**
 * SGU_TRN_0004 에 대한 PDTO(Data Transfer Object including Parameters)<br>
 * -  SGU_TRN_0004HTMLAction에서 작성<br>
 * - ServiceCommand Layer로 전달하는 PDTO로 사용<br>
 *
 * @author HUY
 * @see SGU_TRN_0004HTMLAction 참조
 * @since J2EE 1.6
 */

public class SguTrn0004Event extends EventSupport {

	private static final long serialVersionUID = 1L;
	
	/** Table Value Object 조회 조건 및 단건 처리  */
	CarrierVO carrierVO = null;
	
	/** Table Value Object Multi Data 처리 */
	CarrierVO[] carrierVOs = null;

	public SguTrn0004Event(){}
	
	public void setCarrierVO(CarrierVO carrierVO){
		this. carrierVO = carrierVO;
	}

	public void setCarrierVOS(CarrierVO[] carrierVOs){
		this. carrierVOs = carrierVOs;
	}

	public CarrierVO getCarrierVO(){
		return carrierVO;
	}

	public CarrierVO[] getCarrierVOS(){
		return carrierVOs;
	}

}