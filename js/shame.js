
function draw_shame() {
    var shame_url = "https://api.myjson.com/bins/e23kh";
    $.get(shame_url, function(data) {
        // Shaming trainers
        var sorted_data = [];
        for (var name in data) {
            sorted_data.push([data[name].length, name, data[name]]);
        }
        sorted_data.sort(function(a, b) {
            if (a[0] == b[0]) return a[1].toLowerCase() > b[1].toLowerCase() ? 1:-1;
            return b[0] - a[0];
        });
        var names = [], shame = [], colors = [], buttons = [];
        for (var i = 0; i < sorted_data.length; i++) {
            shame.push(sorted_data[i][0]);
            names.push(sorted_data[i][1]);
            colors.push(TEAM_COLORS[sorted_data[i][2][sorted_data[i][0]-1].defeat_team]);
            buttons.push([]);
            for (var j = 0; j < sorted_data[i][2].length; j++) {
                var victim = sorted_data[i][2][sorted_data[i][2].length-j-1];
                buttons[i].push({
                    line1: victim.name,
                    line2: victim.gym_name,
                    big: Math.round((victim.defeat_time - victim.time)/3600) + "h",
                    color: TEAM_COLORS_RGBA[victim.team],
                });
            }
        }
        make_graph($("#shameChart"), names, shame, colors, undefined, buttons);

        if (window.localStorage.search) {
            try {
                var search = JSON.parse(window.localStorage.search);
                if (search["#searchShame"]) {
                    $("#searchShame").val(search["#searchShame"]);
                    highlight_trainers('#searchShame', '#shameChart', '#searchShameResult');
                }
            } catch (err) {
                window.localStorage.search = "{}";
            }
        }

        // Bad gyms
        var gym_data = {};
        for (var name in data) {
            for (var i = 0; i < data[name].length; i++) {
                var gym = data[name][i];
                if (gym_data[gym.gym_name] === undefined) {
                    gym_data[gym.gym_name] = [];
                }
                gym.defeat_name = name;
                gym_data[gym.gym_name].push(gym);
            }
        }

        sorted_data = [];

        for (var gym_name in gym_data)
            sorted_data.push([gym_name, gym_data[gym_name]]);

        sorted_data.sort(function(a, b) {
            if (a[1].length == b[1].length)
                return a[0].toLowerCase() > b[0].toLowerCase() ? 1:-1;
            return b[1].length - a[1].length;
        });
        function format_date(date) {
            return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
        }

        var names = [], num = [], colors = [], buttons = [];
        for (var i = 0; i < sorted_data.length; i++) {
            // console.log(sorted_data[i]);
            names.push(sorted_data[i][0]);
            num.push(sorted_data[i][1].length);
            var bads = sorted_data[i][1];
            colors.push(TEAM_COLORS[bads[0].team]);
            buttons.push([]);
            for (var j = 0; j < bads.length; j++) {
                buttons[i].push({
                    line1: bads[j].defeat_name,
                    line2: format_date(new Date(bads[j].defeat_time*1000)),
                    big: Math.round((bads[j].defeat_time - bads[j].time)/3600) + "h",
                    color: TEAM_COLORS_RGBA[bads[j].defeat_team],
                })
            }
        }
        make_graph($("#gymBadChart"), names, num, colors, undefined, buttons);
    });
}
