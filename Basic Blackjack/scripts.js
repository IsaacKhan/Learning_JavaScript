// Notes //
// Things to work on:
//  - Implement the AI for the house/dealer. Currently, the house doesn't function
//      inteligently, or like a human would.
//

// Global Variables //
var player1 = new Player();
var house = new Player(true);
var currentDeck;

// Set listeners on-load //
window.onload = function ()
{
    document.getElementById('start').addEventListener('click', start);
    document.getElementById('deal').addEventListener('click', deal);
    document.getElementById('hitMe').addEventListener('click', hitMe);
    document.getElementById('stay').addEventListener('click', stay);
    document.getElementById('log').addEventListener('click', logData);
}

// Functions tied to buttons //
function start()
{
    createDeck();
    changeHandVisibility();
}

function deal()
{
    clearHands();
    dealNewHands();
    changeHandVisibility();
}

function hitMe()
{
    hitPlayer();
    hitHouse();
}

function stay()
{
    // add AI for house here
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
    console.log("Player Hand Info: ", player1);
    console.log("-----------------");
    console.log("dealHouse() Data");
    console.log("House Hand Info: ", house);
    console.log("*****************");
}

// Functions that support button functions //
function clearHands()
{
    // set CSS to hide the currently shown hands, assuming they are shown
    changeHandVisibility();

    // reset hands to an empty state
    // this is to ensure no data from previous rounds is used
    house.resetHand();
    player1.resetHand();

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
        .then(data2 => dealPlayer(currentDeck))
        .then(data3 => dealHouse(currentDeck))
}

function changeHandVisibility()
{
    // set variables to some HTML elements
    var dHand = document.getElementById("house")
    var pHand = document.getElementById("player")

    // if the hands are hidden, reveal
    // if the hands are revealed, hide them
    if (dHand.style.display === "none") 
        dHand.style.display = "block";
    else
        dHand.style.display = "none";

    if (pHand.style.display === "none")
        pHand.style.display = "block";
    else
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
                player1.setCurrentHand(data.cards);

                // show the drawn cards in the HTML file
                document.getElementById("PlayerC1").src = data.cards[0].image;
                document.getElementById("PlayerC2").src = data.cards[1].image;

                // adjust the deck count and update value within our currentDeck variable
                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;

                // gotta love debugging
                console.log('Dealing to player');
                console.log(`Data: `, data);
                console.log(`playerHand: `, player1.getCurrentHand());
                console.log('-----------------');

                // Now we can call out function to calculate the score for the player
                // this score will be shown on screen for the user to easily now the value of their hand
            })
        .then ((data2) => player1.calculateScore()) 
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
                house.setCurrentHand(data.cards);
                
                // show the drawn cards in the HTML file
                document.getElementById("HouseC1").src = data.cards[0].image;
                document.getElementById("HouseC2").src = data.cards[1].image;

                // adjust the deck count and update value within our currentDeck variable
                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;

                // gotta love debugging
                console.log('Dealing to House');
                console.log(`Data: `, data);
                console.log(`houseHand: `, house.getCurrentHand());
                console.log('-----------------');

                // Now we can call out function to calculate the score for the house
                // this score will be shown on screen for the user to easily now the value of the house's hand
            })
        .then ((data2) => house.calculateScore()) 
        .then ((data3) => compareScores());    
}

function dealNewHands()
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
             player1.setCurrentHand(data.cards);

             // show the drawn cards in the HTML file
             document.getElementById("PlayerC1").src = data.cards[0].image;
             document.getElementById("PlayerC2").src = data.cards[1].image;

             // adjust the deck count and update value within our currentDeck variable
             document.getElementById("deckcount").textContent = data.remaining;
             currentDeck.remaining = data.remaining;

             // gotta love debugging
             console.log('Dealing to player');
             console.log(`Data: `, data);
             console.log(`playerHand: `, player1.getCurrentHand());
             console.log('-----------------');

             // Now we can call out function to calculate the score for the player
             // this score will be shown on screen for the user to easily now the value of their hand
         })
     .then ((data2) => player1.calculateScore())
     .then ((data3) => dealNewHandsHelper());
}

