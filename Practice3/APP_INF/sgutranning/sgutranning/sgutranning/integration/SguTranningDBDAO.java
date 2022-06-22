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
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.basic.SguTranningBCImpl;
import com.clt.framework.component.message.ErrorHandler;
import com.clt.framework.component.rowset.DBRowSet;
import com.clt.framework.core.layer.integration.DAOException;
import com.clt.framework.support.db.ISQLTemplate;
import com.clt.framework.support.db.RowSetUtil;
import com.clt.framework.support.db.SQLExecuter;
import com.clt.framework.support.layer.integration.DBDAOSupport;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.DetailVO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.JooCarrierVO;
import com.clt.apps.opus.esm.clv.sgutranning.sgutranning.vo.TradeVO;

/**
 * ALPS SguTranningDBDAO <br>
 * - ALPS-SguTranning system Business Logic을 처리하기 위한 JDBC 작업수행.<br>
 * 
 * @author HUY
 * @see SguTranningBCImpl 참조
 * @since J2EE 1.6
 */
public class SguTranningDBDAO extends DBDAOSupport {

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
			if(!jooCarrierVO.getJoCrrCd().equals("ALL")){
				velParam.put("jo_crr_cds", jooList);
				param.put("jo_crr_cds", "ALL");
			}else{
				velParam.put("jo_crr_cds", "ALL");
				param.put("jo_crr_cds", "ALL");
			}
			if(!jooCarrierVO.getRlaneCd().equals("")){
				param.put("rlane_cd", jooCarrierVO.getRlaneCd());
				velParam.put("rlane_cd", jooCarrierVO.getRlaneCd());
			}else{
				param.put("rlane_cd", "");
				velParam.put("rlane_cd", "");
			}
			if(tradeVO.getTrdCd().equals("")){
				param.put("trd_cd", "");
				velParam.put("trd_cd", "");
				param.put("fr_acct_yrmon",tradeVO.getFrAcctYrmon());
				param.put("to_acct_yrmon",tradeVO.getToAcctYrmon());
				velParam.put("fr_acct_yrmon", tradeVO.getFrAcctYrmon());
				velParam.put("to_acct_yrmon", tradeVO.getToAcctYrmon());
			}else{
				param.put("trd_cd", tradeVO.getTrdCd());
				velParam.put("trd_cd", tradeVO.getTrdCd());
				param.put("fr_acct_yrmon",tradeVO.getFrAcctYrmon());
				param.put("to_acct_yrmon",tradeVO.getToAcctYrmon());
				velParam.put("fr_acct_yrmon", tradeVO.getFrAcctYrmon());
				velParam.put("to_acct_yrmon", tradeVO.getToAcctYrmon());
			}
			dbRowset = new SQLExecuter("").executeQuery(
					(ISQLTemplate) new SguTranningDBDAOJooCarrierVORSQL(),
					param, velParam);
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

	public void addmultiJooCarrierVO(JooCarrierVO jooCarrierVO)
			throws DAOException, Exception {
		// query parameter
		Map<String, Object> param = new HashMap<String, Object>();
		// velocity parameter
		Map<String, Object> velParam = new HashMap<String, Object>();
		try {
			Map<String, String> mapVO = jooCarrierVO.getColumnValues();

			param.putAll(mapVO);
			velParam.putAll(mapVO);

			SQLExecuter sqlExe = new SQLExecuter("");
			int result = sqlExe.executeUpdate(
					(ISQLTemplate) new SguTranningDBDAOJooCarrierVOCSQL(),
					param, velParam);
			if (result == Statement.EXECUTE_FAILED)
				throw new DAOException("Fail to insert SQL");
		} catch (SQLException se) {
			log.error(se.getMessage(), se);
			throw new DAOException(new ErrorHandler(se).getMessage());
		} catch (Exception ex) {
			log.error(ex.getMessage(), ex);
			throw new DAOException(new ErrorHandler(ex).getMessage());
		}
	}

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
			if(!jooCarrierVO.getJoCrrCd().equals("ALL")){
				velParam.put("jo_crr_cds", jooList);
				param.put("jo_crr_cds", "ALL");
			}else{
				velParam.put("jo_crr_cds", "ALL");
				param.put("jo_crr_cds", "ALL");
			}
			if(!jooCarrierVO.getRlaneCd().equals("")){
				param.put("rlane_cd", jooCarrierVO.getRlaneCd());
				velParam.put("rlane_cd", jooCarrierVO.getRlaneCd());
			}else{
				param.put("rlane_cd", "");
				velParam.put("rlane_cd", "");
			}
			if(tradeVO.getTrdCd().equals("")){
				param.put("trd_cd", "");
				velParam.put("trd_cd", "");
				param.put("fr_acct_yrmon",tradeVO.getFrAcctYrmon());
				param.put("to_acct_yrmon",tradeVO.getToAcctYrmon());
				velParam.put("fr_acct_yrmon", tradeVO.getFrAcctYrmon());
				velParam.put("to_acct_yrmon", tradeVO.getToAcctYrmon());
			}else{
				param.put("trd_cd", tradeVO.getTrdCd());
				velParam.put("trd_cd", tradeVO.getTrdCd());
				param.put("fr_acct_yrmon",tradeVO.getFrAcctYrmon());
				param.put("to_acct_yrmon",tradeVO.getToAcctYrmon());
				velParam.put("fr_acct_yrmon", tradeVO.getFrAcctYrmon());
				velParam.put("to_acct_yrmon", tradeVO.getToAcctYrmon());
			}
			dbRowset = new SQLExecuter("").executeQuery(
					(ISQLTemplate) new SguTranningDBDAODetailVORSQL(),
					param, velParam);
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