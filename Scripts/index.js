var author_list = [];
var ements = [];

$.getJSON("clean_messages.json", function(json) {
    load_story(json);

    set_buttons();
    set_leaderboard();
    set_top_words();
});

function load_story(json) {
    var story_inner = '';
    for(var i = 0; i < json.length; i++) {
        story_inner += '<span id="' + i + '">' + json[i].content + ' </span>';
    }

    document.getElementById('story-text').innerHTML = story_inner;

    var elements = document.getElementById("story-text").childNodes;
    for(var i = 0; i < json.length; ++i) {
        ements.push([elements[i].innerHTML, json[i].author, elements[i]]);
        if(author_list.indexOf(json[i].author) == -1) {
            author_list.push(json[i].author);
        }
    }
}

function set_buttons() {
    var buttons_inner = '';

    for(var i = 0; i < author_list.length; i++) {
        buttons_inner += '<button type="button" class="btn btn-outline-dark btn-sm" id="' + author_list[i] + '">' + author_list[i] + '</button>';
    }

    document.getElementById('author-buttons').innerHTML = buttons_inner;

    document.getElementById("author-buttons").addEventListener("click", function(event) {
        document.getElementById('word-count').innerHTML = '-';
        document.getElementById('word-author').innerHTML = '-';

        if(event.srcElement.id == "author-buttons")
            return;

        var index = author_list.indexOf(event.srcElement.id);
        if(index > -1) {
            for(var i = 0; i < ements.length; i++) {
                ements[i][2].style = 'background-color: none;'
            }

            var count = 0;
            for(var i = 0; i < ements.length; i++) {
                if(ements[i][1] == event.srcElement.id) {
                    count++;
                    ements[i][2].style = 'background-color: aquamarine;';
                }
            }
        }
    });
}

function set_leaderboard() {
    temp_list = [];
    for(var i = 0; i < ements.length; i++) {
        temp_list.push(ements[i][1]);
    }

    dict = count(temp_list);
    dict = sort_dict(dict)
    for(var i = 0; i < dict.length; i++) {
        document.getElementById('leaderboard').innerHTML += '<tr><td>'+ dict[i][0] + '</td> <td>'+ dict[i][1] + '</td></tr>'
    }
}

function set_top_words() {
    word_list = [];
    for(var i = 0; i < ements.length; i++) {
        word_list.push(clean_text(ements[i][0]));
    }

    sorted_words = sort_dict(count(word_list));

    for(var i = 0; i < 10; i++) {
        document.getElementById('top-words').innerHTML += '<tr><td>'+ sorted_words[i][0] + '</td> <td>'+ sorted_words[i][1] + '</td></tr>'
    }
}

document.getElementById("story-text").addEventListener("click", function(event) {
    if(event.srcElement.id == "story-text") {
        for(var i = 0; i < ements.length; i++) {
            ements[i][2].style = 'background-color: none;'
        }
        return;
    }

    for(var i = 0; i < ements.length; i++) {
        ements[i][2].style = 'background-color: none;'
    }

    var word_clicked = clean_text(document.getElementById(event.srcElement.id).innerHTML);
    var count = 0;

    for(var i = 0; i < ements.length; i++) {
        var word = clean_text(ements[i][0])
        if(word == word_clicked) {
            count++;
            ements[i][2].style = 'background-color: #87CEFA;';
        }
    }

    document.getElementById('word-count').innerHTML = count;
    document.getElementById('word-author').innerHTML = ements[event.srcElement.id][1];
});

function clean_text(text) {
    if(typeof(text) == 'string') {
        text = text.toLowerCase();
        text = text.replace(/[^\w\s]|/g, "").trim();
        return text
    }
}

function count(list) {
    var dict = {};

    for(var i = 0; i < list.length; i++) {
        if(dict[list[i]] == null) {
            dict[list[i]] = 1;
        } else {
            dict[list[i]]++;
        }
    }

    return dict;
}

function sort_dict(dict) {
    function sortNumber(a, b) {
        return b[1] - a[1];
    }

    var list = [];
    for(var key in dict) {
        list.push([key, dict[key]])
    }

    list.sort(sortNumber)
    return list
}