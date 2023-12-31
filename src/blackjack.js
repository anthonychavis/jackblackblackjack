//
/**
 * launch bj21
 * @returns void
 */
const initBJ = () => {
    // create prompting fxn & allow users to exit the program
    const prompt = require('prompt-sync')({ sigint: true });

    // let deck = [];
    let shuffledDeck; // move ??

    /*
     * CLASSES
     */
    //
    class Card {
        #topCard;
        #value;

        constructor() {
            this.#dealTopCard();
        }

        #dealTopCard() {
            this.#topCard = shuffledDeck.pop();
            this.#value = this.#topCard.value;
            return;
        }

        revealCard() {
            return this.#topCard.face + this.#topCard.suit[0].toUpperCase();
        }

        get value() {
            return this.#value;
        }

        set value(val) {
            this.#value = val;
        }
    }

    //
    class Deck {
        deck = []; // make private
        // shuffledDeck;
        suits = ['spade', 'club', 'heart', 'diamond'];
        strCardsFace = {
            1: 'A',
            11: 'J',
            12: 'Q',
            13: 'K',
        };
        strCardsValue = {
            1: [1, 11],
            11: 10,
            12: 10,
            13: 10,
        };

        constructor() {
            this.shuffle();
        }

        deckGen() {
            // {face: string, suit: string, value: number | number[]
            let cardObj;

            for (let suit of this.suits) {
                for (let i = 1; i < 14; i++) {
                    cardObj = {
                        face: this.strCardsFace[i] || i + '',
                        suit: suit,
                        value: this.strCardsValue[i] || i,
                    };
                    this.deck.push(cardObj);
                }
            }
            return;
        }

        shuffle() {
            if (!this.deck.length) this.deckGen();

            shuffledDeck = [...this.deck]; // something if not yet shuffled ??

            // Durstenfeld shuffle
            for (let i = shuffledDeck.length - 1; i > 0; i--) {
                const ranNum = Math.floor(Math.random() * (i + 1));
                [shuffledDeck[i], shuffledDeck[ranNum]] = [
                    shuffledDeck[ranNum],
                    shuffledDeck[i],
                ];
            }
            return;
        }
    }

    //
    class Hand {
        // allCards = []; // what was this for ??
        currentHand = [];
        // #handVal;

        constructor() {}

        addCard() {
            this.currentHand.push(new Card());
            return;
        }

        #aceInHandCalc(hand, index = 0) {
            return hand.reduce((sum, card) => {
                let cardVal;
                isNaN(card.value)
                    ? (cardVal = card.value[index])
                    : (cardVal = card.value);
                return (sum += cardVal);
            }, 0);
        }

        #handlingAces() {
            const aceHand = [...this.currentHand];
            let decreasingAces = this.#aceInHandCalc(aceHand, 1);
            while (this.#checkForAce(aceHand) && decreasingAces > 21) {
                const firstAceIndex = aceHand.findIndex(card =>
                    isNaN(card.value)
                );
                aceHand[firstAceIndex].value = 1;
                decreasingAces = this.#aceInHandCalc(aceHand, 1);
            }
            return decreasingAces;
        }

        #checkForAce(hand) {
            return hand.some(card => isNaN(card.value));
        }

        #handValFxn() {
            if (this.#checkForAce(this.currentHand)) {
                const highAce = this.#aceInHandCalc(this.currentHand, 1);
                return highAce <= 21 ? highAce : this.#handlingAces();
            } else {
                return this.#reduceCardsVal(this.currentHand);
            }
        }

        resetHand() {
            this.currentHand = [];
            return;
        }

        showHand() {
            return this.currentHand.map(card => card.revealCard()).join(' | ');
        }

        #reduceCardsVal(cards) {
            return cards.reduce((sum, card) => (sum += card.value), 0);
        }

        get handVal() {
            return this.#handValFxn();
        }
    }

    //
    class Moola {
        #moola = 10_000;
        #numOfChips = 0;
        #chipsBet;
        #quarterChips = 25;

        constructor() {
            this.#cashToChips(this.#moola);
        }

        #cashToChips(cash) {
            this.#numOfChips = cash / this.#quarterChips; // if only using "quarters"
            return;
        }

        #chipsToCash(numChips) {
            this.#moola = numChips * this.#quarterChips; // if only using "quarters"
            return;
        } // numChips if using this method of placing bet

        _lossHand(bet) {
            this.#numOfChips -= bet;
            this.#chipsToCash(this.#numOfChips);
            return;
        }

        _winHand(bet) {
            this.#numOfChips += bet;
            this.#chipsToCash(this.#numOfChips);
            return;
        }

        get moola() {
            return this.#moola;
        }

        get chips() {
            return this.#numOfChips;
        }

        get chipsBet() {
            return this.#chipsBet;
        }

        set chipsBet(numChips) {
            this.#chipsBet = numChips;
            return;
        }

        // set moola(cash) {
        //     this.#moola = cash;
        // } // if allowing player to set amt ??
    }

    //
    class Player extends Hand {
        #plyrMoola = new Moola();

        constructor() {
            super();
        }

        _lossHand(bet) {
            return this.#plyrMoola._lossHand(bet);
        }

        _winHand(bet) {
            return this.#plyrMoola._winHand(bet);
        }

        get chips() {
            return this.#plyrMoola.chips;
        }

        get chipsBet() {
            return this.#plyrMoola.chipsBet;
        }

        get moola() {
            return this.#plyrMoola.moola;
        }

        set chipsBet(numChips) {
            this.#plyrMoola.chipsBet = numChips;
            return;
        }

        // set moola(cash) {
        //     this.#plyrMoola.moola = cash;
        // } // if allowing player to set amt ??
    }

    //
    class Dealer extends Hand {
        constructor() {
            super();
        }

        /**
         * add cards to dealer's hand while the hand value is less than 17
         * @returns void
         */
        _hitOrHold() {
            while (this.handVal < 17) {
                this.addCard();
            }
            return;
        }

        privateHand() {
            let [, ...hand] = this.currentHand;
            const upCards = hand.map(el => el.revealCard());
            return `** | ${upCards.join(' | ')}`;
        } // back to Hand if multiplayer
    }

    /*
     * Message Fxns
     */
    /**
     * prints message confirming that the player has wagered a number of chips (determined by the player) out of the number of chips they have remaining in their Moola
     * @param {string} plyr player name
     * @param {number} chips number of chips player is wagering
     * @returns void
     */
    const acceptedWagerMssg = (plyr, chips = 2) =>
        console.log(`
                You have wagered ${chips} of your ${plyr.chips} chips.`); // show cash value also??

    /**
     * prints game exit message
     * @returns void
     */
    const anotherTimeMssg = () =>
        console.log(`
                    Perhaps another time.`);

    /**
     * prints string asking player if they want to play another hand
     * @returns void
     */
    const askPlayAgain = () =>
        console.log(`
                    Would you like to play another hand?`);

    /**
     * prints the opening message:
     * • greeting,
     * • explanation of cash to chips,
     * • asks if player is ready to begin
     * @returns void
     */
    const askPlayBJ = () =>
        console.log(`

        ♣ ♠ ♦ ♥  BJ21  ♠ ♣ ♦ ♥
        Hello, friend. There is a $50 minimum wager per round at this table.
        When you're ready, I'll take your cash [starting with $10,000] and
        provide you with the equivalent as $25 chips.
        Are you ready to play BJ21?`);

    /**
     * prints:
     * • number of chips, & their value, player has remaining
     * • asks player how many chips they'd like to wager for the next hand
     * • informs player of the default wager of the table minimum of $50
     * @param {string} plyr player name
     * @returns void
     */
    const askWager = plyr =>
        console.log(`
                    You have ${
                        plyr.chips
                    } $25 chips with a value of $${plyr.moola.toLocaleString()}.
                    How many chips would you like to wager? (numerical value only)
                    [Note: You may proceed without entering a value to
                    automatically wager the table minimum ($50)].`);

    /**
     * prints:
     * • dealer's cards & hand value,
     * • player's cards & hand value,
     * • handsComp()
     * @param {string} plyr
     * @param {string} dealer
     * @returns void
     */
    const handResultsMssg = (plyr, dealer) =>
        console.log(`
                        The dealer's cards are:
                        ${dealer.showHand()}
                        The value of the dealer's hand is ${dealer.handVal}.

                        Your cards are:
                        ${plyr.showHand()}
                        The value of your hand is ${plyr.handVal}.
                        
                        ${handsComp(plyr, dealer, plyr.chipsBet)}`);

    /**
     * via printing, informs player of an invalid input
     * @returns void
     */
    const invalidInput = () =>
        console.error(`
            
        WHOA! Might wanna slow down on the drinks, friend. Starting to slur your answers. Try answering again.`);

    /**
     * prints:
     * • dealer's cards
     * • player's cards & their value
     * @param {string} player player name
     * @param {string} dealer dealer name
     * @returns void
     */
    const printHandsPreReveal = (player, dealer) =>
        console.log(`
                            The dealer's cards are:
                            ${dealer.privateHand()}
    
                            Your cards are:
                            ${player.showHand()}
                            The value of your hand is ${player.handVal}.
                                `);

    /**
     * player tied with dealer message
     * @returns {string} string
     */
    const tiedMssg = () => `
                        Draw. Nothing lost; nothing gained.`; // aka push

    /**
     * player defeat message
     * @returns {string} defeat message
     */
    const youLostMssg = () => `
                        You've lost this hand........`;

    /**
     * player victory message
     * @returns {string} victory message
     */
    const youWonMssg = () => `
                        You won!!!!!!!!!!!`;

    /*
     * Prompt Fxns
     */
    /**
     * checks if the player has moola; if so, asks if player wants to play another round [askPlayAgain()] & provides the prompt [playAgainSwitch()]; if not, informs player there is no moola left
     * @param {string} plyr - the player
     * @param {string} dealer - the dealer
     * @returns void
     */
    const checkMoolaToPlay = (plyr, dealer) => {
        if (plyr.moola) {
            askPlayAgain();
            playAgainSwitch(plyr, dealer);
            // yes ? check if "enough" cards in deck to play another hand or if have to reshuffle
        } else {
            console.log(`
                Seems you've no coin to wager, friend.`);
        }
        return;
    };

    /**
     * prompts player to enter numerical value for number of chips to be wagered; includes acceptedWagerMssg(); also handles invalid input
     * @param {string} plyr player name
     * @returns void
     */
    const chipsPromptFxn = plyr => {
        let chips = prompt(`
                number of chips >> `).trim();
        if (+chips % 1 === 0) {
            if (+chips <= plyr.chips && +chips > 1) {
                plyr.chipsBet = +chips;
                testPlyrChips = plyr.chipsBet;
                acceptedWagerMssg(plyr, chips);
            } else if (+chips > plyr.chips) {
                invalidInput();
                console.error(`
                You know you can't bet more than you have at this table.
                Take your time.`);
                askWager(plyr);
                chipsPromptFxn(plyr);
            } else if (chips === '') {
                plyr.chipsBet = 2;
                acceptedWagerMssg(plyr);
            } else if (+chips === 1) {
                // just for fun if someone checks  - easter egg
                invalidInput();
                console.error(`
            ♣ ♠ ♦ ♥  BJ21  ♠ ♣ ♦ ♥
            That's below the table minimum, pal.
            We'll round it up to the minimum on this hand for you.
            Free of charge.
            ♣ ♠ ♦ ♥  BJ21  ♠ ♣ ♦ ♥`);
                plyr.chipsBet = 2;
                acceptedWagerMssg(plyr);
            } else if (+chips === 0) {
                // just for fun if someone checks  - easter egg
                invalidInput();
                console.error(`
            ♥ ♦ ♣ ♠  BJ21  ♥ ♦ ♣ ♠
            Not gonna happen, my friend.
            We'll round it up to the minimum on this hand for you.
            Free of charge.
            ♥ ♦ ♣ ♠  BJ21  ♥ ♦ ♣ ♠`);
                plyr.chipsBet = 2;
                acceptedWagerMssg(plyr);
            } else {
                console.error(`
                Enter the numerical value of the amount of chips you'd like to wager,
                or leave it blank & press the Enter key to wager the table minimum.
                Negative values are definitely not an option.`);
                askWager(plyr);
                chipsPromptFxn(plyr);
            }
        } else {
            invalidInput();
            console.error(`
                Enter the numerical value of the amount of chips you'd like to wager,
                or leave it blank & press the Enter key to wager the table minimum.`);
            askWager(plyr);
            chipsPromptFxn(plyr);
        }
        return;
    };

    /**
     * provides prompt for askPlayAgain();
     * evaluates prompt response with switch statement
     * @param {string} plyr player name
     * @param {string} dealer dealer name
     * @returns void
     */
    const playAgainSwitch = (plyr, dealer) => {
        let playAgainPrompt = ynPrompt();

        switch (playAgainPrompt) {
            case 'y':
                playHand(plyr, dealer);
                break;
            case 'n':
                anotherTimeMssg();
                break;
            default:
                invalidInput();
                askPlayAgain();
                playAgainSwitch(plyr, dealer);
        }
        return;
    };

    /**
     * majority of game logic
     *  --> improve this fxn description l8r !!
     * @param {string} plyr player name
     * @param {string} dealer dealer name
     * @returns void
     */
    const playHand = (plyr, dealer) => {
        if (dealer.handVal) {
            plyr.resetHand();
            dealer.resetHand();
        }
        askWager(plyr);
        chipsPromptFxn(plyr);
        dealCards(plyr, dealer);
        //  Playing While Loop
        let playing = true;
        while (playing) {
            printHandsPreReveal(plyr, dealer);

            if (plyr.handVal > 21) {
                playing = false;
                console.log(youLostMssg());
                plyr._lossHand(plyr.chipsBet);

                // show moola

                checkMoolaToPlay(plyr, dealer);
            } else if (plyr.handVal == 21) {
                playing = false;
                dealer._hitOrHold();
                handResultsMssg(plyr, dealer);

                // swap out of this for more plyr autonomy ??

                checkMoolaToPlay(plyr, dealer);
                // yes ? check if "enough" cards in deck to play another hand or if have to reshuffle
            } else {
                console.log(`
                        Would you like another card?`);
                let hitOrHold = ynPrompt();
                switch (hitOrHold) {
                    case 'y':
                        plyr.addCard();
                        break;
                    case 'n':
                        dealer._hitOrHold();
                        handResultsMssg(plyr, dealer);
                        // show moola

                        playing = false;
                        checkMoolaToPlay(plyr, dealer);
                        break;
                    default:
                        invalidInput();
                }
            }
        }
        return;
    };

    /**
     * follows a printed question; prompts user for a y (yes) or n (no) response to the question that precedes it
     * @returns string
     */
    const ynPrompt = () =>
        prompt(`
                (y/n) >> `)
            .trim()
            .toLowerCase();

    /*
     * OTHER FXNS
     */

    /**
     * deal cards alternating between player & dealer
     * @param {string} plyr - player name
     * @param {string} dealer - dealer name
     * @returns void
     */
    const dealCards = (plyr, dealer) => {
        plyr.currentHand.push(new Card());
        dealer.currentHand.push(new Card());
        plyr.currentHand.push(new Card());
        dealer.currentHand.push(new Card());
        return;
    };

    /**
     * compares player's hand with dealer's hand; moves moolah based on result of the comparison; tells player the result
     * @param {string} player - player name
     * @param {string} dealer - dealer name
     * @param {number} bet - pulled from player class
     * @returns {string} hand results mssg
     */
    const handsComp = (player, dealer, bet) => {
        if (player.handVal > dealer.handVal || dealer.handVal > 21) {
            player._winHand(bet);
            return youWonMssg();
        } else if (player.handVal < dealer.handVal) {
            player._lossHand(bet);
            return youLostMssg();
        } else {
            return tiedMssg(); // tie/push
        }
    };

    /*
     * Game Flow
     */
    askPlayBJ();
    let newTable = ynPrompt();
    if (newTable === 'y') {
        const deck1 = new Deck();
        const plyr1 = new Player(); // sub var for player name retrieved from prompt ??
        const theDealer = new Dealer();
        // Deal New Hand
        playHand(plyr1, theDealer);
    } else if (newTable === 'n') {
        anotherTimeMssg();
    } else {
        invalidInput();
        initBJ();
    }
    console.log(shuffledDeck?.length);
    return;
};
initBJ();

