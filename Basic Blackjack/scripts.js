// Notes //
// 
//
//

// Global Variables //
var houseHand, playerHand, currentDeck;
var houseCurrentScore, playerCurrentScore;
var request = new XMLHttpRequest();
var pRequest = new XMLHttpRequest();
var hRequest = new XMLHttpRequest();

// Set listeners on load //
window.onload = function ()
{
    document.getElementById('start').addEventListener('click', start);
    document.getElementById('hitMe').addEventListener('click', hitMe);
    document.getElementById('stay').addEventListener('click', stay);
    document.getElementById('log').addEventListener('click', logData);
}

// Functions tied to buttons //
function start()
{
    clearHands();
    createDeck();
    showHands();
}

function hitMe()
{
    hitPlayer();
    hitHouse();
}

function stay()
{
    hitHouse();
}

function logData()
{
    console.log("*****************");
    console.log("createDeck() Data")
    console.log("currentDeck Info: ", currentDeck);
    console.log("ID: ", currentDeck);
    console.log("-----------------");
    console.log("dealPlayer() Data");
    console.log("Player Hand Info: ", playerHand);
    console.log("-----------------");
    console.log("dealHouse() Data");
    console.log("House Hand Info: ", houseHand);
    console.log("*****************");
}

// Functions that support button functions //
function clearHands()
{
    hideHands();
    document.getElementById("deckcount").textContent = "";
    document.getElementById("status").textContent = "";

    document.getElementById("houseScore").textContent = "Score goes here";
    document.getElementById("HouseC1").src = "";
    document.getElementById("HouseC2").src = "";
    document.getElementById("HouseC3").src = "";
    document.getElementById("HouseC4").src = "";

    document.getElementById("playerScore").textContent = "Score goes here";
    document.getElementById("PlayerC1").src = "";
    document.getElementById("PlayerC2").src = "";
    document.getElementById("PlayerC3").src = "";
    document.getElementById("PlayerC4").src = "";    
}

function createDeck()
{
    fetch(`https://deckofcardsapi.com/api/deck/8m9l3ke6yf8f/shuffle/?deck_count=3`)
        .then(function (response)
        {
            return response.json();
        })
        .then((data) => 
            {
                currentDeck = data;

                document.getElementById("deckcount").textContent = currentDeck.remaining;
                document.getElementById("status").textContent = currentDeck.shuffled;

                // gotta love debugging
                console.log('Initial Deck Creation');
                console.log(`Data: `, data);
                console.log(`currentDeck: `, currentDeck);
                console.log('-----------------');
            })
        .then(playerHand => dealPlayer(currentDeck))
        .then(houseHand => dealHouse(currentDeck));
}

function showHands()
{
    var dHand = document.getElementById("house")
    var pHand = document.getElementById("player")

    if (dHand.style.display === "none") 
        dHand.style.display = "block";
    if (pHand.style.display === "none")
        pHand.style.display = "block";
}

function hideHands()
{
    var dHand = document.getElementById("house")
    var pHand = document.getElementById("player")

    if (dHand.style.display !== "none") 
        dHand.style.display = "none";
    if (pHand.style.display !== "none")
        pHand.style.display = "none";
}

function dealPlayer(currentDeck)
{
    fetch('https://deckofcardsapi.com/api/deck/' + currentDeck.deck_id + '/draw/?count=2')
        .then(function (response)
        {
            return response.json();
        })
        .then((data) => 
            {
                playerHand = data;

                document.getElementById("PlayerC1").src = playerHand.cards[0].image;
                document.getElementById("PlayerC2").src = playerHand.cards[1].image;
                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;

                // gotta love debugging
                console.log('Dealing to player');
                console.log(`Data: `, data);
                console.log(`playerHand: `, playerHand);
                console.log('-----------------');
            })
        .then ((data2) => calculateScore("player"))
}

function dealHouse(currentDeck)
{
    fetch('https://deckofcardsapi.com/api/deck/' + currentDeck.deck_id + '/draw/?count=2')
        .then(function (response)
        {
            return response.json();
        })
        .then((data) => 
            {
                houseHand = data;

                document.getElementById("HouseC1").src = houseHand.cards[0].image;
                document.getElementById("HouseC2").src = houseHand.cards[1].image;
                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;

                // gotta love debugging
                console.log('Dealing to House');
                console.log(`Data: `, data);
                console.log(`houseHand: `, houseHand);
                console.log('-----------------');
            })
            .then ((data2) => calculateScore("house"))
}

function calculateScore(who)
{        
    var score = 0, altScore = 0, currCard;
    var aceFound = false;

    if(who == "player")
    {
        for(var i = 0; i < 4; i++)
        {
            currCard = playerHand.cards[i]

            if(currCard == null)
            {
                break;
            }
            else
            {
                if(currCard.value == "KING"||currCard.value == "QUEEN"||currCard.value == "JACK")
                {
                    score += 10;
                    altScore += 10;
                }
                else if (currCard.value == "ACE")
                {
                    score += 1;
                    altScore += 11;
                    aceFound = true;
                }
                else
                {
                    score += parseInt(currCard.value);
                    altScore += parseInt(currCard.value);
                }
            }

            currCard = null;
        }  

        checkWinLoseState("player", aceFound, score, altScore);
    }
    else if (who == "house")
    {
        for(var i = 0; i < 4; i++)
        {
            currCard = houseHand.cards[i]

            if(currCard == null)
            {
                break;
            }
            else
            {
                if(currCard.value == "KING"||currCard.value == "QUEEN"||currCard.value == "JACK")
                {
                    score += 10;
                    altScore += 10;
                }
                else if (currCard.value == "ACE")
                {
                    score += 1;
                    altScore += 11;
                    aceFound = true;
                }
                else
                {
                    score += parseInt(currCard.value);
                    altScore += parseInt(currCard.value);
                }
            }

            currCard = null;
        }

        checkWinLoseState("house", aceFound, score, altScore);
    }
    else
    {
        console.log("variable should be either player or house");
        console.log(hand);
    }
}

