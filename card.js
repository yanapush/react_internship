class Card {
    constructor() {
        this.id = Card.id_counter++;
        this.text = getRandomSentence(Math.random() * 7);
    }
    static id_counter = 0;
}

