
function draw_shame() {
    var shame_url = "https://api.myjson.com/bins/e23kh";
    $.get(shame_url, function(data) {
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
    });
}
