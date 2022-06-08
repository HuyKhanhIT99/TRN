/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : CarrierMgmtBCImpl.java
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

import java.util.ArrayList;
import java.util.List;

import com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.integration.CarrierMgmtDBDAO;
import com.clt.framework.component.message.ErrorHandler;
import com.clt.framework.core.layer.event.EventException;
import com.clt.framework.core.layer.integration.DAOException;
import com.clt.framework.support.layer.basic.BasicCommandSupport;
import com.clt.framework.support.view.signon.SignOnUserAccount;
import com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.vo.CarrierVO;
import com.clt.apps.opus.esm.clv.sgutranning04.carriermgmt.vo.CustomerServiceVO;

/**
 * ALPS-SguTranning04 Business Logic Command Interface<br>
 * - ALPS-SguTranning04에 대한 비지니스 로직에 대한 인터페이스<br>
 *
 * @author HUY
 * @since J2EE 1.6
 */
public class CarrierMgmtBCImpl extends BasicCommandSupport implements CarrierMgmtBC {

	// Database Access Object
	private transient CarrierMgmtDBDAO dbDao = null;

	/**
	 * CarrierMgmtBCImpl 객체 생성<br>
	 * CarrierMgmtDBDAO를 생성한다.<br>
	 */
	public CarrierMgmtBCImpl() {
		dbDao = new CarrierMgmtDBDAO();
	}
	/**
	 * [비즈니스대상]을 [행위] 합니다.<br>
	 * 
	 * @param CarrierVO carrierVO
	 * @return List<CarrierVO>
	 * @exception EventException
	 */
	public List<CarrierVO> searchCarrierVO(CarrierVO carrierVO) throws EventException {
		try {
			return dbDao.searchCarrierVO(carrierVO);
		} catch(DAOException ex) {
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		} catch (Exception ex) {
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}
		
	}
	
	/**
	 * [비즈니스대상]을 [행위] 합니다.<br>
	 * 
	 * @param CarrierVO[] carrierVO
	 * @param account SignOnUserAccount
	 * @exception EventException
	 */
	public void manageCarrierVO(CarrierVO[] carrierVO, SignOnUserAccount account) throws EventException{
		try {
			List<CarrierVO> insertVoList = new ArrayList<CarrierVO>();
			List<CarrierVO> updateVoList = new ArrayList<CarrierVO>();
			List<CarrierVO> deleteVoList = new ArrayList<CarrierVO>();
			String listDuplicate = "";
			for ( int i=0; i<carrierVO .length; i++ ) {
				if ( carrierVO[i].getIbflag().equals("I")){
					carrierVO[i].setCreUsrId(account.getUsr_id());
					carrierVO[i].setUpdUsrId(account.getUsr_id());
					if(!dbDao.checkDuplicate(carrierVO[i])){
						listDuplicate+=carrierVO[i].getJoCrrCd()+carrierVO[i].getRlaneCd();
						listDuplicate+=",";
					}
					insertVoList.add(carrierVO[i]);
				} else if ( carrierVO[i].getIbflag().equals("U")){
					carrierVO[i].setUpdUsrId(account.getUsr_id());
					updateVoList.add(carrierVO[i]);
				} else if ( carrierVO[i].getIbflag().equals("D")){
					deleteVoList.add(carrierVO[i]);
				}
			}
			
			if ( insertVoList.size() > 0 ) {
				if(listDuplicate.length()>0){
					throw new EventException(new ErrorHandler("ERR00001").getMessage());
				}
				dbDao.addmanageCarrierVOS(insertVoList);
			}
			
			if ( updateVoList.size() > 0 ) {
				dbDao.modifymanageCarrierVOS(updateVoList);
			}
			
			if ( deleteVoList.size() > 0 ) {
				dbDao.removemanageCarrierVOS(deleteVoList);
			}
		} catch(DAOException ex) {
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		} catch (Exception ex) {
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}
	}
	@Override
	public List<CarrierVO> searchLane() throws EventException {
		try {
			return dbDao.searchLane();
		} catch (Exception ex) {
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}
	}
	@Override
	public List<CustomerServiceVO> searchCustomerVO(
			CustomerServiceVO customerService) throws EventException {
		try {
			return dbDao.searchCustomer(customerService);
		} catch (Exception ex) {
			throw new EventException(new ErrorHandler(ex).getMessage(),ex);
		}
	}
	@Override
	public boolean checkDuplicate(CarrierVO carrierVO) throws EventException {
		if(!dbDao.checkDuplicate(carrierVO)){
			throw new EventException(new ErrorHandler("ERR00001").getMessage());
		}
		return dbDao.checkDuplicate(carrierVO);
	}
	
}