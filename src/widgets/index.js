import ButtonWidget from './ButtonWidget';
import InputWidget from './InputWidget';
import TextareaWidget from './TextareaWidget';
import ComboboxWidget from './ComboboxWidget';
import CheckboxWidget from './CheckboxWidget';
import RadioWidget from './RadioWidget';
import LabelWidget from './LabelWidget';
import HeadingWidget from './HeadingWidget';
import DividerWidget from './DividerWidget';
import ImageWidget from './ImageWidget';
import ToggleWidget from './ToggleWidget';
import SliderWidget from './SliderWidget';
import CardWidget from './CardWidget';
import NavWidget from './NavWidget';

export const widgetRegistry = {
  button: ButtonWidget,
  input: InputWidget,
  textarea: TextareaWidget,
  combobox: ComboboxWidget,
  checkbox: CheckboxWidget,
  radio: RadioWidget,
  label: LabelWidget,
  heading: HeadingWidget,
  divider: DividerWidget,
  image: ImageWidget,
  toggle: ToggleWidget,
  slider: SliderWidget,
  card: CardWidget,
  nav: NavWidget,
};
