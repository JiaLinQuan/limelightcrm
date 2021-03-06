jQuery( document ).ready(function( $ ) 
{
    var crm_list;
    var crm_id = -1;
    var crm_name = '';
    var date_id = 'date_thisweek';
    var from_date = '';
    var to_date = '';

    var page_number = 1;
    var page_count = 10;
    var show_pages = 7;
    var all_items = 0;

    var level_waiting = false;
    var history_waiting = false;

    //var spinner = '<p><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></p>';
    var spinner = '<img src="../images/loading.gif" style="width:22px;height:22;">';
    var read_mark = '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>';
    var close_mark = '<span class="glyphicon glyphicon-remove" aria-hidden="true" style="color: #ffa5a5"></span>';

    
    init();


    function init()
    {
        getInitialCrmID();
        setDateText();

        ajaxCrmList();
        ajaxAlertHistory();

        setAlertTimer();
    }

    function show_alert(msg) 
    {
        if (type == 'report')
        {
            $('.level_alert').html(msg);
            $('.level_alert').fadeIn(1000, function () {
                $('.level_alert').fadeOut(3000);
            });
        }
        else if (type == 'history')
        {
            $('.history_alert').html(msg);
            $('.history_alert').fadeIn(1000, function () {
                $('.history_alert').fadeOut(3000);
            });
        }
    }

    function show_waiting(type, show)
    {
        if (type == 'report')
        {
            level_waiting = show;

            if (level_waiting)
                $('.alert_waiting').html(spinner);
            else
                $('.alert_waiting').html('');
        }
        else if (type == 'history')
        {
            history_waiting = show;

            if (history_waiting)
                $('.history_waiting').html(spinner);
            else
                $('.history_waiting').html('');
        }
    }

    function setAlertTimer()
    {
        var alert_interval_id = setInterval(function ()
        {
            ajaxCrmList();
            ajaxAlertHistory();
        }, 60000);
    }

    $('.btn_refresh_all').click(function ()
    {
        ajaxCrmList();
    });

    $('.table_alert_body').on('click', '.btn_refresh', function (e)
    {
        var crm_id = $(this).prop('id');
        
        ajaxAlertLevelList(crm_id);
        ajaxAlertReportList(crm_id);
    });

    // crm dropdown menu
    $('.crm_dropdown_menu li').on("click", function (e) 
    {
        crm_name = $(this).text();
        crm_id = $(this).find('a').attr('id');

        $('.crm_toggle_button').html(crm_name + " <span class=\"caret\"></span>");
    });

    // click data range
    $('.input-daterange').datepicker({
    });

    $('.date_dropdown_menu li').on("click", function (e) 
    {
        var date_text = $(this).text();
        date_id = $(this).find('a').attr('id');

        $('.date_toggle_button').html(date_text + " <span class=\"caret\"></span>");

        setDateText();
    });

    // cycle dropdown menu
    $('.cycle_dropdown_menu li').on("click", function (e) 
    {
        cycle = $(this).text();
        cycle_id = $(this).prop('id').substring(6);

        $('.cycle_toggle_button').html(cycle + " <span class=\"caret\"></span>");
    });

    // search button
    $('.history_search_button').click(function ()
    {
        ajaxAlertHistory();
    });

    function getInitialCrmID()
    {
        if ($('.crm_dropdown_list').length > 0)
        {
            crm_id = $('.crm_dropdown_list').prop('id');
            crm_name = $('.crm_dropdown_list').html();
        }
    }

    function ajaxCrmList() 
    {
        if (level_waiting) return;

        show_waiting('report', true);

        $.ajax(
        {
            type : 'GET',
            url : '../daemon/ajax/crm_list.php',
            data : { },
            success:function(response)
            {
                show_waiting('report', false);

                if (response == 'error')
                {
                    show_alert('report', 'Cannot load CRM list.');
                    return;
                }
                else
                {
                    crm_list = jQuery.parseJSON(response);
                    var crm_count = crm_list.length;
                    var html = '';                  
                    
                    if (crm_count > 0)
                    {
                        for (var i = 0; i < crm_count; i ++)
                        {
                            html += '<tr><td>' + (i + 1) + '</td>';
                            html += '<td id="name_' + crm_list[i][0] + '">' + crm_list[i][1] + '</td>';
                            html += '<td id="value_1_' + crm_list[i][0] + '" style="border-left: 1px solid #dadada"></td>';
                            html += '<td id="level_1_' + crm_list[i][0] + '"></td>';
                            html += '<td id="value_2_' + crm_list[i][0] + '" style="border-left: 1px solid #dadada"></td>';
                            html += '<td id="level_2_' + crm_list[i][0] + '"></td>';
                            html += '<td id="value_3_' + crm_list[i][0] + '" style="border-left: 1px solid #dadada"></td>';
                            html += '<td id="level_3_' + crm_list[i][0] + '"></td>';
                            html += '<td id="value_4_' + crm_list[i][0] + '" style="border-left: 1px solid #dadada"></td>';
                            html += '<td id="level_4_' + crm_list[i][0] + '"></td>';
                            html += '<td id="value_5_' + crm_list[i][0] + '" style="border-left: 1px solid #dadada"></td>';
                            html += '<td id="level_5_' + crm_list[i][0] + '"></td>';
                            html += '<td id="value_6_' + crm_list[i][0] + '" style="border-left: 1px solid #dadada"></td>';
                            html += '<td id="level_6_' + crm_list[i][0] + '"></td>';
                            html += '<td id="value_7_' + crm_list[i][0] + '" style="border-left: 1px solid #dadada"></td>';
                            html += '<td id="level_7_' + crm_list[i][0] + '"></td>';
                            html += '<td id="value_8_' + crm_list[i][0] + '" style="border-left: 1px solid #dadada"></td>';
                            html += '<td id="level_8_' + crm_list[i][0] + '"></td>';
                            html += '<td id="value_9_' + crm_list[i][0] + '" style="border-left: 1px solid #dadada"></td>';
                            html += '<td id="level_9_' + crm_list[i][0] + '"></td>';
                            html += '<td id="value_10_' + crm_list[i][0] + '" style="border-left: 1px solid #dadada"></td>';
                            html += '<td id="level_10_' + crm_list[i][0] + '"></td>';
                            html += '<td style="border-left: 1px solid #dadada"><button type="button" class="btn btn-link btn-sm btn_refresh" id="' + crm_list[i][0] + '"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></button></td>';
                            html += '</tr>';   
                        }
                    } 
                    else
                        show_alert('report', 'There is no any crm data.');

                    $('.table_alert_body').html(html);
                    
                    for (var i = 0; i < crm_count; i ++)
                    {
                        ajaxAlertLevelList(crm_list[i][0]);
                        ajaxAlertReportList(crm_list[i][0]);
                    }
                }
            },
            failure:function(response) 
            {
                show_waiting('report', false);
                show_alert('report', 'Cannot load CRM list.');

                return;
            }
        });
    }

    function ajaxAlertLevelList(cid)
    {
        $.ajax(
        {
            type : 'GET',
            url : '../daemon/ajax/setting_alert_list.php',
            data : {
                'crm_id' : cid
            },
            success:function(response)
            {
                var obj = jQuery.parseJSON(response);

                if (obj[0] == 'error')
                {
                    show_alert('report', 'Cannot load alert level information.');
                    return;
                }
                else
                {
                    var level_count = obj[2].length;

                    for (var i = 0; i < level_count; i ++)
                    {
                        $('#level_' + obj[2][i][2] + '_' + obj[1]).html(obj[2][i][4]);
                    }
                }
            },
            failure:function(response) 
            {
                show_alert('report', 'Cannot load alert level information.');
            }
        });
    }

    function ajaxAlertReportList(cid)
    {
        $.ajax(
        {
            type : 'GET',
            url : '../daemon/ajax/alert_report_list.php',
            data : {
                'crm_id' : cid,
                'date' : getNowDate()
            },
            success:function(response)
            {
                var obj = jQuery.parseJSON(response);

                if (obj[0] == 'error')
                {
                    show_alert('report', 'Cannot load alert level information.');
                    return;
                }
                else
                {
                    var astatus = obj[2];

                    for (var i = 0; i < astatus.length; i ++)
                    {
                        $('#value_' + astatus[i][2] + '_' + obj[1]).html(astatus[i][3]);

                        if (astatus[i][5] == '1')
                        {
                            $('#level_' + astatus[i][2] + '_' + obj[1]).css('background-color', '#ffa5a5');
                            $('#value_' + astatus[i][2] + '_' + obj[1]).css('background-color', '#ffa5a5');
                        }
                    }
                }
            },
            failure:function(response) 
            {
                show_alert('report', 'Cannot load alert level information.');
            }
        });
    }

    function setDateText()
    {
        var date = new Date();
        var today = getDateText(date.getFullYear(), date.getMonth() + 1, date.getDate());

        if (date_id == 'date_today')        // today
        {
            from_date = today;
            to_date = today;
        }
        else if (date_id == 'date_yesterday')
        {
            date.setDate(date.getDate() - 1);

            from_date = getDateText(date.getFullYear(), date.getMonth() + 1, date.getDate());
            to_date = getDateText(date.getFullYear(), date.getMonth() + 1, date.getDate());
        }
        else if (date_id == 'date_thisweek')
        {
            var firstday = date.getDate() + 1;
            if (date.getDay() == 0)
                firstday -= 7;
            else
                firstday -= date.getDay();

            date.setDate(firstday);

            from_date = getDateText(date.getFullYear(), date.getMonth() + 1, date.getDate());
            to_date = today;
        }
        else if (date_id == 'date_thismonth')
        {
            from_date = getDateText(date.getFullYear(), date.getMonth() + 1, 1);
            to_date = today;
        }
        else if (date_id == 'date_thisyear')
        {
            from_date = getDateText(date.getFullYear(), 1, 1);
            to_date = today;
        }
        else if (date_id == 'date_lastweek')
        {
            var firstday = date.getDate() + 1 - 7;
            if (date.getDay() == 0)
                firstday -= 7;
            else
                firstday -= date.getDay();

            date.setDate(firstday);
            from_date = getDateText(date.getFullYear(), date.getMonth() + 1, date.getDate());

            firstday = date.getDate() + 6;
            date.setDate(firstday);
            to_date = getDateText(date.getFullYear(), date.getMonth() + 1, date.getDate());
        }
        else if (date_id == 'date_custom')
        {
            from_date = '';
            to_date = '';
        }

        $('#from_date').val(from_date);
        $('#to_date').val(to_date);
    }

    function getDateText(year, month, day)
    {
        var dd = day;
        var mm = month;
        var yyyy = year;

        if (dd < 10)
            dd = '0' + dd;

        if (mm < 10)
            mm = '0' + mm;

        return (mm + '/' + dd + '/' + yyyy);
    }

    function generatePagination()
    {
        var htmlFront = '<button type="button" class="btn btn-default btn-sm campaign_page" id="page_first">&lt;&lt;</button><button type="button" class="btn btn-default btn-sm campaign_page" id="page_prev">&lt;</button>';
        var htmlBack = '<button type="button" class="btn btn-default btn-sm campaign_page" id="page_next">&gt;</button><button type="button" class="btn btn-default btn-sm campaign_page" id="page_last">&gt;&gt;</button>';
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
                    htmlPage += '<button type="button" class="btn btn-success btn-sm campaign_page" id="page_' + i + '">' + i + '</button>';
                else
                    htmlPage += '<button type="button" class="btn btn-default btn-sm campaign_page" id="page_' + i + '">' + i + '</button>';
            }

            if (board_index > 0)
                html += htmlFront;
            html += htmlPage;
            if (last_number * page_count < all_items)
                html += htmlBack;
        }

        $('.campaign_pagination').html(html);
    }

    $('.count_dropdown_menu li').on("click", function (e) 
    {
        page_count = $(this).text();
        $('.count_toggle_button').html(page_count + " <span class=\"caret\"></span>");

        page_number = 1;
        
        ajaxAlertHistory();
    });

    $('.campaign_pagination').on('click', '.campaign_page', function (e)
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

        ajaxAlertHistory();
    });

    function ajaxAlertHistory()
    {
        if ($('#from_date').val() == '')
        {
            show_alert('history', 'Please select FROM DATE.');
            return;
        }

        if ($('#to_date').val() == '')
        {
            show_alert('history', 'Please select TO DATE.');
            return;
        }

        show_waiting('history', true);

        $.ajax(
        {
            type : 'GET',
            url : '../daemon/ajax/alert_history_list.php',
            data : {
                'crm_id' : crm_id,
                'from_date' : $('#from_date').val(),
                'to_date' : $('#to_date').val(),
                'page_number' : page_number,
                'items_page' : page_count
            },
            success:function(response)
            {
                show_waiting('history', false);

                var obj = jQuery.parseJSON(response);

                if (obj[0] == 'error')
                {
                    show_alert('history', 'Cannot load alert history.');
                }
                else
                {
                    all_items = obj[2].length; //?
                    var hists = obj[2].data;
                    var html = '';

                    for (var i = 0; i < hists.length; i ++)
                    {
                        html += '<tr>';
                        html += '<td>' + ((page_number - 1) * page_count + i + 1) + '</td>';
                        html += '<td>' + hists[i][12] + '</td>';        // crm name
                        html += '<td>' + hists[i][11] + '</td>';        // alert name
                        html += '<td>' + hists[i][6] + '</td>';         // register date
                        html += '<td>' + hists[i][9] + '</td>';         // from date
                        html += '<td>' + hists[i][10] + '</td>';        // to date
                        if (hists[i][7] == '1')
                            html += '<td>' + read_mark + '</td>';        // read
                        else
                            html += '<td></td>';
                        if (hists[i][8] == '1')
                            html += '<td>' + close_mark + '</td>';        // delete
                        else
                            html += '<td></td>';
                        html += '</tr>';
                    }

                    $('.table_history_body').html(html);

                    generatePagination();
                }
            },
            failure:function(response) 
            {
                show_waiting('history', false);
                show_alert('history', 'Cannot load alert history');
            }
        });
    }

    function getNowDate()
    {
        var dt = new Date();
        var nowMonth = dt.getMonth() + 1;
        var nowDay = dt.getDate();

        if (nowMonth < 10)
            nowMonth = '0' + nowMonth;

        if (nowDay < 10)
            nowDay = '0' + nowDay;

        return (dt.getFullYear() + '-' + nowMonth + '-' + nowDay);
    }
});