var gameData = {};
// Keeps track of all data that has to be saved.

var timers = [];
// Contains all the setTimer and setInterval IDs, which have to be stored and cleared on reset.

function outputMessage(msgs) {
    // Handles messages before they are put onto the console.
    var delay = 0;
    for (msg of msgs) {
        gameData.console.push([msg.msg, msg.style]);
        // All messages are added internally before visually or they can disappear during saving/loading.
        delay += msg.time;
        // Each delay also needs the total delay of all previous messages.
        delayMessage(msg.msg, msg.style, delay);
    }
}

function delayMessage(msg, style, delay) {
    // Handles delaying the message, which had to be a separate function, as msg.XXX were overriden in each iteration of the for loop otherwise.
    timers.push(setTimeout(function() { output(msg, style) }, delay));
}

function output(msg, style) {
    // Handles outputting the message visually.
    var output = document.getElementById("console");
    output.innerHTML += "<div class=message style="+style+">"+msg+"</div>";
    // Adds the message to the console.
    
    var height = 0;
    for (message of output.children) {
        height += message.offsetHeight;
    }
    // Calculates the current height of all the messages.
    while (height >= 468) {
        height -= output.firstChild.offsetHeight;
        output.firstChild.remove();
        gameData.console.shift();
    }
    // Removes the first message until all the messages fit.
}

function setEvent(eventID, delay) {
    // Handles setting events with a delay.
    gameData.event = eventID;
    timers.push(setTimeout(function() { doCurrentEvent() }, delay));
}

function doCurrentEvent() {
    // Handles executing the event.
    /*
        EventID Notation
        <int><char>
        int -> Event group.
        char -> Event part.
        0a -> 0b -> 1a or 2a
    */
    switch (gameData.event) {
        case "0a":
            outputMessage(
                [{msg:"Ugh, where am I?", style:"", time:1000},
                 {msg:"It's so dark in here.", style:"", time:1000}]
            );
            setEvent("0b", 3000);
            break;

        case "0b":            
            document.getElementById("action1").onclick = function() {setEvent("1a")};
            document.getElementById("action1").innerHTML = "Feel around in the dark.";
            document.getElementById("action2").onclick = function() {setEvent("2a")};
            document.getElementById("action2").innerHTML = "Search your pockets.";
            break;
    }
}

function setScreen(screen) {
    // Handles changing the screen between the major tabs.
    for (container of document.getElementsByClassName("screenContainer")) {
        container.style.display = "none";
    }
    document.getElementById(screen+"Container").style.display = "block";
    // Sets all screen containers to invisible, then reveals the specified screen.

    for (button of document.getElementsByClassName("screenButton")) {
        button.classList.remove("active")
    }
    document.getElementById(screen+"Button").classList.add("active")
    // Removes "active" class from all screen buttons, then adds it to the specified button.
}

function setTheme(theme=NaN) {
    console.log(theme);
    if (isNaN(theme)) {
        // Handles changing the theme.
        gameData.theme += 1;
        if (gameData.theme === 2) {
            gameData.theme = 0;
        }
    } else {
        gameData.theme = theme;
    }
    // Increments the theme counter if called without an argument, otherwise sets it directly.

    for (actionButton of document.getElementsByClassName("transition")) {
        actionButton.classList.add("notransition");
    }
    // Pauses all transitions.

    switch (gameData.theme) {
        case 0:
            document.getElementById("themeCSS").href = "dark.css";
            document.getElementById("themeText").innerHTML = "Dark";
            break;
        case 1:
            document.getElementById("themeCSS").href = "light.css";
            document.getElementById("themeText").innerHTML = "Light";
            break;
    }
    // Sets the css file, and the text in the theme button.

    setTimeout(function() {
        for (actionButton of document.getElementsByClassName("transition")) {
            actionButton.classList.remove("notransition");
    }}, 10);
    // Restarts all transitions after a short break, which stops them from happening on theme change.
}

