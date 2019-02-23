/// Current Issue: deckID is undefined for some reason
/// so can't concat with API endpoint URL for response


// create variable for requesting data from API
var createDeck = new XMLHttpRequest();
var drawCards = new XMLHttpRequest();
var dealerPile = new XMLHttpRequest();
var playerPile = new XMLHttpRequest();

var deckID, cardsDrawn, dealerHand,  playerHand;

// Create a deck of cards and store deck id
createDeck.open('GET','https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=3', true)

createDeck.onload = function() 
{
    var data = JSON.parse(this.response);

    deckID = data.deck_id;

    /// Adding in an if statement for http error codes
    console.log('Initial Deck Creation');
    console.log(data);
    console.log(deckID);
    console.log('---------');

}
createDeck.send();

// draw two cards from deck and store info
drawCards.open('GET', 'https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=2', true);
drawCards.onload = function() 
{
    var data = JSON.parse(this.response);   

    cardsDrawn = data.cards;

    console.log('Drawing 2 Cards');
    console.log(data);
    console.log(cardsDrawn);
    console.log('---------');
}
drawCards.send();

// create dealer pile
dealerPile.open('GET', 'https://deckofcardsapi.com/api/deck/${deckID}/pile/Dealer/add/?cards=${cardsDrawn}', true);
dealerPile.onload = function()
{
    var data = JSON.parse(this.response);
    
    dealerHand = data.piles.Dealer;

    console.log('Getting Dealer\'s hand');
    console.log(data);
    console.log(dealerHand);
    console.log('---------');
}
dealerPile.send();

playerPile.open('GET', 'https://deckofcardsapi.com/api/deck/${deckID}/pile/Player/add/?cards=${cardsDrawn}', true);
playerPile.onload = function()
{
    var data = JSON.parse(this.response);

    playerHand = data.piles.Player;

    console.log('Getting Player\'s hand');
    console.log(data);
    console.log(playerHand);
    console.log('---------');
}