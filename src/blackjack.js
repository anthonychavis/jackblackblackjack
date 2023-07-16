// create prompting fxn & allow users to exit the program
const prompt = require('prompt-sync')({ sigint: true });

// players need to bet money
// track money transfer - win/loss amounts
// implement rules for blackjack

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

    // constructor creates deck of cards, using card class ?? [nope]
    // shuffle deck
    // deal cards to players - from here ??
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
    // a reset of the class fxns (maybe??)

    // allCards = []; // what was this for ??
    currentHand = [];

    constructor() {}

    showHand() {
        return this.currentHand.map(card => card.revealCard()).join(' | ');
    }

    handVal() {
        return this.currentHand.reduce((sum, card) => (sum += card.value), 0);
    }

    addCard() {
        this.currentHand.push(new Card());
        return;
    }

    resetHand() {
        return (this.currentHand = []);
    }
}

//
class Moola {
    #moola = 10_000;

    // play until some player loses all money
    constructor() {}

    get moola() {
        return this.#moola;
    }
}

//
class Player extends Hand {
    #plyrMoola = new Moola(); // dealer doesn't need moola. so, separate this - Player extends Hand, Dealer extends Hand
    // currentHand = []; // put into hand Class

    constructor() {
        // this.currentHand = new Hand();
        super();
    }

    get moola() {
        return this.#plyrMoola.moola;
    }
}

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

const initBJ = () => {
    const ynPrompt = () =>
        prompt(`
    (y/n) >> `)
            .trim()
            .toLowerCase();

    console.log(`
    Are you ready to play BJ?`);
    let newTable = ynPrompt();

    if (newTable === 'y') {
        // request player name ?? - indicate no special chars (add message apologizing for not currently allowing special chars) ?? - verify chars entered
        // request moola amt || set automatic moola amt

        const deck1 = new Deck();

        const invalidInput = () =>
            console.error(`
        Whoa! Might wanna slow down on the drinks, friend. Starting to slur your answers. Try answering again.`);

        const anotherTimeMssg = () =>
            console.log(`
                            Perhaps another time.`);

        const askPlayAgain = () =>
            console.log(`
                        Would you like to play another hand?`);

        const printHandsPreReveal = (player, dealer) =>
            console.log(`
                            The dealer's cards are:
                            ${dealer.privateHand()}
    
                            Your cards are:
                            ${player.showHand()}
                            The value of your hand is ${player.handVal()}.
                            `);

        const dealCards = (plyr, dealer) => {
            plyr.currentHand.push(new Card());
            dealer.currentHand.push(new Card());
            plyr.currentHand.push(new Card());
            dealer.currentHand.push(new Card());
            return;
        }; // don't technically need to deal one card@time, but dont need to do this irl either. so, keepin it the same. if performance would suffer, could snatch last two cards in shuffled arr/"person" at once to improve

        // instantiate players
        const plyr1 = new Player(); // sub var for player name retrieved from prompt?
        const dealer = new Dealer(); // maybe extend a Dealer class from Player class

        const playHand = () => {
            plyr1.resetHand();
            dealer.resetHand();

            // deal cards to players
            dealCards(plyr1, dealer);

            // /*
            // while loop to replace nested conditionals
            let playing = true;
            while (playing) {
                printHandsPreReveal(plyr1, dealer);

                if (plyr1.handVal() == 21) {
                    playing = false;

                    console.log(`
                            You won!`); // unless tied ?? - see rules from link
                    // add rest of winning mssg
                    // prompt to play another hand
                    // yes ? check if "enough" cards in deck to play another hand or if have to reshuffle

                    //add wager to moola

                    //
                    askPlayAgain();

                    // prompt to play another hand - include wager ?? see rules from link
                    //      --> can't wager more than stash of moola
                } else if (plyr1.handVal() > 21) {
                    playing = false;

                    console.log(`
                            You've lost this hand.`);

                    // subtract wager from moola

                    // reset hand
                    plyr1.resetHand();
                    dealer.resetHand();

                    // IF moola > 0, prompt to play another hand - include wager ?? see rules from link
                    if (plyr1.moola) {
                        askPlayAgain();
                        let playAgainPrompt = ynPrompt();

                        switch (playAgainPrompt) {
                            case 'y':
                                playHand();
                                break;
                            case 'n':
                                anotherTimeMssg();
                                break;
                            default:
                                invalidInput(); // finish this default
                        }
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
                            // anotherTimeMssg();
                            // playing = false;
                            askPlayAgain();
                            let handOrDone = ynPrompt();

                            switch (handOrDone) {
                                case 'y':
                                    playHand();
                                    break;
                                case 'n':
                                    anotherTimeMssg();
                                    playing = false;
                                    break;
                                default:
                                    invalidInput(); // finish this default
                            }
                            break;
                        default:
                            invalidInput(); // finish this default
                    }
                }
            }
            console.log(plyr1.moola);

            return;
        };
        playHand();
    }
    return;
};

initBJ();

console.log(shuffledDeck?.length); // optional chain b/c moved globals into initBJ

/**
 * for Ace, use typeof?? & calculate handVal - if max less than 21, apply max, otherwise apply min
 *  if bulding rules,
 * --> explain shown cards format
 *      --> what S, C, H, & D are in printed cards
 *      --> explain why the 1st dealer card is face down
 * player - CLASS ?? [probably]
 * methods of Hand CLASS for showFullHand (always for player & only at end of round for dealer) & initDealerHandShow (for when one card is face down) ??
 * REMEMBER to make fields/methods private (maybe)
 * use modules
 * use typescript
 * separate prompts into fxns ??
 * use while loop instead of nested conditionals ??
 *make sure the shuffledDeck decreases each hand
 *
 * based on "face up" value of player hand && dealer handVal relative to 21, dealer decides hitOrHold ??
 * --> have dealer be more conservative/aggro at random ??
 * "show" both face down cards when both player & dealer decide to hold
 * --> determine winner
 * --> transfer moola accordingly
 * --> print winner, how they won, amt moola transferred, moola balance
 * --> prompt to play another hand if moola != 0
 *
 * fix extra prompt/key !! [FIXED]
 */
