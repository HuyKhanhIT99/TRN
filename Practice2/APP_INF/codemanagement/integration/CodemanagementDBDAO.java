package com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.integration;

import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.vo.CodeMgmtDetailVO;
import com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.vo.CodeMgmtMasterVO;
import com.clt.framework.component.message.ErrorHandler;
import com.clt.framework.component.rowset.DBRowSet;
import com.clt.framework.core.layer.integration.DAOException;
import com.clt.framework.support.db.ISQLTemplate;
import com.clt.framework.support.db.RowSetUtil;
import com.clt.framework.support.db.SQLExecuter;
import com.clt.framework.support.layer.integration.DBDAOSupport;

public class CodemanagementDBDAO extends DBDAOSupport{

	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@SuppressWarnings("unchecked")
	public List<CodeMgmtMasterVO> searchMasterVo(CodeMgmtMasterVO materVO) throws DAOException {
		DBRowSet dbRowset = null;
		List<CodeMgmtMasterVO> list = null; 
		Map<String, Object> param = new HashMap<String, Object>();
		//velocity parameter
		Map<String, Object> velParam = new HashMap<String, Object>();
		try {
			if(materVO != null){
				Map<String, String> mapVO = materVO.getColumnValues();
				
				param.putAll(mapVO);
				velParam.putAll(mapVO);
			}
		
			dbRowset = new SQLExecuter("").executeQuery((ISQLTemplate)new CodemanagementDBDAOCodeMgmtMasterVORSQL(), param, velParam);
			list = (List)RowSetUtil.rowSetToVOs(dbRowset, CodeMgmtMasterVO.class);
		} catch (SQLException | DAOException e) {
			throw new DAOException(new ErrorHandler(e).getMessage());
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		}
		return list;
	}
	@SuppressWarnings("unchecked")
	public List<CodeMgmtDetailVO> searchDetailVo(CodeMgmtMasterVO masterVO) throws DAOException {
		DBRowSet dbRowset = null;
		List<CodeMgmtDetailVO> list = null; 
		Map<String, Object> param = new HashMap<String, Object>();
		//velocity parameter
		Map<String, Object> velParam = new HashMap<String, Object>();
		try {
			if(masterVO != null){
				Map<String, String> mapVO = masterVO.getColumnValues();
				
				param.putAll(mapVO);
				velParam.putAll(mapVO);
			}
		
			dbRowset = new SQLExecuter("").executeQuery((ISQLTemplate)new CodemanagementDBDAOCodeMgmtDetailVORSQL(), param, velParam);
			list = (List)RowSetUtil.rowSetToVOs(dbRowset, CodeMgmtDetailVO.class);
		} catch (SQLException | DAOException e) {
			throw new DAOException(new ErrorHandler(e).getMessage());
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		}
		return list;
	}

	public int[] addMasterVo(List<CodeMgmtMasterVO> insertVoList) throws DAOException {
		// TODO Auto-generated method stub
		int insCnt[] = null;
		try {
			SQLExecuter sqlExe = new SQLExecuter("SysComDB");
			if(insertVoList .size() > 0){
				insCnt = sqlExe.executeBatch((ISQLTemplate)new CodemanagementDBDAOCodeMgmtMasterVOCSQL(), insertVoList,null);
				for(int i = 0; i < insCnt.length; i++){
					if(insCnt[i]== Statement.EXECUTE_FAILED)
						throw new DAOException("Fail to insert No"+ i + " SQL");
				}
			}
		} catch(SQLException se) {
			log.error(se.getMessage(),se);
			throw new DAOException(new ErrorHandler(se).getMessage());
		} catch(Exception ex) {
			log.error(ex.getMessage(),ex);
			throw new DAOException(new ErrorHandler(ex).getMessage());
		}
		return insCnt;
		
	}