function checkWinLoseState(hand, aceFound, score, altScore)
{
    var winner = false;
    var altWinner = false;
    var bust = false;

    if (hand == "player")
    {
        if(score == 21 || altScore == 21)
        {
            if (altScore > score)
                altWinner = true;
            else
                winner = true;
        }
        else if (score > 21)
            bust = true;

        displayScore("player", aceFound, score, altScore, winner, altWinner, bust);
    }
    if (hand == "house")
    {
        if(score == 21 || altScore == 21)
        {
            if (altScore > score)
                altWinner = true;
            else
                winner = true;
        }
        else if (score > 21)
            bust = true;
        
        displayScore("house", aceFound, score, altScore, winner, altWinner, bust);
    }
}

function displayScore(hand, aceFound, score, altScore, winner, altWinner, bust)
{
    if (hand == "player")
    {
        if (altWinner == true)
            document.getElementById("playerScore").textContent = `You won with a score of ${altScore}`;
        else if (winner == true)
            document.getElementById("playerScore").textContent = `You won with a score of ${score}`;
        else if (bust == true)
            document.getElementById("playerScore").textContent = `You lost with a score of ${score}`;
        else
        {
            if (aceFound == true)
                document.getElementById("playerScore").textContent = `Your hand's value is: ${score} or ${altScore}`;
            else
                document.getElementById("playerScore").textContent = `Your hand's value is: ${score}`;
        }
    }
    if (hand == "house")
    {
        if (altWinner == true)
            document.getElementById("houseScore").textContent = `You won with a score of ${altScore}`;
        else if (winner == true)
            document.getElementById("houseScore").textContent = `You won with a score of ${score}`;
        else if (bust == true)
            document.getElementById("houseScore").textContent = `You lost with a score of ${score}`;
        else
        {
            if (aceFound == true)
                document.getElementById("houseScore").textContent = `Your hand's value is: ${score} or ${altScore}`;
            else
                document.getElementById("houseScore").textContent = `Your hand's value is: ${score}`;
        }
    }
}

function hitPlayer()
{
    var card3 = document.getElementById("PlayerC3");
    var card4 = document.getElementById("PlayerC4");

    if (card3.getAttribute('src') == "") 
    {
        fetch('https://deckofcardsapi.com/api/deck/' + currentDeck.deck_id + '/draw/?count=1')
        .then(function (response)
            {
            return response.json();
            })
        .then((data) =>
            {
                playerHand.cards.push(data.cards[0]);
                document.getElementById("PlayerC3").src = data.cards[0].image;
                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;

                // gotta love debugging
                console.log('Hitting the Player');
                console.log(`Data: `, data);
                console.log(`playerHnad: `, playerHand);
                console.log('-----------------');
            })
        .then ((data2) => calculateScore("player"))
    }
    else if (card4.getAttribute('src') == "")
    {
        fetch('https://deckofcardsapi.com/api/deck/' + currentDeck.deck_id + '/draw/?count=1')
        .then(function (response)
            {
            return response.json();
            })
        .then((data) =>
            {
                playerHand.cards.push(data.cards[0]);
                document.getElementById("PlayerC4").src = data.cards[0].image;
                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;

                // gotta love debugging
                console.log('Hitting the Player');
                console.log(`Data: `, data);
                console.log(`playerHnad: `, playerHand);
                console.log('-----------------');
            })
        .then ((data2) => calculateScore("player"))
    }
    else
    {
        console.log("player say wut");
    }
}

function hitHouse()
{
    var card3 = document.getElementById("HouseC3");
    var card4 = document.getElementById("HouseC4");

    if (card3.getAttribute('src') == "") 
    {
        fetch('https://deckofcardsapi.com/api/deck/' + currentDeck.deck_id + '/draw/?count=1')
        .then(function (response)
            {
            return response.json();
            })
        .then((data) =>
            {
                houseHand.cards.push(data.cards[0]);
                document.getElementById("HouseC3").src = data.cards[0].image;
                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;

                // gotta love debugging
                console.log('Hitting the House');
                console.log(`Data: `, data);
                console.log(`houseHand: `, houseHand);
                console.log('-----------------');
            })
        .then ((data2) => calculateScore("house"))
    }
    else if (card4.getAttribute('src') == "")
    {
        fetch('https://deckofcardsapi.com/api/deck/' + currentDeck.deck_id + '/draw/?count=1')
        .then(function (response)
            {
            return response.json();
            })
        .then((data) =>
            {
                houseHand.cards.push(data.cards[0]);
                document.getElementById("HouseC4").src = data.cards[0].image;
                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;

                // gotta love debugging
                console.log('Hitting the House');
                console.log(`Data: `, data);
                console.log(`houseHand: `, houseHand);
                console.log('-----------------');
            })
        .then ((data2) => calculateScore("house"))
    }
    else
    {
        console.log("house say wut");
    }
}