package com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.event;

import com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.vo.CarrierVO;
import com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.vo.CustomerServiceVO;
import com.clt.framework.support.layer.event.EventSupport;

public class CustomerPopupEvent extends EventSupport{
/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	CarrierVO carrierVO = null;
	CustomerServiceVO customerService = null;
	
	public CustomerServiceVO getCustomerService() {
		return customerService;
	}

	public void setCustomerService(CustomerServiceVO customerService) {
		this.customerService = customerService;
	}

	public CarrierVO getCarrierVO() {
		return carrierVO;
	}

	public void setCarrierVO(CarrierVO carrierVO) {
		this.carrierVO = carrierVO;
	}

	public CarrierVO[] getCarrierVOs() {
		return carrierVOs;
	}

	public void setCarrierVOs(CarrierVO[] carrierVOs) {
		this.carrierVOs = carrierVOs;
	}

	/** Table Value Object Multi Data 처리 */
	CarrierVO[] carrierVOs = null;


}
