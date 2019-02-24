/// Current Issue: deckID is undefined for some reason
/// so can't concat with API endpoint URL for response
//// So I don't think the "pile" functionality is going to work for us
//// At least, I haven't been able to get it to work.
///// Trying to format this in a way the code is reactive to the button pushes
///// Not really following the tut right now...

var dealerHand, playerHand, deckID;
var request = new XMLHttpRequest();

function start()
{
    createDeck(request, deckID);
    dealPlayer(request, deckID);
    //dealDealer(request, deckID);
}

function createDeck()
{
    request.open('GET', 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=3');
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

function dealPlayer()
{
    request.open('GET', 'https://deckofcardsapi.com/api/deck/'+ deckID +'/draw/?count=2');
    request.onload = function()
    {
        var data = JSON.parse(this.response);
        playerHand = data.cards;

        // Adding in an if statement for http error codes
        console.log('Initial Deck Creation');
        console.log(`Data: `, data);
        console.log(`playerHand: `, playerHand);
        console.log('---------');
    }
    request.send();

    document.querySelector("#players").innerHTML = playerHand;
}

function dealDealer()
{
    request.open('GET', 'https://deckofcardsapi.com/api/deck/'+ deckID +'/draw/?count=2');
    request.onload = function()
    {
        var data = JSON.parse(this.response);
        dealerHand = data.cards;

        // Adding in an if statement for http error codes
        console.log('Initial Deck Creation');
        console.log(`Data: `, data);
        console.log(`dealerHand: `, dealerHand);
        console.log('---------');
    }
    request.send();

    document.querySelector("#dealer").innerHTML = dealerHand;
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