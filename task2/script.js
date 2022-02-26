let postsSection = document.querySelector(".posts");
let usersSection = document.querySelector("nav");

generatePosts = () => {
    postsSection.innerHTML = '';
    getPosts().then((posts) => {
        for (const post of posts) {
            let postNode = generatePost(post);
            postsSection.appendChild(postNode)
        }
    });
}

generateUserPosts = (id) => {
    postsSection.innerHTML = '';
    getUserPosts(id).then((posts) => {
        for (const post of posts) {
            let postNode = generatePost(post);
            postsSection.appendChild(postNode)
        }
    });
}

generateNavBar = () => {
    let userButton = document.createElement('button');
    userButton.classList.add('users-nav__card');
    userButton.classList.add('user-nav__card--active');
    userButton.innerText = "All";
    userButton.addEventListener("click", function () {
        if (!userButton.classList.contains('user-nav__card--active')) {
            setActiveUser(this);
            generatePosts();
        }
    }, false);
    usersSection.appendChild(userButton);
    getUsers().then((users) => {
        for (const user of users) {
            let userButton = document.createElement('button');
            userButton.classList.add('users-nav__card');
            userButton.innerText = user.username;
            userButton.addEventListener("click", function () {
                if (!userButton.classList.contains('user-nav__card--active')) {
                    setActiveUser(this);
                    generateUserPosts(user.id);
                }
            })
            usersSection.appendChild(userButton);
        }
    });
}

generatePost = (post) => {
    let postNode = document.createElement('div');
    postNode.classList.add('post');
    postNode.dataset.id = post.id;
    postNode.appendChild(generateUserInfo(post.userId));
    postNode.appendChild(generatePostMainPart(post));
    let buttonSection = document.createElement('div');
    buttonSection.classList.add('comment-button__container');
    let button = document.createElement('button');
    button.classList.add('comment-button');
    button.innerText = 'Show comments';
    button.addEventListener("click", async function () {
        await showCommentSection(button, post.id);
    });
    buttonSection.appendChild(button);
    postNode.appendChild( buttonSection);
    postNode.appendChild(generateCommentSection1(post.id));
    return postNode;
}

generateUserInfo = (id) => {
    let userInfo = document.createElement('div');
    userInfo.classList.add('post__user');
    let userImg = document.createElement('img');
    userImg.classList.add('user-img');
    userImg.src = 'resources/user_icon.png';
    userImg.onmouseenter = function () {
        this.src = "resources/user_icon-active.png";
    };
    userImg.onmouseleave = function () {
        this.src = "resources/user_icon.png";
    };
    userInfo.appendChild(userImg);
    userImg.addEventListener("click", function () {
        showUserCard(userImg.parentElement);
    })
    let userCard = generateUserCard(id);
    userInfo.appendChild(userCard)
    return userInfo;
}

generateUserCard = (id) => {

    let userCard = document.createElement('div');
    userCard.classList.add('post__user-info');
    userCard.dataset.id = id;
    let username = document.createElement('h2');
    username.classList.add('user-info__username');
    userCard.appendChild(username);
    let name = document.createElement('h3');
    name.classList.add('user-info__name');
    userCard.appendChild(name);
    let email = document.createElement('h3');
    email.classList.add('user-info__email');
    userCard.appendChild(email);
    let phone = document.createElement('h3');
    phone.classList.add('user-info__phone');
    getUser(id).then((user) => {
        username.innerText = user.username;
        name.innerText = user.name;
        email.innerText = user.email;
        phone.innerText = user.phone;
    });
    userCard.appendChild(phone);
    return userCard
}

generatePostMainPart = (post) => {
    let mainContainer = document.createElement('div');
    mainContainer.classList.add("post__main-part");
    let title = document.createElement('h2');
    title.classList.add("post__main__title");
    title.innerText = post.title;
    mainContainer.appendChild(title);
    let text = document.createElement('p');
    text.classList.add('post__main__text');
    text.innerText = post.body;
    mainContainer.appendChild(text);
    return mainContainer;
}

