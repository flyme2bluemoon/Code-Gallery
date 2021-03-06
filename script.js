var auth_header = "Basic dGhlX2ZseWluZ19kb25rZXk6Mjk5MGRkODUyZmY0MGNmOTRhZTEwNzNiZGZmMWNiODM5YTY2MjBiNA==";

function get_user_data(username) {
    var url = "https://api.github.com/users/" + username;

    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            var response = JSON.parse(req.responseText);
            get_repos_data(response.repos_url);
        }
    }

    req.open("GET", url, true);
    req.setRequestHeader("Authorization", auth_header);
    req.send();
}

function get_repos_data(repos_url) {
    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            var response = JSON.parse(req.responseText);
            for (var i = 0; i < response.length; i++) {
                var new_card = `
                <div class="card border-success mb-3 repo-card" id="${response[i].name}-repo-card">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${response[i].name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${response[i].full_name}</h6>
                        <hr class="${response[i].language}-bar">
                        <p class="card-text">${response[i].description}</p>
                        <p class="card-text"><small class="text-muted">${response[i].language}</small></p>
                        <a href="${response[i].html_url}" class="card-link btn btn-outline-dark mt-auto" id="github-button">GitHub</a>
                    </div>
                </div>
                `;
                document.getElementById("card-holder").innerHTML += new_card;
                get_language_color(response[i].language);
            }
        }
    }

    req.open("GET", repos_url, true);
    req.setRequestHeader("Authorization", auth_header);
    req.send();
}

function get_language_color(language) {
    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            var response = JSON.parse(req.responseText);
            if (response[language] != undefined) {
                for (var i = 0; i < document.getElementsByClassName(`${language}-bar`).length; i++) {
                    document.getElementsByClassName(`${language}-bar`)[i].style = `background-color: ${response[language].color};`;
                }
            } else {
                for (var i = 0; i < document.getElementsByClassName("null-bar").length; i++) {
                    document.getElementsByClassName("null-bar")[i].style = `background-color: ${response["Markdown"].color};`;
                }
            }
        }
    }

    req.open("GET", "colors.json", true);
    req.send();
}

get_user_data("flyme2bluemoon");

function keyUpHandler() {
    var search = document.getElementById("search-bar").value;
    var repo_cards = document.getElementsByClassName("repo-card")
    for (var i = 0; i < repo_cards.length; i++) {
        if (repo_cards[i].id.toLowerCase().substring(0, repo_cards[i].id.length - 10).includes(search.toLowerCase())) {
            repo_cards[i].style = "";
        } else {
            repo_cards[i].style = "display: none;";
        }
    }
}

document.addEventListener("keyup", keyUpHandler);