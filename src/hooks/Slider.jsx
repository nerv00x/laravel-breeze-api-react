import React from 'react';
// import Slider from 'react-slick-carousel';
// 

const RotatingSlider = () => {
  const phrases = [
    "Frase 1",
    "Frase 2",
    "Frase 3"
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <Slider {...settings}>
      {phrases.map((phrase, index) => (
        <div key={index}>
          <h3>{phrase}</h3>
        </div>
      ))}
    </Slider>
  );
}

export default RotatingSlider;
