/*=========================================================
*Copyright(c) 2022 CyberLogitec
*@FileName : SguTranningDBTradeDAOJooCarrierVORSQL.java
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

import java.util.HashMap;
import org.apache.log4j.Logger;
import com.clt.framework.support.db.ISQLTemplate;

/**
 *
 * @author HUY
 * @see DAO 참조
 * @since J2EE 1.6
 */

public class SguTranningDBTradeDAOJooCarrierVORSQL implements ISQLTemplate{

	private StringBuffer query = new StringBuffer();
	
	Logger log =Logger.getLogger(this.getClass());
	
	/** Parameters definition in params/param elements */
	private HashMap<String,String[]> params = null;
	
	/**
	  * <pre>
	  * Search Trade
	  * </pre>
	  */
	public SguTranningDBTradeDAOJooCarrierVORSQL(){
		setQuery();
		params = new HashMap<String,String[]>();
		query.append("/*").append("\n"); 
		query.append("Path : com.clt.apps.opus.esm.clv.sgutranning.sgutranning.integration").append("\n"); 
		query.append("FileName : SguTranningDBTradeDAOJooCarrierVORSQL").append("\n"); 
		query.append("*/").append("\n"); 
	}
	
	public String getSQL(){
		return query.toString();
	}
	
	public HashMap<String,String[]> getParams() {
		return params;
	}

	/**
	 * Query 생성
	 */
	public void setQuery(){
		query.append("SELECT DISTINCT(TRD_CD)" ).append("\n"); 
		query.append("FROM JOO_CARRIER" ).append("\n"); 
		query.append("WHERE JO_CRR_CD IN (#foreach($key IN ${jo_crr_cd})#if($velocityCount < $jo_crr_cd.size()) '$key', #else '$key' #end #end)" ).append("\n"); 
		query.append("AND RLANE_CD IN (#foreach($key IN ${rlane_cd})#if($velocityCount < $rlane_cd.size()) '$key', #else '$key' #end #end)" ).append("\n"); 

	}
}