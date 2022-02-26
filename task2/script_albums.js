let usersSection = document.querySelector("nav");
let albumsSection = document.querySelector(".albums");
let modalWindow = document.querySelector('.albums__modal-window');
let modalWrapper = document.querySelector('.modal__wrapper');

async function getUsers() {
    let response = await fetch('https://immense-wave-41493.herokuapp.com/https://jsonplaceholder.typicode.com/users');
    return await response.json();
}

async function getAlbums() {
    let response = await fetch('https://jsonplaceholder.typicode.com/albums');
    return await response.json();
}

async function getUserAlbums(id) {
    let response = await fetch(`https://immense-wave-41493.herokuapp.com/https://jsonplaceholder.typicode.com/users/${id}/albums`);
    return await response.json();
}

async function getAlbum(id) {
    let response = await fetch(`https://jsonplaceholder.typicode.com/albums/${id}`);
    return await response.json();
}

async function getAlbumPhotos(albumId) {
    let response = await fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}/photos`);
    return await response.json();
}

generateNavBar = (users) => {
    let userButton = document.createElement('button');
    userButton.classList.add('users-nav__card');
    userButton.classList.add('user-nav__card--active');
    userButton.innerText = "All";
    userButton.addEventListener("click", async function () {
        if (!userButton.classList.contains('user-nav__card--active')) {
            setActiveUser(this);

            await generateAlbums();
        }
    }, false);
    usersSection.appendChild(userButton);
    for (const user of users) {
        let userButton = document.createElement('button');
        userButton.classList.add('users-nav__card');
        userButton.innerText = user.username;
        userButton.addEventListener("click", async function () {
            if (!userButton.classList.contains('user-nav__card--active')) {
                setActiveUser(this);
                await generateUserAlbums(user.id);
            }
        })
        usersSection.appendChild(userButton);
    }
}

generateAlbum = (album) => {
    let albumNode = document.createElement('div');
    albumNode.classList.add('album');
    let albumHeader = document.createElement('div');
    albumHeader.classList.add('album__header');
    let title = document.createElement('h2');
    title.classList.add('album__title');
    title.innerText = album.title;
    albumHeader.appendChild(title);
    albumNode.appendChild(albumHeader);
    let photosContainer = document.createElement('div');
    photosContainer.classList.add('album__photos');
    getAlbumPhotos(album.id).then(photos => {
        for (let i = 0; i < 4; ++i) {
            photosContainer.appendChild(generatePhotoContainer(photos[i]));
        }
    })
    albumNode.appendChild(photosContainer);
    albumNode.dataset.id = album.id;
    albumNode.addEventListener("click", async function () {
        await generateModalWindow(albumNode.dataset.id);
    })
    return albumNode;
}

function setActiveUser(el) {
    let array = Array.from(usersSection.children);
    array.forEach(user => user.classList.remove('user-nav__card--active'));
    el.classList.add('user-nav__card--active');
}

generateModalWindow = (id) => {
    if (modalWindow.dataset.id === id) {
        modalWindow.classList.add('albums__modal-window--visible');
        modalWrapper.classList.add('modal__wrapper--visible');
        return;
    }
    modalWindow.classList.add('albums__modal-window--visible');
    modalWrapper.classList.add('modal__wrapper--visible');
    modalWindow.innerHTML = '';
    let albumHeader = document.createElement('div');
    albumHeader.classList.add('album__header');
    albumHeader.classList.add('albums__modal-window__header');
    let title = document.createElement('h2');
    title.classList.add('album__title');
    albumHeader.appendChild(title);
    let closeButton = document.createElement('button');
    closeButton.classList.add('close');
    let closeIcon = document.createElement('img');
    closeIcon.src = 'resources/close.png';
    closeButton.appendChild(closeIcon);
    closeButton.addEventListener("click", function () {
        modalWindow.classList.remove('albums__modal-window--visible');
        modalWrapper.classList.remove('modal__wrapper--visible');
    })
    albumHeader.appendChild(closeButton);
    modalWindow.appendChild(albumHeader);
    let photosContainer = document.createElement('div');
    photosContainer.classList.add('album__photos');
    getAlbum(id).then(album => {
        title.innerText = album.title;
        getAlbumPhotos(album.id).then(photos => {
            for (const photo of photos) {
                photosContainer.appendChild(generateBigPhotoContainer(photo));
            }
        })
    });
    modalWindow.appendChild(photosContainer);
    modalWindow.dataset.id = id;
}

generateBigPhotoContainer = (photo) => {
    let container = document.createElement('div');
    container.classList.add('photo__container');
    let img = document.createElement('img');
    img.classList.add('photo');
    img.src = photo.url;
    let title = document.createElement('small');
    title.classList.add('photo__title');
    title.innerText = photo.title;
    container.appendChild(img);
    container.appendChild(title);
    container.dataset.id = photo.id;
    return container;
}

generatePhotoContainer = (photo) => {
    let container = document.createElement('div');
    container.classList.add('photo__container');
    let img = document.createElement('img');
    img.classList.add('photo');
    img.src = photo.thumbnailUrl;
    let title = document.createElement('small');
    title.classList.add('photo__title');
    title.innerText = photo.title;
    container.appendChild(img);
    container.appendChild(title);
    container.dataset.id = photo.id;
    return container
}

generateAlbums = (albums) => {
    albumsSection.innerHTML = '';
    for (const album of albums) {
        albumsSection.appendChild(generateAlbum(album));
    }
}

generateUserAlbums = (id) => {
    albumsSection.innerHTML = '';
    getUserAlbums(id).then(albums => {
        for (const album of albums) {
            let albumNode = generateAlbum(album);
            albumsSection.appendChild(albumNode);
        }
    })
}

const main = async () => {
    const users = await getUsers();
    generateNavBar(users);

    const albums = await getAlbums();
    generateAlbums(albums);
}

main();