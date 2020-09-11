var gameData = {};
// Keeps track of all data that has to be saved.

var timers = [];
// Contains all the setTimer and setInterval IDs, which have to be stored and cleared on reset.

function outputMessage(msgs) {
    // Handles messages before they are put onto the console.
    if (!Array.isArray(msgs)) {
        if (typeof msgs === "string") {
            msgs = {"msg":msgs};
        }
        msgs = [msgs];
    }
    // Handles a string on it's on, as well as a single {} object.

    var delay = 0;
    for (let msg of msgs) {
        msg.style = msg.style ? msg.style : "";
        // If no style is given, it will default to blank;
        let html = "<div class=message style="+msg.style+">"+msg.msg+"</div>"
        // Constructs the html of each message/action.
        gameData.console.push(html);
        // All messages are added internally before visually or they can disappear during saving/loading.
        delay += msg.time;
        // Each delay also needs the total delay of all previous messages.
        timers.push(setTimeout(function() { output(html) }, delay));
    }
}

function output(html) {
    // Handles outputting the message visually.
    var output = document.getElementById("console");
    var i = 0;
    for (let msg of output.children) {
        i += 1;
        if (i <= 5) {
            continue;
        }
        // The first 5 messages will have 100% opacity.
        msg.style. opacity -= 0.1;
        if (msg.style.opacity <= 0) {
            output.removeChild(msg);
        }
    }
    // Alters the opacity of the current messages, and removes messages with 0% opacity.

    output.innerHTML = html + output.innerHTML;
    // Adds the message to top of the console.
    output.firstChild.style.opacity = 1;
    // Sets the opacity of the newly created message.    
}

function setTab(screen) {
    // Handles changing the screen between the major tabs.
    for (let container of document.getElementsByClassName("screenContainer")) {
        container.style.display = "none";
    }
    document.getElementById(screen+"Container").style.display = "block";
    // Sets all screen containers to invisible, then reveals the specified screen.

    for (let button of document.getElementsByClassName("tabButton")) {
        button.classList.remove("active")
    }
    document.getElementById(screen+"TabButton").classList.add("active")
    // Removes "active" class from all screen buttons, then adds it to the specified button.
}

function setTheme(theme=NaN) {
    // Handles changing the theme.
    if (isNaN(theme)) {
        gameData.theme += 1;
        if (gameData.theme === 2) {
            gameData.theme = 0;
        }
    } else {
        gameData.theme = theme;
    }
    // Increments the theme counter if called without an argument, otherwise sets it directly.

    for (let actionButton of document.getElementsByClassName("transition")) {
        actionButton.classList.add("notransition");
    }
    // Pauses all transitions.

    switch (gameData.theme) {
        case 0:
            document.getElementById("themeCSS").href = "Themes/dark.css";
            document.getElementById("themeText").innerHTML = "Dark";
            break;
        case 1:
            document.getElementById("themeCSS").href = "Themes/light.css";
            document.getElementById("themeText").innerHTML = "Light";
            break;
    }
    // Sets the css file, and the text in the theme button.

    setTimeout(function() {
        for (let actionButton of document.getElementsByClassName("transition")) {
            actionButton.classList.remove("notransition");
    }}, 10);
    // Restarts all transitions after a short break, which stops them from happening on theme change.
}