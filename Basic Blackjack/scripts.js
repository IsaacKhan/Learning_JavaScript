/// Current Issue: deckID is undefined for some reason
/// so can't concat with API endpoint URL for response


// create variable for requesting data from API
var createDeck = new XMLHttpRequest();
var drawCards = new XMLHttpRequest();
var dealerPile = new XMLHttpRequest();
var playerPile = new XMLHttpRequest();

var deckID = 'bo4uftb398f6';
var cardsDrawn, dealerHand,  playerHand, cardCode1, cardCode2;

// Create a deck of cards and store deck id
createDeck.open('GET',`https://deckofcardsapi.com/api/deck/bo4uftb398f6/shuffle/?deck_count=3`, true)

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
drawCards.open('GET', `https://deckofcardsapi.com/api/deck/bo4uftb398f6/draw/?count=2`, true);
drawCards.onload = function() 
{
    var data = JSON.parse(this.response);   

    cardsDrawn = data.cards;
    cardCode1 = cardsDrawn[0].code;
    cardCode2 = cardsDrawn[1].code;

    console.log('Drawing 2 Cards');
    console.log(`Data: `,data);
    console.log(`cardsDrawn: `, cardsDrawn);
    console.log(`cardCode1: `, cardCode1);
    console.log(`cardCode2: `, cardCode2);
    console.log('---------');
}
drawCards.send();

// create dealer pile
dealerPile.open('GET', `https://deckofcardsapi.com/api/deck/bo4uftb398f6/pile/Dealer/add/?cards=${cardCode1},${cardCode2}`, true);
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

playerPile.open('GET', `https://deckofcardsapi.com/api/deck/bo4uftb398f6/pile/Player/add/?cards=${cardCode1},${cardCode2}`, true);
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