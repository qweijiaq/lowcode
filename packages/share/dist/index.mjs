import React, { useMemo, useState, useEffect } from 'react';
import { Carousel, Card, List, Avatar } from 'antd';

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
  const props = useMemo(() => {
    return {
      ...getDefaultValueByConfig(videoComponentDefaultConfig),
      ..._props
    };
  }, [_props]);
  const [isReady, setIsReady] = useState(false);
  function handleLoadedMetadata(event) {
    setIsReady(true);
    event.currentTarget.currentTime = props.startTime;
  }
  return /* @__PURE__ */ React.createElement(
    "video",
    {
      controls: !!_props || isReady,
      onLoadedMetadata: handleLoadedMetadata,
      className: "w-full h-[200px] object-cover outline-none",
      ...objectOmit(props, ["startTime"])
    }
  );
}

const defaultImageInfo = {
  id: "",
  url: "https://sdfsdf.dev/380x200.png",
  fit: "cover",
  height: 200,
  handleClicked: "open-url",
  name: "\u56FE\u7247\u540D\u79F0",
  link: "https://xdclass.net"
};
const imageComponentDefaultConfig = {
  id: {
    value: "",
    defaultValue: "",
    isHidden: true
  },
  fit: {
    value: "cover",
    defaultValue: "cover",
    isHidden: false
  },
  height: {
    value: 200,
    defaultValue: 200,
    isHidden: false
  },
  handleClicked: {
    value: "open-url",
    defaultValue: "open-url",
    isHidden: false
  },
  link: {
    value: "https://xdclass.net",
    defaultValue: "https://xdclass.net",
    isHidden: false
  },
  name: {
    value: "\u56FE\u7247\u540D\u79F0",
    defaultValue: "\u56FE\u7247\u540D\u79F0",
    isHidden: false
  },
  url: {
    value: "https://sdfsdf.dev/380x200.png",
    defaultValue: "https://sdfsdf.dev/380x200.png",
    isHidden: false
  }
};

function ImageComponent(_props) {
  const props = useMemo(() => {
    return {
      ...getDefaultValueByConfig(imageComponentDefaultConfig),
      ..._props
    };
  }, [_props]);
  const img = /* @__PURE__ */ React.createElement(
    "img",
    {
      src: props.url,
      alt: props.name,
      className: "w-full",
      style: { height: `${props.height}px`, objectFit: props.fit }
    }
  );
  if (props.handleClicked === "open-url")
    return /* @__PURE__ */ React.createElement("a", { href: props.link, target: "_blank", rel: "noreferrer" }, img);
  else
    return img;
}

const swiperComponentDefaultConfig = {
  id: {
    value: "",
    defaultValue: "",
    isHidden: true
  },
  autoPlay: {
    value: true,
    defaultValue: true,
    isHidden: false
  },
  images: {
    value: [defaultImageInfo],
    defaultValue: [defaultImageInfo],
    isHidden: false
  },
  interval: {
    value: 3e3,
    defaultValue: 3e3,
    isHidden: false
  },
  showIndicators: {
    value: true,
    defaultValue: true,
    isHidden: false
  },
  dotPosition: {
    value: "bottom",
    defaultValue: "bottom",
    isHidden: false
  }
};

function SwiperComponent(_props) {
  const props = useMemo(() => {
    return {
      ...getDefaultValueByConfig(swiperComponentDefaultConfig),
      ..._props
    };
  }, [_props]);
  return /* @__PURE__ */ React.createElement(
    Carousel,
    {
      autoplaySpeed: props.interval,
      autoplay: props.autoPlay,
      dots: props.showIndicators,
      dotPosition: props.dotPosition
    },
    props.images.map((image, index) => /* @__PURE__ */ React.createElement(ImageComponent, { ...image, key: index }))
  );
}

