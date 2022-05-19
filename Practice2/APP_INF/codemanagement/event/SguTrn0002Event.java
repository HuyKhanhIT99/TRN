package com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.event;

import com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.vo.CodeMgmtDetailVO;
import com.clt.apps.opus.esm.clv.sgutraning01.codemanagement.vo.CodeMgmtMasterVO;
import com.clt.framework.support.layer.event.EventSupport;

public class SguTrn0002Event extends EventSupport {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	int sheetNo = 0;
	CodeMgmtDetailVO codeMgmtDetailVo = null;
	CodeMgmtDetailVO[] codeMgmtDetailVos=null;
	CodeMgmtMasterVO codeMgmtMasterVo = null;
	CodeMgmtMasterVO[] codeMgmtMasterVos = null;
	public int getSheetNo() {
		return sheetNo;
	}
	public void setSheetNo(int sheetNo) {
		this.sheetNo = sheetNo;
	}
	public CodeMgmtDetailVO getCodeMgmtDetailVo() {
		return codeMgmtDetailVo;
	}
	public void setCodeMgmtDetailVo(CodeMgmtDetailVO codeMgmtDetailVo) {
		this.codeMgmtDetailVo = codeMgmtDetailVo;
	}
	public CodeMgmtDetailVO[] getCodeMgmtDetailVos() {
		return codeMgmtDetailVos;
	}
	public void setCodeMgmtDetailVos(CodeMgmtDetailVO[] codeMgmtDetailVos) {
		this.codeMgmtDetailVos = codeMgmtDetailVos;
	}
	public CodeMgmtMasterVO getCodeMgmtMasterVo() {
		return codeMgmtMasterVo;
	}
	public void setCodeMgmtMasterVo(CodeMgmtMasterVO codeMgmtMasterVo) {
		this.codeMgmtMasterVo = codeMgmtMasterVo;
	}
	public CodeMgmtMasterVO[] getCodeMgmtMasterVos() {
		return codeMgmtMasterVos;
	}
	public void setCodeMgmtMasterVos(CodeMgmtMasterVO[] codeMgmtMasterVos) {
		this.codeMgmtMasterVos = codeMgmtMasterVos;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
}
