$(document).ready(function() {

    // temp fix for table alignment
    $('html > head').append($('<style>tbody > tr:nth-child(1) > td:nth-child(2) { width:100%; }</style>'));

    // tabs
    $('#myTabs a').click(function(e) {
        e.preventDefault()
        $(this).tab('show')
    });

    $(function() {
        $('[data-toggle="tooltip"]').tooltip()
    });

    // search function
    $("div.tab-pane input.search").keyup(function() {
        var search = $(this).val().toLowerCase();
        $(this).parent().parent().find("tr").hide();
        $(this).parent().parent().find("tbody tr").each(function() {
            if ($(this).text().toLowerCase().indexOf(search) != -1) {
                $(this).show();
                //show the heading for the section
                $(this).parent().prev("thead").find("tr").show();
            }
        }, search);
    });

    $("#search-field").keyup(function() {
        $("#search-results").html("");
        if ($("#search-field").val() != "") {
            var search = $("#search-field").val().toLowerCase();
            //show the results div
            $("div.row.search-results").show();
            //loop through each tab panel (easier to grab heading info)
            $("div[role='tabpanel']").each(function() {
                var panel_id = $(this).attr("id");
                var display_section = true;
                var display_heading = true
                $(this).find("tbody td").each(function() {
                    if ($(this).text().toLowerCase().indexOf(search) != -1) {
                        if (display_section) {
                            //appends section to search results
                            $("#search-results").append('<li class="list-group-item active"><span>' + $("ul.nav-tabs a[href='#" + panel_id + "']").html() + '</span></li>');
                            //prevents duplicate section titles
                            display_section = false;
                        }
                        if (display_heading) {
                            //appends heading to search results
                            $("#search-results").append('<li class="list-group-item list-group-item-info"><span>' + $(this).parent().parent().prev("thead").find("tr th").html() + '</span></li>');
                            //prevents duplicate heading titles
                            display_heading = false;
                        }
                        $("#search-results").append('<li class="list-group-item"><span>' + $(this).text() + '</span></li>')
                    }
                });
            });
        } else {
            //fixes spacing caused by empty elements
            $("div.row.search-results").hide();
        }
    });

    $("form.search").submit(function(e) {
        e.preventDefault();
    });

    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var todayDate = Date.now();
    // Inaguration date
    var inagurationDate = new Date(2017, 0, 20);
    var daysUntilInaguration = Math.floor((inagurationDate.getTime() - todayDate) / (oneDay));

    if (daysUntilInaguration === 0) {
        $('#inauguration-time').text('Inauguration day is today.');
    } else if (daysUntilInaguration > 0) {
        $('#inauguration-days').text(daysUntilInaguration);
    } else {
        $('.inauguration-time-container').hide();
    }

    var daysInOffice = Math.floor((todayDate - inagurationDate) / (oneDay));

    if (daysInOffice < 0) {
        daysInOffice = 0;
    }

    $('#days-in-office').text(daysInOffice);

    // Parse site data.json
    var siteData = JSON.parse($('#site-data').html());
    var totalPoints = 0;
    var pointsNotStarted = 0;
    var pointsInProgress = 0;
    var pointsAchieved = 0;
    var pointsBroken = 0;

    for (var i = 0; i < siteData.tabs.length; i++) {
        for (var j = 0; j < siteData.tabs[i].sections.length; j++) {
            for (var k = 0; k < siteData.tabs[i].sections[j].points.length; k++) {
                var point = siteData.tabs[i].sections[j].points[k];
                totalPoints++;
                if (point.status === 'notStarted') {
                    pointsNotStarted++;
                } else if (point.status === 'inProgress') {
                    pointsInProgress++;
                } else if (point.status === 'achieved') {
                    pointsAchieved++;
                } else if (point.status === 'broken') {
                    pointsBroken++;
                }
            }
        }
    }

    $('.total-points').text(totalPoints || '0');
    $('#points-achieved').text(pointsAchieved || '0');
    $('#points-broken').text(pointsBroken || '0');
    $('#points-not-started').text(pointsNotStarted || '0');
    $('#points-in-progress').text(pointsInProgress || '0');

});