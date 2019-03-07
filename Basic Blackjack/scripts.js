/// Current Issue: deckID is undefined for some reason
/// so can't concat with API endpoint URL for response
//// So I don't think the "pile" functionality is going to work for us
//// At least, I haven't been able to get it to work.
///// Trying to format this in a way the code is reactive to the button pushes
///// Not really following the tut right now...

function start()
{
    var dealerHand, playerHand, deckID;
    var request = new XMLHttpRequest();
    var pRequest = new XMLHttpRequest();
    var dRequest = new XMLHttpRequest();
    
    createDeck(request, deckID);
    dealPlayer(pRequest, deckID, playerHand);
    dealDealer(dRequest, deckID, dealerHand);
    showHands();
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

function createDeck(request, deckID)
{
    request.open('GET', 'https://deckofcardsapi.com/api/deck/8m9l3ke6yf8f/shuffle/?deck_count=3');
    request.onload = function()
    {
        var data = JSON.parse(this.response);
        deckID = data.deck_id;

        // Adding in an if statement for http error codes
        console.log('Initial Deck Creation');
        console.log(`Data: `, data);
        console.log(`deckID: `, deckID);
        console.log('---------');
    }
    request.send();
}

function dealPlayer(pRequest, deckID, playerHand)
{
    pRequest.open('GET', 'https://deckofcardsapi.com/api/deck/'+ deckID +'/draw/?count=2');
    pRequest.onload = function()
    {
        var data = JSON.parse(this.response);
        playerHand = data.cards;

        document.getElementById("PlayerC1").src = playerHand[0].image
        document.getElementById("PlayerC2").src = playerHand[1].image

        // Adding in an if statement for http error codes
        console.log('Initial Deck Creation');
        console.log(`Data: `, data);
        console.log(`playerHand: `, playerHand);
        console.log('---------');
    }
    pRequest.send();
}

function dealDealer(dRequest, deckID, dealerHand)
{
    dRequest.open('GET', 'https://deckofcardsapi.com/api/deck/'+ deckID +'/draw/?count=2');
    dRequest.onload = function()
    {
        var data = JSON.parse(this.response);
        dealerHand = data.cards;

        document.getElementById("DealerC1").src = dealerHand[0].image
        document.getElementById("DealerC2").src = dealerHand[1].image

        // Adding in an if statement for http error codes
        console.log('Initial Deck Creation');
        console.log(`Data: `, data);
        console.log(`dealerHand: `, dealerHand);
        console.log('---------');
    }
    dRequest.send();
}



/*
All this stuff works, except the piles part. i can't get it to take the variables' data

// create variable for requesting data from API
var createDeck = new XMLHttpRequest();
var drawCards = new XMLHttpRequest();
var dealerPile = new XMLHttpRequest();
var playerPile = new XMLHttpRequest();

var deckID = 'bo4uftb398f6';
var cardsDrawn, dealerHand,  playerHand;
var code, cardCode1, cardCode2;

// Create a deck of cards and store deck id
createDeck.open('GET', 'https://deckofcardsapi.com/api/deck/'+ deckID +'/shuffle/?deck_count=3');

createDeck.onload = function() 
{
    var data = JSON.parse(this.response);

    deckID = data.deck_id;

    /// Adding in an if statement for http error codes
    console.log('Initial Deck Creation');
    console.log(`Data: `, data);
    console.log(`deckID: `, deckID);
    console.log('---------');

}
createDeck.send();

// draw two cards from deck and store info
drawCards.open('GET', 'https://deckofcardsapi.com/api/deck/'+ deckID + '/draw/?count=2');
drawCards.onload = function() 
{
    var data = JSON.parse(this.response);   

    cardsDrawn = data.cards;
    cardCode1 = cardsDrawn[0].code;
    cardCode2 = cardsDrawn[1].code;
    code = cardCode1 + "," + cardCode2;

    console.log('Drawing 2 Cards');
    console.log(`Data: `,data);
    console.log(`cardsDrawn: `, cardsDrawn);
    console.log(`cardCode1: `, cardCode1);
    console.log(`cardCode2: `, cardCode2);
    console.log('---------');
}
drawCards.send();

// create dealer pile
dealerPile.open('GET', 'https://deckofcardsapi.com/api/deck/'+ deckID + '/pile/Dealer/add/?cards=' + code);
dealerPile.onload = function()
{
    var data = JSON.parse(this.response);
    
    dealerHand = data.piles.Dealer;

    console.log('Getting Dealer\'s hand');
    console.log(`Data:`, data);
    console.log(`dealerHand: `, dealerHand);
    console.log('---------');
}
dealerPile.send();

// create player pile
playerPile.open('GET', 'https://deckofcardsapi.com/api/deck/'+ deckID + '/pile/Player/add/?cards=' + code);
playerPile.onload = function()
{
    var data = JSON.parse(this.response);

    playerHand = data.piles.Player;

    console.log('Getting Player\'s hand');
    console.log(`Data: `, data);
    console.log(`playerHand: `, playerHand);
    console.log('---------');
}
playerPile.send();
*/