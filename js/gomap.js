
function create_gym_chart(gym_data) {
    // Longest standing gyms
    gym_data.sort(function(a, b) {
        return b[0] - a[0];
    })
    var gym_names = [];
    var gym_durations = [];
    var gym_human_durations = [];
    var gym_colors = [];
    var gym_buttons = [];
    for (var i = 0; i < gym_data.length; i++) {
        gym = gym_data[i][1];
        var time_ocuppied = gym_data[i][0];
        gym_names.push("<a href='https://www.google.si/maps/place/" +
                       gym.latitude + "," + gym.longitude + "'>" +
                       gym.name + "</a>");
        gym_durations.push(time_ocuppied);
        gym_human_durations.push(
            Math.floor(time_ocuppied/86400) + "d "+
            Math.floor((time_ocuppied % 86400)/3600) + "h " +
            Math.floor((time_ocuppied % 3600)/60) + "min");
        gym_colors.push(TEAM_COLORS[gym.team_id]);
        gym_buttons.push([]);
        for (var j = 0; j < gym.memb.length; j++) {
            var m = gym.memb[j];
            gym_buttons[i].push({
                line1: m.tn,
                line2: POKEMON[m.p] + " CP" + m.cp,
                big: m.tl,
            })
        }
        // console.log(gym);
    }
    make_graph($("#gymChart"), gym_names, gym_durations, gym_colors,
               gym_human_durations, gym_buttons);
}


function create_trnr_chart(trnrs, trnr_colors) {
    var users = [];
    for (var name in trnrs) {
        users.push([trnrs[name], name]);
    }
    users.sort(function(a, b) {
        if (a[0].length == b[0].length) return a[1].toLowerCase() > b[1].toLowerCase() ? 1:-1;
        return b[0].length - a[0].length;
    });
    var labels = [], nums = [], clrs = [], buttons = [];
    for (var i = 0; i < users.length; i++) {
        labels.push(users[i][1]);
        nums.push(users[i][0].length);
        clrs.push(trnr_colors[users[i][1]]);
        buttons.push([]);
        for (var j = 0; j < users[i][0].length; j++) {
            var gym = users[i][0][j];
            var time_ocuppied = (new Date()/1000 - gym.me.time_deploy);
            var str_occupied = "";
            if (time_ocuppied > 86400) {
                str_occupied = Math.round(time_ocuppied/86400)+"d";
            } else if (time_ocuppied > 3600) {
                str_occupied = Math.round(time_ocuppied/3600)+"h";
            } else if (time_ocuppied > 60) {
                str_occupied = Math.round(time_ocuppied/60)+"min";
            } else {
                str_occupied = Math.round(time_ocuppied)+"s";
            }
            buttons[i].push({
                line1: gym.name,
                line2: POKEMON[gym.me.p] + " CP" + gym.me.cp,
                big: str_occupied
            })
        }
    }
    make_graph($("#trnrChart"), labels, nums, clrs, undefined, buttons);

    if (window.localStorage.search) {
        try {
            var search = JSON.parse(window.localStorage.search);
            if (search["#search"]) {
                $("#search").val(search["#search"]);
                highlight_trainers('#search', '#trnrChart', '#searchResult');
            }
        } catch (err) {
            window.localStorage.search = "{}";
        }
    }
}


function create_lvl_chart(trnrs, trnr_colors) {
    var users = [];
    for (var name in trnrs) {
        // console.log(trnrs[name]);
        users.push([trnrs[name][0].me.tl, name]);
    }
    users.sort(function(a, b) {
        if (a[0] == b[0]) return a[1].toLowerCase() > b[1].toLowerCase() ? 1:-1;
        return b[0] - a[0];
    });
    var labels = [], nums = [], clrs = [];
    for (var i = 0; i < users.length; i++) {
        labels.push(users[i][1]);
        nums.push(users[i][0]);
        clrs.push(trnr_colors[users[i][1]]);
    }
    make_graph($("#lvlChart"), labels, nums, clrs);

    if (window.localStorage.search) {
        try {
            var search = JSON.parse(window.localStorage.search);
            if (search["#searchLvl"]) {
                $("#searchLvl").val(search["#searchLvl"]);
                highlight_trainers('#searchLvl', '#lvlChart', '#searchLvlResult');
            }
        } catch (err) {
            window.localStorage.search = "{}";
        }
    }
}


function draw_gomap() {
    $.getJSON(URL).then(function (data){
        var gyms = data.gyms;
        var trnrs = {};
        var trnr_colors = {};
        var gyms_by_team = [0, 0, 0, 0];
        var gym_data = [];
        for (var i = 0; i < data.gyms.length; i++) {
            var gym = data.gyms[i];
            gyms_by_team[gym.team_id]++;
            var time_ocuppied = (new Date())/1000 - gym.ts + gym.time_ocuppied;
            gym_data.push([time_ocuppied, gym]);
            for (var j = 0; j < gym.memb.length; j++) {
                var memb = gym.memb[j];
                if (trnrs[memb.tn] === undefined) {
                    trnrs[memb.tn] = [];
                    trnr_colors[memb.tn] = TEAM_COLORS[gym.team_id];
                }
                gym.me = memb;
                // console.log(memb);
                trnrs[memb.tn].push(JSON.parse(JSON.stringify(gym)));
            }
        }
        make_graph($("#teamChart"), ["None", "Mystic", "Valor", "Inctinct"],
                    gyms_by_team, TEAM_COLORS);

        var users_by_team = [0, 0, 0, 0];
        for (var name in trnr_colors) {
            users_by_team[TEAM_COLORS.indexOf(trnr_colors[name])]++;
        }

        make_graph($("#userChart"), ["Mystic", "Valor", "Inctinct"],
                    users_by_team.slice(1), TEAM_COLORS.slice(1));

        create_trnr_chart(trnrs, trnr_colors);
        create_lvl_chart(trnrs, trnr_colors);
        create_gym_chart(gym_data);
    }).fail(function(a, b, c) {
        console.log("Request failed", a, b, c);
        setTimeout(draw_gomap, 1000);
    });

}
