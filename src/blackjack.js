// create prompting fxn & allow users to exit the program
const prompt = require('prompt-sync')({ sigint: true });

/*
 * GLOBAL VARS (for now)
 */
// let deck = [];
let shuffledDeck;

/*
 * CLASSES
 */
//
class Card {
    #topCard;
    #value;

    constructor() {
        this.#dealTopCard();
        // this.revealCard();
    }

    #dealTopCard() {
        this.#topCard = shuffledDeck.pop();
        this.#value = this.#topCard.value;
        return;
    }

    revealCard() {
        // this.#dealTopCard();
        return this.#topCard.face + this.#topCard.suit[0].toUpperCase();
    }

    get value() {
        return this.#value;
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
        // {face: ##, suit: ##, value: ##}
        let cardObj;

        for (let suit of this.suits) {
            for (let i = 1; i < 14; i++) {
                cardObj = {
                    face: (this.strCardsFace[i] || i) + '',
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

    #aceInHandCalc(index = 0) {
        return this.currentHand.reduce((sum, card) => {
            let cardVal;
            isNaN(card.value)
                ? (cardVal = card.value[index])
                : (cardVal = card.value);
            return (sum += cardVal);
        }, 0);
    }

    #handValFxn() {
        const checkForAce = this.currentHand.some(card => isNaN(card.value));
        if (checkForAce) {
            const highAce = this.#aceInHandCalc(1);
            return highAce <= 21 ? highAce : this.#aceInHandCalc();
        } else {
            return this.currentHand.reduce(
                (sum, card) => (sum += card.value),
                0
            );
        }
    } // fix for multiple aces in hand !??!

    resetHand() {
        this.currentHand = [];
        return;
    }

    showHand() {
        return this.currentHand.map(card => card.revealCard()).join(' | ');
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

    privateHand() {
        let [, ...hand] = this.currentHand;
        const upCards = hand.map(el => el.revealCard());
        return `** | ${upCards.join(' | ')}`;
    } // back to Hand if multiplayer
}

//
const initBJ = () => {
    const ynPrompt = () =>
        prompt(`
                (y/n) >> `)
            .trim()
            .toLowerCase();

    const askPlayBJ = () =>
        console.log(`
        
        ♣ ♠ ♦ ♥  BJ21  ♠ ♣ ♦ ♥
        Hello, friend. There is a $50 minimum wager per round at this table.
        When you're ready, I'll take your cash [starting with $10000] and
        provide you with the equivalent as $25 chips.
        Are you ready to play BJ21?`);

    const invalidInput = () =>
        console.error(`

        WHOA! Might wanna slow down on the drinks, friend. Starting to slur your answers. Try answering again.`);

    const anotherTimeMssg = () =>
        console.log(`
                    Perhaps another time.`);

    askPlayBJ();
    let newTable = ynPrompt();
    if (newTable === 'y') {
        const deck1 = new Deck();

        /*
         * Message Fxns
         */
        const acceptedWagerMssg = (chips = 2) =>
            console.log(`
                    You have wagered ${chips} of your ${plyr1.chips} chips.`);

        const askPlayAgain = () =>
            console.log(`
                        Would you like to play another hand?`);

        const askWager = () =>
            console.log(`
                        You have ${plyr1.chips} $25 chips with a value of $${plyr1.moola}.
                        How many chips would you like to wager? (numerical value only)
                        [Note: You may proceed without entering a value to
                        automatically wager the table minimum ($50)].`);

        const printHandsPreReveal = (player, dealer) =>
            console.log(`
                                The dealer's cards are:
                                ${dealer.privateHand()}
        
                                Your cards are:
                                ${player.showHand()}
                                The value of your hand is ${player.handVal}.
                                    `);

        const tiedMssg = () => `
                            Draw. Nothing lost; nothing gained.`; // aka push

        const youLostMssg = () => `
                            You've lost this hand........`;

        const youWonMssg = () => `
                            You won!!!!!!!!!!!`;

        /*
         * Prompt Fxns
         */
        const chipsPromptFxn = () => {
            let chips = prompt(`
                    number of chips >> `).trim();
            if (+chips % 1 === 0) {
                if (+chips <= plyr1.chips && +chips > 1) {
                    plyr1.chipsBet = +chips;
                    testPlyrChips = plyr1.chipsBet;
                    acceptedWagerMssg(chips);
                } else if (+chips > plyr1.chips) {
                    invalidInput();
                    console.error(`
                    You know you can't bet more than you have at this table.
                    Take your time.`);
                    askWager();
                    chipsPromptFxn();
                } else if (chips === '') {
                    plyr1.chipsBet = 2;
                    acceptedWagerMssg();
                } else if (+chips === 1) {
                    // just for fun if someone checks  - easter egg
                    invalidInput();
                    console.error(`
                ♣ ♠ ♦ ♥  BJ21  ♠ ♣ ♦ ♥
                That's below the table minimum, pal.
                We'll round it up to the minimum on this hand for you.
                Free of charge.
                ♣ ♠ ♦ ♥  BJ21  ♠ ♣ ♦ ♥`);
                    plyr1.chipsBet = 2;
                    acceptedWagerMssg();
                } else if (+chips === 0) {
                    // just for fun if someone checks  - easter egg
                    invalidInput();
                    console.error(`
                ♥ ♦ ♣ ♠  BJ21  ♥ ♦ ♣ ♠
                Not gonna happen, my friend.
                We'll round it up to the minimum on this hand for you.
                Free of charge.
                ♥ ♦ ♣ ♠  BJ21  ♥ ♦ ♣ ♠`);
                    plyr1.chipsBet = 2;
                    acceptedWagerMssg();
                } else {
                    console.error(`
                    Enter the numerical value of the amount of chips you'd like to wager,
                    or leave it blank & press the Enter key to wager the table minimum.
                    Negative values are definitely not an option.`);
                    askWager();
                    chipsPromptFxn();
                }
            } else {
                invalidInput();
                console.error(`
                    Enter the numerical value of the amount of chips you'd like to wager,
                    or leave it blank & press the Enter key to wager the table minimum.`);
                askWager();
                chipsPromptFxn();
            }
            return;
        };

        const playAgainSwitch = () => {
            let playAgainPrompt = ynPrompt();

            switch (playAgainPrompt) {
                case 'y':
                    playHand();
                    break;
                case 'n':
                    anotherTimeMssg();
                    break;
                default:
                    invalidInput();
                    askPlayAgain();
                    playAgainSwitch();
            }
            return;
        };

        /**
         * checks if the player has moola; if so, asks if player wants to play another round [askPlayAgain()] & provides the prompt [playAgainSwitch()]; if not, informs player there is no moola left
         * @returns void
         */
        const checkMoolaToPlay = () => {
            if (plyr1.moola) {
                askPlayAgain();
                playAgainSwitch();
                // yes ? check if "enough" cards in deck to play another hand or if have to reshuffle
            } else {
                console.log(`
                    Seems you've no coin to wager, friend.`);
            }
            return;
        };

        /**
         * deal cards alternating between player & dealer
         * @param {*} plyr - string; the player
         * @param {*} dealer - string; the dealer
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
         * @param {*} player - string; player name
         * @param {*} dealer - string; dealer name
         * @param {*} bet - number; pulled from player class
         * @returns string; hand results mssg
         */
        const handsComp = (player, dealer, bet) => {
            if (player.handVal > dealer.handVal) {
                player._winHand(bet);
                return youWonMssg();
            } else if (player.handVal < dealer.handVal) {
                player._lossHand(bet);
                return youLostMssg();
            } else {
                return tiedMssg(); // tie/push = wager returned
            }
        };

        /*
         * Instantiate Players
         */
        const plyr1 = new Player(); // sub var for player name retrieved from prompt ??
        const dealer = new Dealer();

        /*
         * Deal New Hand
         */
        const playHand = () => {
            if (dealer.handVal) {
                plyr1.resetHand();
                dealer.resetHand();
            }

            askWager();
            chipsPromptFxn();

            // show number of chips bet w/ their value & number of chips left in stash w/ their value
            // tie/push = wager returned

            dealCards(plyr1, dealer);

            /*
             * Playing While Loop
             */
            let playing = true;
            while (playing) {
                printHandsPreReveal(plyr1, dealer);

                if (plyr1.handVal > 21) {
                    playing = false;
                    console.log(youLostMssg());
                    // subtract wager from moola
                    plyr1._lossHand(plyr1.chipsBet);

                    // show moola

                    checkMoolaToPlay();
                } else if (plyr1.handVal == 21) {
                    playing = false;
                    console.log(youWonMssg()); // unless tied/push - CHANGE TO CHECK DEALER'S HAND FIRST; ALLOW DEALER LOGIC
                    // add rest of winning mssg
                    // swap out of this for more plyr autonomy ??

                    //add wager to moola
                    plyr1._winHand(plyr1.chipsBet);

                    askPlayAgain();
                    playAgainSwitch(); // double check this works - w/ default
                    // yes ? check if "enough" cards in deck to play another hand or if have to reshuffle
                } else {
                    console.log(`
                            Would you like another card?`);
                    let hitOrHold = ynPrompt();
                    switch (hitOrHold) {
                        case 'y':
                            plyr1.addCard();
                            break;
                        case 'n':
                            // add the dealer hitOrHold logic -- add logic to show loss as soon as over 21 -- see below

                            console.log(`
                            The dealer's cards are:
                            ${dealer.showHand()}
                            The value of the dealer's hand is ${dealer.handVal}.

                            Your cards are:
                            ${plyr1.showHand()}
                            The value of your hand is ${plyr1.handVal}.
                            
                            ${handsComp(plyr1, dealer, plyr1.chipsBet)}`);

                            // show moola

                            playing = false;
                            checkMoolaToPlay();
                            break;
                        default:
                            invalidInput();
                    }
                }
            }
            return;
        };
        playHand();
    } else if (newTable === 'n') {
        anotherTimeMssg();
    } else {
        invalidInput();
        initBJ();
    }
    return;
};

initBJ();

console.log(shuffledDeck?.length); // optional chain b/c moved globals into initBJ

/**
 * dealer to stand if >16
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
 *
 * allow chip exchange ??
 * allow player to enter cash amt to exchange for chips ??
 * --> if so, change launch mssg
 *
 * incorporate split for 2ofKind hand
 * --> 2 plyr hands
 * --> wager/hand
 * --> prompt option for split when 2ofKind
 *
 * for Ace, use typeof?? & calculate handVal - if max less than 21, apply max, otherwise apply min
 *
 *  if bulding rules,
 * --> explain shown cards format
 *      --> what S, C, H, & D are in printed cards
 *      --> explain why the 1st dealer card is face down
 *
 * REMEMBER to make fields/methods private (maybe)
 * use modules
 * use typescript
 * separate prompts into fxns ??
 *
 * based on "face up" value of player hand && dealer handVal relative to 21, dealer decides hitOrHold ?? [no, stick to rules on site]
 * --> have dealer be more conservative/aggro at random ?? [no, stick to rules on site]
 *
 * "show" both face down cards when both player & dealer decide to hold
 * --> transfer moola accordingly
 * --> print winner, how they won, amt moola transferred, moola balance
 * --> prompt to play another hand if moola != 0
 *
 * remove recursion w/ while loop ??
 *
 * look into cleaning up  moola transfers
 *
 * print moola after win/loss !!
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
