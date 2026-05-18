function loadCarousel(imgurls){

        const wrapper = document.querySelector('.swiper-wrapper');

        wrapper.innerHTML = imgurls.map(url => {
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
            fadeEffect: {
              crossFade: true
            },

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
    'bookImages/tsoa.png',
    'bookImages/rr.png',
    'bookImages/scythe.jpg'
  ];
  
  // Call the function to build the carousel
  loadSwiperImages(myBooks);
  