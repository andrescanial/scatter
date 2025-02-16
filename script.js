let balance = 10000;
const symbols = ["A♠", "K♦", "Q♣", "J♥", "10♠", "9♦", "JOKER"];
const gridSize = 5;

document.addEventListener("DOMContentLoaded", () => {
    generateGrid(); // Automatic na maglalagay ng cards sa grid
});

function generateGrid() {
    let grid = document.getElementById("slotGrid");
    grid.innerHTML = "";
    for (let i = 0; i < gridSize * gridSize; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        let randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        cell.innerHTML = randomSymbol; // Cards are visible agad
        grid.appendChild(cell);
    }
}

function spin() {
    let bet = parseInt(document.getElementById("betAmount").value);
    if (balance < bet) {
        alert("Not enough balance!");
        return;
    }

    balance -= bet;
    updateBalance();

    let cells = document.querySelectorAll(".cell");
    let results = [];
    let scatterCount = 0;

    document.getElementById("spinSound").play();

    cells.forEach((cell, index) => {
        cell.classList.add("spinning");
        setTimeout(() => {
            let symbol = symbols[Math.floor(Math.random() * symbols.length)];
            results.push(symbol);
            cell.textContent = symbol;
            cell.classList.remove("spinning");

            if (symbol === "JOKER") {
                scatterCount++;
            }

            if (index === cells.length - 1) {
                checkWin(results, bet, scatterCount);
            }
        }, Math.random() * 1000);
    });
}

function checkWin(results, bet, scatterCount) {
    let winAmount = 0;

    if (scatterCount >= 3) {
        winAmount += bet * 20;
        showMessage("🎉 SCATTER WIN! 100 FREE SPINS! 🎉");
        document.getElementById("jackpotSound").play();
        let freeSpins = 100;

        let interval = setInterval(() => {
            if (freeSpins > 0) {
                freeSpins--;
                spin();
            } else {
                clearInterval(interval);
            }
        }, 1000);
    } else if (checkFullRowWin(results)) {
        winAmount += bet * 10;
        showMessage("🔥 SUPER WIN! 🔥");
        document.getElementById("winSound").play();
    } else {
        showMessage("❌ You Lost! Try Again! ❌");
    }

    if (winAmount > 0) {
        document.getElementById("coinSound").play();
    }

    balance += winAmount;
    updateBalance();
}

function checkFullRowWin(results) {
    for (let i = 0; i < gridSize; i++) {
        if (results[i * gridSize] === results[i * gridSize + 1] && 
            results[i * gridSize + 1] === results[i * gridSize + 2] && 
            results[i * gridSize + 2] === results[i * gridSize + 3] && 
            results[i * gridSize + 3] === results[i * gridSize + 4]) {
            return true;
        }
    }
    return false;
}

function showMessage(msg) {
    document.getElementById("message").innerHTML = msg;
    setTimeout(() => {
        document.getElementById("message").innerHTML = "";
    }, 3000);
}

function updateBalance() {
    document.getElementById("balance").innerHTML = balance;
}
