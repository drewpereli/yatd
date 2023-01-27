import { Component } from 'solid-js';
import {
  library,
  icon as genIcon,
  type Icon as FaIcon,
} from '@fortawesome/fontawesome-svg-core';
import {
  faPenToSquare,
  faCircleXmark,
  faTrashCan,
} from '@fortawesome/free-regular-svg-icons';

library.add(faPenToSquare, faCircleXmark, faTrashCan);

const icons = {
  pen: genIcon({ prefix: 'far', iconName: 'pen-to-square' }),
  xmark: genIcon({ prefix: 'far', iconName: 'circle-xmark' }),
  trash: genIcon({ prefix: 'far', iconName: 'trash-can' }),
} as const satisfies Record<string, FaIcon>;

const Icon: Component<{ icon: keyof typeof icons }> = function (props) {
  const iconHTML = () => {
    return icons[props.icon].html[0];
  };

  // eslint-disable-next-line solid/no-innerhtml
  return <i innerHTML={iconHTML()} />;
};

export default Icon;
