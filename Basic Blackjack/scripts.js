// Getting an Uncaught TypeError: Cannot read property "deck_id" of undefined
// I think it is an issue of order of operations, for lack of a better word
// time for sleep

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
    logData();
}

function hitMe()
{
    console.log("Ye, it worked.");
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
    console.log("ID: ", currentDeck.deck_id);
    console.log("-----------------");
    console.log("dealPlayer() Data");
    console.log("Player Hand Info: ", playerHand);
    console.log("-----------------");
    console.log("dealHouse() Data");
    console.log("Dealer Hand Info: ", dealerHand);
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

                // gotta love debugging
                console.log('Initial Deck Creation');
                console.log(`Data: `, data);
                console.log(`Deck Info: `, currentDeck);
                console.log('-----------------');
            })
        .then(dealPlayer()); 
}

function dealPlayer()
{
    var temp = JSON.stringify(currentDeck.deck_id);

    fetch('https://deckofcardsapi.com/api/deck/' + temp + '/draw/?count=2')
        .then(function (response)
        {
            return response.json();
        })
        .then((data) => 
            {
                playerHand = data;

                document.getElementById("PlayerC1").src = playerHand.cards[0].image;
                document.getElementById("PlayerC2").src = playerHand.cards[1].image;

                // gotta love debugging
                console.log('Dealing to player');
                console.log(`Data: `, data);
                console.log(`playerHand: `, playerHand);
                console.log('-----------------');
            })
        .then(dealHouse());

}

function dealHouse()
{
    var temp = JSON.stringify(currentDeck.deck_id);

    fetch('https://deckofcardsapi.com/api/deck/' + temp + '/draw/?count=2')
        .then(function (response)
        {
            return response.json();
        })
        .then((data) => 
            {
                houseHand = data;

                document.getElementById("DealerC1").src = houseHand.cards[0].image;
                document.getElementById("DealerC2").src = houseHand.cards[1].image;

                // gotta love debugging
                console.log('Dealing to House');
                console.log(`Data: `, data);
                console.log(`dealerHand: `, dealerHand);
                console.log('-----------------');
            })
}