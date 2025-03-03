import { BadgeProps, statusGeneralEnum, productsStatusEnum } from "@/types";

const Accepted = () => {
  return (
    <div className="flex px-2 text-nowrap  items-center gap-2 font-medium rounded-2xl p-1 w-fit bg-[#D0D5DD] text-[#344054]">
      <div className="w-2 h-2 bg-[#667085] rounded-full"></div>
      Aceptado
    </div>
  );
};

const AcceptedPlay = () => {  
  return (
    <div className="flex px-2 text-nowrap items-center gap-2 font-medium rounded-2xl p-1 w-fit bg-[#E0E4E9] text-[#3E4C59]">
      <div className="w-2 h-2 bg-[#7D8A91] rounded-full"></div>
      Aceptado PLAY
    </div>
  );
};


const NotAccepted = () => {
  return (
    <div className="flex px-2 text-nowrap  items-center gap-2 font-medium rounded-2xl p-1 w-fit bg-[#F5CECE] text-[#FF0303]">
      <div className="w-2 h-2 bg-[#FD0E0E] rounded-full"></div>
      No aceptado
    </div>
  );
};

const NotAvailable = () => {
  return (
    <div className="flex px-2 text-nowrap  items-center gap-2 font-medium rounded-2xl p-1 w-fit bg-[#FCFE99] text-[#000000]">
      <div className="w-2 h-2 bg-[#B3AC14] rounded-full"></div>
      No entregado
    </div>
  );
};

const CategoryNotApply = () => {
  return (
    <div className="flex px-2 text-nowrap  items-center gap-2 font-medium rounded-2xl p-1 w-fit bg-[#0D08FF] text-[#FFFFFF]">
      <div className="w-2 h-2 bg-[#FFFFFF] rounded-full"></div>
      No corresponde 
    </div>
  );
};

const SecondMark = () => {
  return (
    <div className="flex px-2 text-nowrap  items-center gap-2 font-medium rounded-2xl p-1 w-fit bg-[#BDE7FF] text-[#0D08FC]">
      <div className="w-2 h-2 bg-[#0D08FC] rounded-full"></div>
      Segunda marca
    </div>
  );
};

const PendingVerification = () => {
  return (
    <div className="flex px-2 text-nowrap  shadow  items-center gap-2 font-medium rounded-2xl p-1 w-fit bg-[#FFFFFF] text-[#000000]">
      <div className="w-2 h-2 bg-[#000000] rounded-full"></div>
      Pendiente
    </div>
  );
};

const Sold = () => {
  return (
    <div className="flex px-2 text-nowrap  items-center gap-2 font-medium rounded-2xl p-1 w-fit bg-[#ECFDF3] text-[#027A48]">
      <div className="w-2 h-2 bg-[#12B76A] rounded-full"></div>
      Vendido
    </div>
  );
};

const SoldOnClearance = () => {
  return (
    <div className="flex px-2 text-nowrap  items-center gap-2 font-medium rounded-2xl p-1 w-fit bg-primary-light text-[#027A48]">
      <div className="w-2 h-2 bg-[#12B76A] rounded-full"></div>
      Vendido en liquidación
    </div>
  );
};

const Unsold = () => {
  return (
    <div className="flex px-2 text-nowrap items-center gap-2 font-medium rounded-2xl p-1 w-fit bg-[#F5CECE] text-[#FF0303]">
      <div className="w-2 h-2 bg-[#FD0E0E] rounded-full"></div>
      No vendido
    </div>
  );
};

const Active = () => {
  return (
    <div className="flex px-2 text-nowrap items-center gap-2 font-medium rounded-2xl p-1 w-fit bg-[#ECFDF3] text-[#027A48]">
      <div className="w-2 h-2 bg-[#12B76A] rounded-full"></div>
      Activo
    </div>
  );
};

const Blocked = () => {
  return (
    <div className="flex px-2 text-nowrap items-center gap-2 font-medium rounded-2xl p-1 w-fit bg-[#F5CECE] text-[#FF0303]">
      <div className="w-2 h-2 bg-[#FD0E0E] rounded-full"></div>
      Bloqueado
    </div>
  );
};

const Inactive = () => {
  return (
    <div className="flex px-2 text-nowrap items-center gap-2 font-medium rounded-2xl p-1 w-fit bg-[#D0D5DD] text-[#344054]">
      <div className="w-2 h-2 bg-[#667085] rounded-full"></div>
      Inactivo
    </div>
  );
};

export const Badge: React.FC<BadgeProps> = ({ type }) => {
  switch (type) {
    case productsStatusEnum.accepted:
      return <Accepted />;
      case productsStatusEnum.acceptedPlay:
        return <AcceptedPlay />;      
    case productsStatusEnum.notAccepted:
      return <NotAccepted />;
    case productsStatusEnum.notAvailable:
      return <NotAvailable />;
    case productsStatusEnum.categoryNotApply:
      return <CategoryNotApply />;
    case productsStatusEnum.secondMark:
      return <SecondMark />;
    case productsStatusEnum.pendingVerification:
      return <PendingVerification />;
    case productsStatusEnum.sold:
      return <Sold />;
    case productsStatusEnum.soldOnClearance:
      return <SoldOnClearance />;
    case productsStatusEnum.unsold:
      return <Unsold />;
    case statusGeneralEnum.active:
      return <Active />;
    case statusGeneralEnum.blocked:
      return <Blocked />;
    case statusGeneralEnum.inactive:
      return <Inactive />;
    default:
      return null;
  }
};