function setScale(scale=NaN) {
    if (isNaN(scale)) {
        // Handles changing the scale.
        gameData.scale += 1;
        if (gameData.scale === 3) {
            gameData.scale = 0;
        }
    } else {
        gameData.scale = scale;
    }
    // Increments the scale counter if called without an argument, otherwise sets it directly.

    for (actionButton of document.getElementsByClassName("transition")) {
        actionButton.classList.add("notransition");
    }
    // Pauses all transitions.

    var body = document.getElementsByTagName("body")[0];
    var bodyScale;
    switch (gameData.scale) {
        case 0:
            document.getElementById("scaleText").innerHTML = "Auto";
            body.style.zoom = 1;
            bodyScale = Math.min(body.offsetHeight/720, body.offsetWidth/1280);
            break;
        case 2:
            document.getElementById("scaleText").innerHTML = "Normal";
            bodyScale = 0
            break;
        case 3:
            document.getElementById("scaleText").innerHTML = "Large";
            bodyScale = 1
            break;
    }
    body.style.zoom = bodyScale;

    setTimeout(function() {
        for (actionButton of document.getElementsByClassName("transition")) {
            actionButton.classList.remove("notransition");
    }}, 10);
    // Restarts all transitions after a short break, which stops them from happening on theme change.
}

function saveGame() {
    // Handles saving the game data.
    localStorage.setItem("ADecrepitMineSave", JSON.stringify(gameData));
}

function loadGame() {
    // Handles loading the game on page load.
    var savegame = JSON.parse(localStorage.getItem("ADecrepitMineSave"));
    if (savegame !== null) {
        var defaults = getDefaults();
        gameData = savegame;
        switch(gameData.version) {
            case null:
                gameData.version = "0.1";
            case "0.1":
                gameData.scale = 0;
        }        
        setValues();
    } else {
        resetGame();
    }
    // If a save file exists, set gameData to that save, else reset to the defaults.
}

function resetGame() {
    // Handles creating a new game file.
    gameData = getDefaults();

    for (timer of timers) {
        clearTimeout(timer);
        clearInterval(timer);
    }
    timers = [];
    // Removes all active timers and intervals, for example, stopping messages from being sent from before the reset.

    document.getElementById("action1").onclick = null;
    document.getElementById("action1").innerHTML = "";
    document.getElementById("action2").onclick = null;
    document.getElementById("action2").innerHTML = "";
    // Resets the action buttons to a blank state.

    setValues();
}

function getDefaults() {
    // Handles the defaults, keeping it in a single place.
    return {
        "console": [],
    
        "event": "0a",
    
        "cavernUnlocked": true,
        "ascentUnlocked": true,
        "descentUnlocked": true,

        "scale": (gameData.scale in [null, NaN]) ? 0 : gameData.scale,
        "theme": (gameData.theme in [null, NaN]) ? 0 : gameData.theme,
        // Personal prefrences aren't reset, as these will likely just be set back again.

        "version": "0.1",
    };
}

function setValues() {
    // Handles setting values to appear as there were when saved.
    setScreen("cavern");
    setScale(scale=gameData.scale);
    setTheme(theme=gameData.theme);
    // Sets the major tab, and theme.

    document.getElementById("console").innerHTML = "";
    for ([msg, style] of gameData.console) { document.getElementById("console").innerHTML += "<div class=message style="+style+">"+msg+"</div>"; }
    // Clears the console of existing messages, then directly puts messages back in, in the correct order.

    setEvent(gameData.event);
    // Sets the event, which also handles the action buttons, as the final event of any chain will be an action, or a stop, never messages.

    document.getElementById("cavernButton").style.display = gameData.cavernUnlocked ? "block" : "none";
    document.getElementById("ascentButton").style.display = gameData.ascentUnlocked ? "block" : "none";
    document.getElementById("descentButton").style.display = gameData.descentUnlocked ? "block" : "none";
    // Sets major tab buttons to be visible only if unlocked.
}

loadGame();