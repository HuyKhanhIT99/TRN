/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : SguTranningBCImpl.java
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

import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.integration.SguTranningDBDAO;
import com.clt.framework.component.message.ErrorHandler;
import com.clt.framework.core.layer.event.EventException;
import com.clt.framework.core.layer.integration.DAOException;
import com.clt.framework.support.layer.basic.BasicCommandSupport;
import com.clt.framework.support.view.signon.SignOnUserAccount;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.DetailVO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.JooCarrierVO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.TradeVO;

/**
 * ALPS-SguTranning Business Logic Command Interface<br>
 * - ALPS-SguTranning에 대한 비지니스 로직에 대한 인터페이스<br>
 *
 * @author HUY
 * @since J2EE 1.6
 */
public class SguTranningBCImpl extends BasicCommandSupport implements SguTranningBC {

	// Database Access Object
		private transient SguTranningDBDAO dbDao = null;

		/**
		 * SguTranningBCImpl 객체 생성<br>
		 * SguTranningDBDAO를 생성한다.<br>
		 */
		public SguTranningBCImpl() {
			dbDao = new SguTranningDBDAO();
		}

		@Override
		public List<JooCarrierVO> searchJooCarrierVO(JooCarrierVO jooCarrierVO, ArrayList<String> jooList,TradeVO tradeVO)
				throws EventException {
			try {
				return dbDao.searchJooCarrierVO(jooCarrierVO,jooList,tradeVO);
			} catch(DAOException ex) {
				throw new EventException(new ErrorHandler(ex).getMessage(),ex);
			} catch (Exception ex) {
				throw new EventException(new ErrorHandler(ex).getMessage(),ex);
			}
		}

		@Override
		public List<JooCarrierVO> searchPartner() throws EventException {
			try {
				return dbDao.searchPartner();
			} catch (Exception ex) {
				throw new EventException(new ErrorHandler(ex).getMessage(),ex);
			}
		}

		@Override
		public void multiJooCarrierVO(JooCarrierVO[] jooCarrierVO,
				SignOnUserAccount account) throws EventException {
			// TODO Auto-generated method stub
			
		}

		@Override
		public List<JooCarrierVO> searchLane(ArrayList<String> jooList) {
			// TODO Auto-generated method stub

			return dbDao.searchLane(jooList);
		}

		@Override
		public List<TradeVO> searchTrade(ArrayList<String> jooList,
				String rlane) {
			return dbDao.searchTrade(jooList,rlane);
		}

		@Override
		public List<DetailVO> searchDeatailVO(JooCarrierVO jooCarrierVO,
				ArrayList<String> jooList, TradeVO tradeVO) throws EventException {
			try {
				return dbDao.searchDetailVO(jooCarrierVO,jooList,tradeVO);
			} catch(DAOException ex) {
				throw new EventException(new ErrorHandler(ex).getMessage(),ex);
			} catch (Exception ex) {
				throw new EventException(new ErrorHandler(ex).getMessage(),ex);
			}
		}
	
}