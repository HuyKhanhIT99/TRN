package com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.basic;

import java.util.List;

import com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.vo.CodeMgmtDetailVO;
import com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.vo.CodeMgmtMasterVO;
import com.clt.framework.core.layer.event.EventException;
import com.clt.framework.core.layer.integration.DAOException;
import com.clt.framework.support.view.signon.SignOnUserAccount;

public interface CodeManagementBC {
	List<CodeMgmtMasterVO> searchMasterVO(CodeMgmtMasterVO materVO) throws DAOException;
	List<CodeMgmtDetailVO> searchDetailVO(CodeMgmtMasterVO materVO) throws DAOException;
	public void multiMasterVO(CodeMgmtMasterVO[] materVO,SignOnUserAccount account) throws  EventException;
	public void multiDetailVO(CodeMgmtDetailVO[] detailVO,SignOnUserAccount account) throws EventException;
}
