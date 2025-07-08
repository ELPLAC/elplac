import { ReactNode } from "react";

export enum formTypeEnum {
  login = "login",
  dashboard_user = "dashboard_user",
  fair = "fair",
  profile = "profile",
  products = "products",
}

export enum dashboardEnum {
  profile = "profile",
  fairs = "fairs",
  products = "products",
  changeType = "changeType",
}

export enum statusGeneralEnum {
  active = "active",
  inactive = "inactive",
  blocked = "blocked",
  no_active = "no_active",
}

export enum profilesEnum {
  admin = "admin",
  seller = "seller",
  user = "user",
}

export enum productsStatusEnum {
  accepted = "accepted",
  notAccepted = "notAccepted",
  notAvailable = "notAvailable",
  categoryNotApply = "categoryNotApply",
  secondMark = "secondMark",
  pendingVerification = "pendingVerification",
  sold = "sold",
  soldOnClearance = "soldOnClearance",
  unsold = "unsold",
  acceptedPlay = "acceptedPlay",
}

export enum ProductStatus {
  Pending = "pending",

  Checked = "checked",
}

export interface IProfileContact {
  formikUser: any;
  getPropsSeller: (name: string) => IInputProps;
  getPropsUser: (name: string) => IInputProps;
  formikSeller: any;
  edit?: boolean;
}

export interface IProduct {
  brand: string;
  description: string;
  price: number;
  size: string;
  id?: string;
  status: string;
  fairCategory: FairCategories;
  code: string;
}

export interface IProfilePayments {
  getPropsSellerPayments: (name: string) => IInputProps;
  formikSellerPayments: any;
  editSeller?: boolean;
  formikSeller: any;
  setEditSeller: (editseller: boolean) => void;
}

export interface IProfileSettings {
  getProps: (name: string) => IInputProps;
  formikPass: any;
}

export interface IProfileLeftFilters {
  dashBoardFilter: string;
  setDashBoardFilter: (filter: string) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleChangePhotoClick: () => void;
  userRole: string | undefined;
}

export interface IProfileImage {
  className?: string;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleChangePhotoClick: () => void;
}

export interface CalendarProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  fairDays?: FairDay[];
}

export interface IRegisterFormErrors {
  name?: string;
  lastname?: string;
  dni?: string;
  email?: string;
  phone?: string;
  address?: string;
  password?: string;
  confirmPassword?: string;
  social_media?: string;
}
export interface IDashboardUserErrors {
  name?: string;
  lastname?: string;
  email?: string;
  dni?: string;
}
export interface IDashboardSellerErrors extends IDashboardUserErrors {
  phone?: string;
  address?: string;
  social_media?: string;
}

export interface IHandleSelectProductStatus {
  id: string;
  status: string | productsStatusEnum;
}

export interface ILoginFormErrors {
  email?: string;
  password?: string;
}

export interface IForgotFormErrors {
  email?: string;
}

export interface ChooseRoleProps {
  email: string;
  userId: string;
}

