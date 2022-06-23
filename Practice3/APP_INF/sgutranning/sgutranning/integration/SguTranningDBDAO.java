/*=========================================================
 *Copyright(c) 2022 CyberLogitec
 *@FileName : SguTranningDBDAO.java
 *@FileTitle : aa
 *Open Issues :
 *Change history :
 *@LastModifyDate : 2022.05.26
 *@LastModifier : 
 *@LastVersion : 1.0
 * 2022.05.26 
 * 1.0 Creation
=========================================================*/
package com.clt.apps.opus.esm.clv.sgutranning.sgutranning.integration;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.basic.SguTranningBCImpl;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.DetailVO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.JooCarrierVO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.TradeVO;
import com.clt.framework.component.message.ErrorHandler;
import com.clt.framework.component.rowset.DBRowSet;
import com.clt.framework.core.layer.event.EventException;
import com.clt.framework.core.layer.integration.DAOException;
import com.clt.framework.support.db.ISQLTemplate;
import com.clt.framework.support.db.RowSetUtil;
import com.clt.framework.support.db.SQLExecuter;
import com.clt.framework.support.layer.integration.DBDAOSupport;

/**
 * ALPS SguTranningDBDAO <br>
 * -JDBC operation to process ALPS-SguTranning system Business Logic.<br>
 * 
 * @author HUY
 * @see SguTranningBCImpl reference
 * @since J2EE 1.6
 */
public class SguTranningDBDAO extends DBDAOSupport {
	
	/**
	 * This method is used for searching summary grid data 
	 * @param jooCarrierVO
	 * @param jooList
	 * @param tradeVO
	 * @return
	 * @throws DAOException
	 */
	@SuppressWarnings("unchecked")
	public List<JooCarrierVO> searchJooCarrierVO(JooCarrierVO jooCarrierVO, ArrayList<String> jooList, TradeVO tradeVO)
			throws DAOException {
		DBRowSet dbRowset = null;
		List<JooCarrierVO> list = null;
		// query parameter
		Map<String, Object> param = new HashMap<String, Object>();
		// velocity parameter
		Map<String, Object> velParam = new HashMap<String, Object>();
		
		try {
			if(!"ALL".equals(jooCarrierVO.getJoCrrCd())){
				velParam.put("jo_crr_cds", jooList);
				param.put("jo_crr_cds", "ALL");
			}else{
				velParam.put("jo_crr_cds", "ALL");
				param.put("jo_crr_cds", "ALL");
			}
			if(jooCarrierVO.getRlaneCd().isEmpty()){
				param.put("rlane_cd", "");
				velParam.put("rlane_cd", "");
			}else{
				param.put("rlane_cd", jooCarrierVO.getRlaneCd());
				velParam.put("rlane_cd", jooCarrierVO.getRlaneCd());
			}
			if(tradeVO.getTrdCd().isEmpty()){
				param.put("trd_cd", "");
				velParam.put("trd_cd", "");
			}else{
				param.put("trd_cd", tradeVO.getTrdCd());
				velParam.put("trd_cd", tradeVO.getTrdCd());
			}
			param.put("fr_acct_yrmon",tradeVO.getFrAcctYrmon());
			param.put("to_acct_yrmon",tradeVO.getToAcctYrmon());
			velParam.put("fr_acct_yrmon", tradeVO.getFrAcctYrmon());
			velParam.put("to_acct_yrmon", tradeVO.getToAcctYrmon());
			dbRowset = new SQLExecuter("").executeQuery((ISQLTemplate) new SguTranningDBDAOJooCarrierVORSQL(),param, velParam);
			list = (List) RowSetUtil.rowSetToVOs(dbRowset, JooCarrierVO.class);
		} catch (SQLException se) {
			log.error(se.getMessage(), se);
			throw new DAOException(new ErrorHandler(se).getMessage());
		} catch (Exception ex) {
			log.error(ex.getMessage(), ex);
			throw new DAOException(new ErrorHandler(ex).getMessage());
		}
		return list;
	}