function dealNewHandsHelper()
{
    fetch('https://deckofcardsapi.com/api/deck/' + currentDeck.deck_id + '/draw/?count=2')
    .then(function (response)
    {
        return response.json();
    })
    .then((data) => 
        {
            // store data for long term use
            house.setCurrentHand(data.cards);
            
            // show the drawn cards in the HTML file
            document.getElementById("HouseC1").src = data.cards[0].image;
            document.getElementById("HouseC2").src = data.cards[1].image;

            // adjust the deck count and update value within our currentDeck variable
            document.getElementById("deckcount").textContent = data.remaining;
            currentDeck.remaining = data.remaining;

            // gotta love debugging
            console.log('Dealing to House');
            console.log(`Data: `, data);
            console.log(`houseHand: `, house.getCurrentHand());
            console.log('-----------------');

            // Now we can call out function to calculate the score for the house
            // this score will be shown on screen for the user to easily now the value of the house's hand
        })
        .then ((data2) => house.calculateScore())
        .then ((data3) => compareScores());
}


function compareScores()
{
    // check for scores of 21 aka blackjack
    if (player1.getCurrentScore() == 21 || player1.getCurrentAceScore() == 21)
    {
        // check if house has 21 also
        // this will result in draw, I guess
        if (house.getCurrentScore() == 21 || house.getCurrentAceScore() == 21)
        {
            // function to call draw 
        }
        else declareWinnerLoser(player1, house, house.getBust());
    }

    if (house.getCurrentScore() == 21 || house.getCurrentAceScore() == 21)
    {
        if(player1.getCurrentScore() == 21 || player1.getCurrentAceScore() == 21)
        {
            // function to call draw
        }
        else declareWinnerLoser(house, player1, player1.getBust());
    }

    // check for an Ace in the player's hand
    if(player1.getAceFound() == true)
    {
        // check if house has an Ace
        if(house.getAceFound() == true)
        {
            // compare the currentAceScore of the two hands
            if(player1.getCurrentAceScore() > house.getCurrentAceScore())
            {
                // check if the player is in a win state
                if(player1.getWinner() == true)
                {
                    // player wins round
                    declareWinnerLoser(player1, house, house.getBust());
                }
            }
            else if(player1.getCurrentAceScore() < house.getCurrentAceScore())
            {
                // check if the player is in a win state
                if(house.getWinner() == true)
                {
                    // player wins round
                    declareWinnerLoser(house, player1, player1.getBust());
                }
            }
            else if(player1.getCurrentAceScore() == house.getCurrentAceScore())
            {
                // Not sure what to do in this instance, consult team
            }
        }
        else
        {
            // compare player's aceScore to houses normal score
            if(player1.getCurrentAceScore() > house.getCurrentScore())
            {
                // check if the player is in a win state
                if(player1.getWinner() == true)
                {
                    // player wins round
                    declareWinnerLoser(player1, house, house.getBust());
                }
            }
            else if(player1.getCurrentAceScore() < house.getCurrentScore())
            {
                // check if the player is in a win state
                if(house.getWinner() == true)
                {
                    // player wins round
                    declareWinnerLoser(house, player1, player.getBust());
                }

                if(house.getBust() == true)
                {
                    // player loses round due to going over 21
                    declareWinnerLoser(player1, house, true);
                }
            }
            else if(player1.getCurrentAceScore() == house.getCurrentScore())
            {
                // Not sure what to do in this instance, consult team
            }
        }
    }
    else
    {
        // check if house has an Ace
        if(house.getAceFound() == true)
        {
            // compare the player's normal score to house's ace score
            if(player1.getCurrentScore() > house.getCurrentAceScore())
            {
                // check if the player is in a win state
                if(player1.getWinner() == true)
                {
                    // player wins round
                    declareWinnerLoser(player1, house, house.getBust());
                }

                if(player1.getBust() == true)
                {
                    // player loses round due to going over 21
                    declareWinnerLoser(house, player1, true);
                }
            }
            else if(player1.getCurrentScore() < house.getCurrentAceScore())
            {
                // check if the player is in a win state
                if(house.getWinner() == true)
                {
                    // player wins round
                    declareWinnerLoser(house, player1, player.getBust());
                }
            }
            else if(player1.getCurrentScore() == house.getCurrentAceScore())
            {
                // Not sure what to do in this instance, consult team
            }
        }
        else
        {
            // compare player's aceScore to houses normal score
            if(player1.getCurrentScore() > house.getCurrentScore())
            {
                // check if the player is in a win state
                if(player1.getWinner() == true)
                {
                    // player wins round
                    declareWinnerLoser(player1, house, house.getBust());
                }

                if(player1.getBust() == true)
                {
                    // player loses round due to going over 21
                    declareWinnerLoser(house, player1, true);
                }
            }
            else if(player1.getCurrentScore() < house.getCurrentScore())
            {
                // check if the player is in a win state
                if(house.getWinner() == true)
                {
                    // player wins round
                    declareWinnerLoser(house, player1, player.getBust());
                }

                if(house.getBust() == true)
                {
                    // house loses round due to going over 21
                    declareWinnerLoser(player1, house, true);
                }
            }
            else if(player1.getCurrentScore() == house.getCurrentScore())
            {
                // Not sure what to do in this instance, consult team
            }
        }
    }
}

