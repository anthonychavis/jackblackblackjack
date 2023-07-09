// create prompting fxn & allow users to exit the program
const prompt = require('prompt-sync')({ sigint: true });

// have a card - CLASS
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
// class Hand {
//     // initiate hand - acct for dealer
//     // a reset of the class fxns (maybe??)

//     allCards = [];

//     constructor() {}
// }

//
class Moola {
    // play until some player loses all money
    constructor() {}
}

//
class Player {
    #moolaBalance = new Moola(); // dealer doesn't need moola. so, separate this - Player extends to something & dealer Class || something extends to Player & dealer Class ??
    currentHand = []; // put into hand Class

    constructor() {
        // this.currentHand = new Hand();
    }

    showHand() {
        return this.currentHand.map(card => card.revealCard()).join(' | ');
    } // could go to Hand Class ?? probably

    privateHand() {
        let [, ...hand] = this.currentHand;
        const upCards = hand.map(el => el.revealCard());
        return `** | ${upCards.join(' | ')}`;
    } // could go to Hand Class ?? probably

    handVal() {
        return this.currentHand.reduce((sum, card) => (sum += card.value), 0);
    }
}

// console.log(

const initBJ = () => {
    console.log(`
                        Are you ready to play BJ?`);
    let newTable = prompt(`
                        (y/n) >> `);

    if (newTable.toLowerCase() === 'y') {
        // request player name ?? - indicate no special chars (add message apologizing for not currently allowing special chars) ?? - verify chars entered
        // request moola amt || set automatic moola amt

        const deck1 = new Deck();
        // console.log(shuffledDeck);
        // console.log(shuffledDeck.length);

        // const aCard = new Card();
        // console.log(aCard.value);
        // console.log(shuffledDeck.length);

        // const initPlayers = () => {};

        const dealCards = (plyr, dealer) => {
            plyr.currentHand.push(new Card());
            dealer.currentHand.push(new Card());
            plyr.currentHand.push(new Card());
            dealer.currentHand.push(new Card());
        }; // don't technically need to deal one card@time, but dont need to do this irl either. so, keepin it the same. if performance would suffer, could snatch last two cards in shuffled arr/"person" at once to improve

        // instantiate players
        const plyr1 = new Player(); // sub var for player name retrieved from prompt?
        const dealer = new Player(); // maybe extend a Dealer class from Player class

        // deal cards to players
        dealCards(plyr1, dealer);

        // use string interpolation for easier understanding (ux)
        // show hand of player + value & dealer (1 card face down)
        // consider showing how far from 21 the hand val is ??
        console.log(`
                            The dealers cards are:
                            ${dealer.privateHand()}

                            Your cards are:
                            ${plyr1.showHand()}
                            The value of your hand is ${plyr1.handVal()}.
                            `);

        if (plyr1.handVal() == 21) {
            console.log(`You won!`);
            // add rest of winning mssg
            // prompt to play another hand
            // yes ? check if "enough" cards in deck to play another hand or if have to reshuffle
        }

        console.log(`
                            Would you like another card?`);
        let hitOrHold = prompt(`
                            (y/n) >> `);

        // want card ? fxn[give card & replay previous console.log & prompt hitorhold again] & end if went over: run dealer hand logic, end if went over & dealer.showHand
        // add message about invalid entry ??
    } else {
        console.log('Perhaps another time.');
    } // add prompt indicating that the reply should be Y or N if it wasn't
};

initBJ();

console.log(shuffledDeck?.length); // optional chain b/c moved globals into initBJ

/**
 * for Ace, use typeof?? & calculate handVal - if max less than 21, apply max, otherwise apply min
 *  if bulding rules, explain why the 1st dealer card is face down
 * player - CLASS ??
 * methods of Hand CLASS for showFullHand (always for player & only at end of round for dealer) & initDealerHandShow (for when one card is face down) ??
 * REMEMBER to make fields/methods private (maybe)
 * use modules
 * use typescript
 * separate prompts into fxns ??
 * fix extra prompt/key !! [FIXED]
 *
 * based on "face up" value of player hand && dealer handVal relative to 21, dealer decides hitOrHold ??
 * --> have dealer be more conservative/aggro at random ??
 * "show" both face down cards when both player & dealer decide to hold
 * --> determine winner
 * --> transfer moola accordingly
 * --> print winner, how they won, amt moola transferred, moola balance
 * --> prompt to play another hand if moola != 0
 */