	public int[] modifyMasterVO(List<CodeMgmtMasterVO> updateVoList) {
		int updCnt[] = null;
		try {
			SQLExecuter sqlExe = new SQLExecuter("");
			if(updateVoList.size() > 0){
				updCnt = sqlExe.executeBatch((ISQLTemplate)new CodemanagementDBDAOCodeMgmtMasterVOUSQL (), updateVoList,null);
				for(int i = 0; i < updCnt.length; i++){
					if(updCnt[i]== Statement.EXECUTE_FAILED)
						throw new DAOException("Fail to insert No"+ i + " SQL");
				}
			}
		} catch(SQLException se) {
			log.error(se.getMessage(),se);
		} catch(Exception ex) {
			log.error(ex.getMessage(),ex);
		}
		return updCnt;
		
	}

	
	public int removeMasterVO(CodeMgmtMasterVO masterVO) throws DAOException,Exception {
		//query parameter
		Map<String, Object> param = new HashMap<String, Object>();
		//velocity parameter
		Map<String, Object> velParam = new HashMap<String, Object>();
		
		int result = 0;
		try {
			Map<String, String> mapVO = masterVO.getColumnValues();
			
			param.putAll(mapVO);
			velParam.putAll(mapVO);
			
			SQLExecuter sqlExe = new SQLExecuter("");
			result = sqlExe.executeUpdate((ISQLTemplate)new CodemanagementDBDAOCodeMgmtMasterVODSQL(), param, velParam);
			if(result == Statement.EXECUTE_FAILED)
					throw new DAOException("Fail to insert SQL");
		} catch(SQLException se) {
			log.error(se.getMessage(),se);
			throw new DAOException(new ErrorHandler(se).getMessage());
		} catch(Exception ex) {
			log.error(ex.getMessage(),ex);
			throw new DAOException(new ErrorHandler(ex).getMessage());
		}
		return result;
	}

	public int[] addDetailVOs(List<CodeMgmtDetailVO> insertVoList) {
		int insCnt[] = null;
		try {
			SQLExecuter sqlExe = new SQLExecuter("SysComDB");
			if(insertVoList .size() > 0){
				insCnt = sqlExe.executeBatch((ISQLTemplate)new CodemanagementDBDAOCodeMgmtDetailVOCSQL(), insertVoList,null);
				for(int i = 0; i < insCnt.length; i++){
					if(insCnt[i]== Statement.EXECUTE_FAILED)
						throw new DAOException("Fail to insert No"+ i + " SQL");
				}
			}
		} catch(SQLException se) {
			log.error(se.getMessage(),se);
		} catch(Exception ex) {
			log.error(ex.getMessage(),ex);
		}
		return insCnt;
		
	}

	public int[] modifyDetailVOs(List<CodeMgmtDetailVO> updateVoList) {
		int updCnt[] = null;
		try {
			SQLExecuter sqlExe = new SQLExecuter("");
			if(updateVoList.size() > 0){
				updCnt = sqlExe.executeBatch((ISQLTemplate)new CodemanagementDBDAOCodeMgmtDetailVOUSQL(), updateVoList,null);
				for(int i = 0; i < updCnt.length; i++){
					if(updCnt[i]== Statement.EXECUTE_FAILED)
						throw new DAOException("Fail to insert No"+ i + " SQL");
				}
			}
		} catch(SQLException se) {
			log.error(se.getMessage(),se);
		} catch(Exception ex) {
			log.error(ex.getMessage(),ex);
		}
		return updCnt;	
	}
	public int removeDetailVOs(CodeMgmtDetailVO detailVO) throws DAOException,Exception {
		//query parameter
		Map<String, Object> param = new HashMap<String, Object>();
		//velocity parameter
		Map<String, Object> velParam = new HashMap<String, Object>();
		
		int result = 0;
		try {
			Map<String, String> mapVO = detailVO.getColumnValues();
			
			param.putAll(mapVO);
			velParam.putAll(mapVO);
			
			SQLExecuter sqlExe = new SQLExecuter("");
			result = sqlExe.executeUpdate((ISQLTemplate)new CodemanagementDBDAOCodeMgmtDetailVODSQL(), param, velParam);
			if(result == Statement.EXECUTE_FAILED)
					throw new DAOException("Fail to insert SQL");
		} catch(SQLException se) {
			log.error(se.getMessage(),se);
			throw new DAOException(new ErrorHandler(se).getMessage());
		} catch(Exception ex) {
			log.error(ex.getMessage(),ex);
			throw new DAOException(new ErrorHandler(ex).getMessage());
		}
		return result;
	}
	
	
	
}
