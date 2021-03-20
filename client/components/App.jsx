import React, { useState } from 'react';
import RatingsApp from './ratings/RatingsApp';
import QuestionsList from './Questions/QuestionsList';
import ProductDetailsView from './productDetails/ProductDetailsView';
import ProductDescription from './productDetails/ProductDescription';

const axios = require('axios');

const App = () => {
  const [product, setProduct] = useState({
    features: [
      {
        feature: '',
        value: '',
      },
    ],
  });
  console.log(product);
  const [styles, setStyles] = useState([
    {
      name: '',
      sale_price: '',
      photos: [
        {
          thumbnail_url: '',
          url: '',
        },
      ],
      style_id: '00000',
      skus: {
        0: {
          quantity: 0,
          size: '',
        },
      },
    },
  ]);
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [meta, setMeta] = useState({
    ratings: {},
    recommended: {
      false: '0',
      true: '0',
    },
    characteristics: {},
  });
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [imgView, setImgView] = useState(0);
  const [thumbnailView, setThumbnailView] = useState(0);
  const [selectedStyleImgMemory, setSelectedStyleImgMemory] = useState([]);
  const [overallRating, setRating] = useState(0);
  const [newProductID, setNewProductID] = useState('');

  // functions
  const styleMemArrMaker = (numOfStyles) => {
    const arr = [];
    for (let i = 0; i < numOfStyles; i += 1) {
      arr.push(0);
    }
    return arr;
  };

  const handleImgThumbnailClick = (e) => {
    const thumbnailViewIdx = parseInt(e.target.attributes.value.value, 10);
    const arr = selectedStyleImgMemory;
    arr[selectedStyle] = thumbnailViewIdx;
    setImgView(thumbnailViewIdx);
    setSelectedStyleImgMemory(arr);
  };

  const handleArrowClick = (e) => {
    const direction = e.target.attributes.value.value;
    const updatedImgView = parseInt(e.target.attributes[3].value, 10);
    const updatedThumbnailView = parseInt(e.target.attributes[4].value, 10);
    const photoMax = styles[selectedStyle].photos.length - 1;
    const arr = selectedStyleImgMemory;

    if (direction === 'left') {
      arr[selectedStyle] = imgView === photoMax ? photoMax : updatedImgView - 1;
      setThumbnailView(thumbnailView - 1);
      setSelectedStyleImgMemory(arr);
      setImgView(imgView <= 0 ? 0 : imgView - 1);
    }
    if (direction === 'right') {
      arr[selectedStyle] = imgView === photoMax ? photoMax : updatedImgView + 1;
      setThumbnailView(thumbnailView + 1);
      if (imgView) setSelectedStyleImgMemory(arr);
      setImgView(imgView >= photoMax ? photoMax : imgView + 1);
    }
    if (direction === 'up') {
      setThumbnailView(thumbnailView - 1);
      if (imgView >= thumbnailView + 6) {
        setImgView(imgView - 1);
      }
    }
    if (direction === 'down') {
      setThumbnailView(updatedThumbnailView + 1);
      if (imgView <= thumbnailView) {
        setImgView(imgView + 1);
      }
    }
  };

  const handleStyleClick = (e) => {
    setSelectedStyle(parseInt(e.target.attributes.styleidx.value, 10));
    setImgView(
      selectedStyleImgMemory[parseInt(e.target.attributes.styleidx.value, 10)]
    );
  };

  const getOverallRating = (data) => {
    // find the overall star rating
    const stars = {};
    let totalReviews = 0;
    let weightedTotal = 0;
    let weightedAvg = 0.0;
    const ratings = Object.keys(data.ratings);
    for (let i = 0; i < ratings.length; i += 1) {
      stars[ratings[i]] = parseInt(data.ratings[ratings[i]], 10);
      totalReviews += stars[ratings[i]];
      weightedTotal += stars[ratings[i]] * parseInt(ratings[i], 10);
    }
    if (totalReviews) {
      weightedAvg = Math.round(10 * (weightedTotal / totalReviews)) / 10;
    }
    // setRating(weightedAvg);
    return weightedAvg;
  };

  const getOneProduct = (productID) => {
    // this url tests for 4+ styles and items on sale
    // const targetedProductUrl = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-sea/products/20104';
    // const productURL = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-sea/products';
    // const randomNumberGenerator = (max) => {
    //   let result = Math.floor(Math.random() * Math.floor(max) + 1);
    //   if (result < 10) {
    //     result = `2011${result.toString()}`;
    //     return result;
    //   }
    //   result = `201${result.toString()}`;
    //   return result;
    // };
    // const randomProductUrl = `https://app-hrsei-api.herokuapp.com/api/fec2/hr-sea/products/${randomNumberGenerator(productLimit).toString()}`;
    // console.log(randomProductUrl);

    // get the default product to populate the page on start up
    axios
      .get(`product/${productID}`)
      .then((productRes) => {
        setProduct(productRes.data);
        // get the styles data from the default product id
        axios
          .get(`/styles/${productID}`)
          .then((styleRes) => {
            setSelectedStyleImgMemory(styleMemArrMaker(styleRes.data.length));
            setStyles(styleRes.data);
            setStyles(styleRes.data);
            // get the reviews meta data from the default product id
            axios
              .get(`reviews/meta/id=${productID}`)
              .then((ratingMeta) => {
                const metaData = ratingMeta.data;
                const good = parseInt(metaData.recommended.true, 10) || 0;
                const bad = parseInt(metaData.recommended.false, 10) || 0;
                const totalReviews = good + bad;
                setMeta(metaData);
                setRating(getOverallRating(metaData));
                // get all reviews for the default product id
                axios
                  .get(`reviews/id=${productID}&count=${totalReviews}`)
                  .then((allReviews) => {
                    setReviews(allReviews.data.results);
                    // get questions for q&a
                    axios
                      .get(`/questions/id=${productID}`)
                      .then((question) => {
                        setQuestions(question.data.results);
                      })
                      .catch((err) => {
                        console.log('error getting questions', err);
                      });
                  })
                  .catch((err) => {
                    console.log('error getting reviews', err);
                  });
              })
              .catch((err) => {
                console.log('error getting meta data', err);
              });
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  };

  const handleNewProduct = (e) => {
    e.preventDefault();
    getOneProduct(newProductID);
  };

  useState(() => getOneProduct(20111));

  return (
    <div className="">
      <div className="gridContainer gridMainTemplate">
        <div className="gridSpacer" />
        <div className="header">
          <div className="flexAuto1" />
          <div className="flexAuto1 alignCenter flex">
            <img className="logo-img" src="./img/ankylosaur1.jpg" alt="logo" />
            <span className="logo">Agile Creations</span>
          </div>
          <div className="flexAuto1">
            <div className="header-search">
              <label htmlFor="searchInput" style={{ color: '#fff' }}>
                Product ID
                <input
                  id="searchInput"
                  className="logo-search"
                  placeholder="new product ID"
                  value={newProductID}
                  onChange={(e) => {
                    setNewProductID(e.target.value);
                  }}
                />
                <button
                  type="submit"
                  className="logo-search navSubmit"
                  onClick={handleNewProduct}
                >
                  Submit
                </button>
              </label>
            </div>
          </div>
        </div>
        <div className="gridSpacer" />
        <div className="gridSpacer" />
        <ProductDetailsView
          product={product}
          styles={styles}
          overallRating={overallRating}
          selectedStyle={selectedStyle}
          selectedStyleImgMemory={selectedStyleImgMemory}
          imgView={imgView}
          thumbnailView={thumbnailView}
          handleStyleClick={handleStyleClick}
          handleArrowClick={handleArrowClick}
          handleImgThumbnailClick={handleImgThumbnailClick}
        />
        <div className="gridSpacer" />
        <div className="gridSpacer" />
        <ProductDescription
          product={product}
          styles={styles}
          selectedStyle={selectedStyle}
        />
        <div className="gridSpacer" />
        <div className="gridSpacer" />
        <div id="questions-answers">
          <QuestionsList questions={questions} product={product} />
        </div>
        <div className="gridSpacer" />
        <div className="gridSpacer" />
        <div id="reviews-ratings">
          <RatingsApp
            metaData={meta}
            reviews={reviews}
            setReviews={setReviews}
            overallRating={overallRating}
          />
        </div>
        <div className="gridSpacer" />
      </div>
    </div>
  );
};

export default App;
