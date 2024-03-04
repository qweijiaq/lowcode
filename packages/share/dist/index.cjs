'use strict';

const React = require('react');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const React__default = /*#__PURE__*/_interopDefaultCompat(React);

function getComponentByType(type) {
  return componentList[type];
}
function getDefaultValueByConfig(componentPropsWrapper) {
  return Object.entries(componentPropsWrapper).reduce(
    (acc, [key, value]) => {
      acc[key] = value.defaultValue;
      return acc;
    },
    {}
  );
}
function fillComponentPropsByConfig(props, componentPropsWrapper) {
  const result = {};
  for (const [key, value] of Object.entries(componentPropsWrapper)) {
    result[key] = {
      isHidden: value.isHidden,
      defaultValue: value.defaultValue,
      value: props?.[key] !== void 0 ? calcValueByString(props[key]) : value.defaultValue
    };
  }
  return result;
}

const videoComponentDefaultConfig = {
  autoPlay: {
    value: true,
    isHidden: true,
    defaultValue: false
  },
  poster: {
    value: "",
    defaultValue: "",
    isHidden: false
  },
  loop: {
    value: true,
    defaultValue: true,
    isHidden: false
  },
  muted: {
    value: false,
    defaultValue: false,
    isHidden: false
  },
  src: {
    value: "",
    defaultValue: "",
    isHidden: false
  },
  startTime: {
    value: 0,
    defaultValue: 0,
    isHidden: false
  }
};

function VideoComponent(_props) {
  const props = React.useMemo(() => {
    return {
      ...getDefaultValueByConfig(videoComponentDefaultConfig),
      ..._props
    };
  }, [_props]);
  const [isReady, setIsReady] = React.useState(false);
  function handleLoadedMetadata(event) {
    setIsReady(true);
    event.currentTarget.currentTime = props.startTime;
  }
  return /* @__PURE__ */ React__default.createElement(
    "video",
    {
      controls: !!_props || isReady,
      onLoadedMetadata: handleLoadedMetadata,
      className: "w-full h-[200px] object-cover outline-none",
      ...objectOmit(props, ["startTime"])
    }
  );
}

function objectOmit(obj, keys) {
  const result = {};
  for (const key in obj) {
    if (!keys.includes(key))
      result[key] = obj[key];
  }
  return result;
}
function objectPick(obj, keys) {
  const result = {};
  for (const key of keys)
    result[key] = obj[key];
  return result;
}

const componentList = {
  video: VideoComponent
};

function calcValueByString(str) {
  let value;
  if (/^\d+$/.test(str))
    value = Number(str);
  else if (["true", "false"].includes(str))
    value = str === "true";
  return value ?? str;
}
function calcTypeByString(str) {
  if (/^\d+$/.test(str))
    return "number";
  else if (["true", "false"].includes(str))
    return "boolean";
  return "string";
}

exports.VideoComponent = VideoComponent;
exports.calcTypeByString = calcTypeByString;
exports.calcValueByString = calcValueByString;
exports.componentList = componentList;
exports.fillComponentPropsByConfig = fillComponentPropsByConfig;
exports.getComponentByType = getComponentByType;
exports.getDefaultValueByConfig = getDefaultValueByConfig;
exports.objectOmit = objectOmit;
exports.objectPick = objectPick;
exports.videoComponentDefaultConfig = videoComponentDefaultConfig;
