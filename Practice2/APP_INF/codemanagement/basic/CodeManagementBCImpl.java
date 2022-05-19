package com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.basic;


import java.util.ArrayList;
import java.util.List;

import com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.integration.CodemanagementDBDAO;
import com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.vo.CodeMgmtDetailVO;
import com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.vo.CodeMgmtMasterVO;
import com.clt.framework.component.message.ErrorHandler;
import com.clt.framework.core.layer.event.EventException;
import com.clt.framework.core.layer.integration.DAOException;
import com.clt.framework.support.layer.basic.BasicCommandSupport;
import com.clt.framework.support.view.signon.SignOnUserAccount;


public class CodeManagementBCImpl extends BasicCommandSupport implements CodeManagementBC{
	private transient CodemanagementDBDAO dbDao = null;
	public CodeManagementBCImpl() {
		dbDao = new CodemanagementDBDAO();
	}


	@Override
	public List<CodeMgmtMasterVO> searchMasterVO(CodeMgmtMasterVO materVO) throws DAOException {
		return dbDao.searchMasterVo(materVO);
	}

	@Override
	public List<CodeMgmtDetailVO> searchDetailVO(CodeMgmtMasterVO materVO)
			throws DAOException {
		return dbDao.searchDetailVo(materVO);
	}

	@Override
	public void multiMasterVO(CodeMgmtMasterVO[] materVO, SignOnUserAccount account) throws EventException  {
			List<CodeMgmtMasterVO> insertVoList = new ArrayList<CodeMgmtMasterVO>();
			List<CodeMgmtMasterVO> updateVoList = new ArrayList<CodeMgmtMasterVO>();
			List<CodeMgmtMasterVO> deleteVoList = new ArrayList<CodeMgmtMasterVO>();
		try{
			for ( int i=0; i<materVO.length; i++ ) {
				if ( materVO[i].getIbflag().equals("I")){
					materVO[i].setCreUsrId(account.getUsr_id());
					materVO[i].setUpdUsrId(account.getUsr_id());
					insertVoList.add(materVO[i]);
				} else if ( materVO[i].getIbflag().equals("U")){
					materVO[i].setUpdUsrId(account.getUsr_id());
					updateVoList.add(materVO[i]);
				} else if ( materVO[i].getIbflag().equals("D")){
					deleteVoList.add(materVO[i]) ;
				}
			}
			
			if ( insertVoList.size() > 0 ) {
				dbDao.addMasterVo(insertVoList);
			}
			
			if ( updateVoList.size() > 0 ) {
				dbDao.modifyMasterVO(updateVoList);
			}
			
			if ( deleteVoList.size()>0 ) {
				List<CodeMgmtDetailVO> listDetailVO = null;
				listDetailVO=dbDao.searchDetailVo(deleteVoList.get(0));
				if(listDetailVO.size() > 0){
					throw new DAOException(new ErrorHandler("ERR00007",new String[]{"Master Code"}).getMessage());
				}else if(listDetailVO.size() == 0 ){
					dbDao.removeMasterVO(deleteVoList.get(0));
				}
			}
		}
		catch (DAOException e) {
			throw new EventException(new ErrorHandler(e).getMessage(),e);
		} catch (Exception e) {
			throw new EventException(new ErrorHandler(e).getMessage(),e);
			 
		}
	}

	@Override
	public void multiDetailVO(CodeMgmtDetailVO[] detailVOs,
		SignOnUserAccount account) throws EventException {
		List<CodeMgmtDetailVO> insertVoList = new ArrayList<CodeMgmtDetailVO>();
		List<CodeMgmtDetailVO> updateVoList = new ArrayList<CodeMgmtDetailVO>();
		List<CodeMgmtDetailVO> deleteVoList = new ArrayList<CodeMgmtDetailVO>();
		//CodeMgmtDetailVO detailVO = new CodeMgmtDetailVO();
		try {
			for ( int i=0; i<detailVOs.length; i++ ) {
				
				if ( detailVOs[i].getIbflag().equals("I")){
					detailVOs[i].setCreUsrId(account.getUsr_id());
					detailVOs[i].setUpdUsrId(account.getUsr_id());
					insertVoList.add(detailVOs[i]);
				} else if ( detailVOs[i].getIbflag().equals("U")){
					detailVOs[i].setUpdUsrId(account.getUsr_id());
					updateVoList.add(detailVOs[i]);
				} else if ( detailVOs[i].getIbflag().equals("D")){
					deleteVoList.add(detailVOs[i]);
				}
			}
			
			if ( insertVoList.size() > 0 ) {
				dbDao.addDetailVOs(insertVoList);
			}
			
			if ( updateVoList.size() > 0 ) {
				dbDao.modifyDetailVOs(updateVoList);
			}
			if ( deleteVoList.size() > 0 ) {
				dbDao.removeDetailVOs(deleteVoList.get(0));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}


}
