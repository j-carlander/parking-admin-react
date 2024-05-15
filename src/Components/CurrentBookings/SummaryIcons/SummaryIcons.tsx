import { FlightBookingDTO, HourBookingDTO } from "parking-sdk";
import ChildCareIcon from '@mui/icons-material/ChildCare';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import GarageIcon from '@mui/icons-material/Garage';
import LocalCarWashIcon from '@mui/icons-material/LocalCarWash';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import WorkIcon from '@mui/icons-material/Work';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

type SummaryIconsProps = {
    group: FlightBookingDTO | HourBookingDTO;
}

export function SummaryIcons({group}:SummaryIconsProps){
const isArrival = 'flightNumber' in group; // Check if current group is for arriving customers, type FlightBookingDTO

    return (
        <div className="summary-icons">
            <ChildCareIcon className={group.bookings?.some(booking => booking.childSafetySeat) ? 'active-icon': ''}/>
            <CreditCardIcon className={group.bookings?.some(booking => booking.amountToPay && booking.amountToPay > 0) ? 'active-icon': ''} />
            <GarageIcon className={group.bookings?.some(booking => booking.resource?.label === 'Garage') ? 'active-icon': ''}/>
            <LocalCarWashIcon className={group.bookings?.some(booking => booking.carWash) ? 'active-icon': ''} />
            {isArrival ? <BusinessCenterIcon className={group.bookings?.some(booking => booking.handLuggageOnly) ? 'active-icon': ''} /> : null}
            {isArrival ? <WorkIcon className={group.firstBagDate || group.lastBagDate ? 'active-icon':''} /> : null}
            <ChatBubbleIcon className={group.bookings?.some(booking => booking.comment) ? 'active-icon':''} />
        </div>
    )
}