	/**
	 * This method is used for getting data for partner combo box
	 * @return List<JooCarrierVO>
	 * @throws EventException
	 */
	@SuppressWarnings("unchecked")
	public List<JooCarrierVO> searchPartner() {
		DBRowSet dbRowset = null;
		List<JooCarrierVO> list = null;
		try {
			dbRowset = new SQLExecuter("")
					.executeQuery(
							(ISQLTemplate) new SguTranningDBSearchPastnerDAOJooCarrierVORSQL(),
							null, null);
			list = (List) RowSetUtil.rowSetToVOs(dbRowset, JooCarrierVO.class);
		} catch (SQLException se) {
			log.error(se.getMessage(), se);
		} catch (Exception ex) {
			log.error(ex.getMessage(), ex);
		}
		return list;
	}
	/**
	 * this method is used for getting data for lane combo box 
	 * @param jooList
	 * @return List<JooCarrierVO>
	 */
	@SuppressWarnings("unchecked")
	public List<JooCarrierVO> searchLane(ArrayList<String> jooList) {
		DBRowSet dbRowset = null;
		List<JooCarrierVO> list = null;
		// query parameter
		Map<String, Object> param = new HashMap<String, Object>();
		// velocity parameter
		Map<String, Object> velParam = new HashMap<String, Object>();

		try {
			if (jooList.size() > 0) {
				velParam.put("jo_crr_cd", jooList);
			}
			dbRowset = new SQLExecuter("").executeQuery(
					(ISQLTemplate) new SguTranningDBSearchLaneDAOJooCarrierVORSQL(),
					null, velParam);
			list = (List) RowSetUtil.rowSetToVOs(dbRowset, JooCarrierVO.class);
		} catch (SQLException se) {
			log.error(se.getMessage(), se);
			// throw new DAOException(new ErrorHandler(se).getMessage());
		} catch (Exception ex) {
			log.error(ex.getMessage(), ex);
			// throw new DAOException(new ErrorHandler(ex).getMessage());
		}
		return list;
	}
	/**
	 * this method is used to get data for trade combo box  
	 * @param jooList
	 * @param rlane
	 * @return List<TradeVO>
	 */
	@SuppressWarnings("unchecked")
	public List<TradeVO> searchTrade(ArrayList<String> jooList,
			String rlane) {
		DBRowSet dbRowset = null;
		List<TradeVO> list = null;
		// query parameter
		Map<String, Object> param = new HashMap<String, Object>();
		// velocity parameter
		Map<String, Object> velParam = new HashMap<String, Object>();

		try {
			if (jooList.size() > 0) {
				velParam.put("jo_crr_cd", jooList);
			}
			param.put("rlane_cd", rlane);
			dbRowset = new SQLExecuter("").executeQuery(
					(ISQLTemplate) new SguTranningDBTradeDAOTradeVORSQL(),
					param, velParam);
			list = (List) RowSetUtil.rowSetToVOs(dbRowset, TradeVO.class);
		} catch (SQLException se) {
			log.error(se.getMessage(), se);
			// throw new DAOException(new ErrorHandler(se).getMessage());
		} catch (Exception ex) {
			log.error(ex.getMessage(), ex);
			// throw new DAOException(new ErrorHandler(ex).getMessage());
		}
		return list;
	}
	/**
	 * This method is used for searching detail grid data 
	 * @param jooCarrierVO
	 * @param jooList
	 * @param tradeVO
	 * @return
	 * @throws EventException
	 */
	@SuppressWarnings("unchecked")
	public List<DetailVO> searchDetailVO(JooCarrierVO jooCarrierVO,
			ArrayList<String> jooList, TradeVO tradeVO) throws DAOException {
		DBRowSet dbRowset = null;
		List<DetailVO> list = null;
		// query parameter
		Map<String, Object> param = new HashMap<String, Object>();
		// velocity parameter
		Map<String, Object> velParam = new HashMap<String, Object>();
		
		try {
			if(!"ALL".equals(jooCarrierVO.getJoCrrCd())){
				velParam.put("jo_crr_cds", jooList);
				param.put("jo_crr_cds", "ALL");
			}else{
				velParam.put("jo_crr_cds", "ALL");
				param.put("jo_crr_cds", "ALL");
			}
			if(jooCarrierVO.getRlaneCd().isEmpty()){
				param.put("rlane_cd", "");
				velParam.put("rlane_cd", "");
			}else{
				param.put("rlane_cd", jooCarrierVO.getRlaneCd());
				velParam.put("rlane_cd", jooCarrierVO.getRlaneCd());
			}
			if(tradeVO.getTrdCd().isEmpty()){
				param.put("trd_cd", "");
				velParam.put("trd_cd", "");
			}else{
				param.put("trd_cd", tradeVO.getTrdCd());
				velParam.put("trd_cd", tradeVO.getTrdCd());
			}
			param.put("fr_acct_yrmon",tradeVO.getFrAcctYrmon());
			param.put("to_acct_yrmon",tradeVO.getToAcctYrmon());
			velParam.put("fr_acct_yrmon", tradeVO.getFrAcctYrmon());
			velParam.put("to_acct_yrmon", tradeVO.getToAcctYrmon());
			dbRowset = new SQLExecuter("").executeQuery((ISQLTemplate) new SguTranningDBDAODetailVORSQL(),param, velParam);
			list = (List) RowSetUtil.rowSetToVOs(dbRowset, DetailVO.class);
		} catch (SQLException se) {
			log.error(se.getMessage(), se);
			throw new DAOException(new ErrorHandler(se).getMessage());
		} catch (Exception ex) {
			log.error(ex.getMessage(), ex);
			throw new DAOException(new ErrorHandler(ex).getMessage());
		}
		return list;
	}

}