export interface IUser {
  name: string;
  lastname: string;
  dni: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IDashboardUser {
  name: string;
  lastname: string;
  email: string;
  dni: string;
}

export interface IDashboardSeller extends IDashboardUser {
  phone: string;
  address: string;
  social_media: string;
}

export interface IDashboardSellerPayments {
  phone: string;
  address: string;
  social_media: string;
}

export interface ISeller {
  user?: IUser;
  name: string;
  lastname: string;
  dni: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
  social_media: string;
  id: string;
  sku?: string;
  status?: statusGeneralEnum;
  registrations?: SellerRegistrations[];
  liquidation?: boolean;
  products?: IProduct[];
}

export interface IInputProps {
  label?: string;
  formType?: formTypeEnum;
  value?: any | string | number | boolean;
  userType?: boolean;
  type?: string;
  placeholder?: string;
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  touched?: boolean;
  errors?: string;
  disabledUnique?: boolean;
  disabled?: boolean;
  edit?: boolean;
  missingFields?: string[];
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface ProductProps {
  id: number;
  brand: string;
  description: string;
  price: string | number;
  size: string;
  liquidation: string;
  status?: productsStatusEnum;
  ifUnsold?: productsStatusEnum;
}

export interface IForgot {
  email: string;
}

export interface IAuthContext {
  token: string;
  setToken: (token: string) => void;
  roleAuth: string;
  setRoleAuth: (roleAuth: string) => void;
  logout: () => void;
  loading: boolean;
}

export interface IAuthProviderProps {
  children: React.ReactNode;
}

export interface IOption {
  id: string;
  name: string;
}

export interface FairCategories {
  category: Category;
  maxSellers: number;
  maxProducts: number;
  products: IProduct[];
  id: string;
  maxProductsSeller: number;
  minProductsSeller: number;
  fair: IFair;
}

export interface Category {
  id?: string;
  name: string;
}

export interface BuyerCapacity {
  id: string;
  hour: string;
  capacity: number;
}

export interface FairDay {
  id: string;
  day: string;
  buyerCapacities: BuyerCapacity[];
  startTime?: string;
  endTime?: string;
  isClosed: boolean;
  timeSlotInterval?: number;
  capacityPerTimeSlot?: number;
}

export interface CategoryFair {
  id: string;
  maxProductsSeller: number;
  minProductsSeller: number;
  maxSellers: number;
  maxProducts: number;
  category: Category;
}

export interface SellerRegistrations {
  fair: IFair;
  categoryFair: CategoryFair;
  entryFee: number;
  id: string;
  registrationDate: string;
  seller: ISeller;
  liquidation?: boolean;
}

export interface UserRegistrations {
  entryfee: number;
  id: string;
  registrationDate: string;
  registrationDay: string;
  registrationHour: string;
}

export interface IFair {
  id: string;
  name: string;
  address: string;
  entryPriceSeller: number;
  isActive: boolean;
  entryPriceBuyer: string;
  isLabelPrintingEnabled: boolean;
  entryDescription: string;
  isVisibleUser: boolean;
  fairCategories: FairCategories[];
  fairDays: FairDay[];
  sellerRegistrations: SellerRegistrations[];
  userRegistrations: UserRegistrations[];
}

export interface IFairContainer {
  fair: IFair;
}

export interface IFairContext {
  fairs: IFair[];
  activeFair?: IFair | null;
  setActiveFair: (fair: IFair | null | undefined) => void;
  setDateSelect: (date: Date) => void;
  setTimeSelect: (time: string) => void;
  timeSelect: string;
  dateSelect: Date | null;
  fairSelected: Partial<IFair> | null;
  setFairSelected: (fairSelected: any) => void;
}

export interface IFairProviderProps {
  children: React.ReactNode;
}

export interface IRegisterProps {
  onUserTypeChange: (userType: boolean) => void;
  userType: boolean;
}

export interface UserDto {
  id: string;
  profile_picture?: string;
  name: string;
  lastname: string;
  email: string;
  dni: string;
  phone?: string;
  address?: string;
  credit_card?: string;
  userFairs?: string;
  social_media?: string;
  registration_date: Date;
  role: string;
  statusGeneral?: statusGeneralEnum;
  seller?: ISeller;
  registrations?: [PaymentsUserProps];
}

export interface PaymentsSellerProps {
  fairId: string | undefined;
  categoryId: string | undefined;
  userId?: string | undefined;
  handleBuy: () => void;
  className: string;
  disabled: boolean;
  fair?: IFair;
  categoryFair?: Category;
  liquidation?: string;
}

export interface PaymentsUserProps {
  id?: string;
  userId: string | undefined;
  fairId: string | undefined;
  registrationDate?: string | null | undefined;
  registrationHour: string | null | undefined;
  registrationDay: string | null | undefined;
  entryFee?: number;
  handleBuy: () => void;
  className: string;
  disabled: boolean;
  fair?: IFair;
}

export interface ModalProps {
  onCloseModal: () => void;
  message: string;
  className?: string;
  buttonApprove?: ReactNode;
  buttonCancel?: ReactNode;
}

export interface TicketProps {
  name: string | null | [];
  salesChecked?: string;
  category?: string | null;
  termsChecked?: boolean;
}

export interface ProfileFairsProps {
  selectedOption: string | null | [];
  fairs: (IFair | undefined)[];
  handleSelect: (option: DropdownOption) => void;
  fairFilter?: IFair;
}

export interface ProfileImageContextType {
  userDtos: UserDto | null;
  setUserDtos: React.Dispatch<React.SetStateAction<UserDto | null>>;
  profileImageChanged: boolean;
  setProfileImageChanged: React.Dispatch<React.SetStateAction<boolean>>;
  sellerDtos: ISeller | null;
  setSellerDtos: React.Dispatch<React.SetStateAction<ISeller | null>>;
}

export interface ProfileImageProviderProps {
  children: ReactNode;
}

export interface PlaceReview {
  author_name: string;
  profile_photo_url: string;
  rating: number;
  text: string;
}

export interface IPasswordChange {
  current_password: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface IPasswordChangeForgot {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface IPasswordChangeForgotErrors {
  current_password?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface IPasswordChangeErrors {
  current_password?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface IRegisterViewProps {
  userTypeParam: string;
}

export interface RegisterViewPageProps {
  params: Promise<{ userType: string; }> | undefined;
}

export interface ForgotPasswordProps {
  params: Promise<{ token?: string | undefined; }> | undefined;
}

export interface IForgotPasswordProps {
  token: string;
}

export interface DashboardProps {
  userDtos: UserDto;
}

export interface userDashboardProps {
  name: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  userDtos: UserDto;
}

export type DropdownOption = {
  id: string | productsStatusEnum;
  name: string;
};

export interface SellerGettingActiveFairProps {
  sellerId: string | undefined;
}

export type DropdownProps = {
  label?: string | [];
  options?: DropdownOption[];
  onSelect: (option: DropdownOption) => void;
  className?: string;
  value?: string | [];
  placeholder?: string;
  bg?: string;
  noId?: boolean;
  style?: React.CSSProperties;
};

export interface ISidebarProps {
  userRole?: string;
}

export interface IDashboardCardProps {
  title: string | React.ReactNode;
  typeEnum: dashboardEnum | "";
  description: string | React.ReactNode;
  message?: string | null;
  classname: string;
}

export interface UniqueData {
  userInfo: UserDto[];
  sellerInfo: ISeller[];
}
export interface Column {
  id: string;
  label: string;
  sortable: boolean;
}

export interface IDataTableProps {
  columns?: Column[];
  state?: DropdownOption;
  profiles?: DropdownOption;
  usersFiltered?: UserDto[];
  trigger: boolean;
  setTrigger: (newValue: boolean) => void;
  onUserClick: (user: UserDto) => void;
}
export interface IProductRequestTableProps {
  columns?: Column[];
  detailColumns?: Column[];
  state?: DropdownOption;
  profiles?: DropdownOption;
  products?: IProductNotification[];
  trigger?: boolean;
  activeFair?: IFair;
  setTrigger?: (newValue: boolean) => void;
}

export interface ISellerProductRequestTableProps {
  columns?: Column[];
  detailColumns?: Column[];
  state?: DropdownOption;
  profiles?: DropdownOption;
  activeFair?: IFair;
  sellerId: string | undefined;
}

export interface ProductsGettedBySellerId {
  id: string;
  brand: string;
  description: string;
  price: number;
  size: string;
  photoUrl: string;
  liquidation: boolean;
  code: string;
  status: productsStatusEnum;
  category: string;
}

export interface BadgeProps {
  type?: statusGeneralEnum | productsStatusEnum | string;
}

export interface SearchbarProps {
  users: UserDto[];
  setUsersFiltered: (users: UserDto[]) => void;
}

export interface ExcelDataProfiles {
  SKU: string;
  Rol?: string;
  Nombre?: string;
  FechaAlta?: string;
  Estado?: statusGeneralEnum;
  Categoria?: string;
  Precio?: number;
  Liquidacion?: boolean | string;
  EstadoFinal?: productsStatusEnum | string;
}

export interface ISellerNotification {
  id: string;
  social_media: string;
  phone: string;
  address: string;
  sku: string;
  status: statusGeneralEnum;
  user: IUser;
}

export interface IFairNotification {
  id: string;
  name: string;
  address: string;
  entryPriceSeller: number;
  entryPriceBuyer: number;
  entryDescription: string;
}

export interface IProductNotification {
  id: string;
  brand: string;
  description: string;
  price: number;
  size: string;
  seller: ISeller;
  liquidation: boolean;
  code: string;
  status: productsStatusEnum;
  fairCategory: FairCategories;
  ifUnsold: productsStatusEnum;
  fair?: IFair;
}

export interface Notification {
  id: string;
  category: string;
  status: ProductStatus;
  seller: ISellerNotification;
  fair: IFairNotification;
  products: IProductNotification[];
  message: string;
}

export interface WebSocketNotification {
  id: string;
  category: string;
  status: ProductStatus;
  seller: ISellerNotification;
  fair: IFairNotification;
  date: string;
  message: string;
  actions: string;
}

export interface NotificationsFromAdmin {
  sellerId: string;
  forAll: boolean;
  message: string;
  callToAction: string;

  product: {
    pRequestId: string;
    sellerId: string;
    status: productsStatusEnum;
  };
}

export interface IMainDashboardAdmin {
  children: ReactNode;
}

export interface NotificationFromBack {
  message: string;
  id: string;
  category: string;
  sellerId: string;
  pRequestId: string;
  status: productsStatusEnum;
}

export interface handleSelectProps {
  role: string;
  id: string;
}

export interface LoadingContextProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export interface SelectedOption {
  name: string;
}

export interface WithAuthProtectProps {
  Component: React.FC<any>;
  role?: string;
  registrations?: SellerRegistrations[];
}
export interface FairDto {
  name: string;
  address: string;
  entryPriceSeller: number;
  entryPriceBuyer: number;
  entryDescription: string;
  fairCategories: {
    maxProductsSeller: number;
    minProductsSeller: number;
    maxSellers: number;
    maxProducts: number;
    category: { name: string };
    products?: IProduct[];
  }[];
  fairDays: {
    day: string;
    startTime?: string;
    endTime?: string;
    isClosed: boolean;
    capacityPerTimeSlot?: number;
    timeSlotInterval?: number;
  }[];
}

export interface FairDaysData {
  day: string;
  startTime?: string;
  endTime?: string;
  isClosed: boolean;
  capacityPerTimeSlot?: number;
  timeSlotInterval?: number;
}

export interface FairDays {
  day: string;
  startTime?: string;
  endTime?: string;
  isClosed: boolean;
  capacityPerTimeSlot?: number;
  timeSlotInterval?: number;
}

export type HandleSelectType = (selectedOption: string) => void;

export interface StepProps {
  setVisibleStep: (step: string) => void;
}

export interface PrintLabelProps {
  sellerId: string | undefined;
}

export interface CategoryData {
  name: string;
  maxProductsSeller: string;
  minProductsSeller: string;
  maxSellers: string;
  maxProducts: string;
}

export type CategoryDataField =
  | "name"
  | "maxProductsSeller"
  | "minProductsSeller"
  | "maxSellers"
  | "maxProducts";

export type CategoryKey =
  | "youngMan"
  | "youngWoman"
  | "man"
  | "woman"
  | "adults"
  | "booksToys"
  | "booksToysWater"
  | "deco"
  | "backToSchool"
  | "entrepreneurs"
  | "others";

export interface CategoryArray {
  youngMan: string;
  youngWoman: string;
  man: string;
  woman: string;
  adults: string;
  booksToys: string;
  booksToysWater: string;
  deco: string;
  backToSchool: string;
  entrepreneurs: string;
  others: string;
}

export type IsCheckedType = {
  youngMan: boolean;
  youngWoman: boolean;
  man: boolean;
  woman: boolean;
  adults: boolean;
  booksToys: boolean;
  booksToysWater: boolean;
  deco: boolean;
  backToSchool: boolean;
  entrepreneurs: boolean;
  others: boolean;
};
