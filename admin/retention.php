<?php

include '../daemon/api/DBApi.php';
include '../daemon/api/LLCrmApi.php';

// check client ip
$dbApi = DBApi::getInstance();
if(!$dbApi->checkClientIp())
{
	header("Location: blockip_alert.php");
	return;
}

session_start();

if (!isset($_SESSION['user']) || $_SESSION['user'] == '')
	header("Location: ../login.php");

$user_name = $_SESSION['user'];
$tab_name = "Retention";

$dbApi = DBApi::getInstance();
$crmList = $dbApi->getAllCrmByAccountId($_SESSION['user_id']);

?>


<!DOCTYPE html>
<html>
	<?php include('common/crm_header.php'); ?>
<body>
	<?php include('common/crm_body_up.php'); ?>
	<div class="row">
		<div class="col-md-12">
			<div class="row tab_row_default">
				<div class="col-lg-10"><span class="glyphicon glyphicon-tasks" aria-hidden="true" style="width:25px;color:#fff"></span> Retention Report</div>
				<div class="col-lg-2 retention_waiting" style="text-align:right"><p></p></div>
			</div>
			<div class="alert alert-warning retention_alert" role="alert" style="display:none"></div>
			<div class="row">
				<div class="col-lg-7">
					<div class="input-daterange input-group" id="datepicker">
						<span class="input-group-btn">
							<button type="button" class="btn btn-default btn-sm dropdown-toggle crm_toggle_button" data-toggle="dropdown" aria-expanded="false" style="width:150px">
								<?php
									if ($crmList != null && count($crmList) > 0)
										echo $crmList[0][1].' ';
									else
										echo 'CRM Name ';
								?>    										
								<span class="caret"></span>
							</button>
							<ul class="dropdown-menu crm_dropdown_menu" role="menu">
								<?php
									if ($crmList != null) {
										for ($i = 0; $i < count($crmList); $i++)
											echo '<li><a href="#" id="'.$crmList[$i][0].'" class="crm_dropdown_list">'.$crmList[$i][1].'</a></li>';
									}
								?>
							</ul>
						</span>
						<span class="input-group-btn">
							<button type="button" class="btn btn-default btn-sm dropdown-toggle date_toggle_button" data-toggle="dropdown" aria-expanded="false" style="width:150px">
								Week To Date <span class="caret"></span>
							</button>
							<ul class="dropdown-menu date_dropdown_menu" role="menu">
								<li><a href="#" id="date_today">Today</a></li>
								<li><a href="#" id="date_yesterday">Yesterday</a></li>
								<li><a href="#" id="date_thisweek">Week To Date</a></li>
								<li><a href="#" id="date_thismonth">Month To Date</a></li>
								<li><a href="#" id="date_thisyear">Year To Date</a></li>
								<li><a href="#" id="date_lastweek">Last Week</a></li>
								<li><a href="#" id="date_custom">Custom</a></li>
							</ul>
						</span>
						<span class="input-group-addon" style="font-size:12px;background:#f9f9f9">From</span>
					    <input id="from_date" type="text" class="input-sm form-control" name="start"/>
					    <span class="input-group-addon" style="font-size:12px;background:#f9f9f9">To</span>
					    <input id="to_date" type="text" class="input-sm form-control" name="end"/>
					    <span class="input-group-addon" style="font-size:12px;background:#f9f9f9">Subscription Cycles</span>
					    <span class="input-group-btn">
							<button type="button" class="btn btn-default btn-sm dropdown-toggle cycle_toggle_button" data-toggle="dropdown" aria-expanded="false" style="width:50px">
								1 <span class="caret"></span>
							</button>
							<ul class="dropdown-menu cycle_dropdown_menu" role="menu">
								<li><a href="#" id="cycle_1">1</a></li>
								<li><a href="#" id="cycle_2">2</a></li>
							</ul>
						</span>
						<span class="input-group-btn">
							<button class="btn btn-default btn-sm retention_search_button" type="button" style="width:100px">Search</button>
						</span>    
					</div>
				</div>
				<div class="col-lg-5" style="text-align:right; height:30px; padding-top:5px;">
					<a class="export_link" href="retention_export.php"><span class="glyphicon glyphicon-stats" aria-hidden="true"></span>&nbsp;&nbsp;Export Page</a>
				</div>
			</div>
			<table class="table table-striped table-hover table_retention" style="margin-top:10px;">
					<thead class="table_retention_head">
						<tr>
						<th rowspan="2" style="vertical-align:middle"><button type="button" class="btn btn-link btn-sm btn_campaign_head" id=""><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span></button></th>
						<th rowspan="2" style="vertical-align:middle"></th>
						<th rowspan="2" style="vertical-align:middle">Campaign (ID) Name</th>
						<th colspan="6" style="border: 1px solid #dadada">Initial Cycle</th>
					</tr>
					<tr>
						<th style="border-left: 1px solid #dadada">Gross Orders</th>
						<th>Net Approved</th>
						<th>Void/Full Refund</th>
						<th>Partial Refund</th>
						<th>Void/Refund Revenue</th>
						<th>Approval Rate</th>
					</tr>
					</thead>
					<tbody class="table_retention_body">
					</tbody>
			</table>
 		</div> 		 		
	</div>
	<?php include('common/crm_body_down.php'); ?>
</body>
</html>
