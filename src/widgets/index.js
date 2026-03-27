import ButtonWidget from './ButtonWidget';
import InputWidget from './InputWidget';
import PasswordWidget from './PasswordWidget';
import TextareaWidget from './TextareaWidget';
import ComboboxWidget from './ComboboxWidget';
import SpinBoxWidget from './SpinBoxWidget';
import DatePickerWidget from './DatePickerWidget';
import CheckboxWidget from './CheckboxWidget';
import RadioWidget from './RadioWidget';
import ToggleWidget from './ToggleWidget';
import SliderWidget from './SliderWidget';
import ProgressBarWidget from './ProgressBarWidget';
import LabelWidget from './LabelWidget';
import HeadingWidget from './HeadingWidget';
import BadgeWidget from './BadgeWidget';
import AvatarWidget from './AvatarWidget';
import AlertWidget from './AlertWidget';
import DividerWidget from './DividerWidget';
import ImageWidget from './ImageWidget';
import NavWidget from './NavWidget';
import MenuBarWidget from './MenuBarWidget';
import TabBarWidget from './TabBarWidget';
import BreadcrumbWidget from './BreadcrumbWidget';
import StatusBarWidget from './StatusBarWidget';
import CardWidget from './CardWidget';
import GroupBoxWidget from './GroupBoxWidget';
import ListWidget from './ListWidget';
import TableWidget from './TableWidget';

export const widgetRegistry = {
  button: ButtonWidget,
  input: InputWidget,
  password: PasswordWidget,
  textarea: TextareaWidget,
  combobox: ComboboxWidget,
  spinbox: SpinBoxWidget,
  datepicker: DatePickerWidget,
  checkbox: CheckboxWidget,
  radio: RadioWidget,
  toggle: ToggleWidget,
  slider: SliderWidget,
  progressbar: ProgressBarWidget,
  label: LabelWidget,
  heading: HeadingWidget,
  badge: BadgeWidget,
  avatar: AvatarWidget,
  alert: AlertWidget,
  divider: DividerWidget,
  image: ImageWidget,
  nav: NavWidget,
  menubar: MenuBarWidget,
  tabbar: TabBarWidget,
  breadcrumb: BreadcrumbWidget,
  statusbar: StatusBarWidget,
  card: CardWidget,
  groupbox: GroupBoxWidget,
  list: ListWidget,
  table: TableWidget,
};
