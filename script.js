document.addEventListener('DOMContentLoaded', () => {
    const clientId = 'ofY5Fr5mGLuVCHX65FajUIwS7Kk8CNeWMqgt6ASugms';
    const apiUrl = `https://api.unsplash.com/photos/random?client_id=${clientId}&count=10`;

    const fetchPhotos = (url, callback) => {
        fetch(url)
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error('Error fetching photos:', error));
    };

    const updatePhotos = (photos) => {
        const images = document.querySelectorAll('.item img');
        photos.forEach((photo, index) => {
            if (images[index]) {
                images[index].src = photo.urls.regular;
                images[index].alt = photo.alt_description || 'Unsplash Photo';
                images[index].dataset.id = photo.id;
            }
        });
    };

    fetchPhotos(apiUrl, updatePhotos);

    const modal = document.getElementById('myModal');
    const modalImg = modal.querySelector('img');
    const modalStats = modal.querySelector('.stats');
    const span = document.getElementsByClassName('close')[0];

    let currentImg;

    const updateModalStats = (photoId) => {
        const statsUrl = `https://api.unsplash.com/photos/${photoId}/statistics?client_id=${clientId}`;
        fetch(statsUrl)
            .then(response => response.json())
            .then(stats => {
                modalStats.innerHTML = `
                    <p>Views: ${stats.views.total}</p>
                    <p>Downloads: ${stats.downloads.total}</p>
                `;
            })
            .catch(error => console.error('Error fetching stats:', error));
    };

    document.querySelectorAll('.item img').forEach(img => {
        img.addEventListener('click', () => {
            const photoId = img.dataset.id;
            currentImg = img;
            modal.style.display = 'block';
            modalImg.src = img.src;
            modalImg.dataset.id = photoId;
            updateModalStats(photoId);
        });
    });

    span.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    const searchInput = document.getElementById('searchInput');
    const randomPhotoButton = document.getElementById('randomPhoto');
    const randomAllPhotosButton = document.getElementById('randomAllPhotos');
    const searchPhotoButton = document.getElementById('searchPhoto');
    const searchAllPhotosButton = document.getElementById('searchAllPhotos');

    randomPhotoButton.addEventListener('click', () => {
        const randomPhotoUrl = `https://api.unsplash.com/photos/random?client_id=${clientId}`;
        fetch(randomPhotoUrl)
            .then(response => response.json())
            .then(photo => {
                modalImg.src = photo.urls.regular;
                modalImg.dataset.id = photo.id;
                if (currentImg) {
                    currentImg.src = photo.urls.regular;
                    currentImg.dataset.id = photo.id;
                    updateModalStats(photo.id);
                }
            })
            .catch(error => console.error('Error fetching photo:', error));
    });

    randomAllPhotosButton.addEventListener('click', () => {
        fetchPhotos(apiUrl, (photos) => {
            updatePhotos(photos);
            modal.style.display = 'none';
        });
    });

    searchPhotoButton.addEventListener('click', () => {
        const query = searchInput.value;
        if (query) {
            const searchUrl = `https://api.unsplash.com/search/photos?query=${query}&client_id=${clientId}`;
            fetch(searchUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.results.length > 0) {
                        const photo = data.results[0];
                        modalImg.src = photo.urls.regular;
                        modalImg.dataset.id = photo.id;
                        if (currentImg) {
                            currentImg.src = photo.urls.regular;
                            currentImg.dataset.id = photo.id;
                            updateModalStats(photo.id);
                        }
                    }
                })
                .catch(error => console.error('Error fetching photo:', error));
        }
    });

    searchAllPhotosButton.addEventListener('click', () => {
        const query = searchInput.value;
        if (query) {
            const searchUrl = `https://api.unsplash.com/search/photos?query=${query}&client_id=${clientId}&per_page=10`;
            fetch(searchUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.results.length > 0) {
                        updatePhotos(data.results);
                        modal.style.display = 'none';
                    }
                })
                .catch(error => console.error('Error fetching photos:', error));
        }
    });
});
