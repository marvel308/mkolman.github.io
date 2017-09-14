/*** CONSTANTS *****/
var TEAM_COLORS = ["#e5e5e5", "#0576ee", "#f2160a", "#fad107"];
var TEAM_COLORS_RGBA = [ "rgba(229, 229, 229, 0.5)", "rgba(5, 118, 238, 0.5)", "rgba(242, 22, 10, 0.5)", "rgba(250, 209, 7, 0.5)"];
var URL = "https://mapdata2.gomap.eu/mnew.php?mid=0&ex=%5B1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C21%2C22%2C23%2C24%2C25%2C26%2C27%2C28%2C29%2C30%2C31%2C32%2C33%2C34%2C35%2C36%2C37%2C38%2C39%2C40%2C41%2C42%2C43%2C44%2C45%2C46%2C47%2C48%2C49%2C50%2C51%2C52%2C53%2C54%2C55%2C56%2C57%2C58%2C59%2C60%2C61%2C62%2C63%2C64%2C65%2C66%2C67%2C68%2C69%2C70%2C71%2C72%2C73%2C74%2C75%2C76%2C77%2C78%2C79%2C80%2C81%2C82%2C83%2C84%2C85%2C86%2C87%2C88%2C89%2C90%2C91%2C92%2C93%2C94%2C95%2C96%2C97%2C98%2C99%2C100%2C101%2C102%2C103%2C104%2C105%2C106%2C107%2C108%2C109%2C110%2C111%2C112%2C113%2C114%2C115%2C116%2C117%2C118%2C119%2C120%2C121%2C122%2C123%2C124%2C125%2C126%2C127%2C128%2C129%2C130%2C131%2C132%2C133%2C134%2C135%2C136%2C137%2C138%2C139%2C140%2C141%2C142%2C143%2C144%2C145%2C146%2C147%2C148%2C149%2C150%2C151%2C152%2C153%2C154%2C155%2C156%2C157%2C158%2C159%2C160%2C161%2C162%2C163%2C164%2C165%2C166%2C167%2C168%2C169%2C170%2C171%2C172%2C173%2C174%2C175%2C176%2C177%2C178%2C179%2C180%2C181%2C182%2C183%2C184%2C185%2C186%2C187%2C188%2C189%2C190%2C191%2C192%2C193%2C194%2C195%2C196%2C197%2C198%2C199%2C200%2C201%2C202%2C203%2C204%2C205%2C206%2C207%2C208%2C209%2C210%2C211%2C212%2C213%2C214%2C215%2C216%2C217%2C218%2C219%2C220%2C221%2C222%2C223%2C224%2C225%2C226%2C227%2C228%2C229%2C230%2C231%2C232%2C233%2C234%2C235%2C236%2C237%2C238%2C239%2C240%2C241%2C242%2C243%2C244%2C245%2C246%2C247%2C248%2C249%2C250%5D&w=14.240820017805705&e=14.759138020524377&n=46.22983200641623&s=45.870103364048745&gid=0";



/*** GENERAL FUNCTIONS *****/
$(".hide").click(function(event){
    $(event.currentTarget).off("click");
    if ($(event.currentTarget).hasClass("hide")) {
        $(event.currentTarget).removeClass("hide");
        if (typeof ga !== 'undefined') {
            ga('send', 'event', 'open_tab', event.currentTarget.id);
        }
    }
});


function highlight_trainers(search_sel, row_sel, res_sel) {
    var search = {};
    try {
        search = JSON.parse(window.localStorage.search);
    } catch (err) {}
    search[search_sel] = $(search_sel).val();
    window.localStorage.search = JSON.stringify(search);
    var str = $(search_sel).val().toLowerCase();
    var rows = $(row_sel + " .row");
    var result = "";
    for (var i = 0; i < rows.length; i++) {
        var text = $(".label", rows[i]).text();
        var name = $(".label .name", rows[i]).text();
        if (str.length > 0 && text.toLowerCase().indexOf(str) !== -1) {
            $(".label .name", rows[i]).html("<b>" + name + "</b>");
            if (result.length != 0) {result += ", ";}
            result += text + "(" + $(".value", rows[i]).text() + ")";
        } else {
            $(".label .name", rows[i]).html(name);
        }
        $(res_sel).html(result);
    }
    if (typeof ga !== 'undefined') {
        ga('send', 'event', 'search', search_sel, $(search_sel).val());
    }
}
function make_graph(el, labels, values, colors, human_values, buttons) {
    // console.log(labels, values, colors);
    var enumerate = el.hasClass("enumerate");
    $(".loading", el).hide();
    var template = $(".template", el).clone();
    template.removeClass("template");
    var max_value = 0;
    for (var i = 0; i < values.length; i++) max_value = Math.max(max_value, values[i]);
    var prev_value = 0, prev_place = 0;
    for (var i = 0; i < labels.length; i++) {
        var mold = template.clone();
        $(".label", mold).html("<span class='name'>"+labels[i]+"</span>");
        $(".value", mold).css("background-color", colors[i]);
        if (human_values === undefined) {
            $(".value", mold).html(values[i]);
            $(".value", mold).attr("title", $("<span>" + labels[i] + "</span>").text() + ": " + values[i]);
        } else {
            $(".value", mold).html(human_values[i]);
            $(".value", mold).attr("title", $("<span>" + labels[i] + "</span>").text() + ": " + human_values[i]);
        }
        if (buttons !== undefined) {
            for (var j = 0; j < buttons[i].length; j++) {
                var button = buttons[i][j];
                mold.append("<div class='button' style='background-color: "+ button.color +";'> <span class='big'>"+ button.big +"</span>" + button.line1 + "<br/>"+ button.line2 +"</div>")
            }
        }
        if (enumerate) {
            if (prev_value != values[i]) {
                prev_place = i+1;
                prev_value = values[i];
            }
            $(".label", mold).prepend("<span class='place'>"+prev_place+". </span>")
        }
        // var obj = mold.clone()
        el.append(mold);
        $(".value", mold).animate({width: (100*values[i]/max_value + "%")});
    }

    $(".hide .row").off("click");
    $(".hide .row").click(function(event){
        // $(event.currentTarget).toggleClass("open");
        event.cancelBubble = true;
        event.stopPropagation();
    });
}
