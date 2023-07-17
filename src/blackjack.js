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
    // constructor to accept card suit and value -- ?? why?

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

    showHand() {
        return this.currentHand.map(card => card.revealCard()).join(' | ');
    }

    #handValFxn() {
        return this.currentHand.reduce((sum, card) => (sum += card.value), 0);
    }

    addCard() {
        this.currentHand.push(new Card());
        return;
    }

    resetHand() {
        this.currentHand = [];
        return;
    }

    get handVal() {
        return this.#handValFxn();
    }
}

//
class Moola {
    #moola = 10_000;

    constructor() {}

    get moola() {
        return this.#moola;
    }
} // able to increase bet position before card reveal ?? - see site how2play
// whole num bets only

//
class Player extends Hand {
    #plyrMoola = new Moola();

    constructor() {
        super();
    }

    get moola() {
        return this.#plyrMoola.moola;
    }
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
    Are you ready to play BJ?`);

    const invalidInput = () =>
        console.error(`
        WHOA! Might wanna slow down on the drinks, friend. Starting to slur your answers. Try answering again.`);

    const anotherTimeMssg = () =>
        console.log(`
                    Perhaps another time.`);

    askPlayBJ();
    let newTable = ynPrompt();
    if (newTable === 'y') {
        // request player name ?? - indicate no special chars (add message apologizing for not currently allowing special chars) ?? - verify chars entered
        // request moola amt || set automatic moola amt

        const deck1 = new Deck();

        /*
         * Gaming Fxns
         */

        const askPlayAgain = () =>
            console.log(`
                        Would you like to play another hand?`);

        const youWon = () => `
                            You won!!!!!!!!!!!`;

        const youLost = () => `
                            You've lost this hand........`;

        const tiedMssg = () => `
                            Draw. Nothing lost; nothing gained.`;

        const printHandsPreReveal = (player, dealer) =>
            console.log(`
                            The dealer's cards are:
                            ${dealer.privateHand()}
    
                            Your cards are:
                            ${player.showHand()}
                            The value of your hand is ${player.handVal}.
                            `);

        const handsComp = (player, dealer) =>
            player.handVal > dealer.handVal
                ? youWon()
                : player.handVal < dealer.handVal
                ? youLost()
                : tiedMssg(); // tie = wager returned

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
        };

        const dealCards = (plyr, dealer) => {
            plyr.currentHand.push(new Card());
            dealer.currentHand.push(new Card());
            plyr.currentHand.push(new Card());
            dealer.currentHand.push(new Card());
            return;
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

            // wager before dealing
            // table minimum
            // tie = wager returned

            dealCards(plyr1, dealer);

            /*
             * Playing While Loop
             */
            let playing = true;
            while (playing) {
                printHandsPreReveal(plyr1, dealer);

                if (plyr1.handVal == 21) {
                    playing = false;
                    console.log(youWon()); // unless tied - CHANGE TO CHECK DEALER'S HAND FIRST; ALLOW DEALER LOGIC
                    // add rest of winning mssg
                    // yes ? check if "enough" cards in deck to play another hand or if have to reshuffle

                    //add wager to moola

                    askPlayAgain();
                    playAgainSwitch(); // double check this works - w/ default
                    // - include wager ?? see rules from link
                    //      --> can't wager more than stash of moola
                } else if (plyr1.handVal > 21) {
                    playing = false;
                    console.log(youLost());
                    // subtract wager from moola

                    // IF moola > 0, prompt to play another hand - include wager ?? see rules from link
                    if (plyr1.moola) {
                        askPlayAgain();
                        playAgainSwitch();
                    } else {
                        console.log(`
                            Seems you've no coin to wager, friend.`);
                    }
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
                            
                            ${handsComp(plyr1, dealer)}`);

                            // move moola

                            playing = false;
                            askPlayAgain();
                            playAgainSwitch();
                            break;
                        default:
                            invalidInput();
                    }
                }
            }
            console.log(plyr1.moola); // prints 2x; move ??

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
 *
 * incorporate split for 2ofKind hand
 * --> 2 plyr hands
 * --> wager/hand
 * --> prompt option for split when 2ofKind
 *
 * for Ace, use typeof?? & calculate handVal - if max less than 21, apply max, otherwise apply min
 *  if bulding rules,
 * --> explain shown cards format
 *      --> what S, C, H, & D are in printed cards
 *      --> explain why the 1st dealer card is face down
 * REMEMBER to make fields/methods private (maybe)
 * use modules
 * use typescript
 * separate prompts into fxns ??
 *
 * based on "face up" value of player hand && dealer handVal relative to 21, dealer decides hitOrHold ??
 * --> have dealer be more conservative/aggro at random ??
 * "show" both face down cards when both player & dealer decide to hold
 * --> transfer moola accordingly
 * --> print winner, how they won, amt moola transferred, moola balance
 * --> prompt to play another hand if moola != 0
 */
