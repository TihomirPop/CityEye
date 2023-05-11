import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import '../../styles/Problems.css'
import { storage } from "../../config/Firebase";

import LoadingGif from '../assets/loading.gif';

interface Props{
    img: string;
    className: string;
    onClick: () => void;
}

function Image({img, className, onClick}: Props) {
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        getDownloadURL(ref(storage, 'images/' + img)).then(url => {
            setImageUrl(url);
        })
    }, [img]);

    return (
        <img onClick={() => onClick()} className={className} alt={imageUrl} src={imageUrl.length > 0 ? imageUrl : LoadingGif} />
    )
}
export default Image;