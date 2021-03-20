import React from 'react';

const StyleView = (props) => {
  const { product, styles, selectedStyle, handleStyleClick } = props;
  const divideByFour = styles;
  const StyleMapper = ({ row }) =>
    styles.map((style, idx) => {
      if (Math.floor(idx / 4) === row) {
        return (
          <button
            type="button"
            onClick={handleStyleClick}
            className="styleButton"
            key={`button${style.style_id}${idx}`}
          >
            <img
              styleidx={idx}
              alt={style.name + product.name}
              src={style.photos[0].thumbnail_url}
              className={
                idx === selectedStyle
                  ? 'selectedStyle styleThumbnail'
                  : 'styleThumbnail '
              }
              key={`img${style.style_id}${idx}`}
            />
            <img
              key={`check${style.style_id}${idx}`}
              alt="./img/checkmark.png"
              src="./img/checkmark.png"
              className={
                idx === selectedStyle ? 'ShowEle checkmark' : 'hiddenEle '
              }
            />
          </button>
        );
      }
      return null;
    });

  return (
    <div>
      <div style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
        <StyleMapper row={0} />
      </div>
      <div>
        <StyleMapper row={1} />
      </div>
      <div>
        <StyleMapper row={2} />
      </div>
      <div>
        <StyleMapper row={3} />
      </div>
    </div>
  );
};

export default StyleView;
