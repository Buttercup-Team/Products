import React, { useState, useEffect } from 'react';
import StyleView from './StyleView';
import StarRating from '../ratings/StarRating';

const ProductDetails = (props) => {
  const {
    product,
    styles,
    overallRating,
    selectedStyle,
    imgView,
    mouseXY,
    handleStyleClick,
    isImgViewClicked,
  } = props;
  // const [size, setSize] = useState('');
  // const [qty, setQty] = useState(0);
  const [SKU, setSKU] = useState(0);
  const [arr, setArr] = useState([0]);
  const someNumToSatisfyStarRating = 1059;
  // const {mouseX, mouseY} = mouseXY;

  const arrMaker = (itemQty) => {
    setArr([0]);
    const tempArr = [];
    if (itemQty > 15) {
      for (let i = 1; i <= 15; i += 1) {
        tempArr.push(i);
      }
    } else {
      for (let i = 1; i <= itemQty; i += 1) {
        tempArr.push(i);
      }
    }
    setArr(tempArr);
  };

  const sizeChangeHandler = (e) => {
    arrMaker(styles[selectedStyle].skus[e.target.value].quantity);
    setSKU(e.target.value);
  };

  // useEffect(() => {
  // }, [arr]);

  return (
    <div id="productView">
      <div
        className={
          isImgViewClicked
            ? 'expandedImgSlideView zIndex9'
            : 'expandedImgSlideView'
        }
      >
        <img
          className="expandedImgSlide"
          src={styles[selectedStyle].photos[imgView].url}
          alt="magnified card"
          className={
            isImgViewClicked === true ? 'expandedImgSlide' : 'hiddenImgSlide'
          }
          style={
            isImgViewClicked
              ? { left: -mouseXY.x * 1.5 + 150, top: -mouseXY.y * 1.75 + 300 }
              : null
          }
        />
      </div>
      <div className="ratingsComponent">
        <StarRating
          number={overallRating}
          uniqNum={someNumToSatisfyStarRating}
        />
      </div>
      <span className="paddingTop15px">{product.category}</span>
      <h1 className="">
        {styles[selectedStyle].name} {product.name}
      </h1>
      <div>
        {styles[selectedStyle].sale_price &&
        styles[selectedStyle].sale_price !== 'null'
          ? (
            <>
              <span className="origStrike paddingTop15px">
                ${styles[selectedStyle].original_price}
              </span>
              <span className="salePrice paddingTop15px">
                ${styles[selectedStyle].sale_price}
              </span>
            </>
          ) : (
            <span className="paddingTop15px">
              ${styles[selectedStyle].original_price}
            </span>
          )}
      </div>
      <div className="paddingTop15px">
        STYLE &gt; {styles[selectedStyle].name}
      </div>
      <div className="styleView paddingTop15px">
        <StyleView
          product={product}
          styles={styles}
          selectedStyle={selectedStyle}
          handleStyleClick={handleStyleClick}
        />
      </div>
      {/* {console.log(styles[selectedStyle].skus)}
      {console.log(Object.entries(styles[selectedStyle].skus).map((key, value) => {
        console.log(key[1].quantity, '=', key[1].size, key[0])
      }))} */}
      <div className="sizeQtyBarContainer">
        <select
          id="sizeBar"
          className=""
          name="SELECT SIZE"
          onChange={sizeChangeHandler}
        >
          <option value="">Select Size</option>
          {Object.entries(styles[selectedStyle].skus).map((key, id) =>
            key[1].quantity !== 0 
            ? (
              <option value={key[0]} key={`size${key[0]}${key[1].size}`}>
                {key[1].size}
              </option>
            ) : (
              <option key={`size${key[0]}${key[1].size}`} className="hiddenEle">
                null
              </option>
            )
          )}
        </select>
        <select id="qtyBar" className="" name="QUANTITY">
          <option>Select Qty</option>
          {arr.map((item) => (
            <option key={`option${item}`}>{item}</option>
          ))}
        </select>
      </div>
      <div className="flexSpaceBetween">
        <button type="submit" id="addToBag" className="">
          <span>ADD TO BAG</span>
          <span className=""> +</span>
        </button>
        <button type="" className="star">
          *
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
