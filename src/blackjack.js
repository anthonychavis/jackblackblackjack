// create prompting fxn & allow users to exit the program
const prompt = require('prompt-sync')({ sigint: true });

// have a card - CLASS
// deck of 52 cards - CLASS
// deck should be shuffled
// deal the cards from deck
// players should have a hand of dealt cards
// players need money
// players need to bet money
// track money transfer - win/loss amounts
// implement rules for blackjack

class Card {
    // constructor to accept card suit and value
    // constructor to return string representation of card
    constructor({ face, suit, value }) {
        this.face = face;
        this.suit = suit;
        this.value = value;
    }
}

class Deck {
    deck = [];
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
        // {face: ##, suit: ##, value##}
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
        this.deckGen();

        // Durstenfeld shuffle
        for (let i = this.deck.length - 1; i > 0; i--) {
            const ranNum = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[ranNum]] = [
                this.deck[ranNum],
                this.deck[i],
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

class Player {
    constructor() {}
}

const deck1 = new Deck();
console.log(deck1.deck);
console.log(deck1.deck.length);

const plyr1 = new Player();
const dealer = new Player(); // maybe extend a Dealer class from Player class

/**
 * player - CLASS ??
 * maybe start w/ one player + dealer to get it going, then go back & make multiplayer ??
 *
 */
