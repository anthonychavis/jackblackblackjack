// create prompting fxn & allow users to exit the program
const prompt = require('prompt-sync')({ sigint: true });

// have a card - CLASS (why have card class ??)
// deal the cards from deck
// players should have a hand of dealt cards
// players need money
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
class Card {
    // constructor to accept card suit and value -- ?? why?
    // constructor to return string representation of card - ?? WHAT ?

    #topCard;
    #value;

    constructor() {
        this.revealCard();
    }

    #dealTopCard() {
        this.#topCard = shuffledDeck.pop();
        this.#value = this.#topCard.value;
        return;
    }

    revealCard() {
        this.#dealTopCard();
        return this.#topCard.face + this.#topCard.suit[0].toUpperCase();
    }

    get value() {
        return this.#value;
    } // needed?
}

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

    // constructor creates deck of cards, using card class?? [nope]
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

class Hand {
    // initiate hand - acct for dealer
    // a reset class fxns (maybe??)
    constructor() {}
}

class Moola {
    // play until some player loses all money
    constructor() {}
}

// class Player {
//     #moolaBalance

//     constructor() {
//         this.#moolaBalance = new Moola()
//     }
// }

const deck1 = new Deck();
// console.log(shuffledDeck);
console.log(shuffledDeck.length);

const aCard = new Card();
// console.log(aCard);
console.log(aCard.value);
console.log(shuffledDeck.length);

// console.log(

// const plyr1 = new Player();
// const dealer = new Player(); // maybe extend a Dealer class from Player class

/**
 * player - CLASS ??
 * REMEMBER to make classes/methods private (maybe)
 */