function declareWinnerLoser(winner, loser, didLoserBust)
{
    var winnerID, loserID;

    // check if house or player
    if(winner.getIsHouse() == true)
    {
        winnerID = "houseScore";
        loserID = "playerScore";
    }
    else
    {
        winnerID = "playerScore";
        loserID = "houseScore";
    }

    // check if we need to output aceScore or normal score
    // the change winner score HTML element
    if(winner.aceFound == true)
        document.getElementById(winnerID).textContent = `You won with a score of ${winner.getCurrentAceScore()}`;
    else
        document.getElementById(winnerID).textContent = `You won with a score of ${winner.getCurrentScore()}`;

    // check if we need to output aceScore or normal score
    // the change loser score HTML element
    if(loser.aceFound == true)
        document.getElementById(loserID).textContent = `You lost with a score of ${loser.getCurrentAceScore()}`;
    else
    {
        if(didLoserBust == true)
            document.getElementById(loserID).textContent = `You Bust with a score of ${loser.getCurrentScore()}`;
        else
            document.getElementById(loserID).textContent = `You lost with a score of ${loser.getCurrentScore()}`;
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
                player1.addCardtoHand(data.cards[0]);

                // set the 3rd card html element to the drawn cards' image
                // and update the number of remaining cards in HTML and currentDeck
                document.getElementById("PlayerC3").src = data.cards[0].image;
                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;

                // gotta love debugging
                console.log('Hitting the Player');
                console.log(`Data: `, data);
                console.log(`playerHnad: `, player1.getCurrentHand());
                console.log('-----------------');

                // Calling calulcate score to update player's score
            })
        .then ((data2) => player1.calculateScore())
        .then ((data3) => compareScores());
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
                player1.addCardtoHand(data.cards[0]);
                document.getElementById("PlayerC4").src = data.cards[0].image;
                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;

                // gotta love debugging
                console.log('Hitting the Player');
                console.log(`Data: `, data);
                console.log(`playerHnad: `, player1.getCurrentHand());
            })
        .then ((data2) => player1.calculateScore())
        .then ((data3) => compareScores());
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
                house.addCardtoHand(data.cards[0]);
                document.getElementById("HouseC3").src = data.cards[0].image;
                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;

                // gotta love debugging
                console.log('Hitting the House');
                console.log(`Data: `, data);
                console.log(`houseHand: `, house.getCurrentHand());
                console.log('-----------------');
            })
        .then ((data2) => house.calculateScore())
        .then ((data3) => compareScores());
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
                 house.addCardtoHand(data.cards[0]);
                 document.getElementById("HouseC4").src = data.cards[0].image;
                 document.getElementById("deckcount").textContent = data.remaining;
                 currentDeck.remaining = data.remaining;
 
                 // gotta love debugging
                 console.log('Hitting the House');
                 console.log(`Data: `, data);
                 console.log(`houseHand: `, house.getCurrentHand());
                 console.log('-----------------');
            })
        .then ((data2) => house.calculateScore())
        .then ((data3) => compareScores());
    }
    else
    {
        console.log("house say wut");
    }
}