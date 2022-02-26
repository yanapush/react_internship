let usersSection = document.querySelector("nav");
let albumsSection = document.querySelector(".albums");
let modalWindow = document.querySelector('.albums__modal-window');
let modalWrapper = document.querySelector('.modal__wrapper');

async function getUsers() {
    let response = await fetch('https://immense-wave-41493.herokuapp.com/https://jsonplaceholder.typicode.com/users');
    return await response.json();
}

async function generateNavBar() {
    let users = await getUsers()
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

function setActiveUser(el) {
    let array = Array.from(usersSection.children);
    array.forEach(user => user.classList.remove('user-nav__card--active'));
    el.classList.add('user-nav__card--active');
}

async function loadAlbums() {
    let response = await fetch('https://jsonplaceholder.typicode.com/albums');
    return await response.json();
}

async function loadAlbum(id) {
    let response = await fetch(`https://jsonplaceholder.typicode.com/albums/${id}`);
    return await response.json();
}

async function loadAlbumPhotos(albumId) {
    let response = await fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}/photos`);
    return await response.json();
}

async function generateAlbum(album) {
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
    let photos = await loadAlbumPhotos(album.id);
    for (let i = 0; i < 4; ++i) {
        photosContainer.appendChild(await generatePhotoContainer(photos[i]));
    }
    albumNode.appendChild(photosContainer);
    albumNode.dataset.id = album.id;
    albumNode.addEventListener("click", async function () {
        await generateModalWindow(albumNode.dataset.id);
    })
    return albumNode;
}

async function generateModalWindow(id) {
    if (modalWindow.dataset.id === id) {
        modalWindow.classList.add('albums__modal-window--visible');
        modalWrapper.classList.add('modal__wrapper--visible');
        return;
    }
    let album = await loadAlbum(id);
    modalWindow.classList.add('albums__modal-window--visible');
    modalWrapper.classList.add('modal__wrapper--visible');
    modalWindow.innerHTML = '';
    let albumHeader = document.createElement('div');
    albumHeader.classList.add('album__header');
    albumHeader.classList.add('albums__modal-window__header');
    let title = document.createElement('h2');
    title.classList.add('album__title');
    title.innerText = album.title;
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
    let photos = await loadAlbumPhotos(album.id);
    for (const photo of photos) {
        photosContainer.appendChild(await generateBigPhotoContainer(photo));
    }
    modalWindow.appendChild(photosContainer);
    modalWindow.dataset.id = id;

}

async function generateBigPhotoContainer(photo) {
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

async function generatePhotoContainer(photo) {
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

async function generateAlbums() {
    albumsSection.innerHTML = '';
    let albums = await loadAlbums();
    for (const album of albums) {
        albumsSection.appendChild(await generateAlbum(album));
    }
}

async function generateUserAlbums(id) {
    albumsSection.innerHTML = '';
    let response = await fetch(`https://immense-wave-41493.herokuapp.com/https://jsonplaceholder.typicode.com/users/${id}/albums`);
    let albums = await response.json();
    for (const album of albums) {
        let albumNode = await generateAlbum(album);
        albumsSection.appendChild(albumNode);
    }
}

generateNavBar();
generateAlbums();