/**
 * HONEY DO
 *
 * look into removing some code now that the new handVal for multi aces is made
 *
 * reread about #decks
 * --> dealer's shoe ??
 *      --> 4, 6, or 8 decks
 * --> already dealing, in this program, as if using single- or double-decks
 *      --> for double decks, do decks get shuffled together as one ??
 *
 * allow player to play more than one hand/rd ??
 * --> a wager is made/hand each rd
 *      --> req minimum wager of 2x table minimum / hand / rd
 * incorporate split for 2ofKind hand
 * --> 2 plyr hands
 * --> wager/hand
 * --> prompt option for split when 2ofKind
 *
 * allow chip exchange ??
 * allow player to enter cash amt to exchange for chips ??
 * --> if so, change launch mssg
 *
 *  if bulding rules,
 * --> explain shown cards format
 *      --> what S, C, H, & D are in printed cards
 *      --> explain why the 1st dealer card is face down
 *
 * REMEMBER to make fields/methods private (maybe)
 * use modules
 * use typescript
 *
 * when plyr & dealer hold:
 * --> print winner, how they won, amt moola transferred, moola balance
 * print moola after win/loss !!
 *
 * remove recursion w/ while loop ??
 *
 * look into cleaning up moola transfers
 *
 * add fxn documentation
 * --> look into the standard
 *
 * increase table minimum bet ??
 *
 * check if enough cards in shuffledDeck to play another rd
 *
 */
// request player name ?? - indicate no special chars (add message apologizing for not currently allowing special chars) ?? - verify chars entered
// request moola amt || set automatic moola amt
