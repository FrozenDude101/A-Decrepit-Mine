function saveGame() {
    // Handles saving the game data.
    localStorage.setItem("ADecrepitMineSave", JSON.stringify(gameData));
}

function loadGame() {
    // Handles loading the game on page load.
    var savegame = JSON.parse(localStorage.getItem("ADecrepitMineSave"));
    savegame = null;
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

    for (let timer of timers) {
        clearTimeout(timer);
        clearInterval(timer);
    }
    timers = [];
    // Removes all active timers and intervals, for example, stopping messages from being sent from before the reset.

    setValues();
}

function getDefaults() {
    // Handles the defaults, keeping it in a single place.
    return {
        "tabsUnlocked": 0b11111,
        // Binary flags for each tab.

        "console": [],

        "machines": {
            "fabricator": {
                "level": 1,
                "progress": 0,
                "blueprint": {
                    "name": "",
                    "cost": new Resources(),
                    "event": "",
                }
            },

            "waterWheel": {
                "level": 1,
                "enabled": false,
                "rate": 0,
            },
            "pump": {
                "level": 0,
                "enabled": false,
                "rate": 0,
            },
            
            "dynamo": {
                "level": 0,
                "enabled": false,
                "multiplier": 0,
            },

            "drill": {
                "level": 0,
                "enabled": false,
                "progress": 0,
                "rewards": {//TODO ADD THE BLANK REWARD TABLE.
                },
            },
            "refiner": {
                "level": 0,
                "enabled": false,
                "progress": 0,
            },
            "scienceBay": {
                "level": 0,
                "enabled": false,
                "progress": 0,
            },
            
            "battery": {
                "level": 0,
                "enabled": false,
                "maxStorage": 0,
                "stored": 0,
            },            
            "tank": {
                "level": 0,
                "enabled": false,
                "maxStorage": 0,
                "stored": 0,
            },

            "conveyour": {
                "level": 0,
                "enabled": false,
            },
            "lights": {
                "level": 0,
                "enabled": false,
            },
        },
        // Each machine and its values.

        "inventory": new Resources(),
        // The inventory.
        
        "theme": (gameData.theme) ? gameData.theme : 0,
        // Personal prefrences aren't reset, as these will likely just be set back again.

        "version": "0.1",
    };
}

function setValues() {
    // Handles setting values to appear as there were when saved.
    setTab("cavern");
    setTheme(theme=gameData.theme);
    // Sets the major tab, and theme.

    document.getElementById("studioTabButton").style.display   = gameData.tabsUnlocked && 0b00001 ? "inline" : "none";
    document.getElementById("cavernTabButton").style.display   = gameData.tabsUnlocked && 0b00010 ? "inline" : "none";
    document.getElementById("machinesTabButton").style.display = gameData.tabsUnlocked && 0b00100 ? "inline" : "none";
    document.getElementById("ascentTabButton").style.display   = gameData.tabsUnlocked && 0b01000 ? "inline" : "none";
    document.getElementById("descentTabButton").style.display  = gameData.tabsUnlocked && 0b10000 ? "inline" : "none";
    // Sets major tab buttons to be visible only if unlocked.

    document.getElementById("fabricatorContainer").style.display = gameData.machines.fabricator.level ? "block" : "none";
    document.getElementById("generatorContainer").style.display  = gameData.machines.waterWheel.level ? "block" : "none";
    document.getElementById("drillContainer").style.display      = gameData.machines.drill.level      ? "block" : "none";
    document.getElementById("refinerContainer").style.display    = gameData.machines.refiner.level    ? "block" : "none";
    document.getElementById("pumpContainer").style.display       = gameData.machines.pump.level       ? "block" : "none";
    document.getElementById("scienceBayContainer").style.display = gameData.machines.scienceBay.level ? "block" : "none";
}

loadGame();