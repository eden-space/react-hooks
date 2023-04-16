/**
 * rem flexible
 * @param baseFontSize {number} 1rem 基准 fontSize，default 50
 * @param designSketchWidth {number} UI 稿宽度，default 375
 * @param maxFontSize {number} 最大 fontSize 限制， default 64
 * @return {function} removeRootPixel，removeRootPixel 取消 baseFontSize 设置并移除 resize 监听
 */

declare global {
  interface Window {
    __ROOT_FONT_SIZE__: number;
    __IS_RESPONSIVE__: boolean;
  }
}

export interface ISetRootPixelConfig {
  rootFontSize?: number;
  maxRootFontSize?: number;
  sketchWidth?: number;
  supportLandscape?: boolean;
  useRootFontSizeBeyondMax?: boolean;
}

function setRootPixel(config?: ISetRootPixelConfig) {
  const {
    rootFontSize = 50, // root font size
    maxRootFontSize = 64, // maximum value of root font size
    sketchWidth = 375, // for iPhone 6
    supportLandscape = false, // 横屏时使用 height 计算 rem
    useRootFontSizeBeyondMax = false, // 超过maxRootFontSize时，是否使用rootFontSize。场景：rem在pc上的尺寸计算正常
  } = { ...config };

  let defaultFontSize = 0;
  const widthQueryKey = 'width_query_key'; // url里取值
  const rootFontSizeVariableName = '__ROOT_FONT_SIZE__';
  const isResponsiveVariableName = '__IS_RESPONSIVE__';

  function getDefaultFontSize() {
    if (defaultFontSize) {
      return defaultFontSize;
    }

    document.documentElement.style.fontSize = '';
    const temp = document.createElement('div');
    temp.style.cssText = 'width:1rem;display:none';
    document.head.appendChild(temp);
    defaultFontSize =
      +window.getComputedStyle(temp, null).getPropertyValue('width').replace('px', '') || 16;
    document.head.removeChild(temp);

    return defaultFontSize;
  }

  function getQuery(name: string) {
    return (new RegExp('[?&]' + name + '=([^&#\\b]+)').exec(location.search || '') || [])[1];
  }

  function setRootFontSize() {
    let clientWidth;
    if (widthQueryKey && +getQuery(widthQueryKey)) {
      clientWidth = +getQuery(widthQueryKey);
    } else {
      clientWidth =
        window.innerWidth && document.documentElement.clientWidth
          ? Math.min(window.innerWidth, document.documentElement.clientWidth)
          : window.innerWidth ||
            document.documentElement.clientWidth ||
            (document.body && document.body.clientWidth) ||
            sketchWidth;

      if (supportLandscape) {
        const isLandscape =
          ((screen.orientation ? screen.orientation.angle : Number(window.orientation)) / 90) % 2;
        if (isLandscape) {
          const clientHeight =
            window.innerHeight && document.documentElement.clientHeight
              ? Math.min(window.innerHeight, document.documentElement.clientHeight)
              : window.innerHeight ||
                document.documentElement.clientHeight ||
                (document.body && document.body.clientHeight) ||
                sketchWidth;

          clientWidth = Math.max(clientHeight, 350);
        }
      }
    }

    let htmlFontSizePx = (clientWidth / sketchWidth) * rootFontSize;

    if (useRootFontSizeBeyondMax) {
      htmlFontSizePx = htmlFontSizePx < maxRootFontSize ? htmlFontSizePx : rootFontSize;
    } else {
      /**
       * 兼容移动端页面在pc站上的显示，
       * media query后固定body的宽度，这时候以浏览器宽度来计算html的font-size就会使页面样式错乱
       */
      htmlFontSizePx = Math.min(htmlFontSizePx, maxRootFontSize);
    }

    window[rootFontSizeVariableName] = htmlFontSizePx;
    document.documentElement.style.fontSize = (htmlFontSizePx / getDefaultFontSize()) * 100 + '%';
  }

  function adjust() {
    setTimeout(setRootFontSize, 30);
  }

  function removeRootPixel() {
    document.documentElement.style.fontSize = '';
    window.removeEventListener('resize', adjust, false);
    if ('onorientationchange' in window) {
      window.removeEventListener('orientationchange', adjust, false);
    }
  }

  if (window[isResponsiveVariableName] === false) {
    document.documentElement.style.fontSize = `${rootFontSize}px`;
    return function () {
      document.documentElement.style.fontSize = '';
    };
  }

  // adjust(true);
  setRootFontSize();

  window.addEventListener('resize', adjust, false);

  if ('onorientationchange' in window) {
    window.addEventListener('orientationchange', adjust, false);
  }

  return removeRootPixel;
}

export default setRootPixel;
