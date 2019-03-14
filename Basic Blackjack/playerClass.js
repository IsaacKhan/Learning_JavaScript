class Player
{
    constructor(wins = 0, losses = 0, hand = null, score = 0, aceScore = 0)
    {
        this.numberOfWins = wins;
        this.numberOfLosses = losses;
        this.currentHand = hand;
        this.currentScore = score;
        this.currentAceScore = aceScore;
        this.aceFound = false;
        this.winner = false;
        this.lose = false;
        this.bust = false;
    }

    // some basic member functions, getters/setters //
    setWins(wins)
    {
        this.numberOfWins = wins;
    }
    getWins()
    {
        return this.numberOfWins
    }

    setLosses(wins)
    {
        this.numberOfLosses = wins;
    }
    getLosses()
    {
        return this.numberOnumberOfLossesWins
    }

    setCurrentHand(hand)
    {
        this.currentHand = hand;
    }
    getCurrentHand()
    {
        return this.currentHand;
    }

    setCurrentScore(score)
    {
        this.currentScore = score;
    }
    getCurrentScore()
    {
        return this.currentScore;
    }

    setCurrentAceScore(aceScore)
    {
        this.currentAceScore = aceScore;
    }
    getCurrentAceScore()
    {
        return this.currentAceScore;
    }

    setAceFound(aceFound)
    {
        this.aceFound = aceFound;
    }
    getAceFound()
    {
        return this.aceFound;
    }

    setWinner(winner)
    {
        this.winner = winner;
    }
    getWinner()
    {
        return this.winner;
    }

    setLose(lose)
    {
        this.lose = lose;
    }
    getLose()
    {
        return this.lose;
    }

    setBust(bust)
    {
        this.bust = bust;
    }
    getBust()
    {
        return this.bust;
    }

    // Other functions //
    addCardtoHand(card)
    {
        // This will be called when the player is given another card after the inital deal
        this.currentHand.push(card);
    }

    resetHand()
    {
        // This will be called when the round ends
        this.currentHand = null;
        this.currentScore = 0;
        this.currentAceScore = 0;
        this.aceFound = false;
        this.winner = false;
        this.lose = false;
        this.bust = false;        
    }

    calculateScore()
    {
        // temp variable for this functions operations
        var currCard;

        // Not sure the max number of card a hand can have in Blackjack
        // so I set the limit to four. 
        for(var i = 0; i < 4; i++)
        {
            // get the cards from the given hand in order
            currCard = this.currentHand[i]

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
                    this.score += 10;
                    this.aceScore += 10;
                }
                else if (currCard.value == "ACE")
                {
                    // Aces are weird. They can be either 1 or 11
                    // This explains why there is an "altScore" variable
                    this.score += 1;
                    this.aceScore += 11;

                    // This boolean helps for when we display out the scores
                    this.aceFound = true;
                }
                else
                {
                    // Just ordinary number cards? Easy. 
                    // Just convert the values and store.
                    this.score += parseInt(currCard.value);
                    this.aceScore += parseInt(currCard.value);
                }
            }

            // reset the current card variable so that each time it goes through the loop
            // the data will be either null or not null
            currCard = null;
        }
    }

    checkWinState()
    {
        if (this.currentAceScore == this.currentScore)
        {
            if (this.currentScore == 21)
                winner = true;
        }
        else if (this.currentAceScore > this.currentScore)
        {
            // this line could be redudant, but its more so for self-checking
            aceFound = true;

            if (this.currentAceScore == 21)
                winner = true;
        }
    }

    checkbustState()
    {
        // don't need to check aceScore since ace can be either 1 or 11
        if (this.currentScore > 21)
            this.bust = true;
    }
}