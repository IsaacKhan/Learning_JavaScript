// Need to implement a score tracker of some sort. something uber basic
// Most of this code is for template use later on, so we know what to do and how
// time for more sleep

window.onload = function ()
{
    document.getElementById('start').addEventListener('click', start);
    document.getElementById('hitMe').addEventListener('click', hitMe);
    document.getElementById('stay').addEventListener('click', stay);
    document.getElementById('log').addEventListener('click', logData);
}

var houseHand, playerHand, currentDeck;
var request = new XMLHttpRequest();
var pRequest = new XMLHttpRequest();
var hRequest = new XMLHttpRequest();

function start()
{
    createDeck();
    showHands();
}

function hitMe()
{
    fetch('https://deckofcardsapi.com/api/deck/' + currentDeck.deck_id + '/draw/?count=1')
        .then(function (response)
        {
            return response.json();
        })
        .then((data) =>
            {
                playerHand.cards.push(data.cards[0]);
                var card3 = document.getElementById("PlayerC3");

                if (card3.getAttribute('src') == "") 
                {
                    document.getElementById("PlayerC3").src = data.cards[0].image;
                }
                else
                {
                    document.getElementById("PlayerC4").src = data.cards[0].image;
                }

                document.getElementById("deckcount").textContent = data.remaining;

                // gotta love debugging
                console.log('Hitting the Player');
                console.log(`Data: `, data);
                console.log(`playerHnad: `, playerHand);
                console.log('-----------------');
            })
}

function stay()
{
    console.log("Fine, I'll stay then.");
}

function showHands()
{
    var dHand = document.getElementById("dealer")
    var pHand = document.getElementById("player")

    if (dHand.style.display === "none") 
        dHand.style.display = "block";
    if (pHand.style.display === "none")
        pHand.style.display = "block";
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
    console.log("Dealer Hand Info: ", houseHand);
    console.log("*****************");
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

                // gotta love debugging
                console.log('Dealing to player');
                console.log(`Data: `, data);
                console.log(`playerHand: `, playerHand);
                console.log('-----------------');
            })
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

                document.getElementById("DealerC1").src = houseHand.cards[0].image;
                document.getElementById("DealerC2").src = houseHand.cards[1].image;
                document.getElementById("deckcount").textContent = data.remaining;

                // gotta love debugging
                console.log('Dealing to House');
                console.log(`Data: `, data);
                console.log(`houseHand: `, houseHand);
                console.log('-----------------');
            })
}