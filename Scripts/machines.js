function setMachineTab(tab) {
    // Handles changing the subtab in the machine tab.
    for (let container of document.getElementsByClassName("machineTab")) {
        container.style.display = "none";
    }
    if (tab) {
        document.getElementById(tab+"Tab").style.display = "block";
    }
    // Sets all screen containers to invisible, then reveals the specified tab.
}