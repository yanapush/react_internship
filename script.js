
let cards = [new Card(), new Card(), new Card()];
let main_section = document.querySelector(".main");
let add_back_button = document.getElementById("add-back");
let add_front_button = document.getElementById("add-front");
let cards_nodes = new Map();
let shuffle_button = document.getElementById("shuffle-card")

function generateMap() {
    cards.forEach(card => {
        cards_nodes.set(card.id, getNode(card));
    })
}

function getNode(card) {
    let card_node = document.createElement('div');
    card_node.classList.add("main__card");
    const gradient = "linear-gradient(to bottom right, " + getRandomColor() + ", " + getRandomColor() + ")";
    let card_node_front = document.createElement('div');
    card_node_front.classList.add("main__card__side");
    card_node_front.classList.add("main__card__side--front");
    card_node_front.style.background = gradient

    let card_node_back = document.createElement('div');
    card_node_back.classList.add("main__card__side");
    card_node_back.classList.add( "main__card__side--back");
    card_node_back.style.background = gradient;
    card_node_back.appendChild(document.createTextNode(card.text));

    card_node.appendChild(card_node_back);
    card_node.appendChild(card_node_front);
    card_node.dataset.id = card.id;
    card_node.addEventListener("click", function() {
        flipCard(card_node);
    })
    return card_node;
}

function renderCards() {
    cards_nodes.forEach(value => {
        render(main_section, value);
    })
}

function render(root, node) {
    root.appendChild(node);
}

function flipCard(card) {
    let front_classList = card.getElementsByClassName("main__card__side--front")[0].classList;
    let back_classList = card.getElementsByClassName("main__card__side--back")[0].classList;

    if (card.classList.contains("is-flipped")) {
        front_classList.remove("main__card__side--front--flipped");
        back_classList.remove("main__card__side--back--flipped");
        card.classList.remove("is-flipped");

    } else {
        front_classList.add("main__card__side--front--flipped");
        back_classList.add("main__card__side--back--flipped");
        card.classList.add("is-flipped");
    }

}

function createCard() {
    if (cards.length <= 20) {
        const card  = new Card();
        cards.push(card);
        cards_nodes.set(card.id, getNode(card));
        return cards_nodes.get(card.id);
    } else {
        alert("you reached max number of cards!")
    }
}

function shuffle() {
    console.log(cards_nodes)
   cards_nodes.forEach(value => {
       value.style.order = Math.floor(Math.random() * 400);
   })
    console.log(cards_nodes.size)
}



// Event listeners

add_back_button.addEventListener("click", function () {
        main_section.appendChild(createCard());
    }
);
add_front_button.addEventListener("click", function () {
        main_section.insertBefore(createCard(), main_section.firstChild);
    }
);

shuffle_button.addEventListener("click", function () {
    shuffle();
})


generateMap();
renderCards();