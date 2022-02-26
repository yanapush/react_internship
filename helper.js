function getRandomColor() {
    const letters = 'BCDEF'.split('');
    let color = '#';

    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }

    return color;
}

function getRandomSentence(length) {
    const words = ["The sky", "above", "the port", "was", "the color of television", "tuned", "to", "a dead channel", ".", "All", "this happened", "more or less", ".", "I", "had", "the story", "bit by bit", "from various people", "and", "as generally", "happens", "in such cases", "each time", "it", "was", "a different story", ".", "It", "was", "a pleasure", "to", "burn"];

    let sentence = "";

    for (let i = 0; i < length; i++) {
        sentence = `${sentence} ${words[Math.floor(Math.random() * words.length)]}`;
    }

    return sentence;
}