const cardComponentDefaultConfig = {
  coverImg: {
    value: "https://sdfsdf.dev/600x200.png",
    defaultValue: "https://sdfsdf.dev/600x200.png",
    isHidden: false
  },
  description: {
    value: "\u8FD9\u662F\u4E00\u6BB5\u63CF\u8FF0",
    defaultValue: "\u8FD9\u662F\u4E00\u6BB5\u63CF\u8FF0",
    isHidden: false
  },
  title: {
    value: "\u8FD9\u662F\u6807\u9898",
    defaultValue: "\u8FD9\u662F\u6807\u9898",
    isHidden: false
  }
};

const { Meta } = Card;
function CardComponent(_props) {
  const props = useMemo(() => {
    return { ...getDefaultValueByConfig(cardComponentDefaultConfig), ..._props };
  }, [_props]);
  return /* @__PURE__ */ React.createElement(
    Card,
    {
      hoverable: true,
      cover: /* @__PURE__ */ React.createElement("img", { alt: "cover_img", src: props.coverImg })
    },
    /* @__PURE__ */ React.createElement(Meta, { title: props.title, description: props.description })
  );
}

const listItem = {
  id: "",
  title: "\u6807\u9898",
  description: "\u63CF\u8FF0",
  titleLink: "https://xdclass.net",
  avatar: "https://sdfsdf.dev/50x50.png"
};
const listComponentDefaultConfig = {
  id: {
    value: "",
    defaultValue: "",
    isHidden: true
  },
  items: {
    value: [listItem],
    defaultValue: [listItem],
    isHidden: false
  }
};

function ListComponent(_props) {
  const props = useMemo(() => {
    return {
      ...getDefaultValueByConfig(listComponentDefaultConfig),
      ..._props
    };
  }, [_props]);
  return /* @__PURE__ */ React.createElement(
    List,
    {
      itemLayout: "horizontal",
      dataSource: props.items,
      renderItem: (item) => /* @__PURE__ */ React.createElement(List.Item, null, /* @__PURE__ */ React.createElement(
        List.Item.Meta,
        {
          avatar: /* @__PURE__ */ React.createElement(Avatar, { src: item.avatar }),
          title: /* @__PURE__ */ React.createElement("a", { href: item.titleLink }, item.title),
          description: item.description
        }
      ))
    }
  );
}

const textComponentDefaultConfig = {
  size: {
    value: "base",
    defaultValue: "base",
    isHidden: false
  },
  title: {
    value: "\u8FD9\u91CC\u4FEE\u6539\u4E3A\u4F60\u8981\u7684\u6587\u5B57",
    defaultValue: "\u8FD9\u91CC\u4FEE\u6539\u4E3A\u4F60\u8981\u7684\u6587\u5B57",
    isHidden: false
  }
};

function TextComponent(_props) {
  const props = useMemo(() => {
    return {
      ...getDefaultValueByConfig(textComponentDefaultConfig),
      ..._props
    };
  }, [_props]);
  const [size, setSize] = useState("");
  useEffect(() => {
    switch (_props.size) {
      case "sm":
        setSize("text-sm");
        break;
      case "base":
        setSize("text-base");
        break;
      case "lg":
        setSize("text-lg");
        break;
      case "xl":
        setSize("text-xl");
        break;
      case "xs":
        setSize("text-xs");
        break;
      default:
        setSize("text-base");
        break;
    }
  }, [_props]);
  return /* @__PURE__ */ React.createElement("span", { className: size }, props.title);
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
  video: VideoComponent,
  image: ImageComponent,
  swiper: SwiperComponent,
  card: CardComponent,
  list: ListComponent,
  titleText: TextComponent
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

export { CardComponent, ImageComponent, ListComponent, SwiperComponent, TextComponent, VideoComponent, calcTypeByString, calcValueByString, cardComponentDefaultConfig, componentList, defaultImageInfo, fillComponentPropsByConfig, getComponentByType, getDefaultValueByConfig, imageComponentDefaultConfig, listComponentDefaultConfig, listItem, objectOmit, objectPick, swiperComponentDefaultConfig, textComponentDefaultConfig, videoComponentDefaultConfig };
