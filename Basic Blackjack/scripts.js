// Notes //
// Thinking about making a Player and House class so that the information will be more organized
// I think this will also remove the need for some Global variables
//

// Global Variables //
var houseHand, playerHand, currentDeck;
var houseCurrentScore, playerCurrentScore;
var request = new XMLHttpRequest();
var pRequest = new XMLHttpRequest();
var hRequest = new XMLHttpRequest();

// Set listeners on-load //
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

// This functionality will only exist for debugging purposes
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
    // set CSS to hide the currently shown hands, assuming they are shown
    hideHands();

    // setting values to null or empty string 
    // so nothing will shown up when we reveal hands again
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
    // Since this is in testing phase and I don't want to run into any API issues
    // I've retrived a deck_id from the API and hardcoded that id so I won't
    // be create hundreds of different decks while testing
    // "add three deck support"
    fetch(`https://deckofcardsapi.com/api/deck/8m9l3ke6yf8f/shuffle/?deck_count=3`)
        .then(function (response)
        {
            // we get the response from the API and return the JSON format of it
            // not sure if this step is needed, but can be tested later...
            return response.json();
        })
        .then((data) => 
            {
                // now we have data, so we store it for long term use
                currentDeck = data;

                // adjust some HTML elements to help with data consistency and debugging
                document.getElementById("deckcount").textContent = currentDeck.remaining;
                document.getElementById("status").textContent = currentDeck.shuffled;

                // gotta love debugging
                console.log('Initial Deck Creation');
                console.log(`Data: `, data);
                console.log(`currentDeck: `, currentDeck);
                console.log('-----------------');

                // Then we make our calls to deal the player's hand and then the house's hand
                // I don't know if it is correct to return to the playerhand/houseHand
                // but for the .then promise to work it needs to return to something
                // can test later...
            })
        .then(playerHand => dealPlayer(currentDeck))
        .then(houseHand => dealHouse(currentDeck));
}

function showHands()
{
    // set variables to some HTML elements
    var dHand = document.getElementById("house")
    var pHand = document.getElementById("player")

    // if the element's CSS display value is none, change it
    if (dHand.style.display === "none") 
        dHand.style.display = "block";
    if (pHand.style.display === "none")
        pHand.style.display = "block";
}

function hideHands()
{
    // very similar to showHands()
    // can merge two later on...
    var dHand = document.getElementById("house")
    var pHand = document.getElementById("player")

    if (dHand.style.display !== "none") 
        dHand.style.display = "none";
    if (pHand.style.display !== "none")
        pHand.style.display = "none";
}

function dealPlayer(currentDeck)
{
    // API call to draw the two inital cards from our current deck
    fetch('https://deckofcardsapi.com/api/deck/' + currentDeck.deck_id + '/draw/?count=2')
        .then(function (response)
        {
            return response.json();
        })
        .then((data) => 
            {
                // store data for long term use
                playerHand = data;

                // show the drawn cards in the HTML file
                document.getElementById("PlayerC1").src = playerHand.cards[0].image;
                document.getElementById("PlayerC2").src = playerHand.cards[1].image;

                // adjust the deck count and update value within our currentDeck variable
                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;

                // gotta love debugging
                console.log('Dealing to player');
                console.log(`Data: `, data);
                console.log(`playerHand: `, playerHand);
                console.log('-----------------');

                // Now we can call out function to calculate the score for the player
                // this score will be shown on screen for the user to easily now the value of their hand
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
                // store data for long term use
                houseHand = data;
                
                // show the drawn cards in the HTML file
                document.getElementById("HouseC1").src = houseHand.cards[0].image;
                document.getElementById("HouseC2").src = houseHand.cards[1].image;

                // adjust the deck count and update value within our currentDeck variable
                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;

                // gotta love debugging
                console.log('Dealing to House');
                console.log(`Data: `, data);
                console.log(`houseHand: `, houseHand);
                console.log('-----------------');

                // Now we can call out function to calculate the score for the house
                // this score will be shown on screen for the user to easily now the value of the house's hand
            })
            .then ((data2) => calculateScore("house"))
}

