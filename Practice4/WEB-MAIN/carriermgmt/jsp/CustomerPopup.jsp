<script language="javascript">
	function setupPage(){
		loadPage();
	}
</script>

<form name="form">
	<input type="hidden" name="f_cmd">
	<input type="hidden" name="pagerows">
	
	<div class="layer_popup_title">
		<div class="page_title_area clear">
			<div class="opus_design_btn">
			   <button type="button" class="btn_accent" name="btn_Retrieve" id="btn_Retrieve">Retrieve</button><!--
			   --><button type="button" class="btn_normal" name="btn_OK" id="btn_OK">OK</button>
			</div>
		    <div class="location">
		     	<span id="navigation"></span>
		    </div>
		</div>
	</div>
	
	<div class="wrap_search">
		<div class="opus_design_inquiry">
		    <table>
		        <tbody>
					<tr>
						<th width="40">Country</th>
						<td width="120">
							<input type="text" style="width:100px;" class="input" value="" name="s_cust_cnt_cd" id="s_cust_cnt_cd">
						</td>
						<th width="40">Sequence</th>
						<td>
							<input type="number" min=0 style="width:100px;" class="input" value="" name="s_cust_seq" id="s_cust_seq">
						</td>
					</tr> 
				</tbody>
			</table>
		</div>
	</div>

	<div class="wrap_result">
		<div class="opus_design_grid">
			<script language="javascript">ComSheetObject('sheet1');</script>
		</div>	
	</div>
</form>