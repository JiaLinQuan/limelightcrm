jQuery( document ).ready(function( $ ) 
{
	var page_number = 1;
    var page_count = 10;
    var show_pages = 7;
    var all_items = 0;

    var crm_list;

	var affiliate_waiting = false;

	var affiliate_id = -1;


    //var spinner = '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';
    var spinner = '<img src="../images/loading.gif" style="width:22px;height:22;">';

	
	init();


	function init()
	{
        ajaxCrmList();
	}

	function show_alert(type, msg) 
    {
        if (type == 'main')
        {
            $('.setting_affiliate_alert').html(msg);
            $('.setting_affiliate_alert').fadeIn(1000, function () {
                $('.setting_affiliate_alert').fadeOut(3000);
            });
        }
        else if (type == 'add')
        {
            $('.label_add_alert').html(msg);
            $('.label_add_alert').fadeIn(1000, function () {
                $('.label_add_alert').fadeOut(3000);
            });
        }
        else if (type == 'edit')
        {
            $('.label_edit_alert').html(msg);
            $('.label_edit_alert').fadeIn(1000, function () {
                $('.label_edit_alert').fadeOut(3000);
            });
        }
    }

    function show_waiting(show)
    {
        affiliate_waiting = show;

        if (affiliate_waiting)
            $('.setting_affiliate_waiting p').html(spinner);
        else
            $('.setting_affiliate_waiting').html("<p></p>");
    }

    // add affiliate function
    $('.btn_affiliate_add').click(function ()
    {
        var html = '';

        html += '<div class="alert alert-warning label_add_alert" role="alert" style="display:none"></div>';
        html += '<div class="row" style="margin-bottom:5px;">';
        html += '<div class="col-md-3 modal_input_label">Affiliate ID</div>';
        html += '<div class="col-md-9"><input type="text" class="form-control input-sm add_affiliate_id"></div>';
        html += '</div>';
        html += '<div class="row" style="margin-bottom:5px;">';
        html += '<div class="col-md-3 modal_input_label">Affiliate Label</div>';
        html += '<div class="col-md-9"><input type="text" class="form-control input-sm add_affiliate_label"></div>'
        html += '</div>';

        for (var i = 0; i < crm_list.length; i ++)
        {
            html += '<div class="row" style="margin-bottom:5px;">';
            html += '<div class="col-md-3 modal_input_label">' + crm_list[i][1] + '</div>';
            html += '<div class="col-md-9"><input type="text" id="addgoal_' + crm_list[i][0] + '" class="form-control input-sm add_goals"></div>'
            html += '</div>';
        }

        $('.affiliate_add_body').html(html);
    });

    $('.modal_btn_label_add').click(function ()
    {
        if ($('.add_affiliate_id').val() == '')
        {
            show_alert('add', 'Please input Affiliate ID.');
            $('.add_affiliate_id').focus();
            return;
        }

        var crm_ids = '';
        var goals = '';
        $('.add_goals').each( function(i) 
        {
            if (crm_ids != '') crm_ids += ',';
            if (goals != '') goals += ',';

            crm_ids += $(this).prop('id').substring(8);

            if ($(this).val() == '')
                goals += '0';
            else
                goals += $(this).val();
        });
        
        $('#affiliate_add_modal').modal('toggle');
        ajaxAffiliateAdd($('.add_affiliate_id').val(), $('.add_affiliate_label').val(), crm_ids, goals);
    });

    // edit affiliate function
    $('.table_affiliate_body').on('click', '.btn_affiliate_edit', function (e)
    {
        affiliate_id = $(this).prop('id');

        var html = '';

        html += '<div class="alert alert-warning label_edit_alert" role="alert" style="display:none"></div>';
        html += '<div class="row" style="margin-bottom:5px;">';
        html += '<div class="col-md-3 modal_input_label">Affiliate ID</div>';
        html += '<div class="col-md-9"><input type="text" class="form-control input-sm edit_affiliate_id" value="' + $('#aid_' + affiliate_id).text() + '" readonly></div>';
        html += '</div>';
        html += '<div class="row" style="margin-bottom:5px;">';
        html += '<div class="col-md-3 modal_input_label">Affiliate Label</div>';
        html += '<div class="col-md-9"><input type="text" class="form-control input-sm edit_affiliate_label" value="' + $('#alabel_' + affiliate_id).text() + '"></div>'
        html += '</div>';

        for (var i = 0; i < crm_list.length; i ++)
        {
            html += '<div class="row" style="margin-bottom:5px;">';
            html += '<div class="col-md-3 modal_input_label">' + crm_list[i][1] + '</div>';
            html += '<div class="col-md-9"><input type="text" id="editgoal_' + crm_list[i][0] + '" class="form-control input-sm edit_goals" value="' + $('#goal_' + affiliate_id + '_' + crm_list[i][0]).text() + '"></div>'
            html += '</div>';
        }

        $('.affiliate_edit_body').html(html);
    });

    $('.modal_btn_label_edit').click(function ()
    {
        if ($('.edit_affiliate_id').val() == '')
        {
            show_alert('edit', 'Please input Affiliate ID.');
            $('.edit_affiliate_id').focus();
            return;
        }

        var crm_ids = '';
        var goals = '';
        $('.edit_goals').each( function(i) 
        {
            if (crm_ids != '') crm_ids += ',';
            if (goals != '') goals += ',';

            crm_ids += $(this).prop('id').substring(9);

            if ($(this).val() == '')
                goals += '0';
            else
                goals += $(this).val();
        });
        
        $('#affiliate_edit_modal').modal('toggle');
        ajaxAffiliateEdit($('.edit_affiliate_id').val(), $('.edit_affiliate_label').val(), crm_ids, goals);
    });

    // delete affiliate function
    $('.table_affiliate_body').on('click', '.btn_affiliate_delete', function (e)
    {
        affiliate_id = $(this).prop('id');
    });

    $('.modal_btn_label_delete').click(function ()
    {
        $('#affiliate_delete_modal').modal('toggle');
        ajaxAffiliateDelete();
    });

    // pagination
    $('.affiliate_pagination').on('click', '.affiliate_page', function (e)
    {
        var cid = $(this).prop('id').substring(5);
        var board_index = Math.floor((page_number - 1) / show_pages);

        if (cid == 'first')
        {
            page_number = 1;
        }
        else if (cid == 'prev')
        {
            page_number = (board_index - 1) * show_pages + 1;
        }
        else if (cid == 'next')
        {
            page_number = (board_index + 1) * show_pages + 1;
        }
        else if (cid == 'last')
        {
            page_number = Math.floor(all_items / page_count);
            if (all_items % page_count > 0)
                page_number ++;
        }
        else
        {
            page_number = cid;
        }

        ajaxCrmList();
    });

    $('.count_dropdown_menu li').on("click", function (e) 
    {
        page_count = $(this).text();
        $('.count_toggle_button').html(page_count + " <span class=\"caret\"></span>");

        page_number = 1;
        ajaxCrmList();
    });

    function ajaxCrmList() 
    {
        if (affiliate_waiting) return;

        show_waiting(true);

        $.ajax(
        {
            type : 'GET',
            url : '../daemon/ajax/crm_list.php',
            data : { },
            success:function(response)
            {
                show_waiting(false);

                if (response == 'error')
                {
                    show_alert('main', 'Cannot load CRM list.');
                    return;
                }
                else
                {
                    crm_list = jQuery.parseJSON(response);
                    var crm_count = crm_list.length;
                    var html = '';                  
                    
                    html += '<tr>';
                    html += '<th rowspan="2" style="vertical-align:middle">Affiliate ID</th>';
                    html += '<th rowspan="2" style="border-right: 1px solid #dadada; vertical-align:middle">Affiliate Label</th>';
                    html += '<th colspan="' + crm_count + '">Goals</th>';
                    html += '<th rowspan="2" style="border-left: 1px solid #dadada; vertical-align:middle">Action</th>';
                    html += '</tr>';

                    if (crm_count > 0)
                    {
                        for (var i = 0; i < crm_count; i ++)
                            html += '<th>' + crm_list[i][1] + '</th>';
                    } else {
                        show_alert('main', 'There is no any crm data.');
                    }

                    $('.table_affiliate_head').html(html);

                    if (crm_count > 0)
                        ajaxAffiliateList();
                }
            },
            failure:function(response) 
            {
                show_waiting(false);
                show_alert('main', 'Cannot load CRM list.');

                return;
            }
        });
    }

	function ajaxAffiliateList() 
    {
        if (affiliate_waiting) return;

        show_waiting(true);

        $.ajax(
        {
            type : 'GET',
            url : '../daemon/ajax/setting_affiliate_list.php',
            data : {
                'page_number' : page_number, 
                'items_page' : page_count
            },
            success:function(response)
            {
                show_waiting(false);

                if (response == 'error')
                {
                    show_alert('main', 'Cannot load affiliate list.');
                    return;
                }
                else
                {
                    var obj = jQuery.parseJSON(response);
                    var html = '';

					all_items = obj.length;
					var real_items = obj.affiliates.length;
                                        
                    if (real_items > 0)
                    {
                        for (var i = 0; i < real_items; i ++)
                        {
                            html += '<tr>';
                        	html += '<td id="aid_' + obj.affiliates[i][0] + '">' + obj.affiliates[i][0] + '</td>';
                        	html += '<td id="alabel_' + obj.affiliates[i][0] + '" style="border-right: 1px solid #dadada">' + obj.affiliates[i][1] + '</td>';

                            for (var j = 0; j < crm_list.length; j ++)
                                html += '<td id="goal_' + obj.affiliates[i][0] + '_' + crm_list[j][0] + '"></td>';

                            html += '<td style="border-left: 1px solid #dadada">';
                            html += '<button type="button" class="btn btn-link btn-sm btn_affiliate_edit" id="' + obj.affiliates[i][0] + '" data-toggle="modal" data-target="#affiliate_edit_modal"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span>&nbsp;Edit</button>';
                            html += '<button type="button" class="btn btn-link btn-sm btn_affiliate_delete" id="' + obj.affiliates[i][0] + '" data-toggle="modal" data-target="#affiliate_delete_modal"><span class="glyphicon glyphicon-minus-sign" aria-hidden="true" style="color: #ffa5a5"></span>&nbsp;Delete</button>';
                            html += '</td></tr>';
                        }
                    } else {
                        show_alert('main', 'There is no any affiliate data.');
                    }

                    $('.table_affiliate_body').html(html);

                    if (real_items > 0)
                    {
                        for (var i = 0; i < real_items; i ++)
                        {
                            for (var k = 0; k < obj.affiliates[i][2].length; k ++)
                                $('#goal_' + obj.affiliates[i][0] + '_' + obj.affiliates[i][2][k][0]).html(obj.affiliates[i][2][k][1]);
                        }
                    }

                    generatePagination();
                }
            },
            failure:function(response) 
            {
                show_waiting(false);
                show_alert('main', 'Cannot load affiliate list.');

                return;
            }
        });
    }

    function generatePagination()
    {
        var htmlFront = '<button type="button" class="btn btn-default btn-sm affiliate_page" id="page_first">&lt;&lt;</button><button type="button" class="btn btn-default btn-sm affiliate_page" id="page_prev">&lt;</button>';
        var htmlBack = '<button type="button" class="btn btn-default btn-sm affiliate_page" id="page_next">&gt;</button><button type="button" class="btn btn-default btn-sm affiliate_page" id="page_last">&gt;&gt;</button>';
        var htmlPage = '';
        var html = '';

        if (all_items > 0)
        {
            var board_index = Math.floor((page_number - 1) / show_pages);

            var first_number = board_index * show_pages + 1;
            var last_number = (board_index + 1) * show_pages;

            if (last_number * page_count > all_items)
            {
                last_number = Math.floor(all_items / page_count);
                if (all_items % page_count > 0)
                    last_number ++;
            }

            for (var i = first_number; i <= last_number; i ++)
            {
                if (i == page_number)
                    htmlPage += '<button type="button" class="btn btn-success btn-sm affiliate_page" id="page_' + i + '">' + i + '</button>';
                else
                    htmlPage += '<button type="button" class="btn btn-default btn-sm affiliate_page" id="page_' + i + '">' + i + '</button>';
            }

            if (board_index > 0)
                html += htmlFront;
            html += htmlPage;
            if (last_number * page_count < all_items)
                html += htmlBack;
        }

        $('.affiliate_pagination').html(html);
    }

    function ajaxAffiliateAdd(aid, alabel, crmids, goals)
    {
        show_waiting(true);

        $.ajax(
        {
            type : 'GET',
            url : '../daemon/ajax/setting_affiliate_add.php',
            data : {
                'affiliate_id' : aid,
                'affiliate_label' : alabel,
                'crm_ids' : crmids,
                'goals' : goals
            },
            success:function(response)
            {
                show_waiting(false);

                if (response == 'success')
                    ajaxCrmList();
                else
                    show_alert('main', 'Affiliate cannot be added.');
            },
            failure:function(response) 
            {
                show_waiting(false);
                show_alert('main', 'Affiliate cannot be added.');
            }
        });    
    }

    function ajaxAffiliateEdit(aid, alabel, crmids, goals)
    {
        show_waiting(true);

        $.ajax(
        {
            type : 'GET',
            url : '../daemon/ajax/setting_affiliate_edit.php',
            data : {
                'affiliate_id' : aid,
                'affiliate_label' : alabel,
                'crm_ids' : crmids,
                'goals' : goals
            },
            success:function(response)
            {
                show_waiting(false);

                if (response == 'success')
                    ajaxCrmList();
                else
                    show_alert('main', 'Affiliate cannot be changed.');
            },
            failure:function(response) 
            {
                show_waiting(false);
                show_alert('main', 'Affiliate cannot be changed.');
            }
        });    
    }

    function ajaxAffiliateDelete()
    {
        show_waiting(true);

        $.ajax(
        {
            type : 'GET',
            url : '../daemon/ajax/setting_affiliate_delete.php',
            data : {
                'affiliate_id' : affiliate_id
            },
            success:function(response)
            {
                show_waiting(false);

                if (response == 'success')
                    ajaxCrmList();
                else
                    show_alert('main', 'Affiliate cannot be deleted.');
            },
            failure:function(response) 
            {
                show_waiting(false);
                show_alert('main', 'Affiliate cannot be deleted.');
            }
        });    
    }

});