function calculateScore(who)
{        
    // variables to track score and is an ace was drawn
    var score = 0, altScore = 0, currCard;
    var aceFound = false;

    // First, we check who's score we are calculating
    if(who == "player")
    {
        // Not sure the max number of card a hand can have in Blackjack
        // so I set the limit to four. 
        for(var i = 0; i < 4; i++)
        {
            // get the cards from the given hand in order
            currCard = playerHand.cards[i]

            // if there is no card, we exit the forloop
            if(currCard == null)
            {
                // This can occur when the game first starts
                // the house and player will only have two cards each,
                // so when we check for a third card, we get a null/undefined error
                break;
            }
            else
            {
                // There are some cards! good job!
                if(currCard.value == "KING"||currCard.value == "QUEEN"||currCard.value == "JACK")
                {
                    // King, Queen, and Jack have values of 10
                    score += 10;
                    altScore += 10;
                }
                else if (currCard.value == "ACE")
                {
                    // Aces are weird. They can be either 1 or 11
                    // This explains why there is an "altScore" variable
                    score += 1;
                    altScore += 11;

                    // This boolean helps for when we display out the scores
                    aceFound = true;
                }
                else
                {
                    // Just ordinary number cards? Easy. 
                    // Just convert the values and store.
                    score += parseInt(currCard.value);
                    altScore += parseInt(currCard.value);
                }
            }

            // reset the current card variable so that each time it goes through the loop
            // the data will be either null or not null
            currCard = null;
        }  

        // Feelin' a bit dizzy? we're done looping, so we check if anyone has won or lost yet.
        checkWinLoseState("player", aceFound, score, altScore);
    }
    else if (who == "house")
    {
        // same as above, just for the house hand now.
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
        // Not sure how it could end up here, but I thought it would be good to have it.
        // Never know when things will go wrong with these contraptions...
        console.log("variable should be either player or house");
        console.log(hand);
    }
}

function checkWinLoseState(hand, aceFound, score, altScore)
{
    // variables
    var winner = false;
    var altWinner = false;
    var bust = false;

    // check who's hand we are peeping
    if (hand == "player")
    {
        // check for a win state
        if(score == 21 || altScore == 21)
        {
            // either score or altScore is 21
            // if altScore is greater, that means an Ace was drawn and
            // since an Ace can be 1 or 11, the player is going to go with the 11
            // so they can win the round. Otherwise its a non-Ace win
            if (altScore > score)
                altWinner = true;
            else 
                winner = true;
        }
        // since Ace can be 1 or 11, even if the first two cards would result in an altScore
        // that is greater than 21, the player wouldn't go for the high ace, they'd go low
        // so we just check if score is over 21. This is our lose state
        else if (score > 21)
            bust = true;

        // now that we are down checking states, we display the score
        displayScore("player", aceFound, score, altScore, winner, altWinner, bust);
    }
    if (hand == "house")
    {
        // similar to the above code section, just now operating on the house's score
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
    // check who's hand we are copin' a glean from
    if (hand == "player")
    {
        // check for which win state we have, non-Ace win or Ace win
        if (altWinner == true)
            document.getElementById("playerScore").textContent = `You won with a score of ${altScore}`;
        else if (winner == true)
            document.getElementById("playerScore").textContent = `You won with a score of ${score}`;
        // Then check if the player lost
        else if (bust == true)
            document.getElementById("playerScore").textContent = `You lost with a score of ${score}`;
        else
        {
            // didn't win? didn't lose? time to keep playing. 
            // Display the scores.
            if (aceFound == true)
                document.getElementById("playerScore").textContent = `Your hand's value is: ${score} or ${altScore}`;
            else
                document.getElementById("playerScore").textContent = `Your hand's value is: ${score}`;
        }
    }
    if (hand == "house")
    {
        // similar to the above code section, just now operating on the house's score
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
    // set variables to some HTML elements
    var card3 = document.getElementById("PlayerC3");
    var card4 = document.getElementById("PlayerC4");

    // check if there isn't an image value
    if (card3.getAttribute('src') == "") 
    {
        // since there isn't we can do our API call to draw a card form the current deck
        fetch('https://deckofcardsapi.com/api/deck/' + currentDeck.deck_id + '/draw/?count=1')
        .then(function (response)
            {
            return response.json();
            })
        .then((data) =>
            {
                // Add the new card to the end of the cards array for playerHand
                playerHand.cards.push(data.cards[0]);

                // set the 3rd card html element to the drawn cards' image
                // and update the number of remaining cards in HTML and currentDeck
                document.getElementById("PlayerC3").src = data.cards[0].image;
                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;

                // gotta love debugging
                console.log('Hitting the Player');
                console.log(`Data: `, data);
                console.log(`playerHnad: `, playerHand);
                console.log('-----------------');

                // Calling calulcate score to update player's score
            })
        .then ((data2) => calculateScore("player"))
    }
    else if (card4.getAttribute('src') == "")
    {
        // similar to the above code section, just for the fourth card drawn
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
        // so this happens when the "Hit Me" button is press more than 4 times within a round
        // I wasn't sure what else to do for this, but before it would just replace the fourth card image
        // ...Which is something we don't want
        console.log("player say wut");
    }
}

function hitHouse()
{
    // This function is very similar to htiPlayer()
    // this could be merged later on...
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