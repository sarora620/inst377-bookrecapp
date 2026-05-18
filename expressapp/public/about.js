function loadCarousel(imgurls) {
    const wrapper = document.querySelector('.swiper-wrapper');

    wrapper.innerHTML = ""; // clear first

    imgurls.forEach(url => {
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide');

        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Carousel Image';

        slide.appendChild(img);
        wrapper.appendChild(slide);
    });

    const swiper = new Swiper('.swiper', {
        effect: 'flip',

        direction: 'horizontal',
        loop: true, 
        
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
      
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
      
        autoplay: {
            delay: 5000,
        },
    });
}

const myBooks = [
    'tsoa.png',
    'rr.png',
    'scythe.png'
];

loadCarousel(myBooks);
  