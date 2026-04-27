import Image from 'next/image';
import noTripFoundSVG from '../../../public/noTripFound.svg';

export default function NotFoundSVG() {
    return (
        <Image
            src={noTripFoundSVG}
            alt="No trip found"
            width={200}
            height={200}
        />
    );
}