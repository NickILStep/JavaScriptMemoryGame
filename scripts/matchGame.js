"use strict";

// Set global variables to track matches and wins
var totalMatches = 0;
var totalWins = 0;

// Set event listener for first button click
window.addEventListener("load", setMinMax);
document.getElementById("startButton").addEventListener("click", startGame);

function setMinMax() {
    // Set min and max attributes for input
    document.getElementById("numSymbols").setAttribute("min", "2");
    document.getElementById("numSymbols").setAttribute("max", "8");
}

function startGame() {
    // Get value from the numSymbols input box
    var inSymbols = parseInt(document.getElementById("numSymbols").value);
    var hiddenSymbolCount = document.createElement("p");
    hiddenSymbolCount.setAttribute("id", "hiddenSymbolCount");
    hiddenSymbolCount.setAttribute("class", "hidden");
    hiddenSymbolCount.innerHTML = inSymbols;
    document.body.appendChild(hiddenSymbolCount);

    var hiddenGuessCount = document.createElement("p");
    hiddenGuessCount.setAttribute("id", "hiddenGuessCount");
    hiddenGuessCount.setAttribute("class", "hidden");
    hiddenGuessCount.innerHTML = 0;
    document.body.appendChild(hiddenGuessCount);

    // Hide the startForm div
    document.getElementById("startForm").setAttribute("class", "hidden");

    // Setup the board
    setupBoard();

    // Setup a game with the given number of symbols
    if(inSymbols > 1 && inSymbols <= 8) {
        setupCards(inSymbols);
    }
    else if(inSymbols > 8) {
        setupCards(8);
    }
    else {
        setupCards(2);
    }

    // Cover the cards to hide the symbols until clicked
    hideCards();
    addListeners();
}

function setupBoard() {
    // Setup game board html
    var gameBoard = document.createElement("div");
    gameBoard.setAttribute("id", "gameBoard");
    gameBoard.setAttribute("class", "unhidden");
    document.getElementById("game").appendChild(gameBoard);
}

function setupCards(numSymbols) {
    var matches = document.createElement("p");
    matches.setAttribute("id", "matchDisplay");
    matches.innerHTML = "Matches: 0";
    document.getElementById("game").appendChild(matches);

    var guesses = document.createElement("p");
    guesses.setAttribute("id", "guessDisplay");
    guesses.innerHTML = "Guesses: 0";
    document.getElementById("game").appendChild(guesses);

    // Declare the list of possible symbols
    var possibleSymbols = ["#", "#", "@", "@", "%", "%", "&", "&", "*", "*", "$", "$", "?", "?", "~", "~", "^", "^", "!", "!", "(", "(", ")", ")"];

    // Get the number of cards from the number of symbols (2 cards per symbol)
    var numCards = (numSymbols * 2);

    // Create a list of symbols that is only as long as we need
    var symbolsToUse = [];
    for(var i = 0; i < numCards; i += 2) {
        symbolsToUse.push(possibleSymbols[i]);
        symbolsToUse.push(possibleSymbols[i+1]);
    }

    // Create a randomly ordered list of the symbols we will use
    var randSymbols = randomizeList(symbolsToUse);
    

    for(var i = 0; i < numCards; i++) {
        // Create the table
        var rowNum = 0;
        var gameTable = "<table id='gameTable'>"

        // Add rows to the table based on how many symbols to use
        if(isSquare(numCards)) {
            rowNum = Math.sqrt(numCards);
        }
        else if(numSymbols === 1) {
            rowNum = 1;
        }
        else if(numSymbols === 3 || numSymbols === 4) {
            rowNum = 2;
        }
        else if(numSymbols === 5 || numSymbols === 6) {
            rowNum = 3;
        }
        else {
            rowNum = 4;
        }

        var cardsLeft = numCards;
        for(var j = 0; j < rowNum; j++) {
            // Start table row
            gameTable += "<tr class='cardRow'>";
            for(var k = 0; k < numCards/rowNum && k < 4; k++) {
                // If the last row will only have 2 cards add a blank space to center them
                if(k === 0 && cardsLeft === 2 && numCards > 4) {
                    gameTable += "<td class='emptySpace'></td>";
                }
                // If there are still cards to place, place one
                if(cardsLeft > 0) {
                    // Add symbols to the cards
                    gameTable += "<td class='faceUpCard' id='card" + parseInt(numCards - cardsLeft) + "'>"+ randSymbols[cardsLeft - 1] + "</td>";
                    cardsLeft--;
                }
                // If the last row will only have 2 cards add a blank space to center them
                if(k === 3 && cardsLeft === 0 && numCards > 4 && numSymbols % 2 !== 0) {
                    gameTable += "<td class='emptySpace'></td>";
                }
            }
            // End table row
            gameTable += "</tr>";
        }
    }

    // Add cards to the html
    document.getElementById("game").appendChild(document.createElement("table"));
    document.getElementsByTagName("table")[0].outerHTML = gameTable;
}

function hideCards() {
    var cardList = document.querySelectorAll("table#gameTable td:not(.emptySpace)");
    for(var i = 0; i < cardList.length; i++) {
        cardList[i].setAttribute("class", "faceDownCard");
    }
}

function addListeners() {
    var cardList = document.querySelectorAll("table#gameTable td:not(.emptySpace)");
    for(var i = 0; i < cardList.length; i++) {
        eval("document.getElementById('card" + i + "').addEventListener('click', function() {if(document.getElementById('card" + i + "').getAttribute('class') === 'faceDownCard') {document.getElementById('card" + i + "').setAttribute('class', 'faceUpCard')}; checkMatch();});");
        eval("document.getElementById('card" + i + "').addEventListener('mouseUp', checkMatch);");
    }
}

function disableListeners() {
    var cardList = document.querySelectorAll("table#gameTable td:not(.emptySpace)");
    for(var i = 0; i < cardList.length; i++) {
        if(cardList[i].getAttribute("class") === "faceDownCard") {
            cardList[i].setAttribute("class", "faceDownCard, disabled");
        }
    }
}

function checkMatch() {
    var faceUpCards = document.querySelectorAll("table#gameTable td.faceUpCard");
    if(faceUpCards.length === 2) {
        disableListeners();
        if(faceUpCards[0].innerHTML === faceUpCards[1].innerHTML) {
            setTimeout(function() {
                faceUpCards[0].setAttribute("class", "emptySpace");
                faceUpCards[1].setAttribute("class", "emptySpace");
                totalMatches++;
                document.getElementById("matchDisplay").innerHTML = "Matches: " + totalMatches;
                checkWin();
                hideCards();
            }, 1500);
        }
        else {
            setTimeout(hideCards, 1500);
        }
        document.getElementById("hiddenGuessCount").innerHTML = parseInt(document.getElementById("hiddenGuessCount").innerHTML) + 1;
        document.getElementById("guessDisplay").innerHTML = "Guesses: " + document.getElementById("hiddenGuessCount").innerHTML;
    }
    
}

function checkWin() {
    var remainingCards = document.querySelectorAll("table#gameTable td:not(.emptySpace)");
    if(remainingCards.length === 0) {
        document.getElementById("game").setAttribute("class", "hidden");
        alert("You found all of the matches in " + document.getElementById("hiddenGuessCount").innerHTML + " guesses!");
        location.reload();
    }
}

function randomizeList(inArray) {
    // Shuffle the array
    for(var i = inArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = inArray[i];
        inArray[i] = inArray[j];
        inArray[j] = temp;
    }

    return inArray;
}

function isSquare(n) {
    return n > 0 && Math.sqrt(n) % 1 === 0;
}