generateCommentSection1 = () => {
    let commentsContainer = document.createElement('div');
    commentsContainer.classList.add('post__comment-section');
    let loadingIndicator = document.createElement('img');
    loadingIndicator.src = 'resources/loading.gif';
    loadingIndicator.classList.add('load-indicator');
    commentsContainer.appendChild(loadingIndicator);
    return commentsContainer;
}

generateCommentSection = (commentsContainer) => {
    commentsContainer.querySelector('.load-indicator').classList.add('load-indicator--active');
    let id = commentsContainer.parentNode.dataset.id;
    let commentsSection = document.createElement('div');
    commentsSection.classList.add('comment-section__comments');
    commentsContainer.appendChild(commentsSection)
    getComments(id).then((comments) => {
    comments.forEach((comment) => {
        commentsSection.appendChild(generateComment(comment));
    });
    commentsContainer.querySelector('.load-indicator').classList.remove('load-indicator--active');
    });
}

generateComment = (comment) => {
    let commentNode = document.createElement('div');
    commentNode.classList.add('comment-section__comments__comment');
    let commentInfo = document.createElement('div');
    commentInfo.classList.add('comment-info');
    let name = document.createElement('h3');
    name.classList.add('comment__name');
    name.innerText = comment.name;
    commentInfo.appendChild(name);
    let email = document.createElement('h4');
    email.classList.add('comment__email');
    email.innerText = comment.email;
    commentInfo.appendChild(email);
    commentNode.appendChild(commentInfo);
    let text = document.createElement('p');
    text.classList.add('comment__text');
    text.innerText = comment.body;
    commentNode.appendChild(text);
    return commentNode;
}

showUserCard = (card) => {
    let infoCardList = card.querySelector('.post__user-info').classList;
    if (infoCardList.contains('post__user-info--active')) {
        infoCardList.remove('post__user-info--active')
    } else {
        infoCardList.add('post__user-info--active')
    }
}

setActiveUser =(el) => {
    let array = Array.from(usersSection.children);
    array.forEach(user => user.classList.remove('user-nav__card--active'));
    el.classList.add('user-nav__card--active');
}

showCommentSection = (button) => {
    if (button.classList.contains('comment-button--hide')) {
        button.classList.remove('comment-button--hide');
        button.innerText ="Show Comments";
        button.parentNode.parentElement.querySelector(".comment-section__comments").classList.add('comment-section__comments--hidden');
    } else {
        button.classList.add('comment-button--hide');
        button.innerText ="Hide";
        let commentSection = button.parentNode.parentNode.querySelector('.post__comment-section');
        if (commentSection.getElementsByClassName('comment-section__comments').length !== 0) {
            commentSection.querySelector('.comment-section__comments').classList.remove('comment-section__comments--hidden')
        } else {
            generateCommentSection(button.parentNode.parentNode.querySelector('.post__comment-section'));
        }
    }
}

async function getComments(id) {
    let response = await fetch(`https://immense-wave-41493.herokuapp.com/https://jsonplaceholder.typicode.com/posts/${id}/comments`);
    return await response.json();
}

async function getUsers() {
    let response = await fetch('https://immense-wave-41493.herokuapp.com/https://jsonplaceholder.typicode.com/users');
    return await response.json();
}

async function getUser(id) {
        let response = await fetch(`https://immense-wave-41493.herokuapp.com/https://jsonplaceholder.typicode.com/users/${id}`);
        return await response.json();
}

async function getPosts() {
    let response = await fetch(`https://immense-wave-41493.herokuapp.com/https://jsonplaceholder.typicode.com/posts`);
    return await response.json();
}

async function getUserPosts(id) {
    let response = await fetch(`https://immense-wave-41493.herokuapp.com/https://jsonplaceholder.typicode.com/users/${id}/posts`);
    return await response.json();
}

generateNavBar();
generatePosts();
