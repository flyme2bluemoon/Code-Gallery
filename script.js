var username = "the_flying_donkey";
var api_key = "2990dd852ff40cf94ae1073bdff1cb839a6620b4";
var auth_header = "Basic " + btoa(username+":"+api_key);

function get_user_data(username) {
    var url = "https://api.github.com/users/" + username;

    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            var response = JSON.parse(req.responseText);
            console.log(response);
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
            console.log(response);
            for (var i = 0; i < response.length; i++) {
                console.log(response[i].full_name);
                console.log(response[i].description);
                console.log(response[i].url);
                console.log(response[i].html_url);
                console.log(response[i].language);
                get_language_color(response[i].language);
                var new_card = `
                <div class="card border-success mb-3" style="width: 18rem;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${response[i].name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${response[i].full_name}</h6>
                        <hr class="${response[i].language}-bar">
                        <p class="card-text">${response[i].description}</p>
                        <p class="card-text"><small class="text-muted">${response[i].language}</small></p>
                        <a href="${response[i].html_url}" class="card-link btn btn-dark mt-auto" id="github-button">GitHub</a>
                    </div>
                </div>
                `;
                document.getElementById("card-holder").innerHTML += new_card;
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
                console.log(response[language].color);
                for (var i = 0; i < document.getElementsByClassName(`${language}-bar`).length; i++) {
                    document.getElementsByClassName(`${language}-bar`)[i].style = `background-color: ${response[language].color};`;
                }
            } else {
                for (var i = 0; i < document.getElementsByClassName("null-bar").length; i++) {
                    document.getElementsByClassName("null-bar")[i].style = `background-color: #1DA1F2;`;
                }
            }
        }
    }

    req.open("GET", "colors.json", true);
    req.send();
}

get_user_data("flyme2bluemoon");