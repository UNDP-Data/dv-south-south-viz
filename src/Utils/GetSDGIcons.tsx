import {
  SDG1Icon,
  SDG2Icon,
  SDG3Icon,
  SDG4Icon,
  SDG5Icon,
  SDG6Icon,
  SDG7Icon,
  SDG8Icon,
  SDG9Icon,
  SDG10Icon,
  SDG11Icon,
  SDG12Icon,
  SDG13Icon,
  SDG14Icon,
  SDG15Icon,
  SDG16Icon,
  SDG17Icon,
} from '../icons';

export const getSDGIcon = (SDGGoal: string, size: number) => {
  switch (SDGGoal) {
    case 'SDG1':
      return <SDG1Icon size={size} />;
    case 'SDG2':
      return <SDG2Icon size={size} />;
    case 'SDG3':
      return <SDG3Icon size={size} />;
    case 'SDG4':
      return <SDG4Icon size={size} />;
    case 'SDG5':
      return <SDG5Icon size={size} />;
    case 'SDG6':
      return <SDG6Icon size={size} />;
    case 'SDG7':
      return <SDG7Icon size={size} />;
    case 'SDG8':
      return <SDG8Icon size={size} />;
    case 'SDG9':
      return <SDG9Icon size={size} />;
    case 'SDG10':
      return <SDG10Icon size={size} />;
    case 'SDG11':
      return <SDG11Icon size={size} />;
    case 'SDG12':
      return <SDG12Icon size={size} />;
    case 'SDG13':
      return <SDG13Icon size={size} />;
    case 'SDG14':
      return <SDG14Icon size={size} />;
    case 'SDG15':
      return <SDG15Icon size={size} />;
    case 'SDG16':
      return <SDG16Icon size={size} />;
    case 'SDG17':
      return <SDG17Icon size={size} />;
    default:
      return null;
  }
};
